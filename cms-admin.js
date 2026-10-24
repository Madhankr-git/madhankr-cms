// ══════════════════════════════════════════════════════════════════
// MADHANKR PERSONAL CMS — ADMIN LOGIC & INTERACTION ENGINE
// ══════════════════════════════════════════════════════════════════

const AUTH_SESSION_KEY = 'madhankr_admin_session';

function getAdminSession() {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY) || sessionStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data && data.authenticated ? data : null;
  } catch (e) {
    return null;
  }
}

function isUserAuthenticated() {
  return !!getAdminSession();
}

function initAdminAuth() {
  const session = getAdminSession();
  if (!session) {
    const returnTarget = encodeURIComponent(window.location.hash || '');
    window.location.replace('login.html' + (returnTarget ? '?return=' + returnTarget : ''));
    return;
  }

  if (session.email) {
    const emailName = session.email.split('@')[0];
    const displayName = session.displayName || (emailName.charAt(0).toUpperCase() + emailName.slice(1));
    const nameEl = document.getElementById('adminUserDisplayName');
    const avatarEl = document.getElementById('adminUserAvatar');
    if (nameEl) nameEl.textContent = displayName;
    if (avatarEl) avatarEl.textContent = displayName.charAt(0).toUpperCase();
  }
}

function handleAdminLogout(e) {
  if (e) e.preventDefault();
  try {
    localStorage.removeItem(AUTH_SESSION_KEY);
    sessionStorage.removeItem(AUTH_SESSION_KEY);
  } catch (err) {}
  window.location.href = 'login.html?loggedout=true';
}

document.addEventListener('DOMContentLoaded', () => {
  initAdminAuth();
  initAdminRouter();
  initSidebar();
  initDashboardView();
  initContentManager();
  initContentEditor();
  initMediaLibrary();
  initSeoSettings();
  initSiteSettings();
  updateGlobalSidebarBadges();
});

// ─── 1. ROUTER & VIEW SWITCHING ──────────────────────────────────
let activeView = 'dashboard';

function initAdminRouter() {
  let view = 'dashboard';
  let targetEditorId = null;

  // 1. Path-based route groups: /admin, /admin/content, /admin/editor/:id, /admin/media, /admin/seo, /admin/settings
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const adminIndex = pathParts.indexOf('admin');
  if (adminIndex !== -1 && pathParts[adminIndex + 1]) {
    const subRoute = pathParts[adminIndex + 1];
    if (['dashboard', 'content', 'editor', 'media', 'seo', 'settings'].includes(subRoute)) {
      view = subRoute;
      if (subRoute === 'editor' && pathParts[adminIndex + 2]) {
        targetEditorId = pathParts[adminIndex + 2];
      }
    }
  }

  // 2. Hash-based routing: #content, #editor?id=..., #media, #seo, #settings
  if (window.location.hash) {
    const hash = window.location.hash.replace('#', '');
    const cleanHash = hash.split('?')[0];
    if (cleanHash && ['dashboard', 'content', 'editor', 'media', 'seo', 'settings'].includes(cleanHash)) {
      view = cleanHash;
    }
    const hashQuery = hash.includes('?') ? hash.split('?')[1] : '';
    const params = new URLSearchParams(hashQuery);
    if (params.get('id')) {
      targetEditorId = params.get('id');
    }
  }

  switchAdminView(view);
  if (view === 'editor' && targetEditorId) {
    setTimeout(() => loadArticleIntoEditor(targetEditorId), 50);
  }

  window.addEventListener('hashchange', () => {
    const currentHash = window.location.hash.replace('#', '') || 'dashboard';
    const baseView = currentHash.split('?')[0];
    switchAdminView(baseView);
  });
}

