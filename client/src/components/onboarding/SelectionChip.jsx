import { Chip } from '../ui'

function SelectionChip({ label, selected = false, disabled = false, icon, onClick }) {
  return (
    <Chip label={label} selected={selected} disabled={disabled} icon={icon} onClick={onClick} />
  )
}

export default SelectionChip