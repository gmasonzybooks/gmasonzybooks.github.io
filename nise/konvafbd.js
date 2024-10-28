
var _rot = 0;
var _xShift = 110
const xrot = 60.0*Math.PI/180.0 //0.3

// model = [x,y,z,  x,y,z,  x,y,z ...]
dishbackpts = [
   0, 95, -5,
   70, 70, -5,
   95, 0, -5,
   70, -70, -5,
   0, -95, -5,
   -70, -70, -5,
   -95, 0, -5,
   -70, 70, -5,
   0, 95, -5,

   0, 95, -10,
   70, 70, -10,
   95, 0, -10,
   70, -70, -10,
   0, -95, -10,
   -70, -70, -10,
   -95, 0, -10,
   -70, 70, -10,
   0, 95, -10,

   0, 95, -15,
   70, 70, -15,
   95, 0, -15,
   70, -70, -15,
   0, -95, -15,
   -70, -70, -15,
   -95, 0, -15,
   -70, 70, -15,
   0, 95, -15,
   
   0, 95, -20,
   70, 70, -20,
   95, 0, -20,
   70, -70, -20,
   0, -95, -20,
   -70, -70, -20,
   -95, 0, -20,
   -70, 70, -20,
   0, 95, -20,

   // 0, 65, -30,
   // 40, 40, -30,
   // 65, 0, -30,
   // 40, -40, -30,
   // 0, -65, -30,
   // -40, -40, -30,
   // -65, 0, -30,
   // -40, 40, -30,
   // 0,65,-30,

   // 0, 75, -20,
   // 45, 45, -20,
   // 75, 0, -20,
   // 45, -45, -20,
   // 0, -75, -20,
   // -45, -45, -20,
   // -75, 0, -20,
   // -45, 45, -20

]


dish2pts = [
   0, 10, -10,
   7, 7, -10,
   10, 0, -10,
   7, -7, -10,
   0, -10, -10,
   -7, -7, -10,
   -10, 0, -10,
   -7, 7, -10
]

// dish2pts = [
//    0, 95, -10,
//    70, 70, -10,
//    95, 0, -10,
//    70, -70, -10,
//    0, -95, -10,
//    -70, -70, -10,
//    -95, 0, -10,
//    -70, 70, -10
// ]

dishpts = [
   0, 100, 0,
   72, 72, 0,
   100, 0, 0,
   72, -72, 0,
   0, -100, 0,
   -72, -72, 0,
   -100, 0, 0,
   -72, 72, 0
]

tripodpts = [
   0, 0, 100,
   0, 50, 0,
   0, 40, 0,
   0, 0, 100,

   0, -50, 0,
   0, -40, 0,
   0, 0, 100,

   -50, 0, 0,
   -40, 0, 0,
   0, 0, 100,

   50, 0, 0,
   40, 0, 0,
   0, 0, 100,
]

tippts = [
   5, 5, 100,
   -5, 5, 100,
   -5, -5, 100,
   5, -5, 100
]

edgepts = []
for(let deg=0; deg<=360; deg+=30){
   let r = 100
   let r2 = 95
   let rad = deg*Math.PI/180.0
   let del = Math.PI/180.0*15.0

   edgepts.push(r*Math.cos(rad), r*Math.sin(rad),0)
   edgepts.push(r2*Math.cos(rad+del), r2*Math.sin(rad+del),-15)
}

gearpts1 = makeGear(80,15,false)
gearpts2 = makeGear(40,30,false)

function makeGear(Rout, delA, offset) {
   // gear teeth ratio baked into the function
   // delA = 80.0/Rout*30.0
   var del = delA/2.0*Math.PI/180.0 // Math.PI/180.0*5.0  // every 5 degrees
   var start = 0
   if (offset){
      start = del
   }
   var gearpts = []
   for(let deg=start; deg<=360-delA; deg+=delA){  // 350,10
      let ro = Rout  // 100
      let ri = Rout-5   // 95
      let rad = deg*Math.PI/180.0
      gearpts.push(ro*Math.cos(rad), ro*Math.sin(rad),0)
      gearpts.push(ri*Math.cos(rad), ri*Math.sin(rad),0)
      gearpts.push(ri*Math.cos(rad+del), ri*Math.sin(rad+del),0)
      gearpts.push(ro*Math.cos(rad+del), ro*Math.sin(rad+del),0)
      gearpts.push(ro*Math.cos(rad+del+del), ro*Math.sin(rad+del+del),0)
   }
   return gearpts
}

