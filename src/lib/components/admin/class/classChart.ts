import { Chart, type ChartConfiguration, type ScaleOptions } from "chart.js";
import type {StudentScore} from "$lib/admin";
import { round } from "$lib/utils/arithmetics";
import datalabels from "chartjs-plugin-datalabels";

Chart.register(datalabels);

const scaleOptions = (print: boolean): ScaleOptions<'linear'> => ({
    type: 'linear',
    position: 'center',
    min: 1,
    max: 5,
    offset: true,
    reverse: true,
    ticks: {
        display: false,
        precision: 0,
    },
    border: {
        color: print ? 'black' : 'white',
        z: -1,
        width: 1,
    },
    grid: {
        display: true,
        color: print ? '#00000060' : '#FFFFFF60',
        drawTicks: false,
        z: -1,
    },
})

export const classChart = (
    scores: StudentScore[],
    print: boolean
): ChartConfiguration => ({
    type: 'scatter',
    data: {
        datasets: scores.map(student => ({
            data: [{x: student.influence ?? Number.NaN, y: student.popularity ?? Number.NaN}],
            backgroundColor: student.is_girl ? 'orangered' : 'dodgerblue',
            borderColor: student.is_girl ? 'orangered' : 'dodgerblue',
        })),
    },
    options: {
        aspectRatio: 1,
        locale: 'cs',
        elements: {
            point: {
                radius: 6,
                hoverRadius: 10,
                hitRadius: 8,
                pointStyle: 'crossRot',
                borderWidth: 2,
                hoverBorderWidth: 4,
            },
        },
        scales: {
            x: scaleOptions(print),
            y: scaleOptions(print),
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: item => {
                        const score = scores[item.datasetIndex];
                        const pretty = (v: number | undefined) => v ? round(v).toLocaleString('cs') : '—'
                        return `${score.names} ${score.surname}: ` +
                            `vliv: ${pretty(score.influence)}, ` +
                            `obliba: ${pretty(score.popularity)}, ` +
                            `náklonnost: ${pretty(score.affection)}`
                    },
                },
                caretPadding: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                yAlign: 'bottom',
                enabled: !print,
            },
            legend: {
                display: false,
            },
            datalabels: {
                align: 'end',
                formatter: (_, ctx) => {
                    const score = scores[ctx.datasetIndex];
                    return `${score.names}\n${score.surname}`;
                },
                display: print,
                textAlign: 'center',
                font: {
                    weight: 'bold'
                },
                color: 'black',
            },
        },
        animation: false,
    },
})