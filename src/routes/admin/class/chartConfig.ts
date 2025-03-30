import type {ChartConfiguration} from "chart.js";
import type {Rating, Student} from "$lib/database";

export type StudentScore = Student & Pick<Rating, 'liking' | 'popularity'>;

export const chartConfig = (scores: StudentScore[]): ChartConfiguration => ({
    type: 'scatter',
    data: {
        datasets: scores.map(student => ({
            label: `${student.names} ${student.surname}`,
            data: [{x: student.liking + 1, y: student.popularity + 1}],
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
                pointStyle: 'cross',
                borderWidth: 2,
                hoverBorderWidth: 4,
            },
        },
        scales: {
            x: {
                type: 'linear',
                position: 'center',
                suggestedMin: 1,
                suggestedMax: 5,
                offset: true,
                ticks: {
                    display: true,
                    align: 'center',
                    color: 'white',
                    count: 5,
                    font: {
                        size: 15,
                    },
                    labelOffset: -15,
                },
                border: {
                    color: 'white',
                    z: -1,
                    width: 1,
                },
                grid: {
                    display: false,
                },
            },
            y: {
                type: 'linear',
                position: 'center',
                suggestedMin: 1,
                suggestedMax: 5,
                offset: true,
                ticks: {
                    display: true,
                    align: 'center',
                    color: 'white',
                    count: 5,
                    font: {
                        size: 15,
                    },
                    labelOffset: 20,
                },
                border: {
                    color: 'white',
                    z: -1,
                    width: 1,
                },
                grid: {
                    display: false,
                },
                title: {
                    display: true,
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: item => {
                        const label = item.dataset.label!!;
                        const data = item.parsed;
                        return `${label}: oblíbenost: ${data.x.toFixed(2)}, vliv: ${data.y.toFixed(2)}`;
                    },
                },
                caretPadding: 8,
            },
            legend: {
                display: false,
            },
        },
    },
})