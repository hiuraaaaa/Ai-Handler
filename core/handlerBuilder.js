import { callAI } from "./aiRefactor.js";

export function buildAIHandler() {
  return async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    try {
      const { text, systemPrompt, sessionId } = req.body || {};

      if (!text) throw new Error("text wajib diisi");

      const result = await callAI(
        text,
        systemPrompt || "default-system",
        sessionId || Date.now().toString()
      );

      return res.json({
        ok: true,
        result: result.result,
        timestamp: result.timestamp,
        responseTime: result.responseTime
      });

    } catch (err) {
      console.error("Handler Error:", err.message);

      return res.status(500).json({
        ok: false,
        error: err.message || "Internal handler error"
      });
    }
  };
}
