<script lang="ts">
    import type {Snippet} from "svelte";

    let {
        label,
        children,
        open = false,
    }: {
        label: string,
        children: Snippet,
        open?: boolean,
    } = $props();

</script>

<details bind:open name="details">
    <summary>{label}</summary>
    {@render children()}
</details>

<style>
    details {
        border: 1px solid var(--grey-color);
        border-radius: .75rem;

        summary {
            font-weight: bold;
            padding: 1rem;
            cursor: pointer;
        }
    }

    details[open] {
        padding: 1rem;

        summary {
            border-bottom: 1px solid var(--grey-color);
            margin: -1rem -1rem 1rem;
        }
    }
</style>