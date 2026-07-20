import { NavItem } from "../types";

export class NavigationRegistry {
  private static items: Map<string, NavItem> = new Map();

  static register(item: NavItem) {
    this.items.set(item.id, item);
  }

  static unregister(id: string) {
    this.items.delete(id);
  }

  static getAll(): NavItem[] {
    return Array.from(this.items.values()).sort((a, b) => (a.order || 99) - (b.order || 99));
  }

  static getGrouped(): Record<string, NavItem[]> {
    const all = this.getAll();
    const grouped: Record<string, NavItem[]> = {};
    for (const item of all) {
      const group = item.group || "Platform";
      if (!grouped[group]) grouped[group] = [];
      grouped[group].push(item);
    }
    return grouped;
  }
}
