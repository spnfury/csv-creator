import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { Download, FileText, AlertCircle, Trash2 } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';

    function KmlToCsvTool() {
        const [kmlContent, setKmlContent] = useState('');
        const [fileName, setFileName] = useState('convertido');
        const { toast } = useToast();

        const convertToCsv = (placemarks) => {
            if (!placemarks || placemarks.length === 0) {
                return '';
            }

            const allKeys = new Set(['name', 'description', 'coordinates']);
            placemarks.forEach(pm => {
                Object.keys(pm).forEach(key => allKeys.add(key));
            });

            const headers = Array.from(allKeys);
            
            const escapeCell = (cell) => {
                const str = String(cell === null || cell === undefined ? '' : cell);
                if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                    return `"${str.replace(/"/g, '""')}"`;
                }
                return str;
            };

            const headerRow = headers.map(escapeCell).join(',');
            const rows = placemarks.map(pm => {
                return headers.map(header => escapeCell(pm[header])).join(',');
            });

            return [headerRow, ...rows].join('\r\n');
        };

        const handleDownload = () => {
            if (!kmlContent.trim()) {
                toast({
                    title: "Error: KML vacío",
                    description: "Por favor, pega tu contenido KML.",
                    variant: "destructive",
                    duration: 3000,
                });
                return;
            }

            try {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(kmlContent, "text/xml");
                
                if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
                    throw new Error("Error al analizar el KML. Revisa la sintaxis.");
                }

                const placemarkNodes = xmlDoc.getElementsByTagName('Placemark');
                const placemarks = Array.from(placemarkNodes).map(node => {
                    const placemarkData = {};
                    
                    const nameNode = node.querySelector('name');
                    if (nameNode) placemarkData.name = nameNode.textContent.trim();
                    
                    const descriptionNode = node.querySelector('description');
                    if (descriptionNode) placemarkData.description = descriptionNode.textContent.trim();

                    const coordinatesNode = node.querySelector('coordinates');
                    if (coordinatesNode) placemarkData.coordinates = coordinatesNode.textContent.trim().replace(/\s+/g, ' ');

                    const extendedData = node.querySelector('ExtendedData');
                    if (extendedData) {
                        const dataNodes = extendedData.querySelectorAll('Data');
                        dataNodes.forEach(dataNode => {
                            const key = dataNode.getAttribute('name');
                            const valueNode = dataNode.querySelector('value');
                            if (key && valueNode) {
                                placemarkData[key] = valueNode.textContent.trim();
                            }
                        });
                        const simpleDataNodes = extendedData.querySelectorAll('SimpleData');
                        simpleDataNodes.forEach(simpleDataNode => {
                            const key = simpleDataNode.getAttribute('name');
                            if (key) {
                                placemarkData[key] = simpleDataNode.textContent.trim();
                            }
                        });
                    }
                    
                    return placemarkData;
                });

                if (placemarks.length === 0) {
                    toast({
                        title: "Sin datos",
                        description: "No se encontraron elementos <Placemark> en el KML.",
                        variant: "destructive",
                        duration: 3000,
                    });
                    return;
                }

                const csvData = convertToCsv(placemarks);
                
                const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                const url = URL.createObjectURL(blob);

                link.setAttribute('href', url);
                link.setAttribute('download', `${fileName}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                toast({
                    title: "¡Conversión Exitosa!",
                    description: `Se han convertido ${placemarks.length} placemarks a CSV.`,
                    duration: 3000,
                });

            } catch (error) {
                toast({
                    title: "Error de Conversión",
                    description: error.message || "Hubo un problema al procesar el KML.",
                    variant: "destructive",
                    duration: 4000,
                });
            }
        };

        const handleClear = () => {
            setKmlContent('');
            setFileName('convertido');
            toast({
                title: "Limpiado",
                description: "El contenido ha sido borrado.",
                duration: 2000,
            });
        };
        
        const exampleKML = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Ejemplo</name>
    <Placemark>
      <name>Lugar 1</name>
      <description>Descripción del lugar 1</description>
      <ExtendedData>
        <Data name="Tipo">
          <value>Monumento</value>
        </Data>
      </ExtendedData>
      <Point>
        <coordinates>-3.703790,40.416775,0</coordinates>
      </Point>
    </Placemark>
  </Document>
</kml>`;

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl shadow-2xl border-4 border-red-600 p-8 md:p-12"
            >
                <div className="mb-8">
                    <label htmlFor="fileName" className="block text-2xl font-bold text-gray-800 mb-3">
                        Nombre del archivo CSV:
                    </label>
                    <input
                        id="fileName"
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        className="w-full md:w-1/2 px-6 py-5 text-2xl border-4 border-red-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500 focus:border-red-500 transition-all"
                        placeholder="nombre-archivo"
                    />
                    <p className="mt-2 text-xl text-gray-600">Se guardará como: <span className="font-bold text-red-600">{fileName}.csv</span></p>
                </div>

                <div className="mb-8">
                    <label htmlFor="kmlInput" className="block text-2xl md:text-3xl font-bold text-gray-800 mb-3 flex items-center gap-3">
                        <FileText className="w-8 h-8" />
                        Pega tu contenido KML aquí:
                    </label>
                    <textarea
                        id="kmlInput"
                        value={kmlContent}
                        onChange={(e) => setKmlContent(e.target.value)}
                        className="w-full h-80 px-6 py-5 text-xl md:text-2xl border-4 border-red-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500 focus:border-red-500 font-mono resize-none transition-all"
                        placeholder="Pega tu código KML aquí..."
                    />
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <Button
                        onClick={handleDownload}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white text-2xl md:text-3xl font-bold py-8 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                        <Download className="w-10 h-10 mr-3" strokeWidth={3} />
                        CONVERTIR Y DESCARGAR CSV
                    </Button>
                    <Button
                        onClick={handleClear}
                        variant="outline"
                        className="flex-1 border-4 border-red-600 text-red-600 hover:bg-red-50 text-2xl md:text-3xl font-bold py-8 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                        <Trash2 className="w-8 h-8 mr-3" />
                        LIMPIAR
                    </Button>
                </div>
                
                <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                    <h3 className="text-2xl font-bold text-red-700 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-8 h-8" />
                        Ejemplo de KML:
                    </h3>
                    <pre className="text-lg font-mono bg-white p-4 rounded-lg border-2 border-red-200 overflow-x-auto">
                        {exampleKML}
                    </pre>
                     <p className="mt-4 text-lg text-gray-700">La herramienta extrae datos de los elementos <code className="bg-red-200 text-red-800 font-bold px-2 py-1 rounded">&lt;Placemark&gt;</code>.</p>
                </div>
            </motion.div>
        );
    }

    export default KmlToCsvTool;