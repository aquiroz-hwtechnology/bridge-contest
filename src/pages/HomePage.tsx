import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Vote, BarChart3, Shield, Users, Trophy } from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero text-white py-12 md:py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* UNIPAZ Logo */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-lg shadow-black/20">
              <img
                src="/bridge-contest/images/unipaz-identidad.svg"
                alt="UNIPAZ Logo"
                className="h-20 md:h-28 w-auto"
              />
            </div>
          </div>

          {/* Contest Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
            Primer Concurso de Puentes
          </h1>
          <p className="text-base md:text-lg text-indigo-200 mb-1 font-medium">
            Programas de Tecnologia en Obras Civiles e Ingenieria Civil
          </p>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="unipaz-separator bg-white/40"></div>
            <p className="text-sm md:text-base text-indigo-300 font-semibold tracking-wide">
              IAS &mdash; UNIPAZ
            </p>
            <div className="unipaz-separator bg-white/40"></div>
          </div>

          <p className="text-indigo-300 text-sm mb-8">
            Sistema de Votacion Electronica &bull; Barrancabermeja, 2026
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => onNavigate('vote')}
              className="text-lg px-8"
            >
              <Vote className="w-5 h-5" /> Votar Ahora
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate('dashboard')}
              className="text-lg px-8 border-white/30 text-white hover:bg-white/10"
            >
              <BarChart3 className="w-5 h-5" /> Ver Resultados
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">
            Como Funciona
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
            Evalua los prototipos de puentes construidos por estudiantes de UNIPAZ de manera rapida y sencilla
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover className="text-center">
              <CardContent className="py-8">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#273475' + '1a' }}>
                  <Users className="w-7 h-7" style={{ color: '#273475' }} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">1. Registrate</h3>
                <p className="text-gray-500 text-sm">
                  Ingresa tus datos como jurado evaluador externo del concurso
                </p>
              </CardContent>
            </Card>

            <Card hover className="text-center">
              <CardContent className="py-8">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#009738' + '1a' }}>
                  <Vote className="w-7 h-7" style={{ color: '#009738' }} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">2. Evalua</h3>
                <p className="text-gray-500 text-sm">
                  Califica cada puente en estetica y ficha tecnica con nuestro slider interactivo
                </p>
              </CardContent>
            </Card>

            <Card hover className="text-center">
              <CardContent className="py-8">
                <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-7 h-7 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">3. Resultados</h3>
                <p className="text-gray-500 text-sm">
                  Visualiza el ranking en tiempo real con graficos interactivos
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Institutional Info */}
      <section className="py-12 px-4" style={{ backgroundColor: '#f0f1f7' }}>
        <div className="max-w-4xl mx-auto text-center">
          <img
            src="/bridge-contest/images/unipaz-identidad.svg"
            alt="UNIPAZ"
            className="h-16 mx-auto mb-4"
          />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Instituto Universitario de la Paz</h3>
          <p className="text-gray-600 text-sm mb-1">Escuela de Ingenieria Ambiental y de Saneamiento</p>
          <p className="text-gray-500 text-xs">Barrancabermeja, Santander &bull; Colombia</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-gray-300 py-8 px-4 text-center" style={{ backgroundColor: '#1a2456' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="/bridge-contest/images/unipaz-identidad.svg"
              alt="UNIPAZ"
              className="h-8 brightness-0 invert"
            />
            <div className="unipaz-separator bg-white/30 h-6"></div>
            <span className="font-semibold text-white text-sm">Concurso de Puentes 2026</span>
          </div>
          <p className="text-sm text-indigo-300">
            Programas de Tecnologia en Obras Civiles e Ingenieria Civil
          </p>
          <p className="text-xs mt-2 text-indigo-400">
            Sistema de Votacion Electronica &bull; IAS UNIPAZ
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => onNavigate('admin')}
              className="text-xs text-indigo-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <Shield className="w-3 h-3" /> Administracion
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
