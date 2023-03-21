/*
3D free body diagrams 
support classes and function for FBDmail.html
G. Mason 2022
1/3/2023
*/
class orthoCamera extends THREE.OrthographicCamera {
    constructor(aspect, maxdim) {
        super(-maxdim * aspect, maxdim * aspect, maxdim, -maxdim, -maxdim, maxdim);
        this.lat = 0;
        this.lon = 0;
        this.R = 30; // distance from camera
        this.xoffset = 0; //10;
        this.yoffset = 0; //5;
        this.update();
        //this.fixedObj = fixedObj;
    }

    update() {

        // let v = new THREE.Vector3(-0.8,0.8,0.3);
        //  v.unproject(this)
        // this.fixedObj.position.x=v.x;
        // this.fixedObj.position.y=v.y;
        // this.fixedObj.position.z=v.z;

        // this.fixedObj.rotation.y=this.lat;
        // //this.fixedObj.rotation.x=this.lon;


        let D = this.R * Math.cos(this.lat);
        if (D < 0.1) D = 0.1;

        this.position.y = this.R * Math.sin(this.lat) + this.yoffset
        this.position.x = D * Math.sin(this.lon) + this.xoffset;
        this.position.z = D * Math.cos(this.lon);

        this.zoom = 8;
        this.lookAt(this.xoffset, this.yoffset, 0)
        this.updateProjectionMatrix();


        // let u = this.fixedObject.position.clone();
        // u.project(this)
    }

    set latitude(newlat) {
        this.lat = newlat;
        this.update();
    }

    set longitude(newlon) {
        this.lon = newlon;
        this.update();
    }

}

class perspectCamera extends THREE.PerspectiveCamera {
    constructor(aspect, maxdim) {
        super(50, aspect, 0.1, -maxdim);
        this.lat = 0;
        this.lon = 0;
        this.R = 30; // distance from camera
        this.xoffset = 10;
        this.yoffset = 5;
        this.update();
        //this.fixedObj = fixedObj;
    }

    update() {

        // let v = new THREE.Vector3(-0.8,0.8,0.3);
        //  v.unproject(this)
        // this.fixedObj.position.x=v.x;
        // this.fixedObj.position.y=v.y;
        // this.fixedObj.position.z=v.z;

        // this.fixedObj.rotation.y=this.lat;
        // //this.fixedObj.rotation.x=this.lon;


        let D = this.R * Math.cos(this.lat);
        if (D < 0.1) D = 0.1;

        this.position.y = this.R * Math.sin(this.lat) + this.yoffset
        this.position.x = D * Math.sin(this.lon) + this.xoffset;
        this.position.z = D * Math.cos(this.lon);

        this.lookAt(this.xoffset, this.yoffset, 0)
        this.updateProjectionMatrix();


        // let u = this.fixedObject.position.clone();
        // u.project(this)
    }

    set latitude(newlat) {
        this.lat = newlat;
        this.update();
    }

    set longitude(newlon) {
        this.lon = newlon;
        this.update();
    }

}


// base class for draggable objects with drag controls
class draggableObject extends THREE.Group {
    constructor(mesh) {
        super();
        if (mesh !== undefined) {
            this.add(mesh)
        }
        this.userData.type = "Object"
    }

    dragUpdate(ctrl, point, gnorm) {
        if (ctrl.userData.action === "Drag") {
            this.position.x = point.x; // - ctrl.position.x;
            this.position.y = point.y; // - ctrl.position.y;
            this.position.z = point.z; // - ctrl.position.z;

        } else if (ctrl.userData.action === "Rotate") {
            // project vectors onto the plane defined by norm
            // rotate based on angle between vectors and cross product (to get the rotation direction/vector)

            //console.log(gnorm)
            // change to global space
            const norm = gnorm.clone();
            let pointW = point.clone();
            let ctrlW = ctrl.position.clone();
            this.localToWorld(ctrlW);

            // vectors from object origin in world coords
            pointW.sub(this.position)
            ctrlW.sub(this.position)

            // project onto the plane defined by norm
            // this is the plane shown in the view
            pointW.projectOnPlane(norm);
            ctrlW.projectOnPlane(norm);


            if ((pointW.lengthSq() < 0.01) || (ctrlW.lengthSq() < 0.01)) return;

            const ang = pointW.angleTo(ctrlW);
            let snorm = pointW.cross(ctrlW)

            // this.worldToLocal(snorm)
            snorm.normalize()


            //const quaternion = new THREE.Quaternion();
            // 0.7 is an arbitary gain to reduce the overshoot due to computational delay
            //
            this.rotateOnWorldAxis(snorm, -ang * 0.9);


            // // ----- OLD
            // const localPoint = this.worldToLocal(point);
            // const ctrlPoint = ctrl.position.clone();

            // localPoint.projectOnPlane(norm);
            // ctrlPoint.projectOnPlane(norm);

            // // can't rotate if looking straight on to the object
            // if ((localPoint.lengthSq() < 0.01) || (ctrlPoint.lengthSq() < 0.01)) return;

            // const ang = localPoint.angleTo(ctrlPoint);
            // const snorm = localPoint.cross(ctrlPoint)

            // snorm.normalize()

            // const quaternion = new THREE.Quaternion();
            // // 0.7 is an arbitary gain to reduce the overshoot due to computational delay
            // //

            // quaternion.setFromAxisAngle(snorm, -ang * 0.7);
            // this.applyQuaternion(quaternion)
        }
    }

    addDragCtrlPt(x, y, z) {
        const geom = new THREE.SphereGeometry(0.3);
        const matl = new THREE.MeshStandardMaterial({ color: 0x00aa00, transparent: true, opacity: 0.1 });
        const mesh = new THREE.Mesh(geom, matl);
        mesh.position.set(x, y, z);
        mesh.userData.type = "ControlPt"
        mesh.userData.action = "Drag"
        this.add(mesh)
    }

    addRotateCtrlPt(x, y, z) {
        const geom = new THREE.SphereGeometry(0.3);
        const matl = new THREE.MeshStandardMaterial({ color: 0x0000aa, transparent: true, opacity: 0.1 });
        const mesh = new THREE.Mesh(geom, matl);
        mesh.position.set(x, y, z);
        mesh.userData.type = "ControlPt"
        mesh.userData.action = "Rotate"
        this.add(mesh)
    }

