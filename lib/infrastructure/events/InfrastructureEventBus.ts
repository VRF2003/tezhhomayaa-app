export type EventCallback = (payload: any) => void | Promise<void>;

export class InfrastructureEventBus {
  private static listeners: Record<string, EventCallback[]> = {};

  static subscribe(event: string, callback: EventCallback): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  static async publish(event: string, payload: any): Promise<void> {
    const callbacks = this.listeners[event] || [];
    // We execute event callbacks concurrently but await them to ensure ordering if needed.
    // In a distributed system, this would push to an event stream like Kafka/RabbitMQ.
    await Promise.all(callbacks.map(cb => cb(payload)));
  }

  static clear(): void {
    this.listeners = {};
  }
}
