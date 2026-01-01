import axios from "axios";

export async function aiGenerateHandler(promptText) {
  const res = await axios.get(
    "https://api.nekolabs.web.id/text.gen/gpt/5",
    {
      params: {
        text: promptText,
        systemPrompt:
          "Kamu adalah AI pembuat handler JavaScript siap pakai, modular, async/await, error handling wajib.",
        sessionId: Date.now().toString()
      }
    }
  );

  if (!res.data?.success)
    throw new Error("AI gagal memproses prompt");

  return res.data.result;
}
