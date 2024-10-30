var myPlaylist, myNoise, $player1,positionInList;
var noiseTile=      'Buscando emisora...';
var currentTitle=   '';

function whereIsThisMatch( decada,match ){
    var decadeRad = 360/sections,
        segment =  decadeRad / maxMatchDecade;
    
    $('#decadeSector').css({'transform':'rotate(' + decada * decadeRad+ 'deg)'});

    var rota = ( match * segment ) + ( (decada * decadeRad) + segment );
    
    TweenMax.set(knob, {rotation:rota});
    dragContent.scrollProxy.left(maxScroll * rota / 360);
    //dragContent.scrollProxy.left(maxScroll * dragKnob.rotation / 360);
    //dragable1[0].update();
//    draggable2[0].update();
        
//    $( '#knobBG' ).removeClass( 'transitionOn' );
//    $( '#content' ).removeClass( 'transitionOn' );
}

function putNextSong() {
    if(playList[positionInList + 1] == undefined ){
        positionInList = -1;
    }
    var nextElement =       playList[positionInList + 1];
    var nextDecade =        nextElement.slice(0,nextElement.indexOf("-")),
        nextMatch =         nextElement.slice( ( nextElement.indexOf("-") + 1 ),nextElement.length);
    //console.log(nextDecade + ' ' + nextMatch);
    startSound(nextDecade,nextMatch);
    whereIsThisMatch(nextDecade,nextMatch);
    
}
function songEnded() {
    //console.log( 'end?' );
    toggleModal();
    $player1.jPlayer('pause');
    myPlaylist.select(positionInList);
    $( '#startPause .ico' ).removeClass('playing');
}

function toggleSound(){
    if( currentTitle != noiseTile ) {
        if($player1.data().jPlayer.status.paused == false ){
            $player1.jPlayer("pause");
        }
        else{
            $player1.jPlayer("play");
        }
    }
    else {
        myNoise.jPlayer("pause");
    }
    
}

function changeTitle( title ){
    $('#currentTitle').html(title);
}

function setLoopPlayer( state ){
    $player1.jPlayer({ loop: state });
    //console.log( 'cambio a: ' +  state);
}

function startNoise() { //lanzamos whiteNoise
//    if( $('#startPause').hasClass('wait') ) {
//        $('#startPause').removeClass('wait');
//    }
    $player1.jPlayer("pause"); //hacemos sonar el white noise
    myNoise.jPlayer("play");
    
    if( currentTitle != noiseTile ) {
        currentTitle=   noiseTile; //ponemos el titulo que toca
        changeTitle( noiseTile );
        //setLoopPlayer( true );
    }
    if(!$( '#startPause .ico' ).hasClass( 'playing')){
            $( '#startPause .ico' ).addClass('playing');
    }
    
}

function startSound( decada, match ) {
    //console.log( decada, match );
    //$("#jpId").jPlayer( "clearMedia" ); //con esto se para lo que esta sonando y para de bajarse
    
    //jsonList.[decada 0 =50, 1=60 ...].[song 1=song1, 2=song2...][ 0= src,1=title ];
    //event.jPlayer.status.currentPercentRelative
    //event.jPlayer.status.waitForLoad
    //$player1.data().jPlayer.status.currentTime
    //$player1.data().jPlayer.status.duration
    myNoise.jPlayer('pause');
   
    
    //console.log( myPlaylist.playlist[myPlaylist.current] );
    var srcSong =   jsonList.decade[decada][match][0],
        titleSong = jsonList.decade[decada][match][1];
    
//    
    if( currentTitle != titleSong ) { //no lanzamos la que ya esta sonando
        positionInList =    jQuery.inArray( decada + '-'+ match, playList );
        //console.log(positionInList);
        myPlaylist.play( positionInList );
        currentTitle =  titleSong;
        changeTitle( currentTitle );
//     //   setLoopPlayer( false );
    }
    console.log(titleSong);
    if(!$( '#startPause .ico' ).hasClass( 'playing')){
            $( '#startPause .ico' ).addClass('playing');
    }
    
}

function addSound( decada, match ) {
    //console.log(decada + ' - ' + match);
    var srcSong =   jsonList.decade[decada][match][0],
        titleSong = jsonList.decade[decada][match][1];
    
    playList.push(decada + '-'+ match);
    
    if( currentTitle != titleSong ) { //no lanzamos la que ya esta sonando
        myPlaylist.add({
			title:   titleSong,
			mp3: './media/' + srcSong
		});
    }
    //console.log(titleSong);  
}

$(function() {
    $player1 =   $("#jquery_jplayer_1");
    
    myPlaylist =  new jPlayerPlaylist({
		jPlayer: "#jquery_jplayer_1"
	}, [
	], {
		swfPath: '/scripts/jplayer/',
		supplied: "mp3",
		wmode: "window",
		useStateClassSkin: false,
        loop: false,
		autoBlur: false,
		smoothPlayBar: false,
		keyEnabled: true,
        remove: true,
        ended: function() {
            songEnded();
        }
	});
    
    myNoise =   $("#jquery_jplayer_noise").jPlayer( {
        ready: function () {
          $(this).jPlayer("setMedia", {
            mp3: "./media/noise.mp3"
          },{
            swfPath: '/scripts/jplayer/',
            supplied: "mp3",
            wmode: "window",
            loop: true,
        });
        }
    });
    
    $('#knobBG').on('touchstart click',function(){

        myNoise.jPlayer({ loop: true });
        myNoise.jPlayer("play");
        changeTitle( noiseTile );
        
        $player1.jPlayer("play");
        
        //myPlaylist.play();
        //myPlaylist.pause(); //ñapa from Spain para engañar a mac ¬¬
        
    });

});

//soundPlay();