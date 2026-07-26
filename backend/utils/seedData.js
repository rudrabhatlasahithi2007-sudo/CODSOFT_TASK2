import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync('password123', salt);

export const initialUsers = [
  {
    _id: 'usr_1',
    name: 'Alex Morgan',
    email: 'alex.morgan@company.com',
    password: hashedPassword,
    role: 'Project Manager',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    bio: 'Senior PM specializing in agile software delivery and cross-functional team execution.',
    skills: ['Product Strategy', 'Agile', 'Scrum', 'Risk Management'],
    createdAt: new Date('2026-01-10T08:00:00Z').toISOString()
  },
  {
    _id: 'usr_2',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    password: hashedPassword,
    role: 'Lead Developer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    bio: 'Full-stack lead specializing in React, Node.js, microservices and cloud infrastructure.',
    skills: ['React', 'Node.js', 'System Architecture', 'GraphQL', 'MongoDB'],
    createdAt: new Date('2026-01-12T09:00:00Z').toISOString()
  },
  {
    _id: 'usr_3',
    name: 'David Miller',
    email: 'david.miller@company.com',
    password: hashedPassword,
    role: 'UI/UX Designer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Product Design',
    bio: 'Product designer focusing on accessible user systems, micro-interactions, and design systems.',
    skills: ['Figma', 'User Research', 'Design Systems', 'Prototyping'],
    createdAt: new Date('2026-01-15T10:00:00Z').toISOString()
  },
  {
    _id: 'usr_4',
    name: 'Emma Watson',
    email: 'emma.watson@company.com',
    password: hashedPassword,
    role: 'QA Engineer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    department: 'Quality Assurance',
    bio: 'Automated testing enthusiast with passion for high reliability software delivery.',
    skills: ['Cypress', 'Playwright', 'Jest', 'API Testing', 'Performance'],
    createdAt: new Date('2026-01-18T11:00:00Z').toISOString()
  },
  {
    _id: 'usr_5',
    name: 'Michael Scott',
    email: 'michael.scott@company.com',
    password: hashedPassword,
    role: 'Product Lead',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Product Management',
    bio: 'Managing enterprise feature roadmaps and customer growth channels.',
    skills: ['Roadmapping', 'Analytics', 'User Feedback', 'GTM Strategy'],
    createdAt: new Date('2026-01-20T12:00:00Z').toISOString()
  }
];

export const initialProjects = [
  {
    _id: 'proj_1',
    title: 'Cloud Dashboard Redesign v2.0',
    description: 'Overhaul customer analytics dashboard with real-time streaming charts, dark mode support, custom widget placement, and improved WCAG AA accessibility compliance.',
    category: 'Engineering',
    status: 'Active',
    priority: 'High',
    startDate: '2026-06-01',
    dueDate: '2026-08-30',
    budget: 45000,
    ownerId: 'usr_1',
    members: ['usr_1', 'usr_2', 'usr_3', 'usr_4'],
    tags: ['UI/UX', 'React', 'Analytics', 'Enterprise'],
    createdAt: new Date('2026-06-01T10:00:00Z').toISOString(),
    updatedAt: new Date('2026-07-20T14:30:00Z').toISOString()
  },
  {
    _id: 'proj_2',
    title: 'Mobile App Payment Integration',
    description: 'Integrate multi-currency Stripe, Apple Pay, and Google Pay checkout flows in mobile app with instant receipt generation and webhooks backend.',
    category: 'Finance & Payments',
    status: 'Active',
    priority: 'Urgent',
    startDate: '2026-06-15',
    dueDate: '2026-08-15',
    budget: 30000,
    ownerId: 'usr_2',
    members: ['usr_1', 'usr_2', 'usr_4'],
    tags: ['Mobile', 'Payments', 'Security', 'Stripe'],
    createdAt: new Date('2026-06-15T09:00:00Z').toISOString(),
    updatedAt: new Date('2026-07-22T11:00:00Z').toISOString()
  },
  {
    _id: 'proj_3',
    title: 'Design System Component Library',
    description: 'Standardize core Figma components and publish React UI kit with automated storybook documentation and tokenized theme variables.',
    category: 'Design',
    status: 'Planning',
    priority: 'Medium',
    startDate: '2026-07-01',
    dueDate: '2026-09-30',
    budget: 20000,
    ownerId: 'usr_3',
    members: ['usr_1', 'usr_3', 'usr_5'],
    tags: ['Design System', 'Figma', 'Tailwind', 'Components'],
    createdAt: new Date('2026-07-01T08:00:00Z').toISOString(),
    updatedAt: new Date('2026-07-18T16:00:00Z').toISOString()
  },
  {
    _id: 'proj_4',
    title: 'API Rate Limiting & Auth Audit',
    description: 'Implement distributed token bucket rate limiters, upgrade JWT refresh token rotation strategy, and conduct third-party security penetration testing.',
    category: 'Security',
    status: 'Completed',
    priority: 'High',
    startDate: '2026-05-01',
    dueDate: '2026-06-30',
    budget: 18000,
    ownerId: 'usr_2',
    members: ['usr_2', 'usr_4'],
    tags: ['Security', 'OAuth', 'JWT', 'Node.js'],
    createdAt: new Date('2026-05-01T08:00:00Z').toISOString(),
    updatedAt: new Date('2026-06-28T17:00:00Z').toISOString()
  }
];

