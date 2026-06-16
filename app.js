/* ============================================
   QA Analytics Dashboard - Application Logic
   ============================================ */

// ============================================
// Mock Data
// ============================================
const TEAM_MEMBERS = [
  { name: 'Gautam Kochar', initials: 'GK', role: 'Sr. QA', testsRun: 456, bugsFound: 38, passRate: 96.2, gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
  { name: 'Mohit Sharma', initials: 'PS', role: 'Sr. QA Engineer', testsRun: 389, bugsFound: 31, passRate: 94.8, gradient: 'linear-gradient(135deg, #ec4899, #f472b6)' },
  { name: 'Rahul Singh', initials: 'RS', role: 'Automation Engineer', testsRun: 621, bugsFound: 22, passRate: 97.1, gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
  { name: 'Rajan', initials: 'AD', role: 'QA Engineer', testsRun: 312, bugsFound: 27, passRate: 93.5, gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
  { name: 'Amit', initials: 'VP', role: 'Performance Tester', testsRun: 198, bugsFound: 15, passRate: 95.4, gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)' },
  { name: 'Priya', initials: 'MJ', role: 'QA Engineer', testsRun: 267, bugsFound: 19, passRate: 92.8, gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)' },
];

const RECENT_TESTS = [
  { name: 'Smoke Tests - Homepage', status: 'passed', passed: 48, failed: 0, duration: '3m 22s', time: '2 min ago' },
  { name: 'Regression - Car Compare', status: 'failed', passed: 112, failed: 8, duration: '18m 45s', time: '15 min ago' },
  { name: 'API Tests - Search v2', status: 'running', passed: 67, failed: 2, duration: '—', time: 'Running...' },
  { name: 'E2E - Dealer Journey', status: 'passed', passed: 34, failed: 0, duration: '8m 12s', time: '1 hour ago' },
  { name: 'Mobile - Android Smoke', status: 'failed', passed: 89, failed: 5, duration: '12m 33s', time: '2 hours ago' },
  { name: 'Security - Auth Flow', status: 'passed', passed: 22, failed: 0, duration: '4m 56s', time: '3 hours ago' },
];

const BUGS = [
  { id: 'BUG-1247', title: 'Car comparison page crashes on selecting 4th car', severity: 'critical', status: 'open', assignee: 'Gautam Kochar', module: 'Compare', created: '2 hours ago' },
  { id: 'BUG-1246', title: 'Search filter not resetting after back navigation', severity: 'high', status: 'in-progress', assignee: 'Mohit Sharma', module: 'Search', created: '5 hours ago' },
  { id: 'BUG-1245', title: 'EMI calculator shows wrong interest rate for HDFC', severity: 'critical', status: 'open', assignee: 'Rahul Singh', module: 'Finance', created: '1 day ago' },
  { id: 'BUG-1244', title: 'Image gallery lazy loading fails on slow connections', severity: 'medium', status: 'in-progress', assignee: 'Amit', module: 'Gallery', created: '1 day ago' },
  { id: 'BUG-1243', title: 'Dealer contact form missing phone validation', severity: 'high', status: 'open', assignee: 'Priya', module: 'Dealer', created: '2 days ago' },
  { id: 'BUG-1242', title: 'Dark mode toggle not persisting across sessions', severity: 'low', status: 'resolved', assignee: 'Rajan', module: 'Settings', created: '2 days ago' },
  { id: 'BUG-1241', title: 'City selector dropdown overlaps with header on mobile', severity: 'medium', status: 'open', assignee: 'Gautam Kochar', module: 'Homepage', created: '3 days ago' },
  { id: 'BUG-1240', title: 'API rate limiting not enforced for search endpoint', severity: 'high', status: 'in-progress', assignee: 'Mohit Sharma', module: 'API', created: '3 days ago' },
  { id: 'BUG-1239', title: 'Push notifications not received on Android 14', severity: 'medium', status: 'resolved', assignee: 'Rahul Singh', module: 'Mobile', created: '4 days ago' },
  { id: 'BUG-1238', title: 'Social sharing generates incorrect URL for used cars', severity: 'low', status: 'resolved', assignee: 'Amit', module: 'Social', created: '5 days ago' },
];

const TEST_RUNS = [
  { name: 'Smoke Tests - Homepage', suite: 'smoke', env: 'Production', status: 'passed', total: 48, passed: 48, failed: 0, skipped: 0, duration: '3m 22s', trigger: 'CI/CD', time: '10 min ago' },
  { name: 'Regression - Car Comparison', suite: 'regression', env: 'Staging', status: 'failed', total: 120, passed: 112, failed: 8, skipped: 0, duration: '18m 45s', trigger: 'Manual', time: '25 min ago' },
  { name: 'API Tests - Search v2', suite: 'api', env: 'QA', status: 'running', total: 85, passed: 67, failed: 2, skipped: 16, duration: '—', trigger: 'CI/CD', time: 'Running' },
  { name: 'E2E - Dealer Journey', suite: 'e2e', env: 'Staging', status: 'passed', total: 34, passed: 34, failed: 0, skipped: 0, duration: '8m 12s', trigger: 'Scheduled', time: '1 hour ago' },
  { name: 'Mobile - Android Smoke', suite: 'smoke', env: 'Production', status: 'failed', total: 94, passed: 89, failed: 5, skipped: 0, duration: '12m 33s', trigger: 'CI/CD', time: '2 hours ago' },
  { name: 'Security - Auth Flow', suite: 'smoke', env: 'QA', status: 'passed', total: 22, passed: 22, failed: 0, skipped: 0, duration: '4m 56s', trigger: 'Manual', time: '3 hours ago' },
  { name: 'Performance - Load Test', suite: 'regression', env: 'Staging', status: 'passed', total: 15, passed: 14, failed: 0, skipped: 1, duration: '45m 12s', trigger: 'Scheduled', time: '5 hours ago' },
  { name: 'Regression - User Auth', suite: 'regression', env: 'QA', status: 'passed', total: 67, passed: 65, failed: 1, skipped: 1, duration: '9m 34s', trigger: 'CI/CD', time: '6 hours ago' },
];

const ENVIRONMENTS = [
  { name: 'Production', url: 'www.cardekho.com', status: 'healthy', uptime: '99.98%', avgResponse: '142ms', lastDeploy: '2 days ago', tests: 156 },
  { name: 'Staging', url: 'staging.cardekho.com', status: 'healthy', uptime: '99.85%', avgResponse: '189ms', lastDeploy: '4 hours ago', tests: 340 },
  { name: 'QA', url: 'qa.cardekho.com', status: 'degraded', uptime: '97.2%', avgResponse: '312ms', lastDeploy: '1 hour ago', tests: 520 },
  { name: 'Dev', url: 'dev.cardekho.com', status: 'healthy', uptime: '95.1%', avgResponse: '256ms', lastDeploy: '30 min ago', tests: 89 },
  { name: 'Pre-Production', url: 'preprod.cardekho.com', status: 'down', uptime: '88.4%', avgResponse: '—', lastDeploy: '1 day ago', tests: 0 },
];

const NOTIFICATIONS = [
  { title: 'Test Run Completed', desc: 'Smoke Tests - Homepage passed successfully (48/48)', time: '2 min ago', unread: true },
  { title: 'Critical Bug Reported', desc: 'BUG-1247: Car comparison page crashes on selecting 4th car', time: '2 hours ago', unread: true },
  { title: 'Build Deployed', desc: 'Build v3.42.1 deployed to Staging environment', time: '4 hours ago', unread: true },
  { title: 'Test Run Failed', desc: 'Regression - Car Compare failed with 8 failures', time: '15 min ago', unread: false },
  { title: 'Bug Resolved', desc: 'BUG-1239: Push notifications fixed for Android 14', time: '1 day ago', unread: false },
];

const REPORTS = [
  { title: 'Sprint 42 Test Report', desc: 'Complete test execution summary for Sprint 42 including pass rates, coverage, and regressions.', date: 'Jun 12, 2026', icon: 'fas fa-file-pdf' },
  { title: 'Weekly Bug Analysis', desc: 'Bug trend analysis showing severity distribution and resolution times for the past week.', date: 'Jun 10, 2026', icon: 'fas fa-chart-pie' },
  { title: 'Automation Coverage Report', desc: 'Module-wise automation coverage metrics comparing manual vs automated test execution.', date: 'Jun 8, 2026', icon: 'fas fa-robot' },
  { title: 'Performance Benchmark', desc: 'Load testing results with P95 response times, throughput, and error rates under peak load.', date: 'Jun 5, 2026', icon: 'fas fa-tachometer-alt' },
  { title: 'Monthly QA Dashboard', desc: 'Executive summary of QA metrics, team performance, and quality trends for the month.', date: 'Jun 1, 2026', icon: 'fas fa-calendar-alt' },
  { title: 'Release Readiness Check', desc: 'Pre-release validation report with go/no-go recommendation based on test results.', date: 'May 28, 2026', icon: 'fas fa-clipboard-check' },
];

// ============================================
// DOM References
// ============================================
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const mobileToggle = document.getElementById('mobileToggle');
const themeToggle = document.getElementById('themeToggle');
const notificationBtn = document.getElementById('notificationBtn');
const notificationPanel = document.getElementById('notificationPanel');
const searchInput = document.getElementById('searchInput');
const toastContainer = document.getElementById('toastContainer');

// ============================================
// Sidebar Toggle
// ============================================
sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
});

mobileToggle.addEventListener('click', () => {
  sidebar.classList.toggle('mobile-open');
});

// Close mobile sidebar on clicking outside
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 768 && sidebar.classList.contains('mobile-open')) {
    if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
      sidebar.classList.remove('mobile-open');
    }
  }
});

