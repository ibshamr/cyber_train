# CyberTrain - Security Training Platform

## 📋 Project Structure

```
cyber-train/
├── app.py                          # Flask backend server
├── requirements.txt                # Python dependencies
├── .env                           # Environment variables (API Keys)
├── templates/
│   └── index.html                 # Main HTML file
└── static/
    ├── style.css                  # Styling (Black + Red theme)
    ├── script.js                  # Main JavaScript logic
    ├── translations.js            # English/Arabic translations
    └── data.js                    # 150 questions + 50 scenarios
```

## 🚀 Installation & Setup

### Step 1: Install Python (if not already installed)
- Download from: https://www.python.org/downloads/
- Make sure to check "Add Python to PATH" during installation

### Step 2: Create Project Directory
```bash
# On Windows
mkdir C:\cyber-train
cd C:\cyber-train

# On Mac/Linux
mkdir ~/cyber-train
cd ~/cyber-train
```

### Step 3: Copy All Files
Copy the following files to the `cyber-train` directory:

**Root Level:**
- app.py
- requirements.txt
- .env
- README.md

**templates/ folder:**
- index.html

**static/ folder:**
- style.css
- script.js
- translations.js
- data.js

### Step 4: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 5: Run the Server
```bash
python app.py
```

The server will start at **http://localhost:5000**

## 🌐 Access the Application

### Default Credentials
**Employee Login:**
- Username: test
- Password: test123

**Admin Login:**
- Username: admin
- Password: cyber123

(Register new employees through the Registration page)

## ✨ Features

### 1. **Email Analysis Tool**
- Analyze emails for spoofing patterns
- Real-time risk assessment
- Smart pattern detection
- Warnings for suspicious indicators

### 2. **5-Level Exam System**
- **Beginner:** General security (30 questions)
- **Easy:** CIA Triad (30 questions)
- **Medium:** Networks (30 questions)
- **Hard:** Protocols (30 questions)
- **Advanced:** Operating Systems (30 questions)

### 3. **Email Spoofing Exam**
- 50 realistic scenarios
- Domain typo detection training
- Phishing pattern recognition
- Real-world case studies

### 4. **Training Platform**
- CIA Triad Module
- Network Security Module
- Operating Systems Security
- Email Spoofing Scenarios (50 cases)

### 5. **Admin Dashboard**
- Monitor employee progress
- View exam results
- Track user statistics
- Performance analytics

## 🎨 Theme
- **Color Scheme:** Black & Red
- **Language:** English/Arabic (Toggle available)
- **Responsive Design:** Mobile & Desktop compatible

## 📊 Data Included

- **150 Multiple Choice Questions** (5 levels × 30 questions each)
- **50 Email Spoofing Scenarios** (40 spoofed, 10 legitimate)
- **50 Training Cases** (email spoofing examples)
- **4 Training Modules** (CIA, Networks, OS, Spoofing)

## 🔐 Security Features

- SQLite database for user data
- Session management
- User authentication
- Admin access control
- Data persistence

## 🛠️ API Integration

The platform includes integration with:
- **VirusTotal API** (URL scanning)
- **Google Safe Browsing API** (Malicious URL detection)
- **OTX AlienVault API** (Threat intelligence)

API Keys are stored in `.env` file

## 📱 Language Support

- **English** (Default)
- **Arabic** (فارسي)

Click the language buttons in top-right corner to switch

## 💾 Database

- SQLite database: `cyber_train.db` (auto-created)
- Tables: users, exam_results, email_analysis

## 🔧 Troubleshooting

**Port 5000 already in use:**
```bash
# Change port in app.py
app.run(debug=True, port=5001)
```

**Database error:**
```bash
# Delete the database and restart
rm cyber_train.db
python app.py
```

**Module not found:**
```bash
# Reinstall dependencies
pip install --upgrade -r requirements.txt
```

## 📝 File Descriptions

### app.py
Flask server handling:
- User authentication (register/login)
- Exam management
- Email analysis using APIs
- Admin dashboard
- SQLite database operations

### templates/index.html
Single-page application with:
- Home page with hero animation
- Login/Register forms
- Dashboard with menu
- Email analyzer
- Training platform
- 6 exam types
- Results tracking
- Admin panel

### static/style.css
Complete styling:
- Black (#1a1a1a) and Red (#ff4444) theme
- Responsive grid layouts
- Animations and transitions
- Dark mode design
- Mobile optimization

### static/script.js
Main logic:
- Page navigation
- Form handling
- Exam management
- Email analysis display
- Result saving
- Admin functionality

### static/translations.js
Bilingual support:
- English/Arabic translations
- Real-time language switching
- All UI text translated

### static/data.js
Content database:
- 150 exam questions (organized by level)
- 50 email spoofing scenarios
- 50 training case studies
- Training module content

## 🎯 Usage Workflow

1. **Register** - Create employee account
2. **Login** - Access dashboard
3. **Learn** - Study training modules
4. **Practice** - Analyze emails with tool
5. **Test** - Take exams (1-5 levels + spoofing)
6. **Review** - Check results in "My Results"

**Admin:**
1. Login with admin credentials
2. View all employee results
3. Monitor platform statistics

## 📞 Support

For issues or questions, refer to the code comments or documentation within each file.

---

**Created:** 2024
**Version:** 1.0
**Status:** Ready for Production Use
