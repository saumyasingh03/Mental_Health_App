import React, { useState } from "react";
import axios from "axios";

const FaceExpression = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setPrediction("");
  };

  const handleSubmit = async () => {
    if (!selectedFile) return alert("Please select an image!");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post("http://127.0.0.1:8000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPrediction(res.data.caption);
    } catch (err) {
      console.error(err);
      setPrediction("Error predicting expression.");
    }
  };

  return (
    <div className="face-expression">
      <h2>Face Expression Recognition</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Predict Expression</button>
      {prediction && <p>Prediction: <strong>{prediction}</strong></p>}
    </div>
  );
};

export default FaceExpression;
