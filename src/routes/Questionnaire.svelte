<script lang="ts">
    import {browser} from "$app/environment";
    import {page} from "$app/state";
    import {pushState} from "$app/navigation";
    import Tutorial from "./Tutorial.svelte";
    import StudentGroup from "./StudentGroup.svelte";
    import {storeable, value} from "$lib/stores";
    import type {Rating, Student} from "$lib/schema";
    import {type Data, defaultRating, getRatingGroups, validateRating} from "$lib/data";
    import {rate} from "$lib/database";
    import {logOut} from "$lib/auth";

    let {data}: { data: Data } = $props()

    const currentGroupNumber = $derived((browser ? page.state : {}).group ?? -1) as -1 | 0 | 1 | 2 | 3

    const myId = data.myself.id;

    const savedData = storeable<Rating[]>(`${myId}-ratings`, data.students.map(student => defaultRating(myId, student.id)))

    const currentGroup = $derived(getRatingGroups(data.myself, data.students)[currentGroupNumber] ?? [])

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
    const noError = $derived(groupRatings.every(({rating}) => validateRating(rating.current)))
    $effect(() => {
        if (noError) showErrors = false
    })

    const back = () => pushState('', {group: currentGroupNumber - 1})
    const next = () => noError
        ? pushState('', {group: currentGroupNumber + 1})
        : showErrors = true
    const send = () => noError
        ? rate($savedData)
        : showErrors = true

    const tve = data.myClass.grade > 4 ? 'Vaše' : 'Tvé'
    const i = data.myClass.grade > 4 ? 'te' : 'i'
</script>

<p class="class-title">Třída: {data.myClass.name}</p>
<div class="content">
    <p>Js{i} přihlášen jako {data.myself.names} {data.myself.surname}.</p>
    {#if data.alreadyRated}
        <p>Hotovo! {tve} odpovědi byly odeslány.</p>
    {:else if currentGroupNumber === -1}
        <Tutorial isGirl={data.myself.is_girl} grade={data.myClass.grade}/>
    {:else}
        <StudentGroup {showErrors} {groupRatings}/>
    {/if}
</div>
<div class="button-row">
    <button class="grey" onclick={logOut}>Odhlásit</button>
    {#if data.alreadyRated}{:else if currentGroupNumber === -1}
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