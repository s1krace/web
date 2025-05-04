// Handles email copy and mailto
const EMAIL = 'scoobywoojew@proton.me';

export function setupEmail() {
  const emailCopy = document.getElementById("email-copy");
  const emailLink = document.getElementById("email-link");

  if (emailCopy) {
    emailCopy.onmouseenter = () => {
      document.querySelector(":root").style.setProperty("--copy-text", " [+]");
    };
    emailCopy.onfocus = () => {
      document.querySelector(":root").style.setProperty("--copy-text", " [+]");
    };
    emailCopy.onclick = () => {
      navigator.clipboard.writeText(EMAIL);
      document.querySelector(":root").style.setProperty("--copy-text", " [COPIED]");
    };
  }

  if (emailLink) {
    emailLink.onclick = () => {
      window.location.href = `mailto:${EMAIL}`;
    };
  }
} 