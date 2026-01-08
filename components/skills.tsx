"use client"

import { useRef, useState } from "react"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const skillCategories = {
  Languages: [
    "C++",
    "C",
    "Java",
    "Python",
    "JavaScript",
    "TypeScript",
    "SQL",
    "HTML",
    "CSS",
  ],
  Frameworks: [
    "React",
    "Express",
    "FastAPI",
    "Next.js",
  ],
  "Libraries & Tools": [
    "Node.js",
    "Git",
    "Docker",
    "Tailwind CSS",
    "PyTorch",
    "OpenCV",
  ],
  "DB & Cloud": [
    "PostgreSQL",
    "MongoDB",
    "Vercel",
    "Supabase",
  ],
  Robotics: [
    "ROS2",
    "Foxglove Studio",
    "Motion Planning",
    "Control Systems",
    "Embedded Systems",
    "Path Planning",
  ],
}

export function Skills() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { threshold: 0.2 })
  const [activeTab, setActiveTab] = useState("Libraries & Tools")

  return (
    <section ref={ref} id="skills" className="px-6 pt-6 pb-24 lg:px-24">
      <div className="mx-auto max-w-4xl">
        <h2
          className={cn(
            "mb-12 text-sm font-medium uppercase tracking-widest text-primary transition-all duration-500",
            isInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
          )}
        >
          Tech Skills
        </h2>

        <div
          className={cn(
            "transition-all duration-700",
            isInView ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0",
          )}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8 flex h-auto gap-2 bg-transparent p-0">
              {Object.keys(skillCategories).map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm font-medium transition-all",
                    "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                    "data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground hover:bg-muted/80",
                  )}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(skillCategories).map(([category, skills]) => (
              <TabsContent key={category} value={category} className="mt-0">
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, index) => (
                    <div
                      key={skill}
                      className={cn(
                        "rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-all duration-300",
                        "hover:border-primary hover:bg-primary/10",
                      )}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  )
}

