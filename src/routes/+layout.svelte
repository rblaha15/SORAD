<script lang="ts">
    import type { Snippet } from "svelte";

    const { children }: {
        children?: Snippet;
    } = $props();
</script>

<div class="root">
    {@render children?.()}
</div>

<!--suppress CssUnusedSymbol -->
<style>
    .root {
        display: flex;
        flex-direction: column;
        height: 100%;
        & :global > * {
            flex-grow: 1;
        }
    }

    :root {
        --foreground-color: black;
        --background-color: white;
        --influence-color: midnightblue;
        --sympathy-color: saddlebrown;

        --blue-color: mediumblue;
        --orange-color: #B75B1AFF;
        --red-color: firebrick;
        --grey-color: dimgray;
        --green-color: #128A00FF;

        --link-color: var(--blue-color);
        --boy-color: dodgerblue;
        --girl-color: orangered;

        background-color: var(--background-color);
        color: var(--foreground-color);
    }

    :global {
        * {
            font-size: 1rem;
            text-size-adjust: 100%;
            line-height: 1.5;
            margin: 0;
        }

        a {
            color: var(--link-color);
        }

        button, .btn {
            --border-radius: .375rem;
            display: block;
            background: none;
            color: var(--btn-color);
            border: var(--btn-color) 1px solid;
            border-radius: var(--border-radius);
            font-size: 1rem;
            padding: .5rem;
            cursor: pointer;
            text-decoration: none;
            width: fit-content;
            height: fit-content;

            &:disabled {
                opacity: .65;
                pointer-events: none;
            }
        }

        .btn.toggle {
            input {
                width: 0;
                position: absolute;
            }
        }

        button, .btn {
            &:not(:disabled) {
                &:hover, &:focus-visible, &.toggle:has(> input:checked), &.toggle.checked {
                    background: var(--btn-color);
                    color: var(--background-color);
                    outline: none;
                }
            }
        }

        .btn.toggle:has(> input:not(:checked)), .btn.toggle:not(.checked) {
            background: none;
            color: var(--btn-color);
        }

        .btn-group {
            display: flex;

            & > * {
                margin-right: 0;
                /*margin-left: -1px;*/
                border-radius: 0;
                height: unset;
                align-content: center;
                text-align: center;
            }

            :first-child {
                margin-left: 0;
                border-top-left-radius: var(--border-radius);
                border-bottom-left-radius: var(--border-radius);
            }

            :last-child {
                border-top-right-radius: var(--border-radius);
                border-bottom-right-radius: var(--border-radius);
            }
        }

        .primary {
            --btn-color: var(--blue-color);
        }

        .secondary {
            --btn-color: var(--grey-color);
        }

        .neutral {
            --btn-color: var(--foreground-color);
        }

        .danger {
            --btn-color: var(--red-color);
        }

        .warning {
            --btn-color: var(--orange-color);
        }

        input {
            background: none;
            border: #3b4245 1px solid;
            border-radius: .375rem;
            color: inherit;
            font-size: 1rem;
            padding: .375rem .75rem;
        }

        input[type=checkbox] {
            cursor: pointer;
        }

        label:has(> input[type=checkbox]) {
            cursor: pointer;
        }

        .loader {
            width: 32px;
            height: 32px;
            margin: 1rem;
            border: 3px solid var(--orange-color);
            border-bottom-color: transparent;
            border-radius: 50%;
            display: inline-block;
            box-sizing: border-box;
            animation: rotation 1s linear infinite;
        }

        @keyframes rotation {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }

        hr {
            margin: 1rem 0;
            border: 0;
            border-top: 1px solid;
            opacity: .25;
        }

        h1 {
            font-size: 1.75rem;
        }

        h2 {
            font-size: 1.5rem;
        }

        h3 {
            font-size: 1.25rem;
        }

        dialog {
            border-radius: 1rem;
            padding: 1rem;
            margin: auto;

            &::backdrop {
                background-color: rgb(0 0 0 / 50%);
            }
        }

        .row {
            display: flex;
            align-items: center;
            gap: .5rem;
        }
        .column {
            display: flex;
            flex-direction: column;
            gap: .5rem;
        }
    }
</style>