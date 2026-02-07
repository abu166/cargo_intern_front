import express from 'express';
import { getShipmentsDb } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const db = await getShipmentsDb();
        const shipments = await db.all('SELECT * FROM shipments ORDER BY created_at DESC');
        res.json(shipments);
    } catch (error) {
        console.error('Get shipments error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get shipments by from_station (for receivers)
router.get('/by-station/:station', async (req, res) => {
    try {
        const { station } = req.params;
        const db = await getShipmentsDb();
        const shipments = await db.all(
            'SELECT * FROM shipments WHERE from_station = ? ORDER BY created_at DESC',
            [station]
        );
        res.json(shipments);
    } catch (error) {
        console.error('Get shipments by station error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update shipment status
router.patch('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const db = await getShipmentsDb();

        await db.run('UPDATE shipments SET status = ? WHERE id = ?', [status, id]);
        const shipment = await db.get('SELECT * FROM shipments WHERE id = ?', [id]);

        // Emit update to station room
        const io = req.app.get('io');
        if (io) {
            io.to(`station:${shipment.from_station}`).emit('shipment-updated', shipment);
        }

        res.json(shipment);
    } catch (error) {
        console.error('Update shipment status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { client_id, client_name, client_email, from_station, to_station, departure_date, weight, dimensions, description, value } = req.body;
        const db = await getShipmentsDb();
        const id = 'SH-' + Date.now().toString().slice(-6);

        await db.run(
            `INSERT INTO shipments (
                id, client_id, client_name, client_email, from_station, to_station, 
                status, weight, dimensions, description, value, departure_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id, client_id, client_name, client_email, from_station, to_station,
                'В пути', weight, dimensions, description, value, departure_date || new Date().toISOString()
            ]
        );

        const shipment = await db.get('SELECT * FROM shipments WHERE id = ?', [id]);

        // Emit new shipment to station room
        const io = req.app.get('io');
        if (io) {
            io.to(`station:${from_station}`).emit('new-shipment', shipment);
        }

        res.json(shipment);
    } catch (error) {
        console.error('Create shipment error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
