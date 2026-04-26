document.addEventListener('DOMContentLoaded', () => {
  const dropdown = document.querySelector('.has-dropdown');
  if (!dropdown) return;

  const trigger = dropdown.querySelector(':scope > a');
  const hasHover = window.matchMedia('(hover: hover)');

  trigger.addEventListener('click', (e) => {
    if (hasHover.matches) return;
    e.preventDefault();
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });

  document.addEventListener('click', () => {
    if (hasHover.matches) return;
    dropdown.classList.remove('open');
  });
});
