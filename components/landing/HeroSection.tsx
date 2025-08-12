import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
// import PlaceHolder from "@/public/auth-bg.jpg";
import PlaceHolder from "@/public/auth-bg2.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 md:px-16 lg:px-24">
      {/* Desktop/Tablet Background Image */}
      <Image
        src={PlaceHolder}
        alt="Background"
        fill
        priority
        // className="hidden sm:block absolute inset-0 object-cover brightness-95 grayscale"
        className="hidden sm:block absolute inset-0 object-cover brightness-95"
      />

      {/* Mobile Background Image */}
      <Image
        src={PlaceHolder}
        alt="Mobile Background"
        fill
        priority
        // className="block sm:hidden absolute inset-0 object-cover brightness-95 grayscale"
        className="block sm:hidden absolute inset-0 object-cover brightness-95"
      />

      {/* Gradient Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-100 z-10 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />

      {/* <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/10 z-10" /> */}

      {/* Content */}
      <div className="relative z-20 text-center max-w-5xl mx-auto px-4 sm:px-8">
        {/* Badge */}
        {/* <div className="inline-flex items-center rounded-full border border-border bg-background/70 backdrop-blur-sm px-4 py-2 text-sm text-white mb-8">
          <span className="mr-2">🚀</span>
          Built for developers
        </div> */}

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 px-2 sm:px-0">
          <span className="bg-gradient-to-r from-foreground to-slate-300 bg-clip-text text-transparent">
            Build something
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-500 to-slate-300 bg-clip-text text-transparent">
            extraordinary
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-white/90 max-w-xl mx-auto mb-12 leading-loose drop-shadow-sm">
          Bring your vision to life with a platform designed for bold ideas and
          seamless execution. Build faster, smarter, and with confidence.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Primary button */}
          <Link href="/sign-up" passHref>
            <Button
              size="lg"
              variant="blueHero"
              className="px-8 py-6 text-lg cursor-pointer"
            >
              Start Building
            </Button>
          </Link>
        </div>

        {/* Stats */}

        <div className="flex justify-center items-center gap-12 text-white/90 text-sm mt-20">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-extrabold text-white">10K+</span>
            <span className="uppercase tracking-wide">Users</span>
          </div>
          <div className="h-8 w-px bg-white/30" />
          <div className="flex flex-col items-center">
            <span className="text-3xl font-extrabold text-white">50+</span>
            <span className="uppercase tracking-wide">Countries</span>
          </div>
          <div className="h-8 w-px bg-white/30" />
          <div className="flex flex-col items-center">
            <span className="text-3xl font-extrabold text-white">99.9%</span>
            <span className="uppercase tracking-wide">Uptime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
