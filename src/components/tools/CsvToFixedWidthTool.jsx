import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, CheckCircle2, AlertCircle, Trash2, AlignJustify } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

function CsvToFixedWidthTool() {
    const [csvContent, setCsvContent] = useState('');
    const [fileName, setFileName] = useState('tabla-ancho-fijo');
    const [padding, setPadding] = useState(2);
    const { toast } = useToast();

    const handleDownload = () => {
        if (!csvContent.trim()) {
            toast({
                title: "Error: CSV vacío",
                description: "Por favor, pega tu contenido CSV.",
                variant: "destructive",
                duration: 3000,
            });
            return;
        }

        try {
            const lines = csvContent.split(/\r?\n/).filter(line => line.trim() !== '');
            const data = lines.map(line => line.split(','));
            
            const numColumns = data.length > 0 ? data[0].length : 0;
            if(numColumns === 0) {
                 toast({
                    title: "Error",
                    description: "No se encontraron datos para convertir.",
                    variant: "destructive",
                });
                return;
            }

            const colWidths = Array(numColumns).fill(0);

            data.forEach(row => {
                row.forEach((cell, i) => {
                    if (cell.length > colWidths[i]) {
                        colWidths[i] = cell.length;
                    }
                });
            });

            const paddedWidths = colWidths.map(w => w + Number(padding));

            let output = '';
            data.forEach(row => {
                let line = '';
                row.forEach((cell, i) => {
                    line += cell.padEnd(paddedWidths[i]);
                });
                output += line + '\r\n';
            });
            
             const headerSeparator = paddedWidths.map(w => '-'.repeat(w)).join('').slice(0, -padding);
             const parts = output.split('\r\n');
             parts.splice(1, 0, headerSeparator);
             output = parts.join('\r\n');


            const blob = new Blob([output], { type: 'text/plain;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', `${fileName}.txt`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast({
                title: "¡Conversión Exitosa!",
                description: `Tu tabla de ancho fijo ha sido creada y descargada.`,
                duration: 3000,
            });

        } catch (error) {
            toast({
                title: "Error de Conversión",
                description: "Hubo un problema al convertir el archivo.",
                variant: "destructive",
                duration: 4000,
            });
        }
    };

    const handleClear = () => {
        setCsvContent('');
        setFileName('tabla-ancho-fijo');
        setPadding(2);
        toast({
            title: "Limpiado",
            description: "El contenido ha sido borrado.",
            duration: 2000,
        });
    };

    const exampleCSV = `Nombre,Apellido,Ciudad
Juan,Pérez,Madrid
Ana,García,Barcelona
Luis,Martínez,Valencia`;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl border-4 border-red-600 p-8 md:p-12"
        >
            <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                    <label htmlFor="fileName" className="block text-2xl font-bold text-gray-800 mb-3">
                        Nombre del archivo:
                    </label>
                    <input
                        id="fileName"
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        className="w-full px-6 py-5 text-2xl border-4 border-red-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500 focus:border-red-500 transition-all"
                        placeholder="nombre-archivo"
                    />
                     <p className="mt-2 text-xl text-gray-600">Se guardará como: <span className="font-bold text-red-600">{fileName}.txt</span></p>
                </div>
                <div>
                    <label htmlFor="padding" className="block text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                       <AlignJustify className="w-7 h-7" />
                       Relleno de columna:
                    </label>
                    <input
                        id="padding"
                        type="number"
                        min="0"
                        value={padding}
                        onChange={(e) => setPadding(e.target.value)}
                        className="w-full px-6 py-5 text-2xl border-4 border-red-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500 focus:border-red-500 transition-all"
                    />
                    <p className="mt-2 text-xl text-gray-600">Espacios extra en cada columna.</p>
                </div>
            </div>

            <div className="mb-8">
                <label htmlFor="csvInput" className="block text-2xl md:text-3xl font-bold text-gray-800 mb-3 flex items-center gap-3">
                    <FileText className="w-8 h-8" />
                    Pega tu contenido CSV aquí:
                </label>
                <textarea
                    id="csvInput"
                    value={csvContent}
                    onChange={(e) => setCsvContent(e.target.value)}
                    className="w-full h-80 px-6 py-5 text-xl md:text-2xl border-4 border-red-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500 focus:border-red-500 font-mono resize-none transition-all"
                    placeholder="Pega tu contenido separado por comas aquí..."
                />
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <Button
                    onClick={handleDownload}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-2xl md:text-3xl font-bold py-8 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                    <Download className="w-10 h-10 mr-3" strokeWidth={3} />
                    CONVERTIR Y DESCARGAR
                </Button>
                <Button
                    onClick={handleClear}
                    variant="outline"
                    className="flex-1 border-4 border-red-600 text-red-600 hover:bg-red-50 text-2xl md:text-3xl font-bold py-8 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                    <Trash2 className="w-8 h-8 mr-3" />
                    LIMPIAR
                </Button>
            </div>
            
            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                <h3 className="text-2xl font-bold text-red-700 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-8 h-8" />
                    Ejemplo de CSV de entrada:
                </h3>
                <pre className="text-lg font-mono bg-white p-4 rounded-lg border-2 border-red-200 overflow-x-auto">
                    {exampleCSV}
                </pre>
            </div>
        </motion.div>
    );
}

export default CsvToFixedWidthTool;