import { Modal } from "@/components/ui/Modal";
import { COMMUNITY_GUIDELINES } from "@/lib/chat-constants";

export function GuidelinesModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Community guidelines">
      <ol className="list-decimal space-y-2.5 pl-4">
        {COMMUNITY_GUIDELINES.map((g) => (
          <li key={g} className="text-sm text-ink-muted">
            {g}
          </li>
        ))}
      </ol>
    </Modal>
  );
}
