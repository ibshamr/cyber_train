from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime
from dotenv import load_dotenv
import requests
import re
from urllib.parse import urlparse
import time
import json

load_dotenv()

app = Flask(__name__)
app.secret_key = 'cyber-train-secret-key-2024'
CORS(app)

# ============= API KEYS =============
OTX_KEY = os.getenv('OTX_KEY', '39d2146345368a5d26b2f94b6752ffbd6cf63a789eaa0868def5d36776019e70')
VIRUSTOTAL_KEY = os.getenv('VIRUSTOTAL_KEY', 'a68dd667bb74ceb635d4533d798441e8a91a107532d574661458689b638999b8')
MXTOOLBOX_KEY = os.getenv('MXTOOLBOX_KEY', '15bc7982-ce05-4bed-bc21-7d30441af639')

ADMIN_USER = 'admin'
ADMIN_PASS = 'cyber123'

print("\n" + "="*70)
print("[CyberTrain] Advanced Email Spoofing Detection Engine")
print("="*70)
print("[OK] API #1 - OTX AlienVault (Domain Reputation)")
print("[OK] API #2 - VirusTotal (URL Scanning)")
print("[OK] API #3 - MXToolbox (SPF/DKIM/DMARC Verification)")
print("="*70 + "\n")

def get_db():
    db = sqlite3.connect('cyber_train.db')
    db.row_factory = sqlite3.Row
    return db

