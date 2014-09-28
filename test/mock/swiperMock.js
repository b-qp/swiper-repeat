'use strict';

var SwiperMock = function() {

  var transitionCallback;

  return {

    // renderer base
    select: jasmine.createSpy(),
    refresh: jasmine.createSpy(),
    move: jasmine.createSpy(),
    transition: jasmine.createSpy().andCallFake(function(dx, callback) {
      transitionCallback = callback;
    }),
    isInTransition: function() { return false },
    __flushTransition: function() {
      transitionCallback && transitionCallback.call(this);
    },

    // renderer impl
    render: jasmine.createSpy(),
    translateSlides: jasmine.createSpy(),
    getSlidesPosition: function() { return 0 },
    getSlidePosition: function() { return null },

    // container
    translateContainer: jasmine.createSpy(),
    getContainerWidth: jasmine.createSpy(),
    getContainerPosition: jasmine.createSpy(),

    // state
    resolve: jasmine.createSpy(),
    collection: [],
    updateCollection: jasmine.createSpy(),
    slides: {
      left: null,
      center: null,
      right: null
    },

    // api
    applyChanges: jasmine.createSpy(),

    // touch
    isDragging: function() { return false },

    // poly
    TRANSITION_PROP: 'transition',
    TRANSFORM_PROP: 'transform',
    TRANSFORMS_3D: true

  }

};