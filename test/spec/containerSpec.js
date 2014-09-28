'use strict';

describe('Container', function () {

  var swiper, container;

  beforeEach(function() {
    container = angular.element('<div></div>');
    swiper = angular.extend(SwiperMock(), Container(container));
  });

  it('should translate container with hardware acceleration', function() {
    spyOn(angular.element.prototype, 'css').andCallThrough();
    swiper.TRANSFORMS_3D = true;

    swiper.translateContainer('200px', '250ms');
    
    expect(angular.element.prototype.css).toHaveBeenCalledWith('transitionDuration', '250ms');
    expect(angular.element.prototype.css).toHaveBeenCalledWith('transform', 'translate3d(200px, 0, 0)');
  });

  it('should translate container without hardware acceleration', function() {
    spyOn(angular.element.prototype, 'css').andCallThrough();
    swiper.TRANSFORMS_3D = false;
    
    swiper.translateContainer('200px', '250ms');
    
    expect(angular.element.prototype.css).toHaveBeenCalledWith('transitionDuration', '250ms');
    expect(angular.element.prototype.css).toHaveBeenCalledWith('transform', 'translate(200px, 0)');
  });

});