function switchAdminView(viewName) {
  const targetView = document.getElementById(`view-${viewName}`);
  if (!targetView) viewName = 'dashboard';

  activeView = viewName;

  // Update nav links active state
  document.querySelectorAll('.admin-nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.view === viewName);
  });

  // Toggle views
  document.querySelectorAll('.admin-view').forEach(view => {
    view.classList.remove('active');
  });
  const activeEl = document.getElementById(`view-${viewName}`);
  if (activeEl) activeEl.classList.add('active');

  // Breadcrumb
  const breadcrumb = document.getElementById('currentViewBreadcrumb');
  if (breadcrumb) {
    breadcrumb.textContent = viewName.toUpperCase();
  }

  // Close mobile sidebar if open
  const sidebar = document.getElementById('adminSidebar');
  if (sidebar) sidebar.classList.remove('open');

  // View specific refreshes
  if (viewName === 'dashboard') refreshDashboardStats();
  if (viewName === 'content') renderContentTable();
  if (viewName === 'media') renderMediaGrid();
  if (viewName === 'seo') loadSeoForPage(document.getElementById('seoPageSelect')?.value || 'homepage');
}

function initSidebar() {
  const toggleBtn = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('adminSidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
}

function updateGlobalSidebarBadges() {
  const articlesBadge = document.getElementById('sidebarArticlesCount');
  const mediaBadge = document.getElementById('sidebarMediaCount');
  if (window.CMSData) {
    const articles = window.CMSData.getArticles();
    const media = window.CMSData.getMediaAssets();
    if (articlesBadge) articlesBadge.textContent = articles.length;
    if (mediaBadge) mediaBadge.textContent = media.length;
  }
}

// ─── 2. DASHBOARD VIEW CONTROLLER ────────────────────────────────
function initDashboardView() {
  renderAnalyticsChart();
  renderActivityList();
  refreshDashboardStats();
}

function refreshDashboardStats() {
  if (!window.CMSData) return;
  const stats = window.CMSData.getStats();
  const articles = window.CMSData.getArticles();
  const projects = window.CMSData.getProjects();
  const media = window.CMSData.getMediaAssets();

  const monthlyViewsEl = document.getElementById('statMonthlyViews');
  const totalArticlesEl = document.getElementById('statTotalArticles');
  const totalProjectsEl = document.getElementById('statTotalProjects');
  const totalMediaEl = document.getElementById('statTotalMedia');

  if (monthlyViewsEl) monthlyViewsEl.textContent = stats.monthlyViews || '18.4K';
  if (totalArticlesEl) totalArticlesEl.textContent = articles.length;
  if (totalProjectsEl) totalProjectsEl.textContent = projects.length;
  if (totalMediaEl) totalMediaEl.textContent = media.length;

  renderActivityList();
  updateGlobalSidebarBadges();
}

function renderAnalyticsChart() {
  const chartWrap = document.getElementById('analyticsBars');
  if (!chartWrap) return;

  const daysData = [
    { day: 'Sun', height: 48, count: '3,410', highlight: false },
    { day: 'Mon', height: 65, count: '5,120', highlight: false },
    { day: 'Tue', height: 95, count: '8,162', highlight: true },
    { day: 'Wed', height: 52, count: '4,280', highlight: false },
    { day: 'Thu', height: 72, count: '5,940', highlight: false },
    { day: 'Fri', height: 44, count: '3,610', highlight: false },
    { day: 'Sat', height: 58, count: '4,830', highlight: false }
  ];

  chartWrap.innerHTML = daysData.map(item => `
    <div class="weekly-day-col ${item.highlight ? 'highlight' : ''}" title="${item.day}: ${item.count} active visits">
      ${item.highlight ? `<span class="weekly-highlight-badge">${item.count}</span>` : ''}
      <div class="weekly-bar-pill" style="height: ${item.height}%;"></div>
      <span class="weekly-day-label">${item.day}</span>
    </div>
  `).join('');
}

function renderActivityList() {
  const listEl = document.getElementById('dashboardActivityList');
  if (!listEl || !window.CMSData) return;

  const activities = window.CMSData.getActivityLog();
  listEl.innerHTML = activities.slice(0, 4).map(act => `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--cms-border-subtle); font-size: 12.5px;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--cms-primary); flex-shrink: 0;"></span>
        <div>
          <strong style="color: var(--cms-text-heading);">${act.action}:</strong> 
          <span style="color: var(--cms-text-body);">${act.target}</span>
        </div>
      </div>
      <span style="font-size: 11px; color: var(--cms-text-subtle); white-space: nowrap; margin-left: 10px;">${act.timestamp}</span>
    </div>
  `).join('');
}

function handleQuickDraftSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('quickDraftTitle').value.trim();
  const category = document.getElementById('quickDraftCategory').value;
  const content = document.getElementById('quickDraftContent').value.trim();

  if (!title || !content) return;

  const newArticle = {
    title,
    category,
    summary: content.slice(0, 120) + (content.length > 120 ? '...' : ''),
    content: `## ${title}\n\n${content}`,
    status: 'draft',
    readTime: '3 min read',
    motif: 'sq',
    tags: [category, 'Draft']
  };

  window.CMSData.saveArticle(newArticle);
  document.getElementById('quickDraftForm').reset();
  refreshDashboardStats();

  if (window.showToast) window.showToast('Quick draft saved to CMS! ■');
}

