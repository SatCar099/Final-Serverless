import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Resources from './pages/Resources.jsx';
import MoodTracker from './pages/MoodTracker.jsx';
import SelfAssessment from './pages/SelfAssessment.jsx';
import Helplines from './pages/Helplines.jsx';
import CommunityWall from './pages/CommunityWall.jsx';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/mood" element={<MoodTracker />} />
          <Route path="/assessment" element={<SelfAssessment />} />
          <Route path="/helplines" element={<Helplines />} />
          <Route path="/community" element={<CommunityWall />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
