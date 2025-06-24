import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Check, Filter, BrainCircuit, Mail, Users, BarChart3, Link as LinkIcon, Star, Globe, Newspaper, Workflow, Target, Handshake, BotMessageSquare } from 'lucide-react'

const showcaseFeatures = [
  {
    icon: Globe,
    title: 'Create Websites, Funnels & Landing Pages',
    description: 'Our intuitive platform allows you to create full-featured websites with custom menus and high-performing, captivating landing pages—all in one place.',
    points: [
      'Drag & drop visual builder',
      'Professionally designed templates',
      'Blazing fast hosting included'
    ],
    imageSrc: 'https://placehold.co/600x400.png',
    imageHint: 'website builder interface'
  },
  {
    icon: Workflow,
    title: 'Email Marketing & Automations',
    description: 'Build your list and your relationship with your audience using our powerful email marketing and visual automation builder.',
    points: [
        'Visual automation flows',
        'Advanced contact segmentation',
        'Detailed analytics & reporting'
    ],
    imageSrc: 'https://placehold.co/600x400.png',
    imageHint: 'email marketing automation'
  },
  {
    icon: Users,
    title: 'Smart CRM & Pipeline Management',
    description: 'Manage your entire sales pipeline from lead to close. Track every interaction and never let a lead fall through the cracks.',
    points: [
        'Visual sales pipelines',
        'Contact scoring & tagging',
        'Full conversation history'
    ],
    imageSrc: 'https://placehold.co/600x400.png',
    imageHint: 'crm dashboard pipeline'
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
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20"></div>
          <div className="container relative py-20 text-center md:py-32">
            <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
              The Most Powerful All-In-One Platform For Your Business
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              HighLaunchPad gives you the funnels, email automation, AI tools, and CRM you need to launch, automate, and scale your business from a single dashboard.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/signup">Start Your Free 30-Day Trial</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">No credit card required. Cancel anytime.</p>
          </div>
        </section>

        {/* Marketing Engine Section */}
        <section id="engine" className="w-full bg-muted/40 py-20">
          <div className="container">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Building Your Digital Marketing Engine</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">All the tools you need in one platform, without having to "duct-tape" multiple platforms together.</p>
            </div>
            <div className="mt-12 max-w-4xl mx-auto bg-card rounded-2xl p-8 shadow-lg">
                <div className="relative">
                     {/* Connecting line */}
                    <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-border -z-10"></div>
                    
                    <div className="space-y-12">
                        <div className="flex items-start gap-6">
                            <div className="flex items-center justify-center bg-red-500/10 rounded-full h-9 w-9 border-2 border-red-500/50 flex-shrink-0">
                                <Target className="h-5 w-5 text-red-500"/>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">Capture</h3>
                                <p className="text-muted-foreground mt-1">Capture leads using our landing pages, surveys, forms, calendars, inbound phone system & more!</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-6">
                            <div className="flex items-center justify-center bg-green-500/10 rounded-full h-9 w-9 border-2 border-green-500/50 flex-shrink-0">
                                <BotMessageSquare className="h-5 w-5 text-green-500"/>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">Nurture</h3>
                                <p className="text-muted-foreground mt-1">Automatically message leads via voicemail, forced calls, SMS, emails, FB Messenger & more!</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-6">
                            <div className="flex items-center justify-center bg-blue-500/10 rounded-full h-9 w-9 border-2 border-blue-500/50 flex-shrink-0">
                                <Handshake className="h-5 w-5 text-blue-500"/>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">Close</h3>
                                <p className="text-muted-foreground mt-1">Use our built-in tools to collect payments, schedule appointments, and track analytics!</p>
                            </div>
                        </div>
                    </div>
                </div>
                <Button size="lg" className="w-full mt-12 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    Start Your Free 30-Day Trial
                </Button>
                 <p className="mt-2 text-center text-xs text-muted-foreground">No obligations, no contracts, cancel at any time.</p>
            </div>
          </div>
        </section>
        
        {/* Feature Showcase Section */}
        <section id="showcase" className="py-20">
            <div className="container space-y-24">
                {showcaseFeatures.map((feature, index) => (
                    <div key={feature.title} className="grid md:grid-cols-2 gap-12 items-center">
                        <div className={index % 2 === 1 ? 'md:order-last' : ''}>
                             <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full mb-4 font-medium">
                                <feature.icon className="h-5 w-5"/>
                                {feature.title}
                            </div>
                            <h3 className="text-3xl font-bold tracking-tight">{feature.title}</h3>
                            <p className="mt-4 text-lg text-muted-foreground">{feature.description}</p>
                            <ul className="mt-6 space-y-3">
                                {feature.points.map(point => (
                                    <li key={point} className="flex items-center gap-3">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0"/>
                                        <span className="text-muted-foreground">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-card p-4 rounded-xl border shadow-lg">
                             <Image src={feature.imageSrc} alt={feature.title} width={600} height={400} className="object-cover rounded-lg w-full" data-ai-hint={feature.imageHint} />
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="bg-muted/40 py-20">
           <div className="container">
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
            </div>
        </section>

        {/* CTA Section */}
        <section className="w-full bg-primary/90 text-primary-foreground">
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
