// src/pages/Dashboard/Adem/ImageController.jsx

import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { UploadCloud, Image as ImageIcon, LoaderCircle, Link2 } from 'lucide-react';

const ImageController = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [avifImage, setAvifImage] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false); // For visual feedback
  const fileInputRef = useRef(null);

  // Universal function to process a file object
  const processFile = useCallback((file) => {
    if (avifImage) URL.revokeObjectURL(avifImage);
    setAvifImage(null);
    setError(null);
    setSelectedFile(file);
    setSelectedPreview(URL.createObjectURL(file));
  }, [avifImage]);

  // Handle file selection from the input dialog
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  // Convert an uploaded file
  const convertUploadedFile = async () => {
    const formData = new FormData();
    formData.append('image', selectedFile);
    return axios.post('http://localhost:5000/api/convert/avif', formData, {
      responseType: 'blob',
    });
  };

  // Convert an image from a URL
  const convertFromUrl = async (imageUrl) => {
    return axios.post('http://localhost:5000/api/convert/from-url', { imageUrl }, {
      responseType: 'blob',
    });
  };

  // --- Drag and Drop Handlers ---
  const handleDragOver = (event) => {
    event.preventDefault(); // This is crucial to allow dropping
    setIsDraggingOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = useCallback(async (event) => {
    event.preventDefault();
    setIsDraggingOver(false);
    setError(null);

    // Case 1: A file from the user's computer was dropped
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      processFile(event.dataTransfer.files[0]);
      return;
    }

    // Case 2: An image from the internet was dropped (we get its URL)
    const imageUrl = event.dataTransfer.getData('text/uri-list');
    if (imageUrl) {
      setIsConverting(true);
      if (avifImage) URL.revokeObjectURL(avifImage);
      try {
        const response = await convertFromUrl(imageUrl);
        const temporaryUrl = URL.createObjectURL(response.data);
        setAvifImage(temporaryUrl);
        // Show the original image as the preview
        setSelectedFile(null); // Clear file selection
        setSelectedPreview(imageUrl); // Use the original URL for preview
      } catch (err) {
        setError('Failed to fetch or convert image from URL.');
        console.error(err);
      } finally {
        setIsConverting(false);
      }
      return;
    }
  }, [avifImage, processFile]);

  // Main conversion function triggered by the button
  const handleConvertClick = async () => {
    if (!selectedFile) {
      setError('Please select an image first.');
      return;
    }
    setIsConverting(true);
    setError(null);
    if (avifImage) URL.revokeObjectURL(avifImage);

    try {
      const response = await convertUploadedFile();
      const temporaryUrl = URL.createObjectURL(response.data);
      setAvifImage(temporaryUrl);
    } catch (err) {
      setError('An error occurred during conversion.');
      console.error(err);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="w-full max-w-5xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">AVIF Image Converter</h1>
          <p className="text-gray-600 mt-2">Upload a file, or drag an image from any website.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Panel: Upload */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
            <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">Upload</h2>
            <div
              className={`flex-grow flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 transition-colors ${
                isDraggingOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()} // Keep click functionality
            >
              <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="hidden" />
              {selectedPreview ? (
                <img src={selectedPreview} alt="Selected" className="max-h-80 w-auto object-contain rounded-md" />
              ) : (
                <div className="text-center text-gray-500 cursor-pointer">
                  <UploadCloud className="mx-auto h-12 w-12" />
                  <p className="mt-2 font-semibold">Click to browse</p>
                  <p className="text-sm">or drag and drop an image here</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Result */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
            <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">Result</h2>
            <div className="flex-grow flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
              {isConverting ? (
                 <div className="text-center text-blue-600">
                   <LoaderCircle className="mx-auto h-12 w-12 animate-spin" />
                   <p className="mt-2 font-semibold">{selectedFile ? 'Converting...' : 'Fetching & Converting...'}</p>
                 </div>
              ) : avifImage ? (
                <img src={avifImage} alt="AVIF version" className="max-h-80 w-auto object-contain rounded-md" />
              ) : (
                <div className="text-center text-gray-500">
                  <ImageIcon className="mx-auto h-12 w-12" />
                  <p className="mt-2 font-semibold">Your converted AVIF image will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Area */}
        <div className="mt-8 text-center">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          {selectedFile && !avifImage && !isConverting && (
            <button
              onClick={handleConvertClick}
              className="px-8 py-3 text-white font-bold bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
            >
              Convert to AVIF
            </button>
          )}

          {avifImage && !isConverting && (
            <a href={avifImage} download="converted.avif" className="inline-block px-8 py-3 text-white font-bold bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-300">
              Download
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageController;