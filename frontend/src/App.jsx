import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [activeTab, setActiveTab] = useState('properties');
  
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryData, setInquiryData] = useState({ name: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [tickets, setTickets] = useState([]);
  const [ticketForm, setTicketForm] = useState({ propertyName: '', issueType: 'Plumbing', description: '', tenantName: '', contactPhone: '' });
  const [ticketPhoto, setTicketPhoto] = useState(null);
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [newProp, setNewProp] = useState({
    title: '',
    category: 'Rental',
    location: '',
    price: '',
    period: 'per month',
    amenities: 'Wi-Fi, 24/7 Security, Parking',
    description: ''
  });
  const [propertyPhoto, setPropertyPhoto] = useState(null);
  const [propSubmitting, setPropSubmitting] = useState(false);
  const [propSuccess, setPropSuccess] = useState('');

  useEffect(() => {
    fetchProperties();
    fetchTickets();
  }, []);

  const fetchProperties = () => {
    axios.get(`${API_URL}/api/properties`)
      .then(res => {
        setProperties(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching properties:", err);
        setLoading(false);
      });
  };

  const fetchTickets = () => {
    axios.get(`${API_URL}/api/properties`)
      .then(res => setTickets(res.data))
      .catch(err => console.error("Error fetching tickets:", err));
  };

  const filteredProperties = filter === 'All' 
    ? properties 
    : properties.filter(p => p.category === filter);

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccessMessage('Inquiry submitted successfully! Our leasing manager will contact you shortly.');
      setInquiryData({ name: '', phone: '', message: '' });
      setTimeout(() => {
        setSuccessMessage('');
        setShowInquiryForm(false);
      }, 3000);
    }, 1000);
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    setTicketSubmitting(true);

    const formData = new FormData();
    formData.append('tenantName', ticketForm.tenantName);
    formData.append('contactPhone', ticketForm.contactPhone);
    formData.append('propertyName', ticketForm.propertyName);
    formData.append('issueType', ticketForm.issueType);
    formData.append('description', ticketForm.description);
    if (ticketPhoto) {
      formData.append('photo', ticketPhoto);
    }

    axios.post(`${API_URL}/api/tickets`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(() => {
      setTicketSubmitting(false);
      setTicketSuccess('Maintenance ticket logged successfully!');
      setTicketForm({ propertyName: '', issueType: 'Plumbing', description: '', tenantName: '', contactPhone: '' });
      setTicketPhoto(null);
      fetchTickets();
      setTimeout(() => setTicketSuccess(''), 4000);
    })
    .catch(err => {
      console.error("Error creating ticket:", err);
      setTicketSubmitting(false);
    });
  };

  const handleAddProperty = (e) => {
    e.preventDefault();
    setPropSubmitting(true);

    const formData = new FormData();
    formData.append('title', newProp.title);
    formData.append('category', newProp.category);
    formData.append('location', newProp.location);
    formData.append('price', newProp.price);
    formData.append('period', newProp.period);
    formData.append('amenities', newProp.amenities);
    formData.append('description', newProp.description);
    if (propertyPhoto) {
      formData.append('image', propertyPhoto);
    }

    axios.post(`${API_URL}/api/properties`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(() => {
      setPropSubmitting(false);
      setPropSuccess('Property published successfully with image upload!');
      setNewProp({
        title: '',
        category: 'Rental',
        location: '',
        price: '',
        period: 'per month',
        amenities: 'Wi-Fi, 24/7 Security, Parking',
        description: ''
      });
      setPropertyPhoto(null);
      fetchProperties();
      setTimeout(() => setPropSuccess(''), 4000);
    })
    .catch(err => {
      console.error("Error creating property:", err);
      setPropSubmitting(false);
    });
  };

  const handleUpdateTicketStatus = (ticketId, newStatus) => {
    axios.patch(`${API_URL}/api/tickets/${ticketId}/status`, { status: newStatus })
      .then(() => fetchTickets())
      .catch(err => console.error("Error updating ticket status:", err));
  };

  const handleDeleteProperty = (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      axios.delete(`${API_URL}/api/properties/${id}`)
        .then(() => fetchProperties())
        .catch(err => console.error("Error deleting property:", err));
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans relative">
      <header className="bg-neutral-900 border-b border-yellow-500/30 shadow-2xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-600 via-yellow-400 to-yellow-200 flex items-center justify-center text-black font-extrabold text-lg">
              GA
            </div>
            <h1 className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              GOLDEN AQUILAS
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-neutral-950 p-1 rounded-xl border border-yellow-500/20">
              <button
                onClick={() => setActiveTab('properties')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'properties' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow' : 'text-gray-400 hover:text-yellow-400'
                }`}
              >
                Listings
              </button>
              <button
                onClick={() => setActiveTab('tickets')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'tickets' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow' : 'text-gray-400 hover:text-yellow-400'
                }`}
              >
                Maintenance
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'admin' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow' : 'text-gray-400 hover:text-yellow-400'
                }`}
              >
                Admin Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {activeTab === 'properties' && (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Exclusive Listings</h2>
                <p className="text-gray-400 text-sm mt-1">Discover premium apartments, student housing, and short-stays.</p>
              </div>
              <div className="flex gap-2 bg-neutral-900 p-1.5 rounded-xl border border-yellow-500/20">
                {['All', 'Hostel', 'Rental', 'BnB'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-5 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer ${
                      filter === cat ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold' : 'text-gray-400 hover:text-yellow-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-24 text-yellow-400 text-lg font-medium animate-pulse">Loading properties...</div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-24 text-gray-500 text-lg">No properties found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProperties.map(property => (
                  <div key={property._id} className="bg-neutral-900 rounded-2xl shadow-xl overflow-hidden border border-yellow-500/20 group">
                    <div className="relative h-56 bg-neutral-950 overflow-hidden">
                      <img 
                        src={property.imageUrl || "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7"} 
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 right-3 bg-black/80 text-yellow-400 border border-yellow-500/40 text-xs font-bold px-3 py-1 rounded-full">
                        {property.category}
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-white">{property.title}</h3>
                      <p className="text-gray-400 text-sm mb-4">📍 {property.location}</p>
                      <div className="flex justify-between items-center mt-6 pt-4 border-t border-neutral-800">
                        <span className="text-lg font-extrabold text-yellow-400">KES {property.price?.toLocaleString()} <span className="text-xs text-gray-400">{property.period}</span></span>
                        <button 
                          onClick={() => { setSelectedProperty(property); setShowInquiryForm(false); setSuccessMessage(''); }}
                          className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-sm px-4 py-2.5 rounded-xl font-bold cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'tickets' && (
          <div className="max-w-4xl mx-auto space-y-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white">Tenant Maintenance Portal</h2>
              <p className="text-gray-400 text-sm mt-1">Submit repair requests or view active tickets.</p>
            </div>

            <div className="bg-neutral-900 border border-yellow-500/30 rounded-2xl p-8 shadow-2xl">
              <h3 className="text-lg font-extrabold text-yellow-400 mb-6 uppercase tracking-wider">Log a New Issue</h3>
              {ticketSuccess && <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-sm text-center">{ticketSuccess}</div>}
              
              <form onSubmit={handleTicketSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Tenant Name</label>
                    <input type="text" required value={ticketForm.tenantName} onChange={(e) => setTicketForm({...ticketForm, tenantName: e.target.value})} className="w-full bg-neutral-950 border border-yellow-500/30 rounded-xl px-4 py-3 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Contact Phone</label>
                    <input type="tel" required value={ticketForm.contactPhone} onChange={(e) => setTicketForm({...ticketForm, contactPhone: e.target.value})} className="w-full bg-neutral-950 border border-yellow-500/30 rounded-xl px-4 py-3 text-sm text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Property / Unit Name</label>
                    <input type="text" required value={ticketForm.propertyName} onChange={(e) => setTicketForm({...ticketForm, propertyName: e.target.value})} className="w-full bg-neutral-950 border border-yellow-500/30 rounded-xl px-4 py-3 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Issue Type</label>
                    <select value={ticketForm.issueType} onChange={(e) => setTicketForm({...ticketForm, issueType: e.target.value})} className="w-full bg-neutral-950 border border-yellow-500/30 rounded-xl px-4 py-3 text-sm text-white">
                      <option value="Plumbing">Plumbing</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Internet">Internet</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Description</label>
                  <textarea rows="4" required value={ticketForm.description} onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})} className="w-full bg-neutral-950 border border-yellow-500/30 rounded-xl p-4 text-sm text-white resize-none"></textarea>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Attach Photo (Optional)</label>
                  <input type="file" accept="image/*" onChange={(e) => setTicketPhoto(e.target.files[0])} className="w-full text-xs text-gray-400 bg-neutral-950 border border-yellow-500/30 rounded-xl p-2" />
                </div>
                <button type="submit" disabled={ticketSubmitting} className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-3.5 rounded-xl font-bold cursor-pointer">
                  {ticketSubmitting ? 'Logging...' : 'Submit Ticket'}
                </button>
              </form>
            </div>

            <div className="bg-neutral-900 border border-yellow-500/30 rounded-2xl p-8 shadow-2xl">
              <h3 className="text-lg font-extrabold text-yellow-400 mb-6 uppercase tracking-wider">Active Requests ({tickets.length})</h3>
              <div className="space-y-4">
                {tickets.map(ticket => (
                  <div key={ticket._id} className="bg-neutral-950 border border-yellow-500/20 p-5 rounded-xl flex justify-between items-center">
                    <div>
                      <span className="text-white font-bold">{ticket.propertyName}</span> - <span className="text-yellow-400">{ticket.issueType}</span>
                      <p className="text-gray-300 text-sm">{ticket.description}</p>
                    </div>
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full">{ticket.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="space-y-12 max-w-5xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white">Admin Dashboard</h2>
              <p className="text-gray-400 text-sm mt-1">Publish properties and manage tickets.</p>
            </div>

            <div className="bg-neutral-900 border border-yellow-500/30 rounded-2xl p-8 shadow-2xl">
              <h3 className="text-lg font-extrabold text-yellow-400 mb-6 uppercase tracking-wider">Publish New Property</h3>
              {propSuccess && <div className="mb-6 bg-emerald-500/10 text-emerald-400 p-4 rounded-xl text-sm text-center">{propSuccess}</div>}

              <form onSubmit={handleAddProperty} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Title</label>
                    <input type="text" required value={newProp.title} onChange={(e) => setNewProp({...newProp, title: e.target.value})} className="w-full bg-neutral-950 border border-yellow-500/30 rounded-xl px-4 py-3 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Category</label>
                    <select value={newProp.category} onChange={(e) => setNewProp({...newProp, category: e.target.value})} className="w-full bg-neutral-950 border border-yellow-500/30 rounded-xl px-4 py-3 text-sm text-white">
                      <option value="Rental">Rental</option>
                      <option value="Hostel">Hostel</option>
                      <option value="BnB">BnB</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Location</label>
                    <input type="text" required value={newProp.location} onChange={(e) => setNewProp({...newProp, location: e.target.value})} className="w-full bg-neutral-950 border border-yellow-500/30 rounded-xl px-4 py-3 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Price (KES)</label>
                    <input type="number" required value={newProp.price} onChange={(e) => setNewProp({...newProp, price: e.target.value})} className="w-full bg-neutral-950 border border-yellow-500/30 rounded-xl px-4 py-3 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Period</label>
                    <input type="text" required value={newProp.period} onChange={(e) => setNewProp({...newProp, period: e.target.value})} className="w-full bg-neutral-950 border border-yellow-500/30 rounded-xl px-4 py-3 text-sm text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Upload Property Image</label>
                  <input type="file" required accept="image/*" onChange={(e) => setPropertyPhoto(e.target.files[0])} className="w-full text-xs text-gray-400 bg-neutral-950 border border-yellow-500/30 rounded-xl p-2" />
                </div>
                <button type="submit" disabled={propSubmitting} className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-3.5 rounded-xl font-bold cursor-pointer">
                  {propSubmitting ? 'Publishing...' : 'Publish Property'}
                </button>
              </form>
            </div>

            <div className="bg-neutral-900 border border-yellow-500/30 rounded-2xl p-8 shadow-2xl">
              <h3 className="text-lg font-extrabold text-yellow-400 mb-6 uppercase tracking-wider">Manage Tickets & Status</h3>
              <div className="space-y-4">
                {tickets.map(ticket => (
                  <div key={ticket._id} className="bg-neutral-950 border border-yellow-500/20 p-5 rounded-xl flex justify-between items-center">
                    <div>
                      <span className="text-white font-bold">{ticket.propertyName}</span> ({ticket.issueType})
                      <p className="text-gray-400 text-xs">{ticket.description}</p>
                    </div>
                    <select value={ticket.status || 'Pending'} onChange={(e) => handleUpdateTicketStatus(ticket._id, e.target.value)} className="bg-neutral-900 border border-yellow-500/30 text-yellow-400 text-xs p-2 rounded-xl">
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-neutral-900 border border-yellow-500/30 rounded-2xl p-8 shadow-2xl">
              <h3 className="text-lg font-extrabold text-yellow-400 mb-6 uppercase tracking-wider">Manage Properties</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {properties.map(p => (
                  <div key={p._id} className="bg-neutral-950 p-4 rounded-xl border border-yellow-500/20 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white text-sm">{p.title}</h4>
                      <p className="text-xs text-gray-400">KES {p.price?.toLocaleString()} {p.period}</p>
                    </div>
                    <button onClick={() => handleDeleteProperty(p._id)} className="bg-red-500/20 text-red-400 text-xs px-3 py-1.5 rounded-lg font-bold cursor-pointer">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Property Details Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-neutral-900 border border-yellow-500/30 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
            
            <button 
              onClick={() => setSelectedProperty(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 bg-black/70 hover:bg-yellow-500 text-yellow-400 hover:text-black rounded-full flex items-center justify-center font-bold text-lg transition-colors border border-yellow-500/30 cursor-pointer"
            >
              ✕
            </button>

            <div className="relative h-56 w-full bg-neutral-950 flex-shrink-0">
              <img 
                src={selectedProperty.imageUrl || "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7"} 
                alt={selectedProperty.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-4 left-6 bg-black/80 backdrop-blur-md text-yellow-400 border border-yellow-500/40 text-xs font-bold px-3.5 py-1.5 rounded-full">
                {selectedProperty.category}
              </span>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-white">{selectedProperty.title}</h2>
                <p className="text-gray-400 text-sm mt-1">📍 {selectedProperty.location}</p>
              </div>

              <div className="bg-neutral-950 p-4 rounded-xl border border-yellow-500/20 flex justify-between items-center">
                <div>
                  <span className="text-xs uppercase tracking-wider text-gray-400 font-medium block">Rate</span>
                  <span className="text-2xl font-black text-yellow-400">KES {selectedProperty.price?.toLocaleString()}</span>
                  <span className="text-sm text-gray-400 ml-1.5">{selectedProperty.period}</span>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                  Available Now
                </span>
              </div>

              {!showInquiryForm ? (
                <>
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-yellow-400 font-bold mb-2">Overview</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {selectedProperty.description || "Experience refined living at this exclusive listing complete with high-end finishes, 24/7 security, and high-speed Wi-Fi."}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-yellow-400 font-bold mb-3">Amenities</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {(selectedProperty.amenities || ["Wi-Fi", "Security", "Parking"]).map((amenity, idx) => (
                        <div key={idx} className="bg-neutral-800/80 border border-yellow-500/10 px-3 py-2 rounded-lg text-xs font-medium text-gray-300">
                          ✓ {amenity}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-800 flex gap-3">
                    <button 
                      onClick={() => setShowInquiryForm(true)}
                      className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-3 rounded-xl font-bold cursor-pointer text-center"
                    >
                      Book / Inquire Now
                    </button>
                    <button 
                      onClick={() => setSelectedProperty(null)}
                      className="px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-gray-300 rounded-xl font-semibold cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4 pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-md uppercase tracking-wider text-yellow-400 font-bold">Inquire for {selectedProperty.title}</h3>
                    <button type="button" onClick={() => setShowInquiryForm(false)} className="text-xs text-gray-400 hover:text-yellow-400 underline cursor-pointer">
                      ← Back
                    </button>
                  </div>

                  {successMessage && <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs text-center">{successMessage}</div>}

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1 font-medium">Full Name</label>
                    <input type="text" required value={inquiryData.name} onChange={(e) => setInquiryData({...inquiryData, name: e.target.value})} className="w-full bg-neutral-950 border border-yellow-500/30 rounded-xl px-4 py-2.5 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1 font-medium">Phone Number</label>
                    <input type="tel" required value={inquiryData.phone} onChange={(e) => setInquiryData({...inquiryData, phone: e.target.value})} className="w-full bg-neutral-950 border border-yellow-500/30 rounded-xl px-4 py-2.5 text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1 font-medium">Message / Preferred Dates</label>
                    <textarea rows="3" value={inquiryData.message} onChange={(e) => setInquiryData({...inquiryData, message: e.target.value})} className="w-full bg-neutral-950 border border-yellow-500/30 rounded-xl p-3 text-sm text-white resize-none"></textarea>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button type="submit" disabled={submitting} className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-3 rounded-xl font-bold cursor-pointer text-center">
                      {submitting ? 'Submitting...' : 'Submit Inquiry'}
                    </button>
                    <button type="button" onClick={() => setSelectedProperty(null)} className="px-5 py-3 bg-neutral-800 text-gray-300 rounded-xl font-semibold cursor-pointer">
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;