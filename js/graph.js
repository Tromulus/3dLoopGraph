/*jslint browser:true */

function unpack(points, key) {
    return points.map(function (pt) {return pt[key]; });
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

var formula = document.getElementById("formula");

render()
function render() {

    var pointsOne = [];
    var pointsTwo = [];

    xRange = slider1.value;
    yRange = slider2.value;
    zRange = slider3.value;

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
        // if (i >= yRange && i < xRange) { addPoint(1, i, 0, 0); }
        for (j = i + 1; j < fullRange; j++) {
            // if (j >= zRange && j < yRange) { addPoint(1, i, j, 0); }
            for (k = j + 1; k < fullRange; k++) {
                if (k >= zRange || j >= yRange || i >= xRange) {
                    addPoint(2, i, j, k);
                } else {
                    addPoint(1, i, j, k);
                }
            }
        }

    }

    function createArray(N) {
        return Array.from({ length: N }, (_, index) => index + 1);
    }

    let colorArray = createArray(fullRange);
    console.log(colorArray);

    var trace1 = {
        x: unpack(pointsOne, 'x1'), y: unpack(pointsOne, 'y1'), z: unpack(pointsOne, 'z1'),
        mode: 'markers',
        name: 'Toggle Loop',
        showlegend: true,
        marker: {
            color: unpack(pointsOne, 'z1'),
            colorscale: 'Bluered',
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
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0
        },
        legend: {
            x: 0.8,
            y: 0.9
        },
        autosize: true
    };
    Plotly.react("myDiv", data, layout);

    if (zRange <= yRange && zRange <= xRange) {
        formula.innerHTML = "C(" + zRange + ", 3)";
        formula2.innerHTML = "N/A";
    } else if (zRange <= yRange && zRange > xRange) {
        formula.innerHTML = "C(" + zRange + ", 3) - C(" + (zRange - xRange) + ", 3)";
        formula2.innerHTML = "N/A";
    } else if (zRange >= yRange && yRange <= xRange) {
        formula.innerHTML = "C(" + zRange + ", 3) - C(" + (zRange - yRange) + ", 3) - C(" + (zRange - yRange) + ", 2) * " + yRange;
        formula2.innerHTML = "C(" + yRange + ", 3) + C(" + yRange + ", 2) * " + (zRange - yRange);
    } else if (zRange > yRange && yRange > xRange) {
        formula.innerHTML = "C(" + zRange + ", 3) - C(" + (zRange - xRange) + ", 3) - C(" + (zRange - yRange) + ", 2) * " + xRange;
        formula2.innerHTML = "C(" + yRange + ", 3) + C(" + xRange + ", 2) * " + (zRange - yRange) + " + (" + (zRange - yRange) + " ^ 2) * " + xRange;
    } else if (yRange < zRange && yRange < xRange) {
        formula.innerHTML = "C(" + yRange + ", 3) + C(" + (yRange) + ", 2) * " + (zRange - yRange);
        formula2.innerHTML = "N/A";
    }
}