// ─── 3. CONTENT MANAGER VIEW CONTROLLER ───────────────────────────
let currentContentTab = 'articles';
let currentContentSearch = '';
let currentContentStatus = 'all';

function initContentManager() {
  const tabs = document.querySelectorAll('#contentTabs .cat-btn');
  const searchInput = document.getElementById('contentSearchInput');
  const statusFilter = document.getElementById('contentStatusFilter');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentContentTab = tab.dataset.type;
      renderContentTable();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentContentSearch = e.target.value.toLowerCase().trim();
      renderContentTable();
    });
  }

  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      currentContentStatus = e.target.value;
      renderContentTable();
    });
  }

  renderContentTable();
}

function renderContentTable() {
  const tbody = document.getElementById('contentTableBody');
  if (!tbody || !window.CMSData) return;

  let items = [];
  if (currentContentTab === 'articles') {
    items = window.CMSData.getArticles();
  } else {
    items = window.CMSData.getProjects();
  }

  // Update tab badges
  const artBadge = document.getElementById('tabArticlesBadge');
  const projBadge = document.getElementById('tabProjectsBadge');
  if (artBadge) artBadge.textContent = `(${window.CMSData.getArticles().length})`;
  if (projBadge) projBadge.textContent = `(${window.CMSData.getProjects().length})`;

  // Apply search
  if (currentContentSearch) {
    items = items.filter(it => 
      it.title.toLowerCase().includes(currentContentSearch) ||
      (it.category && it.category.toLowerCase().includes(currentContentSearch))
    );
  }

  // Apply status filter for articles
  if (currentContentTab === 'articles' && currentContentStatus !== 'all') {
    items = items.filter(it => it.status === currentContentStatus);
  }

  if (items.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 40px; color: var(--grey-text);">
          No matching records found in this view.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = items.map(item => {
    const isArticle = currentContentTab === 'articles';
    const status = item.status || 'published';
    const dateOrYear = item.date || item.year || '2026';
    const views = item.views ? `${item.views.toLocaleString()}` : 'Active';

    return `
      <tr>
        <td><input type="checkbox" /></td>
        <td class="post-title-cell">
          <strong><a href="#" onclick="editContentItem('${item.id}', '${currentContentTab}'); return false;">${item.title}</a></strong>
          <div class="row-actions">
            <span class="edit"><a href="#" onclick="editContentItem('${item.id}', '${currentContentTab}'); return false;">Edit</a> | </span>
            <span class="inline"><a href="#" onclick="duplicateContentItem('${item.id}', '${currentContentTab}'); return false;">Duplicate</a> | </span>
            <span class="trash"><a href="#" onclick="deleteContentItem('${item.id}', '${currentContentTab}'); return false;">Trash</a> | </span>
            <span class="view"><a href="${isArticle ? `../article.html?id=${item.id}` : `../work.html`}" target="_blank">View</a></span>
          </div>
        </td>
        <td>
          <span style="color: var(--wp-primary); font-weight: 500;">
            ${item.category || item.tag}
          </span>
        </td>
        <td>
          <span class="status-pill ${status}">
            ${status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </td>
        <td style="color: var(--wp-text-muted); font-size: 12px;">
          ${dateOrYear}
        </td>
        <td style="font-weight: 600; font-size: 12px;">
          ${views}
        </td>
      </tr>
    `;
  }).join('');
}

function editContentItem(id, type) {
  if (type === 'articles') {
    loadArticleIntoEditor(id);
    switchAdminView('editor');
  } else {
    if (window.showToast) window.showToast('Loaded project parameters: ' + id);
  }
}

function duplicateContentItem(id, type) {
  if (type === 'articles') {
    const orig = window.CMSData.getArticleById(id);
    if (!orig) return;
    const clone = {
      ...orig,
      id: 'art-' + Date.now(),
      title: `${orig.title} (Copy)`,
      status: 'draft',
      views: 0
    };
    window.CMSData.saveArticle(clone);
    renderContentTable();
    refreshDashboardStats();
    if (window.showToast) window.showToast('Article duplicated as draft! ■');
  } else {
    const orig = window.CMSData.getProjectById(id);
    if (!orig) return;
    const clone = {
      ...orig,
      id: 'proj-' + Date.now(),
      title: `${orig.title} (Clone)`
    };
    window.CMSData.saveProject(clone);
    renderContentTable();
    refreshDashboardStats();
    if (window.showToast) window.showToast('Project duplicated successfully!');
  }
}

function deleteContentItem(id, type) {
  if (!confirm('Are you sure you want to delete this record? This action cannot be undone.')) return;

  if (type === 'articles') {
    window.CMSData.deleteArticle(id);
    renderContentTable();
    refreshDashboardStats();
    if (window.showToast) window.showToast('Article deleted from CMS');
  } else {
    window.CMSData.deleteProject(id);
    renderContentTable();
    refreshDashboardStats();
    if (window.showToast) window.showToast('Project deleted from CMS');
  }
}

// ─── 4. CONTENT EDITOR VIEW CONTROLLER ────────────────────────────
let editingArticleId = 'ai-meaningful-craft';

function initContentEditor() {
  syncEditorPreview();
}

function loadArticleIntoEditor(id) {
  const article = window.CMSData.getArticleById(id);
  if (!article) return;

  editingArticleId = article.id;
  document.getElementById('editorTitleInput').value = article.title;
  document.getElementById('editorCategorySelect').value = article.category;
  document.getElementById('editorStatusSelect').value = article.status || 'published';
  document.getElementById('editorMarkdown').value = article.content || '';
  document.getElementById('editorReadTimeInput').value = article.readTime || '5 min read';

  const previewLink = document.getElementById('previewLivePageLink');
  if (previewLink) {
    previewLink.href = `article.html?id=${article.id}`;
  }

  syncEditorPreview();
}

function syncEditorPreview() {
  const title = document.getElementById('editorTitleInput')?.value || '';
  const text = document.getElementById('editorMarkdown')?.value || '';
  const preview = document.getElementById('editorLivePreview');
  const statsEl = document.getElementById('editorStats');
  const readTimeInput = document.getElementById('editorReadTimeInput');

  // Word & Char counting
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  if (statsEl) {
    statsEl.textContent = `Words: ${words} · Characters: ${chars}`;
  }

  const estMins = Math.max(1, Math.ceil(words / 180));
  if (readTimeInput) {
    readTimeInput.value = `${estMins} min read`;
  }

  if (preview) {
    let html = text
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\n\n/gim, '</p><p>');

    preview.innerHTML = `
      <h1 style="font-size: 26px; font-weight: 900; margin-bottom: 20px;">${title}</h1>
      <p>${html}</p>
    `;
  }
}