    reset() {
        const quat = new THREE.Quaternion();
        this.setRotationFromQuaternion(quat);

    }

    dispose() {
        // dispose of the control
        this.children.forEach(item => {
            item.geometry.dispose();
            item.material.dispose();
        })
    }

    exportAsText(origin) {
        let origininv;
        // if (origin !== undefined) {
        //     origininv = origin.clone().invert();
        // }
        let loc = this.matrixWorld.clone();
        if (origin !== undefined) {
            origininv = origin.clone().invert();
            loc.premultiply(origininv);
        }
        const XYZ = new THREE.Vector3();
        XYZ.setFromMatrixPosition(loc);

        var text = '"type":"' + this.userData.object + '",\n"x":' + XYZ.x + ", "
            + '"y":' + XYZ.y + ", "
            + '"z":' + XYZ.z

        return text;
    }
}

class draggableVector extends draggableObject {
    constructor(dragger, color) {
        super(); // add object later

        this.length = 3;
        const geom = this.arrowGeometry(this.length); // default length

        const matl = new THREE.MeshStandardMaterial({ color: color });

        this.arrow = new THREE.Mesh(geom, matl);
        this.arrow.castShadow = true;

        const textDiv = document.createElement('input');
        textDiv.className = 'editlabel';
        textDiv.type = 'Text';
        textDiv.value = "F"

        const textLabel = new THREE.CSS2DObject(textDiv);
        //textLabel.position.set(1.3, -1.5, .5);
        textLabel.position.set(0, -this.length - 0.3, 0);
        this.arrow.add(textLabel);

        this.add(this.arrow); // add the arrow geometry


        this.dragger = dragger
        this.addDragCtrlPt(0, 0, 0);
        this.addRotateCtrlPt(0, -this.length - 1, 0);
        this.dragger.addObject(this);
        this.userData.object = "Vector"

        this.editbox = textDiv;
        textDiv.addEventListener("blur", this.handleblur)

        this.userData.canDelete = true;

    }

    arrowGeometry(length) {
        let points = []
        points.push(new THREE.Vector2(0.01, -length));
        points.push(new THREE.Vector2(0.25, -length));
        points.push(new THREE.Vector2(0.25, -1));
        points.push(new THREE.Vector2(0.5, -1));
        points.push(new THREE.Vector2(0.01, 0));

        return new THREE.LatheGeometry(points);
    }

    updateGeometry(length) {
        const geom = this.arrowGeometry(length);

        this.arrow.geometry.setAttribute('position', geom.getAttribute('position'));
        this.arrow.geometry.setIndex(geom.getIndex());

    }

    dragUpdate(ctrl, point, gnorm) {
        if (ctrl.userData.action === "Rotate") {
            // let ctrlW = ctrl.position.clone();
            // this.localToWorld(ctrlW);

            // get the new length
            this.length = point.distanceTo(this.position) - 1
            if (this.length < 2) this.length = 2;

            this.updateGeometry(this.length);
            this.arrow.children[0].position.set(0, -this.length - 0.3, 0)
            ctrl.position.set(0, -this.length - 1, 0);

            // rotate so that the new vector's end control is still in the rotations plane

            // get the vector formed by the head and tail, in world cords
            const newv = new THREE.Vector3();
            newv.subVectors(this.position, point);

            // get the angle between the y axis and the new direction
            const yvec = new THREE.Vector3(0, 1, 0);
            const ang = newv.angleTo(yvec)

            // get the cross product between the vectors
            // this is the vector about which we must rotate.
            yvec.cross(newv).normalize();

            // rotate the vector's coordinate space so the y axis aligns with the new desired direction
            this.setRotationFromAxisAngle(yvec, ang);



        } else {
            super.dragUpdate(ctrl, point, gnorm);
        }
    }


    handleblur(event) {
        document.querySelectorAll(".editlabel").forEach(item => { item.style.pointerEvents = "none" })
    }

    dispose() {
        const item = this.children[0].children[0].element.remove();
        this.editbox.removeEventListener("blur", this.handleblur)
        super.dispose();
    }

    exportAsText(origin) {
        let text = '{' + super.exportAsText(origin) + ',\n';

        // seems like an duplicate multiplication in here
        // may be able to simplify this
        let origininv;
        let XYZ = new THREE.Vector3(0, 1, 0); // nominal vector direction before rotations
        let loc = new THREE.Matrix4();
        loc.extractRotation(this.matrixWorld);
        XYZ.applyMatrix4(loc);


        if (origin !== undefined) {
            origininv = origin.clone()
            origininv.setPosition(0,0,0); // only want the rotations part.
            origininv.invert();
            XYZ.applyMatrix4(origininv);
        }

        //     const XYZ = new THREE.Vector3();
        //     XYZ.setFromMatrixPosition(loc);

        // }



        //     let loc = this.matrixWorld.clone();
        //     if (origin !== undefined) {
        //         loc.premultiply(origin);
        //     }
        //     const XYZ = new THREE.Vector3();
        //     XYZ.setFromMatrixPosition(loc);

        //     let e = loc.elements;
        //     XYZ.set(e[4], e[5], e[6])
        //     //const unit = new THREE.Vector3(e[4], e[5], e[6]);
        //XYZ.normalize();

        text += '"ux":' + XYZ.x + ", "
            + '"uy":' + XYZ.y + ", "
            + '"uz":' + XYZ.z + ",\n"
        text += '"len":' + this.length + ",\n"
        text += '"label":"' + this.editbox.value + '"\n';

        text += '}'
        return text;
    }

}


