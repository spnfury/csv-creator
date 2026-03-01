import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from '@/lib/i18n.jsx';
import { FileDown, FileCode, Trash2, Wand2 } from 'lucide-react';

const XmlToCsvTool = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [xmlContent, setXmlContent] = useState('');
  const [fileName, setFileName] = useState('data');

  const handleConvert = () => {
    if (!xmlContent.trim()) {
      toast({
        variant: 'destructive',
        title: t('xmlToCsv.errorTitle'),
        description: t('xmlToCsv.errorDescription'),
      });
      return;
    }

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, "application/xml");

      if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
        throw new Error("XML parsing error");
      }

      const items = xmlDoc.documentElement.children;
      if (items.length === 0) {
        toast({
            variant: 'destructive',
            title: t('xmlToCsv.errorParsingTitle'),
            description: "No child elements found in the XML root.",
        });
        return;
      }
      
      const headers = Array.from(items[0].children).map(child => child.tagName);
      const csvRows = [headers.join(',')];

      for (const item of items) {
        const row = headers.map(header => {
          const value = item.getElementsByTagName(header)[0]?.textContent || '';
          return `"${value.replace(/"/g, '""')}"`;
        });
        csvRows.push(row.join(','));
      }
      
      const csvString = csvRows.join('\n');
      
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${fileName || 'data'}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: t('xmlToCsv.successTitle'),
        description: t('xmlToCsv.successDescription'),
      });

    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: t('xmlToCsv.errorParsingTitle'),
        description: t('xmlToCsv.errorParsingDescription'),
      });
    }
  };

  const handleClear = () => {
    setXmlContent('');
    setFileName('data');
    toast({
      title: t('xmlToCsv.clearedTitle'),
      description: t('xmlToCsv.clearedDescription'),
    });
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-2">
        <label htmlFor="xml-input" className="text-lg font-semibold text-gray-700 flex items-center">
          <FileCode className="w-5 h-5 mr-2 text-blue-500" />
          {t('xmlToCsv.xmlInputLabel')}
        </label>
        <Textarea
          id="xml-input"
          value={xmlContent}
          onChange={(e) => setXmlContent(e.target.value)}
          placeholder={t('xmlToCsv.placeholder')}
          className="min-h-[250px] text-base border-gray-300 focus:ring-blue-500 focus:border-blue-500 font-mono"
          rows={12}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="file-name" className="text-lg font-semibold text-gray-700 flex items-center">
          <FileDown className="w-5 h-5 mr-2 text-blue-500" />
          {t('xmlToCsv.fileNameLabel')}
        </label>
        <Input
          id="file-name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder={t('xmlToCsv.fileNamePlaceholder')}
          className="text-base border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleConvert} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-6 flex-grow">
          <Wand2 className="w-6 h-6 mr-2" />
          {t('xmlToCsv.convertButton')}
        </Button>
        <Button onClick={handleClear} variant="outline" className="w-full sm:w-auto border-gray-400 text-gray-700 hover:bg-gray-100 font-bold text-lg py-6">
          <Trash2 className="w-6 h-6 mr-2" />
          {t('xmlToCsv.clearButton')}
        </Button>
      </div>
    </motion.div>
  );
};

export default XmlToCsvTool;