function applyFormat(type) {
  const textarea = document.getElementById('editorMarkdown');
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.substring(start, end);

  let replacement = '';
  switch (type) {
    case 'bold': replacement = `**${selected || 'bold text'}**`; break;
    case 'italic': replacement = `*${selected || 'italic text'}*`; break;
    case 'h2': replacement = `\n## ${selected || 'Section Heading'}\n`; break;
    case 'h3': replacement = `\n### ${selected || 'Sub-heading'}\n`; break;
    case 'quote': replacement = `\n> "${selected || 'Memorable pull quote here'}"\n`; break;
    case 'code': replacement = `\`${selected || 'code snippet'}\``; break;
    case 'bullet': replacement = `\n- ${selected || 'Key bullet point'}\n`; break;
  }

  textarea.setRangeText(replacement, start, end, 'end');
  textarea.focus();
  syncEditorPreview();
}

function saveEditorPost(forcedStatus) {
  const title = document.getElementById('editorTitleInput').value.trim();
  const category = document.getElementById('editorCategorySelect').value;
  const status = forcedStatus || document.getElementById('editorStatusSelect').value;
  const content = document.getElementById('editorMarkdown').value;
  const readTime = document.getElementById('editorReadTimeInput').value;

  if (!title) {
    alert('Please specify a title for the document.');
    return;
  }

  const articleRecord = {
    id: editingArticleId || 'art-' + Date.now(),
    title,
    category,
    status,
    content,
    readTime,
    summary: content.slice(0, 140).replace(/#/g, '') + '...',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()
  };

  window.CMSData.saveArticle(articleRecord);
  refreshDashboardStats();
  updateGlobalSidebarBadges();

  const previewLink = document.getElementById('previewLivePageLink');
  if (previewLink) {
    previewLink.href = `article.html?id=${articleRecord.id}`;
  }

  if (window.showToast) {
    window.showToast(`Article successfully saved as ${status.toUpperCase()}! ■`);
  }
}

// ─── 5. MEDIA LIBRARY VIEW CONTROLLER ─────────────────────────────
let currentMediaCategory = 'all';
let currentMediaSearch = '';

function initMediaLibrary() {
  const searchInput = document.getElementById('mediaSearchInput');
  const catButtons = document.querySelectorAll('#mediaFilterPills .cat-btn');

  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMediaCategory = btn.dataset.cat;
      renderMediaGrid();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentMediaSearch = e.target.value;
      renderMediaGrid();
    });
  }

  renderMediaGrid();
}

