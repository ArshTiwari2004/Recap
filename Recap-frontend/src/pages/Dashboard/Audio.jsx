import React, { useState, useCallback, useRef } from 'react';
import { Mic, Square, Upload, Loader } from 'lucide-react';
import { AssemblyAI } from 'assemblyai';

// Initialize AssemblyAI client
const client = new AssemblyAI({
  apiKey: '5e2362c9c43340e99698ef2c7555a8d9'
});

const AudioTranscription = ({ onTranscriptionComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Handle file upload transcription
  const handleFileUpload = async (file) => {
    try {
      setIsProcessing(true);

      // Convert file to base64
      const base64Audio = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });

      // Create transcription config
      const config = {
        audio: base64Audio
      };

      // Start transcription
      const transcript = await client.transcripts.transcribe(config);
      
      setTranscribedText(transcript.text);
      onTranscriptionComplete({
        title: file.name,
        content: transcript.text,
        format: 'audio',
        type: 'transcription'
      });
    } catch (error) {
      console.error('Transcription error:', error);
      alert('Failed to transcribe audio. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle live recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Recording error:', error);
      alert('Failed to start recording. Please check your microphone permissions.');
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    setIsRecording(false);

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const file = new File([audioBlob], 'recorded-lecture.wav', { type: 'audio/wav' });
      await handleFileUpload(file);
    };
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex flex-col space-y-6">
        {/* Recording Controls */}
        <div className="flex items-center justify-center space-x-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
              disabled={isProcessing}
            >
              <Mic className="w-5 h-5" />
              <span>Start Recording</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
            >
              <Square className="w-5 h-5" />
              <span>Stop Recording</span>
            </button>
          )}

          {/* File Upload */}
          <div className="relative">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              className="hidden"
              id="audio-upload"
              disabled={isProcessing || isRecording}
            />
            <label
              htmlFor="audio-upload"
              className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors cursor-pointer"
            >
              <Upload className="w-5 h-5" />
              <span>Upload Audio</span>
            </label>
          </div>
        </div>

        {/* Processing Status */}
        {isProcessing && (
          <div className="flex items-center justify-center space-x-2 text-purple-400">
            <Loader className="w-5 h-5 animate-spin" />
            <span>Processing audio...</span>
          </div>
        )}

        {/* Transcription Result */}
        {transcribedText && (
          <div className="mt-6">
            <h3 className="text-white font-medium mb-2">Transcription:</h3>
            <div className="bg-gray-700/50 rounded-lg p-4 max-h-60 overflow-y-auto">
              <p className="text-gray-200 whitespace-pre-wrap">{transcribedText}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioTranscription;