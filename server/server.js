const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: '*', methods: ['POST', 'GET'], credentials: true }));
app.use(express.json());

// MongoDB connection
let isConnected;

const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = mongoose.connection.readyState;
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
    }
};
connectDB();

// User schema and model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Email template schema
const sectionSchema = new mongoose.Schema({
    type: { type: String, required: true },
    content: { type: String, required: true },
    styles: { type: Object, default: {} },
    imageStyles: { type: Object, default: {} },
});

const emailTemplateSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    sections: [sectionSchema],
    createdAt: { type: Date, default: Date.now },
});

const EmailTemplate =
    mongoose.models.EmailTemplate || mongoose.model('EmailTemplate', emailTemplateSchema);

// Middleware for authentication
const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

// Routes
app.get('/', (req, res) => {
    res.send('Server is running.');
});

app.get('/favicon.ico', (req, res) => {
    res.status(204);
});

// Registration route
app.post('/register', async (req, res) => {
    const { username, email, password, conformPassword } = req.body;

    if (password !== conformPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User Registered Successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// Upload image route
const upload = multer({ dest: 'uploads/' });
app.post('/uploadImage', authenticate, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image uploaded' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
});

// Get email templates
app.get('/getTemplates', async (req, res) => {
    try {
        const templates = await EmailTemplate.find();
        res.json(templates);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching templates' });
    }
});

// Upload email template
app.post('/uploadEmailConfig', async (req, res) => {
    const { title, subject, sections } = req.body;

    try {
        const newTemplate = new EmailTemplate({ title, subject, sections });
        await newTemplate.save();
        res.status(200).json({ message: 'Email template saved successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving email template' });
    }
});

// Update email template
app.put('/updateEmailTemplate/:id', async (req, res) => {
    const { id } = req.params;
    const { title, subject, sections } = req.body;

    try {
        const updatedTemplate = await EmailTemplate.findByIdAndUpdate(
            id,
            { title, subject, sections },
            { new: true }
        );

        if (!updatedTemplate) {
            return res.status(404).json({ message: 'Template not found' });
        }

        res.status(200).json({ message: 'Email template updated successfully!', updatedTemplate });
    } catch (error) {
        res.status(500).json({ message: 'Error updating email template' });
    }
});

// Delete email template
app.delete('/deleteEmailTemplate/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTemplate = await EmailTemplate.findByIdAndDelete(id);

        if (!deletedTemplate) {
            return res.status(404).json({ message: 'Template not found' });
        }

        res.status(200).json({ message: 'Email template deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting email template' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
