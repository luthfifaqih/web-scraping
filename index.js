import 'dotenv/config';
import express from "express";
import axios from "axios";
import OpenAI from "openai";

const app = express();
const openai = new OpenAI({ apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com/v1",
 });

async function extractWithAI(html) {
  const prompt = `
Baca HTML eBay ini dan ekstrak semua produk yang ada. 
Untuk setiap produk, ambil:
1. Nama Produk
2. Harga Produk
3. Deskripsi Produk (jika ada)
Kembalikan dalam format JSON array dengan key: "title", "price", "description".
HTML:
${html}
  `;

  const completion = await openai.chat.completions.create({
    model: 'deepseek-chat', 
    messages: [{ role: "user", content: prompt }],
    temperature: 0
  });

  return completion.choices[0].message.content;
}

app.get("/api/products", async (req, res) => {
  try {
    const keyword = req.query.search || "nike";
    const page = req.query.page || 1;
    const url = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(keyword)}&_pgn=${page}`;

    console.log(`Scraping: ${url}`);

    // Ambil HTML dari eBay
    const { data: html } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    // Kirim HTML ke AI
    const aiResult = await extractWithAI(html);

    // Parsing hasil JSON dari AI
    let products;
    try {
      products = JSON.parse(aiResult);
    } catch (err) {
      return res.status(500).json({ error: "Gagal parsing JSON dari AI", raw: aiResult });
    }

    res.json({ keyword, page, total: products.length, products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server berjalan di http://localhost:3000");
});
