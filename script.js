
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

burger.addEventListener("click", () => {
  burger.classList.toggle("active");
  nav.classList.toggle("open");
});

nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    burger.classList.remove("active");
    nav.classList.remove("open");
  });
});


const track = document.getElementById("carousel-track");
const cards = document.querySelectorAll(".teacher-card");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let currentIndex = 1; 
let isAnimating = false;

function getCardFullWidth() {
  const card = cards[0];
  const style = window.getComputedStyle(track);
  const gap = parseInt(style.gap) || 20;
  return card.offsetWidth + gap;
}

function centerCard(index, animate = true) {
  if (isAnimating && animate) return;
  isAnimating = true;

  const cardWidth = getCardFullWidth();
  const containerWidth = track.parentElement.offsetWidth;
  
  const offset = -(index * cardWidth) + (containerWidth / 2) - (cards[0].offsetWidth / 2);
  
  if (!animate) {
    track.style.transition = "none";
  } else {
    track.style.transition = "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
  }
  
  track.style.transform = `translateX(${offset}px)`;

  cards.forEach((card, i) => {
    card.classList.toggle("active", i === index);
  });

  if (animate) {
    setTimeout(() => { isAnimating = false; }, 600);
  } else {
    isAnimating = false;
  }
}

function nextCard() {
  if (isAnimating) return;
  currentIndex = (currentIndex + 1) % cards.length;
  centerCard(currentIndex);
}

function prevCard() {
  if (isAnimating) return;
  currentIndex = (currentIndex - 1 + cards.length) % cards.length;
  centerCard(currentIndex);
}

nextBtn.addEventListener("click", nextCard);
prevBtn.addEventListener("click", prevCard);

cards.forEach((card, index) => {
  card.addEventListener("click", () => {
    if (index !== currentIndex) {
      currentIndex = index;
      centerCard(currentIndex);
    }
  });
});

let touchStartX = 0;
let touchEndX = 0;

track.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

track.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > 50) { 
    if (diff > 0) {
      nextCard(); 
    } else {
      prevCard(); 
    }
  }
}, { passive: true });


window.addEventListener("load", () => {
  centerCard(currentIndex, false);
});

window.addEventListener("resize", () => {
  centerCard(currentIndex, false);
});


const phoneInput = document.querySelector('input[name="phone"]');
if (phoneInput) {
  phoneInput.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.startsWith("8")) v = "7" + v.slice(1);
    if (!v.startsWith("7")) v = "7" + v;
    v = v.slice(0, 11);
    let f = "+7";
    if (v.length > 1)  f += " (" + v.slice(1, 4);
    if (v.length >= 5) f += ") " + v.slice(4, 7);
    if (v.length >= 8) f += "-" + v.slice(7, 9);
    if (v.length >= 10) f += "-" + v.slice(9, 11);
    e.target.value = f;
  });
}


const API_URL = "https://jsonplaceholder.typicode.com/posts";
const form = document.getElementById("contact-form");
const submitBtn = document.getElementById("submit-btn");
const statusEl = document.getElementById("status");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "";
    statusEl.className = "form__status";

    const name  = form.elements.name.value.trim();
    const phone = form.elements.phone.value.trim();

    let valid = true;
    if (name.length < 2)  { form.elements.name.classList.add("invalid");  valid = false; }
    else                  { form.elements.name.classList.remove("invalid"); }
    if (phone.replace(/\D/g,"").length !== 11) { form.elements.phone.classList.add("invalid"); valid = false; }
    else { form.elements.phone.classList.remove("invalid"); }

    if (!valid) {
      statusEl.textContent = "Заполните имя и телефон корректно";
      statusEl.classList.add("error");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Отправляем...";

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, phone,
          experience: form.elements.experience.value.trim(),
          source: "engifly-landing"
        })
      });
      if (!res.ok) throw new Error("HTTP " + res.status);

      statusEl.textContent = "✅ Заявка отправлена! Мы свяжемся с вами в течение 15 минут.";
      statusEl.classList.add("success");
      form.reset();
    } catch (err) {
      statusEl.textContent = "❌ Ошибка отправки. Позвоните нам напрямую.";
      statusEl.classList.add("error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Записаться на урок";
    }
  });


  form.querySelectorAll("input").forEach(inp => {
    inp.addEventListener("input", () => inp.classList.remove("invalid"));
  });
}