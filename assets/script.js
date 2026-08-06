/**
 * XMenz Gaming - Core Interactive Engine
 * Powered by Web Audio API & LocalStorage
 */

// Global State
const state = {
  activeTheme: "red",
  audioCtx: null,
  bgmSynth: null,
  isBgmPlaying: false,
  isCursorEnabled: true,
  quotes: [
    "Huahahahahaha! Welcome to the arena!",
    "Racing Master mabar? Chat WhatsApp langsung!",
    "Saweria dulu gan, biar semangat ngedriftnya! ✌️😁",
    "Subscribe YouTube @kaze_rush, jangan sampai ketinggalan!",
    "Karisma nomor satu, skill nomor dua. Huahaha!",
    "Mohon maaf, instagram masih otw dibuat! 😣",
    "Fokus ngedrift, tikungan tajam didepan!",
    "Gaya elegan, humoris, tapi tetap pro player!",
    "Main game itu seru-seruan, bukan tegang-tegangan!",
  ],
};

// club
// atur status aktif open member atau tidak status:"closed"
const clubs = {
  empire: {
    img: "assets/img/empiregt.png",
    name: "Empire GT",
    status: "open",
    joinType: "whatsapp",
    joinLink:
      "https://wa.me/6285798047422?text=" +
      encodeURIComponent(
        `Halo Admin Empire GT \nSaya ingin bergabung ke Club Empire GT.\nSaya mendapatkan informasi Open Member dari TikTok Bang Kaze Rush.\nMohon informasi lebih lanjut mengenai proses pendaftaran.\nTerima kasih.`,
      ),
    discord: "https://discord.gg/NSaSaUVBq",
    rules: [
      "Change Name : GT1“(name)",
      "No SARA",
      "Aktif",
      "Wajib Menjalankan Misi Klub",
    ],
  },
  irmc: {
    img: "assets/img/irmc.png",
    name: "IRMC",
    status: "open",
    joinType: "website",
    joinLink: "https://irmc.club/daftar",
    // "https://wa.me/6287835000003?text=" +
    // encodeURIComponent(
    //   `Halo Admin IRMC\nSaya ingin bergabung ke Club IRMC.\nSaya mendapatkan informasi Open Member dari TikTok Bang Kaze Rush.\nMohon informasi lebih lanjut mengenai proses pendaftaran.\nTerima kasih.`,
    // ),
    discord: "https://discord.gg/dfw73c689",
    rules: ["Change Name : IRMC〆(Name)", "NO Toxic", "NO 18++", "NO SARA"],
  },
};

// Initialize elements once DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initCustomCursor();
  initSchedule();
  initMascot();
  initBgm();
  initScrollAnimations();

  // Set default settings
  document.getElementById("toggle-cursor").checked = state.isCursorEnabled;
});

// ==========================================
// 1. SOUND GENERATION (Web Audio API)
// ==========================================

function getAudioContext() {
  if (!state.audioCtx) {
    state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (state.audioCtx.state === "suspended") {
    state.audioCtx.resume();
  }
  return state.audioCtx;
}

// Quick UI click sound (retro laser/ping)
function playClickSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Choose synth wave type based on theme
    osc.type = state.activeTheme === "emerald" ? "triangle" : "sine";

    // Quick laser pitch sweep
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.start(now);
    osc.stop(now + 0.15);
  } catch (e) {
    console.warn("Audio Context not allowed yet:", e);
  }
}

// Mascot voice/glitch sound (8-bit sci-fi computer sound)
function playMascotSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Play 3 rapid beeps in succession
    for (let i = 0; i < 3; i++) {
      const time = now + i * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "square";
      const freq = 600 + i * 200 + Math.random() * 100;
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.04, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);

      osc.start(time);
      osc.stop(time + 0.07);
    }
  } catch (e) {
    console.warn(e);
  }
}

