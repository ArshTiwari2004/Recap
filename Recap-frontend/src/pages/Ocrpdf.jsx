import React, { useState, useEffect } from "react";
import { Upload, RefreshCw, FileText, AlertCircle, Save } from "lucide-react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { fireDB } from "@/config/Firebaseconfig";
import * as pdfjsLib from "pdfjs-dist";
import Tesseract from "tesseract.js";
import Sidebar from "@/components/Sidebar";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

const PDFOCRScanner = () => {

  const location = useLocation();
  const { subjectName, topicName } = location.state || {}; 
  // console.log("Subject Name:", subjectName);
  
  const [pdfFile, setPdfFile] = useState(null);
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteTopic, setNoteTopic] = useState("");
  const [notes, setNotes] = useState([]); // Add this state for managing notes


// Set up the worker
const pdfjsVersion = '3.11.174'; // Use a specific version that exists on CDN
const pdfjsWorkerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;

  // Initialize PDF.js worker
  useEffect(() => {
    const workerUrl = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    
    // Create a script element
    const script = document.createElement('script');
    script.src = workerUrl;
    script.async = true;
    
    script.onload = () => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
    };
    
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      loadPDF(file);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      loadPDF(file);
    }
  };
  const loadPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
        cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
        cMapPacked: true,
      }).promise;
      
      setTotalPages(pdf.numPages);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error loading PDF:", error);
      toast.error("Failed to load PDF. Please try again.");
    }
  };

  const convertPageToImage = async (pageNum) => {
    try {
      const fileReader = new FileReader();
      
      return new Promise((resolve, reject) => {
        fileReader.onload = async function() {
          const typedArray = new Uint8Array(this.result);
          try {
            const pdf = await pdfjsLib.getDocument(typedArray).promise;
            const page = await pdf.getPage(pageNum);
            
            const viewport = page.getViewport({ scale: 2.0 });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            
            await page.render({
              canvasContext: context,
              viewport: viewport,
            }).promise;
            
            resolve(canvas.toDataURL("image/png"));
          } catch (error) {
            reject(error);
          }
        };
        
        fileReader.readAsArrayBuffer(pdfFile);
      });
    } catch (error) {
      console.error("Error converting PDF to image:", error);
      throw error;
    }
  };

 // Add useEffect to initialize the worker
 useEffect(() => {
    const loadWorker = async () => {
      try {
        pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerSrc;
      } catch (error) {
        console.error('Error initializing PDF.js worker:', error);
        toast.error('Error initializing PDF processor. Please refresh the page.');
      }
    };
    
    loadWorker();
  }, []);


  const extractText = async () => {
    if (!pdfFile) {
      toast.error("Please upload a PDF first.");
      return;
    }

    setIsLoading(true);
    setText("");
    let fullText = "";

    try {
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        setCurrentPage(pageNum);
        const imageUrl = await convertPageToImage(pageNum);
        
        const result = await Tesseract.recognize(imageUrl, "eng", {
          logger: (info) => {
            if (info.status === "recognizing text") {
              const pageProgress = (pageNum - 1) / totalPages;
              const recognitionProgress = info.progress / totalPages;
              setProgress(Math.floor((pageProgress + recognitionProgress) * 100));
            }
          },
        });
        
        fullText += result.data.text + "\n\n--- Page Break ---\n\n";
      }
      
      setText(fullText);
    } catch (error) {
      console.error("OCR Error:", error);
      toast.error("Failed to extract text. Please try again.");
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  const handleSaveNote = async () => {
    if (!noteTitle.trim() || !noteTopic.trim() || !text.trim()) {
      toast.error("Please fill in all fields before saving.");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.uid) {
        throw new Error("Please log in to save notes.");
      }

      // Upload PDF to storage
      const storage = getStorage();
      const pdfRef = ref(storage, `pdfs/${user.uid}/${pdfFile.name}`);
      const uploadTask = await uploadBytes(pdfRef, pdfFile);
      const pdfUrl = await getDownloadURL(uploadTask.ref);

      // Save note data to Firestore
      const noteData = {
        uid: user.uid,
        subject: subjectName.trim(),
        topic: topicName.trim(),
        content: text,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(fireDB, "notes"), noteData);
      
      // Update local notes state
      setNotes(prevNotes => [...prevNotes, { ...noteData, id: docRef.id }]);
      
      toast.success("Note saved successfully!");
      
      // Clear form
      setNoteTitle("");
      setNoteTopic("");
      setText("");
      setPdfFile(null);
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black overflow-hidden">
      <Sidebar />

      <div className="flex-1 ml-30">
        {/* Navbar */}
        <header className="fixed top-0 right-0 left-72 h-16 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 z-40">
          <div className="h-full px-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-purple-400" />
              <span className="text-lg font-semibold text-white">PDF OCR Scanner</span>
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
                accept="application/pdf"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload
                className={`w-12 h-12 mx-auto mb-4 transition-colors duration-200
                  ${dragActive ? "text-purple-400" : "text-gray-600"}`}
              />
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-300">
                  Drop your PDF here or click to upload
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF files up to 10MB
                </p>
              </div>
            </div>

            {/* File Info */}
            {pdfFile && (
              <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-purple-400" />
                    <span className="text-gray-300">{pdfFile.name}</span>
                  </div>
                  <span className="text-gray-500">
                    Pages: {currentPage} / {totalPages}
                  </span>
                </div>
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
              disabled={!pdfFile || isLoading}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl font-medium text-white
                shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed
                hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:hover:scale-100"
            >
              {isLoading ? "Processing..." : "Extract Text"}
            </button>

            {/* Note Details */}
            {text && (
              <div className="space-y-4 bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl">
                <input
                  type="text"
                  placeholder="Note Title"
                  className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 text-white focus:outline-none focus:border-purple-500"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Topic"
                  className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 text-white focus:outline-none focus:border-purple-500"
                  value={noteTopic}
                  onChange={(e) => setNoteTopic(e.target.value)}
                />
                <div className="p-4 rounded-lg bg-black/40 border border-gray-800">
                  <p className="text-gray-300 whitespace-pre-wrap break-words">{text}</p>
                </div>
                <button
                  onClick={handleSaveNote}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium
                    hover:from-purple-500 hover:to-pink-500 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Note
                </button>
              </div>
            )}

            {/* Alert */}
            {!pdfFile && (
              <div className="flex gap-2 p-4 rounded-xl bg-purple-500/10 border border-purple-400/20">
                <AlertCircle className="w-5 h-5 text-purple-400 shrink-0" />
                <p className="text-gray-400">
                  Upload a PDF to extract text content
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PDFOCRScanner;