(function(P, $) {
    var _availableCuts, _circle, _ellipse;

    P.tjiehkie = function(ctx, startX, startY) { // a + b
        var radius = 20;
        _circle(ctx, startX + radius, startY, radius);
        return radius * 2;
    };

    P.govre = function(ctx, startX, startY) { // c
        var radius = 15, scaleX = 1.75, padding = radius * scaleX;
        _ellipse(ctx, startX + padding, startY, 15, 1.75);
        return 2 * padding; 
    };

    P.voelese = function(ctx, startX, startY, downwards) { // d
        var nextY, ctrlY1, endPointX = 95;
        nextY = downwards ? startY + 40 : startY - 40;
        ctrlY1 = downwards ? startY + 10 : startY - 10;

        ctx.beginPath();
        ctx.moveTo(startX, startY);

        ctx.bezierCurveTo(startX - 1, nextY, startX + 55, ctrlY1, startX +
                          endPointX, startY);
        ctx.lineTo(startX, startY);

        ctx.stroke();
        ctx.fill();
        ctx.closePath();

        return endPointX;
    };


    P.saerkie = function(ctx, startX, startY, downwards) { // g
        var length = 20, nextY = downwards ? startY + 20 : startY - 20;

        ctx.beginPath();
        ctx.moveTo(startX, startY);

        ctx.lineTo(startX - 5, nextY);
        ctx.lineTo(startX + length, startY);
        ctx.lineTo(startX, startY);
        
        ctx.stroke();
        ctx.fill();
        ctx.closePath();

        return length;
    };

    P.raejkie = function(ctx, startX, startY, downwards, downRightPoint) { // k
        if (!downwards) {
            _circle(ctx, downRightPoint.x / 2, 10, 5);
        } else {
            _circle(ctx, downRightPoint.x / 2, downRightPoint.y - 10, 5);
        }

        return 0;
    };

    P.draw = function(cutModel, earPart) {
        var drawFunction, downRightPoint, ctx, startX, startY, offsetX,
            downwards, length = 0, spacing = 5;
        ctx = earPart.ctx;
        downRightPoint = earPart.downRightPoint;

        startX = 25;
        downwards = false;

        if (earPart.isFront()) {
            startY = 0;
            downwards = true;
        } else if (earPart.isBack()) {
            startY = downRightPoint.y;
        } else if (earPart.isSide()) {
            earPart.addText(cutModel.get('cutName'));
            return;
        }

        offsetX = earPart.canvasContentLength() || 5;

        drawFunction = _availableCuts[cutModel.get('cutType')];
        if (drawFunction) {
            length = drawFunction(ctx, startX + offsetX, startY, downwards, downRightPoint);
        } else {
            earPart.addText(cutModel.get('cutName'));
        }
        earPart.canvasContentLength(offsetX + length + spacing);
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
        'd': P.voelese,
        'g': P.saerkie,
        'k': P.raejkie 
    };

}(REINMERKE.module('painter'), jQuery));
