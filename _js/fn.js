$(document).ready(function(){
    $(window).on('load', function(){
        var winWidth = $( window ).width();
        var photoHeight = (winWidth / 16 ) * 9;
        var photoDiv = $("#photo");
        photoDiv.height(photoHeight); 

        var aboutOffset = $('#about').offset();
        var toTop = $("a[href='#top']");
        

        $(window).on('scroll', function(){
            if($(window).scrollTop() > aboutOffset.top){
                toTop.fadeIn('slow');
            } else {
                toTop.fadeOut('slow');
            }
        });


        toTop.click(function() {
            $("html, body").animate({ scrollTop: 0 }, "ease");
            return false;
        });

        $(window).resize(function() { 
            winWidth = $( window ).width();
            photoHeight = (winWidth / 16 ) * 9;
            console.log('Photo DIV height => ' + photoHeight)
            photoDiv.height(photoHeight); 
        }); 

    });
});

