import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Home, ChevronsRight, FileText } from 'lucide-react';

const TermsOfServicePage = () => {
    return (
        <>
            <Helmet>
                <title>Términos de Servicio - CSV Creator</title>
                <meta name="description" content="Términos de servicio para CSV Creator." />
                <meta name="robots" content="noindex, follow" />
            </Helmet>
            <div className="min-h-screen bg-gray-50">
                <header className="bg-red-600 shadow-md">
                    <div className="container mx-auto px-4 py-4">
                        <nav className="flex items-center text-white text-lg" aria-label="Breadcrumb">
                            <Link to="/" className="flex items-center gap-2 hover:text-red-200 transition-colors">
                                <Home className="w-5 h-5" />
                                <span>Inicio</span>
                            </Link>
                            <ChevronsRight className="w-6 h-6 mx-1 text-red-300" />
                            <span className="font-semibold text-red-100">Términos de Servicio</span>
                        </nav>
                    </div>
                </header>

                <main className="container mx-auto px-4 py-12 max-w-4xl">
                    <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
                        <h1 className="text-3xl md:text-5xl font-bold text-red-700 mb-6 flex items-center gap-3">
                            <FileText className="w-10 h-10" />
                            Términos de Servicio
                        </h1>
                        <div className="prose prose-lg max-w-none text-gray-700">
                            <p><strong>Última actualización:</strong> 4 de noviembre de 2025</p>
                            
                            <p>Estos términos y condiciones ("Términos") rigen tu acceso y uso del sitio web csvcreator.com ("Sitio") y sus herramientas y servicios ("Servicio"). Al acceder o utilizar el Servicio, aceptas estar sujeto a estos Términos.</p>

                            <h2>1. Uso del Servicio</h2>
                            <p>CSV Creator te proporciona un conjunto de herramientas online para manipular datos en formato CSV. El servicio se proporciona "tal cual", sin garantías de ningún tipo. Eres responsable de los datos que procesas. Al ser una herramienta que opera del lado del cliente, tus datos no son enviados ni almacenados en nuestros servidores.</p>
                            
                            <h2>2. Conducta del Usuario</h2>
                            <p>Aceptas no utilizar el Servicio para ningún propósito ilegal o prohibido por estos Términos. No puedes usar el Servicio de ninguna manera que pueda dañar, deshabilitar, sobrecargar o perjudicar nuestro sitio web o interferir con el uso y disfrute de cualquier otra parte del Servicio.</p>

                            <h2>3. Propiedad Intelectual</h2>
                            <p>El Servicio y su contenido original, características y funcionalidad son y seguirán siendo propiedad exclusiva de CSV Creator y sus licenciantes. El Servicio está protegido por derechos de autor, marcas registradas y otras leyes tanto de España como de países extranjeros.</p>

                            <h2>4. Descargo de Responsabilidad</h2>
                            <p>El uso del Servicio es bajo tu propio riesgo. El Servicio se proporciona "TAL CUAL" y "SEGÚN DISPONIBILIDAD". Renunciamos a toda garantía, ya sea expresa o implícita, incluyendo, pero no limitado a, garantías de comerciabilidad, idoneidad para un propósito particular y no infracción.</p>
                            <p>No garantizamos que los resultados del uso del servicio sean precisos o fiables. Eres el único responsable de validar la exactitud de los datos convertidos o procesados.</p>

                            <h2>5. Limitación de Responsabilidad</h2>
                            <p>En ningún caso CSV Creator, ni sus directores, empleados, socios, agentes, proveedores o afiliados, serán responsables de daños indirectos, incidentales, especiales, consecuentes o punitivos, incluyendo, sin limitación, la pérdida de beneficios, datos, uso, fondo de comercio u otras pérdidas intangibles, resultantes de tu acceso o uso o incapacidad para acceder o utilizar el Servicio.</p>

                            <h2>6. Cambios</h2>
                            <p>Nos reservamos el derecho, a nuestra sola discreción, de modificar o reemplazar estos Términos en cualquier momento. Al continuar accediendo o utilizando nuestro Servicio después de que esas revisiones entren en vigencia, aceptas estar sujeto a los términos revisados.</p>

                            <h2>7. Contáctanos</h2>
                            <p>Si tienes alguna pregunta sobre estos Términos, por favor contáctanos.</p>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default TermsOfServicePage;