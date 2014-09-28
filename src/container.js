'use strict';

var Container = function(element) {

  return {
    
    translateContainer: function(dx, duration) {
      element.css(this.TRANSITION_PROP + 'Duration', duration)
             .css(this.TRANSFORM_PROP, this.TRANSFORMS_3D ? 'translate3d(' + dx + ', 0, 0)' : 'translate(' + dx + ', 0)');
    },

    getContainerPosition: function() {
      var style = window.getComputedStyle(element[0], null);

      if(window.WebKitCSSMatrix) {
        var matrix = new WebKitCSSMatrix(style.webkitTransform === 'none' ? '' : style.webkitTransform);
        return matrix.m41;
      }
      
      var matrix = style[this.TRANSFORM_PROP].split(',');
      return +(matrix[12] || matrix[4]);
    },

    getContainerWidth: function() {
      return element[0].getBoundingClientRect().width || element.prop('offsetWidth');
    }

  }

};
