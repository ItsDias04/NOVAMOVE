new Swiper(".reviews__slider", {
  slidesPerView: 3,
  spaceBetween: 32,
  navigation: {
    nextEl: ".reviews__next",
    prevEl: ".reviews__prev",
  },
  loop: true,
  speed: 600,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: { slidesPerView: 1, spaceBetween: 16 },
    768: { slidesPerView: 2, spaceBetween: 24 },
    1200: { slidesPerView: 3, spaceBetween: 32 },
  },
});
