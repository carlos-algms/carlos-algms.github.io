function initSpinner(element: HTMLElement): void {
  const animationDuration = 20;
  const spins = 60;
  let animating = false;
  let currentIndex = 0;

  const stage = element.querySelector<HTMLElement>('.stage');

  if (!stage) {
    throw new Error('Stage element not found');
  }

  const audio = new Audio('piao.mp3');
  audio.volume = 0.2;

  stage.style.setProperty('--rotation-index', String(currentIndex));

  const playButton = element.querySelector<HTMLElement>('.play');

  if (!playButton) {
    return;
  }

  playButton.addEventListener('click', () => {
    if (animating) {
      return;
    }

    animating = true;

    // Pick a random number between 1 and 6
    const targetNumber = Math.floor(Math.random() * 6) + 1;
    const finalIndex = spins * 6 + (targetNumber - 1);

    element.classList.remove('animating');
    stage.style.setProperty('--rotation-index', String(currentIndex));

    // Force reflow to avoid queuing
    void stage.offsetHeight;

    stage.style.setProperty('--animation-duration', `${animationDuration}s`);
    stage.style.setProperty('--rotation-index', String(finalIndex));
    element.classList.add('animating');

    currentIndex = targetNumber - 1;

    audio.currentTime = 0;
    audio.play().catch((err) => {
      console.error('Audio playback failed:', err);
    });

    stage.addEventListener(
      'transitionend',
      () => {
        audio.pause();
        element.classList.remove('animating');
        animating = false;
      },
      { once: true },
    );
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll<HTMLElement>('.piao-da-casa-propria');
  elements.forEach((element) => initSpinner(element));
});
