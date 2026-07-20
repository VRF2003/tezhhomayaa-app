import { DashboardWidget } from "../types";

export class WidgetRegistry {
  private static widgets: Map<string, DashboardWidget> = new Map();

  static register(widget: DashboardWidget) {
    this.widgets.set(widget.id, widget);
  }

  static get(id: string): DashboardWidget | undefined {
    return this.widgets.get(id);
  }

  static getAll(): DashboardWidget[] {
    return Array.from(this.widgets.values());
  }
}
