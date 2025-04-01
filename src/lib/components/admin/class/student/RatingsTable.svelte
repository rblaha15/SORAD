<script lang="ts">
    import type {RatingWithStudents} from "$lib/data";
    import Table from "$lib/components/Table.svelte";

    const {ratings}: { ratings: RatingWithStudents[] } = $props()
    const bySameStudent = new Set(ratings.map(r => r.by.id)).size == 1
    const aboutSameStudent = new Set(ratings.map(r => r.about.id)).size == 1
</script>

{#snippet row(rating: RatingWithStudents)}
    {#if !bySameStudent}
        <td class="left">
            <a style:color={rating.by.is_girl ? 'orangered' : 'dodgerblue'}
               tabindex="0" href="/admin?class={rating.by.class}&student={rating.by.id}"
            >{rating.by.names} <strong>{rating.by.surname}</strong></a>
        </td>
    {/if}
    {#if !aboutSameStudent}
        <td class="left">
            <a style:color={rating.about.is_girl ? 'orangered' : 'dodgerblue'}
               tabindex="0" href="/admin?class={rating.about.class}&student={rating.about.id}"
            >{rating.about.names} <strong>{rating.about.surname}</strong></a>
        </td>
    {/if}
    <td>{rating.influence.toFixed(2).replace('.', ',')}</td>
    <td>{rating.sympathy.toFixed(2).replace('.', ',')}</td>
    <td>{rating.reasoning}</td>
{/snippet}

<Table columns={{
    b: r => r.by.surname, a: r => r.about.surname, i: 'influence', s: 'sympathy', r: 'reasoning'
}} defaultSort={bySameStudent ? { a: 'ascending' } : { b: 'ascending' }} items={ratings} {row}>
    {#snippet header(c, o)}
        {#if !bySameStudent}
            <th class="left {c.b}" onclick={o.b}>Hodnotící</th>
        {/if}
        {#if !aboutSameStudent}
            <th class="left {c.a}" onclick={o.a}>Hodnocený</th>
        {/if}
        <th class={c.i} onclick={o.i}>Vnímaný vliv</th>
        <th class={c.s} onclick={o.s}>Sympatie</th>
        <th class={c.r} onclick={o.r}>Vysvětlení sympatií</th>
    {/snippet}
</Table>