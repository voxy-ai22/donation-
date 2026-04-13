// Admin Configuration
const ADMIN_CREDENTIALS = {
  username: 'NexaDev',
  password: 'NexaDev12345'
};

// State
let currentPage = 1;
let itemsPerPage = 10;
let currentFilter = 'all';
let allDonations = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  updateDate();
  setupEventListeners();
});

// Check Authentication
function checkAuth() {
  const isLoggedIn = sessionStorage.getItem('admin_logged_in');
  if (isLoggedIn === 'true') {
    showDashboard();
  } else {
    showLogin();
  }
}

// Show Login Page
function showLogin() {
  document.getElementById('loginPage').style.display = 'flex';
  document.getElementById('dashboardPage').style.display = 'none';
}

// Show Dashboard
function showDashboard() {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('dashboardPage').style.display = 'flex';
  loadDonations();
  updateStats();
  renderCharts();
}

// Setup Event Listeners
function setupEventListeners() {
  // Login Form
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  
  // Enter key on password
  document.getElementById('password').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin(e);
  });
}

// Handle Login
function handleLogin(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const btn = document.querySelector('.login-btn');
  
  // Show loading
  btn.classList.add('loading');
  
  setTimeout(() => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      sessionStorage.setItem('admin_logged_in', 'true');
      toast('<i class="fas fa-check-circle" style="color:var(--green)"></i> Login berhasil!', 'success');
      showDashboard();
    } else {
      toast('<i class="fas fa-times-circle" style="color:var(--red)"></i> Username atau password salah!', 'error');
    }
    btn.classList.remove('loading');
  }, 1000);
}

// Toggle Password Visibility
function togglePassword() {
  const input = document.getElementById('password');
  const icon = document.getElementById('eyeIcon');
  
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
}

// Logout
function logout() {
  sessionStorage.removeItem('admin_logged_in');
  toast('<i class="fas fa-sign-out-alt"></i> Logout berhasil', 'info');
  setTimeout(() => {
    showLogin();
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
  }, 500);
}

// Load Donations from localStorage
function loadDonations() {
  const stored = localStorage.getItem('nexa_donations');
  allDonations = stored ? JSON.parse(stored) : [];
  
  // Add sample data if empty
  if (allDonations.length === 0) {
    allDonations = getSampleData();
    localStorage.setItem('nexa_donations', JSON.stringify(allDonations));
  }
  
  renderDonationsTable();
  updateSidebarBadge();
}

// Sample Data
function getSampleData() {
  return [
    { id: 1, name: 'Budi Santoso', amount: 50000, method: 'qris', msg: 'Semangat terus kak! 💪', date: '2026-04-13 14:30', status: 'completed' },
    { id: 2, name: 'Anonim', amount: 10000, method: 'dana', msg: 'Keep creating!', date: '2026-04-13 13:15', status: 'completed' },
    { id: 3, name: 'Sinta Rahayu', amount: 100000, method: 'gopay', msg: 'Kontennya keren banget!', date: '2026-04-13 11:45', status: 'completed' },
    { id: 4, name: 'Hendra Kurniawan', amount: 25000, method: 'ovo', msg: 'Ditunggu project barunya!', date: '2026-04-13 09:20', status: 'completed' },
    { id: 5, name: 'Dewi Lestari', amount: 75000, method: 'qris', msg: 'Sukses selalu!', date: '2026-04-12 18:10', status: 'completed' },
  ];
}

// Update Statistics
function updateStats() {
  const total = allDonations.reduce((sum, d) => sum + d.amount, 0);
  const avg = allDonations.length > 0 ? Math.round(total / allDonations.length) : 0;
  const pending = allDonations.filter(d => d.status === 'pending').length;
  
  document.getElementById('totalDonations').textContent = formatRp(total);
  document.getElementById('totalDonors').textContent = allDonations.length;
  document.getElementById('avgDonation').textContent = formatRp(avg);
  document.getElementById('pendingCount').textContent = pending;
  
  updateRecentList();
}

// Update Recent List
function updateRecentList() {
  const recent = allDonations.slice(0, 5);
  const container = document.getElementById('recentList');
  
  container.innerHTML = recent.map(d => `
    <div class="recent-item">
      <div class="recent-avatar">${d.name.charAt(0).toUpperCase()}</div>
      <div class="recent-info">
        <div class="recent-name">${d.name}</div>
        <div class="recent-time">${formatTime(d.date)}</div>
      </div>
      <div class="recent-amount">${formatRp(d.amount)}</div>
    </div>
  `).join('');
}

