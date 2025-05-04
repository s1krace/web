// Handles theme toggling and persistence
export function setupTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  const storedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  if (storedTheme) {
    if (storedTheme === "dark") {
      document.documentElement.setAttribute('data-theme', "6");
    } else if (storedTheme === "light") {
      document.documentElement.setAttribute('data-theme', "2");
    } else {
      document.documentElement.setAttribute('data-theme', storedTheme);
    }
  }

  if (themeToggle) {
    themeToggle.onclick = function () {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      let targetTheme = "6";
      if (currentTheme === "1") targetTheme = "2";
      else if (currentTheme === "2") targetTheme = "3";
      else if (currentTheme === "3") targetTheme = "4";
      else if (currentTheme === "4") targetTheme = "5";
      else if (currentTheme === "5") targetTheme = "6";
      else if (currentTheme === "6") targetTheme = "7";
      else targetTheme = "1";
      document.documentElement.setAttribute('data-theme', targetTheme);
      localStorage.setItem('theme', targetTheme);
    };
  }
} 