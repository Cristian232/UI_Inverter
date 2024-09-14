import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const port = 5000;

// Enable CORS for all routes
app.use(cors());

// Proxy route for the Huawei FusionSolar API
app.get('/api', async (req, res) => {
    try {
        console.log('Received request on Express server');
        const response = await axios.get('https://uni005eu5.fusionsolar.huawei.com/rest/pvms/web/kiosk/v1/station-kiosk-file', {
            params: {
                kk: 'sNajsiGlq0dMM0Hu7kBh34ymBJaLseed'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error proxying request:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching data from the API' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Express server running at http://localhost:${port}`);
});