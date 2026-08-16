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
import whois

load_dotenv()

app = Flask(__name__)

# ============= SECRETS (from .env ONLY - no hardcoded fallbacks) =============
app.secret_key = os.getenv('SECRET_KEY')
OTX_KEY = os.getenv('OTX_KEY')
VIRUSTOTAL_KEY = os.getenv('VIRUSTOTAL_KEY')
MXTOOLBOX_KEY = os.getenv('MXTOOLBOX_KEY')
ADMIN_USER = os.getenv('ADMIN_USER')
ADMIN_PASS = os.getenv('ADMIN_PASS')

_required = {
    'SECRET_KEY': app.secret_key, 'OTX_KEY': OTX_KEY, 'VIRUSTOTAL_KEY': VIRUSTOTAL_KEY,
    'MXTOOLBOX_KEY': MXTOOLBOX_KEY, 'ADMIN_USER': ADMIN_USER, 'ADMIN_PASS': ADMIN_PASS
}
_missing = [k for k, v in _required.items() if not v]
if _missing:
    raise RuntimeError(
        "Missing required .env values: " + ", ".join(_missing) +
        ". Create a .env file next to app.py with these keys set (see .env template)."
    )

CORS(app)

print("\n" + "="*70)
print("[CyberTrain] Advanced Email Spoofing Detection Engine")
print("="*70)
print("[OK] API #1 - OTX AlienVault (Domain Reputation)")
print("[OK] API #2 - VirusTotal (URL Scanning)")
print("[OK] API #3 - MXToolbox (Email Headers)")
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
            created_at TIMESTAMP,
            pledge_accepted INTEGER DEFAULT 0,
            pledge_accepted_at TIMESTAMP
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
    db.execute('''
        CREATE TABLE IF NOT EXISTS email_checks (
            id INTEGER PRIMARY KEY,
            user_id INTEGER,
            sender TEXT,
            risk_level TEXT,
            risk_score INTEGER,
            created_at TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    ''')
    # ترقية قاعدة بيانات قديمة (لو الجدول موجود من قبل بدون عمود التعهد)
    try:
        db.execute('ALTER TABLE users ADD COLUMN pledge_accepted INTEGER DEFAULT 0')
    except sqlite3.OperationalError:
        pass
    try:
        db.execute('ALTER TABLE users ADD COLUMN pledge_accepted_at TIMESTAMP')
    except sqlite3.OperationalError:
        pass
    db.commit()
    db.close()

# تنشئ الجداول فور تحميل الملف (يشتغل مع Gunicorn ومع python app.py على حد سواء)
init_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'success': False, 'message': 'Username and password are required'}), 400

    db = get_db()
    try:
        cursor = db.execute(
            'INSERT INTO users (username, password, email, created_at, pledge_accepted) VALUES (?, ?, ?, ?, 0)',
            (username, password, None, datetime.now())
        )
        db.commit()
        new_user_id = cursor.lastrowid

        # تسجيل دخول تلقائي بعد التسجيل، عشان نقدر نعرض شاشة التعهد فوراً
        session['user_id'] = new_user_id
        session['username'] = username

        return jsonify({
            'success': True,
            'message': 'Registration successful',
            'needs_pledge': True
        })
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
        'SELECT id, username, pledge_accepted FROM users WHERE username = ? AND password = ?',
        (username, password)
    ).fetchone()
    db.close()

    if user:
        session['user_id'] = user['id']
        session['username'] = user['username']
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'needs_pledge': not bool(user['pledge_accepted'])
        })
    else:
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@app.route('/api/accept-pledge', methods=['POST'])
def accept_pledge():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Not logged in'}), 401

    db = get_db()
    db.execute(
        'UPDATE users SET pledge_accepted = 1, pledge_accepted_at = ? WHERE id = ?',
        (datetime.now(), session['user_id'])
    )
    db.commit()
    db.close()
    return jsonify({'success': True, 'message': 'Pledge accepted'})

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

# =============== COMPREHENSIVE EMAIL ANALYSIS ENGINE ===============

