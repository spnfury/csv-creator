import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

function YamlToCsvTool() {
    const [yamlContent, setYamlContent] = useState('');
    const [fileName, setFileName] = useState('convertido');
    const { toast } = useToast();

    const parseYamlSimple = (yaml) => {
        const lines = yaml.split('\n').filter(l => l.trim() !== '' && !l.trim().startsWith('#'));
        let data = [];
        let currentObject = null;
        let indentLevel = 0;

        lines.forEach(line => {
            const indentation = line.match(/^\s*/)[0].length;
            const trimmedLine = line.trim();

            if (trimmedLine.startsWith('-')) {
                if (currentObject) {
                    data.push(currentObject);
                }
                currentObject = {};
                indentLevel = indentation;
                const itemLine = trimmedLine.substring(1).trim();
                const [key, value] = itemLine.split(/:\s*(.*)/s);
                if (key && value !== undefined) {
                    currentObject[key.trim()] = value.trim().replace(/^['"]|['"]$/g, '');
                }
            } else if (currentObject && indentation > indentLevel) {
                const [key, value] = trimmedLine.split(/:\s*(.*)/s);
                if (key && value !== undefined) {
                    currentObject[key.trim()] = value.trim().replace(/^['"]|['"]$/g, '');
                }
            }
        });
        if (currentObject) {
            data.push(currentObject);
        }
        return data;
    };

    const convertToCsv = (data) => {
        if (!data || data.length === 0) {
            return '';
        }

        const headers = Array.from(new Set(data.flatMap(obj => Object.keys(obj))));
        
        const escapeCell = (cell) => {
            const str = String(cell === null || cell === undefined ? '' : cell);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        const headerRow = headers.map(escapeCell).join(',');
        const rows = data.map(obj => {
            return headers.map(header => escapeCell(obj[header])).join(',');
        });

        return [headerRow, ...rows].join('\r\n');
    };

    const handleDownload = () => {
        if (!yamlContent.trim()) {
            toast({
                title: "Error: YAML vacío",
                description: "Por favor, pega tu contenido YAML en el área de texto.",
                variant: "destructive",
                duration: 3000,
            });
            return;
        }

        try {
            const parsedData = parseYamlSimple(yamlContent);
            
            if (parsedData.length === 0) {
                 toast({
                    title: "Error de Conversión",
                    description: "No se pudo extraer una estructura de lista de objetos del YAML.",
                    variant: "destructive",
                    duration: 4000,
                });
                return;
            }

            const csvData = convertToCsv(parsedData);

            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
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
                description: `Tu archivo CSV ha sido generado y descargado.`,
                duration: 3000,
            });

        } catch (error) {
            toast({
                title: "Error de Conversión",
                description: "Hubo un problema al procesar el YAML. Asegúrate de que es una lista de objetos.",
                variant: "destructive",
                duration: 4000,
            });
        }
    };

    const handleClear = () => {
        setYamlContent('');
        setFileName('convertido');
        toast({
            title: "Limpiado",
            description: "El contenido ha sido borrado.",
            duration: 2000,
        });
    };
    
    const exampleYAML = `- nombre: Juan
  apellido: Pérez
  email: juan@email.com
- nombre: María
  apellido: García
  email: maria@email.com`;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl border-4 border-red-600 p-8 md:p-12"
        >
            <div className="mb-8">
                <label htmlFor="fileName" className="block text-2xl font-bold text-gray-800 mb-3">
                    Nombre del archivo CSV:
                </label>
                <input
                    id="fileName"
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="w-full md:w-1/2 px-6 py-5 text-2xl border-4 border-red-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="nombre-archivo"
                />
                <p className="mt-2 text-xl text-gray-600">Se guardará como: <span className="font-bold text-red-600">{fileName}.csv</span></p>
            </div>

            <div className="mb-8">
                <label htmlFor="yamlInput" className="block text-2xl md:text-3xl font-bold text-gray-800 mb-3 flex items-center gap-3">
                    <FileText className="w-8 h-8" />
                    Pega tu contenido YAML aquí:
                </label>
                <textarea
                    id="yamlInput"
                    value={yamlContent}
                    onChange={(e) => setYamlContent(e.target.value)}
                    className="w-full h-80 px-6 py-5 text-xl md:text-2xl border-4 border-red-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500 focus:border-red-500 font-mono resize-none transition-all"
                    placeholder="Pega tu YAML aquí (debe ser una lista de objetos)..."
                />
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <Button
                    onClick={handleDownload}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-2xl md:text-3xl font-bold py-8 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                    <Download className="w-10 h-10 mr-3" strokeWidth={3} />
                    CONVERTIR Y DESCARGAR CSV
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
                    Ejemplo de YAML (Lista de Objetos):
                </h3>
                <pre className="text-lg font-mono bg-white p-4 rounded-lg border-2 border-red-200 overflow-x-auto">
                    {exampleYAML}
                </pre>
                 <p className="mt-4 text-lg text-gray-700">Esta herramienta convierte una lista de objetos YAML a CSV. Estructuras más complejas pueden no ser soportadas.</p>
            </div>
        </motion.div>
    );
}

export default YamlToCsvTool;