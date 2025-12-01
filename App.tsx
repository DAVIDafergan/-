
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { NewsTicker } from './components/NewsTicker';
import { Home } from './pages/Home';
import { Article } from './pages/Article';
import { CategoryPage } from './pages/CategoryPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Contact } from './pages/Contact';
import { AccessibilityWidget } from './components/AccessibilityWidget';
import { INITIAL_POSTS, INITIAL_ADS, INITIAL_COMMENTS, INITIAL_USERS, INITIAL_MESSAGES, INITIAL_SUBSCRIBERS } from './services/mockData';
import { Post, Ad, User, Comment, ContactMessage, Category, NewsletterSubscriber, AccessibilitySettings } from './types';
import { AppContext } from './context/AppContext';

// Admin Credentials (Hardcoded)
const ADMIN_USER = 'SMULIK8181';
const ADMIN_PASS = '8181';

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [ads, setAds] = useState<Ad[]>(INITIAL_ADS);
  const [user, setUser] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(INITIAL_USERS);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(INITIAL_MESSAGES);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<NewsletterSubscriber[]>(INITIAL_SUBSCRIBERS);
  
  // Accessibility State
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    fontSize: 0,
    highContrast: false,
    grayscale: false,
    highlightLinks: false,
    stopAnimations: false,
  });

  // Persistence
  useEffect(() => {
    const savedPosts = localStorage.getItem('zfat_posts');
    if (savedPosts) setPosts(JSON.parse(savedPosts));
    
    const savedAds = localStorage.getItem('zfat_ads');
    if (savedAds) setAds(JSON.parse(savedAds));

    const savedUser = localStorage.getItem('zfat_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedComments = localStorage.getItem('zfat_comments');
    if (savedComments) setComments(JSON.parse(savedComments));

    const savedUsersDB = localStorage.getItem('zfat_users_db');
    if (savedUsersDB) setRegisteredUsers(JSON.parse(savedUsersDB));

    const savedMessages = localStorage.getItem('zfat_messages');
    if (savedMessages) setContactMessages(JSON.parse(savedMessages));

    const savedSubs = localStorage.getItem('zfat_subscribers');
    if (savedSubs) setNewsletterSubscribers(JSON.parse(savedSubs));
  }, []);

  useEffect(() => { localStorage.setItem('zfat_posts', JSON.stringify(posts)); }, [posts]);
  useEffect(() => { localStorage.setItem('zfat_ads', JSON.stringify(ads)); }, [ads]);
  useEffect(() => { 
    if (user) localStorage.setItem('zfat_user', JSON.stringify(user));
    else localStorage.removeItem('zfat_user');
  }, [user]);
  useEffect(() => { localStorage.setItem('zfat_comments', JSON.stringify(comments)); }, [comments]);
  useEffect(() => { localStorage.setItem('zfat_users_db', JSON.stringify(registeredUsers)); }, [registeredUsers]);
  useEffect(() => { localStorage.setItem('zfat_messages', JSON.stringify(contactMessages)); }, [contactMessages]);
  useEffect(() => { localStorage.setItem('zfat_subscribers', JSON.stringify(newsletterSubscribers)); }, [newsletterSubscribers]);

  const addPost = (post: Post) => {
    setPosts(prev => [post, ...prev]);
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const incrementViews = (id: string) => {
    setPosts(prev => prev.map(post => 
      post.id === id ? { ...post, views: (post.views || 0) + 1 } : post
    ));
  };

  const updateAd = (id: string, updates: Partial<Ad>) => {
    setAds(prev => prev.map(ad => ad.id === id ? { ...ad, ...updates } : ad));
  };

  const createAd = (ad: Ad) => {
    setAds(prev => [...prev, ad]);
  };

  const deleteAd = (id: string) => {
    setAds(prev => prev.filter(a => a.id !== id));
  };

  const login = (usernameOrEmail: string, password: string): boolean => {
    // Check Admin
    if (usernameOrEmail === ADMIN_USER && password === ADMIN_PASS) {
      setUser({ id: 'admin1', name: 'מנהל ראשי', role: 'admin', isAuthenticated: true });
      return true;
    }

    // Check Registered Users
    const foundUser = registeredUsers.find(u => (u.email === usernameOrEmail || u.name === usernameOrEmail) && u.password === password);
    if (foundUser) {
      setUser({ ...foundUser, isAuthenticated: true });
      return true;
    }

    return false;
  };

  const register = (newUser: User): boolean => {
    if (registeredUsers.some(u => u.email === newUser.email)) {
      return false; // User exists
    }
    setRegisteredUsers(prev => [...prev, newUser]);
    setUser({ ...newUser, isAuthenticated: true });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const addComment = (comment: Comment) => {
    setComments(prev => [...prev, comment]);
  };

  const toggleLikeComment = (commentId: string) => {
    if (!user) return;
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        const hasLiked = c.likedBy.includes(user.id);
        return {
          ...c,
          likes: hasLiked ? c.likes - 1 : c.likes + 1,
          likedBy: hasLiked ? c.likedBy.filter(id => id !== user.id) : [...c.likedBy, user.id]
        };
      }
      return c;
    }));
  };

  const addContactMessage = (msg: ContactMessage) => {
    setContactMessages(prev => [msg, ...prev]);
  };

  const subscribeToNewsletter = (email: string) => {
    if (newsletterSubscribers.some(s => s.email === email)) return false;
    setNewsletterSubscribers(prev => [...prev, {
      id: Date.now().toString(),
      email,
      joinedDate: new Date().toLocaleDateString('he-IL'),
      isActive: true
    }]);
    return true;
  };

  const sendNewsletter = (subject: string, content: string, postId?: string) => {
    console.log(`Sending Newsletter to ${newsletterSubscribers.length} subscribers.`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${content}`);
    if (postId) console.log(`Linked Post: ${postId}`);
    alert(`הניוזלטר נשלח בהצלחה ל-${newsletterSubscribers.length} מנויים!`);
  };

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // In a real app, you might redirect to a search results page
    // navigate(`/search?q=${query}`);
  };

  // Accessibility Handlers
  const toggleAccessibilityOption = (option: keyof AccessibilitySettings) => {
    if (option === 'fontSize') return; // Handled separately
    setAccessibility(prev => ({ ...prev, [option]: !prev[option] }));
  };

  const setFontSize = (size: number) => {
    setAccessibility(prev => ({ ...prev, fontSize: size }));
  };

  const resetAccessibility = () => {
    setAccessibility({
      fontSize: 0,
      highContrast: false,
      grayscale: false,
      highlightLinks: false,
      stopAnimations: false,
    });
  };

  // Apply Accessibility Classes to Body
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Font Size (CSS variable)
    const scale = accessibility.fontSize === 0 ? 1 : accessibility.fontSize === 1 ? 1.15 : 1.3;
    root.style.setProperty('--font-scale', scale.toString());

    // Toggle Classes
    body.classList.toggle('a11y-grayscale', accessibility.grayscale);
    body.classList.toggle('a11y-high-contrast', accessibility.highContrast);
    body.classList.toggle('a11y-highlight-links', accessibility.highlightLinks);
    body.classList.toggle('a11y-stop-animations', accessibility.stopAnimations);

  }, [accessibility]);


  // Filter posts for ticker: Only show 'מבזקים'
  const tickerPosts = posts.filter(p => p.category === Category.NEWS);

  return (
    <AppContext.Provider value={{ 
      posts, ads, user, comments, registeredUsers, contactMessages, newsletterSubscribers, accessibility,
      addPost, deletePost, incrementViews, updateAd, createAd, deleteAd, login, logout, register, 
      addComment, toggleLikeComment, addContactMessage, subscribeToNewsletter, sendNewsletter,
      toggleAccessibilityOption, setFontSize, resetAccessibility
    }}>
      <HashRouter>
        <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-[#f8f9fa] relative">
          
          {/* Skip Link for Accessibility */}
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-1/2 focus:-translate-x-1/2 focus:bg-yellow-400 focus:text-black focus:px-4 focus:py-2 focus:z-[100] focus:rounded font-bold shadow-xl">
            דלג לתוכן הראשי
          </a>

          <Header onSearch={handleSearch} user={user} />
          
          <div className="hidden md:block">
            {/* NewsTicker only shows active flash news */}
            <NewsTicker posts={tickerPosts.slice(0, 10)} />
          </div>
          
          <main id="main-content" className="flex-1 w-full max-w-[100vw] overflow-x-hidden focus:outline-none" tabIndex={-1}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/article/:id" element={<Article />} />
              <Route path="/category/:categoryName" element={<CategoryPage />} />
              <Route path="/admin" element={user && user.role === 'admin' ? <AdminDashboard /> : <Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <footer className="bg-[#111] text-gray-400 py-16 mt-12 border-t-8 border-red-700">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-right">
              <div>
                <div className="mb-6 flex justify-center md:justify-start">
                   <img 
                    src="logo.png" 
                    alt="צפת בתנופה" 
                    className="h-16 md:h-20 w-auto object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }} 
                   />
                   {/* Fallback Footer Logo */}
                   <div className="hidden text-white leading-none">
                     <h3 className="text-3xl font-black tracking-tight">צפת<span className="text-red-600">בתנופה</span></h3>
                   </div>
                </div>
                <p className="text-sm leading-relaxed text-gray-400">האתר המוביל לחדשות, תרבות וקהילה בצפת והגליל. אנחנו כאן בשבילכם.</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-6 border-b border-gray-800 pb-2 inline-block">ניווט מהיר</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="hover:text-red-500 transition">אודות</a></li>
                  <li><a href="/#/contact" className="hover:text-red-500 transition">צור קשר</a></li>
                  <li><a href="#" className="hover:text-red-500 transition">פרסום באתר</a></li>
                </ul>
              </div>
               <div>
                <h4 className="text-white font-bold mb-6 border-b border-gray-800 pb-2 inline-block">קטגוריות</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="/#/category/מבזקים" className="hover:text-red-500 transition">מבזקים</a></li>
                  <li><a href="/#/category/נדלן" className="hover:text-red-500 transition">נדל"ן</a></li>
                  <li><a href="/#/category/ספורט" className="hover:text-red-500 transition">ספורט</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-6 border-b border-gray-800 pb-2 inline-block">הירשמו לניוזלטר</h4>
                <input type="email" placeholder="הכנס אימייל..." className="w-full bg-gray-800 border border-gray-700 focus:border-red-600 rounded p-3 mb-3 text-white outline-none transition" />
                <button 
                  onClick={() => alert('תודה על הרשמתך!')}
                  className="w-full bg-red-700 text-white font-bold py-3 rounded hover:bg-red-800 transition shadow-lg hover:shadow-red-900/20"
                >
                  הרשמה
                </button>
              </div>
            </div>
            <div className="container mx-auto px-4 mt-16 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs gap-4">
              <p>&copy; {new Date().getFullYear()} צפת בתנופה. כל הזכויות שמורות.</p>
              <p className="font-bold text-gray-500 hover:text-white transition-colors cursor-default">
                פיתוח ובנייה: DA פרויקטים ויזמות
              </p>
            </div>
          </footer>

          {/* Global Accessibility Widget */}
          <AccessibilityWidget />
        </div>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;
