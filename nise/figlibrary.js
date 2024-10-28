/*
 Version:  20160119
 global js library used for Bishop and Dorf interatives
 
 G. Mason
 
 Log
 2016 01 15:   added #330099 as bookstyle linecolors4 
 2016 01 17:   added intergraph.inrange function    - G Mason
 2016 01 19:   added window.resize
 2016 01 19:  changed linecolor2 to  006600  (from 003300)   - G Mason
 2016 01 21:   updated window.resize so text size is a function of a canvas and not a div
 2016 01 24:   added intergraph.scaledformattedtext function     - G mason
 2016 01 26:   updated scaledrect to included optional width parameter
 2016 04 01:   updated documentation
 2016 04 26:   added custom up-down control that is dynamically added to all IE numeric inputs
 2016 05 19:   updated window.resize  removed loop that was doing nothing (originaly used to resize canvas)
 
 */


//------------------------------------------------------------
// --------- INTERACTIVE TEXT STYLE AND COLORS -------------------------
// ----------------------------------------------------------- 
// color pallet used by interactives.  These affect dynamic images only.  Colors on graph background must be changed in the interactive svg file.
var bookstyle =
        {
            linecolor0: "#999999", // grey used for leaders and markers
            linecolor1: "#3300FF", // blue,  used for root locus plots
            linecolor2: "#006600", // dark green
            linecolor3: "#CC0066", // dark pink
            linecolor4: "#330099", // purple
            textcolor1: "#575757", // dark grey
            textcolor2: "#660099", // dark purple
            textcolor3: "#0000CC", // blue
            hilitecolor1: "#FCFFB0", // yellow   
            figtext: "22px Times", // text on figures   drawformattedtext assumes this exact format
            figtextsm: "17px Times", // text on figures, small sized
            figpz: "22px Arial"  // poles and zeros on complex plane
        };


//------------------------------------------------------------
// --------- BROWSER SUPPORT FUNCTIONS -------------------------
// ----------------------------------------------------------- 

// handles rescaling of canvas and font size when window is resized
window.onresize = function () {
    var ctrl = document.querySelectorAll("canvas");  // get the canvas
 //   var i;
 //   var n = ctrl.length;
    var r;
 //   var t;
 //   for (i = 0; i < n; i++) {
 //       r = ctrl[i].getAttribute("height") / ctrl[i].getAttribute("width");  // the default ratio from the canvas
 //       t = ctrl[i].offsetWidth * r + "px";  // keep the ratio the same, but size is based on item width    
 //       set the height based on t, but the browser seems to be doing this automatically  
 //   }

    // calculate text size, in em, as a ratio of em
    r = ctrl[0].offsetWidth / ctrl[0].getAttribute("width") * 1.30;  // *** Change scale (1.3) to make figure font larger

    // bound the sizes
    if (r > 1)// maximum size.
        r = 1;
    if (r < 0.6)// minimum size
        r = 0.6;
    // update the font size for the interactive
    document.getElementById("container").style.fontSize = r + "em";  // #container is entire interactive
};


//  cross browser hacks
//
//prevent default event behavior on events
var CB_prevDefault = function (event) {
    if (window.event)
    {
        window.event.returnValue = false;
    }
    else if (event.preventDefault)
    {
        event.preventDefault();
    }
    else
    {
        event.returnValue = false;
    }
};

// hack to handle FireFox missing offsetX
function firefoxhook() {

    var evt = document.createEvent('MouseEvent');
    if (evt.offsetX === void 0) {
        Object.defineProperties(MouseEvent.prototype, {
            'offsetX': {
                get: function () {

                    var el = this.target;
                    var x = 0;
                    while (el.offsetParent)
                    {
                        x += el.offsetLeft;
                        el = el.offsetParent;
                    }
                    return this.pageX - x;

                    //  return this.layerX - this.target.offsetLeft;
                }
            }
            , 'offsetY': {
                get: function () {

                    var el = this.target;
                    var y = 0;
                    while (el.offsetParent)
                    {
                        y += el.offsetTop;
                        el = el.offsetParent;
                    }
                    return this.pageY - y;
                }
            }
        });
    }
}

// --------------------------------------
//  Hack to add up down controls to IE input
// ---------------------------------------