// ============================================
// Navigation
// ============================================
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const currentPageSpan = document.getElementById('currentPage');

const pageNames = {
  'dashboard': 'Overview',
  'test-runs': 'Test Runs',
  'bugs': 'Bug Tracker',
  'analytics': 'Analytics',
  'team': 'Team',
  'environments': 'Environments',
  'reports': 'Reports',
  'settings': 'Settings'
};

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const page = item.dataset.page;

    // Update nav active state
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');

    // Show correct page
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${page}`).classList.add('active');

    // Update breadcrumb
    currentPageSpan.textContent = pageNames[page];

    // Close mobile sidebar
    sidebar.classList.remove('mobile-open');

    // Initialize page-specific charts if needed
    if (page === 'analytics') initAnalyticsCharts();
  });
});

// ============================================
// Theme Toggle
// ============================================
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  const icon = themeToggle.querySelector('i');
  if (document.body.classList.contains('light-theme')) {
    icon.classList.replace('fa-moon', 'fa-sun');
    showToast('success', 'Theme Changed', 'Switched to light mode');
  } else {
    icon.classList.replace('fa-sun', 'fa-moon');
    showToast('success', 'Theme Changed', 'Switched to dark mode');
  }

  // Redraw charts with new theme
  setTimeout(() => {
    initDashboardCharts();
    if (document.getElementById('page-analytics').classList.contains('active')) {
      initAnalyticsCharts();
    }
  }, 100);
});

// ============================================
// Notification Panel
// ============================================
let notifPanelOpen = false;

notificationBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  notifPanelOpen = !notifPanelOpen;
  notificationPanel.classList.toggle('active', notifPanelOpen);
});

document.addEventListener('click', (e) => {
  if (notifPanelOpen && !notificationPanel.contains(e.target) && !notificationBtn.contains(e.target)) {
    notifPanelOpen = false;
    notificationPanel.classList.remove('active');
  }
});

document.getElementById('clearNotifications').addEventListener('click', () => {
  document.getElementById('notificationList').innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:40px;font-size:14px;">No notifications</p>';
  notificationBtn.querySelector('.badge').style.display = 'none';
  showToast('info', 'Cleared', 'All notifications cleared');
});

function renderNotifications() {
  const list = document.getElementById('notificationList');
  list.innerHTML = NOTIFICATIONS.map(n => `
    <div class="notification-item ${n.unread ? 'unread' : ''}">
      <div class="notif-title">${n.title}</div>
      <div class="notif-desc">${n.desc}</div>
      <div class="notif-time">${n.time}</div>
    </div>
  `).join('');
}

// ============================================
// Toast Notifications
// ============================================
function showToast(type, title, msg) {
  const icons = { success: 'fas fa-check-circle', error: 'fas fa-exclamation-circle', info: 'fas fa-info-circle' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon"><i class="${icons[type]}"></i></div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${msg}</div>
    </div>
  `;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ============================================
