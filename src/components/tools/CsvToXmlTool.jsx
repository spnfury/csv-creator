import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from '@/lib/i18n.jsx';
import { FileText, FileCode, Trash2, Wand2, Copy, Download } from 'lucide-react';

const CsvToXmlTool = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [csvContent, setCsvContent] = useState('');
  const [rootTag, setRootTag] = useState('data');
  const [recordTag, setRecordTag] = useState('record');
  const [result, setResult] = useState('');

  const parseCSV = (csv) => {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/[^a-zA-Z0-9_]/g, ''));
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

  const escapeXml = (text) => {
    return String(text).replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case "'": return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  };

  const handleConvert = () => {
    if (!csvContent.trim() || !rootTag.trim() || !recordTag.trim()) {
      toast({
        variant: 'destructive',
        title: t('csvToXml.errorTitle'),
        description: t('csvToXml.errorDescription'),
      });
      return;
    }
    try {
      const { headers, data } = parseCSV(csvContent);
      let xmlString = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootTag}>\n`;

      data.forEach(row => {
        xmlString += `  <${recordTag}>\n`;
        headers.forEach(header => {
          xmlString += `    <${header}>${escapeXml(row[header])}</${header}>\n`;
        });
        xmlString += `  </${recordTag}>\n`;
      });

      xmlString += `</${rootTag}>`;
      setResult(xmlString);
      toast({
        title: t('csvToXml.successTitle'),
        description: t('csvToXml.successDescription'),
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('csvToXml.errorTitle'),
        description: error.message,
      });
    }
  };

  const handleClear = () => {
    setCsvContent('');
    setRootTag('data');
    setRecordTag('record');
    setResult('');
    toast({
      title: t('csvToXml.clearedTitle'),
      description: t('csvToXml.clearedDescription'),
    });
  };

  const handleCopy = () => {
    if (!result) {
        toast({
            variant: 'destructive',
            title: t('csvToXml.copyErrorTitle'),
            description: t('csvToXml.copyErrorDescription'),
        });
        return;
    }
    navigator.clipboard.writeText(result);
    toast({
      title: t('csvToXml.copySuccessTitle'),
      description: t('csvToXml.copySuccessDescription'),
    });
  };

  const handleDownload = () => {
    if (!result) {
      toast({
        variant: 'destructive',
        title: t('csvToXml.downloadErrorTitle'),
        description: t('csvToXml.downloadErrorDescription'),
      });
      return;
    }
    const blob = new Blob([result], { type: 'application/xml;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'data.xml');
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
              <FileText className="w-5 h-5 mr-2 text-blue-500" />
              {t('csvToXml.csvInputLabel')}
            </label>
            <Textarea
              id="csv-input"
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              placeholder={t('csvToXml.placeholder')}
              className="min-h-[200px] text-base border-gray-300 focus:ring-blue-500 focus:border-blue-500 font-mono"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="root-tag" className="text-lg font-semibold text-gray-700 flex items-center">
                <FileCode className="w-5 h-5 mr-2 text-blue-500" />
                {t('csvToXml.rootTagLabel')}
              </label>
              <Input
                id="root-tag"
                value={rootTag}
                onChange={(e) => setRootTag(e.target.value)}
                placeholder={t('csvToXml.rootTagPlaceholder')}
                className="text-base border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="record-tag" className="text-lg font-semibold text-gray-700 flex items-center">
                <FileCode className="w-5 h-5 mr-2 text-blue-500" />
                {t('csvToXml.recordTagLabel')}
              </label>
              <Input
                id="record-tag"
                value={recordTag}
                onChange={(e) => setRecordTag(e.target.value)}
                placeholder={t('csvToXml.recordTagPlaceholder')}
                className="text-base border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="result-output" className="text-lg font-semibold text-gray-700 flex items-center">
            <FileCode className="w-5 h-5 mr-2 text-blue-500" />
            {t('csvToXml.resultLabel')}
          </label>
          <Textarea
            id="result-output"
            value={result}
            readOnly
            className="min-h-[360px] text-base bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500 font-mono"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <Button onClick={handleConvert} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-6 flex-grow">
          <Wand2 className="w-6 h-6 mr-2" />
          {t('csvToXml.convertButton')}
        </Button>
        <Button onClick={handleCopy} variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-100 font-bold text-lg py-6 flex-grow">
          <Copy className="w-6 h-6 mr-2" />
          {t('csvToXml.copyButton')}
        </Button>
        <Button onClick={handleDownload} variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-100 font-bold text-lg py-6 flex-grow">
          <Download className="w-6 h-6 mr-2" />
          {t('csvToXml.downloadButton')}
        </Button>
        <Button onClick={handleClear} variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-100 font-bold text-lg py-6">
          <Trash2 className="w-6 h-6 mr-2" />
          {t('csvToXml.clearButton')}
        </Button>
      </div>
    </motion.div>
  );
};

export default CsvToXmlTool;