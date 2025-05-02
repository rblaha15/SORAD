<script lang="ts">
    import BasicLayout from "$lib/components/BasicLayout.svelte";
    import type { Class, Student } from "$lib/database";
    import database from "$lib/database/supabase.js";
    import { onMount } from "svelte";
    import { getStudentsScores, type RatingWithStudents } from "$lib/data";
    import Collapsible from "$lib/components/Collapsible.svelte";
    import ClassChart from "./ClassChart.svelte";
    import StudentsTable from "$lib/components/admin/class/StudentsTable.svelte";
    import type { EventHandler } from "svelte/elements";
    import PrintCodes from "$lib/components/admin/class/PrintCodes.svelte";
    import { printComponent } from "$lib/print.svelte";
    import seedrandom from "seedrandom";

    const { classId }: { classId: number } = $props()

    let klass = $state() as Class;
    let ratings = $state<RatingWithStudents[]>([]);
    let students = $state<Student[]>([]);

    let name = $state() as string
    let grade = $state() as number
    let enabled = $state() as boolean

    const refresh = async () => {
        klass = await database.getMyClass(classId)
        name = klass.name
        grade = klass.grade
        enabled = klass.enabled

        const r = await database.admin.getClassRatings(classId)
        students = await database.getStudentsOfClass(classId)
        ratings = r.map(r => ({
            ...r, by: students.find(s => s.id == r.by)!, about: students.find(s => s.id == r.about)!
        }))
    }
    onMount(refresh)

    const confirm: EventHandler<SubmitEvent, HTMLFormElement> = async e => {
        e.preventDefault();
        await database.admin.updateClass({
            id: classId, name, grade: grade ?? klass.grade, enabled,
        });
        await refresh();
    }

    const randomChar = (random: () => number = Math.random) =>
        (random().toString(36)[2] || '0').toUpperCase()

    const classRandom = seedrandom(classId.toString())
    const classCode = randomChar(classRandom) + randomChar(classRandom)
    const newPassword = () => classCode + [...Array(4)].map(() => randomChar()).join('')

    const print = async () => {
        let passwords = await database.admin.getStudentPasswords(students.map(s => s.email))
        const newPasswords = Object.fromEntries(students
            .filter(s => !(s.email in passwords))
            .map(s => [s.email, newPassword()] as [string, string]))
        await database.admin.addStudentPasswords(newPasswords)
        passwords = { ...passwords, ...newPasswords }

        const codes = students.map(s => ({ ...s, password: passwords[s.email]! }));

        printComponent(PrintCodes, { codes })
    }
</script>

{#snippet title()}
    Třída: {klass.name}
{/snippet}
{#snippet content()}
    <Collapsible label="Nastavení">
        <form class="settings" onsubmit={confirm}>
            <label>
                Název třídy:
                <input bind:value={name} type="text" />
            </label>
            <label>
                Ročník:
                <input bind:value={grade} type="number" min="1" max="8" />
            </label>
            <p>1 až 8 – u čtyřletých tříd 5 až 8</p>
            <label>
                <input bind:checked={enabled} type="checkbox" />
                Povolit přijímání odpovědí od studentů
            </label>
            <button class="red" type="submit">Potvrdit</button>
        </form>
        <hr />
        <button onclick={print} class="blue">Vytisknout jednorázové kódy pro přihlášení</button>
    </Collapsible>
    {#if students}
        <Collapsible>
            {#snippet label({collapsed})}
                {collapsed ? 'Zobrazit graf' : 'Skrýt graf'}
            {/snippet}
            <ClassChart scores={getStudentsScores(students, ratings)} />
        </Collapsible>
        <Collapsible>
            {#snippet label({collapsed})}
                {collapsed ? 'Zobrazit seznam žáků' : 'Skrýt seznam žáků'}
            {/snippet}
            <StudentsTable {students} {ratings} allStudents={students} overview />
        </Collapsible>
    {/if}
{/snippet}
{#snippet buttons()}
    <button class="grey" onclick={() => window.history.back()}>Zpět</button>
    <button class="grey" onclick={database.auth.logOut} style="margin-right: 'auto';">Odhlásit</button>
{/snippet}

{#if klass === undefined}
    <span class="loader"></span>
{:else}
    <BasicLayout {buttons} {content} {title} />
{/if}

<style>
    button {
        margin: .375rem 0;
    }

    form.settings {
        label {
            display: block;
            margin: .375rem 0;

            input {
                margin: 0 .375rem;
            }
        }

        p {
            margin: 0 0 .375rem;
        }
    }
</style>