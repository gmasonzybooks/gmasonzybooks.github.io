var canvas, stage, exportRoot, anim_container, dom_overlay_container, fnStartAnimation;

var numberGraph = 1;
var xValueMax = [4];
var xValueMin = [0];
//Stress MPA
var yValueMax = [2];
var yValueMin = [0];

var xGuidePrecision = 100;
var yGuidePrecision = 10;
var xLabel = ["Grain diameter"];
var yLabel = ["Time"];
var xUnit = ["mm"];
var yUnit = ["min"];
//var xFactor = [1, 1];
//var yFactor = [145.0377, 145.0377];
var stepYGuide = 1;
var stepXGuide = 1;
var xScaleWidth = [400];
var yScaleHeight = [240];
var guideBoxSize = [240, 400];
var stageWidth = 600;
var stageHeight = 400;
//var log20 = 1.30103;
// height, width graphic0,1
//~~~~~~~~~~~~~don't change this~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var xScale = [];
var yScale = [];
var valueX = [];
var valueY = [];

var nGraph = 0;
var canvas, stage, exportRoot, anim_container, dom_overlay_container, fnStartAnimation;
var canvas, stage, exportRoot, anim_container, dom_overlay_container, fnStartAnimation;

function init() {
	canvas = document.getElementById("canvas");
	anim_container = document.getElementById("animation_container");
	dom_overlay_container = document.getElementById("dom_overlay_container");
	var comp = AdobeAn.getComposition("20B82716D99E0B42AD92EC887E4E26BE");
	var lib = comp.getLibrary();
	handleComplete({}, comp);
	
// Added resize 
window.onresize = function() {
		onResize();
	}
}

function handleComplete(evt, comp) {
	//This function is always called, irrespective of the content. You can use the variable "stage" after it is created in token create_stage.
	var lib = comp.getLibrary();
	var ss = comp.getSpriteSheet();
	exportRoot = new lib.fig_7_25();
	stage = new lib.Stage(canvas);
	stage.enableMouseOver();
	//Registers the "tick" event listener.
	fnStartAnimation = function () {
		stage.addChild(exportRoot);
		createjs.Ticker.framerate = lib.properties.fps;
		createjs.Ticker.addEventListener("tick", stage);
	};
	//Code to support hidpi screens and responsive scaling.
	AdobeAn.makeResponsive(true, 'both', true, 1, [canvas, anim_container, dom_overlay_container]);
	AdobeAn.compositionLoaded(lib.properties.id);
	fnStartAnimation();
	initActivity();
}

function initActivity() {
	document.addEventListener("keydown", onKeyDown);
	// stage.addEventListener('keydown', onKeyDown);
	guideBox = exportRoot.graphic.guideBox;
	xScale[0] = (xValueMax[0] - xValueMin[0]) / xScaleWidth[0];
	yScale[0] = (yValueMax[0] - yValueMin[0]) / yScaleHeight[0];

	exportRoot.graphic.xValue1_txt.text = xLabel[0] + " = 0";
	exportRoot.graphic.yValue1_txt.text = yLabel[0] + " = 0";

	xGuide = exportRoot.graphic.xGuide_mc;
	xGuide.name = "xGuide";
	xGuide.addEventListener("mousedown", guidePress);

	onResize();

	yGuide = exportRoot.graphic.yGuide_mc;
	yGuide.name = "yGuide";
	yGuide.addEventListener("mousedown", guidePress);
	xArrow = exportRoot.graphic.xArrow_mc;
	yArrow = exportRoot.graphic.yArrow_mc;
	xArrow.visible = false;
	yArrow.visible = false;
	guideBox.height = guideBoxSize[0];
	guideBox.width = guideBoxSize[1];
	exportRoot.graphic.xValue1_txt.text = "Grain diameter =  0.01 mm";
	exportRoot.graphic.yValue1_txt.text = "Time = 1 min";

}

function guidePress(eObj) {
	// console.log("guidePress");
	eObj.nativeEvent.preventDefault();
	// console.log(eObj.currentTarget.name);
	var oxis = eObj.currentTarget.name.charAt(0);
	// console.log("oxis " + oxis);
	mouse_press = true;
	exportRoot.graphic.addChild(eObj.currentTarget);

	switch (oxis) {
		case "x":
			// console.log("switch x");
			startY = xGuide.y;
			xArrow.visible = true;
			xArrow.x = (eObj.stageX / stageScale - exportRoot.graphic.x);
			xArrow.y = (eObj.stageY / stageScale - exportRoot.graphic.y);

			break;
		case "y":
			// console.log("switch y");
			startX = yGuide.x;
			yArrow.visible = true;
			yArrow.x = (eObj.stageX / stageScale - exportRoot.graphic.x);
			yArrow.y = (eObj.stageY / stageScale - exportRoot.graphic.y);
			//console.log(xArrow.y);
			break;
		default:
			//
			break;
	}
	eObj.currentTarget.addEventListener("pressmove", dragMove);
	eObj.currentTarget.addEventListener("pressup", MouseUp);
	stage.update();
}

