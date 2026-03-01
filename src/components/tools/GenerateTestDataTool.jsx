import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { FileText, FileJson, Trash2, Plus, ArrowRight, Settings2, Download } from 'lucide-react';

const fieldTypes = [
  { id: 'fullName', name: 'Nombre completo' },
  { id: 'firstName', name: 'Nombre' },
  { id: 'lastName', name: 'Apellido' },
  { id: 'email', name: 'Email' },
  { id: 'number', name: 'Número Aleatorio' },
  { id: 'uuid', name: 'UUID' },
  { id: 'city', name: 'Ciudad' },
  { id: 'country', name: 'País' },
  { id: 'date', name: 'Fecha Aleatoria' },
];

const firstNames = ['Juan', 'María', 'Pedro', 'Ana', 'Luis', 'Laura', 'Carlos', 'Sofía'];
const lastNames = ['García', 'Pérez', 'López', 'Martínez', 'González', 'Rodríguez', 'Sánchez'];
const cities = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza', 'Málaga'];
const countries = ['España', 'México', 'Argentina', 'Colombia', 'Perú'];

const generateFakeData = (type) => {
  switch (type) {
    case 'firstName':
      return firstNames[Math.floor(Math.random() * firstNames.length)];
    case 'lastName':
      return lastNames[Math.floor(Math.random() * lastNames.length)];
    case 'fullName':
      return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    case 'email':
      return `${firstNames[Math.floor(Math.random() * firstNames.length)].toLowerCase()}.${lastNames[Math.floor(Math.random() * lastNames.length)].toLowerCase()}@ejemplo.com`;
    case 'number':
      return Math.floor(Math.random() * 10000);
    case 'uuid':
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    case 'city':
        return cities[Math.floor(Math.random() * cities.length)];
    case 'country':
        return countries[Math.floor(Math.random() * countries.length)];
    case 'date':
        const start = new Date(2000, 0, 1);
        const end = new Date();
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
    default:
      return '';
  }
};

const GenerateTestDataTool = () => {
  const [fields, setFields] = useState([
    { name: 'id', type: 'uuid' },
    { name: 'nombre_completo', type: 'fullName' },
    { name: 'email', type: 'email' },
  ]);
  const [rowCount, setRowCount] = useState(10);
  const [generatedData, setGeneratedData] = useState([]);
  const { toast } = useToast();

  const handleAddField = () => {
    setFields([...fields, { name: `campo_${fields.length + 1}`, type: 'firstName' }]);
  };

  const handleRemoveField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index, prop, value) => {
    const newFields = [...fields];
    newFields[index][prop] = value;
    setFields(newFields);
  };
  
  const handleGenerateData = () => {
    if (rowCount <= 0 || fields.length === 0) {
        toast({
            title: "Error de configuración",
            description: "Asegúrate de tener al menos un campo y más de 0 filas.",
            variant: "destructive",
        });
        return;
    }

    const data = Array.from({ length: rowCount }, () => {
        const row = {};
        fields.forEach(field => {
            row[field.name] = generateFakeData(field.type);
        });
        return row;
    });

    setGeneratedData(data);
    toast({
        title: "¡Datos Generados!",
        description: `${rowCount} filas de datos de prueba creadas exitosamente.`,
    });
  };

  const downloadFile = (content, fileName, contentType) => {
    const blob = new Blob([content], { type: contentType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCSV = () => {
    if (generatedData.length === 0) return;
    const headers = fields.map(f => f.name).join(',');
    const rows = generatedData.map(row => 
        fields.map(field => `"${String(row[field.name]).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    downloadFile(`${headers}\n${rows}`, 'datos_de_prueba.csv', 'text/csv;charset=utf-8;');
  };
  
  const handleExportJSON = () => {
    if (generatedData.length === 0) return;
    downloadFile(JSON.stringify(generatedData, null, 2), 'datos_de_prueba.json', 'application/json;charset=utf-8;');
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border-4 border-red-600 p-8 md:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Columna de configuración */}
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3"><Settings2 className="w-8 h-8 text-red-600" />Configuración de Datos</h3>
            
            <div className="space-y-4 mb-8">
              {fields.map((field, index) => (
                <motion.div key={index} layout className="flex items-center gap-2 bg-red-50 p-3 rounded-lg border border-red-200">
                  <Input 
                    placeholder="Nombre de columna" 
                    value={field.name} 
                    onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                    className="flex-grow border-red-300 focus:border-red-500 focus:ring-red-500"
                  />
                  <ArrowRight className="text-red-400"/>
                  <select 
                    value={field.type} 
                    onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
                    className="flex-grow p-2 border border-red-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {fieldTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                  <Button variant="destructive" size="icon" onClick={() => handleRemoveField(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>

            <Button onClick={handleAddField} variant="outline" className="w-full mb-8 border-red-500 text-red-600 font-semibold hover:bg-red-50">
              <Plus className="w-5 h-5 mr-2"/>Añadir Campo
            </Button>

            <div className="mb-8">
              <label htmlFor="rowCount" className="text-xl font-bold text-gray-700 mb-2 block">Número de Filas</label>
              <Input 
                id="rowCount"
                type="number"
                value={rowCount}
                onChange={(e) => setRowCount(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                className="w-full text-lg border-red-300 focus:border-red-500 focus:ring-red-500"
              />
            </div>
            
            <Button onClick={handleGenerateData} className="w-full bg-red-600 hover:bg-red-700 text-white text-xl font-bold py-6 rounded-lg">
                Generar Datos
            </Button>
          </div>

          {/* Columna de resultados y exportación */}
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3"><Download className="w-8 h-8 text-red-600" />Resultado y Exportación</h3>
            {generatedData.length > 0 ? (
              <motion.div initial={{opacity: 0}} animate={{opacity: 1}}>
                <div className="bg-gray-100 p-4 rounded-lg h-80 overflow-auto border border-gray-300 mb-6 font-mono text-sm">
                  <pre>{JSON.stringify(generatedData, null, 2)}</pre>
                </div>
                <div className="flex gap-4">
                  <Button onClick={handleExportCSV} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-4">
                    <FileText className="w-5 h-5 mr-2"/> CSV
                  </Button>
                  <Button onClick={handleExportJSON} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4">
                    <FileJson className="w-5 h-5 mr-2"/> JSON
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center bg-red-50 rounded-lg h-96 border-2 border-dashed border-red-200 text-red-500 text-center p-4">
                <p className="text-xl font-semibold">Los datos generados aparecerán aquí.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GenerateTestDataTool;