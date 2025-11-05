import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Home, Trash2, DollarSign, MapPin, BedDouble, Bath, Maximize, Search, Filter } from 'lucide-react';

function App() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    minPrice: '',
    maxPrice: ''
  });
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    type: 'Apartment',
    status: 'For Sale',
    bedrooms: '',
    bathrooms: '',
    area: '',
    imageUrl: ''
  });

  const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:7000/api'
    : '/api';

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, searchTerm, filters]);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${API_URL}/properties`);
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      alert('Error fetching properties: ' + error.message);
    }
  };

  const filterProperties = () => {
    let filtered = properties;

    if (searchTerm) {
      filtered = filtered.filter(prop =>
        prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prop.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prop.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(prop => prop.type === filters.type);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(prop => prop.status === filters.status);
    }

    if (filters.minPrice) {
      filtered = filtered.filter(prop => prop.price >= Number(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(prop => prop.price <= Number(filters.maxPrice));
    }

    setFilteredProperties(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/properties`, {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area)
      });
      
      alert('Property added successfully!');
      setFormData({
        title: '',
        description: '',
        price: '',
        location: '',
        type: 'Apartment',
        status: 'For Sale',
        bedrooms: '',
        bathrooms: '',
        area: '',
        imageUrl: ''
      });
      setShowForm(false);
      fetchProperties();
    } catch (error) {
      console.error('Error adding property:', error);
      alert('Error adding property: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await axios.delete(`${API_URL}/properties/${id}`);
        alert('Property deleted successfully!');
        fetchProperties();
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Error deleting property: ' + error.message);
      }
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/properties/${id}`, { status: newStatus });
      alert('Status updated successfully!');
      fetchProperties();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status: ' + error.message);
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <nav className="navbar navbar-dark bg-primary shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1 d-flex align-items-center">
            <Home className="me-2" size={28} />
            Real Estate Portal
          </span>
          <button 
            className="btn btn-light"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Close Form' : '+ Add New Property'}
          </button>
        </div>
      </nav>

      <div className="container py-4">
        {/* Add Property Form */}
        {showForm && (
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h4 className="card-title mb-4">Add New Property</h4>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label">Location *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Description *</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Price (₹) *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Type *</label>
                    <select
                      className="form-select"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      <option>Apartment</option>
                      <option>House</option>
                      <option>Villa</option>
                      <option>Land</option>
                      <option>Commercial</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Status *</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      <option>For Sale</option>
                      <option>For Rent</option>
                      <option>Sold</option>
                      <option>Rented</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Bedrooms *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Bathrooms *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Area (sq ft) *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.area}
                      onChange={(e) => setFormData({...formData, area: e.target.value})}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Image URL (Optional)</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://example.com/image.jpg"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    />
                    <small className="text-muted">Enter a valid image URL or leave blank for default</small>
                  </div>

                  <div className="col-12">
                    <button type="submit" className="btn btn-primary">
                      Add Property
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-12">
                <div className="input-group">
                  <span className="input-group-text">
                    <Search size={20} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by title, location, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-3">
                <label className="form-label small">
                  <Filter size={16} className="me-1" />
                  Property Type
                </label>
                <select
                  className="form-select"
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                >
                  <option value="all">All Types</option>
                  <option>Apartment</option>
                  <option>House</option>
                  <option>Villa</option>
                  <option>Land</option>
                  <option>Commercial</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label small">Status</label>
                <select
                  className="form-select"
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="all">All Status</option>
                  <option>For Sale</option>
                  <option>For Rent</option>
                  <option>Sold</option>
                  <option>Rented</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label small">Min Price (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label small">Max Price (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="row g-4">
          {filteredProperties.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-info text-center">
                <h5>No properties found</h5>
                <p className="mb-0">Try adjusting your search or filters, or add a new property!</p>
              </div>
            </div>
          ) : (
            filteredProperties.map((property) => (
              <div key={property._id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm hover-shadow">
                  {property.imageUrl ? (
                    <img
                      src={property.imageUrl}
                      className="card-img-top"
                      alt={property.title}
                      style={{ height: '200px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x200?text=Property+Image';
                      }}
                    />
                  ) : (
                    <div
                      className="bg-secondary d-flex align-items-center justify-content-center text-white"
                      style={{ height: '200px' }}
                    >
                      <Home size={48} />
                    </div>
                  )}
                  
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title mb-0">{property.title}</h5>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(property._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <p className="card-text text-muted small">{property.description}</p>
                    
                    <div className="mb-3">
                      <div className="d-flex align-items-center text-primary mb-2">
                        <DollarSign size={20} />
                        <strong className="fs-5">₹{property.price.toLocaleString()}</strong>
                      </div>
                      
                      <div className="d-flex align-items-center text-muted small mb-1">
                        <MapPin size={16} className="me-1" />
                        {property.location}
                      </div>
                      
                      <div className="d-flex gap-3 mt-2">
                        <span className="d-flex align-items-center small">
                          <BedDouble size={16} className="me-1" />
                          {property.bedrooms} Beds
                        </span>
                        <span className="d-flex align-items-center small">
                          <Bath size={16} className="me-1" />
                          {property.bathrooms} Baths
                        </span>
                        <span className="d-flex align-items-center small">
                          <Maximize size={16} className="me-1" />
                          {property.area} sq ft
                        </span>
                      </div>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-info">{property.type}</span>
                      <select
                        className="form-select form-select-sm w-auto"
                        value={property.status}
                        onChange={(e) => handleStatusUpdate(property._id, e.target.value)}
                      >
                        <option>For Sale</option>
                        <option>For Rent</option>
                        <option>Sold</option>
                        <option>Rented</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;