
import { useState } from 'react'

function AdminLogin({ onLoginSuccess }) {
  const [isSignup, setIsSignup] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      const endpoint = isSignup
        ? 'http://127.0.0.1:8000/admin/register'
        : 'http://127.0.0.1:8000/admin/login'

      const body = isSignup
        ? { username, email, password }
        : { email, password }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.detail || 'Something went wrong')
        return
      }

      if (isSignup) {
        setMessage('Sign Up successful! Please Sign In.')
        setIsSignup(false)
        setUsername('')
        setPassword('')
      } else {
        onLoginSuccess(data.access_token)
      }
    } catch (error) {
      setMessage('Unable to connect to the server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '25px' }}>
      <h2>{isSignup ? 'Admin Sign Up' : 'Admin Sign In'}</h2>

      <form onSubmit={handleSubmit}>
        {isSignup && (
          <div style={{ marginBottom: '15px' }}>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              style={{ width: '100%', padding: '10px' }}
            />
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            style={{ width: '100%', padding: '10px' }}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading
            ? 'Please wait...'
            : isSignup
              ? 'Sign Up'
              : 'Sign In'}
        </button>
      </form>

      {message && <p>{message}</p>}

      <p style={{ marginTop: '20px' }}>
        {isSignup
          ? 'Already have an account?'
          : "Don't have an account?"}
      </p>

      <button
        type="button"
        onClick={() => {
          setIsSignup(!isSignup)
          setMessage('')
          setUsername('')
          setEmail('')
          setPassword('')
        }}
      >
        {isSignup ? 'Sign In' : 'Sign Up'}
      </button>
    </div>
  )
}

export default AdminLogin
