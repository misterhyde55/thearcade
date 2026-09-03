// Every control that can't fully function without real infrastructure
// routes through this so the message stays consistent instead of guessing
// which service is missing on a per-button basis.

export type BackendService =
  | "video-ingest"
  | "payments"
  | "email"
  | "moderation-ai"
  | "storage"
  | "realtime-chat";

export const BACKEND_SERVICE_LABEL: Record<BackendService, string> = {
  "video-ingest": "a live video provider (Cloudflare Stream, Mux, or Amazon IVS)",
  payments: "Stripe Connect",
  email: "a transactional email provider",
  "moderation-ai": "an automated moderation/Trust & Safety service",
  storage: "object storage (e.g. Cloudflare R2 or S3) for VODs and uploads",
  "realtime-chat": "the live chat WebSocket service"
};

export function backendRequiredMessage(service: BackendService): string {
  return `This action needs ${BACKEND_SERVICE_LABEL[service]} connected. It's wired for demo purposes only right now.`;
}
