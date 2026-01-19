
      
'use server';
/**
 * @fileOverview An AI flow to generate React UI components from a text prompt.
 *
 * - generateUiComponent - A function that creates component code based on a description.
 * - GenerateUiComponentInput - The input type for the flow.
 * - GenerateUiComponentOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateUiComponentInputSchema = z.object({
  prompt: z.string().describe('A text description of the UI component to be generated.'),
});
export type GenerateUiComponentInput = z.infer<typeof GenerateUiComponentInputSchema>;

const GenerateUiComponentOutputSchema = z.object({
  componentCode: z.string().describe('The generated TSX code for the React component.'),
});
export type GenerateUiComponentOutput = z.infer<typeof GenerateUiComponentOutputSchema>;

export async function generateUiComponent(input: GenerateUiComponentInput): Promise<GenerateUiComponentOutput> {
  return generateUiComponentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateUiComponentPrompt',
  input: { schema: GenerateUiComponentInputSchema },
  output: { schema: GenerateUiComponentOutputSchema },
  prompt: `You are an expert React developer specializing in Next.js.
  
  Your task is to generate the TSX code for a single React component based on the user's prompt.

  Guidelines:
  1.  Use exclusively ShadCN UI components (e.g., <Button>, <Card>, <Input>) where appropriate.
  2.  Use Tailwind CSS for all styling.
  3.  The generated code should be a single, complete, functional React component.
  4.  Do NOT include any 'import' statements. Assume all necessary components are already imported.
  5.  Do NOT include any explanations, comments, or surrounding text.
  6.  The output must be ONLY the TSX code for the component, enclosed in a function or const declaration.

  User's Prompt: "{{{prompt}}}"
  
  Generate the component code now.`,
});

const generateUiComponentFlow = ai.defineFlow(
  {
    name: 'generateUiComponentFlow',
    inputSchema: GenerateUiComponentInputSchema,
    outputSchema: GenerateUiComponentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

    