// Synthwave bassline loop generator (Generative Music!)
class SynthwaveBgm {
  constructor(ctx) {
    this.ctx = ctx;
    this.tempo = 110; // BPM
    this.noteLength = 60 / this.tempo / 2; // Eighth note
    this.isRunning = false;
    this.nextNoteTime = 0.0;
    this.step = 0;

    // 8-step bass melody in A minor
    this.bassline = [55.0, 55.0, 65.41, 65.41, 73.42, 73.42, 55.0, 82.41]; // A1, A1, C2, C2, D2, D2, A1, E2

    // Filter node for synthwave warmth
    this.filter = ctx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.value = 400;
    this.filter.Q.value = 2;
    this.filter.connect(ctx.destination);
  }

  start() {
    this.isRunning = true;
    this.nextNoteTime = this.ctx.currentTime;
    this.scheduler();
  }

  stop() {
    this.isRunning = false;
  }

  scheduler() {
    while (this.nextNoteTime < this.ctx.currentTime + 0.1) {
      if (!this.isRunning) return;
      this.scheduleNote(this.step, this.nextNoteTime);
      this.advanceNote();
    }
    if (this.isRunning) {
      setTimeout(() => this.scheduler(), 25);
    }
  }

  advanceNote() {
    this.nextNoteTime += this.noteLength;
    this.step = (this.step + 1) % 8;
  }

  scheduleNote(step, time) {
    // Create oscillator for bass synthesizer
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc1.type = "sawtooth";
    osc2.type = "triangle";

    // Detune oscillators slightly for fat chorused sound
    osc1.frequency.setValueAtTime(this.bassline[step], time);
    osc2.frequency.setValueAtTime(this.bassline[step] * 1.01, time);

    gainNode.gain.setValueAtTime(0.07, time);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      time + this.noteLength - 0.02,
    );

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(this.filter);

    // Slowly sweep filter cutoff for dynamic feel
    const lfoVal = Math.sin(time * 0.5) * 150 + 450;
    this.filter.frequency.setValueAtTime(lfoVal, time);

    osc1.start(time);
    osc1.stop(time + this.noteLength);
    osc2.start(time);
    osc2.stop(time + this.noteLength);
  }
}

// ==========================================
// 2. THEME / MOOD SYSTEM
// ==========================================

function initTheme() {
  const savedTheme = localStorage.getItem("xmenz-theme") || "red";
  setTheme(savedTheme);

  const themeSelector = document.getElementById("theme-select");
  if (themeSelector) {
    themeSelector.value = savedTheme;
    themeSelector.addEventListener("change", (e) => {
      setTheme(e.target.value);
      playClickSound();
    });
  }
}

function setTheme(themeName) {
  state.activeTheme = themeName;
  localStorage.setItem("xmenz-theme", themeName);

  // Remove all theme classes from body
  document.body.classList.remove("theme-purple", "theme-emerald", "theme-blue");

  // Add selected theme class
  if (themeName !== "red") {
    document.body.classList.add(`theme-${themeName}`);
  }
}

// ==========================================
// 3. SCHEDULE SYSTEM (Dynamic highlight)
// ==========================================

