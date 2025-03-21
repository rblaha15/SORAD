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

    const liking = storeable<number>(`${myId}-${student.id}-liking`)
    const popularity = storeable<number>(`${myId}-${student.id}-popularity`)
    const likingReasoning = storeable(`${myId}-${student.id}-liking-reasoning`, "")
    const popularityReasoning = storeable(`${myId}-${student.id}-popularity-reasoning`, "")
</script>

<span class="student-name">{student.names} {student.surname}</span>
<span class="title">Sympatie</span>
<span class="student-rating"><StarRating id="{student.id}-1" bind:value={$liking}/></span>
<input bind:value={$likingReasoning} class="student-input"/>
<span class="title">Vliv</span>
<span class="student-rating"><StarRating id="{student.id}-2" bind:value={$popularity}/></span>
<input bind:value={$popularityReasoning} class="student-input"/>

<style>
    .student-name {
        align-self: start;
        grid-area: auto / span 3;
        font-size: 1.5rem;
        @media only screen and (min-width: 1100px) {
            font-size: 1.25rem;
            white-space: nowrap;
            grid-area: span 1 / 1;
            align-self: center;
        }
    }

    .student-input {
        margin: .5rem;
        background: black;
        border: #3b4245 1px solid;
        border-radius: 0.375rem;
        color: white;
        font-size: 1rem;
        padding: .375rem .75rem;
        align-self: center;
    }

    .title {
        align-self: center;
        @media only screen and (min-width: 1100px) {
            display: none;
        }
    }
</style>