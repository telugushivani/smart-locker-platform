import API_BASE_URL from './api'
import { useEffect, useState } from 'react'

function Parcels({ token }) {
  const [parcels, setParcels] = useState([])
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    customer_id: '',
    parcel_description: '',
    width_cm: '',
    height_cm: '',
    depth_cm: ''
  })

  const fetchParcels = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/parcels/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to load parcels')
      }

      const data = await response.json()
      setParcels(data)
    } catch (error) {
      setMessage('Unable to load parcels')
    }
  }

  useEffect(() => {
    fetchParcels()
  }, [token])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    try {
      const response = await fetch(
        `${API_BASE_URL}/parcels/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            customer_id: Number(formData.customer_id),
            parcel_description: formData.parcel_description,
            width_cm: Number(formData.width_cm),
            height_cm: Number(formData.height_cm),
            depth_cm: Number(formData.depth_cm)
          })
        }
      )

      const data = await response.json()

      if (response.ok) {
        setMessage('Parcel registered successfully!')

        setFormData({
          customer_id: '',
          parcel_description: '',
          width_cm: '',
          height_cm: '',
          depth_cm: ''
        })

        await fetchParcels()
      } else {
        setMessage(
          typeof data.detail === 'string'
            ? data.detail
            : JSON.stringify(data.detail)
        )
      }
    } catch (error) {
      setMessage('Unable to register parcel')
    }
  }

  return (
    <div className="page">
      <h2>Parcel Management</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="customer_id"
          type="number"
          placeholder="Customer ID"
          value={formData.customer_id}
          onChange={handleChange}
          required
        />

        <input
          name="parcel_description"
          placeholder="Parcel Description"
          value={formData.parcel_description}
          onChange={handleChange}
          required
        />

        <input
          name="width_cm"
          type="number"
          placeholder="Width (cm)"
          value={formData.width_cm}
          onChange={handleChange}
          required
        />

        <input
          name="height_cm"
          type="number"
          placeholder="Height (cm)"
          value={formData.height_cm}
          onChange={handleChange}
          required
        />

        <input
          name="depth_cm"
          type="number"
          placeholder="Depth (cm)"
          value={formData.depth_cm}
          onChange={handleChange}
          required
        />

        <button type="submit">Register Parcel</button>
      </form>

      {message && <p>{message}</p>}

      <h3>All Parcels</h3>

      <div className="parcel-list">
        {parcels.map((parcel) => (
          <div className="parcel-card" key={parcel.parcel_id}>
            <p><strong>Parcel ID:</strong> {parcel.parcel_id}</p>
            <p><strong>Tracking Number:</strong> {parcel.tracking_number}</p>
            <p><strong>Customer ID:</strong> {parcel.customer_id}</p>
            <p><strong>Description:</strong> {parcel.parcel_description}</p>
            <p>
              <strong>Compartment ID:</strong>{' '}
              {parcel.compartment_id ?? 'Not allocated'}
            </p>
            <p><strong>Status:</strong> {parcel.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Parcels
