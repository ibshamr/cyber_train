// =============== EXAMS DATA ===============

const examQuestions = {
    beginner: [
        {
            id: 1,
            question: "What is cybersecurity?",
            options: [
                "Protection of computer systems from information disclosure",
                "A network of computers",
                "A type of software",
                "A hardware device"
            ],
            correct: 0
        },
        {
            id: 2,
            question: "What is the main goal of information security?",
            options: [
                "To make computers faster",
                "To protect confidentiality, integrity, and availability",
                "To increase network speed",
                "To reduce costs"
            ],
            correct: 1
        },
        {
            id: 3,
            question: "Which of the following is a strong password?",
            options: [
                "123456",
                "password",
                "Tr0p!cal$un$et#2024",
                "admin"
            ],
            correct: 2
        },
        {
            id: 4,
            question: "What is phishing?",
            options: [
                "A type of fish",
                "Fraudulent attempt to obtain sensitive information",
                "A fishing technique",
                "A network protocol"
            ],
            correct: 1
        },
        {
            id: 5,
            question: "What should you do if you receive a suspicious email?",
            options: [
                "Click on all links",
                "Reply with your information",
                "Report it and don't click suspicious links",
                "Forward it to all contacts"
            ],
            correct: 2
        },
        {
            id: 6,
            question: "What is two-factor authentication?",
            options: [
                "Two passwords",
                "Security method using two verification methods",
                "Two email addresses",
                "Two usernames"
            ],
            correct: 1
        },
        {
            id: 7,
            question: "What is malware?",
            options: [
                "Software that improves performance",
                "Malicious software designed to harm systems",
                "A type of email",
                "A network device"
            ],
            correct: 1
        },
        {
            id: 8,
            question: "What does VPN stand for?",
            options: [
                "Virtual Private Network",
                "Very Private Name",
                "Virus Protection Network",
                "Video Private Network"
            ],
            correct: 0
        },
        {
            id: 9,
            question: "What is encryption?",
            options: [
                "Sending emails",
                "Process of converting data into unreadable form",
                "Creating passwords",
                "Installing software"
            ],
            correct: 1
        },
        {
            id: 10,
            question: "What should be done with outdated software?",
            options: [
                "Keep using it",
                "Update or remove it for security",
                "Share it with others",
                "Ignore security warnings"
            ],
            correct: 1
        },
        {
            id: 11,
            question: "What is a firewall?",
            options: [
                "A wall made of fire",
                "Security system monitoring network traffic",
                "A type of antivirus",
                "A email service"
            ],
            correct: 1
        },
        {
            id: 12,
            question: "What is social engineering?",
            options: [
                "A type of network",
                "Building infrastructure",
                "Manipulating people to disclose confidential information",
                "Teaching computer science"
            ],
            correct: 2
        },
        {
            id: 13,
            question: "What should you do with work data?",
            options: [
                "Share with friends",
                "Post on social media",
                "Keep it confidential and secure",
                "Leave it on public computers"
            ],
            correct: 2
        },
        {
            id: 14,
            question: "What is a data breach?",
            options: [
                "Breaking a computer",
                "Unauthorized access to data",
                "Deleting files",
                "Closing a website"
            ],
            correct: 1
        },
        {
            id: 15,
            question: "What is ransomware?",
            options: [
                "Free software",
                "Malware that encrypts data and demands payment",
                "Antivirus software",
                "Email encryption tool"
            ],
            correct: 1
        },
        {
            id: 16,
            question: "How often should you change your password?",
            options: [
                "Never",
                "Every 5 years",
                "Every 3-6 months",
                "Once when created"
            ],
            correct: 2
        },
        {
            id: 17,
            question: "What is a zero-day vulnerability?",
            options: [
                "A vulnerability found on day zero",
                "Unknown vulnerability exploited before patch",
                "A fixed vulnerability",
                "A type of antivirus"
            ],
            correct: 1
        },
        {
            id: 18,
            question: "What should you do before sharing a computer?",
            options: [
                "Logout and clear browser history",
                "Leave it logged in for convenience",
                "Share passwords",
                "Nothing special"
            ],
            correct: 0
        },
        {
            id: 19,
            question: "What is a denial of service (DoS) attack?",
            options: [
                "Refusing to work",
                "Overloading a system to make it unavailable",
                "Deleting email",
                "Changing password"
            ],
            correct: 1
        },
        {
            id: 20,
            question: "What is multi-factor authentication?",
            options: [
                "Multiple passwords",
                "Multiple verification methods for security",
                "Multiple email accounts",
                "Multiple devices"
            ],
            correct: 1
        },
        {
            id: 21,
            question: "What should you do if your account is compromised?",
            options: [
                "Ignore it",
                "Report it and change password immediately",
                "Continue using it",
                "Tell nobody"
            ],
            correct: 1
        },
        {
            id: 22,
            question: "What is a botnet?",
            options: [
                "A network of robots",
                "Network of compromised devices controlled remotely",
                "A type of software",
                "A messaging app"
            ],
            correct: 1
        },
        {
            id: 23,
            question: "What is credential stuffing?",
            options: [
                "Storing credentials safely",
                "Using leaked passwords on multiple accounts",
                "Creating new passwords",
                "Encrypting passwords"
            ],
            correct: 1
        },
        {
            id: 24,
            question: "What should be included in a secure password?",
            options: [
                "Only letters",
                "Only numbers",
                "Mix of upper, lower, numbers, and special characters",
                "Your name and birthdate"
            ],
            correct: 2
        },
        {
            id: 25,
            question: "What is an intrusion detection system?",
            options: [
                "Software that detects unauthorized access attempts",
                "A type of email",
                "A password manager",
                "A web browser"
            ],
            correct: 0
        },
        {
            id: 26,
            question: "What is a security patch?",
            options: [
                "A piece of cloth",
                "Software update that fixes security vulnerabilities",
                "A password",
                "An encryption tool"
            ],
            correct: 1
        },
        {
            id: 27,
            question: "What should you do before clicking a link in an email?",
            options: [
                "Click immediately",
                "Verify the sender and hover to check URL",
                "Forward to others first",
                "Nothing special"
            ],
            correct: 1
        },
        {
            id: 28,
            question: "What is the dark web?",
            options: [
                "The internet at night",
                "Hidden network requiring special software",
                "A type of malware",
                "A social media platform"
            ],
            correct: 1
        },
        {
            id: 29,
            question: "What should you do with sensitive documents?",
            options: [
                "Leave them on desk",
                "Share with everyone",
                "Secure them and destroy when no longer needed",
                "Post online"
            ],
            correct: 2
        },
        {
            id: 30,
            question: "What is a security awareness training?",
            options: [
                "A video game",
                "Educational program to teach security practices",
                "A type of software",
                "A password manager"
            ],
            correct: 1
        }
    ],

    easy: [
        {
            id: 1,
            question: "What is the CIA Triad?",
            options: [
                "A security model with Confidentiality, Integrity, Availability",
                "A government agency",
                "A type of encryption",
                "A network protocol"
            ],
            correct: 0
        },
        {
            id: 2,
            question: "What does Confidentiality mean in security?",
            options: [
                "Data availability",
                "Data accuracy",
                "Only authorized access to data",
                "Fast data transfer"
            ],
            correct: 2
        },
        {
            id: 3,
            question: "What is Integrity in cybersecurity?",
            options: [
                "Fast processing",
                "Data has not been altered or modified",
                "Secure storage",
                "Encryption method"
            ],
            correct: 1
        },
        {
            id: 4,
            question: "What does Availability mean?",
            options: [
                "Data is public",
                "Systems and data are accessible when needed",
                "Data is encrypted",
                "Data is backed up"
            ],
            correct: 1
        },
        {
            id: 5,
            question: "How is confidentiality protected?",
            options: [
                "Backup systems",
                "Encryption and access controls",
                "Fast networks",
                "Multiple servers"
            ],
            correct: 1
        },
        {
            id: 6,
            question: "How is integrity ensured?",
            options: [
                "Firewalls",
                "Hashing and digital signatures",
                "Backups",
                "Passwords"
            ],
            correct: 1
        },
        {
            id: 7,
            question: "How is availability maintained?",
            options: [
                "Using old systems",
                "Backups, redundancy, and disaster recovery",
                "No maintenance",
                "Single server setup"
            ],
            correct: 1
        },
        {
            id: 8,
            question: "What is a hash function?",
            options: [
                "A food recipe",
                "Algorithm that converts data to fixed-size output",
                "A type of encryption",
                "A programming language"
            ],
            correct: 1
        },
        {
            id: 9,
            question: "What is a digital signature?",
            options: [
                "Your handwritten signature",
                "Cryptographic verification of authenticity",
                "A password",
                "A certificate"
            ],
            correct: 1
        },
        {
            id: 10,
            question: "What is asymmetric encryption?",
            options: [
                "Same key for encryption and decryption",
                "Two different keys (public and private)",
                "One-way encryption",
                "No encryption"
            ],
            correct: 1
        },
        {
            id: 11,
            question: "What is symmetric encryption?",
            options: [
                "Two different keys",
                "Same key for encryption and decryption",
                "No encryption",
                "Public key encryption"
            ],
            correct: 1
        },
        {
            id: 12,
            question: "What is SSL/TLS?",
            options: [
                "A programming language",
                "Protocol for secure communication",
                "An email service",
                "A file format"
            ],
            correct: 1
        },
        {
            id: 13,
            question: "What is a certificate authority?",
            options: [
                "A government office",
                "Organization that issues digital certificates",
                "A type of encryption",
                "A backup service"
            ],
            correct: 1
        },
        {
            id: 14,
            question: "What does PKI stand for?",
            options: [
                "Private Key Infrastructure",
                "Public Key Infrastructure",
                "Proxy Key Index",
                "Password Key Identification"
            ],
            correct: 1
        },
        {
            id: 15,
            question: "What is a private key?",
            options: [
                "A key shared with everyone",
                "Secret key kept by the owner",
                "A password",
                "A certificate"
            ],
            correct: 1
        },
        {
            id: 16,
            question: "What is a public key?",
            options: [
                "A secret key",
                "Key that can be shared publicly",
                "A private key",
                "An encryption algorithm"
            ],
            correct: 1
        },
        {
            id: 17,
            question: "What is HTTPS?",
            options: [
                "Unsecured HTTP",
                "HTTP with SSL/TLS encryption",
                "A email protocol",
                "A file transfer protocol"
            ],
            correct: 1
        },
        {
            id: 18,
            question: "What is a security certificate?",
            options: [
                "A diploma",
                "Digital file verifying identity and encryption",
                "A password",
                "A backup file"
            ],
            correct: 1
        },
        {
            id: 19,
            question: "What is an audit log?",
            options: [
                "A type of tree",
                "Record of security events and activities",
                "A backup system",
                "An encryption method"
            ],
            correct: 1
        },
        {
            id: 20,
            question: "What is non-repudiation?",
            options: [
                "Ability to deny actions",
                "Inability to deny having performed an action",
                "Password protection",
                "Data backup"
            ],
            correct: 1
        },
        {
            id: 21,
            question: "What is authentication?",
            options: [
                "Making data available",
                "Verifying identity of a user or system",
                "Encrypting data",
                "Backing up data"
            ],
            correct: 1
        },
        {
            id: 22,
            question: "What is authorization?",
            options: [
                "Verifying identity",
                "Determining what authenticated user can access",
                "Creating passwords",
                "Encrypting data"
            ],
            correct: 1
        },
        {
            id: 23,
            question: "What is a role-based access control?",
            options: [
                "Random access",
                "Access based on user roles",
                "No access control",
                "Everyone has full access"
            ],
            correct: 1
        },
        {
            id: 24,
            question: "What is the principle of least privilege?",
            options: [
                "Give everyone access",
                "Grant minimum necessary permissions",
                "No security controls",
                "Use weak passwords"
            ],
            correct: 1
        },
        {
            id: 25,
            question: "What is identity management?",
            options: [
                "Managing passwords only",
                "System for managing user identities",
                "Creating usernames",
                "Backup management"
            ],
            correct: 1
        },
        {
            id: 26,
            question: "What is a security policy?",
            options: [
                "Insurance policy",
                "Set of rules for security practices",
                "A password",
                "An encryption method"
            ],
            correct: 1
        },
        {
            id: 27,
            question: "What is vulnerability assessment?",
            options: [
                "Identifying system weaknesses",
                "Creating passwords",
                "Encrypting data",
                "Backing up files"
            ],
            correct: 0
        },
        {
            id: 28,
            question: "What is penetration testing?",
            options: [
                "Testing internet speed",
                "Authorized security test to find vulnerabilities",
                "Installing software",
                "Changing passwords"
            ],
            correct: 1
        },
        {
            id: 29,
            question: "What is compliance?",
            options: [
                "Data backup",
                "Adherence to security regulations",
                "Using passwords",
                "Encryption"
            ],
            correct: 1
        },
        {
            id: 30,
            question: "What is a security incident?",
            options: [
                "A scheduled maintenance",
                "Unauthorized access or security violation",
                "Password change",
                "Software update"
            ],
            correct: 1
        }
    ],

    medium: [
        {
            id: 1,
            question: "What is the OSI model?",
            options: [
                "Operating System Interface",
                "Seven-layer framework for network communication",
                "Online Service Integration",
                "Optical Signal Interface"
            ],
            correct: 1
        },
        {
            id: 2,
            question: "What is TCP/IP?",
            options: [
                "A single protocol",
                "Suite of protocols for internet communication",
                "A type of firewall",
                "An encryption method"
            ],
            correct: 1
        },
        {
            id: 3,
            question: "What is the difference between TCP and UDP?",
            options: [
                "No difference",
                "TCP is reliable, UDP is fast but unreliable",
                "UDP is secure",
                "TCP is faster"
            ],
            correct: 1
        },
        {
            id: 4,
            question: "What is an IP address?",
            options: [
                "Internet Password",
                "Unique identifier for devices on network",
                "A type of encryption",
                "A domain name"
            ],
            correct: 1
        },
        {
            id: 5,
            question: "What is subnet masking?",
            options: [
                "Hiding passwords",
                "Dividing network into subnetworks",
                "Encryption method",
                "Firewall rule"
            ],
            correct: 1
        },
        {
            id: 6,
            question: "What is DNS?",
            options: [
                "Domain Name System",
                "Digital Network Security",
                "Data Network Setup",
                "Device Network Scanner"
            ],
            correct: 0
        },
        {
            id: 7,
            question: "What is DHCP?",
            options: [
                "Dynamic Host Configuration Protocol",
                "Digital Host Controller",
                "Dynamic HTTP Protocol",
                "Data Host Communication"
            ],
            correct: 0
        },
        {
            id: 8,
            question: "What is ARP?",
            options: [
                "Address Resolution Protocol",
                "Advanced Routing Protocol",
                "Automatic Response Protocol",
                "Application Response Program"
            ],
            correct: 0
        },
        {
            id: 9,
            question: "What is an ARP spoofing attack?",
            options: [
                "Changing IP addresses",
                "Fraudulent ARP messages linking MAC to IP",
                "DNS attack",
                "DDoS attack"
            ],
            correct: 1
        },
        {
            id: 10,
            question: "What is a man-in-the-middle attack?",
            options: [
                "Physical attack",
                "Intercepting communication between two parties",
                "DDoS attack",
                "Social engineering"
            ],
            correct: 1
        },
        {
            id: 11,
            question: "What is packet sniffing?",
            options: [
                "Fast internet",
                "Capturing network traffic",
                "Encryption method",
                "Firewall rule"
            ],
            correct: 1
        },
        {
            id: 12,
            question: "What is NAT?",
            options: [
                "Network Authentication Technique",
                "Network Address Translation",
                "Name Authorization Token",
                "Network Access Tool"
            ],
            correct: 1
        },
        {
            id: 13,
            question: "What is a proxy server?",
            options: [
                "A backup server",
                "Server that forwards requests from clients",
                "A DNS server",
                "A web server"
            ],
            correct: 1
        },
        {
            id: 14,
            question: "What is port forwarding?",
            options: [
                "Deleting ports",
                "Redirecting network traffic to specific port",
                "Blocking all ports",
                "Changing IP addresses"
            ],
            correct: 1
        },
        {
            id: 15,
            question: "What is SSH?",
            options: [
                "Secure Shell for remote access",
                "Secure HTTP",
                "System Security Host",
                "Software Security Header"
            ],
            correct: 0
        },
        {
            id: 16,
            question: "What is Telnet?",
            options: [
                "A secure remote access protocol",
                "Unsecure remote access protocol",
                "A type of encryption",
                "A firewall"
            ],
            correct: 1
        },
        {
            id: 17,
            question: "What is SMTP?",
            options: [
                "Simple Mail Transfer Protocol",
                "Secure Message Transmission Protocol",
                "System Mail Transport",
                "Secure Mail Transfer"
            ],
            correct: 0
        },
        {
            id: 18,
            question: "What is POP3?",
            options: [
                "Post Office Protocol",
                "Personal Online Portal",
                "Public Online Protocol",
                "Postal Operation Protocol"
            ],
            correct: 0
        },
        {
            id: 19,
            question: "What is IMAP?",
            options: [
                "Internet Message Access Protocol",
                "Internal Mail Application",
                "Internet Mail Access Program",
                "Integrated Message Access Protocol"
            ],
            correct: 0
        },
        {
            id: 20,
            question: "What is FTP?",
            options: [
                "File Transfer Protocol",
                "Fast Text Processor",
                "File Transport Program",
                "Folder Transfer Protocol"
            ],
            correct: 0
        },
        {
            id: 21,
            question: "What is SFTP?",
            options: [
                "Simple File Transfer",
                "SSH File Transfer Protocol",
                "Secure Fast Transfer",
                "System File Transport"
            ],
            correct: 1
        },
        {
            id: 22,
            question: "What is bandwidth?",
            options: [
                "Width of network cable",
                "Maximum data transfer rate",
                "Network password",
                "Firewall setting"
            ],
            correct: 1
        },
        {
            id: 23,
            question: "What is latency?",
            options: [
                "Network speed",
                "Delay in data transmission",
                "Firewall rules",
                "Encryption method"
            ],
            correct: 1
        },
        {
            id: 24,
            question: "What is throughput?",
            options: [
                "Network delay",
                "Actual data transfer rate",
                "Maximum bandwidth",
                "Firewall capacity"
            ],
            correct: 1
        },
        {
            id: 25,
            question: "What is a VLAN?",
            options: [
                "Virtual Local Area Network",
                "Virtual Line Access Network",
                "Virus Local Area",
                "Virtual Login Area"
            ],
            correct: 0
        },
        {
            id: 26,
            question: "What is network segmentation?",
            options: [
                "Dividing network into logical parts",
                "Combining networks",
                "Deleting networks",
                "Securing passwords"
            ],
            correct: 0
        },
        {
            id: 27,
            question: "What is a DMZ?",
            options: [
                "Data Management Zone",
                "Demilitarized Zone for servers",
                "Digital Monitor Zone",
                "Deployment Management Area"
            ],
            correct: 1
        },
        {
            id: 28,
            question: "What is load balancing?",
            options: [
                "Balancing weight",
                "Distributing traffic across servers",
                "Securing networks",
                "Encrypting data"
            ],
            correct: 1
        },
        {
            id: 29,
            question: "What is QoS?",
            options: [
                "Quick Online Service",
                "Quality of Service",
                "Query Operating System",
                "Queued Online Service"
            ],
            correct: 1
        },
        {
            id: 30,
            question: "What is network monitoring?",
            options: [
                "Watching network activity",
                "Creating network maps",
                "Deleting network logs",
                "Changing firewall rules"
            ],
            correct: 0
        }
    ],

    hard: [
        {
            id: 1,
            question: "What is IPSec?",
            options: [
                "Internet Protocol Security",
                "Integrated Port Security",
                "IP Segment",
                "Internal Protocol"
            ],
            correct: 0
        },
        {
            id: 2,
            question: "What is TLS handshake?",
            options: [
                "Shaking hands",
                "Process to establish secure connection",
                "Encryption algorithm",
                "Network protocol"
            ],
            correct: 1
        },
        {
            id: 3,
            question: "What is the difference between HTTP and HTTPS?",
            options: [
                "No difference",
                "HTTPS uses encryption",
                "HTTP is faster",
                "HTTPS is older"
            ],
            correct: 1
        },
        {
            id: 4,
            question: "What is DNSSEC?",
            options: [
                "DNS Security",
                "Digital Name Security",
                "Domain Name Security Extension",
                "Data Network Security"
            ],
            correct: 2
        },
        {
            id: 5,
            question: "What is DNS spoofing?",
            options: [
                "Changing domain names",
                "Redirecting DNS queries to fake server",
                "DDoS attack",
                "Man-in-the-middle"
            ],
            correct: 1
        },
        {
            id: 6,
            question: "What is SSL stripping?",
            options: [
                "Removing SSL certificate",
                "Downgrading HTTPS to HTTP",
                "Stealing passwords",
                "Firewall bypass"
            ],
            correct: 1
        },
        {
            id: 7,
            question: "What is Perfect Forward Secrecy?",
            options: [
                "Perfect password security",
                "Session keys not compromised if key is stolen",
                "Encryption method",
                "Firewall feature"
            ],
            correct: 1
        },
        {
            id: 8,
            question: "What is certificate pinning?",
            options: [
                "Physical security",
                "Binding app to specific certificate",
                "Password management",
                "Firewall rule"
            ],
            correct: 1
        },
        {
            id: 9,
            question: "What is OCSP?",
            options: [
                "Online Certificate Status Protocol",
                "Operation Certificate Service",
                "Organizational Certificate Security",
                "Online Certificate Signing"
            ],
            correct: 0
        },
        {
            id: 10,
            question: "What is certificate revocation?",
            options: [
                "Renewing certificate",
                "Invalidating certificate before expiration",
                "Creating certificate",
                "Securing certificate"
            ],
            correct: 1
        },
        {
            id: 11,
            question: "What is Diffie-Hellman?",
            options: [
                "A person's name",
                "Key exchange algorithm",
                "Encryption method",
                "Network protocol"
            ],
            correct: 1
        },
        {
            id: 12,
            question: "What is RSA cryptography?",
            options: [
                "Rapid Security Algorithm",
                "Asymmetric encryption (Rivest-Shamir-Adleman)",
                "Random Security Access",
                "Router Security Algorithm"
            ],
            correct: 1
        },
        {
            id: 13,
            question: "What is AES encryption?",
            options: [
                "Advanced Encryption Standard",
                "Automated Email Security",
                "Application Encryption Service",
                "Adaptive Environment System"
            ],
            correct: 0
        },
        {
            id: 14,
            question: "What is a cipher suite?",
            options: [
                "A room",
                "Collection of encryption algorithms",
                "Password management",
                "Firewall configuration"
            ],
            correct: 1
        },
        {
            id: 15,
            question: "What is stream cipher?",
            options: [
                "River encryption",
                "Encrypts data one bit at a time",
                "Block encryption",
                "Network encryption"
            ],
            correct: 1
        },
        {
            id: 16,
            question: "What is block cipher?",
            options: [
                "Firewall",
                "Encrypts data in fixed-size blocks",
                "Stream encryption",
                "Network security"
            ],
            correct: 1
        },
        {
            id: 17,
            question: "What is CBC mode?",
            options: [
                "Cipher Block Chaining",
                "Continuous Bit Cipher",
                "Cryptographic Block Configuration",
                "Chain Based Coding"
            ],
            correct: 0
        },
        {
            id: 18,
            question: "What is GCM mode?",
            options: [
                "Galois/Counter Mode",
                "Group Cipher Method",
                "Global Cryptographic Mode",
                "General Configuration Method"
            ],
            correct: 0
        },
        {
            id: 19,
            question: "What is a nonce?",
            options: [
                "A name",
                "Number used once for encryption",
                "Password",
                "Certificate"
            ],
            correct: 1
        },
        {
            id: 20,
            question: "What is key derivation?",
            options: [
                "Creating passwords",
                "Generating keys from password",
                "Certificate creation",
                "Firewall configuration"
            ],
            correct: 1
        },
        {
            id: 21,
            question: "What is PBKDF2?",
            options: [
                "Password-Based Key Derivation Function",
                "Protocol Boundary Key Framework",
                "Public Boundary Key Derivation",
                "Protected Block Key Definition"
            ],
            correct: 0
        },
        {
            id: 22,
            question: "What is bcrypt?",
            options: [
                "Binary cryptography",
                "Password hashing algorithm",
                "Encryption method",
                "Network security"
            ],
            correct: 1
        },
        {
            id: 23,
            question: "What is a salt in hashing?",
            options: [
                "Seasoning",
                "Random data added to hash",
                "Encryption key",
                "Password"
            ],
            correct: 1
        },
        {
            id: 24,
            question: "What is collision resistance?",
            options: [
                "Car safety",
                "Hard to find two inputs with same hash",
                "Encryption strength",
                "Firewall feature"
            ],
            correct: 1
        },
        {
            id: 25,
            question: "What is HMAC?",
            options: [
                "Hash-based Message Authentication Code",
                "High-level Messaging Authentication",
                "Hashed Message Control",
                "Hardware Message Authentication"
            ],
            correct: 0
        },
        {
            id: 26,
            question: "What is digital envelope?",
            options: [
                "Physical envelope",
                "Combining symmetric and asymmetric encryption",
                "Email encryption",
                "Password protection"
            ],
            correct: 1
        },
        {
            id: 27,
            question: "What is key escrow?",
            options: [
                "Hidden key",
                "Storing encryption keys with trusted party",
                "Lost key recovery",
                "Key generation"
            ],
            correct: 1
        },
        {
            id: 28,
            question: "What is homomorphic encryption?",
            options: [
                "Same type encryption",
                "Performing operations on encrypted data",
                "Simple encryption",
                "Network security"
            ],
            correct: 1
        },
        {
            id: 29,
            question: "What is zero-knowledge proof?",
            options: [
                "Proving something without knowledge",
                "Proving knowledge without revealing info",
                "Password verification",
                "Authentication method"
            ],
            correct: 1
        },
        {
            id: 30,
            question: "What is elliptic curve cryptography?",
            options: [
                "Curved encryption",
                "Asymmetric encryption using elliptic curves",
                "Simple encryption",
                "Hash algorithm"
            ],
            correct: 1
        }
    ],

    advanced: [
        {
            id: 1,
            question: "What is privilege escalation in OS?",
            options: [
                "Upgrading hardware",
                "Gaining higher-level access rights",
                "Increasing network speed",
                "Changing passwords"
            ],
            correct: 1
        },
        {
            id: 2,
            question: "What is a kernel exploit?",
            options: [
                "Programming bug",
                "Attack targeting kernel vulnerabilities",
                "Software optimization",
                "Hardware upgrade"
            ],
            correct: 1
        },
        {
            id: 3,
            question: "What is buffer overflow?",
            options: [
                "Too much data storage",
                "Writing data beyond buffer bounds",
                "Network congestion",
                "Memory optimization"
            ],
            correct: 1
        },
        {
            id: 4,
            question: "What is code injection?",
            options: [
                "Adding new code",
                "Inserting malicious code into application",
                "Software patching",
                "Debugging"
            ],
            correct: 1
        },
        {
            id: 5,
            question: "What is SQL injection?",
            options: [
                "Database backup",
                "Inserting SQL commands into input",
                "Database optimization",
                "Query execution"
            ],
            correct: 1
        },
        {
            id: 6,
            question: "What is cross-site scripting (XSS)?",
            options: [
                "Running scripts on website",
                "Injecting malicious scripts into web app",
                "Website optimization",
                "Browser extension"
            ],
            correct: 1
        },
        {
            id: 7,
            question: "What is CSRF attack?",
            options: [
                "Cross-Site Request Forgery",
                "Cross-Server File Request",
                "Cryptographic Security Request",
                "Client-Server Request Framework"
            ],
            correct: 0
        },
        {
            id: 8,
            question: "What is clickjacking?",
            options: [
                "Clicking too fast",
                "Tricking user to click invisible element",
                "Broken links",
                "Website error"
            ],
            correct: 1
        },
        {
            id: 9,
            question: "What is heap overflow?",
            options: [
                "Too much memory",
                "Writing beyond heap memory bounds",
                "Storage overflow",
                "CPU overflow"
            ],
            correct: 1
        },
        {
            id: 10,
            question: "What is stack overflow?",
            options: [
                "Too many items",
                "Exceeding stack memory limits",
                "Storage problem",
                "Network issue"
            ],
            correct: 1
        },
        {
            id: 11,
            question: "What is return-oriented programming?",
            options: [
                "Navigation programming",
                "Attack using existing code (gadgets)",
                "Object programming",
                "Functional programming"
            ],
            correct: 1
        },
        {
            id: 12,
            question: "What is ASLR?",
            options: [
                "Advanced System Language",
                "Address Space Layout Randomization",
                "Automated Software Loading",
                "Application Security Layer"
            ],
            correct: 1
        },
        {
            id: 13,
            question: "What is DEP/NX bit?",
            options: [
                "Data Encryption Protocol",
                "Data Execution Prevention",
                "Digital Extra Protocol",
                "Device Extension Port"
            ],
            correct: 1
        },
        {
            id: 14,
            question: "What is canary value in security?",
            options: [
                "Bird protection",
                "Guard value detecting buffer overflow",
                "Security token",
                "Encryption key"
            ],
            correct: 1
        },
        {
            id: 15,
            question: "What is sandboxing?",
            options: [
                "Sand box playing",
                "Isolating program in restricted environment",
                "Security wall",
                "Firewall rule"
            ],
            correct: 1
        },
        {
            id: 16,
            question: "What is virtualization security?",
            options: [
                "Virtual reality",
                "Securing virtual machines",
                "Cloud security",
                "Network isolation"
            ],
            correct: 1
        },
        {
            id: 17,
            question: "What is hypervisor?",
            options: [
                "Extreme supervisor",
                "Software managing virtual machines",
                "Virtual network",
                "Cloud server"
            ],
            correct: 1
        },
        {
            id: 18,
            question: "What is container security?",
            options: [
                "Physical container",
                "Securing containerized applications",
                "Docker security",
                "Software packaging"
            ],
            correct: 1
        },
        {
            id: 19,
            question: "What is UAC?",
            options: [
                "User Account Control",
                "Universal Access Code",
                "User Application Control",
                "Unified Authentication Code"
            ],
            correct: 0
        },
        {
            id: 20,
            question: "What is mandatory access control?",
            options: [
                "User-based access",
                "System enforcing access rules",
                "Password access",
                "Group access"
            ],
            correct: 1
        },
        {
            id: 21,
            question: "What is SELinux?",
            options: [
                "Simple Enhanced Linux",
                "Security-Enhanced Linux",
                "System Extension Linux",
                "Secure Enterprise Linux"
            ],
            correct: 1
        },
        {
            id: 22,
            question: "What is AppArmor?",
            options: [
                "Application armor",
                "Mandatory access control for Linux",
                "Application security",
                "Software protection"
            ],
            correct: 1
        },
        {
            id: 23,
            question: "What is file integrity monitoring?",
            options: [
                "File backup",
                "Detecting unauthorized file changes",
                "File encryption",
                "File compression"
            ],
            correct: 1
        },
        {
            id: 24,
            question: "What is rootkit?",
            options: [
                "Root password kit",
                "Malware with root access",
                "Administration tool",
                "System utility"
            ],
            correct: 1
        },
        {
            id: 25,
            question: "What is a keylogger?",
            options: [
                "Log key files",
                "Software recording keystrokes",
                "Key management tool",
                "Logging utility"
            ],
            correct: 1
        },
        {
            id: 26,
            question: "What is anti-tampering?",
            options: [
                "Anti-theft",
                "Detecting program modifications",
                "Program protection",
                "Code obfuscation"
            ],
            correct: 1
        },
        {
            id: 27,
            question: "What is code obfuscation?",
            options: [
                "Cleaning code",
                "Making code hard to understand",
                "Code encryption",
                "Compression"
            ],
            correct: 1
        },
        {
            id: 28,
            question: "What is DLL injection?",
            options: [
                "Injecting library files",
                "Inserting malicious DLL into process",
                "Library update",
                "System upgrade"
            ],
            correct: 1
        },
        {
            id: 29,
            question: "What is reflective injection?",
            options: [
                "Mirror technique",
                "Loading executable into memory without file",
                "Reflection technique",
                "Memory mirror"
            ],
            correct: 1
        },
        {
            id: 30,
            question: "What is process hollowing?",
            options: [
                "Empty process",
                "Replacing legitimate process with malware",
                "Process termination",
                "Process spawning"
            ],
            correct: 1
        }
    ]
};

