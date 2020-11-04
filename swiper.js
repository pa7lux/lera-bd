var mySwiper = new Swiper('.swiper-container', {
  // Optional parameters
  // direction: 'vertical',
  loop: true,

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  keyboard: {
    enabled: true,
    onlyInViewport: false,
  }

  // And if we need scrollbar
  // scrollbar: {
  //   el: '.swiper-scrollbar',
  // },
})

const prev = document.querySelector('.swiper-button-prev');
const next = document.querySelector('.swiper-button-next');

prev.onclick = () => {
  console.log('ddd')
  mySwiper.slidePrev(10, true);
}

next.onclick = () => {
  console.log('sdfsfd')
  mySwiper.slideNext(10, true);
}