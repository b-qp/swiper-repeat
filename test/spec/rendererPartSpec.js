'use strict';

describe('Render part', function () {

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
    swiper = angular.extend(SwiperMock(), RendererPart(slideFactoryMock));
  });

  describe('slide create/destroy', function() {
    
    it('should createSlide()', function() {
      swiper.slides.left = { item: 'leftItem' };
      swiper.slides.center = { item: 'centerItem' };
      swiper.slides.right = null;

      swiper.render();

      expect(slideFactoryMock).toHaveBeenCalledWith('leftItem');
      expect(slideFactoryMock).toHaveBeenCalledWith('centerItem');
      expect(slideFactoryMock.calls.length).toBe(2);

      expect(getMockSlide('leftItem').element.css).toHaveBeenCalledWith('transform', 'translate(-100%, 0)');
      expect(getMockSlide('centerItem').element.css).toHaveBeenCalledWith('transform', 'translate(0%, 0)');
    });

    it('should reuse existing slides', function() {
      swiper.slides.left = { item: 'leftItem' };
      swiper.slides.center = { item: 'centerItem' };
      swiper.slides.right = null;

      swiper.render();
      slideFactoryMock.reset();

      swiper.slides.left = null;
      swiper.slides.center = { item: 'leftItem' };
      swiper.slides.right = { item: 'centerItem' };

      swiper.render();

      expect(slideFactoryMock).not.toHaveBeenCalled();
      expect(getMockSlide('leftItem').destroy).not.toHaveBeenCalled();
      expect(getMockSlide('centerItem').destroy).not.toHaveBeenCalled();

      expect(getMockSlide('leftItem').element.css).toHaveBeenCalledWith('transform', 'translate(0%, 0)');
      expect(getMockSlide('centerItem').element.css).toHaveBeenCalledWith('transform', 'translate(100%, 0)');
    });

    it('should destroy slides', function() {
      swiper.slides.left = { item: 'leftItem' };
      swiper.slides.center = { item: 'centerItem' };
      swiper.slides.right = null;

      swiper.render();

      swiper.slides.left = null;
      swiper.slides.center = null;
      swiper.slides.right = null;

      swiper.render();

      expect(getMockSlide('leftItem').destroy).toHaveBeenCalled();
      expect(getMockSlide('centerItem').destroy).toHaveBeenCalled();
    });

  });

  it('should translateSlides()', function() {
    swiper.getContainerWidth = function() { return 500 };
    swiper.translateSlides(0.5, 250);

    expect(swiper.translateContainer).toHaveBeenCalledWith('-50%', '250ms');
  });

  it('should return relative slides position', function() {
    swiper.getContainerWidth = function() { return 500 };
    swiper.getContainerPosition = function() { return -250 };
    var position = swiper.getSlidesPosition();

    expect(position).toBe(0.5);
  });

  it('should return relative slide position', function() {
    swiper.slides.left = { item: 'leftItem' };
    swiper.slides.center = { item: 'centerItem' };
    swiper.slides.right = { item: 'rightItem' };

    expect(swiper.getSlidePosition('leftItem')).toBe(-1);
    expect(swiper.getSlidePosition('centerItem')).toBe(0);
    expect(swiper.getSlidePosition('rightItem')).toBe(1);
    expect(swiper.getSlidePosition('noneExistingItem')).toBe(null);
  });

});
