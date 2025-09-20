# ML Disease Prediction System

A comprehensive machine learning-powered web application that predicts diseases based on user-provided symptoms. Built with React.js frontend and Flask backend, featuring a highly accurate Random Forest classifier.

## ✨ Features

- ** High Accuracy Prediction**: 99.6% accuracy using Random Forest Classifier
- ** Comprehensive Symptom Database**: 132 different symptoms supported
- ** Disease Coverage**: Can predict 41 different diseases
- ** Detailed Results**: Provides disease description and precautionary measures
- ** Modern UI**: Responsive design with Tailwind CSS
- ** Real-time Prediction**: Instant results with loading states
- ** Mobile Friendly**: Works seamlessly on all devices

## Tech Stack

### Backend

- **Python 3.x**
- **Flask** - Web framework
- **scikit-learn** - Machine learning library
- **pandas** - Data manipulation
- **numpy** - Numerical computing
- **joblib** - Model serialization

### Frontend

- **React.js 17** - Frontend framework
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Navigation

### Machine Learning

- **Random Forest Classifier** - Primary ML model
- **Cross-validation** - Model evaluation
- **Feature Engineering** - Symptom weight mapping

## Dataset Information

- **Total Diseases**: 41
- **Total Symptoms**: 132
- **Training Data**: 4,920 records
- **Model Accuracy**: 99.6%
- **Features**: 17 symptom columns per record

## Quick Start

### Prerequisites

- Python 3.7+
- Node.js 14+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install Python dependencies:

```bash
pip install -r requirements.txt
```

3. Run the Flask server:

```bash
python app.py
```

The API will be available at `http://127.0.0.1:5000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
ML-Disease-Prediction-main/
├── backend/
│   ├── app.py                          # Flask API server
│   ├── datasets/                       # Training datasets
│   │   ├── dataset.csv                 # Main symptom-disease dataset
│   │   ├── Symptom-severity.csv       # Symptom weight mapping
│   │   ├── symptom_Description.csv    # Disease descriptions
│   │   └── symptom_precaution.csv     # Precautionary measures
│   ├── model/
│   │   └── model.sav                   # Trained SVM model
│   ├── random_forest.joblib           # Trained Random Forest model
│   ├── disease-symptom-prediction.ipynb # Jupyter notebook for model training
│   └── requirements.txt               # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Form.js                # Symptom input form
│   │   │   └── HomePage.js            # Landing page
│   │   ├── images/                    # UI assets
│   │   └── App.js                     # Main React component
│   ├── package.json                   # Frontend dependencies
│   └── tailwind.config.js            # Tailwind configuration
└── README.md
```

## 🔧 API Endpoints

### POST `/`

Predict disease based on symptoms

```json
{
  "symptoms": ["fatigue", "yellowish_skin", "loss_of_appetite"]
}
```

**Response:**

```json
{
  "disease": "Hepatitis A",
  "description": "Hepatitis A is a highly contagious liver infection...",
  "precautions": ["Consult doctor", "Rest", "Stay hydrated"]
}
```

### GET `/disease`

Get list of available symptoms

```json
{
  "response": ["fatigue", "yellowish_skin", "loss_of_appetite", ...]
}
```

## 🧠 Machine Learning Model

The system uses a **Random Forest Classifier** trained on medical data:

- **Algorithm**: Random Forest with 500 estimators
- **Max Depth**: 13
- **Max Features**: sqrt
- **Cross-validation**: 10-fold
- **Accuracy**: 99.6% on test set
- **F1-Score**: 99.58%

### Model Training Process

1. **Data Preprocessing**: Clean and normalize symptom data
2. **Feature Engineering**: Map symptoms to numerical weights
3. **Train-Test Split**: 80% training, 20% testing
4. **Model Training**: Random Forest with hyperparameter tuning
5. **Evaluation**: Cross-validation and performance metrics
6. **Model Persistence**: Save trained model using joblib

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional medical interface
- **Gradient Styling**: Green-themed color scheme
- **Interactive Forms**: Dynamic symptom selection
- **Loading States**: Visual feedback during prediction
- **Modal Results**: Clean result display
- **Responsive Layout**: Mobile-first design approach

## Important Notes

**Medical Disclaimer**: This application is for educational and informational purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical concerns.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Abhiyan Sainju** - _Initial work_ - [GitHub Profile](https://github.com/aabhiyann)

## Acknowledgments

- Medical dataset providers
- scikit-learn community
- React.js and Flask communities
- Open source contributors

---

**Made with ❤️ for better healthcare accessibility**
