// =============== GLOBAL VARIABLES ===============
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let currentExamType = null;
let currentExamLevel = null;
let currentExamQuestions = [];
let currentQuestionIndex = 0;
let examAnswers = [];
let isAdmin = localStorage.getItem('isAdmin') === 'true' || false;

// Returns the Arabic version of a data.js field (e.g. "question" -> "question_ar")
// when the current language is Arabic and a translation exists, otherwise
// falls back to the original English field. Used for exam questions, email
// spoofing scenarios, training scenarios and training module content.
function tf(obj, field) {
    if (!obj) return '';
    if (typeof currentLang !== 'undefined' && currentLang === 'ar' && obj[field + '_ar']) {
        return obj[field + '_ar'];
    }
    return obj[field];
}

// =============== PAGE MANAGEMENT ===============
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }
    
    // Update navbar based on user state
    updateNavbar();
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.remove('hidden');
    }
    
    if (sectionId === 'results') {
        loadUserResults();
    }
}

function updateNavbar() {
    const navMenu = document.getElementById('navMenu');
    
    if (currentUser) {
        navMenu.innerHTML = `
            <li><a href="#dashboard" onclick="showPage('dashboard')">Dashboard</a></li>
            <li id="adminLink" style="display:${isAdmin ? 'block' : 'none'};"><a href="#" onclick="showAdminPanel()">Admin</a></li>
            <li><a href="#" onclick="logout()">Logout</a></li>
        `;
    } else {
        navMenu.innerHTML = `
            <li><a href="#home" onclick="showPage('home')">Home</a></li>
            <li><a href="#login" onclick="showPage('login')">Login</a></li>
            <li><a href="#register" onclick="showPage('register')">Register</a></li>
            <li><a href="#admin" onclick="showPage('admin')">Admin</a></li>
        `;
    }
}

// =============== AUTHENTICATION ===============
function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    
    if (!username || !password) {
        alert('Please fill all fields');
        return;
    }
    
    fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('Registration successful! Please login.');
            document.getElementById('regUsername').value = '';
            document.getElementById('regPassword').value = '';
            showPage('login');
        } else {
            alert(data.message || 'Registration failed');
        }
    })
    .catch(err => {
        console.error('Register error:', err);
        alert('Registration error: ' + err.message);
    });
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        alert('Please enter username and password');
        return;
    }
    
    fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            currentUser = { username };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // تحديث العرض
            const userDisplay = document.getElementById('userDisplay');
            if (userDisplay) {
                userDisplay.textContent = username;
            }
            
            document.getElementById('loginUsername').value = '';
            document.getElementById('loginPassword').value = '';
            showPage('dashboard');
            updateNavbar();
        } else {
            alert(data.message || 'Invalid credentials');
        }
    })
    .catch(err => {
        console.error('Login error:', err);
        alert('Login error: ' + err.message);
    });
}

function handleAdminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('adminUser').value;
    const password = document.getElementById('adminPass').value;
    
    if (!username || !password) {
        alert('Please enter admin username and password');
        return;
    }
    
    console.log('Attempting admin login with:', username);
    
    fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(res => {
        console.log('Response status:', res.status);
        return res.json();
    })
    .then(data => {
        console.log('Admin login response:', data);
        
        if (data.success) {
            isAdmin = true;
            localStorage.setItem('isAdmin', 'true');
            console.log('Admin login successful, isAdmin =', isAdmin);
            
            document.getElementById('adminUser').value = '';
            document.getElementById('adminPass').value = '';
            
            setTimeout(() => {
                loadAdminPanel();
            }, 500);
        } else {
            alert(data.message || 'Invalid admin credentials');
        }
    })
    .catch(err => {
        console.error('Admin login error:', err);
        alert('Admin login error: ' + err.message);
    });
}

function logout() {
    fetch('/api/logout', { method: 'POST' });
    currentUser = null;
    isAdmin = false;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');
    showPage('home');
    updateNavbar();
    alert('Logged out successfully');
}

