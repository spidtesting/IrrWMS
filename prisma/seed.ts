import {
  CountStatus,
  EntryMethod,
  EntryStatus,
  GINStatus,
  GRNStatus,
  NotifType,
  POStatus,
  PrismaClient,
  Priority,
  Role,
  TaskStatus,
  TaskType,
  TransactionType,
} from "@prisma/client";
import { hash } from "bcryptjs";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();
const BCRYPT_ROUNDS = 12;
const SEED_PASSWORD = "Admin@1234";

function dec(value: number): Decimal {
  return new Decimal(value.toFixed(2));
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function pad(n: number, len = 4): string {
  return String(n).padStart(len, "0");
}

async function main() {
  console.log("🌱 Seeding IrrWMS database…");

  const passwordHash = await hash(SEED_PASSWORD, BCRYPT_ROUNDS);

  // ── Clean existing data (order respects FK constraints) ──────────────────
  await prisma.notification.deleteMany();
  await prisma.task.deleteMany();
  await prisma.report.deleteMany();
  await prisma.kPIRecord.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.damageReportLine.deleteMany();
  await prisma.damageReport.deleteMany();
  await prisma.physicalCountLine.deleteMany();
  await prisma.physicalCountCycle.deleteMany();
  await prisma.transferLine.deleteMany();
  await prisma.stockTransfer.deleteMany();
  await prisma.stockEntry.deleteMany();
  await prisma.gINLine.deleteMany();
  await prisma.goodsIssueNote.deleteMany();
  await prisma.requisitionLine.deleteMany();
  await prisma.requisition.deleteMany();
  await prisma.gRNLine.deleteMany();
  await prisma.goodsReceiptNote.deleteMany();
  await prisma.pOLine.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.lotBatch.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.item.deleteMany();
  await prisma.binLocation.deleteMany();
  await prisma.zone.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.category.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.warehouse.deleteMany();

  // ── Warehouses ───────────────────────────────────────────────────────────
  const warehouses = await Promise.all([
    prisma.warehouse.create({
      data: {
        code: "WH-CMB-01",
        nameEn: "Colombo Central Warehouse",
        nameSi: "කොළඹ මධ්‍යම ගබඩාව",
        location: "Pelawatta, Battaramulla",
        district: "Colombo",
        capacity: 15000,
      },
    }),
    prisma.warehouse.create({
      data: {
        code: "WH-HMB-01",
        nameEn: "Hambantota Regional Warehouse",
        nameSi: "හම්බන්තොට කලාපීය ගබඩාව",
        location: "Hambantota Industrial Zone",
        district: "Hambantota",
        capacity: 8000,
      },
    }),
    prisma.warehouse.create({
      data: {
        code: "WH-KDY-01",
        nameEn: "Kandy Hill Country Warehouse",
        nameSi: "මහනුවර කඳුකර ගබඩාව",
        location: "Katugastota, Kandy",
        district: "Kandy",
        capacity: 6000,
      },
    }),
  ]);

  const [whColombo, whHambantota, whKandy] = warehouses;

  // ── Users (one per role) ─────────────────────────────────────────────────
  const userDefs: Array<{
    employeeId: string;
    email: string;
    fullNameEn: string;
    fullNameSi: string;
    role: Role;
    warehouseId: string;
  }> = [
    {
      employeeId: "EMP-SUPER-001",
      email: "super@irrwms.gov.lk",
      fullNameEn: "Kamal Perera",
      fullNameSi: "කමල් පෙරේරා",
      role: Role.SUPER_ADMIN,
      warehouseId: whColombo.id,
    },
    {
      employeeId: "EMP-ADMIN-001",
      email: "admin@irrwms.gov.lk",
      fullNameEn: "Nimal Silva",
      fullNameSi: "නිමල් සිල්වා",
      role: Role.ADMIN,
      warehouseId: whColombo.id,
    },
    {
      employeeId: "EMP-MGR-001",
      email: "manager@irrwms.gov.lk",
      fullNameEn: "Sunil Fernando",
      fullNameSi: "සුනිල් ප්‍රනාන්දු",
      role: Role.MANAGER,
      warehouseId: whColombo.id,
    },
    {
      employeeId: "EMP-SUP-001",
      email: "supervisor@irrwms.gov.lk",
      fullNameEn: "Ajith Wickramasinghe",
      fullNameSi: "අජිත් වික්‍රමසිංහ",
      role: Role.SUPERVISOR,
      warehouseId: whHambantota.id,
    },
    {
      employeeId: "EMP-STF-001",
      email: "staff@irrwms.gov.lk",
      fullNameEn: "Ruwan Jayawardena",
      fullNameSi: "රුවන් ජයවර්ධන",
      role: Role.STAFF,
      warehouseId: whKandy.id,
    },
    {
      employeeId: "EMP-VWR-001",
      email: "viewer@irrwms.gov.lk",
      fullNameEn: "Dilani Gunasekara",
      fullNameSi: "දිලානි ගුණසේකර",
      role: Role.VIEWER,
      warehouseId: whColombo.id,
    },
  ];

  const users = await Promise.all(
    userDefs.map((u) =>
      prisma.user.create({
        data: {
          ...u,
          password: passwordHash,
          bcryptRounds: BCRYPT_ROUNDS,
          isActive: true,
          emailVerified: new Date(),
        },
      }),
    ),
  );

  const [superAdmin, admin, manager, supervisor, staff, viewer] = users;

  // ── Categories (8) ───────────────────────────────────────────────────────
  const categoryDefs = [
    { code: "CAT-PIPE", nameEn: "Pipes & Fittings", nameSi: "නල සහ fittings" },
    { code: "CAT-PUMP", nameEn: "Pumps & Motors", nameSi: "පොම්ප සහ මෝටර්" },
    { code: "CAT-VALVE", nameEn: "Valves & Gates", nameSi: "වාල්ව සහ දොරටු" },
    { code: "CAT-TOOL", nameEn: "Irrigation Tools", nameSi: "ජලාපවහන මෙවලම්" },
    { code: "CAT-CHEM", nameEn: "Chemicals & Fertilizers", nameSi: "රසායනික සහ පොහොර" },
    { code: "CAT-ELEC", nameEn: "Electrical & Controls", nameSi: "විදුලි සහ පාලන" },
    { code: "CAT-SAFE", nameEn: "Safety Equipment", nameSi: "ආරක්ෂක උපකරණ" },
    { code: "CAT-SPARE", nameEn: "Spare Parts", nameSi: " අමතර කොටස්" },
  ];

  const categories = await Promise.all(
    categoryDefs.map((c) => prisma.category.create({ data: c })),
  );

  // ── Suppliers (5) ────────────────────────────────────────────────────────
  const supplierDefs = [
    {
      code: "SUP-LANKA",
      nameEn: "Lanka Irrigation Supplies (Pvt) Ltd",
      nameSi: "ලanka ජලාපවහන සැපයුම් (ප්‍ර) Ltd",
      contact: "+94 11 234 5678",
      email: "sales@lankairrigation.lk",
      address: "No. 45, Industrial Estate, Kelaniya",
    },
    {
      code: "SUP-CENTRAL",
      nameEn: "Central Agro Trading Company",
      nameSi: "මධ්‍යම කෘෂි වෙළඳ සමාගම",
      contact: "+94 81 222 3344",
      email: "orders@centralagro.lk",
      address: "Dambulla Road, Kandy",
    },
    {
      code: "SUP-HYDRO",
      nameEn: "Hydro Tech Lanka",
      nameSi: "හයිඩ්‍රෝ ටෙක් ලanka",
      contact: "+94 47 223 1100",
      email: "info@hydrotech.lk",
      address: "Hambantota Port Area, Phase 2",
    },
    {
      code: "SUP-NATIONAL",
      nameEn: "National Pipe Works Ltd",
      nameSi: "ජාතික නල කර්මාන්ත Ltd",
      contact: "+94 11 288 9900",
      email: "procurement@nationalpipe.lk",
      address: "Orugodawatta, Colombo 15",
    },
    {
      code: "SUP-GLOBAL",
      nameEn: "Global Pump Solutions",
      nameSi: "ග්ලෝබල් පොම්ප විසඳුම්",
      contact: "+94 77 123 4567",
      email: "support@globalpump.lk",
      address: "Export Processing Zone, Katunayake",
    },
  ];

  const suppliers = await Promise.all(supplierDefs.map((s) => prisma.supplier.create({ data: s })));

  // ── Zones & Bin Locations ────────────────────────────────────────────────
  const zoneTemplates = [
    { code: "REC", nameEn: "Receiving Zone", nameSi: "ලැබීමේ කලාපය" },
    { code: "STG", nameEn: "Storage Zone", nameSi: "ගබඩා කලාපය" },
    { code: "PCK", nameEn: "Picking Zone", nameSi: "තෝරා ගැනීමේ කලාපය" },
    { code: "BLK", nameEn: "Bulk Storage Zone", nameSi: "තොග ගබඩා කලාපය" },
  ];

  type BinRef = { id: string; warehouseId: string; code: string };
  const allBins: BinRef[] = [];

  for (const warehouse of warehouses) {
    for (const zt of zoneTemplates) {
      const zone = await prisma.zone.create({
        data: {
          code: zt.code,
          nameEn: zt.nameEn,
          nameSi: zt.nameSi,
          warehouseId: warehouse.id,
        },
      });

      for (let i = 1; i <= 5; i++) {
        const aisle = String.fromCharCode(64 + i);
        const bin = await prisma.binLocation.create({
          data: {
            code: `${warehouse.code}-${zt.code}-${aisle}${i}`,
            zoneId: zone.id,
            warehouseId: warehouse.id,
            aisle,
            shelf: String(i),
            isActive: true,
          },
        });
        allBins.push({ id: bin.id, warehouseId: warehouse.id, code: bin.code });
      }
    }
  }

  function binsForWarehouse(warehouseId: string): BinRef[] {
    return allBins.filter((b) => b.warehouseId === warehouseId);
  }

  // ── Items (50) — realistic irrigation department inventory ───────────────
  const itemDefs: Array<{
    itemCode: string;
    nameEn: string;
    nameSi: string;
    categoryIdx: number;
    unit: string;
    unitSi: string;
    minStock: number;
    maxStock: number;
    reorderLevel: number;
    unitPrice: number;
    warehouseIdx: number;
    supplierIdx: number;
  }> = [
    {
      itemCode: "ITM-00001",
      nameEn: "PVC Pipe 110mm Class D",
      nameSi: "PVC නල 110mm Class D",
      categoryIdx: 0,
      unit: "m",
      unitSi: "මී",
      minStock: 100,
      maxStock: 2000,
      reorderLevel: 200,
      unitPrice: 850,
      warehouseIdx: 0,
      supplierIdx: 3,
    },
    {
      itemCode: "ITM-00002",
      nameEn: "PVC Pipe 160mm Class D",
      nameSi: "PVC නල 160mm Class D",
      categoryIdx: 0,
      unit: "m",
      unitSi: "මී",
      minStock: 80,
      maxStock: 1500,
      reorderLevel: 150,
      unitPrice: 1450,
      warehouseIdx: 0,
      supplierIdx: 3,
    },
    {
      itemCode: "ITM-00003",
      nameEn: "HDPE Pipe 90mm PN10",
      nameSi: "HDPE නල 90mm PN10",
      categoryIdx: 0,
      unit: "m",
      unitSi: "මී",
      minStock: 120,
      maxStock: 1800,
      reorderLevel: 180,
      unitPrice: 620,
      warehouseIdx: 0,
      supplierIdx: 0,
    },
    {
      itemCode: "ITM-00004",
      nameEn: "GI Pipe 50mm Medium",
      nameSi: "GI නල 50mm Medium",
      categoryIdx: 0,
      unit: "m",
      unitSi: "මී",
      minStock: 50,
      maxStock: 800,
      reorderLevel: 100,
      unitPrice: 980,
      warehouseIdx: 1,
      supplierIdx: 3,
    },
    {
      itemCode: "ITM-00005",
      nameEn: "PVC Elbow 110mm 90°",
      nameSi: "PVC elbows 110mm 90°",
      categoryIdx: 0,
      unit: "pcs",
      unitSi: "ක්",
      minStock: 30,
      maxStock: 500,
      reorderLevel: 50,
      unitPrice: 320,
      warehouseIdx: 0,
      supplierIdx: 0,
    },
    {
      itemCode: "ITM-00006",
      nameEn: "PVC Tee 110mm",
      nameSi: "PVC tee 110mm",
      categoryIdx: 0,
      unit: "pcs",
      unitSi: "ක්",
      minStock: 25,
      maxStock: 400,
      reorderLevel: 40,
      unitPrice: 410,
      warehouseIdx: 0,
      supplierIdx: 0,
    },
    {
      itemCode: "ITM-00007",
      nameEn: "Pipe Coupling 160mm",
      nameSi: "නල coupling 160mm",
      categoryIdx: 0,
      unit: "pcs",
      unitSi: "ක්",
      minStock: 20,
      maxStock: 300,
      reorderLevel: 35,
      unitPrice: 580,
      warehouseIdx: 1,
      supplierIdx: 3,
    },
    {
      itemCode: "ITM-00008",
      nameEn: "Submersible Pump 5HP",
      nameSi: " underwater පොම්පය 5HP",
      categoryIdx: 1,
      unit: "pcs",
      unitSi: "ක්",
      minStock: 2,
      maxStock: 20,
      reorderLevel: 3,
      unitPrice: 185000,
      warehouseIdx: 0,
      supplierIdx: 4,
    },
    {
      itemCode: "ITM-00009",
      nameEn: "Centrifugal Pump 3HP",
      nameSi: "centrifugal පොම්පය 3HP",
      categoryIdx: 1,
      unit: "pcs",
      unitSi: "ක්",
      minStock: 3,
      maxStock: 25,
      reorderLevel: 4,
      unitPrice: 95000,
      warehouseIdx: 0,
      supplierIdx: 4,
    },
    {
      itemCode: "ITM-00010",
      nameEn: "Diesel Engine Pump Set 10HP",
      nameSi: "diesel engine පොම්ප කට්ටලය 10HP",
      categoryIdx: 1,
      unit: "set",
      unitSi: "කට්ටල",
      minStock: 1,
      maxStock: 10,
      reorderLevel: 2,
      unitPrice: 450000,
      warehouseIdx: 1,
      supplierIdx: 4,
    },
    {
      itemCode: "ITM-00011",
      nameEn: "Electric Motor 7.5kW",
      nameSi: "විදුලි මෝටරය 7.5kW",
      categoryIdx: 1,
      unit: "pcs",
      unitSi: "ක්",
      minStock: 2,
      maxStock: 15,
      reorderLevel: 3,
      unitPrice: 78000,
      warehouseIdx: 0,
      supplierIdx: 4,
    },
    {
      itemCode: "ITM-00012",
      nameEn: "Pump Impeller SS316",
      nameSi: "පොම්ප impeller SS316",
      categoryIdx: 7,
      unit: "pcs",
      unitSi: "ක්",
      minStock: 5,
      maxStock: 50,
      reorderLevel: 8,
      unitPrice: 12500,
      warehouseIdx: 0,
      supplierIdx: 4,
    },
    {
      itemCode: "ITM-00013",
      nameEn: "Sluice Gate 600mm",
      nameSi: "sluice gate 600mm",
      categoryIdx: 2,
      unit: "pcs",
      unitSi: "ක්",
      minStock: 1,
      maxStock: 8,
      reorderLevel: 2,
      unitPrice: 320000,
      warehouseIdx: 1,
      supplierIdx: 0,
    },
    {
      itemCode: "ITM-00014",
      nameEn: "Butterfly Valve 200mm",
      nameSi: "butterfly valve 200mm",
      categoryIdx: 2,
      unit: "pcs",
      unitSi: "ක්",
      minStock: 3,
      maxStock: 30,
      reorderLevel: 5,
      unitPrice: 45000,
      warehouseIdx: 0,
      supplierIdx: 0,
    },
    {
      itemCode: "ITM-00015",
      nameEn: "Gate Valve 100mm Brass",
      nameSi: "gate valve 100mm brass",
      categoryIdx: 2,
      unit: "pcs",
      unitSi: "ක්",
      minStock: 5,
      maxStock: 60,
      reorderLevel: 10,
      unitPrice: 18500,
      warehouseIdx: 0,
      supplierIdx: 0,
    },
    {
      itemCode: "ITM-00016",
      nameEn: "Air Release Valve 50mm",
      nameSi: "air release valve 50mm",
      categoryIdx: 2,
      unit: "pcs",
      unitSi: "ක්",
      minStock: 4,
      maxStock: 40,
      reorderLevel: 6,
      unitPrice: 8200,
      warehouseIdx: 2,
      supplierIdx: 0,
    },
    {
      itemCode: "ITM-00017",
      nameEn: "Non-Return Valve 150mm",
      nameSi: "non-return valve 150mm",
      categoryIdx: 2,
      unit: "pcs",
      unitSi: "ක්",
      minStock: 3,
      maxStock: 25,
      reorderLevel: 5,
      unitPrice: 28000,
      warehouseIdx: 1,
      supplierIdx: 0,
    },
    {
      itemCode: "ITM-00018",
      nameEn: "Drip Irrigation Tape 16mm",
      nameSi: "drip irrigation tape 16mm",
      categoryIdx: 3,
      unit: "roll",
      unitSi: "රෝල",
      minStock: 10,
      maxStock: 100,
      reorderLevel: 15,
      unitPrice: 4500,
      warehouseIdx: 2,
      supplierIdx: 1,
    },
    {
      itemCode: "ITM-00019",
      nameEn: "Sprinkler Head Impact Type",
      nameSi: "sprinkler head impact type",
      categoryIdx: 3,
      unit: "pcs",
      unitSi: "ක්",
      minStock: 20,
      maxStock: 200,
      reorderLevel: 30,
      unitPrice: 2800,
      warehouseIdx: 2,
      supplierIdx: 1,
    },
    {
      itemCode: "ITM-00020",
      nameEn: 'Aluminium Pipe Wrench 24"',
      nameSi: 'aluminium pipe wrench 24"',
      categoryIdx: 3,
      unit: "pcs",
      unitSi: "ක්",
      minStock: 5,
      maxStock: 30,
      reorderLevel: 8,
      unitPrice: 3500,
      warehouseIdx: 0,
      supplierIdx: 1,
    },
    {
      itemCode: "ITM-00021",
      nameEn: "Water Flow Meter 100mm",
      nameSi: "water flow meter 100mm",
      categoryIdx: 3,
      unit: "pcs",
      unitSi: "ක්",
      minStock: 2,
      maxStock: 20,
      reorderLevel: 3,
      unitPrice: 65000,
      warehouseIdx: 0,
      supplierIdx: 0,
    },
    {
      itemCode: "ITM-00022",
      nameEn: "Canal Gauge Staff Plate",
      nameSi: "canal gauge staff plate",
      categoryIdx: 3,
      unit: "pcs",
      unitSi: "ක්",
      minStock: 5,
      maxStock: 40,
      reorderLevel: 8,
      unitPrice: 12000,
      warehouseIdx: 1,
      supplierIdx: 1,
    },
    {
      itemCode: "ITM-00023",
      nameEn: "Urea Fertilizer 50kg Bag",
      nameSi: "urea පොහොර 50kg බෑග",
      categoryIdx: 4,
      unit: "bag",
      unitSi: "බෑග",
      minStock: 50,
      maxStock: 500,
      reorderLevel: 80,
      unitPrice: 8500,
      warehouseIdx: 2,
      supplierIdx: 1,
    },
    {
      itemCode: "ITM-00024",
      nameEn: "TSP Fertilizer 50kg Bag",
      nameSi: "TSP පොහොර 50kg බෑග",
      categoryIdx: 4,
      unit: "bag",
      unitSi: "බෑග",
      minStock: 40,
      maxStock: 400,
      reorderLevel: 60,
      unitPrice: 9200,
      warehouseIdx: 2,
      supplierIdx: 1,
    },
    {
      itemCode: "ITM-00025",
      nameEn: "Aluminium Sulphate 25kg",
      nameSi: "aluminium sulphate 25kg",
      categoryIdx: 4,
      unit: "bag",
      unitSi: "බෑග",
      minStock: 20,
      maxStock: 200,
      reorderLevel: 30,
      unitPrice: 4800,
      warehouseIdx: 0,
      supplierIdx: 2,
    },
    {
      itemCode: "ITM-00026",
      nameEn: 'Chlorine Tablets 3" 45kg',
      nameSi: 'chlorine tablets 3" 45kg',
      categoryIdx: 4,
      unit: "drum",
      unitSi: "බීම",
      minStock: 5,
      maxStock: 50,
      reorderLevel: 8,
      unitPrice: 35000,
      warehouseIdx: 0,
      supplierIdx: 2,
    },
    {
      itemCode: "ITM-00027",
      nameEn: "PVC Solvent Cement 1L",
      nameSi: "PVC solvent cement 1L",
      categoryIdx: 4,
      unit: "tin",
      unitSi: "ටින්",
      minStock: 15,
      maxStock: 120,
      reorderLevel: 20,
      unitPrice: 1850,
      warehouseIdx: 0,
      supplierIdx: 0,
    },
    {
      itemCode: "ITM-00028",
      nameEn: "Control Panel 415V 3-Phase",
      nameSi: "control panel 415V 3-phase",
      categoryIdx: 5,
      unit: "pcs",
      unitSi: "ක්",
      minStock: 1,
      maxStock: 10,
      reorderLevel: 2,
      unitPrice: 125000,
      warehouseIdx: 0,
      supplierIdx: 4,
    },
    {
      itemCode: "ITM-00029",
      nameEn: "Float Switch Level Controller",
      nameSi: "float switch level controller",
      categoryIdx: 5,
      unit: "pcs",
      unitSi: "ක්",
      minStock: 5,
      maxStock: 40,
      reorderLevel: 8,
      unitPrice: 8500,
      warehouseIdx: 0,
      supplierIdx: 4,
    },
    {
      itemCode: "ITM-00030",
      nameEn: "Cable 4C x 16sqmm Armoured",
      nameSi: " cable 4C x 16sqmm armoured",
      categoryIdx: 5,
      unit: "m",
      unitSi: "මී",
      minStock: 100,
      maxStock: 1000,
      reorderLevel: 150,
      unitPrice: 3200,
      warehouseIdx: 1,
      supplierIdx: 4,
    },
    {
      itemCode: "ITM-00031",
      nameEn: "MCB 63A 3-Pole",
      nameSi: "MCB 63A 3-pole",
      categoryIdx: 5,
      unit: "pcs",
      unitSi: "ක්",
      minStock: 10,
      maxStock: 80,
      reorderLevel: 15,
      unitPrice: 4200,
      warehouseIdx: 0,
      supplierIdx: 4,
    },
    {
      itemCode: "ITM-00032",
      nameEn: "SCADA RTU Module",
      nameSi: "SCADA RTU module",
      categoryIdx: 5,
      unit: "pcs",
      unitSi: "ක්",
      minStock: 1,
      maxStock: 8,
      reorderLevel: 2,
      unitPrice: 285000,
      warehouseIdx: 0,
      supplierIdx: 4,
    },
    {
      itemCode: "ITM-00033",
      nameEn: "Safety Helmet with Visor",
      nameSi: "safety helmet with visor",
      categoryIdx: 6,
      unit: "pcs",
      unitSi: "ක්",
      minStock: 20,
      maxStock: 150,
      reorderLevel: 30,
      unitPrice: 2800,
      warehouseIdx: 0,
      supplierIdx: 1,
    },
    {
      itemCode: "ITM-00034",
      nameEn: "Rubber Boots Steel Toe",
      nameSi: "rubber boots steel toe",
      categoryIdx: 6,
      unit: "pair",
      unitSi: "යුගල",
      minStock: 15,
      maxStock: 100,
      reorderLevel: 25,
      unitPrice: 4500,
      warehouseIdx: 1,
      supplierIdx: 1,
    },
    {
      itemCode: "ITM-00035",
      nameEn: "Reflective Safety Vest",
      nameSi: "reflective safety vest",
      categoryIdx: 6,
      unit: "pcs",
      unitSi: "ක්",
      minStock: 25,
      maxStock: 200,
      reorderLevel: 40,
      unitPrice: 1200,
      warehouseIdx: 2,
      supplierIdx: 1,
    },
    {
      itemCode: "ITM-00036",
      nameEn: "Pump Mechanical Seal Kit",
      nameSi: "pump mechanical seal kit",
      categoryIdx: 7,
      unit: "kit",
      unitSi: "කට්ටල",
      minStock: 8,
      maxStock: 60,
      reorderLevel: 12,
      unitPrice: 6500,
      warehouseIdx: 0,
      supplierIdx: 4,
    },
    {
      itemCode: "ITM-00037",
      nameEn: "Bearing 6308-2RS",
      nameSi: "bearing 6308-2RS",
      categoryIdx: 7,
      unit: "pcs",
      unitSi: "ක්",
      minStock: 10,
      maxStock: 80,
      reorderLevel: 15,
      unitPrice: 3200,
      warehouseIdx: 0,
      supplierIdx: 4,
    },
    {
      itemCode: "ITM-00038",
      nameEn: "V-Belt B-68",
      nameSi: "V-belt B-68",
      categoryIdx: 7,
      unit: "pcs",
      unitSi: "ක්",
      minStock: 12,
      maxStock: 100,
      reorderLevel: 18,
      unitPrice: 1800,
      warehouseIdx: 1,
      supplierIdx: 4,
    },
    {
      itemCode: "ITM-00039",
      nameEn: "HDPE Pipe 63mm PN10",
      nameSi: "HDPE නල 63mm PN10",
      categoryIdx: 0,
      unit: "m",
      unitSi: "මී",
      minStock: 150,
      maxStock: 2500,
      reorderLevel: 250,
      unitPrice: 380,
      warehouseIdx: 2,
      supplierIdx: 0,
    },
    {
      itemCode: "ITM-00040",
      nameEn: "Pressure Gauge 0-10 bar",
      nameSi: "pressure gauge 0-10 bar",
      categoryIdx: 3,
      unit: "pcs",
      unitSi: "ක්",
      minStock: 5,
      maxStock: 40,
      reorderLevel: 8,
      unitPrice: 5500,
      warehouseIdx: 2,
      supplierIdx: 0,
    },
    {
      itemCode: "ITM-00041",
      nameEn: "Rising Main Pipe 250mm MS",
      nameSi: "rising main pipe 250mm MS",
      categoryIdx: 0,
      unit: "m",
      unitSi: "මී",
      minStock: 30,
      maxStock: 400,
      reorderLevel: 50,
      unitPrice: 8500,
      warehouseIdx: 1,
      supplierIdx: 3,
    },
    {
      itemCode: "ITM-00042",
      nameEn: "Foot Valve 100mm Cast Iron",
      nameSi: "foot valve 100mm cast iron",
      categoryIdx: 2,
      unit: "pcs",
      unitSi: "ක්",
      minStock: 3,
      maxStock: 25,
      reorderLevel: 5,
      unitPrice: 22000,
      warehouseIdx: 1,
      supplierIdx: 0,
    },
    {
      itemCode: "ITM-00043",
      nameEn: "Solar Pump Controller 5kW",
      nameSi: "solar pump controller 5kW",
      categoryIdx: 5,
      unit: "pcs",
      unitSi: "ක්",
      minStock: 1,
      maxStock: 8,
      reorderLevel: 2,
      unitPrice: 195000,
      warehouseIdx: 1,
      supplierIdx: 4,
    },
    {
      itemCode: "ITM-00044",
      nameEn: 'Layflat Hose 3" 100m Roll',
      nameSi: 'layflat hose 3" 100m roll',
      categoryIdx: 0,
      unit: "roll",
      unitSi: "රෝල",
      minStock: 8,
      maxStock: 60,
      reorderLevel: 12,
      unitPrice: 28000,
      warehouseIdx: 2,
      supplierIdx: 0,
    },
    {
      itemCode: "ITM-00045",
      nameEn: "Chain Block 2 Ton",
      nameSi: "chain block 2 ton",
      categoryIdx: 3,
      unit: "pcs",
      unitSi: "ක්",
      minStock: 2,
      maxStock: 15,
      reorderLevel: 3,
      unitPrice: 35000,
      warehouseIdx: 0,
      supplierIdx: 1,
    },
    {
      itemCode: "ITM-00046",
      nameEn: "Water Level Logger",
      nameSi: "water level logger",
      categoryIdx: 5,
      unit: "pcs",
      unitSi: "ක්",
      minStock: 2,
      maxStock: 15,
      reorderLevel: 3,
      unitPrice: 85000,
      warehouseIdx: 2,
      supplierIdx: 4,
    },
    {
      itemCode: "ITM-00047",
      nameEn: "Gland Packing 12mm Graphite",
      nameSi: "gland packing 12mm graphite",
      categoryIdx: 7,
      unit: "roll",
      unitSi: "රෝල",
      minStock: 5,
      maxStock: 40,
      reorderLevel: 8,
      unitPrice: 4200,
      warehouseIdx: 1,
      supplierIdx: 4,
    },
    {
      itemCode: "ITM-00048",
      nameEn: "First Aid Kit Industrial",
      nameSi: "first aid kit industrial",
      categoryIdx: 6,
      unit: "kit",
      unitSi: "කට්ටල",
      minStock: 5,
      maxStock: 30,
      reorderLevel: 8,
      unitPrice: 8500,
      warehouseIdx: 0,
      supplierIdx: 1,
    },
    {
      itemCode: "ITM-00049",
      nameEn: "Concrete Anchor Bolt M16",
      nameSi: "concrete anchor bolt M16",
      categoryIdx: 7,
      unit: "pcs",
      unitSi: "ක්",
      minStock: 50,
      maxStock: 500,
      reorderLevel: 80,
      unitPrice: 450,
      warehouseIdx: 0,
      supplierIdx: 3,
    },
    {
      itemCode: "ITM-00050",
      nameEn: 'Venturi Fertilizer Injector 2"',
      nameSi: 'venturi fertilizer injector 2"',
      categoryIdx: 3,
      unit: "pcs",
      unitSi: "ක්",
      minStock: 4,
      maxStock: 30,
      reorderLevel: 6,
      unitPrice: 15000,
      warehouseIdx: 2,
      supplierIdx: 1,
    },
  ];

  const items = await Promise.all(
    itemDefs.map((def, idx) =>
      prisma.item.create({
        data: {
          itemCode: def.itemCode,
          barcode: `890${pad(idx + 1, 9)}`,
          nameEn: def.nameEn,
          nameSi: def.nameSi,
          categoryId: categories[def.categoryIdx]!.id,
          unit: def.unit,
          unitSi: def.unitSi,
          minStock: def.minStock,
          maxStock: def.maxStock,
          reorderLevel: def.reorderLevel,
          unitPrice: dec(def.unitPrice),
          warehouseId: warehouses[def.warehouseIdx]!.id,
          supplierId: suppliers[def.supplierIdx]!.id,
          isActive: true,
        },
      }),
    ),
  );

  // ── Inventory for all items ──────────────────────────────────────────────
  for (let idx = 0; idx < items.length; idx++) {
    const item = items[idx]!;
    const def = itemDefs[idx]!;
    const whBins = binsForWarehouse(item.warehouseId);
    const bin = whBins[randomBetween(0, whBins.length - 1)]!;
    const currentStock = randomBetween(
      Math.floor(def.minStock * 0.8),
      Math.floor(def.maxStock * 0.6),
    );
    const reservedStock = randomBetween(0, Math.floor(currentStock * 0.1));

    await prisma.inventory.create({
      data: {
        itemId: item.id,
        warehouseId: item.warehouseId,
        currentStock,
        reservedStock,
        availableStock: currentStock - reservedStock,
        binLocationId: bin.id,
        lastCounted: randomDate(new Date("2025-12-01"), new Date()),
        accuracyScore: randomBetween(95, 100),
        version: 0,
      },
    });
  }

  // ── Purchase Orders (5) ──────────────────────────────────────────────────
  const poStatuses: POStatus[] = [
    POStatus.RECEIVED,
    POStatus.APPROVED,
    POStatus.PARTIALLY_RECEIVED,
    POStatus.SUBMITTED,
    POStatus.DRAFT,
  ];

  const purchaseOrders = [];
  for (let i = 1; i <= 5; i++) {
    const wh = warehouses[i % 3]!;
    const supplier = suppliers[i % 5]!;
    const poItems = items.filter((it) => it.warehouseId === wh.id).slice(0, 3);
    if (poItems.length === 0) continue;

    const lines = poItems.map((it) => {
      const qty = randomBetween(10, 100);
      const price = Number(it.unitPrice);
      return {
        itemId: it.id,
        quantity: qty,
        unitPrice: it.unitPrice,
        tax: dec(price * qty * 0.08),
        lineTotal: dec(price * qty * 1.08),
      };
    });

    const totalAmount = lines.reduce((sum, l) => sum + Number(l.lineTotal), 0);

    const po = await prisma.purchaseOrder.create({
      data: {
        poNo: `PO-2026-${pad(i)}`,
        supplierId: supplier.id,
        warehouseId: wh.id,
        status: poStatuses[i - 1]!,
        expectedDate: randomDate(new Date("2026-01-01"), new Date("2026-06-30")),
        totalAmount: dec(totalAmount),
        notes: `Seed purchase order ${i}`,
        createdById: manager.id,
        approvedById: i <= 3 ? admin.id : undefined,
        approvedAt: i <= 3 ? new Date() : undefined,
        lines: { create: lines },
      },
    });
    purchaseOrders.push(po);
  }

  // ── GRNs (20) ────────────────────────────────────────────────────────────
  const grnStatuses: GRNStatus[] = [
    GRNStatus.APPROVED,
    GRNStatus.APPROVED,
    GRNStatus.PENDING,
    GRNStatus.DRAFT,
    GRNStatus.REJECTED,
  ];

  const grns = [];
  for (let i = 1; i <= 20; i++) {
    const wh = warehouses[i % 3]!;
    const supplier = suppliers[i % 5]!;
    const po = i <= 5 ? purchaseOrders[i - 1] : undefined;
    const grnItems = items.filter((it) => it.warehouseId === wh.id).slice(0, 2);
    const status = grnStatuses[i % grnStatuses.length]!;

    const lines = await Promise.all(
      grnItems.map(async (it) => {
        const qty = randomBetween(5, 50);
        let lotBatchId: string | undefined;
        if (i % 3 === 0) {
          const batch = await prisma.lotBatch.create({
            data: {
              batchNo: `BATCH-${pad(i)}-${it.itemCode.slice(-3)}`,
              itemId: it.id,
              expiryDate:
                it.itemCode.startsWith("ITM-0002") || it.itemCode.startsWith("ITM-00023")
                  ? randomDate(new Date("2027-01-01"), new Date("2028-12-31"))
                  : undefined,
            },
          });
          lotBatchId = batch.id;
        }
        return {
          itemId: it.id,
          orderedQty: qty,
          receivedQty: qty,
          unitPrice: it.unitPrice,
          lotBatchId,
        };
      }),
    );

    const grn = await prisma.goodsReceiptNote.create({
      data: {
        grnNo: `GRN-2026-${pad(i)}`,
        supplierId: supplier.id,
        poId: po?.id,
        warehouseId: wh.id,
        status,
        receivedDate: randomDate(new Date("2025-12-01"), new Date()),
        remarks: `Goods receipt note ${i}`,
        createdById: staff.id,
        approverId: status === GRNStatus.APPROVED ? supervisor.id : undefined,
        approvedAt: status === GRNStatus.APPROVED ? new Date() : undefined,
        lines: { create: lines },
      },
    });
    grns.push(grn);
  }

  // ── GINs (10) ────────────────────────────────────────────────────────────
  const gins = [];
  for (let i = 1; i <= 10; i++) {
    const wh = warehouses[i % 3]!;
    const ginItems = items.filter((it) => it.warehouseId === wh.id).slice(0, 2);
    const whBins = binsForWarehouse(wh.id);
    const status = i <= 6 ? GINStatus.APPROVED : i <= 8 ? GINStatus.PENDING : GINStatus.DRAFT;

    const gin = await prisma.goodsIssueNote.create({
      data: {
        ginNo: `GIN-2026-${pad(i)}`,
        issuedToId: staff.id,
        warehouseId: wh.id,
        status,
        issueDate: randomDate(new Date("2025-12-01"), new Date()),
        remarks: `Issue to field office — request ${i}`,
        createdById: supervisor.id,
        approverId: status === GINStatus.APPROVED ? manager.id : undefined,
        approvedAt: status === GINStatus.APPROVED ? new Date() : undefined,
        lines: {
          create: ginItems.map((it) => ({
            itemId: it.id,
            requestedQty: randomBetween(5, 20),
            issuedQty: randomBetween(3, 15),
            binLocationId: whBins[randomBetween(0, whBins.length - 1)]!.id,
          })),
        },
      },
    });
    gins.push(gin);
  }

  // ── Stock Entries (200 over 6 months) ────────────────────────────────────
  const sixMonthsAgo = new Date("2025-12-01");
  const now = new Date("2026-06-01");
  const entryTypes: TransactionType[] = [
    TransactionType.GOODS_RECEIVED,
    TransactionType.GOODS_ISSUED,
    TransactionType.STOCK_ADJUSTMENT,
    TransactionType.GOODS_RETURNED,
    TransactionType.DAMAGED,
  ];
  const entryMethods: EntryMethod[] = [
    EntryMethod.MANUAL,
    EntryMethod.BARCODE,
    EntryMethod.BULK_IMPORT,
  ];

  for (let i = 1; i <= 200; i++) {
    const item = items[i % items.length]!;
    const type = entryTypes[i % entryTypes.length]!;
    const qty = randomBetween(1, 50);
    const unitPrice = Number(item.unitPrice);
    const createdAt = randomDate(sixMonthsAgo, now);
    const duration = randomBetween(30, 600);
    const status =
      i % 10 === 0
        ? EntryStatus.PENDING
        : i % 17 === 0
          ? EntryStatus.REJECTED
          : EntryStatus.APPROVED;

    const linkedGrn = i % 5 === 0 ? grns[i % grns.length] : undefined;
    const linkedGin = i % 7 === 0 ? gins[i % gins.length] : undefined;

    await prisma.stockEntry.create({
      data: {
        entryNumber: `SE-2026-${pad(i, 5)}`,
        type,
        itemId: item.id,
        warehouseId: item.warehouseId,
        quantity: qty,
        unitPrice: dec(unitPrice),
        totalValue: dec(unitPrice * qty),
        referenceNo: linkedGrn?.grnNo ?? linkedGin?.ginNo ?? `REF-${pad(i)}`,
        remarks: `Seed stock entry ${i}`,
        entryMethod: entryMethods[i % entryMethods.length]!,
        entryStartTime: createdAt,
        entryEndTime: new Date(createdAt.getTime() + duration * 1000),
        entryDuration: duration,
        grnId: linkedGrn?.id,
        ginId: linkedGin?.id,
        createdById: [staff.id, supervisor.id, manager.id][i % 3]!,
        approvedById: status === EntryStatus.APPROVED ? supervisor.id : undefined,
        approvedAt: status === EntryStatus.APPROVED ? createdAt : undefined,
        status,
        createdAt,
      },
    });
  }

  // ── Physical Count Cycles (2) ────────────────────────────────────────────
  for (let c = 1; c <= 2; c++) {
    const wh = warehouses[c - 1]!;
    const countItems = items.filter((it) => it.warehouseId === wh.id).slice(0, 10);
    const whBins = binsForWarehouse(wh.id);
    const status = c === 1 ? CountStatus.COMPLETED : CountStatus.IN_PROGRESS;

    await prisma.physicalCountCycle.create({
      data: {
        cycleNo: `PCC-2026-${pad(c)}`,
        warehouseId: wh.id,
        conductedById: supervisor.id,
        approvedById: c === 1 ? manager.id : undefined,
        status,
        startedAt: new Date("2026-05-01"),
        completedAt: c === 1 ? new Date("2026-05-15") : undefined,
        approvedAt: c === 1 ? new Date("2026-05-20") : undefined,
        remarks: `Physical count cycle ${c} — ${wh.code}`,
        lines: {
          create: countItems.map((it) => {
            const expected = randomBetween(50, 500);
            const counted =
              status === CountStatus.COMPLETED ? expected + randomBetween(-5, 5) : undefined;
            return {
              itemId: it.id,
              binLocationId: whBins[randomBetween(0, whBins.length - 1)]!.id,
              expectedQty: expected,
              countedQty: counted,
              variance: counted != null ? counted - expected : undefined,
              isBlind: true,
              recountedQty: c === 1 && counted != null ? counted : undefined,
            };
          }),
        },
      },
    });
  }

  // ── KPI Records (12 months × 3 warehouses = 36) ──────────────────────────
  for (const warehouse of warehouses) {
    for (let month = 1; month <= 12; month++) {
      const year = month <= 6 ? 2025 : 2026;
      const adjustedMonth = month <= 6 ? month + 6 : month - 6;
      const recordDate = new Date(year, adjustedMonth - 1, 28);

      await prisma.kPIRecord.create({
        data: {
          warehouseId: warehouse.id,
          recordDate,
          month: adjustedMonth,
          year,
          inventoryAccuracy: 96 + Math.random() * 3.5,
          avgEntryTime: 120 + Math.random() * 180,
          orderFulfillmentRate: 92 + Math.random() * 7,
          stockTurnoverRate: 2 + Math.random() * 3,
          staffProductivity: 25 + Math.random() * 20,
          shrinkageRate: 0.5 + Math.random() * 1.5,
          pickingEfficiency: 40 + Math.random() * 25,
          totalTransactions: randomBetween(150, 400),
          totalErrors: randomBetween(2, 15),
        },
      });
    }
  }

  // ── Tasks (20) ───────────────────────────────────────────────────────────
  const taskDefs = [
    {
      titleEn: "Monthly stock count — Colombo",
      titleSi: "මාසික තොග ගණන — කොළඹ",
      taskType: TaskType.STOCK_COUNT,
      assignee: staff,
      priority: Priority.HIGH,
    },
    {
      titleEn: "Verify GRN-2026-0003 line items",
      titleSi: "GRN-2026-0003 පේළි සත්‍යාපනය",
      taskType: TaskType.GOODS_RECEIPT,
      assignee: supervisor,
      priority: Priority.URGENT,
    },
    {
      titleEn: "Update pump spare parts catalog",
      titleSi: "පොම්ප අමතර කොටස් නාමavalagu යාවත්කාලීන",
      taskType: TaskType.DATA_ENTRY,
      assignee: staff,
      priority: Priority.MEDIUM,
    },
    {
      titleEn: "Inspect Hambantota sluice gate stock",
      titleSi: "හම්බන්තොට sluice gate තොග පරීක්ෂාව",
      taskType: TaskType.INSPECTION,
      assignee: supervisor,
      priority: Priority.HIGH,
    },
    {
      titleEn: "Generate Q1 KPI report",
      titleSi: "Q1 KPI වාර්තාව ජනනය",
      taskType: TaskType.REPORT_GENERATION,
      assignee: manager,
      priority: Priority.MEDIUM,
    },
    {
      titleEn: "Process GIN for Mahaweli zone",
      titleSi: "මහවැලි කලාපය GIN සැකසීම",
      taskType: TaskType.GOODS_ISSUE,
      assignee: staff,
      priority: Priority.HIGH,
    },
    {
      titleEn: "Barcode scan audit — Zone STG",
      titleSi: "Barcode scan audit — STG",
      taskType: TaskType.INSPECTION,
      assignee: staff,
      priority: Priority.LOW,
    },
    {
      titleEn: "Reconcile PO-2026-0002 delivery",
      titleSi: "PO-2026-0002 භාරදීම සම reconcili",
      taskType: TaskType.GOODS_RECEIPT,
      assignee: supervisor,
      priority: Priority.MEDIUM,
    },
    {
      titleEn: "Safety equipment expiry check",
      titleSi: "ආරක්ෂක උපකරණ කල් ඉකුත් වීම පරීක්ෂාව",
      taskType: TaskType.INSPECTION,
      assignee: staff,
      priority: Priority.HIGH,
    },
    {
      titleEn: "Annual inventory report draft",
      titleSi: "වාර්ෂික තොග වාර්තා කෙටුම්පත",
      taskType: TaskType.REPORT_GENERATION,
      assignee: manager,
      priority: Priority.URGENT,
    },
    {
      titleEn: "Kandy warehouse bin relabeling",
      titleSi: "මහනුවර bin relabeling",
      taskType: TaskType.DATA_ENTRY,
      assignee: staff,
      priority: Priority.LOW,
    },
    {
      titleEn: "Verify HDPE pipe batch BATCH-0012",
      titleSi: "HDPE pipe batch BATCH-0012 සත්‍යාපනය",
      taskType: TaskType.INSPECTION,
      assignee: supervisor,
      priority: Priority.MEDIUM,
    },
    {
      titleEn: "Issue PVC pipes — Anuradhapura project",
      titleSi: "PVC නල නිකුත් — අනuradhapura",
      taskType: TaskType.GOODS_ISSUE,
      assignee: staff,
      priority: Priority.HIGH,
    },
    {
      titleEn: "Cycle count — Bulk zone BLK",
      titleSi: "cycle count — BLK",
      taskType: TaskType.STOCK_COUNT,
      assignee: staff,
      priority: Priority.MEDIUM,
    },
    {
      titleEn: "Update supplier contact records",
      titleSi: "supplier contact records යාවත්කාලීන",
      taskType: TaskType.DATA_ENTRY,
      assignee: admin,
      priority: Priority.LOW,
    },
    {
      titleEn: "Review pending stock entries",
      titleSi: "pending stock entries සමාලෝචනය",
      taskType: TaskType.INSPECTION,
      assignee: supervisor,
      priority: Priority.URGENT,
    },
    {
      titleEn: "Prepare Pareto analysis report",
      titleSi: "Pareto analysis වාර්තාව සූදානම",
      taskType: TaskType.REPORT_GENERATION,
      assignee: manager,
      priority: Priority.MEDIUM,
    },
    {
      titleEn: "Receive chlorine tablet shipment",
      titleSi: "chlorine tablet shipment ලැබීම",
      taskType: TaskType.GOODS_RECEIPT,
      assignee: staff,
      priority: Priority.HIGH,
    },
    {
      titleEn: "Calibrate flow meters",
      titleSi: "flow meters calibration",
      taskType: TaskType.INSPECTION,
      assignee: supervisor,
      priority: Priority.MEDIUM,
    },
    {
      titleEn: "Archive completed GIN documents",
      titleSi: "සම්පූර්ණ GIN ලේඛන archive",
      taskType: TaskType.DATA_ENTRY,
      assignee: viewer,
      priority: Priority.LOW,
    },
  ];

  const taskStatuses: TaskStatus[] = [
    TaskStatus.COMPLETED,
    TaskStatus.IN_PROGRESS,
    TaskStatus.PENDING,
    TaskStatus.OVERDUE,
    TaskStatus.CANCELLED,
  ];

  for (let i = 0; i < taskDefs.length; i++) {
    const def = taskDefs[i]!;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + randomBetween(-10, 30));
    const status = taskStatuses[i % taskStatuses.length]!;

    await prisma.task.create({
      data: {
        titleEn: def.titleEn,
        titleSi: def.titleSi,
        assignedToId: def.assignee.id,
        taskType: def.taskType,
        dueDate,
        status,
        priority: def.priority,
        completedAt: status === TaskStatus.COMPLETED ? new Date() : undefined,
        notes: `Seed task ${i + 1}`,
      },
    });
  }

  // ── Notifications (10) ───────────────────────────────────────────────────
  const notifDefs: Array<{
    userId: string;
    titleEn: string;
    titleSi: string;
    message: string;
    type: NotifType;
    link?: string;
  }> = [
    {
      userId: manager.id,
      titleEn: "Low Stock Alert",
      titleSi: "අඩු තොග අනතුරු අඟවීම",
      message: "PVC Pipe 110mm is below reorder level (180/200 m)",
      type: NotifType.LOW_STOCK,
      link: "/inventory",
    },
    {
      userId: supervisor.id,
      titleEn: "GRN Pending Approval",
      titleSi: "GRN අනුමැතිය_pending",
      message: "GRN-2026-0003 requires your approval",
      type: NotifType.APPROVAL_NEEDED,
      link: "/inbound/grn",
    },
    {
      userId: staff.id,
      titleEn: "Task Due Today",
      titleSi: "TASK අද due",
      message: "Monthly stock count — Colombo is due today",
      type: NotifType.TASK_DUE,
      link: "/tasks",
    },
    {
      userId: admin.id,
      titleEn: "KPI Below Target",
      titleSi: "KPI target යට",
      message: "Hambantota order fulfillment rate dropped to 93%",
      type: NotifType.KPI_ALERT,
      link: "/reports/kpi",
    },
    {
      userId: manager.id,
      titleEn: "GIN Pending Approval",
      titleSi: "GIN අනුමැතිය pending",
      message: "GIN-2026-0007 awaiting approval",
      type: NotifType.APPROVAL_NEEDED,
      link: "/outbound/gin",
    },
    {
      userId: staff.id,
      titleEn: "Low Stock: Chlorine Tablets",
      titleSi: "අඩු තොග: Chlorine",
      message: 'Chlorine Tablets 3" at 6 drums (reorder: 8)',
      type: NotifType.LOW_STOCK,
      link: "/inventory",
    },
    {
      userId: superAdmin.id,
      titleEn: "System Maintenance",
      titleSi: "System maintenance",
      message: "Scheduled maintenance on Sunday 02:00–04:00",
      type: NotifType.SYSTEM,
    },
    {
      userId: supervisor.id,
      titleEn: "Physical Count Started",
      titleSi: "Physical count ආරම්භ",
      message: "PCC-2026-0002 is now in progress",
      type: NotifType.SYSTEM,
      link: "/inventory/count",
    },
    {
      userId: viewer.id,
      titleEn: "Report Ready",
      titleSi: "Report ready",
      message: "Q1 KPI report has been generated",
      type: NotifType.SYSTEM,
      link: "/reports",
    },
    {
      userId: manager.id,
      titleEn: "Stock Entry Pending",
      titleSi: "Stock entry pending",
      message: "20 stock entries awaiting approval",
      type: NotifType.APPROVAL_NEEDED,
      link: "/inventory/entries",
    },
  ];

  for (let i = 0; i < notifDefs.length; i++) {
    const n = notifDefs[i]!;
    await prisma.notification.create({
      data: {
        ...n,
        isRead: i % 3 === 0,
        createdAt: randomDate(new Date("2026-05-01"), new Date()),
      },
    });
  }

  console.log("✅ Seed completed successfully");
  console.log(`   Users:      ${users.length} (password: ${SEED_PASSWORD})`);
  console.log(`   Warehouses: ${warehouses.length}`);
  console.log(`   Categories: ${categories.length}`);
  console.log(`   Suppliers:  ${suppliers.length}`);
  console.log(`   Items:      ${items.length}`);
  console.log(`   Bins:       ${allBins.length}`);
  console.log(`   GRNs:       ${grns.length}`);
  console.log(`   GINs:       ${gins.length}`);
  console.log(`   POs:        ${purchaseOrders.length}`);
  console.log(`   Stock entries: 200`);
  console.log(`   KPI records: 36 (12 months × 3 warehouses)`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
