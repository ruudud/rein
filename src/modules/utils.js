(function(U, $){

    U.isInside = function(box, point) {
        if (point.y < box.y1 || point.y > box.y2) {
            return false;
        }
        else if (point.x < box.x1 || point.x > box.x2) {
            return false;
        }
        return true;
    };
 
}(REINMERKE.module('utils'), jQuery));
