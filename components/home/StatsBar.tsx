interface Stat {
  value: string
  label: string
}

const stats: Stat[] = [
  { value: '60+', label: 'Anos de experiencia' },
  { value: '500+', label: 'Autos vendidos' },
  { value: 'Las Condes', label: 'Santiago, Chile' },
  { value: '100%', label: 'Financiamiento' },
]

export function StatsBar() {
  return (
    <div className="mx-auto max-w-5xl rounded-xl bg-white/10 px-4 py-4 backdrop-blur-sm sm:px-8 sm:py-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-white/20">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-xl font-bold text-white sm:text-2xl">{stat.value}</p>
            <p className="text-xs text-gray-300 sm:text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
