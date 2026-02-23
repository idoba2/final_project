$(document).ready(function() {
    'use strict';

    console.log('✅ Global jQuery Features Loaded');
    console.log('jQuery v' + $.fn.jquery + ' - All animations initialized');

    const normalizedPath = window.location.pathname.toLowerCase();
    const isPokeQuizPage = /^\/pokequiz(?:\/|$)/.test(normalizedPath);

    if (!isPokeQuizPage && !$('.quiz-fab').length) {
        $('<a>')
            .attr('href', '/PokeQuiz')
            .addClass('quiz-fab')
            .text('Test your knowledge to get a discount code for the next Pokémon game! ⚡')
            .appendTo('body');
    }

    // Kept here as a reminder: we removed fade-in for faster page load.
    // $('body').hide().fadeIn(800) - animation removed for faster navigation

    // Block right-click on images and show a tiny warning toast.
    $(document).on('contextmenu', 'img', function(e) {
        e.preventDefault();
        
        // Build a small temporary alert.
        const $alert = $('<div>')
            .text('⚠️ Image protection enabled')
            .css({
                'position': 'fixed',
                'top': '20px',
                'right': '20px',
                'background': '#ff6b6b',
                'color': 'white',
                'padding': '12px 16px',
                'border-radius': '4px',
                'z-index': '9999',
                'font-weight': 'bold',
                'box-shadow': '0 4px 12px rgba(0, 0, 0, 0.3)'
            })
            .appendTo('body');

        // Auto-remove after 2 seconds
        setTimeout(() => {
            $alert.fadeOut(300, function() { 
                $(this).remove(); 
            });
        }, 2000);
    });

    // Add loading state to most forms (except auth + quiz forms).
    $(document).on('submit', 'form', function() {
        const $form = $(this);

        if ($form.attr('id') === 'pokeQuizForm') {
            return;
        }
        
        // Login/register already handled in their own script.
        if ($form.attr('action') === '/login' || $form.attr('action') === '/register') {
            return;
        }
        
        const $submitBtn = $form.find('input[type="submit"], button[type="submit"]');
        
        if ($submitBtn.length) {
            // Save current button text so we can restore it if needed.
            const originalText = $submitBtn.is('input') ? $submitBtn.val() : $submitBtn.text();
            $submitBtn.data('original-text', originalText);
            
            // Disable while submitting.
            $submitBtn.prop('disabled', true)
                      .css('opacity', '0.6')
                      .css('cursor', 'not-allowed');
            
            // Show loading text on both input/button submits.
            if ($submitBtn.is('input')) {
                $submitBtn.val('Processing...');
            } else {
                $submitBtn.text('Processing...');
            }
            
            console.log('📤 Form submission initiated');
            
            // If we stay on page too long, restore button so user can retry.
            setTimeout(function() {
                if (document.visibilityState === 'visible' && $submitBtn.prop('disabled')) {
                    if ($submitBtn.is('input')) {
                        $submitBtn.val(originalText);
                    } else {
                        $submitBtn.text(originalText);
                    }
                    
                    $submitBtn.prop('disabled', false)
                              .css('opacity', '1')
                              .css('cursor', 'pointer');
                    
                    console.log('⚠️ Form submission reset (possible error)');
                }
            }, 2000);
        }
    });

    // Card hover effect for anime/game cards.
    $(document).on('mouseenter', '.game-card, .anime-card', function() {
        $(this).css({
            'box-shadow': '0 12px 24px rgba(0, 0, 0, 0.3)',
            'transform': 'translateY(-5px)',
            'transition': 'all 0.2s ease',
            'will-change': 'transform'
        });
    }).on('mouseleave', '.game-card, .anime-card', function() {
        $(this).css({
            'box-shadow': '0 6px 12px rgba(0, 0, 0, 0.12)',
            'transform': 'translateY(0)',
            'transition': 'all 0.2s ease'
        });
    });

    // Tiny hover animation on pagination buttons.
    $(document).on('mouseenter', '.games-pagination button, .anime-pagination button', function() {
        $(this).css({
            'transform': 'scale(1.05)',
            'transition': 'all 0.2s ease'
        });
    }).on('mouseleave', '.games-pagination button, .anime-pagination button', function() {
        $(this).css({
            'transform': 'scale(1)',
            'transition': 'all 0.2s ease'
        });
    });

    // Email validation with browser native messages.
    // Clear old validation state while user types.
    $(document).on('input', 'input[type="email"]', function() {
        const $input = $(this);
        
        this.setCustomValidity('');
        
        $input.css({
            'border-color': '',
            'background-color': ''
        });
    });
    
    // Validate email on blur.
    $(document).on('blur', 'input[type="email"]', function() {
        const $input = $(this);
        const email = $input.val().trim();
        
        // Simple email regex that covers regular formats.
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email && !emailRegex.test(email)) {
            this.setCustomValidity('❌ Please enter a valid email address (e.g., user@example.com)');

            this.reportValidity();

            $input.css({
                'border-color': '#ff6b6b',
                'background-color': '#ffe0e0'
            });
            
            console.log('⚠️ Email validation failed: ' + email);
        } else if (email) {
            this.setCustomValidity('');

            $input.css({
                'border-color': '#4CAF50',
                'background-color': '#f0fff0'
            });
            
            console.log('✅ Email validated: ' + email);
        } else {
            this.setCustomValidity('');
            $input.css({
                'border-color': '',
                'background-color': ''
            });
        }
    });

    // Password strength check for registration only.
    $(document).on('input', 'input[type="password"][name="password"]:not(.login-password)', function() {
        const $input = $(this);
        const password = $input.val();
        
        // Skip login form passwords.
        const $form = $input.closest('form');
        if ($form.attr('action') === '/login') {
            return;
        }
        
        this.setCustomValidity('');
        
        if (password.length === 0) {
            $input.css({
                'border-color': '',
                'background-color': ''
            });
            return;
        }
        
        // Basic strength checks.
        const hasMinLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        
        let strength = 0;
        let validationMessage = '';
        
        if (hasMinLength) strength++;
        if (hasUpperCase) strength++;
        if (hasLowerCase) strength++;
        if (hasNumber) strength++;
        
        if (strength < 4) {
            const missing = [];
            if (!hasMinLength) missing.push('at least 8 characters');
            if (!hasUpperCase) missing.push('one uppercase letter');
            if (!hasLowerCase) missing.push('one lowercase letter');
            if (!hasNumber) missing.push('one number');
            
            validationMessage = '⚠️ Password must contain: ' + missing.join(', ');
        }
        
        if (strength === 4) {
            this.setCustomValidity('');
            $input.css({
                'border-color': '#4CAF50',
                'background-color': '#f0fff0'
            });
            console.log('✅ Strong password');
        } else if (strength >= 2) {
            this.setCustomValidity('');
            $input.css({
                'border-color': '#ff9800',
                'background-color': '#fff8e1'
            });
            console.log('⚠️ Medium password: ' + validationMessage);
        } else {
            this.setCustomValidity(validationMessage);
            $input.css({
                'border-color': '#ff6b6b',
                'background-color': '#ffe0e0'
            });
            console.log('❌ Weak password: ' + validationMessage);
        }
    });
    
    // Re-check password on blur for register form.
    $(document).on('blur', 'input[type="password"][name="password"]:not(.login-password)', function() {
        const $input = $(this);
        const password = $input.val();
        
        const $form = $input.closest('form');
        if ($form.attr('action') === '/login') {
            return;
        }
        
        if (!password) {
            return;
        }
        
        const hasMinLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        
        const strength = [hasMinLength, hasUpperCase, hasLowerCase, hasNumber].filter(Boolean).length;
        
        if (strength < 4) {
            const missing = [];
            if (!hasMinLength) missing.push('at least 8 characters');
            if (!hasUpperCase) missing.push('one uppercase letter');
            if (!hasLowerCase) missing.push('one lowercase letter');
            if (!hasNumber) missing.push('one number');
            
            const message = '⚠️ Password must contain: ' + missing.join(', ');
            this.setCustomValidity(message);
            
            // We avoid reportValidity here so focus flow stays smooth.
        } else {
            this.setCustomValidity('');
        }
    });

    // Keep login inputs clean and avoid focus-trap behavior.
    $(document).on('blur', 'input[type="password"].login-password', function() {
        const $input = $(this);
        $input.css({
            'border-color': '',
            'background-color': ''
        });
        
        this.setCustomValidity('');
    });

    // Enable confirm password only after user starts typing password.
    $(document).on('input', 'input#registerPassword', function() {
        const $passwordField = $(this);
        const $confirmField = $('#confirmPassword');
        
        if ($confirmField.length === 0) {
            return;
        }
        
        const passwordValue = $passwordField.val();
        
        if (passwordValue.length > 0) {
            $confirmField.prop('disabled', false)
                         .css({
                             'background-color': '#ffffff',
                             'cursor': 'text'
                         });
            
            console.log('✅ Confirm Password field enabled');
        } else {
            $confirmField.prop('disabled', true)
                         .val('')
                         .css({
                             'background-color': '#f5f5f5',
                             'cursor': 'not-allowed',
                             'border-color': '#ccc'
                         });
            
            $confirmField[0].setCustomValidity('');
            
            console.log('⚠️ Confirm Password field disabled (main password empty)');
        }
    });
    
    // If confirm password is disabled, show a quick visual hint.
    $(document).on('focus', 'input#confirmPassword:disabled', function() {
        const $this = $(this);

        $this.attr('title', '⚠️ Please enter a password first');

        $this.css({
            'animation': 'shake 0.3s ease',
            'border-color': '#ff9800'
        });
        
        setTimeout(() => {
            $this.css({
                'animation': '',
                'border-color': ''
            });
        }, 300);
        
        console.log('⚠️ User tried to use Confirm Password before main Password');
    });
    
    // Inject shake animation CSS once.
    if (!$('#shake-animation-style').length) {
        $('<style id="shake-animation-style">')
            .text('@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }')
            .appendTo('head');
    }

    // Tab switching is handled in auth-tab-switcher.js (vanilla JS).

    // Global keyboard shortcuts.
    $(document).on('keydown', function(e) {
        if (e.ctrlKey && e.key.toLowerCase() === 'h') {
            e.preventDefault();
            window.location.href = '/';
            console.log('⌨️ Keyboard shortcut: Ctrl+H - Home');
        }

        // ESC closes menus/modals.
        if (e.key === 'Escape') {
            $('.profile-dropdown').slideUp(200);
            $('.modal').fadeOut(200);
            console.log('⌨️ Keyboard shortcut: ESC - Close');
        }

        // Ctrl+Shift+? shows shortcut help.
        if (e.ctrlKey && e.shiftKey && e.key === '?') {
            e.preventDefault();
            showKeyboardHelp();
        }
    });

    const showKeyboardHelp = () => {
        const helpText = `
            ⌨️ Keyboard Shortcuts:
            • Ctrl+H - Go to Home
            • Ctrl+? - Show this help
            • ESC - Close menus
        `;
        console.log(helpText);
        alert(helpText);
    };

    // Smooth-scroll only for in-page anchor links.
    $(document).on('click', 'a[href^="#"]', function(e) {
        const href = $(this).attr('href');
        if (href === '#') return;

        const $target = $(href);
        if ($target.length) {
            e.preventDefault();
            
            $('html, body').animate({
                scrollTop: $target.offset().top - 80
            }, 800, 'swing', function() {
                console.log('📍 Scrolled to: ' + href);
            });
        }
    });

    // Highlight Pokedex table row on hover.
    $(document).on('mouseenter', '#pokedexTable tbody tr', function() {
        $(this).css({
            'background-color': '#f0f0f0',
            'box-shadow': 'inset 0 0 10px rgba(0, 0, 0, 0.1)',
            'transition': 'all 0.2s ease'
        });
    }).on('mouseleave', '#pokedexTable tbody tr', function() {
        $(this).css({
            'background-color': 'transparent',
            'box-shadow': 'none'
        });
    });

    // Basic accessibility touch-ups.
    $('img:not([alt])').attr('alt', 'Image');

    // Let role=button elements respond to keyboard too.
    $(document).on('keydown', '[role="button"]', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            $(this).click();
        }
    });

    // Helper: show loading spinner inside any container.
    window.showLoadingSpinner = (selector) => {
        const $container = $(selector);
        if ($container.length) {
            $container.html(
                '<div style="text-align: center; padding: 20px;">' +
                '<div style="border: 4px solid #f3f3f3; border-top: 4px solid #667eea; ' +
                'border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; ' +
                'margin: 0 auto;"></div><p>Loading...</p></div>'
            );
        }
    };

    // Final debug summary in console.
    console.log('');
    console.log('╔════════════════════════════════════════╗');
    console.log('║  jQuery Features Initialized           ║');
    console.log('╠════════════════════════════════════════╣');
    console.log('║ ✅ Event handling                      ║');
    console.log('║ ✅ DOM manipulation                    ║');
    console.log('║ ✅ Form validation                     ║');
    console.log('║ ✅ Animations & effects                ║');
    console.log('║ ✅ Keyboard shortcuts                  ║');
    console.log('║ ✅ Accessibility enhancements          ║');
    console.log('╚════════════════════════════════════════╝');
    console.log('');
});