// Modals
// ============================================
function setupModal(triggerId, modalId) {
  const triggers = document.querySelectorAll(`#${triggerId}`);
  const modal = document.getElementById(modalId);
  if (!modal) return;

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => modal.classList.add('active'));
  });

  modal.querySelector('.modal-close')?.addEventListener('click', () => modal.classList.remove('active'));
  modal.querySelectorAll('.modal-cancel').forEach(btn => {
    btn.addEventListener('click', () => modal.classList.remove('active'));
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });
}

setupModal('newTestRunBtn', 'newTestRunModal');
setupModal('triggerTestRun', 'newTestRunModal');
setupModal('reportBugBtn', 'newBugModal');
setupModal('newBugBtn', 'newBugModal');

// Handle Start Test Run
document.getElementById('startTestRun')?.addEventListener('click', () => {
  document.getElementById('newTestRunModal').classList.remove('active');
  showToast('success', 'Test Run Started', 'Smoke Tests - Homepage is now running...');
});

// ============================================
// Animated Counter
// ============================================
function animateCounters() {
  const counters = document.querySelectorAll('.metric-value[data-target]');
  counters.forEach(counter => {
    const target = parseFloat(counter.dataset.target);
    const suffix = counter.dataset.suffix || '';
    const isDecimal = target % 1 !== 0;
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      counter.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString()) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  });
}

