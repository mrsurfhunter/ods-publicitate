import { WP } from "../data/packages";

export async function wpUploadImage(file) {
  if (!WP.user || !WP.pass) return null;
  const fd = new FormData();
  fd.append("file", file, file.name);
  try {
    const r = await fetch(WP.url + WP.rest + "/media", {
      method: "POST",
      headers: { Authorization: "Basic " + btoa(WP.user + ":" + WP.pass) },
      body: fd,
    });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const d = await r.json();
    return { id: d.id, url: d.source_url };
  } catch (e) {
    console.error("WP upload:", e);
    return null;
  }
}

export async function wpCreateDraft(data) {
  if (!WP.user || !WP.pass) return { success: false, error: "no-config" };
  try {
    let catId = null;
    try {
      const cr = await fetch(WP.url + WP.rest + "/categories?slug=advertorial", {
        headers: { Authorization: "Basic " + btoa(WP.user + ":" + WP.pass) },
      });
      const cats = await cr.json();
      if (cats.length > 0) catId = cats[0].id;
    } catch {}
    const body = {
      title: data.title,
      content: data.content,
      status: "draft",
      categories: catId ? [catId] : [],
    };
    if (data.featuredImage) body.featured_media = data.featuredImage;
    body.content = '<!-- wp:paragraph --><p><em>Publicitate</em></p><!-- /wp:paragraph -->' + body.content;
    const r = await fetch(WP.url + WP.rest + "/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Basic " + btoa(WP.user + ":" + WP.pass) },
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const res = await r.json();
    return { success: true, id: res.id, link: res.link };
  } catch (e) {
    return { success: false, error: e.message };
  }
}
