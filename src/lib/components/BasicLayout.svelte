<script lang="ts">
    import type {Snippet} from "svelte";
    import database from "$lib/database/supabase";

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

{#if title}
    <h1 class="title">{@render title()}</h1>
{/if}
{#if buttons}
    <div class="button-row">
        {@render buttons()}
    </div>
{/if}
{#if content}
    <div class="content">
        {@render content()}
    </div>
{/if}

<style>
    .title {
        text-align: center;
        margin: 0;
        padding: 1rem 1rem 0;
    }

    .content {
        flex-grow: 1;
        padding: 1rem 1rem;
        overflow-y: auto;
    }

    .button-row {
        display: flex;
        background: black;
        padding: 1rem 1rem 0;

        :global {
            button, a.btn {
                margin-left: .5rem;

                &:first-child {
                    margin-left: 0;
                }
            }
        }
    }
</style>