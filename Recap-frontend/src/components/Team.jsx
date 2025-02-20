import React from 'react';
import { Github, Linkedin, Twitter, Instagram , Bot } from 'lucide-react';

const TeamSection = () => {
  const team = [
    {
      name: "Arsh Tiwari",
      role: "Full Stack Developer ",
      image: "/arsh1.jpeg",
      links: {
        linkedin: "https://www.linkedin.com/in/arsh-tiwari-072609284/",
        github: "https://github.com/ArshTiwari2004",
        twitter: "https://x.com/ArshTiwari17",
        instagram: "https://www.instagram.com/_.arshtiwari",
        bot : "https://arsh-tiwari-portfolio.vercel.app/"
      }
    },
    {
      name: "Priyanshi Bothra",
      role: "UI/UX Designer & Frontend Developer",
      image: "/priyanshi.jpeg",
      links: {
        linkedin: "https://www.linkedin.com/in/priyanshi-bothra-339568219/",
        github: "https://github.com/priyanshi0609",
        twitter: "https://x.com/PriyanshiB06",
        instagram: "https://www.instagram.com/_.priyanshi.01__",
        bot :""
      }
    },
    {
      name: "Nibedan Pati",
      role: "Full Stack Developer",
      image: "/nibedan1.jpeg",
      links: {
        linkedin: "https://www.linkedin.com/in/nibedan-pati-2139b3277/",
        github: "https://github.com/Heisenberg300604",
        twitter: "https://x.com/NibedanPati",
        instagram: "https://www.instagram.com/nibedan_3006",
        bot: ""
      }
    }
    
  ];

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" id = "team">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Meet the Minds Behind
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"> Recap</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            A passionate team of developers committed to transforming the way students learn and organize their knowledge.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {team.map((member, index) => (
            <div 
              key={index}
              className="group relative"
            >
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
                {/* Profile Image */}
                <div className="relative mb-6">
                  <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-purple-500/30 group-hover:border-purple-500/60 transition-all duration-300">
                  <div className="w-full h-full overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />

                  </div>
                </div>
                </div>

                {/* Member Info */}
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                  <p className="text-purple-400 mb-4">{member.role}</p>
                  
                  {/* Social Links */}
                  <div className="flex justify-center space-x-4">
                    <a 
                      href={member.links.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a 
                      href={member.links.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a 
                      href={member.links.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a 
                      href={member.links.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a 
                      href={member.links.bot} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                        <Bot className="w-5 h-5" />
                    </a>

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamSection;