import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { RefreshCw, LogOut, Wrench } from 'lucide-react';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGenerateSitemap = () => {
    toast({
      title: 'Solicitud de regeneración enviada',
      description: 'El sitemap se actualizará en el próximo despliegue del sitio. ¡Recuerda publicar tus cambios!',
      duration: 7000,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    toast({
      title: 'Sesión cerrada',
      description: 'Has cerrado la sesión de administrador.',
    });
    navigate('/admin');
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - CSV Creator</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-gray-800 text-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Wrench />
              Backoffice
            </h1>
            <Button onClick={handleLogout} variant="destructive" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-10">
          <motion.div
            className="bg-white rounded-lg shadow-xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Panel de Control</h2>
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-md border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-700 mb-3">Gestión del Sitemap</h3>
                <p className="text-gray-600 mb-4">
                  El fichero sitemap.xml se genera automáticamente cada vez que publicas una nueva versión de tu sitio. Si has añadido nuevas herramientas o has hecho cambios importantes, puedes solicitar una regeneración.
                </p>
                <Button onClick={handleGenerateSitemap} className="bg-red-600 hover:bg-red-700">
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Regenerar Sitemap en el próximo despliegue
                </Button>
              </div>
              
              {/* Aquí se podrían añadir más herramientas de gestión en el futuro */}
              <div className="bg-gray-50 p-6 rounded-md border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-700 mb-3">Gestión de Herramientas</h3>
                <p className="text-gray-600">
                  Actualmente, todas las herramientas se gestionan directamente desde el código. ¡Próximamente podrás gestionarlas desde aquí!
                </p>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboardPage;