import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Button, Image } from 'react-bootstrap'; 
import BookGrid from './pages/BookGrid.jsx';
import LoginModal from './components/LoginModal.jsx';
import logo from './assets/livros.png'; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(true); 

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowLoginModal(true); 
  };

  return (
    <Router>
      <div className="App">
        {/* Cabeçalho */}
        <header className="bg-primary p-3 text-white d-flex justify-content-between align-items-center">
          <Image src={logo} width="100" alt="Logo do App" rounded />
          <h1>Bookstore</h1>
          {isLoggedIn && (
            <Button variant="light" onClick={handleLogout}>Sair</Button>
          )}
        </header>

        {/* Modal de Login */}
        <LoginModal 
          show={showLoginModal && !isLoggedIn}
          onHide={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />

        {/* Roteamento */}
        <Routes>
          <Route 
            path="/" 
            element={isLoggedIn ? <BookGrid /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/login" 
            element={isLoggedIn ? <Navigate to="/" /> : (
                <div className="p-5 text-center">
                    <h2>Bem-vindo. Clique para Logar.</h2>
                    {/* Componente Button do React-Bootstrap */}
                    <Button onClick={() => setShowLoginModal(true)}>Abrir Tela de Login</Button>
                </div>
            )} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;