def init_db():
    db = get_db()
    db.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT UNIQUE,
            password TEXT,
            email TEXT,
            created_at TIMESTAMP
        )
    ''')
    db.execute('''
        CREATE TABLE IF NOT EXISTS exam_results (
            id INTEGER PRIMARY KEY,
            user_id INTEGER,
            exam_type TEXT,
            level TEXT,
            score INTEGER,
            total INTEGER,
            created_at TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    ''')
    db.commit()
    db.close()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    db = get_db()
    try:
        db.execute(
            'INSERT INTO users (username, password, email, created_at) VALUES (?, ?, ?, ?)',
            (username, password, None, datetime.now())
        )
        db.commit()
        return jsonify({'success': True, 'message': 'Registration successful'})
    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'message': 'Username already exists'}), 400
    finally:
        db.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    db = get_db()
    user = db.execute(
        'SELECT id, username FROM users WHERE username = ? AND password = ?',
        (username, password)
    ).fetchone()
    db.close()
    
    if user:
        session['user_id'] = user['id']
        session['username'] = user['username']
        return jsonify({'success': True, 'message': 'Login successful'})
    else:
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@app.route('/api/admin-login', methods=['POST'])
def admin_login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if username == ADMIN_USER and password == ADMIN_PASS:
        session['admin'] = True
        return jsonify({'success': True, 'message': 'Admin login successful'})
    else:
        return jsonify({'success': False, 'message': 'Invalid admin credentials'}), 401

# =============== ADVANCED EMAIL SPOOFING DETECTOR ===============

class EmailSpoofingDetector:
    """
    Advanced Email Spoofing Detection using 3 Real APIs:
    1. OTX AlienVault - Domain Reputation
    2. VirusTotal - URL Scanning
    3. MXToolbox - Email Headers (SPF/DKIM/DMARC)
    """
    
    def __init__(self):
        self.risk_score = 0
        self.warnings = []
        self.api_results = {}
    
    # ========== API #1: OTX AlienVault - Domain Reputation ==========
    def check_domain_otx(self, domain):
        """Check domain reputation with OTX AlienVault"""
        print("[API #1] Checking domain: " + domain)
        
        try:
            headers = {'X-OTX-API-KEY': OTX_KEY}
            response = requests.get(
                'https://otx.alienvault.com/api/v1/indicators/domain/' + domain,
                headers=headers,
                timeout=8
            )
            
            if response.status_code == 200:
                data = response.json()
                reputation = data.get('reputation', 0)
                pulse_count = len(data.get('pulse_info', {}).get('pulses', []))
                alexa_rank = data.get('alexa_rank', None)
                
                print("    [OK] Reputation Score: " + str(reputation))
                print("    [OK] Threat Pulses: " + str(pulse_count))
                
                self.api_results['otx_domain'] = {
                    'reputation': reputation,
                    'pulses': pulse_count,
                    'status': 'checked'
                }
                
                # Scoring
                if reputation < -50:
                    self.risk_score += 35
                    self.warnings.append("[OTX] Domain '" + domain + "' has VERY NEGATIVE reputation (" + str(reputation) + ")")
                elif reputation < 0:
                    self.risk_score += 20
                    self.warnings.append("[OTX] Domain '" + domain + "' has negative reputation (" + str(reputation) + ")")
                
                if pulse_count > 5:
                    self.risk_score += 25
                    self.warnings.append("[OTX] Domain flagged in " + str(pulse_count) + " THREAT PULSES")
                elif pulse_count > 0:
                    self.risk_score += 12
                    self.warnings.append("[OTX] Domain in " + str(pulse_count) + " threat intelligence reports")
                
                return True
        except Exception as e:
            print("    [ERROR] OTX Error: " + str(e))
            self.api_results['otx_domain'] = {'status': 'error', 'message': str(e)}
        
        return False
    
    # ========== API #2: VirusTotal - URL Scanning ==========
    def check_url_virustotal(self, url):
        """Check URL with VirusTotal"""
        print("[API #2] Checking: " + url)
        
        try:
            headers = {'x-apikey': VIRUSTOTAL_KEY}
            
            # Submit URL
            submit_response = requests.post(
                'https://www.virustotal.com/api/v3/urls',
                data={'url': url},
                headers=headers,
                timeout=8
            )
            
            if submit_response.status_code == 200:
                submit_data = submit_response.json()
                url_id = submit_data['data']['id']
                
                time.sleep(0.5)
                
                # Get results
                analysis_response = requests.get(
                    'https://www.virustotal.com/api/v3/urls/' + url_id,
                    headers=headers,
                    timeout=8
                )
                
                if analysis_response.status_code == 200:
                    data = analysis_response.json()
                    stats = data['data']['attributes']['last_analysis_stats']
                    
                    malicious = stats.get('malicious', 0)
                    suspicious = stats.get('suspicious', 0)
                    
                    print("    [OK] Malicious: " + str(malicious))
                    print("    [OK] Suspicious: " + str(suspicious))
                    
                    if malicious > 0:
                        self.risk_score += 40
                        self.warnings.append("[VirusTotal] MALICIOUS URL: " + url + " (" + str(malicious) + " vendors flagged)")
                    elif suspicious > 0:
                        self.risk_score += 20
                        self.warnings.append("[VirusTotal] SUSPICIOUS URL: " + url + " (" + str(suspicious) + " vendors flagged)")
                    
                    return True
        except Exception as e:
            print("    [ERROR] VirusTotal Error: " + str(e))
        
        return False
    
    # ========== API #3: MXToolbox - SPF/DKIM/DMARC ==========
    def check_email_headers_mxtoolbox(self, domain):
        """Check Email Authentication with MXToolbox"""
        print("[API #3] Checking Email Authentication for: " + domain)
        
        try:
            base_url = 'https://api.mxtoolbox.com/api/v1'
            
            # Check SPF
            print("    Checking SPF Record...")
            spf_response = requests.get(
                base_url + '/spf/' + domain,
                params={'apikey': MXTOOLBOX_KEY},
                timeout=8
            )
            
            spf_valid = False
            if spf_response.status_code == 200:
                spf_data = spf_response.json()
                spf_valid = spf_data.get('status') == 'valid'
                print("       [OK] SPF: " + spf_data.get('status', 'not found'))
                
                if not spf_valid:
                    self.risk_score += 15
                    self.warnings.append("[MXToolbox] SPF record MISSING or INVALID for " + domain)
            
            time.sleep(0.5)
            
            # Check DMARC
            print("    Checking DMARC Policy...")
            dmarc_response = requests.get(
                base_url + '/dmarc/' + domain,
                params={'apikey': MXTOOLBOX_KEY},
                timeout=8
            )
            
            dmarc_valid = False
            if dmarc_response.status_code == 200:
                dmarc_data = dmarc_response.json()
                dmarc_valid = dmarc_data.get('status') == 'valid'
                print("       [OK] DMARC: " + dmarc_data.get('status', 'not found'))
                
                if not dmarc_valid:
                    self.risk_score += 15
                    self.warnings.append("[MXToolbox] DMARC policy MISSING or WEAK for " + domain)
            
            time.sleep(0.5)
            
            # Check MX Records
            print("    Checking MX Records...")
            mx_response = requests.get(
                base_url + '/mxlookup/' + domain,
                params={'apikey': MXTOOLBOX_KEY},
                timeout=8
            )
            
            if mx_response.status_code == 200:
                mx_data = mx_response.json()
                mx_records = mx_data.get('result', [])
                print("       [OK] MX Records Found: " + str(len(mx_records)))
                
                if len(mx_records) == 0:
                    self.risk_score += 20
                    self.warnings.append("[MXToolbox] NO MX RECORDS - Domain cannot receive emails!")
            
            self.api_results['mxtoolbox_headers'] = {
                'spf_valid': spf_valid,
                'dmarc_valid': dmarc_valid,
                'status': 'checked'
            }
            
            return True
        except Exception as e:
            print("    [ERROR] MXToolbox Error: " + str(e))
            self.api_results['mxtoolbox_headers'] = {'status': 'error', 'message': str(e)}
        
        return False
    
    def extract_urls(self, text):
        """Extract URLs from text"""
        url_pattern = r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'
        return re.findall(url_pattern, text)
    
    def detect_patterns(self, subject, body, sender):
        """Detect suspicious patterns"""
        text = (subject + " " + body).lower()
        
        # Urgency keywords
        urgent_keywords = [
            'verify account', 'confirm password', 'click here', 'urgent',
            'act now', '24 hour', 'immediate', 'suspended', 'locked',
            'unusual activity', 'security alert', 're-enter', 're-verify'
        ]
        
        found_urgency = []
        for keyword in urgent_keywords:
            if keyword in text:
                found_urgency.append(keyword)
        
        if len(found_urgency) >= 2:
            self.risk_score += 15
            self.warnings.append("[PATTERN] HIGH URGENCY LANGUAGE: " + ", ".join(found_urgency[:2]))
        
        # Generic greeting
        if any(greeting in text for greeting in ['dear user', 'dear customer', 'account holder']):
            self.risk_score += 8
            self.warnings.append("[PATTERN] Generic greeting (not personalized)")
        
        # Grammar errors
        errors = ['recieve', 'occured', 'bussiness', 'knowlege']
        if any(error in text for error in errors):
            self.risk_score += 5
            self.warnings.append("[PATTERN] Spelling/grammar errors detected")
    
    def analyze(self, sender, subject, body):
        """Complete Email Spoofing Analysis"""
        print("\n" + "="*70)
        print("[CyberTrain] COMPLETE EMAIL ANALYSIS - 3 REAL APIS")
        print("="*70)
        print("From: " + sender)
        print("Subject: " + subject)
        print("-"*70)
        
        self.risk_score = 0
        self.warnings = []
        self.api_results = {}
        
        # Extract domain
        if '@' not in sender:
            self.warnings.append("[ERROR] Invalid email format")
            return self._finalize(sender)
        
        domain = sender.split('@')[1].lower()
        urls = self.extract_urls(body)
        
        # Step 1: OTX - Domain Reputation
        print("\n[STEP 1] Domain Reputation Check (OTX AlienVault)")
        self.check_domain_otx(domain)
        time.sleep(1)
        
        # Step 2: VirusTotal - URL Scanning
        if urls:
            print("\n[STEP 2] URL Scanning (VirusTotal) - Found " + str(len(urls)) + " URL(s)")
            for url in urls:
                self.check_url_virustotal(url)
                time.sleep(0.5)
        else:
            print("\n[STEP 2] No URLs found in email body")
        
        # Step 3: MXToolbox - Email Headers
        print("\n[STEP 3] Email Authentication Verification (MXToolbox)")
        self.check_email_headers_mxtoolbox(domain)
        
        # Step 4: Pattern Detection
        print("\n[STEP 4] Content Analysis & Pattern Detection")
        self.detect_patterns(subject, body, sender)
        
        return self._finalize(sender)
    
    def _finalize(self, sender):
        """Finalize analysis and calculate final score"""
        self.risk_score = min(max(self.risk_score, 0), 100)
        
        if self.risk_score >= 50:
            risk_level = 'CRITICAL'
        elif self.risk_score >= 30:
            risk_level = 'HIGH'
        elif self.risk_score >= 15:
            risk_level = 'MEDIUM'
        else:
            risk_level = 'LOW'
        
        print("\n" + "="*70)
        print("[RESULT] ANALYSIS COMPLETE")
        print("Risk Level: " + risk_level)
        print("Risk Score: " + str(self.risk_score) + "/100")
        print("Total Warnings: " + str(len(self.warnings)))
        print("="*70 + "\n")
        
        return {
            'email': sender,
            'risk_level': risk_level,
            'warnings': self.warnings,
            'details': {
                'sender': sender,
                'risk_score': self.risk_score,
                'api_results': self.api_results,
                'patterns_found': len(self.warnings)
            }
        }

@app.route('/api/check-email', methods=['POST'])
def check_email():
    data = request.json
    sender = data.get('email', '')
    subject = data.get('subject', '')
    body = data.get('body', '')
    
    try:
        detector = EmailSpoofingDetector()
        result = detector.analyze(sender, subject, body)
        return jsonify(result)
    except Exception as e:
        print("[ERROR] Analysis Error: " + str(e))
        return jsonify({
            'email': sender,
            'risk_level': 'error',
            'warnings': ['Error: ' + str(e)],
            'details': {'risk_score': 0}
        }), 500

@app.route('/api/save-exam-result', methods=['POST'])
def save_exam_result():
    if 'user_id' not in session:
        return jsonify({'success': False}), 401
    
    data = request.json
    db = get_db()
    db.execute(
        'INSERT INTO exam_results (user_id, exam_type, level, score, total, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        (session['user_id'], data['type'], data['level'], data['score'], data['total'], datetime.now())
    )
    db.commit()
    db.close()
    return jsonify({'success': True})

@app.route('/api/get-user-results')
def get_user_results():
    if 'user_id' not in session:
        return jsonify([]), 401
    
    db = get_db()
    results = db.execute(
        'SELECT * FROM exam_results WHERE user_id = ? ORDER BY created_at DESC',
        (session['user_id'],)
    ).fetchall()
    db.close()
    return jsonify([dict(row) for row in results])

@app.route('/api/admin/dashboard')
def admin_dashboard():
    if 'admin' not in session:
        return jsonify({'success': False}), 401
    
    db = get_db()
    results = db.execute('''
        SELECT u.username, e.exam_type, e.level, e.score, e.total, e.created_at
        FROM exam_results e
        JOIN users u ON e.user_id = u.id
        ORDER BY e.created_at DESC
    ''').fetchall()
    
    user_count = db.execute('SELECT COUNT(*) as count FROM users').fetchone()['count']
    db.close()
    
    return jsonify({'total_users': user_count, 'results': [dict(row) for row in results]})

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'success': True})

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)
