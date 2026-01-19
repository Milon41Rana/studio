'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateUiComponent, type GenerateUiComponentOutput } from '@/ai/flows/generate-ui-component';

export default function UiGeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        variant: 'destructive',
        title: 'Prompt is empty',
        description: 'Please describe the UI component you want to create.',
      });
      return;
    }

    startTransition(async () => {
      setGeneratedCode('');
      try {
        const result: GenerateUiComponentOutput = await generateUiComponent({ prompt });
        setGeneratedCode(result.componentCode);
      } catch (error) {
        console.error('UI Generation Error:', error);
        toast({
          variant: 'destructive',
          title: 'Generation Failed',
          description: 'Could not generate the UI component. Please try again.',
        });
      }
    });
  };
  
  const handleCopyToClipboard = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode).then(() => {
        toast({
            title: 'Copied to Clipboard!',
            description: 'The component code has been copied.'
        })
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        toast({
            variant: 'destructive',
            title: 'Copy Failed',
            description: 'Could not copy the code to the clipboard.',
        })
    })
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="text-primary" />
            AI UI Component Generator
          </CardTitle>
          <CardDescription>Describe the UI you want, and let AI generate the code using ShadCN and Tailwind CSS.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Textarea
              placeholder="e.g., A login form with email and password fields, and a submit button."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              disabled={isPending}
            />
          </div>
          <Button onClick={handleGenerate} disabled={isPending} className="w-full sm:w-auto">
            {isPending ? <Loader2 className="animate-spin" /> : 'Generate Component'}
          </Button>

          {(isPending || generatedCode) && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-lg">Generated Code</h3>
              <div className="relative">
                <Card className="bg-muted/50 p-4 font-mono text-sm overflow-x-auto">
                  <pre>
                    <code>
                        {isPending && !generatedCode ? 'Generating...' : generatedCode}
                    </code>
                  </pre>
                </Card>
                {generatedCode && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="absolute top-2 right-2"
                        onClick={handleCopyToClipboard}
                    >
                        Copy
                    </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
