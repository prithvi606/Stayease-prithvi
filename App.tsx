import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, CreditCard, ClipboardList, Bell, 
  LogOut, Search, Plus, Home, 
  Star, ShieldCheck, UserCircle, Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './utils';
import { 
  User, Room, Payment, Complaint, Notice, Feedback, UserRole 
} from './types';

// Shared Components
import { Card, NavItem } from './components/common/UI';
import { PaymentsView } from './components/common/PaymentsView';
import { ComplaintsView } from './components/common/ComplaintsView';
import { NoticesView } from './components/common/NoticesView';
import { FeedbackView } from './components/common/FeedbackView';
import { ProfileView } from './components/common/ProfileView';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { RoomsView } from './components/admin/RoomsView';
import { ResidentsView } from './components/admin/ResidentsView';

// Resident Components
import { ResidentDashboard } from './components/resident/ResidentDashboard';
import { UnitView } from './components/resident/UnitView';

// --- MOCK DATA ---
const INITIAL_ROOMS: Room[] = [
  { id: 'r1', number: '101', type: 'Single', rent: 12000, capacity: 1, occupancy: 1, status: 'Full', floor: 1, amenities: ['AC', 'WiFi', 'Bath'] },
  { id: 'r2', number: '102', type: 'Double', rent: 8500, capacity: 2, occupancy: 2, status: 'Full', floor: 1, amenities: ['Fan', 'WiFi'] },
  { id: 'r3', number: '103', type: 'Triple', rent: 6000, capacity: 3, occupancy: 2, status: 'Available', floor: 1, amenities: ['Fan', 'WiFi'] },
  { id: 'r4', number: '201', type: 'Single', rent: 13000, capacity: 1, occupancy: 0, status: 'Available', floor: 2, amenities: ['AC', 'WiFi', 'Balcony'] },
  { id: 'r5', number: '202', type: 'Double', rent: 9000, capacity: 2, occupancy: 1, status: 'Available', floor: 2, amenities: ['AC', 'WiFi'] },
  { id: 'r6', number: '301', type: 'Single', rent: 11000, capacity: 1, occupancy: 0, status: 'Maintenance', floor: 3, amenities: ['AC'] },
];

const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Admin One', email: 'admin@stayease.com', role: 'admin', phone: '9876543210' },
  { id: 'u2', name: 'Priya Sharma', email: 'resident@stayease.com', role: 'resident', phone: '9123456789', roomId: 'r1' },
  { id: 'u3', name: 'Amit Patel', email: 'amit@example.com', role: 'resident', phone: '9234567890', roomId: 'r2' },
];

const INITIAL_PAYMENTS: Payment[] = [
  { id: 'p1', userId: 'u2', amount: 12000, month: 'May', year: 2026, status: 'Paid', method: 'UPI', date: '2026-05-01' },
  { id: 'p2', userId: 'u3', amount: 8500, month: 'May', year: 2026, status: 'Pending', date: '2026-05-03' },
];

const INITIAL_COMPLAINTS: Complaint[] = [
  { id: 'c1', userId: 'u2', title: 'Water Leakage', category: 'Plumbing', description: 'Small leak in bathroom', status: 'Resolved', createdAt: '2026-04-20', updatedAt: '2026-04-22' },
  { id: 'c2', userId: 'u3', title: 'WiFi Slow', category: 'Internet', description: 'Not getting speed', status: 'Pending', createdAt: '2026-05-01', updatedAt: '2026-05-01' },
];

const INITIAL_NOTICES: Notice[] = [
  { id: 'n1', title: 'Maintenance Notice', content: 'Water will be shut for 2 hours on Sunday.', priority: 'High', date: '2026-05-04' },
];

