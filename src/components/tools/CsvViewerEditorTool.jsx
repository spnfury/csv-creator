import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Table, Download, Trash2, PlusCircle, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';

const CsvViewerEditorTool = () => {
    const [grid, setGrid] = useState([['']]);
    const [fileName, setFileName] = useState('editado');
    const { toast } = useToast();

    const parseCSV = (text) => {
        const lines = text.split(/\r?\n/);
        return lines.map(line => {
            const cells = [];
            let inQuotes = false;
            let currentCell = '';
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === '"') {
                    if (inQuotes && line[i+1] === '"') {
                        currentCell += '"';
                        i++;
                    } else {
                        inQuotes = !inQuotes;
                    }
                } else if (char === ',' && !inQuotes) {
                    cells.push(currentCell);
                    currentCell = '';
                } else {
                    currentCell += char;
                }
            }
            cells.push(currentCell);
            return cells;
        });
    };

    const handlePaste = (e) => {
        const pastedText = e.clipboardData.getData('text');
        if (pastedText) {
            const parsedData = parseCSV(pastedText);
            if(parsedData.length > 0) {
                setGrid(parsedData);
                toast({
                    title: "¡CSV Cargado!",
                    description: "Tus datos se han cargado en la tabla.",
                });
            }
        }
    };
    
    const handleCellChange = (e, rowIndex, colIndex) => {
        const newGrid = [...grid];
        newGrid[rowIndex][colIndex] = e.target.value;
        setGrid(newGrid);
    };

    const addRow = () => {
        const numCols = grid[0]?.length || 1;
        setGrid([...grid, Array(numCols).fill('')]);
    };

    const addColumn = () => {
        const newGrid = grid.map(row => [...row, '']);
        setGrid(newGrid);
    };
    
    const removeRow = (rowIndex) => {
        if (grid.length > 1) {
            const newGrid = grid.filter((_, index) => index !== rowIndex);
            setGrid(newGrid);
        } else {
            setGrid([['']]);
        }
    };

    const removeColumn = (colIndex) => {
         if (grid[0]?.length > 1) {
            const newGrid = grid.map(row => row.filter((_, index) => index !== colIndex));
            setGrid(newGrid);
        } else {
            setGrid(grid.map(() => ['']));
        }
    };

    const toCSV = () => {
        return grid.map(row => 
            row.map(cell => {
                const strCell = String(cell);
                if (strCell.includes(',') || strCell.includes('"') || strCell.includes('\n')) {
                    return `"${strCell.replace(/"/g, '""')}"`;
                }
                return strCell;
            }).join(',')
        ).join('\r\n');
    };

    const handleDownload = () => {
        const csvContent = toCSV();
        if (!csvContent.trim()) {
            toast({
                title: "Error",
                description: "No hay datos para descargar.",
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
            description: "Tu archivo CSV editado se ha descargado.",
        });
    };
    
    const handleClear = () => {
        setGrid([['']]);
        setFileName('editado');
        toast({ title: "Limpiado", description: "La tabla ha sido reiniciada." });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl border-4 border-red-600 p-8 md:p-12"
        >
            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200 mb-8" onPaste={handlePaste}>
                 <h3 className="text-2xl font-bold text-red-700 mb-4 flex items-center gap-2">
                    <Upload className="w-8 h-8" />
                    Cargar Datos
                </h3>
                <p className="text-xl text-gray-700">
                    Simplemente <strong className="text-red-600">pega tu contenido CSV</strong> en cualquier lugar de esta sección para empezar a editar.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <Button onClick={addRow} className="flex-1 text-lg py-6"><PlusCircle className="mr-2 h-5 w-5" />Añadir Fila</Button>
                <Button onClick={addColumn} className="flex-1 text-lg py-6"><PlusCircle className="mr-2 h-5 w-5" />Añadir Columna</Button>
            </div>

            <div className="overflow-x-auto bg-gray-50 p-2 rounded-lg border-2 border-red-200 mb-8">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="p-2 border border-red-200 bg-red-100"></th>
                            {grid[0]?.map((_, colIndex) => (
                                <th key={colIndex} className="p-2 border border-red-200 bg-red-100 relative">
                                    <span className="font-semibold text-red-700">Col {colIndex + 1}</span>
                                    <Button variant="ghost" size="icon" className="absolute top-0 right-0 h-full w-8 text-red-500 hover:bg-red-200" onClick={() => removeColumn(colIndex)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {grid.map((row, rowIndex) => (
                            <tr key={rowIndex} className="group">
                                <td className="p-0 border border-red-200 bg-red-100 relative text-center">
                                     <Button variant="ghost" size="icon" className="h-full w-full text-red-500 hover:bg-red-200" onClick={() => removeRow(rowIndex)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </td>
                                {row.map((cell, colIndex) => (
                                    <td key={colIndex} className="p-0 border border-red-200">
                                        <input
                                            type="text"
                                            value={cell}
                                            onChange={(e) => handleCellChange(e, rowIndex, colIndex)}
                                            className="w-full p-2 bg-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

             <div className="mb-6">
                <label htmlFor="fileName" className="block text-2xl font-bold text-gray-800 mb-3">
                    Nombre del archivo:
                </label>
                <Input
                    id="fileName"
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="w-full md:w-1/2 px-6 py-5 text-2xl border-4 border-red-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="editado"
                />
                 <p className="mt-2 text-xl text-gray-600">Se guardará como: <span className="font-bold text-red-600">{fileName}.csv</span></p>
            </div>


            <div className="flex flex-col md:flex-row gap-4">
                 <Button
                    onClick={handleDownload}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-2xl md:text-3xl font-bold py-8 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                    <Download className="w-10 h-10 mr-3" strokeWidth={3} />
                    DESCARGAR CSV
                </Button>
                <Button
                    onClick={handleClear}
                    variant="outline"
                    className="flex-1 border-4 border-red-600 text-red-600 hover:bg-red-50 text-2xl md:text-3xl font-bold py-8 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                    <Trash2 className="w-8 h-8 mr-3" />
                    LIMPIAR TABLA
                </Button>
            </div>
        </motion.div>
    );
};

export default CsvViewerEditorTool;