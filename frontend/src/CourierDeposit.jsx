import API_BASE_URL from './api'
import { useState } from 'react'

function CourierDeposit({ token }) {
  const [parcelId, setParcelId] = useState('')
  const [result, setResult] = useState(null)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setResult(null)
    setMessage('')

    if (!token) {
      setMessage('Please sign in as admin first')
      return
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/courier/parcels/${parcelId}/deposit`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (response.ok) {
        setResult(data)
        setMessage('Parcel deposited successfully!')
        setParcelId('')
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
      <h2>Courier Deposit</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Enter Parcel ID"
          value={parcelId}
          onChange={(e) => setParcelId(e.target.value)}
          required
        />

        <button type="submit">Deposit Parcel</button>
      </form>

      {message && <p>{message}</p>}

      {result && (
        <div className="parcel-card">
          <h3>Deposit Details</h3>
          <p><strong>Parcel ID:</strong> {result.parcel_id}</p>
          <p><strong>Tracking Number:</strong> {result.tracking_number}</p>
          <p><strong>Compartment ID:</strong> {result.compartment_id}</p>
          <p><strong>Status:</strong> {result.status}</p>
          <p><strong>Collection Deadline:</strong> {result.collection_deadline}</p>
          <p><strong>Development OTP:</strong> {result.development_otp}</p>
        </div>
      )}
    </div>
  )
}

export default CourierDeposit
