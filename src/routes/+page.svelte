<script lang="ts">
    import {allData, type Data} from '$lib/database';
    import {derived as derivedStore} from "svelte/store";
    import {studentId} from "$lib/auth";
    import {browser} from "$app/environment";
    import StudentGroup from "./StudentGroup.svelte";
    import Tutorial from "./Tutorial.svelte";
    import {pushState} from "$app/navigation";
    import {page} from "$app/state";

    const classData = derivedStore(studentId, (id, set: (v: Data | undefined) => void) => {
        if (id != undefined) allData(id).then(v => set(v))
        else if (browser) window.location.replace('/login')
    }, undefined)

    const currentGroupNumber = $derived((browser ? page.state : {}).group ?? -1) as -1 | 0 | 1 | 2 | 3

    let showErrors = $state(false)
    let anyError = $state(false)
    $effect(() => {
        if (currentGroupNumber == -1) anyError = false
        if (!anyError) showErrors = false
    })

    const back = () => pushState('', {group: currentGroupNumber - 1})
    const next = () => anyError
        ? showErrors = true
        : pushState('', {group: currentGroupNumber + 1})
    const send = () => {
        if (anyError) {
            showErrors = true
            return
        }
    }
</script>

{#if $classData === undefined}
    <span class="loader"></span>
{:else}
    <p class="class-title">Třída: {$classData.myClass.name}</p>
    <div class="content">
        {#if currentGroupNumber === -1}
            <Tutorial isGirl={$classData.myself.is_girl} grade={$classData.myClass.grade} />
        {:else}
            <StudentGroup {showErrors} bind:anyError data={$classData} currentGroupNumber={currentGroupNumber}/>
        {/if}
    </div>
    <div class="button-row">
        <button class="grey" onclick={$studentId = undefined}>Odhlásit</button>
        {#if currentGroupNumber === -1}
            <button onclick={() => pushState('', {group: 0})}>Začít!</button>
        {:else}
            <button class="grey" onclick={back}>Zpět</button>
            {#if currentGroupNumber === 3}
                <button class="red" onclick={send}>Odeslat</button>
            {:else}
                <button onclick={next}>Další</button>
            {/if}
        {/if}
    </div>
{/if}

<style>
    .class-title {
        text-align: center;
        font-size: 2rem;
        margin: 0;
        padding: 1rem 1rem;
    }

    .content {
        flex-grow: 1;
        padding: 1rem 1rem 0;
        overflow-y: auto;
    }

    .button-row {
        display: flex;
        background: black;
        padding: 1rem 1rem;

        button {
            margin-left: .5rem;

            &:first-child {
                margin-right: auto;
                margin-left: 0;
            }
        }
    }
</style>