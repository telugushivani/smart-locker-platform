
import ParcelEventHistory from './ParcelEventHistory'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'
import ParcelTracking from './ParcelTracking'
import ParcelCollection from './ParcelCollection'
import CourierDeposit from './CourierDeposit'
import Parcels from './Parcels'
import Compartments from './Compartments'
import LockerStations from './LockerStations'
import Customers from './Customers'
import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import './App.css'

function App() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [adminToken, setAdminToken] = useState(null)

  const [stats, setStats] = useState({
    customers: 0,
    stations: 0,
    compartments: 0,
    parcels: 0,
    registered: 0,
    reserved: 0,
    deposited: 0,
    collected: 0
  })

  useEffect(() => {
    if (!adminToken || activePage !== 'Dashboard') {
      return
    }

    const loadDashboard = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${adminToken}`
        }

        const responses = await Promise.all([
          fetch('http://127.0.0.1:8000/customers/', { headers }),
          fetch('http://127.0.0.1:8000/locker-stations/', { headers }),
          fetch('http://127.0.0.1:8000/compartments/', { headers }),
          fetch('http://127.0.0.1:8000/parcels/', { headers })
        ])

        if (responses.some(res => !res.ok)) {
          throw new Error('Failed to fetch dashboard data')
        }

        const [customers, stations, compartments, parcels] =
          await Promise.all(
            responses.map(res => res.json())
          )

        setStats({
          customers: customers.length,
          stations: stations.length,
          compartments: compartments.length,
          parcels: parcels.length,
          registered: parcels.filter(p => p.status === 'REGISTERED').length,
          reserved: parcels.filter(p => p.status === 'RESERVED').length,
          deposited: parcels.filter(p => p.status === 'DEPOSITED').length,
          collected: parcels.filter(p => p.status === 'COLLECTED').length
        })
      } catch (error) {
        console.error('Dashboard loading error:', error)
      }
    }

    loadDashboard()
  }, [activePage, adminToken])

  const cards = [
    { title: 'Total Customers', value: stats.customers },
    { title: 'Locker Stations', value: stats.stations },
    { title: 'Compartments', value: stats.compartments },
    { title: 'Total Parcels', value: stats.parcels }
  ]

  if (!adminToken) {
    return <AdminLogin onLoginSuccess={setAdminToken} />
  }

  return (
    <div>
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <button
        onClick={() => {
          setAdminToken(null)
          setActivePage('Dashboard')
          setStats({
            customers: 0,
            stations: 0,
            compartments: 0,
            parcels: 0,
            registered: 0,
            reserved: 0,
            deposited: 0,
            collected: 0
          })
        }}
        style={{ margin: '10px', padding: '10px' }}
      >
        Logout
      </button>

      <main className="main-content">
        <h1>{activePage}</h1>

        {activePage === 'Dashboard' && (
          <>
            <div className="dashboard-cards">
              {cards.map((card) => (
                <div className="dashboard-card" key={card.title}>
                  <h3>{card.title}</h3>
                  <h2>{card.value}</h2>
                </div>
              ))}
            </div>

            <h2>Parcel Status Summary</h2>

            <div className="dashboard-cards">
              <div className="dashboard-card">
                <h3>Registered</h3>
                <h2>{stats.registered}</h2>
              </div>

              <div className="dashboard-card">
                <h3>Reserved</h3>
                <h2>{stats.reserved}</h2>
              </div>

              <div className="dashboard-card">
                <h3>Deposited</h3>
                <h2>{stats.deposited}</h2>
              </div>

              <div className="dashboard-card">
                <h3>Collected</h3>
                <h2>{stats.collected}</h2>
              </div>
            </div>
          </>
        )}

        {activePage === 'Customers' && <Customers token={adminToken} />}
        {activePage === 'Locker Stations' && <LockerStations token={adminToken} />}
        {activePage === 'Compartments' && <Compartments token={adminToken} />}
        {activePage === 'Parcels' && <Parcels token={adminToken} />}
        {activePage === 'Courier Deposit' && (
          <CourierDeposit token={adminToken} />
        )}
        {activePage === 'Parcel Collection' && <ParcelCollection />}
        {activePage === 'Parcel Tracking' && <ParcelTracking />}
        {activePage === 'Parcel Event History' && (
          <ParcelEventHistory adminToken={adminToken} />
        )}

        {activePage !== 'Admin Dashboard' &&
        activePage !== 'Parcel Event History' && (
          <AdminDashboard token={adminToken} />
        )}

        {activePage !== 'Dashboard' &&
          activePage !== 'Customers' &&
          activePage !== 'Locker Stations' &&
          activePage !== 'Compartments' &&
          activePage !== 'Parcels' &&
          activePage !== 'Courier Deposit' &&
          activePage !== 'Parcel Collection' &&
          activePage !== 'Parcel Tracking' &&
          activePage !== 'Admin Dashboard' && (
            <p>{activePage} page is coming next.</p>
          )}
      </main>
    </div>
  )
}

export default App
