import { useState, useEffect, useCallback, useMemo } from "react";
import { MonthData, Product, DailyEntry } from "../../types";
import { getMonthLabel, formatNum } from "../../utils/dateUtils";
import { pctColor } from "../../utils/statsUtils";
import { ProgressBar } from "../ui/ProgressBar";
import { useI18n, formatDateAr } from "../../i18n/I18nContext";

interface Props {
  month: string;
  isCurrentMonth: boolean;
  data: MonthData;
  products: Product[];
  dailyEntries: DailyEntry[];
  onUpsertDaily: (date: string, values: Record<string, number>) => void;
  onDeleteDaily: (date: string) => void;
  onSaveCumulative: (next: MonthData) => void;
}

type FieldMap = Record<string, string>;

function todayDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function AchievementsForm({
  month, isCurrentMonth, data, products,
  dailyEntries, onUpsertDaily, onDeleteDaily, onSaveCumulative
}: Props) {
  if (isCurrentMonth) {
    return (
      <DailyMode
        data={data}
        products={products}
        entries={dailyEntries}
        onUpsert={onUpsertDaily}
        onDelete={onDeleteDaily}
      />
    );
  }
  return (
    <CumulativeMode
      month={month}
      data={data}
      products={products}
      onSave={onSaveCumulative}
    />
  );
}