// =============== EMAIL ANALYSIS ===============
async function analyzeEmail() {
    const sender = document.getElementById('senderEmail').value;
    const subject = document.getElementById('emailSubject').value;
    const body = document.getElementById('emailBody').value;
    
    if (!sender || !subject || !body) {
        alert('Please enter email sender and content');
        return;
    }
    
    const resultBox = document.getElementById('emailResult');
    resultBox.innerHTML = '<p>Analyzing... this checks 3 external APIs and can take a few seconds.</p>';
    resultBox.classList.remove('hidden');

    try {
        const response = await fetch('/api/check-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: sender, body, subject })
        });
        
        const analysis = await response.json();

        if (!response.ok || analysis.error) {
            resultBox.innerHTML = `<div class="result-detail"><strong>Error:</strong> ${escapeHtml(analysis.message || 'Analysis failed')}</div>`;
            return;
        }

        displayEmailAnalysis(analysis);
    } catch (err) {
        console.error('Email analysis error:', err);
        resultBox.innerHTML = `<div class="result-detail"><strong>Error:</strong> ${escapeHtml(err.message)}</div>`;
    }
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
}

// Builds one collapsible-looking section with a title and inner HTML body.
function reportSection(title, innerHtml) {
    return `
        <div class="result-detail">
            <h4 style="margin-bottom: 0.5rem;">${title}</h4>
            ${innerHtml}
        </div>
    `;
}

