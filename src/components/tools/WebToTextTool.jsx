import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n.jsx';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Link, Loader2, Copy, Trash2, FileText, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WebToTextTool = () => {
    const { t } = useTranslation();
    const [url, setUrl] = useState('');
    const [extractedText, setExtractedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [characterCount, setCharacterCount] = useState(0);
    const { toast } = useToast();

    const handleExtract = async () => {
        if (!url.trim()) {
            toast({
                title: t('webToText.errorTitle'),
                description: t('webToText.emptyUrlError'),
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);
        setExtractedText('');
        setCharacterCount(0);

        try {
            // Using a CORS proxy to fetch URL content from the client-side
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
            const response = await fetch(proxyUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const html = await response.text();
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Remove script and style elements
            doc.querySelectorAll('script, style').forEach(elem => elem.remove());

            const text = doc.body.textContent || "";
            const cleanText = text.replace(/\s+/g, ' ').trim();

            setExtractedText(cleanText);
            setCharacterCount(cleanText.length);
            toast({
                title: t('webToText.successTitle'),
                description: t('webToText.successDescription', { count: cleanText.length }),
            });

        } catch (error) {
            console.error("Error fetching or parsing URL:", error);
            toast({
                title: t('webToText.fetchErrorTitle'),
                description: t('webToText.fetchErrorDescription'),
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = () => {
        if (!extractedText) {
            toast({
                title: t('webToText.nothingToCopyTitle'),
                description: t('webToText.nothingToCopyDescription'),
                variant: 'destructive',
            });
            return;
        }
        navigator.clipboard.writeText(extractedText);
        toast({
            title: t('webToText.copiedTitle'),
            description: t('webToText.copiedDescription'),
        });
    };

    const handleClear = () => {
        setUrl('');
        setExtractedText('');
        setCharacterCount(0);
        toast({
            title: t('webToText.clearedTitle'),
            description: t('webToText.clearedDescription'),
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 space-y-8">
            <div>
                <label htmlFor="url-input" className="block text-xl font-semibold text-gray-800 mb-2">
                    {t('webToText.urlInputLabel')}
                </label>
                <div className="flex gap-2">
                    <Input
                        id="url-input"
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder={t('webToText.placeholder')}
                        className="flex-grow p-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                        disabled={isLoading}
                    />
                    <Button 
                        onClick={handleExtract} 
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg text-lg"
                    >
                        {isLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>{t('webToText.extractButton')}</>
                        )}
                    </Button>
                </div>
            </div>

            <AnimatePresence>
                {extractedText && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                               <FileText className="w-6 h-6 text-red-600" />
                               {t('webToText.resultLabel')}
                            </h3>
                            <div className="text-md font-medium text-gray-600 bg-gray-100 rounded-full px-3 py-1">
                                {t('webToText.characterCount', { count: characterCount })}
                            </div>
                        </div>

                        <Textarea
                            value={extractedText}
                            readOnly
                            className="w-full h-96 p-4 text-base bg-gray-50 border-2 border-gray-200 rounded-lg font-serif"
                            placeholder={t('webToText.resultPlaceholder')}
                        />
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button onClick={handleCopy} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-lg text-base">
                                <Copy className="w-5 h-5 mr-2" />
                                {t('webToText.copyButton')}
                            </Button>
                            <Button onClick={handleClear} variant="outline" className="flex-1 border-2 border-gray-400 text-gray-700 hover:bg-gray-100 font-bold py-3 px-5 rounded-lg text-base">
                                <Trash2 className="w-5 h-5 mr-2" />
                                {t('webToText.clearButton')}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {!isLoading && !extractedText && (
                     <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-10 px-6 bg-red-50 border-2 border-dashed border-red-200 rounded-xl"
                    >
                        <div className="flex justify-center mb-4">
                            <div className="bg-red-100 p-4 rounded-full">
                               <Link className="w-12 h-12 text-red-500" />
                            </div>
                        </div>
                        <h4 className="text-2xl font-bold text-red-700">{t('webToText.initialStateTitle')}</h4>
                        <p className="text-lg text-red-600 mt-2">{t('webToText.initialStateDescription')}</p>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default WebToTextTool;