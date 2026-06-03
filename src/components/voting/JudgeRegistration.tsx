import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { generateJudgeId } from '@/lib/utils';
import { Building2, GraduationCap, Landmark } from 'lucide-react';

interface JudgeRegistrationProps {
  onRegister: (judgeId: string) => void;
}

export function JudgeRegistration({ onRegister }: JudgeRegistrationProps) {
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [type, setType] = useState<'empresarial' | 'academico' | 'institucional'>('empresarial');

  const typeOptions = [
    { value: 'empresarial' as const, label: 'Empresarial', icon: Building2, activeColor: 'bg-[#273475]/10 text-[#273475] border-[#273475]/40' },
    { value: 'academico' as const, label: 'Academico', icon: GraduationCap, activeColor: 'bg-purple-100 text-purple-700 border-purple-300' },
    { value: 'institucional' as const, label: 'Institucional', icon: Landmark, activeColor: 'bg-[#009738]/10 text-[#009738] border-[#009738]/40' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !organization.trim()) return;

    const judgeId = generateJudgeId();
    const judgeInfo = { id: judgeId, name, organization, type };
    localStorage.setItem('judge_info', JSON.stringify(judgeInfo));
    localStorage.setItem('judge_id', judgeId);
    onRegister(judgeId);
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-fade-in">
        {/* Header with UNIPAZ branding */}
        <div className="px-6 py-8 text-center" style={{ background: 'linear-gradient(135deg, #273475 0%, #3a4a9a 100%)' }}>
          <div className="bg-white rounded-xl p-3 w-fit mx-auto mb-4">
            <img
              src="/bridge-contest/images/unipaz-identidad.svg"
              alt="UNIPAZ"
              className="h-14 w-auto"
            />
          </div>
          <h2 className="text-xl font-bold text-white">Registro de Jurado Evaluador</h2>
          <p className="text-indigo-200 text-sm mt-2">Primer Concurso de Puentes &bull; IAS UNIPAZ 2026</p>
        </div>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ingrese su nombre"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#273475]/40 focus:border-[#273475]/50 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Organizacion / Empresa
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Nombre de su empresa u organizacion"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#273475]/40 focus:border-[#273475]/50 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Tipo de Evaluador
              </label>
              <div className="grid grid-cols-3 gap-2">
                {typeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setType(option.value)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                        type === option.value
                          ? option.activeColor
                          : 'border-gray-100 text-gray-400 hover:border-gray-200'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full">
              Comenzar Evaluacion
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
