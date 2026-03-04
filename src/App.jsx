import Navbar from './components/Navbar'
import DocumentViewer from './components/DocumentViewer'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-400 to-amber-500">
      <Navbar />
      <DocumentViewer />
    </div>
  )
}

export default App