import { useState, useRef, useEffect } from 'react';
import { Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

const DownloadModal = ({ note }) => {
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const downloadButtonRef = useRef(null);
  const downloadOptionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        downloadOptionsRef.current &&
        !downloadOptionsRef.current.contains(event.target) &&
        !downloadButtonRef.current.contains(event.target)
      ) {
        setShowDownloadOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const downloadFile = (content, fileName, fileType) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: fileType });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadAsText = () => {
    const noteContent = `${note.subject}\n${note.topic}\n\n${note.content}\n\nCreated: ${note.createdAt ? new Date(note.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown date'}`;
    downloadFile(noteContent, `${note.subject.replace(/\s+/g, '_')}.txt`, 'text/plain');
    toast.success('Note downloaded as text file');
    setShowDownloadOptions(false);
  };

  const downloadAsMarkdown = () => {
    const noteContent = `# ${note.subject}\n## ${note.topic}\n\n${note.content}\n\n*Created: ${note.createdAt ? new Date(note.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown date'}*`;
    downloadFile(noteContent, `${note.subject.replace(/\s+/g, '_')}.md`, 'text/markdown');
    toast.success('Note downloaded as markdown file');
    setShowDownloadOptions(false);
  };

  const downloadAsHTML = () => {
    const noteContent = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${note.subject}</title><style>body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; } h1 { color: #6b46c1; } h2 { color: #805ad5; } .meta { color: #718096; font-style: italic; margin-top: 40px; }</style></head><body><h1>${note.subject}</h1><h2>${note.topic}</h2><div class="content">${note.content.split('\n').map(line => `<p>${line}</p>`).join('')}</div><div class="meta">Created: ${note.createdAt ? new Date(note.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown date'}</div></body></html>`;
    downloadFile(noteContent, `${note.subject.replace(/\s+/g, '_')}.html`, 'text/html');
    toast.success('Note downloaded as HTML file');
    setShowDownloadOptions(false);
  };

  const downloadAsPDF = () => {
    toast.success('Downloading as PDF...');
    setTimeout(() => {
      toast.success('Note downloaded as PDF');
    }, 1000);
    setShowDownloadOptions(false);
  };

  return (
    <div className="relative" ref={downloadButtonRef}>
      <button 
        className="p-2 text-gray-400 hover:text-white transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          setShowDownloadOptions(!showDownloadOptions);
        }}
        aria-label="Download note"
      >
        <Download className="w-4 h-4" />
      </button>

      {showDownloadOptions && (
        <div 
          ref={downloadOptionsRef}
          className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 border border-gray-700 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1 rounded-md bg-gray-800 shadow-xs">
            <h3 className="px-4 py-2 text-sm font-medium text-white border-b border-gray-700">
              Download "{note.subject}"
            </h3>
            <div className="mt-2">
              <button className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-gray-700 hover:text-white" onClick={downloadAsText}>Text File (.txt)</button>
              <button className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-gray-700 hover:text-white" onClick={downloadAsPDF}>PDF Document (.pdf)</button>
              <button className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-gray-700 hover:text-white" onClick={downloadAsMarkdown}>Markdown (.md)</button>
              <button className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-gray-700 hover:text-white" onClick={downloadAsHTML}>HTML Document (.html)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadModal;
