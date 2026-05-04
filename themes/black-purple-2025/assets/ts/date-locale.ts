document.querySelectorAll<HTMLTimeElement>('time').forEach((timeTag) => {
  const dt = timeTag.getAttribute('datetime');
  if (!dt) return;
  const date = new Date(dt);
  if (Number.isNaN(date.getTime())) return;

  timeTag.textContent = date.toLocaleDateString(navigator.language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const fullTimestamp = date.toLocaleString();
  const existingTitle = timeTag.getAttribute('title') ?? '';
  timeTag.setAttribute(
    'title',
    existingTitle ? `${existingTitle}: ${fullTimestamp}` : fullTimestamp,
  );
});
