import { aiGenerateHandler } from "../core/aiRefactor.js";
import { saveGeneratedHandler } from "../core/handlerBuilder.js";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Only POST allowed"
    });
  }

  try {
    // --- Normalisasi body (antisipasi body = string) ---
    let body = req.body;

    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Body harus JSON valid"
        });
      }
    }

    const { name, description, mode = "logic" } = body || {};

    // --- Validasi input wajib ---
    if (!name?.trim() || !description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "name & description wajib diisi"
      });
    }

    const prompt = `
Buatkan handler JavaScript siap pakai.
Mode: ${mode}

Deskripsi:
${description}

Syarat:
- async/await
- error handling
- tanpa komentar penjelasan, hanya kode siap pakai
`;

    const aiCode = await aiGenerateHandler(prompt);

    const filePath = saveGeneratedHandler(name.trim(), aiCode);

    return res.status(200).json({
      success: true,
      name: name.trim(),
      filePath,
      preview: aiCode
    });

  } catch (err) {
    console.error("Generator Error:", err);

    return res.status(500).json({
      success: false,
      message: err?.message || "Internal generator error"
    });
  }
}
