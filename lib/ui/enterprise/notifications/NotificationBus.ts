import { InfrastructureEventBus } from "@/lib/infrastructure/events/InfrastructureEventBus";

export type UIEvent = {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  timestamp: string;
};

type SubscriberCallback = (event: UIEvent) => void;

export class NotificationBus {
  private static subscribers: Set<SubscriberCallback> = new Set();
  private static history: UIEvent[] = [];

  static subscribe(callback: SubscriberCallback) {
    this.subscribers.add(callback);
    return () => { this.subscribers.delete(callback); };
  }

  static getHistory() {
    return this.history;
  }

  static emit(event: UIEvent) {
    this.history.unshift(event);
    if (this.history.length > 50) this.history.pop();
    this.subscribers.forEach(cb => cb(event));
  }

  static bridgeInfrastructureEvents() {
    // Forward backend events to the UI
    InfrastructureEventBus.subscribe("MediaAssetUploaded", () => {
      this.emit({
        id: crypto.randomUUID(),
        type: "success",
        title: "Media Uploaded",
        message: "Asset sent to processing queue.",
        timestamp: new Date().toISOString()
      });
    });
    
    // Add other relevant system events...
  }
}
