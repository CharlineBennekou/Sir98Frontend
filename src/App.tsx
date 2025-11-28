import './App.css'
import { Routes, Route } from 'react-router-dom';
import ActivityList from './components/activities/ActivityList'
import CreateActivityForm from './components/activities/CreateActivityForm';
//import { Navigation } from './components/layout/Navigation'
import ActivityMenu from './components/activities/ActivityMenu';
import ActivityMenu2 from './components/activities/ActivityMenu2';

function App() {
  return (
    <div className="app-root" style={{ maxWidth: 420, margin: '0 auto', padding: 16 }}>
      
      <main>
        <Routes>
          <Route path="/" element={<ActivityMenu2 />} /> --- Nummer 1 ---

          <Route path="/2" element={<ActivityMenu />} /> --- Nummer 2 ---


          <Route path="/create" element={<CreateActivityForm />} />
          <Route path="/aktiviteter" element={<ActivityList />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
