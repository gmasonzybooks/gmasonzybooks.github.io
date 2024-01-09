// ----- vector
Konva.Vector = class myvect extends Konva.Group {
   constructor(x, y, fixedLength) {  // fixedLength not implemented, intended for vectors that can be stretched
      super({ x: x, y: y, draggable: true, name: "vector" })

      this.arrow = new Konva.Line({
         points: [0, 6, 70, 6, 50, 0, 70, 6, 50, 12],

         stroke: 'red',
         strokeWidth: 2,
         hitStrokeWidth: 6,
         x: x,
         y: y,
         //draggable: true, // draggable at the groupe level

         rotation: 0,
         offsetY: 6,
         name: "ansShape"
      });


      this.head = new Konva.Circle({
         x: x + 70,
         y: y,
         radius: 6,
         stroke: '#666',
         fill: '#ddd',
         strokeWidth: 1,
         draggable: true,
         opacity: 0.5,
         name: "head"
      });

      this.tail = new Konva.Circle({
         x: x,
         y: y,
         radius: 6,
         stroke: '#666',
         fill: '#ddd',
         strokeWidth: 1,
         draggable: true,
         opacity: 0.5,
         name: "tail"
      });

      this.dummy = new Konva.Rect({
         x: x,
         y: y,
         width: 1,
         height: 1,
         // fill: 'red',
         stroke: 'black',
         strokeWidth: 1,
         draggable: false,
         opacity: 0.0,
      });

      // weird bug prevents the last item added from firing correctly so added a dummy object
      this.add(this.arrow, this.tail, this.head, this.dummy)

      this.tail.on("dragmove", () => {
         var mousePos = this.tail.getStage().getPointerPosition();
         var headPos = this.head.absolutePosition()
         var dx = headPos.x - mousePos.x
         var dy = headPos.y - mousePos.y
         var theta = Math.atan2(dy, dx)
         this.arrow.rotation(theta * 180 / Math.PI)
         dx = 70 * Math.cos(-theta)
         dy = 70 * Math.sin(-theta)
         this.tail.absolutePosition({ x: headPos.x - dx, y: headPos.y + dy })
         this.arrow.absolutePosition({ x: headPos.x - dx, y: headPos.y + dy })
         this.dummy.absolutePosition({ x: headPos.x - dx, y: headPos.y + dy })
         //  console.log(dx,dy,theta*180/Math.PI)
         updateGraphXY(mousePos);
      })

      this.tail.on("mouseenter", () => {
         updateGraphXY(this.getStage().getPointerPosition())
      })

      // a bug in Konva or in my code prevents this from firing correctly
      this.head.on("dragmove", () => {
         var mousePos = this.head.getStage().getPointerPosition();
         var tailPos = this.tail.absolutePosition()
         var dx = mousePos.x - tailPos.x
         var dy = mousePos.y - tailPos.y
         var theta = Math.atan2(dy, dx)
         this.arrow.rotation(theta * 180 / Math.PI)
         dx = 70 * Math.cos(theta)
         dy = 70 * Math.sin(theta)
         this.head.absolutePosition({ x: tailPos.x + dx, y: tailPos.y + dy })
         this.dummy.absolutePosition({ x: tailPos.x + dx, y: tailPos.y + dy })
         //  console.log(dx,dy,theta*180/Math.PI)
         updateGraphXY(mousePos);
      })

      this.head.on("mouseenter", () => {
         updateGraphXY(this.getStage().getPointerPosition())
      })
   }
   showControls(state) {
      this.head.visible(state);
      this.tail.visible(state);
   }
   isDirectionTowards(point) {
      // is the head closer to the point
      var head = this.head.getAbsolutePosition();
      var tail = this.tail.getAbsolutePosition();
      var dhead = (point.x - head.x) * (point.x - head.x) + (point.y - head.y) * (point.y - head.y)
      var dtail = (point.x - tail.x) * (point.x - tail.x) + (point.y - tail.y) * (point.y - tail.y)
      return (dhead < dtail)
   }

}


