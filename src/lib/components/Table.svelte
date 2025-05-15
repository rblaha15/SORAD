<script generics="T, Columns extends string[]" lang="ts">
    import type { Snippet } from "svelte";
    import TopScrollable from "$lib/components/TopScrollable.svelte";
    import { type Comparable, sortedBy, sortedByDescending } from "$lib/utils/comparisons";

    type Column = Columns[number];

    const { items, header, row, sort, additionalHeader }: {
        items: T[],
        header: Snippet<[
            classes: { // For sorting: adds the sortCol arrow
                [C in Column]?: 'sort-asc' | 'sort-desc' | '';
            },
            onClicks: { // For sorting: sets the sortCol column
                [C in Column]?: () => void;
            },
        ]>,
        additionalHeader?: Snippet,
        row: Snippet<[item: T, index: number]>,
        sort?: {
            disabled?: boolean,
            columns: {
                [C in Column]: (item: T) => Comparable;
            },
            defaultColumn: Column,
            defaultDirection?: 'ascending' | 'descending',
        },
    } = $props()

    let sortCol = $state<Column | undefined>(sort?.defaultColumn)
    let asc = $state(sort?.defaultDirection != 'descending')
    $effect(() => {
        if (sortCol) asc = true
    })

    const sorted = $derived.by(() => {
        [sortCol, asc, sort, items];
        if (!sort || sort.disabled) return items
        const sortFn = asc ? sortedBy : sortedByDescending;
        const compareFn = sort.columns[sortCol!]
        return sortFn(items, compareFn)
    })

    const columns = $derived(sort ? Object.keys(sort.columns) : undefined);
    const mapCols = <U>(callback: (c: Column) => U) =>
        !sort ? {} : Object.fromEntries(columns!.map(c => [c, callback(c as Column)]))  as { [C in Column]?: U; }
</script>

<TopScrollable>
    <table class={{sortable: sort && !sort.disabled }}>
        <thead>
        <tr>
            {@render additionalHeader?.()}
        </tr>
        <tr>
            {@render header(
                /* header class */ mapCols(c => sortCol === c ? asc ? 'sort-asc' : 'sort-desc' : ''),
                /* header onclick */ mapCols(c => () => sortCol !== c ? sortCol = c : asc = !asc),
            )}
        </tr>
        </thead>
        <tbody>
        {#each sorted as item, index}
            <tr>
                {@render row(item, index)}
            </tr>
        {/each}
        </tbody>
    </table>
</TopScrollable>

<style>
    table {
        width: fit-content;
        border-spacing: .375rem;
        border-collapse: collapse;
        border: 1px solid black;
        margin-top: 1px;

        tbody tr:nth-child(even) {
            background: gainsboro;
        }

        tr :global {
            td, th {
                text-align: center;
                border: 1px solid black;
            }

            th {
                padding: .300rem;
            }

            td {
                white-space: nowrap;
                padding: .150rem;
            }
        }
    }

    table.sortable thead tr:last-child :global th {
        cursor: pointer;

        &::after {
            font-size: inherit;
            margin-left: 0.375rem;
            color: inherit;
        }

        &.sort-asc::after {
            content: '\025BE';
        }

        &.sort-desc::after {
            content: '\025B4';
        }
    }
</style>