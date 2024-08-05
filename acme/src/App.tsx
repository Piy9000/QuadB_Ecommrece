import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './core/components/home/Home';
import Navbar from './core/ui/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
