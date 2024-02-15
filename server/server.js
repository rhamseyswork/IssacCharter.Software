const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3999;

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api', (req, res) => {
    res.json({ message: 'Hello from server!' });
});

// Connect to MongoDB only if not in test environment
// if (process.env.NODE_ENV !== 'test') {
//     async function connectDB() {
//         try {
//             await mongoose.connect('mongodb+srv://temp-user:AcZHS4cSXgiyAXhj@cluster0.2kwa8tj.mongodb.net/?retryWrites=true&w=majority', {
//                 useNewUrlParser: true,
//                 useUnifiedTopology: true,
//             });
//             console.log('Connected to MongoDB');
//         } catch (err) {
//             console.error('Could not connect to MongoDB:', err);
//         }
//     }
// }

//     connectDB();


// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to db...');
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error: ', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected...');
});

// Import routes
app.use('/api/user', authRoutes);



// Export the app for testing purposes
module.exports = app;
