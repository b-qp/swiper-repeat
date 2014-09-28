'use strict';

describe('Render full', function () {

  var swiper, mockSlides = {};

  var slideFactoryMock = jasmine.createSpy().andCallFake(function(item) {
    var slide = {
      element: { css: jasmine.createSpy() },
      item: item,
      destroy: jasmine.createSpy()
    };
    mockSlides[item] = slide;
    return slide;    
  });

  function getMockSlide(item) {
    return mockSlides[item];
  }

  beforeEach(function() {
    swiper = angular.extend(SwiperMock(), RendererFull(slideFactoryMock));
  });

  describe('slide create/destroy', function() {
    
    it('should createSlide()', function() {
      swiper.collection = [1,2,3,4];

      swiper.render(true);

      expect(slideFactoryMock).toHaveBeenCalledWith(1);
      expect(slideFactoryMock).toHaveBeenCalledWith(2);
      expect(slideFactoryMock).toHaveBeenCalledWith(3);
      expect(slideFactoryMock).toHaveBeenCalledWith(4);
      expect(slideFactoryMock.calls.length).toBe(4);

      expect(getMockSlide(1).element.css).toHaveBeenCalledWith('transform', 'translate(0%, 0)');
      expect(getMockSlide(2).element.css).toHaveBeenCalledWith('transform', 'translate(100%, 0)');
      expect(getMockSlide(3).element.css).toHaveBeenCalledWith('transform', 'translate(200%, 0)');
      expect(getMockSlide(4).element.css).toHaveBeenCalledWith('transform', 'translate(300%, 0)');
    });

    it('should reuse existing slides', function() {
      swiper.collection = [1,2,3,4];
      swiper.render(true);
      slideFactoryMock.reset();

      swiper.collection = [1,2,3,4,5];
      swiper.render(true);

      expect(slideFactoryMock).toHaveBeenCalledWith(5);
      expect(slideFactoryMock.calls.length).toBe(1);
    });

    it('should destroy slides', function() {
      swiper.collection = [1,2,3,4];
      swiper.render(true);

      swiper.collection = [1,2,3];
      swiper.render(true);

      expect(getMockSlide(4).destroy).toHaveBeenCalled();
    });

  });

  it('should translateSlides()', function() {
    swiper.collection = [1,2,3,4,5];
    swiper.slides.center = { item: 3 };
    swiper.index = 2;
    swiper.render(true);
    
    swiper.getContainerWidth = function() { return 500 };
    swiper.translateSlides(1, 250);

    expect(swiper.translateContainer).toHaveBeenCalledWith('-300%', '250ms');
  });

  it('should return relative slides position', function() {
    swiper.collection = [1,2,3,4,5];
    swiper.slides.center = { item: 3 };
    swiper.index = 2;
    swiper.render(true);
    
    swiper.getContainerWidth = function() { return 500 };
    swiper.getContainerPosition = function() { return -1500 };
    var position = swiper.getSlidesPosition();

    expect(position).toBe(1);
  });

  it('should return relative slide position', function() {
    swiper.collection = [1,2,3,4,5]
    swiper.slides.left = { item: 2 };
    swiper.slides.center = { item: 3 };
    swiper.slides.right = { item: 4 };
    swiper.index = 2;
    swiper.render(true);

    expect(swiper.getSlidePosition(1)).toBe(-2);
    expect(swiper.getSlidePosition(3)).toBe(0);
    expect(swiper.getSlidePosition(5)).toBe(2);
    expect(swiper.getSlidePosition('noneExistingItem')).toBe(null);
  });

});
