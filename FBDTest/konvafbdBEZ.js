// ---- error codes
_resultsStatus = {
   'passes': ' is correct',
   'wrong_direction': ' is correct but in the wrong direction',
   'not_filled': ' is partially correct',
   'fails': ' is not correct'
}

function _ptInRect(pt, rect) {
   return ((pt.x > rect.x) && (pt.x < rect.x + rect.width) && (pt.y > rect.y) && (pt.y < rect.y + rect.height))
}

// snapping data
class snaps {

   constructor() {
      // scan through the problem layer and get all snapping items
      this.coords = [];
      this.snapdropdown = document.createElement("select")

      var snaps = _layerProblem.find(node => {
         return node.getAttr("snap") === true
         //  return node.listening();
      })

      var myOption = document.createElement("option");
      myOption.text = "free";
      myOption.value = 0;
      this.snapdropdown.add(myOption);

      this.coords.push({ x: 0, y: 0, node: null }) // filler

      snaps.forEach((node, i) => {
         var xy = node.getAbsolutePosition();

         var myOption = document.createElement("option");
         myOption.text = node.name();
         myOption.value = i + 1; // since already put in dummy value for "free"
         this.coords.push({ x: xy.x + node.width() / 2, y: xy.y + node.height() / 2, node: node });
         this.snapdropdown.add(myOption);

         // item.on("mouseover",evt=>{
         //    evt.target.opacity(1)
         // } )

         // item.on("mouseout",evt=>{
         //    evt.target.opacity(0.1)
         // } )
      })
   }

}

// 
//===== STATUS Dialog routines =====
class statusDialog {
   constructor() {
      this.callback = null;
      this.pos1 = 0;
      this.pos2 = 0;
      this.pos3 = 0;
      this.pos4 = 0;
      this.selection = null;
      this.me = document.getElementById("status")

      document.getElementById("statusClose").addEventListener("click", e => {
         this.open(null, null)
      })

      document.getElementById("statusApply").addEventListener("click", e => {
         this.selection.itemName.text(document.getElementById("item_name").value)
         this.callback(this.selection)
      })


   }

   scale(pos) {
      let name = document.getElementById("status_coords").value;
      if (name === "") return pos;

      let scale = _layerSolution.find("." + name)[0].graphscale; // assumes group exists
      return pixelToEngineering(pos, scale);

   }

   init(snaps) {
      // not rolled into the contructor because need to be called delayed from a promise
      // load up the coordinates menu
      let dropdown = document.getElementById("status_coords");

      var groups = _layerSolution.find(node => {
         return node.getType() == 'Group';
      });

      // enable to hide/show coords in dialog
      // if (groups.length >0){
      //    document.getElementById("showCoords").style.display="inline-block"
      //   // document.getElementById("showCoords").style.backgroundColor="red"
      // } else {
      //    document.getElementById("showCoords").style.display="none";
      //   // document.getElementById("showCoords").style.backgroundColor="blue"
      // }

      if (groups.length === 0) {
         document.getElementById("showCoords").style.display = "none"
      } else { // assume coords are tied to groups
         groups.forEach(grp => {
            let newOption = new Option(grp.name(), grp.name());
            dropdown.add(newOption, undefined);
         })
      }

      // this is a hack for demo only, need to make a more generic class for handing different status boxes
      document.getElementById("headLoc").appendChild(snaps.snapdropdown.cloneNode(true))
      document.getElementById("dirStart").appendChild(snaps.snapdropdown.cloneNode(true))
      document.getElementById("dirEnd").appendChild(snaps.snapdropdown.cloneNode(true))

   }


   open(params, applyCallback) {

      // state = null = closes the status box
      // else =  id of status style to open

      if (params === null) {
         this.me.style.display = 'none';
         document.onmouseup = closeDragElement;
      } else {
         this.callback = applyCallback;
         this.selection = params.selection;

         // hide all open status items
         var statusTypes = document.querySelectorAll(".status_params");
         statusTypes.forEach(item => {
            item.style.display = "none";
         })

         document.getElementById("statusTitle").innerHTML = params.title;

         document.getElementById(params.view).style.display = "block"
         this.me.style.display = 'block';

         document.getElementById("item_name").value = params.selection.itemName.text()
         document.getElementById("statusTitleBar").onmousedown = dragMouseDown;
      }

   }

}

// copied code for draggable div from w3schools
// fix reference to _status item

