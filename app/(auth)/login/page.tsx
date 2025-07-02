import Link from "next/link"
import LoginForm from "./login-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="w-100 max-w-md">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Login</CardTitle>
          <CardDescription className="text-gray-300">
            Login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
      <p className="text-sm text-center text-gray-400 mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-blue-400 hover:text-blue-300">
          Create an account
        </Link>
      </p>
    </div>
  )
}
