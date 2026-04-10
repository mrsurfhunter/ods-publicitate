export async function saveOrderToServer(order) {
  try {
    const r = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    return r.ok;
  } catch {
    return false;
  }
}

export async function fetchOrdersByEmail(email) {
  try {
    const r = await fetch("/api/orders?email=" + encodeURIComponent(email));
    if (!r.ok) return [];
    return await r.json();
  } catch {
    return [];
  }
}
