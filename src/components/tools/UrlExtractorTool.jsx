import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from '@/lib/i18n.jsx';
import { Link, List, Trash2, Wand2, Copy, Download } from 'lucide-react';

const UrlExtractorTool = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [text, setText] = useState('');
  const [urls, setUrls] = useState([]);

  const handleExtract = () => {
    if (!text.trim()) {
      toast({ variant: 'destructive', title: t('urlExtractor.emptyTextTitle'), description: t('urlExtractor.emptyTextDescription') });
      return;
    }
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const foundUrls = text.match(urlRegex) || [];
    const uniqueUrls = [...new Set(foundUrls)];
    setUrls(uniqueUrls);

    if (uniqueUrls.length > 0) {
      toast({ title: t('urlExtractor.successTitle'), description: t('urlExtractor.successDescription', { count: uniqueUrls.length }) });
    } else {
      toast({ variant: 'destructive', title: t('urlExtractor.notFoundTitle'), description: t('urlExtractor.notFoundDescription') });
    }
  };

  const handleClear = () => {
    setText('');
    setUrls([]);
    toast({ title: t('urlExtractor.clearedTitle'), description: t('urlExtractor.clearedDescription') });
  };

  const handleCopy = () => {
    if (urls.length === 0) {
      toast({ variant: 'destructive', title: t('urlExtractor.nothingToCopyTitle'), description: t('urlExtractor.nothingToCopyDescription') });
      return;
    }
    navigator.clipboard.writeText(urls.join('\n'));
    toast({ title: t('urlExtractor.copiedTitle'), description: t('urlExtractor.copiedDescription') });
  };

  const handleDownload = (format) => {
    if (urls.length === 0) {
      toast({ variant: 'destructive', title: t('urlExtractor.nothingToDownloadTitle'), description: t('urlExtractor.nothingToDownloadDescription') });
      return;
    }
    let content, mimeType, extension;
    if (format === 'txt') {
      content = urls.join('\n');
      mimeType = 'text/plain';
      extension = 'txt';
    } else {
      content = `url\n${urls.join('\n')}`;
      mimeType = 'text/csv';
      extension = 'csv';
    }
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `extracted_urls.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="text-input" className="text-lg font-semibold text-gray-700 flex items-center">
            <Link className="w-5 h-5 mr-2 text-blue-500" />
            {t('urlExtractor.pasteTextLabel')}
          </label>
          <Textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('urlExtractor.placeholder')}
            className="min-h-[300px] text-base border-gray-300 focus:ring-blue-500 focus:border-blue-500 font-mono"
          />
        </div>
        <div className="space-y-2">
          <label className="text-lg font-semibold text-gray-700 flex items-center">
            <List className="w-5 h-5 mr-2 text-blue-500" />
            {t('urlExtractor.foundTitle', { count: urls.length })}
          </label>
          <div className="min-h-[300px] bg-gray-50 border rounded-md p-4 overflow-y-auto">
            {urls.length > 0 ? (
              <ul className="space-y-2">
                {urls.map((url, index) => (
                  <li key={index} className="text-sm text-gray-800 break-all">{url}</li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                {t('resultPlaceholder', {defaultValue: 'Results will appear here...'})}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <Button onClick={handleExtract} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-6 flex-grow">
          <Wand2 className="w-6 h-6 mr-2" />
          {t('urlExtractor.extractButton')}
        </Button>
        <Button onClick={handleCopy} variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-100 font-bold text-lg py-6 flex-grow">
          <Copy className="w-6 h-6 mr-2" />
          {t('urlExtractor.copyListButton')}
        </Button>
        <Button onClick={() => handleDownload('txt')} variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-100 font-bold text-lg py-6 flex-grow">
          <Download className="w-6 h-6 mr-2" />
          {t('urlExtractor.downloadTxtButton')}
        </Button>
        <Button onClick={() => handleDownload('csv')} variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-100 font-bold text-lg py-6 flex-grow">
          <Download className="w-6 h-6 mr-2" />
          {t('urlExtractor.downloadCsvButton')}
        </Button>
        <Button onClick={handleClear} variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-100 font-bold text-lg py-6">
          <Trash2 className="w-6 h-6 mr-2" />
          {t('urlExtractor.clearButton')}
        </Button>
      </div>
    </motion.div>
  );
};

export default UrlExtractorTool;