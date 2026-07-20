import { Observability } from "@/lib/infrastructure/observability";
export type IamEventType = 
  | "UserLoggedIn" 
  | "UserLoggedOut" 
  | "RoleChanged" 
  | "PermissionChanged" 
  | "SessionExpired" 
  | "SessionRevoked"
  | "LoginFailed"
  | "PasswordResetRequested"
  | "PasswordChanged"
  | "AccountLocked"
  | "AccountUnlocked";

export interface IamEvent {
  eventId: string;
  eventType: IamEventType;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

export interface IIamEventBus {
  publish(event: IamEvent): void;
  subscribe(handler: (event: IamEvent) => void | Promise<void>): void;
}

export class InMemoryIamEventBus implements IIamEventBus {
  private handlers: Array<(event: IamEvent) => void | Promise<void>> = [];

  publish(event: IamEvent): void {
    // In a real application, this could publish to Kafka, Pub/Sub, etc.
    // For now, we fan out to in-memory listeners asynchronously.
    setTimeout(() => {
      this.handlers.forEach(handler => {
        try {
          handler(event);
        } catch (e) {
          Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")(`[InMemoryIamEventBus] Error in handler for event ${event.eventType}`, e);
        }
      });
    }, 0);
  }

  subscribe(handler: (event: IamEvent) => void | Promise<void>): void {
    this.handlers.push(handler);
  }
}
