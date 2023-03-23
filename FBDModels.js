/*
3D free body diagrams 
Example FBD models for FBDmail.html
G. Mason 2022
*/
var FBDExampleModels = [];

FBDExampleModels.push({
    desc: "Simply supported beam",
    x: 0, y: -1, z: 0,
    opacity: 0.6,
    origin:[0,0,0],
    objects: [
        {
            objectname: "beam",
            type: "box",
            color: "0x88FF88",
            param: [10, 1, 1],
            x: 5, y: 1.5, z: 0,
            rx: 0, ry: 0, rz: 0
        },
        {
            objectname: "weight",
            type: "extrude",
            depth: 0.7,
            color: "0x111111",
            param: [[1, 0], [0.9, 0.7], [0.1, 0.7], [0, 0]],
            x: 6.5, y: 2.0, z: -0.30,
            rx: 0, ry: 0, rz: 0
        },
        {
            objectname: "right",
            type: "simpleSupport",
            color: "0x888888",
            param: [],
            x: 8, y: 1, z: 0,
            rx: 0, ry: 0, rz: 0
        },
        {
            objectname: "left",
            type: "pinSupport",
            color: "0x888888",
            param: [],
            x: 0, y: 1, z: 0,
            rx: 0, ry: 0, rz: 0
        }]
})

FBDExampleModels.push( {
        desc: "Beam supported by cables",
        x: -2,
        y: 0,
        z: 0,
        opacity: 0.6,
        origin:[-2,1.25,0],
        objects: [
          {
            objectname: "cable",
            type: "cable",
            color: "0x000000",
            param: [
              [ -1, 5, 3 ],
              [ 10, 1.7,0 ],
              [ -1,5,-3]
            ],
            x: 0,
            y: 0,
            z: 0,
            rx: 0,
            ry: 0,
            rz: 0
          },
          {
            objectname: "wall",
            type: "box",
            color: "0x555555",
            param: [
              0.1,
              8,
              8
          ],
            x: -0.95,
            y: 4,
            z: 0,
            rx: 0,
            ry: 0,
            rz: 0
          },
          {
            objectname: "beam",
            type: "box",
            color: "0x88FF88",
            param: [
              11,
              1,
              1
            ],
            x: 5.5,
            y: 1.3,
            z: 0,
            rx: 0,
            ry: 0,
            rz: 0
          },
          {
            objectname: "weightcable",
            type: "cable",
            color: "0x000000",
            param: [
              [
                0,
                0.8,
                0
              ],
              [
                0,
                0.2,
                0
              ]
            ],
            x: 7,
            y: 0,
            z: 0,
            rx: 0,
            ry: 0,
            rz: 0
          },
          {
            objectname: "weight",
            type: "extrude",
            depth: 0.7,
            color: "0x111111",
            param: [
              [
                1,
                0
              ],
              [
                0.9,
                0.7
              ],
              [
                0.1,
                0.7
              ],
              [
                0,
                0
              ]
            ],
            x: 6.5,
            y: -0.5,
            z: -0.3,
            rx: 0,
            ry: 0,
            rz: 0
          },
          {
            objectname: "right",
            type: "pinSupport",
            color: "0x888888",
            param: [],
            x: 0,
            y: 1.3,
            z: 0,
            rx: 0,
            ry: 0,
            rz: -1.57
          }
        ]
      }
   )


FBDExampleModels.push({
    desc: "Box on ramp",
    x: 0, y: 0, z: 0,
    opacity: 0.9,
    origin:[0,0,0],
    objects: [{
        objectname: "Ramp",
        type: "extrude",
        color: "0x00FF22",
        param: [[5, 0], [5, 3], [0, 0]],
        depth: 4,
        x: 0, y: 0, z: -2,
        rx: 0, ry: 0, rz: 0
    },
    {
        objectname: "Box",
        type: "box",
        color: "0x0022FF",
        param: [2, 2, 4],
      x: 2.5, y: 2.6, z: 0,
        rx: 0, ry: 0, rz: 0.5404
    }]
});



