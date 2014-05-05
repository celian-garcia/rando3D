
window.onload = function onload(){

        RANDO.SETTINGS.DEM_URL      = "json/trek/903488/dem.json",
        RANDO.SETTINGS.PROFILE_URL  = "json/trek/903488/profile.json";
        RANDO.SETTINGS.TEXTURE_URL  = "img/texture/903488/texture.jpg";
        RANDO.START_TIME = Date.now();
        
        var canvas = document.getElementById('canvas_renderer');
        var scene = new RANDO.Scene(canvas);
        scene.init();

};

