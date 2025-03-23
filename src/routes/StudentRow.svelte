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
    let r = value(property('reasoning'))
    let p = value(property('popularity'))

    const lError = $derived(showErrors && l.current == -1)
    const pError = $derived(showErrors && p.current == -1)
    const rError = $derived(showErrors && (l.current == 0 || l.current == 4) && r.current == '')
</script>

<span class="student-name">{student.names} {student.surname}</span>

<span class="title A">Vliv:</span>
<span class="student-rating A"><StarRating bind:value={p.current} error={lError}/></span>
<span class="title B">Sympatie:</span>
<span class="student-rating B"><StarRating bind:value={l.current} error={pError}/></span>
<span class="title C">Důvod:</span>
<input bind:value={r.current} class="student-input" class:error={rError}/>

<style>
    .student-name {
        align-self: start;
        font-size: 1.5rem;
        margin-top: 1rem;
        @media only screen and (min-width: 400px) {
            grid-area: auto / span 3;
        }
        @media only screen and (min-width: 500px) {
            grid-area: auto / span 5;
        }
        @media only screen and (min-width: 800px) {
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
        @media only screen and (min-width: 400px) {
            margin: 0;
            &.A {
                grid-area: auto / span 2;
            }

            &.B {
                grid-area: auto / 3;
            }

            &.C {
                grid-area: auto / 1 / auto / 1;
            }
        }
        @media only screen and (min-width: 500px) {
            &.A {
                grid-area: auto / 1;
            }

            margin-top: 0;
            margin-right: .375rem;
        }
        @media only screen and (min-width: 800px) {
            display: none;
        }
    }

    .student-rating {
        @media only screen and (min-width: 400px) {
            &.A {
                grid-area: auto / span 2;
            }

            &.B {
                grid-area: auto / 3;
            }
        }
        @media only screen and (min-width: 500px) {
            &.A {
                grid-area: auto / 2;
            }

            &.B {
                grid-area: auto / 4;
            }
        }
        @media only screen and (min-width: 800px) {
            margin-left: .5rem;
            &.A, &.B {
                grid-area: auto / span 1;
            }
        }
    }

    .student-input {
        align-self: center;
        margin: 1px;

        &.error {
            margin: 0;
            border: 2px solid red;
        }

        @media only screen and (min-width: 400px) {
            grid-area: auto / span 2;

            margin-left: calc(1px + .375rem);
            &.error {
                margin-left: .375rem;
            }
        }
        @media only screen and (min-width: 500px) {
            grid-area: auto / span 3;

            margin-bottom: calc(1px + .375rem);
            &.error {
                margin-bottom: .375rem;
            }
        }
        @media only screen and (min-width: 800px) {
            grid-area: auto / 4;
        }
    }
</style>