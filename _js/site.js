$(function() {
	"use strict";

    // Fetch all the forms we want to apply custom 
    // Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
    .forEach(function (form) {
        form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
        }

        form.classList.add('was-validated')
        }, false)
    });

    $(window).on('load', function(){

        jarallax(document.querySelectorAll('.jarallax-keep-img'), {
            keepImg: true,
          });

        var aboutOffset = $('#about').offset();
        var toTop = $("a[href='#top']");
        

        $(window).on('scroll', function(){
            if($(window).scrollTop() > aboutOffset.top){
                toTop.fadeIn('slow');
            } else {
                toTop.fadeOut('slow');
            }
        });


        toTop.on('click', function() {
            $("html, body").animate({ scrollTop: 0 }, "ease");
            return false;
        });

        $(window).on('resize', function() { 

        }); 

        let test = document.body.innerText;
        console.log('allText:', test);

    });
});

