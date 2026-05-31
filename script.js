const sendLocationBtn = document.getElementById("sendLocationBtn");
const locationStatus = document.getElementById("locationStatus");
let locationIntervalId = null;
let isSending = false;

const updateStatus = (message, isError = false) => {
  if (!locationStatus) return;
  locationStatus.textContent = message;
  locationStatus.style.color = isError ? "#b91c1c" : "#166534";
};

const sendLocation = async ({ latitude, longitude, accuracy }) => {
  updateStatus("Joylashuv yuborilmoqda…");

  try {
    const response = await fetch("/api/location", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        latitude,
        longitude,
        accuracy,
        page: window.location.href,
        userAgent: navigator.userAgent,
        time: new Date().toLocaleString()
      })
    });

    if (!response.ok) {
      throw new Error("Serverdan javob olishda xatolik yuz berdi.");
    }

    const data = await response.json();
    if (data.ok) {
      updateStatus("Joylashuvingiz muvaffaqiyatli yuborildi.");
    } else {
      throw new Error(data.error || "Noma'lum xatolik.");
    }
  } catch (error) {
    updateStatus(error.message || "Joylashuvni yuborishda xatolik.", true);
  }
};

const fetchAndSendLocation = () => {
  if (isSending || !navigator.geolocation) return;

  isSending = true;
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      await sendLocation(position.coords);
      isSending = false;
    },
    (error) => {
      const message = {
        1: "Foydalanuvchi joylashuvni rad etdi.",
        2: "Joylashuv aniqlanmadi.",
        3: "Joylashuvni olish uchun vaqt tugadi."
      }[error.code] || "Joylashuvni olishda xatolik yuz berdi.";
      updateStatus(message, true);
      isSending = false;
    },
    { enableHighAccuracy: true, timeout: 15000 }
  );
};

const requestLocation = () => {
  if (!navigator.geolocation) {
    updateStatus("Brauzeringiz joylashuvni qo'llab-quvvatlamaydi.", true);
    return;
  }

  updateStatus("Joylashuv aniqlanmoqda…");
  isSending = true;

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      await sendLocation(position.coords);
      isSending = false;

      if (!locationIntervalId) {
        locationIntervalId = setInterval(fetchAndSendLocation, 4000);
        updateStatus("Joylashuv yuborish boshlangan. Har 4 soniyada yangilanadi.");
      }
    },
    (error) => {
      const message = {
        1: "Foydalanuvchi joylashuvni rad etdi.",
        2: "Joylashuv aniqlanmadi.",
        3: "Joylashuvni olish uchun vaqt tugadi."
      }[error.code] || "Joylashuvni olishda xatolik yuz berdi.";
      updateStatus(message, true);
      isSending = false;
    },
    { enableHighAccuracy: true, timeout: 15000 }
  );
};

if (sendLocationBtn) {
  sendLocationBtn.addEventListener("click", requestLocation);
}
