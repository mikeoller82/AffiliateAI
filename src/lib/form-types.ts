

export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'phone'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'file';

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // For select, radio, checkbox
}

export interface FormSettings {
  id: string; // Identifier for the form itself
  name: string;
  submitButtonText: string;
  successMessage: string;
  redirectUrl?: string;
  ownerId?: string; // ID of the user/workspace that owns this form
}
