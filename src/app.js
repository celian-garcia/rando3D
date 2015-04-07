(function () {
    'use strict';

    var BABYLON = require('babylonjs');
    require('EasePack');
    require('TweenLite');
    require('TimelineLite');
    require('BezierPlugin');
    require('DirectionalRotationPlugin');

    function Rando3D() {

        var RANDO = RANDO || {};

        require('./modules/settings')(RANDO, BABYLON);
        require('./modules/dem')(RANDO, BABYLON);
        require('./modules/events')(RANDO);
        require('./modules/poi')(RANDO, BABYLON);
        require('./modules/scene')(RANDO, BABYLON);
        require('./modules/tile-container')(RANDO);
        require('./modules/trek')(RANDO, BABYLON);
        require('./modules/utils')(RANDO, BABYLON);
        require('./modules/cameras/camera-computer')(RANDO, BABYLON);
        require('./modules/cameras/camera-container')(RANDO, BABYLON);
        require('./modules/cameras/bird-camera')(RANDO, BABYLON);
        require('./modules/cameras/examine-camera')(RANDO, BABYLON);
        require('./modules/cameras/hiker-camera')(RANDO, BABYLON);

        function init(customSettings, canvas, cameraID) {

            jQuery.each(customSettings, function (settingName, settingValue) {
                RANDO.SETTINGS[settingName] = settingValue;
            });

            RANDO.START_TIME = Date.now();

            var scene = new RANDO.Scene(canvas, cameraID);

            return scene;
        }

        return {
            init: init
        };

    }

    if (window) {
        window.Rando3D = Rando3D;
    }
})();