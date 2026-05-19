import { useState, useCallback } from "react";
import { useT } from "../../i18n/I18nContext";

interface Props {
  onSave: (name: string, jobTitle: string) => void;
}

export function WelcomeModal({ onSave }: Props) {
  const t = useT();
  const [name, setName] = useState("");
  const [job, setJob] = useState("");

  const valid = name.trim().length > 0 && job.trim().length > 0;

  const handleSubmit = useCallback(() => {
    if (!valid) return;
    onSave(name.trim(), job.trim());
  }, [name, job, valid, onSave]);

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal__emoji">📊</div>
        <h2 className="modal__title">{t.welcome_title}</h2>
        <p className="modal__subtitle">{t.welcome_subtitle}</p>
        <input
          className="input modal__input"
          placeholder={t.welcome_name_ph}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && valid && handleSubmit()}
          autoFocus
        />
        <input
          className="input modal__input"
          placeholder={t.welcome_job_ph}
          value={job}
          onChange={(e) => setJob(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && valid && handleSubmit()}
        />
        <button
          className="btn btn--gold btn--block"
          onClick={handleSubmit}
          disabled={!valid}
        >
          {t.welcome_start}
        </button>
      </div>
    </div>
  );
}
