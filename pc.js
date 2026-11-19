// Small helper on your own website (Vercel: put this file at /api/pc.js).
// It asks Google for the data on the server side, so the browser never has to
// talk to Google directly (this avoids blocked requests).
const BASE = "https://script.google.com/macros/s/AKfycbzCU-bTOaahc26zlf5UMWfSN-BpRfJ3NXbMwdec0mT1zKO9_G6GqeSwxlaeBAwOBiQd/exec";

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    const i = req.url.indexOf("?");
    const qs = i >= 0 ? req.url.slice(i) : "";
    let init = { redirect: "follow" };
    if (req.method === "POST") {
      const body = typeof req.body === "string" ? req.body : JSON.stringify(req.body || {});
      init = { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body, redirect: "follow" };
    } else if (req.method !== "GET") {
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }
    const r = await fetch(BASE + qs, init);
    const text = await r.text();
    // Google returns an HTML sign-in page when access is not set to "Anyone".
    const t = text.trim();
    if (t[0] !== "{" && t[0] !== "[") {
      return res.status(502).json({ ok: false, error: "Google did not return data. Set the Web App access to Anyone and redeploy." });
    }
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(200).send(text);
  } catch (e) {
    res.status(502).json({ ok: false, error: String(e) });
  }
};
