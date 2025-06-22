"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, DollarSign, Users, Activity, Lightbulb, Zap, ArrowRight, BrainCircuit } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';
import Link from 'next/link';

const chartData = [
  { month: "Jan", clicks: 1860, conversions: 800 },
  { month: "Feb", clicks: 3050, conversions: 2000 },
  { month: "Mar", clicks: 2370, conversions: 1200 },
  { month: "Apr", clicks: 2730, conversions: 1900 },
  { month: "May", clicks: 2090, conversions: 1300 },
  { month: "Jun", clicks: 2140, conversions: 1400 },
];

const chartConfig = {
  clicks: { label: "Clicks", color: "hsl(var(--chart-1))" },
  conversions: { label: "Conversions", color: "hsl(var(--chart-2))" },
};

const recentActivities = [
  { id: 1, type: 'conversion', details: 'Product A Sale', amount: 25.00, date: '2 hours ago' },
  { id: 2, type: 'click', details: 'Campaign "Summer Sale"', amount: null, date: '5 hours ago' },
  { id: 3, type: 'click', details: 'Link "Homepage Banner"', amount: null, date: '1 day ago' },
  { id: 4, type: 'conversion', details: 'Service B Subscription', amount: 49.99, date: '2 days ago' },
  { id: 5, type: 'click', details: 'Campaign "New Arrivals"', amount: null, date: '3 days ago' },
];

const aiRecommendations = [
    {
        title: "Improve 'Lead Magnet' Funnel Conversion",
        insight: "Your 'Lead Magnet' funnel has a 3.2% conversion rate, with a 65% drop-off on the email capture step.",
        recommendation: "The AI suggests reducing the number of form fields from 4 to 2 and adding a customer testimonial to the page to build trust.",
        icon: BrainCircuit,
    },
    {
        title: "Optimize 'Summer Promo' Email Campaign",
        insight: "The 'Summer Promo' campaign has a high open rate (45%) but a low click-through rate (1.2%).",
        recommendation: "The subject line is effective, but the call-to-action is weak. Try A/B testing the button text. The AI suggests 'Shop the Sale Now' as a stronger alternative to 'Learn More'.",
        icon: BrainCircuit,
    },
     {
        title: "Underperforming Affiliate Link Detected",
        insight: "The link for 'Old Winter Campaign' has received 430 clicks but only 12 conversions in the last 30 days, resulting in a low EPC of $0.35.",
        recommendation: "This offer may be outdated. Consider replacing it with the 'New Product Launch' link, which has a higher EPC of $1.47.",
        icon: BrainCircuit,
    },
];

const quickFixes = [
    {
        title: "Send follow-up to unconverted leads",
        description: "34 users started the 'Lead Magnet' funnel but didn't convert. Launch a follow-up email sequence to re-engage them.",
        buttonText: "Create Follow-up Email",
        href: "/dashboard/email/new",
    },
    {
        title: "A/B Test Your CTA on the 'Webinar' Funnel",
        description: "The main call-to-action button has a below-average click rate. Testing a new variation could significantly boost sign-ups.",
        buttonText: "Edit Funnel",
        href: "/dashboard/funnels/webinar-funnel",
    },
    {
        title: "Archive the 'Old Winter Campaign' Link",
        description: "This link is no longer performing well and is likely out of season. Archiving it will clean up your dashboard.",
        buttonText: "Manage Links",
        href: "/dashboard/links",
    }
]


export default function DashboardPage() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">
                <BarChart className="mr-2 h-4 w-4" /> Performance Overview
            </TabsTrigger>
            <TabsTrigger value="recommendations">
                <Lightbulb className="mr-2 h-4 w-4" /> AI Recommendations
            </TabsTrigger>
            <TabsTrigger value="quick-fixes">
                <Zap className="mr-2 h-4 w-4" /> Quick Fixes
            </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-glow-primary transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">12,234</div>
                    <p className="text-xs text-muted-foreground">+12.1% from last month</p>
                </CardContent>
                </Card>
                <Card className="hover:shadow-glow-primary transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversions</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+2,350</div>
                    <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                </CardContent>
                </Card>
                <Card className="hover:shadow-glow-primary transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Commission</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$4,231.89</div>
                    <p className="text-xs text-muted-foreground">+19% from last month</p>
                </CardContent>
                </Card>
                <Card className="hover:shadow-glow-primary transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">EPC (Earnings Per Click)</CardTitle>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$0.35</div>
                    <p className="text-xs text-muted-foreground">+2.1% from last month</p>
                </CardContent>
                </Card>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="hover:shadow-glow-primary transition-shadow duration-300">
                <CardHeader>
                    <CardTitle>Performance Overview</CardTitle>
                    <CardDescription>Clicks and conversions over the last 6 months.</CardDescription>
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
                        <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" tickFormatter={(value) => {
                            if (value >= 1000) return `${value / 1000}k`;
                            return value.toString();
                        }} />
                        <RechartsTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                        <Area type="monotone" dataKey="clicks" strokeWidth={2} stroke="var(--color-clicks)" fillOpacity={1} fill="url(#colorClicks)" />
                        <Area type="monotone" dataKey="conversions" strokeWidth={2} stroke="var(--color-conversions)" fillOpacity={1} fill="url(#colorConversions)" />
                    </AreaChart>
                    </ChartContainer>
                </CardContent>
                </Card>
                <Card className="hover:shadow-glow-primary transition-shadow duration-300">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>A log of your recent clicks and conversions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead className="text-right">Commission</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentActivities.map((activity) => (
                        <TableRow key={activity.id}>
                            <TableCell>
                            <Badge variant={activity.type === 'conversion' ? 'default' : 'secondary'} className={activity.type === 'conversion' ? 'bg-green-500/20 text-green-700 border-green-500/30' : ''}>
                                {activity.type}
                            </Badge>
                            </TableCell>
                            <TableCell className="font-medium">{activity.details}</TableCell>
                            <TableCell className="text-right">
                            {activity.amount ? `$${activity.amount.toFixed(2)}` : '-'}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">{activity.date}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </CardContent>
                </Card>
            </div>
        </TabsContent>
        <TabsContent value="recommendations" className="space-y-4">
             <Card>
                <CardHeader>
                    <CardTitle>AI-Powered Insights & Recommendations</CardTitle>
                    <CardDescription>
                        Your AI assistant has analyzed your performance data and found these opportunities.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {aiRecommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 border rounded-lg bg-card hover:shadow-glow-primary transition-shadow duration-300">
                            <rec.icon className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                            <div className="flex-1">
                                <h3 className="font-semibold">{rec.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1"><span className="font-semibold text-foreground">Insight:</span> {rec.insight}</p>
                                <p className="text-sm mt-2"><span className="font-semibold text-primary">Recommendation:</span> {rec.recommendation}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="quick-fixes" className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>High-Impact Quick Fixes</CardTitle>
                    <CardDescription>
                        Take these simple steps right now to improve your results.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {quickFixes.map((fix, index) => (
                        <Card key={index} className="flex flex-col hover:shadow-glow-primary transition-shadow duration-300">
                            <CardHeader>
                                <CardTitle className="text-lg">{fix.title}</CardTitle>
                                <CardDescription>{fix.description}</CardDescription>
                            </CardHeader>
                            <CardFooter className="mt-auto">
                                <Button asChild className="w-full">
                                    <Link href={fix.href}>
                                        {fix.buttonText} <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </TabsContent>
    </Tabs>
  );
}
