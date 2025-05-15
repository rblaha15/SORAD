<script lang="ts">
    import type { Snippet } from "svelte";

    const {
        title, content, buttons,
    }: {
        title?: Snippet, content?: Snippet, buttons?: Snippet,
    } = $props();
</script>

<div class="main-content column">
    {#if buttons || title}
        <div class="header row">
            {#if title}
                <h1>{@render title()}</h1>
            {/if}

            <div class="buttons row">
                {@render buttons?.()}
            </div>
        </div>
    {/if}
    <div class="content column">
        {@render content?.()}
    </div>
</div>

<style>
    .main-content {
        gap: 1rem;
        height: calc(100% - 2rem);
        padding: 1rem 0;
    }

    .header {
        align-items: start;
        flex-wrap: wrap;
        padding: 0 1rem;
    }

    .buttons {
        margin-left: auto;
    }

    .content {
        flex-grow: 1;
        overflow-y: scroll;
        padding: 0 1rem;
    }
</style>