(function(P, $) {
    var rightBack, rightFront, rightSide, _availableCuts;


    P.tjiehkie = function(ctx, startX, startY) { // a + b
        ctx.beginPath();
        ctx.arc(startX, startY, 20, (Math.PI/180)*0, (Math.PI/180)*360, false);
        ctx.stroke();
        ctx.fill();
    };

    P.saerkie = function(ctx, startX, startY, downwards) { // g
        ctx.beginPath();

        ctx.moveTo(startX, startY);
        var nextY = downwards ? startY + 20 : startY - 20;

        ctx.lineTo(startX - 5, nextY);
        ctx.lineTo(startX + 20, startY);
        ctx.lineTo(startX, startY);
        
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    };

    P.draw = function(cutModel, earPart) {
        var drawFunction, downRightPoint, ctx, startX, startY, offsetX, downwards;
        ctx = earPart.ctx;
        downRightPoint = earPart.downRightPoint;

        startX = downRightPoint.x / 2;
        downwards = false;

        if (earPart.isFront()) {
            startY = 0;
            downwards = true;
        } else if (earPart.isBack()) {
            startY = downRightPoint.y;
        } else if (earPart.isSide()) {
            startY = downRightPoint.y / 2;
            startX = earPart.isRight() ? downRightPoint.x : 0;
        }

        offsetX = earPart.cuts.length * 50;

        drawFunction = _availableCuts[cutModel.get('cutType')];
        if (drawFunction) {
            drawFunction(ctx, startX + offsetX, startY, downwards);
        } else {
            earPart.addText(cutModel.get('cutName'));
        }
        return;
    };

    _availableCuts = {
        'a,b': P.tjiehkie,
        'g': P.saerkie
    };

}(REINMERKE.module('painter'), jQuery));
