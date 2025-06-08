<script lang="ts">
    import StudentRow from "$lib/components/questionnaire/StudentRow.svelte";
    import { sortedBy } from "$lib/utils/comparisons";
    import { getRatingGroups, type Phase, type QuestionnaireData, type Ratings, validateRating } from "$lib/questionnaire";

    let {
        phase, validateRatings = $bindable(), data, groupIndex, ratings = $bindable(),
    }: {
        phase: Phase, validateRatings: () => boolean, data: QuestionnaireData, groupIndex: number, ratings: Ratings,
    } = $props();

    const currentGroup = $derived(getRatingGroups(data.myself, data.students, phase)[groupIndex])

    const sortedStudents = $derived(sortedBy(
        sortedBy(currentGroup,
            s => phase == 'sympathy-reasoning' ? [5, 1, 4, 2, 3].indexOf(ratings[s.id].sympathy) : 0
        ), s => phase == 'sympathy-reasoning' ? s.is_girl != data.myself.is_girl : false
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