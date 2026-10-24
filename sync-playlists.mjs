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
const KEY = process.env.YOUTUBE_API_KEY;

function fail(msg) { console.error("✖ " + msg); process.exit(1); }
if (!KEY) fail("المتغير YOUTUBE_API_KEY غير مضبوط. أنشئ مفتاحًا من Google Cloud (YouTube Data API v3) وضعه في بيئة الخادم، ولا تضعه في الكود أو المستودع.");

async function call(endpoint, params) {
  const url = new URL(`${API}/${endpoint}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set("key", KEY);
  let res;
  try { res = await fetch(url); } catch (e) { fail(`تعذّر الاتصال بـ YouTube API (شبكة/DNS): ${e.message}`); }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
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
const ch = await call("channels", { part: "id", forHandle: HANDLE });
if (!ch.items || !ch.items.length) fail(`لم يُعثر على قناة بالـ handle ${HANDLE}.`);
const channelId = ch.items[0].id;
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

if (!fetched.length) fail("لم تُرجع الواجهة أي قائمة عامة. لم أعدّل playlists.json حفاظًا على بياناتك.");

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
    .map((x) => ({ id: x.playlistId, t: x.title, n: x.videoCount, img: x.thumbnail, sec: x.section || DEFAULT_SECTION }));
  html = html.replace(re, () => `/*YT_PLAYLISTS*/${JSON.stringify(out).replace(/</g, "\\u003c")}/*END_YT*/`);
  fs.writeFileSync(file, html);
  console.log(`✔ حُقنت ${out.length} قائمة في ${path.basename(file)}`);
}
