import { callAI } from "./aiRefactor.js";

export function buildAIHandler() {
  return async function handler(req, res) {

    if (req.method !== "POST") {
      return res.status(405).json({
        ok: false,
        error: "Method not allowed"
      });
    }

    try {
     
      let body = req.body;

      
      if (typeof body === "string") {
        try {
          body = JSON.parse(body);
        } catch {
          return res.status(400).json({
            ok: false,
            error: "Body harus JSON valid"
          });
        }
      }

      const { text, systemPrompt, sessionId } = body || {};

      
      if (!text || !text.trim()) {
        return res.status(400).json({
          ok: false,
          error: "text wajib diisi"
        });
      }

      const start = Date.now();

      const result = await callAI(
        text.trim(),
        systemPrompt?.trim() || "default-system",
        sessionId?.toString() || Date.now().toString()
      );

      const end = Date.now();

      return res.status(200).json({
        ok: true,
        result: result?.result ?? result,
        timestamp: result?.timestamp ?? new Date().toISOString(),
        responseTime: result?.responseTime ?? `${end - start}ms`
      });

    } catch (err) {
      console.error("Handler Error:", err);

      return res.status(500).json({
        ok: false,
        error: err?.message || "Internal handler error"
      });
    }
  };
}
