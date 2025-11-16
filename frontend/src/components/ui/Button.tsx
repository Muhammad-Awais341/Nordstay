type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' }
export function Button({ variant='primary', className='', ...rest }: Props) {
  const base = 'inline-flex items-center justify-center rounded-button px-4 h-10 text-sm font-medium transition'
  const styles = variant === 'primary'
    ? 'bg-primary text-white hover:bg-primary-hover'
    : 'hover:bg-muted'
  return <button className={`${base} ${styles} ${className}`} {...rest} />
}
