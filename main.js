var themeToggle = document.getElementById("theme-toggle");
var emailCopy = document.getElementById("email-copy");
var emailLink = document.getElementById("email-link");

var storedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

if (storedTheme) {
    if (storedTheme == "dark") {
        document.documentElement.setAttribute('data-theme', "6");
    } else if (storedTheme == "light") {
        document.documentElement.setAttribute('data-theme', "2");
    } else {
        document.documentElement.setAttribute('data-theme', storedTheme);
    }
}

themeToggle.onclick = function () {
    var currentTheme = document.documentElement.getAttribute("data-theme");
    var targetTheme = "6";

    if (currentTheme === "1") { targetTheme = "2"; }
    else if (currentTheme === "2") { targetTheme = "3"; }
    else if (currentTheme === "3") { targetTheme = "4"; }
    else if (currentTheme === "4") { targetTheme = "5"; }
    else if (currentTheme === "5") { targetTheme = "6"; }
    else if (currentTheme === "6") { targetTheme = "7"; }
    else { targetTheme = "1"; };

    document.documentElement.setAttribute('data-theme', targetTheme);
    localStorage.setItem('theme', targetTheme);
}

emailCopy.onmouseenter = function () {
    document.querySelector(":root").style.setProperty("--copy-text", ` [+]`);
}
emailCopy.onfocus = function () {
    document.querySelector(":root").style.setProperty("--copy-text", ` [+]`);
}
emailCopy.onclick = function () {
    navigator.clipboard.writeText('scoobywoojew@proton.me');
    document.querySelector(":root").style.setProperty("--copy-text", ` [COPIED]`);
}

emailLink.onclick = function () {
    window.location.href = "mailto:scoobywoojew@proton.me";
}

// Palindrome effect for title
let title = "Racecar.cc";
let palindrome = title + " | " + title.split('').reverse().join('');
let i = 0;
let direction = 1; // 1 for typing, -1 for deleting

setInterval(function() {
    if (direction === 1) {
        document.title = palindrome.substring(0, i) + "|";
        i++;
        if (i === palindrome.length + 1) {
            direction = -1;
        }
    } else {
        document.title = palindrome.substring(0, i) + "|";
        i--;
        if (i === 0) {
            direction = 1;
        }
    }
}, 150); // Adjust speed by changing this value