class draggableBox extends draggableObject {
    constructor(dragger) {
        // 				const bgeometry = new THREE.BufferGeometry();
        // 				var bvertices = new Float32Array([
        // 					2, 2, 0,
        // 					4, 2, 0,
        // 					4, 0, 0

        // 				]);

        // 				// itemSize = 3 because there are 3 values (components) per vertex
        // 				//// const bmaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
        // 				bgeometry.setAttribute('position', new THREE.BufferAttribute(bvertices, 3));
        // 				//// const bline = new THREE.LineLoop(bgeometry, bmaterial);


        // 				const bmaterial = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        // const bline = new THREE.Mesh( bgeometry, bmaterial );



        const geometry = new THREE.BufferGeometry();
        // create a simple square shape. We duplicate the top left and bottom right
        // vertices because each vertex needs to appear once per triangle.
        var vertices = new Float32Array([
            -2.0, -2.0, 0.0,  //0
            2.0, -2.0, 0.0,
            2.0, 2.0, 0.0,    //2
            -2.0, 2.0, 0.0

            //  1.0,  1.0,  1.0,
            // -1.0,  1.0,  1.0,
            // -1.0, -1.0,  1.0
        ]);

        var indices = [
            0, 1, 2,
            0, 2, 3
        ]

        // itemSize = 3 because there are 3 values (components) per vertex
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setIndex(indices)
        //geometry.setAttribute('index', new THREE.BufferAttribute(indices, 3));
        //	const material = new THREE.LineBasicMaterial({ color: 0x000000 });
        //		const mesh = new THREE.LineLoop(geometry,material);
        const material = new THREE.MeshStandardMaterial({ color: 0xff0000, transparent: true, opacity: 0.4 });
        const mesh = new THREE.Mesh(geometry, material);


        super(mesh)


        this.bvertices = vertices;
        this.indices = indices;
        this.bgeometry = geometry;

        this.dragger = dragger



        this.addSizeCtrlPt(-2, -2, 0, 0);
        this.addSizeCtrlPt(2, -2, 0, 3);
        this.addSizeCtrlPt(2, 2, 0, 6);
        this.addSizeCtrlPt(-2, 2, 0, 9);
        this.addDragCtrlPt(0, 0, 0);
        this.dragger.addObject(this);

        this.userData.object = "Line"
        this.userData.canDelete = true;
    }

    addSizeCtrlPt(x, y, z, idx) {
        super.addDragCtrlPt(x, y, z)
        const mesh = this.children[this.children.length - 1]
        mesh.userData.index = idx; //this.children.length - 2
        mesh.userData.action = "Size"
        mesh.material.color.setHex(0xff0000);
    }



    dragUpdate(ctrl, point, gnorm) {

        if (ctrl.userData.action === "Size") {

            let idx = ctrl.userData.index;
            let pt = point.clone();
            ctrl.parent.worldToLocal(pt)
            // let origin=ctrl.parent.position.clone().sub(point);
            this.bvertices[idx] = pt.x
            this.bvertices[idx + 1] = pt.y
            this.bvertices[idx + 2] = pt.z
            ctrl.position.set(pt.x, pt.y, pt.z)
            this.bgeometry.setAttribute('position', new THREE.BufferAttribute(this.bvertices, 3));
        } else {
            super.dragUpdate(ctrl, point, gnorm)
        }
    }
}


class draggableLine extends draggableObject {
    constructor(dragger) {

        const geometry = new THREE.BufferGeometry();
        // create a simple square shape. We duplicate the top left and bottom right
        // vertices because each vertex needs to appear once per triangle.
        var vertices = new Float32Array([
            0.0, 0.0, 0.0,  //0
            2.0, 2.0, 0.0,
        ]);


        // itemSize = 3 because there are 3 values (components) per vertex
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));


        const material = new THREE.LineBasicMaterial({ color: 0x000000 });
        const mesh = new THREE.Line(geometry, material);
        // const material = new THREE.MeshStandardMaterial({ color: 0xff0000, transparent: true, opacity: 0.4 });
        //const mesh = new THREE.Mesh(geometry, material);


        super(mesh)


        this.bvertices = vertices;
        this.bgeometry = geometry;

        this.dragger = dragger

        this.addDragCtrlPt(0, 0, 0);
        this.addSizeCtrlPt(2, 2, 0, 1);


        this.dragger.addObject(this);

        this.userData.object = "Line"
        this.userData.canDelete = true;
    }

    addSizeCtrlPt(x, y, z, idx) {
        super.addDragCtrlPt(x, y, z)
        const mesh = this.children[this.children.length - 1]
        mesh.userData.action = "Size"
        mesh.material.color.setHex(0xff0000);
    }



    dragUpdate(ctrl, point, gnorm) {

        if (ctrl.userData.action === "Size") {

            let idx = ctrl.userData.index;
            let pt = point.clone();
            ctrl.parent.worldToLocal(pt)
            // let origin=ctrl.parent.position.clone().sub(point);
            this.bvertices[3] = pt.x
            this.bvertices[4] = pt.y
            this.bvertices[5] = pt.z
            ctrl.position.set(pt.x, pt.y, pt.z)
            this.bgeometry.setAttribute('position', new THREE.BufferAttribute(this.bvertices, 3));
        } else {
            super.dragUpdate(ctrl, point, gnorm)
        }
    }

    exportAsText(origin) {
        let text = '{' + super.exportAsText(origin) + ',\n';

        let loc = new THREE.Vector3(this.bvertices[3], this.bvertices[4], this.bvertices[5]);
        this.localToWorld(loc);
        if (origin !== undefined) {
            loc.applyMatrix4(origin.clone().invert());
        }

        text += '"x1":' + loc.x + ", "
            + '"y1":' + loc.y + ", "
            + '"z1":' + loc.z + "\n"


        text += '}'
        return text;

    }

    reset() {
        this.bvertices[3] = 2
        this.bvertices[4] = 2
        this.bvertices[5] = 0
        this.bgeometry.setAttribute('position', new THREE.BufferAttribute(this.bvertices, 3));
        this.children[2].position.set(2, 2, 0);
    }
}

class draggableQuadratic extends draggableObject {
    constructor(dragger) {

        let cp1 = new THREE.Vector3(2, 2, 0);
        let cp2 = new THREE.Vector3(4, 0, 0);
        const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(0, 0, 0),
            cp1,
            cp2
        );

        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        const material = new THREE.LineBasicMaterial({ color: 0x000000 });
        const mesh = new THREE.Line(geometry, material);
        // const material = new THREE.MeshStandardMaterial({ color: 0xff0000, transparent: true, opacity: 0.4 });
        //const mesh = new THREE.Mesh(geometry, material);


