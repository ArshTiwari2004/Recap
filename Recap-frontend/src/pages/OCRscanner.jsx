import React, { useState } from "react";
import { Upload, RefreshCw, FileText, AlertCircle, FileUp, Image, Mic, Bell, BookOpen } from "lucide-react";
import Tesseract from "tesseract.js";
import Sidebar from "@/components/Sidebar";

const OCRScanner = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(URL.createObjectURL(file));
    }
  };

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
    setText("");

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
    <div className="flex h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black overflow-hidden">
      {/* Sidebar */}
      <Sidebar/>

      {/* Main Content */}
      <div className="flex-1 ml-30">
        {/* Navbar */}
        <header className="fixed top-0 right-0 left-72 h-16 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 z-40">
          <div className="h-full px-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-6 h-6 text-purple-400" />
              <span className="text-lg font-semibold text-white">Notes Dashboard</span>
            </div>

            <div className="flex items-center space-x-6">
              <button className="text-gray-400 hover:text-white transition-colors duration-200">
                Feedback
              </button>
              <button className="text-gray-400 hover:text-white transition-colors duration-200">
                Help
              </button>
              <button className="text-gray-400 hover:text-white transition-colors duration-200">
                Docs
              </button>
              <div className="relative">
                <Bell className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors duration-200" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full ring-2 ring-gray-900"></span>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity duration-200">
                <span className="text-white text-sm font-medium">U</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="pt-16 px-6 pb-6 h-screen overflow-y-auto">
          <div className="max-w-3xl mx-auto py-8 space-y-6">
            {/* Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ease-in-out bg-gray-900/50 backdrop-blur-sm
                ${dragActive ? "border-purple-400 bg-purple-400/10" : "border-gray-700 hover:border-gray-600"}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload
                className={`w-12 h-12 mx-auto mb-4 transition-colors duration-200
                  ${dragActive ? "text-purple-400" : "text-gray-600"}`}
              />
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-300">
                  Drop your image here or click to upload
                </p>
                <p className="text-sm text-gray-500">
                  Supports PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>

            {/* Image Preview */}
            {image && (
              <div className="relative group rounded-xl overflow-hidden bg-gray-900/50 backdrop-blur-sm p-4">
                <img
                  src={image}
                  alt="Uploaded"
                  className="w-full h-auto rounded-lg shadow-xl transition-transform duration-200 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            )}

            {/* Progress Bar */}
            {isLoading && (
              <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl">
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-center gap-2 text-gray-400">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing... {progress}%</span>
                </div>
              </div>
            )}

            {/* Extract Button */}
            <button
              onClick={extractText}
              disabled={!image || isLoading}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl font-medium text-white
                shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed
                hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:hover:scale-100"
            >
              {isLoading ? "Processing..." : "Extract Text"}
            </button>

            {/* Extracted Text */}
            {text && (
              <div className="space-y-4 bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl">
                <div className="flex items-center gap-2 text-lg font-medium text-white">
                  <FileText className="w-5 h-5 text-purple-400" />
                  Extracted Text
                </div>
                <div className="p-4 rounded-lg bg-black/40 border border-gray-800">
                  <p className="text-gray-300 whitespace-pre-wrap break-words">{text}</p>
                </div>
              </div>
            )}

            {/* Alert */}
            {!image && (
              <div className="flex gap-2 p-4 rounded-xl bg-purple-500/10 border border-purple-400/20">
                <AlertCircle className="w-5 h-5 text-purple-400 shrink-0" />
                <p className="text-gray-400">
                  Upload an image to get started with the text extraction
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OCRScanner;