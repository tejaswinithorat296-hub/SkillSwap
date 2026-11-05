import React, { useMemo, useState } from 'react';
import {
  ArrowRight, Bell, BookOpen, Check, ChevronDown, Code2, Compass, GraduationCap,
  Heart, LayoutDashboard, LogOut, Menu, MessageCircle, Plus, Search, Settings,
  Sparkles, Star, Users, X, Zap
} from 'lucide-react';

const starterStudents = [
  { id: 1, name: 'Aarav Mehta', branch: 'Computer Engineering', year: '3rd Year', teach: ['React', 'JavaScript', 'HTML & CSS'], learn: ['UI/UX Design', 'Python'], level: 'Intermediate', rating: 4.9, sessions: 18, bio: 'Frontend developer who loves turning ideas into clean, useful interfaces.', initials: 'AM', color: 'lavender' },
  { id: 2, name: 'Priya Sharma', branch: 'Information Technology', year: '2nd Year', teach: ['UI/UX Design', 'Figma', 'Canva'], learn: ['React', 'Photography'], level: 'Advanced', rating: 4.8, sessions: 24, bio: 'Design enthusiast helping people make digital products feel effortless.', initials: 'PS', color: 'peach' },
  { id: 3, name: 'Rohan Kulkarni', branch: 'Electronics Engineering', year: '3rd Year', teach: ['Arduino', 'IoT', 'C++'], learn: ['Python', 'Machine Learning'], level: 'Intermediate', rating: 4.7, sessions: 12, bio: 'Building small hardware projects and sharing what I learn along the way.', initials: 'RK', color: 'mint' },
  { id: 4, name: 'Ananya Iyer', branch: 'Computer Engineering', year: '4th Year', teach: ['Python', 'Machine Learning', 'SQL'], learn: ['Public Speaking', 'React'], level: 'Advanced', rating: 5.0, sessions: 31, bio: 'Curious about data, AI and making complex topics easier to understand.', initials: 'AI', color: 'blue' },
  { id: 5, name: 'Kabir Patel', branch: 'Mechanical Engineering', year: '2nd Year', teach: ['AutoCAD', 'SolidWorks', '3D Printing'], learn: ['Video Editing', 'Python'], level: 'Beginner', rating: 4.6, sessions: 9, bio: 'Mechanical design student interested in prototyping and product building.', initials: 'KP', color: 'yellow' },
  { id: 6, name: 'Meera Nair', branch: 'Electronics Engineering', year: '3rd Year', teach: ['Video Editing', 'Premiere Pro', 'Photography'], learn: ['Arduino', 'UI/UX Design'], level: 'Intermediate', rating: 4.9, sessions: 20, bio: 'I make videos for college clubs and can help you tell better stories.', initials: 'MN', color: 'pink' }
];

const categories = ['All skills', 'Programming', 'Web Development', 'Design', 'AI & Data', 'Electronics', 'Creative'];
const skillCategory = (skill) => {
  if (['React', 'JavaScript', 'HTML & CSS'].includes(skill)) return 'Web Development';
  if (['Python', 'Machine Learning', 'SQL'].includes(skill)) return 'AI & Data';
  if (['UI/UX Design', 'Figma', 'Canva'].includes(skill)) return 'Design';
  if (['Arduino', 'IoT', 'C++'].includes(skill)) return 'Electronics';
  if (['Video Editing', 'Premiere Pro', 'Photography'].includes(skill)) return 'Creative';
  return 'Programming';
};
const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};