        super(mesh)


        this.cp = [cp1.clone(), cp2.clone()]
        this.bgeometry = geometry;

        this.dragger = dragger

        this.addDragCtrlPt(0, 0, 0);
        this.addSizeCtrlPt(2, 2, 0, 0);
        this.addSizeCtrlPt(4, 0, 0, 1);


        this.dragger.addObject(this);

        this.userData.object = "Quadline"
        this.userData.canDelete = true;
    }

    addSizeCtrlPt(x, y, z, idx) {
        super.addDragCtrlPt(x, y, z)
        const mesh = this.children[this.children.length - 1]
        mesh.userData.action = "Size"
        mesh.userData.index = idx;
        mesh.material.color.setHex(0xff0000);
    }



    dragUpdate(ctrl, point, gnorm) {

        if (ctrl.userData.action === "Size") {

            let idx = ctrl.userData.index;
            let pt = point.clone();
            ctrl.parent.worldToLocal(pt)
            // let origin=ctrl.parent.position.clone().sub(point);
            this.cp[idx].copy(pt);
            ctrl.position.set(pt.x, pt.y, pt.z)

            const curve = new THREE.QuadraticBezierCurve3(
                new THREE.Vector3(0, 0, 0),
                this.cp[0],
                this.cp[1]);

            const points = curve.getPoints(50);

            this.bgeometry.setFromPoints(points)

        } else {
            super.dragUpdate(ctrl, point, gnorm)
        }
    }

    exportAsText(origin) {
        let text = '{' + super.exportAsText(origin) + ',\n';

        let inv;
        let loc = this.cp[0].clone();  // a vector
        this.localToWorld(loc);
        if (origin !== undefined) {
            inv = origin.clone().invert();
            loc.applyMatrix4(inv);
        }

        text += '"x1":' + loc.x + ", "
            + '"y1":' + loc.y + ", "
            + '"z1":' + loc.z + ",\n"


        loc = this.cp[1].clone();  // a vector
        this.localToWorld(loc);
        if (origin !== undefined) {
            loc.applyMatrix4(inv);
        }

        text += '"x2":' + loc.x + ", "
            + '"y2":' + loc.y + ", "
            + '"z2":' + loc.z + "\n"

        text += '}'
        return text;
    }

    reset() {

        this.cp[0].set(2, 2, 0);
        this.cp[1].set(4, 0, 0);
        const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(0, 0, 0), this.cp[0], this.cp[1]);

        const points = curve.getPoints(50);

        this.bgeometry.setFromPoints(points)
        // update the control points 
        this.children[2].position.copy(this.cp[0]);
        this.children[3].position.copy(this.cp[1]);
    }

}




class draggableAxis extends draggableObject {
    constructor(dragger) {


        // create the axis
        const axis = new THREE.Group();
        const x = smallArrowObject(0xaaaaaa);
        x.position.set(1.5, 0, 0);
        const xtextDiv = document.createElement('div');
        xtextDiv.className = 'label';
        xtextDiv.textContent = 'X';
        xtextDiv.style.visibility = 'visible'
        //xtextDiv.style.marginTop = '-1em';
        const xtextLabel = new THREE.CSS2DObject(xtextDiv);
        xtextLabel.position.set(0.2, 0, 0.5);
        x.add(xtextLabel);
        x.rotation.z = -Math.PI / 2;

        const y = smallArrowObject(0xaaaaaa);
        y.position.set(0, 1.5, 0);

        const ytextDiv = document.createElement('div');
        ytextDiv.className = 'label';
        ytextDiv.textContent = 'Y';
        ytextDiv.style.visibility = 'visible'
        //ytextDiv.style.marginTop = '1em';
        const ytextLabel = new THREE.CSS2DObject(ytextDiv);
        ytextLabel.position.set(-0.5, 0.2, 0);
        y.add(ytextLabel);


        const z = smallArrowObject(0xaaaaaa);
        z.position.set(0, 0, 1.5);

        const ztextDiv = document.createElement('div');
        ztextDiv.className = 'label';
        ztextDiv.textContent = 'Z';
        ztextDiv.style.visibility = 'visible'
        //ztextDiv.style.marginTop = '-1em';
        const ztextLabel = new THREE.CSS2DObject(ztextDiv);
        ztextLabel.position.set(-0.5, 0, 0.2);
        z.add(ztextLabel);
        z.rotation.x = Math.PI / 2;
        axis.add(x)
        axis.add(y)
        axis.add(z);
        // axis.position.set(px, py, pz) // assume at 0,0,0

        super(axis);

        this.dragger = dragger;

        this.addRotateCtrlPt(3.1, 0, 0);
        this.addRotateCtrlPt(0, 3.1, 0);
        this.addDragCtrlPt(0, 0, 0);
        this.dragger.addObject(this);
        this.userData.object = "Axis"
        this.nominalAxis = new THREE.Matrix4();
    }

    setNominal(mat){
        //  the nominal axis position
        // this is not the local position for the setup.
        this.nominalAxis.copy(mat);

    }

    makevisible(state) {
        this.visible = state;
        let display = "hidden"
        if (state) {
            display = "visible"
        }
        this.children[0].children[0].children[0].element.style.visibility = display;
        this.children[0].children[1].children[0].element.style.visibility = display;
        this.children[0].children[2].children[0].element.style.visibility = display;
    }

    dragUpdate(ctrl, point, norm) {
        super.dragUpdate(ctrl, point, norm);

        // this is messy because connection to axis is two way
        // this should be fixed.

        // *** CHANGE MARKER ***
        //    let mat = this.matrixWorld.clone();
        //    this.dragger.changeOrigin(mat);
    }


