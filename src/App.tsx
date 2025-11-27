import './App.css'
import { Routes, Route } from 'react-router-dom';
import ActivityList from './components/activities/ActivityList'
import CreateActivityForm from './components/activities/CreateActivityForm';
import { Navigation } from './components/layout/Navigation'
import ActivityMenu from './components/activities/ActivityMenu';

function App() {
  return (
    <div className="app-root" style={{ maxWidth: 420, margin: '0 auto', padding: 16 }}>
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<ActivityList />} />
          <Route path="/create" element={<CreateActivityForm />} />
          <Route path="/menu" element={<ActivityMenu />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
