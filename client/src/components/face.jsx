import React, { useState } from "react";
import axios from "axios";

const FaceExpression = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setPrediction("");
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return alert("Please select an image!");
    setLoading(true);
    setPrediction("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post("http://127.0.0.1:8000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPrediction(res.data.caption || "No expression detected.");
    } catch (err) {
      console.error(err);
      setPrediction("⚠️ Error predicting expression.");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 rounded-2xl shadow-2xl p-6 mt-6 ring-1 ring-indigo-700/30 font-sans">
        
      <h2 className="text-2xl font-bold text-indigo-400 mb-2 text-center">
        Face Expression Recognition
      </h2>
      <p className="text-indigo-300/70 text-center mb-6">
        Upload your image to detect your facial expression.
      </p>

      {/* Image Preview */}
      {preview ? (
        <div className="flex justify-center mb-5">
          <img
            src={preview}
            alt="Preview"
            className="rounded-xl shadow-md max-h-64 object-contain border border-indigo-700/30"
          />
        </div>
      ) : (
        <div className="flex justify-center items-center mb-5 h-48 border-2 border-dashed border-indigo-700/30 rounded-xl text-indigo-400/70">
          No image selected
        </div>
      )}

      {/* File Upload */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-5">
        <label className="cursor-pointer px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 rounded-lg shadow-md text-white text-center transition">
          Choose Image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-5 py-2 rounded-lg shadow-md font-medium flex items-center justify-center transition ${
            loading
              ? "bg-indigo-500/40 text-indigo-200 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white"
          }`}
        >
          {loading ? (
            <>
              <svg
                className="w-4 h-4 mr-2 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle
                  className="opacity-20"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                />
                <path
                  className="opacity-90"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Analyzing...
            </>
          ) : (
            "Predict Expression"
          )}
        </button>
      </div>

      {/* Result Box */}
      {prediction && (
        <div className="bg-gray-900/70 border border-indigo-700/30 rounded-lg p-4 mt-4 text-center">
          <h3 className="text-indigo-400 font-semibold mb-1">Prediction:</h3>
          <p className="text-lg text-indigo-100 font-medium">
            {prediction}
          </p>
        </div>
      )}
    </div>
  );
};



export default FaceExpression;
