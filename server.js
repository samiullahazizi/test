const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
// Serve static files from the 'public' directory
app.use(express.static('public'));

const dataFilePath = path.join(__dirname, 'data.json');
let data = {
    indexesforinformationpass: [] // Add indexesforinformationpass array
};

// Load data from JSON file
function loadData() {
    if (fs.existsSync(dataFilePath)) {
        const fileData = fs.readFileSync(dataFilePath);
        data = JSON.parse(fileData);
    }
}

// Save data to JSON file
function saveData() {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}


loadData();




// Endpoint to handle POST request
app.post('/api/indexesforinformationpass', (req, res) => {
    const { indexRange } = req.body;
    console.log('Received index range:', indexRange);

    // Ensure indexesforinformationpass array exists
    if (!Array.isArray(data.indexesforinformationpass)) {
        console.error('indexesforinformationpass is not an array');
        data.indexesforinformationpass = [];
    }

    // Check if data already exists
    if (data.indexesforinformationpass.length > 0) {
        console.log('Data already exists. No need to add more.');
        return res.status(400).json({ error: 'Data already exists. No need to add more.' });
    }

    // Update indexesforinformationpass array
    data.indexesforinformationpass.push(indexRange);

    // Save updated data
    try {
        saveData();
    } catch (error) {
        console.error('Error saving data:', error);
        return res.status(500).json({ error: 'Failed to save data' });
    }

    res.json({ message: 'Index range received', indexRange });
});

// Endpoint to handle PUT request for updating index range
app.put('/api/updateindexesforinformationpass', (req, res) => {
    const { indexRange } = req.body;
    console.log('Received index range for update:', indexRange);

    // Ensure indexesforinformationpass array exists
    if (!Array.isArray(data.indexesforinformationpass)) {
        console.error('indexesforinformationpass is not an array');
        data.indexesforinformationpass = [];
    }

    // Update the first entry in indexesforinformationpass array
    if (data.indexesforinformationpass.length > 0) {
        data.indexesforinformationpass[0] = indexRange;
    } else {
        data.indexesforinformationpass.push(indexRange);
    }

    // Save updated data
    try {
        saveData();
    } catch (error) {
        console.error('Error saving data:', error);
        return res.status(500).json({ error: 'Failed to save data' });
    }

    res.json({ message: 'Index range updated', indexRange });
});


// Serve the favicon.ico file
app.get('/favicon.ico', (req, res) => {

});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'infopassingrange.html'));
});

app.get('/styles/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'styles', 'style.css'));
});

app.get('/src/infopassingrange.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'infopassingrange.js'));
}
);





app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});