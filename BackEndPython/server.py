from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from mysql.connector import Error
from datetime import datetime, timedelta

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Database Configuration (Move credentials to environment variables in production)
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "******",
    "database": "food_tracking"
}

# Function to get database connection
def get_db_connection():
    try:
        conn = mysql.connector.connect(**db_config)
        return conn
    except Error as e:
        print(f"Database Connection Error: {e}")
        return None

# Get Total Shipments Per Destination
@app.get("/api/shipments/destination")
def get_shipments_per_destination():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT destination, COUNT(*) AS total_shipments FROM shipments GROUP BY destination")
        result = cursor.fetchall()
        return result
    finally:
        cursor.close()
        conn.close()

# Get Shipments by Status
@app.get("/api/shipments/status")
def get_shipments_by_status():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT status, COUNT(*) AS count FROM shipments GROUP BY status")
        result = cursor.fetchall()
        return result
    finally:
        cursor.close()
        conn.close()

# Get Average Temperature & Humidity Per Destination
@app.get("/api/shipments/temp-humidity")
def get_avg_temp_humidity():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT destination, 
                   ROUND(AVG(temperature), 2) AS avg_temp, 
                   ROUND(AVG(humidity), 2) AS avg_humidity 
            FROM shipments 
            GROUP BY destination
        """)
        result = cursor.fetchall()
        return result
    finally:
        cursor.close()
        conn.close()

# Get Number of Alerts Per Type
@app.get("/api/alerts/type")
def get_alerts_by_type():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT alert_type, COUNT(*) AS count FROM alerts GROUP BY alert_type")
        result = cursor.fetchall()
        return result
    finally:
        cursor.close()
        conn.close()

# Get Top 5 Destinations with Most Alerts
@app.get("/api/alerts/top-destinations")
def get_top_alert_destinations():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT s.destination, COUNT(a.id) AS alert_count 
            FROM alerts a
            JOIN shipments s ON a.shipment_id = s.shipment_id
            GROUP BY s.destination 
            ORDER BY alert_count DESC 
            LIMIT 5
        """)
        result = cursor.fetchall()
        return result
    finally:
        cursor.close()
        conn.close()

# Get Recent Alerts (Last 24 Hours)
@app.get("/api/alerts/recent")
def get_recent_alerts():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    try:
        cursor = conn.cursor(dictionary=True)
        last_24_hours = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d %H:%M:%S')
        query = "SELECT * FROM alerts WHERE created_at >= %s ORDER BY created_at DESC"

        cursor.execute(query, (last_24_hours,))
        result = cursor.fetchall()
        return result
    finally:
        cursor.close()
        conn.close()

# Get Shipments at Risk by Destination
@app.get("/api/shipments/at-risk")
def get_shipments_at_risk():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT destination, COUNT(*) AS at_risk FROM shipments WHERE status = 'At Risk' GROUP BY destination")
        result = cursor.fetchall()
        return result
    finally:
        cursor.close()
        conn.close()