// from codepen.io/gapcode/pen/vEJNZN
function detectIE() {
    var ua = window.navigator.userAgent;

    // Test values; Uncomment to check result …

    // IE 10
    // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

    // IE 11
    // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

    // IE 12 / Spartan
    // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

    // Edge (IE 12+)
    // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        // Edge (IE 12+) => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}

/* Description:  Scans the DOM and appends an up-down control to every numeric input element
 *  <div class="updowncontrol">
 *  <span style="position:relative; top:0.1em; cursor:pointer; user-select: none; -ms-user-select: none; " onclick="doupdownchange(1,this);">&#160;&#9652;</span>
 *  <br/>
 *  <span style="user-select: none; -ms-user-select: none; cursor:pointer; position:relative; bottom:0.1em;" onclick="doupdownchange(-1,this);">&#160;&#9662;</span>';
 *  </div>
 * 
 * @returns {undefined}
 */
function addupdowncontrols() {
    var para;
    var node;
    var inputlist;
    var n, i;

    inputlist = document.getElementsByTagName("input");
    n = inputlist.length;
    for (i = 0; i < n; i++) {
        if (inputlist[i].getAttribute("type") === "number") {
            para = document.createElement("div");
            para.setAttribute("class", "updowncontrol");
            para.innerHTML = '<span style="position:relative; top:0.1em; cursor:pointer; user-select: none; -ms-user-select: none; " onclick="doupdownchange(1,this);">&#160;&#9652;</span><br/><span style="user-select: none; -ms-user-select: none; cursor:pointer; position:relative; bottom:0.1em;" onclick="doupdownchange(-1,this);">&#160;&#9662;</span>';

            node = inputlist[i].nextSibling;
            inputlist[i].parentNode.insertBefore(para, node);
        }
    }

}

/* Description: handles when user clicks up or down button on custon up-down control
 * 
 * @param {Number} direction   1 = UP,  -1 = DOWN
 * @param {object} me  object that was pressed
 * @returns {undefined}
 */
function doupdownchange(direction, me) {
    var item = me.parentElement.previousElementSibling; // get the input element
    var step = Number(item.getAttribute("step"));       // step size 
    var limit;

    // change the input numeric value up or down
    var val = Number(item.value);
    if (direction == 1) {
        val += step;
        limit = Number(item.getAttribute("max"));
        if (val > limit)
            val = limit;
    } else {
        val -= step;
        limit = Number(item.getAttribute("min"));
        if (limit > val)
            val = limit;
    }
    // format and output the value then force an update of the numeric element
    item.value = val.toPrecision(3);
    item.oninput();
}



// ------------------------------------------
//  Called in the window.onload() function of the interactive.
//  Place common startup actions here
// ------------------------------------------
function initializecontrols() {
    
    // if IE add custom up-down controls
    if (detectIE()) {
        addupdowncontrols();
    }
    return;
}
;

//------------------------------------------------------------
// --------- GRAPHING BUFFER LIBRARY -------------------------
// ----------------------------------------------------------- 
/*   Class for drawing a buffered graph
 * 
 *   Creates a background canvas that buffers all of the drawing commands.  Once drawing is completed the entire
 *   buffer is copied to the canvas. This is a common double buffer technique to speed graphing and reduce flicker
 *   The buffer can be used to smooth animation or for layering graphics.  This class provides commands that make it easy
 *   to draw graphs with different scaling and clipping area.
 *   
 *
 *  Example:
 
 * // call once in window.onload()
 * graphrl = new intergraph(document.getElementById("graph"),  // graphrl is the buffer element.  "graph" is the HTML canvas element shown on the page
 * {'left': 66, 'top': 6, 'width': 509, 'height': 397,         // this specifies the region, in pixels, where the graph is located
 * 'xmin': -40, 'xmax': 20, 'ymin': -20, 'ymax': 20,           // this is the scaling for the graphing region
 * 'bkgnd': bkgndimg,                                           // the background image. This should be the same size as the canvas
 *                                                             // it can contain an static elements in the interactive
 *                                                             // the graphing region, specified above, maps to an area on this image
 * 'onmove': onmove, 'ondown': ondown, 'onup': onup});         // optional call-backs to handle mouse movements
 *
 *  // do some drawings
 *  // redraw the background graphics
 *  graphrl.drawbackground()       // draw the bkgndimg into the buffer and set the clipping region for the graph
 * 
 * // draw a scaled line - the scaling is set when you create the buffer
 * graphr1.begin();             // start a polygon
 * graphrl.scaledmoveto(0,0);
 * graphrl.scaledlineto(10,10);
 * graphr1.stroke();            // draw the polygon to the  buffer
 * 
 * // transfer the buffer to the canvas
 * graphrl.refresh()
 * 
 *
 */



/*
 *   DESCRIPTION: Create the graphing buffer and set the background, scaling and clipping
 *          Note:  To access the buffer directly use member variable   .context
 *                 To access the html canvas context use variable      .itemcontext   Typically this is not done.
 *                 The preferred method is to draw to .context and the move overyting to .itemcontext with refresh()
 *   
 *   
 *   PARAMETERS:
 *     item = dom object to draw to - a Canvas object from the HTML
 *     params list of parameters
 *        {'left':#, 'top':#, 'width':#, 'height':#,  // area of the bkgnd image where the graph is located, drawing objects are clipped to this region
 *         'xmin':#, 'xmax':#, 'ymin':#, 'ymax':#,    // min and max values for the scaled graphing area
 *         'bkgnd': anImage        ,                  // this should be the same size as the canvas item.  Typicall is has the graph grid, labels and legend.  
 *         'ondown':function, 'onup':function, 'onmove':function }  // optional call back functions if the mouse if pressed or moved in the canvas
 *      
 *      callback form  
 *          function ondown(x,y){ // code };
 *          function onup() {// code};  
 *          funtion onmove(x,y) {// code};
 *        where x,y are scaled values from the graph
 *        
 *    RETURN:  a graphing buffer object
 */
function intergraph(item, params) {
    this.background = params.bkgnd;
    this.leftedge = params.left;     // width in pixels of left and bottom edges
    this.topedge = params.top;
    this.item = item;   // the dom item
    this.itemcontext = item.getContext('2d');

    // create a buffer to draw the graph to
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.canvas.width = item.width;
    this.canvas.height = item.height;
    this.context.save();

    // calculate the scaling
    // scaling is
    // pixels  = this.scale * value + this.offset;
    this.width = params.width;
    this.height = params.height;
    this.xmin = params.xmin;
    this.xmax = params.xmax;
    this.ymin = params.ymin;
    this.ymax = params.ymax;
    this.xscale = (this.width) / (this.xmax - this.xmin); //scale;
    this.yscale = (this.height) / (this.ymax - this.ymin);
    this.xoffset = -this.xscale * this.xmin + this.leftedge; //xo;
    this.yoffset = (this.height + this.topedge) + this.yscale * this.ymin; // yo;

    //
    // this.log2 = Math.log(2);     .// used in code for live axis drawing.  That code has been commented out
    // this.log10 = Math.log(10);

    // call back functions
    this.onmove = params.onmove;
    this.ondown = params.ondown;
    this.onup = params.onup;
    item.me = this;

    // attach touch and mouse listners if the function exists
    if (params.onmove !== undefined) {

        item.addEventListener('touchmove', function (event) {
            CB_prevDefault(event); //  event.preventDefault();
            var canvas = this;
            var x = (event.touches[0].pageX - event.target.offsetLeft - event.target.offsetParent.offsetLeft - event.target.offsetParent.offsetParent.offsetLeft) * canvas.width / event.currentTarget.clientWidth;
            var y = (event.touches[0].pageY - event.target.offsetTop - event.target.offsetParent.offsetTop - event.target.offsetParent.offsetParent.offsetTop) * canvas.height / event.currentTarget.clientHeight;
            var xy = this.me.unscalexy({x: x, y: y});
            this.me.onmove(xy.x, xy.y);
        });

        item.addEventListener('mousemove', function (eventData) {
            CB_prevDefault(eventData); //   event.preventDefault();
            var canvas = this;
            var x = eventData.offsetX * canvas.width / eventData.currentTarget.clientWidth;
            var y = eventData.offsetY * canvas.height / eventData.currentTarget.clientHeight;
            var xy = this.me.unscalexy({x: x, y: y});
            this.me.onmove(xy.x, xy.y);

        }, false);
    }

    if (params.ondown !== undefined) {
        // attach handlers 
        item.addEventListener('touchstart', function (event) {
            CB_prevDefault(event); // event.preventDefault();
            var canvas = this; // document.getElementById("graph");
            var x = (event.touches[0].pageX - event.target.offsetLeft - event.target.offsetParent.offsetLeft - event.target.offsetParent.offsetParent.offsetLeft) * canvas.width / event.currentTarget.clientWidth;
            var y = (event.touches[0].pageY - event.target.offsetTop - event.target.offsetParent.offsetTop - event.target.offsetParent.offsetParent.offsetTop) * canvas.height / event.currentTarget.clientHeight;
            var xy = this.me.unscalexy({x: x, y: y});
            this.me.ondown(xy.x, xy.y);
        }, false);

        item.addEventListener('mousedown', function (event) {
            CB_prevDefault(event); //   event.preventDefault();
            var canvas = this;
            //var ctx = canvas.getContext("2d");
            var x = event.offsetX * canvas.width / event.currentTarget.clientWidth;
            var y = event.offsetY * canvas.height / event.currentTarget.clientHeight;
            var xy = this.me.unscalexy({x: x, y: y});
            this.me.ondown(xy.x, xy.y);
        }, false);

    }

    if (params.onup !== undefined) {
        item.addEventListener('mouseup', function (event) {
            CB_prevDefault(event); //  event.preventDefault();
            this.me.onup();
        }, false);

        item.addEventListener('touchend', function (event) {
            CB_prevDefault(event); //  event.preventDefault();
            this.me.onup();
        });
    }

}


/* DESCRIPTION: check to see if x,y is within the graphing area
 * 
 * @param {double} x coordinate of a point in graph coordinates
 * @param {double} y coordinate of a point in graph coordinates
 * @returns {Boolean} true if the point is within the buffer clipping (graphing) region
 */
intergraph.prototype.inrange = function (x, y) {

    if (x < this.xmin)
        return false;
    if (x > this.xmax)
        return false;
    if (y < this.ymin)
        return false;
    if (y > this.ymax)
        return false;
    return true;
};


/* DESCRIPTION:  Provide an approximate scaling from pixels (canvas units) to graph coordinates
 // this assumes equal distance in x and y directions
 * 
 * @param {Number} px pixel length
 * @returns {Number} approximate graph units
 */
intergraph.prototype.distfrompx = function (px) {

    var xy = this.unscalexy({x: 0.707 * px + this.xoffset, y: 0.707 * px + this.yoffset});
    return (Math.sqrt(xy.x * xy.x + xy.y * xy.y));
};


/* DESCRIPTION: get ASCII code for superscripts numerals
 * 
 * @param {Number} num a value 0 to 9
 * @returns {String} the corresponding superscript character
 */
intergraph.prototype.superscript = function (num) {
    if (num < 4)
        return String.fromCharCode(176 + num);
    return String.fromCharCode(8304 + num);
};



/* DESCRIPTION: Sets the line type for successive drawing commands to the buffer
 * 
 * @param {numNumberber} width  in pixels (canvas units)
 * @param {String} color  as HEX or any compatible HTML Canvas color
 * @param {String} dash  Optional -  compatible HTML Canvas dash string, not supported in all browsers,  Example [10,5]  10 solid, 5 blank repeat
 * @returns {undefined}
 */
intergraph.prototype.setlinetype = function (width, color, dash) {
    this.context.strokeStyle = color;
    this.context.lineWidth = width;
    if (dash !== undefined) {
        if (this.context.setLineDash !== undefined)  // limited IE support
            this.context.setLineDash(dash);
    }
};


/* DESCRIPTION: change the graph area scaling. This has limited usefullness if the background image holds the axis image and is not used in the Bishop/Dorf project
 * 
 * @param {Number} xmin
 * @param {Number} xmax
 * @param {Number} ymin
 * @param {Number} ymax
 * @returns {undefined}
 */
intergraph.prototype.rescale = function (xmin, xmax, ymin, ymax) {
    this.xmin = xmin;
    this.xmax = xmax;
    this.ymin = ymin;
    this.ymax = ymax;
    this.xscale = (this.width) / (xmax - xmin); //scale;
    this.yscale = (this.height) / (ymax - ymin);
    this.xoffset = -this.xscale * xmin + this.leftedge; //xo;
    this.yoffset = (this.height + this.topedge) + this.yscale * ymin; // yo;
};


/* DESCRIPTION: convert an point from scaled x,y value (graph units) to pixel values (x,y)
 * 
 * @param {Point} {x.#,  y.#} in graph units
 * @returns {Point} {x.#,  y.#}  in pixel (canvas) units
 */
intergraph.prototype.scalexy = function (xy) {
    // data to graph (pixel) coordinates
    return {x: xy.x * this.xscale + this.xoffset,
        y: -xy.y * this.yscale + this.yoffset};
};


/* DESCRIPTION: ccnvertt a point from pixels (canvas units) to graph units
 * 
 * @param {Point} {x.#,  y.#} in pixel (canvas) units
 * @returns {Point} {x.#,  y.#}  in graph units
 */
intergraph.prototype.unscalexy = function (xy) {

    return {x: (xy.x - this.xoffset) / this.xscale,
        y: -(xy.y - this.yoffset) / this.yscale};
};


/* DESCRIPTION: draws text at the graph locations.  Uses current context setting for text positioning.  
 * For example to set the baseline, call   mygraphbuffer.context.textBaseline("Top")
 * 
 * @param {Number} x location for text, in graph units
 * @param {Number} y location for text, in graph units
 * @param {String} fontstyle any HTML Canvas font style
 * @param {String} text text to be drawn
 * @returns {undefined}
 */
intergraph.prototype.scaleddrawtext = function (x, y, fontstyle, thetext) {
    var sx = this.xscale * x + this.xoffset;
    var sy = -this.yscale * y + this.yoffset;
    this.context.font = fontstyle;
    this.context.fillText(thetext, sx, sy);
};



/* DESCRIPTION: draws formatted text at the graph locations.  Uses current context setting for text positioning.  
 * For example to set the baseline, call   mygraphbuffer.context.textBaseline("Top")
 * 
 * @param {Number} x location for text, in graph units 
 * @param {Number} y location for text, in graph units
 * @param {String} fontstyle as ##px Face    format must be exact
 * @param {String} Warning.  This function is not robust with respect to fomatting of parameters!
 * formatting code
 *  |#$ = change in formatting
 *    # :  space = normal font
 *         i = italic
 *    $ : _ = subscript
 *        ^ = superscript
 *        space = normal
 * Example  s^2 + 4s + 10    send as   |i s| _2|  + 4|i s|  + 10
 *  
 * @param {Boolean} (optional) place white behind text
 * @returns {undefined}
 */
intergraph.prototype.scaledformattedtext = function (ux, uy, font, text, clearbkgnd) {
    var currx = this.xscale * ux + this.xoffset;
    var y = -this.yscale * uy + this.yoffset;
    var i;
    var thetext;
    var fontsmall = Math.floor(Number(font.substring(0, 2)) * 0.75) + "px" + font.substring(4);  // assumes exact format for font string
    var currfont;
    var texta = text.split("|");  // text array split at |
    var n = texta.length;
    var temp;

    this.context.font = font;
    var bkwidth = this.context.measureText(text).width - this.context.measureText("| i").width * (n - 1);
    var bkheight = Number(font.substring(0, 2)) * 1.2;

    if (clearbkgnd === true) {
        temp = this.context.fillStyle;
        this.context.fillStyle = "#FFFFFF";
        this.context.fillRect(currx, y - bkheight / 2, bkwidth, bkheight);
        this.context.fillStyle = temp;
    }

    this.context.font = font;

    for (i = 0; i < n; i++) {
        this.context.font = font;

        thetext = texta[i].substring(2);

        // check second format character for positioning     
        if (texta[i][1] === '_') {
            // subscript          
            this.context.textBaseline = "hanging";
            currfont = fontsmall;
        } else if (texta[i][1] === '^') {
            // subscript 
            this.context.textBaseline = "alphabetic";
            currfont = fontsmall;
        } else {
            this.context.textBaseline = "middle";
            currfont = font;
        }

        // check first format character
        if (texta[i][0] === 'i') {
            this.context.font = "italic " + currfont;
        } else {
            this.context.font = currfont;
        }

        this.context.fillText(thetext, currx, y);
        currx += this.context.measureText(thetext).width;
    }
}


/* DESCRIPTION: performs Canvas  moveTo using graph coordinates
 * 
 * @param {Number} x coordinate in graph units
 * @param {Number} y coordinate in graph units
 * @returns {undefined}
 */
intergraph.prototype.scaledmoveto = function (x, y) {
    var sx = this.xscale * x + this.xoffset;
    var sy = -this.yscale * y + this.yoffset;
    if (sx > 32000)
        sx = 32000;
    if (sy > 32000)
        sy = 32000;
    if (sx < -32000)
        sx = -32000;
    if (sy < -32000)
        sy = -32000;
    this.context.moveTo(sx, sy);
};


/* DESCRIPTION: raw a rectangle centered at scaled location x,y 
 * 
 * @param {Number} x location of center of rectangle in graph units
 * @param {Number} y location of center of rectangle in graph units
 * @param {Number} s width of rectangle in pixels, if h is not provided h = s
 * @param {Number} h (optional) height of rectangle in pixels
 * @returns {undefined}
 */
intergraph.prototype.scaledrect = function (x, y, s, h) {

    var sx = this.xscale * x + this.xoffset;
    var sy = -this.yscale * y + this.yoffset;
    if (sx > 32000)
        sx = 32000;
    if (sy > 32000)
        sy = 32000;
    if (sx < -32000)
        sx = -32000;
    if (sy < -32000)
        sy = -32000;
    s = s / 2;
    if (h === undefined) {
        this.context.fillRect(sx - s, sy - s, 2 * s, 2 * s);
    } else {
        h = h / 2;
        this.context.fillRect(sx - s, sy - h, 2 * s, 2 * h);
    }
};

/* DESCRIPTION: performs Canvas  lineTo using graph coordinates
 * 
 * @param {Number} x coordinate in graph units
 * @param {Number} y coordinate in graph units
 * @returns {undefined}
 */
intergraph.prototype.scaledlineto = function (x, y) {
    var sx = this.xscale * x + this.xoffset;
    var sy = -this.yscale * y + this.yoffset;
    if (sx > 32000)
        sx = 32000;
    if (sy > 32000)
        sy = 32000;
    if (sx < -32000)
        sx = -32000;
    if (sy < -32000)
        sy = -32000;
    this.context.lineTo(sx, sy);
};

/* DESCRIPTION: use draw a line segment created with moveto and lineto
 *  provides same functionality as HTML Canvas Stroke()
 * 
 * @returns {undefined}
 */
intergraph.prototype.stroke = function () {
    this.context.stroke();
};

/* DESCRIPTION: use begin a line segment created with moveto and lineto
 *  provides same functionality as HTML Canvas Begin()
 * 
 * @returns {undefined}
 */
intergraph.prototype.begin = function () {
    this.context.beginPath();
};


/* DESCRIPTION:  clear the entire buffer.  This create a transparant background.  If you refresh the canvas with 
 *  transparant pieces, that part of the canvas will not be overwritten
 * 
 * @returns {undefined}
 */
intergraph.prototype.clear = function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};


/* DESCRIPTION: draws the background on the buffer and sets the clipping region inside of the graph area
 * 
 * @returns {undefined}
 */
intergraph.prototype.drawbackground = function () {
    // reset the clipping region to so can draw the entire background image
    this.context.restore();
    this.context.save();
    this.context.drawImage(this.background, 0, 0);


    // set the clipping region outside of the graph area
    this.context.beginPath();
    this.context.rect(this.leftedge, this.topedge, this.width, this.height);
    this.context.clip();

};


/* DESCRIPTION: copies an image to the buffer.  This function first resets the clipping region so you can draw 
 *  outside of the graphing area. 
 * 
 * @param {Image} image to draw onto the buffer
 * @param {Number} x location in pixels
 * @param {Number} y location in pixels
 * @returns {undefined}
 */
intergraph.prototype.drawimage = function (img, x, y) {
    // redraws the background and sets the clipping region insize of the graph area
    this.context.restore();
    this.context.save();

    if (x === undefined)
        x = 0;
    if (y === undefined)
        y = 0;
    this.context.drawImage(img, x, y);

    // set the clipping region outside of the graph area
    this.context.beginPath();
    this.context.rect(this.leftedge, this.topedge, this.width, this.height);
    this.context.clip();

};

/* DESCRIPTION: copies the buffer to the canvas so it is displayed in the browser
 * 
 * @returns {undefined}
 */
intergraph.prototype.refresh = function () {
    //this.context.restore();

    this.itemcontext.drawImage(this.canvas, 0, 0);
};

/*
 * consider joining into graphbuffer
 function drawarrow(x, y, t, ctx, h) {
 var a = 0.3;
 //var h = 55;
 
 // ctx.save();
 // draws an arrow at location x,y oriented at ang
 // ctx.fillStyle='#DDD';
 ctx.beginPath();
 //ctx.moveTo(x- h*Math.cos(t-a),y-h*Math.sin(t-a));
 ctx.moveTo(x, y);
 ctx.lineTo(x - h * Math.cos(t + a), y - h * Math.sin(t + a));
 ctx.quadraticCurveTo(x - 0.8 * h * Math.cos(t), y - 0.8 * h * Math.sin(t), x - h * Math.cos(t - a), y - h * Math.sin(t - a));
 ctx.closePath();
 ctx.fill();
 }*/





//------------------------------------------------------------
// --------- DEQ LIBRARY ------------------------------------
// -----------------------------------------------------------
/*  Functions for solving DEQ in form of transfer function
 *  the method uses fixed time step and RK45
 * 
 */

