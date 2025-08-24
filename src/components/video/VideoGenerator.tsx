import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video, Sparkles, FileText, Play, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AGRICULTURE_TOPICS = [
  { value: 'safety', label: 'Agricultural Safety', description: 'Scientific evidence on agricultural technology safety' },
  { value: 'environment', label: 'Environmental Impact', description: 'How agricultural technologies affect the environment' },
  { value: 'nutrition', label: 'Nutritional Benefits', description: 'Enhanced nutrition through agricultural technology' },
  { value: 'sustainability', label: 'Sustainable Agriculture', description: 'Agricultural technologies and sustainable farming practices' },
  { value: 'economy', label: 'Economic Impact', description: 'Economic benefits and challenges of agricultural technologies' },
  { value: 'regulation', label: 'Regulation & Testing', description: 'How agricultural technologies are regulated and tested' },
  { value: 'myths', label: 'Common Myths', description: 'Debunking agricultural technology misconceptions' },
  { value: 'crops', label: 'Modern Crops', description: 'Types and benefits of modern crop varieties' }
];

const AVATARS = [
  { id: 'M000045058', name: 'Dr. Sarah (Scientist)', description: 'Professional female scientist' },
  { id: 'M000045059', name: 'Prof. Michael (Academic)', description: 'Male professor/educator' },
  { id: 'M000045060', name: 'Dr. Lisa (Researcher)', description: 'Young female researcher' }
];

const VideoGenerator: React.FC = () => {
  const [formData, setFormData] = useState({
    topic: '',
    customTopic: '',
    avatar: 'M000045058',
    format: 'medium'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideoId, setGeneratedVideoId] = useState<string | null>(null);
  
  const { toast } = useToast();

  const handleTopicChange = (value: string) => {
    setFormData(prev => ({ ...prev, topic: value, customTopic: '' }));
  };

  const generateVideoAutomatically = async () => {
    const topic = formData.topic || formData.customTopic;
    if (!topic) {
      toast({
        title: "Topic Required",
        description: "Please select or enter a topic first.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      console.log('Starting video generation for topic:', topic);
      
      // First, enhance the script automatically
      const scriptResponse = await supabase.functions.invoke('script-enhance', {
        body: {
          topic: topic,
          userScript: '',
          category: 'Agricultural Education',
          format: formData.format
        }
      });

      console.log('Script response:', scriptResponse);

      if (scriptResponse.error) {
        console.error('Script generation error:', scriptResponse.error);
        throw new Error(`Script generation failed: ${scriptResponse.error.message || 'Unknown error'}`);
      }

      if (!scriptResponse.data?.script) {
        throw new Error('No script generated from the AI service');
      }

      const generatedScript = scriptResponse.data.script;
      const topicLabel = AGRICULTURE_TOPICS.find(t => t.value === formData.topic)?.label || topic;
      const autoTitle = `Understanding ${topicLabel}`;

      console.log('Generated script length:', generatedScript.length);

      // Then generate the video
      const videoResponse = await supabase.functions.invoke('video-generate', {
        body: {
          title: autoTitle,
          prompt: topic,
          script: generatedScript,
          category: 'Agricultural Education',
          avatar_id: formData.avatar
        }
      });

      console.log('Video response:', videoResponse);

      if (videoResponse.error) {
        console.error('Video generation error:', videoResponse.error);
        throw new Error(`Video generation failed: ${videoResponse.error.message || 'Unknown error'}`);
      }

      if (!videoResponse.data?.video_id) {
        throw new Error('No video ID returned from the video service');
      }

      setGeneratedVideoId(videoResponse.data.video_id);
      toast({
        title: "Video Generation Started",
        description: "Your agricultural educational video is being generated automatically!",
      });
    } catch (error) {
      console.error('Error generating video:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      topic: '',
      customTopic: '',
      avatar: 'M000045058',
      format: 'medium'
    });
    setGeneratedVideoId(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-in">
      <div className="text-center space-y-2 fade-in-section visible">
        <h1 className="text-3xl font-bold text-primary">Agricultural Technology Educator</h1>
        <p className="text-muted-foreground">
          Simply enter an agricultural topic and AI will automatically generate an educational video
        </p>
      </div>

      <Card className="fade-in-section visible">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Automatic Video Generation
          </CardTitle>
          <CardDescription>
            Enter a topic and we'll create a professional educational video automatically
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Agricultural Topic</Label>
              <Select value={formData.topic} onValueChange={handleTopicChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an agricultural topic..." />
                </SelectTrigger>
                <SelectContent>
                  {AGRICULTURE_TOPICS.map(topic => (
                    <SelectItem key={topic.value} value={topic.value}>
                      <div>
                        <div className="font-medium">{topic.label}</div>
                        <div className="text-sm text-muted-foreground">{topic.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="format">Video Length</Label>
              <Select value={formData.format} onValueChange={(value) => setFormData(prev => ({ ...prev, format: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short (30-60s)</SelectItem>
                  <SelectItem value="medium">Medium (2-3 min)</SelectItem>
                  <SelectItem value="long">Long (4-5 min)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!formData.topic && (
            <div className="space-y-2">
              <Label htmlFor="customTopic">Or Enter Your Own Topic</Label>
              <Input
                id="customTopic"
                placeholder="e.g., Are modern crop technologies safe?"
                value={formData.customTopic}
                onChange={(e) => setFormData(prev => ({ ...prev, customTopic: e.target.value }))}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Avatar Presenter</Label>
            <Select value={formData.avatar} onValueChange={(value) => setFormData(prev => ({ ...prev, avatar: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AVATARS.map(avatar => (
                  <SelectItem key={avatar.id} value={avatar.id}>
                    <div>
                      <div className="font-medium">{avatar.name}</div>
                      <div className="text-sm text-muted-foreground">{avatar.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={generateVideoAutomatically}
              disabled={isGenerating || (!formData.topic && !formData.customTopic)}
              className="flex-1 bg-primary hover:bg-primary/90"
              size="lg"
            >
              {isGenerating ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-5 w-5 mr-2" />
              )}
              Generate Video Automatically
            </Button>
            <Button variant="outline" onClick={resetForm} size="lg">
              Reset
            </Button>
          </div>

          {generatedVideoId && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <span className="font-medium">Video generation started!</span>
                <br />
                Your educational video about agricultural technology is being created automatically. This may take 2-3 minutes.
                <br />
                Video ID: {generatedVideoId}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoGenerator;