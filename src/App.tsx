/**
 * Student Task & Performance Management System
 * Design Theme: "Geometric Balance"
 * Features: Dark slate-900 navigation sidebar, slate-50 canvas, rounded-2xl cards,
 * geometric accent borders, clean typography, and interactive student workflow.
 */

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  PlusCircle,
  User as UserIcon,
  Info,
  Calendar,
  Clock,
  AlertTriangle,
  Trash2,
  Edit3,
  Eye,
  ArrowLeft,
  LogOut,
  RotateCcw,
  Search,
  Menu,
  X,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Users,
  UserPlus,
  Shield,
  GraduationCap,
  Briefcase,
  Key
} from 'lucide-react';

interface Task {
  id: number;
  userId: number;
  title: string;
  subject: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  deadline: string; // ISO string
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'admin';
  degree: string;
  dateJoined: string;
}

const INITIAL_USERS: User[] = [
  {
    id: 1,
    username: 'rohit_sharma',
    firstName: 'Rohit',
    lastName: 'Sharma',
    email: 'rohit.sharma@college.edu',
    role: 'student',
    degree: 'B.Tech CSE - 3rd Year',
    dateJoined: '2025-08-15',
  },
  {
    id: 2,
    username: 'priya_verma',
    firstName: 'Priya',
    lastName: 'Verma',
    email: 'priya.verma@college.edu',
    role: 'student',
    degree: 'B.Tech IT - 3rd Year',
    dateJoined: '2025-09-01',
  },
  {
    id: 3,
    username: 'admin',
    firstName: 'Faculty',
    lastName: 'Admin',
    email: 'admin@college.edu',
    role: 'admin',
    degree: 'Department Supervisor',
    dateJoined: '2025-01-10',
  },
];

const now = new Date();
const addDays = (d: number, hours: number = 18) => {
  const date = new Date(now);
  date.setDate(date.getDate() + d);
  date.setHours(hours, 0, 0, 0);
  return date.toISOString().slice(0, 16);
};

const INITIAL_TASKS: Task[] = [
  {
    id: 101,
    userId: 1,
    title: 'Implement Binary Search Tree Algorithms',
    subject: 'Data Structures',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    deadline: addDays(2, 23),
    description: 'Implement node insertion, deletion, and in-order/pre-order traversals in C++ with test cases.',
    createdAt: '2026-03-01T10:00',
    updatedAt: '2026-03-02T14:30',
  },
  {
    id: 102,
    userId: 1,
    title: 'Database Normalization Report & Case Study',
    subject: 'Database Systems',
    priority: 'MEDIUM',
    status: 'COMPLETED',
    deadline: addDays(-1, 17),
    description: 'Decompose unnormalized relations into 1NF, 2NF, 3NF and BCNF for university admission schema.',
    createdAt: '2026-02-20T09:00',
    updatedAt: '2026-03-01T16:00',
  },
  {
    id: 103,
    userId: 1,
    title: 'Operating Systems Semaphores & Dining Philosophers',
    subject: 'Operating Systems',
    priority: 'HIGH',
    status: 'PENDING',
    deadline: addDays(-2, 12),
    description: 'Simulate deadlock-free dining philosophers problem using POSIX mutexes and semaphores in C.',
    createdAt: '2026-02-18T11:00',
    updatedAt: '2026-02-18T11:00',
  },
  {
    id: 104,
    userId: 1,
    title: 'Computer Networks Packet Sniffing WireShark Lab',
    subject: 'Computer Networks',
    priority: 'LOW',
    status: 'PENDING',
    deadline: addDays(5, 18),
    description: 'Analyze TCP three-way handshake and HTTP/DNS traffic captures using Wireshark.',
    createdAt: '2026-03-02T08:00',
    updatedAt: '2026-03-02T08:00',
  },
  {
    id: 105,
    userId: 1,
    title: 'Software Engineering SRS Document Submission',
    subject: 'Software Engineering',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    deadline: addDays(4, 20),
    description: 'Prepare IEEE 830 compliant Software Requirement Specification for student portal.',
    createdAt: '2026-02-28T15:00',
    updatedAt: '2026-03-03T11:00',
  },
  {
    id: 201,
    userId: 2,
    title: 'Machine Learning Linear Regression Notebook',
    subject: 'Machine Learning',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    deadline: addDays(3, 22),
    description: 'Train gradient descent model on student test scores dataset.',
    createdAt: '2026-03-01T12:00',
    updatedAt: '2026-03-02T16:00',
  },
  {
    id: 202,
    userId: 2,
    title: 'Compiler Design Lexical Analyzer',
    subject: 'Compiler Design',
    priority: 'MEDIUM',
    status: 'COMPLETED',
    deadline: addDays(-3, 14),
    description: 'Generate token stream using Flex/Lex tool with grammar specifications.',
    createdAt: '2026-02-15T09:00',
    updatedAt: '2026-02-26T18:00',
  },
];