function rotateX(model, rot) {
   // rotate about X in place
   // 1 0 0
   // 0 c -s
   // 0 s c
   var sin = Math.sin(rot)
   var cos = Math.cos(rot)
   var x, y, z
   let n = model.length
   for (var i = 0; i < n; i += 3) {
      // x=model[i]
      model[i + 2] += 30 // shift up 30 in the z axis
      y = cos * model[i + 1] - sin * model[i + 2]
      z = sin * model[i + 1] + cos * model[i + 2]
      model[i + 1] = y
      model[i + 2] = z
   }
}

function rotateY2D(model, rot) {
   // rotate about X in and drop the z
   // c 0 s
   // 0 1 0

   var sin = Math.sin(rot)
   var cos = Math.cos(rot)
   var points = []
   let n = model.length
   for (var i = 0; i < n; i += 3) {
      points.push(cos * model[i] + sin * model[i + 2])
      points.push(model[i + 1])
   }
   return points
}

function rotateGear(model,rotz,xshift,yshift){
   // about z
   // cz -sz 0
   // sz  cz 0
   // 0 0 1
   //
   // about x and drop the z value
   // 1 0 0
   // 0 cx -sx
   // combined
   // x     1 0 0      cz -sz 0   x
   // y  =  0 cx -sx   sz cz 0    y
   //                   0 0 1    z
   // cz    -sz    0
   // cxsz  cxcz  -sx

   var rotx = 80.0*Math.PI/180.0
   var sz = Math.sin(rotz)
   var cz = Math.cos(rotz)
   var cx = Math.cos(rotx) //0.5 //Math.cos(rotx) // assume rotx is constant 60
   var sx = Math.sin(rotx) //0.866025 //Math.sin(rotx)
   var cxsz =cx*sz
   var cxcz = cx*cz
   var points = []
   let n = model.length
   for (var i = 0; i < n; i += 3) {
      points.push(cz * model[i] -sz * model[i + 1]+ xshift)
      points.push(cxsz * model[i] +cxcz * model[i + 1]-sx * model[i + 2]+   yshift)
   }
   return points
}


function updateModel(rot) {
   _layerDish.getChildren().forEach(obj =>{
      obj.points(rotateY2D(obj.getAttr("model"), rot))
   })
   let g1rot = rotateGear(gearpts1,-rot*4.0,0,170)
   gear1.points(g1rot)
   gear1b.points(g1rot)
   //gear1.points(rotateGear(gearpts1,-rot*4.0,0,170))
   let g2rot = rotateGear(gearpts2,rot*8.0,115,170)
   gear2.points(g2rot)
   gear2b.points(g2rot)
   //gear2.points(rotateGear(gearpts2,rot*8.0,115,170))

   let g3rot = rotateGear(gearpts2,rot*8.0,-115,170)
   gear3.points(g3rot)
   gear3b.points(g3rot)
   
   document.getElementById("Tcurr").innerHTML = (rot*180.0/Math.PI).toFixed(0)
}

document.getElementById("cw").addEventListener("click", function () {
   if (_rot<= -1.4) return
   _rot -= 0.1
   updateModel(_rot)
})

document.getElementById("ccw").addEventListener("click", function () {
   if (_rot >= 1.4) return
   _rot += 0.1
   updateModel(_rot)
})




var _antK = 100   
var _ys//= solvedeq([0, 0, 0, 6.63*_antK],[1, 101.71, 171, 6.63*_antK],0.01, 5, function(x) { return .5});
var _idx// = 0
var _imax// = _ys.length
var _fstate ={ z:[0,0,0], x:0}

var _plt
function plotscaleshift(){
   var i
   _plt = []
   for (i=0;i<_imax;i++){
      _plt.push(_ys[i].x*50, _ys[i].y*100)
   }
   timeresponse.points(_plt)
}

function animateAntenna(timestamp){
   if (_idx >= _imax-1) {
      document.getElementById("cw").disabled = false
      document.getElementById("ccw").disabled = false

      return
   }
   _rot =_ys[_idx++].y
   _plt.push(_ys[_idx].x*50, 30-_ys[_idx].y*40)
   updateModel(_rot)
   timeresponse.points(_plt)
  
   requestAnimationFrame(animateAntenna);
 }


