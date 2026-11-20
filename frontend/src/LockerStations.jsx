
import { useEffect, useState } from 'react'

function LockerStations({ token }) {
  const [stations, setStations] = useState([])

  const [form, setForm] = useState({
    station_id: '',
    station_name: '',
    location: '',
    operating_hours: '',
    total_compartments: '',
    operational_status: 'ACTIVE',
    connectivity_status: 'OFFLINE'
  })

  const loadStations = async () => {
    try {
      const response = await fetch(
        'http://127.0.0.1:8000/locker-stations/',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to load stations')
      }

      const data = await response.json()
      setStations(data)
    } catch (error) {
      console.error('Error loading stations:', error)
    }
  }

  useEffect(() => {
    loadStations()
  }, [token])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/locker-stations/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            station_id: Number(form.station_id),
            total_compartments: Number(form.total_compartments)
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(JSON.stringify(data))
        return
      }

      alert('Locker station created successfully!')

      setForm({
        station_id: '',
        station_name: '',
        location: '',
        operating_hours: '',
        total_compartments: '',
        operational_status: 'ACTIVE',
        connectivity_status: 'OFFLINE'
      })

      loadStations()
    } catch (error) {
      alert('Unable to connect to backend')
      console.error(error)
    }
  }

  return (
    <div>
      <h2>Add Locker Station</h2>

      <form className="customer-form" onSubmit={handleSubmit}>
        <input name="station_id" type="number" placeholder="Station ID"
          value={form.station_id} onChange={handleChange} required />

        <input name="station_name" placeholder="Station Name"
          value={form.station_name} onChange={handleChange} required />

        <input name="location" placeholder="Location"
          value={form.location} onChange={handleChange} required />

        <input name="operating_hours" placeholder="Operating Hours"
          value={form.operating_hours} onChange={handleChange} required />

        <input name="total_compartments" type="number"
          placeholder="Total Compartments"
          value={form.total_compartments} onChange={handleChange} required />

        <select name="operational_status"
          value={form.operational_status} onChange={handleChange}>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
          <option value="MAINTENANCE">MAINTENANCE</option>
        </select>

        <select name="connectivity_status"
          value={form.connectivity_status} onChange={handleChange}>
          <option value="ONLINE">ONLINE</option>
          <option value="OFFLINE">OFFLINE</option>
        </select>

        <button type="submit">Add Locker Station</button>
      </form>

      <h2>All Locker Stations</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Station Name</th>
            <th>Location</th>
            <th>Compartments</th>
            <th>Operational Status</th>
            <th>Connectivity</th>
          </tr>
        </thead>

        <tbody>
          {stations.map((station) => (
            <tr key={station.station_id}>
              <td>{station.station_id}</td>
              <td>{station.station_name}</td>
              <td>{station.location}</td>
              <td>{station.total_compartments}</td>
              <td>{station.operational_status}</td>
              <td>{station.connectivity_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LockerStations
