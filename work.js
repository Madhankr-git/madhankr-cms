// ══════════════════════════════════════════════════════════════════
// WORK & CASE STUDIES CONTROLLER
// ══════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  initWorkPage();
});

let activeWorkCategory = 'all';
let activeWorkSearch = '';

function initWorkPage() {
  const searchInput = document.getElementById('workSearchInput');
  const catButtons = document.querySelectorAll('#workCatPills .cat-btn');

  renderProjects();

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeWorkSearch = e.target.value;
      renderProjects();
    });
  }

  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeWorkCategory = btn.dataset.category;
      renderProjects();
    });
  });

  // Check URL hash to auto-open case study if linked (e.g. #edtech)
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    setTimeout(() => {
      const projects = window.CMSData ? window.CMSData.getProjects() : [];
      const match = projects.find(p => p.id.includes(hash) || p.slug.includes(hash));
      if (match) openCaseStudy(match.id);
    }, 200);
  }
}

function renderProjects() {
  const grid = document.getElementById('workGrid');
  if (!grid) return;

  const projects = window.CMSData ? window.CMSData.getProjects({
    category: activeWorkCategory,
    search: activeWorkSearch
  }) : [];

  if (projects.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 60px 20px; text-align: center; background: var(--bg-surface); border: 1.5px dashed var(--sky-border);">
        <h3 style="font-size: 20px; font-weight: 800; margin-bottom: 8px;">No projects found</h3>
        <p style="color: var(--text-muted); font-size: 14px;">Try another search term or reset category filters.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = projects.map(proj => {
    const motif = proj.motif || 'motif-square';
    const caseStudy = proj.caseStudy || {};
    const metrics = (caseStudy.metrics || []).slice(0, 2);

    return `
      <article class="p-card card-col-1" style="opacity: 1; transform: none; cursor: pointer;" onclick="openCaseStudy('${proj.id}')">
        <div class="p-card-header">
          <span class="p-card-tag">${proj.tag}</span>
          <span class="p-card-year">${proj.year}</span>
        </div>

        <div class="p-card-graphic">
          <div class="p-motif ${motif}"></div>
        </div>

        <div class="p-card-info">
          <h3 class="p-card-title">${proj.title}</h3>
          <p class="p-card-desc">${proj.summary}</p>
          
          <div class="p-card-meta">
            <span class="p-badge">${proj.category}</span>
            <span class="p-badge">${proj.role || 'Design & Code'}</span>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 20px; border-top: 1px solid var(--sky-border); padding-top: 16px;">
            <span class="p-card-link" style="margin-top: 0;">Case Study Insights <span class="arrow-sym">→</span></span>
            ${metrics.length > 0 ? `<span style="font-family: var(--font-mono); font-size: 11px; color: var(--sky-blue); font-weight: 800;">${metrics[0].value} ${metrics[0].label}</span>` : ''}
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function openCaseStudy(projectId) {
  const project = window.CMSData ? window.CMSData.getProjectById(projectId) : null;
  if (!project) return;

  const overlay = document.getElementById('caseModalOverlay');
  const tagEl = document.getElementById('caseDrawerTag');
  const yearEl = document.getElementById('caseDrawerYear');
  const titleEl = document.getElementById('caseDrawerTitle');
  const clientEl = document.getElementById('caseDrawerClient');
  const summaryEl = document.getElementById('caseDrawerSummary');
  const challengeEl = document.getElementById('caseDrawerChallenge');
  const solutionEl = document.getElementById('caseDrawerSolution');
  const metricsEl = document.getElementById('caseDrawerMetrics');
  const techEl = document.getElementById('caseDrawerTech');
  const editLink = document.getElementById('editProjectInCmsLink');

  if (tagEl) tagEl.textContent = project.tag;
  if (yearEl) yearEl.textContent = project.year;
  if (titleEl) titleEl.textContent = project.title;
  if (clientEl) clientEl.textContent = project.client || 'Featured Collaboration';
  if (summaryEl) summaryEl.textContent = project.summary;

  const cs = project.caseStudy || {};
  if (challengeEl) challengeEl.textContent = cs.challenge || 'Balancing complex requirements with intuitive, accessible visual clarity.';
  if (solutionEl) solutionEl.textContent = cs.solution || 'Engineered responsive design systems with modular component architectures and smooth GSAP micro-interactions.';

  if (metricsEl) {
    const list = cs.metrics || [
      { label: 'Impact Score', value: '98%' },
      { label: 'Efficiency Gain', value: '+45%' }
    ];
    metricsEl.innerHTML = list.map(m => `
      <div class="metric-card">
        <div class="metric-num">${m.value}</div>
        <div class="metric-lbl">${m.label.toUpperCase()}</div>
      </div>
    `).join('');
  }

  if (techEl) {
    const techs = cs.techStack || ['Vanilla CSS', 'HTML5', 'JavaScript', 'Design Systems'];
    techEl.innerHTML = techs.map(t => `<span class="art-tag">■ ${t}</span>`).join('');
  }

  if (overlay) {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeCaseModalDirect() {
  const overlay = document.getElementById('caseModalOverlay');
  if (overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function closeCaseModal(e) {
  if (e.target.id === 'caseModalOverlay') {
    closeCaseModalDirect();
  }
}

// Global expose
window.openCaseStudy = openCaseStudy;
window.closeCaseModal = closeCaseModal;
window.closeCaseModalDirect = closeCaseModalDirect;
