import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { PGlite } from "@electric-sql/pglite";

const migrationUrl = new URL(
  "../supabase/migrations/202609220001_create_leads.sql",
  import.meta.url
);

test("Supabase schema migration is idempotent and supports the lead lifecycle", async () => {
  const db = new PGlite();

  try {
    const migration = await readFile(migrationUrl, "utf8");
    await db.exec(migration);
    await db.exec(migration);

    const empty = await db.query<{ count: number }>(
      "SELECT count(*)::int AS count FROM public.leads"
    );
    assert.equal(empty.rows[0].count, 0, "a new schema must not contain leads");

    const created = await db.query<{
      id: string;
      assessment: { roomsCount: number } | null;
    }>(`
      INSERT INTO public.leads (name, phone, source, assessment)
      VALUES
        ('Schema Verification One', '+94770000001', 'manual', NULL),
        ('Schema Verification Two', '+94770000002', 'website', '{"roomsCount":12}'::JSONB)
      RETURNING id, assessment
    `);

    assert.deepEqual(
      created.rows.map((row) => row.id),
      ["L-1001", "L-1002"]
    );
    assert.equal(created.rows[1].assessment?.roomsCount, 12);

    const updated = await db.query<{
      status: string;
      budget_lkr: number;
      assigned_to: string;
      note: string;
    }>(`
      UPDATE public.leads
      SET
        status = CASE WHEN true THEN 'qualified' ELSE status END,
        budget_lkr = CASE WHEN true THEN 125000 ELSE budget_lkr END,
        assigned_to = CASE WHEN false THEN 'Nobody' ELSE assigned_to END,
        note = CASE WHEN true THEN 'Verified' ELSE note END,
        updated_at = NOW()
      WHERE id = 'L-1001'
      RETURNING status, budget_lkr, assigned_to, note
    `);

    assert.deepEqual(updated.rows[0], {
      status: "qualified",
      budget_lkr: 125000,
      assigned_to: "Unassigned",
      note: "Verified",
    });

    await assert.rejects(
      db.query(
        "INSERT INTO public.leads (name, phone, source) VALUES ('Invalid Source', '1', 'invalid')"
      )
    );

    const deleted = await db.query<{ id: string }>(
      "DELETE FROM public.leads WHERE id = 'L-1002' RETURNING id"
    );
    assert.equal(deleted.rows[0].id, "L-1002");
  } finally {
    await db.close();
  }
});