    reset() {
        super.reset();
        // also reset the dragger plan
        // this.applyMatrix4(new THREE.Matrix4())
        // cleary I don't understand the correct way to update the transform matrix, but this works.
      //  this.position.set(this.nominalAxis.x, this.nominalAxis.y, this.nominalAxis.z)
      //  this.setRotationFromMatrix(this.nominalAxis)
        const v = new THREE.Vector3().setFromMatrixPosition(this.nominalAxis)
       

        this.position.set(v.x, v.y, v.z)
        this.setRotationFromMatrix(this.nominalAxis)
        //this.setRotation
        //this.matrix

        this.updateMatrix();
        this.updateWorldMatrix(false);
        let mat = this.matrixWorld.clone();
        this.dragger.changeOrigin(mat);
    }

    exportAsText(origin) {
        let text = '{' + super.exportAsText(origin) + ',\n';

        let e = this.matrixWorld.elements;
        // text += '\n{"type":"axis",\n'
        text += '"transform": [\n'
        for (let i = 0; i < 4; i++) {
            text += e[i] + ", " + e[i + 4] + ", " + e[i + 8] + ", " + e[i + 12] + ",\n"
        };
        text = text.substring(0, text.length - 2);  // strip the last comma
        text += '\n]}'
        return text
    }
}

// handles draggable objects
class dragControls {
    constructor(graphWindow, camera, scene, controls) {
        this.width = graphWindow.clientWidth;
        this.height = graphWindow.clientHeight;

        this.raycaster = new THREE.Raycaster()
        this.camera = camera;
        this.dragList = [];
        this.hilitedCtrl = null;
        this.selectedCtrl = null;
        this.mousedown = false;

        this.controls = controls;
        controls[0].style.display = 'none';

        // the plane used to limit dragging motion
        this.planegrp = new THREE.Group();

        // create the grid.  This is a simple version of THREE.GridHelper

        const vertices = [];
        for (let k = -20; k <= 20; k += 1) {
            vertices.push(-20, k, 0, 20, k, 0); // horizontal lines
            vertices.push(k, -20, 0, k, 20, 0); // vertical lines
        }

        const gridgeo = new THREE.BufferGeometry();
        gridgeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const gridmat = new THREE.LineBasicMaterial({ color: 0x999999, transparent: true, opacity: 0.4 });
        this.grid = new THREE.LineSegments(gridgeo, gridmat);

        this.planegrp.add(this.grid)


        const vertices2 = [];
        vertices2.push(-20, 0, 0, 20, 0, 0); // horizontal lines
        vertices2.push(0, -20, 0, 0, 20, 0); // vertical lines


        const gridgeo2 = new THREE.BufferGeometry();
        gridgeo2.setAttribute('position', new THREE.Float32BufferAttribute(vertices2, 3));
        const gridmat2 = new THREE.LineBasicMaterial({ color: 0x00AA00, transparent: true, opacity: 0.6 });
        this.gridmajor = new THREE.LineSegments(gridgeo2, gridmat2);

        this.planegrp.add(this.gridmajor)

        //this.gridmajor.renderOrder = 90;

        const geometryxy = new THREE.PlaneGeometry(40, 40);
        const materialxy = new THREE.MeshBasicMaterial({ color: 0xAAAAAA, side: THREE.DoubleSide, transparent: true, opacity: 0.2 });
        this.plane = new THREE.Mesh(geometryxy, materialxy);

        this.plane.renderOrder = 100;

        this.planegrp.add(this.plane);
        scene.add(this.planegrp);
        this.planegrp.visible = false;

        this.planenorm = new THREE.Vector3(0, 0, 1);
        this.orientation = new THREE.Vector3(0, 0, 1);

        this.origin = new THREE.Matrix4();
        this.originInverse = this.origin.clone();
        this.originInverse.invert(); // still identity, done here for clarity.


        graphWindow.addEventListener('mousemove', event => {

            let mouse = { x: 0, y: 0 };
            mouse.x = (event.offsetX / this.width) * 2 - 1;
            mouse.y = -(event.offsetY / this.height) * 2 + 1;

            // hack
            if (Math.abs(mouse.x) > 0.95 || (Math.abs(mouse.y) > 0.95)) return;

            this.raycaster.setFromCamera(mouse, this.camera);
            if (this.mousedown == false) {
                // hovering over an object


                const intersects = this.raycaster.intersectObjects(this.dragList);
                // set/reset the opacities
                if (intersects.length > 0) {

                    if (this.hilitedCtrl !== null) this.hilitedCtrl.material.opacity = 0.1;
                    this.hilitedCtrl = intersects[0].object;
                    this.hilitedCtrl.material.opacity = 1;


                } else {
                    if ((this.hilitedCtrl != null) && (this.hilitedCtrl != this.selectedCtrl)) {
                        this.hilitedCtrl.material.opacity = 0.1;
                    }
                    this.hilitedCtrl = null;

                }
            } else {

                // drag a selected item
                const intersects = this.raycaster.intersectObjects([this.plane]);
                if (intersects.length > 0) {

                    // updated the parent item base on position of the control 
                    if (this.selectedCtrl != null) {

                        // should always be true, unless there is a mouse lag
                        this.selectedCtrl.parent.dragUpdate(this.selectedCtrl, intersects[0].point, this.planenorm)


                        // update the x,y,z position
                        //this.updateXYZ(intersects[0].point)
                        this.updateXYZ(this.selectedCtrl);

                    }
                }
            }

        })

        graphWindow.addEventListener('mousedown', event => {


            if (this.selectedCtrl != this.hilitedCtrl) {

                // mouse is down over an item that is not the currently selected item
                // this could be a null space
                // deselect old control and select the new control
                if (this.selectedCtrl !== null) {


                    if (this.selectedCtrl.parent.userData.object === "Axis") {
                        let mat = this.selectedCtrl.parent.matrixWorld.clone();
                        this.changeOrigin(mat);

                    }


                    this.selectedCtrl.material.opacity = 0.1
                    this.selectedCtrl = null;
                    // this.planegrp.visible = false;
                    // this.controls[0].style.display = 'none';
                    // this.controls[1].style.display = 'none';
                    this.showplane(false);


                }
            }

            // select the new control if the mouse is over a control
            // if clicking on selected item, this just reselects it
            if (this.hilitedCtrl != null) {
                this.selectedCtrl = this.hilitedCtrl;
                this.selectedCtrl.material.opacity = 1;
                //this.hilitedCtrl = null;

                // show the working plane at the selected item


                // this.setPlaneOrigin(this.selectedCtrl.parent.position);
                this.setPlaneOrigin(this.selectedCtrl);

                this.adjustPlaneView();
                // this.planegrp.visible = true;
                // this.controls[0].style.display = 'inline';
                // this.controls[1].style.display = 'inline';
                this.showplane(true);
                //this.controls[1].innerHTML = ""
                //let pos = new THREE.Vector3();
                //this.selectedCtrl.getWorldPosition(pos);
                this.updateXYZ(this.selectedCtrl)
            }

            this.mousedown = true;
            return;

        })

        graphWindow.addEventListener('mouseup', event => {
            this.mousedown = false;
            // unselect if down and nothing is highlighted
        })

        // poor portability, should pass in the controls, being lazy
        document.getElementById("ENTER").addEventListener('click', event => {
            let x = Number(document.getElementById("Xcoord").value);
            let y = Number(document.getElementById("Ycoord").value);
            let z = Number(document.getElementById("Zcoord").value);

            let point = new THREE.Vector3(x, y, z);

            point.applyMatrix4(this.origin);

            this.selectedCtrl.parent.dragUpdate(this.selectedCtrl, point, this.planenorm)


            // update the x,y,z position
            //this.updateXYZ(intersects[0].point)
            this.updateXYZ(this.selectedCtrl);

        })


    }

