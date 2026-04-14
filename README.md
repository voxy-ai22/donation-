<p align="center">
  <img src="https://fcdn.my.id/i/elfar-1776125892799.jpeg" alt="Logo" width="100" style="border-radius: 50%;" />
</p>

<h1 align="center">🚀 Donasi Page</h1>

<p align="center">
  <img src="https://img.shields.io/badge/deploy-vercel-black?logo=vercel" />
  <img src="https://img.shields.io/badge/source-github-24292e?logo=github" />
  <img src="https://img.shields.io/badge/payment-QRIS%20%7C%20DANA%20%7C%20OVO%20%7C%20GoPay-blueviolet" />
</p>

---

## 📦 Cara Deploy ke GitHub

1. **Buat repository baru** di [github.com](https://github.com) → klik `+` → `New repository`
2. Beri nama repo (contoh: `donasi-page`), set ke **Public**, lalu klik **Create repository** Dan Centang untuk readmd
3. Upload semua file project lewat tombol `Add file` → `Upload files`, **atau** pakai Git CLI:

```bash
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/username/nama-repo.git
git push -u origin main
```

4. Pastikan file `index.html`, `script.js`, dan file lainnya sudah ada di **root folder** repository.

---

## ▲ Cara Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com) → Login menggunakan akun **GitHub**
2. Klik **Add New Project** → pilih repository yang sudah kamu upload
3. Biarkan semua setting default, lalu klik **Deploy**
4. Tunggu beberapa detik — Vercel akan memberikan link gratis seperti: `nama-project.vercel.app`
5. ✅ Setiap kali kamu **push ke GitHub**, Vercel otomatis deploy ulang!

> 💡 Mau pakai domain sendiri? Bisa tambah di Vercel → Settings → Domains.

---

## 🔑 Environment Variable (jika diperlukan)

Tambahkan di **Vercel → Project Settings → Environment Variables**:

| Key | Keterangan |
|-----|------------|
| `SESSION_SECRET` | Secret key untuk session (isi bebas, buat yang panjang & random) |
| `ADMIN_USERNAME` | Username untuk login halaman admin |
| `ADMIN_PASSWORD` | Password untuk login halaman admin |

> ⚠️ Jangan pernah share nilai ENV ini ke publik atau commit ke GitHub!

---

## 💳 Cara Ganti Nomor DANA / OVO / GoPay

Buka file **`script.js`**, cari bagian berikut dan ganti nomor sesuai kepunyaan kamu:

```js
dana: {
  name: 'DANA',
  hasWallet: true,
  number: '628xxxxxxxxxx',  // ← Ganti nomor DANA kamu
  color: '#0072ef',
  ...
},

ovo: {
  name: 'OVO',
  hasWallet: true,
  number: '628xxxxxxxxxx',  // ← Ganti nomor OVO kamu
  color: '#9c6be8',
  ...
},

gopay: {
  name: 'GoPay',
  hasWallet: true,
  number: '628xxxxxxxxxx',  // ← Ganti nomor GoPay kamu
  color: '#00c95e',
  ...
},
```

> ⚠️ Format nomor harus diawali `628` (bukan `08`). Contoh: `628123456789`

---

## 📷 Cara Ganti Kode QRIS

1. Buka file **`index.html`**, pergi ke sekitar **baris 106–108**
2. Cari baris ini:

```html
<div id="qrSection" style="display:none;">
  <div class="qr-box">
    <img src="https://c.termai.cc/i155/zjEzdjz.jpg" alt="QRIS Code" id="qrImage" style="border-radius:8px;"/>
```

3. Ganti URL `https://c.termai.cc/i155/zjEzdjz.jpg` dengan **URL foto QRIS kamu**

### Belum punya URL untuk foto QRIS?

Upload foto QRIS kamu ke salah satu layanan gratis berikut:
- [termai.cc](https://termai.cc/upload)
- [imgbb.com](https://imgbb.com)
- [catbox.moe](https://catbox.moe)

Atau **chat mimin** dan kirimkan foto QRIS kamu untuk dibantu convert ke URL. 😊

## Cara ganti <!-- PAGE CONTENT -->
masuk ke html cari code 
<div class="banner-code">
  &lt;support&gt;<br>
  &nbsp;&nbsp;creator = "Nexa Dev"<br>
  &nbsp;&nbsp;status = "online"<br>
  &lt;/support&gt;
</div>

ganti sesuai yg kalian mau 

---

<p align="center">Made with ❤️ · Powered by Vercel + GitHub</p>
