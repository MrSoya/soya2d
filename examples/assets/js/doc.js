function toggleSide(node) {
	$('.sidebar').toggleClass('hidden');
	$('.page-main').toggleClass('hidden');
}

$(document).ready(function(){
	$('.sidebar').css('height',document.body.offsetHeight+"px");
	$('.sidebar .scrollpane>ul.nav').slimScroll({
        height: '100%'
    });
    if(!window.module)return;
    var active = $('.sidebar .doc-link[module="'+module+'"][name="'+name+'"]');
    active.addClass('active');
    //scroll to
    $('.sidebar .scrollpane ul[name="scrolllist"]').slimScroll({
        scrollTo:active.offset().top - 200/*paddingTop*/ +'px'
    });
});

function openWindow(path){
    var code = EDITOR.getValue();
    localStorage.setItem("code",code);
	window.open('window.html',module+"-"+name,'width=800,height=600');
}

function runjs(){
    var code = EDITOR.getValue();
    localStorage.setItem("code",code);
    //stop all games
    soya2d.games.forEach(function(game){
    	game.destroy();
    });
    new Function(code)();
}