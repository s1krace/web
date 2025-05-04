const SOCIAL_CONFIG = {
    platforms: {
        telegram: "https://t.me/racelol",
        discord: "https://discordapp.com/users/960795940929818654",
        twitter: "https://x.com/s1krace",
        special: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    init: function() {
        document.querySelectorAll('[data-social]').forEach(link => {
            const platform = link.dataset.social;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                window.open(this.platforms[platform], '_blank');
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => SOCIAL_CONFIG.init());
