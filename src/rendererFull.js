'use strict';

var RendererFull = function(slideFactory) {

  var renderedSlides = [];

  return {

    render: function(collectionWasUpdated) {

      if(collectionWasUpdated) {

        for (var i = renderedSlides.length - 1; i >= 0; i--) {
          var slide = renderedSlides[i];
          if(this.collection.indexOf(slide.item) === -1) {
            slide.destroy();
            renderedSlides.splice(i, 1);
          }
        };

        for (var i = 0; i < this.collection.length; i++) {
          var slide = null,
              item = this.collection[i];

          for (var i2 = renderedSlides.length - 1; i2 >= 0; i2--) {
            if(renderedSlides[i2].item === item) {
              slide = renderedSlides[i2];
            }
          }

          if(!slide) {
            slide = slideFactory(item);
            slide.element.css({position: 'absolute', width: '100%', height: '100%'});
            renderedSlides.push(slide);
          }

          slide.element.css(this.TRANSFORM_PROP, 'translate(' + i * 100 + '%' + ', 0)');
        };
      }
    },

    translateSlides: function(offset, duration) {
      this.translateContainer((-offset -this.index) * 100 + '%', duration + 'ms');
    },

    getSlidesPosition: function() {
      return (-this.getContainerPosition() / this.getContainerWidth()) - this.index;
    },

    getSlidePosition: function(item) {
      if(this.index === null) return null;

      var index = this.collection.indexOf(item);
      return index === -1 ? null : index - this.index;
    }

  }

};