function renderMediaGrid() {
  const grid = document.getElementById('mediaGridContainer');
  const badge = document.getElementById('mediaTotalBadge');
  if (!grid || !window.CMSData) return;

  const assets = window.CMSData.getMediaAssets({
    category: currentMediaCategory,
    search: currentMediaSearch
  });

  if (badge) badge.textContent = `(${assets.length})`;

  grid.innerHTML = assets.map(asset => {
    return `
      <div class="media-thumbnail-card" onclick="openMediaDetailsModal('${asset.id}')">
        <div class="media-thumb-preview">
          <svg style="width: 36px; height: 36px; fill: #8c8f94;" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
        </div>
        <div class="media-thumb-name" title="${asset.name}">${asset.name}</div>
        <div style="padding: 2px 8px 6px; font-size: 11px; color: var(--wp-text-muted);">${asset.size}</div>
      </div>
    `;
  }).join('');
}

function triggerMediaUploadSim() {
  const barWrap = document.getElementById('uploadProgressBarWrap');
  const bar = document.getElementById('uploadProgressBar');
  if (!barWrap || !bar) return;

  barWrap.style.display = 'block';
  bar.style.width = '0%';

  let prog = 0;
  const interval = setInterval(() => {
    prog += 25;
    bar.style.width = prog + '%';
    if (prog >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        barWrap.style.display = 'none';

        const sampleNames = ['hero-geometric-system.svg', 'case-study-metric-card.png', 'brand-icon-monochrome.svg', 'creative-lab-frame-08.png'];
        const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];

        window.CMSData.addMediaAsset({
          name: randomName,
          category: 'SVG Geometry',
          size: '8.4 KB',
          dimensions: '800 × 800 px',
          altText: 'Newly uploaded design asset',
          color: '#0284c7'
        });

        renderMediaGrid();
        refreshDashboardStats();
        if (window.showToast) window.showToast('Asset uploaded and indexed successfully! ↑');
      }, 300);
    }
  }, 100);
}

