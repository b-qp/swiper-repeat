'use strict';

var Polyfill = function() {

  var TRANSITION_PROP, TRANSITIONEND_EVENT;

  if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined) {
    TRANSITION_PROP = 'WebkitTransition';
    TRANSITIONEND_EVENT = 'webkitTransitionEnd transitionend';
  } else {
    TRANSITION_PROP = 'transition';
    TRANSITIONEND_EVENT = 'transitionend';
  }
  
  function getFirstAvailable(keys) {
    for (var i = 0; i < keys.length; i++) {
      if(document.documentElement.style[keys[i]] !== undefined) {
        return keys[i];
      }
    }
  }

  return {

    TRANSITION_PROP: TRANSITION_PROP,
    TRANSITIONEND_EVENT: TRANSITIONEND_EVENT,
    TRANSFORM_PROP: getFirstAvailable(['transform', 'webkitTransform', 'MozTransform', 'msTransform', 'OTransform']),
    TRANSFORMS_3D: !!getFirstAvailable(['perspective', 'webkitPerspective', 'MozPerspective',  'MsPerspective', 'OPerspective'])

  }

};