function displayEmailAnalysis(analysis, resultBoxId) {
    const resultBox = document.getElementById(resultBoxId || 'emailResult');

    // The sender email address itself was invalid - nothing else was checked.
    if (analysis.email_info && analysis.email_info.status === 'INVALID') {
        resultBox.innerHTML = reportSection('Invalid Email', `<p>${escapeHtml(analysis.email_info.error)}</p>`);
        resultBox.classList.remove('hidden');
        return;
    }

    const assessment = analysis.overall_assessment || {};
    const riskLevel = assessment.risk_level || analysis.risk_level || 'UNKNOWN';
    const riskClass = `risk-${riskLevel.toLowerCase()}`;

    let html = '';

    // ---- 1. Overall verdict ----
    html += reportSection('Overall Risk Assessment', `
        <p><strong>Risk Level:</strong> <span class="${riskClass}">${escapeHtml(riskLevel)}</span> (${escapeHtml(String(assessment.risk_score ?? analysis.details?.risk_score ?? 0))}/100)</p>
        ${assessment.summary ? `<p>${escapeHtml(assessment.summary)}</p>` : ''}
        ${assessment.decision ? `<p><strong>Decision:</strong> ${escapeHtml(assessment.decision)}</p>` : ''}
    `);

    // ---- 2. Sender info ----
    const info = analysis.email_info || {};
    html += reportSection('Sender Information', `
        <p><strong>Email:</strong> ${escapeHtml(info.full_email)}</p>
        <p><strong>Domain:</strong> ${escapeHtml(info.domain)}</p>
    `);

    // ---- 3. Domain reputation (OTX) ----
    const otx = analysis.api_1_otx || {};
    if (otx.status === 'completed') {
        const f = otx.findings || {};
        html += reportSection('Domain Reputation (OTX AlienVault)', `
            <p><strong>Reputation Score:</strong> ${escapeHtml(String(f.reputation_score))} — ${escapeHtml(f.reputation_interpretation)}</p>
            <p><strong>Threat Intelligence Reports:</strong> ${escapeHtml(String(f.threat_pulses_count))} — ${escapeHtml(f.pulse_interpretation)}</p>
        `);
    } else if (otx.status === 'error') {
        html += reportSection('Domain Reputation (OTX AlienVault)', `<p>Check failed: ${escapeHtml(otx.error)}</p>`);
    } else if (otx.status === 'not_configured') {
        html += reportSection('Domain Reputation (OTX AlienVault)', `<p>Skipped — ${escapeHtml(otx.error)}</p>`);
    }

    // ---- 4. URL scanning (VirusTotal) ----
    const vt = analysis.api_2_virustotal || {};
    if (vt.status === 'no_urls') {
        html += reportSection('URL Scanning (VirusTotal)', `<p>No links found in the email body.</p>`);
    } else if (vt.status === 'not_configured') {
        html += reportSection('URL Scanning (VirusTotal)', `<p>Skipped — ${escapeHtml(vt.error)}</p>`);
    } else if (vt.urls_analysis && vt.urls_analysis.length > 0) {
        let urlsHtml = '<ul style="margin-left: 20px;">';
        vt.urls_analysis.forEach(u => {
            if (u.status === 'completed') {
                const s = u.scan_results || {};
                urlsHtml += `<li><strong>${escapeHtml(u.url)}</strong> — ${escapeHtml(u.threat_level)} (${escapeHtml(String(s.malicious_vendors))} malicious / ${escapeHtml(String(s.suspicious_vendors))} suspicious / ${escapeHtml(String(s.total_vendors))} vendors checked)</li>`;
            } else {
                urlsHtml += `<li>${escapeHtml(u.url)} — check failed: ${escapeHtml(u.error || 'unknown error')}</li>`;
            }
        });
        urlsHtml += '</ul>';
        html += reportSection('URL Scanning (VirusTotal)', urlsHtml);
    } else if (vt.status === 'error') {
        html += reportSection('URL Scanning (VirusTotal)', `<p>Check failed: ${escapeHtml(vt.error)}</p>`);
    }

    // ---- 5. Email authentication: SPF / DMARC / MX ----
    const mx = analysis.api_3_mxtoolbox || {};
    if (mx.status === 'completed' && mx.checks) {
        const c = mx.checks;
        const line = (check) => {
            if (!check) return '<li>Not checked</li>';
            if (check.status === 'error') return `<li><strong>${escapeHtml(check.check)}:</strong> check failed - ${escapeHtml(check.error)}</li>`;
            return `<li><strong>${escapeHtml(check.check)}:</strong> ${escapeHtml(check.result)} — ${escapeHtml(check.interpretation)}</li>`;
        };
        const mxLine = () => {
            const mr = c.mx_records;
            if (!mr) return '<li>MX Records: not checked</li>';
            if (mr.status === 'error') return `<li><strong>MX Records:</strong> check failed - ${escapeHtml(mr.error)}</li>`;
            return `<li><strong>MX Records:</strong> ${escapeHtml(String(mr.records_found))} found — ${escapeHtml(mr.interpretation)}</li>`;
        };
        html += reportSection('Email Authentication (SPF / DMARC / MX)', `
            <ul style="margin-left: 20px;">
                ${line(c.spf)}
                ${line(c.dmarc)}
                ${mxLine()}
            </ul>
            <p style="margin-top: 0.5rem;"><strong>Email Health Score:</strong> ${escapeHtml(String(mx.email_health_score))}/100 (${escapeHtml(mx.email_health_assessment)})</p>
        `);
    } else if (mx.status === 'not_configured') {
        html += reportSection('Email Authentication (SPF / DMARC / MX)', `<p>Skipped — ${escapeHtml(mx.error)}</p>`);
    } else if (mx.status === 'error') {
        html += reportSection('Email Authentication (SPF / DMARC / MX)', `<p>Check failed: ${escapeHtml(mx.error)}</p>`);
    }

    // ---- 6. Content pattern analysis ----
    const patterns = (analysis.pattern_analysis || {}).patterns_found || {};
    const patternLines = [];
    if (patterns.urgency_keywords?.length) patternLines.push(`<li><strong>Urgency language:</strong> ${patterns.urgency_keywords.map(escapeHtml).join(', ')}</li>`);
    if (patterns.generic_greetings?.length) patternLines.push(`<li><strong>Generic greetings:</strong> ${patterns.generic_greetings.map(escapeHtml).join(', ')}</li>`);
    if (patterns.grammar_errors?.length) patternLines.push(`<li><strong>Grammar/spelling red flags:</strong> ${patterns.grammar_errors.map(escapeHtml).join(', ')}</li>`);
    html += reportSection('Content Pattern Analysis', patternLines.length
        ? `<ul style="margin-left: 20px;">${patternLines.join('')}</ul>`
        : '<p>No suspicious wording patterns detected.</p>');

    // ---- 7. All warnings, flattened ----
    const warnings = analysis.warnings || [];
    html += reportSection('All Warnings', warnings.length
        ? `<ul style="margin-left: 20px;">${warnings.map(w => `<li>${escapeHtml(w)}</li>`).join('')}</ul>`
        : '<p>No suspicious patterns detected.</p>');

    // ---- 8. Recommendations ----
    const recs = analysis.recommendations || [];
    if (recs.length) {
        html += reportSection('Recommendations', `<ul style="margin-left: 20px;">${recs.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>`);
    }

    resultBox.innerHTML = html;
    resultBox.classList.remove('hidden');
}


