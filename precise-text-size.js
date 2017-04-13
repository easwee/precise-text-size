function getPreciseTextSize(targetId, debug) {
    var debug = debug || false;
    var el = document.getElementById(targetId);
    var style = window.getComputedStyle(el);
    var c = document.createElement("canvas");
    var ct = c.getContext("2d");

    var font = {
        size:   parseInt(style.fontSize),
        family: style.fontFamily,
        weight: style.fontWeight,
        style:  style.fontStyle
    };

    var size = {
        x: {
            first: null,
            last: null
        },
        y: {
            first: null,
            last: null
        }
    };

    var spacing = font.size;

    if(debug) {
        document.body.appendChild(c);
    }

    ct.font = font.style + " " + font.weight + " " + font.size + "px " + font.family;

    var text = el.textContent;
    var textSize = ct.measureText(text);

    c.width  = ct.canvas.width = textSize.width + 2*spacing;
    c.height = ct.canvas.height = font.size + 2*spacing;

    ct.font = font.style + " " + font.weight + " " + font.size + "px " + font.family;
    ct.fillText(text, 0, font.size + spacing);

    var data = ct.getImageData(0, 0, c.width, c.height).data;

    for (var x = 0; x < c.width; x++) {
        for (var y = 0; y < c.height; y++) {
            var index = (x + (c.width * y)) * 4;

            if(data[index+3] > 0) {

                if(size.y.first === null || y < size.y.first) {
                    size.y.first = y;
                }

                if(size.x.first === null) {
                    size.x.first = x ;
                }

                size.x.last = x;

                if(size.y.last < y) {
                    size.y.last = y;
                }
            }
        }
    }

    return {
        width:  (size.x.last+1) - size.x.first,
        height: (size.y.last+1) - size.y.first,
        offset: size.x.first
    }
}