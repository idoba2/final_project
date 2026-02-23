(() => {
  'use strict';

  const startDateInput = document.getElementById('animeStartDate');
  const endDateInput = document.getElementById('animeEndDate');

  if (!startDateInput || !endDateInput) {
    return;
  }

  // Keep end date from going before the start date.
  startDateInput.addEventListener('change', () => {
    if (startDateInput.value) {
      endDateInput.min = startDateInput.value;
      
      // If selected end date is now invalid, clear it.
      if (endDateInput.value && endDateInput.value < startDateInput.value) {
        endDateInput.value = '';
      }
    }
  });

  // Final check on submit, just to be safe.
  const animeForm = document.querySelector('#animeForm form');
  if (animeForm) {
    animeForm.addEventListener('submit', (e) => {
      if (startDateInput.value && endDateInput.value) {
        if (new Date(endDateInput.value) < new Date(startDateInput.value)) {
          e.preventDefault();
          alert('End date cannot be earlier than start date');
        }
      }
    });
  }
})();
