import { Button } from '../ui'

function ContinueButton({ loading, disabled, children, ...props }) {
  return (
    <Button
      type="button"
      variant="primary"
      size="xl"
      fullWidth
      loading={loading}
      disabled={disabled}
      {...props}
    >
      {children}
    </Button>
  )
}

export default ContinueButton