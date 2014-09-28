'use strict';

var Api = function() {

  return {

    applyChanges: function(changes) {
      if(changes.hasOwnProperty('collection')) {
        this.updateCollection(changes.collection);
      }

      if(!this.isDragging()) {
        if(changes.hasOwnProperty('selected')) {
          var item = changes.selected,
              slidePosition = this.getSlidePosition(changes.selected);;

          if(Math.abs(slidePosition) > 0 || (slidePosition === 0 && this.isInTransition())) {
            this.transition(slidePosition, function() {
              this.select(item);
            });
          }

          else if(slidePosition === null) {
            this.select(item);
          }

          else if(slidePosition === 0 && changes.hasOwnProperty('collection') && !this.isInTransition()) {
            this.refresh();
          }
        }
        else if(changes.hasOwnProperty('collection') && !this.isInTransition()) {
          this.refresh();
        }
      }
    }

  }

};