document.getElementById("run").addEventListener("click", function () {
   document.getElementById("cw").disabled = true
   document.getElementById("ccw").disabled = true

   _antK = document.getElementById("gain").value
   var Ttarget = Number(document.getElementById("Tdes").value)/180.0*Math.PI

    // should use settling time to estimate length of time to run the simulation

   _fstate ={ z:[0,0,0], x: 0}
   _ys = solvedeq([0, 0, 0, 6.63*_antK],[1, 101.71, 171, 6.63*_antK],0.01, 10, 
      function(x) { return _rot}, 
      _fstate);
   _fstate.x=0;
   _ys = solvedeq([0, 0, 0, 6.63*_antK],[1, 101.71, 171, 6.63*_antK],0.01, 6, 
                     function(x) { return Ttarget}, 
                     _fstate);
   _idx = 0
   _imax = _ys.length
   _plt = []
   animateAntenna(0)
})

// ========================
// Startup ----------

// Globals
// Stage
var _stage = new Konva.Stage({
   container: 'container',   // id of container <div>
   width: 500,
   height: 500
});


// then create layer
var _layerStruct = new Konva.Layer({ name: "struct" });
_stage.add(_layerStruct);

var _layerDish = new Konva.Layer({ name: "dish" });
_stage.add(_layerDish);

var _layerHilite = new Konva.Layer({ name: "hilite" });
_stage.add(_layerHilite);


// var post = new Konva.Rect({
//    width: 40,
//    height: 80,
//    fill: 'darkgray',
//    stroke: 'black',
//    strokeWidth: 1,
//    cornerRadius:[0, 0, 10, 10],
//    x:130,
//    y:150
//  });


 var post = new Konva.Path({
   x: 130+ _xShift,
   y: 140,
   data: 'M41.79,88s-5.65,4.59-20.9,4.59C4.52,92.62,0,88,0,88V0H41.79Z',
   fill: 'darkgray',
   stroke: 'black',
   strokeWidth: 1,
  // scaleX: 2,
  // scaleY: 2
 });


var gear1 = new Konva.Line({
   name: "gear",
   points: rotateGear(gearpts1, 0,0,170),
   stroke: 'black', //'darkgray',
   strokeWidth:1, //3,
   fill: 'LightGray',
   closed: true,
   tension: 0,
   x: 150+_xShift,
   y: 60,
   model: gearpts1
})

var gear1b = new Konva.Line({
   name: "gear",
   points: rotateGear(gearpts1, 0,0,170),
   stroke: 'black', //'darkgray',
   strokeWidth:1, //3,
   fill: 'Gray',
   closed: true,
   tension: 0,
   x: 150+_xShift,
   y: 63,
   model: gearpts1
})

var gear2 = new Konva.Line({
   name: "gear",
   points: rotateGear(gearpts2, 0,116,170),
   stroke: 'black', //'darkgray',
   strokeWidth:1, //3,
   fill: 'LightGray',
   closed: true,
   tension: 0,
   x: 150+_xShift,
   y: 60,
   model: gearpts2
})

var gear2b = new Konva.Line({
   name: "gear",
   points: rotateGear(gearpts2, 0,116,170),
   stroke: 'black', //'darkgray',
   strokeWidth:1, //3,
   fill: 'Gray',
   closed: true,
   tension: 0,
   x: 150+_xShift,
   y: 63,
   model: gearpts2
})


var gear3 = new Konva.Line({
   name: "gear",
   points: rotateGear(gearpts2, 0,-116,170),
   stroke: 'black', //'darkgray',
   strokeWidth:1, //3,
   fill: 'LightGray',
   closed: true,
   tension: 0,
   x: 150+_xShift,
   y: 60,
   model: gearpts2
})

var gear3b = new Konva.Line({
   name: "gear",
   points: rotateGear(gearpts2, 0,-116,170),
   stroke: 'black', //'darkgray',
   strokeWidth:1, //3,
   fill: 'Gray',
   closed: true,
   tension: 0,
   x: 150+_xShift,
   y: 63,
   model: gearpts2
})


rotateX(dishpts, xrot)
var dish = new Konva.Line({
   name: "dish",
   points: rotateY2D(dishpts, 0),
   stroke: 'black', //'darkgray',
   strokeWidth:1, //3,
   //fill: 'blue',
   closed: true,
   tension: .4,
   x: 150+_xShift,
   y: 150,
   
   fillRadialGradientStartPoint: { x: 0, y: 0 },
   fillRadialGradientStartRadius: 0,
   fillRadialGradientEndPoint: { x: 0, y: 0 },
   fillRadialGradientEndRadius: 100,
   fillRadialGradientColorStops: [0, 'white', 1, 'gray'],
   model: dishpts
})


rotateX(dish2pts, xrot)
var dish2 = new Konva.Line({
   points: rotateY2D(dish2pts, 0),
   stroke: 'black',
   fill: 'black',
   opacity: 0.5,
   strokeWidth: 10,
   closed: true,
   tension: .4,
   x: 150+_xShift,
   y: 150,
   model: dish2pts
})



