(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [];


(lib.AnMovieClip = function(){
	this.actionFrames = [];
	this.ignorePause = false;
	this.gotoAndPlay = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
	}
}).prototype = p = new cjs.MovieClip();
// symbols:
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop, this.reversed));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.round = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#990000").ss(1,1,1).p("AgTgUQAIgIALAAQAMAAAJAIQAIAJAAALQAAAMgIAJQgJAIgMAAQgLAAgIgIQgJgJAAgMQAAgLAJgJg");

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AgTAUQgJgIAAgMQAAgLAJgIQAIgJALAAQAMAAAIAJQAJAIAAALQAAAMgJAIQgIAJgMAAQgLAAgIgJg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-3.9,-3.9,7.8,7.8);


(lib.guideBox = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(1,1,1).p("AfQyvMAAAAlfMg+fAAAMAAAglfg");
	this.shape.setTransform(285.3,15.8,1,1,0,0,0,85.3,-104.2);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.guideBox, new cjs.Rectangle(-1,-1,402,242), null);


(lib.cubic = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#0000FF").s().p("Ag+A/IAAh9IB9AAIAAB9g");
	this.shape.setTransform(-0.0219,-0.0171,0.4512,0.4512,-44.8726);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.cubic, new cjs.Rectangle(-4,-4,8,8), null);


(lib.bluearrows = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#0000FF").s().p("AgoANIBRAAIgpBHgAgogMIAohHIApBHg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.bluearrows, new cjs.Rectangle(-4.1,-8.3,8.2,16.700000000000003), null);


(lib.bck_btn = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("EgmhABfIAAi9MBNDAAAIAAC9g");
	this.shape.setTransform(246,0,1,1,0,0,0,-0.6,0);
	this.shape._off = true;

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(3).to({_off:false},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-9.4,493.2,18.9);


(lib.guide1_2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.sq_bottom = new lib.cubic();
	this.sq_bottom.name = "sq_bottom";

	this.sq_top = new lib.cubic();
	this.sq_top.name = "sq_top";
	this.sq_top.setTransform(297.25,0);

	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#0000FF").ss(1,1,1).p("EgkgAAAMBJBAAA");
	this.shape.setTransform(151.6,0,0.6307,1,0,0,0,0.1,0);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.sq_top},{t:this.sq_bottom}]}).wait(1));

	// Layer_2
	this.instance = new lib.bck_btn();
	this.instance.setTransform(0.05,0,0.6013,1,0,0,0,0.1,0);
	new cjs.ButtonHelper(this.instance, 0, 1, 2, false, new lib.bck_btn(), 3);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4,-9.4,305.3,18.9);


(lib.guide1_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.cubic();
	this.instance.setTransform(470.35,0);

	this.instance_1 = new lib.cubic();

	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#0000FF").ss(1,1,1).p("Eg0jAAAMBpHAAA");
	this.shape.setTransform(0.15,0,0.6985,1,0,0,0,-336.2,0);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance_1},{t:this.instance}]}).wait(1));

	// Layer_2
	this.instance_2 = new lib.bck_btn();
	this.instance_2.setTransform(-0.6,0.35,0.955,1);
	new cjs.ButtonHelper(this.instance_2, 0, 1, 2, false, new lib.bck_btn(), 3);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4,-9.1,478.4,19);


