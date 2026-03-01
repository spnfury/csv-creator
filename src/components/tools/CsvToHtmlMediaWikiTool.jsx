import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileCode, Eye, Copy, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CsvToHtmlMediaWikiTool = () => {
    const [csvContent, setCsvContent] = useState('');
    const [outputCode, setOutputCode] = useState('');
    const [outputType, setOutputType] = useState('html');
    const { toast } = useToast();

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

    const convert = () => {
        if (!csvContent.trim()) {
            toast({
                title: "CSV vacío",
                description: "Por favor, introduce contenido CSV para convertir.",
                variant: "destructive",
            });
            return;
        }

        try {
            const lines = csvContent.trim().split(/\r?\n/);
            if (lines.length === 0) return;

            const header = parseCsvLine(lines[0]);
            const bodyRows = lines.slice(1).map(line => parseCsvLine(line));

            let generatedCode = '';

            if (outputType === 'html') {
                const headerHtml = `    <tr>\n${header.map(h => `        <th>${h}</th>`).join('\n')}\n    </tr>`;
                const bodyHtml = bodyRows.map(row => `    <tr>\n${row.map(cell => `        <td>${cell}</td>`).join('\n')}\n    </tr>`).join('\n');
                generatedCode = `<table class="table">\n  <thead>\n${headerHtml}\n  </thead>\n  <tbody>\n${bodyHtml}\n  </tbody>\n</table>`;
            } else { // mediawiki
                const headerMw = `! ${header.join(' !! ')}`;
                const bodyMw = bodyRows.map(row => `| ${row.join(' || ')}`).join('\n|-\n');
                generatedCode = `{| class="wikitable"\n|-\n${headerMw}\n|-\n${bodyMw}\n|}`;
            }

            setOutputCode(generatedCode);
            toast({
                title: "¡Conversión Exitosa!",
                description: `Tu CSV se ha convertido a formato ${outputType.toUpperCase()}.`,
            });
        } catch (error) {
            toast({
                title: "Error de Formato",
                description: "No se pudo procesar el CSV. Verifica el formato.",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        if (csvContent.trim()) {
            convert();
        } else {
            setOutputCode('');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [csvContent, outputType]);


    const copyToClipboard = () => {
        if (!outputCode) {
            toast({ title: "Nada que copiar", description: "No hay código generado para copiar.", variant: "destructive" });
            return;
        }
        navigator.clipboard.writeText(outputCode);
        toast({ title: "¡Copiado!", description: "El código se ha copiado al portapapeles." });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl border-4 border-blue-600 p-8 md:p-12"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <label htmlFor="csvInput" className="block text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Upload className="w-8 h-8 text-blue-600"/>
                        1. Pega tu CSV
                    </label>
                    <textarea
                        id="csvInput"
                        value={csvContent}
                        onChange={(e) => setCsvContent(e.target.value)}
                        className="w-full h-96 px-4 py-3 text-base border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono resize-y"
                        placeholder="columna1,columna2&#10;valorA,valorB"
                    />
                </div>
                <div>
                    <h3 className="block text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                       <FileCode className="w-8 h-8 text-blue-600"/>
                       2. Elige y Copia el Resultado
                    </h3>
                    <Tabs value={outputType} onValueChange={setOutputType} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-blue-100">
                            <TabsTrigger value="html" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">HTML</TabsTrigger>
                            <TabsTrigger value="mediawiki" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">MediaWiki</TabsTrigger>
                        </TabsList>
                        <TabsContent value="html">
                            <div className="relative">
                                <textarea
                                    value={outputCode}
                                    readOnly
                                    className="w-full h-96 mt-2 px-4 py-3 text-base border-2 border-gray-300 bg-gray-50 rounded-xl font-mono resize-y"
                                    placeholder="El código HTML aparecerá aquí..."
                                />
                                <Button size="icon" variant="ghost" className="absolute top-4 right-2" onClick={copyToClipboard}><Copy className="w-5 h-5"/></Button>
                            </div>
                        </TabsContent>
                        <TabsContent value="mediawiki">
                            <div className="relative">
                                 <textarea
                                    value={outputCode}
                                    readOnly
                                    className="w-full h-96 mt-2 px-4 py-3 text-base border-2 border-gray-300 bg-gray-50 rounded-xl font-mono resize-y"
                                    placeholder="El código MediaWiki aparecerá aquí..."
                                />
                                <Button size="icon" variant="ghost" className="absolute top-4 right-2" onClick={copyToClipboard}><Copy className="w-5 h-5"/></Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <div className="mt-8">
                 <h3 className="block text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Eye className="w-8 h-8 text-blue-600"/>
                    Vista Previa (HTML)
                </h3>
                <div className="p-4 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50 min-h-[10rem]">
                    {outputType === 'html' && outputCode ? (
                         <>
                         <style>{`.preview-table, .preview-table th, .preview-table td { border: 1px solid #ccc; border-collapse: collapse; padding: 8px; text-align: left; } .preview-table th { background-color: #f2f2f2; }`}</style>
                         <div className="overflow-x-auto">
                            <div dangerouslySetInnerHTML={{ __html: outputCode.replace('<table', '<table class="preview-table"') }} />
                         </div>
                         </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-blue-400">
                            <p>La vista previa de la tabla HTML se mostrará aquí.</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default CsvToHtmlMediaWikiTool;