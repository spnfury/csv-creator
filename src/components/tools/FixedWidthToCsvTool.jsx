import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, CheckCircle2, AlertCircle, Trash2, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

function FixedWidthToCsvTool() {
    const [textContent, setTextContent] = useState('');
    const [fileName, setFileName] = useState('convertido');
    const [widths, setWidths] = useState('');
    const { toast } = useToast();

    const handleDownload = () => {
        if (!textContent.trim()) {
            toast({
                title: "Error: Texto vacío",
                description: "Por favor, pega tu contenido de ancho fijo.",
                variant: "destructive",
                duration: 3000,
            });
            return;
        }
        if (!widths.trim()) {
            toast({
                title: "Error: Anchos no definidos",
                description: "Por favor, define los anchos de las columnas.",
                variant: "destructive",
                duration: 3000,
            });
            return;
        }

        try {
            const colWidths = widths.split(',').map(w => parseInt(w.trim(), 10));
            if(colWidths.some(isNaN)) {
                toast({
                    title: "Error: Anchos inválidos",
                    description: "Los anchos deben ser números separados por comas.",
                    variant: "destructive",
                });
                return;
            }

            const lines = textContent.split(/\r?\n/);
            const csvLines = lines.map(line => {
                let currentPos = 0;
                const cells = colWidths.map(width => {
                    const cell = line.substring(currentPos, currentPos + width).trim();
                    currentPos += width;
                    return `"${cell.replace(/"/g, '""')}"`;
                });
                return cells.join(',');
            });
            
            const csvContent = csvLines.join('\r\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', `${fileName}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast({
                title: "¡Conversión Exitosa!",
                description: `Tu archivo CSV ha sido creado y descargado.`,
                duration: 3000,
            });

        } catch (error) {
            toast({
                title: "Error de Conversión",
                description: "Hubo un problema al convertir el archivo. Revisa los anchos y el texto.",
                variant: "destructive",
                duration: 4000,
            });
        }
    };

    const handleClear = () => {
        setTextContent('');
        setFileName('convertido');
        setWidths('');
        toast({
            title: "Limpiado",
            description: "El contenido ha sido borrado.",
            duration: 2000,
        });
    };

    const exampleText = `Nombre    Apellido  Ciudad   
---------- --------- ---------
Juan      Pérez     Madrid   
Ana       García    Barcelona`;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl border-4 border-blue-600 p-8 md:p-12"
        >
            <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                    <label htmlFor="fileName" className="block text-2xl font-bold text-gray-800 mb-3">
                        Nombre del archivo CSV:
                    </label>
                    <input
                        id="fileName"
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        className="w-full px-6 py-5 text-2xl border-4 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="nombre-archivo"
                    />
                     <p className="mt-2 text-xl text-gray-600">Se guardará como: <span className="font-bold text-blue-600">{fileName}.csv</span></p>
                </div>
                <div>
                    <label htmlFor="widths" className="block text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                       <ArrowRightLeft className="w-7 h-7" />
                       Anchos de columna:
                    </label>
                    <input
                        id="widths"
                        type="text"
                        value={widths}
                        onChange={(e) => setWidths(e.target.value)}
                        className="w-full px-6 py-5 text-2xl border-4 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="10, 10, 10"
                    />
                    <p className="mt-2 text-xl text-gray-600">Números separados por coma.</p>
                </div>
            </div>

            <div className="mb-8">
                <label htmlFor="textInput" className="block text-2xl md:text-3xl font-bold text-gray-800 mb-3 flex items-center gap-3">
                    <FileText className="w-8 h-8" />
                    Pega tu texto de ancho fijo aquí:
                </label>
                <textarea
                    id="textInput"
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    className="w-full h-80 px-6 py-5 text-xl md:text-2xl border-4 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 font-mono resize-none transition-all"
                    placeholder="Pega tu texto de ancho fijo..."
                />
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <Button
                    onClick={handleDownload}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-2xl md:text-3xl font-bold py-8 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                    <Download className="w-10 h-10 mr-3" strokeWidth={3} />
                    CONVERTIR Y DESCARGAR CSV
                </Button>
                <Button
                    onClick={handleClear}
                    variant="outline"
                    className="flex-1 border-4 border-blue-600 text-blue-600 hover:bg-blue-50 text-2xl md:text-3xl font-bold py-8 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                    <Trash2 className="w-8 h-8 mr-3" />
                    LIMPIAR
                </Button>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                <h3 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-8 h-8" />
                    Ejemplo de entrada:
                </h3>
                <pre className="text-lg font-mono bg-white p-4 rounded-lg border-2 border-blue-200 overflow-x-auto">
                    {exampleText}
                </pre>
                 <p className="mt-4 text-lg text-gray-700">Para este ejemplo, los anchos de columna serían: <code className="bg-blue-200 text-blue-800 font-bold px-2 py-1 rounded">10, 10, 10</code></p>
            </div>
        </motion.div>
    );
}

export default FixedWidthToCsvTool;