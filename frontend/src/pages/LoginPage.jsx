import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../utils/api"
import { useAuth } from "../hooks/useAuth"

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { login } = useAuth()
  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await api.post("/auth/login", { email, password })
      login(res.data.token, res.data.username)
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-base">
      <div className="bg-surface p-8 rounded-md w-full max-w-md border border-border">
        <h1 className="text-2xl font-bold text-text mb-6">welcome back</h1>

        {error && (
          <div className="bg-danger/10 text-danger p-3 rounded mb-4 text-sm border border-danger/30">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-surface-2 text-text p-3 rounded outline-none focus:ring-2 focus:ring-accent border border-border"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-surface-2 text-text p-3 rounded outline-none focus:ring-2 focus:ring-accent border border-border"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-accent hover:bg-accent-hover text-base p-3 rounded font-semibold disabled:opacity-50 transition-colors"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-text-dim text-sm mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-accent hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage