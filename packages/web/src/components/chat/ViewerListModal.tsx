import { Modal } from "@/components/ui/Modal";
import { SIMULATED_USERNAMES } from "@/lib/chat-constants";

export function ViewerListModal({ open, onClose, viewerCount }: { open: boolean; onClose: () => void; viewerCount: number }) {
  return (
    <Modal open={open} onClose={onClose} title={`Viewers (${viewerCount.toLocaleString()})`}>
      <p className="mb-3 text-xs text-ink-faint">Showing a sample of chat participants for this demo.</p>
      <ul className="space-y-1.5">
        {SIMULATED_USERNAMES.map((u) => (
          <li key={u.username} className="flex items-center gap-2 text-sm">
            <span className="h-2 w-2 rounded-full" style={{ background: u.color }} />
            <span style={{ color: u.color }}>{u.username}</span>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
