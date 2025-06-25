document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const checkboxLabel = document.getElementById("slider-id");

    // Function to apply the theme based on preference
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark');
            themeToggle.checked = true; // Check the toggle
        } else {
            document.body.classList.remove('dark');
            themeToggle.checked = false; // Uncheck the toggle

        }
    }

    // Load the theme preference from localStorage
    function loadThemePreference() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            applyTheme(savedTheme);
        } else {
            // Check for system preference and apply it
            const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
            applyTheme(prefersDarkScheme.matches ? 'dark' : 'light');
        }
    }

    // Listen for changes in system preference
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    prefersDarkScheme.addEventListener('change', (e) => {
        applyTheme(e.matches ? 'dark' : 'light');
    });

    // Toggle theme manually
    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            const currentTheme = themeToggle.checked ? 'dark' : 'light';
            applyTheme(currentTheme);
            
            // Store the theme preference in localStorage
            localStorage.setItem('theme', currentTheme);
        });
    }

    // Call this function on page load
    loadThemePreference();
});
