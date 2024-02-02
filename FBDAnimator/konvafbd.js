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
         offset: { x: 0, y: 6 },  // was offsetY: 6
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

      // added to bypass a bug when adding multiple items to a layer where events are not assigned correctly
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
         visibility: false  // is this redundant?
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

      this.points = [0, 0, 50, 0];

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

      // added to bypass a bug when adding multiple items to a layer where events are not assigned correctly
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
         visibility: false
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
         offsetX: theimage.width / 2,
         offsetY: theimage.height / 2,
         name: "ansShape",
      })

      this.image.on("pointerdblclick", (evt) => {
         this.image.rotate(90)
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
   _graphs.some(item => {
      if (xy.x >= item.x() && xy.x <= (item.x() + item.width()) && xy.y >= item.y() && xy.y <= (item.y() + item.height())) {
         item.fire("xyupdate")
         document.getElementById("xy").style.visibility = "visible"
         return true;  // end loop if found a graph
      } else {
         document.getElementById("xy").style.visibility = "hidden"
      }
   })
}

// ---------
// load the model and solution elements
function centerRotateNode(node, ang) {
   if (ang === 0) return;

   let xy = node.getClientRect();
   node.setAttr("offset", { x: xy.width / 2, y: xy.height / 2 });
   node.setAttr("position", { x: xy.x + xy.width / 2, y: xy.y + xy.height / 2 });
   node.setAttr("rotation", ang);
}

// to translate values from animation builder to konva and handle default values, but not well designed
function cleanAttr(attr, deflt) {
   if (attr === null) return deflt;
   if (typeof attr !== 'string') return attr;// not a string so return the value, can't do anything with the value in this code
   if (attr.endsWith("px")) attr = attr.substr(0, attr.length - 2);
   let z = Number(attr);
   if (isNaN(z)) return attr;
   return z;
}

function pixelToEngineering(pxy, scale) {
   // pxy = [x1, y1, ...  xn, yn] in pixels 
   // returns [x1, y1, ...  xn, yn] in engineering units
   let exy = [];
   for (let i = 0; i < pxy.length; i += 2) {
      exy.push(scale.xo + pxy[i] * scale.xs);
      exy.push(scale.yo + pxy[i + 1] * scale.ys);
   }
   return exy
}

function engineeringToPixel(exy, scale) {
   // exy = [x1, y1, ...  xn, yn] in engineering units
   // returns [x1, y1, ...  xn, yn] in pixels
   let pxy = [];
   for (let i = 0; i < exy.length; i += 2) {
      pxy.push((exy[i] - scale.xo) / scale.xs );
      pxy.push((exy[i + 1] - scale.yo) / scale.ys );
   }
   return pxy
}

function parseObjects(xmlString, modelParams) {
   // parse the xmlString for objects
   // this is performed in JS but much of this parsing could be done on the server
   // this proof of concepts loads the problem and solution from the same model
   // better to load the solution model separately from the server only when needed to keep students from hacking for the solution
   //
   // there is some extra coding to separate the layers and keep the group the same

   // Extra attributes for solution objects
   // solnType:  AllInside, AllInsideDir, AnyInside, NoneInside
   // solnObj: type of object (name attribute) to test against the solnType shape, Vector, Line, name of custom object



   // XML innerHTML: Objects the description
   // objType: graph: a rectangle that sets the graph/mouse tracking area,
   //          polyline:  

   // graphScale: xmin, ymin, xmax, ymax
   // polyPoints: [x1,y1, x2,y2, ... ]
   // polyClosed:  if exist the polygon is closed

   var parser = new DOMParser();
   var xmlDoc = parser.parseFromString(xmlString, "text/xml");

   if (xmlDoc.getElementsByTagName("parsererror").length > 0) window.alert("Parsererror!"); // use console for debugging

   var zyObjects = xmlDoc.getElementsByTagName("zyObject");

   // cycle through all of the objects
   for (let zyObject of zyObjects) {
      var shape = null;
      // load the basic shape
      if (zyObject.getAttribute("objType") == "box") {
         shape = new Konva.Rect({
            x: cleanAttr(zyObject.getAttribute("left")),
            y: cleanAttr(zyObject.getAttribute("top")),
            width: cleanAttr(zyObject.getAttribute("width"), 200),
            height: cleanAttr(zyObject.getAttribute("height"), 200),
            id: zyObject.getAttribute("objNum"),
            name: zyObject.getAttribute("objName"),
            fill: cleanAttr(zyObject.getAttribute("background-color"), 'red'),
            cornerRadius: cleanAttr(zyObject.getAttribute("border-radius"), 0),
            stroke: cleanAttr(zyObject.getAttribute("border-color"), "black"),
            opacity: cleanAttr(zyObject.getAttribute("opacity"), 100) / 100,
            //  rotation: Number(cleanAttr(zyObject.getAttribute("transformDeg",0)))  // not reliable because Animator is use the same rotation method as Konva.  
            // Needs mapping update - maybe set object center using offset and x,y value
         })

         // if rotation, make adjustments to position to get center rotation
         centerRotateNode(shape, cleanAttr(zyObject.getAttribute("transformDeg", 0)))

         // used to indicate the top of the object
         shape.getDirPoint = function () {
            return this.getAbsoluteTransform().getTranslation()
         }
      } else if (zyObject.getAttribute("objType") == "text") {
         shape = new Konva.Text({
            x: cleanAttr(zyObject.getAttribute("left")),
            y: cleanAttr(zyObject.getAttribute("top")),
            id: zyObject.getAttribute("objNum"),
            name: zyObject.getAttribute("objName"),
            opacity: cleanAttr(zyObject.getAttribute("opacity"), 100) / 100,
            text: zyObject.getElementsByTagName("text")[0].innerHTML // or pull the  zyObject inner html and parse off the text tag
            //  rotation: Number(cleanAttr(zyObject.getAttribute("transformDeg",0)))  // not reliable because Animator is use the same rotation method as Konva.  
            // Needs mapping update - maybe set object center using offset and x,y value
         })

         // if rotation, make adjustments to position to get center rotation
         centerRotateNode(shape, cleanAttr(zyObject.getAttribute("transformDeg", 0)))

         // used to indicate the top of the object
         shape.getDirPoint = function () {
            return   this.getAbsoluteTransform().getTranslation()
         }

      } else if (zyObject.getAttribute("objType") == "polyline") {
         shape = new Konva.Line({
            // x: cleanAttr(zyObject.getAttribute("left")),  // some inconsistency in line and rect xml.  using left top for the polyline, but the points determine the poitioning
            // y: cleanAttr(zyObject.getAttribute("top")),
            id: zyObject.getAttribute("objNum"),
            name: zyObject.getAttribute("objName"),
            fill: cleanAttr(zyObject.getAttribute("background-color"), 'transparent'),
            tension: 0,
            lineCap: "round",  // or make optional?  
            stroke: cleanAttr(zyObject.getAttribute("stroke"), "black"),
            strokeWidth: cleanAttr(zyObject.getAttribute("strokeWidth"), 2),
            opacity: cleanAttr(zyObject.getAttribute("opacity"), 100) / 100,
            points: cleanAttr(JSON.parse('[' + zyObject.getAttribute("polyPoints") + ']'), [0, 0, 0, 70]),
            closed: cleanAttr(zyObject.getAttribute("closed", "false")) === "true" ? true : false // messy
            //  rotation: Number(cleanAttr(zyObject.getAttribute("transformDeg",0)))  // not supported, use transformDeg for consistency  
            // Needs mapping update - maybe set object center using offset and x,y value
         })

         // rotation not implemented - rotates, but may not give the desired  results
         // centerRotateNode(shape,cleanAttr(zyObject.getAttribute("transformDeg",0)))

         // used to indicate the top of the object
         shape.getDirPoint = function () {
            var pts = this.points();
            var xy = this.getAbsoluteTransform().getTranslation()
            return { x: pts[0]+xy.x, y: pts[1]+xy.y }
         }
      } else if (zyObject.getAttribute("objType") == "image") {
         // create object with a blank image to establish a place holder and preserve layering order
         let tempitem = new Konva.Image({
            image: null,
            x: cleanAttr(zyObject.getAttribute("left")),
            y: cleanAttr(zyObject.getAttribute("top")),
            width: cleanAttr(zyObject.getAttribute("width"), 200),
            height: cleanAttr(zyObject.getAttribute("height"), 200),
            name: zyObject.getAttribute("objName"),
            id: zyObject.getAttribute("objNum"),
            rotation: cleanAttr(zyObject.getAttribute("transformDeg", 0))
         });

         let img = new Image();
         img.onload = evt => {
            tempitem.image(img)
            // fix the rotation now that we have the image dimensions
            centerRotateNode(tempitem, tempitem.rotation())

            // tempitem.offsetX(img.width / 2)   should the image be centered?  This behavior would not align with the Animator
            // tempitem.offsetY(img.height / 2)

            _layerProblem.cache({ drawBorder: false }); // recache for delayed load
         };
         img.src = zyObject.getAttribute("googleDriveFileID")
         shape = tempitem;

         // returns the "head" for the item.  used when determining direction
         shape.getDirPoint = function () {
            return this.getAbsoluteTransform().getTranslation() // or should use the top center of the image?
         }
      }


      else if (zyObject.getAttribute("objType") == "graph") {
         // graphs options
         //  use to scale mouse positions
         //  use to set the scaling for items in a group
         let width = cleanAttr(zyObject.getAttribute("width"), 300)
         let height = cleanAttr(zyObject.getAttribute("height"), 300)
         let x= cleanAttr(zyObject.getAttribute("left"))
         let y= cleanAttr(zyObject.getAttribute("top"))
         shape = new Konva.Rect({
            x: x,
            y: y,
            width: width, // cleanAttr(zyObject.getAttribute("width"), 200),
            height: height, //cleanAttr(zyObject.getAttribute("height"), 200),
            opacity: 0, // 0.2,  // non zero for DEBUGGING
            fill: 'gray',
            id: zyObject.getAttribute("objNum"),
         })
         let c = JSON.parse(cleanAttr(zyObject.getAttribute("graphScale"), "[0,0,10,10]")); // xmin, ymin,  xmax,ymax
         // scaling  engineeringValue = xoff + xscale* pixelValue
         //   of     pixelValue =  (engineeringValue-xoff)/xscale    // accept the division
         // dx,dy accounts for the graph's position
         // c = xmin, ymin,  xmax, ymax
         //       0    1       2     3
         let Xs=(c[2]-c[0])/width;
         let Xo=c[0]-Xs*x;
         let Ys= (c[1]-c[3])/height;
         let Yo=c[3]-Ys*y;
         shape.graphscale = { xo: Xo, xs: Xs, yo: Yo, ys: Ys, dx: shape.x(), dy: shape.y() }

         if (zyObject.getAttribute("graphCursor") === "true") {
            // only add to graph tracking list if set to track a mouse position.  Otherwise is only used for scaline

            shape.on("mouseenter", () => {
               document.getElementById("xy").style.visibility = "visible"
            })

            shape.on("mouseleave", () => {
               document.getElementById("xy").style.visibility = "hidden"
            })

            shape.on("xyupdate mousemove", (evt) => {  // xyupdate if fired from controls
               let target = evt.target;
               let mousePos = _stage.getPointerPosition();
              // let mousePos = target.getAbsolutePointerPosition();
               let xy = pixelToEngineering([mousePos.x, mousePos.y], target.graphscale)

               document.getElementById("xy").innerHTML = target.description + ' x=' + xy[0].toFixed(2) + ', y=' + (xy[1]).toFixed(2);
            })

            shape.description = zyObject.innerHTML;  // this is messy because the object needs a description but isn't a solnType
            _graphs.push(shape)
         }
      }



      // determine which layer ahd add in additional parameters
      let attr = zyObject.getAttribute("solnType")
      if (attr === null) {
         _layerProblem.add(shape);
      } else {
         shape.solnType = attr;
         shape.solnObj = zyObject.getAttribute("solnObj")
         shape.description = zyObject.innerHTML;
         _layerSolution.add(shape);
      }

   }

   zyObjects = xmlDoc.getElementsByTagName("zyGroup");
   // cycle through all of the groups
   for (let zyObject of zyObjects) {
      var grpProb = new Konva.Group({
         //id="4" name="group: 1" objectIds="1,2"
         name: zyObject.getAttribute("name"),
         id: zyObject.getAttribute("id"),
      })

      _layerProblem.add(grpProb)
      var grpSoln = grpProb.clone();
      _layerSolution.add(grpSoln)


      // set the default scaling for the group 
      grpProb.graphscale = { xo: 0, xs: 1, yo: 0, ys: 1, dx: 0, dy: 0 } // 1:1 scaling
      grpSoln.graphscale = { xo: 0, xs: 1, yo: 0, ys: 1, dx: 0, dy: 0 } // 1:1 scaling

      let id = zyObject.getAttribute("scaleGraph");
      // if (id === null) {
      //    grpProb.graphscale = { xo: 0, xs: 1, yo: 0, ys: 1 } // 1:1 scaling
      //    grpSoln.graphscale = { xo: 0, xs: 1, yo: 0, ys: 1 } // 1:1 scaling
      // } else {
      //    let graph = _layerProblem.find("#" + id); // only check the problem layer.  Doesn't make sense to put a scaling graph on the solution layer
      //    if (graph.length !== 0) {
      //       grpProb.graphscale = graph[0].graphscale;
      //       grpSoln.graphscale = graph[0].graphscale;
      //    }
      // }


      let items = zyObject.getAttribute("objectIds").split(",")
      for (let item of items) {
         let gitm = _layerProblem.find("#" + item)
         if (gitm.length !== 0) {
            // ids should be unique so should have only one item in the list
            gitm[0].moveTo(grpProb);
            // if the item is a graph item, copy the scale over to both groups
            // since graphs should only appear on the layerProblem, check for it here.
            if (gitm[0].graphscale !== undefined) {
               grpProb.graphscale = gitm[0].graphscale;
               grpSoln.graphscale = gitm[0].graphscale;
            }
         }

         gitm = _layerSolution.find("#" + item)
         if (gitm.length !== 0) gitm[0].moveTo(grpSoln);
         // if the item is a graph item, copy the scale over
      }
   }


   // list of solution items
   zyObjects = xmlDoc.getElementsByTagName("solnList");
   if (zyObjects.length === 0) window.alert("Missing solnList")
   _solnitemlist = zyObjects[0].innerHTML.split(",");
   _solnitemlist.every((value, i, arr) => { arr[i] = value.trim(); })
   _solnitemlist.every((value) => { value = value.trim(); })


   // Load in the variables and update the model 
   // update modelParams

   // can't move or scale boxes  **** check this ****


   var params = modelParams.split(";");
   var prevAction = "";
   params.forEach(item => {
      // name_attr=value
      let temp1 = item.trim().split("=");
      let temp2 = temp1[0].trim().split("_");


      let gitObj = [];

      gitObj.push(..._layerProblem.find("." + temp2[0]));
      gitObj.push(..._layerSolution.find("." + temp2[0]));

      gitObj.forEach(obj => {

         // Found an object
         if (temp2[1] === "rotation" && prevAction !== "offset") {
            // rotate about the center
            centerRotateNode(obj, JSON.parse(temp1[1])) // no check on parse validity, so could crash

         } else {
            let value = JSON.parse(temp1[1]);
            let parent = obj.getParent()
            let svalue = value; // the defauls value
            if (parent.getType() === "Group") {
               // apply the scaling
               //  either a scalar or and array.  
               if (temp2[1] === 'x' || temp2[1] === 'left' || temp2[1] === 'width') {
                  svalue = engineeringToPixel([value, 0], parent.graphscale)[0] // extract x value
               } else if (temp2[1] === 'y' || temp2[1] === 'top' || temp2[1] === 'height') {
                  svalue = engineeringToPixel([0, value], parent.graphscale)[1] // extract y value
               } else if (temp2[1] === 'points') {
                  svalue = engineeringToPixel(value, parent.graphscale)
               } else {  
                  svalue = value;              // redundant assignment for clearity, assume is text.  Need a cleaner way to identify and parse attribute types  
               }
            }
            obj.setAttr(temp2[1], svalue);  // no check on parse validity, so could crash
         }
         prevAction = temp2[1]; // remember if need to center the rotation

      })
   })

   _layerProblem.cache({ drawBorder: false });   // cache to optimize drawing of the problem statement.


   return //initDone; // return an array of promises
}




// calculate overlap
function answerOverlap(answer, solution, tolerance, compareType) {
   // solnType:   AllInside, AllInsideDir, AnyInside, NoneInside

   // if has All in the compareType look for any answer outside of the solution shape
   var compositeType = compareType.includes("All") ? "source-out" : "source-in";  // NoneInside results in a source-in.
   _layerCalcs.clearCache();
   // create a clone with the same transform.  Account for nesting in groups
   var solutionClone = solution.clone().setAttrs(solution.getAbsoluteTransform().decompose());
   solutionClone.absolutePosition(solution.getAbsolutePosition());  // something weird about the transformation when there is an offset
   solutionClone.opacity(1)
   //  solutionClone.fill('black')
   //  solutionClone.stroke('black')

   // Really don't need to transform since the answer is on a single layer
   // BUG  this transform results in a 6 pixel shift in y for arrows.  Why? 
   //var answerClone = answer.clone().setAttrs(answer.getAbsoluteTransform().decompose());

   var answerClone = answer.clone();
   answerClone.absolutePosition(answer.getAbsolutePosition())
   answerClone.opacity(1)
   // answerClone.fill('black')
   // answerClone.stroke('black')


   solutionClone.show()  // in case it got hidden 
   answerClone.show()

   /* DEBUG  show the mapping 
      answerClone.fill('green')
      answerClone.stroke('greem')
      solutionClone.fill('blue')
      solutionClone.stroke('blue')
      _layerDebug.add(solutionClone);
      _layerDebug.add(answerClone);
      _layerDebug.draw();
      return true;
   */

   _layerCalcs.add(solutionClone);
   // answerClone.globalCompositeOperation("source-out")
   answerClone.globalCompositeOperation(compositeType)
   // _layerCalcs.getContext()._context.globalCompositeOperation="source-out"
   _layerCalcs.add(answerClone);

   _layerCalcs.draw()

   // only need to scan the union of the bounding box for the answer when looking 
   var r1 = answerClone.getClientRect();
   var imageData = _layerCalcs.getContext().getImageData(r1.x - 5, r1.y - 5, r1.width + 10, r1.height + 10).data;

   // the entire canvas if needed for debutting
   // var imageData = _layerCalcs.getContext().getImageData(0, 0, 500, 500).data;  // grab everything -- should only check union of bounding boxes, see above.


   var sum = 0;
   for (var i = 3; i < imageData.length; i += 4) {
      sum += (imageData[i] > 10 ? 1 : 0);  // 10 = lower bound for opacity.  Shouldn't be necessary.
   }
   // console.log(sum) // number of pixels 


   _layerCalcs.destroyChildren();

   // for compareTypes, the solution criterion is satisfied  as follows
   // AllInside -> sum < tolerance         nothing outside the solution region
   // AllInsideDir  -> sum < tolerance     nothing outside the solution region, but still need to check the direction separately
   // AnyInside  -> sum > tolerance        anything inside the solution region
   // NoneInside -> sum < tolerance        nothing inside the solution region

   //compareType.includes("Any") -> only true for AnyInside
   return ((sum < tolerance) !== compareType.includes("Any"))
}




document.getElementById("addVector").addEventListener("click", () => {
   var vect = new Konva.Vector(100, 100)
   //   answerItems.push(vect)
   _layerAnswer.add(vect)
})


document.getElementById("addCurve").addEventListener("click", () => {
   var curve = new Konva.CurveLine(100, 100)
   //   answerItems.push(curve)
   _layerAnswer.add(curve)
})

document.getElementById("addUser").addEventListener("click", () => {

   // load the user's object
   var imageObj = new Image();
   imageObj.onload = function () {
      var img = new Konva.UserImage(100, 100, imageObj)
      _layerAnswer.add(img)
      //   answerItems.push(img)
   };
   imageObj.src = 'user.png'

})

document.getElementById("updateModel").addEventListener("click", () => {
   // clear the model
   _layerProblem.destroyChildren();
   _layerSolution.destroyChildren();
   _graphs.forEach(item => {
      item.destroy()
   })
   _graphs.length = 0;
   parseObjects(document.getElementById("modelXML").value,
      document.getElementById("modelParams").value);

})

document.getElementById("showSoln").addEventListener("click", (evt) => {
   // clear the model
   if (evt.target.checked) {
      _layerSolution.show()
   } else {
      _layerSolution.hide()
   }

})

document.getElementById("checkSolution").addEventListener("click", (evt) => {
   // solnType:   AllInside, AllInsideDir, AnyInside, NoneInside
   // solnObj: type of object (name attribute) to test against the solnType shape, Vector, Line, name of custom object
   // solnDesc: Objects value (innerHTML) is the description

   /* DEBUG  show the mapping
   _layerDebug.destroyChildren();
  */

   const TOLERANCE = 5;
   //var solns = _layerSolution.getChildren();

   // get everything that is not a group
   var solns = _layerSolution.find(node => {
      return node.getType() !== 'Group';
   });

   // solns = [solns[0]]  // debugging
   var answ = _layerAnswer.getChildren();

   if (solns.length < 1 || answ.length < 1) {
      window.alert("Nothing to check")
      return; // bomb out if nothing to check

   }


   var text = ""
   var isSatisfied = Array(solns.length).fill(false);
   solns.forEach((sol, idx) => {
      if (!isSatisfied[idx]) {
         // compare every answer against every unsatisfied solution
         // this redundantly rechecks answers that already satisfy another solution - fix later
         answ.forEach(ans => {
            // must match the solution type
            if (sol.solnObj == ans.name()) {
               if (!isSatisfied[idx] && answerOverlap(ans.find(".ansShape")[0], sol, TOLERANCE, sol.solnType)) {
                  isSatisfied[idx] = true;
                  text += sol.description + " is correct"

                  // if a direction also required check that
                  if (sol.solnType == "AllInsideDir" && !ans.isDirectionTowards(sol.getDirPoint())) {
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
         text += sol.description + " is incorrect\n"
      }
   })

   // check for redundant item by comparing the _solnitemlist with answer items from the user
   // only need to catch extra items the user has added. Missing items will be caught by previous checks

   // this is an inefficient way to do this, fortunantly the loop only runs when checking the solution
   var anslist = [];

   answ.forEach(item => {
      anslist.push(item.name())
   })
   var nans = anslist.length

   _solnitemlist.forEach(item => {
      // find and tag found items
      for (let i = 0; i < anslist.length; i++) {
         if (item === anslist[i]) {
            anslist[i] = ""; // mark as blank so it doesn't get counted again
            nans--;
            break;
         }
      }
   })
   // optionally make a list of all non empty array items
   // var xtratext="";
   // anslist.forEach(item=>{
   //    if (item !== ""){
   //       xtratext += item+" "
   //    }
   // })
   if (nans > 0) {
      if (nans === 1) {
         text += "\nThere is 1 additional incorrect component";
      } else {
         text += "\nThere are " + nans + " additional incorrect components";
      }

   }



   window.alert(text)

})

// Startup ----------

// Globals
// Stage
var _stage = new Konva.Stage({
   container: 'container',   // id of container <div>
   width: 500,
   height: 500
});


// then create layer
var _layerProblem = new Konva.Layer();
var _layerSolution = new Konva.Layer();
_layerSolution.listening(false);  // don't need to track this layer
var _layerAnswer = new Konva.Layer();
// var layerGraph = new Konva.Layer();

/* DEBUG  show the mapping 
var _layerDebug = new Konva.Layer();
*/

_stage.add(_layerProblem);
_stage.add(_layerSolution);
_stage.add(_layerAnswer);
// _stage.add(layerGraph);

/* DEBUG  show the mapping
_stage.add(_layerDebug)
_layerAnswer.opacity(0.1)
_layerSolution.opacity(0.1)
_layerProblem.opacity(0.1)
*/

// Hidden layer for checking the solution
var _layerCalcs = new Konva.Layer();
_layerCalcs.size({
   width: 500,
   height: 500
});

_layerCalcs.listening(false);
// _stage.add(_layerCalcs);  // for debugging
// _layerCalcs.hide();      // for debugging

// draw the canvas
_layerProblem.draw();
_layerAnswer.draw();

_layerSolution.hide();
_layerSolution.draw();

var _graphs = [];
var _solnitemlist = []

parseObjects(document.getElementById("modelXML").value,
   document.getElementById("modelParams").value);



