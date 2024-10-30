/* fun little example using GreenSock's Draggable: http://www.greensock.com/draggable/ */

var content =       null,
    knob =          null,
    maxScroll =     null,
    dragContent =   null,
    dragKnob =      null,
    playList =      [],
    manySongs =     0;

var needsRotationUpdate =   false,
    sections,
    maxMatchDecade = 0; //lo calculamos dinamico abajo
//1.- Real Madrid vs Pontevedra - 1968. 
//2.- Atlético de Madrid vs Ajax - 1970. 
//3.- FC Barcelona vs Valencia - 1971. 
//4.- Athletic de Bilbao vs Betis - 1977. 
//5.- España vs Malta - 1983
//6.- FC Barcelona vs Real Madrid - 1983
//7.- Real Madrid vs FC Barcelona - 1984
//8.- Real Madrid vs Anderlecht - 1984
//9.- Athletic de Bilbao vs FC Barcelona - 1984
//10.- Dínamo de Kiev vs Atlético de Madrid – 1986.
var jsonList = {
    "decade" : [
         {},
     {

          "1": [
          "24-04-1968_Manchester_United_Real Madrid.mp3",
          "Real Madrid vs Pontevedra - 1968"
          ]
     },
     {

          "1": [
          "1970-71-Ajax-Atletico_Madrid.mp3",
          "Atlético de Madrid vs Ajax - 1970"
          ],
         "2": [
          "1971-FC-Barcelona-Valencia.mp3",
          "FC Barcelona vs Valencia - 1971"
          ],
         "3": [
          "1977-Real-Betis-Athletic-Bilbao.mp3",
          "Athletic de Bilbao vs Betis - 1977"
          ]
     },
     {
          "1": [
          "1983-Espana-Malta.mp3",
          "España vs Malta - 1983"
          ],
         "2": [
          "1983-MaradonavsReal-Madrid.mp3",
          "FC Barcelona vs Real Madrid - 1983"
          ],
         "3": [
          "1984-Real-Madrid-Anderletch.mp3",
          "Real Madrid vs Anderlecht - 1984"
          ],
         "4": [
          "1984-Athletic-BilbaovsFCBarcelona.mp3",
          "Athletic de Bilbao vs FC Barcelona 1984"
          ],
         "5": [
          "1986-Dinamo-Kiev-Atletico-Madrid.mp3",
          "Dínamo de Kiev vs Atlético de Madrid – 1986"
          ]
         
     },
     {}
]
};

//when the user drags the knob, we must update the scroll position. We're using the special scrollProxy object of Draggable because it allows us to overscroll (normal browser behavior won't allow it to scroll past the top/bottom). 

function ajustarAlturas() {
    var alto =                          $( window ).height(),
        ancho =                         $( window ).width(),
        alturaInicial =                 768,
        anchoInicial =                  1024,
        proporcionVideo =               anchoInicial/alturaInicial,
        sizeFont =                      parseInt( $('html').css('font-size') ),
        alturaVideo,proportion;
    
    //console.log(( ancho / alto ));
    if ( ( ancho / alto ) < proporcionVideo ) {
        alturaVideo =                   ancho / proporcionVideo;
        proportion =                    alturaInicial / alturaVideo;
        
    }
    else {

        //proportion =                    alturaInicial / alturaVideo;
        //console.log( 'mas ancho que alto ' + proportion + ' ajustar al alto');
        proportion =                    (alto / alturaInicial);
        console.log(proportion);
        console.log(parseInt(proportion + sizeFont));
        //$('html').css({'font-size': parseInt(proportion + sizeFont) + 'px'});
    }
    //console.log( ;
    
    
}
 

function toggleModal() {
    $('#modalContainer').toggleClass('md-show');
    $('#radio').toggleClass('blur');
}

function controlDial() {
    var rotated =    dragKnob.rotation,
        decadeRad = 360/sections,
        decade = 1, match = 1;
        
    decade = parseInt(rotated / decadeRad);
    segment =  decadeRad / maxMatchDecade;
    
    
    //control de decada y franja naranja
    
    match = parseInt( (rotated - ( (decade * decadeRad) + segment ) ) / segment );
    
    if(jsonList.decade[decade][match] != undefined) { //check si tiene cancion o no para ponerla a funcionar
        startSound( decade,match );
        //console.log( 'tiene cancion' );
    }
    else {
        startNoise();
    }
    
    $('#decadeSector').css({'transform':'rotate(' + decade * decadeRad+ 'deg)'});
    //console.log( 'update' );
}
function onRotateKnob() {
    //mover scroll desde la ruleta
    var rotated =   dragKnob.rotation;
    dragContent.scrollProxy.left(maxScroll * dragKnob.rotation / 360);
    //console.log( 'update1' );
    if(  rotated > 0 &&  rotated < 359 ) {
        controlDial();
    }
    
    needsRotationUpdate = false;
}

