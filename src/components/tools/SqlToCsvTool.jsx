import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from '@/lib/i18n.jsx';
import { FileDown, FileCode, Trash2, Wand2 } from 'lucide-react';

const SqlToCsvTool = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [sqlContent, setSqlContent] = useState('');
  const [fileName, setFileName] = useState('sql-export');

  const handleConvert = () => {
    if (!sqlContent.trim()) {
      toast({
        variant: 'destructive',
        title: t('sqlToCsv.errorTitle'),
        description: t('sqlToCsv.errorDescription'),
      });
      return;
    }

    try {
      const insertRegex = /INSERT INTO `?(\w+)`? \((.*?)\) VALUES \((.*?)\);/gi;
      let matches;
      let headers = [];
      const rows = [];
      let firstMatch = true;

      while ((matches = insertRegex.exec(sqlContent)) !== null) {
        if (firstMatch) {
          headers = matches[2].split(',').map(h => h.trim().replace(/`/g, ''));
          firstMatch = false;
        }
        const values = matches[3].split(',').map(v => {
          let value = v.trim();
          if (value.startsWith("'") && value.endsWith("'")) {
            value = value.substring(1, value.length - 1);
          }
          return value.replace(/''/g, "'");
        });
        rows.push(values);
      }

      if (headers.length === 0) {
        toast({
          variant: 'destructive',
          title: t('sqlToCsv.errorParsingTitle'),
          description: t('sqlToCsv.errorParsingDescription'),
        });
        return;
      }

      const escapeCsvCell = (cell) => {
        const strCell = String(cell);
        if (strCell.includes(',') || strCell.includes('"') || strCell.includes('\n')) {
          return `"${strCell.replace(/"/g, '""')}"`;
        }
        return strCell;
      };

      const csvHeader = headers.map(escapeCsvCell).join(',');
      const csvRows = rows.map(row => row.map(escapeCsvCell).join(','));
      const csvString = [csvHeader, ...csvRows].join('\n');

      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${fileName || 'sql-export'}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: t('sqlToCsv.successTitle'),
        description: t('sqlToCsv.successDescription'),
      });

    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: t('sqlToCsv.errorParsingTitle'),
        description: t('sqlToCsv.errorParsingDescription'),
      });
    }
  };

  const handleClear = () => {
    setSqlContent('');
    setFileName('sql-export');
    toast({
      title: t('sqlToCsv.clearedTitle'),
      description: t('sqlToCsv.clearedDescription'),
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
        <label htmlFor="sql-input" className="text-lg font-semibold text-gray-700 flex items-center">
          <FileCode className="w-5 h-5 mr-2 text-blue-500" />
          {t('sqlToCsv.sqlInputLabel')}
        </label>
        <Textarea
          id="sql-input"
          value={sqlContent}
          onChange={(e) => setSqlContent(e.target.value)}
          placeholder={t('sqlToCsv.placeholder')}
          className="min-h-[250px] text-base border-gray-300 focus:ring-blue-500 focus:border-blue-500 font-mono"
          rows={12}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="file-name" className="text-lg font-semibold text-gray-700 flex items-center">
          <FileDown className="w-5 h-5 mr-2 text-blue-500" />
          {t('sqlToCsv.fileNameLabel')}
        </label>
        <Input
          id="file-name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder={t('sqlToCsv.fileNamePlaceholder')}
          className="text-base border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleConvert} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-6 flex-grow">
          <Wand2 className="w-6 h-6 mr-2" />
          {t('sqlToCsv.convertButton')}
        </Button>
        <Button onClick={handleClear} variant="outline" className="w-full sm:w-auto border-gray-400 text-gray-700 hover:bg-gray-100 font-bold text-lg py-6">
          <Trash2 className="w-6 h-6 mr-2" />
          {t('sqlToCsv.clearButton')}
        </Button>
      </div>
    </motion.div>
  );
};

export default SqlToCsvTool;