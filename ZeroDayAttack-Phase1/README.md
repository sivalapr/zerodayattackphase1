# 🛡️ Zero-Day Attack Detection System

A modern, AI-powered security monitoring application that detects anomalous network traffic and potential zero-day attacks using machine learning techniques.

## 📋 Features

- **Real-time Anomaly Detection**: Analyze network traffic for suspicious patterns
- **Interactive Dashboard**: Beautiful, responsive UI for security monitoring
- **Adjustable Sensitivity**: Fine-tune detection threshold with a slider (0.0 - 1.0)
- **Visual Analytics**: 
  - Bar chart showing anomaly scores
  - Threshold visualization
  - Color-coded threat indicators (Red: Threats, Green: Normal)
- **Detailed Results**: Comprehensive detection log with risk scores
- **Live Statistics**: Real-time count of normal vs detected threats
- **Professional Design**: Modern UI inspired by security monitoring tools

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Flask
- TensorFlow/Keras
- NumPy
- Pandas
- scikit-learn

### Installation

1. **Clone or extract the project**:
   ```bash
   cd ZeroDayAttack-main
   ```

2. **Create a virtual environment** (optional but recommended):
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate  # On macOS/Linux
   # or
   .venv\Scripts\activate     # On Windows
   ```

3. **Install dependencies**:
   ```bash
   pip install flask numpy pandas scikit-learn tensorflow
   ```

4. **Run the Flask server**:
   ```bash
   python app.py
   ```

5. **Open in your browser**:
   ```
   http://127.0.0.1:5000/
   ```

## 📊 How to Use

### Using the Dashboard

1. **Adjust Sensitivity Level**: 
   - Drag the slider to change the anomaly threshold
   - Lower values (closer to 0) = more sensitive (more alerts)
   - Higher values (closer to 1) = less sensitive (fewer alerts)

2. **Start Analysis**:
   - Click the "▶️ Start Analysis" button
   - Wait for the system to analyze network traffic

3. **Review Results**:
   - Check the **Detection Results** card for anomaly/normal counts
   - View the **Anomaly Score Distribution** chart
   - Scroll down to see the detailed **Detection Log** table

### Understanding the Chart

- **Red Bars**: Detected threats (anomalies above threshold)
- **Green Bars**: Normal traffic (anomalies below threshold)
- **Blue Dashed Line**: Current sensitivity threshold
- **Y-Axis**: Anomaly score (0.0 = normal, 1.0 = anomalous)
- **X-Axis**: Sample index

### Interpreting Results

| Status | Color | Meaning |
|--------|-------|---------|
| Normal | 🟢 Green | Traffic pattern is normal |
| Anomaly | 🔴 Red | Suspicious activity detected |

## 🏗️ Project Structure

```
ZeroDayAttack-main/
├── app.py                  # Flask backend server
├── detect.py               # Detection logic & ML model
├── preprocess.py           # Data preprocessing utilities
├── index.html              # Frontend HTML
├── style.css               # UI styling
├── script.js               # Frontend JavaScript & interactions
├── train.py                # Model training script
├── train_autoencoder.py    # Autoencoder model training
├── data/                   # Dataset directory
│   └── NSL-KDD/           # NSL-KDD dataset location
├── model/                  # Trained models
│   └── autoencoder.keras  # Saved autoencoder model
└── README.md              # This file
```

## 🔧 Configuration

### Sensitivity Threshold

The sensitivity level controls how aggressively threats are detected:

- **0.2 - 0.4**: Very sensitive (detects many potential threats)
- **0.5 - 0.6**: Balanced (recommended default)
- **0.7 - 0.9**: Conservative (detects only obvious threats)

## 📈 Performance Notes

- Analyzes up to 100 samples per run
- Response time: < 1 second
- Optimized for real-time monitoring

## 🔐 Security Considerations

This is a demonstration system. For production use:

1. Use real trained models on your network data
2. Implement proper authentication
3. Use HTTPS for secure connections
4. Deploy on a secure server
5. Monitor and log all detections
6. Regularly update models with new data

## 📚 Technologies Used

- **Backend**: Python, Flask
- **ML/AI**: TensorFlow, Keras, scikit-learn
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Charting**: Chart.js
- **Data Processing**: NumPy, Pandas

## 🎨 UI/UX Features

- Clean, modern interface inspired by security dashboards
- Responsive design (works on desktop and mobile)
- Smooth animations and transitions
- Color-coded status indicators
- Interactive slider for threshold adjustment
- Real-time chart updates
- Loading states and error handling

## 🐛 Troubleshooting

### Port Already in Use
If port 5000 is busy:
```bash
# On macOS/Linux
lsof -iTCP:5000
kill -9 <PID>

# Then restart the server
python app.py
```

### Missing Dependencies
```bash
pip install --upgrade flask numpy pandas scikit-learn tensorflow
```

### Blank Page
- Clear browser cache (Ctrl+Shift+Delete)
- Ensure Flask server is running
- Check browser console for errors (F12)

## 📝 API Endpoints

### GET /
Returns the main dashboard HTML page

### GET /detect?threshold=<value>
Analyzes traffic and returns detection results

**Parameters:**
- `threshold` (float, 0.0-1.0): Anomaly sensitivity threshold

**Response:**
```json
[
  {
    "index": 0,
    "score": 0.1234,
    "status": "Normal"
  },
  {
    "index": 1,
    "score": 0.8765,
    "status": "Anomaly"
  }
]
```

## 🚀 Future Enhancements

- [ ] Real-time streaming analysis
- [ ] Database integration for result history
- [ ] Multiple detection model support
- [ ] Custom alerting system
- [ ] Export detection results (CSV/PDF)
- [ ] API authentication
- [ ] Advanced filtering options
- [ ] Network traffic packet analysis

## 📄 License

This project is provided as-is for educational and research purposes.

## 👨‍💻 Development

### Running in Development Mode
```bash
python app.py  # Runs with debug=True
```

### Making Changes
1. Edit the frontend files (HTML/CSS/JS)
2. Browser will auto-reload (debug mode)
3. For backend changes, restart the server

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review browser console logs (F12)
3. Check Flask server terminal for errors

## 🎯 Next Steps

1. **Train your model**: Use `train_autoencoder.py` with your dataset
2. **Customize threshold**: Adjust for your security requirements
3. **Deploy**: Move to production with proper security
4. **Monitor**: Use the dashboard to track threats in real-time

---

**Made with ❤️ for cybersecurity**