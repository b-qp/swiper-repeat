'use strict';

describe('State', function () {

  var swiper, selectedSetterFn;

  beforeEach(function() {
    selectedSetterFn = jasmine.createSpy();
    swiper = angular.extend(SwiperMock(), State(selectedSetterFn));
  });

  describe('slide items resolving', function() {
    
    it('should resolve to default state', function() {
      swiper.collection = [1,2,3,4,5];
      swiper.resolve();
      
      expect(swiper.slides.left).toBe(null);
      expect(swiper.slides.center.item).toBe(1);
      expect(swiper.slides.right.item).toBe(2);
    });

    it('should resolve slide items', function() {
      swiper.collection = [1,2,3,4,5];
      swiper.resolve(3);
      
      expect(swiper.slides.left.item).toBe(2);
      expect(swiper.slides.center.item).toBe(3);
      expect(swiper.slides.right.item).toBe(4);
    });

    it('should resolve slide items', function() {
      swiper.collection = [1,2,3,4,5];
      swiper.resolve(5);

      expect(swiper.slides.left.item).toBe(4);
      expect(swiper.slides.center.item).toBe(5);
      expect(swiper.slides.right).toBe(null);
    });

    it('should fallback to default state if collection has no selected item', function() {
      swiper.collection = [1,2,3,4,5];
      swiper.resolve(5);
      swiper.collection = [1,2,3,4];
      swiper.resolve();

      expect(swiper.slides.left).toBe(null);
      expect(swiper.slides.center.item).toBe(1);
      expect(swiper.slides.right.item).toBe(2);
    });

  });

  it('should call selectedSetterFn on resolve', function() {
    swiper.collection = [1,2,3,4,5];
    swiper.resolve(1);
    expect(selectedSetterFn).toHaveBeenCalledWith(1);
  });

  describe('collection update', function() {

    it('should update collection', function() {
      swiper.collection = [];
      swiper.updateCollection([1,2,3]);
      swiper.resolve();
      expect(swiper.collection).toEqual([1,2,3]);
    });

    it('should return true if collection was updated', function() {
      swiper.collection = [1,2,3];
      expect(swiper.resolve()).toBe(false);
      swiper.updateCollection([1,2,3,4]);
      expect(swiper.resolve()).toBe(true);
    });

  });

});
