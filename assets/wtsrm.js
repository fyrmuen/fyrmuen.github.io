function formatStatus(status) {
  return status === "available" ? "AVAILABLE" : "SOLD";
}

function getActiveAccounts() {
  return Object.values(wtsrmAccounts).filter((account) => account.active);
}

function applySavedTheme() {
  const themes = ["red", "purple", "emerald", "blue"];
  const savedTheme = localStorage.getItem("xmenz-theme") || "red";
  document.body.dataset.theme = themes.includes(savedTheme)
    ? savedTheme
    : "red";
}

function whatsappUrl(account) {
  const message = `Halo Kak, saya melihat tawaran akun Racing Master yang dipromosikan oleh bang Kaze Rush dan tertarik dengan akun *${account.title} (${account.id})*. \nApakah masih tersedia?`;
  return `https://wa.me/6285722029357?text=${encodeURIComponent(message)}`;
}

function accountCard(account) {
  return `
    <article class="wtsrm-card">
      <div class="wtsrm-card-head">
        <span class="wtsrm-id">#${account.id}</span>
        <span class="wtsrm-status ${account.status}">${formatStatus(account.status)}</span>
      </div>
      <div class="wtsrm-card-body">
        <p class="wtsrm-eyebrow">${account.server} SERVER · ${account.security}</p>
        <h2>${account.title}</h2>
        <div class="wtsrm-card-meta">
          <span><i class="fa-solid fa-fingerprint"></i>id: ${account.idGame}</span>
          <span><i class="fa-solid fa-layer-group"></i> Level ${account.level}</span>
          <span><i class="fa-solid fa-trophy"></i> ${account.highestRank}</span>
        </div>
        <div class="wtsrm-card-price">${account.price}<small>${account.priceType === "nego" ? "nego" : "fixed"}</small></div>
        <a class="wtsrm-button" href="/wtsrm/${account.id}/">LIHAT DETAIL <i class="fa-solid fa-arrow-right"></i></a>
      </div>
    </article>`;
}

function galleryItemsMarkup(items) {
  return items
    .map(
      (item) => `
        <article class="wtsrm-gallery-item">
          <div class="wtsrm-gallery-image">
            <img src="${item.src}" alt="${item.name}" loading="lazy" onerror="this.hidden=true; this.closest('.wtsrm-gallery-item').querySelector('.wtsrm-zoom-button').hidden=true" />
            <div class="wtsrm-zoom-controls" aria-label="Buka gambar penuh">
              <button type="button" class="wtsrm-zoom-button" data-lightbox-src="${item.src}" data-lightbox-alt="${item.name}" aria-label="Buka gambar dalam ukuran penuh"><i class="fa-solid fa-expand"></i></button>
            </div>
          </div>
          <div class="wtsrm-gallery-copy"><strong>${item.name}</strong><span>${item.description}</span></div>
        </article>`,
    )
    .join("");
}

function initGalleryLightbox() {
  const lightbox = document.createElement("div");
  lightbox.className = "wtsrm-lightbox";
  lightbox.hidden = true;
  lightbox.innerHTML = `
    <div class="wtsrm-lightbox-backdrop" data-lightbox-close></div>
    <div class="wtsrm-lightbox-content" role="dialog" aria-modal="true" aria-label="Gambar ukuran penuh">
      <button type="button" class="wtsrm-lightbox-close" data-lightbox-close aria-label="Tutup gambar">&times;</button>
      <img class="wtsrm-lightbox-image" alt="" />
    </div>`;
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector(".wtsrm-lightbox-image");
  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.classList.remove("wtsrm-lightbox-open");
    lightboxImage.removeAttribute("src");
  };

  document.querySelectorAll("[data-lightbox-src]").forEach((button) => {
    button.addEventListener("click", () => {
      lightboxImage.src = button.dataset.lightboxSrc;
      lightboxImage.alt = button.dataset.lightboxAlt || "Gallery image";
      lightbox.hidden = false;
      document.body.classList.add("wtsrm-lightbox-open");
      lightbox.querySelector(".wtsrm-lightbox-close").focus();
    });
  });
  lightbox.querySelectorAll("[data-lightbox-close]").forEach((element) => {
    element.addEventListener("click", closeLightbox);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
  });
}

