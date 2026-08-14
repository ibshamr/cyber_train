from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os
import secrets
from datetime import datetime
from dotenv import load_dotenv
import requests
import re
from urllib.parse import urlparse
import time
import json

load_dotenv()

app = Flask(__name__)

# ============= SECRET KEY =============
# Never hardcode this. Set SECRET_KEY in your .env / host config so sessions
# survive restarts; otherwise we generate a random one each boot (users get
# logged out whenever the server restarts, but at least it's not guessable).
app.secret_key = os.getenv('SECRET_KEY') or secrets.token_hex(32)
if not os.getenv('SECRET_KEY'):
    print("[WARNING] SECRET_KEY not set in .env - using a random key for this run only.")

CORS(app)

# Global safety net: if ANY route crashes with an unexpected exception, this
# guarantees the frontend still gets valid JSON back (with a readable error
# message) instead of Flask's default HTML error page - which is what was
# causing "Unexpected token '<' ... is not valid JSON" on the frontend.
from werkzeug.exceptions import HTTPException

@app.errorhandler(Exception)
def handle_uncaught_exception(e):
    if isinstance(e, HTTPException):
        # Still return JSON for any /api/ route so the frontend's
        # response.json() never breaks, even on 400/404/405 etc.
        if request.path.startswith('/api/'):
            return jsonify({
                'success': False,
                'error': 'request_error',
                'message': e.description or str(e)
            }), e.code
        return e
    import traceback
    print("[UNCAUGHT ERROR] " + str(e))
    traceback.print_exc()
    return jsonify({
        'success': False,
        'error': 'server_error',
        'message': 'Server error: ' + str(e)
    }), 500

# ============= API KEYS =============
# No hardcoded fallback keys - these MUST come from your .env file (or host
# environment variables). Keys that were previously hardcoded here were
# exposed in the source code; rotate/regenerate them with each provider.
OTX_KEY = os.getenv('OTX_KEY')
VIRUSTOTAL_KEY = os.getenv('VIRUSTOTAL_KEY')
MXTOOLBOX_KEY = os.getenv('MXTOOLBOX_KEY')

ADMIN_USER = os.getenv('ADMIN_USER', 'admin')
ADMIN_PASS = os.getenv('ADMIN_PASS')

print("\n" + "="*70)
print("[CyberTrain] Advanced Email Spoofing Detection Engine")
print("="*70)
print("[OK] API #1 - OTX AlienVault (Domain Reputation)" if OTX_KEY else "[WARNING] OTX_KEY missing from .env - domain reputation check will fail")
print("[OK] API #2 - VirusTotal (URL Scanning)" if VIRUSTOTAL_KEY else "[WARNING] VIRUSTOTAL_KEY missing from .env - URL scanning will fail")
print("[OK] API #3 - MXToolbox (Email Headers)" if MXTOOLBOX_KEY else "[WARNING] MXTOOLBOX_KEY missing from .env - header checks will fail")
if not ADMIN_PASS:
    print("[WARNING] ADMIN_PASS not set in .env - admin login is disabled until you set one")
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
    db.execute('''
        CREATE TABLE IF NOT EXISTS email_checks (
            id INTEGER PRIMARY KEY,
            user_id INTEGER,
            performed_by TEXT,
            sender TEXT,
            subject TEXT,
            risk_level TEXT,
            risk_score INTEGER,
            created_at TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    ''')
    db.commit()
    db.close()

