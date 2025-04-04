<script lang="ts">
    import StarRating from "./StarRating.svelte";

    const {
        isGirl, grade, justOverview = false
    }: {
        isGirl: boolean, grade: number, justOverview?: boolean
    } = $props()

    const a = isGirl ? 'a' : ''
    const i = grade > 4 ? 'te' : 'i'
    const te = grade > 4 ? 'te' : 'š'
    const ete = grade > 4 ? 'ete' : 'i'
</script>

<!--suppress JSUnresolvedReference -->
<div>
    {#snippet tutorialRating(min: string, max: string, type: 'influence' | 'sympathy')}
        <div class="tutorial-rating">
            <div class="star-labels {type}">
                <span>{@html min}</span>
                <span>{@html max}</span>
            </div>
            <div class="tutorial-stars">
                <StarRating error={false} value={4} {type} />
            </div>
            <span class="width-helper">&starf;&starf;&starf;&starf;&starf;&starf;&starf;&starf;</span>
        </div>
    {/snippet}

    {#if justOverview}
        <div class="overview-row">
            {@render tutorialRating(
                'Malý až<br />žádný vliv',
                'Největší<br />vliv',
                'influence',
            )}
            {@render tutorialRating(
                'Úplně<br/>nesympatický',
                'Nejvíce<br/>sympatický',
                'sympathy',
            )}
        </div>
        <hr />
    {:else}
        <p>Každého spolužáka (a sebe) ohodnotí{te} tím, že si zodpoví{te} na následující dvě otázky a přidělí{te} jim
            hodnotu 1-5:</p>
        <p class="influence"><strong>1. Kdo má ve třídě na ostatní jaký vliv? (Jak moc na ně druzí dají)</strong></p>
        {@render tutorialRating(
            'Malý až<br />žádný vliv',
            'Největší<br />vliv',
            'influence',
        )}
        <p class="sympathy"><strong>2. Kdo je mi ze třídy sympatický nebo nesympatický? (Jak rád{a} se s nimi vídám)</strong></p>
        {@render tutorialRating(
            'Úplně<br/>nesympatický',
            'Nejvíce<br/>sympatický',
            'sympathy',
        )}
        <p class="sympathy">Poté prosím vysvětl{ete}, proč js{i} u druhé otázky zvolil{a} právě tuto odpověď (obzvlášť, pokud js{i}
            zaškrtl{a} 1 nebo 5)</p>
        <br/>
        <p>Všechny odpovědi se průběžně ukládají do prohlížeče, takže o ně nepřijde{te}, pokud např. ztratí{te}
            připojení k internetu.</p>
    {/if}
</div>

<style>
    .overview-row {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }
    .tutorial-rating {
        width: max-content;

        .star-labels {
            display: grid;
            grid-template-columns: 1fr 1fr;
            text-align: center;
        }

        .tutorial-stars {
            justify-self: center;
        }

        .width-helper {
            display: block;
            font-size: 2rem;
            visibility: hidden;
            height: 0;
        }
    }

    .influence {
        color: var(--influence-color);
    }
    .sympathy {
        color: var(--sympathy-color);
    }
</style>