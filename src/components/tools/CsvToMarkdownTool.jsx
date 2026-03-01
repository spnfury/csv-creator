import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Table, Download, FileText, Upload, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const CsvToMarkdownTool = () => {
    const [csvContent, setCsvContent] = useState('');
    const [markdownContent, setMarkdownContent] = useState('');
    const { toast } = useToast();

    const handlePaste = (e) => {
        const pastedText = e.clipboardData.getData('text');
        setCsvContent(pastedText);
        if (pastedText) {
            toast({
                title: "¡CSV Pegado!",
                description: "Ahora puedes convertir tus datos a Markdown.",
            });
        }
    };

    const parseCsvLine = (line) => {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                if (inQuotes && line[i+1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    };

    const convertToMarkdown = () => {
        if (!csvContent.trim()) {
            toast({
                title: "Error",
                description: "Por favor, pega tu contenido CSV primero.",
                variant: "destructive",
            });
            return;
        }

        try {
            const lines = csvContent.trim().split(/\r?\n/);
            if (lines.length === 0) {
                 toast({
                    title: "CSV Vacío",
                    description: "No hay contenido para convertir.",
                    variant: "destructive",
                });
                return;
            }

            const header = parseCsvLine(lines[0]);
            const separator = header.map(() => '---').join(' | ');
            
            const rows = lines.slice(1).map(line => {
                const rowData = parseCsvLine(line);
                return `| ${rowData.join(' | ')} |`;
            });

            const markdown = [
                `| ${header.join(' | ')} |`,
                `| ${separator} |`,
                ...rows
            ].join('\n');

            setMarkdownContent(markdown);
            toast({
                title: "¡Conversión Exitosa!",
                description: "Tu CSV se ha convertido a una tabla Markdown.",
            });

        } catch (error) {
            toast({
                title: "Error de Formato",
                description: "Hubo un problema al procesar el CSV.",
                variant: "destructive",
            });
        }
    };

    const copyToClipboard = () => {
        if (!markdownContent) {
            toast({
                title: "Error",
                description: "No hay nada que copiar.",
                variant: "destructive",
            });
            return;
        }
        navigator.clipboard.writeText(markdownContent);
        toast({
            title: "¡Copiado!",
            description: "La tabla Markdown se ha copiado al portapapeles.",
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl border-4 border-blue-600 p-8 md:p-12"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label htmlFor="csvInput" className="block text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Upload className="w-8 h-8"/>
                        Pega tu CSV aquí:
                    </label>
                    <textarea
                        id="csvInput"
                        value={csvContent}
                        onChange={(e) => setCsvContent(e.target.value)}
                        onPaste={handlePaste}
                        className="w-full h-96 px-6 py-5 text-lg border-4 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 font-mono resize-y transition-all"
                        placeholder="columna1,columna2,columna3&#10;valor1,valor2,valor3"
                    />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-3">
                         <label htmlFor="markdownOutput" className="block text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <FileText className="w-8 h-8"/>
                            Resultado Markdown:
                        </label>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={copyToClipboard}
                            disabled={!markdownContent}
                            className="flex items-center gap-2 text-blue-600 border-blue-500 hover:bg-blue-50"
                        >
                            <Copy className="w-4 h-4" />
                            Copiar
                        </Button>
                    </div>
                    <textarea
                        id="markdownOutput"
                        value={markdownContent}
                        readOnly
                        className="w-full h-96 px-6 py-5 text-lg border-4 border-gray-300 bg-gray-50 rounded-xl font-mono resize-y"
                        placeholder="| columna1 | columna2 | columna3 |&#10;|---|---|---|&#10;| valor1   | valor2   | valor3   |"
                    />
                </div>
            </div>

            <Button
                onClick={convertToMarkdown}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white text-2xl md:text-3xl font-bold py-8 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
                <Table className="w-10 h-10 mr-3" strokeWidth={3} />
                CONVERTIR A MARKDOWN
            </Button>
        </motion.div>
    );
};

export default CsvToMarkdownTool;