import { FiSave } from 'react-icons/fi'

type Props = {
  saving?: boolean
  onClick: () => void
  label?: string
  savingLabel?: string
  disabled?: boolean
}

export default function AdminSaveButton({
  saving = false,
  onClick,
  label = 'Save',
  savingLabel = 'Saving...',
  disabled = false,
}: Props) {
  return (
    <button
      type="button"
      className="admin-btn admin-btn--primary"
      onClick={onClick}
      disabled={saving || disabled}
    >
      {saving ? (
        <>
          <span className="admin-btn-spinner" aria-hidden="true" />
          {savingLabel}
        </>
      ) : (
        <>
          <FiSave />
          {label}
        </>
      )}
    </button>
  )
}
