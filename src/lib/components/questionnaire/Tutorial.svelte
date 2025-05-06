<script lang='ts'>

    const {
        isGirl, grade, justOverview = false, phase,
    }: {
        isGirl: boolean, grade: number, justOverview?: boolean, phase: Phase,
    } = $props()

    const i = grade > 4 ? 'te' : 'i'
    const i2 = grade > 4 ? 'i' : ''
    const te = grade > 4 ? 'te' : 'š'
    const ete = grade > 4 ? 'ete' : 'i'
    const te2 = grade > 4 ? 'te' : ''
    const your = grade > 4 ? 'vašich' : 'tvých'
    const you = grade > 4 ? 'vám' : 'ti'
    const you2 = grade > 4 ? 'vás' : 'tebe'
    const classmates = isGirl ? 'spolužačkek (a spolužáků)' : 'spolužáků (a spolužaček)'
    const a = isGirl ? 'a' : ''
    const aa = isGirl ? 'á' : ''
    const ya = isGirl ? 'á' : 'ý'
    const ten = isGirl ? 'ta' : 'ten'
    const or = (a: string, b: string) => isGirl ? `${b}/${a}` : `${a}/${b}`

    const labels = $derived(phase === 'influence' ? [
        `Nejvlivnější ${or('žák', 'žákyně')} třídy`,
        'Patří mezi několik nejvlivnějších',
        'Má průměrný vliv jako většina žáků a žákyň',
        'Má slabý vliv',
        'Nemá žádný nebo téměř žádný vliv',
    ] : [
        `Je mi velmi sympatick${or('ý', 'á')}`,
        `Je mi sympatick${or('ý', 'á')}`,
        `Není mi ani sympatick${or('ý', 'á')}, ani nesympatick${or('ý', 'á')}`,
        `Je mi spíše nesympatick${or('ý', 'á')}`,
        `Je mi nesympatick${or('ý', 'á')}`,
    ])
</script>

<div>
    {#if justOverview || phase !== 'sympathy-reasoning'}
        <div class="scale {phase.replace('-', ' ')}">
            {#each labels as label, i}
                <div><span class="number">{i + 1}</span><span>{label}</span></div>
            {/each}
        </div>
        <hr />
    {/if}

    {#if !justOverview}
        {#if phase === "influence"}
            <p class="info I"><span class="icon">»</span>
                Nyní u {your} {classmates} vybere{te} číslo (ze stupnice výše), které ozanačuje, jak velký vliv mají na ostatní.
            </p>
            <p class="info I"><span class="icon">!</span>
                Hodnoť{te2} podle vlastního nezávislého mínění, které je nejhodnotnější. Vzájemné domlouvání zkresluje výsledky.
            </p>
            {#if grade <= 4}
                <p class="info I"><span class="icon">?</span>
                    Vliv žáka se pozná podle toho, do jaké míry se ostatní řídí jeho názory. Nehodnotíš, jestli je vliv dobrý, nebo špatný, jen sílu vlivu.
                </p>
            {/if}
            <p class="info I"><span class="icon">!</span>
                Pracuj{te2} rychle, bez dlouhého rozmýšlení, první názor bývá nejlepší. Jestliže si nejs{i} u někoho jist{ya}, srovnej{te2} je s těmi žáky, které
                zná{te} lépe. Nedívej{te2} se k sousedovi – když bude{te} chtít, může{te} si promluvit o přestávce o tom, co jste napsali. S hodnocením bude{te}
                hotov{ya} asi za pět minut.
            </p>
        {:else if phase === "sympathy"}
            <p class="info S"><span class="icon">»</span>
                Nyní u {your} {classmates} vybere{te} číslo (ze stupnice výše), které ozanačuje, jak moc jsou {you} sympatičtí nebo nesympatičtí.
            </p>
            <p class="info S"><span class="icon">?</span>
                Sympatick{ya} je {you} {ten}, kdo je {you} příjemn{ya}, komu rád{a} pomůže{te}, s kým rád{a} tráví{te} čas, s kým se rád{a} baví{te} (ne nutně často).
            </p>
            <p class="info S"><span class="icon">!</span>
                Sympatie jsou individuální, každý má rád trochu jiné lidi, takže domlouvání nemá smysl!
            </p>
        {:else if phase === "sympathy-reasoning"}
            <p class="info S"><span class="icon">»</span>
                Nyní se zamysl{ete} nad tím, proč je {you} kdo sympatický a nesympatický a napiš{te2} to krátkou větou do políčka vedle hodnocení.
            </p>
            <p class="info S"><span class="icon">+</span>
                Má{te} příležitost ukázat, jak dovede{te} přemýšlet o lidech a o svých vztazích k nim.
            </p>
            <p class="info S"><span class="icon">!</span>
                Postupuj{te2} v pořadí, jak se {you} jména objeví na následující obrazovce. Nevadí, jestliže nestihne{te} odůvodnit všechny, ale snaž{te2} se
                projít co nejvíce jmen!
            </p>
        {/if}

        <p>Všechny odpovědi se průběžně ukládají do prohlížeče, takže o ně nepřijde{te}, pokud např. ztratí{te} připojení k internetu.</p>
    {/if}
</div>

<style>
    .scale {
        div {
            display: flex;
            align-items: center;

            span.number {
                font-size: 2rem;
                font-family: monospace;
                min-width: 2rem;
                margin: -.3rem .5rem -.25rem 0;
            }
        }
    }

    .info {
        display: flex;
        align-items: center;

        span.icon {
            font-size: 2rem;
            font-family: monospace;
            min-width: 2rem;
            margin: auto 0;
        }
    }

    .influence, .I {
        color: var(--influence-color);
    }

    .sympathy, .S {
        color: var(--sympathy-color);
    }
</style>