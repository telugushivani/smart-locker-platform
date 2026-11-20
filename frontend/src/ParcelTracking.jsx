
import API_BASE_URL from './api'
import { useState } from 'react'

function ParcelTracking() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [parcel, setParcel] = useState(null)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setParcel(null)
    setMessage('')

    try {
      const response = await fetch(
        `${API_BASE_URL}/parcels/track/${encodeURIComponent(trackingNumber)}`,
      )

      const data = await response.json()

      if (response.ok) {
        setParcel(data)
      } else {
        setMessage(data.detail || 'Parcel not found')
      }
    } catch (error) {
      setMessage('Unable to connect to the server')
    }
  }

  return (
    <div className="page">
      <h2>Track Your Parcel</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Tracking Number"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          required
        />

        <button type="submit">Track Parcel</button>
      </form>

      {message && <p>{message}</p>}

      {parcel && (
        <div className="parcel-card">
          <h3>Parcel Details</h3>
          <p><strong>Tracking Number:</strong> {parcel.tracking_number}</p>
          <p><strong>Description:</strong> {parcel.parcel_description}</p>
          <p><strong>Status:</strong> {parcel.status}</p>
          <p>
            <strong>Collection Deadline:</strong>{' '}
            {parcel.collection_deadline
              ? new Date(parcel.collection_deadline).toLocaleString()
              : 'Not available'}
          </p>
        </div>
      )}
    </div>
  )
}

export default ParcelTracking