export const initialTasks = [
  {
    _id: 'task_1',
    projectId: 'proj_1',
    title: 'Design high-fidelity dashboard wireframes in Figma',
    description: 'Create desktop and tablet responsive screens for widget layout grid, user metrics card, and real-time logs table.',
    assigneeId: 'usr_3',
    createdById: 'usr_1',
    status: 'Completed',
    priority: 'High',
    dueDate: '2026-07-10',
    estimatedHours: 24,
    loggedHours: 26,
    tags: ['Figma', 'UI Design'],
    subtasks: [
      { id: 'st_1', title: 'Define typography and color tokens', completed: true },
      { id: 'st_2', title: 'Create interactive widget prototype', completed: true },
      { id: 'st_3', title: 'Conduct design review with PM', completed: true }
    ],
    comments: [
      {
        id: 'c_1',
        userId: 'usr_1',
        userName: 'Alex Morgan',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        content: 'Wireframes look great! Approved for dev handoff.',
        createdAt: new Date('2026-07-09T14:20:00Z').toISOString()
      }
    ],
    attachments: [],
    createdAt: new Date('2026-06-02T10:00:00Z').toISOString(),
    updatedAt: new Date('2026-07-09T15:00:00Z').toISOString()
  },
  {
    _id: 'task_2',
    projectId: 'proj_1',
    title: 'Implement Recharts streaming metric charts component',
    description: 'Build reusable line and area charts for system bandwidth, active session counts, and server response times.',
    assigneeId: 'usr_2',
    createdById: 'usr_1',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2026-07-28',
    estimatedHours: 32,
    loggedHours: 18,
    tags: ['React', 'Charts', 'Frontend'],
    subtasks: [
      { id: 'st_4', title: 'Setup Recharts responsive containers', completed: true },
      { id: 'st_5', title: 'Add real-time socket data buffer', completed: false },
      { id: 'st_6', title: 'Add tooltip custom formatter', completed: true }
    ],
    comments: [
      {
        id: 'c_2',
        userId: 'usr_2',
        userName: 'Sarah Chen',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        content: 'Responsive wrapper is functional. Connecting backend WebSocket endpoint today.',
        createdAt: new Date('2026-07-22T09:30:00Z').toISOString()
      }
    ],
    attachments: [],
    createdAt: new Date('2026-06-05T11:00:00Z').toISOString(),
    updatedAt: new Date('2026-07-22T09:30:00Z').toISOString()
  },
  {
    _id: 'task_3',
    projectId: 'proj_1',
    title: 'E2E Cypress testing for widget customization drawer',
    description: 'Automate user scenario tests for adding, reordering, resizing, and removing widgets from dashboard canvas.',
    assigneeId: 'usr_4',
    createdById: 'usr_1',
    status: 'To Do',
    priority: 'Medium',
    dueDate: '2026-08-05',
    estimatedHours: 16,
    loggedHours: 0,
    tags: ['Testing', 'Cypress', 'QA'],
    subtasks: [
      { id: 'st_7', title: 'Write mock API fixture handlers', completed: false },
      { id: 'st_8', title: 'Test drag-and-drop widget sequence', completed: false }
    ],
    comments: [],
    attachments: [],
    createdAt: new Date('2026-06-10T14:00:00Z').toISOString(),
    updatedAt: new Date('2026-06-10T14:00:00Z').toISOString()
  },
  {
    _id: 'task_4',
    projectId: 'proj_2',
    title: 'Configure Stripe API webhooks and idempotency keys',
    description: 'Implement Express handler for `charge.succeeded` and `payment_intent.payment_failed` with database transaction safety.',
    assigneeId: 'usr_2',
    createdById: 'usr_2',
    status: 'In Progress',
    priority: 'Urgent',
    dueDate: '2026-07-30',
    estimatedHours: 20,
    loggedHours: 14,
    tags: ['Backend', 'Stripe', 'Node.js'],
    subtasks: [
      { id: 'st_9', title: 'Verify webhook payload signatures', completed: true },
      { id: 'st_10', title: 'Handle duplicate webhook events safely', completed: false }
    ],
    comments: [],
    attachments: [],
    createdAt: new Date('2026-06-16T08:30:00Z').toISOString(),
    updatedAt: new Date('2026-07-21T16:00:00Z').toISOString()
  },
  {
    _id: 'task_5',
    projectId: 'proj_2',
    title: 'Apple Pay & Google Pay mobile sheet UI',
    description: 'Build native payment request modal triggers for quick biometric purchases.',
    assigneeId: 'usr_1',
    createdById: 'usr_2',
    status: 'Review',
    priority: 'High',
    dueDate: '2026-07-26',
    estimatedHours: 18,
    loggedHours: 18,
    tags: ['Mobile UI', 'Payments'],
    subtasks: [
      { id: 'st_11', title: 'Format order line items summary', completed: true },
      { id: 'st_12', title: 'Test card decline error modal state', completed: true }
    ],
    comments: [
      {
        id: 'c_3',
        userId: 'usr_4',
        userName: 'Emma Watson',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        content: 'Reviewing on test devices now. Payment confirmation animation looks slick!',
        createdAt: new Date('2026-07-23T11:00:00Z').toISOString()
      }
    ],
    attachments: [],
    createdAt: new Date('2026-06-20T09:00:00Z').toISOString(),
    updatedAt: new Date('2026-07-23T11:00:00Z').toISOString()
  },
  {
    _id: 'task_6',
    projectId: 'proj_3',
    title: 'Audit core UI button and card token variants',
    description: 'Review color contrast ratios and border radius values across existing apps.',
    assigneeId: 'usr_3',
    createdById: 'usr_3',
    status: 'Backlog',
    priority: 'Low',
    dueDate: '2026-08-20',
    estimatedHours: 12,
    loggedHours: 0,
    tags: ['Design System', 'Tokens'],
    subtasks: [],
    comments: [],
    attachments: [],
    createdAt: new Date('2026-07-02T10:00:00Z').toISOString(),
    updatedAt: new Date('2026-07-02T10:00:00Z').toISOString()
  }
];
