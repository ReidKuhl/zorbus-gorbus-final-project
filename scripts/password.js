function enterApp() {
  const name = document.getElementById('gate-name').value.trim();
  const pass = document.getElementById('gate-pass').value;
  const err  = document.getElementById('gate-error');

  if (!pass) {
    err.textContent = 'Enter the password.';
    return;
  }
  if (pass !== 'flobjj') {
    err.textContent = 'Incorrect password.';
    document.getElementById('gate-pass').value = '';
    document.getElementById('gate-pass').focus();
    return;
  }

  const encodedName = encodeURIComponent(name || 'Practitioner');
  window.location.href = 'tracker.html?name=' + encodedName;
}
