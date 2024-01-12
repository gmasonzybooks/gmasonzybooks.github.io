// ----- Rocker FBD -----
const SVGPARAMS = '"$T1":0, "$A1":0, "$T2":0, "$A2":0, "$T3":0, "$W1":70'
var SOLNITEMS = ["vector","vector","vector","vector"] 
const SVGSTRING = String.raw`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->

<svg
   width="500"
   height="500"
   viewBox="0 0 500 500"
   version="1.1"
   id="svg1"
   sodipodi:docname="rocker.svg"
   inkscape:version="1.3.2 (091e20e, 2023-11-25)"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns:xlink="http://www.w3.org/1999/xlink"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <sodipodi:namedview
     id="namedview1"
     pagecolor="#ffffff"
     bordercolor="#666666"
     borderopacity="1.0"
     inkscape:showpageshadow="2"
     inkscape:pageopacity="0.0"
     inkscape:pagecheckerboard="0"
     inkscape:deskcolor="#d1d1d1"
     inkscape:zoom="0.472"
     inkscape:cx="248.94068"
     inkscape:cy="248.94068"
     inkscape:window-width="1248"
     inkscape:window-height="888"
     inkscape:window-x="0"
     inkscape:window-y="25"
     inkscape:window-maximized="0"
     inkscape:current-layer="roller" />
  <defs
     id="defs1">
    <linearGradient
       id="linearGradient11">
      <stop
         style="stop-color:#ffffff;stop-opacity:1;"
         offset="0"
         id="stop12" />
      <stop
         style="stop-color:#dbb6e6;stop-opacity:1;"
         offset="0.65266663"
         id="stop11" />
    </linearGradient>
    <linearGradient
       id="linearGradient2">
      <stop
         style="stop-color:#5ea4c7;stop-opacity:1;"
         offset="0"
         id="stop2" />
      <stop
         style="stop-color:#edf2f8;stop-opacity:1;"
         offset="0.30544743"
         id="stop3" />
      <stop
         style="stop-color:#66a8cc;stop-opacity:1;"
         offset="1"
         id="stop4" />
    </linearGradient>
    <linearGradient
       x1="0"
       y1="0"
       x2="1"
       y2="0"
       gradientUnits="userSpaceOnUse"
       gradientTransform="matrix(26.660649,0,0,26.660649,60.281744,214.71226)"
       spreadMethod="pad"
       id="linearGradient21">
      <stop
         style="stop-opacity:1;stop-color:#87a7d0"
         offset="0"
         id="stop15" />
      <stop
         style="stop-opacity:1;stop-color:#ffffff"
         offset="0.22"
         id="stop16" />
      <stop
         style="stop-opacity:1;stop-color:#a4bbdb"
         offset="0.28"
         id="stop17" />
      <stop
         style="stop-opacity:1;stop-color:#ffffff"
         offset="0.52"
         id="stop18" />
      <stop
         style="stop-opacity:1;stop-color:#c2b8b1"
         offset="0.63"
         id="stop19" />
      <stop
         style="stop-opacity:1;stop-color:#808285"
         offset="0.86"
         id="stop20" />
      <stop
         style="stop-opacity:1;stop-color:#cfe5f7"
         offset="1"
         id="stop21" />
    </linearGradient>
    <linearGradient
       xlink:href="#linearGradient21"
       id="linearGradient17"
       gradientUnits="userSpaceOnUse"
       gradientTransform="matrix(26.660649,0,0,26.660649,78.211691,373.16775)"
       x1="0"
       y1="0"
       x2="1"
       y2="0"
       spreadMethod="pad" />
    <linearGradient
       xlink:href="#linearGradient2"
       id="linearGradient5"
       gradientUnits="userSpaceOnUse"
       x1="120.64277"
       y1="214.3871"
       x2="120.64277"
       y2="229.67307"
       gradientTransform="matrix(1.2704264,0,0,1.2704264,-12.477157,-46.742025)" />
    <linearGradient
       xlink:href="#linearGradient2"
       id="linearGradient6"
       gradientUnits="userSpaceOnUse"
       gradientTransform="matrix(1.2704264,0,0,1.2704264,-115.49839,-46.828058)"
       x1="120.64277"
       y1="214.3871"
       x2="120.64277"
       y2="229.67307" />
    <linearGradient
       xlink:href="#linearGradient2"
       id="linearGradient9"
       gradientUnits="userSpaceOnUse"
       gradientTransform="matrix(0,1.2704264,-1.2704264,0,518.66588,-117.77146)"
       x1="120.64277"
       y1="214.3871"
       x2="120.64277"
       y2="229.67307" />
    <linearGradient
       xlink:href="#linearGradient2"
       id="linearGradient10"
       gradientUnits="userSpaceOnUse"
       gradientTransform="matrix(0,1.2704264,-1.2704264,0,518.57984,-14.750215)"
       x1="120.64277"
       y1="214.3871"
       x2="120.64277"
       y2="229.67307" />
    <linearGradient
       xlink:href="#linearGradient11"
       id="linearGradient12"
       x1="290.90219"
       y1="88.255957"
       x2="321.2546"
       y2="88.255957"
       gradientUnits="userSpaceOnUse"
       gradientTransform="matrix(1.2704264,0,0,1.2704264,-191.55964,-38.883754)" />
    <linearGradient
       xlink:href="#linearGradient11"
       id="linearGradient26"
       gradientUnits="userSpaceOnUse"
       gradientTransform="matrix(1,0,0,1.4179369,102.78814,153.07509)"
       x1="290.90219"
       y1="88.255957"
       x2="321.2546"
       y2="88.255957" />
  </defs>
  <g
     id="layer1">
    <g
       id="g26"
       transform="matrix(-0.63186752,-1.1021464,1.1021464,-0.63186752,218.89832,912.44336)">
      <rect
         style="fill:url(#linearGradient26);stroke:none;stroke-width:1.19077;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
         id="rect22"
         width="30.352407"
         height="73.795479"
         x="393.69034"
         y="241.31873" />
      <path
         style="fill:none;stroke:#000000;stroke-width:1.19077px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
         d="m 423.88104,238.04593 v 80.98996"
         id="path24" />
    </g>
    <path
       id="path23"
       d="m 218.07939,236.1638 c -0.51944,-7.20247 3.00148,-14.41566 9.67381,-18.27395 6.74195,-3.90112 14.76644,-3.56911 20.76939,0.59441 5.00158,3.38971 37.21193,29.58372 41.12913,32.2398 l -64.70721,37.35652 c -0.34273,-4.71775 -6.42869,-45.8924 -6.86512,-51.91678"
       style="fill:#b5d5e5;fill-opacity:1;fill-rule:nonzero;stroke:#231f20;stroke-width:1.27043;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
    <rect
       style="fill:#bee6b6;fill-opacity:1;stroke:none;stroke-width:1.24866;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
       id="rect35"
       width="25.753479"
       height="238.07646"
       x="224.14029"
       y="108.33813"
       class="answer"
       ansType="vector"
       ansDesc="Reaction 1" />
    <rect
       style="fill:#bee6b6;fill-opacity:1;stroke:none;stroke-width:1.30238;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
       id="rect36"
       width="258.67319"
       height="25.786579"
       x="114.62099"
       y="222.02092"
       class="answer"
       ansType="vector"
       ansDesc="Reaction 2" />
    <g
       id="fullarm"
       transform="rotate(0,237.24868,234.63163)"
       params="{&quot;transform&quot;:&quot;rotate($T1,237.24868,234.63163)&quot;}">
      <path
         style="fill:#b6d4e6;fill-opacity:1;stroke:#000000;stroke-width:1.27043px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
         d="m 238.02996,235.32023 h -71.99697 l 70.10382,-56.65356 z"
         id="web"
         params="{&quot;d&quot;:&quot;m 238.02996,235.32023 h -71.99697 l $W1,-56.65356 z&quot;}" />
      <g
         id="arm1"
         transform="translate(0)"
         params="{&quot;transform&quot;:&quot;translate($A1)&quot;}">
        <g
           id="weight"
           transform="rotate(0,79.562673,234.85927)"
           params="{&quot;transform&quot;:&quot;rotate($T2,79.562673,234.85927)&quot;}">
          <rect
             transform="rotate(180,79.44,232.85927)"
             style="fill:#bee6b6;fill-opacity:1;stroke:none;stroke-width:1.24866;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
             id="rect29"
             width="25.753479"
             height="238.07646"
             x="66.578995"
             y="114.82104"
             class="answer"
             ansType="vector"
             ansOpts="direction"
             ansDesc="Reaction 3" />
          <g
             id="g27"
             transform="matrix(1.2704264,0,0,1.2704264,-36.737172,-249.18887)">
            <path
               style="fill:url(#linearGradient17);stroke-width:2.10756"
               d="m 78.63529,374.48498 h 25.81764 v -2.63445 H 78.63529 Z"
               id="path2" />
            <path
               style="color:#000000;fill:#231f20;-inkscape-stroke:none"
               d="m 78.212891,371.42969 v 3.47656 l 0.726562,-2.63477 h 25.091797 v 1.79102 H 78.634766 l 0.421875,0.42187 -0.84375,0.42188 H 78.634766 104.875 v -3.47656 z"
               id="path3" />
            <path
               style="color:#000000;fill:#301aed;fill-opacity:1;-inkscape-stroke:none"
               d="m 89.670814,314.49804 v 45.83984 h 3.160156 v -45.83984 z"
               id="path15" />
            <path
               style="color:#000000;fill:#301aed;stroke-linecap:round;-inkscape-stroke:none;fill-opacity:1"
               d="m 96.523437,349.79492 a 1.05378,1.05378 0 0 0 -0.632812,0.49805 c -3.383789,6.03461 -5.314453,12.99687 -5.314453,20.40234 a 1.05378,1.05378 0 0 0 1.054687,1.05469 1.05378,1.05378 0 0 0 1.052735,-1.05469 c 0,-7.03975 1.832048,-13.64129 5.044922,-19.37109 a 1.05378,1.05378 0 0 0 -0.404297,-1.43555 1.05378,1.05378 0 0 0 -0.800782,-0.0937 z"
               id="path16" />
            <path
               style="color:#000000;fill:#301aed;stroke-linecap:round;-inkscape-stroke:none;fill-opacity:1"
               d="m 86.738281,349.79492 a 1.05378,1.05378 0 0 0 -0.800781,0.0937 1.05378,1.05378 0 0 0 -0.404297,1.43555 c 3.212874,5.7298 5.042969,12.33134 5.042969,19.37109 a 1.05378,1.05378 0 0 0 1.054687,1.05469 1.05378,1.05378 0 0 0 1.052735,-1.05469 c 0,-7.40547 -1.928711,-14.36773 -5.3125,-20.40234 a 1.05378,1.05378 0 0 0 -0.632813,-0.49805 z"
               id="path17" />
          </g>
        </g>
        <path
           id="path5"
           style="fill:url(#linearGradient5);stroke:#231f20;stroke-width:1.27043;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
           d="M 177.57302,227.06561 H 54.780852 c -3.617298,0 -6.553114,2.68499 -6.553114,6.30498 v 3.27532 c 0,3.61731 2.935816,6.55312 6.553114,6.55312 H 177.57302" />
      </g>
      <path
         id="path6"
         style="fill:url(#linearGradient6);stroke:#231f20;stroke-width:1.27043;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
         d="M 74.515847,243.11324 H 205.75189 c 9.97101,0.13655 13.29819,1.46443 19.27972,5.4539 l -0.66747,-26.93203 c -5.98153,3.98947 -8.97125,5.21085 -18.94225,5.34472 H 74.515847" />
      <g
         id="vertArm"
         transform="rotate(0,237.24868,234.63163)"
         params="{&quot;transform&quot;:&quot;rotate($T3,237.24868,234.63163)&quot;}">
        <path
           id="path9"
           style="fill:url(#linearGradient9);stroke:#231f20;stroke-width:1.27043;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
           d="m 228.72457,72.242778 1e-5,131.236042 c -0.13656,9.97099 -1.46444,13.29818 -5.4539,19.2797 l 26.93202,-0.66747 c -3.98947,-5.98152 -5.21085,-8.97124 -5.34472,-18.94225 V 72.242781" />
        <g
           id="arm2"
           transform="translate(0,0)"
           params="{&quot;transform&quot;:&quot;translate(0,$A2&quot;}">
          <path
             id="path8"
             style="fill:url(#linearGradient10);stroke:#231f20;stroke-width:1.27043;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
             d="M 244.77222,175.29994 V 52.507785 c 0,-3.617301 -2.68501,-6.553114 -6.305,-6.553111 l -3.27532,-3e-6 c -3.61731,0 -6.55312,2.935816 -6.55312,6.553115 V 175.29994" />
          <g
             id="roller"
             transform="rotate(0,236.49492,74)"
             params="{&quot;transform&quot;:&quot;rotate($T2,236.49492,74)&quot;}">
            <rect
               style="fill:url(#linearGradient12);stroke:none;stroke-width:1.27043;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
               id="rect11"
               width="38.560501"
               height="66.118401"
               x="178.01018"
               y="40.179741" />
            <path
               style="fill:none;stroke:#000000;stroke-width:1.27043px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
               d="M 216.36526,37.247418 V 109.81185"
               id="path18" />
            <rect
               style="fill:#bee6b6;fill-opacity:1;stroke:none;stroke-width:1.30238;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
               id="rect37"
               width="258.67319"
               height="25.786579"
               x="111.77897"
               y="60.468304"
               class="answer"
               ansType="vector"
               ansDesc="Reaction 4" />
            <g
               id="g11"
               transform="matrix(1.2704264,0,0,1.2704264,-191.55964,-38.990084)">
              <circle
                 style="fill:#b6d4e6;fill-opacity:1;stroke:#000000;stroke-width:1;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none"
                 id="path10"
                 cx="314.9574"
                 cy="88.339653"
                 r="14.89962" />
              <path
                 id="path2338"
                 d="m 314.9574,90.447218 c 1.16548,0 2.10756,-0.94208 2.10756,-2.10757 0,-1.16337 -0.94208,-2.10756 -2.10756,-2.10756 -1.16337,0 -2.10756,0.94419 -2.10756,2.10756 0,1.16549 0.94419,2.10757 2.10756,2.10757"
                 style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:2.10756" />
            </g>
          </g>
        </g>
      </g>
    </g>
    <g
       id="g10"
       transform="matrix(1.2704264,0,0,1.2704264,-116.60468,-47.681038)">
      <path
         id="path2196"
         d="m 278.37649,237.05445 c 8.2764,0 14.98687,-6.70837 14.98687,-14.98477 0,-8.27639 -6.71047,-14.98476 -14.98687,-14.98476 -8.27429,0 -14.98477,6.70837 -14.98477,14.98476 0,8.2764 6.71048,14.98477 14.98477,14.98477"
         style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:#231f20;stroke-width:0.843025;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         id="path2265"
         d="m 270.79559,221.98329 c 0,4.1814 3.38896,7.57036 7.57036,7.57036 4.1793,0 7.56826,-3.38896 7.56826,-7.57036 0,-4.1793 -3.38896,-7.56826 -7.56826,-7.56826 -4.1814,0 -7.57036,3.38896 -7.57036,7.56826"
         style="fill:#b2cbd9;fill-opacity:1;stroke:#231f20;stroke-width:0.843025;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         id="path1"
         d="m 275.8418,221.98399 c 0,1.3938 1.12965,2.52345 2.52345,2.52345 1.3931,0 2.52275,-1.12965 2.52275,-2.52345 0,-1.3931 -1.12965,-2.52275 -2.52275,-2.52275 -1.3938,0 -2.52345,1.12965 -2.52345,2.52275"
         style="fill:#ffffff;fill-opacity:1;stroke:#231f20;stroke-width:0.581;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
    </g>
  </g>
</svg>`
