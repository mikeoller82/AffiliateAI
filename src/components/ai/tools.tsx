
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wand2, Copy } from "lucide-react";
import { generateAdCopy, type GenerateAdCopyOutput } from '@/ai/flows/generate-ad-copy';
import { suggestCTAs, type SuggestCTAsOutput } from '@/ai/flows/suggest-ctas';
import { generateEmailContent, type GenerateEmailContentOutput } from '@/ai/flows/generate-email-content';
import { generateProductReview, type GenerateProductReviewOutput } from '@/ai/flows/generate-product-review';
import { generateProductHook, type GenerateProductHookOutput } from '@/ai/flows/generate-product-hook';
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

// Ad Copy Generator
const adCopyFormSchema = z.object({
  product: z.string().min(3, 'Product name is required.'),
  audience: z.string().min(3, 'Target audience is required.'),
  platform: z.string().min(1, 'Platform is required.'),
});

export function AdCopyGenerator() {
  const [result, setResult] = useState<GenerateAdCopyOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof adCopyFormSchema>>({
    resolver: zodResolver(adCopyFormSchema),
    defaultValues: { product: "", audience: "", platform: "Facebook" },
  });

  async function onSubmit(values: z.infer<typeof adCopyFormSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generateAdCopy(values);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate ad copy. Please try again.",
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
          <CardHeader><CardTitle>Generated Ad Copy</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Headlines</h3>
              <ul className="list-disc list-inside space-y-1">
                {result.headlines.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Primary Text</h3>
              <p className="whitespace-pre-wrap">{result.primary_text}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Descriptions</h3>
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

// CTA Suggestor
const ctaFormSchema = z.object({
  context: z.string().min(10, 'Context must be at least 10 characters.'),
});

export function CtaSuggestor() {
  const [result, setResult] = useState<SuggestCTAsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof ctaFormSchema>>({
    resolver: zodResolver(ctaFormSchema),
    defaultValues: { context: "" },
  });

  async function onSubmit(values: z.infer<typeof ctaFormSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await suggestCTAs(values);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to suggest CTAs. Please try again.",
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
          <CardHeader><CardTitle>Suggested CTAs</CardTitle></CardHeader>
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

// Product Review Writer
const productReviewSchema = z.object({
  productName: z.string().min(3, "Product name is required."),
  features: z.string().min(10, "Please describe some features or benefits."),
});

export function ProductReviewWriter() {
  const [result, setResult] = useState<GenerateProductReviewOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof productReviewSchema>>({
    resolver: zodResolver(productReviewSchema),
    defaultValues: { productName: "", features: "" },
  });

  async function onSubmit(values: z.infer<typeof productReviewSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generateProductReview(values);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate product review. Please try again.",
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
          <CardHeader><CardTitle>Generated Product Review (Markdown)</CardTitle></CardHeader>
          <CardContent>
            <Textarea className="min-h-[400px] whitespace-pre-wrap" value={result.review} readOnly />
          </CardContent>
        </Card>
      )}
    </div>
  );
}


// Product Hook Generator
const productHookSchema = z.object({
  productDescription: z.string().min(10, 'Product description is required.'),
  emotion: z.string().min(1, 'Emotion is required.'),
});

export function ProductHookGenerator() {
  const [result, setResult] = useState<GenerateProductHookOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof productHookSchema>>({
    resolver: zodResolver(productHookSchema),
    defaultValues: { productDescription: "", emotion: "Curiosity" },
  });

  async function onSubmit(values: z.infer<typeof productHookSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generateProductHook(values);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate product hooks. Please try again.",
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
          <CardHeader><CardTitle>Generated Hooks</CardTitle></CardHeader>
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

// Email Generator
const emailFormSchema = z.object({
  objective: z.string().min(10, 'Objective must be at least 10 characters.'),
  tone: z.string().min(1, 'Tone is required.'),
  productDetails: z.string().min(10, 'Product details must be at least 10 characters.'),
});

export function EmailGenerator() {
  const [result, setResult] = useState<GenerateEmailContentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { objective: "", tone: "Professional", productDetails: "" },
  });

  async function onSubmit(values: z.infer<typeof emailFormSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generateEmailContent(values);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate email content. Please try again.",
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
          <FormField control={form.control} name="objective" render={({ field }) => (
            <FormItem>
              <FormLabel>Email Objective</FormLabel>
              <FormControl><Input placeholder="e.g., Promote new summer collection" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
           <FormField control={form.control} name="productDetails" render={({ field }) => (
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
            <CardTitle>Generated Email Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Subject Lines</h3>
              <div className="space-y-2">
                {result.subjectLines.map((subject, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-md bg-background border">
                    <p className="flex-1">{subject}</p>
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(subject)}>
                      <Copy className="h-4 w-4"/>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg">Email Body</h3>
                    <Button variant="outline" size="sm" onClick={() => handleCopy(result.body)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Body
                    </Button>
                </div>
                 <div className="p-4 rounded-md bg-background border">
                     <p className="whitespace-pre-wrap">{result.body}</p>
                 </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
