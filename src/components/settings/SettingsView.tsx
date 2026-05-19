import { useState, useMemo, useCallback } from "react";
import { Product, PRESET_EMOJIS, PRESET_COLORS, PRESET_UNITS } from "../../types";
import { useT } from "../../i18n/I18nContext";

interface Props {
  products: Product[];
  employeeName: string;
  jobTitle: string;
  onSaveProducts: (products: Product[]) => void;
  onSaveEmployee: (name: string, jobTitle: string) => void;
  notify: (msg: string, ok?: boolean) => void;
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "id-" + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

export function SettingsView({
  products, employeeName, jobTitle,
  onSaveProducts, onSaveEmployee, notify
}: Props) {
  const t = useT();
  const [list, setList] = useState<Product[]>(products);
  const [showAdd, setShowAdd] = useState(false);

  const [nName, setNName] = useState("");
  const [nShort, setNShort] = useState("");
  const [nEmoji, setNEmoji] = useState(PRESET_EMOJIS[0]);
  const [nUnit, setNUnit] = useState(PRESET_UNITS[0]);
  const [nColor, setNColor] = useState(PRESET_COLORS[0]);
  const [nWeight, setNWeight] = useState<string>("0");

  const [name, setName] = useState(employeeName);
  const [job, setJob] = useState(jobTitle);

  const totalWeight = useMemo(
    () => list.reduce((s, p) => s + (Number(p.weight) || 0), 0),
    [list]
  );

  const canSaveProducts = totalWeight === 100 && list.length > 0;

  const updateWeight = useCallback((id: string, v: string) => {
    const w = Math.max(0, Math.min(100, Number(v) || 0));
    setList(prev => prev.map(p => p.id === id ? { ...p, weight: w } : p));
  }, []);

  const handleDelete = useCallback((id: string) => {
    const target = list.find(p => p.id === id);
    if (!target) return;
    if (!window.confirm(t.settings_delete_confirm(target.name))) return;
    setList(prev => prev.filter(p => p.id !== id));
  }, [list, t]);

  const resetForm = () => {
    setNName(""); setNShort(""); setNEmoji(PRESET_EMOJIS[0]);
    setNUnit(PRESET_UNITS[0]); setNColor(PRESET_COLORS[0]); setNWeight("0");
  };

  const handleAdd = useCallback(() => {
    if (!nName.trim() || !nShort.trim()) {
      notify(t.settings_name_short_required, false);
      return;
    }
    const w = Math.max(0, Math.min(100, Number(nWeight) || 0));
    const product: Product = {
      id: newId(),
      name: nName.trim(),
      short: nShort.trim().slice(0, 6),
      emoji: nEmoji,
      unit: nUnit,
      color: nColor,
      weight: w
    };
    setList(prev => [...prev, product]);
    resetForm();
    setShowAdd(false);
  }, [nName, nShort, nEmoji, nUnit, nColor, nWeight, notify, t]);

  const handleSaveProducts = useCallback(() => {
    if (!canSaveProducts) return;
    onSaveProducts(list);
    notify(t.toast_products_saved);
  }, [canSaveProducts, list, onSaveProducts, notify, t]);

  const handleSaveEmployee = useCallback(() => {
    if (!name.trim() || !job.trim()) {
      notify(t.settings_employee_required, false);
      return;
    }
    onSaveEmployee(name.trim(), job.trim());
    notify(t.toast_employee_saved);
  }, [name, job, onSaveEmployee, notify, t]);

  return (
    <div className="tab-content">
      <div className="card settings-section">
        <h3 className="settings-section__title">{t.settings_products_title}</h3>
        <p className="settings-section__hint">{t.settings_products_hint}</p>

        {list.map(p => (
          <div key={p.id} className="product-row">
            <span className="product-row__emoji">{p.emoji}</span>
            <div>
              <div className="product-row__name">{p.name}</div>
              <div className="product-row__short">{p.short} · {p.unit}</div>
            </div>
            <input
              type="number"
              className="input product-row__weight-input"
              value={p.weight}
              min={0}
              max={100}
              inputMode="decimal"
              onChange={(e) => updateWeight(p.id, e.target.value)}
              aria-label={`${t.settings_form_weight} ${p.name}`}
            />
            <span className="product-row__dot" style={{ background: p.color }} />
            <button
              className="product-row__del"
              onClick={() => handleDelete(p.id)}
              aria-label={`${t.common_delete} ${p.name}`}
            >×</button>
          </div>
        ))}

        <div className={`weight-total ${totalWeight === 100 ? "weight-total--ok" : "weight-total--bad"}`}>
          <span>{t.settings_total_weight}</span>
          <span>
            {totalWeight}%
            {totalWeight !== 100 && ` (${t.settings_total_must_be_100})`}
          </span>
        </div>

        {!showAdd ? (
          <button
            className="btn btn--ghost btn--block"
            style={{ marginTop: 12 }}
            onClick={() => setShowAdd(true)}
          >
            {t.settings_add_product}
          </button>
        ) : (
          <div className="add-form">
            <div className="form-grid">
              <div>
                <label className="field__label">{t.settings_form_name}</label>
                <input
                  className="input"
                  value={nName}
                  onChange={(e) => setNName(e.target.value)}
                />
              </div>
              <div>
                <label className="field__label">{t.settings_form_short}</label>
                <input
                  className="input"
                  maxLength={6}
                  value={nShort}
                  onChange={(e) => setNShort(e.target.value)}
                  placeholder={t.settings_form_short_ph}
                />
              </div>
            </div>

            <label className="field__label">{t.settings_form_emoji}</label>
            <div className="preset-grid preset-grid--emoji">
              {PRESET_EMOJIS.map(e => (
                <button
                  key={e}
                  type="button"
                  className={`preset-cell ${nEmoji === e ? "preset-cell--active" : ""}`}
                  onClick={() => setNEmoji(e)}
                >{e}</button>
              ))}
            </div>

            <div className="form-grid">
              <div>
                <label className="field__label">{t.settings_form_unit}</label>
                <select className="select" value={nUnit} onChange={(e) => setNUnit(e.target.value)}>
                  {PRESET_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="field__label">{t.settings_form_weight}</label>
                <input
                  type="number"
                  className="input"
                  min={0}
                  max={100}
                  inputMode="decimal"
                  value={nWeight}
                  onChange={(e) => setNWeight(e.target.value)}
                />
              </div>
            </div>

            <label className="field__label">{t.settings_form_color}</label>
            <div className="preset-grid preset-grid--color">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  className={`preset-cell preset-cell--color ${nColor === c ? "preset-cell--active" : ""}`}
                  style={{ background: c }}
                  onClick={() => setNColor(c)}
                  aria-label={c}
                />
              ))}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn--gold" style={{ flex: 1 }} onClick={handleAdd}>
                {t.settings_form_save}
              </button>
              <button
                className="btn btn--ghost"
                onClick={() => { resetForm(); setShowAdd(false); }}
              >
                {t.settings_form_cancel}
              </button>
            </div>
          </div>
        )}

        <button
          className="btn btn--gold btn--block"
          onClick={handleSaveProducts}
          disabled={!canSaveProducts}
          style={{ marginTop: 14 }}
        >
          {t.settings_save_changes}
        </button>
      </div>

      <div className="card settings-section">
        <h3 className="settings-section__title">{t.settings_employee_title}</h3>
        <p className="settings-section__hint">{t.settings_employee_hint}</p>

        <div className="field">
          <label className="field__label">{t.settings_employee_name}</label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field__label">{t.settings_employee_job}</label>
          <input
            className="input"
            value={job}
            onChange={(e) => setJob(e.target.value)}
          />
        </div>
        <button className="btn btn--gold btn--block" onClick={handleSaveEmployee}>
          {t.settings_employee_save}
        </button>
      </div>

      <p className="footer" style={{ marginTop: 16 }}>{t.developer_credit}</p>
    </div>
  );
}
