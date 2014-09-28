'use strict';

describe('Render', function () {

  var swiper, retranslatorFn;

  beforeEach(function() {
    retranslatorFn = jasmine.createSpy();
    swiper = angular.extend(SwiperMock(), Renderer(retranslatorFn));
  });

  it('should select', function() {
    swiper.select(1);

    expect(swiper.resolve).toHaveBeenCalledWith(1);
    expect(swiper.render).toHaveBeenCalled();
  });

  it('should refresh', function() {
    swiper.refresh();

    expect(swiper.resolve).toHaveBeenCalledWith();
    expect(swiper.render).toHaveBeenCalled();
  });

  it('should call render() with argument returned by resolve()', function() {
    swiper.resolve.andReturn(false);
    swiper.refresh();

    expect(swiper.render).toHaveBeenCalledWith(false);

    swiper.resolve.andReturn(true);
    swiper.refresh();

    expect(swiper.render).toHaveBeenCalledWith(true);
  });

  it('should call translateSlides()', function() {
    swiper.move(0.5);
    expect(swiper.translateSlides).toHaveBeenCalledWith(0.5, 0);
  });
  
  it('should call translateSlides()', function() {
    swiper.transition(1, angular.noop);
    expect(swiper.translateSlides).toHaveBeenCalledWith(1, 250);
  });

  it('should retranslate move/transition', function() {
    swiper.index = 0;

    swiper.move(1);
    expect(retranslatorFn).toHaveBeenCalledWith(0, 1, 0);

    swiper.transition(1, angular.noop);
    expect(retranslatorFn).toHaveBeenCalledWith(0, 1, 250);
  });

  describe('transitions', function() {

    it('should call callback on transition end', function() {
      var callback = jasmine.createSpy();
      swiper.transition(1, callback);
      expect(callback).not.toHaveBeenCalled();

      swiper.onTransitionEnd();
      expect(callback).toHaveBeenCalled();
    });

    it('should set isInTransition flag', function() {
      swiper.transition(1, angular.noop);
      expect(swiper.isInTransition()).toBe(true);

      swiper.onTransitionEnd();
      expect(swiper.isInTransition()).toBe(false);
    });

    it('should cancel scheduled callback on move', function() {
      var callback = jasmine.createSpy();
      swiper.transition(1, callback);
      swiper.move(1);
      swiper.onTransitionEnd();
      expect(callback).not.toHaveBeenCalled();
    });
    
  });

});
