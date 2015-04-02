
window.onload = function onload() {
    var pk = 903280;
    var customSettings = {
        IMAGES_FOLDER: 'images/',
        DEM_URL: "json/trek/" + pk + "/dem.json",
        PROFILE_URL: "json/trek/" + pk + "/profile.json",
        POI_URL: "json/trek/" + pk + "/pois.geojson",
        TILE_TEX_URL: "https://a.tiles.mapbox.com/v3/makina-corpus.i3p1001l/{z}/{x}/{y}.png",
        SIDE_TEX_URL: "img/side.jpg",
        CAM_SPEED_F: 100,
        PICTO_PREFIX: "./"
    };

    var canvas = document.getElementById('canvas_renderer');
    var cameraID = "examine";
    var app3D = new Rando3D();
    var scene = app3D.init(customSettings, canvas, cameraID);
    scene.init();
};