// ----- polyline
Konva.CurveLine = class mycurve extends Konva.Group {
   constructor(x, y) {
      // this.x = x;
      // this.y = y;
      //this.fixedLength = 70;
      super({
         draggable: true, x: x, y: y, name: "curve"
      });

      this.points = [0, 0, 50, 0, 100, 0, 150, 0];

      this.curve = new Konva.Line({
         points: this.points,
         //fill: 'none',
         stroke: 'red',
         strokeWidth: 2,
         //draggable: true,
         rotation: 0,
         hitStrokeWidth: 6,
         // offsetX: 70,
         // offsetY: 6,
         name: "ansShape",

         //bezier: true,
         tension: 0
      });

      this.controls = [];

      for (var j = 0; j < this.points.length / 2; j++) { // dangerous if /2 is not a integer
         this.addControl(j)
      }
      this.dummy = new Konva.Rect({
         x: x,
         y: y,
         width: 1,
         height: 1,
         // fill: 'red',
         stroke: 'black',
         strokeWidth: 1,
         draggable: false,
         opacity: 0.0,
      });

      this.add(this.curve, ...this.controls, this.dummy)
   }



   // add control corresponding to x,y starting at point[2*j]
   addControl(j) {
      var i = j * 2;
      this.controls[j] = new Konva.Circle({
         x: this.points[i],
         y: this.points[i + 1],
         radius: 6,
         stroke: '#666',
         fill: '#ddd',
         strokeWidth: 1,
         draggable: true,
         opacity: 0.5,
         name: j.toString() // this array index
      })

      // this isn't quite right because tracks to pointer location and not the circle's center
      this.controls[j].on("dragmove", (evt) => {
         var offsetP = this.absolutePosition();
         var mousePos = this.getStage().getPointerPosition();
         var idx = Number(evt.target.name());
         this.points[idx * 2] = mousePos.x - offsetP.x;
         this.points[idx * 2 + 1] = mousePos.y - offsetP.y;
         this.curve.points(this.points);
         evt.target.absolutePosition(mousePos)
       //  this.dummy.absolutePosition(mousePos);
         //  console.log(dx,dy,theta*180/Math.PI)

         updateGraphXY(mousePos)

      })

      this.controls[j].on("mouseenter", () => {
         updateGraphXY(this.getStage().getPointerPosition())
      })

      // double click ass a new curve segment after the clicked control point
      this.controls[j].on("pointerdblclick", (evt) => {
         var idx = Number(evt.target.name()); // index of selected point
         if (idx < this.controls.length - 1) {
            // shift everything.  The first iteration adds to the array end
            for (var i = this.controls.length; i > idx + 1; i--) {
               this.controls[i] = this.controls[i - 1]
               this.controls[i].name(i.toString())
               this.points[2 * i] = this.points[2 * i - 2]
               this.points[2 * i + 1] = this.points[2 * i - 1]
            }
            // update the point at idx+1
            this.points[2 * idx + 2] = (this.points[2 * idx] + this.points[2 * idx + 4]) / 2; // x average
            this.points[2 * idx + 3] = (this.points[2 * idx + 1] + this.points[2 * idx + 5]) / 2; // x average

         } else {
            // adding to the end, no need to shift points/controls
            this.points.push(this.points[2 * idx] + 20, this.points[2 * idx + 1])

         }
         idx++; // new point
         this.curve.points(this.points);
         this.controls[idx] = this.controls[idx - 1].clone()
         this.controls[idx].name(idx.toString())
         this.controls[idx].x(this.points[idx * 2])
         this.controls[idx].y(this.points[idx * 2 + 1])
         // this.remove(this.dummy)
         this.add(this.controls[idx])//, this.dummy)

      })
   }

   showControls(state) {
      this.controls.forEach(item => {
         item.visible(state)
      })
   }

   isDirectionTowards(point) {
      // is the first point closer to  "point" than the last point
      var head = this.controls[0].getAbsolutePosition();
      var tail = this.controls[controls.length - 1].getAbsolutePosition();
      var dhead = (point.x - head.x) * (point.x - head.x) + (point.y - head.y) * (point.y - head.y)
      var dtail = (point.x - tail.x) * (point.x - tail.x) + (point.y - tail.y) * (point.y - tail.y)
      return (dhead < dtail)
   }

}

// wrap in a group to be consistent with other answer shapes
Konva.UserImage = class myimage extends Konva.Group {
   constructor(x, y, theimage) {

      super({
         draggable: true, x: x, y: y, name: "user"
      });

      this.image = new Konva.Image({
         image: theimage,
         x: 0,
         y: 0,
         name: "ansShape",
      })

      this.add(this.image)
   };

   // not implemented
   isDirectionTowards(point) {
      return true;
   }
}

// show the pointer's xy position element if the pointer is inside the graph
function updateGraphXY(xy) {
   graphs.some(item => {
      if (xy.x >= item.x() && xy.x <= (item.x() + item.width()) && xy.y >= item.y() && xy.y <= (item.y() + item.height())) {
         item.fire("xyupdate")
         document.getElementById("xy").style.visibility = "visible"
         return true;  // end loop if found a graph
      } else {
         document.getElementById("xy").style.visibility = "hidden"
      }
   })
}