FBDExampleModels.push({
  desc: "FCC small",
  x: 0, y: 0, z: 0,
  opacity: 1,
  origin:[0,0,0],
  objects: [
      {
          objectname: "S1",
          type: "sphere",
          color: "0x22AA22",
          param: [1],
          x: -3, y: 3, z: 3,
          rx: 0, ry: 0, rz: 0
      },
      {
          objectname: "S2",
          type: "sphere",
          color: "0x22AA22",
          param: [1],
          x: 3,y: 3, z: 3,
          rx: 0, ry: 0, rz: 0
      },
      {
          objectname: "S3",
          type: "sphere",
          color: "0x22AA22",
          param: [1],
          x: 3, y: -3, z: 3,
          rx: 0, ry: 0, rz: 0
      },
      {
          objectname: "S4",
          type: "sphere",
          color: "0x22AA22",
          param: [1],
          x: -3, y: -3, z: 3,
          rx: 0, ry: 0, rz: 0
      },
      {
          objectname: "S5",
          type: "sphere",
          color: "0x22AA22",
          param: [1],
          x: -3, y: 3, z: -3,
          rx: 0, ry: 0,rz: 0
      },
      {
          objectname: "S6",
          type: "sphere",
          color: "0x22AA22",
          param: [1],
          x: 3, y: 3, z: -3,
          rx: 0, ry: 0, rz: 0
      },
      {
          objectname: "S7",
          type: "sphere",
          color: "0x22AA22",
          param: [1],
          x: 3, y: -3, z: -3,
          rx: 0, ry: 0, rz: 0
      },
      {
          objectname: "S8",
          type: "sphere",
          color: "0x22AA22",
          param: [1],
          x: -3, y: -3, z: -3,
          rx: 0, ry: 0, rz: 0
      },
      {
          objectname: "F1",
          type: "sphere",
          color: "0x22AA22",
          param: [1],
          x: 0, y: 0, z: 3,
          rx: 0, ry: 0, rz: 0
      },
      {
          objectname: "F2",
          type: "sphere",
          color: "0x22AA22",
          param: [1],
          x: 3, y: 0, z: 0,
          rx: 0, ry: 0, rz: 0
      },
      {
          objectname: "F3",
          type: "sphere",
          color: "0x22AA22",
          param: [1],
          x: 0, y: 0, z: -3,
          rx: 0, ry: 0, rz: 0
      },
      {
          objectname: "F4",
          type: "sphere",
          color: "0x22AA22",
          param: [1],
          x: -3, y: 0, z: 0,
          rx: 0, ry: 0, rz: 0
      },
      {
          objectname: "F5",
          type: "sphere",
          color: "0x22AA22",
          param: [1],
          x: 0, y: 3, z: 0,
          rx: 0, ry: 0, rz: 0
      },
      {
          objectname: "F6",
          type: "sphere",
          color: "0x22AA22",
          param: [1],
          x: 0, y: -3, z: 0,
          rx: 0, ry: 0, rz: 0
      },
      {
          objectname: "line",
          type: "cable",
          color: "0x000000",
          param: [[-3, 3, 3], [3, 3, 3], [3, -3, 3], [-3, -3, 3], [-3, 3, 3], [-3, 3, -3], [3, 3, -3], [3, -3, -3], [-3, -3, -3], [-3, 3, -3],
          [-3, -3, -3], [-3, -3, 3], [3, -3, 3], [3, -3, -3], [3, 3, -3], [3, 3, 3]],
          x: 0, y: 0, z: 0,
          rx: 0, ry: 0, rz: 0
      }
  ]
})


