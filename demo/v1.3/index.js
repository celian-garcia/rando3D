
window.onload = function onload() {
    var pk = 903280;
    var customSettings = {
        IMAGES_FOLDER: 'images/',
        DEM_URL: "http://geotrek-pnc.makina-corpus.net/api/trek/429/dem.json",
        PROFILE_URL: "http://geotrek-pnc.makina-corpus.net/api/trek/429/profile.json",
        POI_URL: "http://geotrek-pnc.makina-corpus.net/api/pois/?format=geojson&trek=429",
        TILE_TEX_URL: "https://a.tiles.mapbox.com/v3/makina-corpus.i3p1001l/{z}/{x}/{y}.png",
        SIDE_TEX_URL: "img/side.jpg",
        CAM_SPEED_F: 100,
        PICTO_PREFIX: "http://geotrek-pnc.makina-corpus.net",
        TREK_COLOR: {
            R: 0.6,
            V: 0.1,
            B: 0.1
        }
    };

    var canvas = document.getElementById('canvas_renderer');
    var cameraID = "examine";
    var app3D = new Rando3D();
    var scene = app3D.init(customSettings, canvas, cameraID);
    scene.init();
};