function App() {
  const [page, setPage] = useState('home');
  const [students] = useState(starterStudents);
  const [user, setUser] = useState(() => read('ss_user', null));
  const [requests, setRequests] = useState(() => read('ss_requests', []));
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All skills');
  const [activeStudent, setActiveStudent] = useState(null);
  const [modal, setModal] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState('');

  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2600); };
  const go = (next) => { setPage(next); setMobileNav(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const filtered = useMemo(() => students.filter(s => {
    const matchesQuery = [s.name, s.branch, ...s.teach, ...s.learn].join(' ').toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === 'All skills' || s.teach.some(skill => skillCategory(skill) === category);
    return matchesQuery && matchesCategory;
  }), [students, query, category]);

  const saveUser = (data) => { localStorage.setItem('ss_user', JSON.stringify(data)); setUser(data); setModal(''); go('dashboard'); notify('Welcome to SkillSwap!'); };
  const logout = () => { localStorage.removeItem('ss_user'); setUser(null); go('home'); notify('You have logged out.'); };
  const sendRequest = (student, skill) => {
    if (!user) { setModal('login'); return; }
    const item = { id: Date.now(), studentId: student.id, studentName: student.name, skill, from: user.name, status: 'Pending' };
    const next = [item, ...requests]; setRequests(next); localStorage.setItem('ss_requests', JSON.stringify(next));
    setActiveStudent(null); notify(`Request sent to ${student.name}!`);
  };
  const updateRequest = (id, status) => {
    const next = requests.map(r => r.id === id ? { ...r, status } : r);
    setRequests(next); localStorage.setItem('ss_requests', JSON.stringify(next)); notify(`Request ${status.toLowerCase()}.`);
  };

  return <div className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={() => go('home')}><span className="brand-mark"><Zap size={19} fill="currentColor" /></span><span>skill<span className="brand-accent">swap</span></span></button>
      <button className="mobile-menu icon-btn" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle menu">{mobileNav ? <X /> : <Menu />}</button>
      <nav className={mobileNav ? 'nav-links open' : 'nav-links'}>
        <button className={page === 'home' ? 'nav-link active' : 'nav-link'} onClick={() => go('home')}>Home</button>
        <button className={page === 'explore' ? 'nav-link active' : 'nav-link'} onClick={() => go('explore')}>Explore skills</button>
        <button className="nav-link" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>How it works</button>
        {user ? <button className={page === 'dashboard' ? 'nav-link active' : 'nav-link'} onClick={() => go('dashboard')}>Dashboard</button> : null}
      </nav>
      <div className="top-actions">
        {user ? <><button className="icon-btn notification" onClick={() => go('dashboard')} aria-label="Notifications"><Bell size={19}/>{requests.some(r => r.status === 'Pending') && <i/>}</button><button className="user-chip" onClick={() => go('dashboard')}><span className="mini-avatar">{user.name?.slice(0,1).toUpperCase()}</span><span>{user.name?.split(' ')[0]}</span><ChevronDown size={14}/></button><button className="btn btn-outline btn-small" onClick={logout}>Log out</button></> :
        <><button className="btn btn-ghost btn-small" onClick={() => setModal('login')}>Log in</button><button className="btn btn-primary btn-small" onClick={() => setModal('signup')}>Join for free <ArrowRight size={15}/></button></>}
      </div>
    </header>

    {page === 'home' && <main>
      <section className="hero section-wrap">
        <div className="hero-copy"><div className="eyebrow"><Sparkles size={14}/> THE CAMPUS SKILL COMMUNITY</div>
          <h1>Learn together.<br/><span>Grow together.</span></h1>
          <p className="hero-text">Your next skill is closer than you think. Exchange knowledge with students around you, learn something new, and teach what you love.</p>
          <div className="hero-actions"><button className="btn btn-primary btn-large" onClick={() => user ? go('explore') : setModal('signup')}>Start swapping <ArrowRight size={17}/></button><button className="btn btn-outline btn-large" onClick={() => go('explore')}><Compass size={17}/> Explore skills</button></div>
          <div className="social-proof"><div className="avatar-stack"><span className="avatar a1">A</span><span className="avatar a2">P</span><span className="avatar a3">R</span><span className="avatar a4">M</span></div><div><div className="proof-stars">★★★★★</div><small>Built for curious students</small></div></div>
        </div>
        <div className="hero-art">
          <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
          <div className="float-card float-top"><span className="float-icon purple"><Code2 size={18}/></span><div><b>React basics</b><small>Skill being shared</small></div><span className="online-dot"/></div>
          <div className="swap-visual"><div className="swap-person person-left"><div className="person-face face-one">A</div><b>Alex</b><small>Teaches coding</small></div><div className="swap-center"><div className="swap-arrow"><ArrowRight size={22}/></div><div className="swap-arrow reverse"><ArrowRight size={22}/></div><span>SWAP</span></div><div className="swap-person person-right"><div className="person-face face-two">S</div><b>Sam</b><small>Teaches design</small></div></div>
          <div className="float-card float-bottom"><span className="float-icon orange"><Sparkles size={18}/></span><div><b>New connection!</b><small>Learning goes both ways</small></div><span className="tiny-check"><Check size={13}/></span></div>
          <div className="art-caption">A community where everyone has something to teach.</div>
        </div>
      </section>

      <section className="stats-strip section-wrap"><div><strong>01</strong><span>Share what you know</span></div><div><strong>02</strong><span>Find what you need</span></div><div><strong>03</strong><span>Grow side by side</span></div></section>

      <section className="section-wrap section-block" id="how-it-works"><div className="section-heading"><div><div className="eyebrow">SIMPLE BY DESIGN</div><h2>Learning is better <span>together.</span></h2></div><p>No course fees. No complicated process.<br/>Just students helping students.</p></div>
        <div className="steps-grid"><article className="step-card"><span className="step-number">01</span><div className="step-icon lavender-bg"><UserIcon/></div><h3>Create your profile</h3><p>Tell the community what you know and what you'd love to learn next.</p></article><article className="step-card"><span className="step-number">02</span><div className="step-icon peach-bg"><Search size={23}/></div><h3>Find your match</h3><p>Discover students whose skills match your learning goals.</p></article><article className="step-card"><span className="step-number">03</span><div className="step-icon mint-bg"><Zap size={23}/></div><h3>Swap and grow</h3><p>Connect, share knowledge, and celebrate each other's progress.</p></article></div>
      </section>
      <section className="cta-band section-wrap"><div><div className="eyebrow light">YOUR SKILLS HAVE VALUE</div><h2>Know something?<br/>Teach someone.</h2><p>Start with one skill. Find your people. Build something amazing together.</p></div><button className="btn btn-white btn-large" onClick={() => user ? go('dashboard') : setModal('signup')}>Join SkillSwap <ArrowRight size={17}/></button><div className="cta-spark">✳</div></section>
    </main>}

    {page === 'explore' && <main className="section-wrap page-content">
      <div className="page-title-row"><div><div className="eyebrow">FIND YOUR NEXT LEARNING PARTNER</div><h1 className="page-title">Explore <span>skills.</span></h1><p className="muted">Meet students who are ready to share what they know.</p></div><button className="btn btn-primary" onClick={() => user ? notify('Your profile is ready to add skills from the dashboard.') : setModal('signup')}><Plus size={17}/> Share a skill</button></div>
      <div className="search-row"><div className="search-box"><Search size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search skills, students or branches..."/>{query && <button onClick={() => setQuery('')}><X size={16}/></button>}</div><span className="result-count">{filtered.length} students found</span></div>
      <div className="filter-row">{categories.map(c => <button key={c} className={category === c ? 'filter-chip selected' : 'filter-chip'} onClick={() => setCategory(c)}>{c}</button>)}</div>
      <div className="student-grid">{filtered.map(s => <StudentCard key={s.id} student={s} onOpen={() => setActiveStudent(s)} onRequest={() => user ? setActiveStudent(s) : setModal('login')}/>)}</div>
      {filtered.length === 0 && <div className="empty-state"><Search size={30}/><h3>No matches just yet</h3><p>Try another keyword or choose a different category.</p><button className="btn btn-outline" onClick={() => {setQuery('');setCategory('All skills')}}>Clear filters</button></div>}
    </main>}

    {page === 'dashboard' && <main className="section-wrap page-content">
      {!user ? <div className="empty-state"><GraduationCap size={36}/><h2>Your student space is waiting.</h2><p>Log in or create an account to open your dashboard.</p><button className="btn btn-primary" onClick={() => setModal('login')}>Log in</button></div> :
      <><div className="dashboard-welcome"><div><div className="eyebrow">YOUR SKILLS, YOUR COMMUNITY</div><h1>Hey, {user.name?.split(' ')[0]} <span>✳</span></h1><p className="muted">Here's what's happening in your learning journey.</p></div><button className="btn btn-primary" onClick={() => go('explore')}><Compass size={17}/> Find a skill</button></div>
      <div className="dash-stats"><div className="dash-stat"><span className="stat-icon lavender-bg"><BookOpen/></span><div><small>My learning requests</small><strong>{requests.length}</strong></div></div><div className="dash-stat"><span className="stat-icon peach-bg"><Users/></span><div><small>Connections</small><strong>{new Set(requests.map(r => r.studentId)).size}</strong></div></div><div className="dash-stat"><span className="stat-icon mint-bg"><Zap/></span><div><small>SkillSwap credits</small><strong>20</strong></div></div></div>
      <div className="dashboard-columns"><section className="panel"><div className="panel-heading"><div><h2>My exchange requests</h2><p>Keep track of your learning connections.</p></div><span className="count-pill">{requests.length}</span></div>
        {requests.length ? requests.map(r => <div className="request-row" key={r.id}><div className="mini-avatar">{r.studentName.slice(0,1)}</div><div className="request-info"><b>{r.skill}</b><small>Request to {r.studentName}</small></div><span className={'status '+r.status.toLowerCase()}>{r.status}</span></div>) : <div className="panel-empty"><div className="empty-illustration"><Users size={25}/></div><b>Your first skill exchange starts here.</b><p>Explore the community and send a request to someone you'd like to learn from.</p><button className="text-link" onClick={() => go('explore')}>Explore students <ArrowRight size={15}/></button></div>}
      </section><section className="panel profile-panel"><div className="panel-heading"><div><h2>Your profile</h2><p>Make it easy for others to find you.</p></div><button className="icon-btn" onClick={() => notify('Profile editing is coming in the next build.')}><Settings size={18}/></button></div><div className="profile-summary"><div className="profile-big">{user.name?.slice(0,1).toUpperCase()}</div><h3>{user.name}</h3><p>{user.branch || 'Engineering student'} · {user.year || 'Student'}</p><span className="profile-email">{user.email}</span></div><div className="profile-tip"><Sparkles size={17}/><span><b>Pro tip</b> Add skills you can teach and want to learn to get better matches.</span></div><button className="btn btn-outline full-width" onClick={() => go('explore')}>Discover your next skill <ArrowRight size={15}/></button></section></div></>}
    </main>}

    <footer className="footer"><div className="section-wrap footer-inner"><button className="brand footer-brand" onClick={() => go('home')}><span className="brand-mark"><Zap size={18} fill="currentColor"/></span><span>skill<span className="brand-accent">swap</span></span></button><span>Made for curious minds. © 2025 SkillSwap.</span><div><button onClick={() => go('home')}>Home</button><button onClick={() => go('explore')}>Explore</button></div></div></footer>

    {activeStudent && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setActiveStudent(null)}><div className="modal student-modal"><button className="modal-close" onClick={() => setActiveStudent(null)}><X/></button><div className="student-modal-head"><div className={'student-avatar '+activeStudent.color}>{activeStudent.initials}</div><div><h2>{activeStudent.name}</h2><p>{activeStudent.branch} · {activeStudent.year}</p><div className="rating"><Star size={14} fill="currentColor"/> {activeStudent.rating} <span>({activeStudent.sessions} sessions)</span></div></div></div><p className="student-bio">{activeStudent.bio}</p><div className="modal-section"><b>Can teach you</b><div className="tag-list">{activeStudent.teach.map(t => <span className="skill-tag" key={t}>{t}</span>)}</div></div><div className="modal-section"><b>Wants to learn</b><div className="tag-list">{activeStudent.learn.map(t => <span className="skill-tag pale" key={t}>{t}</span>)}</div></div><div className="modal-section"><label htmlFor="skill-choice">Choose a skill to learn</label><select id="skill-choice" defaultValue={activeStudent.teach[0]}>{activeStudent.teach.map(t => <option key={t}>{t}</option>)}</select></div><button className="btn btn-primary full-width" onClick={() => sendRequest(activeStudent, document.getElementById('skill-choice')?.value || activeStudent.teach[0])}>Send exchange request <ArrowRight size={16}/></button></div></div>}

    {modal && <AuthModal mode={modal} onClose={() => setModal('')} onMode={setModal} onSubmit={saveUser}/>}
    {toast && <div className="toast"><span><Check size={16}/></span>{toast}</div>}
  </div>;
}

function UserIcon() { return <GraduationCap size={24}/>; }

function StudentCard({ student, onOpen, onRequest }) {
  return <article className="student-card"><div className="card-top"><div className={'student-avatar '+student.color}>{student.initials}</div><span className="level-pill">{student.level}</span></div><h3>{student.name}</h3><p className="student-meta">{student.branch} · {student.year}</p><div className="rating"><Star size={14} fill="currentColor"/> {student.rating} <span>· {student.sessions} sessions</span></div><div className="card-divider"/><small className="card-label">CAN TEACH</small><div className="tag-list">{student.teach.slice(0,3).map(t => <span className="skill-tag" key={t}>{t}</span>)}</div><div className="card-actions"><button className="btn btn-outline btn-small" onClick={onOpen}>View profile</button><button className="btn btn-primary btn-small" onClick={onRequest}>Request swap <ArrowRight size={14}/></button></div></article>;
}

function AuthModal({ mode, onClose, onMode, onSubmit }) {
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [branch, setBranch] = useState('Computer Engineering'); const [year, setYear] = useState('2nd Year'); const [error, setError] = useState('');
  const signup = mode === 'signup';
  const submit = e => { e.preventDefault(); setError(''); if (!email.includes('@') || password.length < 6 || (signup && name.trim().length < 2)) { setError('Enter a valid email, a password of 6+ characters, and your name.'); return; } onSubmit({ name: signup ? name.trim() : (email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())), email, branch, year }); };
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}><div className="modal auth-modal"><button className="modal-close" onClick={onClose}><X/></button><div className="auth-logo"><span className="brand-mark"><Zap size={18} fill="currentColor"/></span></div><div className="eyebrow">{signup ? 'JOIN THE COMMUNITY' : 'WELCOME BACK'}</div><h2>{signup ? 'Create your account.' : 'Good to see you again.'}</h2><p className="muted">{signup ? 'Start sharing skills and discovering new ones.' : 'Log in to continue your learning journey.'}</p><form onSubmit={submit}>{signup && <label>Full name<input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Aditi Sharma"/></label>}<label>College email<input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@college.edu"/></label><label>Password<input required type="password" minLength="6" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters"/></label>{signup && <><label>Engineering branch<select value={branch} onChange={e => setBranch(e.target.value)}><option>Computer Engineering</option><option>Information Technology</option><option>Electronics Engineering</option><option>Mechanical Engineering</option><option>Civil Engineering</option><option>Electrical Engineering</option></select></label><label>Year of study<select value={year} onChange={e => setYear(e.target.value)}><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option></select></label></>}{error && <div className="form-error">{error}</div>}<button className="btn btn-primary full-width btn-large" type="submit">{signup ? 'Create account' : 'Log in'} <ArrowRight size={16}/></button></form><p className="auth-switch">{signup ? 'Already a member?' : 'New to SkillSwap?'} <button onClick={() => onMode(signup ? 'login' : 'signup')}>{signup ? 'Log in' : 'Create an account'}</button></p><small className="demo-note">Demo starter: account data is saved in this browser only.</small></div></div>;
}

export default App;
