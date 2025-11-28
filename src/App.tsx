import './App.css'
import { Routes, Route } from 'react-router-dom';
import ActivityList from './pages/ActivityList'
import CreateActivityForm from './pages/CreateActivityForm';
import Dashboard from './pages/Dashboard';
import InstructorList from './pages/InstructorList';

function App() {
  return (
    <div className="app-root" style={{ maxWidth: 420, margin: '0 auto', padding: 16 }}>
      
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} /> --- Nummer 1 ---

          <Route path="/create" element={<CreateActivityForm />} />
          <Route path="/aktiviteter" element={<ActivityList />} />
          <Route path="/instructor" element={<InstructorList />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
