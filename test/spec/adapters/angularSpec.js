'use strict';

describe('swiperRepeat directive', function () {

  var $compile, $scope;

  beforeEach(function() {
    module('swiperRepeat');
  });

  beforeEach(inject(function(_$compile_, $rootScope) {
    $compile = _$compile_;
    $scope = $rootScope.$new();
  }));

  describe('container element', function() {

    beforeEach(function() {
      window._Container = window.Container;
      window.Container = jasmine.createSpy().andCallFake(window._Container);
    });

    afterEach(function() {
      window.Container = window._Container;
    });

    it('should proper css to container', function() {
      var element = $compile('<div><div swiper-repeat="item in items"></div></div>')($scope);
      var container = window.Container.calls[0].args[0];
      expect(container.css('height')).toBe('100%');
      expect(container.css('width')).toBe('100%');
      expect(container.css('position')).toBe('relative');
    });

    it('should provide container to Container', function() {
      var element = $compile('<div><div swiper-repeat="item in items"></div></div>')($scope);
      expect(window.Container).toHaveBeenCalled();
      var container = window.Container.calls[0].args[0];
      expect(element.children()[0]).toBe(container[0]);
    });

  });

  describe('api', function() {

    var origin;
    beforeEach(function() {
      window._Api = window.Api;
      window.Api = function() {
        origin = window._Api();
        spyOn(origin, 'applyChanges').andCallThrough();
        return origin;
      };  
    });

    afterEach(function() {
      window.Api = window._Api;
    });

    it('should call applyChanges', function() {
      $scope.items = [1,2,3];
      $compile('<div swiper-repeat="item in items"></div>')($scope);
      $scope.$digest();
      expect(origin.applyChanges).toHaveBeenCalledWith({collection: [1,2,3]});
    });

    it('should call applyChanges', function() {
      $scope.items = [1,2,3];
      $scope.selected = 2;
      $compile('<div swiper-repeat="item in items" swiper-repeat-selected="selected"></div>')($scope);
      $scope.$digest();
      expect(origin.applyChanges).toHaveBeenCalledWith({collection: [1,2,3], selected: 2});
      expect(origin.applyChanges.calls.length).toBe(1);
    });

  });

  describe('select', function() {

    beforeEach(function() {
      window._State = window.State;
      window.State = jasmine.createSpy().andCallFake(window._State);
    });

    afterEach(function() {
      window.State = window._State;
    });

    it('should update $scope value', function() {
      $compile('<div swiper-repeat="item in items" swiper-repeat-selected="selected"></div>')($scope);
      var setterFn = window.State.calls[0].args[0];
      setterFn('newVal');
      expect($scope.selected).toBe('newVal');
    });

  });

  describe('slide factory', function() {

    var slideFactory, container;
    beforeEach(function() {
      window._RendererPart = window.RendererPart;
      window.RendererPart = jasmine.createSpy().andCallFake(window._RendererPart);
      var element = $compile('<div><div swiper-repeat="item in items" swiper-repeat-options="{prerender:false}"></div></div>')($scope);
      slideFactory = window.RendererPart.calls[0].args[0];
      container = element.children();
    });

    afterEach(function() {
      window.RendererPart = window._RendererPart;
    });

    it('should create and attach element', function() {
      var slide = slideFactory('itemValue');
      expect(slide.element[0]).toBe(container.children()[0]);
    });

    it('should create scope for slide with item value', function() {
      var slide = slideFactory('itemValue');
      var slideScope = container.children().scope();
      expect(slideScope.$parent).toBe($scope);
      expect(slideScope.item).toBe('itemValue');
    });

    it('should destroy scope and remove element', function() {
      var slide = slideFactory('itemValue');
      var slideScope = container.children().scope();
      spyOn(slideScope, '$destroy');
      slide.destroy();

      expect(slideScope.$destroy).toHaveBeenCalled();
      expect(container.children().length).toBe(0);
    });

  });

});
