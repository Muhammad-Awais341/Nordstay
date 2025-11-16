type Props = React.InputHTMLAttributes<HTMLInputElement> & { label?: string }
export function Input({ label, id, className='', ...rest }: Props) {
  const inputId = id || `in-${Math.random().toString(36).slice(2)}`
  return (
    <label htmlFor={inputId} className="block">
      {label && <span className="mb-1 block text-sm">{label}</span>}
      <input id={inputId} className={`w-full h-10 rounded-input border border-border px-3 outline-none focus:ring-2 focus:ring-primary ${className}`} {...rest}/>
    </label>
  )
}
