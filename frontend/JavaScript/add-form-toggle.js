(() => {
  'use strict';

  // Switches between Pokemon/Anime/Game forms on Add page.
  function initContentTabs() {
    const tabs = document.querySelectorAll('.auth-tab[data-tab]');
    const formWrappers = document.querySelectorAll('.auth-form-wrapper');

    // Keep only the content tabs (not login/register).
    const contentTabs = Array.from(tabs).filter(tab => 
      ['pokemon', 'anime', 'game'].includes(tab.dataset.tab)
    );

    if (!contentTabs.length || !formWrappers.length) {
      return;
    }

    // Show selected form and update active tab state.
    function switchTab(tabName) {
      // Update active tab styles.
      contentTabs.forEach(tab => {
        if (tab.dataset.tab === tabName) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });

      // Show matching form panel.
      formWrappers.forEach(wrapper => {
        if (wrapper.id === `${tabName}-form`) {
          wrapper.classList.add('active');
        } else {
          wrapper.classList.remove('active');
        }
      });

      // Focus first field in the active form.
      const activeForm = document.querySelector(`.auth-form-wrapper.active form`);
      if (activeForm) {
        const firstInput = activeForm.querySelector('input[type="text"], input[type="date"]');
        if (firstInput) {
          setTimeout(() => firstInput.focus(), 100);
        }
      }
    }

    // Handle content tab clicks.
    contentTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        switchTab(tab.dataset.tab);
      });
    });

    // Prevent selecting the same Pokemon type twice.
    const pokemonType1 = document.getElementById("pokemonType1");
    const pokemonType2 = document.getElementById("pokemonType2");
    if (pokemonType1 && pokemonType2) {
      const syncTypes = () => {
        if (pokemonType2.value && pokemonType2.value === pokemonType1.value) {
          pokemonType2.value = "";
        }
      };
      pokemonType1.addEventListener("change", syncTypes);
      pokemonType2.addEventListener("change", syncTypes);
    }
  }

  // Start when DOM is ready.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContentTabs);
  } else {
    initContentTabs();
  }
})();
