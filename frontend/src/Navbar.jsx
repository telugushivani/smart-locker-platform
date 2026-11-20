
function Navbar({ activePage, setActivePage }) {
   const menuItems = [
  'Dashboard',
  'Customers',
  'Locker Stations',
  'Compartments',
  'Parcels',
  'Courier Deposit',
  'Parcel Collection',
  'Parcel Tracking',
  'Admin Dashboard',
  'Parcel Event History'
]
  return (
    <nav className="navbar">
      <h2>Smart Locker</h2>

      <div className="nav-links">
        {menuItems.map((item) => (
          <button
            key={item}
            className={activePage === item ? 'active' : ''}
            onClick={() => setActivePage(item)}
          >
            {item}
          </button>
          
        ))}
      </div>
    </nav>
  )
}

export default Navbar
