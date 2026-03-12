import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Download, FileText, CheckCircle2, AlertCircle, ChevronRight, Share2, ClipboardList, Scissors, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { useTranslation, supportedLanguages, defaultLanguage, toolKeys } from '@/lib/i18n.jsx';
import ShareModal from '@/components/ShareModal';
import LanguageSelector from '@/components/LanguageSelector';

const toolCategories = [
  { key: 'toCsv', icon: <Share2 />, tools: ['fixed-width-to-csv', 'geojson-to-csv', 'html-links-to-csv', 'html-table-to-csv', 'json-to-csv', 'kml-to-csv', 'sql-to-csv', 'xml-to-csv', 'yaml-to-csv'] },
  { key: 'fromCsv', icon: <ClipboardList />, tools: ['csv-to-delimited', 'csv-to-fixed-width', 'csv-to-geojson', 'csv-to-html-mediawiki', 'csv-to-json', 'csv-to-kml', 'csv-to-markdown', 'csv-to-multi-line', 'csv-to-pdf', 'csv-to-sql', 'csv-to-word', 'csv-to-xml', 'csv-to-yaml'] },
  { key: 'other', icon: <Scissors />, tools: ['csv-viewer-editor', 'split-csv', 'generate-from-template', 'generate-test-data', 'email-extractor', 'phone-extractor', 'url-extractor', 'web-to-text', 'query-csv-with-sql', 'transpose-csv'] },
];

