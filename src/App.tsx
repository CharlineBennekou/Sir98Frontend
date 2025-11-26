import './App.css'
import ActivityList from './components/activities/ActivityList'
//import {Navbar} from './components/layout/Navbar'
import {Navigation} from './components/layout/Navigation'
import { useState } from 'react'

function App() {
  const [currentTab, setCurrentTab] =  useState<string>('overview');
  return (
    <div className="app-root" style={{ maxWidth: 420, margin: '0 auto', padding: 16 }}>
      <Navigation />
      {/* <Navbar current={currentTab} onChange={setCurrentTab} /> */}
      <header style={{ textAlign: 'center', marginBottom: 8 }}>
        <h1>Sir 98 - Aktiviteter</h1>
      </header>

      <main>
        
        <ActivityList />
      </main>
    </div>
  )
}
export default App
