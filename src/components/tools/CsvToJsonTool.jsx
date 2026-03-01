import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from '@/lib/i18n.jsx';
import { FileJson, FileText, Trash2, Wand2, Copy, Download } from 'lucide-react';

const CsvToJsonTool = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [csvContent, setCsvContent] = useState('');
  const [jsonResult, setJsonResult] = useState('');

  const parseCSV = (csv) => {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const result = [];
    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentline = lines[i].split(',');
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j]?.trim() || '';
      }
      result.push(obj);
    }
    return result;
  };

  const handleConvert = () => {
    if (!csvContent.trim()) {
      toast({
        variant: 'destructive',
        title: t('csvToJson.errorTitle'),
        description: t('csvToJson.errorDescription'),
      });
      return;
    }
    try {
      const jsonArray = parseCSV(csvContent);
      const jsonString = JSON.stringify(jsonArray, null, 2);
      setJsonResult(jsonString);
      toast({
        title: t('csvToJson.successTitle'),
        description: t('csvToJson.successDescription'),
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('csvToJson.errorTitle'),
        description: error.message,
      });
    }
  };

  const handleClear = () => {
    setCsvContent('');
    setJsonResult('');
    toast({
      title: t('csvToJson.clearedTitle'),
      description: t('csvToJson.clearedDescription'),
    });
  };

  const handleCopy = () => {
    if (!jsonResult) {
      toast({
        variant: 'destructive',
        title: t('csvToJson.copyErrorTitle'),
        description: t('csvToJson.copyErrorDescription'),
      });
      return;
    }
    navigator.clipboard.writeText(jsonResult);
    toast({
      title: t('csvToJson.copySuccessTitle'),
      description: t('csvToJson.copySuccessDescription'),
    });
  };
  
  const handleDownload = () => {
    if (!jsonResult) {
      toast({
        variant: 'destructive',
        title: t('csvToJson.copyErrorTitle'),
        description: t('csvToJson.copyErrorDescription'),
      });
      return;
    }
    const blob = new Blob([jsonResult], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'data.json');
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
        <div className="space-y-2">
          <label htmlFor="csv-input" className="text-lg font-semibold text-gray-700 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-500" />
            {t('csvToJson.csvInputLabel')}
          </label>
          <Textarea
            id="csv-input"
            value={csvContent}
            onChange={(e) => setCsvContent(e.target.value)}
            placeholder={t('csvToJson.placeholder')}
            className="min-h-[300px] text-base border-gray-300 focus:ring-blue-500 focus:border-blue-500 font-mono"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="json-result" className="text-lg font-semibold text-gray-700 flex items-center">
            <FileJson className="w-5 h-5 mr-2 text-blue-500" />
            {t('csvToJson.resultLabel')}
          </label>
          <Textarea
            id="json-result"
            value={jsonResult}
            readOnly
            placeholder='{ "result": "..." }'
            className="min-h-[300px] text-base bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500 font-mono"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <Button onClick={handleConvert} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-6 flex-grow">
          <Wand2 className="w-6 h-6 mr-2" />
          {t('csvToJson.convertButton')}
        </Button>
        <Button onClick={handleCopy} variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-100 font-bold text-lg py-6 flex-grow">
          <Copy className="w-6 h-6 mr-2" />
          {t('csvToJson.copyButton')}
        </Button>
        <Button onClick={handleDownload} variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-100 font-bold text-lg py-6 flex-grow">
          <Download className="w-6 h-6 mr-2" />
          {t('csvToJson.downloadButton')}
        </Button>
        <Button onClick={handleClear} variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-100 font-bold text-lg py-6">
          <Trash2 className="w-6 h-6 mr-2" />
          {t('csvToJson.clearButton')}
        </Button>
      </div>
    </motion.div>
  );
};

export default CsvToJsonTool;