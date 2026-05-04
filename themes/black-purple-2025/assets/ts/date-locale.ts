document.querySelectorAll<HTMLTimeElement>('time').forEach((timeTag) => {
  const dt = timeTag.getAttribute('datetime');
  if (!dt) return;
  const date = new Date(dt);
  timeTag.textContent = date.toLocaleDateString(navigator.language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const existingTitle = timeTag.getAttribute('title') ?? '';
  timeTag.setAttribute('title', `${existingTitle}: ${date.toLocaleString()}`);
});
