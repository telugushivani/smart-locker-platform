
import { useEffect, useState } from 'react'

function AdminDashboard({ token }) {
  const [stats, setStats] = useState({
    customers: 0,
    stations: 0,
    compartments: 0,
    parcels: 0
  })

  const [parcels, setParcels] = useState([])
  const [customersList, setCustomersList] = useState([])
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedParcel, setSelectedParcel] = useState(null)
  const [message, setMessage] = useState('Loading dashboard...')

  // Load admin dashboard data
  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const headers = {
  Authorization: `Bearer ${token}`
}

const [customersResponse, stationsResponse, compartmentsResponse, parcelsResponse] =
  await Promise.all([
    fetch('http://127.0.0.1:8000/customers/', { headers }),
    fetch('http://127.0.0.1:8000/locker-stations/', { headers }),
    fetch('http://127.0.0.1:8000/compartments/', { headers }),
    fetch('http://127.0.0.1:8000/parcels/', { headers })
  ])

if (
  !customersResponse.ok ||
  !stationsResponse.ok ||
  !compartmentsResponse.ok ||
  !parcelsResponse.ok
) {
  throw new Error('Failed to load dashboard data')
}

const [customers, stations, compartments, parcelData] =
  await Promise.all([
    customersResponse.json(),
    stationsResponse.json(),
    compartmentsResponse.json(),
    parcelsResponse.json()
  ])

        setStats({
          customers: customers.length,
          stations: stations.length,
          compartments: compartments.length,
          parcels: parcelData.length
        })

        setParcels(parcelData)
        setCustomersList(customers)
        setMessage('')
      } catch (error) {
        setMessage('Unable to load admin dashboard')
      }
    }

    loadAdminData()
  }, [])

  // Dashboard cards
  const cards = [
    { title: 'Total Customers', value: stats.customers },
    { title: 'Locker Stations', value: stats.stations },
    { title: 'Compartments', value: stats.compartments },
    { title: 'Total Parcels', value: stats.parcels }
  ]

  // Search and filter parcels
  const filteredParcels = parcels.filter((parcel) => {
    const matchesStatus =
      selectedStatus === 'ALL' || parcel.status === selectedStatus

    const matchesTrackingNumber =
      (parcel.tracking_number || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

    return matchesStatus && matchesTrackingNumber
  })

  return (
    <div className="page">
      <h2>Admin Dashboard</h2>

      {/* Dashboard Statistics */}
      <div className="dashboard-cards">
        {cards.map((card) => (
          <div className="dashboard-card" key={card.title}>
            <h3>{card.title}</h3>
            <p>{card.value}</p>
          </div>
        ))}
      </div>

      {message && <p>{message}</p>}

      <hr />

      {/* Parcel Management */}
      <h2>Parcel Management</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by Tracking Number"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Status Filter */}
      <label>Filter parcels by status:</label>

      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
      >
        <option value="ALL">All Parcels</option>
        <option value="REGISTERED">Registered</option>
        <option value="RESERVED">Reserved</option>
        <option value="DEPOSITED">Deposited</option>
        <option value="COLLECTED">Collected</option>
        <option value="EXPIRED">Expired</option>
        <option value="RETURNED">Returned</option>
      </select>

      {/* Parcel Records */}
      <h3>Parcel Records ({filteredParcels.length})</h3>

      {filteredParcels.length === 0 ? (
        <p>No parcels found.</p>
      ) : (
        filteredParcels.map((parcel) => (
          <div className="parcel-card" key={parcel.parcel_id}>
            <p><strong>Parcel ID:</strong> {parcel.parcel_id}</p>
            <p><strong>Tracking Number:</strong> {parcel.tracking_number}</p>
            <p><strong>Customer ID:</strong> {parcel.customer_id}</p>
            <p><strong>Status:</strong> {parcel.status}</p>

            <button onClick={() => setSelectedParcel(parcel)}>
              View Details
            </button>
          </div>
        ))
      )}
      <hr />

<h2>Customer Management</h2>

<h3>Registered Customers ({customersList.length})</h3>

{customersList.length === 0 ? (
  <p>No customers registered yet.</p>
) : (
  customersList.map((customer) => (
    <div className="parcel-card" key={customer.customer_id}>
      <p>
        <strong>Customer ID:</strong> {customer.customer_id}
      </p>
      <p>
        <strong>Name:</strong> {customer.full_name}
      </p>
      <p>
        <strong>Email:</strong> {customer.email}
      </p>
      <p>
        <strong>Phone:</strong> {customer.phone_number}
      </p>
    </div>
  ))
)}

      {/* Selected Parcel Details */}
      {selectedParcel && (
        <div className="parcel-card">
          <h2>Parcel Details</h2>

          <p><strong>Parcel ID:</strong> {selectedParcel.parcel_id}</p>
          <p><strong>Tracking Number:</strong> {selectedParcel.tracking_number}</p>
          <p><strong>Customer ID:</strong> {selectedParcel.customer_id}</p>
          <p>
            <strong>Compartment ID:</strong>{' '}
            {selectedParcel.compartment_id || 'Not assigned'}
          </p>
          <p>
            <strong>Description:</strong>{' '}
            {selectedParcel.parcel_description || 'Not available'}
          </p>
          <p><strong>Width:</strong> {selectedParcel.width_cm} cm</p>
          <p><strong>Height:</strong> {selectedParcel.height_cm} cm</p>
          <p><strong>Depth:</strong> {selectedParcel.depth_cm} cm</p>
          <p><strong>Status:</strong> {selectedParcel.status}</p>

          <button onClick={() => setSelectedParcel(null)}>
            Close Details
          </button>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
