import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Alert } from 'react-bootstrap'; 
import { getAllBooks, deleteBook } from '../services/booksService'; 
import BookModal from '../components/BookModal'; 
import { MdEdit, MdDelete } from "react-icons/md";

function BookGrid() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // === Estados definidos para o Modal ===
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null); // Armazena o livro a ser editado
  // ==================================

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await getAllBooks();
      setBooks(response.data); 
      setError(null);
    } catch (err) {
      setError("Erro ao carregar os livros. Verifique a conexão com o back-end.");
      console.error("Erro na API:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []); 

  // Função para fechar o modal e limpar o estado de edição
  const handleHideModal = () => {
    setShowBookModal(false);
    setBookToEdit(null);
  };
  
  // Função chamada após a inclusão/edição
  const handleSaveSuccess = () => {
    handleHideModal();
    fetchBooks(); // Recarrega a lista de livros
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Confirma a exclusão do livro ID: ${id}?`)) {
      try {
        await deleteBook(id);
        alert('Livro excluído com sucesso!');
        fetchBooks(); 
      } catch (err) {
        setError("Erro ao excluir. O livro pode não existir.");
        console.error(err);
      }
    }
  };

  const handleEdit = (book) => {
    // Define o livro a ser editado e abre o modal
    console.log('Editar: ');
    console.log(book);
    setBookToEdit(book);
    setShowBookModal(true);
  };

  const handleAddBook = () => {
    // Garante que não há livro para edição e abre o modal
    setBookToEdit(null); 
    setShowBookModal(true);
  };


  if (loading) return <Container className="mt-4"><p>Carregando dados...</p></Container>;

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between mb-3 align-items-center">
        <h2>Catálogo de Livros</h2>
        <Button variant="success" onClick={handleAddBook}>
          + Incluir Novo Livro
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      
      {books.length === 0 && !loading ? (
        <Alert variant="info">Nenhum livro encontrado. Tente adicionar um!</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              {/*<th>Id</th> */}
              <th>Título</th>
              <th>Autor</th>
              <th>ISBN</th>
              <th>Ano</th>
              {/*<th>Editora</th>*/}
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id}>
                {/*<td>{book._id}</td> */}
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.isbn}</td>
                <td>{book.year}</td>
                {/*<td>{book.publisher}</td>*/}
                <td>
                  <Button 
                    variant="info" 
                    size="sm" 
                    className="me-2"
                    // Chama handleEdit com o objeto do livro
                    onClick={() => handleEdit(book)}
                  >
                    <MdEdit />{/*Editar*/}
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(book._id)}
                  >
                    <MdDelete />{/*Excluir*/}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      
      {/* Modal para a inclusão/edição */}
      <BookModal 
        show={showBookModal}
        onHide={handleHideModal}
        onSaveSuccess={handleSaveSuccess}
        bookToEdit={bookToEdit} // Passa o livro para edição (ou null para inclusão)
      />
    </Container>
  );
}

export default BookGrid;