$(function(){

    /* --- Fit the Height of Stuff--- */

    /* this is used to control the height and width of the
     * viewport. Ideally we would want the top and bottom white
     * navbar to sit on top and bottom of the screen. But we would
     * also like to ensure a minimum height and aspect-ratio
     * constraints to make sure the 3d model is not clipped by the 
     * screen.
     */

    function fitscreen() {
        $('.fitscreen').each(function(){
            var tofit   = $(this);
            var ww      = window.innerWidth;
            var wh      = window.innerHeight;
            var extra   = 0;
            var abandon = tofit.data('fitscreen-abandon-size') || 0;
            var minh    = tofit.data('fitscreen-min-height') || 0;
            var minr    = tofit.data('fitscreen-min-ratio') || 1;
            var maxr    = tofit.data('fitscreen-max-ratio') || 3;
            if (ww < abandon) {
                return;
            }
            if (tofit.data('fitscreen-with')) {
                var fitwith = tofit.data('fitscreen-with').split(',');
                for (var i = 0; i < fitwith.length; i++) {
                    extra += $(fitwith[i]).height() || 0;
                }
            }
            wh -= extra;
            if (ww / wh < minr) {
                console.log('minr',minr,'|',ww,wh,ww/wh);
                wh = Math.ceil(ww/minr);
                console.log(wh);
            } else if (ww / wh > maxr) {
                console.log('maxr',maxr,'|',ww,wh,ww/wh);
                wh = Math.ceil(ww/maxr);
                console.log(wh);
            }
            if (wh < minh) {
                console.log('minh');
                wh = minh;
            }
            tofit.css({'height': wh + 'px'});
        });
    }
    fitscreen();
    $(window).resize(fitscreen);


    
    /* --- Make stuff sticky --- */

    function stickstuff(){
        var scroll = $(window).scrollTop();
        $('.sticky').each(function(){
            var top    = $(this).data('sticky-top') || 0;
            var topel  = $(this).data('sticky-top-el') || null;

            if (topel) {
                top = $(topel).offset().top || 0;
            }

            if (scroll >= top) {
                $(this).addClass('stuck');
            } else {
                $(this).removeClass('stuck');
            }
        });
    }
    stickstuff();
    $(window).scroll(stickstuff);
    $(window).resize(stickstuff);

    /* --- Animated Self Page Nav--- */

    function clicknav(){
        $("a,.clicknav").click(function(event){
            var el     = $($(this).data('clicknav'));
            var offset = $(this).data('clicknav-offset');

            if (typeof offset === 'undefined') {
                offset = 100;
            }

            if (!el[0]) {
                var href = $(this).attr('href');
                if (href[0] === '#') {
                    el = $($(this).attr('href'));
                }
            }

            if (el[0]) {
                $('body,html').animate({'scrollTop':el.offset().top - offset},500,'swing');
                event.preventDefault();
            }
        });
    }
    clicknav();
});
