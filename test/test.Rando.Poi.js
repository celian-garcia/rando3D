'use strict';

var chai = require('chai');
var assert = chai.assert;

describe('Geotrek 3D - Poi Object', function() {
    var data = {
        'coordinates': {
            'x': 100,
            'z': 10000
        },
        'properties': {
            'description': "description",
            'elevation': 1640,
            'model': "trekking.poi",
            'name': "Sérotine de Nilsson",
            'pictures': [],
            'pk': 903772,
            'thumbnail': null,
            'type': {
                'label': "Type1",
                'pictogram': "/media/upload/picto_type1.png"
            }
        }
    };

    var offsets = {
        'x': 100,
        'z': -200
    };
    var id = 0;

    describe('Attributes', function () {
        it("_position attribute should be equal to data.coordinates parameter translated by x and z offsets.", function(done) {
            var poi = new RANDO.Poi(id, data, offsets, scene);
            var expected_position = {
                'x': data.coordinates.x + offsets.x,
                'z': data.coordinates.z + offsets.z
            };

            assert.equal(poi._position.x, expected_position.x);
            assert.equal(poi._position.z, expected_position.z);
            done();
            poi.dispose();
        });

        it("_name attribute should be equal to data.properties.name parameter.", function(done) {
            var poi = new RANDO.Poi(id, data, offsets, scene);

            assert.deepEqual(poi._name, data.properties.name);
            done();
            poi.dispose();
        });

        it("_type attribute should be equal to data.properties.type parameter.", function(done) {
            var poi = new RANDO.Poi(id, data, offsets, scene);

            assert.deepEqual(poi._type, data.properties.type);
            done();
            poi.dispose();
        });

        it("_description attribute should be equal to data.properties.description parameter.", function(done) {
            var poi = new RANDO.Poi(id, data, offsets, scene);

            assert.deepEqual(poi._description, data.properties.description);
            done();
            poi.dispose();
        });


        it("_scene attribute should equals to scene parameter.", function(done) {
            var poi = new RANDO.Poi(id, data, offsets, scene);
            assert.deepEqual(poi._scene, scene);
            done();
            poi.dispose();
        });

    });
    describe('Properties', function () {
    });
});
