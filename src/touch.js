'use strict';

var Touch = function() {

  var initialOffset, 
      touchStart, 
      touchDelta,
      isScrolling,
      isDragging = false,
      containerWidth;

  return {
    
    onTouchStart: function(event) {
      initialOffset = 0,
      isDragging = true,
      isScrolling = undefined,
      containerWidth = this.getContainerWidth();

      if(this.isInTransition()) {
        initialOffset = this.getSlidesPosition();

        var item;
        if(initialOffset < -0.5) {
          item = this.slides.left.item;
          initialOffset = initialOffset + 1;
        }
        else if(initialOffset > 0.5) {
          item = this.slides.right.item;
          initialOffset = initialOffset - 1;
        }
        else {
          item = this.slides.center.item;
        }
        
        this.select(item, initialOffset);

        isScrolling = false;
      }
      
      var touch = event.touches[0];

      touchStart = {
        x: touch.pageX,
        y: touch.pageY,
        time: event.timeStamp || +new Date()
      };

      touchDelta = {
        x: 0,
        y: 0
      };
    },

    onTouchMove: function(event) {
      if(event.touches.length > 1 || event.scale && event.scale !== 1)
        return;

      var touch = event.touches[0];

      touchDelta = {
        x: touch.pageX - touchStart.x,
        y: touch.pageY - touchStart.y,
      };

      if(isScrolling === undefined) {
        isScrolling = !!(Math.abs(touchDelta.y) > Math.abs(touchDelta.x));
      }

      if(isScrolling) {
        isDragging = false;
        return;
      }
      
      var offset = (-touchDelta.x / containerWidth) + initialOffset;

      offset = offset > 1 ? 1
             : offset < -1 ? -1
             : offset;

      var resistance = 1;
      if((offset < 0 && !this.slides.left) || (offset > 0 && !this.slides.right)) {
        resistance = 1 / Math.sqrt(Math.abs(offset * containerWidth));
      }
      
      this.move(offset * resistance);
    },

    onTouchEnd: function(event) {
      if(isScrolling) {
        isDragging = false;
        return;
      }

      var offset = (-touchDelta.x / containerWidth) + initialOffset;

      var isSlide = (Math.abs(offset) > 0.5) ||
                          ((event.timeStamp || +new Date()) - touchStart.time < 250 && Math.abs(touchDelta.x) > 20);

      var item, transition;
      if(isSlide && offset < 0 && this.slides.left) {
        item = this.slides.left.item;
        transition = offset <= -1 ? null : -1;
      }

      else if(isSlide && offset > 0 && this.slides.right) {
        item = this.slides.right.item;
        transition = offset >= 1 ? null : 1;
      } 
      
      else if(Math.abs(offset) > 0) {
        item = this.slides.center.item;
        transition = 0;
      }

      else {
        item = this.slides.center.item;
        transition = null;
      }

      if(transition !== null) {
        this.transition(transition, function() {
          this.select(item);
        });
      } else {
        this.select(item);
      }

      isDragging = false;
    },

    isDragging: function() {
      return isDragging;
    }

  }

};
