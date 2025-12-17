import './App.css'
import { Routes, Route } from 'react-router-dom';
import ActivityList from './pages/ActivityList'
import CreateActivityForm from './pages/CreateActivityForm';
import Dashboard from './pages/Dashboard';
import InstructorList from './pages/InstructorList';
import LoginPage from './pages/LoginPage';
import { Toaster } from 'react-hot-toast';
import { RegisterComp } from "./components/users/Register";
import CreateInstructorForm from './pages/CreateInstructorForm';
import UpdateInstructorForm from './pages/UpdateInstructorForm';
import UpdateActivityForm from './pages/UpdateActivityForm';
import AboutUs from './pages/AboutUs';
import AccountSettings from './pages/AccountSettings';


function App() {
  return (
    <div className="app-root" style={{ maxWidth: 420, margin: '0 auto', padding: 16 }}>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
      />
      <main>
          <Routes>
          <Route path="/" element={<Dashboard />} /> --- Nummer 1 ---
          <Route path="/create" element={<CreateActivityForm />} />
          <Route path="/aktiviteter" element={<ActivityList />} />
          <Route path="/instructor" element={<InstructorList />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterComp />} />
          <Route path="/create-instructor" element={<CreateInstructorForm />} />
          <Route path="/update-instructor/:id" element={<UpdateInstructorForm />} />
          <Route path="/update-activity/:id" element={<UpdateActivityForm />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/account-settings" element={<AccountSettings />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
