import TelegramBot from 'node-telegram-bot-api';
import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Serve bonus codes JSON
app.get('/bonus-codes', (req, res) => {
  try {
    const data = fs.readFileSync('codes.json');
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  } catch {
    res.status(500).send('No codes found');
  }
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));

// Telegram Bot
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const CHANNEL_ID = process.env.CHANNEL_ID;

bot.on('message', (msg) => {
  if (msg.chat.id.toString() !== CHANNEL_ID) return;
  if (!msg.text || !msg.text.toLowerCase().includes('bonus')) return;

  console.log('🔥 Bonus code received:', msg.text);
  const parts = msg.text.split(' ');
  if (parts.length < 4) return bot.sendMessage(msg.chat.id, '❌ Invalid bonus format');

  const codeObj = {
    site: parts[1],
    code: parts[2],
    wager: parts[3],
    status: "Unclaimed",
    timestamp: new Date().toISOString()
  };

  let codes = [];
  try {
    if (fs.existsSync('codes.json')) {
      codes = JSON.parse(fs.readFileSync('codes.json'));
    }
  } catch {}
  codes.unshift(codeObj);
  codes = codes.slice(0, 20);
  fs.writeFileSync('codes.json', JSON.stringify(codes, null, 2));

  bot.sendMessage(msg.chat.id, `✅ Bonus saved: ${codeObj.code}`);
});
