new Glider(document.querySelector('.glider'), {
    slidesToShow: 4,
    slidesToScroll: 2,
    draggable: true,
    dots: '.dots',
    arrows: {
      prev: '.glider-prev',
      next: '.glider-next'
    }
  });