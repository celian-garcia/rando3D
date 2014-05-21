
window.onload = function onload(){

        RANDO.SETTINGS.DEM_URL      = "../../json/trek/903488/dem.json";
        RANDO.SETTINGS.PROFILE_URL  = "../../json/trek/903488/profile.json";
        RANDO.SETTINGS.POI_URL      = "../../json/trek/903488/pois.geojson";
        RANDO.SETTINGS.TILE_TEX_URL = "https://a.tiles.mapbox.com/v3/makina-corpus.i3p1001l/{z}/{x}/{y}.png"
        RANDO.SETTINGS.SIDE_TEX_URL = "../../img/side.jpg";
        RANDO.SETTINGS.FAKE_TEX_URL = "../../img/white.png";

        RANDO.START_TIME = Date.now();
        
        var canvas = document.getElementById('canvas_renderer');
        var scene = new RANDO.Scene(canvas, true, "1.1");
        scene.init();

};

