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
    }

    :root {
        --influence-color: lightcyan;
        --sympathy-color: papayawhip;

        --blue-color: dodgerblue;
        --orange-color: orangered;
        --red-color: red;
        --grey-color: grey;
        --white-color: white;

        --link-color: var(--blue-color);
        --boy-color: var(--blue-color);
        --girl-color: var(--orange-color);
    }

    :global {
        * {
            font-size: 1rem;
            text-size-adjust: 100%;
            line-height: 1.5;
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
        }

        .btn.toggle {
            input {
                width: 0;
                position: absolute;
            }
        }

        button:hover, .btn:hover, button:focus-visible, .btn:focus-visible, .btn.toggle:has(> input:checked), .btn.toggle.checked {
            background: var(--btn-color);
            color: black;
            outline: none;
        }

        .btn.toggle:has(> input:not(:checked)), .btn.toggle:not(.checked) {
            background: none;
            color: var(--btn-color);
        }

        .btn-group {
            display: flex;

            & > * {
                margin-right: 0;
                margin-left: -1px;
                border-radius: 0;
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

        .blue {
            --btn-color: var(--blue-color);
        }

        .grey {
            --btn-color: var(--grey-color);
        }

        .white {
            --btn-color: var(--white-color);
        }

        .red {
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
    }
</style>