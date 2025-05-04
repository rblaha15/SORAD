<script lang="ts">
    import database from "$lib/database/supabase";
    import type { Class, Student } from "$lib/database";
    import readXlsxFile from "read-excel-file";
    import Table from "$lib/components/Table.svelte";
    import { onMount } from "svelte";
    import BasicLayout from "$lib/components/BasicLayout.svelte";
    import { sortedBy } from "$lib/utils/comparisons";
    import seedrandom from "seedrandom";
    import { newString } from "$lib/utils/constructors";
    import { randomChar } from "$lib/utils/random";

    const studentPassword = (student: Omit<Student, 'id'>) => {
        const classRandom = seedrandom(student.class.toString())
        const studentRandom = seedrandom(student.email);
        return newString(6, i => randomChar(i < 2 ? classRandom : studentRandom));
    }

    export const generatePasswords = (students: Omit<Student, 'id'>[]) => Object.fromEntries(
        students.map(s => [s.email, studentPassword(s)] as [string, string])
    )

    const { classId }: { classId: number } = $props()

    type NewStudent = Omit<Student, 'class' | 'id'>;

    let fileInput = $state() as HTMLInputElement;
    let file = $state<File>();

    let klass = $state() as Class;
    let oldStudents = $state<Student[]>([]);
    let newStudents = $state<NewStudent[]>([]);

    const refresh = async () => {
        const _klass = await database.getMyClass(classId)
        const _students = await database.getStudentsOfClass(classId)

        klass = _klass
        oldStudents = sortedBy(_students, s => s.student_number)
        newStudents = [...oldStudents]
    }
    onMount(refresh)

    $effect(() => {
        if (!file) return;
        readXlsxFile(file).then(rows => {
            console.log(rows);
            newStudents = rows.slice(1).map(
                ([n, names, surname, email, g]) => ({ student_number: Number(n), names, surname, email, is_girl: g == 'Ano' }) as NewStudent
            )
        })
    })

    const keys = ['email', 'student_number', 'names', 'surname', 'is_girl'] as const;
    const same = (s1: Student, s2: NewStudent) => keys.every(k => s1[k] == s2[k]);
    const oldEmails = $derived(oldStudents.map(s => s.email));
    const newEmails = $derived(newStudents.map(s => s.email));

    const stayed = $derived(newStudents.filter(s => oldEmails.includes(s.email)));
    const removed = $derived(oldStudents.filter(p => !newEmails.includes(p.email)));
    const added = $derived(newStudents.filter(p => !oldEmails.includes(p.email)));

    const changed = $derived(stayed.filter(s => !same(oldStudents.find(o => o.email === s.email)!, s)));
    const unchanged = $derived(stayed.filter(s => same(oldStudents.find(o => o.email === s.email)!, s)));

    const allChanges = $derived([
        ...added.map(s => [s, 'var(--green-color)'] as const),
        ...removed.map(s => [s, 'var(--red-color)'] as const),
        ...changed.map(s => [s, 'var(--orange-color)'] as const),
        ...unchanged.map(s => [s, 'var(--white-color)'] as const),
    ]);

    let importing = $state(false);
    const importStudents = async () => {
        importing = true;
        console.log(oldStudents, newStudents)
        console.log(added, removed, changed, unchanged)
        const toRemove = removed.map(s => s.id)
        if (toRemove.length) await database.admin.removeRatings(toRemove)
        if (toRemove.length) await database.admin.removeStudents(toRemove)
        if (removed.length) await database.admin.deleteStudentAccountsAndPasswords(removed)

        const toAdd = added.map(s => ({ ...s, class: classId }))
        const toChange = changed.map(s => ({ ...s, class: classId }))
        if (toAdd.length || toChange.length) await database.admin.setStudents([...toAdd, ...toChange])
        if (toAdd.length) await database.admin.createStudentAccountsAndSavePasswords(generatePasswords(toAdd))

        window.history.back()
    }
</script>

{#snippet title()}
    Administrace: třída {klass.name}<br />Importovat žáky
{/snippet}
{#snippet content()}
    <input accept=".xls,.xlsx,.xlsm,.xlsb" bind:this={fileInput} onchange={() => file = fileInput?.files?.[0]} type="file">
    {#if file}
        <p>Vybraný soubor: {file.name}</p>
    {/if}
    <button class="btn primary file" onclick={() => {fileInput.value = ''; file = undefined; fileInput?.click()}}>
        {!file ? 'Vybrat soubor' : 'Vybrat jiný soubor'}
    </button>
    {#if added.length || removed.length || changed.length}
        <p>Náhled změn:</p>
        <p>Zeleně zbarvení jsou nově přidaní žáci, červeně jsou odstranění žáci a oranžově jsou upravení žáci.</p>
        {#if removed.length}
            <p>Po odstranění žáka se nebude moci přihlásit a vyplnit dotazník!</p>
            <p>Odstraněním žáka odstraníte i všechna hodnocení, které vyplnil i všechna hodnocení, které někdo vyplnil o něm!</p>
            <p><strong>Tato akce je nevratná!</strong></p>
        {/if}
    {:else if file}
        <p>Soubor neobsahuje žádné změny.</p>
    {:else if allChanges.length}
        <p>Aktuální seznam žáků:</p>
    {/if}
    {#if allChanges.length}
        <Table items={allChanges} borders>
            {#snippet header()}
                <th class="left">Pořadí v třídní knize</th>
                <th class="left">Jméno</th>
                <th class="left">Příjmení</th>
                <th class="left">Email</th>
                <th class="left">Dívka</th>
            {/snippet}
            {#snippet row([student, color])}
                <td class="left" style:color>{student.student_number}</td>
                <td class="left" style:color>{student.names}</td>
                <td class="left" style:color>{student.surname}</td>
                <td class="left" style:color>{student.email}</td>
                <td class="left" style:color>{student.is_girl ? 'Ano' : 'Ne'}</td>
            {/snippet}
        </Table>
    {/if}
{/snippet}
{#snippet footer()}
    <div class="row">
        <div style="margin-right: auto"></div>
        {#if importing}
            <div class="loader"></div>
        {/if}
        <button disabled={!file} class="danger confirm" onclick={importStudents}>Potvrdit</button>
    </div>
{/snippet}
{#snippet buttons()}
    <button class="secondary" onclick={() => window.history.back()}>Zpět</button>
    <button class="secondary" onclick={database.auth.logOut} style="margin-right: 'auto';">Odhlásit</button>
{/snippet}

{#if klass === undefined}
    <span class="loader"></span>
{:else}
    <BasicLayout {buttons} {content} {title} {footer} />
{/if}

<style>
    input {
        display: none;
    }

    p {
        margin-top: 0;
    }

    .file {
        margin-bottom: .75rem;
    }

    .confirm {
        margin-top: .75rem;
    }
</style>