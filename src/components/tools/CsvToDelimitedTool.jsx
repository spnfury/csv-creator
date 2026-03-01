import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, CheckCircle2, AlertCircle, Trash2, Pilcrow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

function CsvToDelimitedTool() {
    const [csvContent, setCsvContent] = useState('');
    const [fileName, setFileName] = useState('convertido');
    const [delimiter, setDelimiter] = useState(';');
    const { toast } = useToast();

    const handleCsvChange = (e) => {
        setCsvContent(e.target.value);
    };

    const handleDownload = () => {
        if (!csvContent.trim()) {
            toast({
                title: "Error: CSV vacío",
                description: "Por favor, pega tu contenido CSV en el área de texto.",
                variant: "destructive",
                duration: 3000,
            });
            return;
        }

        if (!delimiter) {
            toast({
                title: "Error: Delimitador vacío",
                description: "Por favor, especifica un delimitador.",
                variant: "destructive",
                duration: 3000,
            });
            return;
        }
        
        try {
            const lines = csvContent.split(/\r?\n/);
            const convertedLines = lines.map(line => line.split(',').join(delimiter));
            const newContent = convertedLines.join('\r\n');

            const blob = new Blob([newContent], { type: 'text/csv;charset=utf-8;' });
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
                description: `Tu archivo CSV ha sido convertido y descargado.`,
                duration: 3000,
            });

        } catch (error) {
            toast({
                title: "Error de Conversión",
                description: "Hubo un problema al convertir el archivo. Revisa el formato de tu CSV.",
                variant: "destructive",
                duration: 4000,
            });
        }
    };
    
    const handleClear = () => {
        setCsvContent('');
        setFileName('convertido');
        setDelimiter(';');
        toast({
            title: "Limpiado",
            description: "El contenido ha sido borrado.",
            duration: 2000,
        });
    };
    
    const exampleCSV = `Nombre,Apellido,Email
Juan,Pérez,juan@email.com
María,García,maria@email.com`;

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
                        Nombre del archivo:
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
                    <label htmlFor="delimiter" className="block text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Pilcrow className="w-7 h-7" />
                        Nuevo Delimitador:
                    </label>
                    <input
                        id="delimiter"
                        type="text"
                        value={delimiter}
                        onChange={(e) => setDelimiter(e.target.value)}
                        className="w-full px-6 py-5 text-2xl border-4 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Ej: ;"
                    />
                    <p className="mt-2 text-xl text-gray-600">Usa `\t` para tabulación.</p>
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
                    onChange={handleCsvChange}
                    className="w-full h-80 px-6 py-5 text-xl md:text-2xl border-4 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 font-mono resize-none transition-all"
                    placeholder="Pega tu contenido separado por comas aquí..."
                />
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <Button
                    onClick={handleDownload}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-2xl md:text-3xl font-bold py-8 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                    <Download className="w-10 h-10 mr-3" strokeWidth={3} />
                    CONVERTIR Y DESCARGAR
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
                    Ejemplo de CSV de entrada:
                </h3>
                <pre className="text-lg font-mono bg-white p-4 rounded-lg border-2 border-blue-200 overflow-x-auto">
                    {exampleCSV}
                </pre>
                <p className="mt-4 text-lg text-gray-700">Esta herramienta asume que tu CSV de entrada usa comas (`,`) como separador.</p>
            </div>
        </motion.div>
    );
}

export default CsvToDelimitedTool;