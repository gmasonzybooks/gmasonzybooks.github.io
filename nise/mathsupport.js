



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



/* DESCRIPTION:  numerical simulation of system described by state space form.  Simulation is restricted to SISO systems
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