/* DESCRIPTION:  numerical simulation of system in transfer function form for a specified input
 *    Example:  simulate   (s+3)/(s^2 + 6s+ 9)  for input U(x) = sin(x)
 *    
 *    y = solvedeq([0,1,3],[1,6,9],0.01, 10, function(x) { return Math.sin(x);});
 *    upon return y = [ {x:0, y:#},{x:0.01, y:#}, ... }  where # is the value from the simulation
 * 
 * @param {Array} num  array of coefficient for numerator,  s^2 + 5s + 10 = [1,5,10].  the array must be the same order as den, pad with leadingg zeros as needed
 * @param {Array} den  array of coefficient for denominator,  s^2 + 5s + 10 = [1,5,10].
 * @param {Number} dx  step size used in simulation.  Must choose dt small enough for accurate simulation
 * @param {Number} xfinal  final value for simulation,  x_initial is assumed =0
 * @param {Function} f  the input function.  function (x) { return  input value};
 * @param {Array} state (Optional) values from RK45 states at end of simulation,  { z:[#, #, #], x:#}.  There is one z element for each order 
 *                      of the system.  state can be used to resume the simulation from where it left off.
 * @returns {Array} array holding simulation values [ {x:#, y:#}, {x:#, y:#}, ...]
 *             
 *                          
 */
function solvedeq(b, a, dt, tfinal, f, state) {
    //    NOTE change in independent variable.  code uses t as the independent variable but returns array with "x" as independent variable     
    //         documentation uses consistent notation
    // a = den   num and den must be of same size   num = s^2 + 5s + 10 = [1,5,10]
    // b = num
    //  f = f(t)
    //  state = initial state and initial time.  returns with final state and time
    //       state = { z:[#, #, #], x:#}
    // returns   [ {x:#, y:#}, {x:#, y:#}, ...]
    // NOTE change in independent variable.  code uses t as the independent variable but returns
    // array wiht "x" as independent variable

    var n = a.length - 1;  // order of system
    var t;
    var i, j;    // counter
    var k1 = [];
    var k2 = [];
    var k3 = [];
    var k4 = [];
    var z = [];
    var t = [];
    var y = [];
    var tinitial = 0;
    var sum;

    // initialize states for RK45
    for (i = 0; i < n; i++) {
        k1[i] = 0;
        k2[i] = 0;
        k3[i] = 0;
        k4[i] = 0;
        z[i] = 0;
    }
    var ft = 0;

    // initial states provided so set them
    if (state !== undefined) {
        for (i = 0; i < n; i++) {
            z[i] = state.z[i];
        }
        tinitial = state.x;

        if (tfinal === 0) {
            tfinal = tinitial + 0.9 * dt; // single step,  0.9 to make sure the loop goes through only once
        }
    }

    //// divide out the direct feed through term
    if (b[0] !== 0) {  // order of numerator is same as denominator
        // recalculate 
        ft = b[0] / a[0];
        b[0] = 0;
        for (i = 1; i <= n; i++) {
            b[i] = b[i] - ft * a[i];
        }
    }

    // calculate  y
    sum = 0;
    for (i = 0; i < n; i++) {
        sum = sum + z[i] * b[n - i];
    }

    sum += f(tinitial) * ft;

    y[0] = {x: tinitial, y: sum};

    j = 1;
    for (t = tinitial; t < tfinal; t += dt) {
        // propogate from   n*dt to  steps*dt by dy

        // there are n states  0 to n-1
        // propogate the states
        //  -----  k1's -----
        for (i = 0; i < n - 1; i++) {
            k1[i] = dt * z[i + 1];
        }
        //  k1 for last z
        // dirft = this.input.f.call(this.input, pt);  // temp storage for input
        k1[n - 1] = f(t); // call the y() from the input context using the input context

        for (i = 0; i < n; i++) {
            k1[n - 1] = k1[n - 1] - a[n - i] * z[i];
        }
        k1[n - 1] = dt * k1[n - 1] / a[0];
        // -----  k2's -----
        for (i = 0; i < n - 1; i++) {
            k2[i] = dt * (z[i + 1] + k1[i + 1] / 2);
        }
        // k2 for last z
        k2[n - 1] = f(t + dt / 2);
        for (i = 0; i < n; i++) {
            k2[n - 1] = k2[n - 1] - a[n - i] * (z[i] + k1[i] / 2);
        }
        k2[n - 1] = dt * k2[n - 1] / a[0];
        // -----  k3's -----
        for (i = 0; i < n - 1; i++) {
            k3[i] = dt * (z[i + 1] + k2[i + 1] / 2);
        }

        // k3 for last z
        k3[n - 1] = f(t + dt / 2);
        for (i = 0; i < n; i++) {
            k3[n - 1] = k3[n - 1] - a[n - i] * (z[i] + k2[i] / 2);
        }
        k3[n - 1] = dt * k3[n - 1] / a[0];
        // -----  k4's -----
        for (i = 0; i < n - 1; i++) {
            k4[i] = dt * (z[i + 1] + k3[i + 1]);
        }

        // k4 for last z
        k4[n - 1] = f(t + dt);
        for (i = 0; i < n; i++) {
            k4[n - 1] = k4[n - 1] - a[n - i] * (z[i] + k3[i]);
        }
        k4[n - 1] = dt * k4[n - 1] / a[0];
        // propogate the z's
        for (i = 0; i < n; i++) {
            z[i] = z[i] + (k1[i] + 2.0 * k2[i] + 2.0 * k3[i] + k4[i]) / 6.0;
        }

        // calculate  y
        sum = 0;
        for (i = 0; i < n; i++) {
            sum = sum + z[i] * b[n - i];
        }

        sum += f(t + dt) * ft;

        y[j] = {x: t + dt, y: sum};
        j++;
    }
    // pass back the final state if its requested
    if (state !== undefined) {
        for (i = 0; i < n; i++) {
            state.z[i] = z[i];
        }
        state.x = y[j - 1].x;
    }
    return y;
}



/* DESCRIPTION:  numerical eimulation of system described by state space form.  Simulation is restricted to SISO systems
 *     Example:  simulate   dy/dz =  Az + Bu,  y = Cz + Du
 *       where A,B,C are system matrices
 *    
 *    y = solvedeq([[1,0],[0,2]],[0,1], [1 1], [0] ,0.01, 10, function(x) { return Math.sin(x);});
 *    upon return y = [ {x:0, y:#},{x:0.01, y:#}, ... }  where # is the value from the simulation
 * 
 * @param {Matrix} A   2D array of values for A matrix
 * @param {Array} B    1D array of values for B matrix,  enter as [#,#,#,...]  Assumes its a column
 * @param {Array} C    1D array of values for C matrix
 * @param {Number} D   value for D matrix, must be scalar since system is SISO
 * @param {Number} dx  increment used in simulation.  Must be small enough to ensure accurate simulation
 * @param {Number} xfinal  final value for simulation,  x_initial is assumed =0
 * @param {Function} f  the input function.  function (x) { return  input value};
 * @param {Array} state (Optional) values from RK45 states at end of simulation,  { z:[#, #, #], x:#}.  There is one z element for each order 
 *                      of the system.  state can be used to resume the simulation from where it left off.
 * @returns {Array} array holding simulation values [ {x:#, y:#}, {x:#, y:#}, ...]
 *             
 */

//       solvess(A, B, C, D, dx, xfinal, f, state)    // note parameter name change from documentation to implementation
function solvess(A, B, C, D, dt, tfinal, f, state) {
// A = [[row 0], [row 2] ,...]   A must be square
// B = [# ,#, #...]
// system must be SISO   -- modify y output is this must be changed

    var n = A[0].length; // order of system
    var t;
    var i, j; // counter
    var r, c;
    var k1 = [];
    var k2 = [];
    var k3 = [];
    var k4 = [];
    var z = [];
    var t = [];
    var y = [];
    var tinitial = 0;
    var sum;
    // initialize states
    for (i = 0; i < n; i++) {
        k1[i] = 0;
        k2[i] = 0;
        k3[i] = 0;
        k4[i] = 0;
        z[i] = 0;
    }

    if (state !== undefined) {
        for (i = 0; i < n; i++) {
            z[i] = state.z[i];
        }
        tinitial = state.x;
        if (tfinal === 0) {
            tfinal = tinitial + 0.9 * dt;
        }
    }

    // calculate  y
    sum = 0;
    for (r = 0; r < n; r++) {
        sum = sum + z[r] * C[r];
    }

    sum += f(t) * D;
    y[0] = {x: tinitial, y: sum};


    j = 1;
    for (t = tinitial; t < tfinal; t += dt) {
// propogate from   n*dt to  steps*dt by dy

// there are n states  0 to n-1
// propogate the states
//  -----  k1's -----
        for (r = 0; r < n; r++) {
            k1[r] = B[r] * f(t);
            for (c = 0; c < n; c++) {
                k1[r] = k1[r] + A[r][c] * z[c];
            }
            k1[r] = k1[r] * dt;
        }

// -----  k2's -----
        for (r = 0; r < n; r++) {
            k2[r] = B[r] * f(t + dt / 2);
            for (c = 0; c < n; c++) {
                k2[r] = k2[r] + A[r][c] * (z[c] + k1[c] / 2);
            }
            k2[r] = k2[r] * dt;
        }

// -----  k3's -----
        for (r = 0; r < n; r++) {
            k3[r] = B[r] * f(t + dt / 2);
            for (c = 0; c < n; c++) {
                k3[r] = k3[r] + A[r][c] * (z[c] + k2[c] / 2);
            }
            k3[r] = k3[r] * dt;
        }

// -----  k4's -----
        for (r = 0; r < n; r++) {
            k4[r] = B[r] * f(t + dt);
            for (c = 0; c < n; c++) {
                k4[r] = k4[r] + A[r][c] * (z[c] + k3[c]);
            }
            k4[r] = k4[r] * dt;
        }

// propogate the z's
        for (r = 0; r < n; r++) {
            z[r] = z[r] + (k1[r] + 2.0 * k2[r] + 2.0 * k3[r] + k4[r]) / 6.0;
        }

// calculate  y
        sum = 0;
        for (r = 0; r < n; r++) {
            sum = sum + z[r] * C[r];
        }

        sum += f(t) * D;
        y[j] = {x: t + dt, y: sum};
        j++;
    }
    if (state !== undefined) {
        for (i = 0; i < n; i++) {
            state.z[i] = z[i];
        }
        state.x = y[j - 1].x;
    }
    return y;
}




// ------------------------------------
//  ------  INTERPOLATION LIBRARY  ----
// ------------------------------------
// 

/* DESCRIPTION: finds the interpolated value of k from the curvedata that matches x,y near curve, idc, and segment idx. 
 * To use this function you must first find the value of idc and idx that bounds x,y.  Use the function isnearcurve.
 * 
 * Interpolation data is stored in an associative array of the form shown below.  This form represents multiple curves and on each curve there is a 
 * corresponding value for "k".  This is the same form as a root locus set of loci, where x,y is the point on one loci and k is the corresponding gain
 * 
 * curvedata has the form    [ [{x:#, y:#}, {x:#, y:#}, {x:#, y:#}, ... {x:#, y:#}, {k:#, ...}]
 *                             [{x:#, y:#}, {x:#, y:#}, {x:#, y:#}, ... {x:#, y:#}, {k:#, ...}]
 *
 *  where   curvedata[idx][idc][]   idx is the row.  every element on a row has the same k value
 *                                  idc is the column.  every element on a column corresponds to a particular curve
 *                                  the last column are the "k" values
 * 
 * @param {array} curvedata     see format described above
 * @param {Number} x    x value for interpolation
 * @param {Number} y    y value for interpolation
 * @param {Number} idc   curve containing the x,y value
 * @param {Number} idx   data point for the upper bound of the x,y value
 *                          curve is interpolated from  curvedata[idx-1][idc]   to curvedata[idx][idc]                     
 * @param {string} ki   index into the "k" value of interest
 * @param {intergraph} thegraph  optional parameter.  If provided x,y values are scaled from graph values to pixels
 * @returns {Number) the interpolated value for "k"
 */
function interpolatecurve(curvedata, x, y, idc, idx, ki, thegraph) {

    var nc = curvedata[0].length - 1;
    var xy1;
    var xy2;
    var xy;

    // is data in pixels or graph units.  Scale accordingly
    if (thegraph === undefined) {
        xy1 = {x: curvedata[idx - 1][idc].x, y: curvedata[idx - 1][idc].y};
        xy2 = {x: curvedata[idx][idc].x, y: curvedata[idx][idc].y};
        xy = {x: x, y: y};
    } else {
        xy1 = thegraph.scalexy(curvedata[idx - 1][idc]);
        xy2 = thegraph.scalexy(curvedata[idx][idc]);
        xy = thegraph.scalexy({x: x, y: y});
    }

    var c = Math.sqrt((xy2.y - xy1.y) * (xy2.y - xy1.y) + (xy2.x - xy1.x) * (xy2.x - xy1.x));
    var dist = Math.abs(((xy1.y - xy2.y) * xy.x + (xy2.x - xy1.x) * xy.y + (xy1.x * xy2.y - xy2.x * xy1.y))) / c;



    var aa = (xy2.y - xy.y) * (xy2.y - xy.y) + (xy2.x - xy.x) * (xy2.x - xy.x);
    var b = Math.sqrt(aa - dist * dist);


    var ratio = b / c;
    if (ratio < 0)
        ratio = 0; //  pick a point outside the table range
    if (ratio > 1)
        ratio = 1;
    // interpolate the curve data
    var val = curvedata[idx][nc][ki] - (curvedata[idx][nc][ki] - curvedata[idx - 1][nc][ki]) * ratio;
    return val;
}

