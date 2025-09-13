/**
 * @param {HTMLElement} element
 */
function createCuber(element) {
  /** @type {HTMLElement | null} */
  const stage = element.querySelector('.cuber-stage');

  if (!stage) {
    throw new Error('Cuber stage element not found');
  }

  /** @type {NodeListOf<HTMLElement>} */
  const items = stage.querySelectorAll('.cuber-item');

  let playing = false;
  const qtyItems = items.length;
  let actualIndex = 0;
  const actual = items[0];

  if (!actual) {
    throw new Error('No cuber items found');
  }

  const audio = new Audio('/experiments/piao-da-casa-propria/piao.mp3');

  const degrees = 360 / qtyItems;
  const tz = Math.round(actual.offsetWidth / 2 / Math.tan(Math.PI / qtyItems));

  function init() {
    items.forEach((item, i) => {
      item.style.zIndex = String(qtyItems - i);
      item.style.transform = `rotateY(${degrees * i}deg) translateZ(${tz}px)`;
    });

    rotate();
    setupPlayButton();
  }

  function rotate() {
    if (stage) {
      stage.style.transform = `translateZ(-${tz}px) rotateY(-${actualIndex * degrees}deg)`;
    }
  }

  function setupPlayButton() {
    const playButton = document.getElementById('play');

    if (!playButton || !stage) {
      return;
    }

    playButton.addEventListener('click', () => {
      if (!playing) {
        playing = true;
        playButton.style.display = 'none';

        actualIndex = Math.floor(
          Math.random() * 6 + (actualIndex > 6 ? 0 : 300),
        );
        stage.classList.add('timing');
        rotate();

        audio.play().catch((err) => {
          console.error('Audio playback failed:', err);
        });

        setTimeout(() => {
          audio.pause();
          playButton.style.display = '';
          playing = false;
        }, 25000);
      }
    });
  }

  init();
}

document.addEventListener('DOMContentLoaded', () => {
  /**
   * @type {NodeListOf<HTMLElement>}
   */
  const cuberElements = document.querySelectorAll('.cuber');
  cuberElements.forEach((element) => createCuber(element));
});
