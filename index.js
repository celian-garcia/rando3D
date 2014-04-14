
<<<<<<< HEAD
START_TIME = Date.now();

// Get the Canvas element from our HTML 
var canvas = document.getElementById("canvas_renderer");
=======
    START_TIME = Date.now();
    
    // Get the Canvas element from our HTML 
    var canvas = document.getElementById("canvas_renderer");

>>>>>>> 23e05ef71be1b09ee9e2170d4eebdcf2984188c6

window.onload = function onload(){
    $("#menu .button").click(function() {
        RANDO.SETTINGS.DEM_URL      = "json/trek/" + $(this).data('id') + "/dem.json",
        RANDO.SETTINGS.PROFILE_URL  = "json/trek/" + $(this).data('id')+ "/profile.json";
        RANDO.SETTINGS.TEXTURE_URL  = "img/texture/" + $(this).data('id') + "/texture.jpg";
        
<<<<<<< HEAD
        var scene = RANDO.Scene.launch(canvas);

=======
        var scene = RANDO.Builds.launch(canvas);
>>>>>>> 23e05ef71be1b09ee9e2170d4eebdcf2984188c6
    });
    $("#menu .button:first").click();
};


<<<<<<< HEAD
=======











>>>>>>> 23e05ef71be1b09ee9e2170d4eebdcf2984188c6
