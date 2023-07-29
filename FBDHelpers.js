// helper functions for FBD grading

// Compare exported data to list of desired vectors
// key = [{x:x, y:y, z:z, ux:ux, uy: uy, uz:uiz, name:vector name, status:null},{},]
/*
function checkSolution(key, ans) {
    // unit vector tolerance is hard coded to 0.05
    let tol = 0.1;
    let utol = 0.05

    //let N = 0; // number of vectors in the solution
    tol = tol * tol;

    let slnpoint = new THREE.Vector3();
    let slnunit = new THREE.Vector3();
    let point = new THREE.Vector3();
    let unit = new THREE.Vector3();

    key.forEach(vector => {
        // compare with every 
        slnpoint.set(vector.x, vector.y, vector.z)
        slnunit.set(vector.ux, vector.uy, vector.uz);
        vector.status = !ans.every(item => {
            if (item.type == "Vector") {
                // N++;
                point.set(item.x, item.y, item.z)
                unit.set(item.ux, item.uy, item.uz)
                if ((slnpoint.distanceToSquared(point) < tol) && (slnunit.distanceToSquared(unit) < utol)) {
                    return false;
                } else {
                    return true;
                }
            } else { return true; } // exits when true
        })
    })

    // keylength^2 because of nested loop for checking
    if (ans.length - 1 != key.length) return false;  // remove the default axis count
    return true;

}
*/

