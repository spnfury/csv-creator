import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from '@/lib/i18n.jsx';
import { FileText, Database, Trash2, Wand2, Copy } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CsvToSqlTool = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [csvContent, setCsvContent] = useState('');
  const [tableName, setTableName] = useState('my_table');
  const [sqlType, setSqlType] = useState('insert');
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

  const escapeSqlValue = (value) => {
    if (value === null || value === undefined) return 'NULL';
    return `'${String(value).replace(/'/g, "''")}'`;
  };

  const handleConvert = () => {
    if (!csvContent.trim() || !tableName.trim()) {
      toast({
        variant: 'destructive',
        title: t('csvToSql.errorTitle'),
        description: t('csvToSql.errorDescription'),
      });
      return;
    }
    try {
      const { headers, data } = parseCSV(csvContent);
      let sqlStatements = '';

      if (sqlType === 'insert') {
        const headerString = headers.map(h => `\`${h}\``).join(', ');
        data.forEach(row => {
          const valueString = headers.map(h => escapeSqlValue(row[h])).join(', ');
          sqlStatements += `INSERT INTO \`${tableName}\` (${headerString}) VALUES (${valueString});\n`;
        });
      } else { // update
        data.forEach(row => {
          const setClauses = headers.slice(1).map(h => `\`${h}\` = ${escapeSqlValue(row[h])}`).join(', ');
          const whereClause = `\`${headers[0]}\` = ${escapeSqlValue(row[headers[0]])}`;
          sqlStatements += `UPDATE \`${tableName}\` SET ${setClauses} WHERE ${whereClause};\n`;
        });
      }

      setResult(sqlStatements);
      toast({
        title: t('csvToSql.successTitle'),
        description: t('csvToSql.successDescription'),
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('csvToSql.errorTitle'),
        description: error.message,
      });
    }
  };

  const handleClear = () => {
    setCsvContent('');
    setTableName('my_table');
    setResult('');
    toast({
      title: t('csvToSql.clearedTitle'),
      description: t('csvToSql.clearedDescription'),
    });
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    toast({
      title: t('csvToSql.copySuccessTitle'),
      description: t('csvToSql.copySuccessDescription'),
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
        <div className="space-y-4">
          <div>
            <label htmlFor="csv-input" className="text-lg font-semibold text-gray-700 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-red-500" />
              {t('csvToSql.csvInputLabel')}
            </label>
            <Textarea
              id="csv-input"
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              placeholder={t('csvToSql.placeholder')}
              className="min-h-[200px] text-base border-gray-300 focus:ring-red-500 focus:border-red-500 font-mono"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="table-name" className="text-lg font-semibold text-gray-700 flex items-center">
                <Database className="w-5 h-5 mr-2 text-red-500" />
                {t('csvToSql.tableNameLabel')}
              </label>
              <Input
                id="table-name"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                placeholder={t('csvToSql.tableNamePlaceholder')}
                className="text-base border-gray-300 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="text-lg font-semibold text-gray-700 block mb-2">
                {t('csvToSql.sqlTypeLabel')}
              </label>
              <Tabs value={sqlType} onValueChange={setSqlType} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="insert">{t('csvToSql.insert')}</TabsTrigger>
                  <TabsTrigger value="update">{t('csvToSql.update')}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="result-output" className="text-lg font-semibold text-gray-700 flex items-center">
            <Database className="w-5 h-5 mr-2 text-red-500" />
            {t('csvToSql.resultLabel')}
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
          {t('csvToSql.convertButton')}
        </Button>
        <Button onClick={handleCopy} variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-100 font-bold text-lg py-6 flex-grow">
          <Copy className="w-6 h-6 mr-2" />
          {t('csvToSql.copyButton')}
        </Button>
        <Button onClick={handleClear} variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-100 font-bold text-lg py-6">
          <Trash2 className="w-6 h-6 mr-2" />
          {t('csvToSql.clearButton')}
        </Button>
      </div>
    </motion.div>
  );
};

export default CsvToSqlTool;