/* DESCRIPTION:  given a value for k, return the value of x,y that match the k value
 * 
 * @param {Array} curvedata  the curve data as defined in interpolatecurve
 * @param {Number} idx   the upper index into a given curve that bounds the values for k
 * @param {Number} k      the value of k to interpolate on
 * @param {Number} ki     the index for "k"
 * @returns {Array}   array of x,y pairs corresponding to the interpolated values for x,y on each curve segment
 *                    [{x:#, y:#}, {x:#, y:#}, ...].  There is one x,y pair for each curve segment
 */
function interpolatefromk(curvedata, idx, k, ki) {
// given k in the slot [ki] and a segment, return x and y array of points for each curve segment
    var nc = curvedata[0].length - 1; // number of curves
    var ans = [];
    var ic;
    var x, y;
    var ratio;
    for (ic = 0; ic < nc; ic++) {
        ratio = ((k - curvedata[idx - 1][nc][ki])) / (curvedata[idx][nc][ki] - curvedata[idx - 1][nc][ki]);
        x = (curvedata[idx][ic].x - curvedata[idx - 1][ic].x) * ratio + curvedata[idx - 1][ic].x;
        y = (curvedata[idx][ic].y - curvedata[idx - 1][ic].y) * ratio + curvedata[idx - 1][ic].y;
        ans[ic] = {x: x, y: y};
    }
    return ans;
}

/* DESCRIPTION:  finds the curve segment matching a value of k
 * 
 * @param {Array} curvedata   the curve data as defined in interpolatecurve
 * @param {Number} k      the value of k to interpolate on
 * @param {Number} ki     the index for "k"
 * @returns {Number} the curve segment for the upper bound on k
 */
function findfromk(curvedata, k, ki) {
// given k find the segment matching [ki]
    var nc = curvedata.length;
    var nk = curvedata[0].length - 1;
    var i;
    var idx = nc - 1;
    for (i = 0; i < nc; i++) {
        if (k < curvedata[i][nk][ki]) {
            idx = i;
            break;
        }
    }
    return idx;
}

/* DESCRIPTION: determine if a point is near a point on one of the segments of the curvedata and return the index for that curve segment and point
 * 
 * @param {Array} curvedata the curve data as defined in interpolatecurve
 * @param {Number} x   x point of interest
 * @param {Number} y   y point of interest
 * @param {Intergraph} thegraph   tht intergraph buffer for the x,y point.
 *                           if (thegraph) != null distance is measured in pixels, but x and y are still graph units
 *  * @param {Number} distmin   the maximum distance a point can be from on the the data curves
 * @returns {Array} [idc, idx]  the curve index and the point index on that curve.  These are the lower index value for the bounds
 */
function isnearcurve(curvedata, x, y, thegraph, distmin) {

// curve data is of the form  [ [{x:,y:}, {x:,y:},... {k:  }],[  ]]
// return data =  [ic, ix]   [curve index,   segment index]
    var np = curvedata.length; // number of points on each curve
    var nc = curvedata[0].length - 1; // number of curves

    var dist, dist2;
    var i, ic;
    // distmin = distmin * distmin;
    var idxmin = -1; // id of point (row)
    var idcmin = -1; // id of the curve
    var xy;
    if (thegraph !== null) {
        xy = thegraph.scalexy({x: x, y: y});
    } else {
        xy = {x: x, y: y};
    }

    var xy1; // = thegraph.scalexy([curvedata[0][0], curvedata[0][1]]);
    var xy0;

    var dp1;
    var dp2;

    // find closest point, then determine which segment
    for (ic = 0; ic < nc; ic++) {
        if (thegraph !== null) {
            xy0 = thegraph.scalexy({x: curvedata[0][ic].x, y: curvedata[0][ic].y});
        } else {
            xy0 = {x: curvedata[0][ic].x, y: curvedata[0][ic].y};
        }

        for (i = 1; i < np; i++) {
            if (thegraph !== null) {
                xy1 = thegraph.scalexy({x: curvedata[i][ic].x, y: curvedata[i][ic].y});
            } else {
                xy1 = {x: curvedata[i][ic].x, y: curvedata[i][ic].y};
            }

            // is it inside the curve perpendicular to the 
            // calculate dot product for two vectors
            dp1 = (xy1.x - xy0.x) * (xy.x - xy0.x) + (xy1.y - xy0.y) * (xy.y - xy0.y);
            dp2 = (xy0.x - xy1.x) * (xy.x - xy1.x) + (xy0.y - xy1.y) * (xy.y - xy1.y);


            if (dp1 >= 0 && dp2 >= 0) {
                // its within this segment
                dist = Math.abs(((xy0.y - xy1.y) * xy.x + (xy1.x - xy0.x) * xy.y + (xy0.x * xy1.y - xy1.x * xy0.y))) / Math.sqrt((xy1.x - xy0.x) * (xy1.x - xy0.x) + (xy1.y - xy0.y) * (xy1.y - xy0.y));

                if (dist < distmin) {
                    distmin = dist;
                    idxmin = i;
                    idcmin = ic;
                }
            }
            xy0.x = xy1.x;
            xy0.y = xy1.y;

        }
    }

    return [idcmin, idxmin];

}


/* DESCRIPTION:  calculates the distance between two points
 * 
 * @param {Number} x
 * @param {Number} y
 * @param {Number} x1
 * @param {Number} y1
 * @returns {Number}  the distance between the points  (x,y) and (x1,y1)
 */
function xydistance(x, y, x1, y1) {
    return Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1));
}


// ----------------------------------------------------------------
// ---- ROOT LOCUS AND POLYNOMIAL ROOTS ---------------------------
//  ---------------------------------------------------------------      
//  
//  Library for calculation the root locus of a polynomial of form   den+num*k=0  for  0 < k < (some large value)
//  Results are returned as an array of data, compatible with the interpolation library
//  
//  num = []   s^2+ 10s + 15 = [1,10,15],   den has similar form
//  num and den must be same size.  Pad num with leading zeros if needed;   

/* DESCRIPTION: find the roots of a polynomial of the form  den+num*k
 * 
 * @param {Array} num  coefficient of a polynomial,  s^2+ 10s + 15 = [1,10,15] 
 *                      num must have the same number of items as den.  Pad the left with zeros if needed.
 * @param {Array} den  coefficient of a polynomial,  s^2+ 10s + 15 = [1,10,15] 
 * @param {Number} k   a value at which to find the roots for   den + num*k = 0
 * @returns {Array}  root of the polynomial  [ {x:#, y:#}, ... ].  There will be the same number of entries as roots of den = 0
 *                      roots are of the form  x + iy  where i is the imaginary number
 */
function getroots(num, den, k) {
    var nd = den.length - 1; // nd = order of denominator
    var i;
    var clce = [];
    var zeros;
    var ans;
    for (i = 0; i <= nd; i++) {
        clce[i] = den[i] + k * num[i];
    }
    zeros = new Array(nd); // Vector of real components of roots
    var degreePar = new Object(); // degreePar is a dummy variable for passing the parameter POLYDEGREE by reference
    degreePar.Degree = nd;
    for (i = 0; i < nd; i++) {
        zeros[i] = {re: 0, im: 0};
    }

    rpSolve(degreePar, clce, zeros);
    ans = [];
    for (i = 0; i < nd; i++) {
        ans[i] = {x: zeros[i].re, y: zeros[i].im};
    }
    return ans;
}



// gets the loci of roots (root locus) for equation  den+num*k=0
// num = []   s^2+ 10s + 15 = [1,10,15],   den has similar form
//  num and den must be same size.  Pad num with leading zeros if needed;    
// where   0 < k < kmax
// returns
//  r = [ [{x:, y:},  {x:, y:}, {x:, y:}, {x:, y:},  {k:#}], [....]  ]
// where  r[] is a list of roots corresponding to a value of k
// r[i][j].x  r[i][j].y  are the jth roots
// r[i][nr].k is the corresponding value of k

/* DESCRIPTION:  Calculates the loci of roots (root locus) for equation  den+num*k=0
 *  where   0 < k < kmax.  
 * 
 * @param {Array} num  coefficient of a polynomial,  s^2+ 10s + 15 = [1,10,15] 
 *                      num must have the same number of items as den.  Pad the left with zeros if needed.
 * @param {Array} den  coefficient of a polynomial,  s^2+ 10s + 15 = [1,10,15] 
 * @param {Number} kmax  larges value of k for root locus
 * @param {Number} mindist  controls how close the values of the roots are spaces.  This is the maximum distance between successive
 *                 x,y points on a given loci
 * @returns {Array}  [ [{x:, y:},  {x:, y:}, {x:, y:}, {x:, y:},  {k:#}], [....]  ]
 *                      where k is the value of k in  den + num*k = 0 corresponding to the roots x,y
 *                      roots are of the form  x + iy  where i is the imaginary number
 *                      
 *                      Points for a given loci have the same index.  So the form of the returned array is
 *                      [ [x,y for loci 1}, {x,y for loci 2},... {k for these roots}],
 *                        [x,y for loci 1}, {x,y for loci 2},... {k for these roots}],
 *                        [x,y for loci 1}, {x,y for loci 2},... {k for these roots}], ... ]
 *                    
 */
function rootlocus(num, den, kmax, mindist) {
// these are in 
    var zerolist = []; // [ [{x:, y:},  {x:, y:}, {x:, y:}, {x:, y:},  k], [....]  ]
    var zeros;
    var currzero = [];
    var nz = 0;
    var i;
    var j;
    //                   var j;
    var nr = den.length - 1;
    var kinc = 0.5;
    var k; // k = kinc
    var maxmag;
    var incmax;
    var cincmax = mindist; // 10; // (this.buffer.xmax - this.buffer.xmin) / 30; // 0.1;
    var incmin = cincmax / 10; //0.05;
    var count = 0;
    var mindist;
    var temp;
    var temp2;
    var minidx;
    var usedindex;
    var zerolist = [];
    var currzero = getroots(num, den, 0); // k=0


    //              currzero = new Array();
    //              for (i = 0; i < nr; i++) {
    //                  currzero[i] = this.zeros[i];
    //              }

    currzero[nr] = {k: 0};
    zerolist[nz++] = currzero;
    // sorting algorithm
    // loop through points
    //    loop through previous points
    //       find index of point with minimum distance
    //    put point in index location


    k = kinc;
    usedindex = new Array();
    while (count < 400 && k < kmax) {

        incmax = cincmax;
        zeros = getroots(num, den, k);
        currzero = new Array();
        for (i = 0; i < nr; i++)
            usedindex[i] = 0;
        maxmag = 0; // this is the largest distence between any paired roots
        // sort matching roots by finding root pairs that are closest together (between last set of roots and current roots)

        for (i = 0; i < nr; i++) {
            minidx = 0;
            while (usedindex[minidx] === 1)
                minidx++;
            mindist = (zeros[i].x - zerolist[nz - 1][minidx].x) * (zeros[i].x - zerolist[nz - 1][minidx].x)
                    + (zeros[i].y - zerolist[nz - 1][minidx].y) * (zeros[i].y - zerolist[nz - 1][minidx].y);
            for (j = 1; j < nr; j++) {
                if (usedindex[j] === 0) {
                    temp = (zeros[i].x - zerolist[nz - 1][j].x) * (zeros[i].x - zerolist[nz - 1][j].x) + (zeros[i].y - zerolist[nz - 1][j].y) * (zeros[i].y - zerolist[nz - 1][j].y);
                    if (temp < mindist) {
                        mindist = temp;
                        minidx = j;
                    }
                }

            }
            currzero[minidx] = zeros[i];
            usedindex[minidx] = 1;
            // use distance to change dk only if not on real axis
            // if close to real axis make important

            // temp2 is the distance from the x axis
            temp2 = Math.abs(currzero[minidx].y);
            temp = Math.abs(zerolist[nz - 1][minidx].y);
            if ((mindist > maxmag)) {// || ((temp2 > incmin) && (temp2 < 2*incmin) )) {  
                // found a pair that is a larger distance appart
                // or found roots close to the axis
                // either current or previous pair is not on the axis
                // use incmin as a measure of how close we need to be to the axis
                maxmag = mindist;
                //  if ((temp2 > incmin) && (temp2 < 2*incmin) ) // (temp2 < .5)
                //      maxmag = maxmag * 10;
            }

            // if found a pair close to the x axis artifically increase maxmag to force higher tolerance near this location
            // however, don't do this if on the axis

            if (((temp < incmin) && (temp2 > incmin)) ||
                    ((temp > incmin) && (temp2 < incmin))) {

                incmax = incmin * 0.1;
            }
        }

        currzero[nr] = {k: k};
        zerolist[nz++] = currzero;
        if (maxmag > incmax) {
            // distance is too big, so decrement k and proceed
            // if (k>1.25*kinc)
            k = k - 1 * kinc;
            kinc = kinc / 4;
            nz--;
            if (nz < 1)
                nz = 1;
            count--;
            if (count < 1)
                count = 1;
        }
        else if (maxmag < incmin) {
            kinc = kinc * 2;
        }

        k = k + kinc;
        //  j++;
        count++;
    }
    return zerolist;
}


