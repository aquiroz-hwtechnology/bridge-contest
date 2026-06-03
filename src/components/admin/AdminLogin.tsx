import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/store/useStore';
import { Shield, Eye, EyeOff } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const { login } = useStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      onSuccess();
    } else {
      setError('Contrasena incorrecta');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-sm animate-fade-in">
        <div className="px-6 py-8 text-center" style={{ background: 'linear-gradient(135deg, #1a2456 0%, #273475 100%)' }}>
          <div className="bg-white rounded-xl p-3 w-fit mx-auto mb-4">
            <img
              src="/bridge-contest/images/unipaz-identidad.svg"
              alt="UNIPAZ"
              className="h-12 w-auto"
            />
          </div>
          <h2 className="text-xl font-bold text-white">Panel Administrativo</h2>
          <p className="text-indigo-300 text-sm mt-2">Acceso restringido &bull; IAS UNIPAZ</p>
        </div>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contrasena
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Ingrese la contrasena"
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#273475]/40 focus:border-[#273475]/50 outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full">
              Ingresar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
