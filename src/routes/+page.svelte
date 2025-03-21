<script lang="ts">
    import {type Data, getRatingGroups} from '$lib/database';
    import StudentRow from "./StudentRow.svelte";
    import {storeable} from "$lib/stores";

    const {data}: { data: Data } = $props()

    const className = data.myClass.name
    const groups = getRatingGroups(data.myself, data.students)
    const currentGroup = storeable(`${data.myself.id}-currentGroup`, 0)
</script>

<p class="class-title">Třída: {className}</p>
<div class="student-group">
    <div class="students">
        <span></span>
        <span class="main-title">Sympatie</span>
        <span class="main-title">Vliv</span>
        {#each groups[$currentGroup] as student}
            <StudentRow {student} myId={data.myself.id}/>
        {/each}
    </div>
    {#if $currentGroup !== 0}
        <button onclick={() => currentGroup.update(n => n - 1)}>Zpět</button>
    {/if}
    {#if $currentGroup !== 3}
        <button onclick={() => currentGroup.update(n => n + 1)}>Další</button>
    {:else}
        <button onclick={() => {}}>Odeslat</button>
    {/if}
</div>

<style>
    .students {
        display: grid;
        grid-template-columns: 0fr 0fr 1fr;

        .main-title {
            display: none;
        }
        @media only screen and (min-width: 1100px) {
            grid-template-columns: 0fr 0fr 1fr 0fr 1fr;

            .main-title {
                display: inline;
                grid-area: auto / span 2;
            }
        }
    }
    .class-title {
        text-align: center;
        font-size: 2rem;
    }
</style>