function initSchedule() {
  const scheduleData = [
    {
      day: 1,
      name: "Senin",
      isHoliday: false,
      time: "Pagi - Selesai",
      topic: "Racing Master (Rutin)",
      desc: "Pagi selalu RM. Malam opsional (MMORPG/Game Kompetitif/RM).",
    },
    {
      day: 2,
      name: "Selasa",
      isHoliday: false,
      time: "Malam - Selesai",
      topic: "Racing Master (Rutin)",
      desc: "Pagi selalu RM. Malam opsional (MMORPG/Game Kompetitif/RM).",
    },
    {
      day: 3,
      name: "Rabu",
      isHoliday: false,
      time: "Malam - Selesai",
      topic: "Racing Master (Rutin)",
      desc: "Pagi selalu RM. Malam opsional (MMORPG/Game Kompetitif/RM).",
    },
    {
      day: 4,
      name: "Kamis",
      isHoliday: false,
      time: "Pagi - Selesai",
      topic: "Racing Master (Rutin)",
      desc: "Pagi selalu RM. Malam opsional (MMORPG/Game Kompetitif/RM).",
    },
    {
      day: 5,
      name: "Jumat",
      isHoliday: false,
      time: "Malam - Selesai",
      topic: "Racing Master (Rutin)",
      desc: "Pagi selalu RM. Malam opsional (MMORPG/Game Kompetitif/RM).",
    },
    {
      day: 6,
      name: "Sabtu",
      isHoliday: false,
      time: "Sore - Selesai",
      topic: "Racing Master / Game Lain",
      desc: "Kadang extra live RM tergantung sikon, atau game lain.",
    },
    {
      day: 0,
      name: "Minggu",
      isHoliday: false,
      time: "Pagi - Selesai",
      topic: "Racing Master / Game Lain",
      desc: "Kadang extra live RM tergantung sikon, atau game lain.",
    },
  ];

  const scheduleGrid = document.getElementById("schedule-grid");
  if (!scheduleGrid) return;

  const currentDay = new Date().getDay(); // 0 = Minggu, 1 = Senin, dst.
  scheduleGrid.innerHTML = "";

  scheduleData.forEach((sched) => {
    const isToday = sched.day === currentDay;
    const isLibur = sched.isHoliday;

    const card = document.createElement("div");
    card.className = `p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
      isToday && !isLibur
        ? "bg-gradient-to-br from-white/10 to-white/5 border-[var(--color-primary)] neon-border-glow translate-y-[-2px] scale-[1.02] z-10"
        : "bg-white/5 border-white/5 hover:border-white/20"
    }`;

    const displayTime = isLibur ? "-- : --" : sched.time;
    const displayTopic = isLibur ? "LIBUR LIVE STREAM" : sched.topic;
    const displayDesc = isLibur
      ? "Hari ini libur live streaming. Sampai jumpa di jadwal berikutnya!"
      : sched.desc;

    card.innerHTML = `
      <div class="flex justify-between items-center mb-2.5">
        <span class="font-bold font-gaming text-xs sm:text-sm ${isToday && !isLibur ? "text-[var(--color-primary)] neon-text-glow" : "text-gray-300"}">
          ${sched.name}
        </span>
        ${
          isLibur
            ? `<span class="badge-tag bg-red-500/20 text-red-400 border border-red-500/40 text-[9px]">LIBUR</span>`
            : isToday
              ? `<span class="badge-tag bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/40 text-[9px]">HARI INI</span>`
              : ""
        }
      </div>

      <div class="space-y-2 flex-grow mb-2.5">
        <div class="flex items-start gap-1.5">
          <i class="fa-solid fa-clock text-[var(--color-primary)] text-[10px] mt-1 shrink-0"></i>
          <div>
            <p class="text-[10px] font-bold text-white leading-tight">${displayTopic}</p>
            <p class="text-[9px] text-gray-400">${displayTime}</p>
          </div>
        </div>
      </div>

      <div class="border-t border-white/5 pt-1.5 text-[9px] text-gray-400 italic leading-tight">
        ${displayDesc}
      </div>
    `;

    scheduleGrid.appendChild(card);
  });
}

// ==========================================
// 4. TESTIMONIAL LIGHTBOX SYSTEM
// ==========================================

window.openLightbox = function (src, element) {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  if (lightbox && img) {
    img.src = src;
    lightbox.classList.remove("hidden");
    lightbox.classList.add("flex");
    playClickSound();
  }
};

window.closeLightbox = function () {
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    lightbox.classList.add("hidden");
    lightbox.classList.remove("flex");
    playClickSound();
  }
};

// ==========================================
// 5. INTERACTIVE MASCOT SYSTEM
// ==========================================

