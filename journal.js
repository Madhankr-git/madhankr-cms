// ══════════════════════════════════════════════════════════════════
// JOURNAL PAGE CONTROLLER
// Powered by central CMSData engine with live filtering
// ══════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  initJournal();
});

let currentCategory = 'all';
let currentSearch = '';
let savedBookmarks = JSON.parse(localStorage.getItem('madhankr_saved_articles') || '[]');

function initJournal() {
  const searchInput = document.getElementById('journalSearchInput');
  const catButtons = document.querySelectorAll('.cat-btn');

  // Load and render
  renderArticles();
  updateCategoryBadges();

  // Search event with instant debouncing
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      renderArticles();
    });
  }

  // Category buttons
  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      renderArticles();
    });
  });
}

function updateCategoryBadges() {
  const articles = window.CMSData ? window.CMSData.getArticles({ status: 'published' }) : [];
  
  const counts = {
    all: articles.length,
    'ai-workflows': articles.filter(a => a.categorySlug === 'ai-workflows').length,
    'design': articles.filter(a => a.categorySlug === 'design').length,
    'engineering': articles.filter(a => a.categorySlug === 'engineering').length,
    'philosophy': articles.filter(a => a.categorySlug === 'philosophy').length
  };

  document.querySelectorAll('.cat-btn').forEach(btn => {
    const cat = btn.dataset.category;
    const badge = btn.querySelector('.cat-badge');
    if (badge && counts[cat] !== undefined) {
      badge.textContent = `(${counts[cat]})`;
    }
  });
}

function renderArticles() {
  const container = document.getElementById('journalGrid');
  const countLabel = document.getElementById('resultCountLabel');
  if (!container) return;

  const articles = window.CMSData ? window.CMSData.getArticles({
    category: currentCategory,
    search: currentSearch,
    status: 'published'
  }) : [];

  if (countLabel) {
    countLabel.textContent = `ARTICLES (${articles.length})`;
  }

  if (articles.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 60px 20px; text-align: center; background: var(--bg-surface); border: 1.5px dashed var(--sky-border);">
        <div style="width: 24px; height: 24px; background: var(--sky-solid); margin: 0 auto 16px;"></div>
        <h3 style="font-size: 20px; font-weight: 800; margin-bottom: 8px;">No matching articles found</h3>
        <p style="color: var(--text-muted); font-size: 14px;">Try searching for other terms like 'design', 'code', or clear your active category filter.</p>
        <button class="ghost-btn" style="margin-top: 20px; font-size: 12px; padding: 10px 20px;" onclick="resetJournalFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = articles.map(art => {
    const isSaved = savedBookmarks.includes(art.id);
    const motifClass = art.motif || 'sq';
    const tagsHtml = (art.tags || []).map(t => `<span class="art-tag">#${t}</span>`).join('');

    return `
      <article class="article-item" id="card-${art.id}">
        <div>
          <div class="art-top">
            <div class="art-meta">
              <span class="art-motif ${motifClass}"></span>
              <span>${art.category.toUpperCase()}</span>
            </div>
            <span class="art-readtime">${art.readTime || '5 MIN READ'}</span>
          </div>

          <a href="article.html?id=${art.id}">
            <h2 class="art-title">${art.title}</h2>
          </a>

          <p class="art-summary">${art.summary}</p>
        </div>

        <div>
          <div class="art-tags">
            ${tagsHtml}
          </div>

          <div class="art-bottom">
            <a href="article.html?id=${art.id}" class="art-read-btn">
              <span>Read Essay</span>
              <span>→</span>
            </a>
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-family: var(--font-mono); font-size: 10px; color: var(--grey-text);">${art.date}</span>
              <button class="bookmark-btn ${isSaved ? 'saved' : ''}" onclick="toggleBookmark('${art.id}', this)" title="${isSaved ? 'Saved to reading list' : 'Bookmark for later'}">
                ${isSaved ? '★' : '☆'}
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function resetJournalFilters() {
  currentCategory = 'all';
  currentSearch = '';
  const searchInput = document.getElementById('journalSearchInput');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('.cat-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.category === 'all');
  });
  renderArticles();
}

function toggleBookmark(id, btn) {
  if (savedBookmarks.includes(id)) {
    savedBookmarks = savedBookmarks.filter(item => item !== id);
    btn.classList.remove('saved');
    btn.innerHTML = '☆';
    if (window.showToast) window.showToast('Article removed from reading list');
  } else {
    savedBookmarks.push(id);
    btn.classList.add('saved');
    btn.innerHTML = '★';
    if (window.showToast) window.showToast('Article saved to reading list ★');
  }
  localStorage.setItem('madhankr_saved_articles', JSON.stringify(savedBookmarks));
}