function galleryMarkup(account) {
  const cars = account.gallery?.cars || {};
  const outfits = account.gallery?.outfits || {};
  const warehouse = account.gallery?.warehouse || {};
  const tabsId = `gallery-${account.id}`;
  const categoryMarkup = (categories, group) =>
    categories
      .map(
        ([label, key, items], index) => `
          <button class="wtsrm-gallery-subtab${index === 0 ? " active" : ""}" type="button" role="tab" aria-selected="${index === 0}" aria-controls="${tabsId}-${group}-${key}" data-gallery-subtab="${tabsId}-${group}" data-gallery-target="${tabsId}-${group}-${key}">
            ${label}
          </button>`,
      )
      .join("");
  const panelMarkup = (categories, group) =>
    categories
      .map(
        ([label, key, items], index) => `
          <div class="wtsrm-gallery-group${index === 0 ? " active" : ""}" id="${tabsId}-${group}-${key}" role="tabpanel" data-gallery-panel="${tabsId}-${group}" ${index === 0 ? "" : "hidden"}>
            <div class="wtsrm-gallery-grid">${items.length ? galleryItemsMarkup(items) : '<p class="wtsrm-note">Belum ada item di kategori ini.</p>'}</div>
          </div>`,
      )
      .join("");
  const carCategories = [
    ["Extreme", "extreme", cars.extreme || []],
    ["Sport", "sport", cars.sport || []],
    ["Standard", "standard", cars.standard || []],
  ];
  const outfitCategories = [
    ["Laki-laki", "male", outfits.male || []],
    ["Perempuan", "female", outfits.female || []],
  ];
  const warehouseCategories = [
    ["Resource", "resource", warehouse.resource || []],
    ["Part", "part", warehouse.part || []],
    ["Decal", "decal", warehouse.decal || []],
    ["Materials", "materials", warehouse.materials || []],
    ["Car Blueprint", "car-blueprint", warehouse.carBlueprint || []],
  ];
  return `
    <section class="wtsrm-panel wtsrm-gallery-panel">
      <h2><i class="fa-solid fa-images"></i> Gallery isi akun</h2>
      <p class="wtsrm-note">Koleksi mobil dan outfit yang tersedia di akun ini.</p>
      <div class="wtsrm-gallery-tabs" role="tablist" aria-label="Jenis gallery">
        <button class="wtsrm-gallery-tab active" type="button" role="tab" aria-selected="true" aria-controls="${tabsId}-cars" data-gallery-tab="${tabsId}" data-gallery-target="${tabsId}-cars"><i class="fa-solid fa-car"></i> Mobil</button>
        <button class="wtsrm-gallery-tab" type="button" role="tab" aria-selected="false" aria-controls="${tabsId}-outfits" data-gallery-tab="${tabsId}" data-gallery-target="${tabsId}-outfits"><i class="fa-solid fa-shirt"></i> Outfit</button>
        <button class="wtsrm-gallery-tab" type="button" role="tab" aria-selected="false" aria-controls="${tabsId}-warehouse" data-gallery-tab="${tabsId}" data-gallery-target="${tabsId}-warehouse"><i class="fa-solid fa-boxes-stacked"></i> Warehouse</button>
      </div>
      <div class="wtsrm-gallery-main-panel active" id="${tabsId}-cars" role="tabpanel" data-gallery-panel="${tabsId}">
        <div class="wtsrm-gallery-subtabs" role="tablist" aria-label="Class mobil">${categoryMarkup(carCategories, "cars")}</div>
        ${panelMarkup(carCategories, "cars")}
      </div>
      <div class="wtsrm-gallery-main-panel" id="${tabsId}-outfits" role="tabpanel" data-gallery-panel="${tabsId}" hidden>
        <div class="wtsrm-gallery-subtabs" role="tablist" aria-label="Gender outfit">${categoryMarkup(outfitCategories, "outfits")}</div>
        ${panelMarkup(outfitCategories, "outfits")}
      </div>
      <div class="wtsrm-gallery-main-panel" id="${tabsId}-warehouse" role="tabpanel" data-gallery-panel="${tabsId}" hidden>
        <div class="wtsrm-gallery-subtabs" role="tablist" aria-label="Kategori warehouse">${categoryMarkup(warehouseCategories, "warehouse")}</div>
        ${panelMarkup(warehouseCategories, "warehouse")}
      </div>
    </section>`;
}

