// Admin push notifications via OneSignal. The REST API key stays server-side
// (Pages secret ONESIGNAL_REST_API_KEY, Preview env). Auth: caller must send a
// GitHub token (Authorization: Bearer ...) that has push access to the site repo,
// the same token the admin page already stores for saving overrides.
const REPO = "alselselah7-ai/alghanna-tv";
const APP_ID = "02173c89-7ed7-4028-b09d-308822d8b492";

function json(obj, status) {
  return new Response(JSON.stringify(obj), { status: status || 200, headers: { "Content-Type": "application/json" } });
}

async function sendWithSegments(key, payload, segment) {
  const body = Object.assign({}, payload, { included_segments: [segment] });
  const r = await fetch("https://api.onesignal.com/notifications?c=push", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Key " + key },
    body: JSON.stringify(body)
  });
  const data = await r.json().catch(() => ({}));
  return { ok: r.ok && !data.errors, status: r.status, data };
}

export async function onRequestPost(context) {
  const { request, env } = context;
  let body;
  try { body = await request.json(); } catch (e) { return json({ ok: false, error: "bad_json" }, 400); }
  const title = (body.title || "").toString().trim().slice(0, 120);
  const message = (body.message || "").toString().trim().slice(0, 500);
  const link = (body.url || "").toString().trim().slice(0, 300);
  if (!title || !message) return json({ ok: false, error: "missing_fields" }, 400);

  const auth = request.headers.get("authorization") || "";
  if (!/^Bearer\s+\S+/.test(auth)) return json({ ok: false, error: "no_token" }, 401);
  try {
    const gh = await fetch("https://api.github.com/repos/" + REPO, {
      headers: { Authorization: auth, Accept: "application/vnd.github+json", "User-Agent": "alghanna-push-fn" }
    });
    if (!gh.ok) return json({ ok: false, error: "bad_token" }, 401);
    const repo = await gh.json();
    if (!repo.permissions || repo.permissions.push !== true) return json({ ok: false, error: "forbidden" }, 403);
  } catch (e) { return json({ ok: false, error: "auth_check_failed" }, 502); }

  if (!env.ONESIGNAL_REST_API_KEY) return json({ ok: false, error: "server_not_configured" }, 500);

  const payload = {
    app_id: APP_ID,
    target_channel: "push",
    headings: { en: title, ar: title },
    contents: { en: message, ar: message }
  };
  if (/^https:\/\//.test(link)) payload.url = link;

  let res = await sendWithSegments(env.ONESIGNAL_REST_API_KEY, payload, "Subscribed Users");
  if (!res.ok && JSON.stringify(res.data).indexOf("egment") !== -1) {
    res = await sendWithSegments(env.ONESIGNAL_REST_API_KEY, payload, "Total Subscriptions");
  }
  if (!res.ok) return json({ ok: false, error: "onesignal_error", status: res.status, detail: res.data.errors || res.data }, 502);
  return json({ ok: true, id: res.data.id || null, recipients: res.data.recipients != null ? res.data.recipients : null });
}

export async function onRequestGet() {
  return json({ ok: false, error: "method_not_allowed" }, 405);
}
