
import { Button } from "@/components/ui/button";
import { Lightbulb, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center px-4">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            World's First AI
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Video Generator
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Transform your ideas into stunning videos with AI. Start by generating 
          an idea or bring your own script.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button 
            onClick={() => navigate('/ideas')}
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg rounded-lg transition-all duration-200 transform hover:scale-105 min-w-[200px]"
          >
            <Lightbulb className="mr-2 h-5 w-5" />
            Generate Ideas
          </Button>
          
          <Button 
            onClick={() => navigate('/video')}
            size="lg"
            className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 text-lg rounded-lg transition-all duration-200 transform hover:scale-105 min-w-[250px]"
          >
            <Video className="mr-2 h-5 w-5" />
            Already Have a Script? Create Video
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
