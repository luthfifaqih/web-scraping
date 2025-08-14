import express from "express";
import axios from "axios";
import { load } from "cheerio";

const app = express();

async function getProductDescription(url) {
  try {
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    const $ = load(data);
    
    
    let description = $("meta[name='description']").attr("content");
    if (!description) {
      description = $("meta[property='og:description']").attr("content");
    }

    return description ? description.trim() : "Deskripsi tidak ditemukan";
  } catch (err) {
    return "Gagal mengambil deskripsi";
  }
}

app.get("/api/products", async (req, res) => {
  try {
    const url = "https://www.ebay.com/sch/i.html?_from=R40&amp;_nkw=nike&amp;_sacat=0&amp;rt=nc&amp;_pgn=1";
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = load(data);
    const products = [];

    
    const productLinks = [];
    $(".s-item").each((_, el) => {
      const title = $(el).find(".s-item__title").text().trim();
      const price = $(el).find(".s-item__price").text().trim();
      const link = $(el).find(".s-item__link").attr("href");

      if (title && price && link) {
        productLinks.push({ title, price, link });
      }
    });

    
    for (let item of productLinks) {
      const description = await getProductDescription(item.link);
      products.push({
        title: item.title,
        price: item.price,
        description,
        url: item.link
      });
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server berjalan di http://localhost:3000");
});
