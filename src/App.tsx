import './App.css'
import ActivityList from './components/activities/ActivityList'
import { LoginComp } from './components/users/Login'
import ActivityTestingData from './components/activities/ActivityTestingData'
import {Navbar} from './components/layout/Navbar'
import { useState } from 'react'

function App() {
  const [currentTab, setCurrentTab] =  useState<string>('overview');
  return (
    <div className="app-root" style={{ maxWidth: 420, margin: '0 auto', padding: 16 }}>
      <Navbar current={currentTab} onChange={setCurrentTab} />
      <header style={{ textAlign: 'center', marginBottom: 8 }}>
        <h1>Sir 98 - Aktiviteter</h1>
      </header>

      <main>
        <LoginComp/>
        <section style={{ marginBottom: 12 }}>
          <ActivityTestingData />
        </section>
        <ActivityList />
      </main>
    </div>
  )
}
export default App