// load the model and solution elements
function loadModel() {
   // temporary canvas
   var canvas = document.createElement('canvas');
   canvas.height = 500;
   canvas.width = 500;

   var rtnval;
   var svgParams = "{" + document.getElementById("svgParams").value + "}";
   canvg(canvas, SVGSTRING, {
      params: JSON.parse(svgParams), // { '$T1': 10, '$T2':180, '$A1':-20, '$A2':20, '$VM':'1111.222 kN/m'},
      renderCallback: function (dom, ansShapes) {
         var image = new Konva.Image({
            image: canvas,
            x: 0,
            y: 0,
            listening: false
         });
         layerProblem.add(image);

         ansShapes.forEach(item => {
            if (item.type.includes("graph")) {
               let graphrect = new Konva.Rect({
                  x: item.xy[0],
                  y: item.xy[1],
                  width: item.xy[2],
                  height: item.xy[3],
                  opacity: 0
               })
               let c = JSON.parse("[" + item.opts + "]"); // xmin, xmax, ymin, ymax
               // scaling  xs = xoff + xscale*x
               graphrect.graphscale = { xo: c[0], xs: (c[1] - c[0]) / item.xy[2], yo: c[2], ys: (c[3] - c[2]) / item.xy[3] }
               graphrect.description = item.desc;

               graphrect.on("mouseenter", () => {
                  document.getElementById("xy").style.visibility = "visible"
               })

               graphrect.on("mouseleave", () => {
                  document.getElementById("xy").style.visibility = "hidden"
               })

               graphrect.on("xyupdate mousemove", (evt) => {  // xyupdate if fired from controls
                  let target = evt.target;
                  let mousePos = target.getRelativePointerPosition();
                  let x = target.graphscale.xo + mousePos.x * target.graphscale.xs
                  let y = target.graphscale.yo + mousePos.y * target.graphscale.ys
                  document.getElementById("xy").innerHTML = target.description + ' x=' + x.toFixed(2) + ', y=' + (-y).toFixed(2);
               })

               graphs.push(graphrect)

               layerProblem.add(graphrect)

            } else { // must be something else, like vector, curve, user..
               let color = "red" // vector default
               if (item.type.includes("curve")) color = "green"
               if (item.opts.includes("inside")) color = "blue"
               let solnrect = new Konva.Line({
                  points: item.xy,
                  stroke: color,
                  fill: color,
                  closed: item.opts.includes("closed"),
                  opacity: 0.3,
                  strokeWidth: (item.type.includes("curve") ? 10 : 1), // draw curves thick.  Should the thickness be an option?
                  name: item.type.trim(),
                  listening: false
               });
               solnrect.description = item.desc;
               solnrect.outsideCount = !item.opts.includes("inside") // defaults to "outside"
               solnrect.direction = item.opts.includes("direction");  // includes false = don't check the direction
               solnrect.getDirPoint = function () {
                  var p = this.points()
                  return { x: p[0], y: p[1] }
               }
               layerSolution.add(solnrect)
            }
         })


      }
   });
}


// calculate overlap
function answerOverlap(answer, solution, tolerance, countOutside) {
   var compositeType = countOutside ? "source-out" : "source-in"
   layerCalcs.clearCache();
   var solutionClone = solution.clone();
   solutionClone.opacity(1)
   //  solutionClone.fill('black')
   //  solutionClone.stroke('black')

   var answerClone = answer.clone();
   answerClone.absolutePosition(answer.getAbsolutePosition())
   answerClone.opacity(1)
   // answerClone.fill('black')
   // answerClone.stroke('black')


   solutionClone.show()  // in case it got hidden 
   answerClone.show()

   layerCalcs.add(solutionClone);
   // answerClone.globalCompositeOperation("source-out")
   answerClone.globalCompositeOperation(compositeType)
   // layerCalcs.getContext()._context.globalCompositeOperation="source-out"
   layerCalcs.add(answerClone);


   layerCalcs.draw()

   // only scan the union of the bounding box for the answer and solution items
   // there must be a built in function to get this bounding box, the code below has some error (roundoff?) and isn't important for a demo.  Just doing more checks than needed.
   // var r1=answerClone.getClientRect();
   // var r2=solutionClone.getClientRect();
   // var top = Math.min(r1.y, r2.y);
   // var bottom = Math.max(r1.y+r1.height, r2.y+r2.height)
   // var left=Math.min(r1.x,r2.x);
   // var right = Math.max(r1.x+r1.width, r2.x+r2.width)
   // var imageData = layerCalcs.getContext().getImageData(left-1, top-1, (right-left)+2, (bottom-top)+2).data;

   var imageData = layerCalcs.getContext().getImageData(0, 0, 500, 500).data;  // grab everything -- should only check union of bounding boxes, see above.


   var sum = 0;
   for (var i = 3; i < imageData.length; i += 4) {
      sum += (imageData[i] > 10 ? 1 : 0);  // 10 = lower bound for opacity.  Shouldn't be necessary.
   }
   // console.log(sum) // number of pixels outside the bound area

   layerCalcs.destroyChildren();


   return ((sum < tolerance) === countOutside)
}




