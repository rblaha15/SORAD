<script lang="ts">
    import type {Rating, Student} from "$lib/schema";
    import StudentRow from "./StudentRow.svelte";

    let {groupRatings, showErrors}: {
        groupRatings: { student: Student, rating: { current: Rating } }[],
        showErrors: boolean,
    } = $props()

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