<script lang="ts">
    import {type Data, defaultRating, getRatingGroups, validateRating} from "$lib/database";
    import {storeable, value} from "$lib/stores";
    import type {Rating, Student} from "$lib/schema";
    import StudentRow from "./StudentRow.svelte";

    let {data, currentGroupNumber, anyError = $bindable(), showErrors}: { data: Data, currentGroupNumber: 0 | 1 | 2 | 3, anyError: boolean, showErrors: boolean } = $props()

    const myId = data.myself.id;
    const savedData = storeable<Rating[]>(`${myId}-ratings`, data.students.map(student => defaultRating(myId, student.id)))

    const currentGroup = $derived(getRatingGroups(data.myself, data.students)[currentGroupNumber])

    const thisRating = (student: Student) => (r: Rating) => r.about == student.id;

    const groupRatings = $derived(currentGroup.map(student => ({
        student,
        rating: value({
            get: () => $savedData[$savedData.findIndex(thisRating(student))!],
            set: newRating =>
                $savedData = $savedData.toSpliced($savedData.findIndex(thisRating(student)), 1, newRating),
        }),
    })))

    $effect(() => {
        anyError = !groupRatings.every(({rating}) => validateRating(rating.current))
    })
</script>
<div class="student-group">
    <span class="main-title"></span>
    <span class="main-title">Vliv:</span>
    <span class="main-title">Sympatie:</span>
    <span class="main-title">Důvod:</span>
    {#each groupRatings as {student, rating}}
        <StudentRow {student} bind:rating={rating.current} {showErrors}/>
    {/each}
</div>

<style>
    .student-group {
        display: grid;
        grid-template-columns: 1fr;

        .main-title {
            display: none;
        }

        @media only screen and (min-width: 400px) {
            grid-template-columns: 0fr auto 50%;
            grid-auto-flow: dense;
        }
        @media only screen and (min-width: 500px) {
            grid-template-columns: 0fr 1fr 0fr 1fr;
        }
        @media only screen and (min-width: 800px) {
            grid-template-columns: 0fr 0fr 0fr 1fr;

            .main-title {
                display: inline;
                margin-left: .5rem;
            }
        }
    }
</style>