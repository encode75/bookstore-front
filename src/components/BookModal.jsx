// src/components/BookModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { createBook, updateBook } from '../services/booksService';

/**
 * Componente modal para inclusão ou edição de livros.
 * @param {boolean} show - Controla a visibilidade do modal.
 * @param {function} onHide - Função para fechar o modal.
 * @param {function} onSaveSuccess - Função chamada após a inclusão/edição bem-sucedida.
 * @param {object | null} bookToEdit - Objeto do livro para edição, ou null para inclusão.
 */
function BookModal({ show, onHide, onSaveSuccess, bookToEdit }) {
  // Inicializa o estado com o livro a ser editado ou com valores vazios para um novo livro
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    year: 0,
    publisher: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Determina se estamos em modo de edição
  const isEditing = !!bookToEdit;

  // Efeito para preencher o formulário quando um livro para edição for passado
  useEffect(() => {
    if (bookToEdit) {
      setFormData({
        title: bookToEdit.title || '',
        author: bookToEdit.author || '',
        isbn: bookToEdit.isbn || '',
        year: bookToEdit.year || 0,
        publisher: bookToEdit.publisher
      });
    } else {
      // Limpa o formulário se for um novo livro
      setFormData({ title: '', author: '', isbn: '' , year: 0});
    }
    setError(null);
  }, [bookToEdit, show]); // Depende do livro a ser editado e do status de exibição

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isEditing) {
        // Modo Edição (PUT)
        await updateBook(bookToEdit._id, formData);
        alert('Livro atualizado com sucesso!');
      } else {
        // Modo Inclusão (POST)
        await createBook(formData);
        alert('Livro incluído com sucesso!');
      }

      onSaveSuccess(); // Recarrega a lista e fecha o modal
    } catch (err) {
      console.error(`Erro ao ${isEditing ? 'atualizar' : 'incluir'} livro:`, err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(`Falha ao conectar-se ao servidor.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Editar Livro' : 'Incluir Novo Livro'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          {/* Campo Título */}
          <Form.Group className="mb-3">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Digite o título"
              required
            />
          </Form.Group>

          {/* Campo Autor */}
          <Form.Group className="mb-3">
            <Form.Label>Autor</Form.Label>
            <Form.Control
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Digite o nome do autor"
              required
            />
          </Form.Group>

          {/* Campo ISBN */}
          <Form.Group className="mb-3">
            <Form.Label>ISBN</Form.Label>
            <Form.Control
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="Digite o ISBN"
              required
            />
          </Form.Group>

          {/* <<< CAMPO YEAR (NUMBER) >>> */}
          <Form.Group className="mb-3">
            <Form.Label>Ano de Publicação</Form.Label>
            <Form.Control
              type="number" // Tipo number para forçar o teclado numérico em mobile
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="Ex: 2023"
              min="0000" // Restrição mínima
              max={new Date().getFullYear()} // Restrição máxima
              required
            />
          </Form.Group>

          {/* <<< CAMPO PUBLISHER (STRING) >>> */}
          <Form.Group className="mb-3">
            <Form.Label>Editora (Publisher)</Form.Label>
            <Form.Control
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              placeholder="Ex: Companhia das Letras"
              required
            />
          </Form.Group>

          {/* Botão de Envio */}
          <Button variant="primary" type="submit" className="w-100 mt-3" disabled={isLoading}>
            {isLoading ? (isEditing ? 'Salvando...' : 'Incluindo...') : (isEditing ? 'Salvar Alterações' : 'Incluir Livro')}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default BookModal;