'use strict';

var Renderer = function(retranslatorFn) {

  var onTransitionEnd, isInTransition;

  return {

    select: function(item, offset) {
      this.render(this.resolve(item));
      this.move(offset || 0);
    },

    refresh: function(offset) {
      this.render(this.resolve());
      this.move(offset || 0);
    },

    move: function(offset) {
      this.translate(offset, 0);
    },

    transition: function(offset, callback) {
      this.translate(offset, 250, callback);
    },

    isInTransition: function() {
      return isInTransition;
    },

    translate: function(offset, duration, callback) {
      if(duration > 0) {
        onTransitionEnd = callback;
        isInTransition = true;
      } else {
        onTransitionEnd = null;
        isInTransition = false;
      }
      this.translateSlides(offset, duration);
      retranslatorFn && retranslatorFn(this.index, offset, duration);
    },

    onTransitionEnd: function() {
      isInTransition = false;
      onTransitionEnd && onTransitionEnd.call(this);
      onTransitionEnd = null;
    }

  }

};
