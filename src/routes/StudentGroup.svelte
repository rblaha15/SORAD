<script lang="ts">
    import {type Data, defaultRating, getRatingGroups, validateRating} from "$lib/database";
    import {storeable, value} from "$lib/stores";
    import type {Rating, Student} from "$lib/schema";
    import StudentRow from "./StudentRow.svelte";

    let {data, cancel, demo = false}: { data: Data, cancel: () => void, demo?: boolean } = $props()

    const myId = data.myself.id;
    const currentGroupNumber = storeable(`${myId}-currentGroupNumber`, 0)
    const savedData = storeable<Rating[]>(`${myId}-ratings`, data.students.map(student => defaultRating(myId, student.id)))

    const currentGroup = $derived(getRatingGroups(data.myself, data.students)[$currentGroupNumber])

    const thisRating = (student: Student) => (r: Rating) => r.about == student.id;

    const groupRatings = $derived(currentGroup.map(student => ({
        student,
        rating: value({
            get: () => $savedData[$savedData.findIndex(thisRating(student))!],
            set: newRating =>
                $savedData = $savedData.toSpliced($savedData.findIndex(thisRating(student)), 1, newRating),
        }),
    })))

    let showErrors = $state(false)
    const anyError = $derived(groupRatings.every(({rating}) => validateRating(rating.current)))
    $effect(() => {
        if (!anyError) showErrors = false
    })

    const back = () => currentGroupNumber.update(n => n - 1)
    const next = () => !anyError
        ? showErrors = true
        : currentGroupNumber.update(n => n + 1)
    const send = () => {
        if (!$savedData.every(validateRating)) {
            showErrors = true
            return
        }
    }
</script>
<div class="student-group">
    <span></span>
    <span class="main-title">Sympatie</span>
    <span class="main-title">Vliv</span>
    {#each groupRatings as {student, rating}}
        <StudentRow {student} bind:rating={rating.current} {showErrors}/>
    {/each}
</div>
{#if !demo}
    <div class="button-row">
        <button class="grey" onclick={$currentGroupNumber !== 0 ? back : cancel}>Zpět</button>
        {#if $currentGroupNumber !== 3}
            <button onclick={next}>Další</button>
        {:else}
            <button class="red" onclick={send}>Odeslat</button>
        {/if}
    </div>
{/if}

<style>
    .student-group {
        display: grid;
        grid-template-columns: 1fr;

        .main-title {
            display: none;
        }

        @media only screen and (min-width: 450px) {
            grid-template-columns: 0fr 1fr;
        }
        @media only screen and (min-width: 550px) {
            grid-template-columns: 0fr 0fr 1fr;
        }
        @media only screen and (min-width: 1100px) {
            grid-template-columns: 0fr 0fr 1fr 0fr 1fr;

            .main-title {
                display: inline;
                grid-area: auto / span 2;
                margin-left: .5rem;
            }
        }
    }

    .button-row {
        display: flex;
        justify-content: end;

        button {
            margin-left: .5rem;
            margin-top: .5rem;
        }
    }
</style>