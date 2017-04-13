// returns precise string width - read comments to understand how and what
function getPreciseTextSize(targetId, debug) {
    var debug = debug || false;
    var firstX = null;
    var lastX = null;
    var firstY = null;
    var lastY = null;

    var el = document.getElementById(targetId);
    var style = window.getComputedStyle(el);
    var c = document.createElement("canvas");
    var ctx = c.getContext("2d");

    var font = {
        family: style.fontFamily,
        size: parseInt(style.fontSize),
        weight: style.fontWeight,
        style: style.fontStyle
    };

    var spacing = font.size;


    // uncomment next line to render canvas for debugging, we don't want to add canvas to dom and waste performance,
    // we just use canvas API, which has handy methods for text calculations, all is done in memory without dom manipulation
    if(debug) {
        document.body.appendChild(c);
    }

    ctx.font = font.style + " " + font.weight + " " + font.size + "px " + font.family;

    var text = el.textContent;
    var textSize = ctx.measureText(text);

    c.width = ctx.canvas.width = textSize.width + 2*spacing;
    c.height = ctx.canvas.height = font.size + 2*spacing;

    ctx.font = font.style + " " + font.weight + " " + font.size + "px " + font.family;
    ctx.fillText(text, 0, font.size + spacing);

    var data = ctx.getImageData(0, 0, c.width, c.height).data;

    for (var x = 0; x < c.width; x++) {
        for (var y = 0; y < c.height; y++) {
            var index = (x + (c.width * y)) * 4;

            if(data[index+3] > 0) {

                if(firstY === null || y < firstY) {
                    firstY = y;
                }

                if(firstX === null) {
                    firstX = x ;
                }

                lastX = x;

                if(lastY < y) {
                    lastY = y;
                }
            }
        }
    }

    return {
        width: (lastX+1) - firstX, // add one because zero based
        height: (lastY+1) - firstY,
        offset: firstX
    }
}