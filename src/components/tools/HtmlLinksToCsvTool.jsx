import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link2, Download, FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const HtmlLinksToCsvTool = () => {
    const [htmlContent, setHtmlContent] = useState('');
    const [csvContent, setCsvContent] = useState('');
    const [fileName, setFileName] = useState('enlaces_extraidos');
    const { toast } = useToast();

    const handlePaste = (e) => {
        const pastedText = e.clipboardData.getData('text');
        setHtmlContent(pastedText);
        if (pastedText) {
            toast({
                title: "¡HTML Pegado!",
                description: "Ahora puedes extraer los enlaces.",
            });
        }
    };

    const extractLinks = () => {
        if (!htmlContent.trim()) {
            toast({
                title: "Error",
                description: "Por favor, pega tu contenido HTML primero.",
                variant: "destructive",
            });
            return;
        }

        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            const links = doc.querySelectorAll('a');

            if (links.length === 0) {
                toast({
                    title: "Sin Enlaces",
                    description: "No se encontraron enlaces (etiquetas <a>) en el HTML proporcionado.",
                    variant: "destructive",
                });
                setCsvContent('');
                return;
            }

            const headers = ['texto_del_enlace', 'url_del_enlace'];
            const csvRows = [headers.join(',')];

            links.forEach(link => {
                const text = link.textContent.trim().replace(/"/g, '""');
                const href = link.getAttribute('href') || '';
                csvRows.push(`"${text}","${href}"`);
            });

            setCsvContent(csvRows.join('\r\n'));
            toast({
                title: "¡Extracción Exitosa!",
                description: `Se encontraron y convirtieron ${links.length} enlaces.`,
            });

        } catch (error) {
            toast({
                title: "Error de Procesamiento",
                description: "Hubo un problema al analizar el HTML.",
                variant: "destructive",
            });
        }
    };

    const handleDownload = () => {
        if (!csvContent) {
            toast({
                title: "Error",
                description: "No hay contenido CSV para descargar. Extrae los enlaces primero.",
                variant: "destructive",
            });
            return;
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `${fileName}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
            title: "¡Descargado!",
            description: "Tu archivo CSV con los enlaces se ha descargado.",
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl border-4 border-red-600 p-8 md:p-12"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label htmlFor="htmlInput" className="block text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Upload className="w-8 h-8"/>
                        Pega tu HTML aquí:
                    </label>
                    <textarea
                        id="htmlInput"
                        value={htmlContent}
                        onChange={(e) => setHtmlContent(e.target.value)}
                        onPaste={handlePaste}
                        className="w-full h-96 px-6 py-5 text-lg border-4 border-red-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500 focus:border-red-500 font-mono resize-y transition-all"
                        placeholder="<html>...<a href='...'>Enlace</a>...</html>"
                    />
                </div>
                <div>
                    <label htmlFor="csvOutput" className="block text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <FileText className="w-8 h-8"/>
                        Resultado CSV:
                    </label>
                    <textarea
                        id="csvOutput"
                        value={csvContent}
                        readOnly
                        className="w-full h-96 px-6 py-5 text-lg border-4 border-gray-300 bg-gray-50 rounded-xl font-mono resize-y"
                        placeholder="texto_del_enlace,url_del_enlace..."
                    />
                </div>
            </div>

            <Button
                onClick={extractLinks}
                className="w-full mt-8 bg-red-600 hover:bg-red-700 text-white text-2xl md:text-3xl font-bold py-8 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
                <Link2 className="w-10 h-10 mr-3" strokeWidth={3} />
                EXTRAER ENLACES A CSV
            </Button>

            {csvContent && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8"
                >
                    <Button
                        onClick={handleDownload}
                        className="w-full bg-green-600 hover:bg-green-700 text-white text-2xl md:text-3xl font-bold py-8 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                        <Download className="w-10 h-10 mr-3" strokeWidth={3} />
                        DESCARGAR CSV
                    </Button>
                </motion.div>
            )}
        </motion.div>
    );
};

export default HtmlLinksToCsvTool;