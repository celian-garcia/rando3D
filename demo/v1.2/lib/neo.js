var NEO = { REVISION: "0.0.1" };// JavaScript Document

NEO.Space = Object.freeze(
{
    LOCAL:0,
    WORLD:1
});

NEO.Axis = Object.freeze(
{
    X : new BABYLON.Vector3(1,0,0),
    Y : new BABYLON.Vector3(0,1,0),
    Z : new BABYLON.Vector3(0,0,1)
});

/**
* Returns a random number between min and max
*/
NEO.GetRandomInRange = function(min, max)
{
return Math.random() * (max - min) + min;
};

NEO.toDEGREES = 180/Math.PI;
NEO.toRADIANS = Math.PI/180;

NEO.JackIntoBabylon = function()
{    
    BABYLON.Mesh.prototype.Translate = function(axis, distance, space)
    {
        if( space == NEO.Space.LOCAL )
        {    
            var tempV3 = this.getPositionExpressedInLocalSpace().add(axis.scale(distance));
            this.setPositionWithLocalVector(tempV3);
        }
        else
        {
            this.computeWorldMatrix(true);// without this, the final call in a frame overwrites any other calls to translate
            this.setAbsolutePosition(this.getAbsolutePosition().add(axis.scale(distance)));
        }
    };
    
    BABYLON.Mesh.prototype.Rotate = function(axis, amount, space)
    {
        var tempV3 = axis.scale(NEO.toRADIANS*amount);
        if( space == NEO.Space.LOCAL )
        {
            this.rotation = this.rotation.add(tempV3);
        }
        else
        {
            var rotationToApply = BABYLON.Quaternion.RotationYawPitchRoll(tempV3.y, tempV3.x, tempV3.z);
            if( this.rotationQuaternion == null ) this.rotationQuaternion = new BABYLON.Quaternion(0,0,0,1);
            this.rotationQuaternion = rotationToApply.multiply(this.rotationQuaternion);
        }
    };
    
    BABYLON.Mesh.prototype.DrawAllAxis = function(scene, length, headLength, headWidth )
    {
        // this creates all three axis arrows and adds it to the mesh for th user
        
        if( length === undefined ) length = 5;
        if( headLength === undefined ) headLength = 2;
        if( headWidth === undefined ) headWidth = 1;
        this.DrawAxis(scene, new BABYLON.Vector3(1,0,0), length, new BABYLON.Color3(1,0,0), headLength, headWidth);
        this.DrawAxis(scene, new BABYLON.Vector3(0,1,0), length, new BABYLON.Color3(0,1,0), headLength, headWidth);
        this.DrawAxis(scene, new BABYLON.Vector3(0,0,1), length, new BABYLON.Color3(0,0,1), headLength, headWidth);
    };
    
    BABYLON.Mesh.prototype.DrawAxis = function(scene, dir, length, color, headLength, headWidth)
    {
        // create an arrow out of cube's and cylinders that faces in the direction specified in world space
        // then the user is free to attach to their mesh
        
        if( length === undefined ) length = 5;
        if( headLength === undefined ) headLength = 2;
        if( headWidth === undefined ) headWidth = 1;
        if( color === undefined ) color = new BABYLON.Color3(1,1,0); //yellow
        
        // create the arrow container for the line and head
        var arrow = new BABYLON.Mesh("axisArrow", scene);
        arrow.isVisible = false;
        
        // create the line
        var line = BABYLON.Mesh.CreateBox("arrowLine", 1, scene, true);
        var mat = new BABYLON.StandardMaterial("arrowColor", scene);
        mat.diffuseColor = color;
        mat.ambientColor = color;
        mat.emissiveColor = color;
        line.material = mat;
        line.scaling = new BABYLON.Vector3(.1,.1, length);
        
        // create the head
        var head = BABYLON.Mesh.CreateCylinder("arrowHead", headLength, 0, headWidth, 4, scene, true);
        head.material = mat;
        
        // set the head in position and rotation
        head.Rotate(NEO.Axis.X, -90, NEO.Space.WORLD);
        head.Translate(NEO.Axis.Z, ((length*.5) + (headLength*.5)), NEO.Space.WORLD);
        
        // parent the line and head to the arrow, then arrow to the mesh
        line.parent = arrow
        head.parent = arrow;        
        arrow.parent = this;
        
        // reset to zero locally after being parented so that we're facing straight ahead on z
        arrow.rotation = BABYLON.Vector3.Zero();        
        
        // deal with rotation locally
        if( NEO.Axis.X.equals(dir) )
        {    
            arrow.Translate(NEO.Axis.X, length*.5, NEO.Space.LOCAL);
            arrow.Rotate(NEO.Axis.Y, 90, NEO.Space.LOCAL);            
        }
        else if( NEO.Axis.Y.equals(dir) )
        {
            arrow.Translate(NEO.Axis.Y, length*.5, NEO.Space.LOCAL);
            arrow.Rotate(NEO.Axis.X, -90, NEO.Space.LOCAL);            
        }
        else if( NEO.Axis.Z.equals(dir) )
        {
            arrow.Translate(NEO.Axis.Z, length*.5, NEO.Space.LOCAL);
        }
    };
}
