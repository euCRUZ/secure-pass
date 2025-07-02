export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .replace(/data:/gi, "")
    .replace(/vbscript:/gi, "")
    .replace(/expression\(/gi, "")
    .replace(/url\(/gi, "")
    .replace(/eval\(/gi, "")
    .replace(/document\./gi, "")
    .replace(/window\./gi, "")
    .replace(/alert\(/gi, "")
    .replace(/confirm\(/gi, "")
    .replace(/prompt\(/gi, "")
    .replace(/\s+/g, " ")
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

export function validatePasswordStrength(password: string): {
  isValid: boolean
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0

  if (password.length >= 12) {
    score += 2
  } else if (password.length >= 8) {
    score += 1
    feedback.push(
      "Password must be at least 12 characters for greater security"
    )
  } else {
    feedback.push("Password is too short")
  }

  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push("Add at least one uppercase letter")
  }

  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push("Add at least one lowercase letter")
  }

  if (/\d/.test(password)) {
    score += 1
  } else {
    feedback.push("Add at least one number")
  }

  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 2
  } else {
    feedback.push("Add special characters for greater security")
  }

  const commonPatterns = [
    "123456",
    "password",
    "qwerty",
    "admin",
    "letmein",
    "welcome",
    "monkey",
    "dragon",
    "master",
    "football",
    "baseball",
    "superman",
    "batman",
    "spiderman",
    "1234567890",
    "12345678901234567890",
  ]

  const hasCommonPattern = commonPatterns.some((pattern) =>
    password.toLowerCase().includes(pattern)
  )

  if (hasCommonPattern) {
    score -= 2
    feedback.push("Avoid common password patterns")
  }

  if (/(.)\1{2,}/.test(password)) {
    score -= 1
    feedback.push("Avoid repeated characters")
  }

  const isValid = score >= 4 && password.length >= 12

  return {
    isValid,
    score: Math.max(0, score),
    feedback: feedback.length > 0 ? feedback : ["Strong password!"],
  }
}

export function isSuspiciousEmail(email: string): boolean {
  const suspiciousPatterns = [
    /^test@/i,
    /^admin@/i,
    /^root@/i,
    /^user@/i,
    /^demo@/i,
    /^example@/i,
    /^temp@/i,
    /^fake@/i,
    /^spam@/i,
    /^bot@/i,
    /^noreply@/i,
  ]

  return suspiciousPatterns.some((pattern) => pattern.test(email))
}

export function isSuspiciousName(name: string): boolean {
  const suspiciousPatterns = [
    /^test$/i,
    /^admin$/i,
    /^root$/i,
    /^user$/i,
    /^demo$/i,
    /^example$/i,
    /^temp$/i,
    /^fake$/i,
    /^spam$/i,
    /^<script/i,
    /javascript:/i,
    /^sql$/i,
    /^xss$/i,
  ]

  return suspiciousPatterns.some((pattern) => pattern.test(name))
}
