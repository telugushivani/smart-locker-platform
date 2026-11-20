
import { useState } from 'react'

function ParcelEventHistory({ adminToken }) {
  const [parcelId, setParcelId] = useState('')
  const [history, setHistory] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchHistory = async () => {
    if (!parcelId.trim()) {
      setMessage('Please enter a parcel ID')
      return
    }

    if (!adminToken) {
      setMessage('Please sign in as admin first')
      return
    }

    setLoading(true)
    setMessage('')
    setHistory(null)

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/parcel-events/${parcelId}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Unable to fetch parcel history')
      }

      setHistory(data)
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <h2>Parcel Event History</h2>

      <div>
        <input
          type="number"
          min="1"
          placeholder="Enter Parcel ID"
          value={parcelId}
          onChange={(e) => setParcelId(e.target.value)}
        />

        <button onClick={fetchHistory} disabled={loading}>
          {loading ? 'Loading...' : 'Search History'}
        </button>
      </div>

      {message && <p>{message}</p>}

      {history && (
        <div>
          <h3>Parcel ID: {history.parcel_id}</h3>
          <p>Total Events: {history.total_events}</p>

          {history.events.map((event, index) => (
            <div key={`${event.event_type}-${index}`}>
              <h4>{event.event_type}</h4>
              <p>Tracking Number: {event.tracking_number}</p>
              <p>Status: {event.details.status}</p>
              <p>
                Compartment: {event.details.compartment_id ?? 'Not assigned'}
              </p>
              <p>
                Date: {new Date(event.created_at).toLocaleString()}
              </p>
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ParcelEventHistory
