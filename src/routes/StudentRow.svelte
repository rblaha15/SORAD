<script lang="ts">
    import type {Rating, Student} from "$lib/schema";
    import StarRating from "./StarRating.svelte";
    import {value} from "$lib/stores";

    let {
        student, rating = $bindable(), showErrors
    }: {
        student: Student,
        rating: Rating,
        showErrors: boolean,
    } = $props()

    const property = <K extends keyof Rating>(key: K) => ({
        get: () => rating[key],
        set: (value: Rating[K]) => {
            rating[key] = value;
            rating = rating;
        },
    })
    let l = value(property('liking'))
    let lr = value(property('likingReasoning'))
    let p = value(property('popularity'))
    let pr = value(property('popularityReasoning'))

    const lError = $derived(showErrors && l.current == -1)
    const pError = $derived(showErrors && p.current == -1)
    const lrError = $derived(showErrors && (l.current == 0 || l.current == 4) && lr.current == '')
    const prError = $derived(showErrors && (p.current == 0 || p.current == 4) && pr.current == '')
</script>

<span class="student-name">{student.names} {student.surname}</span>

<span class="title">Sympatie:</span>
<span class="student-rating"><StarRating bind:value={l.current} error={lError}/></span>
<input bind:value={lr.current} class="student-input" class:error={lrError}/>

<span class="title">Vliv:</span>
<span class="student-rating"><StarRating bind:value={p.current} error={pError}/></span>
<input bind:value={pr.current} class="student-input" class:error={prError}/>

<style>
    .student-name {
        align-self: start;
        font-size: 1.5rem;
        margin-top: 1rem;
        @media only screen and (min-width: 450px) {
            grid-area: auto / span 2;
        }
        @media only screen and (min-width: 550px) {
            grid-area: auto / span 3;
        }
        @media only screen and (min-width: 1100px) {
            font-size: 1.25rem;
            white-space: nowrap;
            grid-area: span 1 / 1;
            align-self: center;
            margin-top: 0;
        }
    }

    .student-input {
        align-self: center;
        margin: 1px;

        &.error {
            margin: 0;
            border: 2px solid red;
        }

        @media only screen and (min-width: 450px) {
            margin-left: calc(1px + .375rem);
            &.error {
                margin-left: .375rem;
            }
        }
        @media only screen and (min-width: 550px) {
            margin-bottom: calc(1px + .375rem);
            &.error {
                margin-bottom: .375rem;
            }
        }
    }

    .title {
        align-self: center;
        margin-top: .2rem;
        @media only screen and (min-width: 450px) {
            margin: 0;
            grid-area: auto / span 2;
        }
        @media only screen and (min-width: 550px) {
            grid-area: auto;
            margin-top: 0;
            margin-right: .375rem;
        }
        @media only screen and (min-width: 1100px) {
            display: none;
        }
    }

    .student-rating {
        @media only screen and (min-width: 1100px) {
            margin-left: .5rem;
        }
    }
</style>