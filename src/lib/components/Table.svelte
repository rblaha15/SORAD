<script lang="ts" generics="T">
    import type {Snippet} from "svelte";

    const { items, header, row }: {
        items: T[],
        header: Snippet,
        row: Snippet<[item: T]>,
    } = $props()
</script>

<div class="table-wrapper">
    <table>
        <thead>
        <tr>
            {@render header()}
        </tr>
        </thead>
        <tbody>
        {#each items as item}
            <tr>
                {@render row(item)}
            </tr>
        {/each}
        </tbody>
    </table>
</div>

<style>
    .table-wrapper {
        overflow-x: auto;

        table {
            width: fit-content;
            border-spacing: .375rem;

            tr {
                :global {
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
        }
    }
</style>