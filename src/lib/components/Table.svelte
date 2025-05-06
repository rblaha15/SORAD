<script lang="ts" module>
    import type { Comparable } from "$lib/utils/comparisons";

    export type OnlyComparableFields<T> = {
        [K in keyof T]: T[K] extends Comparable ? K : never
    }[keyof T];
    export type SortKey<T> = ((i: T) => Comparable) | OnlyComparableFields<T>;
</script>

<script generics="T, Column extends string" lang="ts">
    import type { Snippet } from "svelte";
    import TopScrollable from "$lib/components/TopScrollable.svelte";
    import { sortedBy, sortedByDescending } from "$lib/utils/comparisons";

    const { items, header, row, columns, defaultSort, bordersColumns = false, bordersRows = false }: {
        items: T[],
        header: Snippet<[
            classes: {
                [C in Column]: string;
            },
            onClicks: {
                [C in Column]: () => void;
            },
        ]>,
        row: Snippet<[item: T, index: number]>,
        columns?: {
            [C in Column]: SortKey<T>;
        },
        defaultSort?: {
            [C in Column]?: 'ascending' | 'descending';
        },
        bordersColumns?: boolean,
        bordersRows?: boolean,
    } = $props()

    let sort = $state<Column | null>(null)
    let asc = $state<boolean>(defaultSort ? Object.values(defaultSort).at(0) as boolean ?? false : false)
    $effect(() => {
        if (sort) asc = true
    })
    $effect(() => {
        if (defaultSort)
            sort = Object.keys(defaultSort).at(0) as Column ?? sort
    })

    const sorted = $derived.by(() => {
        [sort, columns, asc, items];
        if (sort == null || columns == undefined) return items
        const sortKey: SortKey<T> = columns[sort]
        const sortFn = asc ? sortedBy : sortedByDescending;
        const compareFn = typeof sortKey == 'function' ? sortKey : (i: T) => i[sortKey] as Comparable;
        return sortFn(items, compareFn)
    })

    const mapCols = <T>(callback: (c: Column) => T) => (columns == undefined ? undefined : Object.fromEntries(
        Object.keys(columns).map(c => [c, callback(c as Column)])
    )) as { [C in Column]: T; }
</script>
<TopScrollable>
    <table class:bordersColumns class:bordersRows class:sortable={columns !== undefined && defaultSort !== undefined}>
        <thead>
        <tr>
            {@render header(
                mapCols(c => sort === c ? asc ? 'sort-asc' : 'sort-desc' : ''),
                mapCols(c => () => sort !== c ? sort = c : asc = !asc),
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
        border: 1px solid white;

        tr :global {
            td, th {
                text-align: center;

                &.left {
                    text-align: left;
                }
            }

            td {
                white-space: nowrap;
            }
        }
    }

    :global th {
        border: 1px solid white;
        padding: .375rem;
    }

    table.bordersColumns tr :global {
        td {
            border-left: 1px solid white;
            border-right: 1px solid white;
            padding-left: .375rem;
            padding-right: .375rem;
        }

        &:first-child td {
            padding-top: .375rem;
        }

        &:last-child td {
            padding-bottom: .375rem;
        }
    }

    table.bordersRows tr :global {
        td {
            border-top: 1px solid white;
            border-bottom: 1px solid white;
            padding-top: .375rem;
            padding-bottom: .375rem;

            &:first-child {
                padding-left: .375rem;
            }

            &:last-child {
                padding-right: .375rem;
            }
        }
    }

    .sortable {
        :global th {
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
    }
</style>