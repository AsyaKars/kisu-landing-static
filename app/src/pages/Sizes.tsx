import { useEffect } from 'react';
import Header from '@/sections/Header';
import Footer from '@/sections/Footer';
import { useApi } from '@/hooks/use-api';
import { API_ENDPOINTS } from '@/config/api';

function TableHead({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr className="bg-kisu-orange text-white text-[10px] sm:text-xs font-bold uppercase tracking-wide">
        {cols.map((col) => (
          <th key={col} className="px-2 py-2 sm:px-4 sm:py-3 text-left border border-kisu-orange">
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function TableRow({ cells, highlight }: { cells: string[]; highlight?: boolean }) {
  return (
    <tr className="border-b border-gray-100 hover:bg-orange-50/40 transition-colors">
      {cells.map((cell, i) => (
        <td
          key={i}
          className={`px-2 py-2 sm:px-4 sm:py-3 border border-gray-200 text-xs sm:text-sm ${
            highlight ? 'text-kisu-orange font-medium' : 'text-kisu-text-dark'
          }`}
        >
          {cell}
        </td>
      ))}
    </tr>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-kisu-orange font-heading font-bold text-lg uppercase tracking-wider mt-10 mb-4">
      {children}
    </h2>
  );
}

function GroupTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-kisu-text-dark font-heading font-bold text-2xl uppercase tracking-wide mt-10 mb-6 pb-2 border-b-2 border-kisu-orange/30">
      {children}
    </h3>
  );
}

/* ── Types ──────────────────────────────────────────────────── */

type SiteSetting = {
  id: number;
  setting_key: string;
  setting_value: string;
};

type SizeTable = {
  id: number;
  group_label: string;
  table_name: string;
  category: string;
  columns_json: string;
  rows_json: string;
  order_index: number;
  is_active: boolean;
};

/* ── Fallback data ─────────────────────────────────────────── */

const DEFAULT_TIPS = [
  'Обхват груди — измеряйте строго горизонтально в самом широком месте.',
  'Обхват талии — измеряйте по естественной линии талии в самом узком месте.',
  'Обхват бёдер — измеряйте горизонтально по самым выступающим точкам бёдер.',
  'Рост — высота тела, измеряемая без обуви; попросите ребёнка прислониться к стене, проведите черту над макушкой и измерьте расстояние до пола.',
];

const TIP_LABELS = [
  'Обхват груди',
  'Обхват талии',
  'Обхват бёдер',
  'Рост',
];

const DEFAULT_CONTACT_NOTE =
  'По вопросам подбора размера обращайтесь по телефону +7 (495) 640-19-83 или на email sales@kisu.ru.';

/* ── Hardcoded fallback tables ─────────────────────────────── */

const FALLBACK_ACCESSORIES: SizeTable[] = [
  {
    id: -1, group_label: '', table_name: 'Варежки, перчатки', category: 'accessories', order_index: 1, is_active: true,
    columns_json: '["Размер","Возраст"]',
    rows_json: '[["11–12","6–24 месяцев"],["13–14","2–6 лет"],["15–16","7–10 лет"]]',
  },
  {
    id: -2, group_label: '', table_name: 'Рукавицы', category: 'accessories', order_index: 2, is_active: true,
    columns_json: '["Размер","Возраст"]',
    rows_json: '[["1","12 месяцев"],["2","12–24 месяца"],["3","2–3 года"],["4","4–5 лет"],["6","6–7 лет"],["8","7–10 лет"]]',
  },
  {
    id: -3, group_label: '', table_name: 'Головные уборы', category: 'accessories', order_index: 3, is_active: true,
    columns_json: '["Размер (см)","Возраст"]',
    rows_json: '[["46","9–12 месяцев"],["48","12–24 месяца"],["50","2–3 года"],["52","4–5 лет"],["54","5–7 лет"],["56","7–15 лет"]]',
  },
];

const FALLBACK_OUTERWEAR: SizeTable[] = [
  {
    id: -4, group_label: 'Комплекты, куртки, комбинезоны, полукомбинезоны', table_name: 'Малыши', category: 'outerwear', order_index: 4, is_active: true,
    columns_json: '["Размер","Возраст","Обхват груди (см)"]',
    rows_json: '[["56","0–3 месяца","40"],["62","3 месяца","42"],["68","6 месяцев","44"],["74","9 месяцев","46"],["80","12 месяцев","48"],["86","18 месяцев","50"]]',
  },
  {
    id: -5, group_label: '', table_name: 'Baby', category: 'outerwear', order_index: 5, is_active: true,
    columns_json: '["Размер","Возраст","Обхват груди (см)","Обхват талии (см)","Обхват бёдер (см)"]',
    rows_json: '[["74","9 месяцев","46","44","50"],["80","12 месяцев","48","46","52"],["86","18 месяцев","50","48","54"],["92","24 месяца","52","50","56"],["98","3 года","54","52","58"]]',
  },
  {
    id: -6, group_label: '', table_name: 'Junior Girls', category: 'outerwear', order_index: 6, is_active: true,
    columns_json: '["Размер","Возраст","Обхват груди (см)","Обхват талии (см)","Обхват бёдер (см)"]',
    rows_json: '[["104","4 года","57","54","59"],["110","5 лет","59","56","62"],["116","6 лет","61","58","65"],["122","7 лет","63","59","68"],["128","8 лет","66","60","71"],["134","9 лет","69","61","74"],["140","10 лет","72","62","77"]]',
  },
  {
    id: -7, group_label: '', table_name: 'Teen Girls', category: 'outerwear', order_index: 7, is_active: true,
    columns_json: '["Размер","Возраст","Обхват груди (см)","Обхват талии (см)","Обхват бёдер (см)"]',
    rows_json: '[["146","11 лет","75","63","80"],["152","12 лет","78","64","83"],["158","13 лет","82","65","86"]]',
  },
  {
    id: -8, group_label: '', table_name: 'Teen Boys', category: 'outerwear', order_index: 8, is_active: true,
    columns_json: '["Размер","Возраст","Обхват груди (см)","Обхват талии (см)","Обхват бёдер (см)"]',
    rows_json: '[["146","11 лет","76","68","79"],["152","12 лет","79","70","82"],["158","13 лет","83","72","86"]]',
  },
];

function safeJson<T>(json: string, fallback: T): T {
  try { return JSON.parse(json) as T; } catch { return fallback; }
}

/* ── Table renderer ────────────────────────────────────────── */

function SizeTableBlock({ table }: { table: SizeTable }) {
  const cols = safeJson<string[]>(table.columns_json, []);
  const rows = safeJson<string[][]>(table.rows_json, []).map((r) => r.map(String));
  return (
    <div>
      <SectionTitle>{table.table_name}</SectionTitle>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 rounded-xl overflow-hidden mb-8">
          <TableHead cols={cols} />
          <tbody>
            {rows.map((row, ri) => (
              <TableRow key={ri} cells={row} highlight={ri % 2 === 0} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────── */

export default function Sizes() {
  const { data: settings } = useApi<SiteSetting[]>(API_ENDPOINTS.SETTINGS);
  const { data: sizeTables } = useApi<SizeTable[]>(API_ENDPOINTS.SIZE_TABLES);

  const getSetting = (key: string, fallback: string): string =>
    settings?.find((s) => s.setting_key === key)?.setting_value ?? fallback;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const tips = DEFAULT_TIPS.map((fallback, i) =>
    getSetting(`sizes_measurement_tip_${i + 1}`, fallback)
  );

  const contactNote = getSetting('sizes_contact_note', DEFAULT_CONTACT_NOTE);

  /* If API returned tables, use them; otherwise use hardcoded fallback */
  const accessoryTables = sizeTables
    ? sizeTables.filter((t) => t.category === 'accessories' && t.is_active)
    : FALLBACK_ACCESSORIES;

  const outerwearTables = sizeTables
    ? sizeTables.filter((t) => t.category === 'outerwear' && t.is_active)
    : FALLBACK_OUTERWEAR;

  /* Collect unique non-empty group_labels for outerwear section titles */
  const getGroupLabel = (tables: SizeTable[], index: number): string | null => {
    const t = tables[index];
    if (!t?.group_label) return null;
    if (index > 0 && tables[index - 1].group_label === t.group_label) return null;
    return t.group_label;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header onPartnerClick={() => {}} forceScrolled />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-12 xl:px-20 py-32 lg:py-40">
        <div className="max-w-5xl mx-auto">

          {/* Page title */}
          <h1 className="text-3xl lg:text-4xl font-heading font-bold text-kisu-text-dark uppercase tracking-wide mb-8">
            Таблицы соответствия размеров
          </h1>

          {/* Как снять мерки */}
          <div className="bg-kisu-bg-light rounded-2xl p-6 mb-10">
            <p className="text-kisu-orange font-semibold mb-3">Как правильно снять мерки:</p>
            <ul className="space-y-1.5 text-sm text-kisu-text-gray leading-relaxed">
              {tips.map((tip, i) => (
                <li key={i}>
                  <span className="text-kisu-orange font-medium">{TIP_LABELS[i]}</span>{' '}
                  — {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Аксессуары — 2 колонки на десктопе */}
          <div className="grid sm:grid-cols-2 gap-6">
            {accessoryTables.map((t) => (
              <SizeTableBlock key={t.id} table={t} />
            ))}
          </div>

          {/* Комплекты, куртки, комбинезоны */}
          {outerwearTables.length > 0 && (
            <>
              {/* Show the first non-empty group_label as GroupTitle */}
              {(() => {
                const firstGroup = outerwearTables.find((t) => t.group_label)?.group_label;
                return firstGroup ? <GroupTitle>{firstGroup}</GroupTitle> : (
                  <GroupTitle>Комплекты, куртки, комбинезоны, полукомбинезоны</GroupTitle>
                );
              })()}
              {outerwearTables.map((t, i) => {
                const label = getGroupLabel(outerwearTables, i);
                return (
                  <div key={t.id}>
                    {label && i > 0 && <GroupTitle>{label}</GroupTitle>}
                    <SizeTableBlock table={t} />
                  </div>
                );
              })}
            </>
          )}

          {/* Контактная заметка */}
          <p className="text-sm text-kisu-text-gray mt-6">{contactNote}</p>

        </div>
      </main>

      <Footer />
    </div>
  );
}
