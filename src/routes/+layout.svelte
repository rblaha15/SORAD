<script lang="ts">
    import type {Snippet} from "svelte";

    const {children}: {
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

        button, a.btn {
            background: none;
            border: var(--btn-color) 1px solid;
            border-radius: 0.375rem;
            color: var(--btn-color);
            font-size: 1rem;
            padding: .5rem;
            cursor: pointer;
            text-decoration: none;
        }

        button:hover, a.btn:hover, button:focus-visible, a.btn:focus-visible {
            background: var(--btn-color);
            color: black;
            outline: none;
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