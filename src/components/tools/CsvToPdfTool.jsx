import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from '@/lib/i18n.jsx';
import { FileDown, FileText, Trash2, Wand2, Settings, ArrowRightLeft, Text, SlidersHorizontal } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const CsvToPdfTool = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [csvContent, setCsvContent] = useState('');
  const [fileName, setFileName] = useState('document');
  const [orientation, setOrientation] = useState('portrait');
  const [fontSize, setFontSize] = useState(10);

  const parseCSV = (str) => {
    const lines = str.split(/[\r\n]+/).filter(line => line.trim() !== '');
    return lines.map(line => line.split(',').map(field => field.trim()));
  };

  const handleConvert = () => {
    if (!csvContent.trim()) {
      toast({
        variant: 'destructive',
        title: t('csvToPdf.errorTitle'),
        description: t('csvToPdf.errorDescription'),
      });
      return;
    }

    try {
      const data = parseCSV(csvContent);
      const head = [data[0]];
      const body = data.slice(1);

      const doc = new jsPDF({
        orientation: orientation,
      });

      doc.autoTable({
        head: head,
        body: body,
        styles: {
          fontSize: fontSize,
        },
        headStyles: {
            fillColor: [239, 68, 68] // blue-500
        },
      });

      doc.save(`${fileName || 'document'}.pdf`);

      toast({
        title: t('csvToPdf.successTitle'),
        description: t('csvToPdf.successDescription'),
      });

    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: t('csvToPdf.errorTitle'),
        description: t('csvToPdf.errorDescription'),
      });
    }
  };

  const handleClear = () => {
    setCsvContent('');
    setFileName('document');
    setOrientation('portrait');
    setFontSize(10);
    toast({
      title: t('csvToPdf.clearedTitle'),
      description: t('csvToPdf.clearedDescription'),
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
          <FileText className="w-5 h-5 mr-2 text-blue-500" />
          {t('csvToPdf.csvInputLabel')}
        </label>
        <Textarea
          id="csv-input"
          value={csvContent}
          onChange={(e) => setCsvContent(e.target.value)}
          placeholder={t('csvToPdf.placeholder')}
          className="min-h-[200px] text-base border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          rows={10}
        />
      </div>
      
      <div className="bg-blue-50 rounded-lg p-4 space-y-4 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center"><SlidersHorizontal className="w-5 h-5 mr-2 text-blue-500" />{t('csvToPdf.optionsTitle')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label htmlFor="orientation" className="font-medium text-gray-600 flex items-center"><ArrowRightLeft className="w-4 h-4 mr-2" />{t('csvToPdf.orientationLabel')}</label>
                <div className="flex gap-2">
                    <Button variant={orientation === 'portrait' ? 'solid' : 'outline'} onClick={() => setOrientation('portrait')} className={`flex-1 ${orientation === 'portrait' ? 'bg-blue-500 text-white' : 'text-gray-700'}`}>{t('csvToPdf.orientationPortrait')}</Button>
                    <Button variant={orientation === 'landscape' ? 'solid' : 'outline'} onClick={() => setOrientation('landscape')} className={`flex-1 ${orientation === 'landscape' ? 'bg-blue-500 text-white' : 'text-gray-700'}`}>{t('csvToPdf.orientationLandscape')}</Button>
                </div>
            </div>
            <div className="space-y-2">
                <label htmlFor="font-size" className="font-medium text-gray-600 flex items-center"><Text className="w-4 h-4 mr-2" />{t('csvToPdf.fontSizeLabel')}</label>
                <Input
                    id="font-size"
                    type="number"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                    className="text-base border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    min="5"
                    max="20"
                />
            </div>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="file-name" className="text-lg font-semibold text-gray-700 flex items-center">
          <FileDown className="w-5 h-5 mr-2 text-blue-500" />
          {t('csvToPdf.fileNameLabel')}
        </label>
        <Input
          id="file-name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder={t('csvToPdf.fileNamePlaceholder')}
          className="text-base border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleConvert} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-6 flex-grow">
          <Wand2 className="w-6 h-6 mr-2" />
          {t('csvToPdf.convertButton')}
        </Button>
        <Button onClick={handleClear} variant="outline" className="w-full sm:w-auto border-gray-400 text-gray-700 hover:bg-gray-100 font-bold text-lg py-6">
          <Trash2 className="w-6 h-6 mr-2" />
          {t('csvToPdf.clearButton')}
        </Button>
      </div>
    </motion.div>
  );
};

export default CsvToPdfTool;