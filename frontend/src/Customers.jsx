import API_BASE_URL from './api'
import { useEffect, useState } from 'react'

function Customers({ token }) {
  const [customers, setCustomers] = useState([])

  const [form, setForm] = useState({
    customer_id: '',
    full_name: '',
    email: '',
    phone_number: ''
  })

  const loadCustomers = async () => {
    try {
      const response = await fetch(
  `${API_BASE_URL}/customers/`,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
)

      if (!response.ok) {
        throw new Error('Failed to load customers')
      }

      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      console.error('Error loading customers:', error)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [token])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(
  `${API_BASE_URL}/customers/`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...form,
      customer_id: Number(form.customer_id)
    })
  }
)
      const data = await response.json()

      if (!response.ok) {
        alert(JSON.stringify(data))
        return
      }

      alert('Customer created successfully!')

      setForm({
        customer_id: '',
        full_name: '',
        email: '',
        phone_number: ''
      })

      loadCustomers()
    } catch (error) {
      alert('Unable to connect to backend')
      console.error(error)
    }
  }

  return (
    <div>
      <h2>Add Customer</h2>

      <form className="customer-form" onSubmit={handleSubmit}>
        <input
          name="customer_id"
          type="number"
          placeholder="Customer ID"
          value={form.customer_id}
          onChange={handleChange}
          required
        />

        <input
          name="full_name"
          placeholder="Full Name"
          value={form.full_name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="phone_number"
          placeholder="Phone Number"
          value={form.phone_number}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Customer</button>
      </form>

      <h2>All Customers</h2>

      <table>
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone Number</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <tr key={customer.customer_id}>
              <td>{customer.customer_id}</td>
              <td>{customer.full_name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone_number}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Customers
