(function () {
    // Grab all the main quiz elements once so we can reuse them easily.
    const form = document.getElementById('pokeQuizForm');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const resultModal = document.getElementById('resultModal');
    const scoreText = document.getElementById('scoreText');
    const discountMessage = document.getElementById('discountMessage');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const submitButton = form ? form.querySelector('button[type="submit"]') : null;

    if (!form || !nameInput || !phoneInput) {
        return;
    }

    const submitUrl = form.getAttribute('data-submit-url');
    const defaultSubmitText = submitButton ? submitButton.textContent : 'Submit';
    let isSubmitted = false;

    // Small helper to close the result modal.
    function closeResultModal() {
        if (!resultModal) {
            return;
        }

        resultModal.style.display = 'none';
        resultModal.setAttribute('aria-hidden', 'true');
    }

    // Opens the modal and shows the score after successful submit.
    function openResultModal(score) {
        if (!resultModal || !scoreText) {
            return;
        }

        scoreText.textContent = `${score}/5`;
        if (discountMessage) {
            discountMessage.textContent = 'Your discount code has been sent to your email! (Valid for one-time use only)';
        }
        resultModal.style.display = 'flex';
        resultModal.setAttribute('aria-hidden', 'false');
    }

    // Keep the name clean: only letters and spaces.
    nameInput.addEventListener('input', function () {
        nameInput.value = nameInput.value.replace(/[^A-Za-z ]/g, '');
        nameInput.setCustomValidity('');
    });

    // Keep phone input numeric and max 10 digits.
    phoneInput.addEventListener('input', function () {
        phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
        phoneInput.setCustomValidity('');
    });

    if (modalCloseBtn) {
        // Closing the result modal when the user clicks the "X".
        modalCloseBtn.addEventListener('click', closeResultModal);
    }

    if (resultModal) {
        // Also close if user clicks on the dark overlay.
        resultModal.addEventListener('click', function (event) {
            if (event.target === resultModal) {
                closeResultModal();
            }
        });
    }

    // This part handles the form submission when the user finishes the quiz.
    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        if (isSubmitted) {
            return;
        }

        const cleanedName = nameInput.value.trim();
        const cleanedPhone = phoneInput.value.replace(/\D/g, '').slice(0, 10);
        phoneInput.value = cleanedPhone;
        const lettersOnlyName = cleanedName.replace(/[^A-Za-z]/g, '');

        // Simple checks before sending anything to the server.
        const isNameValid = lettersOnlyName.length >= 2;

        // Checking if the phone number is valid using a simple regex.
        const isPhoneValid = /^0[0-9]{8,9}$/.test(cleanedPhone);

        nameInput.setCustomValidity(isNameValid ? '' : 'Name must be at least 2 letters');
        phoneInput.setCustomValidity(isPhoneValid ? '' : 'Phone must start with 0 and be 9-10 digits');

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        if (!submitUrl) {
            alert('Quiz submit URL is missing.');
            return;
        }

        // Disable submit so users don't double-send by mistake.
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Processing...';
        }

        try {
            const response = await fetch(submitUrl, {
                method: 'POST',
                body: new FormData(form)
            });

            const responseData = await response.json();

            if (!response.ok || !responseData.success) {
                throw new Error(responseData.message || 'Could not submit quiz result.');
            }

            // Mark as submitted and clear the form after success.
            isSubmitted = true;
            form.reset();

            const floatingTabElement = document.querySelector('.quiz-fab');
            if (floatingTabElement) {
                floatingTabElement.style.display = 'none';
            }

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Submitted ✓';
            }

            // Show final score in the modal.
            openResultModal(responseData.score);
        } catch (error) {
            alert(error.message || 'There was a problem submitting the quiz.');
        } finally {
            if (submitButton && !isSubmitted) {
                submitButton.disabled = false;
                submitButton.textContent = defaultSubmitText;
            }
        }
    });
})();