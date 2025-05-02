import type {ChartConfiguration, ScaleOptions} from "chart.js";
import type {StudentScore} from "$lib/data";

const scaleOptions: ScaleOptions<'linear'> = {
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
        color: 'white',
        z: -1,
        width: 1,
    },
    grid: {
        display: true,
        color: '#FFFFFF60',
        drawTicks: false,
        z: -1,
    },
}

export const classChart = (
    scores: StudentScore[],
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
            x: scaleOptions,
            y: scaleOptions,
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: item => {
                        const score = scores[item.datasetIndex];
                        const influence = score.influence?.toFixed(2)?.replace('.', ',');
                        const popularity = score.popularity?.toFixed(2)?.replace('.', ',');
                        const affection = score.affection?.toFixed(2)?.replace('.', ',');
                        const influenceability = score.influenceability?.toFixed(2)?.replace('.', ',');
                        return `${score.names} ${score.surname}: ` +
                            `vliv: ${influence ?? '—'}, ` +
                            `obliba: ${popularity ?? '—'}, ` +
                            `náklonnost: ${affection ?? '—'}, ` +
                            `ovlivnitelnost: ${influenceability ?? '—'}`;
                    },
                },
                caretPadding: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                yAlign: 'bottom',
            },
            legend: {
                display: false,
            },
            datalabels: {
                display: false,
            }
        },
        animation: false,
    },
})