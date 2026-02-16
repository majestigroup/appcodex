const loginForm = document.getElementById('login-form');
const loginSubmit = document.getElementById('login-submit');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const fillDemoBtn = document.getElementById('fill-demo');
const errorEl = document.getElementById('login-error');

const params = new URLSearchParams(window.location.search);
const errorCode = params.get('error');

if (errorCode === 'invalid_credentials') {
  errorEl.textContent = 'Invalid credentials. Please use admin / password123.';
  errorEl.classList.remove('hidden');
}

fillDemoBtn.addEventListener('click', () => {
  usernameInput.value = 'admin';
  passwordInput.value = 'password123';
  usernameInput.focus();
});

loginForm.addEventListener('submit', () => {
  loginSubmit.disabled = true;
  loginSubmit.textContent = 'Signing in...';
});
