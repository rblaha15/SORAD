import type {ChartConfiguration} from "chart.js";
import type {Student} from "$lib/database";
import {lcm} from "$lib/data";

const opacity = (value: number) => ({
    0: 2,
    1: 1,
    2: .66,
    3: .33,
    4: .66,
    5: 1,
})[value] ?? 0

export const studentChart = (
    values: {
        value: number,
        student: Student,
    }[],
): ChartConfiguration => {
    const studentsPerValue = Object.entries(Object.groupBy(values, r => r.value))
        .filter(([_, v]) => v != undefined)
        .map(([k, v]) => ({
            value: Number(k),
            students: v!.map(s => s.student),
            size: v!.length,
        }))
    const count = lcm(...studentsPerValue.map(v => v.size))

    return ({
        type: 'radar',
        data: {
            labels: arr(count + 1, ''),
            datasets: studentsPerValue.flatMap(({value, students, size}) => {
                const gap = Math.floor((count + 1) / size);
                const offset = Math.floor(Math.random() * (gap - 1))
                return students.map((student, i) => {
                    const index = Math.min(gap * i + 1, count);
                    return ({
                        data: [...arr(index + offset, null), value],
                        backgroundColor: student.is_girl ? 'orangered' : 'dodgerblue',
                        // backgroundColor: `rgba(${student.is_girl ? '255, 69, 0' : '30, 144, 255'}, ${opacity(value)})`,
                        pointRadius: 8 * opacity(value),
                        hoverRadius: 10 * opacity(value),
                        fill: false,
                        label: `${student.names} ${student.surname}`
                    });
                });
            }),
        },
        options: {
            animation: false,
            aspectRatio: 1,
            locale: 'cs',
            elements: {
                point: {
                    radius: 8,
                    hoverRadius: 10,
                    hitRadius: 8,
                    borderWidth: 2,
                    hoverBorderWidth: 4,
                },
            },
            scales: {
                r: {
                    beginAtZero: true,
                    min: 0,
                    max: 5,
                    ticks: {
                        color: ctx => `rgba(255, 255, 255, ${opacity(ctx.index)})`,
                        backdropColor: 'black',
                        precision: 0,
                    },
                    grid: {
                        color: ctx => `rgba(255, 255, 255, ${opacity(ctx.index)})`,
                    },
                    pointLabels: {
                        display: false,
                    },
                    border: {
                        display: false,
                    },
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: item => item.dataset.label
                    },
                },
            },
        },
    });
}

const arr = <T>(size: number, value: T) => Array(size).fill(value);