// ----------------------------------------------------------------
// ---- FREQUENCY RESPONSE              ---------------------------
// ----------------------------------------------------------------   
// 
//  Compute the frequency response of a transfer function.  This can be used for Nyquist or Bode plots
//  



/* DESCRIPTION:  calculate the value of the transfer function of the form  gain*num(s)/den(s)  at a single point, s= complex number
 * 
 * @param {Complex} cplx  a comple number of the form  {re:#, im:#},  
 *                  typically re=0,  im=frequency for bode plots
 *                            re may not be zero for nyquist plots or conformal mapping
 * @param {Array} pnum  numerator as array  s^2 + 5s + 1   =>  [1, 5,1];
 *                      the order of the numerator array must be the same as the denominator.  Pad pnum to the left with zeros if needed.
 * @param {Array} pden  denominator as array  s^2 + 5s + 1   =>  [1, 5,1];
 * @param {Number} pgain  gain constant for the transferfunction.  They is often 1.
 * @param {Bool} returncomplex  true = return the value as a complex number,
 *                              false = return the value as phase and magnitude
 * @param {Number} tdelay   optional time delay.  If provided the transfer function is   gain*num(s)/den(s) * exp(-s*delay)
 * @returns {re:#, im:#} if returncomplex = true
 *          {mag:#, phase:#}  if returncomplex = false, phase is in degrees,  mag is magnitude, not in dB 
 */
function freqval(cplx, pnum, pden, pgain, returncomplex, tdelay) {
    var i;
    var num = new complex(0, 0);
    var den = new complex(0, 0);
    var fact = new complex(0, 0);
    var pz = new complex(0, 0);
    var len;
    var mag, phase;
    // numerator
    len = pnum.length;
    for (i = 0; i < len; i++) {
        fact.re = cplx.re;
        fact.im = cplx.im;
        fact.inthby(len - i - 1);
        fact.mulbyn(pnum[i]);
        num.addto(fact);
    }


    // denominator
    len = pden.length;
    for (i = 0; i < len; i++) {
        fact.re = cplx.re;
        fact.im = cplx.im;
        fact.inthby(len - i - 1);
        fact.mulbyn(pden[i]);
        den.addto(fact);
    }
    //num.mulbyn(this.gain * this.xgain);
    pz = num.div(den);
    pz.re *= pgain;
    pz.im *= pgain;

    if (tdelay !== undefined) {
        fact.re = Math.cos(-cplx.im * tdelay);
        fact.im = Math.sin(-cplx.im * tdelay);
        pz.mulby(fact);
    }
    if (returncomplex === true) {
        return pz;
    } else {
        mag = Math.sqrt(pz.re * pz.re + pz.im * pz.im);
        // mag = 20 * Math.log(pz.re * pz.re + pz.im * pz.im) / 2 / Math.LN10; // convert to base e to base 10
        phase = Math.atan2(pz.im, pz.re) * 57.296;
        return ({"mag": mag, "phase": phase});
    }
}



/* DESCRIPTION: Calculate the point on the Bode plot for a transfer function of the form  gain*num(s)/den(s)
 * 
 * @param {Array} num  numerator as array  s^2 + 5s + 1   =>  [1, 5,1];
 *                      the order of the numerator array must be the same as the denominator.  Pad pnum to the left with zeros if needed.
 * @param {Array} den  denominator as array  s^2 + 5s + 1   =>  [1, 5,1];
 * @param {Number} k  gain for the transfer function,  often k=1
 * @param {Number} startfreq  starting frequency in Hz for the Bode plot
 * @param {Number} endfreq    ending frequency in Hz for the Bode plot
 * @param {Number} npts       number of distinct frequencies between startfreq and endfreq at which to compute the points on the Bode                          
 * @param {Boolean} calcDB    if true gain is returned in dB, otherwise as a magnitude
 * @param {Boolean} logFreq   if trun the frequencies are distributed along a long scale,  typically this value is True
 * @param {Number} tdelay     optional time delay.  If provided the transfer function is   gain*num(s)/den(s) * exp(-s*delay)
 * @returns {Array}   array of points on the bode plot in the form [{freq:#, mag:#, phase:#}, ...   ]  
 */
function freqresp(num, den, k, startfreq, endfreq, npts, calcDB, logFreq, tdelay) {

    var startlog = Math.log(startfreq) / Math.LN10;
    var endlog = Math.log(endfreq) / Math.LN10;
    var dlog = (endlog - startlog) / npts;
    var wlog;
    var j = 0;
    var w = new complex(0, 0);
    var y = [];
    var mp;
    w.im = startfreq;
    mp = freqval(w, num, den, k, false, tdelay);
    var lastphase = mp.phase;

    for (wlog = startlog; wlog <= endlog; wlog += dlog) {
        w.re = 0;
        w.im = Math.pow(10, wlog);
        mp = freqval(w, num, den, k, false, tdelay);


        if (logFreq) {
            mp.freq = wlog;
        } else {
            mp.freq = w.im;
        }

        // don't let the phase jump when atan2 wraps around
        if ((mp.phase - lastphase) > 90) {
            mp.phase -= 360;
            while ((mp.phase - lastphase) > 90)
                mp.phase -= 360;
        } else if ((mp.phase - lastphase) < -90) {
            mp.phase -= 360;
            while ((mp.phase - lastphase) > 90)
                mp.phase += 360;
        }

        lastphase = mp.phase;

        if (calcDB) {
            mp.mag = 20 * Math.log(mp.mag) / Math.LN10;
        }
        ;

        y[j] = mp;
        j++;
    }
    return y;
}

// perform conformal mapping of  transfer function  num/den  through complex curve
// num = numerator as array  s^2 + 5s + 1   =>  [1, 5,1];
// den = denomatator of transfer function
//  curve = list of points  [[ {x:#, y:#}, f:#]... ]   x,y complex points,  f=frequency or some index
//  delay = time delay function  exp(-sT)
//     assumes s is only imaginary;
// returns y = [[{x:#, x:#}, f:#...   ]...]  where f corresponds to f in curve
//

/* DESCRIPTION: return array of points corresponding to mapping the set of point in a curve through a transfer function, num(s)/den(s)
 * This is useful for creating Nyquist diagrams
 * 
 * @param {Array} num  numerator as array  s^2 + 5s + 1   =>  [1, 5,1];
 *                      the order of the numerator array must be the same as the denominator.  Pad pnum to the left with zeros if needed.
 * @param {Array} den  denominator as array  s^2 + 5s + 1   =>  [1, 5,1];
 * @param {Object} curve  a set of data points of the form  [ [{x:#, y:#}, {f:#}] ,[..] ... ]
 *                      Note that this is the same form as curve data for the interpolation library
 * @param {Number} tdelay  optional time delay.  If provided the transfer function is   gain*num(s)/den(s) * exp(-s*delay)
 * @returns {Array} [[{x:#, x:#}, f:#...   ]...]  where f corresponds to f in curve.  f is useful for matching data on the original curve with the mapped data 
 */
function confmap(num, den, curve, tdelay) {

    var n = curve.length;
    var i;
    var w = new complex(0, 0);
    var y = [];
    var mp;

    for (i = 0; i < n; i++) {
        w.im = curve[i][0].y;
        w.re = curve[i][0].x;
        mp = freqval(w, num, den, 1, true, tdelay);


        y[i] = [{x: mp.re, y: mp.im}, {idx: curve[i][1].idx}];
    }
    return y;
}

/* DESRIPTION: multiply two polynomials
 * 
 * @param {Array} s1  array  s^2 + 5s + 1   =>  [1, 5,1];
 * @param {Array} s2 array  s^2 + 5s + 1   =>  [1, 5,1];
 * @returns {Array} array  s^2 + 5s + 1   =>  [1, 5,1];
 */
function tfmult(s1, s2) {

    var i, j;
    var n1 = s1.length;
    var n2 = s2.length;
    // var n3;
    var s3 = [];
    for (i = 0; i < (n1 + n2 - 1); i++) {
        s3[i] = 0;
    }
    for (i = 0; i < n1; i++) {
        for (j = 0; j < n2; j++) {
            s3[j + i] = s3[j + i] + s2[j] * s1[i];
        }
    }
    return s3;
}


//------------------------------------------------------------
// --------- Z Transfrom simulation  --------------------------
// -----------------------------------------------------------
/*  function for simulating the time response given the Z transfrom
 *  num = coefficients of the numerator of z transform    5z^2+ 6z + 1 = [5 6 1]
 *  den = coefficients of the denominator of z transform
 *  dt = sample time
 *  tfinal = ending time for simulation,  t initial = 0 always
 *  
 *  assumes zero initial contitions
 *  
 *  returns y = [{x:#, y:#},{x:#, y:#},...  ]
 */

/* DESCRIPTION: simulates the response of a discrete system given the z-transform transfer function
 * 
 * @param {Array} num  numerator for the transfer function 5z^2+ 6z + 1 = [5 6 1]
 * @param {Array} den denominator for the transfer function 5z^2+ 6z + 1 = [5 6 1]
 * @param {Number} dx step size for independent variable
 * @param {Number} xfinal  final value for independent variable.  Assume x(0) = 0 
 * @param {Function} f  the input function.  function (t) { return  input value};
 * @returns {Array} [{x:#, y:#},{x:#, y:#},...  ]  where x is the independent variable and y is the output from the transfer function
 *          NOTE change in name for independent variable from t (time) to 
 *
 */  //  solveztrans(num, den, dx, xfinal, f)  NOTE change in name for independent variable 
function solveztrans(num, den, dt, tfinal, f) {

    var i, j;
    var t = 0;
    var n = den.length;
    var imax = tfinal / dt;
    var y = [];

    // buffers
    var xb = [];
    var yb = [];
    var sum;

    for (i = 0; i < n; i++) {
        xb[i] = 0;
        yb[i] = 0;
    }

    for (i = 0; i < imax; i++) {
        sum = 0;
        xb[0] = f(i * dt);
        yb[0] = 0;

        for (j = 0; j < n; j++) {
            sum = sum + num[j] * xb[j] - den[j] * yb[j];  // implemented as a FIR filter
        }
        y[i] = {x: dt * i, y: sum / den[0]};
        yb[0] = y[i].y;
        // shift 
        for (j = n - 1; j > 0; j--) {
            xb[j] = xb[j - 1];
            yb[j] = yb[j - 1];
        }

    }
    return y;
}


// --------------------------------------------------------------
// --   COMPLEX MATH --------------------------------------------
// --------------------------------------------------------------
/* DESCRIPTION: create complex variable object and initialize it with values real and imaginary components
 * 
 * @param {Number} r   real part to initialize the variable
 * @param {Number} i   imaginary part to initialize the variable
 * @returns {complex}  return complex variable
 */
function complex(r, i) {
    this.re = r;
    this.im = i;
}

/* DESCRIPTION:  Add complex value to existing complex number and return the results
 *      var a = new complex(1,2)    //  a = 1+2i
 *      var b = new complex(3,4)    //  b = 3+4i
 *      var c = a.add(b)            //  c = 4+6i,  a and b unchanged
 *      
 * @param {complex} cpx   a complex number of  
 * @returns {complex}  results of the addition
 */
complex.prototype.add = function (cpx) {
    // return complex+cpx  
//if (typeof(cpx)== 'complex' ){
//this.re = this.re+cpx.re;
//this.im = this.im + cpx.im;
    return new complex(this.re + cpx.re, this.im + cpx.im);
    //} else {
    //	this.re = this.re + cpx;
    //}
};

/* DESCRIPTION:  Add complex value to an existing complex number, store the results in the original complex number and return the results
 *      var a = new complex(1,2)    //  a = 1+2i
 *      var b = new complex(3,4)    //  b = 3+4i
 *      a.addto(b)            //  a = 4+6i, 
 * * @param {complex} cpx   a complex number of  
 * @returns {complex}  results of the addition
 */
complex.prototype.addto = function (cpx) {
    // return complex+cpx  and  sets complex to that value
//if (typeof(cpx)== 'complex' ){
    this.re = this.re + cpx.re;
    this.im = this.im + cpx.im;
    return this;
};


/* DESCRIPTION:  Multiply an existing complex value by a  complex number and return the results
 * @param {complex} cpx   a complex number of  
 * @returns {complex}  results of the mulitplication
 */
complex.prototype.mul = function (cpx) {
    // return complex*cpx  
//	this.re = this.re*cpx.re-this.im*cpx.im;
//	this.im = this.re*cpx.im+this.im*cpx.re;
    return new complex(this.re * cpx.re - this.im * cpx.im, this.re * cpx.im + this.im * cpx.re);
};


/* DESCRIPTION:  Multiply a complex value by existing complex number, store the results in the original complex number and return the results
 * @param {complex} cpx   a complex number of  
 * @returns {complex}  results of the multiplication
 */
complex.prototype.mulby = function (cpx) {
    // return complex*cpx  and  sets complex to that value
    var re = this.re * cpx.re - this.im * cpx.im;
    this.im = this.re * cpx.im + this.im * cpx.re;
    this.re = re;
    return this;
};

/* DESCRIPTION:  Multiply an existing complex value by a complex number, store the results in the original complex number and return the results
 * @param {Number} r   real value for multiplication
 * @returns {complex}  results of the multiplication
 */
