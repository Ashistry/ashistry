(() => {
  // <stdin>
  document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
    const themeColorMeta = document.getElementsByName("theme-color");
    const checkboxLabel = document.getElementById("checkbox-label");
    function applyTheme(theme) {
      if (theme === "dark") {
        document.body.classList.add("dark");
        themeToggle.checked = true;
      } else {
        document.body.classList.remove("dark");
        themeToggle.checked = false;
      }
    }
    function loadThemePreference() {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        applyTheme(savedTheme);
      } else {
        const prefersDarkScheme2 = window.matchMedia("(prefers-color-scheme: dark)");
        applyTheme(prefersDarkScheme2.matches ? "dark" : "light");
      }
    }
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    prefersDarkScheme.addEventListener("change", (e) => {
      applyTheme(e.matches ? "dark" : "light");
    });
    themeToggle.addEventListener("change", () => {
      const currentTheme = themeToggle.checked ? "dark" : "light";
      checkboxLabel.innerHTML = themeToggle.checked ? "dark" : "light";
      applyTheme(currentTheme);
      localStorage.setItem("theme", currentTheme);
    });
    loadThemePreference();
  });
})();