    showplane(state) {
        if (state) {
            this.planegrp.visible = true;
            this.controls[0].style.display = 'inline';
            this.controls[1].style.display = 'inline';
        } else {
            this.planegrp.visible = false;
            this.controls[0].style.display = 'none';
            this.controls[1].style.display = 'none';
        }
    }
    changeOrigin(mat) {
        // change the origin 

        this.origin.copy(mat);
        this.originInverse.copy(mat.invert());

        // update 

        this.planegrp.setRotationFromMatrix(this.origin);
        this.planegrp.position.setFromMatrixPosition(this.origin);


    }

    updateXYZ(ctrl) { // was (point)
        let xyzpoint = new THREE.Vector3();
        ctrl.getWorldPosition(xyzpoint);

        //let xyzpoint = point.clone();
        xyzpoint.applyMatrix4(this.originInverse);

        document.getElementById("Xcoord").value = xyzpoint.x.toFixed(1);
        document.getElementById("Ycoord").value = xyzpoint.y.toFixed(1)
        document.getElementById("Zcoord").value = xyzpoint.z.toFixed(1);

        // this.controls[1].value =  xyzpoint.x.toFixed(1) + ", "
        // + xyzpoint.y.toFixed(1) + ", "
        // + xyzpoint.z.toFixed(1) 
    }

    setPlaneOrientation(orientation) {
        // orientation:  1=xy, 2=yz, 3=xz 
        // pnorm = unit vector normal to desire plane 


        if (this.axis != null) {
            let qut = new THREE.Quaternion();
            this.axis.getWorldQuaternion(qut);
            this.planegrp.setRotationFromQuaternion(qut);
        }

        const mat = new THREE.Matrix4();


        // set the local plane orientation
        if (orientation == 1) {
            // xy plane, the default orientation
            this.planenorm = new THREE.Vector3(0, 0, 1)

        } else if (orientation == 2) {
            // yz plane
            mat.makeRotationY(Math.PI / 2);
            this.planenorm = new THREE.Vector3(1, 0, 0)
        } else {
            // xz plane
            mat.makeRotationX(-Math.PI / 2);
            this.planenorm = new THREE.Vector3(0, 1, 0)
        }
        this.orientation.copy(this.planenorm)

        // rotate individual items within the local cords to get xy, zy, xz planes
        this.plane.setRotationFromMatrix(mat)
        this.grid.setRotationFromMatrix(mat)
        this.gridmajor.setRotationFromMatrix(mat)

        // adjust the normal for the group transformation

        // rotate the entire group to match the axis orientation
        let quat = new THREE.Quaternion();
        this.planegrp.getWorldQuaternion(quat)
        this.planenorm.applyQuaternion(quat)


        if (this.selectedCtrl != null) {
            // this.setPlaneOrigin(this.selectedCtrl.parent.position);
            // const point= new THREE.Vector3();
            // this.selectedCtrl.getWorldPosition(point);
            this.setPlaneOrigin(this.selectedCtrl);
        }

    }



    setPlaneOrigin() {
        // shift the plane along it's normal direction so that point is on the plane
        // this.planegrp.position.copy(point);

        const point = new THREE.Vector3();
        this.selectedCtrl.getWorldPosition(point);

        //    this.planegrp.position.set(0,0,0);

        this.planegrp.position.set(this.origin.elements[12], this.origin.elements[13], this.origin.elements[14])
        this.planegrp.updateMatrix();
        this.planegrp.updateWorldMatrix();

        // let norm = this.planenorm.clone();

        // distance to the planegrp
        const plane = new THREE.Plane(this.planenorm, 0)
        plane.translate(this.planegrp.position)

        let dist = plane.distanceToPoint(point);

        // this.planegrp.translateOnAxis(norm,dist)
        this.planegrp.translateOnAxis(this.orientation, dist)
        //   norm.multiplyScalar(dist);
        //   this.planegrp.position.copy(norm);

    }

    adjustPlaneView() {
        // change the plane rotation if item cannot be viewed

        const vector = new THREE.Vector3(); // create once and reuse it!
        this.camera.getWorldDirection(vector);

        // a terrible brute force method to select one of the three 
        // planes that is visible.  This ensures the user is not trying to move in a plane
        // perpendicular to the current view
        let ang = Math.abs(this.planenorm.angleTo(vector) - Math.PI / 2);
        if (ang < 0.1) {
            this.setPlaneOrientation(1)
        }
        ang = Math.abs(this.planenorm.angleTo(vector) - Math.PI / 2);
        if (ang > 0.1) return;

        if (ang < 0.1) {
            this.setPlaneOrientation(2)
        }
        ang = Math.abs(this.planenorm.angleTo(vector) - Math.PI / 2);
        if (ang > 0.1) return;

        // last possibility
        this.setPlaneOrientation(3)

    }

