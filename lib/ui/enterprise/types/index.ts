import { ReactNode } from "react";

export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon?: ReactNode;
  group?: "Home" | "Commerce" | "Content" | "Marketing" | "System" | "Platform" | "Settings";
  requiredPermissions?: { action: string, resource: string }[];
  order?: number;
  always?: boolean;
  subItems?: { id: string; label: string; href: string }[];
};

export type WidgetContext = {
  moduleId: string;
  permissions: string[];
};

export type WidgetComponent = (props: { context: WidgetContext }) => ReactNode;

export type DashboardWidget = {
  id: string;
  title: string;
  component: WidgetComponent;
  requiredPermissions?: string[];
  defaultLayout?: { w: number, h: number };
};

export type CommandAction = {
  id: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  onSelect: () => void;
  requiredPermissions?: string[];
};
