"use client"

import { useEffect, useState } from "react"

interface UseTypingOptions {
  speed?: number // milliseconds per character
  delay?: number // delay before starting (milliseconds)
  showCursor?: boolean // whether to show a blinking cursor
  cursorChar?: string // character to use as cursor
}

interface UseTypingReturn {
  text: string
  isTyping: boolean
}

export function useTyping(
  text: string,
  options: UseTypingOptions = {}
): UseTypingReturn {
  const {
    speed = 50,
    delay = 0,
    cursorChar = "|",
  } = options

  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (!text) return

    // Start typing after delay
    const startTimeout = setTimeout(() => {
      setIsTyping(true)
      setDisplayedText("")
    }, delay)

    return () => clearTimeout(startTimeout)
  }, [text, delay])

  useEffect(() => {
    if (!isTyping || !text) return

    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        setIsTyping(false)
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [isTyping, text, speed])

  return { text: displayedText, isTyping }
}
