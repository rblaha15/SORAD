<script lang="ts">
    import { newArray, range } from "$lib/data.js";

    let {
        value = $bindable(), error, type
    }: {
        value: number, error: boolean, type: 'influence' | 'sympathy'
    } = $props()

    const id = $props.id()

    const arr = range(1, 6)
</script>

<div class="star-row">
    {#each arr as i}
        <label class:error class={type} onpointerup={() => value = i}>
            <input type="radio" value={i} name="star-rating-{id}" bind:group={value}>
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
        & label:has(input:hover) {
            color: gold;
        }
    }
</style>