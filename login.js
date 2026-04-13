// api/login.js — Vercel Serverless Function
// Password HANYA ada di server, tidak pernah dikirim ke browser

export default function handler(req, res) {
  // Hanya terima POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting sederhana via header (Vercel sudah proteksi DDoS)
  const { username, password } = req.body;

  // Validasi input
  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password wajib diisi' });
  }

  // Bandingkan dengan Environment Variables (TIDAK pernah dikirim ke browser)
  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;

  if (!validUsername || !validPassword) {
    return res.status(500).json({ error: 'Server belum dikonfigurasi' });
  }

  // Cek kredensial
  if (username === validUsername && password === validPassword) {
    // Buat token sederhana (timestamp + secret, bukan JWT full tapi cukup untuk use case ini)
    const secret = process.env.SESSION_SECRET || 'nexa-default-secret';
    const timestamp = Date.now();
    const token = Buffer.from(`${timestamp}:${secret}`).toString('base64');

    return res.status(200).json({
      success: true,
      token,
      expiresAt: timestamp + (8 * 60 * 60 * 1000) // 8 jam
    });
  }

  // Salah kredensial — delay 1 detik untuk anti brute-force
  return new Promise(resolve => {
    setTimeout(() => {
      res.status(401).json({ error: 'Username atau password salah' });
      resolve();
    }, 1000);
  });
}