function dragMouseDown(e) {
   e.preventDefault();
   // get the mouse cursor position at startup:
   _status.pos3 = e.clientX;
   _status.pos4 = e.clientY;
   document.onmouseup = closeDragElement;
   // call a function whenever the cursor moves:
   document.onmousemove = elementDrag;
}

function elementDrag(e) {
   e.preventDefault();
   // calculate the new cursor position:
   _status.pos1 = _status.pos3 - e.clientX;
   _status.pos2 = _status.pos4 - e.clientY;
   _status.pos3 = e.clientX;
   _status.pos4 = e.clientY;
   // set the element's new position:
   _status.me.style.top = (_status.me.offsetTop - _status.pos2) + "px";
   _status.me.style.left = (_status.me.offsetLeft - _status.pos1) + "px";
}

function closeDragElement() {
   // stop moving when mouse button is released:
   document.onmouseup = null;
   document.onmousemove = null;
}

// =================================

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

      this.itemName = new Konva.Text({
         text: "x",
         x: x,
         y: y
      })

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
      this.add(this.arrow, this.tail, this.head, this.itemName, this.dummy)

      this.tail.on("dragmove", () => {


         var tailPos = this.tail.getStage().getPointerPosition();
         var headPos = this.head.absolutePosition()
         var dxy = this.calcdxy(headPos, tailPos)
         this.arrow.rotation(dxy.theta)

         this.tail.absolutePosition({ x: headPos.x - dxy.dx, y: headPos.y - dxy.dy })
         this.arrow.absolutePosition({ x: headPos.x - dxy.dx, y: headPos.y - dxy.dy })
         this.dummy.absolutePosition({ x: headPos.x - dxy.dx, y: headPos.y - dxy.dy })

         // var mousePos = this.tail.getStage().getPointerPosition();
         // var headPos = this.head.absolutePosition()
         // var dx = headPos.x - mousePos.x
         // var dy = headPos.y - mousePos.y
         // var theta = Math.atan2(dy, dx)
         // this.arrow.rotation(theta * 180 / Math.PI)
         // dx = 70 * Math.cos(-theta)
         // dy = 70 * Math.sin(-theta)
         // this.tail.absolutePosition({ x: headPos.x - dx, y: headPos.y + dy })
         // this.arrow.absolutePosition({ x: headPos.x - dx, y: headPos.y + dy })
         // this.dummy.absolutePosition({ x: headPos.x - dx, y: headPos.y + dy })



         this.itemName.absolutePosition({ x: headPos.x - dxy.dx, y: headPos.y - dxy.dy })
         // this.itemName.absolutePosition({ x: headPos.x - dx, y: headPos.y + dy })
         //  console.log(dx,dy,theta*180/Math.PI)
         updateGraphXY(tailPos);
      })

      this.tail.on("mouseenter", () => {
         updateGraphXY(this.getStage().getPointerPosition())
      })

      // a bug in Konva or in my code prevents this from firing correctly
      this.head.on("dragmove", () => {

         var headPos = this.head.getStage().getPointerPosition();
         var tailPos = this.tail.absolutePosition()
         var dxy = this.calcdxy(headPos, tailPos)
         this.arrow.rotation(dxy.theta)

         this.head.absolutePosition({ x: tailPos.x + dxy.dx, y: tailPos.y + dxy.dy })
         this.dummy.absolutePosition({ x: tailPos.x + dxy.dx, y: tailPos.y + dxy.dy })

         // var mousePos = this.head.getStage().getPointerPosition();
         // var tailPos = this.tail.absolutePosition()
         // var dx = mousePos.x - tailPos.x
         // var dy = mousePos.y - tailPos.y
         // var theta = Math.atan2(dy, dx)
         // this.arrow.rotation(theta * 180 / Math.PI)
         // dx = 70 * Math.cos(theta)
         // dy = 70 * Math.sin(theta)
         // this.head.absolutePosition({ x: tailPos.x + dx, y: tailPos.y + dy })
         // this.dummy.absolutePosition({ x: tailPos.x + dx, y: tailPos.y + dy })
         //  console.log(dx,dy,theta*180/Math.PI)
         updateGraphXY(headPos);
      })

      this.head.on("mouseenter", () => {
         updateGraphXY(this.getStage().getPointerPosition())
      })

      this.arrow.on("pointerdblclick", (evt) => {
         var head = this.head.getAbsolutePosition();
         var tail = this.tail.getAbsolutePosition();

         // var xy = _status.scale([head.x, head.y, tail.x, tail.y]);


         // document.getElementById("arrow_head_x").value = xy[0]
         // document.getElementById("arrow_head_y").value = xy[1]


         // document.getElementById("arrow_tail_x").value = xy[2]
         // document.getElementById("arrow_tail_y").value = xy[3]
         // update controls to match vector's position
         // look for head in a snap box

         // brute force the point in rect calculation.  The alternate approach is to put all snap rectangle on their own layer and then
         // use Konva to find the hit rect.  The down side is that the layer need to be be transformed with any transformation to the model image
         // keeping the snaps on the problemlayer let's this happen automatically.
         // However, the point in rect will be off if the snap rect ends up being rotated or is not rectangular (ex, rounded edges)
         var n = _snaps.coords.length

         // match the head position
         document.getElementById("headLoc").lastChild.value = 0;
         for (let i = 1; i < n; i++) {
            if (_ptInRect(head, _snaps.coords[i].node.getClientRect())) {
               // found a match
               document.getElementById("headLoc").lastChild.value = i;
               break
            }
         }

         // match the orientation
         // this is ugly.  An alternate approach is to precalculate all of the possible angles for every vector combination between points and
         // look for matches
         document.getElementById("dirStart").lastChild.value = 0;
                     document.getElementById("dirEnd").lastChild.value = 0;
         var xy;
         for (let i = 0; i<n; i++){
            for (let j=0; j<n; j++){
               if (i!==j){
                  xy=this.calcdxy(_snaps.coords[j],_snaps.coords[i])
                  if (Math.abs(this.arrow.rotation() - xy.theta) < 2){
                     // found a match so break

                     document.getElementById("dirStart").lastChild.value = i;
                     document.getElementById("dirEnd").lastChild.value = j;
                     i = n+1; // ugly force out of outer loop
                     break;
                  }

               }
            }
         }

         _status.open({ selection: this, view: "paramsVector", title: "Vector" }, this.handleStatusApply);
      })
   }

   calcdxy(headpos, tailpos) {

      var dx = headpos.x - tailpos.x
      var dy = headpos.y - tailpos.y
      var theta = Math.atan2(dy, dx)
    //  this.arrow.rotation(theta * 180 / Math.PI)
      dx = 70 * Math.cos(theta)
      dy = 70 * Math.sin(theta)

      return { dx: dx, dy: dy, theta:theta*180/Math.PI }

   }

   handleStatusApply(me) {

      // apply callback
      let hidx = Number(document.getElementById("headLoc").lastChild.value)
      let headPos = (hidx === 0 ? me.head.getAbsolutePosition() : _snaps.coords[hidx])

      // calculate  vector direction
      let sidx = Number(document.getElementById("dirStart").lastChild.value)
      let eidx = Number(document.getElementById("dirEnd").lastChild.value)
      let dxy;

      if (sidx === 0 || eidx === 0) {
         // free orientation
         dxy = me.calcdxy(me.head.absolutePosition(), me.tail.absolutePosition())
        
      } else {
         dxy = me.calcdxy(_snaps.coords[eidx], _snaps.coords[sidx])

      }

      me.head.absolutePosition({ x: headPos.x, y: headPos.y })
      me.arrow.rotation(dxy.theta)
      me.tail.absolutePosition({ x: headPos.x - dxy.dx, y: headPos.y - dxy.dy })
      me.arrow.absolutePosition({ x: headPos.x - dxy.dx, y: headPos.y - dxy.dy })

      me.itemName.absolutePosition({ x: headPos.x - dxy.dx, y: headPos.y - dxy.dy })
      // console.log("update vector status")
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


      this.points = [0, 0, 25, 0, 50, 0, 75, 0];//, 50, 50,  20, 50, 20,80];

      this.curve = new Konva.Line({
         points: this.points,
         // fill: 'blue',
         stroke: 'red',
         strokeWidth: 2,
         //draggable: true,
         rotation: 0,
         hitStrokeWidth: 6,
         // offsetX: 70,
         // offsetY: 6,
         name: "ansShape",

         bezier: true,
         // closed: true,
         tension: 0
      });

      this.itemName = new Konva.Text({
         text: "A",
         x: 0,
         y: 5
      })

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

      this.add(this.curve, this.itemName, ...this.controls, this.dummy)

      this.curve.on("pointerdblclick", (evt) => {
         _status.open({ selection: this, view: "paramsCurve", title: "Curve" }, this.handleStatusUpdate);
      })
   }

   handleStatusUpdate() {
      console.log("update curve status")
   }

   // add control corresponding to x,y starting at point[2*j]
   addControl(j) {
      var i = j * 2;
      this.controls[j] = new Konva.Circle({
         x: this.points[i],
         y: this.points[i + 1],
         radius: (j % 3 ? 3 : 6),
         stroke: '#666',
         fill: '#ddd',
         strokeWidth: 1,
         draggable: true,
         opacity: 0.5,
         name: j.toString() // this array index
      })

      // this isn't quite right because tracks to pointer location and not the circle's center?
      this.controls[j].on("dragmove", (evt) => {
         var offsetP = this.absolutePosition();
         var mousePos = this.getStage().getPointerPosition();
         var idx = Number(evt.target.name());
         // new x,y coords for the point
         var nx = mousePos.x - offsetP.x;
         var ny = mousePos.y - offsetP.y;


         var x = this.points[idx * 2]
         var y = this.points[idx * 2 + 1]
         var dx = nx - this.points[idx * 2];
         var dy = ny - this.points[idx * 2 + 1];
         var cx, cy, dy, px, py, S, dD;

         if (idx % 3 === 0) {
            // if an end point, then move the control points proportionally 
            // the distance to the previous control point

            // points behind
            if (idx >= 3) {
               px = this.points[(idx - 3) * 2];
               py = this.points[(idx - 3) * 2 + 1];
               // total distance to previous major control point
               dD = Math.sqrt((x - px) * (x - px) + (y - py) * (y - py))
               // nearest control point
               cx = this.points[(idx - 1) * 2]
               cy = this.points[(idx - 1) * 2 + 1]
               S = Math.sqrt((px - cx) * (px - cx) + (py - cy) * (py - cy)) / dD;
               this.points[(idx - 1) * 2] += dx * S
               this.points[(idx - 1) * 2 + 1] += dy * S
               this.controls[idx - 1].absolutePosition({ x: offsetP.x + this.points[(idx - 1) * 2], y: offsetP.y + this.points[(idx - 1) * 2 + 1] })

               // furtherest control point
               cx = this.points[(idx - 2) * 2]
               cy = this.points[(idx - 2) * 2 + 1]
               S = Math.sqrt((px - cx) * (px - cx) + (py - cy) * (py - cy)) / dD;
               this.points[(idx - 2) * 2] += dx * S
               this.points[(idx - 2) * 2 + 1] += dy * S

               this.controls[idx - 2].absolutePosition({ x: offsetP.x + this.points[(idx - 2) * 2], y: offsetP.y + this.points[(idx - 2) * 2 + 1] })
            }

            // points infront
            if ((idx + 3) * 2 < this.points.length) {
               px = this.points[(idx + 3) * 2];
               py = this.points[(idx + 3) * 2 + 1];
               // total distance to previous major control point
               dD = Math.sqrt((x - px) * (x - px) + (y - py) * (y - py))
               // nearest control point
               cx = this.points[(idx + 1) * 2]
               cy = this.points[(idx + 1) * 2 + 1]
               S = Math.sqrt((px - cx) * (px - cx) + (py - cy) * (py - cy)) / dD;
               this.points[(idx + 1) * 2] += dx * S
               this.points[(idx + 1) * 2 + 1] += dy * S
               this.controls[idx + 1].absolutePosition({ x: offsetP.x + this.points[(idx + 1) * 2], y: offsetP.y + this.points[(idx + 1) * 2 + 1] })

               // furtherest control point
               cx = this.points[(idx + 2) * 2]
               cy = this.points[(idx + 2) * 2 + 1]
               S = Math.sqrt((px - cx) * (px - cx) + (py - cy) * (py - cy)) / dD;
               this.points[(idx + 2) * 2] += dx * S
               this.points[(idx + 2) * 2 + 1] += dy * S

               this.controls[idx + 2].absolutePosition({ x: offsetP.x + this.points[(idx + 2) * 2], y: offsetP.y + this.points[(idx + 2) * 2 + 1] })
            }
         }
         this.points[idx * 2] = nx;
         this.points[idx * 2 + 1] = ny;
         this.curve.points(this.points);
         evt.target.absolutePosition(mousePos)

         if (idx === 0) this.itemName.absolutePosition({ x: mousePos.x, y: mousePos.y + 5 })

         updateGraphXY(mousePos)

      })

      this.controls[j].on("mouseenter", () => {
         updateGraphXY(this.getStage().getPointerPosition())
      })

      // double click add a new curve segment after the clicked control point
      if (j % 3 === 0) {
         // action for large nodes
         this.controls[j].on("pointerdblclick", (evt) => {
            var idx = Number(evt.target.name()); // index of selected point


            if (this.controls.length > 4 && idx < this.controls.length - 1) {
               // delete three points to the right

               // remove the controls
               for (var i = idx; i < idx + 3; i++) {
                  this.controls[i].destroy()
               }
               this.controls.splice(idx, 3)
               this.points.splice(idx * 2, 6);
               this.curve.points(this.points)
               // rename the controls to match their indices
               for (var i = idx; i < this.controls.length; i++) {
                  this.controls[i].name(i.toString())
               }



            } else if (idx === this.controls.length - 1) {
               // adding to the end
               // extrapolate from tangent at the end point
               let dx = this.points[2 * idx] - this.points[2 * (idx - 1)];
               let dy = this.points[2 * idx + 1] - this.points[2 * (idx - 1) + 1];   // extra math for clarity
               let dL = Math.sqrt(dx * dx + dy * dy);
               dx = dx / dL;  // unit vector directions  (direction cosines)
               dy = dy / dL;
               this.points.push(this.points[2 * idx] + 20 * dx, this.points[2 * idx + 1] + 20 * dy
                  , this.points[2 * idx] + 40 * dx, this.points[2 * idx + 1] + 40 * dy
                  , this.points[2 * idx] + 60 * dx, this.points[2 * idx + 1] + 60 * dy)

               // this.points.push(this.points[2 * idx] + 20, this.points[2 * idx + 1]
               //    , this.points[2 * idx] + 40, this.points[2 * idx + 1]
               //    , this.points[2 * idx] + 60, this.points[2 * idx + 1])

               idx++; // new point
               this.curve.points(this.points);
               for (let k = idx; k < idx + 3; k++) {
                  this.addControl(k);
                  // this.controls[k] = this.addControl(k); //this.controls[k - 1].clone()
                  this.controls[k].name(k.toString())
                  this.controls[k].x(this.points[k * 2])
                  this.controls[k].y(this.points[k * 2 + 1])
                  // this.remove(this.dummy)
                  this.add(this.controls[k])//, this.dummy)
               }
            }

         }

         )
      } else {
         // action for small nodes = linearize = align small nodes between large nodes
         this.controls[j].on("pointerdblclick", (evt) => {
            var idx = Number(evt.target.name()); // index of selected point


            // base calculation on left most node 
            if (j % 3 === 2) {
               idx--
            }
            // get dx dy between large nodes
            var xL = this.points[2 * (idx - 1)]
            var yL = this.points[2 * (idx - 1) + 1]
            //var xR = this.points[2 * (idx+2)]
            //var yR = this.points[2 * (idx+2)+1]
            var dx = (this.points[2 * (idx + 2)] - xL) / 3; // R - L nodes
            var dy = (this.points[2 * (idx + 2) + 1] - yL) / 3
            this.points[2 * (idx)] = xL + dx;
            this.points[2 * (idx) + 1] = yL + dy;
            this.points[2 * (idx + 1)] = xL + 2 * dx;
            this.points[2 * (idx + 1) + 1] = yL + 2 * dy;
            this.controls[idx].x(xL + dx);
            this.controls[idx].y(yL + dy);
            this.controls[idx + 1].x(xL + 2 * dx);
            this.controls[idx + 1].y(yL + 2 * dy);
         })
      }
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

      this.itemName = new Konva.Text({
         text: "B",
         x: -theimage.width / 2,
         y: -theimage.height / 2
      })

      this.add(this.image, this.itemName)
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
   var xy; // holds clientrect encapsulating objects to be rotated

   // let pxy = node.position();
   if (node.getType() === "Group") {
      // always used the corresponding group in the problemLayer to calculate the bounds for rotation
      // this assumes the solution objects are bounded by the problem objects
      // makes assumtion about existance, OK to find yourself
      xy = _layerProblem.find("." + node.name())[0].getClientRect();
      node.setAttr("offset", { x: xy.x + xy.width / 2, y: xy.y + xy.height / 2 });
   } else {
      xy = node.getClientRect();
      node.setAttr("offset", { x: xy.width / 2, y: xy.height / 2 });
   }
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
      pxy.push((exy[i] - scale.xo) / scale.xs);
      pxy.push((exy[i + 1] - scale.yo) / scale.ys);
   }
   return pxy
}

