const themeSelector = document.querySelector<HTMLInputElement>(
  'input[name="theme-selector"]',
);

if (themeSelector) {
  const switchTrack = themeSelector.parentElement?.querySelector<HTMLElement>(
    '[role="switch"]',
  );

  const syncAria = (isLight: boolean) => {
    switchTrack?.setAttribute('aria-checked', String(isLight));
  };

  const isDark = document.documentElement.classList.contains('dark');
  themeSelector.checked = !isDark;
  syncAria(themeSelector.checked);

  themeSelector.addEventListener('change', () => {
    const newTheme = themeSelector.checked ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    syncAria(themeSelector.checked);
  });
}
