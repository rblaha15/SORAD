<script lang="ts">
    import { browser } from "$app/environment";
    import { page } from "$app/state";
    import { pushState } from "$app/navigation";
    import Tutorial from "./Tutorial.svelte";
    import { storeable } from "$lib/stores";
    import BasicLayout from "$lib/components/BasicLayout.svelte";
    import database from "$lib/database/supabase";
    import RatingsComponent from "$lib/components/questionnaire/Ratings.svelte";
    import { get } from "svelte/store";
    import { defaultRatings, groupCount, type Phase, type QuestionnaireData, type Ratings, type State } from "$lib/questionnaire";

    const { phase, progress, group }: State = $derived({
        phase: 'influence', progress: 'introduction', group: undefined,
        ...(browser ? page.state as State | Record<string, never> : undefined)
    })
    const changeState = (state: State | Record<string, never>) => pushState('', state)

    const data: QuestionnaireData = $props()
    const groups = $derived(groupCount(data.students.length, 'influence'))

    let validateRatings = $state(() => true)
    const prevPhase = (phase: Phase) => phase == 'sympathy-reasoning' ? 'sympathy' : 'influence'
    const nextPhase = (phase: Phase) => phase == 'influence' ? 'sympathy' : 'sympathy-reasoning'

    const back = () => changeState(progress == 'ratings'
        ? group == 0
            ? { phase, progress: 'tutorial', group: undefined }
            : { phase, progress, group: group - 1 }
        : { phase: prevPhase(phase), progress: 'ratings', group: groups - 1 })

    const next = () => validateRatings() && changeState(progress == 'ratings'
        ? group == groups - 1
            ? { phase: nextPhase(phase), progress: 'tutorial', group: undefined }
            : { phase, progress, group: group + 1 }
        : { phase, progress: 'ratings', group: 0 })

    const others = data.students.toSpliced(data.students.findIndex(student => student.id == data.myself.id), 1)
    const savedRatings = storeable<Ratings>(`${data.myself.id}-ratings`, defaultRatings(data.myself, others))
    let ratings = $state<Ratings>(get(savedRatings))
    $effect(() => savedRatings.set(ratings))

    const send = () => database.rate(Object.values(ratings).filter(r => r).map(r => r!)).then(() => {
        changeState({})
        savedRatings.set({})
        location.reload()
    })

    const tve = data.myClass.grade > 4 ? 'Vaše' : 'Tvé'
    const vas = data.myClass.grade > 4 ? 'vás' : 'tě'
    const vasi = data.myClass.grade > 4 ? 'vaší' : 'tvé'
    const te = data.myClass.grade > 4 ? 'te' : 'š'
    const te2 = data.myClass.grade > 4 ? 'te' : ''

    let sending = $state(false);
    let sendDialog = $state() as HTMLDialogElement;
</script>

<BasicLayout>
    {#snippet title()}
        {data.myself.names} {data.myself.surname} ({data.myClass.name})
    {/snippet}
    {#snippet content()}
        {#if data.alreadyRated}
            <p>Hotovo! {tve} odpovědi byly odeslány.</p>
        {:else if !data.myClass.enabled}
            <p>V této třídě aktuálně neprobíhá sběr dat.</p>
        {:else if progress === 'introduction'}
            <p>Čeká {vas} vyplnění dotazníku, který se zabývá vztahy ve {vasi} třídě.</p>
            <p>Postupuj{te2} podle zadaných instrukcí, vše bude řádně vysvětleno.</p>
            <p>Všechny odpovědi se průběžně ukládají do prohlížeče, takže o ně nepřijde{te}, pokud např. ztratí{te} připojení k internetu.</p>
        {:else if progress === 'tutorial'}
            <Tutorial isGirl={data.myself.is_girl} grade={data.myClass.grade} {phase} />
        {:else}
            <Tutorial isGirl={data.myself.is_girl} grade={data.myClass.grade} {phase} justOverview />
            <RatingsComponent {phase} groupIndex={group} bind:validateRatings {data} bind:ratings />
        {/if}
    {/snippet}
    {#snippet buttons()}
        <button class="secondary" onclick={database.auth.logOut} >Odhlásit se</button>
        {#if data.myClass.enabled && !data.alreadyRated}
            {#if progress === 'ratings' || phase !== 'influence'}
                <button class="secondary" onclick={back}>Zpět</button>
            {/if}
            {#if progress === 'introduction'}
                <button class="primary" onclick={() => changeState({ phase, progress: 'tutorial', group })}>Začít!</button>
            {:else if phase === 'sympathy-reasoning' && progress === 'ratings'}
                <button class="warning" onclick={() => sendDialog.showModal()}>Odeslat</button>
            {:else}
                <button class="primary" onclick={next}>Další</button>
            {/if}
        {/if}
    {/snippet}
</BasicLayout>

<dialog bind:this={sendDialog} closedby={sending ? 'none' : 'any'} onclose={() => sending && sendDialog.showModal()}>
    <h2>Odeslat dotazník</h2>
    <p>Pokud dotazník odešle{te}, nebude{te} se moci vrátit a upravit své odpovědi!</p>
    <div class="row">
        <button class="primary" disabled={sending} onclick={() => sendDialog.close()} style="margin-right: auto;">Zrušit</button>
        {#if sending}
            <div class="loader"></div>
        {/if}
        <button class="danger" disabled={sending} onclick={send}>Odeslat</button>
    </div>
</dialog>