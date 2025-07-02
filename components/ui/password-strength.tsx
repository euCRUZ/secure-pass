"use client"

import { useState, useEffect } from "react"
import { validatePasswordStrength } from "@/app/lib/security"

interface PasswordStrengthProps {
  password: string
  className?: string
}

const PasswordStrength = ({
  password,
  className = "",
}: PasswordStrengthProps) => {
  const [strength, setStrength] = useState<{
    isValid: boolean
    score: number
    feedback: string[]
  }>({ isValid: false, score: 0, feedback: [] })

  useEffect(() => {
    if (password.length > 0) {
      const validation = validatePasswordStrength(password)
      setStrength(validation)
    } else {
      setStrength({ isValid: false, score: 0, feedback: [] })
    }
  }, [password])

  const getStrengthColor = (score: number) => {
    if (score >= 6) return "bg-green-500"
    if (score >= 4) return "bg-yellow-500"
    if (score >= 2) return "bg-orange-500"
    return "bg-red-500"
  }

  const getStrengthText = (score: number) => {
    if (score >= 6) return "Very Strong"
    if (score >= 4) return "Strong"
    if (score >= 2) return "Medium"
    return "Weak"
  }

  if (password.length === 0) return null

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Barra de força */}
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(
              strength.score
            )}`}
            style={{ width: `${Math.min((strength.score / 6) * 100, 100)}%` }}
          />
        </div>
        <span className="text-xs font-medium text-gray-600 min-w-[80px]">
          {getStrengthText(strength.score)}
        </span>
      </div>

      {/* Feedback */}
      {strength.feedback.length > 0 && (
        <div className="space-y-1">
          {strength.feedback.map((feedback, index) => (
            <p
              key={index}
              className={`text-xs ${
                strength.isValid ? "text-green-600" : "text-red-500"
              }`}
            >
              • {feedback}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export default PasswordStrength
