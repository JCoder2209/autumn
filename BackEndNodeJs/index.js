// backend/server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.use(cors());



// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Midukk@n1942#', // Change this to your MySQL password
    database: 'food_tracking'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL');
});



// Get all shipments
app.get('/api/shipments', (req, res) => {
    db.query('SELECT * FROM shipments', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Get alerts for food at risk of spoiling
app.get('/api/alerts', (req, res) => {
    db.query('SELECT * FROM alerts', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Get Alerts for Shipment
app.get("/api/alerts/:shipmentId", async (req, res) => {
    try {
        const { shipmentId } = req.params;
        const query = "SELECT * FROM alerts WHERE shipment_id = ?";
        
        // Use promise-based query execution
        const [rows] = await db.promise().execute(query, [shipmentId]);

        if (rows.length === 0) {
            console.log(`No alerts found for shipment_id: ${shipmentId}`);
        } else {
            console.log(`Fetched alerts for shipment_id: ${shipmentId}`, rows);
        }

        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching alerts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Get monthly shipment counts
app.get('/api/shipments-overview', (req, res) => {
    const query = `
        SELECT MONTH(updated_at) AS month, COUNT(*) AS count
        FROM shipments
        GROUP BY MONTH(updated_at)
        ORDER BY MONTH(updated_at);
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Map month number to month name
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedData = results.map(row => ({
            name: monthNames[row.month - 1], // Convert month number to name
            shipment: row.count
        }));

        res.json(formattedData);
    });
});

// Get shipment status distribution
app.get('/api/shipments-distribution', (req, res) => {
    const query = `
        SELECT status, COUNT(*) AS count
        FROM shipments
        GROUP BY status;
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const formattedData = results.map(row => ({
            name: row.status,
            value: row.count
        }));

        res.json(formattedData);
    });
});

// Optimized route API (Using OpenStreetMap API)

app.get('/api/optimized-route/:farmName/:shopName', async (req, res) => {
    const { farmName, shopName } = req.params;

    try {
        // Fetch farm GPS location
        const [farm] = await db.promise().query(
            'SELECT gps_location FROM farms WHERE farm_name = ?', [farmName]
        );
        if (farm.length === 0) return res.status(404).json({ error: "Farm not found" });

        // Fetch shop GPS location
        const [shop] = await db.promise().query(
            'SELECT gps_location FROM shops WHERE shop_name = ?', [shopName]
        );
        if (shop.length === 0) return res.status(404).json({ error: "Shop not found" });

        const origin = farm[0].gps_location;
        const destination = shop[0].gps_location;

        // Use OpenStreetMap (OSRM) to fetch shortest route
        const osrmBaseUrl = `http://router.project-osrm.org/route/v1/driving`;
        const response = await axios.get(`${osrmBaseUrl}/${origin};${destination}?overview=simplified&geometries=geojson`);

        const route = response.data.routes[0];
        if (!route || !route.geometry) return res.status(404).json({ error: "No route found" });

        // Convert OSRM coordinates to [lat, lng] format
        const formattedCoordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);

        res.json({
            distance: (route.distance / 1000).toFixed(2) + " km",
            duration: (route.duration / 60).toFixed(2) + " mins",
            coordinates: formattedCoordinates
        });
    } catch (error) {
        console.error("Error fetching route:", error);
        res.status(500).json({ error: "Failed to fetch optimized route" });
    }
});



// Start Server
const PORT = 8800;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