class ComprehensiveEmailAnalyzer:
    """
    Comprehensive Email Spoofing Detection with Detailed Report
    Analyzes all aspects: Domain, URLs, Headers, SPF, DKIM, DMARC
    """
    
    def __init__(self):
        self.risk_score = 0
        self.report = {
            'email_info': {},
            'api_1_otx': {},
            'api_2_virustotal': {},
            'api_3_mxtoolbox': {},
            'api_4_whois': {},
            'pattern_analysis': {},
            'security_checks': {},
            'overall_assessment': {},
            'recommendations': []
        }
    
    def analyze_sender_email(self, sender):
        """تحليل بيانات البريل من المُرسل"""
        # تنظيف الإيميل من علامات < > ومسافات زائدة، تحسباً للصق رأس بريد كامل
        # مثال: '"Name" <user@domain.com>' أو 'user@domain.com>' يتحول إلى 'user@domain.com'
        sender = sender.strip()
        match = re.search(r'[\w.+-]+@[\w-]+\.[\w.-]+', sender)
        if match:
            sender = match.group(0)

        if '@' not in sender:
            self.report['email_info'] = {
                'status': 'INVALID',
                'error': 'Email format is invalid'
            }
            return None
        
        domain = sender.split('@')[1].lower()
        username = sender.split('@')[0].lower()
        
        self.report['email_info'] = {
            'full_email': sender,
            'username': username,
            'domain': domain,
            'domain_extension': domain.split('.')[-1] if '.' in domain else 'unknown'
        }
        
        return domain
    
    def api1_otx_domain_check(self, domain):
        """API #1: OTX AlienVault - فحص سمعة الـ Domain"""
        print("\n[API #1] OTX AlienVault - Domain Reputation Check")
        print("Domain: " + domain)
        
        api_data = {
            'api_name': 'OTX AlienVault',
            'check_type': 'Domain Reputation & Threat Intelligence',
            'status': 'pending',
            'findings': {},
            'risk_assessment': {}
        }
        
        try:
            headers = {'X-OTX-API-KEY': OTX_KEY}
            response = requests.get(
                'https://otx.alienvault.com/api/v1/indicators/domain/' + domain,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                reputation = data.get('reputation', 0)
                pulse_count = len(data.get('pulse_info', {}).get('pulses', []))
                
                api_data['status'] = 'completed'
                api_data['findings'] = {
                    'reputation_score': reputation,
                    'threat_pulses_count': pulse_count,
                    'reputation_interpretation': self._interpret_reputation(reputation),
                    'pulse_interpretation': self._interpret_pulses(pulse_count)
                }
                
                # تقييم المخاطر
                risk_points = 0
                risk_reasons = []
                
                if reputation < -50:
                    risk_points += 35
                    risk_reasons.append('Domain has EXTREMELY NEGATIVE reputation (' + str(reputation) + ')')
                elif reputation < 0:
                    risk_points += 20
                    risk_reasons.append('Domain has negative reputation (' + str(reputation) + ')')
                
                if pulse_count > 5:
                    risk_points += 25
                    risk_reasons.append('Domain appears in ' + str(pulse_count) + ' THREAT INTELLIGENCE REPORTS')
                elif pulse_count > 0:
                    risk_points += 12
                    risk_reasons.append('Domain appears in ' + str(pulse_count) + ' threat intelligence reports')
                
                api_data['risk_assessment'] = {
                    'risk_points': risk_points,
                    'reasons': risk_reasons,
                    'severity': 'CRITICAL' if risk_points >= 35 else 'HIGH' if risk_points >= 20 else 'MEDIUM' if risk_points > 0 else 'LOW'
                }
                
                self.risk_score += risk_points
                
                print("  Reputation: " + str(reputation))
                print("  Threat Pulses: " + str(pulse_count))
                print("  Risk Points: " + str(risk_points))
            else:
                api_data['status'] = 'error'
                api_data['error'] = 'HTTP ' + str(response.status_code)
                
        except Exception as e:
            api_data['status'] = 'error'
            api_data['error'] = str(e)
            print("  ERROR: " + str(e))
        
        self.report['api_1_otx'] = api_data
        return api_data
    
    def api2_virustotal_url_check(self, urls):
        """API #2: VirusTotal - فحص الروابط في البريل"""
        print("\n[API #2] VirusTotal - URL Scanning")
        
        api_data = {
            'api_name': 'VirusTotal',
            'check_type': 'URL Malware & Phishing Detection',
            'status': 'pending',
            'urls_found': len(urls),
            'urls_analysis': []
        }
        
        if len(urls) == 0:
            api_data['status'] = 'no_urls'
            api_data['message'] = 'No URLs found in email body'
            self.report['api_2_virustotal'] = api_data
            return api_data
        
        try:
            headers = {'x-apikey': VIRUSTOTAL_KEY}
            
            for url in urls:
                print("  Checking: " + url)
                url_analysis = {'url': url, 'status': 'pending'}
                
                try:
                    # Submit URL
                    submit_response = requests.post(
                        'https://www.virustotal.com/api/v3/urls',
                        data={'url': url},
                        headers=headers,
                        timeout=10
                    )
                    
                    if submit_response.status_code == 200:
                        submit_data = submit_response.json()
                        url_id = submit_data['data']['id']
                        
                        time.sleep(1)
                        
                        # Get results
                        analysis_response = requests.get(
                            'https://www.virustotal.com/api/v3/urls/' + url_id,
                            headers=headers,
                            timeout=10
                        )
                        
                        if analysis_response.status_code == 200:
                            analysis_data = analysis_response.json()
                            stats = analysis_data['data']['attributes']['last_analysis_stats']
                            
                            malicious = stats.get('malicious', 0)
                            suspicious = stats.get('suspicious', 0)
                            harmless = stats.get('harmless', 0)
                            undetected = stats.get('undetected', 0)
                            total = malicious + suspicious + harmless + undetected
                            
                            url_analysis['status'] = 'completed'
                            url_analysis['scan_results'] = {
                                'malicious_vendors': malicious,
                                'suspicious_vendors': suspicious,
                                'harmless_vendors': harmless,
                                'undetected_vendors': undetected,
                                'total_vendors': total
                            }
                            
                            # Risk assessment
                            risk_points = 0
                            severity_level = 'LOW'
                            
                            if malicious > 0:
                                risk_points = 40
                                severity_level = 'CRITICAL'
                                url_analysis['threat_level'] = 'MALICIOUS'
                            elif suspicious > 0:
                                risk_points = 20
                                severity_level = 'HIGH'
                                url_analysis['threat_level'] = 'SUSPICIOUS'
                            else:
                                severity_level = 'SAFE'
                                url_analysis['threat_level'] = 'SAFE'
                            
                            url_analysis['risk_assessment'] = {
                                'risk_points': risk_points,
                                'severity': severity_level
                            }
                            
                            self.risk_score += risk_points
                            
                            print("    Malicious: " + str(malicious))
                            print("    Suspicious: " + str(suspicious))
                            print("    Safe: " + str(harmless))
                    else:
                        url_analysis['status'] = 'error'
                        url_analysis['error'] = 'HTTP ' + str(submit_response.status_code)
                
                except Exception as url_error:
                    url_analysis['status'] = 'error'
                    url_analysis['error'] = str(url_error)
                
                api_data['urls_analysis'].append(url_analysis)
            
            api_data['status'] = 'completed'
            
        except Exception as e:
            api_data['status'] = 'error'
            api_data['error'] = str(e)
            print("  ERROR: " + str(e))
        
        self.report['api_2_virustotal'] = api_data
        return api_data
    
    def api3_mxtoolbox_headers_check(self, domain):
        """API #3: MXToolbox - فحص SPF/DKIM/DMARC/MX"""
        print("\n[API #3] MXToolbox - Email Authentication Headers")
        
        api_data = {
            'api_name': 'MXToolbox',
            'check_type': 'Email Authentication (SPF, DKIM, DMARC, MX)',
            'status': 'pending',
            'domain': domain,
            'checks': {}
        }
        
        try:
            base_url = 'https://api.mxtoolbox.com/api/v1'
            
            # SPF Check
            print("  Checking SPF Records...")
            spf_check = {'check': 'SPF', 'status': 'pending'}
            try:
                spf_response = requests.get(
                    base_url + '/spf/' + domain,
                    params={'apikey': MXTOOLBOX_KEY},
                    timeout=10
                )
                
                if spf_response.status_code == 200:
                    spf_data = spf_response.json()
                    spf_valid = spf_data.get('status') == 'valid'
                    spf_check['status'] = 'completed'
                    spf_check['result'] = spf_data.get('status', 'unknown')
                    spf_check['valid'] = spf_valid
                    spf_check['interpretation'] = 'SPF record is VALID - Sender domain can be verified' if spf_valid else 'SPF record is MISSING or INVALID - Domain can be spoofed'
                    
                    if not spf_valid:
                        spf_check['risk_points'] = 15
                        self.risk_score += 15
                    
                    print("    SPF: " + spf_data.get('status', 'unknown'))
                else:
                    spf_check['status'] = 'error'
                    spf_check['error'] = 'HTTP ' + str(spf_response.status_code)
            except Exception as e:
                spf_check['status'] = 'error'
                spf_check['error'] = str(e)
            
            time.sleep(0.5)
            
            # DMARC Check
            print("  Checking DMARC Policy...")
            dmarc_check = {'check': 'DMARC', 'status': 'pending'}
            try:
                dmarc_response = requests.get(
                    base_url + '/dmarc/' + domain,
                    params={'apikey': MXTOOLBOX_KEY},
                    timeout=10
                )
                
                if dmarc_response.status_code == 200:
                    dmarc_data = dmarc_response.json()
                    dmarc_valid = dmarc_data.get('status') == 'valid'
                    dmarc_check['status'] = 'completed'
                    dmarc_check['result'] = dmarc_data.get('status', 'unknown')
                    dmarc_check['valid'] = dmarc_valid
                    dmarc_check['interpretation'] = 'DMARC policy is VALID - Domain has strong authentication' if dmarc_valid else 'DMARC policy is MISSING or WEAK - Domain lacks proper authentication'
                    
                    if not dmarc_valid:
                        dmarc_check['risk_points'] = 15
                        self.risk_score += 15
                    
                    print("    DMARC: " + dmarc_data.get('status', 'unknown'))
                else:
                    dmarc_check['status'] = 'error'
                    dmarc_check['error'] = 'HTTP ' + str(dmarc_response.status_code)
            except Exception as e:
                dmarc_check['status'] = 'error'
                dmarc_check['error'] = str(e)
            
            time.sleep(0.5)
            
            # MX Records Check
            print("  Checking MX Records...")
            mx_check = {'check': 'MX Records', 'status': 'pending'}
            try:
                mx_response = requests.get(
                    base_url + '/mxlookup/' + domain,
                    params={'apikey': MXTOOLBOX_KEY},
                    timeout=10
                )
                
                if mx_response.status_code == 200:
                    mx_data = mx_response.json()
                    mx_records = mx_data.get('result', [])
                    mx_check['status'] = 'completed'
                    mx_check['records_found'] = len(mx_records)
                    mx_check['records'] = mx_records[:3] if mx_records else []
                    mx_check['interpretation'] = str(len(mx_records)) + ' MX record(s) found - Domain can receive emails' if mx_records else 'NO MX RECORDS - Domain cannot receive legitimate emails'
                    
                    if len(mx_records) == 0:
                        mx_check['risk_points'] = 20
                        self.risk_score += 20
                    
                    print("    MX Records: " + str(len(mx_records)))
                else:
                    mx_check['status'] = 'error'
                    mx_check['error'] = 'HTTP ' + str(mx_response.status_code)
            except Exception as e:
                mx_check['status'] = 'error'
                mx_check['error'] = str(e)
            
            api_data['status'] = 'completed'
            api_data['checks'] = {
                'spf': spf_check,
                'dmarc': dmarc_check,
                'mx_records': mx_check
            }

            # إضافة نقاط الخطورة أيضاً عندما يفشل الاتصال بالـ API نفسه
            # (عدم القدرة على التحقق = مؤشر خطر بحد ذاته، ويجب ألا يُتجاهل بصمت)
            if spf_check.get('status') == 'error' and 'risk_points' not in spf_check:
                spf_check['risk_points'] = 15
                spf_check['interpretation'] = 'Could not verify SPF (lookup failed) - treated as unverifiable/risky'
                self.risk_score += 15

            if dmarc_check.get('status') == 'error' and 'risk_points' not in dmarc_check:
                dmarc_check['risk_points'] = 15
                dmarc_check['interpretation'] = 'Could not verify DMARC (lookup failed) - treated as unverifiable/risky'
                self.risk_score += 15

            if mx_check.get('status') == 'error' and 'risk_points' not in mx_check:
                mx_check['risk_points'] = 20
                mx_check['interpretation'] = 'Could not verify MX records (lookup failed) - treated as unverifiable/risky'
                self.risk_score += 20

            # Email Health Score
            health_score = 100
            failures = []
            if not spf_check.get('valid', False):
                health_score -= 30
                failures.append('SPF failed')
            if not dmarc_check.get('valid', False):
                health_score -= 30
                failures.append('DMARC failed')
            if mx_check.get('records_found', 0) == 0:
                health_score -= 40
                failures.append('No MX records')
            
            api_data['email_health_score'] = health_score
            api_data['email_health_assessment'] = 'HEALTHY' if health_score >= 70 else 'WEAK' if health_score >= 40 else 'CRITICAL'
            api_data['health_failures'] = failures
            
        except Exception as e:
            api_data['status'] = 'error'
            api_data['error'] = str(e)
            print("  ERROR: " + str(e))
        
        self.report['api_3_mxtoolbox'] = api_data
        return api_data
    
    def api4_whois_domain_age(self, domain):
        """API #4: WHOIS - فحص عمر النطاق (يكشف نطاقات اليوم الأول Zero-Day)"""
        print("\n[API #4] WHOIS - Domain Age Check")
        print("Domain: " + domain)

        api_data = {
            'api_name': 'WHOIS',
            'check_type': 'Domain Registration Age',
            'status': 'pending',
            'findings': {},
            'risk_assessment': {}
        }

        try:
            w = whois.whois(domain)
            creation_date = w.creation_date

            if isinstance(creation_date, list):
                creation_date = creation_date[0]

            if not creation_date:
                api_data['status'] = 'unknown'
                api_data['findings'] = {
                    'interpretation': 'Could not determine domain age (no creation date returned)'
                }
                risk_points = 10
                api_data['risk_assessment'] = {
                    'risk_points': risk_points,
                    'reasons': ['Domain age could not be verified - treated as mildly suspicious'],
                    'severity': 'LOW'
                }
                self.risk_score += risk_points
            else:
                age_days = (datetime.now() - creation_date).days
                risk_points = 0
                severity = 'LOW'
                reasons = []

                if age_days < 30:
                    risk_points = 30
                    severity = 'CRITICAL'
                    reasons.append('Domain was registered only ' + str(age_days) + ' days ago')
                elif age_days < 180:
                    risk_points = 15
                    severity = 'MEDIUM'
                    reasons.append('Domain was registered ' + str(age_days) + ' days ago (under 6 months)')
                else:
                    severity = 'NONE'
                    reasons.append('Domain is ' + str(age_days) + ' days old - established domain')

                api_data['status'] = 'completed'
                api_data['findings'] = {
                    'creation_date': str(creation_date),
                    'age_days': age_days,
                    'interpretation': reasons[0]
                }
                api_data['risk_assessment'] = {
                    'risk_points': risk_points,
                    'reasons': reasons,
                    'severity': severity
                }
                self.risk_score += risk_points

                print("  Domain age: " + str(age_days) + " days")

        except Exception as e:
            api_data['status'] = 'error'
            api_data['error'] = str(e)
            print("  ERROR: " + str(e))

        self.report['api_4_whois'] = api_data
        return api_data
    
    def detect_patterns(self, subject, body):
        """تحليل أنماط النص المريبة"""
        print("\n[STEP 4] Content Pattern Analysis")
        
        text = (subject + " " + body).lower()
        patterns = {
            'urgency_keywords': [],
            'suspicious_phrases': [],
            'generic_greetings': [],
            'grammar_errors': []
        }
        
        # Urgency keywords
        urgency_list = [
            'verify account', 'confirm password', 'click here', 'urgent',
            'act now', '24 hour', 'immediate', 'suspended', 'locked',
            'unusual activity', 'security alert', 're-enter', 're-verify',
            'confirm identity', 'update payment'
        ]
        
        for keyword in urgency_list:
            if keyword in text:
                patterns['urgency_keywords'].append(keyword)
        
        # Generic greetings
        greetings = ['dear user', 'dear customer', 'account holder', 'valued customer']
        for greeting in greetings:
            if greeting in text:
                patterns['generic_greetings'].append(greeting)
        
        # Grammar errors
        errors = ['recieve', 'occured', 'bussiness', 'knowlege', 'seperete']
        for error in errors:
            if error in text:
                patterns['grammar_errors'].append(error)
        
        # Risk scoring
        pattern_risk = 0
        if len(patterns['urgency_keywords']) >= 2:
            pattern_risk += 15
        elif len(patterns['urgency_keywords']) >= 1:
            pattern_risk += 8
        
        if len(patterns['generic_greetings']) > 0:
            pattern_risk += 8
        
        if len(patterns['grammar_errors']) > 0:
            pattern_risk += 5
        
        self.risk_score += pattern_risk
        
        self.report['pattern_analysis'] = {
            'patterns_found': patterns,
            'risk_points': pattern_risk,
            'severity': 'HIGH' if pattern_risk > 15 else 'MEDIUM' if pattern_risk > 0 else 'NONE'
        }
    
    def generate_assessment(self, sender, subject, body):
        """إنشاء تقييم شامل"""
        self.risk_score = min(max(self.risk_score, 0), 100)
        
        if self.risk_score >= 50:
            risk_level = 'CRITICAL'
            color = 'red'
        elif self.risk_score >= 30:
            risk_level = 'HIGH'
            color = 'orange'
        elif self.risk_score >= 15:
            risk_level = 'MEDIUM'
            color = 'yellow'
        else:
            risk_level = 'LOW'
            color = 'green'
        
        self.report['overall_assessment'] = {
            'risk_level': risk_level,
            'risk_score': self.risk_score,
            'color': color,
            'summary': self._get_summary(risk_level),
            'decision': self._get_decision(risk_level),
            'action_required': risk_level in ['CRITICAL', 'HIGH']
        }
        
        # Recommendations
        recommendations = []
        
        if risk_level == 'CRITICAL':
            recommendations.append('DELETE this email immediately')
            recommendations.append('DO NOT click any links or open attachments')
            recommendations.append('Report as phishing to your email provider')
            recommendations.append('Notify your IT security team')
            recommendations.append('If you clicked any links, change your passwords immediately')
        
        elif risk_level == 'HIGH':
            recommendations.append('DO NOT respond to this email')
            recommendations.append('DO NOT click any links or download attachments')
            recommendations.append('Verify sender through official channels (call them directly)')
            recommendations.append('Report as suspicious to your email provider')
            recommendations.append('Consider notifying IT security team')
        
        elif risk_level == 'MEDIUM':
            recommendations.append('Be cautious before taking any action')
            recommendations.append('Verify sender independently before responding')
            recommendations.append('Do not provide sensitive information')
            recommendations.append('Check sender email address carefully')
        
        else:
            recommendations.append('Appears to be legitimate communication')
            recommendations.append('Normal email security practices apply')
        
        self.report['recommendations'] = recommendations
    
    def _interpret_reputation(self, reputation):
        if reputation < -50:
            return 'EXTREMELY NEGATIVE - Domain has very poor reputation'
        elif reputation < 0:
            return 'NEGATIVE - Domain shows negative indicators'
        else:
            return 'CLEAN - No negative indicators found'
    
    def _interpret_pulses(self, count):
        if count > 5:
            return 'HIGHLY SUSPICIOUS - Domain appears in multiple threat reports'
        elif count > 0:
            return 'SUSPICIOUS - Domain has threat intelligence history'
        else:
            return 'CLEAN - No threat intelligence reports found'
    
    def _get_summary(self, risk_level):
        summaries = {
            'CRITICAL': 'This email presents CRITICAL RISK. Multiple indicators of phishing/spoofing detected.',
            'HIGH': 'This email presents HIGH RISK. Strong indicators of phishing/spoofing detected.',
            'MEDIUM': 'This email presents MODERATE RISK. Some suspicious indicators detected.',
            'LOW': 'This email presents LOW RISK. Appears to be legitimate communication.'
        }
        return summaries.get(risk_level, 'Unknown risk level')
    
    def _get_decision(self, risk_level):
        decisions = {
            'CRITICAL': 'DELETE IMMEDIATELY - HIGH CONFIDENCE THIS IS PHISHING',
            'HIGH': 'DO NOT INTERACT - LIKELY PHISHING',
            'MEDIUM': 'CAUTION REQUIRED - VERIFY BEFORE RESPONDING',
            'LOW': 'SAFE TO INTERACT - APPEARS LEGITIMATE'
        }
        return decisions.get(risk_level, 'Unknown')
    
    def analyze(self, sender, subject, body):
        """تحليل شامل للبريل"""
        print("\n" + "="*70)
        print("[CyberTrain] COMPREHENSIVE EMAIL SECURITY ANALYSIS")
        print("="*70)
        
        # Step 1: Analyze sender
        domain = self.analyze_sender_email(sender)
        if not domain:
            return self.report
        
        # Step 2: OTX Domain Check
        self.api1_otx_domain_check(domain)
        time.sleep(1)
        
        # Step 3: VirusTotal URL Check
        urls = self._extract_urls(body)
        self.api2_virustotal_url_check(urls)
        time.sleep(1)
        
        # Step 4: MXToolbox Headers Check
        self.api3_mxtoolbox_headers_check(domain)
        time.sleep(1)

        # Step 5: WHOIS Domain Age Check
        self.api4_whois_domain_age(domain)

        # Step 6: Pattern Detection
        self.detect_patterns(subject, body)
        
        # Step 7: Generate Assessment
        self.generate_assessment(sender, subject, body)
        
        print("\n" + "="*70)
        print("[RESULT] ANALYSIS COMPLETE")
        print("Risk Level: " + self.report['overall_assessment']['risk_level'])
        print("Risk Score: " + str(self.report['overall_assessment']['risk_score']) + "/100")
        print("="*70 + "\n")
        
        return self.report
    
    def _extract_urls(self, text):
        """استخراج الروابط من النص"""
        url_pattern = r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'
        return re.findall(url_pattern, text)

@app.route('/api/check-email', methods=['POST'])
def check_email():
    data = request.json
    sender = data.get('email', '')
    subject = data.get('subject', '')
    body = data.get('body', '')

    try:
        analyzer = ComprehensiveEmailAnalyzer()
        report = analyzer.analyze(sender, subject, body)

        # حفظ نتيجة الفحص مربوطة بالموظف (لو مسجل دخول) عشان تظهر بلوحة الأدمن
        if 'user_id' in session:
            try:
                risk_level = report.get('overall_assessment', {}).get('risk_level', 'UNKNOWN')
                risk_score = report.get('overall_assessment', {}).get('risk_score', 0)
                db = get_db()
                db.execute(
                    'INSERT INTO email_checks (user_id, sender, risk_level, risk_score, created_at) VALUES (?, ?, ?, ?, ?)',
                    (session['user_id'], sender, risk_level, risk_score, datetime.now())
                )
                db.commit()
                db.close()
            except Exception as log_err:
                print("[WARN] Could not log email check: " + str(log_err))

        return jsonify(report)
    except Exception as e:
        print("[ERROR] Analysis Error: " + str(e))
        return jsonify({
            'error': 'analysis_failed',
            'message': 'Error during analysis: ' + str(e),
            'recommendation': 'Please try again or contact support'
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

    # كل المستخدمين مع حالة التعهد الرقمي
    users = db.execute('''
        SELECT id, username, created_at, pledge_accepted, pledge_accepted_at
        FROM users
        ORDER BY created_at DESC
    ''').fetchall()

    # نتائج الامتحانات (كما كانت)
    exam_results = db.execute('''
        SELECT u.username, e.exam_type, e.level, e.score, e.total, e.created_at
        FROM exam_results e
        JOIN users u ON e.user_id = u.id
        ORDER BY e.created_at DESC
    ''').fetchall()

    # نتائج فحص الإيميل لكل موظف
    email_checks = db.execute('''
        SELECT u.username, c.sender, c.risk_level, c.risk_score, c.created_at
        FROM email_checks c
        JOIN users u ON c.user_id = u.id
        ORDER BY c.created_at DESC
    ''').fetchall()

    user_count = db.execute('SELECT COUNT(*) as count FROM users').fetchone()['count']
    pledged_count = db.execute('SELECT COUNT(*) as count FROM users WHERE pledge_accepted = 1').fetchone()['count']
    db.close()

    return jsonify({
        'total_users': user_count,
        'pledged_users': pledged_count,
        'users': [dict(row) for row in users],
        'results': [dict(row) for row in exam_results],
        'email_checks': [dict(row) for row in email_checks]
    })

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
