<script lang="ts">
    import type {Student} from "$lib/schema";
    import {storeable} from "$lib/stores";
    import StarRating from "./StarRating.svelte";

    const {
        student, myId
    }: {
        student: Student,
        myId: number,
    } = $props()

    const liking = $derived(storeable<number>(`${myId}-${student.id}-liking`))
    const popularity = $derived(storeable<number>(`${myId}-${student.id}-popularity`))
    const likingReasoning = $derived(storeable(`${myId}-${student.id}-liking-reasoning`, ""))
    const popularityReasoning = $derived(storeable(`${myId}-${student.id}-popularity-reasoning`, ""))
</script>

<span class="student-name">{student.names} {student.surname}</span>
<span class="title">Sympatie:</span>
<span class="student-rating"><StarRating bind:value={$liking} id="{student.id}-1"/></span>
<input bind:value={$likingReasoning} class="student-input"/>
<span class="title">Vliv:</span>
<span class="student-rating"><StarRating bind:value={$popularity} id="{student.id}-2"/></span>
<input bind:value={$popularityReasoning} class="student-input"/>

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
        @media only screen and (min-width: 450px) {
            margin-left: .375rem;
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