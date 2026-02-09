import { User, EyeOff, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import { loginUser } from '@/api/auth'
import { encryptData } from '@/utils/crypto'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Spinner } from '../ui/spinner'

export default function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogin() {
    if (!username || !password) {
      toast.warning('Fill both the fields')
      return
    }
    try {
      setIsLoading(true)
      const res = await loginUser({
        Username: username,
        Password: password,
      })

      const encryptedUser = encryptData(res.user)

      localStorage.setItem('user', encryptedUser)
      localStorage.setItem('token', res.token)
      toast.success('Logged In Succesfully')
      setIsLoading(false)
      navigate('/')
    } catch (error) {
      setIsLoading(false)
      console.log(error.message)
      toast.success('Login Failed')
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT PANEL */}
      <div className="relative hidden lg:flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-top"
          style={{
            backgroundImage: "url('/img/authentication/authentication-02.jpg')",
          }}
        />

        <div className="absolute inset-0 bg-linear-to-br from-indigo-500/70 to-blue-500/70" />

        <div className="absolute inset-0 bg-black/10" />

        <div className="relative w-[85%] max-w-lg rounded-2xl bg-white/20 backdrop-blur-lg p-6 text-white">
          <h2 className="text-xl font-semibold mb-4">What&apos;s New on Preskool !!!</h2>

          <div className="space-y-4">
            {[
              {
                title: 'Summer Vacation Holiday Homework',
                desc: 'The school will remain closed from April 20th to June...',
              },
              {
                title: 'New Academic Session Admission Start (2024-25)',
                desc: 'An academic term is a portion of an academic year...',
              },
              {
                title: 'Date sheet Final Exam Nursery to Sr.Kg',
                desc: 'Dear Parents, As the final examination for the session...',
              },
              {
                title: 'Annual Day Function',
                desc: 'Annual functions provide a platform for students...',
              },
              {
                title: 'Summer Vacation Holiday Homework',
                desc: 'The school will remain closed from April 20th to June 15th...',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg bg-white px-4 py-3 text-gray-900"
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-700">{item.desc}</p>
                </div>
                <span className="text-xl text-gray-700">›</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex flex-col items-center justify-center bg-background px-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <img src="/img/logo.svg" alt="logo" className="w-32 dark:hidden" />
            <img src="/img/logo-dark.svg" alt="logo" className="w-32 hidden dark:block" />
          </div>

          {/* Login Card */}
          <Card>
            <CardContent className="p-6">
              <h1 className="text-2xl font-semibold mb-1">Welcome</h1>
              <p className="text-sm text-muted-foreground mb-6">
                Please enter your details to sign in
              </p>

              <div className="space-y-4">
                {/* Username */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">Username</label>
                  <div className="relative">
                    <Input
                      className="pr-10"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <User className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">Password</label>

                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" defaultChecked />
                  <label htmlFor="remember" className="text-sm leading-none">
                    Remember Me
                  </label>
                </div>

                {/* Submit */}
                <Button className="w-full" onClick={handleLogin}>
                  {isLoading ? <Spinner /> : 'Sign In'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Copyright © 2026 - Preskool
          </p>
        </div>
      </div>
    </div>
  )
}