// =============== TRAINING ===============
function showTrainingModule(moduleId) {
    const module = trainingModules[moduleId];
    const trainingModule = document.getElementById('trainingModule');
    document.getElementById('scenariosContainer').classList.add('hidden');
    
    if (module) {
        trainingModule.innerHTML = `
            <h4>${tf(module, 'title')}</h4>
            ${tf(module, 'content')}
            <button onclick="document.getElementById('trainingModule').classList.add('hidden')" class="btn btn-danger" style="margin-top: 1rem;">Close Module</button>
        `;
        trainingModule.classList.remove('hidden');
    }
}

function showSpoofingScenarios() {
    document.getElementById('trainingModule').classList.add('hidden');
    const scenariosContainer = document.getElementById('scenariosContainer');
    
    let scenariosHTML = `
        <h4>📧 Email Spoofing Training Scenarios (50 Cases)</h4>
        <p><strong>Learn from real-world examples. Each scenario explains why it's spoofing or legitimate.</strong></p>
        <div style="max-height: 600px; overflow-y: auto;">
    `;
    
    trainingScenarios.forEach((scenario, index) => {
        const statusColor = scenario.spoofing ? '#ff4444' : '#00ff88';
        const statusText = scenario.spoofing ? '🚨 SPOOFED' : '✅ LEGITIMATE';
        
        scenariosHTML += `
            <div class="scenario-box" style="border-left-color: ${statusColor}; margin: 1rem 0;">
                <h5 style="color: ${statusColor};">Case ${index + 1}: ${statusText}</h5>
                <p><strong>Scenario:</strong> ${tf(scenario, 'scenario')}</p>
                <p><strong>Analysis:</strong> ${tf(scenario, 'analysis')}</p>
                <p><strong>What to look for:</strong> ${tf(scenario, 'redFlags')}</p>
            </div>
        `;
    });
    
    scenariosHTML += `
        </div>
        <button onclick="document.getElementById('scenariosContainer').classList.add('hidden')" class="btn btn-danger" style="margin-top: 1rem;">Close Scenarios</button>
    `;
    
    scenariosContainer.innerHTML = scenariosHTML;
    scenariosContainer.classList.remove('hidden');
}

// =============== EXAMS ===============
function startExam(level) {
    if (!currentUser) {
        alert('Please login to take exams');
        showPage('login');
        return;
    }
    
    if (level === 'spoofing') {
        currentExamQuestions = emailSpoofingQuestions;
        currentExamType = 'Email Spoofing';
    } else {
        currentExamQuestions = examQuestions[level];
        currentExamType = 'General Exam';
    }
    
    currentExamLevel = level;
    currentQuestionIndex = 0;
    examAnswers = [];
    
    showPage('exam-page');
    loadQuestion();
}

function loadQuestion() {
    if (currentQuestionIndex >= currentExamQuestions.length) {
        finishExam();
        return;
    }
    
    const question = currentExamQuestions[currentQuestionIndex];
    document.getElementById('examTitle').textContent = `${currentExamType} - ${currentExamLevel.toUpperCase()}`;
    document.getElementById('questionCounter').textContent = `${currentQuestionIndex + 1} of ${currentExamQuestions.length}`;
    
    // Update progress bar
    const progress = ((currentQuestionIndex + 1) / currentExamQuestions.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    
    document.getElementById('questionText').textContent = question.scenario || question.question;

    // Only show "Finish Exam" on the last question - otherwise people can
    // end the exam early and every unanswered question just counts wrong.
    const isLastQuestion = currentQuestionIndex === currentExamQuestions.length - 1;
    const nextBtn = document.getElementById('nextQuestionBtn');
    const finishBtn = document.getElementById('finishExamBtn');
    if (nextBtn) nextBtn.style.display = isLastQuestion ? 'none' : 'inline-block';
    if (finishBtn) finishBtn.style.display = isLastQuestion ? 'inline-block' : 'none';

    const answersContainer = document.getElementById('answersContainer');
    answersContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const div = document.createElement('div');
        div.className = 'answer-option';
        div.innerHTML = `
            <div class="answer-radio"></div>
            <span>${option}</span>
        `;
        div.onclick = () => selectAnswer(index);
        answersContainer.appendChild(div);
    });
}

