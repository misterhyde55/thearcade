"use client";

import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { LOCKDOWN_ACTIONS } from "@/lib/mock-data";

export function LockdownModal({ open, onClose, onActivated }: { open: boolean; onClose: () => void; onActivated: (actionIds: string[]) => void }) {
  const [selected, setSelected] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(LOCKDOWN_ACTIONS.map((a) => [a.id, a.enabledByDefault]))
  );
  const { push } = useToast();

  function toggle(id: string) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function activate() {
    const active = LOCKDOWN_ACTIONS.filter((a) => selected[a.id]).map((a) => a.id);
    onActivated(active);
    push({
      kind: "warning",
      title: "Lockdown Mode engaged",
      description: `${active.length} of ${LOCKDOWN_ACTIONS.length} protections active. You can adjust or stand down anytime from Stream Manager.`
    });
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Lockdown Mode" maxWidthClassName="max-w-lg">
      <div className="mb-4 flex items-start gap-2 rounded-md border border-brand-red/30 bg-brand-red/[0.06] p-3 text-sm text-ink-muted">
        <ShieldAlert size={16} className="mt-0.5 shrink-0 text-brand-red" />
        <p>Choose exactly which protections to activate. Nothing here is permanent — you can turn any of it off the moment things calm down.</p>
      </div>
      <div className="space-y-2">
        {LOCKDOWN_ACTIONS.map((action) => (
          <label
            key={action.id}
            className="flex items-start justify-between gap-3 rounded-md border border-surface-border px-3.5 py-2.5 hover:border-surface-borderStrong"
          >
            <span>
              <span className="block text-sm font-medium text-ink">{action.label}</span>
              <span className="block text-xs text-ink-faint">{action.description}</span>
            </span>
            <input
              type="checkbox"
              checked={Boolean(selected[action.id])}
              onChange={() => toggle(action.id)}
              className="mt-1 accent-brand-red"
            />
          </label>
        ))}
      </div>
      <button
        onClick={activate}
        className="focus-ring mt-4 flex w-full items-center justify-center gap-1.5 rounded-md bg-brand-red py-2.5 text-sm font-semibold text-white hover:bg-brand-red/90"
      >
        <ShieldAlert size={15} /> Activate Lockdown Mode
      </button>
    </Modal>
  );
}
