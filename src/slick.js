$(document).ready(function () {
  $('.partners-carousel').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
    dots: false,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          arrows: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          arrows: false,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
          arrows: false,
        },
      },
    ],
  });
});

$(document).ready(function () {
  $('.carousel-GT').slick({
    dots: true,
    autoplay: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    cssEase: 'linear',
    fade: true,
    dotsClass: 'slide-dots-GT',
    prevArrow: '<div class="prev slick_arrow_GT"></div>',
    nextArrow: '<div class="next slick_arrow_GT"></div>',
  });
});
