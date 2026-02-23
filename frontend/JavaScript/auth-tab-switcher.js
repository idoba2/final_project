(function() {
    'use strict';

    // Handles switching between login and register tabs.
    function initAuthTabs() {
        const tabs = document.querySelectorAll('.auth-tab');
        const formWrappers = document.querySelectorAll('.auth-form-wrapper');

        if (!tabs.length || !formWrappers.length) {
            // If tabs aren't on this page, just stop here.
            return;
        }

        // Switch UI to the selected tab.
        function switchTab(tabName) {
            // Highlight active tab button.
            tabs.forEach(tab => {
                if (tab.dataset.tab === tabName) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });

            // Show the right form and hide the other one.
            formWrappers.forEach(wrapper => {
                if (wrapper.id === `${tabName}-form`) {
                    wrapper.classList.add('active');
                } else {
                    wrapper.classList.remove('active');
                }
            });

            // Clear old auth errors when user switches tabs.
            const errorElements = document.querySelectorAll('[data-auth-error]');
            errorElements.forEach(el => {
                el.textContent = '';
            });

            // Move focus to first input for smoother UX.
            const activeForm = document.querySelector(`.auth-form-wrapper.active form`);
            if (activeForm) {
                const firstInput = activeForm.querySelector('input[type="text"], input[type="email"]');
                if (firstInput) {
                    setTimeout(() => firstInput.focus(), 100);
                }
            }

            console.log(`✅ Switched to ${tabName} tab`);
        }

        // Click handler for tab buttons.
        function handleTabClick(event) {
            const tabName = event.currentTarget.dataset.tab;
            switchTab(tabName);
        }

        // Attach click listeners to both tabs.
        tabs.forEach(tab => {
            tab.addEventListener('click', handleTabClick);
        });

        // Support direct links like #register.
        const hash = window.location.hash.replace('#', '');
        if (hash === 'register' || hash === 'login') {
            switchTab(hash);
        }

        // Keep URL hash in sync for quick sharing/bookmarking.
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                history.replaceState(null, null, `#${tabName}`);
            });
        });

        // Allow left/right arrow keyboard navigation in tab bar.
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                const activeTab = document.querySelector('.auth-tab.active');
                if (!activeTab) return;

                const currentIndex = Array.from(tabs).indexOf(activeTab);
                let newIndex;

                if (e.key === 'ArrowLeft') {
                    newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
                } else {
                    newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
                }

                const newTab = tabs[newIndex];
                if (newTab && document.activeElement.closest('.auth-tabs')) {
                    switchTab(newTab.dataset.tab);
                    newTab.focus();
                }
            }
        });

        console.log('✅ Auth tab switcher initialized');
    }

    // Start once DOM is ready.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAuthTabs);
    } else {
        initAuthTabs();
    }

})();
