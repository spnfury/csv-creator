import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from '@/lib/i18n.jsx';
import { FileDown, FileText, Globe, Trash2, Wand2 } from 'lucide-react';

const CsvToKmlTool = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [csvContent, setCsvContent] = useState('');
  const [fileName, setFileName] = useState('map');
  const [latCol, setLatCol] = useState('lat');
  const [lonCol, setLonCol] = useState('lon');
  const [nameCol, setNameCol] = useState('name');
  const [descCol, setDescCol] = useState('description');

  const csvToObjects = (csv) => {
    const lines = csv.split(/[\r\n]+/).filter(line => line.trim() !== '');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentline = lines[i].split(',');
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j]?.trim();
        }
        result.push(obj);
    }
    return result;
  };

  const handleConvert = () => {
    if (!csvContent.trim()) {
      toast({
        variant: 'destructive',
        title: t('csvToKml.errorTitle'),
        description: t('csvToKml.errorDescription'),
      });
      return;
    }

    try {
      const data = csvToObjects(csvContent);
      if (data.length === 0 || !data[0][latCol] || !data[0][lonCol]) {
        toast({
          variant: 'destructive',
          title: t('csvToKml.errorColumnTitle'),
          description: t('csvToKml.errorColumnDescription'),
        });
        return;
      }

      let placemarks = '';
      for (const row of data) {
        const lon = row[lonCol];
        const lat = row[latCol];
        const name = nameCol && row[nameCol] ? row[nameCol] : '';
        const description = descCol && row[descCol] ? row[descCol] : '';

        if (lon && lat) {
          placemarks += `
    <Placemark>
      ${name ? `<name>${name}</name>` : ''}
      ${description ? `<description>${description}</description>` : ''}
      <Point>
        <coordinates>${lon},${lat},0</coordinates>
      </Point>
    </Placemark>`;
        }
      }

      const kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    ${placemarks}
  </Document>
</kml>`;

      const blob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName || 'map'}.kml`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: t('csvToKml.successTitle'),
        description: t('csvToKml.successDescription'),
      });

    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: t('csvToKml.errorTitle'),
        description: t('csvToKml.errorDescription'),
      });
    }
  };

  const handleClear = () => {
    setCsvContent('');
    setFileName('map');
    setLatCol('lat');
    setLonCol('lon');
    setNameCol('name');
    setDescCol('description');
    toast({
      title: t('csvToKml.clearedTitle'),
      description: t('csvToKml.clearedDescription'),
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
          {t('csvToKml.csvInputLabel')}
        </label>
        <Textarea
          id="csv-input"
          value={csvContent}
          onChange={(e) => setCsvContent(e.target.value)}
          placeholder={t('csvToKml.placeholder')}
          className="min-h-[200px] text-base border-gray-300 focus:ring-red-500 focus:border-red-500"
          rows={10}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="lat-col" className="font-semibold text-gray-700">{t('csvToKml.latColumnLabel')}</label>
          <Input id="lat-col" value={latCol} onChange={(e) => setLatCol(e.target.value)} placeholder={t('csvToKml.columnPlaceholder')} />
        </div>
        <div className="space-y-2">
          <label htmlFor="lon-col" className="font-semibold text-gray-700">{t('csvToKml.lonColumnLabel')}</label>
          <Input id="lon-col" value={lonCol} onChange={(e) => setLonCol(e.target.value)} placeholder={t('csvToKml.columnPlaceholder')} />
        </div>
        <div className="space-y-2">
          <label htmlFor="name-col" className="font-semibold text-gray-700">{t('csvToKml.nameColumnLabel')}</label>
          <Input id="name-col" value={nameCol} onChange={(e) => setNameCol(e.target.value)} placeholder={t('csvToKml.columnPlaceholder')} />
        </div>
        <div className="space-y-2">
          <label htmlFor="desc-col" className="font-semibold text-gray-700">{t('csvToKml.descColumnLabel')}</label>
          <Input id="desc-col" value={descCol} onChange={(e) => setDescCol(e.target.value)} placeholder={t('csvToKml.columnPlaceholder')} />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="file-name" className="text-lg font-semibold text-gray-700 flex items-center">
          <FileDown className="w-5 h-5 mr-2 text-red-500" />
          {t('csvToKml.fileNameLabel')}
        </label>
        <Input
          id="file-name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder={t('csvToKml.fileNamePlaceholder')}
          className="text-base border-gray-300 focus:ring-red-500 focus:border-red-500"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleConvert} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-6 flex-grow">
          <Globe className="w-6 h-6 mr-2" />
          {t('csvToKml.convertButton')}
        </Button>
        <Button onClick={handleClear} variant="outline" className="w-full sm:w-auto border-gray-400 text-gray-700 hover:bg-gray-100 font-bold text-lg py-6">
          <Trash2 className="w-6 h-6 mr-2" />
          {t('csvToKml.clearButton')}
        </Button>
      </div>
    </motion.div>
  );
};

export default CsvToKmlTool;