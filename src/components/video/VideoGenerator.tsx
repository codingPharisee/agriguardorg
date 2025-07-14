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

const GMO_TOPICS = [
  { value: 'safety', label: 'GMO Safety', description: 'Scientific evidence on GMO food safety' },
  { value: 'environment', label: 'Environmental Impact', description: 'How GMOs affect the environment' },
  { value: 'nutrition', label: 'Nutritional Benefits', description: 'Enhanced nutrition through genetic modification' },
  { value: 'sustainability', label: 'Sustainable Agriculture', description: 'GMOs and sustainable farming practices' },
  { value: 'economy', label: 'Economic Impact', description: 'Economic benefits and challenges of GMOs' },
  { value: 'regulation', label: 'Regulation & Testing', description: 'How GMOs are regulated and tested' },
  { value: 'myths', label: 'Common Myths', description: 'Debunking GMO misconceptions' },
  { value: 'crops', label: 'GMO Crops', description: 'Types and benefits of GMO crops' }
];

const AVATARS = [
  { id: 'M000045058', name: 'Dr. Sarah (Scientist)', description: 'Professional female scientist' },
  { id: 'M000045059', name: 'Prof. Michael (Academic)', description: 'Male professor/educator' },
  { id: 'M000045060', name: 'Dr. Lisa (Researcher)', description: 'Young female researcher' }
];

const VideoGenerator: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    topic: '',
    customTopic: '',
    script: '',
    avatar: 'M000045058',
    format: 'medium'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedScript, setEnhancedScript] = useState('');
  const [factCheck, setFactCheck] = useState<any>(null);
  const [generatedVideoId, setGeneratedVideoId] = useState<string | null>(null);
  
  const { toast } = useToast();

  const handleTopicChange = (value: string) => {
    setFormData(prev => ({ ...prev, topic: value, customTopic: '' }));
  };

  const enhanceScript = async () => {
    if (!formData.topic && !formData.customTopic) {
      toast({
        title: "Topic Required",
        description: "Please select or enter a topic first.",
        variant: "destructive"
      });
      return;
    }

    setIsEnhancing(true);
    try {
      const { data, error } = await supabase.functions.invoke('script-enhance', {
        body: {
          topic: formData.topic || formData.customTopic,
          userScript: formData.script,
          category: 'GMO Education',
          format: formData.format
        }
      });

      if (error) throw error;

      setEnhancedScript(data.script);
      setFactCheck(data.factCheck);
      setFormData(prev => ({ ...prev, script: data.script }));
      
      toast({
        title: "Script Enhanced",
        description: "Your script has been enhanced with AI and fact-checked.",
      });
    } catch (error) {
      console.error('Error enhancing script:', error);
      toast({
        title: "Enhancement Failed",
        description: "Failed to enhance the script. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const generateVideo = async () => {
    if (!formData.title || !formData.script) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and script.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('video-generate', {
        body: {
          title: formData.title,
          prompt: formData.topic || formData.customTopic,
          script: formData.script,
          category: 'GMO Education',
          avatar_id: formData.avatar
        }
      });

      if (error) throw error;

      setGeneratedVideoId(data.video_id);
      toast({
        title: "Video Generation Started",
        description: "Your video is being generated. This may take a few minutes.",
      });
    } catch (error) {
      console.error('Error generating video:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to start video generation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      topic: '',
      customTopic: '',
      script: '',
      avatar: 'M000045058',
      format: 'medium'
    });
    setEnhancedScript('');
    setFactCheck(null);
    setGeneratedVideoId(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary">GMO Education Video Generator</h1>
        <p className="text-muted-foreground">
          Create professional educational videos about GMO topics using AI
        </p>
      </div>

      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generator">
            <Video className="h-4 w-4 mr-2" />
            Video Generator
          </TabsTrigger>
          <TabsTrigger value="library">
            <FileText className="h-4 w-4 mr-2" />
            Video Library
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Video Configuration
              </CardTitle>
              <CardDescription>
                Configure your GMO educational video settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Video Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Understanding GMO Safety"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="format">Video Format</Label>
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

              <div className="space-y-2">
                <Label>GMO Topic</Label>
                <Select value={formData.topic} onValueChange={handleTopicChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a GMO topic..." />
                  </SelectTrigger>
                  <SelectContent>
                    {GMO_TOPICS.map(topic => (
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

              {!formData.topic && (
                <div className="space-y-2">
                  <Label htmlFor="customTopic">Custom Topic</Label>
                  <Input
                    id="customTopic"
                    placeholder="Enter your own GMO topic..."
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Script Generation
              </CardTitle>
              <CardDescription>
                Write your script or let AI enhance it with scientific accuracy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="script">Video Script</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={enhanceScript}
                    disabled={isEnhancing || (!formData.topic && !formData.customTopic)}
                  >
                    {isEnhancing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    {formData.script ? 'Enhance Script' : 'Generate Script'}
                  </Button>
                </div>
                <Textarea
                  id="script"
                  placeholder="Enter your script here or click 'Generate Script' to create one automatically..."
                  value={formData.script}
                  onChange={(e) => setFormData(prev => ({ ...prev, script: e.target.value }))}
                  rows={8}
                />
              </div>

              {factCheck && (
                <Alert className={factCheck.isAccurate ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}>
                  <div className="flex items-start gap-2">
                    {factCheck.isAccurate ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                    )}
                    <div className="space-y-2">
                      <AlertDescription className="font-medium">
                        Fact-Check Results (Confidence: {Math.round(factCheck.confidence * 100)}%)
                      </AlertDescription>
                      {factCheck.concerns?.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-amber-700">Concerns:</p>
                          <ul className="text-sm text-amber-600 list-disc list-inside">
                            {factCheck.concerns.map((concern: string, index: number) => (
                              <li key={index}>{concern}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {factCheck.suggestions?.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-blue-700">Suggestions:</p>
                          <ul className="text-sm text-blue-600 list-disc list-inside">
                            {factCheck.suggestions.map((suggestion: string, index: number) => (
                              <li key={index}>{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Generate Video
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button
                  onClick={generateVideo}
                  disabled={isGenerating || !formData.title || !formData.script}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Video className="h-4 w-4 mr-2" />
                  )}
                  Generate Video
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Reset
                </Button>
              </div>

              {generatedVideoId && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Video generation started! Video ID: {generatedVideoId}
                    <br />
                    Check the Video Library tab to monitor progress.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library">
          <Card>
            <CardHeader>
              <CardTitle>Video Library</CardTitle>
              <CardDescription>
                View and manage your generated GMO education videos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Video library component will be implemented here to show generated videos.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VideoGenerator;