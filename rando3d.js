var RANDO = {};
RANDO.Utils = {};


RANDO.Utils.subdivide = function(n, A, B){
    
    if (n<=0) return null;
    
    if (n==1) return A;

    if (n==2) return [A,B];
    
    if (n>=3) {
        var dx = (A.x+B.x)/(n-1);
        var dy = (A.y+B.y)/(n-1);
        
        var x = A.x;
        var y = A.y;
        
        var res = [];
        res.push(A);
        for (var i=0; i<n-2; i++){
            x += dx;
            y += dy;
            res.push({
                x : x,
                y : y 
            });
        }
        res.push(B);
        console.log(res);
        return res;
    } 
}

/**
 * createGrid() : create a grid of points for all type of quadrilateres, in particular
 *  these which are not square or rectangle.
 * 
 *      - A, B, C, D :  vertices of quadrilatere to subdivide
 *      - n_verti :     number of points in vertical size
 *      - n_horiz :     number of points in horizontal size
 * 
 * NB : * n_verti and n_horiz cannot be invert
 *      * the order of input points is also important, it determines 
 * the order of output points : 
 *  [A, ...., B,    -> first line
 *   ..........,
 *   C, ...., D]    -> last line
 * 
 * 
 * Example of quadrilatere :
 * A *------------------* B
 *   |                   \
 *   |                    \
 *   |                     \
 *   |                      \
 *   |                       \
 *   |                        \
 * C *-------------------------* D
 * 
 */
RANDO.Utils.createGrid = function(A, B, C, D, n_verti, n_horiz){
    if(!n_verti) return null;
    if(!n_horiz) return null;

    // subdivide both sides of the quad
    var east_side = RANDO.Utils.subdivide(n_verti, A, C);
    var west_side = RANDO.Utils.subdivide(n_verti, B, D);
    var grid = [];
    
    for (var j=0; j < n_verti-1; j++){
        // subidivide lines
        var line = RANDO.Utils.subdivide(east_side[j], west_side[j]);
        for (var i=0; i< n_horiz; i++){
            grid.push(line[i]);
        }
    }
    
    return grid;

}



