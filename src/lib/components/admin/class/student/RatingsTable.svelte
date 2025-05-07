<script lang="ts">
    import { type RatingWithStudents } from "$lib/admin";
    import Table from "$lib/components/Table.svelte";
    import { averageBy } from "$lib/utils/sums";
    import { round } from "$lib/utils/arithmetics";
    import GenderChooser from "$lib/components/admin/class/GenderChooser.svelte";

    const { ratings, mode }: { ratings: RatingWithStudents[], mode: 'by' | 'about' } = $props()
    const myself = $derived(mode == 'about' ? ratings[0].by : ratings[0].about)

    let filter = $state<'all' | 'girls' | 'boys'>('all')
    const filtered = $derived(filter == 'all' ? ratings : ratings.filter(s => s[mode].is_girl == (filter == 'girls')))
    const withAverage: RatingWithStudents[] = $derived([
        {
            influence: averageBy(filtered, r => r.influence)!,
            sympathy: averageBy(filtered, r => r.sympathy)!,
            reasoning: '',
            by: { ...myself, surname: '' },
            about: { ...myself, surname: '' },
        },
        ...filtered
    ])
</script>

<GenderChooser
    bind:filter
    showBoys={ratings.some(s => !s[mode].is_girl)}
    showGirls={ratings.some(s => s[mode].is_girl)}
/>

<Table bordersColumns sortColumns={{
    b: r => r.by.surname, a: r => r.about.surname,
    i: r => r.influence, s: r => r.sympathy, r: r => r.reasoning,
}} defaultSort={mode === 'about' ? { a: 'ascending' } : { b: 'ascending' }} items={withAverage}>
    {#snippet header(c, o)}
        {#if mode === 'by'}
            <th class="left {c.b}" onclick={o.b}>Hodnotící</th>
        {/if}
        {#if mode === 'about'}
            <th class="left {c.a}" onclick={o.a}>Hodnocený</th>
        {/if}
        <th class={c.i} onclick={o.i}>Vnímaný vliv</th>
        <th class={c.s} onclick={o.s}>Sympatie</th>
        <th class={c.r} onclick={o.r}>Vysvětlení sympatií</th>
    {/snippet}

    {#snippet row(rating)}
        <td class="left">
            {#if mode === 'by' && rating.by.surname}
                <a style:color={rating.by.is_girl ? 'var(--girl-color)' : 'var(--boy-color)'} data-sveltekit-replacestate="off"
                   tabindex="0" href="/admin?class={rating.by.class}&student={rating.by.id}"
                >{rating.by.names} <strong>{rating.by.surname}</strong></a>
            {:else if mode === 'about' && rating.about.surname}
                <a style:color={rating.about.is_girl ? 'var(--girl-color)' : 'var(--boy-color)'} data-sveltekit-replacestate="off"
                   tabindex="0" href="/admin?class={rating.about.class}&student={rating.about.id}"
                >{rating.about.names} <strong>{rating.about.surname}</strong></a>
            {:else}
                <strong>Průměr</strong>
            {/if}
        </td>
        <td>{round(rating.influence).toLocaleString('cs')}</td>
        <td>{round(rating.sympathy).toLocaleString('cs')}</td>
        <td>{rating.reasoning}</td>
    {/snippet}
</Table>