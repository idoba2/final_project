(() => {
  const container = document.querySelector('[data-user-info]');
  if (!container) {
    return;
  }

  fetch('/auth/status')
    .then((response) => response.json())
    .then((data) => {
      if (!data.isLoggedIn || !data.user) {
        container.textContent = '';
        return;
      }

      const { username, city, gender, occupation } = data.user;
      container.innerHTML = `
        <p><strong>Username:</strong> ${username || ''}</p>
        <p><strong>City:</strong> ${city || ''}</p>
        <p><strong>Gender:</strong> ${gender || ''}</p>
        <p><strong>Occupation:</strong> ${occupation || ''}</p>
      `;
    })
    .catch(() => {
      container.textContent = '';
    });
})();
