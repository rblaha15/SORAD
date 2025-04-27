<script lang="ts">
    let {
        value = $bindable(), error, type
    }: {
        value: number, error: boolean, type: 'influence' | 'sympathy'
    } = $props()

    const id = $props.id()

    const arr = Array(5).fill(0).map((_, i) => i + 1)
</script>

<div class="star-row">
    {#each arr as i}
        <label class:error class="{type} " onpointerup={() => value = i}>
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