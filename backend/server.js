const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

const Property = require('./models/Property');
const Ticket = require('./models/Ticket');
const User = require('./models/User');

const app = express();

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer Storage Configuration for Photo Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/goldenaquilas')
  .then(async () => {
    console.log('MongoDB Connected Successfully!');

    const count = await Property.countDocuments();
    if (count === 0) {
      const sampleProperties = [
        {
          title: "Qwetu Suburbia Hostel",
          category: "Hostel",
          location: "Ruiru / Near Main Gate",
          price: 15000,
          period: "per month",
          amenities: ["Wi-Fi", "24/7 Security", "Hot Shower", "Study Lounge"],
          imageUrl: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
          hostelDetails: { institution: "Campus", roomType: "Single Room", totalBeds: 50, vacantBeds: 12 }
        },
        {
          title: "Sunset Luxury BnB Studio",
          category: "BnB",
          location: "Westlands, Nairobi",
          price: 6500,
          period: "per night",
          amenities: ["Master En-suite", "Balcony View", "CCTV Monitoring", "Dedicated Parking"],
          imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "Ruaka Modern 2BR Apartment",
          category: "Rental",
          location: "Ruaka, Kiambu",
          price: 45000,
          period: "per month",
          amenities: ["Lift Access", "Backup Generator", "Borehole Water", "Children Play Area"],
          imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
        }
      ];
      await Property.insertMany(sampleProperties);
      console.log('Sample properties automatically seeded into MongoDB!');
    }
  })
  .catch((err) => console.error('MongoDB Connection Error:', err));

// ================= PROPERTIES API =================

app.get('/api/properties', async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/properties/seed', async (req, res) => {
  try {
    await Property.deleteMany({});
    const sampleProperties = [
      {
        title: "Qwetu Suburbia Hostel",
        category: "Hostel",
        location: "Ruiru / Near Main Gate",
        price: 15000,
        period: "per month",
        amenities: ["Wi-Fi", "24/7 Security", "Hot Shower", "Study Lounge"],
        imageUrl: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
        hostelDetails: { institution: "Campus", roomType: "Single Room", totalBeds: 50, vacantBeds: 12 }
      },
      {
        title: "Sunset Luxury BnB Studio",
        category: "BnB",
        location: "Westlands, Nairobi",
        price: 6500,
        period: "per night",
        amenities: ["Master En-suite", "Balcony View", "CCTV Monitoring", "Dedicated Parking"],
        imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Ruaka Modern 2BR Apartment",
        category: "Rental",
        location: "Ruaka, Kiambu",
        price: 45000,
        period: "per month",
        amenities: ["Lift Access", "Backup Generator", "Borehole Water", "Children Play Area"],
        imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
      }
    ];
    const created = await Property.insertMany(sampleProperties);
    res.status(201).json({ message: "Database seeded successfully!", created });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create property with file upload support ('image' field)
app.post('/api/properties', upload.single('image'), async (req, res) => {
  try {
    const imageUrl = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : req.body.imageUrl || '';
    
    const propertyPayload = {
      title: req.body.title,
      category: req.body.category,
      location: req.body.location,
      price: Number(req.body.price),
      period: req.body.period,
      amenities: typeof req.body.amenities === 'string' 
        ? req.body.amenities.split(',').map(a => a.trim()) 
        : req.body.amenities,
      description: req.body.description,
      imageUrl: imageUrl
    };

    const newProperty = new Property(propertyPayload);
    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/properties/:id', async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: "Property deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= TICKETS API =================

app.get('/api/tickets', async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tickets', upload.single('photo'), async (req, res) => {
  try {
    const imageUrl = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : '';
    
    const newTicket = new Ticket({
      propertyName: req.body.propertyName,
      issueType: req.body.issueType,
      description: req.body.description,
      tenantName: req.body.tenantName,
      contactPhone: req.body.contactPhone,
      imageUrl: imageUrl
    });

    await newTicket.save();
    res.status(201).json(newTicket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/tickets/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    res.json(updatedTicket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test Route
app.get('/', (req, res) => {
  res.send('Golden Aquilas Backend API is running...');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});