export default function App() {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('stm_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('stm_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_USERS[0];
      }
    }
    return INITIAL_USERS[0];
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('stm_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'add_task' | 'profile' | 'about' | 'users'>('dashboard');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // User Management State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'student' | 'admin'>('all');

  const [newUserData, setNewUserData] = useState({
    role: 'student' as 'student' | 'admin',
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    degree: 'B.Tech CSE - 3rd Year',
    departmentOrRole: '',
  });

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('deadline_asc');
  const [overdueOnly, setOverdueOnly] = useState(false);

  // Global Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'danger' | 'info' } | null>(null);

  useEffect(() => {
    localStorage.setItem('stm_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('stm_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('stm_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const showToast = (text: string, type: 'success' | 'danger' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const isOverdue = (task: Task) => {
    if (task.status === 'COMPLETED' || !task.deadline) return false;
    return new Date(task.deadline) < new Date();
  };

  // Filter tasks based on logged-in student (or all if admin)
  const accessibleTasks = currentUser.role === 'admin' 
    ? tasks 
    : tasks.filter(t => t.userId === currentUser.id);

  // Metric computations
  const totalTasksCount = accessibleTasks.length;
  const pendingCount = accessibleTasks.filter(t => t.status === 'PENDING').length;
  const inProgressCount = accessibleTasks.filter(t => t.status === 'IN_PROGRESS').length;
  const completedCount = accessibleTasks.filter(t => t.status === 'COMPLETED').length;
  const overdueCount = accessibleTasks.filter(t => isOverdue(t)).length;
  const completionRate = totalTasksCount > 0 ? Math.round((completedCount / totalTasksCount) * 100) : 0;

  // Recent tasks (last 5)
  const recentTasks = [...accessibleTasks].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);

  // Upcoming deadlines (future, not completed)
  const upcomingTasks = accessibleTasks
    .filter(t => !isOverdue(t) && t.status !== 'COMPLETED')
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 4);

  // Priority counts
  const highPriorityCount = accessibleTasks.filter(t => t.priority === 'HIGH').length;
  const medPriorityCount = accessibleTasks.filter(t => t.priority === 'MEDIUM').length;
  const lowPriorityCount = accessibleTasks.filter(t => t.priority === 'LOW').length;

  // Filtered Task List
  const filteredTasks = accessibleTasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || task.status === statusFilter;
    const matchesPriority = !priorityFilter || task.priority === priorityFilter;
    const matchesOverdue = !overdueOnly || isOverdue(task);

    return matchesSearch && matchesStatus && matchesPriority && matchesOverdue;
  }).sort((a, b) => {
    if (sortOrder === 'deadline_desc') {
      return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
    } else if (sortOrder === 'created_desc') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOrder === 'priority') {
      const pWeights = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      return pWeights[b.priority] - pWeights[a.priority];
    } else {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
  });

  // Task Form State
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
    status: 'PENDING' as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED',
    deadline: addDays(3, 23),
    description: '',
    targetUserId: currentUser.id,
  });

  const handleCreateOrEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.subject.trim() || !formData.deadline) {
      showToast('Please fill out all required fields marked with *', 'danger');
      return;
    }

    const assignedUserId = currentUser.role === 'admin' ? (formData.targetUserId || currentUser.id) : currentUser.id;

    if (taskToEdit) {
      setTasks(prev => prev.map(t => t.id === taskToEdit.id ? {
        ...t,
        title: formData.title,
        subject: formData.subject,
        priority: formData.priority,
        status: formData.status,
        deadline: formData.deadline,
        description: formData.description,
        userId: currentUser.role === 'admin' ? (formData.targetUserId || t.userId) : t.userId,
        updatedAt: new Date().toISOString(),
      } : t));
      showToast(`Task "${formData.title}" updated successfully!`);
      setTaskToEdit(null);
      setActiveTab('tasks');
    } else {
      const newTask: Task = {
        id: Date.now(),
        userId: assignedUserId,
        title: formData.title,
        subject: formData.subject,
        priority: formData.priority,
        status: formData.status,
        deadline: formData.deadline,
        description: formData.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTasks(prev => [newTask, ...prev]);
      const targetUser = users.find(u => u.id === assignedUserId);
      showToast(`Task "${newTask.title}" assigned to ${targetUser ? targetUser.firstName : 'student'}!`);
      setActiveTab('tasks');
    }

    setFormData({
      title: '',
      subject: '',
      priority: 'MEDIUM',
      status: 'PENDING',
      deadline: addDays(3, 23),
      description: '',
      targetUserId: currentUser.id,
    });
  };

  const handleQuickStatusToggle = (taskId: number, newStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED') => {
    setTasks(prev => prev.map(t => t.id === taskId ? {
      ...t,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    } : t));
    showToast(`Status updated to ${newStatus.replace('_', ' ')}`);
  };

  const handleDeleteTask = () => {
    if (!taskToDelete) return;
    setTasks(prev => prev.filter(t => t.id !== taskToDelete.id));
    showToast(`Task "${taskToDelete.title}" was deleted.`);
    setTaskToDelete(null);
    if (selectedTask?.id === taskToDelete.id) {
      setSelectedTask(null);
    }
  };

  // User Creation Handler (Students & Admins)
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserData.username.trim() || !newUserData.firstName.trim() || !newUserData.lastName.trim() || !newUserData.email.trim()) {
      showToast('Please fill out all required fields marked with *', 'danger');
      return;
    }

    const cleanUsername = newUserData.username.trim().toLowerCase().replace(/\s+/g, '_');
    if (users.some(u => u.username.toLowerCase() === cleanUsername)) {
      showToast(`Username "${cleanUsername}" is already taken. Please choose another.`, 'danger');
      return;
    }

    if (users.some(u => u.email.toLowerCase() === newUserData.email.trim().toLowerCase())) {
      showToast(`Email address "${newUserData.email.trim()}" is already registered.`, 'danger');
      return;
    }

    const newUser: User = {
      id: Date.now(),
      username: cleanUsername,
      firstName: newUserData.firstName.trim(),
      lastName: newUserData.lastName.trim(),
      email: newUserData.email.trim(),
      role: newUserData.role,
      degree: newUserData.role === 'student' 
        ? (newUserData.degree.trim() || 'B.Tech CSE - 2nd Year') 
        : (newUserData.departmentOrRole.trim() || 'Faculty Mentor / Dept Coordinator'),
      dateJoined: new Date().toISOString().slice(0, 10),
    };

    setUsers(prev => [...prev, newUser]);
    setShowAddUserModal(false);
    showToast(
      `New ${newUser.role === 'admin' ? 'Administrator' : 'Student'} account for ${newUser.firstName} ${newUser.lastName} created!`,
      'success'
    );

    // Reset Form
    setNewUserData({
      role: 'student',
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      degree: 'B.Tech CSE - 3rd Year',
      departmentOrRole: '',
    });
  };

  // Delete User Handler
  const handleDeleteUser = () => {
    if (!userToDelete) return;
    if (userToDelete.id === currentUser.id) {
      showToast('Cannot delete the currently active user account.', 'danger');
      setUserToDelete(null);
      return;
    }
    setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
    setTasks(prev => prev.filter(t => t.userId !== userToDelete.id));
    showToast(`Account for ${userToDelete.firstName} ${userToDelete.lastName} was deleted.`, 'info');
    setUserToDelete(null);
  };

  // Profile Form
  const [profileForm, setProfileForm] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
  });

  useEffect(() => {
    setProfileForm({
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
    });
  }, [currentUser]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...currentUser,
      ...profileForm,
    };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
    showToast('Profile information updated successfully!');
  };

  // Current formatted date for the header
  const formattedToday = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans text-slate-800 antialiased">
      
      {/* SIDEBAR: Geometric Balance Dark Slate Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 flex flex-col text-white transition-transform duration-300 ease-in-out border-r border-slate-800
        md:static md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
                <CheckSquare className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-blue-400">
                TaskMaster
              </h1>
            </div>
            <span className="text-slate-400 font-medium text-xs block uppercase tracking-widest mt-1.5 opacity-80">
              Student Edition
            </span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow py-6 px-4 space-y-2 overflow-y-auto">
          <button
            id="nav-btn-dashboard"
            onClick={() => { setActiveTab('dashboard'); setSelectedTask(null); setMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl transition-all text-sm font-medium ${
              activeTab === 'dashboard' && !selectedTask
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 opacity-90" />
            <span>Dashboard</span>
          </button>

          <button
            id="nav-btn-tasks"
            onClick={() => { setActiveTab('tasks'); setSelectedTask(null); setMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl transition-all text-sm font-medium ${
              activeTab === 'tasks' && !selectedTask
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CheckSquare className="w-5 h-5 opacity-90" />
            <span>Tasks</span>
            <span className="ml-auto bg-slate-800 text-slate-300 text-xs py-0.5 px-2 rounded-full font-bold">
              {totalTasksCount}
            </span>
          </button>

          <button
            id="nav-btn-add-task"
            onClick={() => {
              setTaskToEdit(null);
              setFormData({
                title: '',
                subject: '',
                priority: 'MEDIUM',
                status: 'PENDING',
                deadline: addDays(3, 23),
                description: '',
                targetUserId: currentUser.id,
              });
              setActiveTab('add_task');
              setSelectedTask(null);
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl transition-all text-sm font-medium ${
              activeTab === 'add_task'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <PlusCircle className="w-5 h-5 opacity-90" />
            <span>Add Task</span>
          </button>

          <button
            id="nav-btn-users"
            onClick={() => { setActiveTab('users'); setSelectedTask(null); setMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl transition-all text-sm font-medium ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-5 h-5 opacity-90" />
            <span>Users &amp; Roles</span>
            <span className="ml-auto bg-slate-800 text-slate-300 text-xs py-0.5 px-2 rounded-full font-bold">
              {users.length}
            </span>
          </button>

          <button
            id="nav-btn-profile"
            onClick={() => { setActiveTab('profile'); setSelectedTask(null); setMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl transition-all text-sm font-medium ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <UserIcon className="w-5 h-5 opacity-90" />
            <span>Profile</span>
          </button>

          <button
            id="nav-btn-about"
            onClick={() => { setActiveTab('about'); setSelectedTask(null); setMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl transition-all text-sm font-medium ${
              activeTab === 'about'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Info className="w-5 h-5 opacity-90" />
            <span>About System</span>
          </button>

          {/* Quick Persona Switcher in Sidebar */}
          <div className="pt-6 border-t border-slate-800 mt-6">
            <div className="flex items-center justify-between mb-3 px-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Switch User Persona
              </p>
              <button
                onClick={() => {
                  setShowAddUserModal(true);
                  setMobileMenuOpen(false);
                }}
                className="text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
                title="Add New Student or Admin"
              >
                + Add
              </button>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {users.map(u => (
                <button
                  key={u.id}
                  id={`sidebar-switch-user-${u.id}`}
                  onClick={() => {
                    setCurrentUser(u);
                    showToast(`Active user switched to: ${u.firstName} (${u.role.toUpperCase()})`, 'info');
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    currentUser.id === u.id
                      ? 'bg-slate-800 text-blue-400 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <span className="truncate pr-1">{u.firstName} {u.lastName}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold shrink-0 ${
                    u.role === 'admin' ? 'bg-amber-900/60 text-amber-300' : 'bg-slate-900/60 text-slate-400'
                  }`}>
                    {u.role === 'admin' ? 'Admin' : 'Student'}
                  </span>
                </button>
              ))}
            </div>

            <button
              id="sidebar-add-user-btn"
              onClick={() => {
                setShowAddUserModal(true);
                setMobileMenuOpen(false);
              }}
              className="w-full mt-3 text-left px-3 py-2 rounded-xl text-xs font-semibold text-blue-400 hover:bg-blue-900/20 hover:text-blue-300 transition-colors flex items-center justify-center gap-1.5 border border-blue-800/50"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Student or Admin</span>
            </button>
          </div>
        </nav>

        {/* User Badge in Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80">
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm">
              {currentUser.firstName.slice(0, 1)}{currentUser.lastName.slice(0, 1)}
            </div>
            <div className="flex-grow overflow-hidden">
              <p className="truncate font-medium text-white">{currentUser.firstName} {currentUser.lastName}</p>
              <p className="truncate text-xs text-blue-200 opacity-60">{currentUser.degree}</p>
            </div>
            <button 
              id="sidebar-logout-btn"
              onClick={() => showToast('Session reset. Signed out.', 'info')}
              title="Sign Out"
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile navigation */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* MAIN CONTENT AREA: Geometric Balance Layout */}
      <div className="flex-grow flex flex-col h-full overflow-hidden min-w-0">
        
        {/* Top Minimal Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 shrink-0 flex items-center justify-between md:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="font-bold text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-600" />
            <span>TaskMaster</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-xs">
            {currentUser.firstName.slice(0, 1)}{currentUser.lastName.slice(0, 1)}
          </div>
        </header>

        {/* Scrollable Canvas */}
        <main className="flex-grow overflow-y-auto p-6 md:p-8">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                {activeTab === 'dashboard' && (currentUser.role === 'admin' ? 'Admin Academic Dashboard' : 'Student Dashboard')}
                {activeTab === 'tasks' && 'Academic Tasks'}
                {activeTab === 'users' && 'User Directory & Roles'}
                {activeTab === 'add_task' && (taskToEdit ? 'Edit Task' : 'Add New Task')}
                {activeTab === 'profile' && 'User Profile'}
                {activeTab === 'about' && 'System Architecture'}
              </h2>
              <p className="text-slate-500 mt-1 text-sm">
                {activeTab === 'dashboard' && (currentUser.role === 'admin' 
                  ? `Welcome back, ${currentUser.firstName}. Supervising all student coursework and academic deliverables.`
                  : `Welcome back, ${currentUser.firstName}. Here is your academic progress today.`)}
                {activeTab === 'tasks' && 'Organize, prioritize, and track coursework deliverables.'}
                {activeTab === 'users' && 'Manage registered students, faculty members, and academic administrators.'}
                {activeTab === 'add_task' && 'Specify assignment deliverables, subject, deadlines, and requirements.'}
                {activeTab === 'profile' && 'Manage your account details and review performance statistics.'}
                {activeTab === 'about' && 'Built with Python Django, SQLite, Bootstrap 5, and vanilla JavaScript.'}
              </p>
            </div>
            
            <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
              <button
                id="header-add-user-btn"
                onClick={() => setShowAddUserModal(true)}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
              >
                <UserPlus className="w-4 h-4 text-blue-400" />
                <span>Add User</span>
              </button>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Current Date</p>
                <p className="text-sm md:text-base font-semibold text-slate-700">{formattedToday}</p>
              </div>
            </div>
          </div>

          {/* Toast Alert Message */}
          {toastMessage && (
            <div className={`mb-6 p-4 rounded-2xl border text-sm font-medium flex items-center justify-between shadow-sm transition-all ${
              toastMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
              toastMessage.type === 'danger' ? 'bg-rose-50 text-rose-800 border-rose-200' :
              'bg-blue-50 text-blue-800 border-blue-200'
            }`}>
              <div className="flex items-center gap-2">
                {toastMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                {toastMessage.type === 'danger' && <AlertTriangle className="w-5 h-5 text-rose-600" />}
                {toastMessage.type === 'info' && <AlertCircle className="w-5 h-5 text-blue-600" />}
                <span>{toastMessage.text}</span>
              </div>
              <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* VIEW: DASHBOARD */}
          {activeTab === 'dashboard' && !selectedTask && (
            <div className="space-y-8">
              
              {/* Overdue Urgent Alert Banner */}
              {overdueCount > 0 && (
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-rose-900 text-sm">Overdue Assignments Detected</h4>
                      <p className="text-rose-700 text-xs">
                        You have <strong>{overdueCount}</strong> task{overdueCount > 1 ? 's' : ''} past deadline requiring immediate submission.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setOverdueOnly(true); setActiveTab('tasks'); }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                  >
                    View Overdue Tasks
                  </button>
                </div>
              )}

              {/* Geometric Balance Stat Cards: Grid of 4 to 6 with left color bars */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                
                {/* Total Tasks Card */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                  <p className="text-slate-500 text-sm font-medium mb-1">Total Tasks</p>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-bold text-slate-900">{String(totalTasksCount).padStart(2, '0')}</span>
                    <span className="text-blue-600 text-xs font-bold bg-blue-50 px-2 py-0.5 rounded-md">Coursework</span>
                  </div>
                </div>

                {/* Pending Card */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-amber-400">
                  <p className="text-slate-500 text-sm font-medium mb-1">Pending</p>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-bold text-slate-900">{String(pendingCount).padStart(2, '0')}</span>
                    <span className="text-amber-600 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-md">Not Started</span>
                  </div>
                </div>

                {/* Completed Card */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-emerald-500">
                  <p className="text-slate-500 text-sm font-medium mb-1">Completed</p>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-bold text-emerald-600">{String(completedCount).padStart(2, '0')}</span>
                    <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-md">{completionRate}% Score</span>
                  </div>
                </div>

                {/* Overdue Card */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-rose-500">
                  <p className="text-slate-500 text-sm font-medium mb-1">Overdue</p>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-bold text-rose-600">{String(overdueCount).padStart(2, '0')}</span>
                    <span className="text-rose-600 text-xs font-bold bg-rose-50 px-2 py-0.5 rounded-md">Needs Action</span>
                  </div>
                </div>

              </div>

              {/* Main Grid: 2 columns content + 1 column sidebar widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left: Recent Academic Tasks Table */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-base">Recent Academic Tasks</h3>
                    <button
                      onClick={() => setActiveTab('tasks')}
                      className="text-sm text-blue-600 font-semibold hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  
                  <div className="flex-grow overflow-x-auto">
                    {recentTasks.length > 0 ? (
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
                          <tr>
                            <th className="px-6 py-4">Task Title</th>
                            <th className="px-6 py-4">Subject</th>
                            <th className="px-6 py-4 text-center">Priority</th>
                            <th className="px-6 py-4 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                          {recentTasks.map(task => {
                            const overdue = isOverdue(task);
                            return (
                              <tr 
                                key={task.id} 
                                onClick={() => setSelectedTask(task)}
                                className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                              >
                                <td className="px-6 py-4">
                                  <div className="font-medium text-slate-900 hover:text-blue-600">
                                    {task.title}
                                  </div>
                                  <div className="text-xs text-slate-400 mt-0.5">
                                    Due {new Date(task.deadline).toLocaleDateString()}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-slate-500 font-medium text-xs">
                                  <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md">
                                    {task.subject}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  {task.priority === 'HIGH' && (
                                    <span className="px-2.5 py-1 bg-rose-100 text-rose-600 rounded text-xs font-bold">
                                      HIGH
                                    </span>
                                  )}
                                  {task.priority === 'MEDIUM' && (
                                    <span className="px-2.5 py-1 bg-amber-100 text-amber-600 rounded text-xs font-bold">
                                      MEDIUM
                                    </span>
                                  )}
                                  {task.priority === 'LOW' && (
                                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-600 rounded text-xs font-bold">
                                      LOW
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  {overdue ? (
                                    <span className="px-2.5 py-1 bg-red-100 text-red-600 rounded text-xs font-bold">
                                      OVERDUE
                                    </span>
                                  ) : task.status === 'COMPLETED' ? (
                                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-600 rounded text-xs font-bold">
                                      COMPLETED
                                    </span>
                                  ) : task.status === 'IN_PROGRESS' ? (
                                    <span className="px-2.5 py-1 bg-amber-100 text-amber-600 rounded text-xs font-bold">
                                      IN PROGRESS
                                    </span>
                                  ) : (
                                    <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded text-xs font-bold">
                                      PENDING
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <div className="p-8 text-center text-slate-400">
                        No tasks created yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Geometric Performance Chart & Upcoming Deadlines */}
                <div className="flex flex-col space-y-6">
                  
                  {/* Geometric Performance Chart Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-slate-800 text-base">Performance Chart</h3>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {completionRate}% Overall
                      </span>
                    </div>

                    {/* Geometric Balanced Bars */}
                    <div className="flex items-end justify-between h-32 px-3 pt-6">
                      <div className="w-10 bg-blue-100 rounded-t-lg relative flex flex-col justify-end" style={{ height: '40%' }}>
                        <div className="text-center pb-1 text-[11px] font-bold text-blue-600">40%</div>
                      </div>
                      <div className="w-10 bg-blue-300 rounded-t-lg relative flex flex-col justify-end" style={{ height: '65%' }}>
                        <div className="text-center pb-1 text-[11px] font-bold text-blue-700">65%</div>
                      </div>
                      <div className="w-10 bg-blue-600 rounded-t-lg relative flex flex-col justify-end" style={{ height: '85%' }}>
                        <div className="text-center pb-1 text-[11px] font-bold text-white">85%</div>
                      </div>
                      <div className="w-10 bg-blue-200 rounded-t-lg relative flex flex-col justify-end" style={{ height: '50%' }}>
                        <div className="text-center pb-1 text-[11px] font-bold text-blue-600">50%</div>
                      </div>
                    </div>

                    <div className="flex justify-between mt-3 text-[10px] uppercase font-bold text-slate-400 px-1">
                      <span>Week 1</span>
                      <span>Week 2</span>
                      <span>Week 3</span>
                      <span>Week 4</span>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
                      <span>Completed: <strong className="text-slate-800">{completedCount}</strong></span>
                      <span>Pending: <strong className="text-slate-800">{pendingCount}</strong></span>
                      <span>In Progress: <strong className="text-slate-800">{inProgressCount}</strong></span>
                    </div>
                  </div>

                  {/* Upcoming Deadlines Widget */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex-grow">
                    <h3 className="font-bold text-slate-800 mb-4 text-base flex items-center justify-between">
                      <span>Upcoming Deadlines</span>
                      <Clock className="w-4 h-4 text-slate-400" />
                    </h3>
                    
                    {upcomingTasks.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingTasks.map((task, idx) => {
                          const dotColor = idx === 0 ? 'bg-rose-500' : idx === 1 ? 'bg-amber-500' : 'bg-blue-500';
                          return (
                            <div 
                              key={task.id}
                              onClick={() => setSelectedTask(task)}
                              className="flex items-start space-x-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              <div className={`mt-1.5 w-2 h-2 rounded-full ${dotColor} shrink-0`}></div>
                              <div className="flex-grow overflow-hidden">
                                <p className="text-sm font-bold text-slate-800 truncate">{task.title}</p>
                                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                                  <span>{task.subject}</span>
                                  <span>•</span>
                                  <span>{new Date(task.deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })}, {new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No upcoming deadlines.</p>
                    )}
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* VIEW: TASK LISTING */}
          {activeTab === 'tasks' && !selectedTask && (
            <div className="space-y-6">
              
              {/* Search & Filters in Geometric Card */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  
                  {/* Search Input */}
                  <div className="lg:col-span-2 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      id="tasks-search-input"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search title, subject, notes..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>

                  {/* Status Filter */}
                  <div>
                    <select
                      id="tasks-status-filter"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
                    >
                      <option value="">All Statuses</option>
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>

                  {/* Priority Filter */}
                  <div>
                    <select
                      id="tasks-priority-filter"
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
                    >
                      <option value="">All Priorities</option>
                      <option value="HIGH">High Priority</option>
                      <option value="MEDIUM">Medium Priority</option>
                      <option value="LOW">Low Priority</option>
                    </select>
                  </div>

                  {/* Reset Filters */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('');
                        setPriorityFilter('');
                        setOverdueOnly(false);
                        setSortOrder('deadline_asc');
                      }}
                      className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 border border-slate-200 hover:bg-slate-100 rounded-xl text-sm font-semibold text-slate-600 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset</span>
                    </button>
                  </div>

                  {/* Overdue Switcher */}
                  <div className="lg:col-span-5 flex items-center justify-between pt-2 border-t border-slate-100">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-rose-600">
                      <input
                        type="checkbox"
                        checked={overdueOnly}
                        onChange={(e) => setOverdueOnly(e.target.checked)}
                        className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                      />
                      <span>Show Overdue Tasks Only</span>
                    </label>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>Sort:</span>
                      <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="bg-transparent border-0 font-semibold text-slate-700 focus:outline-none cursor-pointer"
                      >
                        <option value="deadline_asc">Deadline (Earliest)</option>
                        <option value="deadline_desc">Deadline (Latest)</option>
                        <option value="created_desc">Recently Created</option>
                        <option value="priority">Priority Level</option>
                      </select>
                    </div>
                  </div>

                </div>
              </div>

              {/* Tasks Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {filteredTasks.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
                        <tr>
                          <th className="px-6 py-4">Task Details</th>
                          <th className="px-6 py-4">Subject</th>
                          <th className="px-6 py-4 text-center">Priority</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Deadline</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {filteredTasks.map(task => {
                          const overdue = isOverdue(task);
                          return (
                            <tr 
                              key={task.id}
                              className={`hover:bg-slate-50/80 transition-colors ${overdue ? 'bg-rose-50/40' : ''}`}
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  {overdue && (
                                    <span className="px-1.5 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold">
                                      OVERDUE
                                    </span>
                                  )}
                                  <button
                                    onClick={() => setSelectedTask(task)}
                                    className="font-bold text-slate-900 hover:text-blue-600 text-left"
                                  >
                                    {task.title}
                                  </button>
                                </div>
                                {task.description && (
                                  <p className="text-xs text-slate-400 truncate max-w-sm mt-0.5">
                                    {task.description}
                                  </p>
                                )}
                              </td>

                              <td className="px-6 py-4">
                                <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs font-semibold">
                                  {task.subject}
                                </span>
                              </td>

                              <td className="px-6 py-4 text-center">
                                {task.priority === 'HIGH' && (
                                  <span className="px-2.5 py-1 bg-rose-100 text-rose-600 rounded text-xs font-bold">
                                    HIGH
                                  </span>
                                )}
                                {task.priority === 'MEDIUM' && (
                                  <span className="px-2.5 py-1 bg-amber-100 text-amber-600 rounded text-xs font-bold">
                                    MEDIUM
                                  </span>
                                )}
                                {task.priority === 'LOW' && (
                                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-600 rounded text-xs font-bold">
                                    LOW
                                  </span>
                                )}
                              </td>

                              <td className="px-6 py-4">
                                <select
                                  value={task.status}
                                  onChange={(e) => handleQuickStatusToggle(task.id, e.target.value as any)}
                                  className={`text-xs font-bold px-2.5 py-1 rounded-lg border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 ${
                                    task.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                                    task.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700' :
                                    'bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  <option value="PENDING">PENDING</option>
                                  <option value="IN_PROGRESS">IN PROGRESS</option>
                                  <option value="COMPLETED">COMPLETED</option>
                                </select>
                              </td>

                              <td className="px-6 py-4 text-xs">
                                <div className={overdue ? 'text-rose-600 font-bold' : 'text-slate-600'}>
                                  {new Date(task.deadline).toLocaleDateString()}
                                </div>
                                <div className="text-slate-400">
                                  {new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </td>

                              <td className="px-6 py-4 text-right">
                                <div className="inline-flex items-center gap-1.5">
                                  <button
                                    onClick={() => setSelectedTask(task)}
                                    title="View Details"
                                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setTaskToEdit(task);
                                      setFormData({
                                        title: task.title,
                                        subject: task.subject,
                                        priority: task.priority,
                                        status: task.status,
                                        deadline: task.deadline,
                                        description: task.description,
                                      });
                                      setActiveTab('add_task');
                                    }}
                                    title="Edit Task"
                                    className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-colors"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setTaskToDelete(task)}
                                    title="Delete Task"
                                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-12 text-center text-slate-400">
                    <CheckSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <h4 className="font-bold text-slate-700 mb-1">No tasks found</h4>
                    <p className="text-xs text-slate-500 mb-4">No tasks matched your criteria.</p>
                    <button
                      onClick={() => {
                        setTaskToEdit(null);
                        setActiveTab('add_task');
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                    >
                      Create a Task
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* VIEW: TASK DETAIL */}
          {selectedTask && (
            <div className="max-w-3xl mx-auto space-y-6">
              <button
                onClick={() => setSelectedTask(null)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Task List</span>
              </button>

              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-md">
                    {selectedTask.subject}
                  </span>
                  {isOverdue(selectedTask) && (
                    <span className="px-3 py-1 bg-rose-100 text-rose-600 text-xs font-bold rounded-md">
                      Overdue
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {selectedTask.title}
                </h3>

                <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl mb-6 text-sm">
                  <div>
                    <span className="text-slate-400 text-xs uppercase font-bold block mb-1">Priority</span>
                    <span className="font-bold text-slate-800">{selectedTask.priority}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs uppercase font-bold block mb-1">Status</span>
                    <span className="font-bold text-slate-800">{selectedTask.status.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs uppercase font-bold block mb-1">Deadline</span>
                    <span className="font-bold text-slate-800">
                      {new Date(selectedTask.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h5 className="text-xs uppercase font-bold text-slate-400 mb-2">Description</h5>
                  <div className="p-4 bg-slate-50 rounded-xl text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {selectedTask.description || 'No description provided.'}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Status:</span>
                    <select
                      value={selectedTask.status}
                      onChange={(e) => {
                        handleQuickStatusToggle(selectedTask.id, e.target.value as any);
                        setSelectedTask(prev => prev ? { ...prev, status: e.target.value as any } : null);
                      }}
                      className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-bold"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setTaskToEdit(selectedTask);
                        setFormData({
                          title: selectedTask.title,
                          subject: selectedTask.subject,
                          priority: selectedTask.priority,
                          status: selectedTask.status,
                          deadline: selectedTask.deadline,
                          description: selectedTask.description,
                        });
                        setSelectedTask(null);
                        setActiveTab('add_task');
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                    >
                      Edit Task
                    </button>
                    <button
                      onClick={() => setTaskToDelete(selectedTask)}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: ADD / EDIT TASK */}
          {activeTab === 'add_task' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <button
                onClick={() => setActiveTab('tasks')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Cancel & Return</span>
              </button>

              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  {taskToEdit ? 'Modify Task Details' : 'Register New Task'}
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Fill in academic coursework information and submission target date.
                </p>

                <form onSubmit={handleCreateOrEditTask} className="space-y-4">
                  {currentUser.role === 'admin' && (
                    <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl">
                      <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-blue-600" />
                        <span>Assign Task To Student *</span>
                      </label>
                      <select
                        value={formData.targetUserId || currentUser.id}
                        onChange={(e) => setFormData({ ...formData, targetUserId: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 bg-white border border-blue-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                      >
                        {users.filter(u => u.role === 'student').map(s => (
                          <option key={s.id} value={s.id}>
                            {s.firstName} {s.lastName} (@{s.username}) — {s.degree}
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-blue-700 mt-1">
                        As an administrator, you can assign this coursework directly to any registered student.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Implement Binary Search Tree"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Subject / Course *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g. Data Structures, OS"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Priority Level *
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium"
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Initial Status *
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Target Deadline *
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Detailed Instructions / Notes
                    </label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Notes, references, deliverables..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveTab('tasks')}
                      className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                    >
                      {taskToEdit ? 'Save Changes' : 'Create Task'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* VIEW: PROFILE */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-slate-100">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-white text-xl shadow-sm">
                    {currentUser.firstName.slice(0, 1)}{currentUser.lastName.slice(0, 1)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{currentUser.firstName} {currentUser.lastName}</h3>
                    <p className="text-xs text-slate-500">{currentUser.degree} • Registered {currentUser.dateJoined}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Tasks</span>
                    <span className="text-2xl font-bold text-slate-900 mt-1 block">{totalTasksCount}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Completed</span>
                    <span className="text-2xl font-bold text-emerald-600 mt-1 block">{completedCount}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Rate</span>
                    <span className="text-2xl font-bold text-blue-600 mt-1 block">{completionRate}%</span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
                  Update Account Details
                </h4>

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">First Name</label>
                      <input
                        type="text"
                        required
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Last Name</label>
                      <input
                        type="text"
                        required
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                    >
                      Save Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* VIEW: ABOUT */}
          {activeTab === 'about' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  About Student Task &amp; Performance Management System
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  A full-stack academic task management application crafted with Python 3, Django ORM, SQLite, Bootstrap 5, and vanilla JavaScript.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 border-l-4 border-l-blue-600">
                    <h4 className="font-bold text-slate-800 text-sm mb-2">Backend Architecture</h4>
                    <ul className="text-xs text-slate-600 space-y-1.5">
                      <li>• <strong>Python 3 + Django:</strong> MVT framework</li>
                      <li>• <strong>SQLite:</strong> Serverless relational DB</li>
                      <li>• <strong>Django Auth:</strong> PBKDF2 SHA-256</li>
                      <li>• <strong>Data Isolation:</strong> User-scoped queries</li>
                    </ul>
                  </div>

                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 border-l-4 border-l-emerald-500">
                    <h4 className="font-bold text-slate-800 text-sm mb-2">Theme &amp; Frontend</h4>
                    <ul className="text-xs text-slate-600 space-y-1.5">
                      <li>• <strong>Geometric Balance:</strong> Clean aesthetic</li>
                      <li>• <strong>Slate-900:</strong> High-contrast sidebar</li>
                      <li>• <strong>Slate-50:</strong> Minimalist canvas</li>
                      <li>• <strong>Rounded-2xl:</strong> Crisp geometric cards</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl text-xs text-blue-900 font-medium">
                  <strong>Viva / Training Reference:</strong> Demonstrates authentication, relational schema design, form validation, CSRF defenses, automated overdue triggers, and data isolation between students.
                </div>
              </div>
            </div>
          )}

          {/* VIEW: USERS MANAGEMENT (Geometric Balance Directory) */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Geometric Balance Stats Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-slate-500 text-sm font-medium">Total Registered Users</p>
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-bold text-slate-900">{users.length}</span>
                    <span className="text-blue-600 text-xs font-bold bg-blue-50 px-2 py-0.5 rounded-md">Directory</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-blue-600">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-slate-500 text-sm font-medium">Students (Coursework)</p>
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-bold text-slate-900">
                      {users.filter(u => u.role === 'student').length}
                    </span>
                    <span className="text-blue-700 text-xs font-bold bg-blue-50 px-2 py-0.5 rounded-md">Active Scholars</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-amber-500">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-slate-500 text-sm font-medium">Faculty &amp; Administrators</p>
                    <Shield className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-bold text-slate-900">
                      {users.filter(u => u.role === 'admin').length}
                    </span>
                    <span className="text-amber-700 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-md">Management</span>
                  </div>
                </div>
              </div>

              {/* Search, Filter & Add Actions Toolbar */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-grow">
                  {/* Search Input */}
                  <div className="relative flex-grow max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      placeholder="Search by name, username, email, branch..."
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 shrink-0 text-xs">
                    <button
                      onClick={() => setUserRoleFilter('all')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                        userRoleFilter === 'all'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      All ({users.length})
                    </button>
                    <button
                      onClick={() => setUserRoleFilter('student')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                        userRoleFilter === 'student'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Students ({users.filter(u => u.role === 'student').length})
                    </button>
                    <button
                      onClick={() => setUserRoleFilter('admin')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                        userRoleFilter === 'admin'
                          ? 'bg-white text-amber-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Admins ({users.filter(u => u.role === 'admin').length})
                    </button>
                  </div>
                </div>

                {/* Add User Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setNewUserData({
                        role: 'student',
                        firstName: '',
                        lastName: '',
                        username: '',
                        email: '',
                        degree: 'B.Tech CSE - 3rd Year',
                        departmentOrRole: '',
                      });
                      setShowAddUserModal(true);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Add Student</span>
                  </button>

                  <button
                    onClick={() => {
                      setNewUserData({
                        role: 'admin',
                        firstName: '',
                        lastName: '',
                        username: '',
                        email: '',
                        degree: '',
                        departmentOrRole: 'HOD Computer Science & Engineering',
                      });
                      setShowAddUserModal(true);
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span>Add Admin</span>
                  </button>
                </div>
              </div>

              {/* Users Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {users
                  .filter(u => {
                    const matchesFilter = userRoleFilter === 'all' || u.role === userRoleFilter;
                    const query = userSearchQuery.toLowerCase();
                    const matchesQuery = 
                      u.firstName.toLowerCase().includes(query) ||
                      u.lastName.toLowerCase().includes(query) ||
                      u.username.toLowerCase().includes(query) ||
                      u.email.toLowerCase().includes(query) ||
                      (u.degree && u.degree.toLowerCase().includes(query));
                    return matchesFilter && matchesQuery;
                  })
                  .map(u => {
                    const userTasks = tasks.filter(t => t.userId === u.id);
                    const completedTasksCount = userTasks.filter(t => t.status === 'COMPLETED').length;
                    const pendingTasksCount = userTasks.filter(t => t.status !== 'COMPLETED').length;
                    const rate = userTasks.length > 0 ? Math.round((completedTasksCount / userTasks.length) * 100) : 0;
                    const isCurrent = currentUser.id === u.id;

                    return (
                      <div
                        key={u.id}
                        className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between transition-all hover:shadow-md border-l-4 ${
                          u.role === 'admin' ? 'border-l-amber-500' : 'border-l-blue-600'
                        }`}
                      >
                        <div>
                          {/* Header */}
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-sm ${
                                u.role === 'admin' ? 'bg-amber-600' : 'bg-blue-600'
                              }`}>
                                {u.firstName.slice(0, 1)}{u.lastName.slice(0, 1)}
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-900 text-sm leading-tight flex items-center gap-1.5">
                                  <span>{u.firstName} {u.lastName}</span>
                                  {isCurrent && (
                                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded">
                                      You
                                    </span>
                                  )}
                                </h4>
                                <p className="text-xs text-slate-400 font-mono">@{u.username}</p>
                              </div>
                            </div>

                            <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 shrink-0 ${
                              u.role === 'admin'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-50 text-blue-700'
                            }`}>
                              {u.role === 'admin' ? (
                                <>
                                  <Shield className="w-3 h-3 text-amber-600" />
                                  <span>Admin</span>
                                </>
                              ) : (
                                <>
                                  <GraduationCap className="w-3 h-3 text-blue-600" />
                                  <span>Student</span>
                                </>
                              )}
                            </span>
                          </div>

                          {/* Details */}
                          <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100 mb-4">
                            <p className="flex items-center gap-1.5 font-medium text-slate-700">
                              <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{u.degree}</span>
                            </p>
                            <p className="text-slate-500 font-mono text-[11px] truncate">
                              {u.email}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              Joined on {u.dateJoined}
                            </p>
                          </div>

                          {/* Academic Task Stats for this user */}
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4">
                            <div className="flex justify-between items-center text-xs mb-1.5">
                              <span className="font-semibold text-slate-600">Coursework Tasks</span>
                              <span className="font-bold text-slate-800">{userTasks.length} Total</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-2">
                              <div
                                className={`h-full transition-all duration-500 ${
                                  rate >= 80 ? 'bg-emerald-500' : rate >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                                }`}
                                style={{ width: `${rate}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[11px] text-slate-500">
                              <span>{completedTasksCount} Completed</span>
                              <span>{pendingTasksCount} Pending</span>
                              <span className="font-bold text-slate-700">{rate}% Rate</span>
                            </div>
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {!isCurrent ? (
                              <button
                                onClick={() => {
                                  setCurrentUser(u);
                                  showToast(`Switched active user session to: ${u.firstName} (${u.role.toUpperCase()})`, 'info');
                                }}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                                title="Switch active user to this profile"
                              >
                                Switch To User
                              </button>
                            ) : (
                              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold">
                                Active Account
                              </span>
                            )}

                            {u.role === 'student' && (
                              <button
                                onClick={() => {
                                  setTaskToEdit(null);
                                  setFormData({
                                    title: '',
                                    subject: '',
                                    priority: 'MEDIUM',
                                    status: 'PENDING',
                                    deadline: addDays(3, 23),
                                    description: '',
                                    targetUserId: u.id,
                                  });
                                  setActiveTab('add_task');
                                }}
                                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors"
                                title="Create and assign a task to this student"
                              >
                                + Assign Task
                              </button>
                            )}
                          </div>

                          {!isCurrent && (
                            <button
                              onClick={() => setUserToDelete(u)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete user account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {users.filter(u => {
                const matchesFilter = userRoleFilter === 'all' || u.role === userRoleFilter;
                const query = userSearchQuery.toLowerCase();
                return matchesFilter && (
                  u.firstName.toLowerCase().includes(query) ||
                  u.lastName.toLowerCase().includes(query) ||
                  u.username.toLowerCase().includes(query) ||
                  u.email.toLowerCase().includes(query) ||
                  (u.degree && u.degree.toLowerCase().includes(query))
                );
              }).length === 0 && (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-700 text-base mb-1">No users matched your query</h4>
                  <p className="text-xs text-slate-500 mb-4">Try adjusting your search terms or filter selection.</p>
                  <button
                    onClick={() => {
                      setUserSearchQuery('');
                      setUserRoleFilter('all');
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Modal: Add New Student or Admin Account */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 md:p-7 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${
                  newUserData.role === 'admin' ? 'bg-amber-600' : 'bg-blue-600'
                }`}>
                  {newUserData.role === 'admin' ? <Shield className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Register New {newUserData.role === 'admin' ? 'Administrator' : 'Student'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Create an account with role-based permissions in the system.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              {/* Role Segmented Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Account Role *
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setNewUserData({ ...newUserData, role: 'student' })}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      newUserData.role === 'student'
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span>Student Account</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewUserData({ ...newUserData, role: 'admin' })}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      newUserData.role === 'admin'
                        ? 'bg-white text-amber-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-amber-600" />
                    <span>Admin / Faculty</span>
                  </button>
                </div>
              </div>

              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserData.firstName}
                    onChange={(e) => {
                      const fn = e.target.value;
                      setNewUserData(prev => ({
                        ...prev,
                        firstName: fn,
                        username: prev.username || (fn ? fn.toLowerCase().replace(/\s+/g, '') + '_btech' : ''),
                      }));
                    }}
                    placeholder="e.g. Priya"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserData.lastName}
                    onChange={(e) => setNewUserData({ ...newUserData, lastName: e.target.value })}
                    placeholder="e.g. Verma"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Username & Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserData.username}
                    onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                    placeholder="e.g. priya_cse"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                    placeholder="e.g. priya@college.edu"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Role-Specific Field: Degree for Student, Designation for Admin */}
              {newUserData.role === 'student' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Degree Branch &amp; Academic Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserData.degree}
                    onChange={(e) => setNewUserData({ ...newUserData, degree: e.target.value })}
                    placeholder="e.g. B.Tech CSE - 3rd Year, B.Tech IT - 2nd Year"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {['B.Tech CSE - 2nd Year', 'B.Tech CSE - 3rd Year', 'B.Tech IT - 3rd Year', 'B.Tech ECE - 4th Year'].map(deg => (
                      <button
                        type="button"
                        key={deg}
                        onClick={() => setNewUserData({ ...newUserData, degree: deg })}
                        className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md font-medium"
                      >
                        {deg}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Department &amp; Faculty Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserData.departmentOrRole}
                    onChange={(e) => setNewUserData({ ...newUserData, departmentOrRole: e.target.value })}
                    placeholder="e.g. HOD Computer Science, Project Guide, Academic Advisor"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {['Faculty Project Mentor', 'HOD Computer Science', 'Examination Coordinator', 'Academic Dean'].map(role => (
                      <button
                        type="button"
                        key={role}
                        onClick={() => setNewUserData({ ...newUserData, departmentOrRole: role })}
                        className="text-[10px] px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-md font-medium"
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Security / Default credentials notice */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                <Key className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px]">
                  <strong>Django Authentication Notice:</strong> In production, new credentials are encrypted with PBKDF2 SHA-256. You can immediately switch into this account from the user switcher.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white rounded-xl text-xs font-bold shadow-sm transition-colors ${
                    newUserData.role === 'admin'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Create {newUserData.role === 'admin' ? 'Admin' : 'Student'} Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-lg mb-1">Delete User Account?</h4>
            <p className="text-xs text-slate-500 mb-6">
              Are you sure you want to delete the account for <strong>"{userToDelete.firstName} {userToDelete.lastName}"</strong> (@{userToDelete.username})? All associated coursework tasks will also be deleted.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {taskToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-lg mb-1">Delete Task?</h4>
            <p className="text-xs text-slate-500 mb-6">
              Are you sure you want to permanently delete <strong>"{taskToDelete.title}"</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setTaskToDelete(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTask}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
