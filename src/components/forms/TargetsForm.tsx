import { useState, useEffect, useCallback } from "react";
import { MonthData, Product } from "../../types";
import { getMonthLabel } from "../../utils/dateUtils";
import { useI18n } from "../../i18n/I18nContext";

interface Props {
  month: string;
  data: MonthData;
  products: Product[];
  onSave: (next: MonthData) => void;
}

type FieldMap = Record<string, string>;

export function TargetsForm({ month, data, products, onSave }: Props) {
  const { t, lang } = useI18n();
  const [values, setValues] = useState<FieldMap>(() => {
    const m: FieldMap = {};
    products.forEach(p => { m[p.id] = String(data[p.id]?.target || 0); });
    return m;
  });

  useEffect(() => {
    const m: FieldMap = {};
    products.forEach(p => { m[p.id] = String(data[p.id]?.target || 0); });
    setValues(m);
  }, [data, products, month]);

  const handleChange = useCallback((id: string, v: string) => {
    setValues(prev => ({ ...prev, [id]: v }));
  }, []);

  const handleSubmit = useCallback(() => {
    const next: MonthData = { ...data };
    products.forEach(p => {
      next[p.id] = { ...next[p.id], target: parseFloat(values[p.id]) || 0 };
    });
    onSave(next);
  }, [data, values, products, onSave]);

  return (
    <div className="tab-content">
      <div className="card form-section">
        <h3 className="form-section__title">{t.targets_title(getMonthLabel(month, lang))}</h3>
        <p className="form-section__hint">{t.targets_hint}</p>
        {products.map(p => (
          <div key={p.id} className="field">
            <label className="field__label">
              <span>{p.emoji}</span>
              {p.name}
              <span className="field__unit">{p.unit}</span>
            </label>
            <input
              type="number"
              className="input"
              min={0}
              inputMode="decimal"
              pattern="[0-9]*"
              placeholder={t.targets_placeholder}
              value={values[p.id] === "0" ? "" : values[p.id] || ""}
              onChange={(e) => handleChange(p.id, e.target.value)}
            />
          </div>
        ))}
        <button className="btn btn--gold btn--block" onClick={handleSubmit}>
          {t.targets_save}
        </button>
      </div>
    </div>
  );
}