function HomePage() {
  const [csvContent, setCsvContent] = useState('');
  const [fileName, setFileName] = useState('datos');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { toast } = useToast();
  const { t, language } = useTranslation();

  const langPrefix = language === defaultLanguage ? '' : `/${language}`;
  const siteUrl = window.location.origin;

  const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData('text');
    setCsvContent(pastedText);

    if (pastedText.trim()) {
      toast({
        title: t('toasts.csvPasted'),
        description: t('toasts.csvPastedDescription'),
        duration: 3000,
      });
    }
  };

  const handleDownload = () => {
    if (!csvContent.trim()) {
      toast({
        title: t('toasts.errorNoCsv'),
        description: t('toasts.errorNoCsvDescription'),
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `${fileName}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: t('toasts.downloaded'),
        description: t('toasts.downloadedDescription'),
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: t('toasts.errorDownloading'),
        description: t('toasts.errorDownloadingDescription'),
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleClear = () => {
    setCsvContent('');
    setFileName('datos');
    toast({
      title: t('toasts.cleared'),
      description: t('toasts.clearedDescription'),
      duration: 2000,
    });
  };

  return (
    <>
      <Helmet>
        <title>{t('home.pageTitle')}</title>
        <meta name="description" content={t('home.pageDescription')} />
        <html lang={language} />
        <link rel="canonical" href={language === defaultLanguage ? siteUrl : `${siteUrl}/${language}`} />
        {supportedLanguages.map(lang => (
          <link key={lang} rel="alternate" hrefLang={lang} href={lang === defaultLanguage ? siteUrl : `${siteUrl}/${lang}`} />
        ))}
        <link rel="alternate" hrefLang="x-default" href={siteUrl} />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={t('home.pageTitle')} />
        <meta property="og:description" content={t('home.pageDescription')} />
        <meta property="og:url" content={language === defaultLanguage ? siteUrl : `${siteUrl}/${language}`} />
        <meta property="og:site_name" content="CSV Creator" />
        <meta property="og:locale" content={language === 'es' ? 'es_ES' : language === 'fr' ? 'fr_FR' : language === 'th' ? 'th_TH' : language === 'vi' ? 'vi_VN' : 'en_US'} />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={t('home.pageTitle')} />
        <meta name="twitter:description" content={t('home.pageDescription')} />
        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "CSV Creator",
          "url": siteUrl,
          "description": t('home.pageDescription'),
          "inLanguage": language,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${siteUrl}/?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        })}</script>
      </Helmet>

      <ShareModal
        isOpen={isShareModalOpen}
        setIsOpen={setIsShareModalOpen}
        toolTitle={t('home.headerTitle')}
        toolUrl={siteUrl}
      />

      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">

        <header className="bg-blue-600 shadow-lg">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <FileText className="w-16 h-16 text-white" strokeWidth={2.5} />
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight">
                  {t('home.headerTitle')}
                </h1>
              </div>
              <p className="text-2xl md:text-3xl text-white font-semibold">
                {t('home.headerSubtitle')}
              </p>
            </motion.div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 max-w-5xl">
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-3xl shadow-2xl border-4 border-blue-600 p-8 md:p-12"
          >
            <div className="mb-8 bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-700 mb-4 flex items-center gap-3">
                <CheckCircle2 className="w-10 h-10" />
                {t('home.instructionsTitle')}
              </h2>
              <ol className="space-y-3 text-xl md:text-2xl text-gray-800">
                <li className="flex items-start gap-3">
                  <span className="font-bold text-blue-600 text-2xl">1.</span>
                  <span>{t('home.instruction1')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-blue-600 text-2xl">2.</span>
                  <span>{t('home.instruction2')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-blue-600 text-2xl">3.</span>
                  <span>{t('home.instruction3')}</span>
                </li>
              </ol>
            </div>

            <div className="mb-6">
              <label htmlFor="fileName" className="block text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                {t('home.fileNameLabel')}
              </label>
              <input
                id="fileName"
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full px-6 py-5 text-2xl md:text-3xl border-4 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder={t('home.fileNamePlaceholder')}
              />
              <p className="mt-2 text-xl text-gray-600">{t('home.fileNameDescription', { fileName })}</p>
            </div>

            <div className="mb-8">
              <label htmlFor="csvInput" className="block text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                {t('home.csvInputLabel')}
              </label>
              <textarea
                id="csvInput"
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
                onPaste={handlePaste}
                className="w-full h-80 px-6 py-5 text-xl md:text-2xl border-4 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 font-mono resize-none transition-all"
                placeholder={t('home.csvInputPlaceholder')}
              />
              {csvContent && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 flex items-center gap-2 text-xl text-green-600 font-semibold"
                >
                  <CheckCircle2 className="w-6 h-6" />
                  <span>{t('home.csvReady')}</span>
                </motion.div>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <Button
                onClick={handleDownload}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-2xl md:text-3xl font-bold py-8 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
                size="lg"
              >
                <Download className="w-10 h-10 mr-3" strokeWidth={3} />
                {t('home.downloadButton')}
              </Button>

              <Button
                onClick={handleClear}
                variant="outline"
                className="flex-1 border-4 border-blue-600 text-blue-600 hover:bg-blue-50 text-2xl md:text-3xl font-bold py-8 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
                size="lg"
              >
                {t('home.clearButton')}
              </Button>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-blue-700">{t('home.toolsSectionTitle')}</h2>
              <p className="text-xl md:text-2xl text-gray-600 mt-4 max-w-3xl mx-auto">{t('home.toolsSectionSubtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {toolCategories.map(category => (
                <ToolCard
                  key={category.key}
                  title={t(`toolCategories.${category.key}`)}
                  icon={category.icon}
                  tools={category.tools}
                  langPrefix={langPrefix}
                />
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 bg-white rounded-3xl shadow-xl border-2 border-blue-200 p-8 md:p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-blue-700 mb-6">
              {t('home.whatIsCsvTitle')}
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-6">
              {t('home.whatIsCsvText')}
            </p>
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
              <h3 className="text-2xl md:text-3xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                <AlertCircle className="w-8 h-8" />
                {t('home.csvExampleTitle')}
              </h3>
              <pre className="text-lg md:text-xl font-mono bg-white p-4 rounded-lg border-2 border-blue-200 overflow-x-auto">
                {t('home.csvExampleContent')}
              </pre>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-16 text-center bg-blue-50 rounded-3xl p-8 md:p-12 border-2 border-blue-200"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-blue-700 mb-4 flex items-center justify-center gap-3">
              <Heart className="w-10 h-10 text-blue-500" />
              {t('home.shareTitle')}
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 max-w-2xl mx-auto">
              {t('home.shareSubtitle')}
            </p>
            <Button
              onClick={() => setIsShareModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-2xl font-bold py-6 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
            >
              <Share2 className="w-8 h-8 mr-3" />
              {t('home.shareButton')}
            </Button>
          </motion.section>

        </main>

        <footer className="bg-blue-600 mt-16 py-8">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              <LanguageSelector />
            </div>
            <div className="flex justify-center gap-x-6 gap-y-2 flex-wrap mb-6">
              <Link to="/privacy-policy" className="text-lg text-blue-100 hover:text-white font-semibold transition-colors">{t('home.privacyPolicy')}</Link>
              <Link to="/terms-of-service" className="text-lg text-blue-100 hover:text-white font-semibold transition-colors">{t('home.termsOfService')}</Link>
            </div>
            <p className="text-xl md:text-2xl text-white font-semibold">
              {t('home.footerText')}
            </p>
            <p className="text-lg md:text-xl text-blue-100 mt-2">
              {t('home.footerRights', { year: new Date().getFullYear() })}
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

const ToolCard = ({ title, icon, tools, langPrefix }) => {
  const { t } = useTranslation();
  const availableTools = tools.filter(toolKey => toolKeys.includes(toolKey));

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="p-6 bg-blue-50 border-b-2 border-blue-200">
        <h3 className="text-2xl font-bold text-blue-700 flex items-center gap-3">
          {React.cloneElement(icon, { className: "w-8 h-8" })}
          {title}
        </h3>
      </div>
      <div className="p-4 flex-grow">
        <ul className="space-y-1">
          {availableTools.map((toolKey) => (
            <li key={toolKey}>
              <Link
                to={`${langPrefix}/${t(`tools.${toolKey}.slug`)}`}
                className="flex items-center justify-between p-3 text-lg text-gray-800 rounded-lg hover:bg-blue-100 hover:text-blue-700 font-semibold transition-colors duration-200 group"
              >
                <span>{t(`tools.${toolKey}.title`)}</span>
                <ChevronRight className="w-6 h-6 text-blue-400 group-hover:text-blue-600 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HomePage;