complex.prototype.mulbyn = function (r) {
    this.im *= r;
    this.re *= r;
    return this;
};


/* DESCRIPTION:  Divide a  complex value by a complex number, and return the results
 * @param {complex} cpx   a complex number of  
 * @returns {complex}  results of the division
 */
complex.prototype.div = function (cpx) {
    // return complex/cpx  
// (a+bi)/(c+di) =  (a+bi)*(c-di)/((c+di)*(c-di))
// (ac+bd)+(cb-ad)i  / (cc+dd)
    var temp = cpx.re * cpx.re + cpx.im * cpx.im;
    return new complex((this.re * cpx.re + this.im * cpx.im) / temp, (this.im * cpx.re - this.re * cpx.im) / temp);
};


/* DESCRIPTION:  Divide a  complex value by a complex number, store the results in the original complex value and return the results
 * @param {complex} cpx   a complex number of  
 * @returns {complex}  results of the division
 */
complex.prototype.divby = function (cpx) {
    // return complex/cpx  and  sets complex to that value
// (a+bi)/(c+di)
//  =  (a+bi)*(c-di)/((c+di)*(c-di))
// (ac+bd)+(cb-ad)i  / (cc+dd)
    var temp = cpx.re * cpx.re + cpx.im * cpx.im;
    var re = (this.re * cpx.re + this.im * cpx.im) / temp;
    this.im = (this.im * cpx.re - this.re * cpx.im) / temp;
    this.re = re;
    return this;
};

/* DESCRIPTION:  Change the sign of a complex number
 * @returns {complex}  -1* the value
 */
complex.prototype.neg = function () {
    // return -complex
    return new complex(-this.re, -this.im);
};


/* DESCRIPTION:  Raise a  complex value to the n th power, store the results in the complex value and  return the results
 * @param {Number} n   integer power 
 * @returns {complex}  results of   value^n
 */
complex.prototype.inthby = function (n) {
    // return complex^n   AND changes value to complex^n
    // n is an integer
    var j;
    var tre = 1;
    var ttre;
    var tim = 0;
    for (j = 0; j < n; j++) {
        ttre = this.re * tre - this.im * tim;
        tim = this.im * tre + this.re * tim;
        tre = ttre;
    }
    this.re = tre;
    this.im = tim;
    return this;
};


/* DESCRIPTION:  Raise a  complex value to the n th power, and  return the results
 * @param {Number} n   integer power 
 * @returns {complex}  results of value^n
 */
complex.prototype.inth = function (n) {
    // return   complex^n 
    // n is a integer
    var j;
    var tre = 1;
    var ttre;
    var tim = 0;
    for (j = 0; j < n; j++) {
        ttre = this.re * tre - this.im * tim;
        tim = this.im * tre + this.re * tim;
        tre = ttre;
    }

    return (new complex(tre, tim));
};

/* DESCRIPTION:  return the magnitude of a complex number
 * @returns {Number}  return magnitude of complex number
 */
complex.prototype.mag = function () {
    return Math.sqrt(this.re * this.re + this.im * this.im);
};

/* DESCRIPTION: format a complex number for printing
 * @param {Number} r   real part of complex number
 * @param {Number} c   imaginary part of complex number
 * @param {Number} s   number of digits past decimal point to show
 * @returns (String) formatted string representing the complex value   r + ci
 */
function formatcplx(r, c, s) {
// returns formatted values to s digits
    var temp = "";
    if (r !== 0) {
        temp = r.toFixed(s);
    }
    if (c !== 0) {
// sign
        if (r !== 0 && c > 0)
            temp += "+";
        temp += c.toFixed(s) + "i";
    }
    return temp;
}


/* DESCRIPTION: find a polynomial with a set of roots
 *     var a = [new complex(-1,2), new complex(-1,-2)];
 *     polycplx(a)  returns   [1,2,5]
 *       x^2 + 2x+5 = 0 has roots    -1+/i 2i
 *       
 * @param {Array complex)  cplx array of complex values
 * @returns {Array}  coefficients of polynomial having roots in cplx
 */
function polycplx(cplx) {
// return an array of polynomial coefficients where the polynomial has roots
// in the array cplx.  this assumes the poly will have real or complex conjugate roots

    var len = cplx.length;
    var z = [];
    var j;
    var k;

    if (len === 0) {
        return [1];
    }
    if (len === 1) {
        return [1, -cplx[0].re];
    }

    // (a[0] s^(n-1)      + a[1] s^(n-2) + ... + a[n-1] s + a[n])*(s - b)
    // (a[0] s^(n)  + a[1] s^(n-1) +   a[2] s^(n-2) + ......               + a[n-1] s^2 +   a[n]s +  0*a[n+1])
    // -            (b*a[0] s^(n-1) + b*a[1] s^(n-2) + ...              +     b*a[n-2] s^2 + b*a[n-1] s + b*a[n])

    // [ a0  a1  a2  a3   ...   an]
    // [ a0  a1  a2  a3   ...   an  0]
    //     [ a0  a1  a2  a3   ...   an]
    // [ a0  a1-ba0   a2-ba1  ...   an-ba(n-1)  0-ban]   
    // 
    var k, nroots, b, temp, i, n;
    var rpoly = [];
    nroots = cplx.length;

    poly = [new complex(1, 0), new complex(-cplx[0].re, -cplx[0].im)];
    n = 2;
    for (k = 1; k < nroots; k++) {
        poly[n++] = new complex(0, 0);
        b = new complex(-cplx[k].re, -cplx[k].im);
        temp0 = new complex(poly[0].re, poly[0].im);
        for (i = 1; i < n; i++) {
            temp1 = new complex(poly[i].re, poly[i].im);
            poly[i].addto(temp0.mul(b));
            temp0 = temp1;
        }
    }

    for (i = 0; i < n; i++) {
        rpoly[i] = poly[i].re;
    }
    return rpoly;

}

/* DESCRIPTION:  multiply two polynomial that have complex coefficients
 * @param {Array complex)  x   array of complex values resprsenting coefficient of polynomial
 *                              (-1+2i)x + (-3+3i)  ->  [new complex(-1,2), new complex(-3,3)]
 @param {Array complex)  y   array of complex values resprsenting coefficient of polynomial
 *                              (-1+2i)x + (-3+3i)  ->  [new complex(-1,2), new complex(-3,3)]                              
 * @returns {Array}  coefficients of polynomial from  x*y
 */
function convcplx(x, y) {
// multiply two polynomials,  x and y are arrays of complex values
    var nx = x.length;
    var ny = y.length;
    var z = [];
    var j;
    var k;
    for (j = 0; j < (nx + ny - 1); j++)
        z[j] = new complex(0, 0);
    for (j = 0; j < nx; j++) {
        for (k = 0; k < ny; k++) {
            z[j + k].addto(x[j].mul(y[k]));
        }
    }
    return z;
}
/* DESCRIPTION:  multiply two polynomial that have real coefficients
 * @param {Array complex)  x   array of values resprsenting coefficient of polynomial
 *                              x^2 + 5x + 6 ->  [1,5,6]
 * @param {Array complex)  x   array of values resprsenting coefficient of polynomial
 *                              x^2 + 5x + 6 ->  [1,5,6]                          
 * @returns {Array}  coefficients of polynomial from  x*y
 */
function conv(x, y) {
// multiply two polynomials,  x and y are arrays of  values
    var nx = x.length;
    var ny = y.length;
    var z = [];
    var j;
    var k;
    for (j = 0; j < (nx + ny - 1); j++)
        z[j] = 0;
    for (j = 0; j < nx; j++) {
        for (k = 0; k < ny; k++) {
            z[j + k] += (x[j] * y[k]);
        }
    }
    return z;
}

// ------------------------------------------------
// ----  polynomial root solver -------------------
// ------------------------------------------------
//
// Javascript translation of the FORTRAN routine RPOLY.FOR, from NETLIB site as TOMS/493. 
// http://www.akiti.ca/PolyRootRe.html


// polynomial root finder
// entry function is function rpSolve(degPar, p, zeros)

function QuadSD_ak1(NN, u, v, p, q, iPar) {

    // Divides p by the quadratic 1, u, v placing the quotient in q and the remainder in a, b

    // iPar is a dummy variable for passing in the two parameters--a and b--by reference

    q[0] = iPar.b = p[0];
    q[1] = iPar.a = -(u * iPar.b) + p[1];

    for (var i = 2; i < NN; i++) {
        q[i] = -(u * iPar.a + v * iPar.b) + p[i];
        iPar.b = iPar.a;
        iPar.a = q[i];
    } // End for i

    return;
} // End QuadSD_ak1

function calcSC_ak1(DBL_EPSILON, N, a, b, iPar, K, u, v, qk) {

    // This routine calculates scalar quantities used to compute the next K polynomial and
    // new estimates of the quadratic coefficients.

    // calcSC -	integer variable set here indicating how the calculations are normalized
    //			to avoid overflow.

    // iPar is a dummy variable for passing in the nine parameters--a1, a3, a7, c, d, e, f, g, and h --by reference

    var sdPar = new Object();    // sdPar is a dummy variable for passing the two parameters--c and d--into QuadSD_ak1 by reference

    var dumFlag = 3;	// TYPE = 3 indicates the quadratic is almost a factor of K

    // Synthetic division of K by the quadratic 1, u, v
    sdPar.b = sdPar.a = 0.0;
    QuadSD_ak1(N, u, v, K, qk, sdPar);
    iPar.c = sdPar.a;
    iPar.d = sdPar.b;

    if (Math.abs(iPar.c) <= (100.0 * DBL_EPSILON * Math.abs(K[N - 1]))) {
        if (Math.abs(iPar.d) <= (100.0 * DBL_EPSILON * Math.abs(K[N - 2])))
            return dumFlag;
    } // End if (abs(c) <= (100.0*DBL_EPSILON*abs(K[N - 1])))

    iPar.h = v * b;
    if (Math.abs(iPar.d) >= Math.abs(iPar.c)) {
        dumFlag = 2;		// TYPE = 2 indicates that all formulas are divided by d
        iPar.e = a / (iPar.d);
        iPar.f = (iPar.c) / (iPar.d);
        iPar.g = u * b;
        iPar.a3 = (iPar.e) * ((iPar.g) + a) + (iPar.h) * (b / (iPar.d));
        iPar.a1 = -a + (iPar.f) * b;
        iPar.a7 = (iPar.h) + ((iPar.f) + u) * a;
    } // End if(abs(d) >= abs(c))
    else {
        dumFlag = 1;		// TYPE = 1 indicates that all formulas are divided by c;
        iPar.e = a / (iPar.c);
        iPar.f = (iPar.d) / (iPar.c);
        iPar.g = (iPar.e) * u;
        iPar.a3 = (iPar.e) * a + ((iPar.g) + (iPar.h) / (iPar.c)) * b;
        iPar.a1 = -(a * ((iPar.d) / (iPar.c))) + b;
        iPar.a7 = (iPar.g) * (iPar.d) + (iPar.h) * (iPar.f) + a;
    } // End else

    return dumFlag;
} // End calcSC_ak1

function nextK_ak1(DBL_EPSILON, N, tFlag, a, b, iPar, K, qk, qp) {

    // Computes the next K polynomials using the scalars computed in calcSC_ak1

    // iPar is a dummy variable for passing in three parameters--a1, a3, and a7

    var temp;

    if (tFlag === 3) {	// Use unscaled form of the recurrence
        K[1] = K[0] = 0.0;

        for (var i = 2; i < N; i++)
            K[i] = qk[i - 2];

        return;
    } // End if (tFlag == 3)

    temp = ((tFlag === 1) ? b : a);

    if (Math.abs(iPar.a1) > (10.0 * DBL_EPSILON * Math.abs(temp))) {
        // Use scaled form of the recurrence

        iPar.a7 /= iPar.a1;
        iPar.a3 /= iPar.a1;
        K[0] = qp[0];
        K[1] = -(qp[0] * iPar.a7) + qp[1];

        for (var i = 2; i < N; i++)
            K[i] = -(qp[i - 1] * iPar.a7) + qk[i - 2] * iPar.a3 + qp[i];

    } // End if (abs(a1) > (10.0*DBL_EPSILON*abs(temp)))
    else {
        // If a1 is nearly zero, then use a special form of the recurrence

        K[0] = 0.0;
        K[1] = -(qp[0] * iPar.a7);

        for (var i = 2; i < N; i++)
            K[i] = -(qp[i - 1] * iPar.a7) + qk[i - 2] * iPar.a3;
    } // End else

    return;
} // End nextK_ak1