document.getElementById("addVector").addEventListener("click", () => {
   var vect = new Konva.Vector(100, 100)
   //   answerItems.push(vect)
   layerAnswer.add(vect)
})


document.getElementById("addCurve").addEventListener("click", () => {
   var curve = new Konva.CurveLine(100, 100)
   //   answerItems.push(curve)
   layerAnswer.add(curve)
})

document.getElementById("addUser").addEventListener("click", () => {

   // load the user's object
   var imageObj = new Image();
   imageObj.onload = function () {
      var img = new Konva.UserImage(100, 100, imageObj)
      layerAnswer.add(img)
      //   answerItems.push(img)
   };
   imageObj.src = 'user.png'

})

document.getElementById("updateModel").addEventListener("click", () => {
   // clear the model
   layerProblem.destroyChildren();
   layerSolution.destroyChildren();
   graphs.forEach(item => {
      item.destroy()
   })
   graphs.length = 0;
   loadModel();

})

document.getElementById("showSoln").addEventListener("click", (evt) => {
   // clear the model
   if (evt.target.checked) {
      layerSolution.show()
   } else {
      layerSolution.hide()
   }

})

document.getElementById("checkSolution").addEventListener("click", (evt) => {
   const TOLERANCE = 5;
   var solns = layerSolution.getChildren();
   // solns = [solns[0]]  // debugging
   var answ = layerAnswer.getChildren();

   if (solns.length < 1 || answ.length < 1) {
      window.alert("Nothing to check")
      return; // bomb out if nothing to check

   }

   // layerCalcs.show();  // for debugging
   // layerSolution.hide(); // for debugging
   // layerProblem.hide();// for debugging
   // layerAnswer.hide();// for debugging

   var text = ""
   var isSatisfied = Array(solns.length).fill(false);
   solns.forEach((sol, idx) => {
      if (!isSatisfied[idx]) {
         // compare every answer against every unsatisfied solution
         // this redundantly rechecks answers that already satisfy a solution - fix later
         answ.forEach(ans => {
            // must match the solution type
            if (sol.name() == ans.name()) {
               if (answerOverlap(ans.find(".ansShape")[0], sol, TOLERANCE, sol.outsideCount)) {
                  isSatisfied[idx] = true;
                  text += sol.description + " satisfied"

                  // if a direction also required check that
                  if (sol.direction && !ans.isDirectionTowards(sol.getDirPoint())) {
                     text += " but with wrong direction"
                  }
                  text += "\n"
               }
            }
         })
      }
   })
   text += "\n"
   solns.forEach((sol, idx) => {
      if (!isSatisfied[idx]) {
         text += sol.description + " not satisfied\n"
      }
   })

   // the above approach doesn't account for redundant answers
   // should also check against an answer count as provided by or calculated from the answer key. Ex: solution has 5 vectors and 2 lines.

   window.alert(text)

})

// Startup ----------

// Globals
// Stage
var stage = new Konva.Stage({
   container: 'container',   // id of container <div>
   width: 500,
   height: 500
});


// then create layer
var layerProblem = new Konva.Layer();
var layerSolution = new Konva.Layer();
var layerAnswer = new Konva.Layer();
// var layerGraph = new Konva.Layer();

stage.add(layerProblem);
stage.add(layerSolution);
stage.add(layerAnswer);
// stage.add(layerGraph);

// Hidden layer for checking the solution
var layerCalcs = new Konva.Layer();
layerCalcs.size({
   width: 500,
   height: 500
});

layerCalcs.listening(false);
// stage.add(layerCalcs);  // for debugging
// layerCalcs.hide();      // for debugging

// draw the canvas
layerProblem.draw();
layerAnswer.draw();

layerSolution.hide();
layerSolution.draw();

var graphs = [];
document.getElementById("svgParams").value = SVGPARAMS; // show the default parameter values
loadModel();

// items added by user
//var answerItems = [];

