<script lang="ts">
    import NumberRating from "./Rating.svelte";
    import type { Rating, Student } from "$lib/database";

    let {
        student, rating = $bindable(), showErrors, phase,
    }: {
        student: Student,
        rating: Rating,
        showErrors: boolean,
        phase: Phase,
    } = $props()

    const error = $derived(showErrors && (phase == 'influence' ? rating.influence == -1 : rating.sympathy == -1))
</script>

<span class={['student-name', {error}]}>{student.names} {student.surname}</span>

{#if phase === 'influence'}
    <span class="title I">Vliv:</span>
    <span class="student-rating I"><NumberRating bind:value={rating.influence} type="influence" /></span>
{:else}
    <span class="title S">Sympatie:</span>
    <span class="student-rating S"><NumberRating bind:value={rating.sympathy} type="sympathy" readonly={phase === 'sympathy-reasoning'} /></span>
{/if}
{#if phase === 'sympathy-reasoning'}
    <span class="title R">Vysvětlení sympatií:</span>
    <input bind:value={rating.reasoning} class="student-input" size="1" />
{/if}

<style>
    .student-name {
        align-self: start;
        font-size: 1.5rem;
        margin-top: 1rem;

        &.error {
            color: var(--red-color);
        }

        @media only screen and (min-width: 250px) {
            grid-area: auto / span 2;
        }
        @media only screen and (min-width: 600px) {
            font-size: 1.25rem;
            white-space: nowrap;
            grid-area: auto / 1;
            align-self: center;
            margin-top: 0;
        }
    }

    .title {
        align-self: center;
        margin-top: .2rem;
        white-space: nowrap;

        &.I {
            color: var(--influence-color);
        }

        &.S, &.R {
            color: var(--sympathy-color);
        }

        @media only screen and (min-width: 250px) {
            &.R {
                grid-area: auto / span 2;
            }
        }
        @media only screen and (min-width: 400px) {
            &.R {
                grid-area: auto;
            }

            margin-top: 0;
        }
        @media only screen and (min-width: 600px) {
            display: none;
        }
    }

    .student-rating {
        margin-left: .375rem;
        @media only screen and (min-width: 250px) {
            &.I, &.S {
                grid-area: auto / 2;
            }
        }
        @media only screen and (min-width: 600px) {
            margin-left: .5rem;
            &.I, &.S {
                grid-area: auto / span 1;
            }
        }
    }

    .student-input {
        align-self: center;
        color: var(--sympathy-color);

        @media only screen and (min-width: 250px) {
            grid-area: auto / span 2;
        }
        @media only screen and (min-width: 400px) {
            grid-area: auto / 2;
            margin-left: .375rem;
        }
        @media only screen and (min-width: 600px) {
            grid-area: auto / 3;
            margin-bottom: .375rem;
        }
    }
</style>