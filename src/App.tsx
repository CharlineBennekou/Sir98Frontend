import './App.css'
import ActivityList from './components/activities/ActivityList'
import { LoginComp } from './components/users/Login'
import { RegisterComp } from './components/users/Register'
import { CodeActivationComp } from './components/users/CodeActivated'
import ActivityTestingData from './components/activities/ActivityTestingData'
import {Navbar} from './components/layout/Navbar'
import { useState } from 'react'

function App() {
  return (
    <div className="app-root" style={{ maxWidth: 420, margin: '0 auto', padding: 16 }}>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
      />
      <main>
        <LoginComp/>
        <RegisterComp/>
        <CodeActivationComp/>
        <section style={{ marginBottom: 12 }}>
          <ActivityTestingData />
        </section>
        <ActivityList />
      </main>
    </div>
  )
}

export default App
