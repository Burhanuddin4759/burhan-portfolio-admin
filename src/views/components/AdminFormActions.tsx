import AdminSaveButton from './AdminSaveButton'

type Props = {
  saving?: boolean
  onSave: () => void
  onCancel: () => void
  saveLabel?: string
  savingLabel?: string
  disabled?: boolean
}

export default function AdminFormActions({
  saving = false,
  onSave,
  onCancel,
  saveLabel = 'Save',
  savingLabel = 'Saving...',
  disabled = false,
}: Props) {
  return (
    <div className="admin-form-actions">
      <AdminSaveButton
        saving={saving}
        onClick={onSave}
        label={saveLabel}
        savingLabel={savingLabel}
        disabled={disabled}
      />
      <button
        type="button"
        className="admin-btn admin-btn--ghost"
        onClick={onCancel}
        disabled={saving}
      >
        Cancel
      </button>
    </div>
  )
}
