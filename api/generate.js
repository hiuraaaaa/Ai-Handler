import { aiGenerateHandler } from "../core/aiRefactor.js";
import { saveGeneratedHandler } from "../core/handlerBuilder.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ success: false, message: "Only POST allowed" });

  try {
    const { name, description, mode = "logic" } = req.body;

    if (!name || !description)
      return res.status(400).json({
        success: false,
        message: "name & description wajib diisi"
      });

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

    const filePath = saveGeneratedHandler(name, aiCode);

    return res.json({
      success: true,
      name,
      filePath,
      preview: aiCode
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}
