
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FileText, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ScriptVersion {
  label: string;
  content: string;
}

interface ScriptResponse {
  title: string;
  scripts: ScriptVersion[];
}

const Script = () => {
  const [topic, setTopic] = useState("");
  const [scriptData, setScriptData] = useState<ScriptResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Pre-fill with selected idea from /ideas page
    const selectedIdea = sessionStorage.getItem('selectedIdea');
    if (selectedIdea) {
      setTopic(selectedIdea);
      sessionStorage.removeItem('selectedIdea'); // Clean up
    }
  }, []);

  const generateScript = async () => {
    if (!topic.trim()) {
      toast({
        title: "Error",
        description: "Please provide a topic or idea first.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    console.log("Generating script for topic:", topic);
    
    try {
      const response = await fetch('https://ravanai.app.n8n.cloud/webhook-test/837c4cfe-e8c9-4243-9e02-2d2872b87417', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic: topic
        })
      });

      const data = await response.json();
      console.log("Webhook response:", data);
      
      setScriptData(data.output);
      
    } catch (error) {
      console.error("Error generating script:", error);
      toast({
        title: "Error",
        description: "Failed to generate script. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectScript = (scriptContent: string) => {
    console.log("Selected script:", scriptContent);
    // Store selected script and navigate to video page
    sessionStorage.setItem('selectedScript', scriptContent);
    navigate('/video');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
            AI Script Generator
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Generate professional scripts for your video content
          </p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Label htmlFor="topic" className="text-white text-lg">
                Provide a topic or idea to generate a script
              </Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter your video topic or idea..."
                className="bg-white/20 border-white/30 text-white placeholder:text-gray-400 text-lg py-3"
              />
              <Button 
                onClick={generateScript}
                disabled={isLoading}
                size="lg"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Script...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-5 w-5" />
                    Generate Script
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {scriptData && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              {scriptData.title}
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              {scriptData.scripts.map((script, index) => (
                <Card 
                  key={index}
                  className="bg-white/10 backdrop-blur-sm border-white/20"
                >
                  <CardHeader>
                    <CardTitle className="text-white text-xl">
                      {script.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-gray-300 whitespace-pre-wrap">
                        {script.content}
                      </p>
                    </div>
                    <Button 
                      onClick={() => selectScript(script.content)}
                      className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                    >
                      Use this script to generate video
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Script;
