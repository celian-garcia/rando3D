var RANDO = {};
RANDO.Utils = {};


RANDO.Utils.interpol = function(A, B, n){
    var res = {
        x: 0,
        y: 0
    };
    
    if(n=0)
        return res;
        
    res.x = (B[0]-A[0])/2;
    
    return res;
    
}
