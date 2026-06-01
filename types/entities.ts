export type BilingualName = {
  nameEn: string;
  nameSi: string;
};

export type CategoryRef = BilingualName & { id: string; code: string };

export type WarehouseRef = BilingualName & {
  id: string;
  code: string;
  location?: string;
  district?: string;
};

export type SupplierRef = BilingualName & {
  id: string;
  code: string;
  contact?: string;
  email?: string | null;
};

export type UserRef = {
  id: string;
  employeeId: string;
  fullNameEn: string;
  fullNameSi: string;
  email?: string;
  role?: string;
};

export type ItemRef = BilingualName & {
  id: string;
  itemCode: string;
  barcode?: string | null;
  unit: string;
  unitPrice?: number | string;
  category?: CategoryRef;
  imageUrl?: string | null;
};

export type InventoryRecord = {
  id: string;
  itemId: string;
  warehouseId: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  lastCounted?: string | null;
  item: ItemRef;
  warehouse?: WarehouseRef;
  binLocation?: { id: string; code: string } | null;
};

export type ItemDetail = ItemRef & {
  unitSi: string;
  minStock: number;
  maxStock: number;
  reorderLevel: number;
  unitPrice: number | string;
  warehouseId: string;
  warehouse?: WarehouseRef;
  supplier?: SupplierRef | null;
  categoryId: string;
  isActive: boolean;
  inventory?: InventoryRecord[];
  createdAt: string;
  updatedAt: string;
};

export type GRNLine = {
  id: string;
  itemId: string;
  orderedQty: number;
  receivedQty: number;
  unitPrice: number | string;
  item: ItemRef;
};

export type GRNRecord = {
  id: string;
  grnNo: string;
  status: string;
  receivedDate?: string | null;
  remarks?: string | null;
  supplier: SupplierRef;
  warehouse: WarehouseRef;
  po?: { id: string; poNo: string } | null;
  createdBy?: UserRef;
  approver?: UserRef | null;
  lines: GRNLine[];
  createdAt: string;
  updatedAt: string;
};

export type GINLine = {
  id: string;
  itemId: string;
  requestedQty: number;
  issuedQty: number;
  item: ItemRef;
  binLocation?: { id: string; code: string } | null;
};

export type GINRecord = {
  id: string;
  ginNo: string;
  status: string;
  issueDate?: string | null;
  remarks?: string | null;
  warehouse: WarehouseRef;
  issuedTo: UserRef;
  createdBy?: UserRef;
  approver?: UserRef | null;
  lines: GINLine[];
  createdAt: string;
  updatedAt: string;
};

export type POLine = {
  id: string;
  itemId: string;
  quantity: number;
  unitPrice: number | string;
  lineTotal?: number | string | null;
  item: ItemRef;
};

export type PurchaseOrderRecord = {
  id: string;
  poNo: string;
  status: string;
  expectedDate?: string | null;
  totalAmount?: number | string | null;
  notes?: string | null;
  supplier: SupplierRef;
  warehouse: WarehouseRef;
  createdBy?: UserRef;
  approvedBy?: UserRef | null;
  lines: POLine[];
  createdAt: string;
  updatedAt: string;
};

export type StockEntryRecord = {
  id: string;
  entryNumber: string;
  type: string;
  quantity: number;
  unitPrice?: number | string | null;
  totalValue?: number | string | null;
  referenceNo?: string | null;
  remarks?: string | null;
  entryMethod: string;
  entryStartTime?: string | null;
  entryEndTime?: string | null;
  entryDuration?: number | null;
  status: string;
  item: ItemRef;
  warehouse: WarehouseRef;
  createdBy?: UserRef;
  approvedBy?: UserRef | null;
  createdAt: string;
};

export type PhysicalCountLine = {
  id: string;
  itemId: string;
  expectedQty: number;
  countedQty?: number | null;
  variance?: number | null;
  recountedQty?: number | null;
  notes?: string | null;
  item: ItemRef;
  binLocation?: { id: string; code: string } | null;
};

export type PhysicalCountRecord = {
  id: string;
  cycleNo: string;
  status: string;
  startedAt?: string | null;
  completedAt?: string | null;
  remarks?: string | null;
  warehouse: WarehouseRef;
  conductedBy: UserRef;
  approvedBy?: UserRef | null;
  lines: PhysicalCountLine[];
  createdAt: string;
  updatedAt: string;
};

export type DamageReportLine = {
  id: string;
  itemId: string;
  quantity: number;
  reason: string;
  costImpact: number | string;
  images?: unknown;
  item: ItemRef;
};

export type DamageReportRecord = {
  id: string;
  reportNo: string;
  status: string;
  totalCost: number | string;
  incidentDate?: string | null;
  remarks?: string | null;
  warehouse: WarehouseRef;
  reportedBy: UserRef;
  approvedBy?: UserRef | null;
  lines: DamageReportLine[];
  createdAt: string;
  updatedAt: string;
};

export type KPIRecordData = {
  id: string;
  warehouseId: string;
  recordDate: string;
  month: number;
  year: number;
  inventoryAccuracy: number;
  avgEntryTime: number;
  orderFulfillmentRate: number;
  stockTurnoverRate: number;
  staffProductivity: number;
  shrinkageRate: number;
  pickingEfficiency: number;
  totalTransactions: number;
  totalErrors: number;
  warehouse?: WarehouseRef;
};

export type ReportRecord = {
  id: string;
  reportNo: string;
  type: string;
  titleEn: string;
  titleSi: string;
  fromDate: string;
  toDate: string;
  fileUrl?: string | null;
  warehouse: WarehouseRef;
  generatedBy?: UserRef;
  createdAt: string;
  metadata?: Record<string, unknown> | null;
};

export type TaskRecord = {
  id: string;
  titleEn: string;
  titleSi: string;
  taskType: string;
  status: string;
  priority: string;
  dueDate: string;
  completedAt?: string | null;
  notes?: string | null;
  assignedTo: UserRef;
  createdAt: string;
  updatedAt: string;
};

export type WarehouseDetail = WarehouseRef & {
  location: string;
  district: string;
  capacity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  stats?: {
    itemCount: number;
    totalStock: number;
    lowStockCount: number;
    pendingEntries: number;
  };
};

export type SupplierDetail = SupplierRef & {
  address: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  itemCount?: number;
  poCount?: number;
};

export type AuditLogRecord = {
  id: string;
  action: string;
  module: string;
  details: Record<string, unknown>;
  ipAddress?: string | null;
  createdAt: string;
  user: UserRef;
};

export type NotificationRecord = {
  id: string;
  titleEn: string;
  titleSi: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string | null;
  createdAt: string;
};

export type ListParams = {
  page?: number;
  limit?: number;
  search?: string;
  warehouseId?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  [key: string]: string | number | boolean | undefined;
};
