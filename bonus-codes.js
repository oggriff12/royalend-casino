// index.js import express from "express"; import fs from "fs"; import path from "path"; import { fileURLToPath } from "url"; import cors from "cors";

const app = express(); const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url); const __dirname = path.dirname(__filename);

app.use(cors());

app.get("/bonus-codes", (req, res) => { const codesPath = path.join(__dirname, "codes.json"); fs.readFile(codesPath, "utf-8", (err, data) => { if (err) { return res.status(500).json({ error: "Failed to read bonus codes." }); } try { const codes = JSON.parse(data); res.json(codes); } catch (e) { res.status(500).json({ error: "Invalid JSON format." }); } }); });

app.get("/", (req, res) => { res.send("Manual Bonus Code Bot Live!"); });

app.listen(PORT, () => console.log(Bonus Code API Live on ${PORT}));

