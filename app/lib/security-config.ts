export const SECURITY_CONFIG = {
  PASSWORD: {
    MIN_LENGTH: 12,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true,
    MIN_SCORE: 4,
  },

  // Argon2 Configuration
  ARGON2: {
    TYPE: "argon2id",
    MEMORY_COST: 2 ** 17, // 128MB
    TIME_COST: 4,
    PARALLELISM: 1,
  },

  // Session Security
  SESSION: {
    MAX_AGE: 24 * 60 * 60,
    SECURE_COOKIES: process.env.NODE_ENV === "production",
    HTTP_ONLY: true,
    SAME_SITE: "strict" as const,
  },

  // Input Validation
  INPUT: {
    MAX_NAME_LENGTH: 50,
    MAX_EMAIL_LENGTH: 254,
    ALLOWED_NAME_CHARS: /^[a-zA-ZÀ-ÿ\s]+$/,
  },

  // Logging
  LOGGING: {
    ENABLE_SECURITY_LOGS: true,
    LOG_LEVEL: process.env.NODE_ENV === "production" ? "warn" : "info",
  },

  // Environment-specific settings
  ENVIRONMENT: {
    IS_PRODUCTION: process.env.NODE_ENV === "production",
    IS_DEVELOPMENT: process.env.NODE_ENV === "development",
    IS_TEST: process.env.NODE_ENV === "test",
  },
} as const

export const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
} as const
