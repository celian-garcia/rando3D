// Rando.Settings.js 
// General settings  

var START_TIME;
var RANDO = RANDO || {};
RANDO.SETTINGS = {};

// Links
RANDO.SETTINGS.DEM_URL; // Url of the DEM json
RANDO.SETTINGS.PROFILE_URL; // Url of the trek's profile json
RANDO.SETTINGS.TILE_TEX_URL = "https://api.tiles.mapbox.com/v3/tmcw.map-j5fsp01s/{z}/{x}/{y}.png";
RANDO.SETTINGS.SIDE_TEXTURE  = "img/side.jpg";
////////////////////////////////////////////////////////////////////////////////


// Camera 
RANDO.SETTINGS.CAM_OFFSET = 200; // Camera's altitude offset (in meters)

RANDO.SETTINGS.CAM_SPEED_T = 1.8; // Camera speed in Trek following mode (from 0 to 2)
RANDO.SETTINGS.CAM_SPEED_F = 50;  // Camera speed in Flying mode(from 0 to infinity !) 
////////////////////////////////////////////////////////////////////////////////


// Geometry
RANDO.SETTINGS.MIN_THICKNESS = 200; // Minimum thickness of the DEM
RANDO.SETTINGS.TREK_OFFSET = 2; // Trek's altitude offset (in meters)

RANDO.SETTINGS.TREK_COLOR = new BABYLON.Color3(0.1,0.6,0.2); // Trek color (green)
                 // new BABYLON.Color3(0.8,0,0.2); // fuschia
                 // new BABYLON.Color3(0.9,0.5,0); // orange
                 
RANDO.SETTINGS.TREK_WIDTH = 3; // Trek width (in meters)

RANDO.SETTINGS.TILE_ZOOM = 16;

////////////////////////////////////////////////////////////////////////////////


