
import { useEffect, useState } from 'react'

function Compartments({ token }) {
  const [compartments, setCompartments] = useState([])

  const [form, setForm] = useState({
    compartment_id: '',
    station_id: '',
    compartment_size: 'SMALL',
    status: 'AVAILABLE',
    width_cm: '',
    height_cm: '',
    depth_cm: ''
  })

  const loadCompartments = async () => {
    try {
      const response = await fetch(
        'http://127.0.0.1:8000/compartments/',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to load compartments')
      }

      const data = await response.json()
      setCompartments(data)
    } catch (error) {
      console.error('Error loading compartments:', error)
    }
  }

  useEffect(() => {
    loadCompartments()
  }, [token])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/compartments/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            compartment_id: Number(form.compartment_id),
            station_id: Number(form.station_id),
            width_cm: Number(form.width_cm),
            height_cm: Number(form.height_cm),
            depth_cm: Number(form.depth_cm)
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(JSON.stringify(data))
        return
      }

      alert('Compartment created successfully!')

      setForm({
        compartment_id: '',
        station_id: '',
        compartment_size: 'SMALL',
        status: 'AVAILABLE',
        width_cm: '',
        height_cm: '',
        depth_cm: ''
      })

      loadCompartments()
    } catch (error) {
      alert('Unable to connect to backend')
      console.error(error)
    }
  }

  return (
    <div>
      <h2>Add Compartment</h2>

      <form className="customer-form" onSubmit={handleSubmit}>
        <input name="compartment_id" type="number" placeholder="Compartment ID"
          value={form.compartment_id} onChange={handleChange} required />

        <input name="station_id" type="number" placeholder="Station ID"
          value={form.station_id} onChange={handleChange} required />

        <select name="compartment_size" value={form.compartment_size}
          onChange={handleChange}>
          <option value="SMALL">SMALL</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LARGE">LARGE</option>
        </select>

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="AVAILABLE">AVAILABLE</option>
          <option value="BLOCKED">BLOCKED</option>
          <option value="MAINTENANCE">MAINTENANCE</option>
          <option value="INACTIVE">INACTIVE</option>
          <option value="RESERVED">RESERVED</option>
          <option value="OCCUPIED">OCCUPIED</option>
        </select>

        <input name="width_cm" type="number" placeholder="Width (cm)"
          value={form.width_cm} onChange={handleChange} required />

        <input name="height_cm" type="number" placeholder="Height (cm)"
          value={form.height_cm} onChange={handleChange} required />

        <input name="depth_cm" type="number" placeholder="Depth (cm)"
          value={form.depth_cm} onChange={handleChange} required />

        <button type="submit">Add Compartment</button>
      </form>

      <h2>All Compartments</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Station ID</th>
            <th>Size</th>
            <th>Status</th>
            <th>Width</th>
            <th>Height</th>
            <th>Depth</th>
          </tr>
        </thead>

        <tbody>
          {compartments.map((item) => (
            <tr key={item.compartment_id}>
              <td>{item.compartment_id}</td>
              <td>{item.station_id}</td>
              <td>{item.compartment_size}</td>
              <td>{item.status}</td>
              <td>{item.width_cm} cm</td>
              <td>{item.height_cm} cm</td>
              <td>{item.depth_cm} cm</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Compartments
