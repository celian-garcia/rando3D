"use strict";

var RANDO = RANDO || {};

(function () {
    RANDO.PathCamera = function (name, position, scene) {
        BABYLON.Camera.call(this, name, position, scene);

        this.cameraDirection = new BABYLON.Vector3(0, 0, 0);
        this.cameraRotation = new BABYLON.Vector2(0, 0);
        this.rotation = new BABYLON.Vector3(0, 0, 0);
        this.ellipsoid = new BABYLON.Vector3(0.5, 1, 0.5);

        this.keysPlayPause = [32];
        this.keysStop  = [13];

        // Collisions
        this._collider = new BABYLON.Collider();
        this._needMoveForGravity = true;

        // Internals
        this._currentTarget = BABYLON.Vector3.Zero();
        this._viewMatrix = BABYLON.Matrix.Zero();
        this._camMatrix = BABYLON.Matrix.Zero();
        this._cameraTransformMatrix = BABYLON.Matrix.Zero();
        this._cameraRotationMatrix = BABYLON.Matrix.Zero();
        this._referencePoint = BABYLON.Vector3.Zero();
        this._transformedReferencePoint = BABYLON.Vector3.Zero();
        this._oldPosition = BABYLON.Vector3.Zero();
        this._diffPosition = BABYLON.Vector3.Zero();
        this._newPosition = BABYLON.Vector3.Zero();
        this._lookAtTemp = BABYLON.Matrix.Zero();
        this._tempMatrix = BABYLON.Matrix.Zero();
        this._positionAfterZoom = BABYLON.Vector3.Zero();

        // Animation
        this._timeline = new TimelineLite();
        this._path = [];
        this._state = null;
        this._oldState = null;
        this._isMoving = false;

        RANDO.PathCamera.prototype._initCache.call(this);
    };

    RANDO.PathCamera.prototype = Object.create(BABYLON.Camera.prototype);

    // Members
    RANDO.PathCamera.prototype.speed = 2.0;
    RANDO.PathCamera.prototype.checkCollisions = false;
    RANDO.PathCamera.prototype.applyGravity = false;
    RANDO.PathCamera.prototype.noRotationConstraint = false;
    RANDO.PathCamera.prototype.angularSensibility = 2000.0;
    RANDO.PathCamera.prototype.lockedTarget = null;
    RANDO.PathCamera.prototype.onCollide = null;
    RANDO.PathCamera.prototype.wheelPrecision = 0.3;
    RANDO.PathCamera.prototype.inertialRadiusOffset = 0;
    RANDO.PathCamera.prototype.lowerRadiusLimit = null;
    RANDO.PathCamera.prototype.upperRadiusLimit = null;

    RANDO.PathCamera.prototype._getLockedTargetPosition = function () {
        if (!this.lockedTarget) {
            return null;
        }

        return this.lockedTarget.position || this.lockedTarget;
    };

    // Cache
    RANDO.PathCamera.prototype._initCache = function () {
        this._cache.lockedTarget = new BABYLON.Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        this._cache.rotation = new BABYLON.Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
    };

    RANDO.PathCamera.prototype._updateCache = function (ignoreParentClass) {
        if (!ignoreParentClass)
            BABYLON.Camera.prototype._updateCache.call(this);

        var lockedTargetPosition = this._getLockedTargetPosition();
        if (!lockedTargetPosition) {
            this._cache.lockedTarget = null;
        }
        else {
            if (!this._cache.lockedTarget) {
                this._cache.lockedTarget = lockedTargetPosition.clone();
            }
            else {
                this._cache.lockedTarget.copyFrom(lockedTargetPosition);
            }
        }

        this._cache.rotation.copyFrom(this.rotation);
    };

    // Synchronized
    RANDO.PathCamera.prototype._isSynchronizedViewMatrix = function () {
        if (!BABYLON.Camera.prototype._isSynchronizedViewMatrix.call(this)) {
            return false;
        }

        var lockedTargetPosition = this._getLockedTargetPosition();

        return (this._cache.lockedTarget ? this._cache.lockedTarget.equals(lockedTargetPosition) : !lockedTargetPosition)
            && this._cache.rotation.equals(this.rotation);
    };

    // Methods
    RANDO.PathCamera.prototype._computeLocalCameraSpeed = function () {
        return this.speed * ((BABYLON.Tools.GetDeltaTime() / (BABYLON.Tools.GetFps() * 10.0)));
    };

    // Controls
    RANDO.PathCamera.prototype.attachControl = function (canvas, noPreventDefault) {
        var previousPosition;
        var that = this;
        var engine = this._scene.getEngine();

        if (this._attachedCanvas) {
            return;
        }
        this._attachedCanvas = canvas;

        if (this._onMouseDown === undefined) {
            this._onMouseDown = function (evt) {
                previousPosition = {
                    x: evt.clientX,
                    y: evt.clientY
                };

                if (!noPreventDefault) {
                    evt.preventDefault();
                }
            };

            this._onMouseUp = function (evt) {
                previousPosition = null;
                if (!noPreventDefault) {
                    evt.preventDefault();
                }
            };

            this._onMouseOut = function (evt) {
                previousPosition = null;
                that._keys = [];
                if (!noPreventDefault) {
                    evt.preventDefault();
                }
            };

            this._onMouseMove = function (evt) {
                if (!previousPosition && !engine.isPointerLock) {
                    return;
                }

                var offsetX;
                var offsetY;

                if (!engine.isPointerLock) {
                    offsetX = evt.clientX - previousPosition.x;
                    offsetY = evt.clientY - previousPosition.y;
                } else {
                    offsetX = evt.movementX || evt.mozMovementX || evt.webkitMovementX || evt.msMovementX || 0;
                    offsetY = evt.movementY || evt.mozMovementY || evt.webkitMovementY || evt.msMovementY || 0;
                }

                that.cameraRotation.y += offsetX / that.angularSensibility;
                that.cameraRotation.x += offsetY / that.angularSensibility;

                previousPosition = {
                    x: evt.clientX,
                    y: evt.clientY
                };
                if (!noPreventDefault) {
                    evt.preventDefault();
                }
            };

            this._onWheel = function (event) {
                var delta = 0;
                if (event.wheelDelta) {
                    delta = event.wheelDelta / (that.wheelPrecision * 40);
                } else if (event.detail) {
                    delta = -event.detail / that.wheelPrecision;
                }

                if (delta)
                    that.inertialRadiusOffset += delta;

                if (event.preventDefault) {
                    if (!noPreventDefault) {
                        event.preventDefault();
                    }
                }
            };

            this._onKeyDown = function (evt) {
                var state = that._state;
                var oldState = state;
                if (that._timeline && !that._isMoving) {
                    var keyCode = evt.keyCode;

                    if (that.keysPlayPause.indexOf(keyCode) !== -1) {
                        if (state == "stop" || state == "pause") {
                            state = "play";
                        } else if (state == "play") {
                            state = "pause";
                        }
                    } else if (that.keysStop.indexOf(keyCode) !== -1) {
                        if (state == "play" || state == "pause" || !state) {
                            state = "stop";
                        }
                    }
                    that._oldState  = oldState;
                    that._state     = state;
                    console.log(oldState + " to " + state);
                }
            };

            this._onLostFocus = function () {
                that._keys = [];
            };

            this._reset = function () {
                that._keys = [];
                previousPosition = null;
                that.cameraDirection = new BABYLON.Vector3(0, 0, 0);
                that.cameraRotation = new BABYLON.Vector2(0, 0);
            };
        }

        canvas.addEventListener("mousedown", this._onMouseDown, false);
        canvas.addEventListener("mouseup", this._onMouseUp, false);
        canvas.addEventListener("mouseout", this._onMouseOut, false);
        canvas.addEventListener("mousemove", this._onMouseMove, false);
        window.addEventListener('mousewheel', this._onWheel, false);
        window.addEventListener('DOMMouseScroll', this._onWheel);
        window.addEventListener("keydown", this._onKeyDown, false);
        window.addEventListener("blur", this._onLostFocus, false);
    };

    RANDO.PathCamera.prototype.detachControl = function (canvas) {
        if (this._attachedCanvas != canvas) {
            return;
        }

        canvas.removeEventListener("mousedown", this._onMouseDown);
        canvas.removeEventListener("mouseup", this._onMouseUp);
        canvas.removeEventListener("mouseout", this._onMouseOut);
        canvas.removeEventListener("mousemove", this._onMouseMove);
        window.removeEventListener('mousewheel', this._onWheel);
        window.removeEventListener('DOMMouseScroll', this._onWheel);
        window.removeEventListener("keydown", this._onKeyDown);
        window.removeEventListener("blur", this._onLostFocus);

        this._attachedCanvas = null;
        if (this._reset) {
            this._reset();
        }
    };

    RANDO.PathCamera.prototype._collideWithWorld = function (velocity) {
        this.position.subtractFromFloatsToRef(0, this.ellipsoid.y, 0, this._oldPosition);
        this._collider.radius = this.ellipsoid;

        this._scene._getNewPosition(this._oldPosition, velocity, this._collider, 3, this._newPosition);
        this._newPosition.subtractToRef(this._oldPosition, this._diffPosition);

        if (this._diffPosition.length() > BABYLON.Engine.collisionsEpsilon) {
            this.position.addInPlace(this._diffPosition);
            if (this.onCollide) {
                this.onCollide(this._collider.collidedMesh);
            }
        }
    };

    RANDO.PathCamera.prototype._update = function () {

        var needToRotate = Math.abs(this.cameraRotation.x) > 0 || Math.abs(this.cameraRotation.y) > 0;
        var stateHaveChanged = this._oldState != this._state;

        // Rotate
        if (needToRotate) {
            this.rotation.x += this.cameraRotation.x;
            this.rotation.y += this.cameraRotation.y;

            if (!this.noRotationConstraint) {
                var limit = (Math.PI / 2) * 0.95;

                if (this.rotation.x > limit)
                    this.rotation.x = limit;
                if (this.rotation.x < -limit)
                    this.rotation.x = -limit;
            }
            
            // Inertia
            if (Math.abs(this.cameraRotation.x) < BABYLON.Engine.epsilon)
                this.cameraRotation.x = 0;

            if (Math.abs(this.cameraRotation.y) < BABYLON.Engine.epsilon)
                this.cameraRotation.y = 0;

            this.cameraRotation.scaleInPlace(this.inertia);
        }

        // State 
        if (stateHaveChanged) {
            var newState = this._state;
            var that = this;
            switch (newState) {
                case "stop" : 
                    this._isMoving = true;
                    RANDO.Utils.moveCameraTo(that, that._path[0], that._path[1], function(){
                        that._timeline.pause(0);
                        that._isMoving = false;
                    });
                break;
                case "play" :
                    this._timeline.play();
                break;
                case "pause" : 
                    this._timeline.pause();
            }
            this._oldState = this._state;
        }
    };

    RANDO.PathCamera.prototype._getViewMatrix = function () {
        BABYLON.Vector3.FromFloatsToRef(0, 0, 1, this._referencePoint);

        if (!this.lockedTarget) {
            // Compute
            if (this.upVector.x != 0 || this.upVector.y != 1.0 || this.upVector.z != 0) {
                BABYLON.Matrix.LookAtLHToRef(BABYLON.Vector3.Zero(), this._referencePoint, this.upVector, this._lookAtTemp);
                BABYLON.Matrix.RotationYawPitchRollToRef(this.rotation.y, this.rotation.x, this.rotation.z, this._cameraRotationMatrix);

                this._lookAtTemp.multiplyToRef(this._cameraRotationMatrix, this._tempMatrix);
                this._lookAtTemp.invert();
                this._tempMatrix.multiplyToRef(this._lookAtTemp, this._cameraRotationMatrix);
            } else {
                BABYLON.Matrix.RotationYawPitchRollToRef(this.rotation.y, this.rotation.x, this.rotation.z, this._cameraRotationMatrix);
            }

            BABYLON.Vector3.TransformCoordinatesToRef(this._referencePoint, this._cameraRotationMatrix, this._transformedReferencePoint);

            // Computing target and final matrix
            this.position.addToRef(this._transformedReferencePoint, this._currentTarget);
        } else {
            this._currentTarget.copyFrom(this._getLockedTargetPosition());
        }

        BABYLON.Matrix.LookAtLHToRef(this.position, this._currentTarget, this.upVector, this._viewMatrix);
        return this._viewMatrix;
    };

    RANDO.PathCamera.prototype.setPath = function (vertices) {
        var path = this._path;
        if (path.length) {
            path = [];
        }

        for (var i = 0; i < vertices.length; i+=20) {
            path.push(vertices[i]);
        }
        if (vertices[vertices.length] != path[path.length]) {
            path.push(vertices[vertices.length]);
        }

        this._loadPathOnTimeline (vertices.length);
    };
    
    RANDO.PathCamera.prototype._loadPathOnTimeline = function (lengthOfBezier) {
        var toRemove = this._timeline.getChildren()
        if (toRemove.length) {
            for (var it in toRemove) {
                this._timeline.remove(toRemove[it]);
            }
        }

        var quantity = lengthOfBezier;
        var duration = 10;
        var position = {
            x: this._path[0].x,
            y: this._path[0].y,
            z: this._path[0].z
        };

        var tween = TweenLite.to(position, quantity, {bezier: this._path, ease:Linear.easeNone});

        for (var i = 0; i < quantity; i++) {
            tween.time(i); //jumps to the appropriate time in the tween, causing position.x and position.y to be updated accordingly.

            this._timeline.add(
                TweenLite.to(this.position, (duration / quantity), {
                    x: position.x, 
                    y: position.y + RANDO.SETTINGS.CAM_OFFSET, 
                    z: position.z, 
                    ease: "Linear.easeNone"  
                }) 
            );
        }

        // Animation paused by default
        this._timeline.pause(0);
        
        console.log(this._timeline.getChildren());
    };
})();

