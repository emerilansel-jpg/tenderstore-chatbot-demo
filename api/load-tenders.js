const path = require('path');
const fs = require('fs');

module.exports = async function handler(req, res) {
  try {
    const filePath = path.join(__dirname, '..', 'data', 'tenders.json');
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(raw);
      return res.status(200).json({ data: data, count: data.length });
    }
    return res.status(200).json({ data: [], count: 0 });
  } catch (e) {
    return res.status(500).json({ error: 'Gagal memuat data: ' + e.message, data: [] });
  }
};
