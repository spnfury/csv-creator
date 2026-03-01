import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from '@/lib/i18n.jsx';
import { FileText, Database, Play, Download } from 'lucide-react';
import alasql from 'alasql';

const QueryCsvWithSqlTool = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [csvData, setCsvData] = useState('');
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM csv_data');
  const [queryResult, setQueryResult] = useState(null);
  const [error, setError] = useState(null);

  const handleExecuteQuery = () => {
    if (!csvData.trim()) {
      toast({ variant: 'destructive', title: t('queryCsvWithSql.queryErrorTitle'), description: 'Please provide CSV data.' });
      return;
    }
    try {
      const lines = csvData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      const data = lines.slice(1).map(line => {
        const values = line.split(',');
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index]?.trim();
        });
        return row;
      });

      const res = alasql(sqlQuery, [data]);
      setQueryResult(res);
      setError(null);
      toast({ title: t('queryCsvWithSql.successTitle'), description: t('queryCsvWithSql.successDescription', { count: res.length }) });
    } catch (e) {
      setError(e.message);
      setQueryResult(null);
      toast({ variant: 'destructive', title: t('queryCsvWithSql.queryErrorTitle'), description: t('queryCsvWithSql.queryErrorDescription') });
    }
  };

  const renderTable = () => {
    if (!queryResult) {
      return <p className="text-gray-500">{t('queryCsvWithSql.noResult')}</p>;
    }
    if (queryResult.length === 0) {
      return <p className="text-gray-500">Query returned no results.</p>;
    }
    const headers = Object.keys(queryResult[0]);
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              {headers.map(header => <th key={header} scope="col" className="px-6 py-3">{header}</th>)}
            </tr>
          </thead>
          <tbody>
            {queryResult.map((row, index) => (
              <tr key={index} className="bg-white border-b">
                {headers.map(header => <td key={header} className="px-6 py-4">{String(row[header])}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  const downloadResultAsCsv = () => {
    if (!queryResult || queryResult.length === 0) {
        toast({ variant: 'destructive', title: 'Nothing to download', description: 'Please execute a query first.' });
        return;
    }
    const headers = Object.keys(queryResult[0]);
    const csvRows = [
        headers.join(','),
        ...queryResult.map(row => headers.map(header => {
            const value = String(row[header]);
            return value.includes(',') ? `"${value}"` : value;
        }).join(','))
    ];
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'query_result.csv');
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="csv-input" className="text-lg font-semibold text-gray-700 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-red-500" />
            {t('queryCsvWithSql.csvInputLabel')}
          </label>
          <Textarea
            id="csv-input"
            value={csvData}
            onChange={(e) => setCsvData(e.target.value)}
            placeholder={t('queryCsvWithSql.csvPlaceholder')}
            className="min-h-[200px] text-base border-gray-300 focus:ring-red-500 focus:border-red-500 font-mono"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="sql-input" className="text-lg font-semibold text-gray-700 flex items-center">
            <Database className="w-5 h-5 mr-2 text-red-500" />
            {t('queryCsvWithSql.sqlInputLabel')}
          </label>
          <Textarea
            id="sql-input"
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            placeholder={t('queryCsvWithSql.sqlPlaceholder')}
            className="min-h-[200px] text-base border-gray-300 focus:ring-red-500 focus:border-red-500 font-mono"
          />
        </div>
      </div>
      <Button onClick={handleExecuteQuery} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-6">
        <Play className="w-6 h-6 mr-2" />
        {t('queryCsvWithSql.executeQueryButton')}
      </Button>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center">
          {t('queryCsvWithSql.resultTitle')}
        </h3>
        <div className="min-h-[150px] bg-gray-50 border rounded-md p-4">
          {error ? <p className="text-red-500">{error}</p> : renderTable()}
        </div>
      </div>
      {queryResult && queryResult.length > 0 && (
        <Button onClick={downloadResultAsCsv} variant="outline" className="w-full border-gray-400 text-gray-700 hover:bg-gray-100 font-bold text-lg py-6">
            <Download className="w-6 h-6 mr-2" />
            {t('queryCsvWithSql.downloadCsvButton')}
        </Button>
      )}
    </motion.div>
  );
};

export default QueryCsvWithSqlTool;