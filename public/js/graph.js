/*jslint browser:true */

var trace1;
var colorscale = "Bluered";

function unpack(points, key) {
    return points.map(function (pt) { return pt[key]; });
}

var slider1 = document.getElementById("slider1");
var output1 = document.getElementById("sliderValue1");
output1.innerHTML = slider1.value;
slider1.oninput = function () {
    output1.innerHTML = this.value;
}
var slider2 = document.getElementById("slider2");
var output2 = document.getElementById("sliderValue2");
output2.innerHTML = slider2.value;
slider2.oninput = function () {
    output2.innerHTML = this.value;
}
var slider3 = document.getElementById("slider3");
var output3 = document.getElementById("sliderValue3");
output3.innerHTML = slider3.value;
slider3.oninput = function () {
    output3.innerHTML = this.value;
}

var xCountDisplay = document.getElementById("xCount")
var yCountDisplay = document.getElementById("yCount")
var zCountDisplay = document.getElementById("zCount")
var formula = document.getElementById("formula");
var formula2 = document.getElementById("formula2");

var xCounter = 50;
var yCounter = 50;
var zCounter = 50;

function printFormula() {
    xCountDisplay.innerHTML = xCounter;
    yCountDisplay.innerHTML = yCounter;
    zCountDisplay.innerHTML = zCounter;

    if (zRange === yRange && yRange === xRange) {
        formula.innerHTML = "C(Z,3)";
        formula2.innerHTML = "N/A";
    } else if (xRange === yRange && yRange > zRange) {
        formula.innerHTML = "C(Z,3)";
        formula2.innerHTML = "N/A";
    } else if (xRange === yRange && zRange > yRange) {
        formula.innerHTML = "C(Y,3) + C(Y,2) * (Z-Y)";
        formula2.innerHTML = "C(Z,3) - C((Z-Y), 3) - C((Z-Y), 2) * Y";
    } else if (yRange === zRange && zRange > xRange) {
        formula.innerHTML = "C(X,3) + C(X,2) * (Y-X) + C((Y-X), 2) * X";
        formula2.innerHTML = "C(Z,3) - C((Z-X), 3)";
    } else if (yRange === zRange && xRange > zRange) {
        formula.innerHTML = "C(Z,3)";
        formula2.innerHTML = "N/A";
    } else if (zRange === xRange && xRange > yRange) {
        formula.innerHTML = "C(Y,3) + C(Y,2) * (Z-Y)";
        formula2.innerHTML = "C(Z,3) - C((Z-Y), 3) - C((Z-Y), 2) * Y";
    } else if (zRange === xRange && xRange < yRange) {
        formula.innerHTML = "C(Z,3)";
        formula2.innerHTML = "N/A";
    } else if (xRange > yRange && yRange > zRange) {
        formula.innerHTML = "C(Z,3)";
        formula2.innerHTML = "N/A";
    } else if (xRange > zRange && zRange > yRange) {
        formula.innerHTML = "C(Y,3) + C(Y,2) * (Z-Y)";
        formula2.innerHTML = "C(Z,3) - C((Z-Y), 3) - C((Z-Y), 2) * Y";
    } else if (yRange > zRange && zRange > xRange) {
        formula.innerHTML = "C(X,3) + C(X,2) * (Z-X) + C((Z-X), 2) * X";
        formula2.innerHTML = "C(Z,3) - C((Z-X), 3)";
    } else if (yRange > xRange && xRange > zRange) {
        formula.innerHTML = "C(Z,3)";
        formula2.innerHTML = "N/A";
    } else if (zRange > xRange && xRange > yRange) {
        formula.innerHTML = "C(Y,3) + C(Y,2) * (Z-Y)";
        formula2.innerHTML = "C(Z,3) - C((Z-Y), 3) - C((Z-Y), 2) * Y";
    } else if (zRange > yRange && yRange > xRange) {
        formula.innerHTML = "C(X,3) + C(X,2) * (Z-X) + C((Y-X), 2) * X + (Y-X) * (Z-Y) * X";
        formula2.innerHTML = "C(Z,3) - C((Z-X), 3) - ((Z-Y), 2) * X";
    }
}

render()
function render() {

    var pointsOne = [];
    var pointsTwo = [];

    xCounter = 0;
    yCounter = 0;
    zCounter = 0;

    xRange = parseInt(slider1.value);
    yRange = parseInt(slider2.value);
    zRange = parseInt(slider3.value);

    var fullRange = Math.max(xRange, yRange, zRange);

    function addPoint(graphNum, x, y, z) {
        var jsonData = { ["x" + graphNum]: x, ["y" + graphNum]: y, ["z" + graphNum]: z };
        if (graphNum == 1) {
            pointsOne.push(jsonData);
        } else {
            pointsTwo.push(jsonData);
        }
    }

    for (i = 0; i < fullRange; i++) {
        if (i >= yRange && i < xRange) {
            // addPoint(1, i, 0, 0); 
        }
        if (i < xRange) {
            xCounter++;
        }
        for (j = i + 1; j < fullRange; j++) {
            // if (j >= zRange && j < yRange) { 
            //     addPoint(1, i, j, 0); 
            // }
            if (i < xRange && j < yRange) {
                yCounter++;
            }
            for (k = j + 1; k < fullRange; k++) {
                if (i < xRange && j < yRange && k < zRange) {
                    addPoint(1, i, j, k);
                    zCounter++;
                } else {
                    addPoint(2, i, j, k);
                }
            }
        }
    }

    trace1 = {
        x: unpack(pointsOne, 'x1'), y: unpack(pointsOne, 'y1'), z: unpack(pointsOne, 'z1'),
        mode: 'markers',
        name: 'Toggle Loop',
        showlegend: true,
        marker: {
            color: unpack(pointsOne, 'z1'),
            colorscale: colorscale,
            size: 4,
            symbol: 'square',
            opacity: 1
        },
        type: 'scatter3d'
    };

    var trace2 = {
        x: unpack(pointsTwo, 'x2'), y: unpack(pointsTwo, 'y2'), z: unpack(pointsTwo, 'z2'),
        mode: 'markers',
        name: 'Toggle Excess',
        showlegend: true,
        marker: {
            color: 'gray',
            size: 3,
            symbol: 'square',
            opacity: 0.3
        },
        type: 'scatter3d'
    };

    var data = [trace1, trace2];
    var layout = {
        scene: {
            camera: {
                eye: {x: -1.5, y: 1.5, z: .1}
            }}, 
        margin: {l: 0, r: 0, b: 0,  t: 0
        },
        legend: {x: 0.8, y: 0.9
        },
        autosize: true
    };
    console.log(layout.scene.camera.z);
    Plotly.react("myDiv", data, layout).then(printFormula());
}

function changeColour(id) {
    switch (id) {
        case 'btnradio1':
            colorscale = "Bluered";
            break;
        case 'btnradio2':
            colorscale = "YlOrRd";
            break;
        case 'btnradio3':
            colorscale = "YlGnBu";
            break;
        case 'btnradio4':
            colorscale = "Jet";
            break;
        case 'btnradio5':
            colorscale = "Greens";
            break;
    }
    render();
}