(lib.Graphic = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_6
	this.xArrow_mc = new lib.bluearrows();
	this.xArrow_mc.name = "xArrow_mc";
	this.xArrow_mc.setTransform(3.05,158.6,1,1,90);

	this.yArrow_mc = new lib.bluearrows();
	this.yArrow_mc.name = "yArrow_mc";
	this.yArrow_mc.setTransform(78.05,158.6);

	this.xGuide_mc = new lib.guide1_2();
	this.xGuide_mc.name = "xGuide_mc";
	this.xGuide_mc.setTransform(0,29.3,1,1,-90);

	this.yGuide_mc = new lib.guide1_1();
	this.yGuide_mc.name = "yGuide_mc";
	this.yGuide_mc.setTransform(-30.25,0);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.yGuide_mc},{t:this.xGuide_mc},{t:this.yArrow_mc},{t:this.xArrow_mc}]}).wait(1));

	// Layer_8
	this.xValue1_txt = new cjs.Text("", "14px 'Arial'", "#0000FF");
	this.xValue1_txt.name = "xValue1_txt";
	this.xValue1_txt.lineHeight = 16;
	this.xValue1_txt.lineWidth = 186;
	this.xValue1_txt.parent = this;
	this.xValue1_txt.setTransform(184.35,-289.8);

	this.yValue1_txt = new cjs.Text("", "14px 'Arial'", "#0000FF");
	this.yValue1_txt.name = "yValue1_txt";
	this.yValue1_txt.lineHeight = 16;
	this.yValue1_txt.lineWidth = 186;
	this.yValue1_txt.parent = this;
	this.yValue1_txt.setTransform(184.35,-269.85);

	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(1,1,1).p("A3AlDMAuBAAAIAAKHMguBAAAg");
	this.shape.setTransform(279.1875,-272.0164,0.6846,0.6839);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFCC").s().p("A3AFEIAAqHMAuBAAAIAAKHg");
	this.shape_1.setTransform(279.1875,-272.0164,0.6846,0.6839);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape},{t:this.yValue1_txt},{t:this.xValue1_txt}]}).wait(1));

	// Layer_4
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000000").s().p("AKyWWQASgcAAgcQAAgLgCgLQgCgJgFgIIgJgSIAIAAQALAPAFAPQAFANgBAOQAAAPgFAPQgHAPgIALgAhnWRQgGgFAAgKIAKABQABAFADACQAEADAGAAQAIAAAEgDQAEgDABgFIABgNQgHAIgKAAQgNAAgHgKQgHgJAAgNQAAgJADgHQADgIAHgEQAFgEAJAAQALAAAHAJIAAgHIAJAAIAAA1QABAPgDAGQgDAGgGADQgHAEgKAAQgKAAgIgFgAhfVMQgFAFgBAMQABAMAFAFQAEAGAIAAQAHAAAFgGQAFgFAAgMQAAgMgFgFQgFgGgIAAQgGAAgFAGgAkEWWQgJgLgGgPQgFgPgBgPQAAgOAFgNQAFgPALgPIAHAAIgJASQgEAIgBAJQgDALAAALQAAAcARAcgAJ1V2QgIgJAAgPQAAgQAIgIQAIgJANAAQANAAAHAJQAJAIAAAQIgBACIguAAQAAALAFAFQAGAFAIAAQAFAAAFgDQADgDADgGIALABQgDAKgGAFQgIAFgKAAQgOAAgIgIgAJ+VLQgFAFAAAIIAiAAQgBgIgDgEQgFgGgIAAQgHAAgFAFgAIWV5QgGgFAAgIQAAgEACgEQACgEADgCIAIgEIAJgBQANgCAGgCIAAgCQAAgHgDgDQgEgDgIAAQgHAAgEACQgEADgBAHIgLgCQACgGADgEQAEgEAGgDQAFgCAJAAQAIAAAFACQAEACADADQADADAAAEIABAKIAAAOIAAASQABAEACAEIgLAAIgCgIQgGAFgFACQgFACgHAAQgKAAgFgFgAIqViQgHAAgDACQgCABgBACQgCACAAADQAAAEAEADQACADAHAAQAFAAAFgDQAFgCADgFQABgEAAgHIAAgDIgRAEgAHcV2QgIgJAAgPQAAgKADgIQAEgHAGgEQAIgEAIAAQAKAAAGAFQAGAFADAKIgLABQgBgGgEgDQgEgDgFAAQgIAAgFAGQgFAFAAANQAAAMAFAGQAEAFAJAAQAGAAAEgDQAEgEABgIIALABQgCALgHAGQgHAGgKAAQgNAAgIgIgAGgV5QgHgFgCgKIAKgBQABAGAFADQADADAIAAQAHAAADgCQAEgDAAgEQAAgEgDgCIgLgEIgQgFQgFgCgCgEQgCgDAAgFQAAgEACgEIAFgGIAHgDIAJgBQAHAAAGACQAFACADAEQADAEAAAGIgKABQgBgFgDgDQgDgCgGAAQgIAAgCACQgEADAAADIABAEIAFACIAJADIAQAFQAEACACADQADAEAAAFQAAAGgDAEQgDAFgGADQgGACgHAAQgNAAgFgFgAFCV2QgHgJAAgPQAAgKADgIQAEgHAGgEQAHgEAIAAQAKAAAHAFQAGAFACAKIgLABQgBgGgDgDQgFgDgEAAQgIAAgGAGQgEAFAAANQAAAMAEAGQAFAFAIAAQAGAAAEgDQAFgEAAgIIALABQgCALgHAGQgHAGgKAAQgNAAgIgIgAgnV5QgFgFAAgIQAAgEACgEQACgEADgCIAIgEIAJgBQANgCAGgCIAAgCQAAgHgDgDQgEgDgIAAQgHAAgEACQgDADgCAHIgKgCQABgGADgEQAEgEAFgDQAGgCAJAAQAHAAAFACQAEACADADQACADACAEIAAAKIAAAOIABASQAAAEACAEIgLAAIgBgIQgGAFgFACQgGACgGAAQgKAAgGgFgAgSViQgGAAgEACQgCABgCACQgBACAAADQAAAEADADQADADAGAAQAHAAAEgDQAFgCACgFQACgEAAgHIAAgDIgRAEgAipV2QgJgJABgPQAAgSAJgIQAIgHAMAAQANAAAHAJQAJAIAAAPQAAAMgEAHQgEAHgGADQgHAEgIAAQgOAAgHgIgAihVMQgGAGAAAMQAAAMAGAGQAFAFAIAAQAIAAAEgFQAGgGAAgNQAAgLgGgGQgEgGgIAAQgIAAgFAGgABjV8IgFgFQgBgDABgJIAAgkIgJAAIAAgIIAJAAIAAgQIAKgGIAAAWIAKAAIAAAIIgKAAIAAAkIAAAGIACACIAEABIAEgBIACAKIgIABQgGAAgDgCgAJVV9IAAhWIALAAIAABWgAEjV9IAAg+IALAAIAAA+gAEJV9IAAgnIgBgKIgDgEQgDgCgEAAQgGAAgEAFQgFAEAAAKIAAAkIgKAAIAAgpQgBgHgCgDQgDgEgFAAQgFAAgEADQgEACgCAEQgBAFAAAIIAAAhIgKAAIAAg+IAJAAIAAAIQADgEAFgDQAFgDAFAAQAHAAAFADQAEADACAFQAIgLALAAQAKAAAFAFQAEAFAAALIAAArgAClV9IAAgoQAAgIgDgDQgEgEgGAAQgFAAgEADQgEACgCAEQgBAEAAAIIAAAiIgLAAIAAhWIALAAIAAAfQAHgJALAAQAHAAAFADQAFADADAEQABAFAAAJIAAAogABBV9IAAg+IALAAIAAA+gAAZV9IAAg+IAJAAIAAAJQAEgHADgCQADgCAEAAQAFAAAFAEIgDAJQgEgCgEAAQgDAAgDACQgDACgBAEQgBAFAAAHIAAAhgAjvV9IAAhWIALAAIAABMIArAAIAAAKgAEjUzIAAgMIALAAIAAAMgABBUzIAAgMIALAAIAAAMgAHVT9QARgdAAgcQAAgLgDgLQgCgIgDgJIgJgRIAHAAQALAPAFAOQAEANABAOQAAAQgHAPQgFAOgJAMgAEAT9QgIgMgHgOQgFgPAAgQQgBgOAFgNQAFgOALgPIAIAAIgJARQgEAIgDAJQgCALAAALQAAAcASAdgACMTcQgHgIgBgPQABgQAHgJQAJgIANAAQAMAAAIAIQAIAJAAAPIAAADIguAAQAAAKAFAGQAGAFAHAAQAGAAAEgDQAEgDACgHIAMACQgDAJgHAFQgHAGgLAAQgNAAgJgJgACVSxQgEAFgBAIIAiAAQAAgIgEgEQgEgGgIAAQgHAAgGAFgAG7TjIAAgmQgBgGgBgDQgBgDgDgCQgEgCgEAAQgGAAgFAEQgFAEAAAMIAAAiIgLAAIAAg+IAKAAIAAAJQAHgKANAAQAGAAAEACQAFACACADQACADACAFIAAAKIAAAmgAF4TjIAAg+IALAAIAAA+gAFdTjIAAgnIgBgJQAAgDgDgCQgCgBgFAAQgGAAgEAEQgFAEABAKIAAAkIgLAAIAAgoQAAgHgDgEQgDgDgFAAQgEAAgFACQgDACgCAFQgCAEAAAJIAAAgIgKAAIAAg+IAJAAIAAAJQAEgFAEgDQAFgCAGAAQAHAAAFACQAEADACAGQAHgLAMAAQAJAAAFAFQAFAFAAALIAAAqgABuTjIAAgnIgBgJQgBgDgDgCQgCgBgEAAQgHAAgEAEQgEAEAAAKIAAAkIgLAAIAAgoQAAgHgDgEQgDgDgFAAQgEAAgEACQgEACgCAFQgCAEABAJIAAAgIgLAAIAAg+IAKAAIAAAJQADgFAEgDQAFgCAGAAQAHAAAFACQAEADACAGQAHgLAMAAQAKAAAEAFQAFAFAAALIAAAqgAAKTjIAAg+IAKAAIAAA+gAgjTjIAAhMIgdAAIAAgKIBEAAIAAAKIgcAAIAABMgAF4SZIAAgMIALAAIAAAMgAAKSZIAAgMIAKAAIAAAMgEAjZAQJQgKgMAAgdQABgRADgLQAEgLAHgGQAHgGALAAQAIAAAGADQAGAEAEAGQAEAGACAJQACAIAAAPQAAASgDALQgEALgHAGQgHAFgLAAQgPAAgIgKgEAjiAO+QgGAKAAAYQAAAZAGAIQAGAIAIAAQAJAAAFgIQAGgIAAgZQAAgYgGgJQgFgIgJAAQgIAAgGAHgATtQJQgKgMABgdQgBgRAEgLQADgLAIgGQAHgGALAAQAIAAAGADQAGAEAEAGQAEAGADAJQACAIAAAPQgBASgDALQgEALgHAGQgHAFgLAAQgOAAgJgKgAT3O+QgHAKAAAYQAAAZAGAIQAGAIAIAAQAIAAAHgIQAFgIAAgZQAAgYgFgJQgHgIgIAAQgJAAgEAHgAECQJQgKgMAAgdQABgRADgLQADgLAIgGQAHgGALAAQAIAAAGADQAGAEAEAGQAEAGACAJQACAIAAAPQAAASgDALQgEALgHAGQgHAFgLAAQgPAAgIgKgAELO+QgGAKAAAYQAAAZAGAIQAGAIAIAAQAJAAAFgIQAGgIAAgZQAAgYgGgJQgFgIgJAAQgIAAgGAHgArOQJQgKgMAAgdQAAgRAEgLQADgLAHgGQAHgGALAAQAIAAAHADQAGAEAEAGQADAGADAJQACAIAAAPQAAASgEALQgDALgIAGQgGAFgMAAQgOAAgIgKgArFO+QgGAKgBAYQAAAZAHAIQAFAIAIAAQAJAAAGgIQAGgIgBgZQABgYgGgJQgGgIgJAAQgIAAgFAHgEAijAQSIAAhPQgEAFgIAEQgHAEgFACIAAgMQAKgFAIgGQAIgHADgHIAIAAIAABlgAS4QSIAAhPQgFAFgIAEQgHAEgGACIAAgMQALgFAIgGQAHgHADgHIAIAAIAABlgADMQSIAAhPQgEAFgIAEQgHAEgFACIAAgMQAKgFAIgGQAIgHADgHIAIAAIAABlgAsEQSIAAhPQgFAFgHAEQgHAEgGACIAAgMQAKgFAJgGQAHgHADgHIAIAAIAABlgA7JQSIAAhPQgFAFgHAEQgHAEgGACIAAgMQAKgFAJgGQAHgHADgHIAIAAIAABlgAU2PhQgGgFgBgIIAJgBQABAHADADQAEADAEAAQAFAAAEgEQAFgEAAgGQgBgFgDgEQgDgDgHAAIgFAAIABgHIABAAQAFAAAEgCQAEgDABgFQgBgFgDgDQgDgDgEAAQgFAAgDADQgDADgBAGIgIgBQACgIAFgFQAFgEAHAAQAGAAAEACQAFACACAEQADAEAAAFQAAAEgDADQgCAEgEACQAFABAEAFQADAEAAAGQAAAJgGAFQgGAGgKAAQgIAAgGgFgEAk1APlIAAgPIgdAAIAAgIIAfgqIAGAAIAAAqIAIAAIAAAIIgIAAIAAAPgEAkgAPOIAVAAIAAgdgAFEPlQgBgDABgCQACgFADgEQAEgEAHgGQALgJADgFQAEgFAAgEQAAgFgEgDQgDgEgFAAQgGAAgEAEQgDADAAAHIgIgBQAAgKAGgEQAFgFAKAAQAJAAAGAFQAFAFAAAIIgCAIIgEAIIgNALIgKAIIgCAFIAfAAIAAAHgA9dNHQgKgMAAgdQABgRADgLQAEgLAHgGQAHgGALAAQAIAAAGADQAGAEAEAGQAEAGACAJQACAIAAAPQABASgEALQgDALgIAGQgHAFgLAAQgPAAgIgKgA9UL8QgGAKAAAYQAAAZAGAIQAFAIAJAAQAJAAAFgIQAGgIAAgZQAAgYgGgJQgFgIgJAAQgJAAgFAHgA/SNHQgKgMAAgdQABgRADgLQAEgLAHgGQAHgGALAAQAIAAAGADQAGAEAEAGQAEAGACAJQACAIAAAPQABASgEALQgDALgIAGQgHAFgLAAQgPAAgIgKgA/JL8QgGAKAAAYQAAAZAGAIQAFAIAJAAQAJAAAFgIQAGgIAAgZQAAgYgGgJQgFgIgJAAQgJAAgFAHgA73NQIAAhPQgEAFgIAEQgGAEgGACIAAgMQAKgFAIgGQAIgHADgHIAIAAIAABlgA+HNQIAAgOIAOAAIAAAOgEgkvADPQgLgFgFgKQgFgKAAgNQAAgJACgIQADgHAGgEQAGgFAIgCIADAKQgHACgDADQgEADgDAFQgCAGAAAGQABAIACAGQACAFAEAEQAEADAFACQAHAEAKAAQALAAAIgEQAIgEADgIQAEgHAAgJQAAgHgDgHQgDgHgCgEIgQAAIAAAZIgLAAIAAgkIAgAAQAGAIAEAJQADAJABAJQgBANgFAKQgGALgKAFQgKAFgMAAQgNAAgLgFgAZIC9QgKgGgFgNQgFgMgBgPQAAgPAHgMQAFgMAMgGQAKgGAOAAQAPAAAKAIQAKAIAFAOIgOADQgDgLgHgFQgHgFgKAAQgLA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AIQgIAIgQAAQgPAAgJgIgEgkegGdQgGAFAAAIQAAAHAFAFQAFAFAIABIAAgjQgIABgEADgAYDmEQgFgGgBgIQABgIAFgFQAGgGAHAAQAIAAAGAGQAFAFAAAIQAAAIgFAGQgGAFgIAAQgHAAgGgFgAYImaQgEADABAFQgBAFAEADQAEAEAEAAQAFAAAEgEQACgDAAgFQAAgFgCgDQgEgDgFAAQgEAAgEADgEgiRgGYIAAgKIA+AAIAAAKgEgiqgGYIAAgKIAMAAIAAAKgEgiEgGyQgIgEgEgGQgDgHAAgIQAAgKAFgHQAFgGAKgCIABAKQgGACgDADQgDAEAAAFQAAAIAFAFQAGAFAMAAQANAAAFgFQAGgEAAgIQAAgGgEgEQgDgFgJgBIACgKQALACAGAHQAGAHAAAKQAAANgIAHQgJAIgQAAQgKAAgHgDgEgkrgGzIAAgIIgQAAIgGgKIAWAAIAAgLIAIAAIAAALIAlAAIAFgBIACgBIABgEIAAgFIAJgBIABAIQAAAGgCADIgFAEQgCABgKAAIgkAAIAAAIgEgkkgHfQgJgIABgNQgBgMAJgIQAJgIAPAAIACAAIAAAuQALAAAFgFQAGgGAAgHQAAgGgEgEQgDgEgGgDIACgLQAJADAFAHQAFAHABALQAAANgJAIQgIAIgQAAQgPAAgJgIgEgkegIBQgGAFAAAIQAAAHAFAFQAFAFAIABIAAgjQgIABgEADgEghogIWQAHgBADgEQADgEAAgHQAAgHgCgEQgEgDgDAAQgEAAgDADIgDALIgFAQQgCAEgEACQgEADgEAAQgFAAgDgCIgGgFIgDgHIgBgJQAAgHACgGQACgGADgCQAFgDAGgBIABALQgFAAgDAEQgCADAAAGQAAAHACAEQADADACAAIAFgCIACgEIADgJIAEgQQADgEADgDQAEgCAFAAQAGAAAEADQAFADADAGQACAGAAAHQAAAMgFAGQgFAHgKACgEgkrgIdIAAgJIAJAAQgGgEgCgDQgCgDAAgEQAAgFADgFIAJADQgBAEAAAEQAAADABADQADADADABQAGACAGAAIAhAAIAAAKgEgiEgJMQgIgDgEgHQgDgHAAgIQAAgKAFgGQAFgHAKgCIABALQgGABgDAEQgDAEAAAFQAAAIAFAFQAGAFAMAAQANAAAFgFQAGgFAAgIQAAgGgEgEQgDgEgJgBIACgLQALACAGAHQAGAHAAAKQAAANgIAIQgJAIgQAAQgKAAgHgEgEgkngJqQgOgFgPgLIAAgIIARAKQAIADAJACQALADALAAQAcAAAcgSIAAAIQgLAIgOAGQgQAGgPAAQgOAAgNgEgEghsgKGQgEgCgDgEIgDgHIgBgKQgCgMgCgGIgDAAQgGAAgDADQgDAEAAAIQAAAHACAEQADADAHACIgCAKQgGgBgEgEQgEgDgDgGQgCgGAAgIQAAgIACgFQABgFADgCQAEgDADgBIAKAAIAPAAIASgBQAEAAAEgCIAAALIgIACQAFAGACAFQACAFAAAHQAAAKgFAFQgFAGgIAAQgEAAgEgCgEghugKeQAAAGACADQABADACABQACACADAAQAEAAADgEQACgDABgGQgBgGgCgFQgDgEgEgDQgEgBgHAAIgEAAIAFARgEgkrgKOIAAgKIAJAAQgFgDgDgEQgCgFAAgGQAAgHACgFQADgEAGgCQgLgHAAgMQAAgKAEgEQAFgFAMAAIAqAAIAAAKIgnAAIgKABIgEAEQgBACAAAEQgBAHAFAEQAEAEAKAAIAkAAIAAALIgpAAQgGAAgEACQgDADAAAGQAAAEACAEQACAEAFACQAEABAIAAIAhAAIAAALgEgiqgLKIAAgKIBXAAIAAAKgEgiKgLpQgJgIAAgNQAAgNAJgIQAIgIAPAAIADABIAAAuQAKgBAGgFQAFgFAAgIQAAgGgDgEQgDgEgHgCIACgLQAKACAEAHQAGAHAAALQAAAOgIAIQgJAIgPAAQgQAAgIgIgEgiFgMLQgFAFAAAIQAAAHAEAFQAFAFAJAAIAAgiQgIAAgFAEgEgkrgLyIAAgKIAJAAQgFgDgDgEQgCgFAAgGQAAgHACgFQADgEAGgCQgLgHAAgMQAAgKAEgEQAFgFAMAAIAqAAIAAAKIgnAAIgKABIgEAEQgBACAAAEQgBAHAFAEQAEAEAKAAIAkAAIAAALIgpAAQgGAAgEACQgDADAAAGQAAAEACAEQACAEAFACQAEABAIAAIAhAAIAAALgEghzgM4QgLAAgKACQgJACgIAEIgSAJIAAgHQAPgLAOgFQANgFAOAAQAQAAAPAGQAOAGAMAJIAAAHQgdgRgcAAgEgkMgNnQgLAAgLACQgIACgJAEIgRAJIAAgHQAPgLAOgFQANgFAOAAQAPA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AGgGAMAAQAHAAAGADQAGAEAFAGQAEAGACAJQACAIAAAPQAAASgEALQgDALgHAGQgIAFgKAAQgPAAgJgKgAhA2DQgHAKABAYQAAAZAFAIQAGAIAJAAQAIAAAGgIQAFgIAAgZQAAgYgFgJQgGgIgIAAQgJAAgFAHgAiX01QgJgIgBgMIANgCQABAKAGAFQAEAEAIAAQAJAAAGgGQAGgHAAgLQAAgLgFgGQgHgGgJAAQgGAAgFADQgFADgDAEIgLgCIAKgzIAxAAIAAAMIgoAAIgFAbQAJgHAKAAQANAAAJAJQAJAJAAAPQABANgJAKQgKAMgQAAQgOAAgIgHgAjm02QgJgJAAgNQAAgKAEgHQAFgGAKgDQgIgCgDgGQgFgFAAgHQABgLAHgHQAJgIANAAQANAAAIAIQAHAHABALQgBAHgDAFQgEAGgHACQAJADAFAHQAFAHgBAJQABANgKAJQgIAIgPAAQgPAAgJgIgAjd1bQgGAGAAAJQAAAFADAFQADAFAEADQAFACAGAAQAJAAAFgFQAGgGAAgJQAAgJgGgFQgGgGgIAAQgJAAgGAFgAja2FQgFAEABAHQgBAHAFAEQAFAFAHAAQAHAAAFgFQAEgEAAgHQAAgHgEgEQgFgFgHAAQgIAAgEAFgAAD11QgFgFAAgIQAAgIAFgGQAFgFAHAAQAJAAAFAFQAGAGgBAIQABAIgGAFQgFAGgJAAQgHAAgFgGgAAH2KQgDADAAAFQAAAFADADQAEADAFAAQAFAAADgDQADgDAAgFQAAgFgDgDQgDgEgFAAQgFAAgEAEg");
	this.shape_2.setTransform(172.45,-86.025);

	this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(1));

	// Layer_1
	this.guideBox = new lib.guideBox();
	this.guideBox.name = "guideBox";
	this.guideBox.setTransform(0,-240);

	this.instance = new lib.round("synched",0);
	this.instance.setTransform(345.05,-230.9);

	this.instance_1 = new lib.round("synched",0);
	this.instance_1.setTransform(345.05,-180.1);

	this.instance_2 = new lib.round("synched",0);
	this.instance_2.setTransform(345.05,-146.9);

	this.instance_3 = new lib.round("synched",0);
	this.instance_3.setTransform(345.05,-95.3);

	this.instance_4 = new lib.round("synched",0);
	this.instance_4.setTransform(299.5,-80.45);

	this.instance_5 = new lib.round("synched",0);
	this.instance_5.setTransform(247.55,-224.35);

	this.instance_6 = new lib.round("synched",0);
	this.instance_6.setTransform(247.55,-209.1);

	this.instance_7 = new lib.round("synched",0);
	this.instance_7.setTransform(247.55,-166.9);

	this.instance_8 = new lib.round("synched",0);
	this.instance_8.setTransform(247.55,-110.95);

	this.instance_9 = new lib.round("synched",0);
	this.instance_9.setTransform(247.55,-64.25);

	this.instance_10 = new lib.round("synched",0);
	this.instance_10.setTransform(99.05,-176.9);

	this.instance_11 = new lib.round("synched",0);
	this.instance_11.setTransform(99.05,-146.6);

	this.instance_12 = new lib.round("synched",0);
	this.instance_12.setTransform(145.9,-201.35);

	this.instance_13 = new lib.round("synched",0);
	this.instance_13.setTransform(145.9,-171.05);

	this.instance_14 = new lib.round("synched",0);
	this.instance_14.setTransform(145.9,-118.7);

	this.instance_15 = new lib.round("synched",0);
	this.instance_15.setTransform(145.9,-73.95);

	this.instance_16 = new lib.round("synched",0);
	this.instance_16.setTransform(145.9,-23.05);

	this.instance_17 = new lib.round("synched",0);
	this.instance_17.setTransform(45.6,-136.65);

	this.instance_18 = new lib.round("synched",0);
	this.instance_18.setTransform(46.05,-118.75);

	this.instance_19 = new lib.round("synched",0);
	this.instance_19.setTransform(47.9,-78.4);

	this.instance_20 = new lib.round("synched",0);
	this.instance_20.setTransform(47.9,-37.4);

	this.instance_21 = new lib.round("synched",0);
	this.instance_21.setTransform(47.9,-1.35);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#000000").s().p("APjSvIAAh5IAKAAIAAB5gAgESvIAAh5IAJAAIAAB5gAvsSvIAAh5IAKAAIAAB5gAPjw1IAAh5IAKAAIAAB5gAgEw1IAAh5IAJAAIAAB5gAvsw1IAAh5IAKAAIAAB5g");
	this.shape_3.setTransform(200.5,-119.9);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("#990000").ss(2,1,1).p("AStnsQmlAukYA1QkZA1jyBlQjzBkkJCsQkICtmNEf");
	this.shape_4.setTransform(147.585,-175.6625,1.0203,1);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f().s("#990000").ss(2,1,1).p("A63JpQFMivIwkqQHDjpFIiFQGQiiGShcQG2hlIQgn");
	this.shape_5.setTransform(200.9264,-170.625,1.0203,1);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f().s("#990000").ss(2,1,1).p("A6YI9QegzwWRCD");
	this.shape_6.setTransform(197.7381,-122.2544,1.0203,1);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f().s("#990000").ss(2,1,1).p("A77KeMA33gU7");
	this.shape_7.setTransform(207.8004,-96.5625,1.0203,1);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f().s("#990000").ss(2,1,1).p("A6LIeMA0XgQ7");
	this.shape_8.setTransform(219.1118,-54.8,1.0203,1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.instance_21},{t:this.instance_20},{t:this.instance_19},{t:this.instance_18},{t:this.instance_17},{t:this.instance_16},{t:this.instance_15},{t:this.instance_14},{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_10},{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance},{t:this.guideBox}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Graphic, new cjs.Rectangle(-68.9,-295.1,513,462.1), null);


// stage content:
(lib.fig_7_25 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_3
	this.graphic = new lib.Graphic();
	this.graphic.name = "graphic";
	this.graphic.setTransform(107.5,316.4,1,0.9999);

	this.timeline.addTween(cjs.Tween.get(this.graphic).wait(1));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(342.6,221.8,209,261.5);
// library properties:
lib.properties = {
	id: '20B82716D99E0B42AD92EC887E4E26BE',
	width: 600,
	height: 400,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['20B82716D99E0B42AD92EC887E4E26BE'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused || stageChild.ignorePause){
			stageChild.syncStreamSounds();
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;
