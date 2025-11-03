import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap'; 
// Importa o serviço de autenticação
import { login } from '../services/authService'; 

function LoginModal({ show, onHide, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // Agora armazena o erro da API
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
        // ** Chamada ao  back-end **
        const response = await login(username, password);
        
        alert(response.data.message);
        
        // Neste ponto se armazenaria os dados de autenticação (ex: token/usuário)
        console.log("Usuário Logado:", response.data.user); 

        onLoginSuccess(); // Chama a função que fecha o modal e muda o estado de login
        
    } catch (err) {
        // O erro pode ser 401 (não autorizado) ou 500 (servidor)
        console.error("Erro no login:", err);

        // Verifica se há uma mensagem de erro específica no corpo da resposta
        if (err.response && err.response.data && err.response.data.message) {
            setError(err.response.data.message); // Ex: "Nome de usuário ou senha inválidos."
        } else {
            setError('Falha ao conectar-se ao servidor de login.');
        }

    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>Login do Sistema</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Exibe o erro da API */}
        {error && <Alert variant="danger">{error}</Alert>} 
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Usuário</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Digite o usuário" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Senha</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </Form.Group>
          {/* O botão fica desabilitado durante o carregamento */}
          <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default LoginModal;