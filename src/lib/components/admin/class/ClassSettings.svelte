<script lang="ts">
    import database from "$lib/database/supabase.js";
    import type { EventHandler } from "svelte/elements";
    import PrintCodes from "$lib/components/admin/class/PrintCodes.svelte";
    import { printComponent } from "$lib/print.js";
    import { type RatingWithStudents } from "$lib/admin.js";
    import type { Class, Rating, Student } from "$lib/database";

    import { sortedBy } from "$lib/utils/comparisons";
    import { goto } from "$app/navigation";

    const {
        refresh, classId, klass, students, ratings,
    }: {
        refresh: () => Promise<void>, classId: number, klass: Class, students: Student[], ratings: RatingWithStudents[]
    } = $props()

    let name = $state() as string
    let grade = $state() as number
    let enabled = $state() as boolean

    $effect(() => {
        name = klass.name
        grade = klass.grade
        enabled = klass.enabled
    })

    let changing = $state(false);
    let changed = $state(false);
    const confirm: EventHandler<SubmitEvent, HTMLFormElement> = async e => {
        changing = true;
        e.preventDefault();
        await database.admin.setClass({ id: classId, name, grade: grade ?? klass.grade, enabled });
        await refresh();
        changing = false;
        changed = true;
        setTimeout(() => changed = false, 5000);
    }

    let deleting = $state(false);
    const deleteClass = async () => {
        deleting = true;
        await database.admin.deleteStudentAccountsAndPasswords(students)
        await database.admin.removeRatings(students.map(s => s.id))
        await database.admin.removeStudents(students.map(s => s.id))
        await database.admin.deleteClass(classId)
        await goto('/admin', { replaceState: false })
    }

    const print = async () => {
        const passwords = await database.admin.getStudentPasswords(students.map(s => s.email))
        const codes = sortedBy(students, s => s.surname).map(s => ({ ...s, password: passwords[s.email]! }));

        printComponent(PrintCodes, { codes })
    }

    let deleteDialog = $state() as HTMLDialogElement;
</script>

<form class="settings" onsubmit={confirm}>
    <div class="row">
        <label>
            Název třídy:
            <input bind:value={name} type="text" />
        </label>
    </div>
    <div class="row">
        <label>
            Ročník:
            <input bind:value={grade} type="number" min="1" max="8" />
        </label>
        <p>1&nbsp;až&nbsp;8 – u čtyřletých tříd 5&nbsp;až&nbsp;8</p>
    </div>
    <label class="row">
        <input bind:checked={enabled} type="checkbox" />
        Povolit přijímání odpovědí od studentů
    </label>
    <div class="row">
        <button class="danger" type="submit">Uložit</button>
        {#if changing}
            <div class="loader"></div>
        {/if}
        {#if changed}
            <p class="text-icon">&checkmark;</p>
        {/if}
    </div>
</form>
<hr />
{#if students.length}
    <button onclick={print} class="primary">Vytisknout jednorázové kódy pro přihlášení</button>
{/if}
<a class="btn primary" href="/admin?class={classId}&import" data-sveltekit-replacestate>Importovat seznam žáků</a>
<button onclick={() => deleteDialog.showModal()} class="warning">Odstranit třídu</button>
<dialog bind:this={deleteDialog} closedby={deleting ? 'none' : 'any'} onclose={() => deleting && deleteDialog.showModal()}>
    <h2>Odstranit třídu</h2>
    <p>Opravdu chcete odstranit třídu {klass.name}?</p>
    <p>Odstraníte všechny žáky v této třídě! ({students.length})</p>
    <p>Žáci se nebudou moci přihlásit a vyplnit dotazník!</p>
    <p>Odstraníte všechna hodnocení od všech žáků v této třídě! ({ratings.length})</p>
    <p><strong>Tato akce je nevratná!</strong></p>
    <div class="row">
        <button disabled={deleting} class="primary" onclick={() => deleteDialog.close()} style="margin-right: auto;">Zrušit</button>
        {#if deleting}
            <div class="loader"></div>
        {/if}
        <button disabled={deleting} class="danger" onclick={deleteClass}>Odstranit</button>
    </div>
</dialog>

<style>
    button {
        margin: .375rem 0;
    }

    form.settings {
        label {
            display: contents;

            input {
                margin: .75rem;

                &:not([type=checkbox]) {
                    width: 30px;
                }
            }
        }
    }

    dialog {
        button {
            margin: .375rem;

            &:first-child {
                margin-left: 0;
            }

            &:last-child {
                margin-right: 0;
            }
        }
    }

    .text-icon {
        margin: 0 .5rem;
        font-size: 2rem;
        color: var(--green-color);
    }
</style>