function openMediaDetailsModal(id) {
  const asset = window.CMSData ? window.CMSData.getMediaAssets().find(m => m.id === id) : null;
  if (!asset) return;

  const url = `https://assets.madhankr.dev/${asset.name}`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url);
    if (window.showToast) window.showToast(`Selected asset: ${asset.name} (URL copied)`);
  } else {
    if (window.showToast) window.showToast(`Asset: ${asset.name}`);
  }
}

// ─── 6. SEO SETTINGS VIEW CONTROLLER ──────────────────────────────
function initSeoSettings() {
  loadSeoForPage('homepage');
}

function loadSeoForPage(pageKey) {
  if (!window.CMSData) return;
  const settings = window.CMSData.getSeoSettings(pageKey);
  if (!settings) return;

  document.getElementById('seoTitleInput').value = settings.title || '';
  document.getElementById('seoDescInput').value = settings.description || '';
  document.getElementById('seoCanonicalInput').value = settings.canonical || '';
  document.getElementById('seoKeywordsInput').value = settings.keywords || '';

  updateSeoPreviews();
}

function updateSeoPreviews() {
  const title = document.getElementById('seoTitleInput')?.value || '';
  const desc = document.getElementById('seoDescInput')?.value || '';
  const canonical = document.getElementById('seoCanonicalInput')?.value || '';

  // Counters
  const titleCount = document.getElementById('seoTitleCounter');
  const descCount = document.getElementById('seoDescCounter');
  if (titleCount) titleCount.textContent = `${title.length} / 60 chars`;
  if (descCount) descCount.textContent = `${desc.length} / 160 chars`;

  // Previews
  const gTitle = document.getElementById('prevGoogleTitle');
  const gDesc = document.getElementById('prevGoogleDesc');
  const gUrl = document.getElementById('prevGoogleUrl');

  const twTitle = document.getElementById('prevTwitterTitle');
  const twDesc = document.getElementById('prevTwitterDesc');

  if (gTitle) gTitle.textContent = title;
  if (gDesc) gDesc.textContent = desc;
  if (gUrl) gUrl.textContent = canonical;

  if (twTitle) twTitle.textContent = title;
  if (twDesc) twDesc.textContent = desc;
}

function saveCurrentSeoSettings() {
  const pageKey = document.getElementById('seoPageSelect')?.value || 'homepage';
  const title = document.getElementById('seoTitleInput').value;
  const description = document.getElementById('seoDescInput').value;
  const canonical = document.getElementById('seoCanonicalInput').value;
  const keywords = document.getElementById('seoKeywordsInput').value;

  window.CMSData.saveSeoSettings(pageKey, {
    title,
    description,
    canonical,
    keywords
  });

  refreshDashboardStats();
  if (window.showToast) window.showToast(`SEO configured & saved for ${pageKey.toUpperCase()}! ✓`);
}

// ─── 7. SITE SETTINGS VIEW CONTROLLER ─────────────────────────────
function initSiteSettings() {
  renderNavItemsBuilder();
}