// ============================================
// Render Dashboard Components
// ============================================
function renderRecentTests() {
  const tbody = document.querySelector('#recentTestsTable tbody');
  tbody.innerHTML = RECENT_TESTS.map(t => `
    <tr>
      <td><strong>${t.name}</strong></td>
      <td><span class="status-badge ${t.status}">${t.status === 'running' ? '<span class="live-dot"></span> ' : ''}${capitalize(t.status)}</span></td>
      <td style="color:var(--accent-green);font-weight:600">${t.passed}</td>
      <td style="color:${t.failed > 0 ? 'var(--accent-red)' : 'var(--text-muted)'};font-weight:600">${t.failed}</td>
      <td>${t.duration}</td>
      <td style="color:var(--text-muted)">${t.time}</td>
    </tr>
  `).join('');
}

function renderCriticalBugs() {
  const list = document.getElementById('criticalBugList');
  const criticalBugs = BUGS.filter(b => b.severity === 'critical' || b.severity === 'high').slice(0, 4);
  list.innerHTML = criticalBugs.map(b => `
    <div class="bug-item ${b.severity}">
      <div class="bug-title">${b.id}: ${b.title}</div>
      <div class="bug-meta">
        <span>${b.assignee}</span>
        <span class="severity-badge ${b.severity}">${b.severity}</span>
      </div>
    </div>
  `).join('');
}

function renderEnvironmentHealth() {
  const list = document.getElementById('envList');
  list.innerHTML = ENVIRONMENTS.slice(0, 4).map(e => `
    <div class="env-item">
      <div class="env-item-left">
        <span class="env-status-dot ${e.status}"></span>
        <div class="env-item-info">
          <span class="env-name">${e.name}</span>
          <span class="env-url">${e.url}</span>
        </div>
      </div>
      <span class="env-uptime" style="color:${e.status === 'healthy' ? 'var(--accent-green)' : e.status === 'degraded' ? 'var(--accent-orange)' : 'var(--accent-red)'}">${e.uptime}</span>
    </div>
  `).join('');
}

