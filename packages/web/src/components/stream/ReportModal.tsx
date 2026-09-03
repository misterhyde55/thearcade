"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";

const REASONS = ["Harassment or bullying", "Hateful conduct", "Spam or scam", "Sexual content", "Violence or threats", "Copyright violation", "Other"];

export function ReportModal({ open, onClose, targetLabel }: { open: boolean; onClose: () => void; targetLabel: string }) {
  const [reason, setReason] = useState(REASONS[0]);
  const [details, setDetails] = useState("");
  const { push } = useToast();

  function submit() {
    push({
      kind: "success",
      title: "Report submitted",
      description: "Trust & Safety typically reviews reports within 24-48 hours. You can track any resulting case in your Moderation center."
    });
    setDetails("");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={`Report ${targetLabel}`}>
      <fieldset>
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">Reason</legend>
        <div className="space-y-1.5">
          {REASONS.map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm text-ink">
              <input type="radio" name="report-reason" checked={reason === r} onChange={() => setReason(r)} className="accent-brand-red" />
              {r}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="mt-3 block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">Additional details (optional)</span>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={3}
          className="focus-ring w-full rounded-md border border-surface-border bg-surface-raised px-3 py-2 text-sm text-ink outline-none placeholder:text-ink-faint"
          placeholder="Timestamps, context, or anything else reviewers should know."
        />
      </label>
      <button onClick={submit} className="focus-ring mt-4 w-full rounded-md bg-brand-red py-2.5 text-sm font-semibold text-white hover:bg-brand-red/90">
        Submit report
      </button>
    </Modal>
  );
}
