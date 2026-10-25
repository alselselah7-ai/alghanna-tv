#!/usr/bin/env node
// مزامنة قوائم تشغيل قناة الغنّاء من YouTube Data API v3 (تعمل على الخادم فقط).
// التشغيل:  YOUTUBE_API_KEY=xxxx node sync-playlists.mjs [--html ../alghanna-tv.html]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HANDLE = process.env.YT_HANDLE || "@alghannachannel6146";
const EXPECTED_CHANNEL_ID = "UCBckgHr1PZLl1SML8eCWoIA"; // للتحقق فقط
const API = process.env.YT_API_BASE || "https://www.googleapis.com/youtube/v3";
const DIR = path.dirname(fileURLToPath(import.meta.url));
const DB = path.join(DIR, "playlists.json");
const DEFAULT_SECTION = "برامج القناة"; // قسم موجود أصلًا في الموقع
const MAX_UPLOADS = Number(process.env.MAX_UPLOADS || 1500); // أقصى عدد فيديوهات تُفحص لحساب الأحدث والأكثر مشاهدة
const PER_PLAYLIST = 60; // أقصى فيديوهات تُجلب لكل قائمة
const KEY = process.env.YOUTUBE_API_KEY;

function fail(msg) { console.error("✖ " + msg); process.exit(1); }
if (!KEY) fail("المتغير YOUTUBE_API_KEY غير مضبوط. أنشئ مفتاحًا من Google Cloud (YouTube Data API v3) وضعه في بيئة الخادم، ولا تضعه في الكود أو المستودع.");

async function call(endpoint, params, soft) {
  const url = new URL(`${API}/${endpoint}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set("key", KEY);
  let res;
  try { res = await fetch(url); } catch (e) { if (soft) return null; fail(`تعذّر الاتصال بـ YouTube API (شبكة/DNS): ${e.message}`); }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (soft) return null;
    const e = body.error || {};
    const reason = (e.errors && e.errors[0] && e.errors[0].reason) || e.status || res.status;
    const hints = {
      keyInvalid: "المفتاح غير صحيح.",
      quotaExceeded: "انتهت حصة اليوم (10,000 وحدة). أعد المحاولة بعد منتصف الليل بتوقيت المحيط الهادئ.",
      accessNotConfigured: "فعّل YouTube Data API v3 في مشروع Google Cloud.",
      forbidden: "المفتاح مقيّد ولا يسمح بهذا الطلب (راجع قيود المفتاح).",
      ipRefererBlocked: "قيود IP/Referer على المفتاح تمنع هذا الخادم.",
    };
    fail(`خطأ من YouTube API (${res.status} / ${reason}): ${e.message || ""} ${hints[reason] || ""}`);
  }
  return body;
}

// 1) معرّف القناة من الـ handle
const ch = await call("channels", { part: "id,contentDetails", forHandle: HANDLE });
if (!ch.items || !ch.items.length) fail(`لم يُعثر على قناة بالـ handle ${HANDLE}.`);
const channelId = ch.items[0].id;
const uploadsId = (((ch.items[0].contentDetails || {}).relatedPlaylists) || {}).uploads;
if (channelId !== EXPECTED_CHANNEL_ID) console.warn(`⚠ معرّف القناة ${channelId} يختلف عن المتوقع ${EXPECTED_CHANNEL_ID}.`);

// 2) كل القوائم العامة مع الترقيم عبر nextPageToken
const fetched = [];
let pageToken, pages = 0;
do {
  const p = { part: "snippet,contentDetails,status", channelId, maxResults: "50" };
  if (pageToken) p.pageToken = pageToken;
  const r = await call("playlists", p);
  pages++;
  for (const it of r.items || []) {
    if (it.status && it.status.privacyStatus !== "public") continue;
    const th = it.snippet.thumbnails || {};
    const best = th.maxres || th.standard || th.high || th.medium || th.default || {};
    fetched.push({
      order: fetched.length, // ترتيب الواجهة
      playlistId: it.id,
      title: it.snippet.title,
      description: it.snippet.description || "",
      thumbnail: best.url || "",
      videoCount: (it.contentDetails && it.contentDetails.itemCount) || 0,
      playlistUrl: `https://www.youtube.com/playlist?list=${it.id}`,
    });
  }
  pageToken = r.nextPageToken;
} while (pageToken);

