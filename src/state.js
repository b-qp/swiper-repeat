'use strict';

var State = function(selectedSetterFn) {

  var pendingCollection = null;

  return {

    slides: {
      left: null,
      center: null,
      right: null
    },

    collection: [],

    resolve: function(item) {
      var collectionWasUpdated = false;
      
      if(pendingCollection) {
        this.collection = [];
        for (var i = 0, ii = pendingCollection.length; i < ii; i++) {
          this.collection[i] = pendingCollection[i];
        }
        pendingCollection = null;
        collectionWasUpdated = true;
      }

      var slides = this.slides,
          collection = this.collection;

      if(arguments.length) {
        slides.center = { item: item };
      }
      else if(!slides.center && collection.length) {
        slides.center = { item: collection[0] };
      }

      if(slides.center && collection.indexOf(slides.center.item) === -1) {
        slides.center = collection.length ? { item: collection[0] } : null;
      }

      if(slides.center) {
        var index = this.index = collection.indexOf(slides.center.item);
        slides.left = index > 0 ? { item: collection[index - 1] } : null;
        slides.right = collection.length > index + 1 ? { item: collection[index + 1] } : null;
      } else {
        slides.left = slides.right = null;
        this.index = null;
      }

      slides.center && selectedSetterFn && selectedSetterFn(slides.center.item);

      return collectionWasUpdated;
    },

    updateCollection: function(collection) {
      pendingCollection = collection;
    }

  }

};