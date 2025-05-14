<script lang="ts" module>
    import seedrandom from "seedrandom";
    import { shuffled } from "$lib/utils/random";
    import { chunked } from "$lib/utils/splitting";
    import { groupCount } from "$lib/components/questionnaire/Questionnaire.svelte";
    import type { Rating, Student } from "$lib/database";

    export const getRatingGroups = (myself: Student, students: Student[], phase: Phase): Student[][] => {
        const classmates = students.toSpliced(students.findIndex(s => s.id == myself.id), 1);

        const random = seedrandom(`${myself.id}`)
        const shuffledStudents = shuffled(classmates, random)
        const orderedStudents = sortedBy(shuffledStudents, s => s.is_girl != myself.is_girl)

        const studentCount = students.length;
        const chunkCount = groupCount(studentCount, phase);
        const chunkSize = Math.ceil(studentCount / chunkCount);
        return chunked(orderedStudents, chunkSize)
    }

    export const validateRating = (r: Rating, phase: Phase) =>
        r.influence != -1 && (r.sympathy != -1 || phase == 'influence')
</script>

<script lang="ts">
    import StudentRow from "$lib/components/questionnaire/StudentRow.svelte";
    import { sortedBy, sortedByDescending } from "$lib/utils/comparisons";
    import { type QuestionnaireData, type Ratings } from "$lib/components/questionnaire/Questionnaire.svelte";

    let {
        phase, validateRatings = $bindable(), data, groupIndex, ratings = $bindable(),
    }: {
        phase: Phase, validateRatings: () => boolean, data: QuestionnaireData, groupIndex: number, ratings: Ratings,
    } = $props();

    const currentGroup = $derived(getRatingGroups(data.myself, data.students, phase)[groupIndex])

    const sortedStudents = $derived(sortedBy(
        sortedBy(currentGroup,
            s => phase == 'sympathy-reasoning' ? [5, 1, 4, 2, 3].indexOf(ratings[s.id].sympathy) : 0
        ), s => phase == 'sympathy-reasoning' ? s.is_girl : false
    ))

    let showErrors = $state(false)

    validateRatings = () => {
        showErrors = currentGroup?.some(s => !validateRating(ratings[s.id], phase)) ?? false
        return !showErrors
    }
</script>

<div class="student-group {phase.replace('-', ' ')}">
    <span class="main-title"></span>
    <span class="main-title I">Vliv:</span>
    <span class="main-title S">Sympatie:</span>
    <span class="main-title R">Vysvětlení sympatií:</span>
    {#each sortedStudents as student}
        <StudentRow {phase} {student} bind:rating={ratings[student.id]} {showErrors} />
    {/each}
</div>

<style>
    .student-group {
        display: grid;
        grid-template-columns: 1fr;

        .main-title {
            display: none;
        }

        @media only screen and (min-width: 250px) {
            grid-template-columns: auto 1fr;
        }
        @media only screen and (min-width: 600px) {
            grid-template-columns: auto auto 1fr;

            .main-title {
                display: inline;
                margin-left: .5rem;

                &.I {
                    color: var(--influence-color);
                }

                &.S, &.R {
                    color: var(--sympathy-color);
                }
            }

            &:not(.influence) .main-title.I,
            &:not(.sympathy) .main-title.S,
            &:not(.reasoning) .main-title.R {
                display: none;
            }
        }
    }
</style>