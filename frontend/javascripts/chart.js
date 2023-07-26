// line chart - rahad

import { getAverageCGPAandCredits, roundToTwoDecimal, select } from "./helpers.js"

let resultChart

export const updateChart = (trimesterResultsArray) => {
    const allResultData = [...trimesterResultsArray].reverse()
    const resultData = allResultData.filter(result => result.currentGPA > 0)
    const trimesterTitles = resultData.map(result => result.trimester)
    const gpaValues = resultData.map(result => roundToTwoDecimal(result.currentGPA))
    const cgpaValues = resultData.map((_, i) => getAverageCGPAandCredits(resultData, i).totalAverageCGPA)
    resultChart.data.labels = trimesterTitles
    resultChart.data.datasets[0].data = gpaValues
    resultChart.data.datasets[1].data = cgpaValues
    resultChart.update()
}

export const lineChart = () => {
    const data = {
        labels: [],
        datasets: [
            {
                label: 'SGPA ',
                backgroundColor: '#00a3ff',
                borderColor: '#00a3ff',
                data: [],
            },
            {
                label: 'CGPA ',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [],
            },
        ]
    };
    const config = {
        type: 'line',
        data: data,
        options: {
            // ... other options ...
            plugins: {
                tooltip: {
                    mode: 'interpolate',
                    intersect: false
                },
                crosshair: {
                    line: {
                        color: '#F66',  // crosshair line color
                        width: 1// crosshair line width
                    },
                    sync: {
                        enabled: true,            // enable trace line syncing with other charts
                        group: 1,                 // chart group
                        suppressTooltips: false   // suppress tooltips when showing a synced tracer
                    },
                    zoom: {
                        enabled: true,                                      // enable zooming
                        zoomboxBackgroundColor: 'rgba(66,133,244,0.2)',     // background color of zoom box 
                        zoomboxBorderColor: '#48F',                         // border color of zoom box
                        zoomButtonText: 'Reset Zoom',                       // reset zoom button text
                        zoomButtonClass: 'reset-zoom',                      // reset zoom button class
                    },
                    callbacks: {
                        beforeZoom: () => function (start, end) {                  // called before zoom, return false to prevent zoom
                            return true;
                        },
                        afterZoom: () => function (start, end) {                   // called after zoom
                        }
                    }
                }
            }
        }
    };

    resultChart = new Chart(
        select('#myChart'),
        config
    )
}