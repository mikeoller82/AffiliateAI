import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdCopyGenerator, CtaSuggestor, ContentIdeator, EmailGenerator } from '@/components/ai/tools';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AIToolsPage() {
  return (
    <Tabs defaultValue="ad-copy" className="w-full">
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-4">
        <TabsTrigger value="ad-copy">Ad Copy</TabsTrigger>
        <TabsTrigger value="cta-suggestions">CTA Suggestions</TabsTrigger>
        <TabsTrigger value="content-ideas">Content Ideas</TabsTrigger>
        <TabsTrigger value="email-content">Email Content</TabsTrigger>
      </TabsList>
      <TabsContent value="ad-copy">
        <Card>
          <CardHeader>
            <CardTitle>AI Ad Copy Generator</CardTitle>
            <CardDescription>Create compelling ad copy for your campaigns on various platforms.</CardDescription>
          </CardHeader>
          <CardContent>
            <AdCopyGenerator />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="cta-suggestions">
        <Card>
          <CardHeader>
            <CardTitle>AI CTA Suggestion Engine</CardTitle>
            <CardDescription>Get high-converting Call-To-Action ideas based on your context.</CardDescription>
          </CardHeader>
          <CardContent>
            <CtaSuggestor />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="content-ideas">
        <Card>
          <CardHeader>
            <CardTitle>AI Content Ideation Assistant</CardTitle>
            <CardDescription>Brainstorm engaging content ideas for your niche and format.</CardDescription>
          </CardHeader>
          <CardContent>
            <ContentIdeator />
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
    </Tabs>
  );
}
