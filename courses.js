const COURSES = [
  {
    id: 1,
    title: "Workplace Health & Safety Essentials",
    description: "Learn the fundamentals of maintaining a safe and healthy work environment. Covers hazard identification, risk assessment, incident reporting, and your legal obligations under WHS legislation.",
    category: "Work Health & Safety",
    level: "Beginner",
    duration: "45 min",
    modules: [
      { name: "Introduction to WHS", duration: "10 min" },
      { name: "Hazard Identification", duration: "12 min" },
      { name: "Risk Assessment", duration: "12 min" },
      { name: "Incident Reporting", duration: "11 min" }
    ],
    color: "#e53935",
    icon: "🛡️"
  },
  {
    id: 2,
    title: "Anti-Money Laundering (AML) Awareness",
    description: "Understand AML regulations, recognise suspicious transactions, and learn your reporting obligations. Essential training for all staff in financial services and regulated industries.",
    category: "AML & Compliance",
    level: "Intermediate",
    duration: "60 min",
    modules: [
      { name: "What is Money Laundering?", duration: "10 min" },
      { name: "Regulatory Framework", duration: "15 min" },
      { name: "Customer Due Diligence", duration: "15 min" },
      { name: "Suspicious Matter Reporting", duration: "10 min" },
      { name: "Case Studies", duration: "10 min" }
    ],
    color: "#1e88e5",
    icon: "💰"
  },
  {
    id: 3,
    title: "Privacy & Data Protection Fundamentals",
    description: "Navigate the landscape of privacy legislation and learn how to handle personal information responsibly. Covers the Australian Privacy Principles and GDPR basics.",
    category: "Privacy & Data Protection",
    level: "Beginner",
    duration: "40 min",
    modules: [
      { name: "Privacy Principles Overview", duration: "12 min" },
      { name: "Collecting Personal Information", duration: "10 min" },
      { name: "Data Breach Response", duration: "10 min" },
      { name: "Cross-Border Transfers", duration: "8 min" }
    ],
    color: "#7b1fa2",
    icon: "🔒"
  },
  {
    id: 4,
    title: "Fraud Prevention & Detection",
    description: "Learn to identify common fraud schemes, understand internal controls, and develop the skills to detect and report fraudulent activities in your organisation.",
    category: "Risk Management",
    level: "Intermediate",
    duration: "50 min",
    modules: [
      { name: "Types of Fraud", duration: "10 min" },
      { name: "Red Flags & Warning Signs", duration: "12 min" },
      { name: "Internal Controls", duration: "15 min" },
      { name: "Reporting & Whistleblowing", duration: "13 min" }
    ],
    color: "#f57c00",
    icon: "🔍"
  },
  {
    id: 5,
    title: "Cyber Security for Employees",
    description: "Protect yourself and your organisation from cyber threats. Covers phishing, password security, social engineering, and safe browsing practices in a practical, easy-to-follow format.",
    category: "Professional Skills",
    level: "Beginner",
    duration: "35 min",
    modules: [
      { name: "The Threat Landscape", duration: "8 min" },
      { name: "Phishing & Social Engineering", duration: "10 min" },
      { name: "Password & Access Security", duration: "9 min" },
      { name: "Safe Browsing & Remote Work", duration: "8 min" }
    ],
    color: "#00897b",
    icon: "🖥️"
  },
  {
    id: 6,
    title: "Code of Conduct & Ethics",
    description: "Understand your organisation's expectations around ethical behaviour, conflicts of interest, gifts and entertainment, and professional conduct in the workplace.",
    category: "Professional Skills",
    level: "Beginner",
    duration: "30 min",
    modules: [
      { name: "Ethical Decision Making", duration: "10 min" },
      { name: "Conflicts of Interest", duration: "10 min" },
      { name: "Gifts, Entertainment & Hospitality", duration: "10 min" }
    ],
    color: "#5e35b1",
    icon: "⚖️"
  },
  {
    id: 7,
    title: "Diversity, Equity & Inclusion",
    description: "Build awareness of unconscious bias, learn strategies for creating inclusive workplaces, and understand the business benefits of diversity and equity in teams.",
    category: "Professional Skills",
    level: "Beginner",
    duration: "40 min",
    modules: [
      { name: "Understanding Bias", duration: "12 min" },
      { name: "Inclusive Communication", duration: "10 min" },
      { name: "Building Inclusive Teams", duration: "10 min" },
      { name: "Bystander Intervention", duration: "8 min" }
    ],
    color: "#c62828",
    icon: "🤝"
  },
  {
    id: 8,
    title: "Risk Management Fundamentals",
    description: "Master the core concepts of enterprise risk management. Learn to identify, assess, and mitigate risks using industry-standard frameworks and practical tools.",
    category: "Risk Management",
    level: "Intermediate",
    duration: "55 min",
    modules: [
      { name: "Risk Management Framework", duration: "12 min" },
      { name: "Risk Identification", duration: "10 min" },
      { name: "Risk Assessment & Analysis", duration: "15 min" },
      { name: "Risk Treatment & Monitoring", duration: "10 min" },
      { name: "Risk Reporting", duration: "8 min" }
    ],
    color: "#2e7d32",
    icon: "📊"
  },
  {
    id: 9,
    title: "Modern Slavery Awareness",
    description: "Understand the indicators of modern slavery, your reporting obligations under the Modern Slavery Act, and how to conduct supply chain due diligence to prevent exploitation.",
    category: "AML & Compliance",
    level: "Beginner",
    duration: "35 min",
    modules: [
      { name: "What is Modern Slavery?", duration: "10 min" },
      { name: "Recognising the Signs", duration: "10 min" },
      { name: "Supply Chain Due Diligence", duration: "8 min" },
      { name: "Reporting & Response", duration: "7 min" }
    ],
    color: "#ad1457",
    icon: "🌍"
  },
  {
    id: 10,
    title: "Financial Crime Compliance",
    description: "A comprehensive course covering sanctions screening, trade-based money laundering, terrorist financing, and proliferation financing. Designed for compliance professionals.",
    category: "AML & Compliance",
    level: "Advanced",
    duration: "90 min",
    modules: [
      { name: "Sanctions Overview", duration: "15 min" },
      { name: "Trade-Based Money Laundering", duration: "20 min" },
      { name: "Terrorist Financing", duration: "15 min" },
      { name: "Proliferation Financing", duration: "15 min" },
      { name: "Enhanced Due Diligence", duration: "15 min" },
      { name: "Assessment", duration: "10 min" }
    ],
    color: "#0d47a1",
    icon: "🏦"
  },
  {
    id: 11,
    title: "Manual Handling & Ergonomics",
    description: "Learn correct manual handling techniques and ergonomic principles to prevent musculoskeletal injuries. Includes practical exercises for office and warehouse environments.",
    category: "Work Health & Safety",
    level: "Beginner",
    duration: "30 min",
    modules: [
      { name: "Manual Handling Risks", duration: "8 min" },
      { name: "Safe Lifting Techniques", duration: "12 min" },
      { name: "Workstation Ergonomics", duration: "10 min" }
    ],
    color: "#ef6c00",
    icon: "🏋️"
  },
  {
    id: 12,
    title: "Leadership & People Management",
    description: "Develop essential leadership skills including effective delegation, giving feedback, managing performance, and coaching your team for success.",
    category: "Professional Skills",
    level: "Advanced",
    duration: "75 min",
    modules: [
      { name: "Leadership Styles", duration: "15 min" },
      { name: "Effective Delegation", duration: "12 min" },
      { name: "Giving & Receiving Feedback", duration: "15 min" },
      { name: "Performance Management", duration: "15 min" },
      { name: "Coaching for Growth", duration: "18 min" }
    ],
    color: "#4527a0",
    icon: "👔"
  }
];
