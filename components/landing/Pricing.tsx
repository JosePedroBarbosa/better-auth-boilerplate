"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircleIcon, StarIcon, Loader2, Zap } from "lucide-react";
import { motion, Transition } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getActiveSubscription } from "@/app/(dashboard)/dashboard/account/subscriptions/_actions/server";

type FREQUENCY = "monthly" | "yearly";
const frequencies: FREQUENCY[] = ["monthly", "yearly"];

interface Plan {
  name: string;
  info: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: {
    text: string;
    tooltip?: string;
  }[];
  btn: {
    text: string;
  };
  highlighted?: boolean;
  trial?: {
    days: number;
  };
  limits: {
    projects: number;
    storage: number;
  };
}

interface PricingSectionProps extends React.ComponentProps<"div"> {
  plans: Plan[];
  heading: string;
  description?: string;
}

export function PricingSection({
  plans,
  heading,
  description,
  ...props
}: PricingSectionProps) {
  const [frequency, setFrequency] = React.useState<"monthly" | "yearly">(
    "monthly"
  );
  const [activePlan, setActivePlan] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchActiveSubscription() {
      try {
        const data = await getActiveSubscription();
        setActivePlan(data?.subscription?.plan ?? null);
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchActiveSubscription();
  }, []);

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center space-y-5 p-4 overflow-hidden",
        props.className
      )}
      {...props}
    >
      <div className="mx-auto max-w-xl space-y-2">
        <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
          {heading}
        </h2>
        {description && (
          <p className="text-muted-foreground text-center text-sm md:text-base">
            {description}
          </p>
        )}
      </div>
      
      <div className="mb-8">
        <PricingFrequencyToggle
          frequency={frequency}
          setFrequency={setFrequency}
        />
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-2 sm:px-4 md:grid-cols-3 lg:gap-6">
          {plans.map((plan) => (
            <PricingCard
              plan={plan}
              key={plan.name}
              frequency={frequency}
              activePlan={activePlan}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type PricingFrequencyToggleProps = React.ComponentProps<"div"> & {
  frequency: FREQUENCY;
  setFrequency: React.Dispatch<React.SetStateAction<FREQUENCY>>;
};

export function PricingFrequencyToggle({
  frequency,
  setFrequency,
  ...props
}: PricingFrequencyToggleProps) {
  return (
    <div
      className={cn(
        "bg-muted/30 mx-auto flex w-fit rounded-full border p-1",
        props.className
      )}
      {...props}
    >
      {frequencies.map((freq) => (
        <button
          key={freq}
          onClick={() => setFrequency(freq)}
          className="relative px-4 py-1 text-sm capitalize cursor-pointer"
        >
          <span className="relative z-10">{freq}</span>
          {frequency === freq && (
            <motion.span
              layoutId="frequency"
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-foreground absolute inset-0 z-10 rounded-full mix-blend-difference"
            />
          )}
        </button>
      ))}
    </div>
  );
}

type PricingCardProps = React.ComponentProps<"div"> & {
  plan: Plan;
  frequency?: FREQUENCY;
  activePlan?: string | null;
};

export function PricingCard({
  plan,
  className,
  frequency = frequencies[0],
  activePlan,
  ...props
}: PricingCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const isCurrentPlan = plan.name.toLowerCase() === activePlan;
  const isFreePlan = plan.name.toLowerCase() === "free";
  const hasDiscount = frequency === "yearly" && plan.price.yearly < plan.price.monthly * 12;
  const discountPercentage = hasDiscount 
    ? Math.round(((plan.price.monthly * 12 - plan.price.yearly) / (plan.price.monthly * 12)) * 100)
    : 0;
  
  // Fix decimal precision for save amount
  const saveAmount = hasDiscount 
    ? parseFloat((plan.price.monthly * 12 - plan.price.yearly).toFixed(2))
    : 0;

  const handleSubscription = async (planName: string, frequency: FREQUENCY) => {
    if (!session) {
      router.push("/sign-in");
      return;
    }

    if (isCurrentPlan) {
      router.push("/dashboard/account/subscriptions");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authClient.subscription.upgrade({
        plan: planName.toLowerCase(),
        annual: frequency === "yearly",
        referenceId: session?.user.id,
        successUrl: "/dashboard/account/subscriptions?success=true",
        cancelUrl: "/dashboard/account/subscriptions?canceled=true",
        disableRedirect: false,
      });

      if (response?.data && 'url' in response.data && response.data.url) {
        window.location.href = response.data.url;
      } else {
        router.push("/dashboard/account/subscriptions");
      }
    } catch (error) {
      console.error("Error during subscription upgrade:", error);
      toast.error("Failed to update subscription. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      key={plan.name}
      className={cn(
        "relative flex w-full flex-col rounded-lg border transition-all duration-200 hover:shadow-lg",
        // Responsive scaling adjustments
        plan.highlighted && "shadow-lg md:scale-105 transform-gpu",
        // Ensure proper mobile layout
        "min-w-0 max-w-full",
        className
      )}
      {...props}
    >
      {plan.highlighted && (
        <BorderTrail
          style={{
            boxShadow:
              "0px 0px 60px 30px rgb(255 255 255 / 50%), 0 0 100px 60px rgb(0 0 0 / 50%), 0 0 140px 90px rgb(0 0 0 / 50%)",
          }}
          size={100}
        />
      )}
      
      <div
        className={cn(
          "bg-muted/20 rounded-t-lg border-b p-4 relative",
          plan.highlighted && "bg-muted/40"
        )}
      >
        <div className={cn(
          "absolute top-2 right-2 z-10 flex items-center gap-1 sm:gap-2",
          hasDiscount && plan.highlighted && "top-1",
          hasDiscount && plan.trial && "flex-wrap justify-end"
        )}>
          {hasDiscount && (
            <Badge variant="destructive" className={cn(
              "text-xs px-1.5 py-0.5 sm:px-2 sm:py-1",
              // Add margin top when there are other badges above
              (plan.highlighted || plan.trial) && "mt-1"
            )}>
              {discountPercentage}% off
            </Badge>
          )}
        </div>

        <div className="text-lg font-medium pr-16 sm:pr-20">{plan.name}</div>
        <p className="text-muted-foreground text-sm font-normal pr-8 sm:pr-12">{plan.info}</p>
        
        <h3 className="mt-2 flex items-end gap-1">
          <span className="text-2xl sm:text-3xl font-bold">
            {isFreePlan ? "Free" : `$${plan.price[frequency]}`}
          </span>
          {!isFreePlan && (
            <span className="text-muted-foreground text-sm">
              /{frequency === "monthly" ? "month" : "year"}
            </span>
          )}
        </h3>
        
        {hasDiscount && (
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            <span className="line-through">${plan.price.monthly * 12}/year</span>
            <span className="ml-2 text-green-600 font-medium">
              Save ${saveAmount}
            </span>
          </p>
        )}
      </div>
      
      <div
        className={cn(
          "text-muted-foreground space-y-3 sm:space-y-4 px-4 py-4 sm:py-6 text-sm flex-1",
          plan.highlighted && "bg-muted/10"
        )}
      >
        {/* Plan Limits */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4 p-2 sm:p-3 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-base sm:text-lg font-bold text-primary">
              {plan.limits.projects === -1 ? "∞" : plan.limits.projects}
            </div>
            <div className="text-xs text-muted-foreground">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-base sm:text-lg font-bold text-primary">
              {plan.limits.storage === -1 ? "∞" : `${plan.limits.storage}GB`}
            </div>
            <div className="text-xs text-muted-foreground">Storage</div>
          </div>
        </div>
        
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-2">
            <CheckCircleIcon className="text-foreground h-4 w-4 flex-shrink-0 mt-0.5" />
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <p
                    className={cn(
                      "text-xs sm:text-sm leading-relaxed",
                      feature.tooltip && "cursor-pointer border-b border-dashed"
                    )}
                  >
                    {feature.text}
                  </p>
                </TooltipTrigger>
                {feature.tooltip && (
                  <TooltipContent>
                    <p>{feature.tooltip}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </div>
      
      <div
        className={cn(
          "mt-auto w-full border-t p-3",
          plan.highlighted && "bg-muted/40"
        )}
      >
        <Button
          className="w-full cursor-pointer text-sm"
          variant={plan.highlighted ? "default" : "outline"}
          disabled={isCurrentPlan || isLoading}
          onClick={() => handleSubscription(plan.name, frequency)}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : isCurrentPlan ? (
            "Current Plan"
          ) : isFreePlan ? (
            "Get Started"
          ) : (
            plan.btn.text
          )}
        </Button>
      </div>
    </div>
  );
}

type BorderTrailProps = {
  className?: string;
  size?: number;
  transition?: Transition;
  delay?: number;
  onAnimationComplete?: () => void;
  style?: React.CSSProperties;
};

export function BorderTrail({
  className,
  size = 60,
  transition,
  delay,
  onAnimationComplete,
  style,
}: BorderTrailProps) {
  const BASE_TRANSITION: Transition = {
    repeat: Infinity,
    duration: 5,
    ease: "linear" as const,
  };
  return (
    <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]">
      <motion.div
        className={cn("absolute aspect-square bg-zinc-500", className)}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          ...style,
        }}
        animate={{
          offsetDistance: ["0%", "100%"],
        }}
        transition={{
          ...(transition ?? BASE_TRANSITION),
          delay: delay,
        }}
        onAnimationComplete={onAnimationComplete}
      />
    </div>
  );
}