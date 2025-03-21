<script lang="ts">
    import type {Snippet} from "svelte";

    const {children}: {
        children?: Snippet;
    } = $props();
</script>

<div class="root">
    {@render children?.()}
</div>

<style>
    * {
        font-size: 1rem;
        text-size-adjust: 100%;
        font-weight: 400;
        line-height: 1.5;
    }
</style>