// =============== EMAIL SPOOFING EXAM ===============

const emailSpoofingQuestions = [
    {
        id: 1,
        scenario: "Ibrahim received an email from 'support@paypa1.com' asking to update his payment information. The email mentions 'Urgent Security Alert' and includes a link.",
        options: [
            "This email is legitimate, PayPal needs to verify security",
            "This is spoofing - 'paypa1' mimics PayPal with number 1",
            "Update information immediately",
            "The email domain looks identical to PayPal"
        ],
        correct: 1,
        spoofing: true
    },
    {
        id: 2,
        scenario: "Sarah received an email from 'sender@company.com' asking for quarterly report. The email uses correct company template and logo.",
        options: [
            "This is legitimate communication from company",
            "This must be spoofing",
            "Always ask for sensitive data",
            "Never trust company emails"
        ],
        correct: 0,
        spoofing: false
    },
    {
        id: 3,
        scenario: "Ahmed received email from 'ceo@companv.com' (note: 'companv' not 'company') asking for urgent fund transfer.",
        options: [
            "Looks like CEO, send money immediately",
            "This is spoofing - domain has typo",
            "CEO wouldn't use typos",
            "Proceed with transfer"
        ],
        correct: 1,
        spoofing: true
    },
    {
        id: 4,
        scenario: "Email from 'noreply@gmail.secure-account-update.com' asking to verify Gmail account.",
        options: [
            "This is from Google/Gmail",
            "This is spoofing - Gmail real domain is gmail.com",
            "Google uses subdomains like this",
            "Update account immediately"
        ],
        correct: 1,
        spoofing: true
    },
    {
        id: 5,
        scenario: "Employee received email from 'HR.department@our-company.net' with employment contract.",
        options: [
            "Official company communication, company uses .net",
            "Company uses .com, this is spoofing",
            "Any domain is acceptable",
            "HR always uses different domains"
        ],
        correct: 1,
        spoofing: true
    },
    {
        id: 6,
        scenario: "Email from 'support@microsoft.com' offering Windows update.",
        options: [
            "This is real Microsoft support",
            "Check if you requested this update",
            "Microsoft uses official channels",
            "Verify through official website"
        ],
        correct: 0,
        spoofing: false
    },
    {
        id: 7,
        scenario: "Email from 'noreply@facebook-secure.com' asking to verify account within 24 hours.",
        options: [
            "Facebook official domain",
            "This is spoofing - Facebook domain is facebook.com",
            "Urgent action needed",
            "Update now to avoid account closure"
        ],
        correct: 1,
        spoofing: true
    },
    {
        id: 8,
        scenario: "Received email from actual company's registered domain with correct logo and formatting requesting data.",
        options: [
            "Always provide requested data",
            "Verify separately through official phone number",
            "Trust email completely",
            "Forward to colleagues"
        ],
        correct: 1,
        spoofing: false
    },
    {
        id: 9,
        scenario: "Email from '4mazon-account@amazonverify.net' asking to confirm purchase.",
        options: [
            "Amazon official email",
            "This is spoofing - Amazon domain is amazon.com",
            "Update payment immediately",
            "Click 'Confirm Purchase' link"
        ],
        correct: 1,
        spoofing: true
    },
    {
        id: 10,
        scenario: "Email using company's exact domain, official branding, but sender address uses public email like Gmail.",
        options: [
            "Company is using Gmail",
            "This is spoofing - domain display spoofing",
            "Official internal communication",
            "Normal business practice"
        ],
        correct: 1,
        spoofing: true
    },
    {
        id: 11,
        scenario: "Email from 'boss@company.com' asking for 'quick favor' to send urgent payment.",
        options: [
            "Send payment immediately",
            "Verify separately before sending money",
            "Boss emails are always legitimate",
            "Share password to help"
        ],
        correct: 1,
        spoofing: false
    },
    {
        id: 12,
        scenario: "Email from 'delivery@amazon-shipment.info' claiming package delivery attempt.",
        options: [
            "This is from Amazon",
            "This is spoofing - Amazon doesn't use .info domain",
            "Click link to reschedule",
            "Update delivery address"
        ],
        correct: 1,
        spoofing: true
    },
    {
        id: 13,
        scenario: "Email with slight grammar errors from 'ceo@companyofficial-update.biz'",
        options: [
            "CEO is just bad at writing",
            "This is spoofing - grammar and suspicious domain",
            "Update as requested",
            "Forward to team"
        ],
        correct: 1,
        spoofing: true
    },
    {
        id: 14,
        scenario: "Email from known vendor about scheduled maintenance using correct domain.",
        options: [
            "This is spoofing",
            "This is legitimate vendor communication",
            "Don't trust any emails",
            "All vendor emails are fake"
        ],
        correct: 1,
        spoofing: false
    },
    {
        id: 15,
        scenario: "Email from 'verify@appIe-id-security.com' asking to update Apple ID.",
        options: [
            "Apple official security email",
            "This is spoofing - Apple domain is apple.com",
            "Update immediately to secure account",
            "Share password for verification"
        ],
        correct: 1,
        spoofing: true
    },
    {
        id: 16,
        scenario: "Email from internal HR with HR's registered domain about new benefits.",
        options: [
            "Always trust internal emails",
            "Check sender's actual email address through directory",
            "Assume it's legitimate",
            "Forward to all staff"
        ],
        correct: 1,
        spoofing: false
    },
    {
        id: 17,
        scenario: "Email from 'payment-notification@paypal-account-update.co' about account activity.",
        options: [
            "PayPal official notification",
            "This is spoofing - PayPal domain is paypal.com",
            "Log in immediately to check",
            "Verify payment method"
        ],
        correct: 1,
        spoofing: true
    },
    {
        id: 18,
        scenario: "Email asking for 'urgent verification' with pressure tactics and vague greeting.",
        options: [
            "Legitimate urgent request",
            "Likely spoofing - common phishing tactic",
            "Provide information immediately",
            "Forward to others"
        ],
        correct: 1,
        spoofing: true
    },
    {
        id: 19,
        scenario: "Email from company IT using correct domain about mandatory security update.",
        options: [
            "Always trust IT emails",
            "Verify through separate IT contact",
            "Update immediately",
            "Share credentials with IT"
        ],
        correct: 1,
        spoofing: false
    },
    {
        id: 20,
        scenario: "Email with 'RE: Your Order' from 'order-confirm@ebay-orders.net'",
        options: [
            "This is from eBay",
            "This is spoofing - eBay domain is ebay.com",
            "Click to view order details",
            "Confirm payment method"
        ],
        correct: 1,
        spoofing: true
    },
    {
        id: 21,
        scenario: "Email from 'linkedin.official@linkedln-verify.com' about profile update.",
        options: [
            "LinkedIn official email",
            "This is spoofing - LinkedIn domain is linkedin.com",
            "Update profile immediately",
            "Click verification link"
        ],
        correct: 1,
        spoofing: true
    },
    {
        id: 22,
        scenario: "Email from registered company domain about project update with normal requests.",
        options: [
            "This is spoofing",
            "This is legitimate company communication",
            "All emails are fake",
            "Don't respond to company emails"
        ],
        correct: 1,
        spoofing: false
    },
    {
        id: 23,
        scenario: "Email from 'support@bank-security-verify.org' asking to confirm banking details.",
        options: [
            "Bank official support",
            "This is spoofing - bank doesn't request details this way",
            "Provide banking details",
            "Confirm credentials"
        ],
        correct: 1,
        spoofing: true
    },
    {
        id: 24,
        scenario: "Email with excellent formatting, correct spelling, from known partner company.",
        options: [
            "Could still be spoofing if content seems odd",
            "Perfect formatting means it's legitimate",
            "Never verify legitimate emails",
            "All well-formatted emails are real"
        ],
        correct: 0,
        spoofing: false
    },
    {
        id: 25,
        scenario: "Email from 'Admin@companyadmin-update.biz' asking for 'database access'",
        options: [
            "Provide database access immediately",
            "This is spoofing - suspicious domain and request",
            "Admin needs direct access",
            "Share credentials"
        ],
        correct: 1,
        spoofing: true
    },
    {
        id: 26,
        scenario: "Email from office IT with correct domain about installing security software.",
        options: [
            "Always install suggested software",
            "Verify request through separate channel",
            "Trust all IT emails",
            "Install immediately"
        ],
        correct: 1,
        spoofing: false
    },
    {
        id: 27,
        scenario: "Email from 'noreply@instaqram-verify.com' asking to verify Instagram account.",
        options: [
            "Instagram official email",
            "This is spoofing - Instagram domain is instagram.com",
            "Verify account now",
            "Update password"
        ],
        correct: 1,
        spoofing: true
    },
    {
        id: 28,
        scenario: "Email mentioning 'Please confirm' with generic greeting and external links.",
        options: [
            "Likely spoofing - vague greeting and pressure",
            "Legitimate company communication",
            "Confirm immediately",
            "Always trust generic emails"
        ],
        correct: 0,
        spoofing: true
    },
    {
        id: 29,
        scenario: "Email from 'finance@correct-company-domain.com' about expense report.",
        options: [
            "Never trust finance emails",
            "Verify sender through company directory",
            "Submit expense immediately",
            "All emails are dangerous"
        ],
        correct: 1,
        spoofing: false
    },
    {
        id: 30,
        scenario: "Email from 'support@paypa-account.org' asking urgent account confirmation.",
        options: [
            "PayPal official support",
            "This is spoofing - PayPal domain is paypal.com",
            "Confirm account now",
            "Update payment info"
        ],
        correct: 1,
        spoofing: true
    },
    {
        id: 31,
        scenario: "Email using company's real domain but asking for personal identification info.",
        options: [
            "This must be spoofing",
            "Company doesn't ask for ID via email",
            "Provide identification",
            "Forward to colleagues"
        ],
        correct: 1,
        spoofing: true
    },
    {
        id: 32,
        scenario: "Email from official bank's real domain about new product.",
        options: [
            "Never trust bank emails",
            "Likely legitimate but verify details",
            "All bank emails are fake",
            "Bank never sends emails"
        ],
        correct: 1,
        spoofing: false
    },
    {
        id: 33,
        scenario: "Email from 'HR-admin@human-resorces-update.net' about employee records.",
        options: [
            "HR official communication",
            "This is spoofing - HR domain is company domain",
            "Provide employee records",
            "Share personal data"
        ],
        correct: 1,
        spoofing: true
    },
    {
        id: 34,
        scenario: "Email with urgent language 'IMMEDIATE ACTION REQUIRED' from unknown sender.",
        options: [
            "Respond urgently",
            "This is likely spoofing/phishing attempt",
            "Take immediate action",
            "Forward to all staff"
        ],
        correct: 1,
        spoofing: true
    },
    {
        id: 35,
        scenario: "Email from known client using their registered domain about contract details.",
        options: [
            "This is spoofing",
            "This is likely legitimate",
            "Never respond to client emails",
            "All client emails are fake"
        ],
        correct: 1,
        spoofing: false
    },
    {
        id: 36,
        scenario: "Email from 'verification@microsoft-secure-update.biz' about Windows security.",
        options: [
            "Microsoft official update",
            "This is spoofing - Microsoft domain is microsoft.com",
            "Update immediately",
            "Download file from link"
        ],
        correct: 1,
        spoofing: true
    },
    {
        id: 37,
        scenario: "Email with links shortening (bit.ly, tinyurl) from company email address.",
        options: [
            "Companies use link shorteners",
            "Spoofing - shortened links hide real destination",
            "Click shortened links",
            "Share shortened links"
        ],
        correct: 1,
        spoofing: true
    },
    {
        id: 38,
        scenario: "Email from regular vendor with company's registered domain about delivery.",
        options: [
            "This is spoofing",
            "This is likely legitimate",
            "Never trust vendor emails",
            "All vendor emails are fake"
        ],
        correct: 1,
        spoofing: false
    },
    {
        id: 39,
        scenario: "Email from 'notification@twitter-verify-security.org' about account suspension.",
        options: [
            "Twitter official notification",
            "This is spoofing - Twitter domain is twitter.com",
            "Verify account now",
            "Click provided link"
        ],
        correct: 1,
        spoofing: true
    },
    {
        id: 40,
        scenario: "Email asking to 'confirm' or 'verify' with urgency from suspicious domain.",
        options: [
            "Legitimate request",
            "This is spoofing/phishing tactic",
            "Provide confirmation",
            "Share verification data"
        ],
        correct: 1,
        spoofing: true
    },
    {
        id: 41,
        scenario: "Email from 'admin@company.com' with new security policy attachment.",
        options: [
            "Always trust admin emails",
            "Verify through separate channel before opening",
            "Open attachment immediately",
            "Share policy with all"
        ],
        correct: 1,
        spoofing: false
    },
    {
        id: 42,
        scenario: "Email claiming 'Your account will be closed' from unknown domain.",
        options: [
            "Respond with account details",
            "This is spoofing - common threat tactic",
            "Act on threat immediately",
            "Ignore but don't report"
        ],
        correct: 1,
        spoofing: true
    },
    {
        id: 43,
        scenario: "Email from 'webmaster@our-domain.com' about website maintenance.",
        options: [
            "This is spoofing",
            "This is likely legitimate",
            "Never trust maintenance emails",
            "All maintenance emails are fake"
        ],
        correct: 1,
        spoofing: false
    },
    {
        id: 44,
        scenario: "Email from 'service@amazon-account-alert.info' about security issue.",
        options: [
            "Amazon official alert",
            "This is spoofing - Amazon doesn't use .info",
            "Click alert link",
            "Update account immediately"
        ],
        correct: 1,
        spoofing: true
    },
    {
        id: 45,
        scenario: "Email asking for password or PIN with 'security purposes' excuse.",
        options: [
            "Provide password/PIN",
            "This is spoofing - companies never ask passwords",
            "Security verification needed",
            "Share credentials"
        ],
        correct: 1,
        spoofing: true
    },
    {
        id: 46,
        scenario: "Email from established company's real domain about quarterly business update.",
        options: [
            "This is spoofing",
            "This is likely legitimate",
            "Never trust business emails",
            "All emails are suspicious"
        ],
        correct: 1,
        spoofing: false
    },
    {
        id: 47,
        scenario: "Email from 'noreply@linkedin-securityupdate.biz' asking to verify employment.",
        options: [
            "LinkedIn official request",
            "This is spoofing - LinkedIn domain is linkedin.com",
            "Verify employment now",
            "Click verification link"
        ],
        correct: 1,
        spoofing: true
    },
    {
        id: 48,
        scenario: "Email with spelling/grammar errors asking for urgent financial action.",
        options: [
            "Legitimate business communication",
            "This is spoofing/phishing attempt",
            "Proceed with payment",
            "Share financial details"
        ],
        correct: 1,
        spoofing: true
    },
    {
        id: 49,
        scenario: "Email from IT department using company domain about password change policy.",
        options: [
            "Never trust IT",
            "Verify but follow legitimate password policies",
            "All IT emails are fake",
            "Ignore password policies"
        ],
        correct: 1,
        spoofing: false
    },
    {
        id: 50,
        scenario: "Email claiming 'Click here or account deleted' from suspicious sender.",
        options: [
            "Click immediately",
            "This is spoofing - threat and urgency tactic",
            "Delete account preemptively",
            "Share with others to warn them"
        ],
        correct: 1,
        spoofing: true
    }
];

