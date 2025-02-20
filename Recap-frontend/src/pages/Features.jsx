import { BookOpen, Brain, Users, Mic, Scan, Clipboard } from "lucide-react"

const features = [
  {
    icon: <BookOpen className="w-8 h-8 text-purple-400" />,
    title: "Smart Organization",
    description: "Automatically categorize and link your notes across subjects for seamless learning.",
  },
  {
    icon: <Brain className="w-8 h-8 text-purple-400" />,
    title: "AI-Enhanced Learning",
    description: "Get personalized insights and suggestions to improve your study materials.",
  },
  {
    icon: <Users className="w-8 h-8 text-purple-400" />,
    title: "Collaborative Study",
    description: "Share and collaborate on notes with classmates in real-time.",
  },
  {
    icon: <Mic className="w-8 h-8 text-purple-400" />,
    title: "Voice-to-Text",
    description: "Convert voice recordings into text notes for easy review and study.",
  },
  {
    icon: <Scan className="w-8 h-8 text-purple-400" />,
    title: "Handwriting to Digital Notes",
    description: "Scan handwritten notes and convert them into editable, searchable text.",
  },
  {
    icon: <Clipboard className="w-8 h-8 text-purple-400" />,
    title: "Customizable Quizzes",
    description: "Create custom quizzes, adjust difficulty, and track progress to enhance learning.",
  },
]

export function Features() {
  return (
    <div className="relative py-24" id="features">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/0 via-gray-900 to-gray-900/0 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium mb-4">
            FEATURES
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">What is Lecture Transcription?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-gray-800/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="bg-purple-500/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

