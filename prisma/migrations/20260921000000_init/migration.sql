-- Hotel Mate Marketing Panel — initial schema
-- CreateTable
CREATE TABLE "leads" (
    "seq" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "hotel" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "interest" TEXT NOT NULL,
    "budget_lkr" INTEGER,
    "status" TEXT NOT NULL,
    "assigned_to" TEXT NOT NULL DEFAULT 'Unassigned',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL,
    "campaign" TEXT NOT NULL,
    "note" TEXT,
    "form_status" TEXT NOT NULL DEFAULT 'pending',
    "assessment" JSONB,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("seq")
);

-- CreateIndex
CREATE INDEX "leads_created_at_idx" ON "leads"("created_at");

-- CreateIndex
CREATE INDEX "leads_status_idx" ON "leads"("status");

-- Lead numbers (L-####) are presented starting at L-1001
ALTER SEQUENCE "leads_seq_seq" RESTART WITH 1001;