function initMascot() {
  const mascot = document.getElementById("mascot");
  const bubble = document.getElementById("mascot-bubble");
  const bubbleText = document.getElementById("mascot-bubble-text");

  if (!mascot || !bubble || !bubbleText) return;

  let bubbleTimeout;

  mascot.addEventListener("click", () => {
    // 1. Play sound
    playMascotSound();

    // 2. Visual Glitch effect
    mascot.classList.add("glitch-active");
    setTimeout(() => {
      mascot.classList.remove("glitch-active");
    }, 400);

    // 3. Show bubble quote
    const randomQuote =
      state.quotes[Math.floor(Math.random() * state.quotes.length)];
    bubbleText.textContent = randomQuote;

    bubble.classList.add("active");

    // Clear previous timeout if double clicked
    clearTimeout(bubbleTimeout);

    bubbleTimeout = setTimeout(() => {
      bubble.classList.remove("active");
    }, 3500);
  });
}

// ==========================================
// 6. AMBIENT BGM GENERATIVE MUSIC
// ==========================================

function initBgm() {
  const bgmBtn = document.getElementById("bgm-toggle");
  const visualizer = document.getElementById("bgm-visualizer");

  if (!bgmBtn || !visualizer) return;

  bgmBtn.addEventListener("click", () => {
    const ctx = getAudioContext();

    if (!state.bgmSynth) {
      state.bgmSynth = new SynthwaveBgm(ctx);
    }

    if (!state.isBgmPlaying) {
      // Start loop
      state.bgmSynth.start();
      state.isBgmPlaying = true;
      bgmBtn.classList.add(
        "bg-[var(--color-primary)]/20",
        "border-[var(--color-primary)]",
      );
      bgmBtn.querySelector(".bgm-status").textContent = ": ON";
      visualizer.classList.add("visualizer-playing");
      playClickSound();
    } else {
      // Stop loop
      state.bgmSynth.stop();
      state.isBgmPlaying = false;
      bgmBtn.classList.remove(
        "bg-[var(--color-primary)]/20",
        "border-[var(--color-primary)]",
      );
      bgmBtn.querySelector(".bgm-status").textContent = ": OFF";
      visualizer.classList.remove("visualizer-playing");
      playClickSound();
    }
  });
}

// ==========================================
// 7. CUSTOM CURSOR & CLICK RIPPLES
// ==========================================

function initCustomCursor() {
  const cursor = document.querySelector(".custom-cursor");
  const cursorDot = document.querySelector(".custom-cursor-dot");

  if (!cursor || !cursorDot) return;

  // Track cursor coordinates
  document.addEventListener("mousemove", (e) => {
    if (!state.isCursorEnabled) return;
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;

    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
  });

  // Listen to mouse clicks for ripple creation
  document.addEventListener("click", (e) => {
    // Generate click sound for standard buttons
    if (
      e.target.closest("a") ||
      e.target.closest("button") ||
      e.target.closest("select")
    ) {
      playClickSound();
    }

    createRipple(e);
  });

  // Hover zoom effects
  const addHoverEffects = () => {
    const interactiveElements = document.querySelectorAll(
      "a, button, select, input, textarea, #mascot",
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("hovered"));
      el.addEventListener("mouseleave", () =>
        cursor.classList.remove("hovered"),
      );
    });
  };

  addHoverEffects();

  // Monitor DOM changes to apply hover effects on new guestbook messages or buttons
  const observer = new MutationObserver(addHoverEffects);
  observer.observe(document.body, { childList: true, subtree: true });

  // Settings control
  const cursorToggle = document.getElementById("toggle-cursor");
  if (cursorToggle) {
    cursorToggle.addEventListener("change", (e) => {
      state.isCursorEnabled = e.target.checked;
      if (state.isCursorEnabled) {
        document.documentElement.classList.add("cursor-enabled");
      } else {
        document.documentElement.classList.remove("cursor-enabled");
      }
      playClickSound();
    });

    // Trigger initial load setting
    if (state.isCursorEnabled) {
      document.documentElement.classList.add("cursor-enabled");
    }
  }
}

function createRipple(e) {
  const ripple = document.createElement("div");
  ripple.className = "ripple";
  ripple.style.left = `${e.clientX}px`;
  ripple.style.top = `${e.clientY}px`;

  document.body.appendChild(ripple);

  // Remove after animation completes
  ripple.addEventListener("animationend", () => {
    ripple.remove();
  });
}

