const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS middleware
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors());

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Path to the JSON file
const filePath = path.join(__dirname, 'sinkBallDetailsSizeAdjusted.json');

// Endpoint to create or update the JSON file
app.post('/update-json', (req, res) => {
  const newData = req.body; // Expecting JSON data in the request body

  // Read the existing file or initialize an empty object
  let fileData = {};
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    fileData = JSON.parse(fileContent || '{}');
  }

  // Merge the new data into the existing data
  Object.keys(newData).forEach((key) => {
    if (!fileData[key]) {
      fileData[key] = [];
    }
    fileData[key] = [...fileData[key], ...newData[key]];
  });

  // Write the updated data back to the file
  fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));

  res.status(200).json({ message: 'JSON file updated successfully', data: fileData });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