const INITIAL_FEEDBACKS: Feedback[] = [
  { id: 'f1', userId: 'u2', rating: 5, comment: 'Excellent stay! The service is very prompt.', createdAt: '2026-04-28' },
  { id: 'f2', userId: 'u3', rating: 4, comment: 'Good rooms, wish the WiFi was slightly faster.', createdAt: '2026-05-01' },
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [view, setView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Data State
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('se_rooms');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('se_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('se_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('se_complaints');
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });
  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem('se_notices');
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => {
    const saved = localStorage.getItem('se_feedbacks');
    return saved ? JSON.parse(saved) : INITIAL_FEEDBACKS;
  });
  const [selectedRole, setSelectedRole] = useState<UserRole>('resident');

  useEffect(() => {
    localStorage.setItem('se_rooms', JSON.stringify(rooms));
    localStorage.setItem('se_users', JSON.stringify(users));
    localStorage.setItem('se_payments', JSON.stringify(payments));
    localStorage.setItem('se_complaints', JSON.stringify(complaints));
    localStorage.setItem('se_notices', JSON.stringify(notices));
    localStorage.setItem('se_feedbacks', JSON.stringify(feedbacks));
  }, [rooms, users, payments, complaints, notices, feedbacks]);

  useEffect(() => {
    const savedSession = localStorage.getItem('se_session');
    if (savedSession) {
      try {
        setCurrentUser(JSON.parse(savedSession));
      } catch (e) {
        console.error("Failed to parse session", e);
      }
    }
  }, []);

  // Auth Functions
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as any).email.value;
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('se_session', JSON.stringify(user));
    } else {
      alert('Authentication Failed: Protocol Identifier not found.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as any;
    const role = form.role.value as UserRole;

    if (role === 'admin') {
      const adminCode = form.adminCode.value;
      if (adminCode !== 'ADMIN123') {
        alert('Invalid Admin Authorization Code. Access Denied.');
        return;
      }
    }

    const newUser: User = {
      id: `u${users.length + 1}`,
      name: form.fullname.value,
      email: form.email.value,
      role: role,
      phone: form.phone.value,
    };

    if (users.some(u => u.email === newUser.email)) {
      alert('Identifier already registered in sector.');
      return;
    }

    setUsers([...users, newUser]);
    setAuthMode('login');
    alert('Synchronization complete. Identity packet stored.');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('se_session');
    setView('dashboard');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-zinc-50 text-zinc-900 flex items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Background Decorative elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none" 
             style={{backgroundImage: 'radial-gradient(#18181b 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10"
        >
          {/* Welcome Card */}
          <div className="bg-zinc-900 rounded-[2.5rem] p-10 text-white flex flex-col justify-between shadow-2xl shadow-zinc-900/30 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent opacity-50" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                 <Building2 className="text-zinc-900" size={28} />
              </div>
              <h1 className="text-5xl font-black tracking-tighter leading-[0.9] mb-6 tracking-tighter uppercase">Unified<br/>Housing<br/>Terminal.</h1>
              <p className="text-zinc-400 font-medium text-sm max-w-[240px] leading-relaxed">
                Enterprise management for premium PG services. Log in to access your sector profile.
              </p>
            </div>
            <div className="relative z-10 pt-10 border-t border-white/10 mt-10">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Security: Active</span>
              </div>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest leading-normal">
                StayEase Protocol v4.2<br/>Node Identity Service
              </p>
            </div>
          </div>

          {/* Form Card */}
          <Card className={cn("p-10 flex flex-col justify-center border-none shadow-2xl shadow-zinc-200/50", authMode === 'register' ? "bg-white" : "bg-zinc-50")}>
            <div className="flex bg-zinc-100 p-1 rounded-2xl mb-8 w-fit mx-auto shadow-inner">
               <button 
                 onClick={() => setAuthMode('login')}
                 className={cn("px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", authMode === 'login' ? "bg-white text-zinc-900 shadow-lg" : "text-zinc-400 hover:text-zinc-600")}
               >Login</button>
               <button 
                 onClick={() => setAuthMode('register')}
                 className={cn("px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", authMode === 'register' ? "bg-white text-zinc-900 shadow-lg" : "text-zinc-400 hover:text-zinc-600")}
               >Register</button>
            </div>

            <AnimatePresence mode="wait">
              {authMode === 'login' ? (
                <motion.form 
                  key="login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleLogin} 
                  className="space-y-5"
                >
                  <div className="flex gap-2 p-1 bg-zinc-100 rounded-xl mb-6">
                    <button type="button" onClick={() => setSelectedRole('resident')} className={cn("flex-1 py-2 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all", selectedRole === 'resident' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400")}>Resident</button>
                    <button type="button" onClick={() => setSelectedRole('admin')} className={cn("flex-1 py-2 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all", selectedRole === 'admin' ? "bg-rose-600 text-white shadow-lg shadow-rose-200" : "text-zinc-400")}>Admin (Dev)</button>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">System Identifier (Email)</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={16} />
                      <input name="email" type="email" required placeholder={selectedRole === 'admin' ? "admin@stayease.com" : "resident@stayease.com"} 
                        className="w-full bg-white border border-zinc-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all shadow-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Access Key (Password)</label>
                    <input type="password" required placeholder="••••••••" 
                      className="w-full bg-white border border-zinc-200 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all shadow-sm" />
                  </div>
                  <button type="submit" className="w-full bg-zinc-900 text-white py-5 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10 hover:-translate-y-0.5">
                    Authorize Entry →
                  </button>
                  <p className="text-center text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-6">
                    Forgotten credentials? Contact Site Admin
                  </p>
                </motion.form>
              ) : (
                <motion.form 
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleRegister} 
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1 block">Full Name</label>
                      <input name="fullname" type="text" required className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs font-bold outline-none" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1 block">Phone</label>
                      <input name="phone" type="text" required className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs font-bold outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1 block">Email Address</label>
                    <input name="email" type="email" required className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs font-bold outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1 block">Role Profile</label>
                    <select 
                      name="role" 
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs font-bold outline-none appearance-none"
                    >
                      <option value="resident">Resident Member</option>
                      <option value="admin">Site Administrator</option>
                    </select>
                  </div>
                  {selectedRole === 'admin' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                    >
                      <label className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-1 block">Admin Authorization Code</label>
                      <input name="adminCode" type="password" required placeholder="Master Key Required" 
                             className="w-full bg-rose-50 border border-rose-100 rounded-xl p-3 text-xs font-bold outline-none placeholder:text-rose-200" />
                    </motion.div>
                  )}
                  <button type="submit" className="w-full bg-zinc-900 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg">
                    Initialize Enrollment
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex font-sans">
      {/* SIDEBAR */}
      <aside className={cn(
        "bg-white border-r border-zinc-200 transition-all duration-300 flex flex-col z-50 sticky top-0 h-screen",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-zinc-900 rounded-xl flex items-center justify-center shrink-0">
            <Building2 size={18} className="text-white" />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl text-zinc-900 tracking-tight">StayEase</span>}
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          <NavItem 
            icon={Home} 
            label={currentUser.role === 'admin' ? "Commander" : "My Portal"} 
            active={view === 'dashboard'} 
            onClick={() => setView('dashboard')} 
            collapsed={!isSidebarOpen} 
            colorClass="bg-indigo-600 shadow-indigo-600/30" 
          />
          
          {currentUser.role === 'admin' && (
            <>
              <NavItem icon={Building2} label="Inventory" active={view === 'rooms'} onClick={() => setView('rooms')} collapsed={!isSidebarOpen} colorClass="bg-emerald-600 shadow-emerald-600/30" />
              <NavItem icon={Users} label="Residents" active={view === 'residents'} onClick={() => setView('residents')} collapsed={!isSidebarOpen} colorClass="bg-purple-600 shadow-purple-600/30" />
              <NavItem icon={CreditCard} label="Finance" active={view === 'payments'} onClick={() => setView('payments')} collapsed={!isSidebarOpen} colorClass="bg-amber-500 shadow-amber-500/30" />
            </>
          )}

          {currentUser.role === 'resident' && (
            <>
              <NavItem icon={CreditCard} label="Payments" active={view === 'payments'} onClick={() => setView('payments')} collapsed={!isSidebarOpen} colorClass="bg-emerald-600 shadow-emerald-600/30" />
              <NavItem icon={Building2} label="My Unit" active={view === 'unit'} onClick={() => setView('unit')} collapsed={!isSidebarOpen} colorClass="bg-purple-600 shadow-purple-600/30" />
              <NavItem icon={UserCircle} label="Profile" active={view === 'profile'} onClick={() => setView('profile')} collapsed={!isSidebarOpen} colorClass="bg-amber-500 shadow-amber-500/30" />
            </>
          )}

          <NavItem icon={ClipboardList} label="Support" active={view === 'complaints'} onClick={() => setView('complaints')} collapsed={!isSidebarOpen} colorClass="bg-rose-600 shadow-rose-600/30" />
          <NavItem icon={Bell} label="Broadcasts" active={view === 'notices'} onClick={() => setView('notices')} collapsed={!isSidebarOpen} colorClass="bg-cyan-600 shadow-cyan-600/30" badge={notices.length} />
          <NavItem icon={Star} label="Insights" active={view === 'feedback'} onClick={() => setView('feedback')} collapsed={!isSidebarOpen} colorClass="bg-pink-600 shadow-pink-600/30" />
        </nav>

        <div className="p-4 border-t border-zinc-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-bold text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-400"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">{view}</h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-xl gap-2 text-zinc-400 focus-within:border-zinc-900 transition-all">
              <Search size={16} />
              <input type="text" placeholder="Quick search..." className="bg-transparent border-none outline-none text-sm w-48 text-zinc-900 font-medium" />
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-zinc-900">{currentUser.name}</p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">{currentUser.role} Account</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 font-bold overflow-hidden shadow-inner">
                {currentUser.name[0]}
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 pb-16 max-w-7xl mx-auto w-full">
          {view === 'dashboard' && (
            currentUser.role === 'admin' 
              ? <AdminDashboard stats={{ rooms, users, payments, complaints }} setView={setView} />
              : <ResidentDashboard user={currentUser} stats={{ rooms, users, payments, complaints }} setView={setView} />
          )}
          {view === 'rooms' && currentUser.role === 'admin' && <RoomsView rooms={rooms} setRooms={setRooms} />}
          {view === 'residents' && currentUser.role === 'admin' && <ResidentsView users={users} setUsers={setUsers} rooms={rooms} setRooms={setRooms} />}
          {view === 'payments' && <PaymentsView payments={payments} setPayments={setPayments} users={users} isAdmin={currentUser.role === 'admin'} currentUserId={currentUser.id} />}
          {view === 'complaints' && <ComplaintsView complaints={complaints} setComplaints={setComplaints} user={currentUser} users={users} isAdmin={currentUser.role === 'admin'} />}
          {view === 'notices' && <NoticesView notices={notices} setNotices={setNotices} isAdmin={currentUser.role === 'admin'} />}
          {view === 'feedback' && <FeedbackView feedbacks={feedbacks} setFeedbacks={setFeedbacks} user={currentUser} users={users} />}
          {view === 'unit' && currentUser.role === 'resident' && <UnitView user={currentUser} rooms={rooms} payments={payments} users={users} setPayments={setPayments} />}
          {view === 'profile' && <ProfileView user={currentUser} setUsers={setUsers} users={users} />}
        </div>
      </main>
    </div>
  );
}