// Render Donations Table
function renderDonationsTable() {
  let filtered = allDonations;
  if (currentFilter !== 'all') {
    filtered = allDonations.filter(d => d.status === currentFilter);
  }
  
  const start = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);
  
  const tbody = document.getElementById('donationsTable');
  tbody.innerHTML = paginated.map(d => `
    <tr>
      <td>#${d.id}</td>
      <td>${d.name}</td>
      <td>${formatRp(d.amount)}</td>
      <td><span class="method-tag ${d.method}">${d.method.toUpperCase()}</span></td>
      <td>${d.msg || '-'}</td>
      <td>${d.date}</td>
      <td><span class="status-badge ${d.status}"><i class="fas fa-${d.status === 'completed' ? 'check' : 'clock'}"></i> ${d.status === 'completed' ? 'Selesai' : 'Menunggu'}</span></td>
      <td>
        <div class="action-btns">
          <button class="action-btn view" onclick="viewDonation(${d.id})" title="Lihat"><i class="fas fa-eye"></i></button>
          <button class="action-btn delete" onclick="deleteDonation(${d.id})" title="Hapus"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
  
  renderPagination(filtered.length);
}

// Render Pagination
function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const container = document.getElementById('pagination');
  
  let html = '';
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
  }
  container.innerHTML = html;
}

// Filter Donations
function filterDonations(filter) {
  currentFilter = filter;
  currentPage = 1;
  
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  renderDonationsTable();
}

// Go to Page
function goToPage(page) {
  currentPage = page;
  renderDonationsTable();
}

// View Donation
function viewDonation(id) {
  const d = allDonations.find(x => x.id === id);
  if (d) {
    toast(`<i class="fas fa-info-circle"></i> ${d.name} - ${formatRp(d.amount)}`, 'info');
  }
}

// Delete Donation
function deleteDonation(id) {
  if (confirm('Yakin ingin menghapus donasi ini?')) {
    allDonations = allDonations.filter(d => d.id !== id);
    localStorage.setItem('nexa_donations', JSON.stringify(allDonations));
    renderDonationsTable();
    updateStats();
    updateSidebarBadge();
    toast('<i class="fas fa-check" style="color:var(--green)"></i> Donasi dihapus', 'success');
  }
}

// Search Donations
function searchDonations() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const filtered = allDonations.filter(d => 
    d.name.toLowerCase().includes(query) || 
    d.id.toString().includes(query)
  );
  
  const tbody = document.getElementById('donationsTable');
  tbody.innerHTML = filtered.slice(0, itemsPerPage).map(d => `
    <tr>
      <td>#${d.id}</td>
      <td>${d.name}</td>
      <td>${formatRp(d.amount)}</td>
      <td><span class="method-tag ${d.method}">${d.method.toUpperCase()}</span></td>
      <td>${d.msg || '-'}</td>
      <td>${d.date}</td>
      <td><span class="status-badge ${d.status}"><i class="fas fa-${d.status === 'completed' ? 'check' : 'clock'}"></i> ${d.status === 'completed' ? 'Selesai' : 'Menunggu'}</span></td>
      <td>
        <div class="action-btns">
          <button class="action-btn view" onclick="viewDonation(${d.id})"><i class="fas fa-eye"></i></button>
          <button class="action-btn delete" onclick="deleteDonation(${d.id})"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Show Section
function showSection(section) {
  document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  
  document.getElementById(section + 'Section').classList.add('active');
  event.target.closest('.nav-item').classList.add('active');
  
  if (section === 'analytics') {
    renderTopDonors();
  }
}

// Update Sidebar Badge
function updateSidebarBadge() {
  const pending = allDonations.filter(d => d.status === 'pending').length;
  document.getElementById('sidebarBadge').textContent = pending;
  document.getElementById('sidebarBadge').style.display = pending > 0 ? 'block' : 'none';
}

// Update Date
function updateDate() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('currentDate').textContent = now.toLocaleDateString('id-ID', options);
}

// Refresh Data
function refreshData() {
  loadDonations();
  updateStats();
  toast('<i class="fas fa-rotate-right"></i> Data diperbarui', 'success');
}

