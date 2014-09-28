'use strict';

describe('Render', function () {

  var swiper, retranslatorFn;

  beforeEach(function() {
    retranslatorFn = jasmine.createSpy();
    swiper = angular.extend(SwiperMock(), Polyfill());
  });

  it('should set constants', function() {
    expect(swiper.TRANSITION_PROP).not.toBeUndefined();
    expect(swiper.TRANSITIONEND_EVENT).not.toBeUndefined();
    expect(swiper.TRANSFORM_PROP).not.toBeUndefined();
    expect(swiper.TRANSFORMS_3D).not.toBeUndefined();
  });

});