//this method updates the knob rotation, syncing it to wherever the content's scroll position is
function updateRotation() {
    //TweenMax.set(knob, {rotation:360 * (content.scrollTop / maxScroll)});
    //mover ruleta desde scroll
    
    needsRotationUpdate = false;
}

function onDragEnded() {
    //console.log( 'stop' );
    var rotated =    dragKnob.rotation;
    if(rotated >= 360 ){
        rotated = 352;
        //console.log( maxScroll * rotated / 360 );
        dragContent.scrollProxy.left(maxScroll * rotated / 360);
    }
    if(rotated <= 0 ){
        rotated = 4;
        //console.log( maxScroll * rotated / 360 );
        dragContent.scrollProxy.left(maxScroll * rotated / 360);
    }
    
}
function onDragReleased() {
    //console.log( 'relased' );
//    $( '#content' ).addClass( 'transitionOn' );
//    $( '#knobBG' ).addClass( 'transitionOn' );

}
//if the user flicks/spins/drags with momentum, a tween is created, but if the user interacts again before the tween is done, we must kill that tweens (so as not to fight with the user). This method kills any tweens of the knob or the content's scrollProxy.
function killTweens() {
    //console
    //console.log( 'a' );
//    $( '#knobBG' ).removeClass( 'transitionOn' );
//    $( '#content' ).removeClass( 'transitionOn' );
    TweenLite.killTweensOf([knob, dragContent.scrollProxy]);
    startNoise();
}

//create the knob Draggable


//grab the Draggable instances for the content and the knob, and store them in variables so that we can reference them in other functions very quickly. 
var dragContent =   Draggable.get(content),
    dragKnob =      Draggable.get(knob);


$(function() {
    content =   document.getElementById("content"),
    knob =      document.getElementById("knob"),
    maxScroll = $('#content').width();
    
    sections =  jsonList.decade.length;

    for( i=0; i< sections;i++ ){ //calculamos maxMatchDecade
        var obj = jsonList.decade[i];
        
        var parseado = Object.keys(obj).map(function ( k ) { return obj[k] });
        if( maxMatchDecade < parseado.length ){
            maxMatchDecade = parseado.length;
        }
        if(parseado.length > 0 ) { //añadimos las canciones a la lista de reproduccion
            for( j=1;j<=parseado.length;j++) {
                addSound( i, j );
                manySongs++;
            }
        }
        
    }
    
    Draggable.create(knob, {
        type:           "rotation",
        //throwProps:true,
        edgeResistance: 0.85,
        dragResistance: 0,  
        bounds:{minRotation:0, maxRotation:360},
        onDragStart:killTweens,
        onDrag: onRotateKnob,
        onDragEnd: onDragEnded,
        onRelease: onDragReleased,
        snap: function(endValue) {
            var step = 360 / (sections - 1);
            return Math.round( endValue / step) * step;
        }
    });


    //create the content Draggable
    dragable1 = Draggable.create(content, {
        type:"scrollTop", 
        edgeResistance:0.5, 
        //throwProps:true,
        onDragStart: killTweens,
        //onDragEnd: onDragEnded,
        snap: function(endValue) {
        var step = maxScroll / (sections - 1);
            return Math.round( endValue / step) * -step;
        }
    });
    
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
    
    dragContent =   Draggable.get(content);
    dragKnob =      Draggable.get(knob);
    
    // esto esta mal hay que hacer el royo dinamico de patxi
    $( '#startPause' ).on( 'click',function(){
        $(this).find('.ico').toggleClass('playing');
        toggleSound();
        
    });
    
    $('#closeModal').on('click',function(){
       toggleModal();
    });
    
    $('#nextMatchClick').on('click',function(){
            putNextSong();
    });
    $('#nextSongModal').on('click',function(){
            toggleModal();
            putNextSong();
    });
    $('#repeatSongModal').on('click',function(){
        toggleModal();
        toggleSound();
        if(!$( '#startPause .ico' ).hasClass( 'playing')){
            $( '#startPause .ico' ).addClass('playing');
        }
    });
    
    //next - http://jplayer.org/latest/demo-02-jPlayerPlaylist/
    
   /* $('.home').click(function () {
        if (screenfull.enabled) {
            // We can use `this` since we want the clicked element
            screenfull.toggle();
        }
    });
    */
});