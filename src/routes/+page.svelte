<script lang="ts">
    import {allData, type Data} from '$lib/database';
    import {derived as derivedStore} from "svelte/store";
    import {studentId} from "$lib/auth";
    import {browser} from "$app/environment";
    import StudentGroup from "./StudentGroup.svelte";
    import {storeable} from "$lib/stores";
    import type {Rating} from "$lib/schema";

    const data = derivedStore(studentId, (id, set: (v: Data | undefined) => void) => {
        if (id != undefined) allData(id).then(v => set(v))
        else if (browser) window.location.replace('/login')
    }, undefined)

    let start = $state(false)

    const demoData: Data = {
        students: [{id: -1, names: 'Jan', surname: 'Novák', class: -1, is_girl: false, student_number: -1}],
        myself: {id: -1, names: 'Jan', surname: 'Novák', class: -1, is_girl: false, student_number: -1},
        myClass: {id: -1, name: ''},
    }
    storeable<Rating[]>(`-1-ratings`, [
        {
            by: -1, about: -1, liking: 4, popularity: 1,
            likingReasoning: 'Je to můj nejlepší kamarád', popularityReasoning: ''
        }
    ])
</script>

{#if $data === undefined}
    <span class="loader"></span>
{:else}
    <p class="class-title">Třída: {$data.myClass.name}</p>
    <button class="grey" onclick={$studentId = undefined}>Odhlásit</button>
    {#if start}
        <StudentGroup data={$data} cancel={() => start = false}/>
    {:else}
        <p>Tady bude nějaké info</p>

        <StudentGroup data={demoData} cancel={() => {}} demo={true}/>

        <button onclick={() => start = true}>Začít!</button>
    {/if}
{/if}

<style>
    .class-title {
        text-align: center;
        font-size: 2rem;
    }
</style>