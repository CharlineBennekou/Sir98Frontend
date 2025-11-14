import './App.css'
import ActivityList from './components/activities/ActivityList'

function App() {
  return (
    <div className="app-root" style={{ maxWidth: 420, margin: '0 auto', padding: 16 }}>
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
