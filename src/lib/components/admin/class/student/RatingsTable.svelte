<script lang="ts">
    import Table from "$lib/components/Table.svelte";
    import { averageBy } from "$lib/utils/sums";
    import { round } from "$lib/utils/arithmetics";
    import GenderChooser from "$lib/components/admin/class/GenderChooser.svelte";
    import type { Student } from "$lib/database";
    import type { RatingWithStudents } from "$lib/admin";
    import { range } from "$lib/utils/constructors";

    const {
        ratingsGot, ratingsWrote, students
    }: {
        ratingsGot: RatingWithStudents[], ratingsWrote: RatingWithStudents[], students: Student[]
    } = $props()
    const myself = $derived(ratingsWrote[0]?.by ?? ratingsGot[0].about)
    const classmates = $derived(students.filter(s => s.id != myself.id))

    let filter = $state<'all' | 'girls' | 'boys'>('all')
    const filtered = $derived(classmates.filter(s => filter == 'all' || s.is_girl == (filter == 'girls')))

    const withRatings = $derived(filtered.map(s => ({
        student: s,
        ratingGot: ratingsGot.find(r => r.by.id == s.id),
        ratingWrote: ratingsWrote.find(r => r.about.id == s.id),
    })).map(s => {
        const gw = [s.ratingGot?.sympathy, s.ratingWrote?.sympathy];
        const klass =
            gw.every(n => n == 5) ? 'same bad'
                : gw.every(n => n == 1) ? 'same good'
                    : gw.every(n => n == 4 || n == 5) ? 'similar bad'
                        : gw.every(n => n == 1 || n === 2) ? 'similar good'
                            : ''
        return { ...s, klass };
    }))

    const withAverage = $derived([{
        student: undefined, klass: '',
        ratingGot: {
            by: myself, about: myself, reasoning: '',
            influence: averageBy(withRatings.filter(s => s.ratingGot), s => s.ratingGot!.influence),
            sympathy: averageBy(withRatings.filter(s => s.ratingGot), s => s.ratingGot!.sympathy),
        } as RatingWithStudents,
        ratingWrote: {
            by: myself, about: myself, reasoning: '',
            influence: averageBy(withRatings.filter(s => s.ratingWrote), s => s.ratingWrote!.influence),
            sympathy: averageBy(withRatings.filter(s => s.ratingWrote), s => s.ratingWrote!.sympathy),
        } as RatingWithStudents,
    }, ...withRatings])

    const a = $derived(myself.is_girl ? 'a' : '')
    const stats1 = $derived([[ratingsWrote, 'Dal'], [ratingsGot, 'Dostal']] as const)
    const stats2 = $derived([['influence', 'vliv'], ['sympathy', 'sympatie']] as const)
</script>

<div class="filter">
    <GenderChooser
        bind:filter
        showBoys={students.some(s => !s.is_girl)}
        showGirls={students.some(s => s.is_girl)}
    />
</div>

<div class="table-stats">
    <Table bordersColumns defaultSort={{ s: 'ascending' }} items={withAverage} sortColumns={{
    s: s => s.student?.surname ?? '',
    gi: s => s.ratingGot?.influence, gs: s => s.ratingGot?.sympathy, gr: s => s.ratingGot?.reasoning,
    wi: s => s.ratingWrote?.influence, ws: s => s.ratingWrote?.sympathy, wr: s => s.ratingWrote?.reasoning,
}}>
        {#snippet additionalHeader()}
            <th></th>
            <th colspan="3">Hodnocení ostatními</th>
            <th colspan="3">Hodnocení ostatních</th>
        {/snippet}
        {#snippet header(c, o)}
            <th class="left {c.s}" onclick={o.s}>Žák/žákyně</th>
            <th class={c.gi} onclick={o.gi}>Vnímaný vliv</th>
            <th class={c.gs} onclick={o.gs}>Sympatie</th>
            <th class={c.gr} onclick={o.gr}>Vysvětlení sympatií</th>
            <th class={c.wi} onclick={o.wi}>Vnímaný vliv</th>
            <th class={c.ws} onclick={o.ws}>Sympatie</th>
            <th class={c.wr} onclick={o.wr}>Vysvětlení sympatií</th>
        {/snippet}

        {#snippet row(s)}
            <td class="left">
                {#if s.student === undefined}
                    <strong>Průměr</strong>
                {:else}
                    <a style:color={s.student.is_girl ? 'var(--girl-color)' : 'var(--boy-color)'} data-sveltekit-replacestate="off"
                       tabindex="0" href="/admin?class={s.student.class}&student={s.student.id}"
                    >{s.student.names} <strong>{s.student.surname}</strong></a>
                {/if}
            </td>

            <td>{s.ratingGot?.influence ? round(s.ratingGot.influence).toLocaleString('cs') : '–'}</td>
            <td class={s.klass}>{s.ratingGot?.sympathy ? round(s.ratingGot.sympathy).toLocaleString('cs') : '–'}</td>
            <td>{s.ratingGot?.reasoning ?? ''}</td>
            <td>{s.ratingWrote?.influence ? round(s.ratingWrote.influence).toLocaleString('cs') : '–'}</td>
            <td class={s.klass}>{s.ratingWrote?.sympathy ? round(s.ratingWrote.sympathy).toLocaleString('cs') : '–'}</td>
            <td>{s.ratingWrote?.reasoning ?? ''}</td>
        {/snippet}
    </Table>

    <div class="stats">
        <h3>Frekvence hodnocení</h3>
        {#each stats1 as [ratings, t1]}
            {#each stats2 as [index, t2]}
                <h5>{t1}{a} {t2}:</h5>
                <ul>
                    {#each range(1, 6) as v}
                        <li>{v} – {ratings.filter(r => r[index] === v).length}x</li>
                    {/each}
                </ul>
            {/each}
        {/each}
    </div>
</div>

<style>
    .filter {
        margin-bottom: 1rem;
    }

    .similar.bad {
        background: color-mix(in srgb, DarkRed, black);
    }

    .similar.good {
        background: color-mix(in srgb, DarkGreen, black);
    }

    .same {
        color: black
    }

    .same.bad {
        background: OrangeRed;
    }

    .same.good {
        background: YellowGreen;
    }


    .table-stats {
        display: flex;
        flex-wrap: wrap;
        align-items: start;

        gap: 1rem;

        h5 {
            margin: 0;
        }
    }
</style>