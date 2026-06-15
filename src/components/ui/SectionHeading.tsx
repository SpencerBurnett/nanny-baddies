interface SectionHeadingProps {
  label?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  light?: boolean
}

export default function SectionHeading({ label, title, subtitle, align = 'center', light = false }: SectionHeadingProps) {
  return (
    <div className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : 'text-left'} mb-16`}>
      {label && (
        <span className="inline-block text-gold text-sm font-semibold tracking-[0.2em] uppercase mb-4">
          {label}
        </span>
      )}
      <h2 className={`font-display text-4xl md:text-5xl font-medium leading-tight ${light ? 'text-warm-white' : 'text-warm-white'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-lg text-muted leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
