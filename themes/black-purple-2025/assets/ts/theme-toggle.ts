const themeSelector = document.querySelector<HTMLInputElement>(
  'input[name="theme-selector"]',
);

if (themeSelector) {
  const isDark = document.documentElement.classList.contains('dark');
  themeSelector.checked = !isDark;

  themeSelector.addEventListener('change', () => {
    const newTheme = themeSelector.checked ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  });
}
