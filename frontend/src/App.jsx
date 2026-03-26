import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Dashboard from './pages/Dashboard';
import Send from './pages/Send';
import  ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home';
function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/signup" element={<Signup/> } />
        <Route path="/signin" element={<Signin/> } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
          <Dashboard/>
          </ProtectedRoute>
        }/>
        <Route path="/send" element={<Send/> } />
      </Routes>
    </BrowserRouter>
    
    </>
  )
}

export default App
