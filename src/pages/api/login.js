// src/pages/api/login.js
export default function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password } = req.body;
        
        // Implementasi pengecekan user dengan database (contoh sederhana)
        if (username === 'user@example.com' && password === 'password') {
            // Generate token menggunakan JWT (ini hanya contoh sederhana, gunakan library jwt untuk produksi)
            const token = 'your-generated-jwt-token'; // Ganti dengan token yang di-generate sebenarnya
            res.status(200).json({ token });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
