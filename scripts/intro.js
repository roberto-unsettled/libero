
function changeStep(whatStep){
    var $intro =    $('#intro');
    $intro.attr('class','');
    $intro.addClass('step' + whatStep);
}

function nextExplanation( whatExplanation) {
    if(whatExplanation == 2) {
        $('#startPauseIntro, #sintonizeIntro').toggleClass('transparent');
        $('#explanationDial').addClass('invisible');
        $('#explanationPause').addClass('visible');
    }
    else{
        $('#explanationPause').removeClass('visible');
        $('#sintonizeIntro').toggleClass('transparent');
        $('#loadingContainer').addClass('invisible');
        $('#startSintoniza').addClass('visible');
    }
}
function toggleSelect() {
    $('.select').toggleClass('open');
    $('#sintonizaAge').toggleClass('hide');
    $('#toggle').attr('checked', false); //para poner la flecha ok
}

$(function() {
    
    $('#start').on('click',function(){
        changeStep(2);
    });
    $('#sintoniza').on('click',function(){
        changeStep(3);
    });
    
    
    $('#okDial').on('click',function(){
        nextExplanation(2);
    });
    $('#okPause').on('click',function(){
        nextExplanation(3);
    });
    $('#toggle').on('click',function(){
       toggleSelect();
    });
    
    $('.select-option input').on('click',function(){
        var $this =         $(this),
            year =          $this.val();

        $('#toggleText').text( year );
        toggleSelect();
        var $sintonizaAge = $('#sintonizaAge');
        
        if( !$sintonizaAge.hasClass('active') ){
            $sintonizaAge.addClass('active');
            $sintonizaAge.text('encender la radio');
        }
    });
    $('#sintonizaAge').on('click',function(){
       $('#wrapper').addClass('radio');
    });
});