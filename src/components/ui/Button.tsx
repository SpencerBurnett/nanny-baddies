import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  to?: string
  children: ReactNode
}

const base = 'inline-flex items-center justify-center font-medium tracking-wide transition-all duration-300 cursor-pointer'

const variants = {
  primary: 'bg-gold text-midnight hover:bg-gold-light shadow-lg shadow-gold/20',
  secondary: 'bg-charcoal text-warm-white border border-slate-dark hover:border-gold/50 hover:text-gold',
  outline: 'bg-transparent text-gold border-2 border-gold hover:bg-gold hover:text-midnight',
}

const sizes = {
  sm: 'px-5 py-2.5 text-sm rounded-lg',
  md: 'px-7 py-3.5 text-base rounded-xl',
  lg: 'px-10 py-4.5 text-lg rounded-xl',
}

export default function Button({ variant = 'primary', size = 'md', to, children, className = '', ...props }: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
