import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from '@/lib/i18n.jsx';
import { FileText, Repeat, Trash2, Wand2, Copy } from 'lucide-react';

const TransposeCsvTool = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [csvContent, setCsvContent] = useState('');
  const [result, setResult] = useState('');

  const handleTranspose = () => {
    if (!csvContent.trim()) {
      toast({
        variant: 'destructive',
        title: t('transposeCsv.errorTitle'),
        description: t('transposeCsv.errorDescription'),
      });
      return;
    }
    try {
      const rows = csvContent.trim().split('\n').map(row => row.split(','));
      const transposedRows = rows[0].map((_, colIndex) => rows.map(row => row[colIndex]));
      const transposedCsv = transposedRows.map(row => row.join(',')).join('\n');
      setResult(transposedCsv);
      toast({
        title: t('transposeCsv.successTitle'),
        description: t('transposeCsv.successDescription'),
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('transposeCsv.errorTitle'),
        description: error.message,
      });
    }
  };

  const handleClear = () => {
    setCsvContent('');
    setResult('');
    toast({
      title: t('transposeCsv.clearedTitle'),
      description: t('transposeCsv.clearedDescription'),
    });
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    toast({
      title: t('transposeCsv.copySuccessTitle'),
      description: t('transposeCsv.copySuccessDescription'),
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
            <FileText className="w-5 h-5 mr-2 text-blue-500" />
            {t('transposeCsv.csvInputLabel')}
          </label>
          <Textarea
            id="csv-input"
            value={csvContent}
            onChange={(e) => setCsvContent(e.target.value)}
            placeholder={t('transposeCsv.csvPlaceholder')}
            className="min-h-[300px] text-base border-gray-300 focus:ring-blue-500 focus:border-blue-500 font-mono"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="result-output" className="text-lg font-semibold text-gray-700 flex items-center">
            <Repeat className="w-5 h-5 mr-2 text-blue-500" />
            {t('transposeCsv.resultLabel')}
          </label>
          <Textarea
            id="result-output"
            value={result}
            readOnly
            className="min-h-[300px] text-base bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500 font-mono"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <Button onClick={handleTranspose} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-6 flex-grow">
          <Wand2 className="w-6 h-6 mr-2" />
          {t('transposeCsv.transposeButton')}
        </Button>
        <Button onClick={handleCopy} variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-100 font-bold text-lg py-6 flex-grow">
          <Copy className="w-6 h-6 mr-2" />
          {t('transposeCsv.copyButton')}
        </Button>
        <Button onClick={handleClear} variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-100 font-bold text-lg py-6">
          <Trash2 className="w-6 h-6 mr-2" />
          {t('transposeCsv.clearButton')}
        </Button>
      </div>
    </motion.div>
  );
};

export default TransposeCsvTool;