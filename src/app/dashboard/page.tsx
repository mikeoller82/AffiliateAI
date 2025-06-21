"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, DollarSign, Users, Activity } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, BarChart as RechartsBarChart } from 'recharts';

const chartData = [
  { month: "Jan", clicks: 186, conversions: 80 },
  { month: "Feb", clicks: 305, conversions: 200 },
  { month: "Mar", clicks: 237, conversions: 120 },
  { month: "Apr", clicks: 273, conversions: 190 },
  { month: "May", clicks: 209, conversions: 130 },
  { month: "Jun", clicks: 214, conversions: 140 },
];

const chartConfig = {
  clicks: { label: "Clicks", color: "hsl(var(--primary))" },
  conversions: { label: "Conversions", color: "hsl(var(--accent))" },
};

const recentActivities = [
  { id: 1, type: 'conversion', details: 'Product A Sale', amount: 25.00, date: '2 hours ago' },
  { id: 2, type: 'click', details: 'Campaign "Summer Sale"', amount: null, date: '5 hours ago' },
  { id: 3, type: 'click', details: 'Link "Homepage Banner"', amount: null, date: '1 day ago' },
  { id: 4, type: 'conversion', details: 'Service B Subscription', amount: 49.99, date: '2 days ago' },
  { id: 5, type: 'click', details: 'Campaign "New Arrivals"', amount: null, date: '3 days ago' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,234</div>
            <p className="text-xs text-muted-foreground">+12.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,350</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,231.89</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
        <Card>
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
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Clicks and conversions over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <RechartsBarChart data={chartData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <RechartsTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="clicks" fill="var(--color-clicks)" radius={4} />
                <Bar dataKey="conversions" fill="var(--color-conversions)" radius={4} />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
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
    </div>
  );
}
