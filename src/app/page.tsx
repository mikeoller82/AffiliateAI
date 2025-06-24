
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Check, Filter, BrainCircuit, Mail, Users, BarChart3, Link as LinkIcon, Star, Globe, Newspaper, Workflow } from 'lucide-react'

const features = [
  {
    icon: <Filter className="h-8 w-8 text-primary" />,
    title: 'Drag-and-Drop Funnel Builder',
    description: 'Visually create high-converting landing pages and sales funnels with our intuitive, no-code editor.',
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: 'AI Content Engine',
    description: 'Generate compelling emails, ad copy, product reviews, and headlines in seconds. Never stare at a blank page again.',
  },
  {
    icon: <Workflow className="h-8 w-8 text-primary" />,
    title: 'Email Marketing Automation',
    description: 'Build powerful, automated email sequences that nurture leads and drive sales while you sleep.',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Smart CRM & Lead Management',
    description: 'Track every interaction and manage your customer relationships effortlessly in our visual pipeline.',
  },
  {
    icon: <Globe className="h-8 w-8 text-primary" />,
    title: 'Website & Blog Builder',
    description: 'Create a stunning, multi-page website or blog to build your brand and attract organic traffic.',
  },
  {
    icon: <LinkIcon className="h-8 w-8 text-primary" />,
    title: 'Affiliate Link Tracking',
    description: 'Manage and track all your affiliate links in one place to understand your ROI and scale what works.',
  },
];

const testimonials = [
  {
    quote: "HighLaunchPad replaced 3 different tools for me. My business is more organized, and my sales are up 40%. The funnel builder is a dream to use.",
    name: "Sarah J.",
    title: "Course Creator",
    avatar: "https://placehold.co/40x40.png",
    hint: "woman portrait"
  },
  {
    quote: "The AI content tools are a game-changer. I can create an entire email campaign in 10 minutes instead of 2 hours. It's like having a marketing team in my pocket.",
    name: "Mike P.",
    title: "Affiliate Marketer",
    avatar: "https://placehold.co/40x40.png",
    hint: "man portrait"
  },
  {
    quote: "Finally, a platform that understands what digital entrepreneurs actually need. The automations are incredibly powerful, and the support is top-notch.",
    name: "Chloe W.",
    title: "YouTuber & Coach",
    avatar: "https://placehold.co/40x40.png",
    hint: "woman glasses"
  },
];


export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
                src="https://cdn.leonardo.ai/users/31a55a1b-10c8-4725-a4ad-b72817f069e1/generations/39ccab2d-4951-448b-b285-ccef2b6f670a/segments/1:1:1/Default_A_cuttingedge_HighlaunchPadAIpowered_CRM_logo_exuding__0.jpg"
                alt="HighLaunchPad Logo"
                width={32}
                height={32}
                className="rounded-md"
            />
            <span className="font-bold">HighLaunchPad</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-20 text-center md:py-32">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
            The All-in-One Growth Platform for Digital Entrepreneurs
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Stop juggling a dozen different tools. HighLaunchPad gives you the funnels, email automation, AI tools, and CRM you need to launch, automate, and scale your business.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/signup">Start Your Free 30-Day Trial</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">No credit card required. Cancel anytime.</p>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full bg-muted py-20">
          <div className="container">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">One Platform, Infinite Possibilities</h2>
              <p className="mt-4 text-lg text-muted-foreground">Everything you need to turn your ideas into income.</p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="bg-background">
                  <CardHeader className="flex flex-col items-center text-center">
                    {feature.icon}
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="container py-20">
           <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Loved by Creators and Marketers Worldwide</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">Don't just take our word for it. Here's what real users are saying.</p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-1 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="flex flex-col">
                  <CardContent className="pt-6 flex-1">
                    <p className="italic">"{testimonial.quote}"</p>
                  </CardContent>
                  <CardHeader className="flex-row items-center gap-4">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.hint} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
        </section>

        {/* CTA Section */}
        <section className="w-full bg-primary text-primary-foreground">
          <div className="container flex flex-col items-center py-20 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Ready to Grow Your Business on Autopilot?</h2>
            <p className="mt-4 max-w-xl text-lg opacity-90">
              Join thousands of creators who trust HighLaunchPad to power their online business. Get started today, risk-free.
            </p>
            <div className="mt-8">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">Start Your Free 30-Day Trial</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
          <div className="flex items-center gap-2">
             <Image
                src="https://cdn.leonardo.ai/users/31a55a1b-10c8-4725-a4ad-b72817f069e1/generations/39ccab2d-4951-448b-b285-ccef2b6f670a/segments/1:1:1/Default_A_cuttingedge_HighlaunchPadAIpowered_CRM_logo_exuding__0.jpg"
                alt="HighLaunchPad Logo"
                width={24}
                height={24}
                className="rounded-md"
            />
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} HighLaunchPad. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
