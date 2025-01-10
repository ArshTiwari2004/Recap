import React, { useState } from "react";
import Tesseract from "tesseract.js";

const OCRScanner = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const extractText = () => {
    if (!image) {
      alert("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setText(""); // Clear previous results

    Tesseract.recognize(image, "eng", {
      logger: (info) => {
        if (info.status === "recognizing text") {
          setProgress(Math.floor(info.progress * 100));
        }
      },
    })
      .then(({ data: { text } }) => {
        setText(text);
        setIsLoading(false);
        setProgress(0);
      })
      .catch((error) => {
        console.error("OCR Error:", error);
        setIsLoading(false);
      });
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-gray-900 text-white rounded-lg shadow-md">
      <h1 className="text-lg font-bold mb-4">OCR Scanner</h1>
      
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4 block text-gray-400"
      />

      {image && (
        <div className="mb-4">
          <img
            src={image}
            alt="Uploaded"
            className="max-h-48 rounded-lg shadow-md"
          />
        </div>
      )}

      <button
        onClick={extractText}
        disabled={isLoading}
        className="w-full py-2 bg-purple-600 rounded-md hover:bg-purple-500 transition disabled:opacity-50"
      >
        {isLoading ? `Extracting (${progress}%)` : "Extract Text"}
      </button>

      {text && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg shadow">
          <h2 className="font-semibold text-purple-400 mb-2">Extracted Text:</h2>
          <p>{text}</p>
        </div>
      )}
    </div>
  );
};

export default OCRScanner;
