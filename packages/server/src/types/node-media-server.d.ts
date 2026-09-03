declare module "node-media-server" {
  interface NodeMediaServerConfig {
    rtmp?: Record<string, unknown>;
    http?: Record<string, unknown>;
    trans?: Record<string, unknown>;
  }

  interface Session {
    reject(): void;
  }

  type NmsEvent = "prePublish" | "postPublish" | "donePublish" | "preConnect" | "doneConnect";

  export default class NodeMediaServer {
    constructor(config: NodeMediaServerConfig);
    run(): void;
    stop(): void;
    on(event: NmsEvent, handler: (id: string, streamPath: string, args?: unknown) => void): void;
    getSession(id: string): Session | undefined;
  }
}
