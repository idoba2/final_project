$(document).ready(function() {
    'use strict';

    console.log('✅ jQuery Navbar Profile Script Loaded (v' + $.fn.jquery + ')');

    // Open/close the profile dropdown when clicking the avatar.
    $(document).on('click', '.profile-avatar', function(e) {
        e.stopPropagation();
        
        // Find the dropdown that belongs to this avatar.
        const $dropdown = $(this).siblings('.profile-dropdown');
        
        // Toggle visibility + active style.
        $dropdown.toggleClass('show', 300);
        $(this).toggleClass('avatar-active');
        
        console.log('🔓 Profile dropdown toggled');
    });

    // Build initials from username and show them in the avatar circle.
    const setAvatarInitials = () => {
        $('.profile-avatar').each(function() {
            const $username = $(this).closest('.nav-profile-container')
                                     .find('.dropdown-username');
            
            if ($username.length) {
                const username = $username.text().trim();
                const initials = getInitials(username);
                
                $(this).text(initials);
                
                console.log('👤 Avatar initialized with: ' + initials);
            }
        });
    };

    const getInitials = (username) => {
        if (!username) return 'U';
        
        const parts = username
            .split(/[\s_.-]+/)
            .map(p => p.trim())
            .filter(Boolean);

        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }

        return parts.length > 0 ? parts[0][0].toUpperCase() : 'U';
    };

    // Run once on page load.
    setAvatarInitials();

    // Close dropdown when clicking anywhere outside the profile area.
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.nav-profile-container').length) {
            $('.profile-dropdown').removeClass('show');
            $('.profile-avatar').removeClass('avatar-active');
        }
    });

    // Simple hover style for dropdown items.
    $(document).on('mouseenter', '.profile-dropdown li:not(.dropdown-greeting):not(:has(form))', function() {
        $(this).css({
            'background-color': 'rgba(255, 255, 255, 0.1)',
            'border-left': '3px solid #667eea',
            'padding-left': '17px',
            'transition': 'all 0.2s ease'
        });
    }).on('mouseleave', '.profile-dropdown li:not(.dropdown-greeting):not(:has(form))', function() {
        $(this).css({
            'background-color': 'transparent',
            'border-left': 'none',
            'padding-left': '20px'
        });
    });

    // Submit logout form from dropdown button click.
    $(document).on('click', '.dropdown-logout', function(e) {
        e.preventDefault();

        $('.profile-dropdown').removeClass('show');
        $('.profile-avatar').removeClass('avatar-active');

        const form = $(this).closest('form')[0];
        if (form) {
            form.submit();
        }
    });

    // Keyboard support for accessibility.
    $(document).on('keydown', '.profile-avatar', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            $(this).click();
        }
        
        if (e.key === 'Escape') {
            $('.profile-dropdown').removeClass('show');
            $('.profile-avatar').removeClass('avatar-active');
        }
    });

    // Check login state so navbar shows the right user info.
    const checkAuthStatus = () => {
        $.ajax({
            url: '/auth/status',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                if (data.isLoggedIn && data.username) {
                    console.log('✅ User logged in: ' + data.username);

                    $('.dropdown-username').text(data.username);

                    $('.profile-avatar').fadeIn(300);
                } else {
                    console.log('❌ User not logged in');
                    $('.profile-avatar').fadeOut(300);
                }
            },
            error: function() {
                console.error('⚠️ Failed to check auth status');
            }
        });
    };

    // Run auth check on load.
    checkAuthStatus();

    // Show quick loading state on logout button.
    $(document).on('submit', 'form[action="/logout"]', function() {
        const $form = $(this);

        const $submitBtn = $form.find('button[type="submit"]');
        if ($submitBtn.length) {
            $submitBtn.prop('disabled', true)
                      .css('opacity', '0.6')
                      .text('Logging out...');
        }
        
        console.log('🔐 Logging out...');
    });

    // Highlight current page link in navbar.
    const highlightCurrentPage = () => {
        const currentPath = window.location.pathname;

        $('.main-menu-item a').each(function() {
            const $link = $(this);
            if ($link.attr('href') === currentPath) {
                $link.addClass('current-page-link')
                     .closest('.main-menu-item')
                     .addClass('active-menu-item');
            }
        });
    };

    highlightCurrentPage();

    // Small debug info in console.
    console.log('📦 jQuery Configuration:');
    console.log('   Version: ' + jQuery.fn.jquery);
    console.log('   Namespace: jQuery');
    console.log('   Profile dropdown initialized: ' + $('.profile-avatar').length + ' avatars');
});
