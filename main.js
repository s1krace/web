import { setupLinks } from './links.js';
import { setupEmail } from './email.js';
import { setupTheme } from './theme.js';

window.addEventListener('DOMContentLoaded', () => {
  setupLinks();
  setupEmail();
  setupTheme();

  // Palindrome effect for title
  let title = "Racecar.cc";
  let palindrome = title + " | " + title.split('').reverse().join('');
  let i = 0;
  let direction = 1;
  setInterval(function() {
    if (direction === 1) {
      document.title = palindrome.substring(0, i) + "|";
      i++;
      if (i === palindrome.length + 1) direction = -1;
    } else {
      document.title = palindrome.substring(0, i) + "|";
      i--;
      if (i === 0) direction = 1;
    }
  }, 150);
}); 