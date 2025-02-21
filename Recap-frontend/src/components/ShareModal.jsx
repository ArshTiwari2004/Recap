import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Share2 } from "lucide-react";

const ShareModal = ({ note, onClose }) => {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const shareButtonRef = useRef(null);
  const shareOptionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        shareOptionsRef.current &&
        !shareOptionsRef.current.contains(event.target) &&
        !shareButtonRef.current.contains(event.target)
      ) {
        setShowShareOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleShare = (platform) => {
    const noteUrl = `${window.location.origin}/notes/${note.id}`;
    let shareUrl = "";
  
    switch (platform) {
      case "Google Drive":
        toast("Google Drive integration needed.");
        return;
        
      case "Dropbox":
        toast("Dropbox integration needed.");
        return;
  
      case "Telegram":
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(noteUrl)}&text=${encodeURIComponent(`Check out this note: ${note.subject}`)}`;
        break;
  
      case "Email":
        shareUrl = `mailto:?subject=${encodeURIComponent(note.subject)}&body=${encodeURIComponent(`Check out this note: ${noteUrl}`)}`;
        break;
  
      case "WhatsApp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`Check out this note: ${noteUrl}`)}`;
        break;
  
      default:
        toast.error("Unsupported sharing platform.");
        return;
    }
  
    window.open(shareUrl, "_blank");
    toast.success(`Sharing note to ${platform}`);
    setShowShareOptions(false);
  };
  

  return (
    <div className="relative" ref={shareButtonRef}>
      <button
        className="p-2 text-gray-400 hover:text-white transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          setShowShareOptions(!showShareOptions);
        }}
        aria-label="Share note"
      >
        <Share2 className="w-4 h-4" />
      </button>

      {showShareOptions && (
        <div
          ref={shareOptionsRef}
          className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 border border-gray-700 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1 rounded-md bg-gray-800 shadow-xs">
            <h3 className="px-4 py-2 text-sm font-medium text-white border-b border-gray-700">
              Share "{note.subject}"
            </h3>
            
            <div className="mt-2">
              {[
                { platform: "Google Drive", color: "bg-blue-600", letter: "G" },
                { platform: "Dropbox", color: "bg-blue-500", letter: "D" },
                { platform: "Telegram", color: "bg-blue-400", letter: "T" },
                { platform: "Email", color: "bg-red-500", letter: "@" },
                { platform: "WhatsApp", color: "bg-green-500", letter: "W" },
              ].map(({ platform, color, letter }) => (
                <button
                  key={platform}
                  className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={() => handleShare(platform)}
                >
                  <div className={`w-6 h-6 mr-3 flex items-center justify-center ${color} rounded`}>
                    <span className="font-bold text-white text-xs">{letter}</span>
                  </div>
                  {platform}
                </button>
              ))}
            </div>
            
            <div className="border-t border-gray-700 mt-2 pt-2">
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/notes/${note.id}`);
                  toast.success("Link copied to clipboard");
                  setShowShareOptions(false);
                }}
              >
                <div className="w-6 h-6 mr-3 flex items-center justify-center bg-gray-600 rounded">
                  <span className="font-bold text-white text-xs">🔗</span>
                </div>
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareModal;
