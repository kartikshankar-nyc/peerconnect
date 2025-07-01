import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Feed from './pages/Feed';
import CreatePost from './pages/CreatePost';
import Community from './pages/Community';
import Profile from './pages/Profile';

function App() {
    // Use basename for GitHub Pages deployment
    const basename = process.env.NODE_ENV === 'production' ? '/peernexus' : '';

    return (
        <AuthProvider>
            <Router basename={basename}>
                <div className="min-h-screen bg-gray-50">
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/feed" element={<Feed />} />
                            <Route path="/create" element={<CreatePost />} />
                            <Route path="/community/:id" element={<Community />} />
                            <Route path="/profile" element={<Profile />} />
                        </Routes>
                    </Layout>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App; 