import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileJson, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

function JsonToCsvTool() {
    const [jsonContent, setJsonContent] = useState('');
    const [fileName, setFileName] = useState('convertido');
    const { toast } = useToast();

    const handleJsonChange = (e) => {
        setJsonContent(e.target.value);
    };

    const handleDownload = () => {
        if (!jsonContent.trim()) {
            toast({
                title: "Error: JSON vacío",
                description: "Por favor, pega tu contenido JSON en el área de texto.",
                variant: "destructive",
                duration: 3000,
            });
            return;
        }

        let data;
        try {
            data = JSON.parse(jsonContent);
        } catch (error) {
            toast({
                title: "Error: JSON inválido",
                description: "El formato del JSON no es correcto. Por favor, revísalo.",
                variant: "destructive",
                duration: 4000,
            });
            return;
        }

        if (!Array.isArray(data)) {
            data = [data];
        }

        if (data.length === 0) {
            toast({
                title: "Error: JSON sin datos",
                description: "El JSON no contiene datos para convertir.",
                variant: "destructive",
                duration: 3000,
            });
            return;
        }
        
        try {
            const replacer = (key, value) => value === null ? '' : value;
            const header = Object.keys(data[0]);
            let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
            csv.unshift(header.join(','));
            const csvContent = csv.join('\r\n');

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
                description: "Tu archivo CSV se ha descargado correctamente.",
                duration: 3000,
            });

        } catch (error) {
            toast({
                title: "Error de Conversión",
                description: "Hubo un problema al convertir el archivo. Asegúrate de que el JSON sea un array de objetos.",
                variant: "destructive",
                duration: 4000,
            });
        }
    };
    
    const handleClear = () => {
        setJsonContent('');
        setFileName('convertido');
        toast({
            title: "Limpiado",
            description: "El contenido ha sido borrado.",
            duration: 2000,
        });
    };

    const exampleJSON = `[
  {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan.perez@example.com",
    "activo": true
  },
  {
    "id": 2,
    "nombre": "Ana Gómez",
    "email": "ana.gomez@example.com",
    "activo": false
  }
]`;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl border-4 border-blue-600 p-8 md:p-12"
        >
            <div className="mb-6">
                <label htmlFor="fileName" className="block text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                    Nombre del archivo de salida:
                </label>
                <input
                    id="fileName"
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="w-full px-6 py-5 text-2xl md:text-3xl border-4 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="nombre-archivo"
                />
                <p className="mt-2 text-xl text-gray-600">Se guardará como: <span className="font-bold text-blue-600">{fileName}.csv</span></p>
            </div>

            <div className="mb-8">
                <label htmlFor="jsonInput" className="block text-2xl md:text-3xl font-bold text-gray-800 mb-3 flex items-center gap-3">
                    <FileJson className="w-8 h-8" />
                    Pega tu contenido JSON aquí:
                </label>
                <textarea
                    id="jsonInput"
                    value={jsonContent}
                    onChange={handleJsonChange}
                    className="w-full h-80 px-6 py-5 text-xl md:text-2xl border-4 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 font-mono resize-none transition-all"
                    placeholder="Pega tu código JSON aquí..."
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
                    Ejemplo de JSON válido:
                </h3>
                <pre className="text-lg font-mono bg-white p-4 rounded-lg border-2 border-blue-200 overflow-x-auto">
                    {exampleJSON}
                </pre>
                <p className="mt-4 text-lg text-gray-700">Tu JSON debe ser un array de objetos para una conversión correcta. Si es un solo objeto, se convertirá en una sola fila.</p>
            </div>

        </motion.div>
    );
}

export default JsonToCsvTool;