# Create tables immediately at import time - NOT just inside `if __name__ ==
# '__main__'`, which only runs with `python app.py` and is silently skipped
# by gunicorn (`gunicorn app:app` just imports this module). Without this,
# the tables never got created in any real deployment, and every DB-touching
# route below would crash with "no such table".
init_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json or {}
    username = (data.get('username') or '').strip()
    password = data.get('password') or ''

    if not username or not password:
        return jsonify({'success': False, 'message': 'Username and password are required'}), 400
    if len(password) < 6:
        return jsonify({'success': False, 'message': 'Password must be at least 6 characters'}), 400

    password_hash = generate_password_hash(password)

    db = get_db()
    try:
        db.execute(
            'INSERT INTO users (username, password, email, created_at) VALUES (?, ?, ?, ?)',
            (username, password_hash, None, datetime.now())
        )
        db.commit()
        return jsonify({'success': True, 'message': 'Registration successful'})
    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'message': 'Username already exists'}), 400
    finally:
        db.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json or {}
    username = (data.get('username') or '').strip()
    password = data.get('password') or ''

    if not username or not password:
        return jsonify({'success': False, 'message': 'Username and password are required'}), 400

    db = get_db()
    user = db.execute(
        'SELECT id, username, password FROM users WHERE username = ?',
        (username,)
    ).fetchone()

    if not user:
        db.close()
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

    valid = check_password_hash(user['password'], password)

    # Backward compatibility: accounts created before password hashing was
    # added still have the raw plaintext password stored. If it matches,
    # log the user in and silently upgrade their stored password to a
    # proper hash so this only ever happens once per account.
    if not valid and user['password'] == password:
        valid = True
        db.execute('UPDATE users SET password = ? WHERE id = ?', (generate_password_hash(password), user['id']))
        db.commit()

    db.close()

    if valid:
        session['user_id'] = user['id']
        session['username'] = user['username']
        return jsonify({'success': True, 'message': 'Login successful'})
    else:
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@app.route('/api/admin-login', methods=['POST'])
def admin_login():
    data = request.json or {}
    username = data.get('username')
    password = data.get('password')

    if not ADMIN_PASS:
        return jsonify({'success': False, 'message': 'Admin login is not configured (set ADMIN_PASS in .env)'}), 500

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
            'pattern_analysis': {},
            'security_checks': {},
            'overall_assessment': {},
            'recommendations': []
        }
    
    def analyze_sender_email(self, sender):
        """تحليل بيانات البريل من المُرسل - يدعم صيغة "Display Name <email@domain>" """
        display_name = None
        email_part = sender.strip()

        # "PayPal Support <security@paypa1.com>" style header
        name_match = re.match(r'^\s*"?([^"<]*)"?\s*<([^<>]+)>\s*$', sender)
        if name_match:
            display_name = name_match.group(1).strip() or None
            email_part = name_match.group(2).strip()

        if '@' not in email_part:
            self.report['email_info'] = {
                'status': 'INVALID',
                'error': 'Email format is invalid'
            }
            return None
        
        domain = email_part.split('@')[1].lower()
        username = email_part.split('@')[0].lower()
        
        self.report['email_info'] = {
            'full_email': email_part,
            'display_name': display_name,
            'username': username,
            'domain': domain,
            'domain_extension': domain.split('.')[-1] if '.' in domain else 'unknown'
        }
        
        return domain
    
    # Well-known, frequently-impersonated brand domains. Used to catch
    # lookalike/typosquatted domains (e.g. "paypa1-secure.com") that threat
    # intelligence databases won't have flagged yet because the domain was
    # only just registered by the attacker - this is the main defense
    # against brand-new "zero-day" spoofing domains.
    KNOWN_BRAND_DOMAINS = [
        'paypal.com', 'microsoft.com', 'apple.com', 'google.com', 'amazon.com',
        'facebook.com', 'instagram.com', 'linkedin.com', 'netflix.com',
        'dropbox.com', 'docusign.com', 'adobe.com', 'bankofamerica.com',
        'chase.com', 'wellsfargo.com', 'americanexpress.com', 'hsbc.com',
        'dhl.com', 'fedex.com', 'ups.com', 'usps.com', 'outlook.com',
        'office365.com', 'zoom.us', 'salesforce.com', 'stripe.com',
        'gmail.com', 'yahoo.com', 'irs.gov'
    ]

    @staticmethod
    def _levenshtein(a, b):
        if a == b:
            return 0
        if len(a) < len(b):
            a, b = b, a
        prev = list(range(len(b) + 1))
        for i, ca in enumerate(a, 1):
            curr = [i] + [0] * len(b)
            for j, cb in enumerate(b, 1):
                curr[j] = min(
                    prev[j] + 1,
                    curr[j - 1] + 1,
                    prev[j - 1] + (ca != cb)
                )
            prev = curr
        return prev[-1]

    # Generic infrastructure words that show up in countless legitimate
    # domains (webmail.company.com, support-team.com...) - comparing these
    # against brand names on their own creates false positives (e.g. "mail"
    # is edit-distance 1 from "gmail"), so they're excluded as standalone
    # tokens even though they may still be part of a flagged compound token.
    GENERIC_INFRA_WORDS = {
        'mail', 'team', 'help', 'support', 'service', 'secure', 'verify',
        'account', 'accounts', 'update', 'news', 'info', 'portal', 'login',
        'admin', 'web', 'site', 'app', 'online', 'alert', 'alerts', 'my',
        'the', 'get', 'new'
    }

    def detect_typosquatting(self, domain):
        """يقارن الدومين (وكل قطعة فيه لحالها) بأشهر البراندات المستهدفة عادةً بالتزوير"""
        result = {'is_suspicious': False, 'matched_brand': None, 'distance': None}
        if domain in self.KNOWN_BRAND_DOMAINS:
            return result

        domain_root = domain.split('.')[0]
        # Attackers commonly do "brand-word" or "brandword123" - split on
        # non-alphanumeric characters so "paypa1-secure" is checked as both
        # "paypa1" and "secure" against each brand, not as one long string
        # where the added suffix inflates the edit distance past any
        # reasonable threshold.
        tokens = [
            t for t in re.split(r'[^a-z0-9]+', domain_root)
            if len(t) >= 4 and t not in self.GENERIC_INFRA_WORDS
        ]
        if not tokens:
            tokens = [domain_root]

        best_brand = None
        best_distance = 999
        for brand in self.KNOWN_BRAND_DOMAINS:
            brand_root = brand.split('.')[0]
            for token in tokens:
                # Require the token to be close in length to the brand root
                # too - otherwise a short, coincidentally-close token (e.g.
                # a 4-letter word that happens to be 1 edit from an unrelated
                # 5-letter brand) triggers false positives.
                if abs(len(token) - len(brand_root)) > 1:
                    continue
                dist = self._levenshtein(token, brand_root)
                if dist < best_distance:
                    best_distance = dist
                    best_brand = brand

        # A short edit-distance to a well-known brand root (e.g. "paypa1"
        # vs "paypal" = distance 1) is a strong lookalike-domain signal,
        # regardless of whether the domain has ever been reported as
        # malicious anywhere before.
        if best_brand and 0 < best_distance <= 2:
            result['is_suspicious'] = True
            result['matched_brand'] = best_brand
            result['distance'] = best_distance
        return result

    def detect_homograph(self, domain):
        """يكشف الحروف من أبجديات مختلفة (سيريلية/يونانية) تشبه اللاتينية بصرياً"""
        scripts_found = set()
        for ch in domain:
            if ch.isascii():
                continue
            code = ord(ch)
            if 0x0400 <= code <= 0x04FF:
                scripts_found.add('Cyrillic')
            elif 0x0370 <= code <= 0x03FF:
                scripts_found.add('Greek')
            elif code > 0x2000:
                scripts_found.add('Other non-Latin')
        return {
            'is_suspicious': len(scripts_found) > 0,
            'scripts_found': list(scripts_found)
        }

    def check_display_name_spoofing(self, display_name, domain):
        """لو اسم العرض فيه اسم براند لكن الدومين الفعلي مختلف تماماً"""
        result = {'is_suspicious': False, 'claimed_brand': None}
        if not display_name:
            return result
        name_lower = display_name.lower()
        for brand in self.KNOWN_BRAND_DOMAINS:
            brand_name = brand.split('.')[0]
            if brand_name in name_lower and brand not in domain and domain not in brand:
                result['is_suspicious'] = True
                result['claimed_brand'] = brand
                break
        return result

    def parse_raw_headers(self, raw_headers):
        """يقرأ Authentication-Results (اللي سيرفر البريد الحقيقي حسبها وقت الاستلام) وباقي الهيدرز المهمة"""
        result = {
            'provided': bool(raw_headers and raw_headers.strip()),
            'auth_results': {'spf': None, 'dkim': None, 'dmarc': None},
            'return_path': None,
            'reply_to': None,
            'received_hop_count': 0
        }
        if not result['provided']:
            return result

        auth_match = re.search(r'Authentication-Results:.*', raw_headers, re.IGNORECASE)
        if auth_match:
            auth_line = auth_match.group(0)
            for mech in ['spf', 'dkim', 'dmarc']:
                m = re.search(mech + r'=(\w+)', auth_line, re.IGNORECASE)
                if m:
                    result['auth_results'][mech] = m.group(1).lower()

        rp_match = re.search(r'Return-Path:\s*<?([^\s<>\r\n]+)>?', raw_headers, re.IGNORECASE)
        if rp_match:
            result['return_path'] = rp_match.group(1)

        reply_match = re.search(r'Reply-To:\s*.*?<?([^\s<>\r\n]+@[^\s<>\r\n]+)>?', raw_headers, re.IGNORECASE)
        if reply_match:
            result['reply_to'] = reply_match.group(1)

        result['received_hop_count'] = len(re.findall(r'^Received:', raw_headers, re.IGNORECASE | re.MULTILINE))

        return result
    
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

        if not OTX_KEY:
            api_data['status'] = 'not_configured'
            api_data['error'] = 'OTX_KEY is not set in .env - this check was skipped'
            self.report['api_1_otx'] = api_data
            return api_data
        
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

        if not VIRUSTOTAL_KEY:
            api_data['status'] = 'not_configured'
            api_data['error'] = 'VIRUSTOTAL_KEY is not set in .env - this check was skipped'
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

        if not MXTOOLBOX_KEY:
            api_data['status'] = 'not_configured'
            api_data['error'] = 'MXTOOLBOX_KEY is not set in .env - this check was skipped'
            self.report['api_3_mxtoolbox'] = api_data
            return api_data
        
        try:
            # MXToolbox's real Lookup API is path-based, e.g.
            #   GET https://mxtoolbox.com/api/v1/lookup/{command}/{argument}
            # authenticated with an "Authorization" header carrying the raw
            # key (no query-string apikey, no "Bearer" prefix). The response
            # is a report object with Passed / Failed / Warnings / Errors
            # arrays rather than a simple {status: "valid"} field.
            base_url = 'https://mxtoolbox.com/api/v1/lookup'
            headers = {'Authorization': MXTOOLBOX_KEY}

            def run_lookup(command, argument):
                return requests.get(
                    base_url + '/' + command + '/' + argument,
                    headers=headers,
                    timeout=10
                )
            
            # SPF Check
            print("  Checking SPF Records...")
            spf_check = {'check': 'SPF', 'status': 'pending'}
            try:
                spf_response = run_lookup('spf', domain)
                
                if spf_response.status_code == 200:
                    spf_data = spf_response.json()
                    spf_failed = len(spf_data.get('Failed', [])) > 0 or spf_data.get('IsError', False)
                    spf_valid = not spf_failed and len(spf_data.get('Passed', [])) > 0
                    spf_check['status'] = 'completed'
                    spf_check['result'] = 'valid' if spf_valid else ('failed' if spf_failed else 'no_record')
                    spf_check['valid'] = spf_valid
                    spf_check['interpretation'] = 'SPF record is VALID - Sender domain can be verified' if spf_valid else 'SPF record is MISSING or INVALID - Domain can be spoofed'
                    
                    if not spf_valid:
                        spf_check['risk_points'] = 15
                        self.risk_score += 15
                    
                    print("    SPF: " + spf_check['result'])
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
                dmarc_response = run_lookup('dmarc', domain)
                
                if dmarc_response.status_code == 200:
                    dmarc_data = dmarc_response.json()
                    dmarc_failed = len(dmarc_data.get('Failed', [])) > 0 or dmarc_data.get('IsError', False)
                    dmarc_valid = not dmarc_failed and len(dmarc_data.get('Passed', [])) > 0
                    dmarc_check['status'] = 'completed'
                    dmarc_check['result'] = 'valid' if dmarc_valid else ('failed' if dmarc_failed else 'no_record')
                    dmarc_check['valid'] = dmarc_valid
                    dmarc_check['interpretation'] = 'DMARC policy is VALID - Domain has strong authentication' if dmarc_valid else 'DMARC policy is MISSING or WEAK - Domain lacks proper authentication'
                    
                    if not dmarc_valid:
                        dmarc_check['risk_points'] = 15
                        self.risk_score += 15
                    
                    print("    DMARC: " + dmarc_check['result'])
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
                mx_response = run_lookup('mx', domain)
                
                if mx_response.status_code == 200:
                    mx_data = mx_response.json()
                    mx_records = mx_data.get('Passed', [])
                    mx_check['status'] = 'completed'
                    mx_check['records_found'] = len(mx_records)
                    mx_check['records'] = [r.get('Name') or r.get('Info') for r in mx_records[:3]]
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
    
    def run_advanced_checks(self, domain, display_name, sender_full, raw_headers):
        """فحوصات إضافية لا تعتمد على قواعد بيانات تهديدات معروفة سلفاً - بتشتغل حتى على دومين جديد بالكامل"""
        checks = {}

        typo = self.detect_typosquatting(domain)
        checks['typosquatting'] = typo
        if typo['is_suspicious']:
            checks['typosquatting']['risk_points'] = 35
            self.risk_score += 35

        homograph = self.detect_homograph(domain)
        checks['homograph'] = homograph
        if homograph['is_suspicious']:
            checks['homograph']['risk_points'] = 30
            self.risk_score += 30

        dn_spoof = self.check_display_name_spoofing(display_name, domain)
        checks['display_name_spoofing'] = dn_spoof
        if dn_spoof['is_suspicious']:
            checks['display_name_spoofing']['risk_points'] = 25
            self.risk_score += 25

        headers = self.parse_raw_headers(raw_headers)
        checks['headers'] = headers

        if headers['provided']:
            for mech in ['spf', 'dkim', 'dmarc']:
                result = headers['auth_results'].get(mech)
                if result and result not in ('pass',):
                    checks.setdefault('auth_failures', []).append(mech.upper() + ' = ' + result + ' (per Authentication-Results header)')
                    self.risk_score += 15

            if headers['reply_to']:
                reply_domain = headers['reply_to'].split('@')[-1].lower() if '@' in headers['reply_to'] else ''
                if reply_domain and reply_domain != domain:
                    checks['reply_to_mismatch'] = {
                        'is_suspicious': True,
                        'reply_to_domain': reply_domain,
                        'sender_domain': domain
                    }
                    self.risk_score += 20

        self.report['advanced_checks'] = checks
        return checks

    def _collect_warnings(self):
        """يجمع كل أسباب الخطورة من كل الفحوصات بقائمة نصية واحدة تستخدمها الواجهة الأمامية"""
        warnings = []

        otx = self.report.get('api_1_otx', {})
        warnings.extend(otx.get('risk_assessment', {}).get('reasons', []))

        vt = self.report.get('api_2_virustotal', {})
        for url_analysis in vt.get('urls_analysis', []):
            threat_level = url_analysis.get('threat_level')
            if threat_level in ('MALICIOUS', 'SUSPICIOUS'):
                warnings.append('URL "' + url_analysis.get('url', '') + '" flagged as ' + threat_level + ' by VirusTotal')

        mx = self.report.get('api_3_mxtoolbox', {})
        for failure in mx.get('health_failures', []):
            warnings.append('Email authentication issue: ' + failure)

        patterns = self.report.get('pattern_analysis', {}).get('patterns_found', {})
        for keyword in patterns.get('urgency_keywords', []):
            warnings.append('Urgency/pressure language detected: "' + keyword + '"')
        for greeting in patterns.get('generic_greetings', []):
            warnings.append('Generic greeting detected: "' + greeting + '"')
        for error in patterns.get('grammar_errors', []):
            warnings.append('Possible grammar/spelling red flag: "' + error + '"')

        adv = self.report.get('advanced_checks', {})
        typo = adv.get('typosquatting', {})
        if typo.get('is_suspicious'):
            warnings.append('Domain "' + self.report.get('email_info', {}).get('domain', '') + '" closely resembles known brand "' + typo['matched_brand'] + '" (possible typosquatting)')
        homograph = adv.get('homograph', {})
        if homograph.get('is_suspicious'):
            warnings.append('Domain contains lookalike characters from: ' + ', '.join(homograph['scripts_found']))
        dn_spoof = adv.get('display_name_spoofing', {})
        if dn_spoof.get('is_suspicious'):
            warnings.append('Display name claims to be "' + dn_spoof['claimed_brand'] + '" but the actual email domain does not match')
        for failure in adv.get('auth_failures', []):
            warnings.append('Header authentication failed: ' + failure)
        reply_mismatch = adv.get('reply_to_mismatch', {})
        if reply_mismatch.get('is_suspicious'):
            warnings.append('Reply-To domain "' + reply_mismatch['reply_to_domain'] + '" differs from sender domain "' + reply_mismatch['sender_domain'] + '" (common BEC pattern)')

        return warnings

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

        # ---- Fields the frontend (script.js -> displayEmailAnalysis) actually
        # reads. These are flattened/simplified views of the detailed report
        # above, kept in sync with it so the UI never sees undefined fields.
        warnings = self._collect_warnings()
        patterns_found_count = sum(
            len(v) for v in self.report.get('pattern_analysis', {}).get('patterns_found', {}).values()
        )

        self.report['risk_level'] = risk_level
        self.report['warnings'] = warnings
        self.report['details'] = {
            'sender': sender,
            'patterns_found': patterns_found_count,
            'risk_score': self.risk_score
        }
    
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
    
    def analyze(self, sender, subject, body, raw_headers=None):
        """تحليل شامل للبريل"""
        print("\n" + "="*70)
        print("[CyberTrain] COMPREHENSIVE EMAIL SECURITY ANALYSIS")
        print("="*70)
        
        # Step 1: Analyze sender (also extracts display name if given as
        # "Display Name <email@domain>")
        domain = self.analyze_sender_email(sender)
        if not domain:
            self.report['risk_level'] = 'LOW'
            self.report['warnings'] = ['Could not analyze: sender email format is invalid']
            self.report['details'] = {
                'sender': sender,
                'patterns_found': 0,
                'risk_score': 0
            }
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
        
        # Step 5: Pattern Detection
        self.detect_patterns(subject, body)

        # Step 6: Advanced checks that don't depend on any external threat
        # database - typosquatting, homograph domains, display-name spoofing,
        # and (if raw headers were pasted) real Authentication-Results /
        # Reply-To mismatch. These catch brand-new "zero-day" spoofing
        # domains that OTX/VirusTotal have simply never seen before.
        display_name = self.report.get('email_info', {}).get('display_name')
        self.run_advanced_checks(domain, display_name, sender, raw_headers)
        
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
    if 'user_id' not in session and 'admin' not in session:
        return jsonify({
            'error': 'unauthorized',
            'message': 'Please login first'
        }), 401

    data = request.json or {}
    sender = data.get('email', '')
    subject = data.get('subject', '')
    body = data.get('body', '')
    raw_headers = data.get('raw_headers', '')

    if not sender or not subject or not body:
        return jsonify({
            'error': 'missing_fields',
            'message': 'Sender, subject and body are all required'
        }), 400

    try:
        analyzer = ComprehensiveEmailAnalyzer()
        report = analyzer.analyze(sender, subject, body, raw_headers)

        # Log the check so admins can see who checked what, and how risky it was.
        db = get_db()
        db.execute(
            'INSERT INTO email_checks (user_id, performed_by, sender, subject, risk_level, risk_score, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
            (
                session.get('user_id'),
                'admin' if 'admin' in session and 'user_id' not in session else session.get('username', 'unknown'),
                sender,
                subject,
                report.get('risk_level'),
                report.get('details', {}).get('risk_score'),
                datetime.now()
            )
        )
        db.commit()
        db.close()

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

    # Every registered employee, whether or not they've taken an exam yet.
    users = db.execute('SELECT id, username, created_at FROM users ORDER BY created_at DESC').fetchall()

    results = db.execute('''
        SELECT u.username, e.exam_type, e.level, e.score, e.total, e.created_at
        FROM exam_results e
        JOIN users u ON e.user_id = u.id
        ORDER BY e.created_at DESC
    ''').fetchall()

    # Every email an employee (or admin) has checked, with the resulting risk
    # level - so if a real incident happens, you can see whether the
    # employee checked the email first and what the tool told them.
    email_checks = db.execute('''
        SELECT ec.performed_by, ec.sender, ec.subject, ec.risk_level, ec.risk_score, ec.created_at
        FROM email_checks ec
        ORDER BY ec.created_at DESC
    ''').fetchall()

    user_count = len(users)
    db.close()
    
    return jsonify({
        'total_users': user_count,
        'users': [dict(row) for row in users],
        'results': [dict(row) for row in results],
        'email_checks': [dict(row) for row in email_checks]
    })

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'success': True})

if __name__ == '__main__':
    init_db()
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    port = int(os.getenv('PORT', 5000))
    app.run(debug=debug_mode, port=port)
