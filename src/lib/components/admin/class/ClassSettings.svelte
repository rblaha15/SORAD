<script lang="ts">
    import database from "$lib/database/supabase.js";
    import type { EventHandler } from "svelte/elements";
    import PrintCodes from "$lib/components/admin/class/PrintCodes.svelte";
    import { printComponent } from "$lib/print.js";
    import { type RatingWithStudents } from "$lib/admin.js";
    import type { Class, Student } from "$lib/database";
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

<form class="settings column" onsubmit={confirm}>
    <div class="row">
        <label>
            Název třídy:
            <input bind:value={name} required type="text" />
        </label>
    </div>
    <div class="row">
        <label>
            Ročník:
            <input max="8" min="1" oninput={e => grade = Number(e.currentTarget.value) ?? -1} type="number" value={grade === -1 ? '' : grade} />
        </label>
        <p>1&nbsp;až&nbsp;8 – u čtyřletých tříd 5&nbsp;až&nbsp;8</p>
    </div>
    <label class="row">
        <input bind:checked={enabled} type="checkbox" />
        Povolit přijímání odpovědí od žáků
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
<div class="column">
    {#if students.length}
        <button onclick={print} class="primary">Vytisknout jednorázové kódy pro přihlášení</button>
    {/if}
    {#if klass.grade !== -1}
        <a class="btn primary" href="/admin?class={classId}&import" data-sveltekit-replacestate="off">Importovat seznam žáků</a>
    {/if}
    <button class="warning" onclick={() => deleteDialog.showModal()}>Odstranit třídu</button>
</div>
<dialog bind:this={deleteDialog} closedby={deleting ? 'none' : 'any'} onclose={() => deleting && deleteDialog.showModal()}>
    <div class="column">
        <h2>Odstranit třídu</h2>
        <p>Opravdu chcete odstranit třídu {klass.name ? klass.name : 'bez názvu'}?</p>
        {#if students.length}
            <p>Odstraníte všechny žáky v této třídě! ({students.length})</p>
            <p>Žáci se nebudou moci přihlásit a vyplnit dotazník!</p>
        {/if}
        {#if ratings.length}
            <p>Odstraníte všechna hodnocení od všech žáků v této třídě! ({ratings.length})</p>
        {/if}
        <p><strong>Tato akce je nevratná!</strong></p>
        <div class="row">
            <button class="primary" disabled={deleting} onclick={() => deleteDialog.close()} style="margin-right: auto;">Zrušit</button>
            {#if deleting}
                <div class="loader"></div>
            {/if}
            <button class="danger" disabled={deleting} onclick={deleteClass}>Odstranit</button>
        </div>
    </div>
</dialog>

<style>
    form.settings {
        label {
            input:not([type=checkbox]) {
                width: 30px;
            }
        }
    }

    .text-icon {
        font-size: 2rem;
        color: var(--green-color);
    }
</style>