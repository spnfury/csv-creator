import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { Mail, Copy, Download, Trash2, Search } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';

    const EmailExtractorTool = () => {
        const [inputText, setInputText] = useState('');
        const [extractedEmails, setExtractedEmails] = useState([]);
        const { toast } = useToast();

        const handleExtract = () => {
            if (!inputText.trim()) {
                toast({
                    title: "Texto vacío",
                    description: "Por favor, pega el texto del que quieres extraer correos.",
                    variant: "destructive",
                });
                return;
            }

            const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
            const foundEmails = inputText.match(emailRegex) || [];
            const uniqueEmails = [...new Set(foundEmails)];

            if (uniqueEmails.length > 0) {
                setExtractedEmails(uniqueEmails);
                toast({
                    title: "¡Extracción Exitosa!",
                    description: `Se encontraron ${uniqueEmails.length} correos electrónicos únicos.`,
                });
            } else {
                setExtractedEmails([]);
                toast({
                    title: "No se encontraron correos",
                    description: "No se encontraron direcciones de correo electrónico en el texto proporcionado.",
                    variant: "destructive",
                });
            }
        };

        const copyToClipboard = () => {
            if (extractedEmails.length === 0) {
                toast({ title: "Nada que copiar", description: "No hay correos para copiar.", variant: "destructive" });
                return;
            }
            navigator.clipboard.writeText(extractedEmails.join('\n'));
            toast({ title: "¡Copiado!", description: "La lista de correos se ha copiado al portapapeles." });
        };

        const downloadAsTxt = () => {
            if (extractedEmails.length === 0) {
                toast({ title: "Nada que descargar", description: "No hay correos para descargar.", variant: "destructive" });
                return;
            }
            const blob = new Blob([extractedEmails.join('\n')], { type: 'text/plain;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'correos_extraidos.txt');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
        
        const downloadAsCsv = () => {
            if (extractedEmails.length === 0) {
                toast({ title: "Nada que descargar", description: "No hay correos para descargar.", variant: "destructive" });
                return;
            }
            const csvContent = "email\n" + extractedEmails.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'correos_extraidos.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        const handleClear = () => {
            setInputText('');
            setExtractedEmails([]);
            toast({ title: "Limpiado", description: "Se ha borrado el contenido." });
        };

        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-2xl border-4 border-blue-600 p-8 md:p-12">
                <div className="mb-8">
                    <label htmlFor="inputText" className="block text-2xl font-bold text-gray-800 mb-3">
                        Pega tu texto aquí:
                    </label>
                    <textarea
                        id="inputText"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="w-full h-60 px-6 py-5 text-lg border-4 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 font-mono resize-y transition-all"
                        placeholder="Pega cualquier texto que contenga direcciones de correo electrónico como info@ejemplo.com o contacto@dominio.es..."
                    />
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <Button onClick={handleExtract} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-2xl font-bold py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                        <Search className="w-8 h-8 mr-3" />
                        EXTRAER CORREOS
                    </Button>
                    <Button onClick={handleClear} variant="outline" className="flex-1 border-4 border-blue-600 text-blue-600 hover:bg-blue-50 text-2xl font-bold py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
                        <Trash2 className="w-8 h-8 mr-3" />
                        LIMPIAR
                    </Button>
                </div>

                {extractedEmails.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <Mail className="w-8 h-8 text-blue-600"/>
                                {extractedEmails.length} correos encontrados:
                            </h3>
                            <Button variant="outline" size="sm" onClick={copyToClipboard} className="flex items-center gap-2 text-blue-600 border-blue-500 hover:bg-blue-50">
                                <Copy className="w-4 h-4" />
                                Copiar Lista
                            </Button>
                        </div>
                        <textarea
                            value={extractedEmails.join('\n')}
                            readOnly
                            className="w-full h-60 px-6 py-5 text-lg border-4 border-gray-300 bg-gray-50 rounded-xl font-mono resize-y"
                        />
                         <div className="flex flex-col md:flex-row gap-4 mt-4">
                            <Button onClick={downloadAsTxt} className="flex-1">
                                <Download className="mr-2 h-5 w-5" /> Descargar .txt
                            </Button>
                             <Button onClick={downloadAsCsv} className="flex-1">
                                <Download className="mr-2 h-5 w-5" /> Descargar .csv
                            </Button>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        );
    };

    export default EmailExtractorTool;