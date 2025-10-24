// src/pages/Dashboard/Adem/ImageController.jsx

import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  LoaderCircle, 
  ArrowRight, 
  Download, 
  RefreshCw, 
  Scissors 
} from 'lucide-react';

// Defines the possible actions the user can take
const OPERATIONS = {
  CONVERT: 'CONVERT',
  REMOVE_BG: 'REMOVE_BG',
};

const ImageController = () => {
  // State for the selected file and its preview URL
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPreview, setSelectedPreview] = useState(null);

  // State for the processed image and its temporary URL
  const [outputImage, setOutputImage] = useState(null);

  // UI/UX states
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  
  // State for the chosen operation and output format
  const [operation, setOperation] = useState(OPERATIONS.CONVERT);
  const [outputFormat, setOutputFormat] = useState('avif');
  
  const fileInputRef = useRef(null);

  // Resets the component to its initial state
  const resetState = useCallback(() => {
    if (outputImage) URL.revokeObjectURL(outputImage);
    setSelectedFile(null);
    setSelectedPreview(null);
    setOutputImage(null);
    setError(null);
    setIsProcessing(false);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }, [outputImage]);

  // Processes a new file upload, creating a preview
  const processFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) {
        setError('Invalid file type. Please upload an image.');
        return;
    }
    resetState();
    setSelectedFile(file);
    setSelectedPreview(URL.createObjectURL(file));
  }, [resetState]);

  // Handles file selection from the file input
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  // --- API CALL 1: Node.js Backend for Format Conversion ---
  const convertFile = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return axios.post(`http://localhost:5000/api/convert/${outputFormat}`, formData, {
      responseType: 'blob', // Important: receives the image as a binary blob
    });
  };

  // --- API CALL 2: Python Backend for Background Removal ---
  const removeBackground = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return axios.post(`http://localhost:5001/api/remove-bg`, formData, {
      responseType: 'blob', // Important: receives the image as a binary blob
    });
  };
  
  // Handles dropping a file onto the upload area
  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setIsDraggingOver(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      processFile(event.dataTransfer.files[0]);
    }
  }, [processFile]);

  // --- MAIN LOGIC: Determines which backend to call ---
  const handleProcessClick = async () => {
    if (!selectedFile) {
      setError('Please select an image first.');
      return;
    }
    setIsProcessing(true);
    setError(null);
    if (outputImage) URL.revokeObjectURL(outputImage);

    try {
      let response;
      // "Smart" logic: checks the selected operation and calls the correct API
      if (operation === OPERATIONS.CONVERT) {
        response = await convertFile(selectedFile);
      } else { // operation is REMOVE_BG
        response = await removeBackground(selectedFile);
      }
      // Creates a temporary local URL for the processed image to display it
      const temporaryUrl = URL.createObjectURL(response.data);
      setOutputImage(temporaryUrl);
    } catch (err) {
      // Handles errors from either backend server
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'An error occurred during processing.';
      setError(errorMsg);
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Drag-and-drop event handlers
  const handleDragOver = (event) => { event.preventDefault(); setIsDraggingOver(true); };
  const handleDragLeave = (event) => { event.preventDefault(); setIsDraggingOver(false); };

  // Determines the correct file extension for the download link
  const getFileExtension = () => {
    // --- MODIFIED LINE ---
    if (operation === OPERATIONS.REMOVE_BG) return 'webp'; // Changed from 'png' to 'webp'
    return outputFormat;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 tracking-tight">Modern Image Toolkit</h1>
          <p className="text-gray-500 mt-2 text-lg">Convert formats or remove backgrounds with ease.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side: Upload Area */}
          <div
            className={`relative group bg-white rounded-2xl shadow-lg p-6 aspect-square flex flex-col items-center justify-center border-4 border-dashed transition-all duration-300 ${isDraggingOver ? 'border-blue-500 bg-blue-50 scale-105' : 'border-gray-300'}`}
            onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
            onClick={() => !selectedPreview && fileInputRef.current.click()}
          >
            <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="hidden" />
            {selectedPreview ? (
              <>
                <img src={selectedPreview} alt="Selected Preview" className="max-h-full max-w-full object-contain rounded-lg" />
                <button onClick={resetState} className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors"><RefreshCw size={20} /></button>
              </>
            ) : (
              <div className="text-center text-gray-400 cursor-pointer p-8">
                <UploadCloud className="mx-auto h-20 w-20 mb-4 transition-transform group-hover:scale-110" />
                <p className="mt-2 font-bold text-xl text-gray-600">Click to Browse</p>
                <p className="text-md">or drag and drop an image here</p>
              </div>
            )}
          </div>

          {/* Right Side: Actions & Result Display */}
          <div className="flex flex-col items-center justify-center text-center">
              {/* Operation Selector */}
              <div className="mb-6 w-full max-w-xs">
                <label className="block text-sm font-medium text-gray-700 mb-2">Choose Operation</label>
                <div className="flex rounded-lg shadow-sm border border-gray-300">
                  <button onClick={() => setOperation(OPERATIONS.CONVERT)} className={`flex-1 px-4 py-2 text-sm font-medium transition-colors rounded-l-md ${operation === OPERATIONS.CONVERT ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>Convert Format</button>
                  <button onClick={() => setOperation(OPERATIONS.REMOVE_BG)} className={`flex-1 px-4 py-2 text-sm font-medium transition-colors rounded-r-md ${operation === OPERATIONS.REMOVE_BG ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>Remove Background</button>
                </div>
              </div>
              
              {/* Conditional UI: Shows only for "CONVERT" operation */}
              {operation === OPERATIONS.CONVERT && (
                <div className="mb-6 w-full max-w-xs">
                  <label htmlFor="format-select" className="block text-sm font-medium text-gray-700 mb-2">Choose Output Format</label>
                  <select id="format-select" value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)} className="w-full px-4 py-2 text-lg border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" disabled={isProcessing}>
                    <option value="avif">AVIF</option>
                    <option value="webp">WebP</option>
                  </select>
                </div>
              )}

            {/* Action Button: Changes based on selected operation */}
            {selectedFile && !outputImage && (
                <button
                  onClick={handleProcessClick}
                  disabled={isProcessing}
                  className="flex items-center justify-center px-10 py-4 text-white font-bold bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 disabled:bg-gray-400 w-full max-w-xs"
                >
                {isProcessing ? (
                  <><LoaderCircle className="animate-spin mr-2" />Processing...</>
                ) : (
                  operation === OPERATIONS.CONVERT ? (
                    <><ArrowRight className="mr-2" />Convert to {outputFormat.toUpperCase()}</>
                  ) : (
                    <><Scissors className="mr-2" />Remove Background</>
                  )
                )}
                </button>
            )}

            {/* Result Display Box */}
            <div className="mt-6 w-full max-w-xs h-64 bg-gray-100 rounded-lg flex items-center justify-center p-4 border border-gray-200">
                {outputImage ? <img src={outputImage} alt="Processed Output" className="max-h-full max-w-full object-contain rounded-md" />
                : (
                    <div className="text-center text-gray-500">
                        <ImageIcon className="mx-auto h-12 w-12" /><p className="mt-2 font-semibold">Your result will be here</p>
                    </div>
                )}
            </div>
            
            {/* Download Button */}
            {outputImage && !isProcessing && (
                <a href={outputImage} download={`processed.${getFileExtension()}`} className="flex items-center justify-center mt-6 px-10 py-4 text-white font-bold bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 transition-colors duration-300 w-full max-w-xs">
                  <Download className="mr-2" />Download
                </a>
            )}

            {error && <p className="text-red-500 mt-4 font-semibold">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageController;