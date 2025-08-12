"use client";

import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const testimonials = [
  {
    id: "testimonial-1",
    text: "Before using this platform, our team was overwhelmed with manual processes. Now, everything is organized, fast, and incredibly easy to manage.",
    name: "Emily Carter",
    role: "Product Manager",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp",
  },
  {
    id: "testimonial-2",
    text: "Simple, efficient, and reliable. This tool helped us automate the boring stuff so we can actually focus on growing our business.",
    name: "Michael Reynolds",
    role: "CEO & Founder",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp",
  },
  {
    id: "testimonial-3",
    text: "We've saved time, reduced errors, and the AI suggestions are a game-changer. Plus, the support team is always there when we need them.",
    name: "Sarah Mitchell",
    role: "Marketing Director",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp",
  },
];

const Testimonials = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const updateCurrent = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", updateCurrent);
    return () => {
      api.off("select", updateCurrent);
    };
  }, [api]);

  return (
    <section className="py-40">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            What Our Users Say
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Join thousands of satisfied customers who have transformed their workflow
          </p>
        </div>

        {/* Carousel */}
        <div className="max-w-5xl mx-auto">
          <Carousel setApi={setApi} className="cursor-pointer">
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="select-none">
                  <div className="flex flex-col items-center text-center px-4 md:px-8">
                    {/* Quote Icon */}
                    <div className="mb-6 text-primary/30">
                      <svg
                        className="w-12 h-12 md:w-16 md:h-16"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>

                    {/* Testimonial Text */}
                    <blockquote className="mb-8 max-w-4xl text-lg md:text-xl lg:text-2xl font-medium leading-relaxed text-foreground/90">
                      {testimonial.text}
                    </blockquote>

                    {/* Avatar and Info */}
                    <div className="flex flex-col items-center">
                      <Avatar className="mb-4 size-16 md:size-20 ring-4 ring-primary/10 transition-all duration-300 hover:ring-primary/20">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary/20 to-primary/10">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="text-lg md:text-xl font-semibold text-foreground">
                          {testimonial.name}
                        </p>
                        <p className="text-sm md:text-base text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Navigation Dots */}
          <div className="flex justify-center items-center mt-12 space-x-2">
            {testimonials.map((testimonial, index) => (
              <Button
                key={testimonial.id}
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-transparent"
                onClick={() => {
                  api?.scrollTo(index);
                }}
              >
                <div
                  className={`size-3 rounded-full transition-all duration-300 ${
                    index === current 
                      ? "bg-primary scale-125 shadow-lg shadow-primary/30" 
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              </Button>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center items-center mt-8 space-x-3 text-muted-foreground">
            <span className="text-sm md:text-base font-medium px-3 py-1 rounded-full bg-muted/50 backdrop-blur-sm border border-border/50">
              Swipe to explore more
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Testimonials };