// =============== TRAINING SCENARIOS (50 Cases) ===============

const trainingScenarios = [
    {
        scenario: "Email from 'support@paypall.com' asking to verify account",
        analysis: "This is SPOOFING. Notice the domain is 'paypall.com' with double 'l', mimicking PayPal.com",
        redFlags: "Domain typo (paypall vs paypal), urgency language, verification request",
        spoofing: true
    },
    {
        scenario: "Email from 'noreply@amazon.com' about order confirmation",
        analysis: "This is LEGITIMATE if it matches your order. Amazon uses noreply@amazon.com",
        redFlags: "Verify you placed this order. Check order details match your account",
        spoofing: false
    },
    {
        scenario: "Email from 'admin@companv.co.uk' requesting database access",
        analysis: "This is SPOOFING. Domain changed from .com to .co.uk and has typo (companv)",
        redFlags: "Unusual domain extension, suspicious request for database access, domain typo",
        spoofing: true
    },
    {
        scenario: "Email from your bank's registered domain about new feature",
        analysis: "This is LEGITIMATE if from your actual bank's domain",
        redFlags: "Verify sender domain matches your bank's official domain",
        spoofing: false
    },
    {
        scenario: "Email from 'ceo@company.com' asking for urgent wire transfer",
        analysis: "Check separately through company directory. This COULD BE spoofing via display name spoofing",
        redFlags: "Urgency, financial request, unusual domain display",
        spoofing: true
    },
    {
        scenario: "Email from 'hr@correct-company.info' about new benefits",
        analysis: "This is SPOOFING. Company domain is .com not .info",
        redFlags: "Wrong domain extension (.info instead of .com), HR requests via email rare",
        spoofing: true
    },
    {
        scenario: "Notification from 'noreply@github.com' about pull request",
        analysis: "This is LEGITIMATE if you have GitHub account activity",
        redFlags: "Verify you're involved in this project/PR",
        spoofing: false
    },
    {
        scenario: "Email from 'payment-notification@paypal-secure.net' about activity",
        analysis: "This is SPOOFING. PayPal's domain is paypal.com not paypal-secure.net",
        redFlags: "Fake security domain, incorrect TLD, PayPal never uses similar domains",
        spoofing: true
    },
    {
        scenario: "Email from 'support@microsoft-update.biz' about Windows security",
        analysis: "This is SPOOFING. Microsoft domain is microsoft.com not microsoft-update.biz",
        redFlags: "Non-standard domain, suspicious .biz TLD, Microsoft doesn't send these",
        spoofing: true
    },
    {
        scenario: "Email from vendor's registered domain about shipment",
        analysis: "This is LEGITIMATE if domain matches verified vendor",
        redFlags: "Verify vendor domain through official website",
        spoofing: false
    },
    {
        scenario: "Email from 'verify@linkedin-security.org' requesting profile update",
        analysis: "This is SPOOFING. LinkedIn's domain is linkedin.com not linkedin-security.org",
        redFlags: "Wrong domain, urgency pressure, LinkedIn uses official domain only",
        spoofing: true
    },
    {
        scenario: "Email from 'notifications@twitter-verify.com' about account suspension",
        analysis: "This is SPOOFING. Twitter's domain is twitter.com, not twitter-verify.com",
        redFlags: "Fake security domain, threat language, wrong domain",
        spoofing: true
    },
    {
        scenario: "Email from company IT using correct domain about security update",
        analysis: "This is LEGITIMATE if sender domain matches company",
        redFlags: "Still verify through separate IT contact before installing",
        spoofing: false
    },
    {
        scenario: "Email from 'admin@faceb00k-account-verify.com' asking for password",
        analysis: "This is SPOOFING. Facebook domain is facebook.com, not faceb00k (with zeros)",
        redFlags: "Character substitution (0 for O), password request, fake domain",
        spoofing: true
    },
    {
        scenario: "Email with poor grammar from 'service@bank-security-confirm.info'",
        analysis: "This is SPOOFING. Multiple red flags: grammar, wrong domain, suspicious TLD",
        redFlags: "Spelling/grammar errors, .info TLD, generic greeting, security urgency",
        spoofing: true
    },
    {
        scenario: "Email from known client using their official domain",
        analysis: "This is LEGITIMATE if domain matches your records",
        redFlags: "Verify domain matches client's official website",
        spoofing: false
    },
    {
        scenario: "Email from 'noreply@ebay-orders.net' confirming purchase",
        analysis: "This is SPOOFING. eBay uses ebay.com, not ebay-orders.net",
        redFlags: "Wrong domain extension, eBay doesn't add order verification to domain",
        spoofing: true
    },
    {
        scenario: "Email from company's actual email with update on projects",
        analysis: "This is LEGITIMATE if domain is correct",
        redFlags: "Verify sender through company directory",
        spoofing: false
    },
    {
        scenario: "Email from 'support@instagram-confirm.org' about account verification",
        analysis: "This is SPOOFING. Instagram uses instagram.com, not instagram-confirm.org",
        redFlags: "Wrong domain, verification request, Instagram never asks this way",
        spoofing: true
    },
    {
        scenario: "Email with 'URGENT: ACT NOW' from unknown sender with bit.ly link",
        analysis: "This is SPOOFING. Classic phishing: urgency, shortened URL, unknown sender",
        redFlags: "ALL RED FLAGS: urgency, shortened URL, generic greeting, suspicious sender",
        spoofing: true
    },
    {
        scenario: "Email from actual company about quarterly earnings report",
        analysis: "This is LEGITIMATE if from company domain",
        redFlags: "Verify you recognize the sender within company",
        spoofing: false
    },
    {
        scenario: "Email from 'verification@apple-security-update.biz' for Apple ID",
        analysis: "This is SPOOFING. Apple uses apple.com, not apple-security-update.biz",
        redFlags: "Wrong domain, .biz TLD, Apple ID verification never sent this way",
        spoofing: true
    },
    {
        scenario: "Email from 'noreply@google-verify.net' about account activity",
        analysis: "This is SPOOFING. Google uses google.com/accounts.google.com",
        redFlags: "Wrong domain, .net TLD, Google's official domain is google.com",
        spoofing: true
    },
    {
        scenario: "Email from HR using company domain about benefits",
        analysis: "This is LEGITIMATE if sender matches HR department",
        redFlags: "Verify through separate HR contact for sensitive information",
        spoofing: false
    },
    {
        scenario: "Email from 'update@dropbox-account-secure.info' asking to update payment",
        analysis: "This is SPOOFING. Dropbox domain is dropbox.com, not dropbox-account-secure.info",
        redFlags: "Fake security domain, payment update request, wrong domain",
        spoofing: true
    },
    {
        scenario: "Email from real supplier about delivery schedule",
        analysis: "This is LEGITIMATE if domain matches supplier",
        redFlags: "Check domain against supplier's official contact",
        spoofing: false
    },
    {
        scenario: "Email from 'noreply@account-verify-spotify.com' about account",
        analysis: "This is SPOOFING. Spotify uses spotify.com, not account-verify-spotify.com",
        redFlags: "Added verification to domain name, Spotify doesn't send these",
        spoofing: true
    },
    {
        scenario: "Email from 'help@netflix-account-verify.org' asking password",
        analysis: "This is SPOOFING. Netflix uses netflix.com, asking for password is red flag",
        redFlags: "Password request, wrong domain, .org TLD, fake security domain",
        spoofing: true
    },
    {
        scenario: "Email from your insurance company about policy",
        analysis: "This is LEGITIMATE if domain matches official insurance company",
        redFlags: "Verify domain matches your insurance provider's official website",
        spoofing: false
    },
    {
        scenario: "Email from 'admin@companyadmin-security.net' claiming account lockout",
        analysis: "This is SPOOFING. Generic company, wrong domain, threat language",
        redFlags: "Account lockout threat, suspicious domain, generic greeting",
        spoofing: true
    },
    {
        scenario: "Email from finance department about expense reports",
        analysis: "This is LEGITIMATE if from company domain",
        redFlags: "Still verify through separate channel for large transactions",
        spoofing: false
    },
    {
        scenario: "Email from 'support@slack-workspace-verify.info' about workspace",
        analysis: "This is SPOOFING. Slack uses slack.com, not slack-workspace-verify.info",
        redFlags: "Wrong domain, .info TLD, Slack workspace threats aren't sent this way",
        spoofing: true
    },
    {
        scenario: "Email from 'noreply@microsoft-365-verify.net' about subscription",
        analysis: "This is SPOOFING. Microsoft uses microsoft.com, not microsoft-365-verify.net",
        redFlags: "Subscription threat, wrong domain, added verification to domain",
        spoofing: true
    },
    {
        scenario: "Email from your university about registration",
        analysis: "This is LEGITIMATE if from university's official domain",
        redFlags: "Verify against your university's official email address",
        spoofing: false
    },
    {
        scenario: "Email from 'admin@bank-secure-login.biz' about account verification",
        analysis: "This is SPOOFING. Banks never use .biz, add 'secure-login' to domain",
        redFlags: "Bank impersonation, .biz TLD, fake security domain, account verification",
        spoofing: true
    },
    {
        scenario: "Email from 'payment@paypal-account.org' requesting payment confirmation",
        analysis: "This is SPOOFING. PayPal uses paypal.com, not paypal-account.org",
        redFlags: "Wrong domain, .org TLD, payment confirmation from fake domain",
        spoofing: true
    },
    {
        scenario: "Confirmation email from subscription service",
        analysis: "This is LEGITIMATE if you subscribed and domain matches",
        redFlags: "Verify you initiated this subscription",
        spoofing: false
    },
    {
        scenario: "Email from 'noreply@amazon-order-verify.net' about package",
        analysis: "This is SPOOFING. Amazon uses amazon.com, not amazon-order-verify.net",
        redFlags: "Wrong domain, added order verification to domain, .net TLD",
        spoofing: true
    },
    {
        scenario: "Email from company CEO using internal email about initiative",
        analysis: "This is LEGITIMATE if CEO's email is verified internally",
        redFlags: "For large requests, verify separately through company directory",
        spoofing: false
    },
    {
        scenario: "Email from 'support@adobe-account-security.info' about creative cloud",
        analysis: "This is SPOOFING. Adobe uses adobe.com, not adobe-account-security.info",
        redFlags: "Wrong domain, .info TLD, Creative Cloud threat, security urgency",
        spoofing: true
    },
    {
        scenario: "Email from 'verification@uber-account-verify.org' about account",
        analysis: "This is SPOOFING. Uber uses uber.com, not uber-account-verify.org",
        redFlags: "Wrong domain, .org TLD, account verification threat",
        spoofing: true
    },
    {
        scenario: "Shipping notification from logistics company",
        analysis: "This is LEGITIMATE if from company's official domain",
        redFlags: "Verify tracking number through company's official website",
        spoofing: false
    },
    {
        scenario: "Email from 'help@zoom-meeting-verify.biz' about account",
        analysis: "This is SPOOFING. Zoom uses zoom.us/zoom.com, not zoom-meeting-verify.biz",
        redFlags: "Wrong domain, .biz TLD, meeting verification threat",
        spoofing: true
    },
    {
        scenario: "Email from 'noreply@okta-account.net' about authentication",
        analysis: "This is SPOOFING. Okta uses okta.com, not okta-account.net",
        redFlags: "Wrong domain, .net TLD, authentication threat",
        spoofing: true
    },
    {
        scenario: "Newsletter from publisher you subscribed to",
        analysis: "This is LEGITIMATE if from publisher's official domain",
        redFlags: "You should have subscribed to this newsletter",
        spoofing: false
    },
    {
        scenario: "Email from 'security@salesforce-account-verify.info'",
        analysis: "This is SPOOFING. Salesforce uses salesforce.com, not salesforce-account-verify.info",
        redFlags: "Wrong domain, .info TLD, security threat, account verification",
        spoofing: true
    },
    {
        scenario: "Email from 'noreply@jira-workspace.org' about ticket update",
        analysis: "This is SPOOFING. Jira uses atlassian.com, not jira-workspace.org",
        redFlags: "Wrong domain, .org TLD, workspace updates are in-app",
        spoofing: true
    },
    {
        scenario: "Meeting invitation from colleague in company",
        analysis: "This is LEGITIMATE if from company email",
        redFlags: "Verify meeting in calendar system",
        spoofing: false
    }
];

// Training Content
const trainingModules = {
    cia: {
        title: "CIA Triad - The Foundation of Cybersecurity",
        content: `
            <h4>Understanding CIA Triad</h4>
            <p>The CIA Triad is the foundational model for information security. It stands for:</p>
            <ul style="margin-left: 20px; list-style: disc;">
                <li><strong>Confidentiality:</strong> Ensuring information is accessible only to authorized personnel</li>
                <li><strong>Integrity:</strong> Ensuring information accuracy and completeness</li>
                <li><strong>Availability:</strong> Ensuring systems and data are accessible when needed</li>
            </ul>
            <p><br><strong>Confidentiality Example:</strong></p>
            <div class="scenario-box">
                An employee's medical records should only be accessible to authorized HR personnel and the employee themselves. 
                Using encryption and access controls ensures confidentiality is maintained.
            </div>
            <p><strong>Integrity Example:</strong></p>
            <div class="scenario-box">
                Financial transaction records must not be altered by anyone except authorized personnel. 
                Digital signatures and checksums verify that records haven't been modified.
            </div>
            <p><strong>Availability Example:</strong></p>
            <div class="scenario-box">
                Company servers must be online 24/7 for business operations. 
                Backups and redundant systems ensure availability even during failures.
            </div>
        `
    },
    networks: {
        title: "Network Security & Protocols",
        content: `
            <h4>Network Security Fundamentals</h4>
            <p>Understanding how networks work is crucial for security:</p>
            <ul style="margin-left: 20px; list-style: disc;">
                <li><strong>TCP/IP:</strong> The fundamental protocol suite for internet communication</li>
                <li><strong>Firewalls:</strong> Control network traffic based on rules</li>
                <li><strong>IDS/IPS:</strong> Detect and prevent intrusions</li>
                <li><strong>VPN:</strong> Secure remote access and data protection</li>
            </ul>
            <p><br><strong>Common Network Attacks:</strong></p>
            <div class="scenario-box">
                <strong>Man-in-the-Middle Attack:</strong> Attacker intercepts communication between two parties.<br>
                <strong>Prevention:</strong> Use HTTPS, SSL/TLS, and verify certificates.
            </div>
            <div class="scenario-box">
                <strong>DDoS Attack:</strong> Overloading a server with traffic to make it unavailable.<br>
                <strong>Prevention:</strong> Rate limiting, traffic filtering, and redundancy.
            </div>
            <p><strong>DNS Security:</strong></p>
            <div class="scenario-box">
                DNS is critical but vulnerable. DNSSEC adds cryptographic authentication to DNS responses, 
                preventing DNS spoofing attacks.
            </div>
        `
    },
    os: {
        title: "Operating Systems Security",
        content: `
            <h4>Securing Operating Systems</h4>
            <p>OS security is the foundation of all system security:</p>
            <ul style="margin-left: 20px; list-style: disc;">
                <li><strong>User Accounts & Privileges:</strong> Principle of least privilege</li>
                <li><strong>Access Control:</strong> File and resource permissions</li>
                <li><strong>Security Policies:</strong> SELinux, AppArmor, UAC</li>
                <li><strong>Patch Management:</strong> Regular updates to fix vulnerabilities</li>
            </ul>
            <p><br><strong>Common OS Threats:</strong></p>
            <div class="scenario-box">
                <strong>Privilege Escalation:</strong> Attacker gains higher-level access rights.<br>
                <strong>Prevention:</strong> Keep OS updated, restrict user privileges, monitor access.
            </div>
            <div class="scenario-box">
                <strong>Rootkit:</strong> Malware with root/admin access hiding itself.<br>
                <strong>Prevention:</strong> Use rootkit detection tools, system hardening, regular monitoring.
            </div>
            <p><strong>Secure Configuration:</strong></p>
            <div class="scenario-box">
                Regularly update OS and software, disable unnecessary services, 
                configure firewall rules, enable logging and monitoring.
            </div>
        `
    },
    spoofing_theory: {
        title: "Email Spoofing - Theory & Prevention",
        content: `
            <h4>What is Email Spoofing?</h4>
            <p>Email spoofing is forging the sender's email address to make it appear legitimate.</p>
            
            <h4>Types of Email Spoofing:</h4>
            <ul style="margin-left: 20px; list-style: disc;">
                <li><strong>Domain Spoofing:</strong> Using fake domains (google.com vs g00gle.com)</li>
                <li><strong>Display Name Spoofing:</strong> Using legitimate domain but fake display name</li>
                <li><strong>Header Spoofing:</strong> Modifying email headers to fake sender</li>
            </ul>
            
            <h4>Common Tactics:</h4>
            <div class="scenario-box">
                <strong>Typo Domains:</strong> company.com → companv.com (v looks like y)<br>
                <strong>Similar Domains:</strong> google.com → g00gle.com (zero instead of O)<br>
                <strong>Subdomain Tricks:</strong> paypal-security.com looks like PayPal<br>
                <strong>Wrong TLDs:</strong> Using .info, .net, .biz instead of .com
            </div>
            
            <h4>Red Flags to Spot:</h4>
            <div class="scenario-box">
                ❌ Generic greeting ("Dear User" not your name)<br>
                ❌ Urgency language ("ACT NOW", "24 hours")<br>
                ❌ Suspicious links or shortened URLs<br>
                ❌ Requests for passwords or PINs<br>
                ❌ Grammar/spelling errors<br>
                ❌ Mismatched domain and sender name
            </div>
            
            <h4>How to Verify:</h4>
            <div class="scenario-box">
                ✅ Check sender's full email address<br>
                ✅ Hover over links to see real URL<br>
                ✅ Contact sender through known number<br>
                ✅ Check official website directly<br>
                ✅ Look for HTTPS and padlock icon<br>
                ✅ Use email security tools
            </div>
            
            <h4>Technical Protections:</h4>
            <div class="scenario-box">
                🔒 <strong>SPF (Sender Policy Framework):</strong> Prevents domain spoofing<br>
                🔒 <strong>DKIM (DomainKeys):</strong> Verifies email authenticity<br>
                🔒 <strong>DMARC:</strong> Combines SPF and DKIM for maximum protection
            </div>
        `
    },
    spoofing: {
        title: "Email Spoofing - Real-World Scenarios",
        content: `
            <h4>Understanding Email Spoofing Attacks</h4>
            <p>Email spoofing is one of the most common and dangerous attacks:</p>
            <ul style="margin-left: 20px; list-style: disc;">
                <li><strong>Email Spoofing:</strong> Forging sender's email address</li>
                <li><strong>Domain Spoofing:</strong> Using lookalike domains (google.com vs goog1e.com)</li>
                <li><strong>Display Name Spoofing:</strong> Legitimate domain but spoofed display name</li>
            </ul>
            <p><br><strong>Red Flags in Spoofed Emails:</strong></p>
            <div class="scenario-box">
                <strong>Domain Typos:</strong> companyname.com vs companvname.com<br>
                <strong>Unusual Domains:</strong> paypal@paypal-verify.org (should be @paypal.com)<br>
                <strong>Generic Greetings:</strong> "Dear User" instead of personal name<br>
                <strong>Urgency Language:</strong> "Act Now" or "24 Hour Deadline"<br>
                <strong>Suspicious Links:</strong> Shorteners (bit.ly), external domains
            </div>
            <p><strong>Real Scenario:</strong></p>
            <div class="scenario-box">
                Attacker sends email from "boss@companv.com" (companv instead of company) 
                asking for urgent wire transfer. Employee doesn't notice typo and sends $50,000.
            </div>
            <p><strong>Protection Methods:</strong></p>
            <div class="scenario-box">
                <strong>SPF (Sender Policy Framework):</strong> Prevents domain spoofing<br>
                <strong>DKIM (DomainKeys Identified Mail):</strong> Verifies email authenticity<br>
                <strong>DMARC (Domain-based Message Authentication):</strong> Combines SPF and DKIM<br>
                <strong>Employee Training:</strong> Most important defense
            </div>
        `
    }
};
