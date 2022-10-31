import axios from 'axios';
import { ChangeEvent, useEffect, useState } from 'react'
import './App.css'

interface Book {
  id: number;
  title: string;
  author: string;
}

function App() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => { 
    axios
      .get("http://localhost:80/api/books/")
      .then((res) => setBooks(res.data))
      .catch((err) => console.log(err));
  }, []);

  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleAuthorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAuthor(e.target.value);
  };

  const CreateNewBook = (): void => {
    axios
      .post('http://localhost:80/api/books/', {
        title: title,
        author: author,
      })
      .then((res) => {
        setBooks([...books, res.data]);
      })
      .then(() => {
        setAuthor("");
        setTitle("");
      })
      .catch((err) => console.log(err));
  };

  const DeleteBook = (id: number) => {
    axios
      .delete(`http://localhost:80/api/books/${id}`)
      .then((res) => {
        console.log(res);
        setBooks(books.filter((book) => book.id !== id));
      })
      .catch((err) => console.log(err));
  };

  const ModifyBook = (id: number) => {
    axios
      .patch(`http://localhost:80/api/books/${id}`, {
        title: title,
        author: author,
      })
      .then((res) => {
        setBooks(res.data);
      })
      .then(() => {
        setTitle("");
        setAuthor("");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className='App'>
      <button onClick={CreateNewBook}>作成</button>
      <br />
      <label>
        タイトル：
        <input type='text' value={title} onChange={handleTitleChange} />
      </label>
      <label>
        作者：
        <input type='text' value={author} onChange={handleAuthorChange} />
      </label>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            タイトル：{book.title} 作者： {book.author}
            <button onClick={() => DeleteBook(book.id)}>削除</button>
            <button onClick={() => ModifyBook(book.id)}>更新</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
