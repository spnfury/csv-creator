import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Home, ChevronsRight, Shield } from 'lucide-react';

const PrivacyPolicyPage = () => {
    return (
        <>
            <Helmet>
                <title>Política de Privacidad - CSV Creator</title>
                <meta name="description" content="Política de privacidad para CSV Creator. Entiende cómo manejamos tus datos." />
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
                            <span className="font-semibold text-red-100">Política de Privacidad</span>
                        </nav>
                    </div>
                </header>

                <main className="container mx-auto px-4 py-12 max-w-4xl">
                    <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
                        <h1 className="text-3xl md:text-5xl font-bold text-red-700 mb-6 flex items-center gap-3">
                            <Shield className="w-10 h-10" />
                            Política de Privacidad
                        </h1>
                        <div className="prose prose-lg max-w-none text-gray-700">
                            <p><strong>Última actualización:</strong> 4 de noviembre de 2025</p>
                            
                            <p>Bienvenido a CSV Creator ("nosotros", "nuestro"). Nos comprometemos a proteger tu privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y salvaguardamos tu información cuando visitas nuestro sitio web csvcreator.com.</p>

                            <h2>1. Recopilación de Información</h2>
                            <p>No recopilamos información de identificación personal (como nombre o correo electrónico) de nuestros usuarios. Todas las herramientas de procesamiento de datos en nuestro sitio funcionan exclusivamente en el lado del cliente (en tu navegador). Los datos que pegas o cargas para su procesamiento nunca se envían ni se almacenan en nuestros servidores.</p>
                            
                            <h2>2. Datos de Uso y Cookies</h2>
                            <p>Podemos recopilar información que tu navegador envía cada vez que visitas nuestro sitio ("Datos de Uso"). Estos Datos de Uso pueden incluir información como la dirección IP de tu computadora, el tipo de navegador, la versión del navegador, las páginas de nuestro sitio que visitas, la hora y fecha de tu visita y otras estadísticas.</p>
                            <p>Utilizamos cookies y tecnologías de seguimiento similares para rastrear la actividad en nuestro servicio y mantener cierta información. Las cookies son archivos con una pequeña cantidad of datos que pueden incluir un identificador único anónimo.</p>

                            <h2>3. Uso de Google AdSense</h2>
                            <p>Utilizamos Google AdSense para mostrar anuncios en nuestro sitio web. Google, como proveedor externo, utiliza cookies para publicar anuncios. El uso de la cookie DART de Google le permite publicar anuncios para los usuarios en función de su visita a nuestros sitios y otros sitios en Internet. Los usuarios pueden optar por no usar la cookie DART visitando la política de privacidad de la red de contenido y anuncios de Google.</p>

                            <h2>4. Seguridad de los Datos</h2>
                            <p>La seguridad de tus datos es importante para nosotros. Dado que no transmitimos ni almacenamos los datos que procesas a través de nuestras herramientas, el principal riesgo de seguridad reside en tu propio entorno. Nos esforzamos por utilizar medios comercialmente aceptables para proteger el sitio web en sí, pero no podemos garantizar su seguridad absoluta.</p>

                            <h2>5. Enlaces a Otros Sitios</h2>
                            <p>Nuestro servicio puede contener enlaces a otros sitios que no son operados por nosotros. Si haces clic en un enlace de un tercero, serás dirigido al sitio de ese tercero. Te recomendamos encarecidamente que revises la Política de Privacidad de cada sitio que visites.</p>

                            <h2>6. Cambios a Esta Política de Privacidad</h2>
                            <p>Podemos actualizar nuestra Política de Privacidad de vez en cuando. Te notificaremos cualquier cambio publicando la nueva Política de Privacidad en esta página.</p>

                            <h2>7. Contáctanos</h2>
                            <p>Si tienes alguna pregunta sobre esta Política de Privacidad, puedes contactarnos a través de los canales proporcionados en nuestro sitio web.</p>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default PrivacyPolicyPage;