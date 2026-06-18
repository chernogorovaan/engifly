// ===== Бургер-меню =====
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

burger.addEventListener("click", () => {
  burger.classList.toggle("active");
  nav.classList.toggle("open");
});

// Закрытие меню при клике по ссылке
nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    burger.classList.remove("active");
    nav.classList.remove("open");
  });
});

// ===== Карусель преподавателей =====
const teachers = [
  { 
    name: "Павел Р.", 
    img: "https://i.pravatar.cc/200?img=12", 
    role: "Преподаватель<br>General English", 
    desc: "5 лет опыта. Специализация на разговорном английском и подготовке к рабочим встречам. Делает сложные темы простыми." 
  },
  { 
    name: "Анна Петрова", 
    img: "https://i.pravatar.cc/200?img=47", 
    role: "Преподаватель<br>Business English", 
    desc: "6+ лет опыта преподавания. Помогает подготовиться к рабочим встречам, интервью и переписке на английском языке." 
  },
  { 
    name: "Ольга С.", 
    img: "https://i.pravatar.cc/200?img=32", 
    role: "IELTS / TOEFL<br>преподаватель", 
    desc: "Сдала IELTS на 8.5. Помогает студентам достичь нужного балла и поступить в зарубежные университеты." 
  },
  { 
    name: "Дмитрий К.", 
    img: "https://i.pravatar.cc/200?img=68", 
    role: "IELTS Coach", 
    desc: "Сдал IELTS на 9.0. Готовит к международным экзаменам и академическому письму." 
  },
  { 
    name: "Елена В.", 
    img: "https://i.pravatar.cc/200?img=20", 
    role: "General English", 
    desc: "8 лет опыта. Специализация — разговорный английский для IT-специалистов." 
  }
];
let centerIdx = 1;

function renderCarousel() {
  const left  = teachers[(centerIdx - 1 + teachers.length) % teachers.length];
  const right = teachers[(centerIdx + 1) % teachers.length];
  const c     = teachers[centerIdx];

  document.getElementById("t-left").innerHTML = `
    <div class="teacher-card__photo" style="background-image:url('${left.img}')"></div>
    <h4>${left.name}</h4>
    <div class="lines"><div class="line"></div><div class="line"></div></div>`;

  document.getElementById("t-center").innerHTML = `
    <div class="teacher-card__photo" style="background-image:url('${c.img}')"></div>
    <h4>${c.name}</h4>
    ${c.role ? `<div class="role">${c.role}</div>` : ""}
    ${c.desc ? `<div class="desc">${c.desc}</div>` : ""}`;

  document.getElementById("t-right").innerHTML = `
    <div class="teacher-card__photo" style="background-image:url('${right.img}')"></div>
    <h4>${right.name}</h4>
    <div class="lines"><div class="line"></div><div class="line"></div></div>`;
}

document.getElementById("prev").addEventListener("click", () => {
  centerIdx = (centerIdx - 1 + teachers.length) % teachers.length;
  renderCarousel();
});
document.getElementById("next").addEventListener("click", () => {
  centerIdx = (centerIdx + 1) % teachers.length;
  renderCarousel();
});

// ===== Маска телефона =====
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

// ===== Отправка формы =====
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

  // Убираем ошибку при вводе
  form.querySelectorAll("input").forEach(inp => {
    inp.addEventListener("input", () => inp.classList.remove("invalid"));
  });
}