// Export to CSV
function exportData() {
  const csv = [
    ['ID', 'Nama', 'Jumlah', 'Metode', 'Pesan', 'Tanggal', 'Status'],
    ...allDonations.map(d => [d.id, d.name, d.amount, d.method, d.msg, d.date, d.status])
  ].map(row => row.join(',')).join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `donasi_nexadev_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  
  toast('<i class="fas fa-download"></i> Data diexport', 'success');
}

// Backup Data
function backupData() {
  const data = JSON.stringify(allDonations, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_nexadev_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  
  toast('<i class="fas fa-download"></i> Backup berhasil', 'success');
}

// Import Data
function importData(input) {
  const file = input.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (Array.isArray(data)) {
        allDonations = data;
        localStorage.setItem('nexa_donations', JSON.stringify(allDonations));
        loadDonations();
        updateStats();
        toast('<i class="fas fa-check" style="color:var(--green)"></i> Import berhasil', 'success');
      } else {
        throw new Error('Invalid format');
      }
    } catch (err) {
      toast('<i class="fas fa-times" style="color:var(--red)"></i> Format file tidak valid', 'error');
    }
  };
  reader.readAsText(file);
  input.value = '';
}

// Clear All Data
function clearAllData() {
  if (confirm('⚠️ Yakin ingin menghapus SEMUA data? Tindakan ini tidak dapat dibatalkan!')) {
    allDonations = [];
    localStorage.removeItem('nexa_donations');
    loadDonations();
    updateStats();
    toast('<i class="fas fa-trash"></i> Semua data dihapus', 'info');
  }
}

// Render Charts (Simple Canvas)
function renderCharts() {
  // Weekly chart placeholder
  const canvas = document.getElementById('weeklyChart');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Simple bar chart
    const data = [45000, 62000, 35000, 78000, 54000, 91000, 67000];
    const max = Math.max(...data);
    const barWidth = (canvas.width - 60) / data.length;
    
    ctx.fillStyle = '#1c1c26';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    data.forEach((val, i) => {
      const height = (val / max) * (canvas.height - 40);
      const x = 30 + i * barWidth + barWidth * 0.2;
      const y = canvas.height - height - 20;
      
      // Gradient
      const grad = ctx.createLinearGradient(0, y, 0, canvas.height - 20);
      grad.addColorStop(0, '#f5c842');
      grad.addColorStop(1, '#7c5cfc');
      
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, barWidth * 0.6, height);
      
      // Label
      ctx.fillStyle = '#6a6a88';
      ctx.font = '11px Poppins';
      ctx.textAlign = 'center';
      ctx.fillText(['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][i], x + barWidth * 0.3, canvas.height - 5);
    });
  }
  
  // Method chart
  const methodCanvas = document.getElementById('methodChart');
  if (methodCanvas) {
    const ctx = methodCanvas.getContext('2d');
    methodCanvas.width = methodCanvas.offsetWidth;
    methodCanvas.height = methodCanvas.offsetHeight;
    
    const methods = { qris: 0, dana: 0, ovo: 0, gopay: 0 };
    allDonations.forEach(d => methods[d.method]++);
    
    const total = Object.values(methods).reduce((a, b) => a + b, 0);
    if (total === 0) return;
    
    let currentAngle = 0;
    const colors = ['#f5c842', '#0072ef', '#632cb3', '#00a94f'];
    const centerX = methodCanvas.width / 2;
    const centerY = methodCanvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    Object.entries(methods).forEach(([method, count], i) => {
      const angle = (count / total) * Math.PI * 2;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + angle);
      ctx.closePath();
      ctx.fillStyle = colors[i];
      ctx.fill();
      
      currentAngle += angle;
    });
    
    // Center hole
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = '#22222e';
    ctx.fill();
  }
}

// Render Top Donors
function renderTopDonors() {
  const donors = {};
  allDonations.forEach(d => {
    donors[d.name] = (donors[d.name] || 0) + d.amount;
  });
  
  const sorted = Object.entries(donors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  const container = document.getElementById('topDonorsList');
  container.innerHTML = sorted.map(([name, amount], i) => `
    <div class="top-item">
      <div class="top-rank">${i + 1}</div>
      <div class="top-info">
        <div class="top-name">${name}</div>
        <div class="top-amount">${formatRp(amount)}</div>
      </div>
    </div>
  `).join('');
}

// Toast Notification
function toast(html, type = 'info') {
  const box = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.innerHTML = html;
  box.appendChild(t);
  setTimeout(() => {
    t.classList.add('leaving');
    setTimeout(() => t.remove(), 320);
  }, 3200);
}

// Utility Functions
function formatRp(n) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function formatTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000 / 60);
  
  if (diff < 1) return 'Baru saja';
  if (diff < 60) return `${diff} menit lalu`;
  if (diff < 1440) return `${Math.floor(diff / 60)} jam lalu`;
  return `${Math.floor(diff / 1440)} hari lalu`;
}
