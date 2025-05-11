<script lang="ts">
    import type { Snippet } from "svelte";

    const {
        title,
        content,
        buttons,
    }: {
        title?: Snippet,
        content?: Snippet,
        buttons?: Snippet,
    } = $props();
</script>

<div class="main-content">
    {#if buttons || title}
        <div class="row header">
            {#if title}
                <h1 class="title">{@render title?.()}</h1>
            {/if}

            {@render buttons?.()}
        </div>
    {/if}
    <div class="content column">
        {@render content?.()}
    </div>
</div>

<style>
    .main-content {
        display: flex;
        flex-direction: column;
        padding: 1rem 0;
        gap: 1rem;

        .header, .content {
            padding: 0 1rem;
        }

        .header {
            align-items: start;
        }

        .title {
            margin-right: auto;
        }

        .content {
            flex-grow: 1;
            overflow-y: scroll;
        }
    }
</style>