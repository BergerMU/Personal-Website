export default function handler(req, res) {
    res.json({ key: process.env.SECRET_API_KEY });
  }