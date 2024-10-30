/* fun little example using GreenSock's Draggable: http://www.greensock.com/draggable/ */

var content = document.getElementById("content");
var knob = document.getElementById("knob");
var maxScroll = content.scrollHeight - content.offsetHeight;
var needsRotationUpdate = false;
var sections = 5;

//when the user drags the knob, we must update the scroll position. We're using the special scrollProxy object of Draggable because it allows us to overscroll (normal browser behavior won't allow it to scroll past the top/bottom). 
function onRotateKnob() {
  dragContent.scrollProxy.top(maxScroll * dragKnob.rotation / -360);

     var rotated =    360 * (content.scrollTop / maxScroll);
    console.log( dragKnob.rotation + 'aaaaa' );
    
  needsRotationUpdate = false;
}

//this method updates the knob rotation, syncing it to wherever the content's scroll position is
function updateRotation() {
    TweenMax.set(knob, {rotation:360 * (content.scrollTop / maxScroll)});
    needsRotationUpdate = false;
    
}

function onDragEnded() {
    //console.log( 'stop' );
    var rotated =    360 * (content.scrollTop / maxScroll);
    console.log( rotated );
//    var setTo =     0;
//   // console.log( rotated + 'aaa');
//    if (rotated > 0 && rotated <= 36) {
//        setTo =     0;
//        //console.log( setTo );
//    }
//    if(rotated > 36 && rotated <= 72) {
//        setTo =     1;
//    }
//    if(rotated > 72 && rotated <= 108) {
//        setTo =     1;
//    }
//    if(rotated > 108 && rotated <= 144) {
//        setTo =     2;
//    }
//    if(rotated > 144 && rotated <= 180) {
//        setTo =     2;
//    }
//    if(rotated > 180 && rotated <= 216) {
//        setTo =     3;
//    }
//    if(rotated > 216 && rotated <= 252) {
//        setTo =     3;
//    }
//    if(rotated > 252 && rotated <= 288) {
//        setTo =     4;
//    }
//    if(rotated > 288 && rotated <= 324) {
//        setTo =     4;
//    }
//    if(rotated > 324 && rotated <= 360) {
//        setTo =     5;
//    }
//    
//    TweenLite.set("#knob", {rotation: (setTo * 72) });
    //dragContent.scrollProxy.top( Math.round( endValue / setTo) * -setTo );
}
function onDragReleased() {
    //console.log( 'relased' );
    $( '#knob' ).addClass( 'transitionOn' );
    //TweenLite.set("#knob", {rotation:45});
}
//if the user flicks/spins/drags with momentum, a tween is created, but if the user interacts again before the tween is done, we must kill that tweens (so as not to fight with the user). This method kills any tweens of the knob or the content's scrollProxy.
function killTweens() {
    TweenLite.killTweensOf([knob, dragContent.scrollProxy]);
    $( '#knob' ).removeClass( 'transitionOn' );
}
content.addEventListener("mousewheel", killTweens);
content.addEventListener("DOMMouseScroll", killTweens);

//whenever the content gets scrolled (like by using the mousewheel or dragging the content), we simply set a flag indicating we need to update the knob's rotation. We use a "tick" handler later to actually trigger the update because that optimizes performance since ticks happen on requestAnimationFrame and we want to avoid thrashing
content.addEventListener("scroll", function() {
  needsRotationUpdate = true;
});
TweenLite.ticker.addEventListener("tick", function() {
  if (needsRotationUpdate) {
    updateRotation();
  }
});

//create the knob Draggable

Draggable.create(knob, {
    type:"rotation",
    //throwProps:true,
    edgeResistance:0.85,
    dragResistance: 0,  
    //bounds:{minRotation:0, maxRotation:360},
    onDragStart:killTweens,
    onDrag: onRotateKnob,
    onDragEnd: onDragEnded,
    onRelease: onDragReleased,
    onThrowUpdate: onRotateKnob,
    snap: function(endValue) {
        var step = 360 / (sections - 1);
        return Math.round( endValue / step) * step;
    }
});


//create the content Draggable
Draggable.create(content, {
    type:"scrollTop", 
    edgeResistance:0.5, 
    //throwProps:true,
    onDragStart: killTweens,
    onDragEnd: onDragEnded,
    snap: function(endValue) {
    var step = maxScroll / (sections - 1);
        return Math.round( endValue / step) * -step;
    }
});

//grab the Draggable instances for the content and the knob, and store them in variables so that we can reference them in other functions very quickly. 
var dragContent = Draggable.get(content);
var dragKnob = Draggable.get(knob);