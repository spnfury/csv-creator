import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Download, FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const HtmlTableToCsvTool = () => {
    const [htmlContent, setHtmlContent] = useState('');
    const [csvContent, setCsvContent] = useState('');
    const [fileName, setFileName] = useState('tabla_exportada');
    const { toast } = useToast();

    const handlePaste = (e) => {
        const pastedText = e.clipboardData.getData('text');
        setHtmlContent(pastedText);
        if (pastedText) {
            toast({
                title: "¡HTML Pegado!",
                description: "Ahora puedes convertir la tabla a CSV.",
            });
        }
    };
    
    const escapeCsvCell = (cell) => {
        const text = cell.textContent.trim();
        if (text.includes(',') || text.includes('"') || text.includes('\n')) {
            return `"${text.replace(/"/g, '""')}"`;
        }
        return text;
    };

    const convertToCsv = () => {
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
            const table = doc.querySelector('table');

            if (!table) {
                toast({
                    title: "No se encontró la tabla",
                    description: "No se encontró ninguna etiqueta <table> en el HTML proporcionado.",
                    variant: "destructive",
                });
                setCsvContent('');
                return;
            }

            const csvRows = [];
            
            const headers = Array.from(table.querySelectorAll('th')).map(escapeCsvCell);
            if (headers.length > 0) {
                csvRows.push(headers.join(','));
            }

            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const rowData = Array.from(row.querySelectorAll('td')).map(escapeCsvCell);
                if (rowData.length > 0) {
                   csvRows.push(rowData.join(','));
                }
            });
            
            if (csvRows.length === 0 && table.querySelectorAll('tr').length > 0) {
                 const allRows = table.querySelectorAll('tr');
                 allRows.forEach(row => {
                     const cells = Array.from(row.querySelectorAll('td, th')).map(escapeCsvCell);
                     if(cells.length > 0) {
                        csvRows.push(cells.join(','));
                     }
                 });
            }


            if (csvRows.length === 0) {
                 toast({
                    title: "Tabla Vacía",
                    description: "La tabla encontrada no contiene filas o datos para convertir.",
                    variant: "destructive",
                });
                return;
            }

            setCsvContent(csvRows.join('\r\n'));
            toast({
                title: "¡Conversión Exitosa!",
                description: `La tabla HTML se ha convertido a CSV.`,
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
                description: "No hay contenido CSV para descargar. Convierte la tabla primero.",
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
            description: "Tu archivo CSV con la tabla se ha descargado.",
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
                        Pega tu HTML con una tabla:
                    </label>
                    <textarea
                        id="htmlInput"
                        value={htmlContent}
                        onChange={(e) => setHtmlContent(e.target.value)}
                        onPaste={handlePaste}
                        className="w-full h-96 px-6 py-5 text-lg border-4 border-red-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500 focus:border-red-500 font-mono resize-y transition-all"
                        placeholder="<table>...</table>"
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
                        placeholder="Aquí aparecerá la tabla en formato CSV..."
                    />
                </div>
            </div>

            <Button
                onClick={convertToCsv}
                className="w-full mt-8 bg-red-600 hover:bg-red-700 text-white text-2xl md:text-3xl font-bold py-8 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
                <Code className="w-10 h-10 mr-3" strokeWidth={3} />
                CONVERTIR TABLA A CSV
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

export default HtmlTableToCsvTool;