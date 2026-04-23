import styles from './Button.module.css'

interface Props {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'dark' | 'edit'
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  disabled?: boolean
  fullWidth?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled = false,
  fullWidth = false,
}: Props) {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[variant]} ${fullWidth ? styles.fullWidth : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}