
import { useState } from 'react'

function ParcelCollection() {
  const [parcelId, setParcelId] = useState('')
  const [otp, setOtp] = useState('')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setResult(null)

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/customers/parcels/${parcelId}/collect`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            otp: otp
          })
        }
      )

      const data = await response.json()

      if (response.ok) {
        setMessage('Parcel collected successfully!')
        setResult(data)
        setParcelId('')
        setOtp('')
      } else {
        setMessage(
          typeof data.detail === 'string'
            ? data.detail
            : JSON.stringify(data.detail)
        )
      }
    } catch (error) {
      setMessage('Unable to connect to the server')
    }
  }

  return (
    <div className="page">
      <h2>Customer Parcel Collection</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Enter Parcel ID"
          value={parcelId}
          onChange={(e) => setParcelId(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button type="submit">Collect Parcel</button>
      </form>

      {message && <p>{message}</p>}

      {result && (
        <div className="parcel-card">
          <h3>Collection Details</h3>
          <p><strong>Parcel ID:</strong> {result.parcel_id}</p>
          <p><strong>Status:</strong> {result.status}</p>
          <p><strong>Message:</strong> {result.message}</p>
        </div>
      )}
    </div>
  )
}

export default ParcelCollection
