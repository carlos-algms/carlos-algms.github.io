/**
 * @param {HTMLElement} element
 */
function createCuber(element) {
  /** @type {HTMLElement | null} */
  const stage = element.querySelector('.stage');

  if (!stage) {
    throw new Error('Cuber stage element not found');
  }

  let playing = false;
  let actualIndex = 0;

  const audio = new Audio('/experiments/piao-da-casa-propria/piao.mp3');

  function init() {
    rotate();
    setupPlayButton();
  }

  function rotate() {
    if (stage) {
      stage.style.setProperty('--rotation-index', String(actualIndex));
    }
  }

  function setupPlayButton() {
    if (!stage) {
      return;
    }

    /** @type {HTMLElement | null} */
    const playButton = element.querySelector('.play');

    if (!playButton) {
      return;
    }

    playButton.addEventListener('click', () => {
      if (!playing) {
        playing = true;
        playButton.style.display = 'none';

        // Pick a random number between 1 and 6
        const targetNumber = Math.floor(Math.random() * 6) + 1;
        const animationDuration = 20;

        const currentRotation = actualIndex || 0;
        const spins = 60;
        const finalIndex = spins * 6 + (targetNumber - 1);

        // Reset animation by setting duration to 0
        stage.style.setProperty('--animation-duration', '0s');
        stage.style.setProperty('--rotation-index', String(currentRotation));

        // Force reflow
        void stage.offsetHeight;

        // Set animation duration and final rotation
        stage.style.setProperty(
          '--animation-duration',
          `${animationDuration}s`,
        );
        stage.style.setProperty('--rotation-index', String(finalIndex));

        actualIndex = targetNumber - 1;

        // audio.play().catch((err) => {
        //   console.error('Audio playback failed:', err);
        // });

        setTimeout(() => {
          audio.pause();
          playButton.style.display = '';
          playing = false;
          stage.style.setProperty('--animation-duration', '0s');
        }, animationDuration * 1000);
      }
    });
  }

  init();
}

document.addEventListener('DOMContentLoaded', () => {
  /**
   * @type {NodeListOf<HTMLElement>}
   */
  const cuberElements = document.querySelectorAll('.piao-da-casa-propria');
  cuberElements.forEach((element) => createCuber(element));
});
