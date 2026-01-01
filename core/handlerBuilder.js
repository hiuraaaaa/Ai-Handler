import fs from "fs";
import path from "path";

const GENERATED_DIR = "handlers/generated";

if (!fs.existsSync(GENERATED_DIR)) {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
}

export function saveGeneratedHandler(name, code) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const filePath = path.join(GENERATED_DIR, `${slug}.js`);
  fs.writeFileSync(filePath, code.trim());

  return filePath;
}
