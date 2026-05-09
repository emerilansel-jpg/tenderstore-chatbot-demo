// Local datastore helper - replaces GitHub-as-DB
const fs = require('fs').promises;
const path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');

async function readJson(file) {
  const buf = await fs.readFile(path.join(DATA_DIR, file), 'utf8');
  try { return JSON.parse(buf); } catch(e) { return []; }
}
async function writeJson(file, data) {
  const fp = path.join(DATA_DIR, file);
  const tmp = fp + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(data, null, 2));
  await fs.rename(tmp, fp);
}
async function writeText(file, text) {
  const fp = path.join(DATA_DIR, file);
  const tmp = fp + '.tmp';
  await fs.writeFile(tmp, text);
  await fs.rename(tmp, fp);
}
async function exists(file) {
  try { await fs.access(path.join(DATA_DIR, file)); return true; } catch(e) { return false; }
}
module.exports = { readJson, writeJson, writeText, exists, DATA_DIR };
