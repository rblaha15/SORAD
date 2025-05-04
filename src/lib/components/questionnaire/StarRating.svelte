<script lang="ts">


    import { range } from "$lib/utils/constructors";

    let {
        value = $bindable(), error, type, readonly = false,
    }: {
        value: number, error: boolean, type: 'influence' | 'sympathy', readonly?: boolean,
    } = $props()

    const id = $props.id()

    const arr = range(1, 6)
</script>

<div class="star-row">
    {#each arr as i}
        <label class:error class={type}>
            <input type="radio" value={i} name="star-rating-{id}" bind:group={value} {readonly}>
            {i}
        </label>
    {/each}
</div>

<style>
    .star-row {
        display: flex;
        margin: -.25rem 0;

        input {
            width: 0;
            position: absolute;
        }

        label {
            text-decoration: none;
            font-size: 2rem;
            color: white;
            cursor: pointer;
            user-select: none;
            font-family: monospace;
            min-width: 2rem;
            text-align: center;

            &:read-only {
                pointer-events: none;
            }

            &.influence {
                color: var(--influence-color);
            }

            &.sympathy {
                color: var(--sympathy-color);
            }

            &.error {
                color: var(--red-color);
            }

            &:has(> input:focus-visible) {
                color: darkgreen !important;
            }
        }

        &:not(:hover) label:has(input:checked),
        & label:has(input:checked:read-only),
        & label:has(input:hover:not(:read-only)) {
            color: gold;
        }
    }
</style>