function selectAnswer(index) {
    document.querySelectorAll('.answer-option').forEach((option, i) => {
        option.classList.toggle('selected', i === index);
    });
    examAnswers[currentQuestionIndex] = index;
}

function nextQuestion() {
    if (examAnswers[currentQuestionIndex] === undefined) {
        alert('Please select an answer');
        return;
    }
    currentQuestionIndex++;
    loadQuestion();
}

function finishExam() {
    if (examAnswers[currentQuestionIndex] === undefined) {
        alert('Please select an answer');
        return;
    }

    let score = 0;
    currentExamQuestions.forEach((question, index) => {
        if (examAnswers[index] === question.correct) {
            score++;
        }
    });
    
    const percentage = Math.round((score / currentExamQuestions.length) * 100);
    const passed = percentage >= 60;
    
    saveExamResult({
        type: currentExamType,
        level: currentExamLevel,
        score: score,
        total: currentExamQuestions.length,
        percentage: percentage,
        passed: passed
    });
    
    showExamResult(score, currentExamQuestions.length, percentage, passed);
}

function saveExamResult(result) {
    if (!currentUser) return;
    
    fetch('/api/save-exam-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
    })
    .then(res => res.json())
    .then(data => {
        console.log('Exam result saved:', data);
    })
    .catch(err => console.error('Save exam error:', err));
}

function showExamResult(score, total, percentage, passed) {
    const status = passed ? 'PASSED ✓' : 'FAILED ✗';
    const statusColor = passed ? 'var(--success)' : 'var(--danger)';
    
    const examPage = document.getElementById('exam-page');
    
    examPage.innerHTML = `
        <div class="exam-container">
            <div class="exam-header">
                <h2>Exam Complete</h2>
            </div>
            <div class="exam-content">
                <h3 style="color: ${statusColor}; font-size: 2rem; margin: 2rem 0;">${status}</h3>
                <div class="result-detail">
                    <strong>Your Score:</strong> ${score} out of ${total} (${percentage}%)
                </div>
                <div class="result-detail">
                    <strong>Level:</strong> ${currentExamLevel.toUpperCase()}
                </div>
                <div class="result-detail">
                    <strong>Exam Type:</strong> ${currentExamType}
                </div>
                <button onclick="showPage('dashboard'); showSection('exams')" class="btn btn-primary" style="margin-top: 2rem;">Back to Dashboard</button>
            </div>
        </div>
    `;
}

// =============== RESULTS ===============
function loadUserResults() {
    if (!currentUser) {
        alert('Please login to view results');
        return;
    }
    
    fetch('/api/get-user-results')
    .then(res => res.json())
    .then(results => {
        const resultsList = document.getElementById('resultsList');
        
        if (results.length === 0) {
            resultsList.innerHTML = '<p>No exam results yet. Take an exam to see your results here.</p>';
            return;
        }
        
        resultsList.innerHTML = results.map(result => `
            <div class="result-item">
                <p><strong>Exam:</strong> ${result.exam_type}</p>
                <p><strong>Level:</strong> ${result.level}</p>
                <p><strong>Score:</strong> ${result.score}/${result.total}</p>
                <p><strong>Date:</strong> ${new Date(result.created_at).toLocaleDateString()}</p>
            </div>
        `).join('');
    })
    .catch(err => {
        console.error('Load results error:', err);
        alert('Error loading results: ' + err.message);
    });
}

