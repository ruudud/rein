(function(P, $) {
    var _availableCuts, _circle, _ellipse;

    P.tjiehkie = function(ctx, startX, startY) { // a + b
        _circle(ctx, startX, startY, 20);
    };

    P.govre = function(ctx, startX, startY) { // c
        _ellipse(ctx, startX, startY, 15, 1.75);
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

    _ellipse = function(ctx, startX, startY, radius, scaleX, scaleY) {
        var ellipseX = scaleX || 1, ellipseY = scaleY || 1;
        ctx.save();
        ctx.beginPath();
        ctx.translate(startX - ellipseX, startY - ellipseY);
        ctx.scale(ellipseX || 1, ellipseY || 1);
        ctx.arc(1, 1, radius, 0, 2*Math.PI, false);

        ctx.restore();
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    };

    _circle = function(ctx, startX, startY, radius) {
        ctx.beginPath();
        ctx.arc(startX, startY, radius, (Math.PI/180)*0, (Math.PI/180)*360, false);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    };

    _availableCuts = {
        'a,b': P.tjiehkie,
        'c': P.govre,
        'g': P.saerkie
    };

}(REINMERKE.module('painter'), jQuery));
