(() => {
    const scene = document.querySelector('.bottle-scene');
    const cap = document.querySelector('.journey-cap');
    if (!scene || !cap) return;

    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const toggle = document.querySelector('.journey-motion');
    const replay = document.querySelector('.journey-replay');
    const bottle = scene.querySelector('img');
    const stops = [...document.querySelectorAll('[data-beer-stop]')];
    const root = document.documentElement;
    let paused = motion.matches;
    let frame = 0;
    let startTime = null;
    let elapsed = 0;
    let opening = true;
    let ready = false;
    let openingScroll = 0;
    let nodes = [];
    let start = { x: 0, y: 0 };
    let landing = { x: 0, y: 0 };
    let stopBounds = [];
    let pageHeight = 0;

    const clamp = (n, min = 0, max = 1) => Math.max(min, Math.min(max, n));
    const lerp = (a, b, t) => a + (b - a) * t;
    const smooth = t => t * t * (3 - 2 * t);
    const easeOut = t => 1 - (1 - t) ** 3;
    const docRect = el => {
        const rect = el.getBoundingClientRect();
        return { left: rect.left, right: rect.right, top: rect.top + scrollY, height: rect.height, width: rect.width };
    };

    function measure() {
        const rect = docRect(scene);
        const mouth = docRect(scene.querySelector('.bottle-scene__mouth'));
        const viewportWidth = root.clientWidth;
        const safeX = x => clamp(x, 24, viewportWidth - 24);
        const mobile = viewportWidth <= 680;
        const maxScroll = Math.max(1, root.scrollHeight - innerHeight);
        // Project the cutout's mouth after the tilt so the liquid stays connected
        // at every aspect ratio. Asset bounds: y=11..1524 in a 1536px image.
        const bottleHeight = rect.height * .76;
        const neckDelta = bottleHeight * (11 / 1536 - .76);
        const angle = -104 * Math.PI / 180;
        const neckX = rect.width * .8 - neckDelta * Math.sin(angle);
        const neckY = rect.height * .07 + bottleHeight * .76 + neckDelta * Math.cos(angle) - bottleHeight * .1;
        const poolY = rect.height * .86;
        const poolX = clamp(neckX + 95, 85, rect.width - 85);
        const spill = scene.querySelector('.beer-spill');
        spill.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
        spill.querySelector('.beer-spill__stream').setAttribute('d', `M ${neckX} ${neckY} C ${neckX - 30} ${neckY + 20}, ${neckX - 20} ${poolY - 30}, ${poolX} ${poolY}`);
        spill.querySelector('.beer-spill__highlight').setAttribute('d', `M ${neckX + 2} ${neckY} C ${neckX - 26} ${neckY + 20}, ${neckX - 15} ${poolY - 30}, ${poolX} ${poolY}`);
        const pool = spill.querySelector('.beer-spill__pool');
        pool.setAttribute('cx', String(poolX));
        pool.setAttribute('cy', String(poolY));
        pool.setAttribute('rx', String(Math.min(80, rect.width * .2)));
        pool.style.transformOrigin = `${poolX}px ${poolY}px`;
        spill.querySelectorAll('.beer-spill__drops circle').forEach((drop, i) => {
            drop.setAttribute('cx', String(poolX - 65 + i * 42));
            drop.setAttribute('cy', String(poolY - 8 - (i % 2) * 13));
        });
        start = { x: mouth.left, y: mouth.top };
        landing = { x: safeX(rect.right - 25), y: rect.top + rect.height * .80 };
        nodes = [{ x: landing.x, y: landing.y, scroll: 0 }];
        const add = (el, side = 'right', offset = 0) => {
            if (!el) return;
            const r = docRect(el);
            const x = mobile ? (side === 'right' ? viewportWidth - 23 : 23) : safeX(side === 'right' ? r.right + 24 : r.left - 24);
            const y = r.top + Math.min(r.height * .3, 140) + offset;
            const position = clamp(y - innerHeight * .62, 0, maxScroll);
            if (position > nodes.at(-1).scroll + 1) nodes.push({ x, y, scroll: position });
        };
        add(document.querySelector('.intro'), 'left');
        add(document.querySelector('.history'), 'right');
        add(document.querySelector('.style-grid'), 'right', 90);
        add(document.querySelector('.beer-journey .section-heading'), 'left');
        stops.forEach((stop, i) => add(stop, i % 2 ? 'left' : 'right', mobile ? 0 : i * 90));
        add(document.querySelector('.beer-family'), 'right');
        add(document.querySelector('.catalog-cta'), 'right');
        add(document.querySelector('.contact'), 'left');
        const dock = docRect(document.querySelector('.journey-dock__landing'));
        nodes = nodes.filter(n => n.scroll < maxScroll);
        nodes.push({ x: dock.left + dock.width / 2, y: dock.top + dock.height / 2, scroll: maxScroll });
        stopBounds = stops.map(docRect);
        pageHeight = root.scrollHeight;
    }

    function place(x, y, rotation, scale = 1) {
        cap.style.transform = `translate3d(${(x - 20).toFixed(2)}px, ${(y - scrollY - 20).toFixed(2)}px, 0) rotate(${rotation.toFixed(2)}deg) scale(${scale})`;
    }

    function followScroll() {
        const position = clamp(scrollY, 0, nodes.at(-1).scroll);
        let next = nodes.findIndex(n => n.scroll >= position);
        if (next < 1) next = 1;
        const a = nodes[next - 1], b = nodes[next];
        const t = clamp((position - a.scroll) / Math.max(1, b.scroll - a.scroll));
        const arc = Math.sin(Math.PI * t);
        // Keep the cap in the exterior gutter; horizontal crossings happen between sections.
        const capX = lerp(a.x, b.x, smooth(t));
        const capY = lerp(a.y, b.y, t) - arc * 18;
        place(capX, capY, 390 + position * .9);
        const focalY = capY;
        let nearest = -1, distance = Infinity;
        stopBounds.forEach((bounds, i) => {
            const d = Math.abs(bounds.top + bounds.height * .4 - focalY) + Math.abs(bounds.left + bounds.width / 2 - capX) * .4;
            if (d < distance) { distance = d; nearest = i; }
        });
        stops.forEach((stop, i) => stop.classList.toggle('is-current', i === nearest && distance < innerHeight * .6));
    }

    function drawOpening(time) {
        const flight = clamp((time - 650) / 1350);
        const tilt = smooth(clamp((time - 1350) / 1500));
        scene.style.setProperty('--tip', `${-104 * tilt}deg`);
        scene.style.setProperty('--tilt-progress', String(tilt));
        const flowIn = clamp((time - 2450) / 450);
        const flowOut = 1 - clamp((time - 3450) / 550);
        scene.style.setProperty('--pour', String(Math.min(flowIn, flowOut)));
        scene.style.setProperty('--pool', String(clamp((time - 2800) / 800)));
        place(lerp(start.x, landing.x, easeOut(flight)), lerp(start.y, landing.y, flight) - Math.sin(Math.PI * flight) * Math.min(200, innerHeight * .23), flight * 390, lerp(.85, 1, flight));
    }

    function render(timestamp) {
        frame = 0;
        if (paused || document.hidden) return;
        if (opening) {
            if (startTime === null) startTime = timestamp - elapsed;
            elapsed = timestamp - startTime;
            // Scrolling can immediately take control of the cap; never lock the page.
            if (elapsed >= 4100 || Math.abs(scrollY - openingScroll) > 180) {
                opening = false;
                drawOpening(4100);
                replay.hidden = false;
                followScroll();
            } else {
                drawOpening(elapsed);
                frame = requestAnimationFrame(render);
            }
        } else followScroll();
    }

    function schedule() {
        if (ready && !frame && !paused && !document.hidden) frame = requestAnimationFrame(render);
    }

    function syncMotion() {
        cancelAnimationFrame(frame);
        frame = 0;
        root.classList.toggle('journey-static', paused);
        root.classList.toggle('journey-enabled', !paused);
        cap.hidden = paused;
        toggle.disabled = motion.matches;
        replay.hidden = motion.matches || opening;
        toggle.setAttribute('aria-pressed', String(paused));
        toggle.innerHTML = motion.matches ? 'Movimento reduzido' : paused ? 'Ativar animação <span aria-hidden="true">▶</span>' : 'Pausar animação <span aria-hidden="true">Ⅱ</span>';
        startTime = null;
        schedule();
    }

    toggle.addEventListener('click', () => {
        paused = !paused;
        // OS reduced-motion preference always wins, including manual playback.
        if (motion.matches) paused = true;
        syncMotion();
    });
    replay.addEventListener('click', () => {
        if (motion.matches) return;
        opening = true;
        elapsed = 0;
        startTime = null;
        paused = false;
        openingScroll = scrollY;
        replay.hidden = true;
        measure();
        syncMotion();
    });
    motion.addEventListener('change', () => { paused = motion.matches; syncMotion(); });
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', () => { measure(); schedule(); }, { passive: true });
    addEventListener('pageshow', () => { measure(); schedule(); });
    document.addEventListener('visibilitychange', () => {
        startTime = null;
        if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
        else schedule();
    });
    const observer = new ResizeObserver(() => {
        if (root.scrollHeight !== pageHeight) { measure(); schedule(); }
    });
    observer.observe(document.body);

    async function init() {
        // Wait for the actual product asset and fonts before locating the bottle mouth.
        try { await bottle.decode(); } catch { /* The text and catalogue stay available. */ }
        if (document.fonts?.ready) await document.fonts.ready;
        measure();
        toggle.hidden = false;
        const sceneRect = scene.getBoundingClientRect();
        if (sceneRect.bottom < 0) {
            opening = false;
            replay.hidden = false;
            drawOpening(4100);
            ready = true;
            syncMotion();
        } else {
            // On phones the hero artwork follows the headline: wait until it is
            // on screen instead of playing the entire opening below the fold.
            const entrance = new IntersectionObserver(entries => {
                if (!entries.some(entry => entry.isIntersecting)) return;
                entrance.disconnect();
                ready = true;
                openingScroll = scrollY;
                syncMotion();
            }, { threshold: .35 });
            entrance.observe(scene);
            if (paused) syncMotion();
        }
    }
    init();
})();
