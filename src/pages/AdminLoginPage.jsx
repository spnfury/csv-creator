import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Lock, LogIn } from 'lucide-react';

const AdminLoginPage = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e) => {
    e.preventDefault();
    // In a real application, this should be a secure check against a backend.
    // For this environment, we'll use a hardcoded password.
    // Replace "supersecret" with a more secure password, ideally from an environment variable.
    if (password === 'supersecret') {
      localStorage.setItem('isAdminAuthenticated', 'true');
      toast({
        title: '¡Acceso concedido!',
        description: 'Redirigiendo al panel de administración...',
      });
      navigate('/admin/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Acceso denegado',
        description: 'La contraseña es incorrecta.',
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login - CSV Creator</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
        <motion.div
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 md:p-10 border-4 border-blue-500"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <Lock className="w-16 h-16 mx-auto text-blue-600 mb-4" />
            <h1 className="text-3xl md:text-4xl font-black text-gray-800">Acceso de Administrador</h1>
            <p className="text-gray-600 mt-2 text-lg">Introduce la contraseña para continuar.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full px-5 py-4 text-xl border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              size="lg"
            >
              <LogIn className="w-6 h-6 mr-2" />
              Entrar
            </Button>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default AdminLoginPage;