// ============================================
// Render Test Runs Page
// ============================================
function renderTestRuns() {
  const grid = document.getElementById('testRunsGrid');
  grid.innerHTML = TEST_RUNS.map(t => {
    const passPercent = (t.passed / t.total * 100).toFixed(0);
    const failPercent = (t.failed / t.total * 100).toFixed(0);
    const skipPercent = (t.skipped / t.total * 100).toFixed(0);
    return `
    <div class="test-run-card ${t.status === 'running' ? 'running' : ''}">
      <div class="test-run-top">
        <div>
          <div class="test-run-name">${t.name}</div>
          <div class="test-run-meta">${t.env} • ${t.trigger}</div>
        </div>
        <span class="status-badge ${t.status}">${t.status === 'running' ? '<span class="live-dot"></span> ' : ''}${capitalize(t.status)}</span>
      </div>
      <div class="test-run-stats">
        <div class="test-run-stat total"><span class="test-run-stat-value">${t.total}</span><span class="test-run-stat-label">Total</span></div>
        <div class="test-run-stat pass"><span class="test-run-stat-value">${t.passed}</span><span class="test-run-stat-label">Passed</span></div>
        <div class="test-run-stat fail"><span class="test-run-stat-value">${t.failed}</span><span class="test-run-stat-label">Failed</span></div>
        <div class="test-run-stat skip"><span class="test-run-stat-value">${t.skipped}</span><span class="test-run-stat-label">Skipped</span></div>
      </div>
      <div class="test-run-progress">
        <div class="progress-pass" style="width:${passPercent}%"></div>
        <div class="progress-fail" style="width:${failPercent}%"></div>
        <div class="progress-skip" style="width:${skipPercent}%"></div>
      </div>
      <div class="test-run-footer">
        <span><i class="fas fa-clock"></i> ${t.duration}</span>
        <span>${t.time}</span>
      </div>
    </div>
    `;
  }).join('');
}

// ============================================
// Render Bugs Page
// ============================================
function renderBugsTable() {
  const tbody = document.querySelector('#bugsTable tbody');
  tbody.innerHTML = BUGS.map(b => `
    <tr>
      <td><strong style="color:var(--accent-primary)">${b.id}</strong></td>
      <td>${b.title}</td>
      <td><span class="severity-badge ${b.severity}">${b.severity}</span></td>
      <td><span class="status-badge ${b.status}">${capitalize(b.status.replace('-', ' '))}</span></td>
      <td>${b.assignee}</td>
      <td>${b.module}</td>
      <td style="color:var(--text-muted)">${b.created}</td>
      <td>
        <button class="action-btn" title="View"><i class="fas fa-eye"></i></button>
        <button class="action-btn" title="Edit"><i class="fas fa-edit"></i></button>
      </td>
    </tr>
  `).join('');
}

// ============================================
// Render Team Page
// ============================================
function renderTeamGrid() {
  const grid = document.getElementById('teamGrid');
  grid.innerHTML = TEAM_MEMBERS.map(m => `
    <div class="team-card">
      <div class="team-avatar" style="background:${m.gradient}">${m.initials}</div>
      <div class="team-name">${m.name}</div>
      <div class="team-role">${m.role}</div>
      <div class="team-stats">
        <div class="team-stat">
          <span class="team-stat-val">${m.testsRun}</span>
          <span class="team-stat-label">Tests Run</span>
        </div>
        <div class="team-stat">
          <span class="team-stat-val" style="color:var(--accent-red)">${m.bugsFound}</span>
          <span class="team-stat-label">Bugs Found</span>
        </div>
        <div class="team-stat">
          <span class="team-stat-val" style="color:var(--accent-green)">${m.passRate}%</span>
          <span class="team-stat-label">Pass Rate</span>
        </div>
      </div>
    </div>
  `).join('');
}