async function loadImage(url, node) {
   let img = new Image()
   img.src = url;
   await img.decode();
   node.image(img);
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



   var loadingImages = [];
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
            listening: false
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
            text: zyObject.getElementsByTagName("text")[0].innerHTML,
            listening: false // or pull the  zyObject inner html and parse off the text tag
            //  rotation: Number(cleanAttr(zyObject.getAttribute("transformDeg",0)))  // not reliable because Animator is use the same rotation method as Konva.  
            // Needs mapping update - maybe set object center using offset and x,y value
         })

         // if rotation, make adjustments to position to get center rotation
         centerRotateNode(shape, cleanAttr(zyObject.getAttribute("transformDeg", 0)))

         // used to indicate the top of the object
         shape.getDirPoint = function () {
            return this.getAbsoluteTransform().getTranslation()
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
            closed: cleanAttr(zyObject.getAttribute("closed", "false")) === "true" ? true : false, // messy
            listening: false
            //  rotation: Number(cleanAttr(zyObject.getAttribute("transformDeg",0)))  // not supported, use transformDeg for consistency  
            // Needs mapping update - maybe set object center using offset and x,y value
         })

         // rotation not implemented - rotates, but may not give the desired  results
         // centerRotateNode(shape,cleanAttr(zyObject.getAttribute("transformDeg",0)))

         // used to indicate the top of the object
         shape.getDirPoint = function () {
            var pts = this.points();
            var xy = this.getAbsoluteTransform().getTranslation()
            return { x: pts[0] + xy.x, y: pts[1] + xy.y }
         }
      } else if (zyObject.getAttribute("objType") == "image") {
         // create object with a blank image to establish a place holder and preserve layering order
         shape = new Konva.Image({
            image: null,  // placeholder image could use a dummy image
            x: cleanAttr(zyObject.getAttribute("left")),
            y: cleanAttr(zyObject.getAttribute("top")),
            width: cleanAttr(zyObject.getAttribute("width"), 200),
            height: cleanAttr(zyObject.getAttribute("height"), 200),
            name: zyObject.getAttribute("objName"),
            id: zyObject.getAttribute("objNum"),
            listening: false
            //rotation: cleanAttr(zyObject.getAttribute("transformDeg", 0))
         });

         loadingImages.push(loadImage(zyObject.getAttribute("googleDriveFileID"), shape))



         // returns the "head" for the item.  used when determining direction
         shape.getDirPoint = function () {
            return this.getAbsoluteTransform().getTranslation() // or should use the top center of the image?
         }

      } else if (zyObject.getAttribute("objType") == "snap") {
         shape = new Konva.Rect({
            x: cleanAttr(zyObject.getAttribute("left")),
            y: cleanAttr(zyObject.getAttribute("top")),
            width: cleanAttr(zyObject.getAttribute("width"), 20),
            height: cleanAttr(zyObject.getAttribute("height"), 20),
            id: zyObject.getAttribute("objNum"),
            name: zyObject.getAttribute("objName"),
            fill: cleanAttr(zyObject.getAttribute("background-color"), 'red'),
            cornerRadius: cleanAttr(zyObject.getAttribute("border-radius"), 0),
            stroke: cleanAttr(zyObject.getAttribute("border-color"), "black"),
            opacity: 0, // cleanAttr(zyObject.getAttribute("opacity"), 100) / 100,
            listening: false,
            snap: true
            //  rotation: Number(cleanAttr(zyObject.getAttribute("transformDeg",0)))  // not reliable because Animator is use the same rotation method as Konva.  
            // Needs mapping update - maybe set object center using offset and x,y value
         })

      } else if (zyObject.getAttribute("objType") == "graph") {
         // graphs options
         //  use to scale mouse positions
         //  use to set the scaling for items in a group
         let width = cleanAttr(zyObject.getAttribute("width"), 300)
         let height = cleanAttr(zyObject.getAttribute("height"), 300)
         let x = cleanAttr(zyObject.getAttribute("left"))
         let y = cleanAttr(zyObject.getAttribute("top"))
         shape = new Konva.Rect({
            x: x,
            y: y,
            width: width, // cleanAttr(zyObject.getAttribute("width"), 200),
            height: height, //cleanAttr(zyObject.getAttribute("height"), 200),
            opacity: 0, // 0.2,  // non zero for DEBUGGING
            fill: 'gray',
            id: zyObject.getAttribute("objNum"),
            listening: true
         })
         let c = JSON.parse(cleanAttr(zyObject.getAttribute("graphScale"), "[0,0,10,10]")); // xmin, ymin,  xmax,ymax
         // scaling  engineeringValue = xoff + xscale* pixelValue
         //   of     pixelValue =  (engineeringValue-xoff)/xscale    // accept the division
         // dx,dy accounts for the graph's position
         // c = xmin, ymin,  xmax, ymax
         //       0    1       2     3
         let Xs = (c[2] - c[0]) / width;
         let Xo = c[0] - Xs * x;
         let Ys = (c[1] - c[3]) / height;
         let Yo = c[3] - Ys * y;
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

   // wait for all of the images to load before updating values
   Promise.all(loadingImages).then(() => {


      // handle the groups
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

      // adjust base on the parameters
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

      _snaps = new snaps();

      _status.init(_snaps);



      return //initDone; // return an array of promises
   })

   return;

}




