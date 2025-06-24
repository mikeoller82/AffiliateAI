
'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { FormField, FormSettings } from '@/lib/form-types';
import { Separator } from '../ui/separator';

interface SettingsPanelProps {
  selectedField: FormField | null;
  onUpdateField: (id: string, newProps: Partial<FormField>) => void;
  onClearSelection: () => void;
  formSettings: FormSettings;
  onUpdateFormSettings: (settings: Partial<FormSettings>) => void;
}

export function SettingsPanel({ selectedField, onUpdateField, onClearSelection, formSettings, onUpdateFormSettings }: SettingsPanelProps) {
  if (!selectedField) {
      return (
          <div>
            <h2 className="text-lg font-semibold mb-4">Form Settings</h2>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="form-name">Form Name</Label>
                    <Input
                        id="form-name"
                        value={formSettings.name}
                        onChange={(e) => onUpdateFormSettings({ name: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="form-submit-text">Submit Button Text</Label>
                    <Input
                        id="form-submit-text"
                        value={formSettings.submitButtonText}
                        onChange={(e) => onUpdateFormSettings({ submitButtonText: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="form-success-message">Success Message</Label>
                    <Textarea
                        id="form-success-message"
                        value={formSettings.successMessage}
                        onChange={(e) => onUpdateFormSettings({ successMessage: e.target.value })}
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="form-redirect-url">Redirect URL (Optional)</Label>
                    <Input
                        id="form-redirect-url"
                        placeholder="https://example.com/thank-you"
                        value={formSettings.redirectUrl || ''}
                        onChange={(e) => onUpdateFormSettings({ redirectUrl: e.target.value })}
                    />
                </div>
            </div>
            <Separator className="my-6" />
             <p className="text-sm text-muted-foreground">Select a field on the canvas to edit its properties.</p>
          </div>
      );
  }

  return (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">{selectedField.label} Settings</h2>
            <Button variant="ghost" size="sm" onClick={onClearSelection}>Done</Button>
        </div>
        <div className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="field-label">Label</Label>
                <Input
                    id="field-label"
                    value={selectedField.label}
                    onChange={(e) => onUpdateField(selectedField.id, { label: e.target.value })}
                />
            </div>
             <div className="space-y-2">
                <Label htmlFor="field-placeholder">Placeholder</Label>
                <Input
                    id="field-placeholder"
                    value={selectedField.placeholder || ''}
                    onChange={(e) => onUpdateField(selectedField.id, { placeholder: e.target.value })}
                />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-3">
                <Label htmlFor="field-required">Required</Label>
                <Switch
                    id="field-required"
                    checked={selectedField.required}
                    onCheckedChange={(checked) => onUpdateField(selectedField.id, { required: checked })}
                />
            </div>
        </div>
    </div>
  );
}
