import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from '@/lib/i18n.jsx';
import { FileText, WrapText, Trash2, Wand2, Copy, Download } from 'lucide-react';

const CsvToMultiLineTool = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [csvContent, setCsvContent] = useState('');
  const [template, setTemplate] = useState('');
  const [result, setResult] = useState('');

  const parseCSV = (csv) => {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentline = lines[i].split(',');
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j]?.trim() || '';
      }
      data.push(obj);
    }
    return { headers, data };
  };

  const handleConvert = () => {
    if (!csvContent.trim()) {
      toast({
        variant: 'destructive',
        title: t('csvToMultiLine.errorTitle'),
        description: t('csvToMultiLine.errorDescription'),
      });
      return;
    }
    try {
      const { headers, data } = parseCSV(csvContent);
      let output = '';
      const defaultTemplate = headers.map(h => `${h}: {{${h}}}`).join('\n');
      const currentTemplate = template.trim() || defaultTemplate;

      data.forEach((row, index) => {
        let recordString = currentTemplate.replace(/{{index}}/g, index + 1);
        headers.forEach(header => {
          const regex = new RegExp(`{{${header}}}`, 'g');
          recordString = recordString.replace(regex, row[header]);
        });
        output += recordString + '\n\n';
      });

      setResult(output.trim());
      toast({
        title: t('csvToMultiLine.successTitle'),
        description: t('csvToMultiLine.successDescription'),
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('csvToMultiLine.errorTitle'),
        description: error.message,
      });
    }
  };

  const handleClear = () => {
    setCsvContent('');
    setTemplate('');
    setResult('');
    toast({
      title: t('csvToMultiLine.clearedTitle'),
      description: t('csvToMultiLine.clearedDescription'),
    });
  };

  const handleCopy = () => {
    if (!result) {
        toast({
            variant: 'destructive',
            title: t('csvToMultiLine.copyErrorTitle'),
            description: t('csvToMultiLine.copyErrorDescription'),
        });
        return;
    }
    navigator.clipboard.writeText(result);
    toast({
      title: t('csvToMultiLine.copySuccessTitle'),
      description: t('csvToMultiLine.copySuccessDescription'),
    });
  };

  const handleDownload = () => {
    if (!result) {
        toast({
            variant: 'destructive',
            title: t('csvToMultiLine.downloadErrorTitle'),
            description: t('csvToMultiLine.downloadErrorDescription'),
        });
        return;
    }
    const blob = new Blob([result], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'multiline-result.txt');
    link.style.visibility = 'hidden';
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
        <div className="space-y-4">
          <div>
            <label htmlFor="csv-input" className="text-lg font-semibold text-gray-700 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-red-500" />
              {t('csvToMultiLine.csvInputLabel')}
            </label>
            <Textarea
              id="csv-input"
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              placeholder={t('csvToMultiLine.placeholder')}
              className="min-h-[200px] text-base border-gray-300 focus:ring-red-500 focus:border-red-500 font-mono"
            />
          </div>
          <div>
            <label htmlFor="template-input" className="text-lg font-semibold text-gray-700 flex items-center">
              <WrapText className="w-5 h-5 mr-2 text-red-500" />
              {t('csvToMultiLine.templateLabel')}
            </label>
            <Textarea
              id="template-input"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              placeholder={t('csvToMultiLine.templatePlaceholder')}
              className="h-[120px] text-base border-gray-300 focus:ring-red-500 focus:border-red-500 font-mono"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="result-output" className="text-lg font-semibold text-gray-700 flex items-center">
            <WrapText className="w-5 h-5 mr-2 text-red-500" />
            {t('csvToMultiLine.resultLabel')}
          </label>
          <Textarea
            id="result-output"
            value={result}
            readOnly
            className="min-h-[360px] text-base bg-gray-50 border-gray-300 focus:ring-red-500 focus:border-red-500 font-mono"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <Button onClick={handleConvert} className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-6 flex-grow">
          <Wand2 className="w-6 h-6 mr-2" />
          {t('csvToMultiLine.convertButton')}
        </Button>
        <Button onClick={handleCopy} variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-100 font-bold text-lg py-6 flex-grow">
          <Copy className="w-6 h-6 mr-2" />
          {t('csvToMultiLine.copyButton')}
        </Button>
        <Button onClick={handleDownload} variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-100 font-bold text-lg py-6 flex-grow">
          <Download className="w-6 h-6 mr-2" />
          {t('csvToMultiLine.downloadButton')}
        </Button>
        <Button onClick={handleClear} variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-100 font-bold text-lg py-6">
          <Trash2 className="w-6 h-6 mr-2" />
          {t('csvToMultiLine.clearButton')}
        </Button>
      </div>
    </motion.div>
  );
};

export default CsvToMultiLineTool;