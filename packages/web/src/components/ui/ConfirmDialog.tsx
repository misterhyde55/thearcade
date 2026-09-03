"use client";

import { Modal } from "./Modal";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className="text-sm text-ink-muted">{description}</p>
      <div className="mt-5 flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="focus-ring rounded-md border border-surface-border px-4 py-2 text-sm font-medium text-ink-muted hover:bg-surface-panel2 hover:text-ink"
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          className={`focus-ring rounded-md px-4 py-2 text-sm font-semibold text-white ${
            destructive ? "bg-brand-red hover:bg-brand-red/90" : "bg-brand-magenta hover:bg-brand-magenta/90"
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
