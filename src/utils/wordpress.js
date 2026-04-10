// WordPress operations now proxied through our server (credentials stay server-side)

export async function wpUploadImage(file) {
  const fd = new FormData();
  fd.append("file", file, file.name);
  try {
    const r = await fetch("/api/wp/media", {
      method: "POST",
      body: fd,
    });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const d = await r.json();
    return { id: d.id, url: d.url };
  } catch (e) {
    console.error("WP upload:", e);
    return null;
  }
}

export async function wpCreateDraft(data) {
  try {
    const r = await fetch("/api/wp/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.title,
        content: data.content,
        featuredImage: data.featuredImage || null,
      }),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      if (err.error === "no-config") return { success: false, error: "no-config" };
      throw new Error("HTTP " + r.status);
    }
    return await r.json();
  } catch (e) {
    return { success: false, error: e.message };
  }
}
