import { HeroSection } from "@/components/landing/HeroSection";
import { Navbar } from "@/components/landing/Navbar";
import { Features } from "@/components/landing/Features";
import { PricingSection } from "@/components/landing/Pricing";
import { Footer } from "@/components/landing/Footer";
import { Faq } from "@/components/landing/Faq";
import { Testimonials } from "@/components/landing/Testimonials";

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    info: "Perfect for individuals getting started",
    price: {
      monthly: 7,
      yearly: Math.round(7 * 12 * 0.83), // 17% discount
    },
    limits: {
      projects: 5,
      storage: 10,
    },
    features: [
      { text: "Up to 5 projects", tooltip: "Create and manage up to 5 projects" },
      { text: "10GB storage", tooltip: "Store up to 10GB of data" },
      { text: "Basic analytics", tooltip: "View basic project analytics" },
      { text: "Email support", tooltip: "Get help via email within 48 hours" },
      { text: "Standard templates", tooltip: "Access to basic project templates" },
    ],
    btn: {
      text: "Start with Basic",
    },
  },
  {
    highlighted: true,
    id: "pro",
    name: "Pro",
    info: "Best for growing businesses and teams",
    price: {
      monthly: 17.99,
      yearly: Math.round(17.99 * 12 * 0.8), // 20% discount
    },
    limits: {
      projects: 20,
      storage: 50,
    },
    trial: {
      days: 14,
    },
    features: [
      { text: "Up to 20 projects", tooltip: "Create and manage up to 20 projects" },
      { text: "50GB storage", tooltip: "Store up to 50GB of data" },
      { text: "Advanced analytics", tooltip: "Detailed insights and reporting" },
      { text: "Priority support", tooltip: "Get 24/7 priority chat support" },
      { text: "Premium templates", tooltip: "Access to all premium templates" },
      { text: "Team collaboration", tooltip: "Invite team members to collaborate" },
      { text: "API access", tooltip: "Integrate with third-party tools" },
      { text: "14-day free trial", tooltip: "Try Pro features risk-free" },
    ],
    btn: {
      text: "Start Pro Trial",
    },
  },
  {
    id: "business",
    name: "Business",
    info: "For large organizations with advanced needs",
    price: {
      monthly: 49.99,
      yearly: Math.round(49.99 * 12 * 0.75), // 25% discount
    },
    limits: {
      projects: -1, // unlimited
      storage: -1, // unlimited
    },
    features: [
      { text: "Unlimited projects", tooltip: "No limits on project creation" },
      { text: "Unlimited storage", tooltip: "Store as much data as you need" },
      { text: "Enterprise analytics", tooltip: "Advanced reporting and insights" },
      { text: "Dedicated support", tooltip: "Dedicated account manager" },
      { text: "Custom templates", tooltip: "Create custom templates for your team" },
      { text: "Advanced team features", tooltip: "Role-based permissions and more" },
      { text: "Priority API access", tooltip: "Higher rate limits and priority" },
      { text: "SSO integration", tooltip: "Single sign-on with your identity provider" },
      { text: "Custom integrations", tooltip: "Build custom integrations with our team" },
    ],
    btn: {
      text: "Start with Business",
    },
  },
];

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <HeroSection />
      
      <div id="features">
        <Features />
      </div>

      <div id="testimonials">
        <Testimonials />
      </div>

      <div id="pricing" className="flex min-h-screen items-center justify-center py-12">
        <PricingSection 
          plans={PLANS}
          heading="Plans that Scale with You"
          description="Whether you're just starting out or growing fast, our flexible pricing has you covered — with no hidden costs."
        />
      </div>

      <div id="faqs" className="flex justify-center px-4">
        <Faq />
      </div>

      <div className="block">
        <Footer />
      </div>
    </div>
  );
}