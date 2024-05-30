// import { Form, Button, Container, Row, Col } from 'react-bootstrap';

interface Props {
  authors: string[],
  setAuthors: Function
}

export default function DynamicAuthorsInput({authors, setAuthors}: Props) {
  const handleAddAuthor = () => {
    setAuthors([...authors, '']);
  };

  const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newAuthors = [...authors];
    newAuthors[index] = event.target.value;
    setAuthors(newAuthors);
  };

  const handleRemoveAuthor = (index: number) => {
    const newAuthors = [...authors];
    newAuthors.splice(index, 1);
    setAuthors(newAuthors);
  };

  function SingleInputSection(author: string, index: number) {
    return <div key={index} className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        placeholder={`Author ${index + 1}`}
        defaultValue={author}
        onBlur={(e) => handleInputChange(index, e)}
        required
      />
      <button className="btn btn-danger" onClick={() => handleRemoveAuthor(index)}>
        删除
      </button>
    </div>;
  }

  return (
    <div className="mb-3">
      <label className="form-label">作者</label>
      {authors.map((author, index) => ( SingleInputSection(author, index) ))}
      <button className="btn btn-primary" type="button" onClick={handleAddAuthor}>
        添加作者
      </button>
    </div>
  );
}
