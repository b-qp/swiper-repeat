'use strict';

describe('Touch', function () {

  var swiper;

  beforeEach(function() {
    swiper = angular.extend(SwiperMock(), Touch());
    swiper.slides = {
      left: { item: 1 },
      center: { item: 2 },
      right: { item: 3 }
    };
    swiper.getContainerWidth = function() { return 500 };
  });

  it('should follow the finger', function() {
    swiper.onTouchStart({timeStamp: 1410886936700, touches: [{pageX: 100}]});
    swiper.onTouchMove( {timeStamp: 1410886937700, touches: [{pageX: 300}]});
    expect(swiper.move).toHaveBeenCalledWith(-0.4);
  });

  it('should not follow the finger forever', function() {
    swiper.onTouchStart({timeStamp: 1410886936700, touches: [{pageX: 100}]});
    swiper.onTouchMove( {timeStamp: 1410886937700, touches: [{pageX: 700}]});
    expect(swiper.move).toHaveBeenCalledWith(-1);
  });

  it('should stay on current slide if dx was too small and swipe time was too big', function() {
    swiper.onTouchStart({timeStamp: 1410886936700, touches: [{pageX: 100}]});
    swiper.onTouchMove( {timeStamp: 1410886937700, touches: [{pageX: 300}]});
    swiper.onTouchEnd(  {timeStamp: 1410886938700, touches: [{pageX: 300}]});

    expect(swiper.transition).toHaveBeenCalled();
    expect(swiper.transition.calls[0].args[0]).toBe(0);

    swiper.transition.calls[0].args[1].call(swiper);
    expect(swiper.select).toHaveBeenCalledWith(2);
  });

  it('should go to the left slide if dx was big enough', function() {
    swiper.onTouchStart({timeStamp: 1410886936700, touches: [{pageX: 100}]});
    swiper.onTouchMove( {timeStamp: 1410886937700, touches: [{pageX: 400}]});
    swiper.onTouchEnd(  {timeStamp: 1410886938700, touches: [{pageX: 400}]});
    
    expect(swiper.transition).toHaveBeenCalled();
    expect(swiper.transition.calls[0].args[0]).toBe(-1);

    swiper.transition.calls[0].args[1].call(swiper);
    expect(swiper.select).toHaveBeenCalledWith(1);
  });

  it('should go to the right slide if dx was big enough', function() {
    swiper.onTouchStart({timeStamp: 1410886936700, touches: [{pageX: 400}]});
    swiper.onTouchMove( {timeStamp: 1410886937700, touches: [{pageX: 100}]});
    swiper.onTouchEnd(  {timeStamp: 1410886938700, touches: [{pageX: 100}]});
    
    expect(swiper.transition).toHaveBeenCalled();
    expect(swiper.transition.calls[0].args[0]).toBe(1);

    swiper.transition.calls[0].args[1].call(swiper);
    expect(swiper.select).toHaveBeenCalledWith(3);
  });

  it('should go to the left slide if swipe time was small enough', function() {
    swiper.onTouchStart({timeStamp: 1410886936600, touches: [{pageX: 100}]});
    swiper.onTouchMove( {timeStamp: 1410886936700, touches: [{pageX: 200}]});
    swiper.onTouchEnd(  {timeStamp: 1410886936800, touches: [{pageX: 200}]});
    
    expect(swiper.transition).toHaveBeenCalled();
    expect(swiper.transition.calls[0].args[0]).toBe(-1);

    swiper.transition.calls[0].args[1].call(swiper);
    expect(swiper.select).toHaveBeenCalledWith(1);
  });

  it('should go to the right slide if swipe time was small enough', function() {
    swiper.onTouchStart({timeStamp: 1410886936600, touches: [{pageX: 400}]});
    swiper.onTouchMove( {timeStamp: 1410886936700, touches: [{pageX: 300}]});
    swiper.onTouchEnd(  {timeStamp: 1410886936800, touches: [{pageX: 300}]});
    
    expect(swiper.transition).toHaveBeenCalled();
    expect(swiper.transition.calls[0].args[0]).toBe(1);

    swiper.transition.calls[0].args[1].call(swiper);
    expect(swiper.select).toHaveBeenCalledWith(3);
  });

  it('should not perform transition if dx >= slide width', function() {
    swiper.onTouchStart({timeStamp: 1410886936600, touches: [{pageX: 100}]});
    swiper.onTouchMove( {timeStamp: 1410886936700, touches: [{pageX: 700}]});
    swiper.onTouchEnd(  {timeStamp: 1410886936800, touches: [{pageX: 700}]});
    
    expect(swiper.transition).not.toHaveBeenCalled();
    expect(swiper.select).toHaveBeenCalledWith(1);
  });

  describe('touch start while other transition is in progress', function() {

    beforeEach(function() {
      swiper.isInTransition = function() { return true };
    });

    it('should stay on current slide', function() {
      swiper.getSlidesPosition = function() { return 0.4 };
      swiper.onTouchStart({timeStamp: 1410886936600, touches: [{pageX: 400}]});
      expect(swiper.select).toHaveBeenCalledWith(2, 0.4);
    });

    it('should go to the left', function() {
      swiper.getSlidesPosition = function() { return 0.6 };
      swiper.onTouchStart({timeStamp: 1410886936600, touches: [{pageX: 400}]});
      expect(swiper.select).toHaveBeenCalledWith(3, -0.4);
    });

    it('should go to the right', function() {
      swiper.getSlidesPosition = function() { return -0.6 };
      swiper.onTouchStart({timeStamp: 1410886936600, touches: [{pageX: 400}]});
      expect(swiper.select).toHaveBeenCalledWith(1, 0.4);
    });

  });

  it('should set isDragging flag', function() {
    swiper.onTouchStart({timeStamp: 1410886936700, touches: [{pageX: 100}]});
    expect(swiper.isDragging()).toBe(true);

    swiper.onTouchMove( {timeStamp: 1410886937700, touches: [{pageX: 300}]});
    expect(swiper.isDragging()).toBe(true);

    swiper.onTouchEnd(  {timeStamp: 1410886938700, touches: [{pageX: 300}]});
    expect(swiper.isDragging()).toBe(false);
  });

  it('should ignore touchmove if it is vertical scrolling', function() {
    swiper.onTouchStart({timeStamp: 1410886936700, touches: [{pageX: 100, pageY: 100}]});
    swiper.onTouchMove( {timeStamp: 1410886937700, touches: [{pageX: 200, pageY: 300}]});
    swiper.onTouchEnd(  {timeStamp: 1410886938700, touches: [{pageX: 200, pageY: 300}]});
    expect(swiper.move).not.toHaveBeenCalled();
    expect(swiper.transition).not.toHaveBeenCalled();
    expect(swiper.select).not.toHaveBeenCalled();
  });

});