function initGalleryTabs() {
  document.querySelectorAll("[data-gallery-target]").forEach((tab) => {
    tab.addEventListener("click", () => {
      const group = tab.dataset.galleryTab || tab.dataset.gallerySubtab;
      const targetId = tab.dataset.galleryTarget;
      const isMainTab = Boolean(tab.dataset.galleryTab);
      const selector = isMainTab
        ? `[data-gallery-tab="${group}"]`
        : `[data-gallery-subtab="${group}"]`;
      document.querySelectorAll(selector).forEach((item) => {
        const active = item === tab;
        item.classList.toggle("active", active);
        item.setAttribute("aria-selected", String(active));
      });
      const panelSelector = isMainTab
        ? `[data-gallery-panel="${group}"]`
        : `[data-gallery-panel="${group}"]`;
      document.querySelectorAll(panelSelector).forEach((panel) => {
        const active = panel.id === targetId;
        panel.classList.toggle("active", active);
        panel.hidden = !active;
      });
    });
  });
}

function detailMarkup(account) {
  const statItems = [
    ["Level akun", account.level, "fa-layer-group"],
    ["Rank / tier tertinggi", account.highestRank, "fa-trophy"],
    ["Total balapan", account.totalRaces, "fa-flag-checkered"],
    ["Win rate", account.winRate, "fa-chart-line"],
  ];
  const statMarkup = statItems
    .map(
      ([label, value, icon]) =>
        `<div class="wtsrm-stat"><i class="fa-solid ${icon}"></i><span>${label}</span><strong>${value}</strong></div>`,
    )
    .join("");
  return `
    <a class="wtsrm-back" href="/wtsrm/"><i class="fa-solid fa-arrow-left"></i> Kembali ke katalog</a>
    <div class="wtsrm-detail-hero">
      <div>
        <span class="wtsrm-eyebrow">LISTING #${account.id} · ${account.server} SERVER</span>
        <h1>${account.title}</h1>
        <p>Akun Racing Master siap transfer dengan proses verifikasi dan pendampingan admin via <b>Discord</b> jika diperlukan.</p>
      </div>
      <div class="wtsrm-price-box"><span>${account.priceType === "nego" ? "HARGA NEGO" : "HARGA FIXED"}</span><strong>${account.price}</strong></div>
    </div>
    <div class="wtsrm-detail-grid">
      <section class="wtsrm-panel"><h2><i class="fa-solid fa-id-card"></i> Detail akun</h2><dl class="wtsrm-details"><div><dt>Server</dt><dd>${account.server}</dd></div><div><dt>Metode login</dt><dd>${account.loginMethod}</dd></div><div><dt>Status keamanan</dt><dd>${account.security}</dd></div></dl></section>
      <section class="wtsrm-panel"><h2><i class="fa-solid fa-chart-simple"></i> Statistik progres</h2><div class="wtsrm-stat-grid">${statMarkup}</div></section>
    </div>
    <section class="wtsrm-panel wtsrm-transaction"><h2><i class="fa-solid fa-money-check-dollar"></i> Transaksi</h2><div class="wtsrm-transaction-row"><div><p class="wtsrm-eyebrow">METODE PEMBAYARAN</p><div class="wtsrm-payment-list">${account.paymentMethods.map((method) => `<span>${method}</span>`).join("")}</div><p class="wtsrm-note">${account.note}</p></div><a class="wtsrm-button wtsrm-whatsapp" href="${whatsappUrl(account)}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> KONTAK LANGSUNG</a></div></section>
    ${galleryMarkup(account)}
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  applySavedTheme();
  const catalog = document.getElementById("wtsrm-catalog");
  const detail = document.getElementById("wtsrm-detail");
  if (catalog) {
    const activeAccounts = getActiveAccounts();
    catalog.innerHTML = activeAccounts.length
      ? activeAccounts.map(accountCard).join("")
      : '<p class="wtsrm-note wtsrm-empty-state">Belum ada akun aktif.</p>';
  }
  if (detail) {
    const accountId = window.location.pathname.split("/").filter(Boolean).pop();
    const account = wtsrmAccounts[accountId];
    detail.innerHTML = account?.active
      ? detailMarkup(account)
      : `<div class="wtsrm-panel"><h1>Akun tidak tersedia</h1><p class="wtsrm-note">Listing yang kamu cari belum aktif atau sudah dipindahkan.</p><a class="wtsrm-button" href="/wtsrm/">KEMBALI KE KATALOG</a></div>`;
    if (account?.active) {
      initGalleryTabs();
      initGalleryLightbox();
    }
  }
});
