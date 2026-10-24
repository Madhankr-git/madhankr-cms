// ══════════════════════════════════════════════════════════════════
// PUBLIC WEBSITE LAYOUT & NAVIGATION CONTROLLER
// Dedicated solely to the public portfolio.
// ══════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  initPublicNavigation();
});

function initPublicNavigation() {
  const burger = document.getElementById('publicBurger');
  const drawer = document.getElementById('publicDrawer');
  const overlay = document.getElementById('publicOverlay');

  if (burger && drawer && overlay) {
    let isOpen = false;

    const openDrawer = () => {
      isOpen = true;
      burger.classList.add('open');
      drawer.classList.add('open');
      overlay.classList.add('show');
      document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
      isOpen = false;
      burger.classList.remove('open');
      drawer.classList.remove('open');
      overlay.classList.remove('show');
      document.body.style.overflow = '';
    };

    burger.addEventListener('click', () => {
      if (isOpen) closeDrawer();
      else openDrawer();
    });

    overlay.addEventListener('click', closeDrawer);

    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // Highlight active link based on current path
  const currentPath = window.location.pathname.split('/').filter(Boolean).pop() || 'index.html';
  const cleanCurrent = currentPath.replace('.html', '') || 'index';
  document.querySelectorAll('.public-nav-link, .drawer-nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const cleanHref = href.split('#')[0].replace('.html', '') || 'index';
    if (cleanHref === cleanCurrent || (cleanCurrent === 'index' && (cleanHref === '' || cleanHref === 'index' || cleanHref === '/'))) {
      link.classList.add('active');
    }
  });
}
