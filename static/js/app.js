document.addEventListener('DOMContentLoaded', () => {
  // Current Active Live Memory Structure
  let currentLiveQuote = {
    id: null,
    quote: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
  };
  let activeAuthMode = 'login';

  // Select Dom Nodes
  const btnGenerate = document.getElementById('btn-generate');
  const btnAddFav = document.getElementById('btn-add-fav');
  const navItems = document.querySelectorAll('.nav-item');
  const viewPanes = document.querySelectorAll('.view-pane');
  const logoutModal = document.getElementById('logout-modal');

  // --- APP CORE INITIALIZATION ROUTINE ---
  if (
    document.getElementById('app-view').classList.contains('hidden') === false
  ) {
    refreshDashboardData();
  }

  // --- VIEW SWITCHING NAVIGATION LOGIC ---
  navItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      const target = item.getAttribute('data-target');
      if (!target) return;

      // Update active menu state
      navItems.forEach((i) => i.classList.remove('active'));
      document
        .querySelectorAll(`[data-target="${target}"]`)
        .forEach((i) => i.classList.add('active'));

      // Show active pane view
      viewPanes.forEach((pane) => pane.classList.add('hidden'));
      const activePane = document.getElementById(`pane-${target}`);
      if (activePane) activePane.classList.remove('hidden');

      // Fetch specific view payload
      if (target === 'dashboard') refreshDashboardData();
      if (target === 'favourites') fetchFavouritesView();
      if (target === 'history') fetchHistoryView();

      // Close mobile menu if open
      document.querySelector('.sidebar').classList.remove('open');
    });
  });

  // --- MOBILE BURGER ACTION ---
  document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('open');
  });

  // --- AUTH SWITCH LABELS ---
  document.getElementById('go-to-register')?.addEventListener('click', (e) => {
    e.preventDefault();
    const cardTitle = document.querySelector('.auth-card h2');
    const submitBtn = document.querySelector('#login-form button');
    const toggleLink = document.getElementById('go-to-register');

    if (activeAuthMode === 'login') {
      cardTitle.innerText = 'Sign Up';
      submitBtn.innerText = 'Register';
      toggleLink.innerText = 'Login';
      activeAuthMode = 'register';
    } else {
      cardTitle.innerText = 'Login';
      submitBtn.innerText = 'Login';
      toggleLink.innerText = 'Sign Up';
      activeAuthMode = 'login';
    }
  });

  // --- PROCESS AUTHENTICATION API SUBMISSION ---
  document
    .getElementById('login-form')
    ?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('auth-email').value;
      const password = document.getElementById('auth-password').value;
      const targetEndpoint =
        activeAuthMode === 'login' ? '/api/auth/login' : '/api/auth/register';

      const response = await fetch(targetEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (result.success) {
        document.getElementById('user-display-email').innerText =
          `Hello, ${email}`;
        document.getElementById('auth-view').classList.add('hidden');
        document.getElementById('app-view').classList.remove('hidden');
        refreshDashboardData();
      } else {
        alert(result.message || 'Authentication Failed');
      }
    });

  // --- MODAL CONTROLLER SYSTEM ---
  document.querySelectorAll('.logout-trigger').forEach((el) => {
    el.addEventListener('click', () => logoutModal.classList.remove('hidden'));
  });
  document
    .getElementById('cancel-logout-btn')
    .addEventListener('click', () => logoutModal.classList.add('hidden'));
  document
    .getElementById('confirm-logout-btn')
    .addEventListener('click', async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
      logoutModal.classList.add('hidden');
      document.getElementById('app-view').classList.add('hidden');
      document.getElementById('auth-view').classList.remove('hidden');
    });

  // --- CORE GENERATION & METRIC HANDLERS ---
  btnGenerate?.addEventListener('click', async () => {
    const response = await fetch('/api/quotes/generate', { method: 'POST' });
    const data = await response.json();
    if (data.success) {
      currentLiveQuote = {
        id: data.id,
        quote: data.quote,
        author: data.author,
      };
      document.getElementById('live-quote-text').innerText = data.quote;
      document.getElementById('live-quote-author').innerText =
        `— ${data.author}`;
      refreshDashboardData();
    }
  });

  btnAddFav?.addEventListener('click', async () => {
    if (!currentLiveQuote.id) {
      alert('Please generate a new quote first to add to favorites!');
      return;
    }
    const response = await fetch(
      `/api/quotes/favourite/${currentLiveQuote.id}`,
      { method: 'POST' }
    );
    if (response.ok) {
      alert('Quote added to favorites successfully!');
      refreshDashboardData();
    }
  });

  async function refreshDashboardData() {
    const response = await fetch('/api/data/dashboard');
    if (!response.ok) return;
    const data = await response.json();

    document.getElementById('stat-total-quotes').innerText = data.total_quotes;
    document.getElementById('stat-last-updated').innerText = data.last_updated;
    document.getElementById('stat-saved-quotes').innerText = data.quotes_saved;

    const container = document.getElementById('dashboard-recent-list');
    container.innerHTML = '';
    data.recent_history.forEach((item) => {
      container.appendChild(createQuoteDOMRow(item));
    });
  }

  async function fetchHistoryView() {
    const response = await fetch('/api/data/history');
    const rows = await response.json();
    const container = document.getElementById('history-list');
    container.innerHTML = '';
    rows.forEach((item) => container.appendChild(createQuoteDOMRow(item)));
  }

  async function fetchFavouritesView() {
    const response = await fetch('/api/data/favourites');
    const rows = await response.json();
    const container = document.getElementById('favourites-list');
    const emptyState = document.getElementById('fav-empty-state');

    container.innerHTML = '';
    if (rows.length === 0) {
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
      rows.forEach((item) => container.appendChild(createQuoteDOMRow(item)));
    }
  }

  // --- REUSABLE NODE BUILDER ---
  function createQuoteDOMRow(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'quote-item';
    itemDiv.innerHTML = `
            <div class="quote-item-body">
                <p class="quote-item-text">"${item.quote_text}"</p>
                <p class="quote-item-author">— ${item.author}</p>
                <p class="quote-item-meta">${item.timestamp}</p>
            </div>
            <button class="btn-delete-quote" data-id="${item.id}">
                <span class="material-symbols-outlined">delete</span>
            </button>
        `;

    itemDiv
      .querySelector('.btn-delete-quote')
      .addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm('Delete this record?')) {
          await fetch(`/api/quotes/delete/${id}`, { method: 'DELETE' });
          itemDiv.remove();
          refreshDashboardData();
        }
      });
    return itemDiv;
  }

  // --- BINDING GLOBAL ACTIONS ---
  window.clearAllData = async function (target) {
    if (confirm(`Are you sure you want to clear all ${target}?`)) {
      await fetch(`/api/quotes/clear/${target}`, { method: 'DELETE' });
      if (target === 'favourites') fetchFavouritesView();
      if (target === 'history') fetchHistoryView();
      refreshDashboardData();
    }
  };
});
