
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Check, Filter, BrainCircuit, Mail, Users, BarChart3, Link as LinkIcon, Star, Globe, Newspaper, Workflow, Target, Handshake, BotMessageSquare, ClipboardList, BookText, Zap, ShieldCheck, Scale, MessageSquareQuestion, Gem, Rocket, Briefcase, GraduationCap, Video } from 'lucide-react'

const allInOneFeatures = [
  {
    icon: Filter,
    title: 'Funnels & Landing Pages',
    description: 'Visually build high-converting sales funnels.'
  },
  {
    icon: Globe,
    title: 'Websites & Blogs',
    description: 'Create beautiful, fast websites with our builder.'
  },
  {
    icon: Mail,
    title: 'Email Marketing',
    description: 'Engage your audience with powerful email campaigns.'
  },
  {
    icon: Users,
    title: 'CRM & Pipeline',
    description: 'Manage all your leads and customers in one place.'
  },
  {
    icon: Workflow,
    title: 'Marketing Automation',
    description: 'Visually build workflows that automate your business.'
  },
  {
    icon: BrainCircuit,
    title: 'AI Content Tools',
    description: 'Generate copy for ads, emails, and funnels in seconds.'
  },
  {
    icon: ClipboardList,
    title: 'Forms & Surveys',
    description: 'Capture leads and feedback with custom forms.'
  },
  {
    icon: LinkIcon,
    title: 'Affiliate Management',
    description: 'Track and manage all your affiliate campaigns.'
  },
  {
    icon: GraduationCap,
    title: 'Courses & Memberships',
    description: 'Build and sell your own online courses and communities.'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Track your numbers and make data-driven decisions.'
  },
  {
    icon: BookText,
    title: 'Appointment Scheduling',
    description: 'Let clients book calls and meetings right from your site.'
  },
  {
    icon: BotMessageSquare,
    title: 'Social Media Planner',
    description: 'Schedule your social posts across platforms in advance.'
  },
];


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
    imageSrc: 'https://firebasestorage.googleapis.com/v0/b/firebase-veilnet.appspot.com/o/Resized_CRM_Ad_600x400.png?alt=media',
    imageHint: 'website builder'
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
    imageSrc: 'https://firebasestorage.googleapis.com/v0/b/firebase-veilnet.appspot.com/o/Untitled%20design%20(1).png?alt=media',
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
    imageSrc: 'https://firebasestorage.googleapis.com/v0/b/firebase-veilnet.appspot.com/o/Untitled%20design.png?alt=media',
    imageHint: 'crm dashboard pipeline'
  },
];


const testimonials = [
  {
    quote: "HighLaunchPad replaced 3 different tools for me. My business is more organized, and my sales are up 40%. The funnel builder is a dream to use.",
    name: "Sarah J.",
    title: "Course Creator",
    avatar: "https://i.pravatar.cc/40?img=1",
    hint: "woman portrait"
  },
  {
    quote: "The AI content tools are a game-changer. I can create an entire email campaign in 10 minutes instead of 2 hours. It's like having a marketing team in my pocket.",
    name: "Mike P.",
    title: "Affiliate Marketer",
    avatar: "https://i.pravatar.cc/40?img=3",
    hint: "man portrait"
  },
  {
    quote: "Finally, a platform that understands what digital entrepreneurs actually need. The automations are incredibly powerful, and the support is top-notch.",
    name: "Chloe W.",
    title: "YouTuber & Coach",
    avatar: "https://i.pravatar.cc/40?img=5",
    hint: "woman glasses"
  },
  {
    quote: "As a marketing agency, managing multiple clients was a nightmare of logins and subscriptions. HighLaunchPad consolidated everything. Our efficiency has skyrocketed.",
    name: "David L.",
    title: "Agency Owner",
    avatar: "https://i.pravatar.cc/40?img=7",
    hint: "agency owner portrait"
  },
  {
    quote: "I'm not a tech person, but I was able to build my entire website and sales funnel in a single weekend. The templates are beautiful and easy to customize.",
    name: "Elena R.",
    title: "Small Business Owner",
    avatar: "https://i.pravatar.cc/40?img=8",
    hint: "business owner portrait"
  },
  {
    quote: "The CRM is surprisingly robust. Being able to see every touchpoint with a customer—emails, site visits, form fills—is incredibly valuable for our sales team.",
    name: "Tom H.",
    title: "Sales Manager",
    avatar: "https://i.pravatar.cc/40?img=12",
    hint: "sales manager portrait"
  },
];


