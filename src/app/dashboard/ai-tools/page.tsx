'use client';

import { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdCopyGenerator, CtaSuggestor, EmailGenerator, ProductReviewWriter, ProductHookGenerator, ImageGenerator } from '@/components/ai/tools';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAIKey } from '@/contexts/ai-key-context';

export default function AIToolsPage() {
  const { apiKey, promptApiKey } = useAIKey();

  useEffect(() => {
    if (!apiKey) {
      promptApiKey();
    }
  }, [apiKey, promptApiKey]);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6">AI Tools</h1>
      
      <Tabs defaultValue="ad-copy" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <TabsTrigger value="ad-copy">Ad Generator</TabsTrigger>
          <TabsTrigger value="product-review">Product Review</TabsTrigger>
          <TabsTrigger value="cta-optimizer">CTA Optimizer</TabsTrigger>
          <TabsTrigger value="email-content">Email Content</TabsTrigger>
          <TabsTrigger value="image-generator">Image Generator</TabsTrigger>
        </TabsList>

        <TabsContent value="ad-copy" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Affiliate Ad Generator</CardTitle>
              <CardDescription>Generates short-form copy for platforms like Facebook Ads, TikTok, and X.</CardDescription>
            </CardHeader>
            <CardContent>
              <AdCopyGenerator />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="product-review" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Review Writer</CardTitle>
              <CardDescription>Generates SEO-optimized blog reviews or YouTube scripts.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductReviewWriter />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cta-optimizer" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>CTA Optimizer</CardTitle>
              <CardDescription>Suggests strong calls to action based on tone and intent.</CardDescription>
            </CardHeader>
            <CardContent>
              <CtaSuggestor />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email-content" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Email Assistant</CardTitle>
              <CardDescription>Generate compelling email subject lines and body copy in seconds.</CardDescription>
            </CardHeader>
            <CardContent>
              <EmailGenerator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="image-generator" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Image Generator</CardTitle>
              <CardDescription>Create unique, high-quality images from a text description for your ads, funnels, and content.</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageGenerator />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