// =============== ADMIN PANEL ===============
function loadAdminPanel() {
    console.log('Loading admin panel, isAdmin =', isAdmin);
    
    if (!isAdmin) {
        console.log('Not admin, showing admin login page');
        showPage('admin');
        return;
    }
    
    // Load dashboard data
    fetch('/api/admin/dashboard')
    .then(res => {
        if (!res.ok) throw new Error('Admin dashboard error: ' + res.status);
        return res.json();
    })
    .then(data => {
        console.log('Admin dashboard data:', data);
        document.getElementById('totalUsers').textContent = data.total_users || 0;
        
        const tbody = document.getElementById('resultsTableBody');
        if (data.results && data.results.length > 0) {
            tbody.innerHTML = data.results.map(result => `
                <tr>
                    <td>${escapeHtml(result.username || 'N/A')}</td>
                    <td>${escapeHtml(result.exam_type || 'N/A')}</td>
                    <td>${escapeHtml(result.level || 'N/A')}</td>
                    <td>${result.score}/${result.total}</td>
                    <td>${new Date(result.created_at).toLocaleDateString()}</td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="5">No exam results yet</td></tr>';
        }

        // Every registered employee, whether or not they've taken an exam.
        const checksPerUser = {};
        (data.email_checks || []).forEach(c => {
            checksPerUser[c.performed_by] = (checksPerUser[c.performed_by] || 0) + 1;
        });
        const usersBody = document.getElementById('usersTableBody');
        if (usersBody) {
            if (data.users && data.users.length > 0) {
                usersBody.innerHTML = data.users.map(u => `
                    <tr>
                        <td>${escapeHtml(u.username)}</td>
                        <td>${new Date(u.created_at).toLocaleDateString()}</td>
                        <td>${checksPerUser[u.username] || 0}</td>
                    </tr>
                `).join('');
            } else {
                usersBody.innerHTML = '<tr><td colspan="3">No employees registered yet</td></tr>';
            }
        }

        // Full email-check log so admins can confirm whether an employee
        // checked a suspicious email, and what risk level it got.
        const emailLogBody = document.getElementById('emailLogTableBody');
        if (emailLogBody) {
            if (data.email_checks && data.email_checks.length > 0) {
                emailLogBody.innerHTML = data.email_checks.map(c => `
                    <tr>
                        <td>${escapeHtml(c.performed_by || 'N/A')}</td>
                        <td>${escapeHtml(c.sender || 'N/A')}</td>
                        <td>${escapeHtml(c.subject || 'N/A')}</td>
                        <td class="risk-${(c.risk_level || '').toLowerCase()}">${escapeHtml(c.risk_level || 'N/A')} (${c.risk_score ?? '-'}/100)</td>
                        <td>${new Date(c.created_at).toLocaleString()}</td>
                    </tr>
                `).join('');
            } else {
                emailLogBody.innerHTML = '<tr><td colspan="5">No emails checked yet</td></tr>';
            }
        }
    })
    .catch(err => {
        console.error('Admin panel error:', err);
    });
    
    // Load exams for admin view
    loadAdminExams();
    
    // Load training for admin view
    loadAdminTraining();
    
    showPage('admin-dashboard');
}

// Admin's own Email Checker - reuses the same backend endpoint and report
// renderer as the employee tool, just with separate input/output element IDs.
async function adminAnalyzeEmail() {
    const sender = document.getElementById('adminSenderEmail').value;
    const subject = document.getElementById('adminEmailSubject').value;
    const body = document.getElementById('adminEmailBody').value;

    if (!sender || !subject || !body) {
        alert('Please enter email sender and content');
        return;
    }

    const resultBox = document.getElementById('adminEmailResult');
    resultBox.innerHTML = '<p>Analyzing... this checks 3 external APIs and can take a few seconds.</p>';
    resultBox.classList.remove('hidden');

    try {
        const response = await fetch('/api/check-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: sender, body, subject })
        });

        const analysis = await response.json();

        if (!response.ok || analysis.error) {
            resultBox.innerHTML = `<div class="result-detail"><strong>Error:</strong> ${escapeHtml(analysis.message || 'Analysis failed')}</div>`;
            return;
        }

        displayEmailAnalysis(analysis, 'adminEmailResult');
    } catch (err) {
        console.error('Email analysis error:', err);
        resultBox.innerHTML = `<div class="result-detail"><strong>Error:</strong> ${escapeHtml(err.message)}</div>`;
    }
}

function switchAdminTab(tab) {
    // Hide all tabs
    document.querySelectorAll('.admin-tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.admin-tab-btn').forEach(btn => btn.style.color = '#fff');
    
    // Show selected tab
    const tabElement = document.getElementById(`tab-${tab}`);
    if (tabElement) {
        tabElement.style.display = 'block';
    }
    
    // Update button style
    event.target.style.color = '#00ff88';
}

function loadAdminExams() {
    const container = document.getElementById('adminExamsContainer');
    if (!container) return;
    
    let examsHTML = '';
    
    // Generate exams
    const examLevels = [
        { name: 'Beginner', level: 'beginner', questions: 30 },
        { name: 'Easy', level: 'easy', questions: 30 },
        { name: 'Medium', level: 'medium', questions: 30 },
        { name: 'Hard', level: 'hard', questions: 30 },
        { name: 'Advanced', level: 'advanced', questions: 30 },
        { name: 'Email Spoofing', level: 'spoofing', questions: 50 }
    ];
    
    examLevels.forEach(exam => {
        examsHTML += `
            <div class="exam-card" style="background: #222; border: 2px solid #ff4444; padding: 1.5rem; border-radius: 8px; cursor: pointer;" onclick="alert('Exam: ${exam.name}\\n\\n${exam.questions} Questions\\n\\nPass Score: 60%')">
                <h4 style="color: #00ff88; margin-bottom: 0.5rem;">📝 ${exam.name}</h4>
                <p style="color: #999; margin: 0.5rem 0;">Questions: ${exam.questions}</p>
                <p style="color: #999; margin: 0.5rem 0;">Level: <span style="color: #ff4444;">${exam.level}</span></p>
                <p style="color: #00ff88; margin: 1rem 0; font-weight: bold;">✓ View Results</p>
            </div>
        `;
    });
    
    container.innerHTML = examsHTML;
}

function loadAdminTraining() {
    const container = document.getElementById('adminTrainingContainer');
    if (!container) return;
    
    let trainingHTML = '';
    
    // Training modules
    const modules = [
        { icon: '🔐', name: 'CIA Triad', desc: 'Confidentiality, Integrity, Availability' },
        { icon: '🌐', name: 'Network Security', desc: 'Protocols & Network Threats' },
        { icon: '💻', name: 'Operating Systems', desc: 'OS Security Concepts' },
        { icon: '📧', name: 'Email Security', desc: 'Spoofing & Phishing Detection' },
        { icon: '🎓', name: 'Training Scenarios', desc: '50 Real-World Cases' }
    ];
    
    modules.forEach(mod => {
        trainingHTML += `
            <div class="training-card" style="background: #222; border: 2px solid #00ff88; padding: 1.5rem; border-radius: 8px; cursor: pointer;" onclick="alert('Module: ${mod.name}\\n\\n${mod.desc}')">
                <h4 style="color: #ff4444; margin-bottom: 0.5rem;">${mod.icon} ${mod.name}</h4>
                <p style="color: #999; margin: 0.5rem 0;">${mod.desc}</p>
                <p style="color: #00ff88; margin: 1rem 0; font-weight: bold;">▶ Access Module</p>
            </div>
        `;
    });
    
    container.innerHTML = trainingHTML;
}

function showAdminPanel() {
    console.log('showAdminPanel called, isAdmin =', isAdmin);
    
    if (isAdmin) {
        loadAdminPanel();
    } else {
        showPage('admin');
    }
}

// =============== INITIALIZATION ===============
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, currentUser:', currentUser);
    console.log('isAdmin:', isAdmin);
    
    // Check if user is logged in
    if (currentUser) {
        const userDisplay = document.getElementById('userDisplay');
        if (userDisplay) {
            userDisplay.textContent = currentUser.username;
        }
    }
    
    // Set language
    const lang = localStorage.getItem('lang') || 'en';
    changeLanguage(lang);
    
    // Show home page by default
    if (!currentUser && !isAdmin) {
        showPage('home');
    } else if (currentUser) {
        showPage('dashboard');
    } else if (isAdmin) {
        loadAdminPanel();
    }
    
    updateNavbar();
});

// Shuffle function for randomizing answers (optional)
function shuffleAnswers(questions) {
    return questions.map(q => ({
        ...q,
        options: q.options.sort(() => Math.random() - 0.5)
    }));
}

// Helper function for language
function t(key) {
    if (typeof translations === 'undefined') {
        return key;
    }
    return translations[currentLang] && translations[currentLang][key] ? translations[currentLang][key] : key;
}