function renderNavItemsBuilder() {
  const container = document.getElementById('navItemsBuilder');
  if (!container || !window.CMSData) return;

  const settings = window.CMSData.getSiteSettings();
  const navItems = settings.navItems || [];

  container.innerHTML = navItems.map((item, idx) => `
    <div style="display: flex; align-items: center; justify-content: space-between; background: #ffffff; border: 1px solid var(--wp-border); padding: 8px 12px; border-radius: 2px;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <input type="checkbox" ${item.visible !== false ? 'checked' : ''} onchange="toggleNavVisibility(${idx}, this.checked)" />
        <strong style="font-size: 13px;">${item.label || item.name}</strong>
        <span style="font-size: 11px; color: var(--wp-text-muted);">${item.url}</span>
      </div>
      <div style="display: flex; gap: 4px;">
        <button class="button" style="padding: 0 6px; min-height: 24px; line-height: 22px;" onclick="moveNavItem(${idx}, -1)" ${idx === 0 ? 'disabled' : ''}>↑</button>
        <button class="button" style="padding: 0 6px; min-height: 24px; line-height: 22px;" onclick="moveNavItem(${idx}, 1)" ${idx === navItems.length - 1 ? 'disabled' : ''}>↓</button>
      </div>
    </div>
  `).join('');
}

function toggleNavVisibility(idx, isChecked) {
  const settings = window.CMSData.getSiteSettings();
  if (settings.navItems && settings.navItems[idx]) {
    settings.navItems[idx].visible = isChecked;
    window.CMSData.saveSiteSettings(settings);
    if (window.showToast) window.showToast('Navigation visibility updated');
  }
}

function moveNavItem(idx, direction) {
  const settings = window.CMSData.getSiteSettings();
  const items = settings.navItems || [];
  const targetIdx = idx + direction;
  if (targetIdx < 0 || targetIdx >= items.length) return;

  const temp = items[idx];
  items[idx] = items[targetIdx];
  items[targetIdx] = temp;

  settings.navItems = items;
  window.CMSData.saveSiteSettings(settings);
  renderNavItemsBuilder();
}

function saveAllSiteSettings() {
  const siteName = document.getElementById('settingSiteName').value;
  const siteTagline = document.getElementById('settingSiteTagline').value;
  const contactEmail = document.getElementById('settingContactEmail').value;
  const maintenanceMode = document.getElementById('settingMaintenanceMode').checked;
  const allowComments = document.getElementById('settingAllowComments').checked;

  window.CMSData.saveSiteSettings({
    siteName,
    siteTagline,
    contactEmail,
    maintenanceMode,
    allowComments
  });

  if (window.showToast) window.showToast('All preferences successfully updated! ✓');
}

function exportCmsDataBackup() {
  const data = window.CMSData ? window.CMSData.load() : {};
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `madhankr-cms-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  if (window.showToast) window.showToast('CMS backup downloaded! 💾');
}

function resetCmsDataToDefaults() {
  if (!confirm('Warning: This will restore all default mock data for the prototype. Continue?')) return;
  if (window.CMSData) {
    window.CMSData.reset();
    location.reload();
  }
}

function showToast(message, duration = 3000) {
  const container = document.getElementById('wpToastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'wp-toast';
  toast.innerHTML = `<span style="color:#00a32a; font-weight:bold;">✔</span> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Expose functions to window
window.showToast = showToast;
window.switchAdminView = switchAdminView;
window.refreshDashboardStats = refreshDashboardStats;
window.handleQuickDraftSubmit = handleQuickDraftSubmit;
window.editContentItem = editContentItem;
window.duplicateContentItem = duplicateContentItem;
window.deleteContentItem = deleteContentItem;
window.syncEditorPreview = syncEditorPreview;
window.applyFormat = applyFormat;
window.saveEditorPost = saveEditorPost;
window.triggerMediaUploadSim = triggerMediaUploadSim;
window.openMediaDetailsModal = openMediaDetailsModal;
window.loadSeoForPage = loadSeoForPage;
window.updateSeoPreviews = updateSeoPreviews;
window.saveCurrentSeoSettings = saveCurrentSeoSettings;
window.toggleNavVisibility = toggleNavVisibility;
window.moveNavItem = moveNavItem;
window.saveAllSiteSettings = saveAllSiteSettings;
window.exportCmsDataBackup = exportCmsDataBackup;
window.resetCmsDataToDefaults = resetCmsDataToDefaults;
window.handleAdminLogout = handleAdminLogout;
window.getAdminSession = getAdminSession;
window.isUserAuthenticated = isUserAuthenticated;
