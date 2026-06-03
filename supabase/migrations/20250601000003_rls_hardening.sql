-- IrrWMS Supabase migration 03: RLS hardening
-- IrrWMS uses Prisma + NextAuth with DATABASE_URL (postgres role), NOT Supabase Auth / PostgREST.
-- Enable RLS so anon/authenticated API roles cannot read warehouse data via the Data API.
-- The application connection (postgres / service role) bypasses RLS as usual.

DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'User', 'Account', 'Session', 'VerificationToken', 'PasswordResetToken',
      'Warehouse', 'Category', 'Supplier', 'Item', 'Zone', 'BinLocation', 'LotBatch',
      'Inventory', 'PurchaseOrder', 'POLine', 'GoodsReceiptNote', 'GRNLine',
      'Requisition', 'RequisitionLine', 'GoodsIssueNote', 'GINLine',
      'StockEntry', 'StockTransfer', 'TransferLine',
      'PhysicalCountCycle', 'PhysicalCountLine', 'DamageReport', 'DamageReportLine',
      'KPIRecord', 'Report', 'Task', 'AuditLog', 'Notification',
      'Attachment', 'WebhookDelivery'
    ])
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tbl);
  END LOOP;
END $$;

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL ROUTINES IN SCHEMA public FROM anon, authenticated;
