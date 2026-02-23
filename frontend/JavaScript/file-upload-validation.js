document.addEventListener('DOMContentLoaded', () => {
  const maxFileSize = 5 * 1024 * 1024;
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  const allowedMimeTypes = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/gif']);

  const fileInputs = document.querySelectorAll('input[type="file"]');

  if (!fileInputs.length) {
    return;
  }

  const extensionOf = (fileName) => {
    const dotIndex = fileName.lastIndexOf('.');
    return dotIndex >= 0 ? fileName.slice(dotIndex).toLowerCase() : '';
  };

  const findErrorNode = (input) => {
    return input.parentElement?.querySelector('[data-file-error]') || null;
  };

  const ensureHintNode = (input) => {
    let hintNode = input.parentElement?.querySelector('[data-file-hint]') || null;

    if (!hintNode) {
      hintNode = document.createElement('div');
      hintNode.setAttribute('data-file-hint', 'true');
      hintNode.style.marginTop = '6px';
      hintNode.style.color = '#555';
      hintNode.style.fontSize = '13px';
      hintNode.textContent = 'Permitted file types: .jpg, .jpeg, .png, .gif (max 5MB).';
      input.parentElement?.appendChild(hintNode);
    }

    return hintNode;
  };

  const setError = (input, message) => {
    let errorNode = findErrorNode(input);

    if (!errorNode) {
      errorNode = document.createElement('div');
      errorNode.setAttribute('data-file-error', 'true');
      errorNode.style.marginTop = '6px';
      errorNode.style.color = '#b00020';
      errorNode.style.fontSize = '13px';
      input.parentElement?.appendChild(errorNode);
    }

    errorNode.textContent = message;
    input.setCustomValidity(message);
  };

  const clearError = (input) => {
    const errorNode = findErrorNode(input);
    if (errorNode) {
      errorNode.textContent = '';
    }
    input.setCustomValidity('');
  };

  const validateFileInput = (input) => {
    clearError(input);

    const selectedFile = input.files && input.files[0];

    if (!selectedFile) {
      return true;
    }

    let errorMessage = '';

    if (selectedFile.size > maxFileSize) {
      errorMessage = 'File too large. Maximum allowed size is 5MB.';
    } else {
      const extension = extensionOf(selectedFile.name);
      if (!allowedExtensions.includes(extension)) {
        errorMessage = 'Invalid file type. Permitted file types: .jpg, .jpeg, .png, .gif.';
      } else if (selectedFile.type && !allowedMimeTypes.has(selectedFile.type.toLowerCase())) {
        errorMessage = 'Invalid image format. Permitted file types: .jpg, .jpeg, .png, .gif.';
      }
    }

    if (errorMessage) {
      setError(input, errorMessage);
      input.value = '';
      input.reportValidity();
      return false;
    }

    return true;
  };

  fileInputs.forEach((input) => {
    ensureHintNode(input);

    input.addEventListener('change', () => {
      validateFileInput(input);
    });

    const form = input.closest('form');
    if (form && !form.dataset.fileValidationBound) {
      form.dataset.fileValidationBound = 'true';
      form.addEventListener('submit', (event) => {
        const formFileInputs = form.querySelectorAll('input[type="file"]');
        let allValid = true;

        formFileInputs.forEach((formInput) => {
          if (!validateFileInput(formInput)) {
            allValid = false;
          }
        });

        if (!allValid) {
          event.preventDefault();
        }
      });
    }
  });
});
