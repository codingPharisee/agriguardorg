import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useTextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const speak = useCallback(async (text: string) => {
    if (!text) return;

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text }
      });

      setIsGenerating(false);

      if (error) {
        console.error('Text-to-speech error:', error);
        toast({
          title: "Speech Error",
          description: "Could not generate audio. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (data?.audioContent) {
        // Convert base64 to blob and play
        const audioBlob = new Blob([
          Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))
        ], { type: 'audio/mpeg' });
        
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = '';
        }
        
        audioRef.current = new Audio(audioUrl);
        audioRef.current.onplay = () => setIsPlaying(true);
        audioRef.current.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        };
        audioRef.current.onerror = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
          toast({
            title: "Playback Error",
            description: "Could not play audio.",
            variant: "destructive",
          });
        };
        
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Error generating speech:', error);
      setIsGenerating(false);
      toast({
        title: "Generation Error",
        description: "Could not generate speech.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  return {
    speak,
    stop,
    isPlaying,
    isGenerating,
  };
};