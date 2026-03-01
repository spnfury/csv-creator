import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Home, ChevronsRight, Wrench, Share2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import ShareModal from "@/components/ShareModal";
import { useTranslation, supportedLanguages, defaultLanguage, getToolKeyFromSlug, toolKeys } from '@/lib/i18n.jsx';
import LanguageSelector from '@/components/LanguageSelector';
import JsonToCsvTool from '@/components/tools/JsonToCsvTool';
import CsvToDelimitedTool from '@/components/tools/CsvToDelimitedTool';
import CsvToFixedWidthTool from '@/components/tools/CsvToFixedWidthTool';
import FixedWidthToCsvTool from '@/components/tools/FixedWidthToCsvTool';
import YamlToCsvTool from '@/components/tools/YamlToCsvTool';
import KmlToCsvTool from '@/components/tools/KmlToCsvTool';
import CsvViewerEditorTool from '@/components/tools/CsvViewerEditorTool';
import SplitCsvTool from '@/components/tools/SplitCsvTool';
import GeoJsonToCsvTool from '@/components/tools/GeoJsonToCsvTool';
import HtmlLinksToCsvTool from '@/components/tools/HtmlLinksToCsvTool';
import CsvToMarkdownTool from '@/components/tools/CsvToMarkdownTool';
import HtmlTableToCsvTool from '@/components/tools/HtmlTableToCsvTool';
import CsvToGeoJsonTool from '@/components/tools/CsvToGeoJsonTool';
import EmailExtractorTool from '@/components/tools/EmailExtractorTool';
import PhoneExtractorTool from '@/components/tools/PhoneExtractorTool';
import GenerateTestDataTool from '@/components/tools/GenerateTestDataTool';
import CsvToHtmlMediaWikiTool from '@/components/tools/CsvToHtmlMediaWikiTool';
import GenerateFromTemplateTool from '@/components/tools/GenerateFromTemplateTool.jsx';
import WebToTextTool from '@/components/tools/WebToTextTool.jsx';
import CsvToWordTool from '@/components/tools/CsvToWordTool.jsx';
import CsvToKmlTool from '@/components/tools/CsvToKmlTool.jsx';
import CsvToPdfTool from '@/components/tools/CsvToPdfTool.jsx';
import XmlToCsvTool from '@/components/tools/XmlToCsvTool.jsx';
import SqlToCsvTool from '@/components/tools/SqlToCsvTool.jsx';
import CsvToJsonTool from '@/components/tools/CsvToJsonTool.jsx';
import CsvToMultiLineTool from '@/components/tools/CsvToMultiLineTool.jsx';
import CsvToSqlTool from '@/components/tools/CsvToSqlTool.jsx';
import CsvToXmlTool from '@/components/tools/CsvToXmlTool.jsx';
import CsvToYamlTool from '@/components/tools/CsvToYamlTool.jsx';
import UrlExtractorTool from '@/components/tools/UrlExtractorTool.jsx';
import QueryCsvWithSqlTool from '@/components/tools/QueryCsvWithSqlTool.jsx';
import TransposeCsvTool from '@/components/tools/TransposeCsvTool.jsx';
import HomePage from './HomePage';

const componentMap = {
    'json-to-csv': JsonToCsvTool,
    'csv-to-delimited': CsvToDelimitedTool,
    'csv-to-fixed-width': CsvToFixedWidthTool,
    'fixed-width-to-csv': FixedWidthToCsvTool,
    'yaml-to-csv': YamlToCsvTool,
    'kml-to-csv': KmlToCsvTool,
    'csv-viewer-editor': CsvViewerEditorTool,
    'split-csv': SplitCsvTool,
    'geojson-to-csv': GeoJsonToCsvTool,
    'html-links-to-csv': HtmlLinksToCsvTool,
    'csv-to-markdown': CsvToMarkdownTool,
    'html-table-to-csv': HtmlTableToCsvTool,
    'csv-to-geojson': CsvToGeoJsonTool,
    'email-extractor': EmailExtractorTool,
    'phone-extractor': PhoneExtractorTool,
    'generate-test-data': GenerateTestDataTool,
    'csv-to-html-mediawiki': CsvToHtmlMediaWikiTool,
    'generate-from-template': GenerateFromTemplateTool,
    'web-to-text': WebToTextTool,
    'csv-to-word': CsvToWordTool,
    'csv-to-kml': CsvToKmlTool,
    'csv-to-pdf': CsvToPdfTool,
    'xml-to-csv': XmlToCsvTool,
    'sql-to-csv': SqlToCsvTool,
    'csv-to-json': CsvToJsonTool,
    'csv-to-multi-line': CsvToMultiLineTool,
    'csv-to-sql': CsvToSqlTool,
    'csv-to-xml': CsvToXmlTool,
    'csv-to-yaml': CsvToYamlTool,
    'url-extractor': UrlExtractorTool,
    'query-csv-with-sql': QueryCsvWithSqlTool,
    'transpose-csv': TransposeCsvTool,
};

