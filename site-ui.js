(() => {
    const toggle = document.querySelector('#menu-toggle');
    const menu = document.querySelector('.side-menu');
    if (!toggle || !menu) return;

    menu.addEventListener('click', event => {
        if (event.target.closest('a')) toggle.checked = false;
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && toggle.checked) {
            toggle.checked = false;
            toggle.focus();
        }
    });
})();
