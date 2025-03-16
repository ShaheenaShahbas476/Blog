import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import multer from 'multer';
const { Pool } = pkg; // Use named import
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import ollama from 'ollama';
import bodyParser from 'body-parser';
const app = express();

// Increase the limit for the file uploads
app.use(bodyParser.json({ limit: '5mb' })); // You can adjust the size as needed
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true })); // Ensure you have ollama installed

// Configure dotenv
dotenv.config();


const port = process.env.PORT || 3001;
let globalImageUrl = null;

// PostgreSQL connection setup
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT, // Use an environment variable for port
});



// Middleware
app.use(cors());
app.use(express.json()); 
// Parse JSON bodies

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage }); // This line initializes `upload`

// Serve static files
app.use('/uploads', express.static('uploads'));

// Photo upload API
app.post('/upload-photo', upload.single('photo'), async (req, res) => {
    try {
        const { title, description, authorId } = req.body;
        const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

        if (!photoUrl) {
            return res.status(400).json({ error: 'Photo upload failed' });
        }
        globalImageUrl = photoUrl;
        console.log(photoUrl)
        
    } catch (error) {
        console.error('Error uploading photo:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Check Database Connection
const checkDatabaseConnection = async () => {
    try {
        await pool.query('SELECT 1;'); // Simple query to test connection
        console.log('Database connection successful');
    } catch (err) {
        console.error('Database connection error', err.stack);
    }
};

// Call the function to check connection
checkDatabaseConnection();

// User registration
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1 ', [ email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query('INSERT INTO users ( email, password) VALUES ($1, $2) RETURNING *', [email, hashedPassword]);
        const user = result.rows[0];

        res.json({ userId: user.id, username: user.username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// User login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (user && await bcrypt.compare(password, user.password)) {
            res.json({ userId: user.id, username: user.username });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});




// Utility function to generate embedding
async function generateEmbedding(content) {
    try {
        const response = await ollama.embeddings({
            model: "nomic-embed-text",
            prompt: content,
        });
        return `[${response.embedding.join(",")}]`; // Return the formatted embedding
    } catch (err) {
        console.error("Embedding generation error:", err);
        throw new Error("Error generating embedding");
    }
}

app.post("/create-blog", upload.single('photo'), async (req, res) => {
    const { title, intro, body, styles, authorName, categories, cardImage } = req.body;

    // Ensure you're getting the image URL correctly
    const image_url = globalImageUrl; 

    console.log("Request body:", req.body); // Log the entire request body
    console.log("Image URL:", image_url); // Log the image URL

    try {
        // Generate embeddings from the blog body
        const embedding = await generateEmbedding(body);

        // Insert the blog data into PostgreSQL with RETURNING clause
        const result = await pool.query(
            `INSERT INTO public.blogs(
              title, intro, content, styles, authorname, image_url, created_at, categories, embedding)
              VALUES($1, $2, $3, $4, $5, $6, NOW(), $7, $8) RETURNING id`,
            [title, intro, body, styles, authorName,image_url, categories, embedding]
        );

        // Access the returned ID
        const blogId = result.rows[0].id;
        res.status(200).json({ success: true, blogId });
    } catch (error) {
        console.error("Error creating blog:", error);
        res.status(500).json({ error: "Failed to create blog" });
    }
});




  
// Get all blogs with pagination
app.get('/blogs', async (req, res) => {
    const limit = parseInt(req.query.limit) || 32; // Default to 32 blogs per request
    const offset = parseInt(req.query.offset) || 0; // Offset for pagination

    try {
        const result = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC LIMIT $1 OFFSET $2;', [limit, offset]);
        const totalBlogs = await pool.query('SELECT COUNT(*) FROM blogs;');
        res.json({
            blogs: result.rows,
            total: totalBlogs.rows[0].count
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Vector Search Function
async function search(embedding) {
    if (!embedding) {
        throw new Error('No embedding provided');
    }

    try {
        const query = `
    SELECT *, 
           (1 - (embedding <=> $1)) AS similarity 
    FROM blogs 
    ORDER BY similarity DESC 
    LIMIT 10;
        `;



        // Execute the query with the input embedding
        const result = await pool.query(query, [embedding]);
        console.log('Search results from DB:', result.rows); // Log search results
        return result.rows;
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error('Error performing search');
    }
}


// Vector search endpoint
app.post('/vector-search', async (req, res) => {
    console.log('Received POST request to /vector-search');
    const { query } = req.body; // Get the search query
    try {
        console.log('Search query:', query);
        // Generate embedding for the search query
        const response = await ollama.embeddings({
            model: "nomic-embed-text",
            prompt: query,
        });
        
        console.log('Generated embedding:', response.embedding); // Check embedding

        // Format the embedding for the query
        const formattedEmbedding = `[${response.embedding.join(",")}]`;
        const results = await search(formattedEmbedding); // Call the search function
        console.log('Search results:', results); // Log results to check if blogs are returned
        res.json({blogs: results});
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Get blogs by category
app.get('/blogs/category/:category', async (req, res) => {
    const { category } = req.params;
    try {
        const result = await pool.query('SELECT * FROM blogs WHERE $1 = ANY(categories);', [category]);
        res.json({
            blogs: result.rows.length > 0 ? result.rows : []
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get a single blog post by ID
app.get('/blogs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM blogs WHERE id = $1;', [id]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


// Update blog categories by ID
app.put('/blogs/:id', async (req, res) => {
    const { id } = req.params;
    const { categories } = req.body;

    try {
        const result = await pool.query(
            'UPDATE blogs SET categories = $1 WHERE id = $2 RETURNING *;',
            [categories, id]
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Blog not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});



// Get a specific photo
app.get('/photos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM photos WHERE id = $1;', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Photo not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching photo:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
