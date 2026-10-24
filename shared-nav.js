// ══════════════════════════════════════════════════════════════════
// SHARED NAVIGATION & TOAST CONTROLLER
// ══════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  initSharedHeader();
  initToastSystem();
});

function initSharedHeader() {
  const burger = document.getElementById('sharedBurger');
  const sideNav = document.getElementById('sharedSideNav');
  const overlay = document.getElementById('sharedOverlay');

  if (burger && sideNav && overlay) {
    let isOpen = false;

    const openDrawer = () => {
      isOpen = true;
      burger.classList.add('open');
      sideNav.classList.add('open');
      overlay.classList.add('show');
      document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
      isOpen = false;
      burger.classList.remove('open');
      sideNav.classList.remove('open');
      overlay.classList.remove('show');
      document.body.style.overflow = '';
    };

    burger.addEventListener('click', () => {
      if (isOpen) closeDrawer();
      else openDrawer();
    });

    overlay.addEventListener('click', closeDrawer);
  }

  // Highlight active header link based on current path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.header-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

function showToast(message, duration = 3000) {
  let toast = document.getElementById('cmsToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cmsToast';
    toast.className = 'cms-toast';
    toast.innerHTML = `<span class="toast-shape"></span><span id="cmsToastMsg"></span>`;
    document.body.appendChild(toast);
  }

  const msgEl = document.getElementById('cmsToastMsg');
  if (msgEl) msgEl.textContent = message;

  toast.classList.add('show');

  if (window._toastTimeout) clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

function initToastSystem() {
  window.showToast = showToast;
}
