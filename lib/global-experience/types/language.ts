export interface Language {
  id: string; // e.g., "en", "hi", "ar", "fr"
  label: string; // e.g., "English", "Hindi", "Arabic", "French"
  localLabel: string; // e.g., "English", "हिन्दी", "العربية", "Français"
  isRtl: boolean; // Future proofing, though we do not implement RTL layouts yet
}
