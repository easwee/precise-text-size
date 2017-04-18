/**
 * Get precise text width and height from first to last non-empty pixel.
 *
 * @param {HTMLElement}
 * @param {Boolean}
 * @return {Object}
 */
function getPreciseTextSize(element) {
    var canvas  = document.createElement("canvas");
    var context = canvas.getContext("2d");
    var style   = window.getComputedStyle(element);

    var font = {
        size:   parseInt(style.fontSize),
        family: style.fontFamily,
        weight: style.fontWeight,
        style:  style.fontStyle
    };

    var boundary = {
        x: {
            first: null,
            last:  null
        },
        y: {
            first: null,
            last:  null
        }
    };

    context.font = font.style + " " + font.weight + " " + font.size + "px " + font.family;

    var text = element.textContent;
    var textSize = context.measureText(text);
    var spacing = font.size;

    canvas.width  = context.canvas.width  = textSize.width + spacing;
    canvas.height = context.canvas.height = font.size + spacing;

    context.font = font.style + " " + font.weight + " " + font.size + "px " + font.family;
    context.fillText(text, 0, font.size + spacing / 2);

    var data = context.getImageData(0, 0, canvas.width, canvas.height).data;

    for (var x = 0; x < canvas.width; x++) {
        for (var y = 0; y < canvas.height; y++) {
            var index = (x + (canvas.width * y)) * 4;

            if(data[index+3] > 0) {

                if(boundary.y.first === null || y < boundary.y.first) {
                    boundary.y.first = y;
                }

                if(boundary.x.first === null) {
                    boundary.x.first = x ;
                }

                boundary.x.last = x;

                if(boundary.y.last < y) {
                    boundary.y.last = y;
                }
            }
        }
    }

    var size = {
        width:          (boundary.x.last + 1) - boundary.x.first,
        height:         (boundary.y.last + 1) - boundary.y.first,
        initialKerning: boundary.x.first
    };

    return size;
}

/**
 * Export `getPreciseTextSize`.
 *
 * @type {Function}
 */

module.exports = getPreciseTextSize