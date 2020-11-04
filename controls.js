//state
let current = 'main';

// containers
const main = document.querySelector('.world');
const video = document.querySelector('.video-block');
const joke = document.querySelector('.joke-block');

// buttons
const meditateBtn = document.querySelector('.meditate');
const videoBtn = document.querySelector('.video-btn');
const jokeBtn = document.querySelector('.joke');

meditateBtn.onclick = () => {
  current = 'main';
  changeBlock(current);
}

videoBtn.onclick = () => {
  current = 'video';
  changeBlock(current);
}

jokeBtn.onclick = () => {
  current = 'joke';
  changeBlock(current);
}

function changeBlock(state) {
  if(state === 'main') {
    main.classList.add('visible');
    video.classList.remove('visible');
    joke.classList.remove('visible');
  }
  if(state === 'video') {
    main.classList.remove('visible');
    video.classList.add('visible');
    joke.classList.remove('visible');
  }

  if(state === 'joke') {
    main.classList.remove('visible');
    video.classList.remove('visible');
    joke.classList.add('visible');
  }
}

