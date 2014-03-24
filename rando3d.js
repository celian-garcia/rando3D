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
