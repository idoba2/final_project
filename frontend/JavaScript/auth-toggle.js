document.addEventListener('DOMContentLoaded', () => {
    const loginForms = document.querySelectorAll('.login-auth-form');
    const logoutForms = document.querySelectorAll('.logout-auth-form');

    fetch('/auth/status')
        .then((response) => response.json())
        .then((data) => {
            if (data.isLoggedIn) {
                loginForms.forEach((form) => {
                    form.style.display = 'none';
                });

                logoutForms.forEach((form) => {
                    form.style.display = 'block';
                });
            } else {
                loginForms.forEach((form) => {
                    form.style.display = 'block';
                });

                logoutForms.forEach((form) => {
                    form.style.display = 'none';
                });
            }
        })
        .catch(() => {
            loginForms.forEach((form) => {
                form.style.display = 'block';
            });

            logoutForms.forEach((form) => {
                form.style.display = 'none';
            });
        });
});