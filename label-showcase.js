(() => {
    const showcase = document.querySelector('.label-showcase');
    if (!showcase) return;
    const slides = [...showcase.querySelectorAll('.label-slide')];
    const choices = [...showcase.querySelectorAll('.label-choice')];
    const pause = showcase.querySelector('.label-pause');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let active = 0, paused = motion.matches, timer;
    const show = (index) => {
        active = index;
        showcase.dataset.active = index;
        slides.forEach((slide, i) => {
            slide.hidden = i !== index;
            slide.classList.toggle('is-active', i === index);
            slide.setAttribute('aria-hidden', String(i !== index));
            choices[i].classList.toggle('is-active', i === index);
            choices[i].setAttribute('aria-pressed', String(i === index));
        });
        showcase.querySelector('h2').textContent = ['Red Ale', 'Preta', 'Pêssego'][index];
    };
    const schedule = () => {
        clearInterval(timer);
        if (!paused && !document.hidden && !showcase.matches(':hover') && !showcase.contains(document.activeElement)) {
            timer = setInterval(() => show((active + 1) % slides.length), 5500);
        }
    };
    const updatePause = () => {
        pause.textContent = paused ? '▶' : 'Ⅱ';
        pause.setAttribute('aria-label', paused ? 'Iniciar troca automática' : 'Pausar troca automática');
        pause.setAttribute('aria-pressed', String(paused));
        schedule();
    };
    choices.forEach((choice, i) => choice.addEventListener('click', () => { show(i); schedule(); }));
    pause.addEventListener('click', () => { paused = !paused; updatePause(); });
    showcase.addEventListener('mouseenter', () => clearInterval(timer));
    showcase.addEventListener('mouseleave', schedule);
    showcase.addEventListener('focusin', () => clearInterval(timer));
    showcase.addEventListener('focusout', () => setTimeout(schedule, 0));
    showcase.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault();
        show((active + (event.key === 'ArrowRight' ? 1 : slides.length - 1)) % slides.length);
        choices[active].focus();
    });
    document.addEventListener('visibilitychange', schedule);
    motion.addEventListener('change', () => { paused = motion.matches; updatePause(); });
    updatePause();
})();
