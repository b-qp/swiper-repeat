'use strict';

describe('Api', function () {

  var swiper, selectedSetterFn;

  beforeEach(function() {
    selectedSetterFn = jasmine.createSpy();
    swiper = angular.extend(SwiperMock(), Api());
  });

  describe('applying changes', function() {

    describe('collection update', function() {

      it('should set collection property on collection update', function() {
        var collection = [];
        swiper.applyChanges({collection: collection});
        expect(swiper.updateCollection).toHaveBeenCalledWith(collection);
      });

    });

    describe('not dragging and not in transition', function() {

      it('should call refresh() on collection change', function() {
        swiper.applyChanges({collection: [1,2,3]});
        expect(swiper.refresh).toHaveBeenCalled();
      });

      it('should call transition() if renderer has this item and then select(item)', function() {
        swiper.getSlidePosition = function() { return 2 };
        swiper.applyChanges({selected: 1});

        expect(swiper.transition.calls[0].args[0]).toBe(2);
        expect(swiper.select).not.toHaveBeenCalled();
        swiper.__flushTransition();
        expect(swiper.select).toHaveBeenCalledWith(1);
      });

      it('should do nothing if item already at center slide', function() {
        swiper.getSlidePosition = function() { return 0 };
        swiper.applyChanges({selected: 1});

        expect(swiper.transition).not.toHaveBeenCalled();
        expect(swiper.select).not.toHaveBeenCalled();
      });

      it('should call select(item) if renderer has no this item', function() {
        swiper.getSlidePosition = function() { return null };
        swiper.applyChanges({selected: 1});
        expect(swiper.select).toHaveBeenCalledWith(1);
      });

    });

    describe('while dragging', function() {

      beforeEach(function() {
        swiper.isDragging = function() { return true };
      });

      it('should call NOT call refresh() on collection change', function() {
        swiper.applyChanges({collection: [1,2,3]});
        expect(swiper.refresh).not.toHaveBeenCalled();
      });

      it('should do nothing on selected change', function() {
        swiper.applyChanges({selected: 2});
        expect(swiper.select).not.toHaveBeenCalled();
      });

    });

    describe('while in transition', function() {

      beforeEach(function() {
        swiper.isInTransition = function() { return true };
      });

      it('should NOT call refresh() on collection change', function() {
        swiper.applyChanges({collection: [1,2,3]});
        expect(swiper.refresh).not.toHaveBeenCalled();
      });

      it('should call transition() if renderer has this item and then select(item)', function() {
        swiper.getSlidePosition = function() { return 2 };
        swiper.applyChanges({selected: 1});

        expect(swiper.transition.calls[0].args[0]).toBe(2);
        expect(swiper.select).not.toHaveBeenCalled();
        swiper.__flushTransition();
        expect(swiper.select).toHaveBeenCalledWith(1);
      });

      it('should call transition() if item already at center slide and then select(item)', function() {
        swiper.getSlidePosition = function() { return 0 };
        swiper.applyChanges({selected: 1});

        expect(swiper.transition.calls[0].args[0]).toBe(0);
        expect(swiper.select).not.toHaveBeenCalled();
        swiper.__flushTransition();
        expect(swiper.select).toHaveBeenCalledWith(1);
      });

      it('should call select(item) if renderer has no this item', function() {
        swiper.getSlidePosition = function() { return null };
        swiper.applyChanges({selected: 1});
        expect(swiper.select).toHaveBeenCalledWith(1);
      });

    });

  });

});
