import Link from "next/link"
import RegisterForm from "./register-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function RegisterPage() {
  return (
    <div className="w-100 max-w-md">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">
            Register
          </CardTitle>
          <CardDescription className="text-gray-300">
            Create an account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
      <p className="text-sm text-center text-gray-400 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-400 hover:text-blue-300">
          Login
        </Link>
      </p>
    </div>
  )
}
