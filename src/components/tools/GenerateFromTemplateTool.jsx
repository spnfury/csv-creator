import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from '@/lib/i18n.jsx';
import { Sparkles, Clipboard, Download, Trash2 } from 'lucide-react';

function GenerateFromTemplateTool() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [template, setTemplate] = useState('');
  const [csvData, setCsvData] = useState('');
  const [result, setResult] = useState('');

  const handleGenerate = () => {
    if (!template.trim() || !csvData.trim()) {
      toast({
        variant: "destructive",
        title: t('generateFromTemplate.errorTitle'),
        description: t('generateFromTemplate.errorDescription'),
      });
      return;
    }

    const lines = csvData.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) {
      toast({
        variant: "destructive",
        title: t('generateFromTemplate.errorTitle'),
        description: t('generateFromTemplate.errorDescription'),
      });
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const dataRows = lines.slice(1);

    const generatedTexts = dataRows.map(row => {
      const values = row.split(',');
      let temp = template;
      headers.forEach((header, index) => {
        const regex = new RegExp(`{{${header}}}`, 'g');
        temp = temp.replace(regex, values[index] ? values[index].trim() : '');
      });
      return temp;
    });

    const output = generatedTexts.join('\n\n');
    setResult(output);
    toast({
      title: t('generateFromTemplate.successTitle'),
      description: t('generateFromTemplate.successDescription', { count: generatedTexts.length }),
    });
  };

  const handleClear = () => {
    setTemplate('');
    setCsvData('');
    setResult('');
    toast({
        title: t('generateFromTemplate.clearedTitle'),
        description: t('generateFromTemplate.clearedDescription'),
    });
  };

  const handleCopy = () => {
    if (!result) {
      toast({
        variant: "destructive",
        title: t('generateFromTemplate.copyErrorTitle'),
        description: t('generateFromTemplate.copyErrorDescription'),
      });
      return;
    }
    navigator.clipboard.writeText(result);
    toast({
      title: t('generateFromTemplate.copySuccessTitle'),
      description: t('generateFromTemplate.copySuccessDescription'),
    });
  };
  
  const handleDownload = () => {
    if (!result) {
        toast({
            variant: "destructive",
            title: t('generateFromTemplate.downloadErrorTitle'),
            description: t('generateFromTemplate.downloadErrorDescription'),
        });
        return;
    }
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-from-template.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 bg-white rounded-3xl shadow-lg border-2 border-red-100"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="template" className="block text-lg font-semibold text-gray-800 mb-2">{t('generateFromTemplate.templateLabel')}</label>
          <textarea
            id="template"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            placeholder={t('generateFromTemplate.templatePlaceholder')}
            className="w-full h-40 p-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow"
          />
        </div>
        <div>
          <label htmlFor="csvData" className="block text-lg font-semibold text-gray-800 mb-2">{t('generateFromTemplate.csvDataLabel')}</label>
          <textarea
            id="csvData"
            value={csvData}
            onChange={(e) => setCsvData(e.target.value)}
            placeholder={t('generateFromTemplate.csvDataPlaceholder')}
            className="w-full h-40 p-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow"
          />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center my-6">
        <Button onClick={handleGenerate} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105">
          <Sparkles className="mr-2 h-5 w-5" />
          {t('generateFromTemplate.generateButton')}
        </Button>
        <Button onClick={handleClear} variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg text-lg transition-colors">
            <Trash2 className="mr-2 h-5 w-5" />
            {t('generateFromTemplate.clearButton')}
        </Button>
      </div>

      <div>
        <label htmlFor="result" className="block text-lg font-semibold text-gray-800 mb-2">{t('generateFromTemplate.resultLabel')}</label>
        <div className="relative">
            <textarea
                id="result"
                value={result}
                readOnly
                placeholder="..."
                className="w-full h-64 p-3 bg-gray-100 border-2 border-gray-200 rounded-xl"
            />
            <div className="absolute top-3 right-3 flex flex-col gap-2">
                <Button onClick={handleCopy} size="sm" variant="ghost" className="h-8 px-2 hover:bg-gray-200">
                    <Clipboard className="h-5 w-5 text-gray-600"/>
                </Button>
                <Button onClick={handleDownload} size="sm" variant="ghost" className="h-8 px-2 hover:bg-gray-200">
                    <Download className="h-5 w-5 text-gray-600"/>
                </Button>
            </div>
        </div>
      </div>
    </motion.div>
  );
}

export default GenerateFromTemplateTool;