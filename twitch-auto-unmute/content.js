(function () {
    let lastVolume = 1;
    let userMuted = false;
    let ready = false; // user must interact first

    // Wait for user interaction
    function enableAutoUnmute() {
        ready = true;
        console.log("[Twitch Auto Unmute] User interacted, auto-unmute active");

        // remove listeners (we only need first interaction)
        document.removeEventListener("click", enableAutoUnmute);
        document.removeEventListener("keydown", enableAutoUnmute);
        document.removeEventListener("scroll", enableAutoUnmute);
    }

    document.addEventListener("click", enableAutoUnmute);
    document.addEventListener("keydown", enableAutoUnmute);
    document.addEventListener("scroll", enableAutoUnmute);

    function hookVideo(video) {
        if (video._autoUnmuteHooked) return;
        video._autoUnmuteHooked = true;

        video.addEventListener("volumechange", () => {
            if (video.muted && video.volume === 0) {
                userMuted = true;
            }
            if (!video.muted && video.volume > 0) {
                userMuted = false;
                lastVolume = video.volume;
            }
        });
    }

    function check() {
        if (!ready) return; // wait for user

        const video = document.querySelector("video");
        if (!video) return;

        hookVideo(video);

        if (video.muted && !userMuted) {
            video.muted = false;
            video.volume = lastVolume || 1;

            // force Twitch UI update
            const event = new Event("volumechange", { bubbles: true });
            video.dispatchEvent(event);

            console.log("[Twitch Auto Unmute] unmuted & UI synced");
        }
    }

    setInterval(check, 300);
})();
