
"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, ArrowRight, BarChart, BrainCircuit, DollarSign, Lightbulb, Loader2, Users } from 'lucide-react';
import * as Icons from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, Tooltip as RechartsTooltip, XAxis, YAxis } from 'recharts';
import Link from 'next/link';
import { useAIKey } from '@/contexts/ai-key-context';
import { funnelTemplates } from '@/lib/funnel-templates';
import { useToast } from '@/hooks/use-toast';

const chartData = [
  { month: "Jan", clicks: 0, conversions: 0 },
  { month: "Feb", clicks: 0, conversions: 0 },
  { month: "Mar", clicks: 0, conversions: 0 },
  { month: "Apr", clicks: 0, conversions: 0 },
  { month: "May", clicks: 0, conversions: 0 },
  { month: "Jun", clicks: 0, conversions: 0 },
];

const chartConfig = {
  clicks: { label: "Clicks", color: "hsl(var(--chart-1))" },
  conversions: { label: "Conversions", color: "hsl(var(--chart-2))" },
};

// Define the type for the AI insights output directly in the component
interface Recommendation {
  title: string;
  description: string;
  icon: keyof typeof Icons;
  ctaText: string;
  ctaLink: string;
}

interface InsightsOutput {
  insights: string[];
  recommendations: Recommendation[];
}


export default function DashboardPage() {
  const { apiKey, promptApiKey } = useAIKey();
  const { toast } = useToast();
  const [insights, setInsights] = useState<InsightsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInsights = async () => {
    if (!apiKey) {
      return;
    }
    setIsLoading(true);
    setInsights(null);
    try {
      const mockMetrics = { clicks: 1250, conversions: 150, commission: 4500 };
      const mockFunnels = funnelTemplates.map(f => ({
        name: f.title,
        ctr: `${f.stats.ctr}%`,
        optInRate: `${f.stats.optInRate}%`,
      }));
      
      const response = await fetch('/api/ai/generateDashboardInsights', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              metrics: mockMetrics,
              funnels: mockFunnels,
              apiKey: apiKey,
          }),
      });

      if (!response.ok) {
          const errorData = await response.json().catch(() => ({details: response.statusText}));
          throw new Error(errorData.details || 'Failed to fetch AI insights from API');
      }

      const data = await response.json();
      setInsights(data);

    } catch (error: any) {
      console.error("Failed to fetch AI insights:", error);
      toast({
        variant: 'destructive',
        title: 'AI Insight Error',
        description: error.message || 'Could not fetch AI-powered recommendations.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">No data available</p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversions</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">No data available</p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Commission</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">$0.00</div>
                <p className="text-xs text-muted-foreground">No data available</p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">EPC (Earnings Per Click)</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">$0.00</div>
                <p className="text-xs text-muted-foreground">No data available</p>
            </CardContent>
            </Card>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
            <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Your performance data will appear here once you start getting traffic.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                 <AreaChart
                    data={chartData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <defs>
                        <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-clicks)" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="var(--color-clicks)" stopOpacity={0}/>
                        </linearGradient>
                         <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-conversions)" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="var(--color-conversions)" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.2)" />
                    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                    <RechartsTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                    <Area type="monotone" dataKey="clicks" strokeWidth={2} stroke="var(--color-clicks)" fillOpacity={1} fill="url(#colorClicks)" stackId="1" />
                    <Area type="monotone" dataKey="conversions" strokeWidth={2} stroke="var(--color-conversions)" fillOpacity={1} fill="url(#colorConversions)" stackId="1" />
                </AreaChart>
                </ChartContainer>
            </CardContent>
            </Card>
            <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>A log of your recent clicks and conversions.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center h-full text-center py-12 border-2 border-dashed rounded-lg">
                    <Activity className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">No Recent Activity</h3>
                    <p className="text-muted-foreground text-sm">Your recent events will show up here.</p>
                </div>
            </CardContent>
            </Card>
        </div>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center"><BrainCircuit className="mr-2 h-5 w-5 text-primary" /> AI Assistant</CardTitle>
                <CardDescription>
                    Your AI assistant analyzes your performance and provides actionable recommendations.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12 border-2 border-dashed rounded-lg">
                      <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-4" />
                      <h3 className="text-lg font-semibold">Analyzing your data...</h3>
                      <p className="text-muted-foreground text-sm">Our AI is generating personalized insights for you.</p>
                    </div>
                ) : !apiKey ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12 border-2 border-dashed rounded-lg">
                        <Lightbulb className="h-10 w-10 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold">Unlock AI Insights</h3>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto">Provide your Google AI API Key to get personalized recommendations and analysis of your marketing performance.</p>
                        <Button className="mt-4" onClick={promptApiKey}>
                           Enter API Key
                        </Button>
                    </div>
                ) : insights ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <h3 className="font-semibold">Key Insights</h3>
                            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                                {insights.insights.map((insight, index) => <li key={index}>{insight}</li>)}
                            </ul>
                        </div>
                        <div className="space-y-4">
                             <h3 className="font-semibold">Recommendations</h3>
                             <div className="space-y-3">
                                {insights.recommendations.map((rec, index) => {
                                    const Icon = Icons[rec.icon as keyof typeof Icons] || Lightbulb;
                                    return (
                                        <div key={index} className="flex items-start gap-4 rounded-lg border p-4">
                                            <Icon className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-semibold">{rec.title}</h4>
                                                <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                                                <Button asChild size="sm">
                                                    <Link href={rec.ctaLink}>{rec.ctaText} <ArrowRight className="ml-2 h-4 w-4"/></Link>
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                })}
                             </div>
                        </div>
                    </div>
                ) : (
                   <div className="flex flex-col items-center justify-center h-full text-center py-12 border-2 border-dashed rounded-lg">
                      <Lightbulb className="h-10 w-10 text-muted-foreground mb-4" />
                      <h3 className="font-semibold">Generate Recommendations</h3>
                      <p className="text-muted-foreground text-sm">Click the button to get AI-powered insights on your data.</p>
                      <Button className="mt-4" onClick={fetchInsights}>
                          Generate Insights
                      </Button>
                  </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
