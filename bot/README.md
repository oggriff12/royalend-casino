# 🎁 Bonus Code Telegram Bot (Casino Rewards System)

This Telegram bot listens for bonus codes posted in a specific Telegram channel and automatically serves them as a JSON API. It’s designed to integrate with your casino website to display live bonus codes fetched from Telegram.

---

## 📁 Folder Structure

| File | Purpose |
|------|---------|
| `index.js` | Main bot logic (Telegram listener + Express server) |
| `codes.json` | Stores up to 20 recent bonus codes |
| `.env.example` | Environment variable template |
| `package.json` | Project dependencies for Node.js |
| `.gitkeep` | Keeps Git folder structure valid when empty |

---

## ⚙️ Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/oggriff12/royalend-casino.git
cd royalend-casino/bot
