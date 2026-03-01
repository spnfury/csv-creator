import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Download, FileText, Upload, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const GeoJsonToCsvTool = () => {
    const [geoJsonContent, setGeoJsonContent] = useState('');
    const [csvContent, setCsvContent] = useState('');
    const [fileName, setFileName] = useState('export_geojson');
    const { toast } = useToast();

    const handlePaste = (e) => {
        const pastedText = e.clipboardData.getData('text');
        setGeoJsonContent(pastedText);
        if (pastedText) {
            toast({
                title: "¡GeoJSON Pegado!",
                description: "Ahora puedes convertir tus datos.",
            });
        }
    };

    const convertToCsv = () => {
        if (!geoJsonContent.trim()) {
            toast({
                title: "Error",
                description: "Por favor, pega tu contenido GeoJSON primero.",
                variant: "destructive",
            });
            return;
        }

        try {
            const data = JSON.parse(geoJsonContent);

            if (data.type !== 'FeatureCollection' || !Array.isArray(data.features)) {
                toast({
                    title: "Error de Formato",
                    description: "El archivo debe ser un GeoJSON de tipo 'FeatureCollection'.",
                    variant: "destructive",
                });
                return;
            }

            if (data.features.length === 0) {
                toast({
                    title: "Sin Datos",
                    description: "El GeoJSON no contiene 'features' para convertir.",
                    variant: "destructive",
                });
                return;
            }

            const allProperties = data.features.map(f => f.properties || {});
            const headers = new Set();
            allProperties.forEach(props => {
                Object.keys(props).forEach(key => headers.add(key));
            });
            
            const headerArray = Array.from(headers);
            
            const geometryHeaders = [];
            const firstFeatureWithGeom = data.features.find(f => f.geometry && f.geometry.coordinates);
            if (firstFeatureWithGeom) {
                if (firstFeatureWithGeom.geometry.type === 'Point') {
                    geometryHeaders.push('longitude', 'latitude');
                }
            }
            
            const finalHeaders = [...headerArray, ...geometryHeaders];

            const csvRows = [finalHeaders.join(',')];

            data.features.forEach(feature => {
                const row = headerArray.map(header => {
                    const value = feature.properties ? feature.properties[header] : '';
                    const strValue = String(value === null || value === undefined ? '' : value);
                    if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
                        return `"${strValue.replace(/"/g, '""')}"`;
                    }
                    return strValue;
                });

                if (feature.geometry && feature.geometry.type === 'Point' && feature.geometry.coordinates) {
                    row.push(feature.geometry.coordinates[0]);
                    row.push(feature.geometry.coordinates[1]);
                } else if (geometryHeaders.length > 0) {
                    row.push('', '');
                }

                csvRows.push(row.join(','));
            });

            setCsvContent(csvRows.join('\r\n'));
            toast({
                title: "¡Conversión Exitosa!",
                description: "Tu GeoJSON se ha convertido a CSV.",
            });

        } catch (error) {
            toast({
                title: "Error de JSON",
                description: "El texto introducido no es un JSON válido.",
                variant: "destructive",
            });
        }
    };

    const handleDownload = () => {
        if (!csvContent) {
            toast({
                title: "Error",
                description: "No hay contenido CSV para descargar. Convierte primero.",
                variant: "destructive",
            });
            return;
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `${fileName}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
            title: "¡Descargado!",
            description: "Tu archivo CSV se ha descargado.",
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl border-4 border-red-600 p-8 md:p-12"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label htmlFor="geojsonInput" className="block text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Upload className="w-8 h-8"/>
                        Pega tu GeoJSON aquí:
                    </label>
                    <textarea
                        id="geojsonInput"
                        value={geoJsonContent}
                        onChange={(e) => setGeoJsonContent(e.target.value)}
                        onPaste={handlePaste}
                        className="w-full h-96 px-6 py-5 text-lg border-4 border-red-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500 focus:border-red-500 font-mono resize-y transition-all"
                        placeholder='{ "type": "FeatureCollection", "features": [ ... ] }'
                    />
                </div>
                <div>
                    <label htmlFor="csvOutput" className="block text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <FileText className="w-8 h-8"/>
                        Resultado CSV:
                    </label>
                    <textarea
                        id="csvOutput"
                        value={csvContent}
                        readOnly
                        className="w-full h-96 px-6 py-5 text-lg border-4 border-gray-300 bg-gray-50 rounded-xl font-mono resize-y"
                        placeholder="Aquí aparecerá el resultado en formato CSV..."
                    />
                </div>
            </div>

            <Button
                onClick={convertToCsv}
                className="w-full mt-8 bg-red-600 hover:bg-red-700 text-white text-2xl md:text-3xl font-bold py-8 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
                <Map className="w-10 h-10 mr-3" strokeWidth={3} />
                CONVERTIR A CSV
            </Button>

            {csvContent && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8"
                >
                    <Button
                        onClick={handleDownload}
                        className="w-full bg-green-600 hover:bg-green-700 text-white text-2xl md:text-3xl font-bold py-8 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                        <Download className="w-10 h-10 mr-3" strokeWidth={3} />
                        DESCARGAR CSV
                    </Button>
                </motion.div>
            )}
        </motion.div>
    );
};

export default GeoJsonToCsvTool;