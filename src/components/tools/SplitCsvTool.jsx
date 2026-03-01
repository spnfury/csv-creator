import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scissors, Download, FileText, Upload, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';

const SplitCsvTool = () => {
    const [csvContent, setCsvContent] = useState('');
    const [rowsPerFile, setRowsPerFile] = useState(100);
    const [fileNamePrefix, setFileNamePrefix] = useState('split_');
    const [splitFiles, setSplitFiles] = useState([]);
    const { toast } = useToast();

    const handlePaste = (e) => {
        const pastedText = e.clipboardData.getData('text');
        setCsvContent(pastedText);
        if (pastedText) {
            toast({
                title: "¡CSV Pegado!",
                description: "Ahora puedes dividir tu archivo.",
            });
        }
    };

    const handleSplit = () => {
        if (!csvContent.trim()) {
            toast({
                title: "Error",
                description: "Por favor, pega tu contenido CSV primero.",
                variant: "destructive",
            });
            return;
        }

        if (rowsPerFile <= 0) {
            toast({
                title: "Error",
                description: "El número de filas por archivo debe ser mayor que 0.",
                variant: "destructive",
            });
            return;
        }

        try {
            const lines = csvContent.trim().split(/\r?\n/);
            const header = lines[0];
            const dataRows = lines.slice(1);
            
            if (dataRows.length === 0) {
                toast({
                    title: "No hay datos",
                    description: "El CSV solo contiene una cabecera o está vacío.",
                    variant: "destructive",
                });
                return;
            }

            const chunks = [];
            for (let i = 0; i < dataRows.length; i += rowsPerFile) {
                const chunk = dataRows.slice(i, i + rowsPerFile);
                chunks.push([header, ...chunk].join('\r\n'));
            }

            setSplitFiles(chunks);
            toast({
                title: "¡Archivo Dividido!",
                description: `Se han generado ${chunks.length} archivos. Ya puedes descargarlos.`,
            });
        } catch (error) {
            toast({
                title: "Error de Formato",
                description: "Hubo un problema al procesar el CSV. Asegúrate de que el formato sea correcto.",
                variant: "destructive",
            });
        }
    };

    const downloadFile = (content, index) => {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `${fileNamePrefix}${index + 1}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl border-4 border-blue-600 p-8 md:p-12"
        >
            <div className="mb-8">
                <label htmlFor="csvInput" className="block text-2xl md:text-3xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Upload className="w-8 h-8"/>
                    Pega tu CSV aquí:
                </label>
                <textarea
                    id="csvInput"
                    value={csvContent}
                    onChange={(e) => setCsvContent(e.target.value)}
                    onPaste={handlePaste}
                    className="w-full h-60 px-6 py-5 text-xl border-4 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 font-mono resize-y transition-all"
                    placeholder="Pega tu contenido CSV aquí...&#10;La primera línea se considerará la cabecera."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                    <label htmlFor="rowsPerFile" className="block text-xl font-bold text-gray-800 mb-2">
                        Filas por archivo
                    </label>
                    <Input
                        id="rowsPerFile"
                        type="number"
                        value={rowsPerFile}
                        onChange={(e) => setRowsPerFile(parseInt(e.target.value, 10))}
                        className="w-full px-4 py-3 text-xl border-2 border-blue-300 rounded-lg"
                        min="1"
                    />
                </div>
                 <div>
                    <label htmlFor="fileNamePrefix" className="block text-xl font-bold text-gray-800 mb-2">
                        Prefijo de nombre de archivo
                    </label>
                    <Input
                        id="fileNamePrefix"
                        type="text"
                        value={fileNamePrefix}
                        onChange={(e) => setFileNamePrefix(e.target.value)}
                        className="w-full px-4 py-3 text-xl border-2 border-blue-300 rounded-lg"
                    />
                </div>
            </div>

            <Button
                onClick={handleSplit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-2xl md:text-3xl font-bold py-8 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
                <Scissors className="w-10 h-10 mr-3" strokeWidth={3} />
                DIVIDIR ARCHIVO
            </Button>

            {splitFiles.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12"
                >
                    <h3 className="text-3xl font-bold text-blue-700 mb-6">Archivos Resultantes</h3>
                    <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {splitFiles.map((fileContent, index) => (
                                <Button
                                    key={index}
                                    onClick={() => downloadFile(fileContent, index)}
                                    variant="outline"
                                    className="flex items-center justify-center gap-2 text-lg py-4 border-2 border-blue-500 text-blue-600 hover:bg-blue-100"
                                >
                                    <Download className="w-5 h-5" />
                                    <span>{`${fileNamePrefix}${index + 1}.csv`}</span>
                                </Button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="mt-12 bg-blue-50 border-2 border-blue-200 text-blue-800 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <AlertCircle className="w-10 h-10 text-blue-500 mt-1"/>
                    <div>
                        <h3 className="text-2xl font-bold text-blue-900 mb-2">¿Cómo funciona?</h3>
                        <p className="text-lg">
                            Esta herramienta toma la <strong className="font-semibold">primera línea</strong> de tu CSV como cabecera y la añade al principio de cada archivo dividido. Luego, divide las filas de datos restantes según el número que especifiques.
                        </p>
                    </div>
                </div>
            </div>

        </motion.div>
    );
};

export default SplitCsvTool;