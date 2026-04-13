// Konfigurasi Admin dari Environment Variables 
const ADMIN_CREDENTIALS = { 
  username: import.meta.env.ADMIN_USERNAME, 
  password: import.meta.env.ADMIN_PASSWORD 
}; 
 
// State Aplikasi 
let currentPage = 1; 
let itemsPerPage = 10; 
let currentFilter = 'all'; 
let allDonations = ; 
 
// Inisialisasi saat DOM siap 
document.addEventListener('DOMContentLoaded', () => { 
  checkAuth(); 
  updateDate(); 
  setupEventListeners(); 
}); 
 
// Fungsi Autentikasi 
function checkAuth() { 
  const isLoggedIn = sessionStorage.getItem('admin_logged_in'); 
  if (isLoggedIn === 'true') { 
    showDashboard(); 
  } else { 
    showLogin(); 
  } 
} 
 
function showLogin() { 
  document.getElementById('loginPage').style.display = 'flex'; 
  document.getElementById('dashboardPage').style.display = 'none'; 
} 
 
function showDashboard() { 
  document.getElementById('loginPage').style.display = 'none'; 
  document.getElementById('dashboardPage').style.display = 'flex'; 
  loadDonations(); 
  updateStats(); 
  renderCharts(); 
} 
 
function setupEventListeners() { 
  const loginForm = document.getElementById('loginForm'); 
  if (loginForm) loginForm.addEventListener('submit', handleLogin); 
   
  const passwordInput = document.getElementById('password'); 
  if (passwordInput) { 
    passwordInput.addEventListener('keypress', (e) => { 
      if (e.key === 'Enter') handleLogin(e); 
    }); 
  } 
} 
 
function handleLogin(e) { 
  e.preventDefault(); 
   
  const usernameInput = document.getElementById('username').value.trim(); 
  const passwordInput = document.getElementById('password').value; 
  const btn = document.querySelector('.login-btn'); 
   
  btn.classList.add('loading'); 
   
  setTimeout(() => { 
    // Validasi menggunakan kredensial dari .env 
    if (usernameInput === ADMIN_CREDENTIALS.username && passwordInput === ADMIN_CREDENTIALS.password) { 
      sessionStorage.setItem('admin_logged_in', 'true'); 
      toast('<i class="fas fa-check-circle" style="color:var(--green)"></i> Login berhasil!', 'success'); 
      showDashboard(); 
    } else { 
      toast('<i class="fas fa-times-circle" style="color:var(--red)"></i> Username atau password salah!', 'error'); 
    } 
    btn.classList.remove('loading'); 
  }, 1000); 
} 
 
function togglePassword() { 
  const input = document.getElementById('password'); 
  const icon = document.getElementById('eyeIcon'); 
  if (input.type === 'password') { 
    input.type = 'text'; 
    icon.classList.replace('fa-eye', 'fa-eye-slash'); 
  } else { 
    input.type = 'password'; 
    icon.classList.replace('fa-eye-slash', 'fa-eye'); 
  } 
} 
 
function logout() { 
  sessionStorage.removeItem('admin_logged_in'); 
  toast('<i class="fas fa-sign-out-alt"></i> Logout berhasil', 'info'); 
  setTimeout(() => { 
    showLogin(); 
    document.getElementById('username').value = ''; 
    document.getElementById('password').value = ''; 
  }, 500); 
} 
 
// Manajemen Data Donasi 
function loadDonations() { 
  const stored = localStorage.getItem('nexa_donations'); 
  allDonations = stored ? JSON.parse(stored) : getSampleData(); 
  if (!stored) localStorage.setItem('nexa_donations', JSON.stringify(allDonations)); 
   
  renderDonationsTable(); 
  updateSidebarBadge(); 
} 
 
function getSampleData() { 
  return [ 
    { id: 1, name: 'Budi Santoso', amount: 50000, method: 'qris', msg: 'Semangat terus kak! 💪', date: '2026-04-13 14:30', status: 'completed' }, 
    { id: 2, name: 'Anonim', amount: 10000, method: 'dana', msg: 'Keep creating!', date: '2026-04-13 13:15', status: 'completed' } 
  ]; 
} 
 
function updateStats() { 
  const total = allDonations.reduce((sum, d) => sum + d.amount, 0); 
  const pending = allDonations.filter(d => d.status === 'pending').length; 
   
  document.getElementById('totalDonations').textContent = formatRp(total); 
  document.getElementById('totalDonors').textContent = allDonations.length; 
  document.getElementById('pendingCount').textContent = pending; 
  updateRecentList(); 
} 
 
function renderDonationsTable() { 
  let filtered = currentFilter === 'all' ? allDonations : allDonations.filter(d => d.status === currentFilter); 
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
      <td><span class="status-badge ${d.status}">${d.status === 'completed' ? 'Selesai' : 'Menunggu'}</span></td> 
      <td> 
        <button onclick="deleteDonation(${d.id})" class="action-btn delete"><i class="fas fa-trash"></i></button> 
      </td> 
    </tr> 
  `).join(''); 
} 
 
// Utilitas 
function formatRp(n) { 
  return 'Rp ' + n.toLocaleString('id-ID'); 
} 
 
function toast(html, type = 'info') { 
  const box = document.getElementById('toastContainer'); 
  const t = document.createElement('div'); 
  t.className = `toast ${type}`; 
  t.innerHTML = html; 
  box.appendChild(t); 
  setTimeout(() => { 
    t.classList.add('leaving'); 
    setTimeout(() => t.remove(), 320); 
  }, 3200); 
} 
 
function updateDate() { 
  const now = new Date(); 
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }; 
  document.getElementById('currentDate').textContent = now.toLocaleDateString('id-ID', options); 
} 