// ==========================================
// 8. POPUP MODAL CONTROL
// ==========================================

window.showInfoPopup = function (event) {
  if (event) event.preventDefault();
  const popup = document.getElementById("popup");
  if (popup) {
    popup.classList.remove("hidden");
    popup.classList.add("flex");
    playClickSound();
  }
};

window.closePopup = function () {
  const popup = document.getElementById("popup");
  if (popup) {
    popup.classList.add("hidden");
    popup.classList.remove("flex");
    playClickSound();
  }
};

// Close modal when clicking outside of contents
document.addEventListener("click", (e) => {
  const popup = document.getElementById("popup");
  if (popup && e.target === popup) {
    closePopup();
  }
});

// ==========================================
// 9. ANIMATIONS & SCROLL UTILITIES
// ==========================================

function initScrollAnimations() {
  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, observerOptions);

  // Add scroll anim targets
  document
    .querySelectorAll(".cyber-card, section h2, .social-btn")
    .forEach((el) => {
      // Make sure it doesn't instantly flash before observer loads
      el.style.opacity = "0";
      observer.observe(el);
    });
}

// Gear Specs Switcher helper function (triggered inline in html)
window.switchGearTab = function (tabName, event) {
  playClickSound();

  // Deactivate all tab buttons
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach((btn) => {
    btn.classList.remove(
      "border-[var(--color-primary)]",
      "text-white",
      "bg-[var(--color-primary)]/10",
    );
    btn.classList.add("border-transparent", "text-gray-400");
  });

  // Activate selected tab button
  if (event && event.currentTarget) {
    event.currentTarget.classList.add(
      "border-[var(--color-primary)]",
      "text-white",
      "bg-[var(--color-primary)]/10",
    );
    event.currentTarget.classList.remove("border-transparent", "text-gray-400");
  }

  // Hide all tab contents
  const tabContents = document.querySelectorAll(".tab-content");
  tabContents.forEach((content) => content.classList.add("hidden"));

  // Show selected tab content
  const activeContent = document.getElementById(`gear-tab-${tabName}`);
  if (activeContent) {
    activeContent.classList.remove("hidden");
  }
};

// logika club
window.openClubPopup = function (clubName) {
  const club = clubs[clubName];
  if (!club) return;

  document.getElementById("club-logo").src = club.img;
  document.getElementById("club-title").textContent = club.name;
  document.getElementById("club-status").innerHTML =
    club.status === "open"
      ? `<span class="badge-tag badge-live">🟢 OPEN MEMBER</span>`
      : `<span class="badge-tag bg-red-500/20 border border-red-500 text-red-400">🔴 CLOSED</span>`;

  document.getElementById("club-rules").innerHTML = club.rules
    .map((rule) => `<li>✅ ${rule}</li>`)
    .join("");

  const btn = document.getElementById("club-join-btn");

  if (club.status === "open") {
    btn.style.display = "flex";

    // Tentukan ikon dan teks berdasarkan tipe
    let iconClass = "fa-solid fa-gamepad"; // Default ikon gaming
    let btnText = "Daftar Club";

    if (club.joinType === "whatsapp") {
      iconClass = "fa-brands fa-whatsapp";
      btnText = "Hubungi via WhatsApp";
    } else if (club.joinType === "discord") {
      iconClass = "fa-brands fa-discord";
      btnText = "Join Discord";
    } else if (club.joinType === "website") {
      iconClass = iconClass;
      btnText = "Buka Halaman Pendaftaran";
    }

    btn.innerHTML = `<i class="${iconClass} text-xl mr-2"></i><span>${btnText}</span>`;

    btn.onclick = () => {
      window.open(club.joinLink, "_blank");
    };
  } else {
    btn.style.display = "none";
  }

  document.getElementById("club-popup").classList.remove("hidden");
  document.getElementById("club-popup").classList.add("flex");
  playClickSound();
};

window.closeClubPopup = function () {
  document.getElementById("club-popup").classList.add("hidden");

  document.getElementById("club-popup").classList.remove("flex");

  playClickSound();
};
