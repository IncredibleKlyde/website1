document.addEventListener("DOMContentLoaded", () => {

    /* ---------- 1. Mobile menu ---------- */
    const menuBtn = document.querySelector(".menu-btn");
    const nav = document.querySelector(".navbar nav");
    const navLinks = [...nav.querySelectorAll("a")];

    menuBtn.addEventListener("click", () => nav.classList.toggle("open"));
    navLinks.forEach(link =>
        link.addEventListener("click", () => {
            nav.classList.remove("open");

            // replay the fade on the section we're jumping to
            const target = document.querySelector(link.getAttribute("href"));
            if (target) {
                target.classList.remove("visible");
                setTimeout(() => target.classList.add("visible"), 450);
            }
        })
    );


    /* ---------- 2. Highlight current section in nav ---------- */
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link =>
                    link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id)
                );
            }
        });
    }, { rootMargin: "-40% 0px -55% 0px" });

    navLinks.forEach(link => {
        const section = document.querySelector(link.getAttribute("href"));
        if (section) sectionObserver.observe(section);
    });


    /* ---------- 3. Fade in/out on scroll (every time) ---------- */
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            // fade in when on screen, fade out when off screen
            entry.target.classList.toggle("visible", entry.isIntersecting);
        });
    }, { threshold: 0.15 });

    document.querySelectorAll(".hero, .section, .two-column, footer").forEach(el => {
        el.classList.add("reveal");
        revealObserver.observe(el);
    });


    /* ---------- 4. Picture viewer (lightbox) ---------- */
    const pictures = [...document.querySelectorAll(
        ".hero-image img, .card img, .song-card img, .post img, .video-grid img, .album img"
    )];

    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Close">&times;</button>
        <button class="lightbox-prev" aria-label="Previous">&#8249;</button>
        <img src="" alt="">
        <div class="lightbox-caption"></div>
        <button class="lightbox-next" aria-label="Next">&#8250;</button>
    `;
    document.body.appendChild(lightbox);

    const bigImg = lightbox.querySelector("img");
    const caption = lightbox.querySelector(".lightbox-caption");
    let current = 0;

    function getCaption(img) {
        const text = img.parentElement.querySelector("p, h3");
        return text ? text.textContent : img.alt;
    }

    function show(index) {
        current = (index + pictures.length) % pictures.length;
        bigImg.src = pictures[current].src;
        caption.textContent = getCaption(pictures[current]);
    }

    function open(index) {
        show(index);
        lightbox.classList.add("open");
    }

    function close() {
        lightbox.classList.remove("open");
    }

    pictures.forEach((img, i) => img.addEventListener("click", () => open(i)));

    lightbox.querySelector(".lightbox-close").addEventListener("click", close);
    lightbox.querySelector(".lightbox-prev").addEventListener("click", () => show(current - 1));
    lightbox.querySelector(".lightbox-next").addEventListener("click", () => show(current + 1));

    // click the dark background to close
    lightbox.addEventListener("click", e => {
        if (e.target === lightbox) close();
    });

    // keyboard controls
    document.addEventListener("keydown", e => {
        if (!lightbox.classList.contains("open")) return;
        if (e.key === "Escape") close();
        if (e.key === "ArrowLeft") show(current - 1);
        if (e.key === "ArrowRight") show(current + 1);
    });

});