function DailyMode({ data, products, entries, onUpsert, onDelete }: {
  data: MonthData;
  products: Product[];
  entries: DailyEntry[];
  onUpsert: (date: string, values: Record<string, number>) => void;
  onDelete: (date: string) => void;
}) {
  const { t, lang } = useI18n();
  const today = useMemo(() => todayDate(), []);
  const monthStart = useMemo(() => `${today.slice(0, 7)}-01`, [today]);

  const [selectedDate, setSelectedDate] = useState<string>(today);
  const selectedEntry = useMemo(
    () => entries.find(e => e.date === selectedDate),
    [entries, selectedDate]
  );
  const isToday = selectedDate === today;

  const [values, setValues] = useState<FieldMap>(() => {
    const m: FieldMap = {};
    products.forEach(p => { m[p.id] = String(selectedEntry?.values[p.id] ?? 0); });
    return m;
  });

  useEffect(() => {
    const m: FieldMap = {};
    products.forEach(p => { m[p.id] = String(selectedEntry?.values[p.id] ?? 0); });
    setValues(m);
  }, [selectedEntry, products, selectedDate]);

  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<FieldMap>({});

  const handleChange = useCallback((id: string, v: string) => {
    setValues(prev => ({ ...prev, [id]: v }));
  }, []);

  const handleSaveSelected = useCallback(() => {
    const out: Record<string, number> = {};
    products.forEach(p => { out[p.id] = parseFloat(values[p.id]) || 0; });
    onUpsert(selectedDate, out);
  }, [products, values, selectedDate, onUpsert]);

  const handleStartEdit = useCallback((entry: DailyEntry) => {
    const m: FieldMap = {};
    products.forEach(p => { m[p.id] = String(entry.values[p.id] ?? 0); });
    setEditValues(m);
    setEditingDate(entry.date);
  }, [products]);

  const handleSaveEdit = useCallback(() => {
    if (!editingDate) return;
    const out: Record<string, number> = {};
    products.forEach(p => { out[p.id] = parseFloat(editValues[p.id]) || 0; });
    onUpsert(editingDate, out);
    setEditingDate(null);
  }, [editingDate, editValues, products, onUpsert]);

  const recent = useMemo(() => entries.slice(0, 10), [entries]);

  return (
    <div className="tab-content">
      <div className="card form-section">
        <h3 className="form-section__title">
          {isToday
            ? t.ach_today_title(formatDateAr(selectedDate, lang))
            : t.ach_pastday_title(formatDateAr(selectedDate, lang))}
        </h3>
        <p className="form-section__hint">
          {isToday ? t.ach_today_hint : t.ach_pastday_hint}
        </p>

        <div className="field">
          <label className="field__label">
            <span>📅</span>
            {t.ach_date_label}
            {!isToday && (
              <button
                type="button"
                className="btn"
                style={{
                  marginInlineStart: "auto", padding: "4px 12px", fontSize: "0.72rem",
                  background: "var(--bg-elevated)", color: "var(--text-secondary)"
                }}
                onClick={() => setSelectedDate(today)}
              >
                {t.ach_back_today}
              </button>
            )}
          </label>
          <input
            type="date"
            className="input"
            value={selectedDate}
            min={monthStart}
            max={today}
            onChange={(e) => {
              const v = e.target.value;
              if (v && v >= monthStart && v <= today) setSelectedDate(v);
            }}
          />
        </div>

        {products.map(p => {
          const tgt = data[p.id]?.target || 0;
          return (
            <div key={p.id} className="field">
              <label className="field__label">
                <span>{p.emoji}</span>
                {p.name}
                {tgt > 0 && (
                  <span className="field__unit">
                    {t.ach_month_target(formatNum(tgt, lang), p.unit)}
                  </span>
                )}
              </label>
              <input
                type="number"
                className="input"
                min={0}
                inputMode="decimal"
                pattern="[0-9]*"
                placeholder={isToday ? t.ach_input_today_ph : t.ach_input_pastday_ph}
                value={values[p.id] === "0" ? "" : values[p.id] || ""}
                onChange={(e) => handleChange(p.id, e.target.value)}
              />
            </div>
          );
        })}
        <button className="btn btn--gold btn--block" onClick={handleSaveSelected}>
          {isToday ? t.ach_save_today : selectedEntry ? t.ach_update_pastday : t.ach_add_pastday}
        </button>
      </div>

      <div className="card form-section">
        <div className="daily-section-title">{t.ach_history_title}</div>
        {recent.length === 0 ? (
          <div className="daily-empty">{t.ach_history_empty}</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="daily-table">
              <thead>
                <tr>
                  <th>{t.ach_history_th_date}</th>
                  {products.map(p => <th key={p.id}>{p.emoji}</th>)}
                  <th>{t.ach_history_th_pct}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recent.map(e => {
                  const isEditing = editingDate === e.date;
                  const dayScore = products.reduce((s, p) => {
                    const tgt = data[p.id]?.target || 0;
                    if (tgt <= 0) return s;
                    const v = Number(e.values[p.id]) || 0;
                    const pct = Math.min((v / tgt) * 100, 100);
                    return s + pct * ((p.weight || 0) / 100);
                  }, 0);
                  return (
                    <tr
                      key={e.date}
                      className={isEditing ? "daily-edit-row" : ""}
                      onClick={() => !isEditing && handleStartEdit(e)}
                      style={{ cursor: isEditing ? "default" : "pointer" }}
                    >
                      <td>{formatDateAr(e.date, lang)}</td>
                      {products.map(p => (
                        <td key={p.id}>
                          {isEditing ? (
                            <input
                              type="number"
                              className="input daily-edit-input"
                              min={0}
                              inputMode="decimal"
                              value={editValues[p.id] || ""}
                              onChange={(ev) => {
                                ev.stopPropagation();
                                setEditValues(prev => ({ ...prev, [p.id]: ev.target.value }));
                              }}
                              onClick={(ev) => ev.stopPropagation()}
                            />
                          ) : (
                            formatNum(e.values[p.id] || 0, lang)
                          )}
                        </td>
                      ))}
                      <td className="daily-table__total">{dayScore.toFixed(1)}%</td>
                      <td>
                        {isEditing ? (
                          <button
                            className="btn btn--gold"
                            style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                            onClick={(ev) => { ev.stopPropagation(); handleSaveEdit(); }}
                          >
                            {t.common_save}
                          </button>
                        ) : (
                          <button
                            className="daily-table__del"
                            aria-label={`${t.common_delete} ${e.date}`}
                            onClick={(ev) => {
                              ev.stopPropagation();
                              if (window.confirm(t.ach_delete_confirm(formatDateAr(e.date, lang)))) {
                                onDelete(e.date);
                              }
                            }}
                          >×</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function CumulativeMode({ month, data, products, onSave }: {
  month: string;
  data: MonthData;
  products: Product[];
  onSave: (next: MonthData) => void;
}) {
  const { t, lang } = useI18n();
  const [values, setValues] = useState<FieldMap>(() => {
    const m: FieldMap = {};
    products.forEach(p => { m[p.id] = String(data[p.id]?.achieved || 0); });
    return m;
  });

  useEffect(() => {
    const m: FieldMap = {};
    products.forEach(p => { m[p.id] = String(data[p.id]?.achieved || 0); });
    setValues(m);
  }, [data, products, month]);

  const handleChange = useCallback((id: string, v: string) => {
    setValues(prev => ({ ...prev, [id]: v }));
  }, []);

  const handleSubmit = useCallback(() => {
    const next: MonthData = { ...data };
    products.forEach(p => {
      const v = values[p.id];
      if (v !== "" && v !== undefined) {
        next[p.id] = { ...next[p.id], achieved: parseFloat(v) || 0 };
      }
    });
    onSave(next);
  }, [data, values, products, onSave]);

  return (
    <div className="tab-content">
      <div className="card form-section">
        <h3 className="form-section__title">{t.cum_title(getMonthLabel(month, lang))}</h3>
        <p className="form-section__hint">{t.cum_hint}</p>
        {products.map(p => {
          const tgt = data[p.id]?.target || 0;
          const val = parseFloat(values[p.id]) || 0;
          const pct = tgt > 0 ? (val / tgt) * 100 : 0;
          const color = pctColor(pct);
          return (
            <div key={p.id} className="field">
              <div className="field__row">
                <label className="field__label" style={{ marginBottom: 0 }}>
                  <span>{p.emoji}</span>
                  {p.name}
                </label>
                {tgt > 0 && (
                  <span className="field__pct" style={{ color }}>
                    {pct.toFixed(0)}%
                  </span>
                )}
              </div>
              {tgt > 0 && <ProgressBar pct={pct} color={p.color} />}
              <input
                type="number"
                className="input"
                style={{ marginTop: tgt > 0 ? 8 : 0 }}
                min={0}
                inputMode="decimal"
                pattern="[0-9]*"
                placeholder={tgt > 0
                  ? t.cum_placeholder_with_target(formatNum(tgt, lang), p.unit)
                  : t.cum_placeholder_no_target}
                value={values[p.id] === "0" ? "" : values[p.id] || ""}
                onChange={(e) => handleChange(p.id, e.target.value)}
              />
            </div>
          );
        })}
        <button className="btn btn--gold btn--block" onClick={handleSubmit}>
          {t.cum_save}
        </button>
      </div>
    </div>
  );
}