function ToolPage() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { toast } = useToast();
  
  const [toolKey, setToolKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);

    // This prevents admin routes from being processed by this page
    if (pathParts[0] === 'admin') {
      setIsLoading(false);
      return;
    }
    
    const langInPath = supportedLanguages.includes(pathParts[0]) ? pathParts[0] : null;
    const detectedLang = langInPath || defaultLanguage;
    const slug = langInPath ? pathParts[1] : pathParts[0];
    
    if (pathParts.length === 1 && supportedLanguages.includes(pathParts[0])) {
        setIsLoading(false);
        setToolKey(null);
        return;
    }

    if (!slug) {
        navigate(detectedLang === defaultLanguage ? '/' : `/${detectedLang}`, { replace: true });
        return;
    }

    const currentToolKey = getToolKeyFromSlug(slug, detectedLang);
    
    if (!currentToolKey) {
        navigate(detectedLang === defaultLanguage ? '/' : `/${detectedLang}`, { replace: true });
        return;
    }

    setToolKey(currentToolKey);
    setIsLoading(false);

    window.scrollTo(0, 0);
  }, [location.pathname, navigate]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-2xl text-gray-600">{t('toolpage.loading')}</p>
      </div>
    );
  }

  const isHomePagePath = !toolKey;
  if (isHomePagePath) {
    return <HomePage />;
  }

  const langPrefix = language === defaultLanguage ? '' : `/${language}`;
  
  const handleBookmark = () => {
    toast({
      title: t('toolpage.addFavoritesToastTitle'),
      description: t('toolpage.addFavoritesToastDescription'),
      duration: 5000,
    });
  };

  const UnderConstruction = () => (
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-blue-600 p-8 md:p-12 text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">{t('toolpage.underConstructionTitle')}</h3>
          <p className="text-2xl text-gray-600 mb-8">
              {t('toolpage.underConstructionText')}
          </p>
          <img className="w-1/2 mx-auto" alt="Un simpático robot constructor con un casco de obra y herramientas" src="https://images.unsplash.com/photo-1697564265236-1679374e6e32" />
          <Link to={langPrefix || '/'}>
              <Button
                  className="mt-8 bg-blue-600 hover:bg-blue-700 text-white text-2xl font-bold py-6 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  size="lg"
              >
                  <Home className="w-8 h-8 mr-3" />
                  {t('toolpage.backToHome')}
              </Button>
          </Link>
      </div>
  );

  const ToolComponent = toolKey ? (componentMap[toolKey] || UnderConstruction) : UnderConstruction;
  const toolTitle = toolKey ? t(`tools.${toolKey}.title`) : t('toolpage.toolNotFound');
  const toolDescription = toolKey ? t(`tools.${toolKey}.description`) : t('toolpage.toolNotFoundDescription');
  
  return (
    <>
      <Helmet>
        <title>{`${toolTitle} - CSV Creator`}</title>
        <meta name="description" content={toolDescription} />
        <html lang={language} />
      </Helmet>
      <ShareModal 
        isOpen={isShareModalOpen} 
        setIsOpen={setIsShareModalOpen} 
        toolTitle={toolTitle}
        toolUrl={window.location.href}
      />
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
        <header className="bg-blue-600 shadow-lg">
          <div className="container mx-auto px-4 py-6">
             <nav className="flex items-center text-white text-xl" aria-label="Breadcrumb">
              <Link to={langPrefix || '/'} className="flex items-center gap-2 hover:text-blue-200 transition-colors">
                <Home className="w-6 h-6" />
                <span>{t('toolpage.breadcrumbHome')}</span>
              </Link>
              <ChevronsRight className="w-8 h-8 mx-2 text-blue-300" />
              <span className="font-semibold text-blue-100">{toolTitle}</span>
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-blue-700 tracking-tight mb-4">{toolTitle}</h1>
            <h2 className="text-2xl md:text-3xl text-gray-700 font-semibold mb-12">{toolDescription}</h2>

            <ToolComponent />

          </motion.div>
        </main>

        <footer className="bg-blue-700 mt-16 py-12 text-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-10">
                     <Button onClick={() => setIsShareModalOpen(true)} className="bg-white text-blue-600 font-bold text-lg py-5 px-8 rounded-lg hover:bg-blue-100 transition-all shadow-md">
                        <Share2 className="w-6 h-6 mr-3" />
                        {t('toolpage.shareWithFriends')}
                    </Button>
                     <Button onClick={handleBookmark} className="bg-white text-blue-600 font-bold text-lg py-5 px-8 rounded-lg hover:bg-blue-100 transition-all shadow-md">
                        <Star className="w-6 h-6 mr-3" />
                        {t('toolpage.addToFavorites')}
                    </Button>
                </div>
                <h3 className="text-3xl font-bold text-center mb-8 border-t border-blue-500 pt-10">{t('toolpage.otherToolsTitle')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                    {toolKeys.map((toolKeyItem) => (
                        <Link 
                            key={toolKeyItem} 
                            to={`${langPrefix}/${t(`tools.${toolKeyItem}.slug`)}`} 
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            <Wrench className="w-5 h-5 text-blue-200 flex-shrink-0" />
                            <span className="text-blue-50 font-medium">{t(`tools.${toolKeyItem}.title`)}</span>
                        </Link>
                    ))}
                </div>
                <div className="border-t border-blue-500 mt-12 pt-8 text-center">
                    <div className="flex justify-center mb-6">
                        <LanguageSelector />
                    </div>
                    <p className="text-lg text-blue-100 font-semibold">
                      {t('home.footerText')}
                    </p>
                    <p className="text-base text-blue-200 mt-2">
                      {t('home.footerRights', { year: new Date().getFullYear() })}
                    </p>
                </div>
            </div>
        </footer>
      </div>
    </>
  );
}

export default ToolPage;