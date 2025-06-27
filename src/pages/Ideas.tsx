
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Ideas = () => {
  const [ideas, setIdeas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const generateIdeas = async () => {
    setIsLoading(true);
    console.log("Generating ideas...");
    
    try {
      const response = await fetch('https://ravanai.app.n8n.cloud/webhook-test/837c4cfe-e8c9-4243-9e02-2d2872b87417', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic: "Generating ideas"
        })
      });

      const data = await response.json();
      console.log("Webhook response:", data);
      
      // Parse ideas using regex /topic:\s*(.+)/g
      const ideaRegex = /topic:\s*(.+)/g;
      const parsedIdeas: string[] = [];
      let match;
      
      while ((match = ideaRegex.exec(data.output)) !== null) {
        parsedIdeas.push(match[1].trim());
      }
      
      console.log("Parsed ideas:", parsedIdeas);
      setIdeas(parsedIdeas);
      
      if (parsedIdeas.length === 0) {
        toast({
          title: "No ideas found",
          description: "Please try again or check the response format.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error generating ideas:", error);
      toast({
        title: "Error",
        description: "Failed to generate ideas. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectIdea = (idea: string) => {
    console.log("Selected idea:", idea);
    // Store selected idea and navigate to script page
    sessionStorage.setItem('selectedIdea', idea);
    navigate('/script');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
            AI Idea Generator
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Generate creative ideas for your next video project
          </p>
          
          <Button 
            onClick={generateIdeas}
            disabled={isLoading}
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Ideas...
              </>
            ) : (
              <>
                <Lightbulb className="mr-2 h-5 w-5" />
                Generate Ideas
              </>
            )}
          </Button>
        </div>

        {ideas.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ideas.map((idea, index) => (
              <Card 
                key={index}
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-200 cursor-pointer transform hover:scale-105"
                onClick={() => selectIdea(idea)}
              >
                <CardContent className="p-6">
                  <p className="text-white text-center font-medium">
                    {idea}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Ideas;
