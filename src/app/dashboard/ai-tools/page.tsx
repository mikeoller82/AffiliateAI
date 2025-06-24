import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdCopyGenerator, CtaSuggestor, EmailGenerator, ProductReviewWriter, ProductHookGenerator, ImageGenerator } from '@/components/ai/tools';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AIToolsPage() {
  return (
    <Tabs defaultValue="ad-copy" className="w-full">
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-6">
        <TabsTrigger value="ad-copy">Ad Generator</TabsTrigger>
        <TabsTrigger value="product-review">Product Review</TabsTrigger>
        <TabsTrigger value="cta-optimizer">CTA Optimizer</TabsTrigger>
        <TabsTrigger value="product-hook">Hook Generator</TabsTrigger>
        <TabsTrigger value="email-content">Email Content</TabsTrigger>
        <TabsTrigger value="image-generator">Image Generator</TabsTrigger>
      </TabsList>
      <TabsContent value="ad-copy">
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
       <TabsContent value="product-review">
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
      <TabsContent value="cta-optimizer">
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
      <TabsContent value="product-hook">
        <Card>
          <CardHeader>
            <CardTitle>Product Hook Generator</CardTitle>
            <CardDescription>Short, punchy hook ideas tailored for social posts, landing pages, or ads.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProductHookGenerator />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="email-content">
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
       <TabsContent value="image-generator">
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
  );
}
