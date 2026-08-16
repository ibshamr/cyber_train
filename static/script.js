// =============== GLOBAL VARIABLES ===============
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let currentExamType = null;
let currentExamLevel = null;
let currentExamQuestions = [];
let currentQuestionIndex = 0;
let examAnswers = [];
let isAdmin = localStorage.getItem('isAdmin') === 'true' || false;

document.addEventListener('DOMContentLoaded', function() {
    const pledgeCheckbox = document.getElementById('pledgeCheckbox');
    const pledgeSubmitBtn = document.getElementById('pledgeSubmitBtn');
    if (pledgeCheckbox && pledgeSubmitBtn) {
        pledgeCheckbox.addEventListener('change', function() {
            pledgeSubmitBtn.disabled = !pledgeCheckbox.checked;
        });
    }
});

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
            currentUser = { username };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            const userDisplay = document.getElementById('userDisplay');
            if (userDisplay) {
                userDisplay.textContent = username;
            }

            document.getElementById('regUsername').value = '';
            document.getElementById('regPassword').value = '';

            if (data.needs_pledge) {
                showPage('pledge');
            } else {
                showPage('dashboard');
                updateNavbar();
            }
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

            if (data.needs_pledge) {
                showPage('pledge');
            } else {
                showPage('dashboard');
                updateNavbar();
            }
        } else {
            alert(data.message || 'Invalid credentials');
        }
    })
    .catch(err => {
        console.error('Login error:', err);
        alert('Login error: ' + err.message);
    });
}

function submitPledge() {
    const checkbox = document.getElementById('pledgeCheckbox');
    if (!checkbox.checked) {
        alert('Please check the box to confirm you agree to the pledge.');
        return;
    }

    fetch('/api/accept-pledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showPage('dashboard');
            updateNavbar();
        } else {
            alert(data.message || 'Could not save pledge. Please try logging in again.');
        }
    })
    .catch(err => {
        console.error('Pledge error:', err);
        alert('Pledge error: ' + err.message);
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
    
    if (!sender || !body) {
        alert('Please enter email sender and content');
        return;
    }
    
    try {
        const response = await fetch('/api/check-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: sender, body, subject })
        });
        
        const analysis = await response.json();
        displayEmailAnalysis(analysis);
    } catch (err) {
        console.error('Email analysis error:', err);
        alert('Error analyzing email: ' + err.message);
    }
}

function displayEmailAnalysis(report) {
    const resultBox = document.getElementById('emailResult');

    if (!report || !report.overall_assessment) {
        resultBox.innerHTML = `<p style="color:#ff4444;">Error: unexpected response from server. ${report && report.message ? report.message : ''}</p>`;
        resultBox.classList.remove('hidden');
        return;
    }

    const assessment = report.overall_assessment;
    const riskLevel = assessment.risk_level || 'UNKNOWN';
    const riskScore = assessment.risk_score ?? 0;
    const riskClass = `risk-${riskLevel.toLowerCase()}`;

    let recommendationsHTML = '';
    if (report.recommendations && report.recommendations.length > 0) {
        recommendationsHTML = '<ul style="margin-left: 20px;">';
        report.recommendations.forEach(rec => {
            recommendationsHTML += `<li>${rec}</li>`;
        });
        recommendationsHTML += '</ul>';
    } else {
        recommendationsHTML = `<p>No specific recommendations</p>`;
    }

    const emailInfo = report.email_info || {};
    const otx = report.api_1_otx || {};
    const vt = report.api_2_virustotal || {};
    const mxt = report.api_3_mxtoolbox || {};
    const whoisInfo = report.api_4_whois || {};
    const patterns = report.pattern_analysis || {};

    resultBox.innerHTML = `
        <h4>Comprehensive Email Security Report</h4>
        <div class="result-detail">
            <strong>Risk Level:</strong> <span class="${riskClass}">${riskLevel}</span>
            (${riskScore}/100)
        </div>
        <div class="result-detail">
            <strong>Decision:</strong> ${assessment.decision || ''}
        </div>
        <div class="result-detail">
            <strong>Summary:</strong> ${assessment.summary || ''}
        </div>
        <div class="result-detail">
            <strong>Sender:</strong> ${emailInfo.full_email || 'N/A'} (Domain: ${emailInfo.domain || 'N/A'})
        </div>
        <div class="result-detail">
            <strong>OTX AlienVault:</strong> ${otx.status || 'N/A'}
            ${otx.findings ? ' - ' + (otx.findings.reputation_interpretation || '') : ''}
        </div>
        <div class="result-detail">
            <strong>VirusTotal:</strong> ${vt.status || 'N/A'}
            ${vt.urls_found !== undefined ? ' - URLs found: ' + vt.urls_found : ''}
        </div>
        <div class="result-detail">
            <strong>Email Authentication (MXToolbox):</strong> ${mxt.status || 'N/A'}
            ${mxt.email_health_score !== undefined ? ' - Health Score: ' + mxt.email_health_score + '/100' : ''}
        </div>
        <div class="result-detail">
            <strong>Domain Age (WHOIS):</strong> ${whoisInfo.status || 'N/A'}
            ${whoisInfo.findings && whoisInfo.findings.age_days !== undefined ? ' - ' + whoisInfo.findings.age_days + ' days old' : ''}
        </div>
        <div class="result-detail">
            <strong>Content Patterns:</strong> ${patterns.severity || 'N/A'}
        </div>
        <div class="result-detail">
            <strong>Recommendations:</strong>
            ${recommendationsHTML}
        </div>
    `;

    resultBox.classList.remove('hidden');
}

