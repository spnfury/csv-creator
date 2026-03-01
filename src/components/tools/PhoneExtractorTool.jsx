import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Copy, Download, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from '@/lib/i18n.jsx';

const PhoneExtractorTool = () => {
    const { t } = useTranslation();
    const [inputText, setInputText] = useState('');
    const [extractedPhones, setExtractedPhones] = useState([]);
    const { toast } = useToast();

    const handleExtract = () => {
        if (!inputText.trim()) {
            toast({
                title: t('phoneExtractor.emptyTextTitle'),
                description: t('phoneExtractor.emptyTextDescription'),
                variant: "destructive",
            });
            return;
        }

        const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,3}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}/g;
        const foundPhones = inputText.match(phoneRegex) || [];
        const uniquePhones = [...new Set(foundPhones)];

        if (uniquePhones.length > 0) {
            setExtractedPhones(uniquePhones);
            toast({
                title: t('phoneExtractor.successTitle'),
                description: t('phoneExtractor.successDescription', { count: uniquePhones.length }),
            });
        } else {
            setExtractedPhones([]);
            toast({
                title: t('phoneExtractor.notFoundTitle'),
                description: t('phoneExtractor.notFoundDescription'),
                variant: "destructive",
            });
        }
    };

    const copyToClipboard = () => {
        if (extractedPhones.length === 0) {
            toast({ title: t('phoneExtractor.nothingToCopyTitle'), description: t('phoneExtractor.nothingToCopyDescription'), variant: "destructive" });
            return;
        }
        navigator.clipboard.writeText(extractedPhones.join('\n'));
        toast({ title: t('phoneExtractor.copiedTitle'), description: t('phoneExtractor.copiedDescription') });
    };

    const downloadAsTxt = () => {
        if (extractedPhones.length === 0) {
            toast({ title: t('phoneExtractor.nothingToDownloadTitle'), description: t('phoneExtractor.nothingToDownloadDescription'), variant: "destructive" });
            return;
        }
        const blob = new Blob([extractedPhones.join('\n')], { type: 'text/plain;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'telefonos_extraidos.txt');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const downloadAsCsv = () => {
        if (extractedPhones.length === 0) {
            toast({ title: t('phoneExtractor.nothingToDownloadTitle'), description: t('phoneExtractor.nothingToDownloadDescription'), variant: "destructive" });
            return;
        }
        const csvContent = "phone\n" + extractedPhones.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'telefonos_extraidos.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleClear = () => {
        setInputText('');
        setExtractedPhones([]);
        toast({ title: t('phoneExtractor.clearedTitle'), description: t('phoneExtractor.clearedDescription') });
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-2xl border-4 border-red-600 p-8 md:p-12">
            <div className="mb-8">
                <label htmlFor="inputText" className="block text-2xl font-bold text-gray-800 mb-3">
                    {t('phoneExtractor.pasteTextLabel')}
                </label>
                <textarea
                    id="inputText"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full h-60 px-6 py-5 text-lg border-4 border-red-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500 focus:border-red-500 font-mono resize-y transition-all"
                    placeholder={t('phoneExtractor.placeholder')}
                />
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <Button onClick={handleExtract} className="flex-1 bg-red-600 hover:bg-red-700 text-white text-2xl font-bold py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                    <Search className="w-8 h-8 mr-3" />
                    {t('phoneExtractor.extractButton')}
                </Button>
                <Button onClick={handleClear} variant="outline" className="flex-1 border-4 border-red-600 text-red-600 hover:bg-red-50 text-2xl font-bold py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
                    <Trash2 className="w-8 h-8 mr-3" />
                    {t('phoneExtractor.clearButton')}
                </Button>
            </div>

            {extractedPhones.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Phone className="w-8 h-8 text-red-600"/>
                            {t('phoneExtractor.foundTitle', { count: extractedPhones.length })}
                        </h3>
                        <Button variant="outline" size="sm" onClick={copyToClipboard} className="flex items-center gap-2 text-red-600 border-red-500 hover:bg-red-50">
                            <Copy className="w-4 h-4" />
                            {t('phoneExtractor.copyListButton')}
                        </Button>
                    </div>
                    <textarea
                        value={extractedPhones.join('\n')}
                        readOnly
                        className="w-full h-60 px-6 py-5 text-lg border-4 border-gray-300 bg-gray-50 rounded-xl font-mono resize-y"
                    />
                     <div className="flex flex-col md:flex-row gap-4 mt-4">
                        <Button onClick={downloadAsTxt} className="flex-1">
                            <Download className="mr-2 h-5 w-5" /> {t('phoneExtractor.downloadTxtButton')}
                        </Button>
                         <Button onClick={downloadAsCsv} className="flex-1">
                            <Download className="mr-2 h-5 w-5" /> {t('phoneExtractor.downloadCsvButton')}
                        </Button>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default PhoneExtractorTool;