// ============================================
// Render Environments Page
// ============================================
function renderEnvGrid() {
  const grid = document.getElementById('envGrid');
  grid.innerHTML = ENVIRONMENTS.map(e => `
    <div class="env-full-card">
      <div class="env-full-header">
        <div class="env-full-name">
          <span class="env-status-dot ${e.status}"></span>
          ${e.name}
        </div>
        <span class="status-badge ${e.status === 'healthy' ? 'passed' : e.status === 'degraded' ? 'open' : 'failed'}">${capitalize(e.status)}</span>
      </div>
      <div class="env-full-stats">
        <div class="env-full-stat">
          <span class="env-full-stat-label">Uptime</span>
          <span class="env-full-stat-value" style="color:var(--accent-green)">${e.uptime}</span>
        </div>
        <div class="env-full-stat">
          <span class="env-full-stat-label">Avg Response</span>
          <span class="env-full-stat-value">${e.avgResponse}</span>
        </div>
        <div class="env-full-stat">
          <span class="env-full-stat-label">Last Deploy</span>
          <span class="env-full-stat-value">${e.lastDeploy}</span>
        </div>
        <div class="env-full-stat">
          <span class="env-full-stat-label">Tests Run Today</span>
          <span class="env-full-stat-value" style="color:var(--accent-blue)">${e.tests}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// ============================================
// Render Reports Page
// ============================================
function renderReportsGrid() {
  const grid = document.getElementById('reportsGrid');
  grid.innerHTML = REPORTS.map(r => `
    <div class="report-card">
      <div class="report-icon"><i class="${r.icon}"></i></div>
      <div class="report-title">${r.title}</div>
      <div class="report-desc">${r.desc}</div>
      <div class="report-date"><i class="fas fa-calendar-alt"></i> ${r.date}</div>
    </div>
  `).join('');
}

// ============================================
// Chart Utilities
// ============================================
function getChartColors() {
  const isLight = document.body.classList.contains('light-theme');
  return {
    text: isLight ? '#475569' : '#94a3b8',
    grid: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)',
    bg: isLight ? '#ffffff' : '#111827',
  };
}

function getCommonOptions(colors) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: { color: colors.text, font: { family: 'Inter', size: 11 } },
        grid: { color: colors.grid },
        border: { display: false },
      },
      y: {
        ticks: { color: colors.text, font: { family: 'Inter', size: 11 } },
        grid: { color: colors.grid },
        border: { display: false },
      }
    }
  };
}

// ============================================
// Dashboard Charts
// ============================================
let trendChart, statusChart, teamBarChart, severityPieChart;

function initDashboardCharts() {
  const colors = getChartColors();

  // Destroy existing
  [trendChart, statusChart, teamBarChart, severityPieChart].forEach(c => c?.destroy());

  // ---- Trend Chart (Line) ----
  const trendLabels = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const passedData = Array.from({ length: 30 }, () => 70 + Math.floor(Math.random() * 45));
  const failedData = Array.from({ length: 30 }, () => 2 + Math.floor(Math.random() * 12));

  trendChart = new Chart(document.getElementById('trendChart'), {
    type: 'line',
    data: {
      labels: trendLabels,
      datasets: [
        {
          label: 'Passed',
          data: passedData,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#10b981',
          borderWidth: 2.5,
        },
        {
          label: 'Failed',
          data: failedData,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#ef4444',
          borderWidth: 2.5,
        }
      ]
    },
    options: {
      ...getCommonOptions(colors),
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            color: colors.text,
            font: { family: 'Inter', size: 12, weight: 500 },
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 20,
          }
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          titleFont: { family: 'Inter', weight: 600 },
          bodyFont: { family: 'Inter' },
          padding: 12,
          cornerRadius: 10,
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
        }
      },
      interaction: {
        intersect: false,
        mode: 'index',
      }
    }
  });

  // ---- Status Doughnut Chart ----
  statusChart = new Chart(document.getElementById('statusChart'), {
    type: 'doughnut',
    data: {
      labels: ['Passed', 'Failed', 'Skipped', 'Running'],
      datasets: [{
        data: [2412, 187, 156, 92],
        backgroundColor: ['#10b981', '#ef4444', '#f59e0b', '#3b82f6'],
        borderWidth: 0,
        spacing: 3,
        borderRadius: 4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          titleFont: { family: 'Inter', weight: 600 },
          bodyFont: { family: 'Inter' },
          padding: 12,
          cornerRadius: 10,
        }
      }
    }
  });

  // Render custom legend
  const statusLegend = document.getElementById('statusLegend');
  const legendItems = [
    { label: 'Passed', value: '2,412', color: '#10b981' },
    { label: 'Failed', value: '187', color: '#ef4444' },
    { label: 'Skipped', value: '156', color: '#f59e0b' },
    { label: 'Running', value: '92', color: '#3b82f6' },
  ];
  statusLegend.innerHTML = legendItems.map(l => `
    <div style="display:flex;align-items:center;gap:8px;font-size:13px;">
      <span style="width:10px;height:10px;border-radius:3px;background:${l.color};display:inline-block;"></span>
      <span style="color:var(--text-muted)">${l.label}</span>
      <strong>${l.value}</strong>
    </div>
  `).join('');

  // ---- Team Bar Chart ----
  teamBarChart = new Chart(document.getElementById('teamChart'), {
    type: 'bar',
    data: {
      labels: TEAM_MEMBERS.map(m => m.name.split(' ')[0]),
      datasets: [{
        label: 'Tests Run',
        data: TEAM_MEMBERS.map(m => m.testsRun),
        backgroundColor: ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#06b6d4'],
        borderRadius: 8,
        borderSkipped: false,
        maxBarThickness: 40,
      }]
    },
    options: {
      ...getCommonOptions(colors),
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          titleFont: { family: 'Inter', weight: 600 },
          bodyFont: { family: 'Inter' },
          padding: 12,
          cornerRadius: 10,
        }
      }
    }
  });

  // ---- Severity Pie Chart ----
  const severityCounts = { critical: 0, high: 0, medium: 0, low: 0 };
  BUGS.forEach(b => severityCounts[b.severity]++);

  severityPieChart = new Chart(document.getElementById('severityChart'), {
    type: 'polarArea',
    data: {
      labels: ['Critical', 'High', 'Medium', 'Low'],
      datasets: [{
        data: [severityCounts.critical, severityCounts.high, severityCounts.medium, severityCounts.low],
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(148, 163, 184, 0.5)',
        ],
        borderWidth: 0,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: colors.text,
            font: { family: 'Inter', size: 11 },
            usePointStyle: true,
            padding: 16,
          }
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          titleFont: { family: 'Inter', weight: 600 },
          bodyFont: { family: 'Inter' },
          padding: 12,
          cornerRadius: 10,
        }
      },
      scales: {
        r: {
          ticks: { display: false },
          grid: { color: colors.grid },
        }
      }
    }
  });
}

// ============================================
// Analytics Page Charts
// ============================================
let passRateLineChart, moduleBarChart, defectDensityChart, automationAreaChart;

function initAnalyticsCharts() {
  const colors = getChartColors();
  [passRateLineChart, moduleBarChart, defectDensityChart, automationAreaChart].forEach(c => c?.destroy());

  // ---- Pass Rate Over Time ----
  const labels = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  passRateLineChart = new Chart(document.getElementById('passRateChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Pass Rate %',
        data: Array.from({ length: 30 }, () => 88 + Math.random() * 10),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 6,
        borderWidth: 2.5,
      }]
    },
    options: {
      ...getCommonOptions(colors),
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          padding: 12, cornerRadius: 10,
          callbacks: { label: ctx => `Pass Rate: ${ctx.parsed.y.toFixed(1)}%` }
        }
      },
      scales: {
        ...getCommonOptions(colors).scales,
        y: { ...getCommonOptions(colors).scales.y, min: 80, max: 100 }
      }
    }
  });

  // ---- Tests by Module ----
  const modules = ['Homepage', 'Search', 'Compare', 'Car Details', 'Dealer', 'Finance', 'User Auth', 'API'];
  moduleBarChart = new Chart(document.getElementById('moduleChart'), {
    type: 'bar',
    data: {
      labels: modules,
      datasets: [{
        label: 'Test Cases',
        data: [320, 450, 280, 510, 190, 220, 340, 537],
        backgroundColor: '#6366f1',
        borderRadius: 8,
        maxBarThickness: 32,
      }]
    },
    options: {
      ...getCommonOptions(colors),
      indexAxis: 'y',
      plugins: { legend: { display: false } },
    }
  });

  // ---- Defect Density ----
  defectDensityChart = new Chart(document.getElementById('defectDensityChart'), {
    type: 'radar',
    data: {
      labels: modules.slice(0, 6),
      datasets: [
        {
          label: 'Current Sprint',
          data: [3, 7, 5, 8, 2, 4],
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99,102,241,0.15)',
          pointBackgroundColor: '#6366f1',
          borderWidth: 2,
        },
        {
          label: 'Previous Sprint',
          data: [5, 4, 8, 6, 5, 7],
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245,158,11,0.1)',
          pointBackgroundColor: '#f59e0b',
          borderWidth: 2,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: colors.text, font: { family: 'Inter', size: 11 }, usePointStyle: true, padding: 16 }
        }
      },
      scales: {
        r: {
          ticks: { color: colors.text, backdropColor: 'transparent', font: { size: 10 } },
          grid: { color: colors.grid },
          pointLabels: { color: colors.text, font: { family: 'Inter', size: 11 } },
        }
      }
    }
  });

  // ---- Automation vs Manual ----
  automationAreaChart = new Chart(document.getElementById('automationChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Automated',
          data: Array.from({ length: 30 }, (_, i) => 50 + i * 2 + Math.random() * 10),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.15)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2.5,
        },
        {
          label: 'Manual',
          data: Array.from({ length: 30 }, () => 20 + Math.random() * 15),
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245,158,11,0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2.5,
        }
      ]
    },
    options: {
      ...getCommonOptions(colors),
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: { color: colors.text, font: { family: 'Inter', size: 12, weight: 500 }, usePointStyle: true, padding: 20 }
        }
      },
      interaction: { intersect: false, mode: 'index' }
    }
  });
}

// ============================================
// Search Functionality
// ============================================
searchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase().trim();
  if (query.length >= 2) {
    // Simple search across bugs
    const matchingBugs = BUGS.filter(b => b.title.toLowerCase().includes(query) || b.id.toLowerCase().includes(query));
    if (matchingBugs.length > 0) {
      showToast('info', 'Search Results', `Found ${matchingBugs.length} matching bug(s)`);
    }
  }
});

// ============================================
// Utility Functions
// ============================================
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================
// Update greeting based on time
// ============================================
function updateGreeting() {
  const hour = new Date().getHours();
  let greeting;
  if (hour < 12) greeting = 'Good Morning';
  else if (hour < 17) greeting = 'Good Afternoon';
  else greeting = 'Good Evening';

  const h1 = document.querySelector('.welcome-text h1');
  if (h1) h1.textContent = `${greeting}, Gautam! 👋`;
}

// ============================================
// Live clock / running simulation
// ============================================
function simulateRunningTests() {
  setInterval(() => {
    const runningCards = document.querySelectorAll('.test-run-card.running');
    runningCards.forEach(card => {
      const passEl = card.querySelector('.test-run-stat.pass .test-run-stat-value');
      const totalEl = card.querySelector('.test-run-stat.total .test-run-stat-value');
      if (passEl && totalEl) {
        const max = parseInt(totalEl.textContent);
        const current = parseInt(passEl.textContent);
        if (current < max) {
          passEl.textContent = current + 1;
          // Update progress bar
          const progressPass = card.querySelector('.progress-pass');
          if (progressPass) {
            progressPass.style.width = ((current + 1) / max * 100) + '%';
          }
        }
      }
    });
  }, 3000);
}

// ============================================
// Filter handlers for Test Runs page
// ============================================
document.getElementById('testRunFilter')?.addEventListener('change', (e) => {
  const filter = e.target.value;
  const cards = document.querySelectorAll('.test-run-card');
  cards.forEach(card => {
    const badge = card.querySelector('.status-badge');
    const status = badge?.textContent.trim().toLowerCase();
    card.style.display = (filter === 'all' || status === filter) ? '' : 'none';
  });
});

// ============================================
// Initialize Everything
// ============================================
function init() {
  updateGreeting();
  renderRecentTests();
  renderCriticalBugs();
  renderEnvironmentHealth();
  renderNotifications();
  renderTestRuns();
  renderBugsTable();
  renderTeamGrid();
  renderEnvGrid();
  renderReportsGrid();

  // Initialize charts after a micro-delay for DOM rendering
  requestAnimationFrame(() => {
    initDashboardCharts();
    animateCounters();
  });

  simulateRunningTests();
}

// Run on DOM ready
document.addEventListener('DOMContentLoaded', init);

// Also run immediately if DOM is already ready
if (document.readyState !== 'loading') {
  init();
}
