import { CommandAction } from "../types";

export class CommandRegistry {
  private static commands: Map<string, CommandAction> = new Map();

  static register(command: CommandAction) {
    this.commands.set(command.id, command);
  }

  static getAll(): CommandAction[] {
    return Array.from(this.commands.values());
  }

  static search(query: string): CommandAction[] {
    const lower = query.toLowerCase();
    return this.getAll().filter(cmd => 
      cmd.title.toLowerCase().includes(lower) || 
      (cmd.subtitle && cmd.subtitle.toLowerCase().includes(lower))
    );
  }
}
