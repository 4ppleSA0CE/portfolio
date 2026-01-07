"use client"

import { useEffect, useState, type RefObject } from "react"

interface UseInViewOptions {
  threshold?: number
  rootMargin?: string
}

export function useInView(ref: RefObject<Element | null>, options: UseInViewOptions = {}): boolean {
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      {
        threshold: options.threshold || 0,
        rootMargin: options.rootMargin || "0px",
      },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [ref, options.threshold, options.rootMargin])

  return isInView
}