function dragMove(eObj) {
	eObj.nativeEvent.preventDefault();
	var a = nGraph;
	var xtop = -269;
	var ytop = 440;
	var oxis = eObj.currentTarget.name.charAt(0);
	eObj.nativeEvent.preventDefault();
	switch (oxis) {
		case "x":
			// console.log("x: ", startY, eObj.stageX, stageScale, exportRoot.graphic.x);
			eObj.currentTarget.y = startY;
			eObj.currentTarget.x = (eObj.stageX / stageScale - exportRoot.graphic.x);
			xArrow.x = (eObj.stageX / stageScale - exportRoot.graphic.x);
			xArrow.y = (eObj.stageY / stageScale - exportRoot.graphic.y);

			if (xArrow.y > xGuide.y) {
				xArrow.y = xGuide.y;
			}
			if (xArrow.y <= xtop) {
				xArrow.y = xtop;
			}
			boundary("x");
			calculation("x");
			break;
		case "y":
			// console.log(startX, eObj.stageY, stageScale, exportRoot.graphic.y);
			eObj.currentTarget.x = startX;
			eObj.currentTarget.y = (eObj.stageY / stageScale - exportRoot.graphic.y);
			yArrow.x = (eObj.stageX / stageScale - exportRoot.graphic.x);
			yArrow.y = (eObj.stageY / stageScale - exportRoot.graphic.y);

			if (yArrow.x < yGuide.x) {
				yArrow.x = yGuide.x;
			}
			if (yArrow.x >= ytop) {
				yArrow.x = ytop;
			}
			boundary("y");
			calculation("y");
			break;
		default:
			//
			break;
	}
}

function MouseUp(eObj) {
	eObj.nativeEvent.preventDefault();
	mouse_press = false;
	var a = Number(eObj.currentTarget.name.charAt(6));
	xArrow.visible = false;
	yArrow.visible = false;
}

function calculation(oxis) {
	// console.log("calculation");
	var powerX;
	var deltaPowerX;
	var txtX = exportRoot.graphic.xValue1_txt;
	var txtY = exportRoot.graphic.yValue1_txt;

	loc3 = xGuide.x * xScale[0];
	// console.log(xGuide.x,yGuide.y);
	loc2 = Math.round(100 * Math.pow(10, loc3)) / 100;
	loc4 = (-yGuide.y) * 0.00997506234413965 - 2;
	//loc4 = 2 * 2 - 2;
	loc5 = Math.round(1000 * Math.pow(10, loc4)) / 1000;

	switch (oxis) {
		case "y":
			txtX.text = xLabel[0] + " = " + loc5 + " " + xUnit[0];
			//console.log(xGuide.x," ",powerX)
			break;
		case "x":
			txtY.text = yLabel[0] + " = " + loc2 + " " + yUnit[0];
			break;
	}
}

function boundary(oxis) {
	switch (oxis) {
		case "x":
			if (xGuide.x < guideBox.x) {
				xGuide.x = guideBox.x;
				xArrow.x = guideBox.x;
			}
			if (xGuide.x > guideBox.x + guideBox.width) {
				xGuide.x = guideBox.x + guideBox.width;
				xArrow.x = guideBox.x + guideBox.width;
			}
			break;

		case "y":
			// console.log(Math.abs(yGuide.y ), guideBox.y);
			if (Math.abs(yGuide.y) > Math.abs(guideBox.y)) {
				yGuide.y = guideBox.y;
				yArrow.y = guideBox.y;
			}
			// console.log(yGuide.y, guideBox.y, guideBox.height);

			if (yGuide.y > 0) {
				yGuide.y = 0;
				yArrow.y = 0;
			}
			break;
	}
}

function onKeyDown(e) {
	var key = e.keyCode;
	// console.log(e.code, e.keyCode);
	switch (key) {
		case 37:
		case 100:
			xGuide.x -= stepXGuide;
			// console.log('LEFT');
			break;
		case 38:
		case 104:
			yGuide.y -= stepYGuide;
			// console.log('UP');
			break;
		case 39:
		case 102:
			xGuide.x += stepXGuide;
			// console.log('RIGHT');
			break;
		case 40:
		case 98:
			yGuide.y += stepYGuide;
			// console.log('DOWN');
			break;
		default:
			break;
	}

	boundary("x");
	calculation("x");
	boundary("y");
	calculation("y");

}

function onResize() {
	// console.log("onResize");
	// browser viewport size
	var w = window.innerWidth;
	var h = window.innerHeight;
	// stage dimensions
	var ow = stageWidth;
	// stage width
	var oh = stageHeight;
	// stage height
	stageScale = Math.min(w / ow, h / oh);
	stage.scaleX = stageScale;
	stage.scaleY = stageScale;
	// adjust canvas size
	stage.canvas.width = ow * stageScale;
	stage.canvas.height = oh * stageScale;
	// console.log("stageScale ", stageScale);
	stage.update();
}
