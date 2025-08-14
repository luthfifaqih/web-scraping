eBay AI Scraper API
Ini adalah proyek API sederhana yang dibuat untuk melakukan web scraping pada halaman daftar produk eBay. Keunikan dari proyek ini adalah penggunaan AI, khususnya DeepSeek, untuk mengekstrak informasi produk langsung dari kode HTML halaman.
Proyek ini dibuat sebagai bagian dari tantangan seleksi untuk posisi Fullstack Developer, yang menguji kemampuan dalam web scraping, integrasi AI, dan pengembangan API menggunakan Javascript.

Fitur Utama
Scraping Dinamis: Mengambil data produk dari eBay berdasarkan kata kunci pencarian.
Integrasi AI: Memanfaatkan model deepseek-chat untuk membaca HTML dan mengekstrak data secara cerdas.
Output JSON: Mengembalikan hasil scraping dalam format JSON yang terstruktur dan mudah digunakan.
Server Express: Dibangun di atas Express.js untuk menyediakan endpoint API yang stabil.

Teknologi yang Digunakan
Node.js: Lingkungan eksekusi Javascript di sisi server.
Express.js: Kerangka kerja (framework) untuk membangun API.
Axios: Library untuk melakukan permintaan HTTP (mengambil halaman HTML dari eBay).
DeepSeek API: Digunakan sebagai "otak" untuk memproses HTML dan mengekstrak data produk.
dotenv: Untuk mengelola variabel lingkungan seperti API key dengan aman.

Penjelasan Kode & Cara Kerja
Proyek ini bekerja dengan alur yang sederhana namun efektif:

Setup Server:

- Menggunakan express untuk membuat server HTTP.
- Menginisialisasi klien openai namun mengarahkannya ke endpoint API DeepSeek (https://api.deepseek.com/v1) dan menggunakan API key yang tersimpan di .env.

Fungsi Inti extractWithAI(html):

- Ini adalah fungsi utama yang berinteraksi dengan AI.
- Fungsi ini menerima html mentah dari halaman eBay sebagai input.
- Sebuah prompt (perintah) yang jelas dibuat untuk AI, memintanya untuk membaca HTML dan mengekstrak nama, harga, dan deskripsi untuk setiap produk, lalu mengembalikannya dalam format JSON.
- Permintaan dikirim ke model deepseek-chat, dan respons teks dari AI dikembalikan.

Endpoint API /api/products:

- Ini adalah satu-satunya endpoint API dalam aplikasi ini, yang diakses melalui metode GET.
- Endpoint ini menerima dua query parameter opsional: search (untuk kata kunci produk) dan page (untuk nomor halaman). Jika tidak disediakan, defaultnya adalah nike dan 1.
- Mengambil HTML: axios digunakan untuk melakukan permintaan GET ke URL eBay yang sudah disusun secara dinamis. Header User-Agent diatur agar permintaan terlihat seperti berasal dari browser biasa, untuk menghindari pemblokiran.
- Ekstraksi dengan AI: HTML yang didapat dari axios kemudian dilemparkan ke fungsi extractWithAI.
- Parsing Hasil: Respons dari AI (yang seharusnya berupa string JSON) kemudian di-parse menjadi objek Javascript yang sebenarnya. Ada penanganan eror jika AI mengembalikan format yang tidak valid.
- Mengirim Respons: Akhirnya, server mengirimkan kembali data produk yang sudah terstruktur dalam format JSON ke klien.
