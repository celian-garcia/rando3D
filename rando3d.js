var RANDO = {};
RANDO.Utils = {};


RANDO.Utils.subdivide = function(n, A, B){
    
    if (!n) return {
        x : 0,
        y : 0
    };
    
    if (n==1) return A;

    if (n==2) return [A,B];
    
    if (n>=3) {
        var M = {
            x: (A.x+B.x)/2,
            y: (A.y+B.y)/2
        };
        return [A, M, B];
        
    } 
    return res;
    
}
