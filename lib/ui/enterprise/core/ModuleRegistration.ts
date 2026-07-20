import { NavItem, DashboardWidget, CommandAction } from "../types";
import { NavigationRegistry } from "../registry/NavigationRegistry";
import { WidgetRegistry } from "../registry/WidgetRegistry";
import { CommandRegistry } from "../registry/CommandRegistry";

export abstract class ModuleRegistration {
  abstract readonly moduleId: string;

  /**
   * Called to register the module's UI components into the Enterprise Shell
   */
  abstract register(): void;

  protected registerNavigation(item: NavItem) {
    NavigationRegistry.register(item);
  }

  protected registerWidget(widget: DashboardWidget) {
    WidgetRegistry.register(widget);
  }

  protected registerCommand(command: CommandAction) {
    CommandRegistry.register(command);
  }
}
