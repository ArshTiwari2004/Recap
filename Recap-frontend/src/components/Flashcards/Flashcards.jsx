import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Grid,
  List,
  Filter,
  ChevronDown,
  BookOpen,
  Bell,
  Star,
  Clock,
  Eye,
  Edit2,
  Trash2,
  Heart,
  RotateCw,
  Check,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import {
  collection,
  query,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { fireDB } from "../../config/Firebaseconfig";
import Sidebar from "../../components/Sidebar";
import Notification from "../Notifications";
import NavBar from "../NavBar";

// Modal Component
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  size = "md",
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" />
      <div
        ref={modalRef}
        className={`relative ${sizeClasses[size]} w-full mx-4 bg-gray-800 rounded-xl shadow-xl transform transition-all`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="relative">{children}</div>
      </div>
    </div>
  );
};

// Notes Panel Component
const NotesPanel = ({ isOpen, onClose, notes, onNoteSelect, selectedNote }) => {
  return (
    <div
      className={`fixed left-0 top-0 h-full bg-gray-800 border-r border-gray-700 transition-all duration-300 ${
        isOpen ? "w-80" : "w-0"
      } overflow-hidden`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Notes</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedNote?.id === note.id
                  ? "bg-purple-500/20 border border-purple-500"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={() => onNoteSelect(note)}
            >
              <h3 className="text-white font-medium mb-1">{note.subject}</h3>
              <p className="text-gray-400 text-sm line-clamp-2">
                {note.content}
              </p>
              <div className="flex items-center space-x-2 mt-2 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// View Card Modal Component
const ViewCardModal = ({ isOpen, onClose, card, onEdit, onDelete }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Flashcard" size="lg">
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-white mb-2">Question:</h3>
          <p className="text-gray-300">{card?.question}</p>
        </div>

        {!showAnswer ? (
          <button
            onClick={() => setShowAnswer(true)}
            className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Show Answer
          </button>
        ) : (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-2">Answer:</h3>
            <p className="text-gray-300">{card?.answer}</p>
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => {
              onDelete(card.id);
              onClose();
            }}
            className="p-2 text-red-400 hover:text-red-300 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              onEdit(card);
              onClose();
            }}
            className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Edit Modal Component
const EditModal = ({ isOpen, onClose, card, onSave }) => {
  const [editedCard, setEditedCard] = useState(null);

  useEffect(() => {
    if (card) {
      setEditedCard({ ...card });
    }
  }, [card]);

  if (!editedCard) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Flashcard" size="lg">
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Question
          </label>
          <textarea
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            rows={3}
            value={editedCard.question}
            onChange={(e) =>
              setEditedCard({ ...editedCard, question: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Answer
          </label>
          <textarea
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            rows={3}
            value={editedCard.answer}
            onChange={(e) =>
              setEditedCard({ ...editedCard, answer: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Difficulty
          </label>
          <select
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            value={editedCard.difficulty}
            onChange={(e) =>
              setEditedCard({ ...editedCard, difficulty: e.target.value })
            }
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(editedCard);
              onClose();
            }}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Main Flashcards Component
const Flashcards = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [activeFilter, setActiveFilter] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isNotesPanelOpen, setIsNotesPanelOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

  // Fetch notes from Firebase
  useEffect(() => {
    const q = query(collection(fireDB, "notes"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notesData = [];
      querySnapshot.forEach((doc) => {
        notesData.push({ id: doc.id, ...doc.data() });
      });
      setNotes(notesData);
    });

    return () => unsubscribe();
  }, []);

  // Fetch flashcards from Firebase
  useEffect(() => {
    const q = query(collection(fireDB, "flashcards"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cardsData = [];
      querySnapshot.forEach((doc) => {
        cardsData.push({ id: doc.id, ...doc.data() });
      });
      setFlashcards(cardsData);
    });

    return () => unsubscribe();
  }, []);

  // Generate flashcards using Cohere
  const generateFlashcards = async (noteContent) => {
    try {
      setIsGenerating(true);

      const prompt = `Generate 1 flashcards from this content. For each flashcard, create a question and answer pair that tests understanding of key concepts. Format your response as a JSON array of objects, where each object has properties: "question", "answer", "difficulty" (easy/medium/hard). Make the questions challenging but clear. Content: ${noteContent}`;

      const response = await fetch("https://api.cohere.ai/v1/generate", {
        method: "POST",
        headers: {
          Authorization: "Bearer YFAX6MrxeFKRRZakECwf5M9p59Chg7OvYPpsUeDg",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          model: "command",
          prompt: prompt,
          max_tokens: 1000,
          temperature: 0.7,
          k: 0,
          stop_sequences: [],
          return_likelihoods: "NONE",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Parse the generated text as JSON
      let generatedCards;
      try {
        const jsonMatch = data.generations[0].text.match(/\[.*\]/s);
        if (jsonMatch) {
          generatedCards = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON array found in response");
        }
      } catch (parseError) {
        console.error("Error parsing generated cards:", parseError);
        generatedCards = [
          {
            question: "What is a key concept from this content?",
            answer: data.generations[0].text.slice(0, 200),
            difficulty: "medium",
          },
        ];
      }

      // Save the generated flashcards
      for (const card of generatedCards) {
        await addDoc(collection(fireDB, "flashcards"), {
          ...card,
          noteId: selectedNote.id,
          subject: selectedNote.subject || "General",
          createdAt: new Date().toISOString(),
          favorite: false,
          mastered: false,
          timesReviewed: 0,
          lastReviewed: new Date().toISOString(),
        });
      }

      return generatedCards;
    } catch (error) {
      console.error("Error generating flashcards:", error);
      return extractFlashcardsFromContent(noteContent);
    } finally {
      setIsGenerating(false);
    }
  };

  // Fallback local extraction function
  const extractFlashcardsFromContent = (content) => {
    const sentences = content
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0);
    const flashcards = [];

    sentences.forEach((sentence, index) => {
      sentence = sentence.trim();

      if (sentence.includes(" is ") || sentence.includes(" are ")) {
        const [term, definition] = sentence.split(/ is | are /);
        if (term && definition) {
          flashcards.push({
            question: `What is ${term.trim()}?`,
            answer: definition.trim(),
            difficulty: "medium",
          });
        }
      }
    });

    if (flashcards.length === 0 && sentences.length > 0) {
      flashcards.push({
        question: "What is the main concept discussed in this content?",
        answer: sentences[0],
        difficulty: "medium",
      });
    }

    return flashcards;
  };

  const handleFlashcardGeneration = async () => {
    if (!selectedNote) {
      console.log("Please select a note first");
      return;
    }

    setIsGenerating(true);
    try {
      const cards = await generateFlashcards(selectedNote.content);
      console.log(`Successfully generated ${cards.length} flashcards`);
    } catch (error) {
      console.error("Failed to generate flashcards:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleFavorite = async (cardId) => {
    const cardRef = doc(fireDB, "flashcards", cardId);
    const card = flashcards.find((c) => c.id === cardId);
    await updateDoc(cardRef, { favorite: !card.favorite });
  };

  const toggleMastered = async (cardId) => {
    const cardRef = doc(fireDB, "flashcards", cardId);
    const card = flashcards.find((c) => c.id === cardId);
    await updateDoc(cardRef, { mastered: !card.mastered });
  };

  const deleteCard = async (cardId) => {
    await deleteDoc(doc(fireDB, "flashcards", cardId));
  };

  const updateCard = async (cardId, updatedData) => {
    const cardRef = doc(fireDB, "flashcards", cardId);
    await updateDoc(cardRef, updatedData);
  };

  // Filter and sort flashcards
  const filteredCards = flashcards
    .filter((card) => {
      if (searchQuery) {
        return (
          card.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.answer.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      if (selectedCategory === "favorites") {
        return card.favorite;
      }
      if (selectedCategory === "subjects") {
        return true;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0;
    });

  const openCardModal = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const openEditModal = (card) => {
    setEditingCard({ ...card });
    setEditModalOpen(true);
  };

  const renderFlashcard = (card) => {
    return (
      <div
        key={card.id}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 cursor-pointer"
        onClick={() => openCardModal(card)}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-white font-medium text-lg mb-1">
              {card.question}
            </h3>
            <p className="text-gray-400 text-sm">{card.subject}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className={`p-2 ${
                card.favorite ? "text-purple-400" : "text-gray-400"
              } hover:text-purple-400 transition-colors`}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(card.id);
              }}
            >
              <Heart
                className="w-4 h-4"
                fill={card.favorite ? "currentColor" : "none"}
              />
            </button>
            <button
              className={`p-2 ${
                card.mastered ? "text-green-400" : "text-gray-400"
              } hover:text-green-400 transition-colors`}
              onClick={(e) => {
                e.stopPropagation();
                toggleMastered(card.id);
              }}
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>

        <span
          className={`px-2 py-1 rounded-full text-xs ${
            card.difficulty === "hard"
              ? "bg-red-500/20 text-red-400"
              : card.difficulty === "medium"
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-green-500/20 text-green-400"
          }`}
        >
          {card.difficulty}
        </span>

        <div className="flex items-center justify-between text-sm text-gray-400 mt-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>
              Last reviewed: {new Date(card.lastReviewed).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <RotateCw className="w-4 h-4" />
            <span>{card.timesReviewed} reviews</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />

      <NotesPanel
        isOpen={isNotesPanelOpen}
        onClose={() => setIsNotesPanelOpen(false)}
        notes={notes}
        onNoteSelect={setSelectedNote}
        selectedNote={selectedNote}
      />

      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <NavBar
          panelToggleButton={
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsNotesPanelOpen(!isNotesPanelOpen)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {isNotesPanelOpen ? (
                  <PanelLeftClose className="w-5 h-5" />
                ) : (
                  <PanelLeftOpen className="w-5 h-5" />
                )}
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-white"></span>
              </div>
            </div>
          }
          icon={<BookOpen className="w-6 h-6 text-purple-400" />}
          header={"Flashcards"}
          button1={"Feedback"}
          button2={"Help"}
          button3={"Dock"}
        />

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Categories and Generate Button */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === "all"
                      ? "bg-purple-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  <span>All Flashcards</span>
                </button>
                <button
                  onClick={() => setSelectedCategory("subjects")}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === "subjects"
                      ? "bg-purple-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>By Subject</span>
                </button>
                <button
                  onClick={() => setSelectedCategory("favorites")}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === "favorites"
                      ? "bg-purple-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Star className="w-4 h-4" />
                  <span>Favorites</span>
                </button>
              </div>
              <button
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() =>
                  selectedNote && generateFlashcards(selectedNote.content)
                }
                disabled={isGenerating || !selectedNote}
              >
                {isGenerating ? "Generating..." : "Generate Flashcards"}
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center justify-between mb-8">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search flashcards..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button
                    onClick={() =>
                      setActiveFilter(
                        activeFilter === "filter" ? null : "filter"
                      )
                    }
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white flex items-center space-x-2 hover:border-purple-500 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative">
                  <button
                    onClick={() =>
                      setActiveFilter(activeFilter === "sort" ? null : "sort")
                    }
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white flex items-center space-x-2 hover:border-purple-500 transition-colors"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Sort by</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="border-l border-gray-700 pl-4 flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "grid"
                        ? "bg-purple-500 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "list"
                        ? "bg-purple-500 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Flashcards Grid */}
            <div
              className={`grid ${
                viewMode === "grid" ? "grid-cols-2" : "grid-cols-1"
              } gap-6`}
            >
              {filteredCards.map((card) => renderFlashcard(card))}
            </div>
          </div>
        </div>
      </div>

      {/* View Card Modal */}
      <ViewCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        card={selectedCard}
        onEdit={openEditModal}
        onDelete={deleteCard}
      />

      {/* Edit Card Modal */}
      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        card={editingCard}
        onSave={(updatedCard) => {
          updateCard(updatedCard.id, updatedCard);
          setEditModalOpen(false);
        }}
      />
    </div>
  );
};

export default Flashcards;
