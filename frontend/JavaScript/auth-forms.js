(() => {
  const setError = (form, message) => {
    const errorEl = form.querySelector('[data-auth-error]');
    if (errorEl) {
      errorEl.textContent = message || '';
    }
  };

  const disableSubmitButton = (form) => {
    const submitBtn = form.querySelector('input[type="submit"], button[type="submit"]');
    if (submitBtn) {
      submitBtn.dataset.originalValue = submitBtn.tagName === 'INPUT' ? submitBtn.value : submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.6';
      submitBtn.style.cursor = 'not-allowed';
      
      if (submitBtn.tagName === 'INPUT') {
        submitBtn.value = 'Processing...';
      } else {
        submitBtn.textContent = 'Processing...';
      }
    }
    return submitBtn;
  };

  const enableSubmitButton = (form, submitBtn) => {
    if (submitBtn) {
      const originalValue = submitBtn.dataset.originalValue;
      if (originalValue) {
        if (submitBtn.tagName === 'INPUT') {
          submitBtn.value = originalValue;
        } else {
          submitBtn.textContent = originalValue;
        }
      }
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      submitBtn.style.cursor = 'pointer';
    }
  };

  const handleSubmit = (form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      setError(form, '');

      const submitBtn = disableSubmitButton(form);

      const formData = new FormData(form);
      const body = new URLSearchParams();

      formData.forEach((value, key) => {
        body.append(key, value);
      });

      fetch(form.action, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
      })
        .then((response) => {
          const contentType = response.headers.get('content-type') || '';

          if (contentType.includes('application/json')) {
            return response.json().then((data) => ({ response, data }));
          }

          return response.text().then((text) => ({
            response,
            data: { message: text }
          }));
        })
        .then(({ response, data }) => {
          if (!response.ok) {
            const message = data.message || `Server error (${response.status})`;
            setError(form, message);
            enableSubmitButton(form, submitBtn);
            return;
          }

          if (data.redirect) {
            window.location.href = data.redirect;
            return;
          }

          window.location.reload();
        })
        .catch(() => {
          setError(form, 'Network error. Please try again.');
          enableSubmitButton(form, submitBtn);
        });
    });
  };

  document.querySelectorAll('form[action="/login"], form[action="/register"]').forEach(handleSubmit);
})();
