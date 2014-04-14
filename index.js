
START_TIME = Date.now();

// Get the Canvas element from our HTML 
var canvas = document.getElementById("canvas_renderer");


window.onload = function onload(){
    $("#menu .button").click(function() {
        RANDO.SETTINGS.DEM_URL      = "json/trek/" + $(this).data('id') + "/dem.json",
        RANDO.SETTINGS.PROFILE_URL  = "json/trek/" + $(this).data('id')+ "/profile.json";
        RANDO.SETTINGS.TEXTURE_URL  = "img/texture/" + $(this).data('id') + "/texture.jpg";
        
        var scene = RANDO.Scene.launch(canvas);
    });
    $("#menu .button:first").click();
};



