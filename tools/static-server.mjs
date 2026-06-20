import { createReadStream, existsSync, statSync } from "node:fs";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(process.cwd());
const port = Number(process.argv[2] ?? 8000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  if (request.method === "GET" && url.pathname === "/__list-levels") {
    listLevels(response, url.searchParams.get("collection") === "built-in" ? "built-in" : "custom");
    return;
  }

  if (request.method === "POST" && url.pathname === "/__save-level") {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2_000_000) request.destroy();
    });
    request.on("end", async () => {
      try {
        const data = JSON.parse(body);
        const fileName = sanitizeLevelFileName(data.fileName);
        if (!fileName || typeof data.code !== "string") throw new Error("Bad level payload");
        const collection = data.collection === "built-in" ? "built-in" : "custom";

        const levelsDir = collection === "built-in"
          ? resolve(join(root, "src", "levels"))
          : resolve(join(root, "src", "levels", "custom"));
        const filePath = resolve(join(levelsDir, `${fileName}.js`));
        if (!filePath.startsWith(levelsDir)) throw new Error("Bad level path");

        await mkdir(levelsDir, { recursive: true });
        await writeFile(filePath, data.code, "utf8");
        response.writeHead(200, { "content-type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ ok: true, path: collection === "built-in" ? `src/levels/${fileName}.js` : `src/levels/custom/${fileName}.js`, collection }));
      } catch (error) {
        response.writeHead(400, { "content-type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ ok: false, error: error.message }));
      }
    });
    return;
  }

  const requestPath = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
  let filePath = resolve(join(root, requestPath));
  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }
  if (!existsSync(filePath) || statSync(filePath).isDirectory()) filePath = join(filePath, "index.html");
  if (!existsSync(filePath)) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }
  response.writeHead(200, { "content-type": types[extname(filePath)] ?? "application/octet-stream" });
  createReadStream(filePath).pipe(response);
}).listen(port, "127.0.0.1");

async function listLevels(response, collection) {
  try {
    const levelsDir = collection === "built-in"
      ? resolve(join(root, "src", "levels"))
      : resolve(join(root, "src", "levels", "custom"));
    await mkdir(levelsDir, { recursive: true });
    const files = (await readdir(levelsDir, { withFileTypes: true }))
      .filter((entry) => entry.isFile() && entry.name.endsWith(".js"))
      .map((entry) => {
        const fileName = entry.name.replace(/\.js$/i, "");
        return {
          id: `${collection}-${fileName}`,
          fileName,
          path: collection === "built-in" ? `/src/levels/${entry.name}` : `/src/levels/custom/${entry.name}`,
          title: titleFromFileName(fileName),
          exportName: exportNameFromFileName(fileName),
        };
      })
      .sort((a, b) => a.fileName.localeCompare(b.fileName, "ru"));

    response.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ ok: true, collection, levels: files }));
  } catch (error) {
    response.writeHead(500, { "content-type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ ok: false, error: error.message, levels: [] }));
  }
}

function sanitizeLevelFileName(value) {
  return String(value ?? "")
    .trim()
    .replace(/\.js$/i, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function titleFromFileName(value) {
  return value
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ") || "Сохраненный уровень";
}

function exportNameFromFileName(value) {
  const name = value
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("") || "CustomLevel";
  return /^[A-Za-z_$]/.test(name) ? name : `Level${name}`;
}
