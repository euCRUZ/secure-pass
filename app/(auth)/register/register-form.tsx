"use client"

import { useActionState, useState } from "react"
import registerAction from "@/app/dal/user"
import Form from "next/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa"
import { z } from "zod"
import { registerSchema, type RegisterFormData } from "@/app/lib/validation"
import PasswordStrength from "@/components/ui/password-strength"

type FieldErrors = {
  name?: string
  email?: string
  password?: string
}

const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(registerAction, null)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const validateField = (field: keyof RegisterFormData, value: string) => {
    try {
      const fieldSchema = registerSchema.shape[field]
      fieldSchema.parse(value)
      return undefined
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors[0].message
      }
      return "Invalid field"
    }
  }

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (touched[field]) {
      const fieldError = validateField(field, value)
      setErrors((prev) => ({ ...prev, [field]: fieldError }))
    }
  }

  const handleBlur = (field: keyof RegisterFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const fieldError = validateField(field, formData[field])
    setErrors((prev) => ({ ...prev, [field]: fieldError }))
  }

  const getInputClassName = (field: keyof RegisterFormData) => {
    const baseClass =
      "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    if (touched[field] && errors[field]) {
      return `${baseClass} border-red-500 focus:ring-red-500`
    }
    if (touched[field] && !errors[field]) {
      return `${baseClass} border-green-500 focus:ring-green-500`
    }
    return baseClass
  }

  const isFormValid = () => {
    try {
      registerSchema.parse(formData)
      return true
    } catch {
      return false
    }
  }

  return (
    <>
      {state?.success === "false" && (
        <div
          className="flex flex-col mb-6 text-sm bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative"
          role="alert"
        >
          <strong className="font-bold">Error</strong>
          <span className="block sm:inline">{state.message}</span>
        </div>
      )}
      <Form action={formAction} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="name" className="text-sm font-medium text-white">
            Name
          </Label>
          <Input
            id="name"
            type="text"
            name="name"
            required
            maxLength={50}
            placeholder="Your Name"
            className={getInputClassName("name")}
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
          />
          {formData.name.length > 0 && (
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{formData.name.length}/50 characters</span>
            </div>
          )}
          {touched.name && errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="email" className="text-sm font-medium text-white">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            name="email"
            required
            maxLength={254}
            placeholder="your@email.com"
            className={getInputClassName("email")}
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
          />
          {formData.email.length > 0 && (
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{formData.email.length}/254 characters</span>
            </div>
          )}
          {touched.email && errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="password" className="text-sm font-medium text-white">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              required
              placeholder=""
              className={getInputClassName("password") + " pr-12"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              onBlur={() => handleBlur("password")}
              maxLength={128}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
              onClick={handleShowPassword}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          
          {formData.password.length > 0 && (
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{formData.password.length}/128 characters</span>
            </div>
          )}
          
          <PasswordStrength password={formData.password} className="mt-2" />

          {touched.password && errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        <div className="pt-2">
          <Button
            disabled={isPending || !isFormValid()}
            className={`w-full py-3 px-4 font-medium rounded-md transition-colors duration-200 ${
              isFormValid() && !isPending
                ? "bg-white hover:bg-gray-200 text-black cursor-pointer"
                : "bg-gray-400 text-gray-600 cursor-not-allowed"
            }`}
            type="submit"
          >
            {isPending ? (
              <div className="flex items-center justify-center space-x-2">
                <FaSpinner className="animate-spin" />
                <span>Registering...</span>
              </div>
            ) : (
              "Register"
            )}
          </Button>
        </div>
      </Form>
    </>
  )
}

export default RegisterForm