function checkSolution(ans, key) {
    const uscale = 0.3*0.3; // scale factor for  tolerance to unit vector tolerance, squared

    const KS_NULL = " Not satisfied"; // not used or matched
    const KS_PARTMATCH = " Partially satisfied";
    const KS_MATCH = " Satisfied";// matched exactly, ans = key items

    const AS_NULL = " Incorrect";
    const AS_CORRECT = " Correct";
    const AS_WRONGDIR = " Wrong direction"
    const AS_WRONGENDPOINT = " One end point wrong"



    // set the status of each ans and vector
    key.forEach(item => {
        item.status = KS_NULL;

        if (item.options === undefined) item.options="";
    })

    ans.forEach(item => {
        item.status = AS_NULL;
    })

    let ansV = new THREE.Vector3();
    let keyV = new THREE.Vector3();
    let ansU = new THREE.Vector3();
    let keyU = new THREE.Vector3();

    let tempV1 = new THREE.Vector3();
    //let tempV2 = new THREE.Vector3();
    
    let tol2=0;

    // check each answer item
    ans.forEach(ansitem => {
        key.forEach(keyitem => {
            // if the types match and the key hasn't been matched exactly
            tol2 = keyitem.tol*keyitem.tol;
        
            if (ansitem.type === keyitem.type && keyitem.status !== KS_MATCH) {
                if (ansitem.type === "Vector") {
                    ansV.set(ansitem.x, ansitem.y, ansitem.z);
                    keyV.set(keyitem.x, keyitem.y, keyitem.z);
                    ansU.set(ansitem.ux, ansitem.uy, ansitem.uz);
                    keyU.set(keyitem.ux, keyitem.uy, keyitem.uz);
                    if ((ansV.distanceToSquared(keyV) < tol2) && (ansU.distanceToSquared(keyU) < tol2*uscale)) {
                        // found a match for vector position and direction
                        keyitem.status = KS_MATCH;
                        ansitem.status = AS_CORRECT;
                    } else if (keyitem.options.includes('colinear')) {
                        tempV1.addVectors(keyV,keyU)
                        const line=new THREE.Line3(keyV, tempV1);
                        const d=line.closestPointToPoint(ansV,false,tempV1).distanceTo(ansV);
                        if (d<keyitem.tol && ansU.distanceToSquared(keyU) < tol2*uscale){
                            keyitem.status = KS_MATCH;
                            ansitem.status = AS_CORRECT;
                        }
                    }
                }

                if (ansitem.type === "Line") {
                    ansV.set(ansitem.x, ansitem.y, ansitem.z);
                    keyV.set(keyitem.x, keyitem.y, keyitem.z);
                    ansU.set(ansitem.x1, ansitem.y1, ansitem.y1);
                    keyU.set(keyitem.x1, keyitem.y1, keyitem.y1);
                    if ((ansV.distanceToSquared(keyV) < tol2) && (ansU.distanceToSquared(keyU) < tol2)) {
                        // found a match for vector position and direction
                        keyitem.status = KS_MATCH;
                        ansitem.status = AS_CORRECT;
                    }
                }

            }
        })
    })


    // check for partial answers
    ans.forEach(ansitem => {
        if (ansitem.status === AS_NULL) {  // look for partial matches
            // ans item doesn't match, or partially match, the solution
            key.forEach(keyitem => {
                tol2 = keyitem.tol*keyitem.tol;
              
                // if the types match and the key hasn't been matched
                if (ansitem.type === keyitem.type && keyitem.status === KS_NULL) {
                    if (ansitem.type === "Vector") {
                        ansV.set(ansitem.x, ansitem.y, ansitem.z);
                        keyV.set(keyitem.x, keyitem.y, keyitem.z);
                        ansU.set(ansitem.ux, ansitem.uy, ansitem.uz);
                        keyU.set(keyitem.ux, keyitem.uy, keyitem.uz);
                        if (ansV.distanceToSquared(keyV) < tol2) {
                            // found a match for vector position and direction
                            keyitem.status = KS_PARTMATCH;
                            ansitem.status = AS_WRONGDIR;
                        } else if (keyitem.options.includes('colinear')) {
                            // does the vector passthrough the correct point
                            tempV1.addVectors(ansV,ansU)
                            const line=new THREE.Line3(ansV, tempV1); // line formed by answer vector
                            const d=line.closestPointToPoint(keyV,false,tempV1).distanceTo(keyV);
                            if (d<keyitem.tol){
                                keyitem.status = KS_PARTMATCH;
                                ansitem.status = AS_WRONGDIR;
                            }
                        }
                    }

                    if (ansitem.type === "Line") {
                        ansV.set(ansitem.x, ansitem.y, ansitem.z);
                        keyV.set(keyitem.x, keyitem.y, keyitem.z);
                        ansU.set(ansitem.x1, ansitem.y1, ansitem.y1);
                        keyU.set(keyitem.x1, keyitem.y1, keyitem.y1);
                        if ((ansV.distanceToSquared(keyV) < tol2) || (ansU.distanceToSquared(keyU) < tol2)) {
                            // found a match for vector position and direction
                            keyitem.status = KS_PARTMATCH;
                            ansitem.status = AS_WRONGENDPOINT
                        }
                    }
                }
            })
        }
    })

    // create the error message
    let text = "Answer check: \n";
    let Nline = 1;
    ans.forEach(ansitem => {
        if (ansitem.type === "Vector") {
            text += "  Vector '" + ansitem.label + "' " + ansitem.status + "\n"
        }
        if (ansitem.type === "Line") {
            text += "  Line #"+Nline +" " + ansitem.status + "\n"
            Nline++;
        }
    })

    if (ans.length - 1 < key.length) {  // remove the default axis count
        text += "  Some elements are missing\n"
    }

    if (ans.length - 1 > key.length) {  // remove the default axis count
        text += "  Too many elements provided\n"
    }

    text += "\nKey check: \n"
    key.forEach(keyitem => {
        text += "  " + keyitem.name + " " + keyitem.status + "\n"
    })
    return text;
}




/* Solutions
Simple beam
[{"name":"Ay", "type":"Vector", "x":0, "y":0, "z":0, "ux":0, "uy":1, "uz":0,"tol":0.1},
{"name":"Ax","type":"Vector", "x":0, "y":0, "z":0, "ux":1, "uy":0, "uz":0, "tol":0.1},
{"name":"Bx","type":"Vector", "x":8, "y":0, "z":0, "ux":0, "uy":1, "uz":0,"tol":0.1},
{"name":"W", "type":"Vector", "x":7, "y":1, "z":0, "ux":0, "uy":-1, "uz":0,"tol":0.1,"option":"colinear"}]


Two lines on graph
[{"name":"Seg 1","type":"Line", "x":0, "y":6, "z":0, "x1":6, "y1":10, "z1":0,"tol":0.1},
{"name":"Seg 2","type":"Line", "x":6, "y":10, "z":0, "x1":16, "y1":10, "z1":0, "tol":0.1}
]
*/