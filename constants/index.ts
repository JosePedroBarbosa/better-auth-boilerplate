import Logo from "@/public/logo.svg";

// application name
export const appName = "Next Project";

// application description
export const description = "Next Project Description";

// Logo configuration
export const logoConfig = {
  url: "/",
  src: Logo,
  alt: "logo",
  title: appName,
};

// Menu items configuration
export const menuItems = [
  { title: "Home", url: "/" },
  {
    title: "Features",
    url: "#features",
  },
  {
    title: "Testimonials",
    url: "#testimonials",
  },
  {
    title: "Pricing",
    url: "#pricing",
  },
  {
    title: "FAQs",
    url: "#faqs",
  },
];

// Authentication configuration
export const authConfig = {
  login: { title: "Sign In", url: "/sign-in" },
  signup: { title: "Get Started", url: "/sign-up" },
};