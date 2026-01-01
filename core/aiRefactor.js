export async function callAI(text, systemPrompt, sessionId) {
  const url =
    `https://api.nekolabs.web.id/text.gen/gpt/5` +
    `?text=${encodeURIComponent(text)}` +
    `&systemPrompt=${encodeURIComponent(systemPrompt)}` +
    `&sessionId=${encodeURIComponent(sessionId)}`;

  const res = await fetch(url);

  const raw = await res.text(); // baca raw dulu

  // API error di Vercel sering berupa HTML → cegah JSON.parse crash
  if (!raw.trim().startsWith("{")) {
    console.error("RAW RESPONSE (bukan JSON):\n", raw);
    throw new Error("AI API tidak mengembalikan JSON (kemungkinan server error)");
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error("JSON parse gagal:\n", raw);
    throw new Error("Response AI tidak valid JSON");
  }

  if (!data.success) {
    throw new Error(data.message || "AI API gagal memproses request");
  }

  return data;
}