function newest_ak1(tFlag, iPar, a, a1, a3, a7, b, c, d, f, g, h, u, v, K, N, p) {
    // Compute new estimates of the quadratic coefficients using the scalars computed in calcSC_ak1

    // iPar is a dummy variable for passing in the two parameters--uu and vv--by reference
    // iPar.a = uu, iPar.b = vv

    var a4, a5, b1, b2, c1, c2, c3, c4, temp;

    iPar.b = iPar.a = 0.0;		// The quadratic is zeroed

    if (tFlag !== 3) {

        if (tFlag !== 2) {
            a4 = a + u * b + h * f;
            a5 = c + (u + v * f) * d;
        } // End if (tFlag != 2)
        else { // else tFlag == 2
            a4 = (a + g) * f + h;
            a5 = (f + u) * c + v * d;
        } // End else tFlag == 2

        // Evaluate new quadratic coefficients

        b1 = -(K[N - 1] / p[N]);
        b2 = -(K[N - 2] + b1 * p[N - 1]) / p[N];
        c1 = v * b2 * a1;
        c2 = b1 * a7;
        c3 = b1 * b1 * a3;
        c4 = -(c2 + c3) + c1;
        temp = -c4 + a5 + b1 * a4;
        if (temp !== 0.0) {
            iPar.a = -((u * (c3 + c2) + v * (b1 * a1 + b2 * a7)) / temp) + u;
            iPar.b = v * (1.0 + c4 / temp);
        } // End if (temp != 0)

    } // End if (tFlag != 3)

    return;
} // End newest_ak1

function Quad_ak1(a, b1, c, iPar) {
    // Calculates the zeros of the quadratic a*Z^2 + b1*Z + c
    // The quadratic formula, modified to avoid overflow, is used to find the larger zero if the
    // zeros are real and both zeros are complex. The smaller real zero is found directly from
    // the product of the zeros c/a.

    // iPar is a dummy variable for passing in the four parameters--sr, si, lr, and li--by reference

    var b, d, e;

    iPar.sr = iPar.si = iPar.lr = iPar.li = 0.0;

    if (a === 0) {
        iPar.sr = ((b1 !== 0) ? -(c / b1) : iPar.sr);
        return;
    } // End if (a == 0))

    if (c === 0) {
        iPar.lr = -(b1 / a);
        return;
    } // End if (c == 0)

    // Compute discriminant avoiding overflow

    b = b1 / 2.0;
    if (Math.abs(b) < Math.abs(c)) {
        e = ((c >= 0) ? a : -a);
        e = -e + b * (b / Math.abs(c));
        d = Math.sqrt(Math.abs(e)) * Math.sqrt(Math.abs(c));
    } // End if (Math.abs(b) < Math.abs(c))
    else { // Else (abs(b) >= abs(c))
        e = -((a / b) * (c / b)) + 1.0;
        d = Math.sqrt(Math.abs(e)) * (Math.abs(b));
    } // End else (abs(b) >= abs(c))

    if (e >= 0) {
        // Real zeros

        d = ((b >= 0) ? -d : d);
        iPar.lr = (-b + d) / a;
        iPar.sr = ((iPar.lr !== 0) ? (c / (iPar.lr)) / a : iPar.sr);
    } // End if (e >= 0)
    else { // Else (e < 0)
        // Complex conjugate zeros

        iPar.lr = iPar.sr = -(b / a);
        iPar.si = Math.abs(d / a);
        iPar.li = -(iPar.si);
    } // End else (e < 0)

    return;
}  // End of Quad_ak1

function QuadIT_ak1(DBL_EPSILON, N, iPar, uu, vv, qp, NN, sdPar, p, qk, calcPar, K) {

    // Variable-shift K-polynomial iteration for a quadratic factor converges only if the
    // zeros are equimodular or nearly so.

    // iPar is a dummy variable for passing in the five parameters--NZ, lzi, lzr, szi, and szr--by reference
    // sdPar is a dummy variable for passing the two parameters--a and b--in by reference
    // calcPar is a dummy variable for passing the nine parameters--a1, a3, a7, c, d, e, f, g, and h --in by reference

    var qPar = new Object();    // qPar is a dummy variable for passing the four parameters--szr, szi, lzr, and lzi--into Quad_ak1 by reference

    var ee, mp, omp, relstp, t, u, ui, v, vi, zm;
    var i, j = 0, tFlag, triedFlag = 0;   // Integer variables

    iPar.NZ = 0;	// Number of zeros found
    u = uu;	// uu and vv are coefficients of the starting quadratic
    v = vv;

    do {
        qPar.li = qPar.lr = qPar.si = qPar.sr = 0.0;
        Quad_ak1(1.0, u, v, qPar);
        iPar.szr = qPar.sr;
        iPar.szi = qPar.si;
        iPar.lzr = qPar.lr;
        iPar.lzi = qPar.li;

        // Return if roots of the quadratic are real and not close to multiple or nearly
        // equal and of opposite sign.

        if (Math.abs(Math.abs(iPar.szr) - Math.abs(iPar.lzr)) > 0.01 * Math.abs(iPar.lzr))
            break;

        // Evaluate polynomial by quadratic synthetic division

        QuadSD_ak1(NN, u, v, p, qp, sdPar);

        mp = Math.abs(-((iPar.szr) * (sdPar.b)) + (sdPar.a)) + Math.abs((iPar.szi) * (sdPar.b));

        // Compute a rigorous bound on the rounding error in evaluating p

        zm = Math.sqrt(Math.abs(v));
        ee = 2.0 * Math.abs(qp[0]);
        t = -((iPar.szr) * (sdPar.b));

        for (i = 1; i < N; i++)
            ee = ee * zm + Math.abs(qp[i]);

        ee = ee * zm + Math.abs(t + sdPar.a);

        ee = (9.0 * ee + 2.0 * Math.abs(t) - 7.0 * (Math.abs((sdPar.a) + t) + zm * Math.abs((sdPar.b)))) * DBL_EPSILON;

        // Iteration has converged sufficiently if the polynomial value is less than 20 times this bound

        if (mp <= 20.0 * ee) {
            iPar.NZ = 2;
            break;
        } // End if (mp <= 20.0*ee)

        j++;

        // Stop iteration after 20 steps
        if (j > 20)
            break;

        if (j >= 2) {
            if ((relstp <= 0.01) && (mp >= omp) && (!triedFlag)) {
                // A cluster appears to be stalling the convergence. Five fixed shift
                // steps are taken with a u, v close to the cluster.

                relstp = ((relstp < DBL_EPSILON) ? Math.sqrt(DBL_EPSILON) : Math.sqrt(relstp));

                u -= u * relstp;
                v += v * relstp;

                QuadSD_ak1(NN, u, v, p, qp, sdPar);

                for (i = 0; i < 5; i++) {
                    tFlag = calcSC_ak1(DBL_EPSILON, N, sdPar.a, sdPar.b, calcPar, K, u, v, qk);
                    nextK_ak1(DBL_EPSILON, N, tFlag, sdPar.a, sdPar.b, calcPar, K, qk, qp);
                } // End for i

                triedFlag = 1;
                j = 0;

            } // End if ((relstp <= 0.01) && (mp >= omp) && (!triedFlag))

        } // End if (j >= 2)

        omp = mp;

        // Calculate next K polynomial and new u and v

        tFlag = calcSC_ak1(DBL_EPSILON, N, sdPar.a, sdPar.b, calcPar, K, u, v, qk);
        nextK_ak1(DBL_EPSILON, N, tFlag, sdPar.a, sdPar.b, calcPar, K, qk, qp);
        tFlag = calcSC_ak1(DBL_EPSILON, N, sdPar.a, sdPar.b, calcPar, K, u, v, qk);
        newest_ak1(tFlag, sdPar, sdPar.a, calcPar.a1, calcPar.a3, calcPar.a7, sdPar.b, calcPar.c, calcPar.d, calcPar.f, calcPar.g, calcPar.h, u, v, K, N, p);
        ui = sdPar.a;
        vi = sdPar.b;

        // If vi is zero, the iteration is not converging
        if (vi !== 0) {
            relstp = Math.abs((-v + vi) / vi);
            u = ui;
            v = vi;
        } // End if (vi != 0)
    } while (vi !== 0); // End do-while loop

    return;
} //End QuadIT_ak1

function RealIT_ak1(DBL_EPSILON, iPar, sdPar, N, p, NN, qp, K, qk) {

    // Variable-shift H-polynomial iteration for a real zero

    // sss	- starting iterate = sdPar.a
    // NZ		- number of zeros found = iPar.NZ
    // dumFlag	- flag to indicate a pair of zeros near real axis, returned to iFlag

    var ee, kv, mp, ms, omp, pv, s, t;
    var dumFlag, i, j, nm1 = N - 1;   // Integer variables

    iPar.NZ = j = dumFlag = 0;
    s = sdPar.a;

    for (; ; ) {
        pv = p[0];

        // Evaluate p at s
        qp[0] = pv;
        for (i = 1; i < NN; i++)
            qp[i] = pv = pv * s + p[i];

        mp = Math.abs(pv);

        // Compute a rigorous bound on the error in evaluating p

        ms = Math.abs(s);
        ee = 0.5 * Math.abs(qp[0]);
        for (i = 1; i < NN; i++)
            ee = ee * ms + Math.abs(qp[i]);

        // Iteration has converged sufficiently if the polynomial value is less than
        // 20 times this bound

        if (mp <= 20.0 * DBL_EPSILON * (2.0 * ee - mp)) {
            iPar.NZ = 1;
            iPar.szr = s;
            iPar.szi = 0.0;
            break;
        } // End if (mp <= 20.0*DBL_EPSILON*(2.0*ee - mp))

        j++;

        // Stop iteration after 10 steps
        if (j > 10)
            break;

        if (j >= 2) {
            if ((Math.abs(t) <= 0.001 * Math.abs(-t + s)) && (mp > omp)) {
                // A cluster of zeros near the real axis has been encountered.
                // Return with iFlag set to initiate a quadratic iteration.

                dumFlag = 1;
                iPar.a = s;
                break;
            } // End if ((fabs(t) <= 0.001*fabs(s - t)) && (mp > omp))

        } //End if (j >= 2)

        // Return if the polynomial value has increased significantly

        omp = mp;

        // Compute t, the next polynomial and the new iterate
        qk[0] = kv = K[0];
        for (i = 1; i < N; i++)
            qk[i] = kv = kv * s + K[i];

        if (Math.abs(kv) > Math.abs(K[nm1]) * 10.0 * DBL_EPSILON) {
            // Use the scaled form of the recurrence if the value of K at s is non-zero
            t = -(pv / kv);
            K[0] = qp[0];
            for (i = 1; i < N; i++)
                K[i] = t * qk[i - 1] + qp[i];
        } // End if (fabs(kv) > fabs(K[nm1])*10.0*DBL_EPSILON)
        else { // else (fabs(kv) <= fabs(K[nm1])*10.0*DBL_EPSILON)
            // Use unscaled form
            K[0] = 0.0;
            for (i = 1; i < N; i++)
                K[i] = qk[i - 1];
        } // End else (fabs(kv) <= fabs(K[nm1])*10.0*DBL_EPSILON)

        kv = K[0];
        for (i = 1; i < N; i++)
            kv = kv * s + K[i];

        t = ((Math.abs(kv) > (Math.abs(K[nm1]) * 10.0 * DBL_EPSILON)) ? -(pv / kv) : 0.0);

        s += t;

    } // End infinite for loop

    return dumFlag;
} // End RealIT_ak1