FBDExampleModels.push({
    desc: "FCC large",
    x: 0, y: 0, z: 0,
    opacity: 1,
    objects: [
        {
            objectname: "S1",
            type: "sphere",
            color: "0x22AA22",
            param: [2.12],
            x: -3, y: 3, z: 3,
            rx: 0, ry: 0, rz: 0
        },
        {
            objectname: "S2",
            type: "sphere",
            color: "0x22AA22",
            param: [2.12],
            x: 3,y: 3, z: 3,
            rx: 0, ry: 0, rz: 0
        },
        {
            objectname: "S3",
            type: "sphere",
            color: "0x22AA22",
            param: [2.12],
            x: 3, y: -3, z: 3,
            rx: 0, ry: 0, rz: 0
        },
        {
            objectname: "S4",
            type: "sphere",
            color: "0x22AA22",
            param: [2.12],
            x: -3, y: -3, z: 3,
            rx: 0, ry: 0, rz: 0
        },
        {
            objectname: "S5",
            type: "sphere",
            color: "0x22AA22",
            param: [2.12],
            x: -3, y: 3, z: -3,
            rx: 0, ry: 0,rz: 0
        },
        {
            objectname: "S6",
            type: "sphere",
            color: "0x22AA22",
            param: [2.12],
            x: 3, y: 3, z: -3,
            rx: 0, ry: 0, rz: 0
        },
        {
            objectname: "S7",
            type: "sphere",
            color: "0x22AA22",
            param: [2.12],
            x: 3, y: -3, z: -3,
            rx: 0, ry: 0, rz: 0
        },
        {
            objectname: "S8",
            type: "sphere",
            color: "0x22AA22",
            param: [2.12],
            x: -3, y: -3, z: -3,
            rx: 0, ry: 0, rz: 0
        },
        {
            objectname: "F1",
            type: "sphere",
            color: "0x22AA22",
            param: [2.12],
            x: 0, y: 0, z: 3,
            rx: 0, ry: 0, rz: 0
        },
        {
            objectname: "F2",
            type: "sphere",
            color: "0x22AA22",
            param: [2.12],
            x: 3, y: 0, z: 0,
            rx: 0, ry: 0, rz: 0
        },
        {
            objectname: "F3",
            type: "sphere",
            color: "0x22AA22",
            param: [2.12],
            x: 0, y: 0, z: -3,
            rx: 0, ry: 0, rz: 0
        },
        {
            objectname: "F4",
            type: "sphere",
            color: "0x22AA22",
            param: [2.12],
            x: -3, y: 0, z: 0,
            rx: 0, ry: 0, rz: 0
        },
        {
            objectname: "F5",
            type: "sphere",
            color: "0x22AA22",
            param: [2.12],
            x: 0, y: 3, z: 0,
            rx: 0, ry: 0, rz: 0
        },
        {
            objectname: "F6",
            type: "sphere",
            color: "0x22AA22",
            param: [2.12],
            x: 0, y: -3, z: 0,
            rx: 0, ry: 0, rz: 0
        },
        {
            objectname: "line",
            type: "cable",
            color: "0x000000",
            param: [[-3, 3, 3], [3, 3, 3], [3, -3, 3], [-3, -3, 3], [-3, 3, 3], [-3, 3, -3], [3, 3, -3], [3, -3, -3], [-3, -3, -3], [-3, 3, -3],
            [-3, -3, -3], [-3, -3, 3], [3, -3, 3], [3, -3, -3], [3, 3, -3], [3, 3, 3]],
            x: 0, y: 0, z: 0,
            rx: 0, ry: 0, rz: 0
        }
    ]
})


FBDExampleModels.push({
    desc: "Bar graph",
    x: 0,
    y: 0,
    z: 0,
    opacity:0.1,
    origin:[-8.2, -8.1, 0],
    objects: [
      {
        objectname: "graph",
        type: "chartjs",
        size:[18, 18],
        param: {
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
              animation:false,
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          },
        x: 0, y: 0,z: 0,
        rx: 0,ry: 0,rz: 0
      }]
  }
);
    


FBDExampleModels.push({
    desc: "VM graph",
    x: 0,
    y: 0,
    z: 0,
    opacity:1,
    origin:[-7.6, -7.6, 0],
    objects: [
      {
        objectname: "graph",
        type: "chartjs",
        size:[18, 9],
        param:
        {
           
            type: 'scatter',
            data: {
                datasets: [{
                  label: 'Shear',
                data: [{
                    x: 0,
                    y: 0
                  }],
                  backgroundColor: 'rgb(255, 99, 132)'
                }],
              },
            options: {
            animation:false,
              scales: {
                x: {
                  min:0, max:16,
                  type: 'linear',
                  position: 'bottom'
                },
                y: {
                  min:0, max:1000,
            
                }
              }
            }
        },
        "x": 0,
        "y": 5,
        "z": 0,
        "rx": 0,
        "ry": 0,
        "rz": 0
      },
      {
        objectname: "graph",
        type: "chartjs",
        size:[18, 9],
        param:
        {
           
            type: 'scatter',
            data: {
                datasets: [{
                  label: 'Moment',
                data: [{
                    x: 0,
                    y: 0
                  }],
                  backgroundColor: 'rgb(255, 99, 132)'
                }],
              },
            options: {
            animation:false,
              scales: {
                x: {
                  min:0, max:16,
                  type: 'linear',
                  position: 'bottom'
                },
                y: {
                  min:0, max:1000,
            
                }
              }
            }
        },
        "x": 0,
        "y": -4,
        "z": 0,
        "rx": 0,
        "ry": 0,
        "rz": 0
      }]
  }
);
    
  