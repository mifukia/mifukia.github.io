require('jquery');

(function(){
    var changeIMG;
    var timer = false;
    var $rp = $('img.rp');
    $rp.hide();
    changeIMG = function(){
        var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var $body = $('body');
        if(windowWidth <= 640) {
            $body.removeClass('w-sp w-pc');
            $body.addClass('w-sp');
            $rp.each(function() {
                if($(this).attr("src").indexOf('--sp') == -1){
                    $(this).attr("src", $(this).attr("src").replace(/(\.)(png|jpg|gif)/, "--sp$1$2"));
                }
                $(this).show();
            });
        }else {
            $body.removeClass('w-sp w-pc');
            $body.addClass('w-pc');
            $rp.each(function() {
                $(this).attr("src", $(this).attr("src").replace("--sp", ""));
                $(this).show();
            });
        }
    };
    $(document).on('ready', function() {
        changeIMG();
    });
    $(window).on('resize',function(){
        if (timer !== false) {
            clearTimeout(timer);
        }
        timer = setTimeout(function() {
            changeIMG();
        }, 200);
    });
}());





