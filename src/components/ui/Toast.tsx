import { ToastState } from "../../types";

interface Props {
  toast: ToastState | null;
}

export function Toast({ toast }: Props) {
  if (!toast) return null;
  return (
    <div className={`toast ${toast.ok ? "toast--ok" : "toast--err"}`}>
      {toast.msg}
    </div>
  );
}
