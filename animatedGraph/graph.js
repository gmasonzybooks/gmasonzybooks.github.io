var _xcur = 100
var _ycur = 100

const _delxy = 1

// scaling
const _xminmax = [39, 449]
const _yminmax = [33, 344]
const _concSminmax = [0,100]
const _tempCminmax = [0,350]
// calculate  tempC = my*y+by
const _my = (_tempCminmax[1]-_tempCminmax[0])/(_yminmax[0]-_yminmax[1])
const _by = -_my*_yminmax[1]

//            concS = mx*x+bx
const _mx = (_concSminmax[1]-_concSminmax[0])/(_xminmax[1]-_xminmax[0])
const _bx = -_mx*_xminmax[0]


function conc(x) {
  return _mx*x+_bx
  //return 0.2439 * x - 9.5122
}
function tempC(y) {
  return _my*y+_by
  //return -1.1218 * y + 387.019
}

var _graphmap = {
  10: 'liquid',
  20: 'alpha + liquid',
  30: 'beta + liquid',
  40: 'beta',
  50: 'alpha + beta',
  60: 'alpha',
  70: 'eutectic point'
}

//Konva.pixelRatio = 1

// Create a stage (container for all layers)
const stage = new Konva.Stage({
  container: 'container',
  width: 500,
  height: 400
});

// Create layers

const maplayer = new Konva.Layer();
maplayer.toCanvas().getContext('2d').imageSmoothingEnabled=false

stage.add(maplayer);

//maplayer.getCanvas().setPixelRatio(1);

const imagelayer = new Konva.Layer();
stage.add(imagelayer);
imagelayer.opacity(1.0)


const cursorlayer = new Konva.Layer();
stage.add(cursorlayer);

// Load graph
const imageObj = new Image();
imageObj.onload = function () {
  const graph = new Konva.Image({
    x: 0,
    y: 0,
    image: imageObj,
    width: 500,
    height: 400
  });

  imagelayer.add(graph);
}
imageObj.src = 'graph.jpg';

// Load graph
const image2Obj = new Image();
image2Obj.onload = function () {
  const map = new Konva.Image({
    x: 0,
    y: 0,
    image: image2Obj,
    width: 500,
    height: 400
  });

  maplayer.add(map);
}
image2Obj.src = 'map.png';

const hcursor = new Konva.Line({
  //points: [_xminmax[0], _yminmax[0], _xminmax[1], _yminmax[0]], 
  points: [0, 0, _xminmax[1]-_xminmax[0], 0], 
  strokeWidth: 2,
  stroke: 'blue',
  x: 0,
  y: _ycur,
  offsetX:-_xminmax[0],
})
cursorlayer.add(hcursor)

const vcursor = new Konva.Line({
  points: [0, 0, 0, _yminmax[1]-_yminmax[0]],
  strokeWidth: 2,
  stroke: 'blue',
  x: _xcur,
  y: 0,
  offsetY: -_yminmax[0],
})
cursorlayer.add(vcursor)

updateMsg()

function inGraph(xc, yc) {
  if (xc < _xminmax[0] || xc > _xminmax[1]) return false
  if (yc < _yminmax[0] || yc > _yminmax[1]) return false
  return true
}

stage.on('click tap', () => {
  let xy = stage.getPointerPosition()

  if (inGraph(xy.x, xy.y)) {
    _xcur = xy.x
    _ycur = xy.y
    hcursor.y(_ycur)
    vcursor.x(_xcur)
  }
  updateMsg()
})

window.addEventListener('keydown', (e) => {
  let oldx = _xcur  // look for better logic
  let oldy = _ycur
  let del = _delxy
  if (e.shiftKey) del = del*10

  if (e.key === 'ArrowUp') {
    oldy -= del
  } else if (e.key === 'ArrowDown') {
    oldy += del

  } else if (e.key === 'ArrowLeft') {
    oldx -= del

  } else if (e.key === 'ArrowRight') {
    oldx += del

  }

  if (inGraph(oldx, oldy)) {
    _xcur = oldx
    _ycur = oldy
    hcursor.y(_ycur)
    vcursor.x(_xcur)

  }

  updateMsg()
});



function updateMsg() {
  // Export the current visual state to a canvas
  const p = maplayer.toCanvas().getContext('2d').getImageData(_xcur, _ycur, 1, 1).data;
  let maptext = ''
  // round to nearest 10s
  p0 = Math.round(p[0]/10.0)*10
  if (Object.hasOwn(_graphmap, p0)) {
    maptext = _graphmap[p0]
  }

  document.getElementById('message').innerHTML = `${conc(_xcur).toFixed(1)} wt% Sn at ${tempC(_ycur).toFixed(0)} C, ${maptext} `

  //  console.log(_xcur,_ycur)
  console.log('rgb: ', p0,p[0], p[1], p[2])
}
/*
// Create a draggable rectangle
const rect = new Konva.Rect({
  x: 50,
  y: 50,
  width: 100,
  height: 80,
  fill: 'cornflowerblue',
  shadowBlur: 5,
  cornerRadius: 4,
  draggable: true,
});
layer.add(rect);

// Add event listener
rect.on('click tap', () => {
  rect.fill(Konva.Util.getRandomColor());
});
*/