<script lang="ts">
    import {allData, type Data, getRatingGroups} from '$lib/database';
    import StudentRow from "./StudentRow.svelte";
    import {storeable} from "$lib/stores";
    import {derived} from "svelte/store";
    import {studentId} from "$lib/auth";
    import {browser} from "$app/environment";

    const data = derived(studentId, (id, set: (v: Data | undefined) => void) => {
        if (id != undefined) allData(id).then(v => set(v))
        else if (browser) window.location.replace('/login')
    }, undefined)
    const className = () => $data!.myClass.name
    const groups = () => getRatingGroups($data!.myself, $data!.students)
    const currentGroup = storeable(`${$data?.myself?.id ?? ''}-currentGroup`, 0)
</script>

{#if $data === undefined}
    <span class="loader"></span>
{:else}
    <p class="class-title">Třída: {className()}</p>
    <button class="grey" onclick={$studentId = undefined}>Odhlásit</button>
    <div class="student-group">
        <span></span>
        <span class="main-title">Sympatie</span>
        <span class="main-title">Vliv</span>
        {#each groups()[$currentGroup] as student}
            <StudentRow {student} myId={$data.myself.id}/>
        {/each}
    </div>
    <div class="button-row">
        {#if $currentGroup !== 0}
            <button class="grey" onclick={() => currentGroup.update(n => n - 1)}>Zpět</button>
        {/if}
        {#if $currentGroup !== 3}
            <button onclick={() => currentGroup.update(n => n + 1)}>Další</button>
        {:else}
            <button class="red" onclick={() => {}}>Odeslat</button>
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

    .class-title {
        text-align: center;
        font-size: 2rem;
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