// =============== TRAINING ===============
function showTrainingModule(moduleId) {
    const module = trainingModules[moduleId];
    const trainingModule = document.getElementById('trainingModule');
    document.getElementById('scenariosContainer').classList.add('hidden');
    
    if (module) {
        trainingModule.innerHTML = `
            <h4>${module.title}</h4>
            ${module.content}
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
                <p><strong>Scenario:</strong> ${scenario.scenario}</p>
                <p><strong>Analysis:</strong> ${scenario.analysis}</p>
                <p><strong>What to look for:</strong> ${scenario.redFlags}</p>
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

        const pledgedEl = document.getElementById('pledgedUsers');
        if (pledgedEl) {
            pledgedEl.textContent = data.pledged_users || 0;
        }

        // جدول المستخدمين وحالة التعهد
        const usersTbody = document.getElementById('usersTableBody');
        if (usersTbody) {
            if (data.users && data.users.length > 0) {
                usersTbody.innerHTML = data.users.map(u => `
                    <tr>
                        <td>${u.username || 'N/A'}</td>
                        <td>${u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}</td>
                        <td style="color:${u.pledge_accepted ? '#00ff88' : '#ff4444'}; font-weight:bold;">
                            ${u.pledge_accepted ? '✔ Accepted' : '✘ Not Accepted'}
                        </td>
                        <td>${u.pledge_accepted_at ? new Date(u.pledge_accepted_at).toLocaleDateString() : '-'}</td>
                    </tr>
                `).join('');
            } else {
                usersTbody.innerHTML = '<tr><td colspan="4">No users yet</td></tr>';
            }
        }

        // جدول فحوصات الإيميل لكل موظف
        const checksTbody = document.getElementById('emailChecksTableBody');
        if (checksTbody) {
            if (data.email_checks && data.email_checks.length > 0) {
                checksTbody.innerHTML = data.email_checks.map(c => `
                    <tr>
                        <td>${c.username || 'N/A'}</td>
                        <td>${c.sender || 'N/A'}</td>
                        <td>${c.risk_level || 'N/A'}</td>
                        <td>${c.risk_score ?? 'N/A'}</td>
                        <td>${c.created_at ? new Date(c.created_at).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                `).join('');
            } else {
                checksTbody.innerHTML = '<tr><td colspan="5">No email checks yet</td></tr>';
            }
        }

        const tbody = document.getElementById('resultsTableBody');
        if (data.results && data.results.length > 0) {
            tbody.innerHTML = data.results.map(result => `
                <tr>
                    <td>${result.username || 'N/A'}</td>
                    <td>${result.exam_type || 'N/A'}</td>
                    <td>${result.level || 'N/A'}</td>
                    <td>${result.score}/${result.total}</td>
                    <td>${new Date(result.created_at).toLocaleDateString()}</td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="5">No exam results yet</td></tr>';
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
