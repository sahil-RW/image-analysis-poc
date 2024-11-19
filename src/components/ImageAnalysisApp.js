import { useState } from 'react';
import { Upload } from 'lucide-react';
import { analyzeImage } from '../utils/openaiService';

const ImageAnalysisApp = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [llmResponse, setLlmResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisType, setAnalysisType] = useState('accident');

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    setError(null);
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      setIsLoading(true);
      setSelectedImage(URL.createObjectURL(file));
      
      try {
        const analysis = await analyzeImage(file, analysisType);
        setLlmResponse(analysis);
      } catch (error) {
        console.error('Error processing image:', error);
        setError('Error analyzing image. Please try again.');
        setLlmResponse('');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {!selectedImage ? (
        <div className="flex items-center justify-center h-[80vh]">
          <div className="bg-white rounded-lg shadow-lg w-96">
            <div className="flex flex-col items-center justify-center h-full p-6 space-y-6">
              {/* Analysis Type Selector */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Analysis Type
                </label>
                <select
                  value={analysisType}
                  onChange={(e) => setAnalysisType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="accident">Accident Analysis</option>
                  <option value="prescription">Prescription Analysis</option>
                </select>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <button
                onClick={() => document.getElementById('image-upload').click()}
                className="cursor-pointer flex flex-col items-center gap-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Upload size={48} className="text-gray-400" />
                Select Image
              </button>
              <p className="text-sm text-gray-500">
                Upload an image to analyze
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Input Image</h2>
              <select
                value={analysisType}
                onChange={(e) => setAnalysisType(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="accident">Accident Analysis</option>
                <option value="prescription">Prescription Analysis</option>
              </select>
            </div>
            <div className="aspect-video relative">
              <img
                src={selectedImage}
                alt="Uploaded"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Analysis Output</h2>
            <div className="aspect-video overflow-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{llmResponse}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-2 flex justify-center">
            <button
              onClick={() => {
                setSelectedImage(null);
                setLlmResponse('');
                setError(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Upload New Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageAnalysisApp;