const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const courseRoutes = require('./Router/courseRoutes');
const contactRoutes = require('./Router/contactRoutes');
const influencerRoutes = require('./Router/influencerRoutes');
const hireRequestsRoute = require('./Router/hireRequests');
const bannersRouter = require('./Router/banner');
const blogRoutes = require('./Router/blog');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' })); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect('mongodb+srv://vivekkumar787067:Vivek09876@cluster0.04yo62h.mongodb.net/Cyborg?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));




// Routes
app.use('/api/courses', courseRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/influencer', influencerRoutes);
app.use('/api/hire-requests', hireRequestsRoute);
app.use('/api/banners', bannersRouter);
app.use('/api/blogs', blogRoutes);

app.get('/', (req, res) => {
  res.send('Cyborg backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
