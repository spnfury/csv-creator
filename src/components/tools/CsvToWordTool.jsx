import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from '@/lib/i18n.jsx';
import { FileDown, FileText, Trash2, Wand2 } from 'lucide-react';

const CsvToWordTool = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [csvContent, setCsvContent] = useState('');
  const [fileName, setFileName] = useState('document');

  const parseCSV = (str) => {
    const arr = [];
    let quote = false;
    let row = 0;
    let col = 0;
    let c = 0;
    while (c < str.length) {
        let cc = str[c];
        let nc = str[c+1];
        arr[row] = arr[row] || [];
        arr[row][col] = arr[row][col] || '';

        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; }
        else if (cc == '"') { quote = !quote; }
        else if (cc == ',' && !quote) { ++col; }
        else if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; }
        else if (cc == '\n' && !quote) { ++row; col = 0; }
        else if (cc == '\r' && !quote) { ++row; col = 0; }
        else { arr[row][col] += cc; }
        ++c;
    }
    return arr;
  };

  const handleConvert = () => {
    if (!csvContent.trim()) {
      toast({
        variant: 'destructive',
        title: t('csvToWord.errorTitle'),
        description: t('csvToWord.errorDescription'),
      });
      return;
    }

    try {
      const data = parseCSV(csvContent);
      let tableHtml = '<table border="1" style="border-collapse: collapse; width: 100%;">';
      
      const header = data[0];
      tableHtml += '<thead><tr>';
      header.forEach(cell => {
        tableHtml += `<th style="border: 1px solid #dddddd; text-align: left; padding: 8px; background-color: #f2f2f2;">${cell}</th>`;
      });
      tableHtml += '</tr></thead>';

      tableHtml += '<tbody>';
      for (let i = 1; i < data.length; i++) {
        tableHtml += '<tr>';
        data[i].forEach(cell => {
          tableHtml += `<td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${cell}</td>`;
        });
        tableHtml += '</tr>';
      }
      tableHtml += '</tbody></table>';

      const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>Word from CSV</title></head>
        <body>${tableHtml}</body>
        </html>`;

      const blob = new Blob(['\ufeff', htmlContent], {
        type: 'application/msword'
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName || 'document'}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: t('csvToWord.successTitle'),
        description: t('csvToWord.successDescription'),
      });

    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: t('csvToWord.errorTitle'),
        description: t('csvToWord.errorDescription'),
      });
    }
  };

  const handleClear = () => {
    setCsvContent('');
    setFileName('document');
    toast({
      title: t('csvToWord.clearedTitle'),
      description: t('csvToWord.clearedDescription'),
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
        <label htmlFor="csv-input" className="text-lg font-semibold text-gray-700 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-red-500" />
          {t('csvToWord.csvInputLabel')}
        </label>
        <Textarea
          id="csv-input"
          value={csvContent}
          onChange={(e) => setCsvContent(e.target.value)}
          placeholder={t('csvToWord.placeholder')}
          className="min-h-[200px] text-base border-gray-300 focus:ring-red-500 focus:border-red-500"
          rows={10}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="file-name" className="text-lg font-semibold text-gray-700 flex items-center">
          <FileDown className="w-5 h-5 mr-2 text-red-500" />
          {t('csvToWord.fileNameLabel')}
        </label>
        <Input
          id="file-name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder={t('csvToWord.fileNamePlaceholder')}
          className="text-base border-gray-300 focus:ring-red-500 focus:border-red-500"
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleConvert} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-6 flex-grow">
          <Wand2 className="w-6 h-6 mr-2" />
          {t('csvToWord.convertButton')}
        </Button>
        <Button onClick={handleClear} variant="outline" className="w-full sm:w-auto border-gray-400 text-gray-700 hover:bg-gray-100 font-bold text-lg py-6">
          <Trash2 className="w-6 h-6 mr-2" />
          {t('csvToWord.clearButton')}
        </Button>
      </div>
    </motion.div>
  );
};

export default CsvToWordTool;