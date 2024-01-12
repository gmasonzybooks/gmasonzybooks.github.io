// ----- Shear moment diagram -----
var SVGPARAMS = ''
var SOLNITEMS = ["curve","user","user","user","user"] 
// figure is not scaled properly so fudged xfinal by 2 px


const SVGSTRING = String.raw`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->

<svg
   width="500"
   height="500"
   viewBox="0 0 500 500"
   version="1.1"
   id="svg1"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <defs
     id="defs1" />
  <g
     id="g19">
    <path
       style="fill:none;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
       d="M 63.093891,73.9524 H 92.821622"
       id="path1" />
    <path
       style="fill:none;stroke:#000000;stroke-width:0.812404px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
       d="M 68.147606,82.57345 H 87.767912"
       id="path2" />
    <path
       style="fill:none;stroke:#000000;stroke-width:0.898146px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
       d="m 77.794322,82.64654 v 26.04865 H 212.21466"
       id="path4" />
    <path
       style="fill:none;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
       d="M 77.819689,74.553083 V 48.932771 h 66.590151"
       id="path5" />
    <circle
       style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.756907;stroke-opacity:1"
       id="path6"
       cx="149.46356"
       cy="48.63549"
       r="5.1752629" />
    <circle
       style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.756907;stroke-opacity:1"
       id="circle6"
       cx="150.05812"
       cy="108.97937"
       r="5.1752629" />
    <circle
       style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.756907;stroke-opacity:1"
       id="circle7"
       cx="210.48639"
       cy="108.97937"
       r="5.1752629" />
    <circle
       style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.756907;stroke-opacity:1"
       id="circle8"
       cx="210.48639"
       cy="48.63549"
       r="5.1752629" />
    <text
       xml:space="preserve"
       style="font-style:normal;font-weight:normal;font-size:16px;line-height:1.25;font-family:sans-serif;fill:#000000;fill-opacity:1;stroke:none"
       x="48.137383"
       y="82.821518"
       id="text8"><tspan
         id="tspan8"
         x="48.137383"
         y="82.821518"
         style="font-size:16px">V</tspan></text>
    <text
       xml:space="preserve"
       style="font-style:normal;font-weight:normal;font-size:16px;line-height:1.25;font-family:sans-serif;fill:#000000;fill-opacity:1;stroke:none"
       x="118.55671"
       y="139.57739"
       id="text12"><tspan
         id="tspan12"
         x="118.55671"
         y="139.57739"
         style="font-size:16px">Parallel</tspan></text>
  </g>
  <g
     id="g20">
    <path
       style="fill:none;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
       d="m 287.09389,73.9524 h 29.72773"
       id="path12" />
    <path
       style="fill:none;stroke:#000000;stroke-width:0.812404px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
       d="m 292.14761,82.57345 h 19.6203"
       id="path13" />
    <path
       style="fill:none;stroke:#000000;stroke-width:0.898146px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
       d="m 301.79432,82.64654 v 26.04865 h 134.42034"
       id="path14" />
    <path
       style="fill:none;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
       d="M 301.81969,74.553083 V 48.932771 h 66.59015"
       id="path15" />
    <circle
       style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.756907;stroke-opacity:1"
       id="circle15"
       cx="373.46356"
       cy="48.63549"
       r="5.1752629" />
    <circle
       style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.756907;stroke-opacity:1"
       id="circle16"
       cx="374.05811"
       cy="108.97937"
       r="5.1752629" />
    <circle
       style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.756907;stroke-opacity:1"
       id="circle18"
       cx="434.48639"
       cy="48.63549"
       r="5.1752629" />
       <circle
       style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0.756907;stroke-opacity:1"
       id="circle17"
       cx="434.48639"
       cy="108.97937"
       r="5.1752629" />
       <circle
       style="fill:#000000;fill-opacity:0.1;stroke:#ffffff;stroke-width:0.756907;stroke-opacity:1"
       id="circle17"
       cx="234.48639"
       cy="108.97937"
       r="0.01" />
    <text
       xml:space="preserve"
       style="font-style:normal;font-weight:normal;font-size:16px;line-height:1.25;font-family:sans-serif;fill:#000000;fill-opacity:1;stroke:none"
       x="272.13739"
       y="82.821518"
       id="text18"><tspan
         id="tspan18"
         x="272.13739"
         y="82.821518"
         style="font-size:16px">V</tspan></text>
    <text
       xml:space="preserve"
       style="font-style:normal;font-weight:normal;font-size:16px;line-height:1.25;font-family:sans-serif;fill:#000000;fill-opacity:1;stroke:none"
       x="342.5567"
       y="139.57739"
       id="text19"><tspan
         id="tspan19"
         x="342.5567"
         y="139.57739"
         style="font-size:16px">Series</tspan></text>
  </g>
  <rect
     style="fill:#bfeceb;fill-opacity:0.540816;stroke:none;stroke-width:1.95142;stroke-opacity:1"
     id="ParallelR1"
     width="28.808033"
     height="78.927208"
     x="195.4735"
     y="39.153778"
    class="answer" ansType="user"  ansDesc="Parallel resistor 1" />
  <rect
     style="fill:#bfeceb;fill-opacity:0.540816;stroke:none;stroke-width:1.95142;stroke-opacity:1"
     id="ParallelR2"
     width="28.808033"
     height="78.927208"
     x="135.35432"
     y="39.153778"
     class="answer" ansType="user"  ansDesc="Parallel resistor 2" />
  <rect
     style="fill:#bfeceb;fill-opacity:0.540816;stroke:none;stroke-width:1.95142;stroke-opacity:1"
     id="ParallelWireA"
     width="18.808033"
     height="18.927208"
     x="-58.17202"
     y="140.1441"
     transform="rotate(-90)"
     class="answer" ansType="curve" ansOpts="inside" ansDesc="Parallel wire start" />
   <rect
     style="fill:#bfeceb;fill-opacity:0.540816;stroke:none;stroke-width:1.95142;stroke-opacity:1"
     id="ParallelWireB"
     width="18.808033"
     height="18.927208"
     x="-58.17202"
     y="200.1441"
     transform="rotate(-90)"
     class="answer" ansType="curve"  ansOpts="inside" ansDesc="Parallel wire end" />
  <rect
     style="fill:#bfeceb;fill-opacity:0.540816;stroke:none;stroke-width:1.95142;stroke-opacity:1"
     id="SeriesR1"
     width="28.808033"
     height="78.927208"
     x="-62.751606"
     y="364.64508"
     transform="rotate(-90)"
     class="answer" ansType="user"  ansDesc="Series resistor 1" />
  <rect
     style="fill:#bfeceb;fill-opacity:0.540816;stroke:none;stroke-width:1.95142;stroke-opacity:1"
     id="SeriesR2"
     width="28"
     height="78.927208"
     x="420.55405"
     y="38.733364"
     class="answer" ansType="user"  ansDesc="Series resistor 2"  />
</svg>`