// calculate overlap
function answerOverlap(answer, solution, tolerance, compareType) {
   var status = { satisfied: false, message: "" } // {satisfied: true/false, message: the message}
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

   //_layerCalcs.getContext()._context.globalCompositeOperation=compositeType
   _layerCalcs.add(answerClone);

   _layerCalcs.draw()

   // only need to scan the answer's bounding box when checking the solution 
   var pxr = _layerCalcs.getContext().canvas.getPixelRatio(); // account for HDPI scaling by Konva
   var r1 = answerClone.getClientRect();
   var imageData = _layerCalcs.getContext().getImageData(pxr * r1.x - 5, pxr * r1.y - 5, pxr * r1.width + 10, pxr * r1.height + 10).data;

   // the entire canvas if needed for debugging
   // var imageData = _layerCalcs.getContext().getImageData(0, 0, 1000, 1000).data;  // grab everything -- should only check union of bounding boxes, see above.


   var sum = 0;
   for (var i = 3; i < imageData.length; i += 4) {
      sum += (imageData[i] > 10 ? 1 : 0);  // 10 = lower bound for opacity.  Shouldn't be necessary.
   }
   // console.log(sum) // number of pixels 

   // the solution can complete or partially fail (= passes the shape enclusion/exclusion test but may be the wrong direction or a partially
   // satisfied curve object)
   // for complete fails use the default status (= fails) otherwise check for partial fails.the status and bypass other checks


   // Notes for compareTypes, the solution criterion is satisfied  as follows
   // AllInside -> sum < tolerance         nothing outside the solution region
   // AllInsideDir  -> sum < tolerance     nothing outside the solution region, but still need to check the direction separately
   // AnyInside  -> sum > tolerance        anything inside the solution region
   // NoneInside -> sum < tolerance        nothing inside the solution region
   //compareType.includes("Any") -> only true for AnyInside
   if ((sum < tolerance) !== compareType.includes("Any")) {
      // the object shape test pass, but need to check for partial fails
      status.satisfied = true;
      status.message = _resultsStatus.passes; // defaults satisfied message

      // now check for partially satisfied conditions and update the message, Ex:  a curve not completely filling the shape, or a vector in the wrong direction

      // detect when an answer is inside the solution, but is supposed to fill the solution
      // implemented for curves.  will need to do something similar if add abily to create areas answers
      //  if solution type is a curve and compareType is AllInsideFill
      // If the AllInside is not satisfed flag as an error
      if (compareType.includes("Fill") && (solution.solnObj === "curve")) {
         // have a curve object that is inside the specified solution shape and Fill type comparison is specified
         // can do a simple text by slicing the solutions bounding box and checking for a part of the answer in each slice
         // only doing a crude slicing 
         r1 = solutionClone.getClientRect();
         let dx = (pxr * (r1.width - 20)) / 3; // -20 for the width of the slice 3 slices = both ends and two center slices
         // _layerCalcs.remove(solutionClone);
         solutionClone.hide()
         answerClone.globalCompositeOperation("source-over"); // redraw just the answer
         _layerCalcs.draw();

         // ** NOTE: This approach reporst error the same as if the answer was ouside the solution
         //    better to return and error code (not just T or F) stating that the answer is incomplete
         // capture both edges of the bounding box plus two center slices
         for (let x = pxr * r1.x; x < pxr * (r1.x + r1.width); x += dx) {
            imageData = _layerCalcs.getContext().getImageData(x, pxr * r1.y, pxr * 20, pxr * r1.height).data;

            let ssum = 0;
            for (var i = 3; i < imageData.length; i += 4) {
               ssum += (imageData[i] > 10 ? 1 : 0);  // 10 = lower bound for opacity.  Shouldn't be necessary.
            }
            if (ssum < 2) {
               // no answer in the required space, thus a partial fail
               status.message = _resultsStatus.not_filled;
               break   // should fix this later, final exit contition is obscured doing things this way
            }

         }
      } else if (compareType.includes("AllInsideDir") && !answer.getParent().isDirectionTowards(solution.getDirPoint())) {
         // check for object directions
         status.message = _resultsStatus.wrong_direction
      }
   }


   _layerCalcs.destroyChildren();
   return status
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

// check the solution against the answers
document.getElementById("checkSolution").addEventListener("click", (evt) => {
   // solnType:   AllInside, AllInsideDir, AnyInside, NoneInside
   // solnObj: type of object (name attribute) to test against the solnType shape, Vector, Line, name of custom object
   // solnDesc: Objects value (innerHTML) is the description

   /* DEBUG  show the mapping
   _layerDebug.destroyChildren();
  */

   const TOLERANCE = 5;
   //var solns = _layerSolution.getChildren();

   // get solution object that is not a group
   var solns = _layerSolution.find(node => {
      return node.getType() !== 'Group';
   });

   // solns = [solns[0]]  // debugging
   // get all of the answer objects
   var answ = _layerAnswer.getChildren();

   // exit if nothing to check 
   if (solns.length < 1 || answ.length < 1) {
      window.alert("Nothing to check")
      return; // bomb out if nothing to check

   }


   // compare every solution object against every answer object until a solution is satisfied
   // note that one answer can satisfy multiple solution objects
   var statusText = ""
   var isSatisfied = Array(solns.length).fill(false);  // flags when a solution object is satisfied
   var canUseAnswer = Array(answ.length).fill(true);  // flags answers that have been used to satisfy a solution with a Unique tag
   solns.forEach((sol, idx) => {
      // if (!isSatisfied[idx]) {
      // compare every answer against every unsatisfied solution
      answ.every((ans, adx) => {
         // the answer type must match the solution type
         if ((sol.solnObj == ans.name()) && canUseAnswer[adx]) {

            // status = {satisfied: true/false, message: the message}
            let status = answerOverlap(ans.find(".ansShape")[0], sol, TOLERANCE, sol.solnType)
            if (status.satisfied) {
               isSatisfied[idx] = true;  // or status.satisfied
               statusText += sol.description + status.message + "\n"
               if (sol.solnType.includes("Unique")) {
                  // used an answer object on a unique solution object so disqualify the answer object from future use
                  canUseAnswer[adx] = false;
               }
               return false; // break out of the answ loop
            }
         }
         return true; // continue
      })
      //   }
   })
   // note the unsatisfied solution objects
   statusText += "\n"
   solns.forEach((sol, idx) => {
      if (!isSatisfied[idx]) {
         statusText += sol.description + _resultsStatus.fails + "\n"
      }
   })

   // check for redundant item by comparing the _solnitemlist with answer items from the user
   // only need to catch extra answer items the user has added. Missing items will be caught by previous checks

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
         statusText += "\nThere is 1 additional incorrect component";
      } else {
         statusText += "\nThere are " + nans + " additional incorrect components";
      }

   }



   window.alert(statusText)

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
var _layerProblem = new Konva.Layer({ name: "problem" });
var _layerSolution = new Konva.Layer({ name: "solution" });
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
// duplicate the problemlayer size, account for HDI display
_layerCalcs.size({
   width: 500,
   height: 500,
});

// alternative ways to get a hidden canvas in konva
// var _stageCalcs = new Konva.Stage({
//    container: 'calcs',   // id of container <div>
//    width: 500,
//    height: 500
// });
// var _layerCalcs = new Konva.Layer();
// _stageCalcs.add(_layerCalcs)
//var _layerCalcs = _layerProblem.clone();

_layerCalcs.listening(false);
// _stage.add(_layerCalcs);  // for debugging
// _layerCalcs.hide();      // for debugging

// draw the canvas
_layerProblem.draw();
_layerAnswer.draw();

_layerSolution.hide();
_layerSolution.draw();

var _graphs = [];
var _solnitemlist = [];
var _snaps;

var _status = new statusDialog();

parseObjects(document.getElementById("modelXML").value,
   document.getElementById("modelParams").value);


// load in the select_coords


