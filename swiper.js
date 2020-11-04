var mySwiper = new Swiper('.swiper-container', {
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  keyboard : true,
  initialSlide: 1,
  loop: true,
  grabCursor: true,
  threshold : 0

})

const prev = document.querySelector('.swiper-button-prev');
const next = document.querySelector('.swiper-button-next');

prev.onclick = () => {
  console.log('ddd');
  mySwiper.slidePrev();
}

next.onclick = () => {
  console.log('sdfsfd')
  mySwiper.slideNext();
}