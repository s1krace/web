// Handles external/social links
const links = [
  { id: "link-1", url: "https://t.me/racelol" },
  { id: "link-2", url: "https://discordapp.com/users/960795940929818654" },
  { id: "link-3", url: "https://x.com/xx_racecar_xx" },
  { id: "link-4", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
];

export function setupLinks() {
  links.forEach(link => {
    const el = document.getElementById(link.id);
    if (el) {
      el.onclick = () => window.open(link.url, "_blank");
    }
  });
} 
