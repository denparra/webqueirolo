import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { FadeIn } from '@/components/animations/FadeIn'
import { SlideUp } from '@/components/animations/SlideUp'
import { CheckCircleIcon, StarIcon } from '@heroicons/react/24/solid'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Nuestra Historia - Queirolo Autos',
    description: 'Conoce la historia de Queirolo Autos. Más de 60 años de tradición familiar, confianza y pasión por los autos en Chile.',
}

export default function AboutPage() {
    const team = [
        {
            name: 'Mario Queirolo',
            role: 'Dueño',
            image: '/images/team/mario.jpg',
            imageAlt: 'Auto clásico de Turismo Carretera, legado automovilístico de Mario Queirolo',
            bio: 'Representa la continuación del legado automovilístico de la familia Queirolo en Chile. Al igual que su padre, Don Mario Queirolo Stagnaro, también se destacó como corredor de autos en competencias de Turismo Carretera, demostrando la misma pasión por la velocidad y el automovilismo que marcó generaciones.',
        },
    ]

    const values = [
        'Confianza',
        'Cercanía',
        'Pasión por los autos'
    ]

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[400px] flex items-center justify-center bg-zinc-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/60 z-10" />
                <Image
                    src="/images/showroom.jpg" // Placeholder
                    alt="Showroom Queirolo Autos"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="relative z-20 container mx-auto px-4 text-center">
                    <FadeIn>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">Más que una Automotora</h1>
                        <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
                            Conoce nuestra historia y el compromiso que nos mueve.
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
                                    Queirolo Autos nace en los años 50-60, fundada por Don Mario Queirolo Stagnaro, quien comenzó con Frenos Queirolo, un local ubicado en el centro de Santiago dedicado a la reparación de frenos y la importación de autos y repuestos.
                                </p>
                                <p>
                                    Proveniente de una familia italiana que migró a Chile entre 1890 y 1910, Don Mario también fue un apasionado corredor de Turismo Carretera, dejando un fuerte legado automovilístico en su familia.
                                </p>
                                <p>
                                    Con los años, la empresa evolucionó desde la importación hasta convertirse en Queirolo Mundo 4x4 y luego en la actual Queirolo Autos, adaptándose a cada época, incluso durante tiempos difíciles como el estallido social y la pandemia.
                                </p>
                                <p>
                                    Hoy somos una empresa consolidada, reconocida por nuestra calidad, cercanía y pasión por los autos, manteniéndonos siempre como un proyecto familiar con valores firmes y auténticos.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">Misión</h3>
                                    <p className="mt-2 text-gray-600">
                                        Ofrecemos soluciones automotrices confiables, transparentes y cercanas para personas que buscan un vehículo de calidad, acompañándolas en todo el proceso con pasión y experiencia.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">Valores</h3>
                                    <div className="mt-3 grid grid-cols-2 gap-4">
                                        {values.map((value, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <CheckCircleIcon className="w-5 h-5 text-primary-600" />
                                                <span className="text-sm font-medium text-gray-900">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
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
                            { number: '+60', label: 'Años de Experiencia' },
                            { number: '+10.000', label: 'Familias Atendidas' },
                            { number: '+10.000', label: 'Vehículos Vendidos' },
                            { number: '~50', label: 'Vehículos en Stock' },
                        ].map((stat, idx) => (
                            <FadeIn key={idx} delay={idx * 0.1}>
                                <div className="text-4xl md:text-5xl font-bold mb-2 text-primary-100">{stat.number}</div>
                                <div className="text-sm md:text-base text-primary-200">{stat.label}</div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Guarantee Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="rounded-lg bg-primary-50 p-8">
                        <h2 className="mb-4 text-3xl font-bold text-gray-900">Garantía Disponible</h2>
                        <p className="text-gray-700">
                            En Queirolo Autos trabajamos con GarantíaTotal.com, una empresa reconocida en protección de vehículos usados. La garantía cubre fallas mecánicas en sistemas importantes, incluye repuestos y mano de obra, y cuenta con red de talleres a nivel nacional.
                        </p>
                        <p className="mt-4 text-sm text-gray-600">
                            La garantía es proporcionada por un tercero especializado. Consulta las condiciones específicas al momento de la compra.
                        </p>
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
                                Un equipo familiar listo para acompañarte en la búsqueda de tu próximo auto.
                            </p>
                        </div>
                    </SlideUp>

                    <div className="grid md:grid-cols-3 gap-8">
                        {team.map((member, idx) => (
                            <SlideUp key={idx} delay={idx * 0.2}>
                                <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow">
                                    <div className="relative aspect-[3/4] bg-gray-200">
                                        {member.image ? (
                                            <Image
                                                src={member.image}
                                                alt={member.imageAlt}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                Foto de {member.name}
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="p-6 text-center">
                                        <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                                        <p className="text-primary-600 font-medium">{member.role}</p>
                                        <p className="mt-3 text-sm text-gray-600">{member.bio}</p>
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
                                            &quot;Excelente atención y transparencia. Me explicaron todo con claridad y me acompañaron en el proceso.&quot;
                                        </p>
                                        <div>
                                            <p className="font-bold text-gray-900">Cliente Satisfecho</p>
                                            <p className="text-sm text-gray-500">Compró un auto seminuevo</p>
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
