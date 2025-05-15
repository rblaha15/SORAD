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
    import { goto } from "$app/navigation";

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
            newStudents = rows.slice(2).map(([_, index, fullName, email, sex]) => ({
                names: String(fullName).split(' ').slice(0, -1).join(' '),
                surname: String(fullName).split(' ').at(-1) ?? '',
                student_number: Number(index), email, is_girl: sex == 'Z'
            }) as NewStudent)
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
        ...unchanged.map(s => [s, 'var(--black-color)'] as const),
    ]);

    let importing = $state(false);
    const importStudents = async () => {
        importing = true;

        const toRemove = removed.map(s => s.id)
        if (toRemove.length) await database.admin.removeRatings(toRemove)
        if (toRemove.length) await database.admin.removeStudents(toRemove)
        if (removed.length) await database.admin.deleteStudentAccountsAndPasswords(removed)

        const toAdd = added.map(s => ({ ...s, class: classId }))
        const toChange = changed.map(s => ({ ...s, class: classId }))
        if (toAdd.length || toChange.length) await database.admin.setStudents([...toAdd, ...toChange])
        if (toAdd.length) await database.admin.createStudentAccountsAndSavePasswords(generatePasswords(toAdd))

        await goto(`/admin?class=${classId}`, { replaceState: false })
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
    <div class="row">
        <button class="btn primary file" onclick={() => {fileInput.value = ''; file = undefined; newStudents = []; fileInput?.click()}} disabled={importing}>
            {!file ? 'Vybrat soubor' : 'Vybrat jiný soubor'}
        </button>
        {#if importing}
            <div class="loader"></div>
        {/if}
        <button disabled={!file} class="danger confirm" onclick={importStudents}>Potvrdit</button>
    </div>
    {#if added.length || removed.length || changed.length}
        <p>Náhled změn:</p>
        <p>Zeleně zbarvení jsou nově přidaní žáci, červeně jsou odstranění žáci a oranžově jsou upravení žáci.</p>
        {#if removed.length}
            <p style="color: var(--red-color)">Po odstranění žáka se nebude moci přihlásit a vyplnit dotazník!</p>
            <p style="color: var(--red-color)">Odstraněním žáka odstraníte i všechna hodnocení, které vyplnil i všechna hodnocení, které někdo vyplnil o
                něm!</p>
            <p style="color: var(--red-color)"><strong>Tato akce je nevratná!</strong></p>
        {/if}
    {:else if file}
        <p>Soubor neobsahuje žádné změny.</p>
    {:else if allChanges.length}
        <p>Aktuální seznam žáků:</p>
    {/if}
    {#if allChanges.length}
        <Table items={allChanges}>
            {#snippet header()}
                <th style:text-align="start">Číslo v třídním výkazu</th>
                <th style:text-align="start">Jména</th>
                <th style:text-align="start">Příjmení</th>
                <th style:text-align="start">Email</th>
                <th style:text-align="start">Pohlaví</th>
            {/snippet}
            {#snippet row([student, color])}
                <td style:text-align="start" style:color>{student.student_number}</td>
                <td style:text-align="start" style:color>{student.names}</td>
                <td style:text-align="start" style:color>{student.surname}</td>
                <td style:text-align="start" style:color>{student.email}</td>
                <td style:text-align="start" style:color>{student.is_girl ? 'Z' : 'M'}</td>
            {/snippet}
        </Table>
    {/if}
{/snippet}
{#snippet buttons()}
    <button class="secondary" onclick={() => goto(`/admin?class=${classId}`, { replaceState: false })}>Zpět</button>
    <button class="secondary" onclick={database.auth.logOut}>Odhlásit se</button>
{/snippet}

<title>Importovat žáky</title>

{#if klass === undefined}
    <div><span class="loader"></span></div>
{:else}
    <BasicLayout {buttons} {content} {title} />
{/if}

<style>
    input {
        display: none;
    }

    p {
        margin-top: 0;
    }

    .row {
        margin-bottom: .75rem;

        button {
            margin-right: .5rem;
        }
    }
</style>