function Fxshfr_ak1(DBL_EPSILON, MDP1, L2, sr, v, K, N, p, NN, qp, u, iPar) {

    // Computes up to L2 fixed shift K-polynomials, testing for convergence in the linear or
    // quadratic case. Initiates one of the variable shift iterations and returns with the
    // number of zeros found.

    // L2	limit of fixed shift steps

    // iPar is a dummy variable for passing in the five parameters--NZ, lzi, lzr, szi, and szr--by reference
    // NZ	number of zeros found

    var sdPar = new Object();    // sdPar is a dummy variable for passing the two parameters--a and b--into QuadSD_ak1 by reference
    var calcPar = new Object();
    // calcPar is a dummy variable for passing the nine parameters--a1, a3, a7, c, d, e, f, g, and h --into calcSC_ak1 by reference

    var qk = new Array(MDP1);
    var svk = new Array(MDP1);

    var a, b, betas, betav, oss, ots, otv, ovv, s, ss, ts, tss, tv, tvv, ui, vi, vv;

    var fflag, i, iFlag = 1, j, spass, stry, tFlag, vpass, vtry;     // Integer variables

    iPar.NZ = 0;
    betav = betas = 0.25;
    oss = sr;
    ovv = v;

    //Evaluate polynomial by synthetic division

    sdPar.b = sdPar.a = 0.0;
    QuadSD_ak1(NN, u, v, p, qp, sdPar);
    a = sdPar.a;
    b = sdPar.b;

    calcPar.h = calcPar.g = calcPar.f = calcPar.e = calcPar.d = calcPar.c = calcPar.a7 = calcPar.a3 = calcPar.a1 = 0.0;
    tFlag = calcSC_ak1(DBL_EPSILON, N, a, b, calcPar, K, u, v, qk);

    for (j = 0; j < L2; j++) {
        fflag = 1;

        // Calculate next K polynomial and estimate v
        nextK_ak1(DBL_EPSILON, N, tFlag, a, b, calcPar, K, qk, qp);
        tFlag = calcSC_ak1(DBL_EPSILON, N, a, b, calcPar, K, u, v, qk);

        // Use sdPar for passing in uu and vv instead of defining a brand-new variable.
        // sdPar.a = ui, sdPar.b = vi

        newest_ak1(tFlag, sdPar, a, calcPar.a1, calcPar.a3, calcPar.a7, b, calcPar.c, calcPar.d, calcPar.f, calcPar.g, calcPar.h, u, v, K, N, p);

        ui = sdPar.a;
        vv = vi = sdPar.b;

        // Estimate s

        ss = ((K[N - 1] !== 0.0) ? -(p[N] / K[N - 1]) : 0.0);

        ts = tv = 1.0;

        if ((j !== 0) && (tFlag !== 3)) {

            // Compute relative measures of convergence of s and v sequences

            tv = ((vv !== 0.0) ? Math.abs((vv - ovv) / vv) : tv);
            ts = ((ss !== 0.0) ? Math.abs((ss - oss) / ss) : ts);

            // If decreasing, multiply the two most recent convergence measures

            tvv = ((tv < otv) ? tv * otv : 1.0);
            tss = ((ts < ots) ? ts * ots : 1.0);

            // Compare with convergence criteria

            vpass = ((tvv < betav) ? 1 : 0);
            spass = ((tss < betas) ? 1 : 0);

            if ((spass) || (vpass)) {

                // At least one sequence has passed the convergence test.
                // Store variables before iterating

                for (i = 0; i < N; i++)
                    svk[i] = K[i];

                s = ss;

                // Choose iteration according to the fastest converging sequence

                stry = vtry = 0;

                for (; ; ) {

                    if ((fflag && ((fflag = 0) == 0)) && ((spass) && (!vpass || (tss < tvv)))) {
                        ;		// Do nothing. Provides a quick "short circuit".
                    } // End if (fflag)

                    else { // else !fflag

                        QuadIT_ak1(DBL_EPSILON, N, iPar, ui, vi, qp, NN, sdPar, p, qk, calcPar, K);

                        a = sdPar.a;
                        b = sdPar.b;

                        if ((iPar.NZ) > 0)
                            return;

                        // Quadratic iteration has failed. Flag that it has been tried and decrease the
                        // convergence criterion

                        iFlag = vtry = 1;
                        betav *= 0.25;

                        // Try linear iteration if it has not been tried and the s sequence is converging
                        if (stry || (!spass)) {
                            iFlag = 0;
                        } // End if (stry || (!spass))
                        else {
                            for (i = 0; i < N; i++)
                                K[i] = svk[i];
                        } // End if (stry || !spass)

                    } // End else fflag

                    //fflag = 0;
                    if (iFlag !== 0) {

                        // Use sdPar for passing in s instead of defining a brand-new variable.
                        // sdPar.a = s

                        sdPar.a = s;
                        iFlag = RealIT_ak1(DBL_EPSILON, iPar, sdPar, N, p, NN, qp, K, qk);
                        s = sdPar.a;

                        if ((iPar.NZ) > 0)
                            return;

                        // Linear iteration has failed. Flag that it has been tried and decrease the
                        // convergence criterion

                        stry = 1;
                        betas *= 0.25;

                        if (iFlag !== 0) {

                            // If linear iteration signals an almost double real zero, attempt quadratic iteration

                            ui = -(s + s);
                            vi = s * s;
                            continue;

                        } // End if (iFlag != 0)
                    } // End if (iFlag != 0)

                    // Restore variables

                    for (i = 0; i < N; i++)
                        K[i] = svk[i];

                    // Try quadratic iteration if it has not been tried and the v sequence is converging

                    if (!vpass || vtry)
                        break;		// Break out of infinite for loop

                } // End infinite for loop

                // Re-compute qp and scalar values to continue the second stage

                QuadSD_ak1(NN, u, v, p, qp, sdPar);
                a = sdPar.a;
                b = sdPar.b;

                tFlag = calcSC_ak1(DBL_EPSILON, N, a, b, calcPar, K, u, v, qk);

            } // End if ((spass) || (vpass))

        } // End if ((j != 0) && (tFlag != 3))

        ovv = vv;
        oss = ss;
        otv = tv;
        ots = ts;
    } // End for j

    return;
}  // End of Fxshfr_ak1

function rpSolve(degPar, p, zeros) { //zeror, zeroi){

    var N = degPar.Degree;
    var RADFAC = 3.14159265358979323846 / 180;  // Degrees-to-radians conversion factor = PI/180
    var LB2 = Math.LN2;	   // Dummy variable to avoid re-calculating this value in loop below

    var MDP1 = degPar.Degree + 1;
    var K = new Array(MDP1);
    var pt = new Array(MDP1);
    var qp = new Array(MDP1);
    var temp = new Array(MDP1);

    var qPar = new Object();    // qPar is a dummy variable for passing the four parameters--sr, si, lr, and li--by reference
    var Fxshfr_Par = new Object();    // Fxshfr_Par is a dummy variable for passing parameters by reference : NZ, lzi, lzr, szi, szr);

    var bnd, DBL_EPSILON, df, dx, factor, ff, moduli_max, moduli_min, sc, x, xm;
    var aa, bb, cc, sr, t, u, xxx;

    var j, jj, l, NM1, NN, zerok;		// Integer variables

    // Calculate the machine epsilon and store in the variable DBL_EPSILON.
    // To calculate this value, just use existing variables rather than create new ones that will be used only for this code block

    aa = 1.0;
    do {
        DBL_EPSILON = aa;
        aa /= 2;
        bb = 1.0 + aa;
    } while (bb > 1.0);

    var LO = Number.MIN_VALUE / DBL_EPSILON;
    var cosr = Math.cos(94.0 * RADFAC);  // = -0.069756474
    var sinr = Math.sin(94.0 * RADFAC);  // = 0.99756405
    var xx = Math.sqrt(0.5);   // = 0.70710678
    var yy = -xx;

    Fxshfr_Par.NZ = j = 0;
    Fxshfr_Par.szr = Fxshfr_Par.szi = Fxshfr_Par.lzr = Fxshfr_Par.lzi = 0.0;

    // Remove zeros at the origin, if any
    while (p[N] === 0) {

        zeros[j].re = zeros[j].im = 0;  // zero and creat space
//   zeror[j] = zeroi[j] = 0;
        N--;
        j++;
    } // End while (p[N] == 0)

    NN = N + 1;

    // ============================ Begin Main Loop =============================================

    while (N >= 1) { // Main loop
        // Start the algorithm for one zero
        if (N <= 2) {
            // Calculate the final zero or pair of zeros
            if (N < 2) {
                zeros[degPar.Degree - 1].re = -(p[1] / p[0]);
                // zeror[degPar.Degree - 1] = -(p[1]/p[0]);
                zeros[degPar.Degree - 1].im = 0;
                //zeroi[degPar.Degree - 1] = 0;
            } // End if (N < 2)
            else { // else N == 2
                qPar.li = qPar.lr = qPar.si = qPar.sr = 0.0;
                Quad_ak1(p[0], p[1], p[2], qPar);
                zeros[degPar.Degree - 2].re = qPar.sr;
                zeros[degPar.Degree - 2].im = qPar.si;
                zeros[degPar.Degree - 1].re = qPar.lr;
                zeros[degPar.Degree - 1].im = qPar.li;

//	   zeror[degPar.Degree - 2] = qPar.sr;
//	   zeroi[degPar.Degree - 2] = qPar.si;
//	   zeror[degPar.Degree - 1] = qPar.lr;
//	   zeroi[degPar.Degree - 1] = qPar.li;
            } // End else N == 2
            break;
        } // End if (N <= 2)

        // Find the largest and smallest moduli of the coefficients
        moduli_max = 0.0;
        moduli_min = Number.MAX_VALUE;

        for (i = 0; i < NN; i++) {
            x = Math.abs(p[i]);
            if (x > moduli_max)
                moduli_max = x;
            if ((x !== 0) && (x < moduli_min))
                moduli_min = x;
        } // End for i

        // Scale if there are large or very small coefficients
        // Computes a scale factor to multiply the coefficients of the polynomial. The scaling
        // is done to avoid overflow and to avoid undetected underflow interfering with the
        // convergence criterion.
        // The factor is a power of the base.

        sc = LO / moduli_min;

        if (((sc <= 1.0) && (moduli_max >= 10)) || ((sc > 1.0) && (Number.MAX_VALUE / sc >= moduli_max))) {
            sc = ((sc === 0) ? Number.MIN_VALUE : sc);
            l = Math.floor(Math.log(sc) / LB2 + 0.5);
            factor = Math.pow(2.0, l);
            if (factor !== 1.0) {
                for (i = 0; i < NN; i++)
                    p[i] *= factor;
            } // End if (factor != 1.0)
        } // End if (((sc <= 1.0) && (moduli_max >= 10)) || ((sc > 1.0) && (Number.MAX_VALUE/sc >= moduli_max)))

        // Compute lower bound on moduli of zeros

        for (var i = 0; i < NN; i++)
            pt[i] = Math.abs(p[i]);
        pt[N] = -(pt[N]);

        NM1 = N - 1;

        // Compute upper estimate of bound

        x = Math.exp((Math.log(-pt[N]) - Math.log(pt[0])) / N);

        if (pt[NM1] !== 0) {
            // If Newton step at the origin is better, use it
            xm = -pt[N] / pt[NM1];
            x = ((xm < x) ? xm : x);
        } // End if (pt[NM1] != 0)

        // Chop the interval (0, x) until ff <= 0

        xm = x;
        do {
            x = xm;
            xm = 0.1 * x;
            ff = pt[0];
            for (var i = 1; i < NN; i++)
                ff = ff * xm + pt[i];
        } while (ff > 0); // End do-while loop

        dx = x;

        // Do Newton iteration until x converges to two decimal places

        do {
            df = ff = pt[0];
            for (var i = 1; i < N; i++) {
                ff = x * ff + pt[i];
                df = x * df + ff;
            } // End for i
            ff = x * ff + pt[N];
            dx = ff / df;
            x -= dx;
        } while (Math.abs(dx / x) > 0.005); // End do-while loop

        bnd = x;

        // Compute the derivative as the initial K polynomial and do 5 steps with no shift

        for (var i = 1; i < N; i++)
            K[i] = (N - i) * p[i] / N;
        K[0] = p[0];

        aa = p[N];
        bb = p[NM1];
        zerok = ((K[NM1] === 0) ? 1 : 0);

        for (jj = 0; jj < 5; jj++) {
            cc = K[NM1];
            if (zerok) {
                // Use unscaled form of recurrence
                for (var i = 0; i < NM1; i++) {
                    j = NM1 - i;
                    K[j] = K[j - 1];
                } // End for i
                K[0] = 0;
                zerok = ((K[NM1] === 0) ? 1 : 0);
            } // End if (zerok)

            else { // else !zerok
                // Used scaled form of recurrence if value of K at 0 is nonzero
                t = -aa / cc;
                for (var i = 0; i < NM1; i++) {
                    j = NM1 - i;
                    K[j] = t * K[j - 1] + p[j];
                } // End for i
                K[0] = p[0];
                zerok = ((Math.abs(K[NM1]) <= Math.abs(bb) * DBL_EPSILON * 10.0) ? 1 : 0);
            } // End else !zerok

        } // End for jj

        // Save K for restarts with new shifts

        for (var i = 0; i < N; i++)
            temp[i] = K[i];

        // Loop to select the quadratic corresponding to each new shift

        for (jj = 1; jj <= 20; jj++) {

            // Quadratic corresponds to a double shift to a non-real point and its
            // complex conjugate. The point has modulus BND and amplitude rotated
            // by 94 degrees from the previous shift.

            xxx = -(sinr * yy) + cosr * xx;
            yy = sinr * xx + cosr * yy;
            xx = xxx;
            sr = bnd * xx;
            u = -(2.0 * sr);

            // Second stage calculation, fixed quadratic
            Fxshfr_ak1(DBL_EPSILON, MDP1, 20 * jj, sr, bnd, K, N, p, NN, qp, u, Fxshfr_Par);

            if (Fxshfr_Par.NZ !== 0) {

                // The second stage jumps directly to one of the third stage iterations and
                // returns here if successful. Deflate the polynomial, store the zero or
                // zeros, and return to the main algorithm.

                j = degPar.Degree - N;
                zeros[j].re = Fxshfr_Par.szr;
                zeros[j].im = Fxshfr_Par.szi;
//	   zeror[j] = Fxshfr_Par.szr;
//	   zeroi[j] = Fxshfr_Par.szi;
                NN = NN - Fxshfr_Par.NZ;
                N = NN - 1;
                for (var i = 0; i < NN; i++)
                    p[i] = qp[i];
                if (Fxshfr_Par.NZ !== 1) {
                    zeros[j + 1].re = Fxshfr_Par.lzr;
                    zeros[j + 1].im = Fxshfr_Par.lzi;
//		 zeror[j + 1] = Fxshfr_Par.lzr;
//		 zeroi[j + 1] = Fxshfr_Par.lzi;
                } // End if (NZ != 1)
                break;
            } // End if (NZ != 0)
            else { // Else (NZ == 0)

                // If the iteration is unsuccessful, another quadratic is chosen after restoring K
                for (var i = 0; i < N; i++)
                    K[i] = temp[i];

            } // End else (NZ == 0)

        } // End for jj

        // Return with failure if no convergence with 20 shifts
        if (jj > 20) {
            degPar.Degree -= N;
            break;
        } // End if (jj > 20)

    } // End while (N >= 1)

    // ============================ End Main Loop =============================================

    return;
}
// End of rpSolve