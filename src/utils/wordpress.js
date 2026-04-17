export async function wpUploadImage(file) {
  const fd = new FormData();
  fd.append("file", file, file.name);
  try {
    const r = await fetch("/api/wp/upload", { method: "POST", body: fd });
    if (!r.ok) throw new Error("HTTP " + r.status);
    return await r.json();
  } catch (e) {
    console.error("WP upload:", e);
    return null;
  }
}

export async function wpCreateDraft(data) {
  try {
    const r = await fetch("/api/wp/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!r.ok) throw new Error("HTTP " + r.status);
    return await r.json();
  } catch (e) {
    return { success: false, error: e.message };
  }
}