    addAxis(axis) {
        this.axis = axis;
    }

    addObject(object) {
        // adds only the draggable object
        if (!object.isGroup) return;

        object.children.forEach(item => {
            if (item.userData.type === "ControlPt") this.dragList.push(item);
        })

    }
}

/*
{
"x":0,
"y":0,
"z":0,
"opacity":1,
objects:[{
    "objectname": "name",
    "type": "box",
    "color": "0xFFFFFF",
    "param": [[1, 2], [3, 4], ...],
    "depth":0,
    "x": 1,
    "y": 2,
    "z": 3,
    "rx": 0,
    "ry": 0,
    "rz": 0
    }]
}
*/

class model extends THREE.Group {
    constructor() {
        super();
    }

    load(jsondata) {
        var matl, mesh, geom, shape, color, subgroup;
        var points = [];
        jsondata.objects.forEach(object => {
            color = Number(object.color)
            if (object.type === "box") {
                geom = new THREE.BoxGeometry(object.param[0], object.param[1], object.param[2])
                matl = new THREE.MeshStandardMaterial({ color: color, transparent: true, opacity: jsondata.opacity });
                mesh = new THREE.Mesh(geom, matl);

            } else if (object.type === "extrude") {
                shape = new THREE.Shape();
                shape.moveTo(0, 0);
                object.param.forEach(point => {
                    shape.lineTo(point[0], point[1]);
                })

                geom = new THREE.ExtrudeGeometry(shape, { depth: object.depth, bevelEnabled: false });
                matl = new THREE.MeshStandardMaterial({ color: color, transparent: true, opacity: jsondata.opacity });
                mesh = new THREE.Mesh(geom, matl);

            } else if (object.type === "sphere") {
                geom = new THREE.SphereGeometry(object.param[0])
                matl = new THREE.MeshStandardMaterial({ color: color, transparent: true, opacity: jsondata.opacity });
                mesh = new THREE.Mesh(geom, matl);

            } else if (object.type === "simpleSupport") {
                mesh = new THREE.Group();
                geom = new THREE.SphereGeometry(0.4)
                matl = new THREE.MeshStandardMaterial({ color: color, transparent: true, opacity: jsondata.opacity });
                subgroup = new THREE.Mesh(geom, matl);
                subgroup.position.set(-0, -0.4, -0)
                mesh.add(subgroup);

                // floor
                geom = new THREE.BoxGeometry(1.4, 0.2, 1.4)
                subgroup = new THREE.Mesh(geom, matl);
                subgroup.position.set(-0.0, -0.9, -0.0);
                mesh.add(subgroup);



            } else if (object.type === "pinSupport") {
                mesh = new THREE.Group();
                shape = new THREE.Shape();
                shape.moveTo(0, 0);
                shape.lineTo(1, 0);
                shape.lineTo(0.5, 0.8);
                shape.lineTo(0, 0)
                geom = new THREE.ExtrudeGeometry(shape, { depth: 0.9, bevelEnabled: false });
                matl = new THREE.MeshStandardMaterial({ color: color, transparent: true, opacity: jsondata.opacity });
                subgroup = new THREE.Mesh(geom, matl);
                subgroup.position.set(-0.5, -0.8, -0.5)
                mesh.add(subgroup);

                // floor
                geom = new THREE.BoxGeometry(1.4, 0.2, 1.4)
                subgroup = new THREE.Mesh(geom, matl);
                subgroup.position.set(-0.0, -0.9, -0.0);
                mesh.add(subgroup);
            } else if (object.type === "cable") {
                matl = new THREE.LineBasicMaterial({ color: color });
                points = [];
                object.param.forEach(point => {
                    points.push(new THREE.Vector3(point[0], point[1], point[2]));
                })
                geom = new THREE.BufferGeometry().setFromPoints(points);
                mesh = new THREE.Line(geom, matl);
            } else if (object.type === "chartjs") {
                const canv = document.createElement("canvas");
                const ctx = canv.getContext("2d");
                canv.style.maxHeight=(600*object.size[1]/object.size[0]).toFixed(0)+"px";
                canv.style.maxWidth="600px"
                canv.style.display = "none";
                document.body.append(canv);
        
                let thechart = new Chart(canv,object.param)

                const texture = new THREE.CanvasTexture(canv);
                texture.needsUpdate = true;
                matl = new THREE.MeshBasicMaterial({
                    map: texture, transparent: true, opacity: 1
                });

                geom = new THREE.PlaneGeometry(object.size[0], object.size[1])
                mesh = new THREE.Mesh(geom, matl);

                mesh.userData.element = canv;

            } else {
                return null;
            }

            
            mesh.userData.name = object.objectname;
            mesh.userData.type = object.type;
            mesh.castShadow = true;
            mesh.position.set(object.x, object.y, object.z);
            mesh.rotateX(object.rx);
            mesh.rotateY(object.ry);
            mesh.rotateZ(object.rz);
            
            this.add(mesh)
        })
        this.position.set(jsondata.x, jsondata.y, jsondata.z)
        this.userData.object = "model"
        return this;

    }

    dispose() {
        // dispose of the control
        // not using recursive, assumes only one level of grouping -- too lazy to set up recursion
        this.children.forEach(item => {
            if (item.isGroup) {
                item.children.forEach(subitem => {
                    subitem.geometry.dispose();
                    subitem.material.dispose();
                    if (subitem.userData.type==="chartjs"){
                        subitem.userData.element.remove();
                    }
                })
            } else {
                item.geometry.dispose();
                item.material.dispose();
                if (item.userData.type==="chartjs"){
                    item.userData.element.remove();
                }
            }
        })
    }
}

// object creation 


