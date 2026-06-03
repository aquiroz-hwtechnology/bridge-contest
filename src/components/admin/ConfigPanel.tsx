import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/store/useStore';
import { Settings, Save, AlertTriangle } from 'lucide-react';

export function ConfigPanel() {
  const { config, updateConfig, resetVotes, votes } = useStore();
  const [weights, setWeights] = useState(config.weights);
  const [contestName, setContestName] = useState(config.contestName);
  const [contestDate, setContestDate] = useState(config.contestDate);
  const [newPassword, setNewPassword] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const totalWeight = weights.loadWeight + weights.aesthetic + weights.video + weights.technicalSheet;

  const handleSaveWeights = () => {
    if (totalWeight !== 100) return;
    updateConfig({ weights, contestName, contestDate });
  };

  const handleSavePassword = () => {
    if (newPassword.trim()) {
      updateConfig({ adminPassword: newPassword });
      setNewPassword('');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <Settings className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-bold text-gray-800">Configuracion General</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Concurso</label>
            <input
              type="text"
              value={contestName}
              onChange={(e) => setContestName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#273475]/40 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha del Concurso</label>
            <input
              type="date"
              value={contestDate}
              onChange={(e) => setContestDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#273475]/40 outline-none"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold text-gray-800">Ponderacion de Criterios</h3>
          <p className="text-sm text-gray-500">La suma debe ser exactamente 100%</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Carga/Peso (%)</label>
              <input
                type="number"
                value={weights.loadWeight}
                onChange={(e) => setWeights({ ...weights, loadWeight: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#273475]/40 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Estetica (%)</label>
              <input
                type="number"
                value={weights.aesthetic}
                onChange={(e) => setWeights({ ...weights, aesthetic: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#273475]/40 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Video (%)</label>
              <input
                type="number"
                value={weights.video}
                onChange={(e) => setWeights({ ...weights, video: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#273475]/40 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Ficha Tecnica (%)</label>
              <input
                type="number"
                value={weights.technicalSheet}
                onChange={(e) => setWeights({ ...weights, technicalSheet: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#273475]/40 outline-none"
              />
            </div>
          </div>

          <div className={`flex items-center justify-between p-3 rounded-lg ${totalWeight === 100 ? 'bg-green-50' : 'bg-red-50'}`}>
            <span className="text-sm font-medium">Total:</span>
            <span className={`font-bold ${totalWeight === 100 ? 'text-green-600' : 'text-red-600'}`}>
              {totalWeight}%
            </span>
          </div>

          <Button onClick={handleSaveWeights} disabled={totalWeight !== 100}>
            <Save className="w-4 h-4" /> Guardar Configuracion
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold text-gray-800">Seguridad</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nueva Contrasena</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#273475]/40 outline-none"
              placeholder="Dejar vacio para mantener la actual"
            />
          </div>
          <Button onClick={handleSavePassword} disabled={!newPassword.trim()} size="sm">
            Cambiar Contrasena
          </Button>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <h3 className="text-lg font-bold text-red-700">Zona de Peligro</h3>
        </CardHeader>
        <CardContent>
          {!showResetConfirm ? (
            <Button variant="danger" onClick={() => setShowResetConfirm(true)}>
              <AlertTriangle className="w-4 h-4" /> Reiniciar Todos los Votos ({votes.length} votos)
            </Button>
          ) : (
            <div className="space-y-3 p-4 bg-red-50 rounded-xl">
              <p className="text-sm text-red-700">
                Esto eliminara todos los votos permanentemente. Esta accion no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <Button variant="ghost" size="sm" onClick={() => setShowResetConfirm(false)}>
                  Cancelar
                </Button>
                <Button variant="danger" size="sm" onClick={() => { resetVotes(); setShowResetConfirm(false); }}>
                  Confirmar Reinicio
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
