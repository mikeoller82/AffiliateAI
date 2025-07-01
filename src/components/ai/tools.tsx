
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2, Wand2, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAIKey } from '@/contexts/ai-key-context';

type GenerateAdCopyOutput = { headlines: string[]; primary_text: string; descriptions: string[]; };
type SuggestCTAsOutput = string[];
type GenerateProductReviewOutput = { review: string };
type GenerateProductHookOutput = { hooks: string[] };
type GenerateEmailContentOutput = { subject: string; body: string };
type GenerateImageOutput = { imageDataUri: string };

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

const adCopyFormSchema = z.object({
  product: z.string().min(3, 'Product name is required.'),
  audience: z.string().min(3, 'Target audience is required.'),
  platform: z.string().min(1, 'Platform is required.'),
});

export function AdCopyGenerator() {
  const [result, setResult] = useState<GenerateAdCopyOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { apiKey, promptApiKey } = useAIKey();

  const form = useForm<z.infer<typeof adCopyFormSchema>>({
    resolver: zodResolver(adCopyFormSchema),
    defaultValues: { product: "", audience: "", platform: "Facebook" },
  });

  async function onSubmit(values: z.infer<typeof adCopyFormSchema>) {
    if (!apiKey) {
      promptApiKey();
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const response = await fetch('/api/ai/generate-ad-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, apiKey }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ details: response.statusText }));
        throw new Error(errorData.details || `Server error: ${response.status}`);
      }
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to generate ad copy.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="product" render={({ field }) => (
            <FormItem>
              <FormLabel>Product / Offer Description</FormLabel>
              <FormControl><Input placeholder="e.g., SaaS for project management" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="audience" render={({ field }) => (
            <FormItem>
              <FormLabel>Target Audience</FormLabel>
              <FormControl><Input placeholder="e.g., Small business owners" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="platform" render={({ field }) => (
            <FormItem>
              <FormLabel>Platform</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select a platform" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                  <SelectItem value="X">X (Twitter)</SelectItem>
                  <SelectItem value="Pinterest">Pinterest</SelectItem>
                  <SelectItem value="Google Ads">Google Ads</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="submit" disabled={isLoading}>
            <Wand2 className="mr-2 h-4 w-4" />
            {isLoading ? "Generating..." : "Generate Copy"}
          </Button>
        </form>
      </Form>
      {isLoading && <LoadingSpinner />}
      {result && (
        <Card className="mt-6 bg-muted/30">
          <CardHeader><h3 className="text-xl font-semibold">Generated Ad Copy</h3></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-lg mb-2">Headlines</h4>
              <ul className="list-disc list-inside space-y-1">
                {result.headlines.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">Primary Text</h4>
              <p className="whitespace-pre-wrap">{result.primary_text}</p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">Descriptions</h4>
              <ul className="list-disc list-inside space-y-1">
                {result.descriptions.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

const ctaFormSchema = z.object({
  context: z.string().min(10, 'Context must be at least 10 characters.'),
});

export function CtaSuggestor() {
  const [result, setResult] = useState<SuggestCTAsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { apiKey, promptApiKey } = useAIKey();

  const form = useForm<z.infer<typeof ctaFormSchema>>({
    resolver: zodResolver(ctaFormSchema),
    defaultValues: { context: "" },
  });

  async function onSubmit(values: z.infer<typeof ctaFormSchema>) {
    if (!apiKey) {
      promptApiKey();
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const response = await fetch('/api/ai/suggest-ctas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, apiKey }),
      });
       if (!response.ok) {
         const errorData = await response.json().catch(() => ({ details: response.statusText }));
        throw new Error(errorData.details || `Server error: ${response.status}`);
       }
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to suggest CTAs.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="context" render={({ field }) => (
            <FormItem>
              <FormLabel>Context / Intent</FormLabel>
              <FormControl><Textarea placeholder="Describe where the Call-To-Action will be used and what the goal is, e.g., 'Landing page for a free webinar on real estate investing'." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="submit" disabled={isLoading}>
            <Wand2 className="mr-2 h-4 w-4" />
            {isLoading ? "Generating..." : "Suggest CTAs"}
          </Button>
        </form>
      </Form>
      {isLoading && <LoadingSpinner />}
      {result && (
        <Card className="mt-6 bg-muted/30">
          <CardHeader><h3 className="text-xl font-semibold">Suggested CTAs</h3></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.map((cta, i) => (
                <Button key={i} variant="outline" className="bg-background cursor-text">{cta}</Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

const productReviewSchema = z.object({
  productName: z.string().min(3, "Product name is required."),
  features: z.string().min(10, "Please describe some features or benefits."),
});

export function ProductReviewWriter() {
  const [result, setResult] = useState<GenerateProductReviewOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { apiKey, promptApiKey } = useAIKey();

  const form = useForm<z.infer<typeof productReviewSchema>>({
    resolver: zodResolver(productReviewSchema),
    defaultValues: { productName: "", features: "" },
  });

  async function onSubmit(values: z.infer<typeof productReviewSchema>) {
    if (!apiKey) {
      promptApiKey();
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
       const response = await fetch('/api/ai/generate-product-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, apiKey }),
      });
      if (!response.ok) {
         const errorData = await response.json().catch(() => ({ details: response.statusText }));
        throw new Error(errorData.details || `Server error: ${response.status}`);
      }
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to generate product review.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="productName" render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl><Input placeholder="e.g., The Amazing Widget Pro" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
           <FormField control={form.control} name="features" render={({ field }) => (
            <FormItem>
              <FormLabel>Key Features / Talking Points</FormLabel>
              <FormControl><Textarea placeholder="List the key features, benefits, and selling points of the product." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="submit" disabled={isLoading}>
            <Wand2 className="mr-2 h-4 w-4" />
            {isLoading ? "Generating..." : "Generate Review"}
          </Button>
        </form>
      </Form>
      {isLoading && <LoadingSpinner />}
      {result && (
        <Card className="mt-6 bg-muted/30">
          <CardHeader><h3 className="text-xl font-semibold">Generated Product Review (Markdown)</h3></CardHeader>
          <CardContent>
            <Textarea className="min-h-[400px] whitespace-pre-wrap" value={result.review} readOnly />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

const productHookSchema = z.object({
  productDescription: z.string().min(10, 'Product description is required.'),
  emotion: z.string().min(1, 'Emotion is required.'),
});

export function ProductHookGenerator() {
  const [result, setResult] = useState<GenerateProductHookOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { apiKey, promptApiKey } = useAIKey();

  const form = useForm<z.infer<typeof productHookSchema>>({
    resolver: zodResolver(productHookSchema),
    defaultValues: { productDescription: "", emotion: "Curiosity" },
  });

  async function onSubmit(values: z.infer<typeof productHookSchema>) {
    if (!apiKey) {
      promptApiKey();
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
       const response = await fetch('/api/ai/generate-product-hook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, apiKey }),
      });
      if (!response.ok) {
         const errorData = await response.json().catch(() => ({ details: response.statusText }));
        throw new Error(errorData.details || `Server error: ${response.status}`);
      }
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to generate product hooks.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
           <FormField control={form.control} name="productDescription" render={({ field }) => (
            <FormItem>
              <FormLabel>Product / Offer Description</FormLabel>
              <FormControl><Textarea placeholder="Briefly describe your product or offer." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
           <FormField control={form.control} name="emotion" render={({ field }) => (
            <FormItem>
              <FormLabel>Target Emotion</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select an emotion" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Curiosity">Curiosity</SelectItem>
                  <SelectItem value="Urgency">Urgency</SelectItem>
                  <SelectItem value="Transformation">Transformation</SelectItem>
                  <SelectItem value="Pain Point">Pain Point</SelectItem>
                   <SelectItem value="Contrarian">Contrarian</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="submit" disabled={isLoading}>
            <Wand2 className="mr-2 h-4 w-4" />
            {isLoading ? "Generating..." : "Generate Hooks"}
          </Button>
        </form>
      </Form>
      {isLoading && <LoadingSpinner />}
      {result && (
        <Card className="mt-6 bg-muted/30">
          <CardHeader><h3 className="text-xl font-semibold">Generated Hooks</h3></CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {result.hooks.map((hook, i) => <li key={i}>{hook}</li>)}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

const emailFormSchema = z.object({
  goal: z.string().min(10, 'Objective must be at least 10 characters.'),
  tone: z.string().min(1, 'Tone is required.'),
  product: z.string().min(10, 'Product details must be at least 10 characters.'),
  audience: z.string().min(3, 'Target audience is required.'),
});

interface EmailGeneratorProps {
  defaultValues?: Partial<z.infer<typeof emailFormSchema>>;
}

export function EmailGenerator({ defaultValues }: EmailGeneratorProps) {
  const [result, setResult] = useState<GenerateEmailContentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { apiKey, promptApiKey } = useAIKey();

  const form = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { goal: "", tone: "Professional", product: "", audience: "", ...defaultValues },
  });

  async function onSubmit(values: z.infer<typeof emailFormSchema>) {
    if (!apiKey) {
      promptApiKey();
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const response = await fetch('/api/ai/generate-email-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, apiKey }),
      });
      if (!response.ok) {
         const errorData = await response.json().catch(() => ({ details: response.statusText }));
        throw new Error(errorData.details || `Server error: ${response.status}`);
      }
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to generate email content.",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Email content copied to clipboard.",
    });
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="goal" render={({ field }) => (
            <FormItem>
              <FormLabel>Email Objective</FormLabel>
              <FormControl><Input placeholder="e.g., Promote new summer collection" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="audience" render={({ field }) => (
            <FormItem>
              <FormLabel>Target Audience</FormLabel>
              <FormControl><Input placeholder="e.g., Existing customers" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
           <FormField control={form.control} name="product" render={({ field }) => (
            <FormItem>
              <FormLabel>Product / Offer Details</FormLabel>
              <FormControl><Textarea placeholder="Describe the product, offer, or message you want to convey." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="tone" render={({ field }) => (
            <FormItem>
              <FormLabel>Tone of Voice</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select a tone" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Enthusiastic">Enthusiastic</SelectItem>
                  <SelectItem value="Witty">Witty</SelectItem>
                  <SelectItem value="Persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="submit" disabled={isLoading}>
            <Wand2 className="mr-2 h-4 w-4" />
            {isLoading ? "Generating..." : "Generate Email"}
          </Button>
        </form>
      </Form>
      {isLoading && <LoadingSpinner />}
      {result && (
        <Card className="mt-6 bg-muted/30">
          <CardHeader>
            <h3 className="text-xl font-semibold">Generated Email Content</h3>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center gap-2 p-2 rounded-md bg-background border">
                <p className="flex-1 font-semibold">{result.subject}</p>
                <Button variant="ghost" size="icon" onClick={() => handleCopy(result.subject)}>
                  <Copy className="h-4 w-4"/>
                </Button>
              </div>
            </div>
            
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-lg">Email Body</h4>
                    <Button variant="outline" size="sm" onClick={() => handleCopy(result.body)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Body
                    </Button>
                </div>
                 <div className="p-4 rounded-md bg-background border" dangerouslySetInnerHTML={{ __html: result.body }} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

const imageGeneratorSchema = z.object({
  prompt: z.string().min(10, 'A detailed prompt is required.'),
  style: z.string().optional(),
});

export function ImageGenerator() {
  const [result, setResult] = useState<GenerateImageOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { apiKey, promptApiKey } = useAIKey();

  const form = useForm<z.infer<typeof imageGeneratorSchema>>({
    resolver: zodResolver(imageGeneratorSchema),
    defaultValues: { prompt: "", style: "photorealistic" },
  });

  async function onSubmit(values: z.infer<typeof imageGeneratorSchema>) {
    if (!apiKey) {
      promptApiKey();
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, apiKey }),
      });
       if (!response.ok) {
         const errorData = await response.json().catch(() => ({ details: response.statusText }));
         throw new Error(errorData.details || `Server error: ${response.status}`);
       }
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.message || "An unknown error occurred.";
      toast({
        variant: "destructive",
        title: "Error Generating Image",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
           <FormField control={form.control} name="prompt" render={({ field }) => (
            <FormItem>
              <FormLabel>Image Prompt</FormLabel>
              <FormControl><Textarea placeholder="e.g., A photorealistic image of an astronaut riding a horse on Mars" {...field} className="min-h-[100px]" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
           <FormField control={form.control} name="style" render={({ field }) => (
            <FormItem>
              <FormLabel>Image Style</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select an image style" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="photorealistic">Photorealistic</SelectItem>
                  <SelectItem value="digital-art">Digital Art</SelectItem>
                  <SelectItem value="anime">Anime</SelectItem>
                  <SelectItem value="low-poly">Low Poly</SelectItem>
                  <SelectItem value="pixel-art">Pixel Art</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="submit" disabled={isLoading}>
            <Wand2 className="mr-2 h-4 w-4" />
            {isLoading ? "Generating..." : "Generate Image"}
          </Button>
        </form>
      </Form>
      
      {isLoading && <LoadingSpinner />}
      
      {result && (
        <Card className="mt-6 bg-muted/30">
          <CardHeader>
            <h3 className="text-xl font-semibold">Generated Image</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-video w-full max-w-lg mx-auto rounded-lg overflow-hidden border">
                <Image src={result.imageDataUri} alt={form.getValues('prompt')} fill className="object-contain"/>
            </div>
            <div className="flex justify-center">
              <Button asChild>
                <a href={result.imageDataUri} download={`${form.getValues('prompt').substring(0, 20)}.png`}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Image
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