function canvasGraph(xmin, xmax, ymin, ymax, dx, dy, color, alpha) {
    const canv = document.createElement("canvas");
    const ctx = canv.getContext("2d");
    canv.style.maxHeight="600px";
    canv.style.maxWidth="600px"
    canv.style.display = "none";
    document.body.append(canv);

    // set chart animation=false
    // if you want to see the animations, then you will need to dynamically update the texture

    new Chart(ctx.canvas, {
        type: 'bar',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                borderWidth: 1
            }]
        },
        options: {
            animation: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    return ctx;


    // calculate increment
    let xrange = xmax - xmin;
    let yrange = ymax - ymin;

    // xcanvas = xscale*x+xoffset

    //600 = xscale*xmax+xoffset
    // 0 = xscale*xmin+xoffset
    // 600 = xscale(xmax-xmin)
    // xscale = 600/(xmax-xmin)
    // xoffset = -xscale*xmin

    let xscale = 600 / xrange;
    let xoffset = -xscale * xmin;
    let yscale = -600 / yrange;
    let yoffset = -yscale * ymax;

    // background color
    let pndcolor = color.replace("0x", "#")
    ctx.fillStyle = pndcolor;//"#FFFFFE"
    ctx.globalAlpha = alpha;
    ctx.fillRect(0, 0, 600, 600);
    ctx.globalAlpha = 1;
    // draw axis

    ctx.fillStyle = "#000000"

    ctx.strokeStyle = "#000000"
    let x = 0;
    let y = 0;
    if (ymin > 0) {
        y = ymin;
    }
    y = yscale * y + yoffset
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(600, y)

    if (xmin > 0) {
        x = xmin;
    }
    x = xscale * x + xoffset

    ctx.moveTo(x, 0);
    ctx.lineTo(x, 600)
    ctx.stroke();



    ctx.font = "20px sans-serif";

    ctx.textAlign = "center";
    for (let x = dx; x < xmax; x += dx) {
        ctx.fillText(x, x * xscale + xoffset, yoffset + 20)
    }
    for (let x = -dx; x > xmin; x -= dx) {
        ctx.fillText(x, x * xscale + xoffset, yoffset + 20)
    }

    ctx.textAlign = "right";
    for (let y = dy; y < ymax; y += dy) {
        ctx.fillText(y, xoffset - 5, y * yscale + yoffset)
    }
    for (let y = -dy; y > ymin; y -= dy) {
        ctx.fillText(y, xoffset - 5, y * yscale + yoffset)
    }

    ctx.textAlign = "left";
    ctx.fillText("0", xoffset + 5, yoffset + 20);

    //	ctx.fillText("x", 550, y+20);

    //       ctx.fillText("y", x+20, 50);

    return ctx;
    // const texture = new THREE.CanvasTexture(ctx.canvas);
    // texture.needsUpdate = true;
    // const material = new THREE.MeshBasicMaterial({
    // 	map: texture, transparent:true, opacity:1
    // });

    // //const geometry = new THREE.BoxGeometry(5, 5, 5);
    // const geometry = new THREE.PlaneGeometry(18, 18)
    // const face = new THREE.Mesh(geometry, material);

    // return face;
}

function smallArrowObject(color) {
    const points = [];
    points.push(new THREE.Vector2(0.01, -1.5));
    points.push(new THREE.Vector2(0.125, -1.5));
    points.push(new THREE.Vector2(0.125, -0.5));
    points.push(new THREE.Vector2(0.25, -0.5));
    points.push(new THREE.Vector2(0.01, 0));

    const geom = new THREE.LatheGeometry(points);
    const matl = new THREE.MeshStandardMaterial({ color: color });
    const mesh = new THREE.Mesh(geom, matl);
    mesh.castShadow = true;
    //mesh.position.set(x, y, z);
    return mesh;
}


function arrowObject(color, length) {
    const points = [];
    points.push(new THREE.Vector2(0.01, -length));
    points.push(new THREE.Vector2(0.25, -length));
    points.push(new THREE.Vector2(0.25, -1));
    points.push(new THREE.Vector2(0.5, -1));
    points.push(new THREE.Vector2(0.01, 0));

    const geom = new THREE.LatheGeometry(points);
    const matl = new THREE.MeshStandardMaterial({ color: color });
    const mesh = new THREE.Mesh(geom, matl);
    mesh.castShadow = true;
    //mesh.position.set(x, y, z);
    return mesh;
}

// svg loader
// load a SVG resource
// required a modified SVG loader class
// currently not used

/*
function onloadSVG(data, thickness) {

    const extrudeSettings = {
        depth: thickness
    };


    const paths = data.paths;

    const group = new THREE.Group();
    // group.scale.multiplyScalar(0.25);
    // group.position.x = 0;
    // group.position.y = 0;
    // group.scale.y *= -1;

    for (let i = 0; i < paths.length; i++) {

        const path = paths[i];

        const fillColor = path.userData.style.fill;
        if (fillColor !== undefined && fillColor !== 'none') {

            const material = new THREE.MeshStandardMaterial({
                color: new THREE.Color().setStyle(fillColor).convertSRGBToLinear(),
                opacity: 0.5, //path.userData.style.fillOpacity,
                transparent: true,
                side: THREE.DoubleSide
                // depthWrite: false,
                //  wireframe: false
            });

            const shapes = THREE.SVGLoader.createShapes(path);

            for (let j = 0; j < shapes.length; j++) {

                const shape = shapes[j];
                let geometry;

                if (thickness > 0) {
                    geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                } else {
                    geometry = new THREE.ShapeGeometry(shape);
                }
                const mesh = new THREE.Mesh(geometry, material);

                mesh.castShadow = true;
                group.add(mesh);

            }

        }


        const strokeColor = path.userData.style.stroke;

        if (thickness === 0 && strokeColor !== undefined && strokeColor !== 'none') {

            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setStyle(strokeColor).convertSRGBToLinear(),
                opacity: path.userData.style.strokeOpacity,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false,
                wireframe: false
            });

            for (let j = 0, jl = path.subPaths.length; j < jl; j++) {

                const subPath = path.subPaths[j];
                const geometry = THREE.SVGLoader.pointsToStroke(subPath.getPoints(), path.userData.style);
                if (geometry) {
                    const mesh = new THREE.Mesh(geometry, material);
                    group.add(mesh);
                }
            }
        }

    }

    return group;
    // scene.add( group );       
}
*/