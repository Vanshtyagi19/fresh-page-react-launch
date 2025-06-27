
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Video, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VideoGenerator = () => {
  const [script, setScript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Pre-fill with selected script from /script page
    const selectedScript = sessionStorage.getItem('selectedScript');
    if (selectedScript) {
      setScript(selectedScript);
      sessionStorage.removeItem('selectedScript'); // Clean up
    }
  }, []);

  const generateVideo = async () => {
    if (!script.trim()) {
      toast({
        title: "Error",
        description: "Please provide a script for video generation.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setResult("");
    setIsSuccess(false);
    console.log("Generating video for script:", script);
    
    try {
      const response = await fetch('https://ravanai.app.n8n.cloud/webhook-test/837c4cfe-e8c9-4243-9e02-2d2872b87417', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic: script
        })
      });

      const data = await response.json();
      console.log("Webhook response:", data);
      
      setResult(data.output);
      setIsSuccess(true);
      
      toast({
        title: "Success!",
        description: "Video generation request submitted successfully.",
      });
      
    } catch (error) {
      console.error("Error generating video:", error);
      toast({
        title: "Error",
        description: "Failed to generate video. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
            AI Video Generator
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Transform your script into stunning AI-generated videos
          </p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Label htmlFor="script" className="text-white text-lg">
                Provide script for video generation
              </Label>
              <Textarea
                id="script"
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Enter your video script here..."
                className="bg-white/20 border-white/30 text-white placeholder:text-gray-400 text-lg min-h-[200px]"
                rows={10}
              />
              <Button 
                onClick={generateVideo}
                disabled={isLoading}
                size="lg"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Video...
                  </>
                ) : (
                  <>
                    <Video className="mr-2 h-5 w-5" />
                    Generate Video
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                {isSuccess && (
                  <div className="animate-bounce">
                    <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-4">
                  Video Generation Status
                </h3>
                <div className="bg-white/5 p-6 rounded-lg">
                  <p className="text-gray-300 text-lg whitespace-pre-wrap">
                    {result}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VideoGenerator;
