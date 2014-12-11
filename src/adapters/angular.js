'use strict';

angular.module('swiperRepeat', ['ng'])

  .directive('swiperRepeat', ['$parse', function($parse) {

    var DEFAULTS = {
      preventDefault: true,
      stopPropagation: false,
      prerender: false,
      retranslator: null,
      disableTouch: false
    };

    return {
      restrict: 'A',
      transclude: 'element',
      priority: 1000,
      terminal: true,
      link: function($scope, $element, $attrs, ctrl, $transclude) {

        var expression = $attrs.swiperRepeat || '',
            match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)\s*$/),
            selectedExp = $attrs.swiperRepeatSelected ? $attrs.swiperRepeatSelected : null,
            setSelectedFn = selectedExp ? $parse(selectedExp).assign : null,
            optionsFn = $attrs.swiperRepeatOptions ? $parse($attrs.swiperRepeatOptions) : null,
            options = angular.copy(DEFAULTS);

        optionsFn && angular.extend(options, optionsFn($scope));

        if (!match) {
          throw new Error("Expected expression in form of '_item_ in _collection_' but got " + expression + ".");
        }

        var itemExp = match[1],
            collectionExp = match[2],
            swiper = {},
            needsDigest = false;


        var container = angular.element('<div style="position:relative;width:100%;height:100%;"></div>');
        $element.after(container);


        function slideFactory(item) {
          var scope = $scope.$new();
          scope[itemExp] = item;

          var element = $transclude(scope, function(clone) {
            container.append(clone);
          });

          needsDigest = true;

          return {

            element: element,
            item: item,
            
            destroy: function() {
              scope.$destroy();
              element.remove();
              needsDigest = true;
            }

          }
        }

        function select(value) {
          setSelectedFn && setSelectedFn($scope, value);
          needsDigest = true;
        }

        function $digest(fn, args) {
          needsDigest = false;
          fn.apply(swiper, args);
          if(needsDigest) {
            $scope.$digest();
            needsDigest = false;
          }
        }


        angular.extend(swiper, 
          Polyfill(), 
          Container(container), 
          Renderer(options.retranslator),
          State(select),
          Touch(),
          Api(),
          options.prerender ? RendererFull(slideFactory) : RendererPart(slideFactory)
        );

        if(!options.disableTouch) {
          container.on('touchstart', touchEventHandler(swiper.onTouchStart));
          container.on('touchmove', touchEventHandler(swiper.onTouchMove));
          container.on('touchend', touchEventHandler(swiper.onTouchEnd));  
        }
        
        function touchEventHandler(fn) {
          return function(event) {
            options.preventDefault && event.preventDefault();
            options.stopPropagation && event.stopPropagation();
            $digest(fn, arguments);
          }
        }


        container.on(swiper.TRANSITIONEND_EVENT, function(event) {
          if(event.target !== container[0]) {
            return;
          }
          event.stopPropagation();
          $digest(swiper.onTransitionEnd, arguments);      
        });


        var changes = {}, 
            actionScheduled = false;

        function scheduleAsyncAction() {
          if(!actionScheduled) {
            $scope.$evalAsync(function() {
              swiper.applyChanges(changes);
              actionScheduled = false;
              changes = {};
            });
            actionScheduled = true;
          }
        }

        $scope.$watchCollection(collectionExp, function(value) {
          changes.collection = value;
          scheduleAsyncAction();
        });

        if(selectedExp) {
          $scope.$watch(selectedExp, function(value) {
            changes.selected = value;
            scheduleAsyncAction();
          });
        }
      }
    }
  }]);
