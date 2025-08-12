"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Sun, Moon, Sunrise, Sunset } from "lucide-react";
interface DashboardWelcomeProps {
  userName: string;
}

function getTimeOfDayGreeting(): { greeting: string; icon: typeof Sun } {
  const hour = new Date().getHours();

  if (hour < 6) {
    return { greeting: "Good night", icon: Moon };
  } else if (hour < 12) {
    return { greeting: "Good morning", icon: Sunrise };
  } else if (hour < 18) {
    return { greeting: "Good afternoon", icon: Sun };
  } else {
    return { greeting: "Good evening", icon: Sunset };
  }
}

function getCurrentDate(): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

export function DashboardWelcome({ userName }: DashboardWelcomeProps) {
  const { greeting, icon: TimeIcon } = getTimeOfDayGreeting();
  const currentDate = getCurrentDate();

  return (
    <Card className="bg-transparent">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TimeIcon className="h-5 w-5 text-yellow-500 dark:text-yellow-500" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                {greeting}, {userName}!
              </h1>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <p className="text-sm">{currentDate}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}