// ترتيب القناة الفعلي من أقسام صفحة القناة (إن وُجدت)؛ وإلا يبقى ترتيب playlists.list
const secs = await call("channelSections", { part: "snippet,contentDetails", channelId }, true);
if (secs && secs.items) {
  const ids = [];
  secs.items.slice().sort((a, b) => ((a.snippet || {}).position || 0) - ((b.snippet || {}).position || 0))
    .forEach((s) => ((s.contentDetails || {}).playlists || []).forEach((id) => { if (!ids.includes(id)) ids.push(id); }));
  if (ids.length) {
    const rank = new Map(ids.map((id, i) => [id, i]));
    fetched.forEach((f) => { f.order = rank.has(f.playlistId) ? rank.get(f.playlistId) : 1000 + f.order; });
    console.log(`✔ طُبّق ترتيب أقسام القناة على ${ids.length} قائمة`);
  }
}

if (!fetched.length) fail("لم تُرجع الواجهة أي قائمة عامة. لم أعدّل playlists.json حفاظًا على بياناتك.");


// 3.5) الفيديوهات: كل قائمة + الأحدث + الأكثر مشاهدة (أخطاؤها لا توقف المزامنة ولا تمسح ما سبق)
const VDB = path.join(DIR, "videos.json");
let prevV = { newest: [], top: [], by: {} };
if (fs.existsSync(VDB)) try { prevV = JSON.parse(fs.readFileSync(VDB, "utf8")); } catch {}
async function listItems(plId, cap) {
  const out = []; let tok;
  do {
    const r = await call("playlistItems", { part: "snippet,contentDetails", playlistId: plId, maxResults: "50", ...(tok ? { pageToken: tok } : {}) }, true);
    if (!r) return out.length ? out : null;
    for (const it of r.items || []) {
      const id = it.contentDetails && it.contentDetails.videoId, t = it.snippet && it.snippet.title;
      if (!id || t === "Private video" || t === "Deleted video") continue;
      out.push({ id, t, at: (it.contentDetails.videoPublishedAt || it.snippet.publishedAt || "") });
      if (out.length >= cap) return out;
    }
    tok = r.nextPageToken;
  } while (tok);
  return out;
}
const vdb = { syncedAt: new Date().toISOString(), newest: prevV.newest || [], top: prevV.top || [], lives: prevV.lives || [], by: {} };
let vNotes = [];
const ups = uploadsId ? await listItems(uploadsId, MAX_UPLOADS) : null;
if (ups && ups.length) {
  const stats = new Map();
  for (let i = 0; i < ups.length; i += 50) {
    const r = await call("videos", { part: "statistics,status,liveStreamingDetails", id: ups.slice(i, i + 50).map((x) => x.id).join(",") }, true);
    for (const v of (r && r.items) || []) stats.set(v.id, v);
  }
  const ok = ups.filter((x) => { const v = stats.get(x.id); return v && (!v.status || (v.status.privacyStatus === "public" && v.status.embeddable !== false)); })
    .map((x) => ({ id: x.id, t: x.t, at: x.at, w: Number(((stats.get(x.id).statistics) || {}).viewCount || 0), lv: !!((stats.get(x.id).liveStreamingDetails || {}).actualStartTime) }));
  vdb.newest = ok.slice().sort((a, b) => b.at.localeCompare(a.at)).slice(0, 20);
  vdb.top = ok.slice().sort((a, b) => b.w - a.w).slice(0, 20);
  vdb.lives = ok.filter((x) => x.lv).sort((a, b) => b.at.localeCompare(a.at)).slice(0, 40);
  vNotes.push(`${ok.length} فيديو مفحوص`);
} else console.warn("⚠ تعذّر جلب الفيديوهات المرفوعة؛ أُبقيت بيانات الأحدث/الأكثر مشاهدة السابقة.");
let plFail = 0;
for (const f of fetched) {
  const r = await listItems(f.playlistId, PER_PLAYLIST);
  if (r && r.length) vdb.by[f.playlistId] = r.map((x) => ({ id: x.id, t: x.t, at: (x.at || "").slice(0, 10) }));
  else { if (prevV.by && prevV.by[f.playlistId]) vdb.by[f.playlistId] = prevV.by[f.playlistId]; plFail++; }
}
fs.writeFileSync(VDB, JSON.stringify(vdb) + "\n");
console.log(`✔ فيديوهات: ${Object.keys(vdb.by).length} قائمة، ${vdb.newest.length} أحدث، ${vdb.top.length} الأكثر مشاهدة ${vNotes.join(" | ")}${plFail ? " | قوائم بلا فيديوهات: " + plFail : ""}`);

