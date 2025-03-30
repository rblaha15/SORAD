import type {ChartConfiguration, ChartOptions, ScaleOptions} from "chart.js";
import type {StudentScore} from "$lib/data";

const scaleOptions = (orientation: 'x' | 'y'): ScaleOptions<'linear'> => ({
    type: 'linear',
    position: 'center',
    suggestedMin: 1,
    suggestedMax: 5,
    offset: true,
    reverse: orientation == 'y',
    ticks: {
        display: false,
        align: 'center',
        color: 'white',
        stepSize: 1,
        font: {
            size: 15,
        },
        labelOffset: {x: -15, y: 20}[orientation],
        precision: 0,
        includeBounds: false,
        maxRotation: 0,
    },
    border: {
        color: 'white',
        z: -1,
        width: 1,
    },
    grid: {
        display: true,
    },
})

let lastClickedIndex: number | null = null;
const events = (
    scores: StudentScore[],
    onClick: (score: StudentScore) => void,
): ChartOptions<'scatter'> => ({
    onClick: (e, elements, chart) => {
        if (elements.length) {
            const clickedPointIndex = elements[0].datasetIndex;

            if (lastClickedIndex === clickedPointIndex) {
                onClick(scores[clickedPointIndex])
            } else {
                chart.setActiveElements([elements[0]]);
                chart.tooltip!.setActiveElements([elements[0]], {x: e.x!, y: e.y!});
                chart.update();

                lastClickedIndex = clickedPointIndex;
            }
        } else {
            lastClickedIndex = null;
        }
    },
    onHover: (e, elements) => {
        if (!e.native) lastClickedIndex = null;
        if (elements.length) {
            lastClickedIndex = elements[0].datasetIndex;
        }
    },
});

export const chartConfig = (
    scores: StudentScore[],
    onClick: (score: StudentScore) => void,
): ChartConfiguration => ({
    type: 'scatter',
    data: {
        datasets: scores.map(student => ({
            data: [{x: student.influence, y: student.popularity}],
            backgroundColor: student.is_girl ? 'orangered' : 'dodgerblue',
            borderColor: student.is_girl ? 'orangered' : 'dodgerblue',
        })),
    },
    options: {
        ...events(scores, onClick),
        aspectRatio: 1,
        locale: 'cs',
        elements: {
            point: {
                radius: 6,
                hoverRadius: 10,
                hitRadius: 8,
                pointStyle: 'cross',
                borderWidth: 2,
                hoverBorderWidth: 4,
            },
        },
        scales: {
            x: scaleOptions('x'),
            y: scaleOptions('y'),
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: item => {
                        const score = scores[item.datasetIndex];
                        const influence = score.influence.toFixed(2).replace('.', ',');
                        const popularity = score.popularity.toFixed(2).replace('.', ',');
                        const affection = score.affection.toFixed(2).replace('.', ',');
                        const influenceability = score.influenceability.toFixed(2).replace('.', ',');
                        return `${score.names} ${score.surname}: ` +
                            `vliv: ${influence}, ` +
                            `obliba: ${popularity}, ` +
                            `náklonnost: ${affection}, ` +
                            `ovlivnitelnost: ${influenceability}`;
                    },
                },
                caretPadding: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.8)'
            },
            legend: {
                display: false,
            },
            zoom: {
                pan: {
                    enabled: true,
                    mode: 'xy',
                },
                zoom: {
                    pinch: {
                        enabled: true,
                    },
                    wheel: {
                        enabled: true,
                        modifierKey: 'ctrl',
                    },
                    mode: 'xy',
                },
                limits: {
                    x: {
                        min: 1,
                        max: 5,
                    },
                    y: {
                        min: 1,
                        max: 5,
                    },
                },
            }
        },
        animation: false,
    },
})