rotateX(tripodpts, xrot)
var tripod = new Konva.Line({
   name: "tripod",
   points: rotateY2D(tripodpts, 0),
   stroke: 'black',
   strokeWidth: 2,
   fill: 'gray',
   closed: true,
   x: 150+_xShift,
   y: 150,
   model: tripodpts
})


rotateX(tippts, xrot)
var tip = new Konva.Line({
   points: rotateY2D(tippts, 0),
   stroke: 'black',
   strokeWidth: 1,
   fill: 'gray',
   closed: true,
   x: 150+_xShift,
   y: 150,
   model: tippts
})



rotateX(dishbackpts, xrot)
var dishback = new Konva.Line({
   points: rotateY2D(tippts, 0),
   stroke: '#dddddd',
   strokeWidth: 5,
   fill: Konva.Util.getRGB('#888888'),
   closed: false,
   lineCap: 'square',
   tension: 0.1,
   x: 150+_xShift,
   y: 150,
   model: dishbackpts
})


rotateX(edgepts, xrot)
var edge = new Konva.Line({
   name: "edge",
   points: rotateY2D(edgepts, 0),
   stroke: 'black',
   strokeWidth: 1,
   closed: false,
   x: 150+_xShift,
   y: 150,
   model: edgepts
})


var e = new Konva.Ellipse({
   radius : {
     x : 200,
     y : 200
   },
   x: 150+_xShift,
   y:150,
 
   fillRadialGradientStartPoint: { x: 0, y: 0 },
   fillRadialGradientStartRadius: 10,
   fillRadialGradientEndPoint: { x: 0, y: 0 },
   fillRadialGradientEndRadius: 200,
   fillRadialGradientColorStops: [0, 'rgba(255,255,255,0.5)', .5, 'rgba(255,255,255,0)'],
 });


//---------------
var timeresponse = new Konva.Line({
   points: [0,0,0,0],
   stroke: 'black',
   strokeWidth: 1,
   closed: false,
   x: 20,
   y: 420,
   model: _plt
})





// ---------

 
_layerDish.add(dishback)
//_layerDish.add(dish2)
_layerDish.add(edge)
_layerDish.add(dish)

_layerDish.add(dish2)

_layerDish.add(tripod)
_layerDish.add(tip)

// structure
// var imageMotor = new Image();
// imageMotor.onload = function() {
//   var motor = new Konva.Image({
//     x: 244+_xShift,
//     y: 233,
//     image: imageMotor,
//     scaleX: 0.5,
//     scaleY:0.5

//    // width: 100,
//   //  height: 100
//   });
//   _layerStruct.add(motor)
//   _layerStruct.add(gear1b)
// _layerStruct.add(gear1)

// _layerStruct.add(gear2b)
// _layerStruct.add(gear2)
// };
// imageMotor.src = 'motor.png'


// var imagePot = new Image();
// imagePot.onload = function() {
//   var pot = new Konva.Image({
//     x: 14+_xShift,
//     y: 233,
//     image: imagePot,
//     scaleX: 0.5,
//     scaleY:0.5

//    // width: 100,
//   //  height: 100
//   });
//   _layerStruct.add(pot)
//   _layerStruct.add(gear3b)
//   _layerStruct.add(gear3)

// };
// imagePot.src = 'pot.png'

// var imagePost = new Image();
// imagePost.onload = function() {
//   var stand = new Konva.Image({
//     x: 130+_xShift,
//     y: 140,
//     image: imagePost,
//     scaleX: 0.5,
//     scaleY:0.5

//    // width: 100,
//   //  height: 100
//   });
//   
// };


var imageBackground = new Image();
imageBackground.onload = function() {
  var Background = new Konva.Image({
    x: -103+_xShift,
    y: 225,
    image: imageBackground,
    scaleX: 0.5,
    scaleY:0.5

   // width: 100,
  //  height: 100
  });
  _layerStruct.add(Background)


  _layerStruct.add(gear1b)
  _layerStruct.add(gear1)
  
  _layerStruct.add(gear2b)
  _layerStruct.add(gear2)

  _layerStruct.add(gear3b)
  _layerStruct.add(gear3)

  _layerStruct.add(post)

};

imageBackground.src = 'Background.png'







_layerHilite.add(e)


_layerStruct.add(timeresponse)

// draw the canvas
_layerDish.draw();
_layerHilite.draw();
_layerStruct.draw();