// 3) الدمج: تحديث حقول يوتيوب فقط، والحفاظ على التصنيف اليدوي، بلا تكرار ولا حذف
let db = { channelId, syncedAt: null, playlists: [] };
if (fs.existsSync(DB)) db = JSON.parse(fs.readFileSync(DB, "utf8"));
const byId = new Map(db.playlists.map((x) => [x.playlistId, x]));
let added = 0, updated = 0;
const seen = new Set();
for (const f of fetched) {
  seen.add(f.playlistId);
  const old = byId.get(f.playlistId);
  if (old) { Object.assign(old, f, { missing: false }); updated++; }
  else { db.playlists.push({ ...f, section: null, hidden: false, missing: false }); added++; }
}
let missing = 0;
for (const x of db.playlists) if (!seen.has(x.playlistId)) { x.missing = true; missing++; }
db.channelId = channelId;
db.syncedAt = new Date().toISOString();
fs.writeFileSync(DB, JSON.stringify(db, null, 2) + "\n");
console.log(`✔ ${fetched.length} قائمة عامة في ${pages} صفحة نتائج | جديد: ${added} | محدّث: ${updated} | غير موجود الآن: ${missing}`);

// 4) اختياري: حقن القوائم في صفحة الموقع بين العلامتين
const hi = process.argv.indexOf("--html");
if (hi > -1) {
  const file = path.resolve(DIR, process.argv[hi + 1] || "");
  let html = fs.readFileSync(file, "utf8");
  const re = /\/\*YT_PLAYLISTS\*\/[\s\S]*?\/\*END_YT\*\//;
  if (!re.test(html)) fail("لم أجد العلامتين /*YT_PLAYLISTS*/ و /*END_YT*/ في ملف HTML.");
  const out = db.playlists.filter((x) => !x.hidden && !x.missing)
    .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
    .map((x) => ({ o: x.order ?? 9999, id: x.playlistId, t: x.title, n: x.videoCount, img: x.thumbnail, sec: x.section || null }));
  html = html.replace(re, () => `/*YT_PLAYLISTS*/${JSON.stringify(out).replace(/</g, "\\u003c")}/*END_YT*/`);
  const reV = /\/\*YT_VIDEOS\*\/[\s\S]*?\/\*END_YTV\*\//;
  if (reV.test(html)) {
    const hid = new Set(db.playlists.filter((x) => x.hidden || x.missing).map((x) => x.playlistId));
    const by = {}; for (const [k, v] of Object.entries(vdb.by)) if (!hid.has(k)) by[k] = v;
    const payload = JSON.stringify({ newest: vdb.newest, top: vdb.top, lives: vdb.lives, by }).replace(/</g, "\\u003c");
    html = html.replace(reV, () => `/*YT_VIDEOS*/${payload}/*END_YTV*/`);
  } else console.warn("⚠ لا توجد علامة /*YT_VIDEOS*/ في الصفحة؛ لم تُحقن الفيديوهات.");
  fs.writeFileSync(file, html);
  console.log(`✔ حُقنت ${out.length} قائمة في ${path.basename(file)}`);
}
