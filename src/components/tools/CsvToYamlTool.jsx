import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from '@/lib/i18n.jsx';
import { FileText, FileCode, Trash2, Wand2, Copy } from 'lucide-react';

const CsvToYamlTool = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [csvContent, setCsvContent] = useState('');
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

  const toYaml = (data, headers) => {
    let yamlString = '';
    data.forEach(row => {
      yamlString += '-\n';
      headers.forEach(header => {
        yamlString += `  ${header}: ${row[header]}\n`;
      });
    });
    return yamlString;
  };

  const handleConvert = () => {
    if (!csvContent.trim()) {
      toast({
        variant: 'destructive',
        title: t('csvToYaml.errorTitle'),
        description: t('csvToYaml.errorDescription'),
      });
      return;
    }
    try {
      const { headers, data } = parseCSV(csvContent);
      const yamlResult = toYaml(data, headers);
      setResult(yamlResult);
      toast({
        title: t('csvToYaml.successTitle'),
        description: t('csvToYaml.successDescription'),
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('csvToYaml.errorTitle'),
        description: error.message,
      });
    }
  };

  const handleClear = () => {
    setCsvContent('');
    setResult('');
    toast({
      title: t('csvToYaml.clearedTitle'),
      description: t('csvToYaml.clearedDescription'),
    });
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    toast({
      title: t('csvToYaml.copySuccessTitle'),
      description: t('csvToYaml.copySuccessDescription'),
    });
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
            <FileText className="w-5 h-5 mr-2 text-red-500" />
            {t('csvToYaml.csvInputLabel')}
          </label>
          <Textarea
            id="csv-input"
            value={csvContent}
            onChange={(e) => setCsvContent(e.target.value)}
            placeholder={t('csvToYaml.placeholder')}
            className="min-h-[300px] text-base border-gray-300 focus:ring-red-500 focus:border-red-500 font-mono"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="result-output" className="text-lg font-semibold text-gray-700 flex items-center">
            <FileCode className="w-5 h-5 mr-2 text-red-500" />
            {t('csvToYaml.resultLabel')}
          </label>
          <Textarea
            id="result-output"
            value={result}
            readOnly
            className="min-h-[300px] text-base bg-gray-50 border-gray-300 focus:ring-red-500 focus:border-red-500 font-mono"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <Button onClick={handleConvert} className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-6 flex-grow">
          <Wand2 className="w-6 h-6 mr-2" />
          {t('csvToYaml.convertButton')}
        </Button>
        <Button onClick={handleCopy} variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-100 font-bold text-lg py-6 flex-grow">
          <Copy className="w-6 h-6 mr-2" />
          {t('csvToYaml.copyButton')}
        </Button>
        <Button onClick={handleClear} variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-100 font-bold text-lg py-6">
          <Trash2 className="w-6 h-6 mr-2" />
          {t('csvToYaml.clearButton')}
        </Button>
      </div>
    </motion.div>
  );
};

export default CsvToYamlTool;