const trustedByLogos = [
  { name: 'Quantum Leap', src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtz_fXq4yyXKQ_rs5JqS_FtVFffvmiwCWQ9A&s' },
  { name: 'Apex Digital', src: 'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-original-577x577/s3/092015/apex_logo.png?itok=gXGtqXkH' },
  { name: 'Momentum Co.', src: 'https://cdn.prod.website-files.com/64f1edd73fcc46e5077b8da4/663c0aaacd0204a7d6889cab_ByBlocks%C2%AE%20%E2%80%95%20Momentum%20Co..png' },
  { name: 'Synergy Inc.', src: 'https://images-platform.99static.com/eVg6kAxkMHMNJjJa2YnlisoCStA=/500x500/top/smart/99designs-contests-attachments/30/30123/attachment_30123697' },
];

const whoIsItFor = [
  {
    icon: GraduationCap,
    title: 'Coaches & Consultants',
    description: 'Sell your expertise with scheduling, payments, and client management tools built for you.',
  },
  {
    icon: Briefcase,
    title: 'Marketing Agencies',
    description: 'Manage all your clients under one roof with a powerful, white-label ready platform.',
  },
  {
    icon: BookText,
    title: 'Course Creators',
    description: 'Build, market, and sell your online courses and memberships with ease.',
  },
  {
    icon: Users,
    title: 'Affiliate Marketers',
    description: 'Create high-converting funnels and manage your affiliate programs in one place.',
  },
];

const pricingTiers = [
  {
    name: 'Professional',
    price: '$29',
    description: 'One simple plan with everything you need to launch, automate, and scale your online business.',
    features: [
        'Unlimited Funnels & Websites',
        'Unlimited Email Marketing',
        'Full CRM & Pipeline Access',
        'Complete AI Toolkit',
        'Course & Membership Hosting',
        'No "HighLaunchPad" Branding',
    ],
    isPopular: true,
  },
];

const faqItems = [
  {
    question: 'Is there a free trial?',
    answer: 'Yes! We offer a full-featured 30-day free trial so you can experience the power of HighLaunchPad for yourself. No credit card is required to start.'
  },
  {
    question: 'Can I import my contacts from another platform?',
    answer: 'Absolutely. We make it easy to import your existing contacts, customers, and email lists via a simple CSV upload. Our support team can also assist you with the migration.'
  },
  {
    question: 'Do I need to be a technical expert to use it?',
    answer: "Not at all. HighLaunchPad is designed to be user-friendly with a drag-and-drop visual builder for websites and funnels. Plus, we have a library of tutorials and a dedicated support team to help you succeed."
  },
  {
    question: 'What tools does HighLaunchPad replace?',
    answer: "HighLaunchPad can replace your website builder (like Wix, Squarespace), funnel builder (like ClickFunnels), email marketing service (like Mailchimp, ActiveCampaign), CRM (like HubSpot), scheduling tool (like Calendly), course platform (like Teachable), and much more. You get all this for one monthly price."
  },
  {
    question: 'Can I cancel my account at any time?',
    answer: "Yes, you have complete control over your subscription. You can upgrade, downgrade, or cancel your account at any time from your billing dashboard with just a few clicks. There are no long-term contracts."
  }
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
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 -z-10"></div>
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

        {/* Trusted By Logos Section */}
        <section className="py-12 bg-muted/20">
            <div className="container">
                <p className="text-center font-semibold text-muted-foreground">TRUSTED BY THOUSANDS OF BUSINESSES WORLDWIDE</p>
                <div className="mt-6 flex flex-wrap justify-center items-center gap-x-8 gap-y-4 md:gap-x-12">
                    {trustedByLogos.map((logo) => (
                        <Image key={logo.name} src={logo.src} alt={logo.name} width={140} height={40} className="opacity-60 hover:opacity-100 transition-opacity" />
                    ))}
                </div>
            </div>
        </section>
        
        {/* All-In-One Platform Feature Grid */}
        <section id="features" className="py-20">
          <div className="container">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">One Platform, Everything You Need</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">Stop taping together a dozen different tools. HighLaunchPad brings everything under one roof so you can focus on what matters: growing your business.</p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {allInOneFeatures.map((feature) => (
                    <Card key={feature.title} className="bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-lg transition-all">
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                           <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                                <feature.icon className="h-6 w-6 text-primary"/>
                            </div>
                            <CardTitle className="text-lg">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
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
                                {feature.title.split(' ')[2]}
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
                            <Image 
                                src={feature.imageSrc} 
                                alt={feature.title} 
                                width={600} 
                                height={400} 
                                className="w-full h-auto rounded-lg"
                                data-ai-hint={feature.imageHint} 
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* AI Spotlight Section */}
        <section id="ai-spotlight" className="py-20 bg-gray-900 text-gray-200">
            <div className="container grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-3 py-1 rounded-full mb-4 font-medium">
                        <Zap className="h-5 w-5"/>
                        Powered by AI
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Your Personal AI Marketing Assistant</h2>
                    <p className="mt-4 max-w-xl text-lg text-gray-400">Eliminate writer's block and save countless hours. Our AI Content Generator creates high-converting copy for your ads, emails, landing pages, and social posts in seconds.</p>
                    <Button size="lg" variant="secondary" className="mt-8" asChild>
                        <Link href="/signup">See The AI In Action</Link>
                    </Button>
                </div>
                <div className="space-y-4">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <BrainCircuit className="h-8 w-8 text-secondary" />
                            <CardTitle className="text-white">Generate Ad Copy</CardTitle>
                        </CardHeader>
                        <CardContent className="text-gray-400">Create compelling Facebook, Google, and Instagram ad copy that converts visitors into customers.</CardContent>
                    </Card>
                     <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Mail className="h-8 w-8 text-secondary" />
                            <CardTitle className="text-white">Write Email Sequences</CardTitle>
                        </CardHeader>
                        <CardContent className="text-gray-400">Instantly craft entire email campaigns, from welcome series to product launch sequences.</CardContent>
                    </Card>
                     <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Newspaper className="h-8 w-8 text-secondary" />
                            <CardTitle className="text-white">Create Funnel Content</CardTitle>
                        </CardHeader>
                        <CardContent className="text-gray-400">Generate persuasive headlines, sub-headlines, and body copy for all your landing pages and funnels.</CardContent>
                    </Card>
                </div>
            </div>
        </section>

        {/* "Who Is It For?" Section */}
        <section id="for-who" className="py-20">
            <div className="container">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Built For Entrepreneurs Like You</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">HighLaunchPad is the perfect fit for a wide range of online businesses. Find out how we can help you thrive.</p>
                </div>
                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {whoIsItFor.map((persona) => (
                        <Card key={persona.title} className="text-center">
                            <CardHeader className="items-center">
                                <div className="p-4 rounded-full bg-primary/10 border border-primary/20 inline-flex">
                                    <persona.icon className="h-8 w-8 text-primary" />
                                </div>
                                <CardTitle>{persona.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{persona.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        {/* Comparison Section */}
        <section id="comparison" className="py-20 bg-muted/40">
            <div className="container">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Simplify Your Stack, Amplify Your Results</h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">The old way means duct-taping multiple expensive tools that don't talk to each other. The new way is one platform, one login, one low price.</p>
                </div>
                <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* The Old Way */}
                    <Card className="border-destructive/50">
                        <CardHeader>
                            <CardTitle>The "Duct-Tape" Method</CardTitle>
                            <CardDescription>Juggling 5+ different subscriptions.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="flex items-center gap-2 text-muted-foreground"><Globe className="h-4 w-4" /> Website Builder: $29/mo</p>
                            <p className="flex items-center gap-2 text-muted-foreground"><Filter className="h-4 w-4" /> Funnel Builder: $97/mo</p>
                            <p className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /> Email Marketing: $49/mo</p>
                            <p className="flex items-center gap-2 text-muted-foreground"><Users className="h-4 w-4" /> CRM: $50/mo</p>
                            <p className="flex items-center gap-2 text-muted-foreground"><BookText className="h-4 w-4" /> Scheduling Tool: $15/mo</p>
                            <p className="font-bold text-lg mt-4 pt-4 border-t">Total: <span className="line-through">$240+/mo</span> + Headaches</p>
                        </CardContent>
                    </Card>
                    {/* The HighLaunchPad Way */}
                    <Card className="border-primary/50 border-2">
                        <CardHeader>
                             <div className="flex items-center justify-between">
                                <CardTitle>The HighLaunchPad Way</CardTitle>
                                <div className="flex items-center gap-2 text-primary font-bold"><Rocket className="h-5 w-5" /> All-In-One</div>
                            </div>
                            <CardDescription>Everything you need on one platform.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Website Builder</p>
                            <p className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Funnel Builder</p>
                            <p className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Email Marketing</p>
                            <p className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> CRM &amp; Pipelines</p>
                            <p className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> And so much more...</p>
                            <p className="font-bold text-lg mt-4 pt-4 border-t">Total: <span className="text-primary">Free for 30 Days, then $29/mo</span></p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20">
           <div className="container">
               <div className="text-center">
                  <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Loved by Creators and Marketers Worldwide</h2>
                  <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">Don't just take our word for it. Here's what real users are saying.</p>
                </div>
                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {testimonials.map((testimonial) => (
                    <Card key={testimonial.name} className="flex flex-col bg-card/50">
                      <CardContent className="pt-6 flex-1">
                        <div className="flex mb-2">
                            {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />)}
                        </div>
                        <p className="italic text-muted-foreground">"{testimonial.quote}"</p>
                      </CardContent>
                      <CardHeader className="flex-row items-center gap-4 pt-2">
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

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-muted/40">
            <div className="container">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Simple, Transparent Pricing</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">Choose the plan that's right for your business. No hidden fees, ever.</p>
                </div>
                <div className="mt-12 grid gap-8 max-w-md mx-auto">
                    {pricingTiers.map(plan => (
                        <Card key={plan.name} className={`flex flex-col ${plan.isPopular ? 'border-primary border-2 shadow-lg' : ''}`}>
                            {plan.isPopular && (
                                <div className="text-center py-1 px-4 bg-primary text-primary-foreground font-semibold text-sm rounded-t-lg">Most Popular</div>
                            )}
                            <CardHeader className="items-center text-center">
                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                <p className="text-4xl font-bold">{plan.price}<span className="text-lg font-normal text-muted-foreground">/mo</span></p>
                                <CardDescription>{plan.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-between">
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map(feature => (
                                        <li key={feature} className="flex items-center gap-3">
                                            <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                            <span className="text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button className="w-full" asChild>
                                  <Link href="/signup">Start Your Free 30-Day Trial</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <p className="text-sm text-muted-foreground">All plans start with a 30-day free trial. No credit card needed.</p>
                </div>
            </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20">
            <div className="container max-w-3xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Frequently Asked Questions</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">Have questions? We've got answers. If you can't find what you're looking for, feel free to contact us.</p>
                </div>
                <Accordion type="single" collapsible className="w-full mt-12">
                    {faqItems.map(item => (
                        <AccordionItem key={item.question} value={item.question}>
                            <AccordionTrigger className="text-lg text-left">{item.question}</AccordionTrigger>
                            <AccordionContent className="text-base text-muted-foreground">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
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
             <p className="mt-4 text-sm opacity-80">No credit card required. Cancel anytime.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-muted/40">
        <div className="container grid grid-cols-1 md:grid-cols-4 gap-8 py-12 text-sm">
            <div className="space-y-4">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="https://cdn.leonardo.ai/users/31a55a1b-10c8-4725-a4ad-b72817f069e1/generations/39ccab2d-4951-448b-b285-ccef2b6f670a/segments/1:1:1/Default_A_cuttingedge_HighlaunchPadAIpowered_CRM_logo_exuding__0.jpg"
                        alt="HighLaunchPad Logo"
                        width={24}
                        height={24}
                        className="rounded-md"
                    />
                    <span className="font-bold">HighLaunchPad</span>
                </Link>
                <p className="text-muted-foreground">The all-in-one platform to launch, automate, and scale your business.</p>
                <p className="text-muted-foreground">© {new Date().getFullYear()} HighLaunchPad. All rights reserved.</p>
            </div>
            <div className="space-y-3">
                <h4 className="font-semibold">Product</h4>
                <Link href="#features" className="block text-muted-foreground hover:text-foreground">Features</Link>
                <Link href="#pricing" className="block text-muted-foreground hover:text-foreground">Pricing</Link>
                <Link href="#ai-spotlight" className="block text-muted-foreground hover:text-foreground">AI Tools</Link>
                <Link href="/login" className="block text-muted-foreground hover:text-foreground">Login</Link>
            </div>
             <div className="space-y-3">
                <h4 className="font-semibold">Company</h4>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">About Us</Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">Careers</Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">Contact</Link>
            </div>
             <div className="space-y-3">
                <h4 className="font-semibold">Legal</h4>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">Privacy Policy</Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">Terms of Service</Link>
            </div>
        </div>
      </footer>
    </div>
  )
}
