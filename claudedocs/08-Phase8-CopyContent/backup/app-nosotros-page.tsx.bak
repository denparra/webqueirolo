import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { FadeIn } from '@/components/animations/FadeIn'
import { SlideUp } from '@/components/animations/SlideUp'
import { CheckCircleIcon, StarIcon } from '@heroicons/react/24/solid'

export default function AboutPage() {
    const team = [
        {
            name: 'Roberto Queirolo',
            role: 'Fundador & CEO',
            image: '/images/team/roberto.jpg', // Placeholder
        },
        {
            name: 'Carlos Queirolo',
            role: 'Gerente General',
            image: '/images/team/carlos.jpg', // Placeholder
        },
        {
            name: 'Ana García',
            role: 'Asesora de Ventas',
            image: '/images/team/ana.jpg', // Placeholder
        },
    ]

    const values = [
        'Transparencia Total',
        'Garantía Mecánica',
        'Asesoría Experta',
        'Post-venta Premium',
        'Financiamiento Flexible',
        'Consignación Segura'
    ]

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[400px] flex items-center justify-center bg-zinc-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/60 z-10" />
                <Image
                    src="/images/showroom.jpg" // Placeholder
                    alt="Queirolo Mundo 4x4 Showroom"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="relative z-20 container mx-auto px-4 text-center">
                    <FadeIn>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">Más que una Automotora</h1>
                        <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
                            Una tradición familiar de excelencia en vehículos 4x4 y premium en Chile.
                        </p>
                    </FadeIn>
                </div>
            </section>

            {/* History Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <SlideUp>
                            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/images/history.jpg" // Placeholder
                                    alt="Nuestra Historia"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </SlideUp>
                        <SlideUp delay={0.2} className="space-y-6">
                            <h2 className="text-3xl font-bold text-gray-900">Nuestra Historia</h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    Fundada hace más de 30 años, Queirolo Mundo 4x4 nació con una visión clara: ofrecer no solo vehículos, sino la libertad de explorar cada rincón de Chile con seguridad y confianza.
                                </p>
                                <p>
                                    Lo que comenzó como un pequeño emprendimiento familiar se ha transformado en un referente del mercado automotriz, especializándonos en camionetas, jeeps y SUVs de alta gama. Nuestra pasión por el off-road y la calidad nos distingue.
                                </p>
                                <p>
                                    Hoy, seguimos manteniendo los valores que nos vieron nacer: un trato cercano, honestidad en cada negociación y un compromiso inquebrantable con la satisfacción de nuestros clientes.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {values.map((value, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <CheckCircleIcon className="w-5 h-5 text-primary-600" />
                                        <span className="text-sm font-medium text-gray-900">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </SlideUp>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-primary-900 py-16 text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { number: '+30', label: 'Años de Experiencia' },
                            { number: '+5000', label: 'Clientes Felices' },
                            { number: '+200', label: 'Vehículos en Stock' },
                            { number: '100%', label: 'Garantía de Calidad' },
                        ].map((stat, idx) => (
                            <FadeIn key={idx} delay={idx * 0.1}>
                                <div className="text-4xl md:text-5xl font-bold mb-2 text-primary-100">{stat.number}</div>
                                <div className="text-sm md:text-base text-primary-200">{stat.label}</div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <SlideUp>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Conoce a Nuestro Equipo</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Profesionales apasionados listos para asesorarte en la búsqueda de tu próximo vehículo.
                            </p>
                        </div>
                    </SlideUp>

                    <div className="grid md:grid-cols-3 gap-8">
                        {team.map((member, idx) => (
                            <SlideUp key={idx} delay={idx * 0.2}>
                                <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow">
                                    <div className="relative aspect-[3/4] bg-gray-200">
                                        {/* Using div placeholder as we don't have images yet */}
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                            Foto de {member.name}
                                        </div>
                                    </div>
                                    <CardContent className="p-6 text-center">
                                        <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                                        <p className="text-primary-600 font-medium">{member.role}</p>
                                    </CardContent>
                                </Card>
                            </SlideUp>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Lo Que Dicen Nuestros Clientes</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <SlideUp key={i} delay={i * 0.1}>
                                <Card className="h-full">
                                    <CardContent className="p-8 space-y-4">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <StarIcon key={s} className="w-5 h-5 text-yellow-400" />
                                            ))}
                                        </div>
                                        <p className="text-gray-600 italic">
                                            &quot;Excelente atención y profesionalismo. Encontré exactamente la camioneta que buscaba y el proceso de financiamiento fue muy rápido.&quot;
                                        </p>
                                        <div>
                                            <p className="font-bold text-gray-900">Cliente Satisfecho</p>
                                            <p className="text-sm text-gray-500">Compró Toyota 4Runner</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </SlideUp>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
