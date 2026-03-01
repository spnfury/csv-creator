import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { Map, Upload, FileJson, Copy, ArrowRight } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { useToast } from '@/components/ui/use-toast';

    const CsvToGeoJsonTool = () => {
        const [csvContent, setCsvContent] = useState('');
        const [geoJsonContent, setGeoJsonContent] = useState('');
        const [longitudeField, setLongitudeField] = useState('longitude');
        const [latitudeField, setLatitudeField] = useState('latitude');
        const [headers, setHeaders] = useState([]);
        const { toast } = useToast();
    
        const parseCsvLine = (line) => {
            const result = [];
            let current = '';
            let inQuotes = false;
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === '"') {
                    if (inQuotes && line[i+1] === '"') {
                        current += '"';
                        i++;
                    } else {
                        inQuotes = !inQuotes;
                    }
                } else if (char === ',' && !inQuotes) {
                    result.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
            result.push(current.trim());
            return result;
        };
    
        const handleCsvChange = (text) => {
            setCsvContent(text);
            if(text.trim()){
                const firstLine = text.trim().split(/\r?\n/)[0];
                const parsedHeaders = parseCsvLine(firstLine);
                setHeaders(parsedHeaders);
                
                // Auto-detect common field names
                const lowerHeaders = parsedHeaders.map(h => h.toLowerCase());
                const lonIndex = lowerHeaders.findIndex(h => h.includes('lon') || h.includes('lng') || h.includes('x'));
                const latIndex = lowerHeaders.findIndex(h => h.includes('lat') || h.includes('y'));

                if(lonIndex !== -1) setLongitudeField(parsedHeaders[lonIndex]);
                if(latIndex !== -1) setLatitudeField(parsedHeaders[latIndex]);
            } else {
                setHeaders([]);
            }
        };

        const convertToGeoJson = () => {
            if (!csvContent.trim()) {
                toast({ title: "Error", description: "Por favor, pega tu contenido CSV primero.", variant: "destructive" });
                return;
            }

            const lines = csvContent.trim().split(/\r?\n/);
            if (lines.length < 2) {
                toast({ title: "Error", description: "El CSV debe tener al menos una cabecera y una fila de datos.", variant: "destructive" });
                return;
            }

            const headerArray = parseCsvLine(lines[0]);
            const lonIndex = headerArray.findIndex(h => h === longitudeField);
            const latIndex = headerArray.findIndex(h => h === latitudeField);

            if (lonIndex === -1 || latIndex === -1) {
                toast({ title: "Error de Columnas", description: "Asegúrate de que los nombres de las columnas de longitud y latitud son correctos y existen en el CSV.", variant: "destructive" });
                return;
            }

            const features = [];
            for (let i = 1; i < lines.length; i++) {
                const row = parseCsvLine(lines[i]);
                if (row.length !== headerArray.length) continue;

                const properties = {};
                headerArray.forEach((header, index) => {
                    properties[header] = row[index];
                });

                const longitude = parseFloat(row[lonIndex]);
                const latitude = parseFloat(row[latIndex]);

                if (!isNaN(longitude) && !isNaN(latitude)) {
                    features.push({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [longitude, latitude]
                        },
                        properties: properties
                    });
                }
            }

            if (features.length === 0) {
                toast({ title: "Sin Datos Válidos", description: "No se encontraron filas con datos de coordenadas válidos.", variant: "destructive" });
                return;
            }
            
            const geoJson = {
                type: 'FeatureCollection',
                features: features
            };

            setGeoJsonContent(JSON.stringify(geoJson, null, 2));
            toast({ title: "¡Conversión Exitosa!", description: "Tu CSV se ha convertido a GeoJSON." });
        };
        
        const copyToClipboard = () => {
            if (!geoJsonContent) {
                toast({ title: "Error", description: "No hay nada que copiar.", variant: "destructive" });
                return;
            }
            navigator.clipboard.writeText(geoJsonContent);
            toast({ title: "¡Copiado!", description: "El GeoJSON se ha copiado al portapapeles." });
        };

        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-2xl border-4 border-blue-600 p-8 md:p-12">
                <div className="mb-8">
                    <label htmlFor="csvInput" className="block text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Upload className="w-8 h-8"/>
                        Pega tu CSV aquí:
                    </label>
                    <textarea
                        id="csvInput"
                        value={csvContent}
                        onChange={(e) => handleCsvChange(e.target.value)}
                        className="w-full h-64 px-6 py-5 text-lg border-4 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 font-mono resize-y transition-all"
                        placeholder="latitude,longitude,nombre,descripcion&#10;40.7128,-74.0060,Nueva York,La Gran Manzana"
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end mb-8">
                    <div>
                        <label htmlFor="lonField" className="block text-xl font-bold text-gray-800 mb-2">Columna de Longitud</label>
                         <Input
                            id="lonField"
                            type="text"
                            list="headers-list"
                            value={longitudeField}
                            onChange={(e) => setLongitudeField(e.target.value)}
                            placeholder="Ej: lon, longitude, x"
                            className="w-full text-lg p-6"
                        />
                    </div>
                     <div>
                        <label htmlFor="latField" className="block text-xl font-bold text-gray-800 mb-2">Columna de Latitud</label>
                        <Input
                            id="latField"
                            type="text"
                            list="headers-list"
                            value={latitudeField}
                            onChange={(e) => setLatitudeField(e.target.value)}
                            placeholder="Ej: lat, latitude, y"
                            className="w-full text-lg p-6"
                        />
                        <datalist id="headers-list">
                            {headers.map(h => <option key={h} value={h} />)}
                        </datalist>
                    </div>
                </div>

                <Button onClick={convertToGeoJson} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-2xl md:text-3xl font-bold py-8 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                    <ArrowRight className="w-10 h-10 mr-3" strokeWidth={3} />
                    CONVERTIR A GEOJSON
                </Button>

                {geoJsonContent && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
                        <div className="flex justify-between items-center mb-3">
                             <label htmlFor="geoJsonOutput" className="block text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <FileJson className="w-8 h-8"/>
                                Resultado GeoJSON:
                            </label>
                            <Button variant="outline" size="sm" onClick={copyToClipboard} className="flex items-center gap-2 text-blue-600 border-blue-500 hover:bg-blue-50">
                                <Copy className="w-4 h-4" />
                                Copiar
                            </Button>
                        </div>
                        <textarea
                            id="geoJsonOutput"
                            value={geoJsonContent}
                            readOnly
                            className="w-full h-96 px-6 py-5 text-lg border-4 border-gray-300 bg-gray-50 rounded-xl font-mono resize-y"
                            placeholder="Aquí aparecerá el resultado en formato GeoJSON..."
                        />
                    </motion.div>
                )}
            </motion.div>
        );
    };

    export default CsvToGeoJsonTool;