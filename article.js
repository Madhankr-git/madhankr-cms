// ══════════════════════════════════════════════════════════════════
// ARTICLE READING PAGE CONTROLLER
// Reading progress, dynamic data binding, and CMS editor handoff
// ══════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  initReadingProgress();
  initArticleData();
});

let currentArticleId = 'ai-meaningful-craft';

function initReadingProgress() {
  const progressBar = document.getElementById('readingProgress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
  });
}

function initArticleData() {
  const params = new URLSearchParams(window.location.search);
  let requestedId = params.get('id');
  if (!requestedId) {
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (parts.length >= 2 && (parts[0] === 'journal' || parts[0] === 'article')) {
      requestedId = parts[1].replace('.html', '');
    }
  }
  requestedId = requestedId || 'ai-meaningful-craft';
  currentArticleId = requestedId;

  if (window.CMSData) {
    const article = window.CMSData.getArticleById(requestedId);
    if (article) {
      document.title = `${article.title} — MadhanKR`;
      
      const titleEl = document.getElementById('articleTitle');
      const summaryEl = document.getElementById('articleSummary');
      const catBreadcrumb = document.getElementById('articleCategoryBreadcrumb');
      const catTag = document.getElementById('articleCategoryTag');
      const dateEl = document.getElementById('articleDate');
      const bodyEl = document.getElementById('articleBody');
      if (titleEl) titleEl.textContent = article.title;
      if (summaryEl) summaryEl.textContent = article.summary;
      if (catBreadcrumb) catBreadcrumb.textContent = (article.category || 'JOURNAL').toUpperCase();
      if (catTag) catTag.textContent = `[ ${article.category.toUpperCase()} ]`;
      if (dateEl) dateEl.textContent = `${article.date} · ${article.readTime || '5 MIN READ'}`;

      // If the article has custom HTML content, render it
      if (article.content && bodyEl && article.id !== 'ai-meaningful-craft') {
        bodyEl.innerHTML = parseMarkdownToHtml(article.content);
        generateTableOfContents();
      }
    }
  }

  updateBookmarkButton();
}

function parseMarkdownToHtml(md) {
  if (!md) return '';
  let html = md
    .replace(/^### (.*$)/gim, '<h3 id="sec-$1">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 id="sec-$1">$1</h2>')
    .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/\n\n/gim, '</p><p>');

  return `<p>${html}</p>`;
}

function generateTableOfContents() {
  const headings = document.querySelectorAll('#articleBody h2, #articleBody h3');
  const tocList = document.getElementById('tocList');
  if (!tocList || headings.length === 0) return;

  tocList.innerHTML = Array.from(headings).map((h, i) => {
    const id = h.id || `heading-${i}`;
    h.id = id;
    return `<li><a href="#${id}"><span class="toc-dot"></span> 0${i + 1} / ${h.textContent}</a></li>`;
  }).join('');
}

function copyArticleShareLink() {
  const url = window.location.href;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      if (window.showToast) window.showToast('Article URL copied to clipboard! ■');
    });
  } else {
    if (window.showToast) window.showToast('Share link ready: ' + url);
  }
}

function toggleCurrentBookmark() {
  let saved = JSON.parse(localStorage.getItem('madhankr_saved_articles') || '[]');
  if (saved.includes(currentArticleId)) {
    saved = saved.filter(id => id !== currentArticleId);
    if (window.showToast) window.showToast('Removed from reading list');
  } else {
    saved.push(currentArticleId);
    if (window.showToast) window.showToast('Saved to reading list ★');
  }
  localStorage.setItem('madhankr_saved_articles', JSON.stringify(saved));
  updateBookmarkButton();
}

function updateBookmarkButton() {
  const saved = JSON.parse(localStorage.getItem('madhankr_saved_articles') || '[]');
  const isSaved = saved.includes(currentArticleId);
  const icon = document.getElementById('bookmarkIcon');
  const label = document.getElementById('bookmarkLabel');
  if (icon) icon.textContent = isSaved ? '★' : '☆';
  if (label) label.textContent = isSaved ? 'Saved' : 'Bookmark';
}
