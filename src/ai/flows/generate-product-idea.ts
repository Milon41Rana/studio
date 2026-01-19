'use server';
/**
 * @fileOverview An AI flow to generate new product ideas for an e-commerce store.
 *
 * - generateProductIdea - A function that suggests a product name and description based on a category.
 * - GenerateProductIdeaInput - The input type for the flow.
 * - GenerateProductIdeaOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateProductIdeaInputSchema = z.object({
  category: z.string().describe('The product category for which to generate an idea.'),
});
export type GenerateProductIdeaInput = z.infer<typeof GenerateProductIdeaInputSchema>;

const GenerateProductIdeaOutputSchema = z.object({
  productName: z.string().describe('A creative and catchy name for a new product.'),
  productDescription: z.string().describe('A compelling and detailed description for the new product.'),
});
export type GenerateProductIdeaOutput = z.infer<typeof GenerateProductIdeaOutputSchema>;


export async function generateProductIdea(input: GenerateProductIdeaInput): Promise<GenerateProductIdeaOutput> {
  return generateProductIdeaFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateProductIdeaPrompt',
  input: { schema: GenerateProductIdeaInputSchema },
  output: { schema: GenerateProductIdeaOutputSchema },
  prompt: `You are an expert product manager for a modern e-commerce store called 'Super Shop'. 
  
  Your task is to come up with a single, innovative, and appealing product idea for the given category: {{{category}}}.
  
  Generate a creative product name and a compelling product description that highlights its key features and benefits for the customer.
  The tone should be enthusiastic and professional. The target market is in Bangladesh.
  
  Return only the product name and description in the specified JSON format.`,
});


const generateProductIdeaFlow = ai.defineFlow(
  {
    name: 'generateProductIdeaFlow',
    inputSchema: GenerateProductIdeaInputSchema,
    outputSchema: GenerateProductIdeaOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
