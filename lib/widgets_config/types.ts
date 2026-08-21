export interface WidgetOption {
  label: Record<string, string>;
  value: string;
}

export interface WidgetField {
  name: string;
  label: Record<string, string>;
  type: 'text' | 'select' | 'color';
  defaultValue: string;
  options?: WidgetOption[];
}

export interface WidgetDef {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  category: string;
  fields: WidgetField[];
}
