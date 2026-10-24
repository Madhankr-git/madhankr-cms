// ══════════════════════════════════════════════════════════════════
// GALLERY & VISUAL LAB CONTROLLER
// ══════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  initGallery();
});

let currentGalCategory = 'all';
let currentLightboxIdx = 0;
let displayedGalleryItems = [];

function initGallery() {
  const filterButtons = document.querySelectorAll('#galleryFilterPills .cat-btn');

  renderGallery();

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentGalCategory = btn.dataset.category;
      renderGallery();
    });
  });

  // Keyboard navigation for lightbox
  window.addEventListener('keydown', (e) => {
    const overlay = document.getElementById('galleryLightbox');
    if (!overlay || !overlay.classList.contains('open')) return;

    if (e.key === 'Escape') closeLightboxDirect();
    if (e.key === 'ArrowRight') cycleLightbox(1);
    if (e.key === 'ArrowLeft') cycleLightbox(-1);
  });
}

function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  displayedGalleryItems = window.CMSData ? window.CMSData.getGalleryItems(currentGalCategory) : [];

  if (displayedGalleryItems.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 60px 20px; text-align: center; background: var(--bg-surface); border: 1.5px dashed var(--sky-border);">
        <h3 style="font-size: 20px; font-weight: 800; margin-bottom: 8px;">No experiments found</h3>
        <p style="color: var(--text-muted); font-size: 14px;">Select another category from above.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = displayedGalleryItems.map((item, idx) => {
    return `
      <div class="gallery-card" onclick="openLightbox(${idx})">
        <div class="gal-visual-box">
          <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
            ${getGeometricVisual(item)}
          </div>
        </div>

        <div class="gal-card-info">
          <div>
            <div style="font-family: var(--font-mono); font-size: 10px; color: var(--sky-blue); font-weight: 800; letter-spacing: 0.15em; margin-bottom: 6px;">
              [ ${item.category.toUpperCase()} ]
            </div>
            <h3 class="gal-title">${item.title}</h3>
          </div>

          <div class="gal-meta-row">
            <span>${item.tools}</span>
            <span>${item.year}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function getGeometricVisual(item) {
  const color = item.color || '#38bdf8';
  if (item.category === 'Generative AI') {
    return `
      <div style="width: 80%; height: 65%; background: #090a0f; border: 2px solid ${color}; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; overflow: hidden;">
        <div style="width: 60px; height: 60px; border-radius: 50%; background: ${color}; opacity: 0.85; position: absolute; bottom: -20px; right: -20px;"></div>
        <div style="width: 80px; height: 40px; border-radius: 40px 40px 0 0; background: var(--sky-solid); opacity: 0.7;"></div>
        <span style="font-family: var(--font-mono); font-size: 10px; color: #ffffff; letter-spacing: 0.2em; z-index: 2; margin-top: 10px;">PROMPT SYNTHESIS</span>
      </div>
    `;
  } else if (item.category === 'Motion & 3D') {
    return `
      <div style="display: flex; gap: 14px; align-items: center;">
        <div style="width: 50px; height: 50px; background: ${color}; transform: rotate(45deg); box-shadow: 0 4px 12px rgba(2, 132, 199, 0.2);"></div>
        <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--dark-solid);"></div>
      </div>
    `;
  } else if (item.category === 'UI Experiments') {
    return `
      <div style="width: 75%; height: 60%; background: #ffffff; border: 1.5px solid var(--sky-border); box-shadow: 4px 4px 0 var(--sky-solid); padding: 12px; display: flex; flex-direction: column; gap: 8px;">
        <div style="width: 40%; height: 8px; background: ${color};"></div>
        <div style="width: 100%; height: 6px; background: var(--bg-hover);"></div>
        <div style="width: 70%; height: 6px; background: var(--bg-hover);"></div>
      </div>
    `;
  } else {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
        <div style="width: 54px; height: 54px; background: ${color}; box-shadow: 0 0 0 8px var(--sky-tint);"></div>
        <div style="width: 70px; height: 6px; background: var(--dark-solid);"></div>
      </div>
    `;
  }
}

function openLightbox(idx) {
  if (!displayedGalleryItems[idx]) return;
  currentLightboxIdx = idx;
  const item = displayedGalleryItems[idx];

  const overlay = document.getElementById('galleryLightbox');
  const visualArea = document.getElementById('lightboxVisual');
  const catEl = document.getElementById('lbCategory');
  const yearEl = document.getElementById('lbYear');
  const titleEl = document.getElementById('lbTitle');
  const descEl = document.getElementById('lbDescription');
  const toolsEl = document.getElementById('lbTools');
  const aspectEl = document.getElementById('lbAspect');

  if (catEl) catEl.textContent = item.category.toUpperCase();
  if (yearEl) yearEl.textContent = item.year;
  if (titleEl) titleEl.textContent = item.title;
  if (descEl) descEl.textContent = item.description;
  if (toolsEl) toolsEl.textContent = item.tools;
  if (aspectEl) aspectEl.textContent = item.aspect || '1/1';

  if (visualArea) {
    visualArea.innerHTML = `
      <div style="transform: scale(1.4);">
        ${getGeometricVisual(item)}
      </div>
    `;
  }

  if (overlay) {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function cycleLightbox(delta) {
  if (displayedGalleryItems.length === 0) return;
  currentLightboxIdx = (currentLightboxIdx + delta + displayedGalleryItems.length) % displayedGalleryItems.length;
  openLightbox(currentLightboxIdx);
}

function closeLightboxDirect() {
  const overlay = document.getElementById('galleryLightbox');
  if (overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function closeLightbox(e) {
  if (e.target.id === 'galleryLightbox') {
    closeLightboxDirect();
  }
}

// Global expose
window.openLightbox = openLightbox;
window.cycleLightbox = cycleLightbox;
window.closeLightbox = closeLightbox;
window.closeLightboxDirect = closeLightboxDirect;
