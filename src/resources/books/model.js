const db = require("../../utils/database");
const { buildBooksDatabase } = require("../../utils/mockData");

function Book() {
  function createTable() {
    const sql = `
      DROP TABLE IF EXISTS books;
      
      CREATE TABLE IF NOT EXISTS books (
        id              SERIAL        PRIMARY KEY,
        title           VARCHAR(255)   NOT NULL,
        type            VARCHAR(255)   NOT NULL,
        author          VARCHAR(255)   NOT NULL,
        topic           VARCHAR(255)   NOT NULL,
        publicationDate DATE           NOT NULL
      );
    `;

    db.query(sql)
      .then((result) => console.log("[DB] Book table ready."))
      .catch(console.error);
  }

  function mockData() {
    const createBook = `
      INSERT INTO books
        (title, type, author, topic, publicationDate)
      VALUES
        ($1, $2, $3, $4, $5)
    `;

    const books = buildBooksDatabase();

    books.forEach((book) => {
      db.query(createBook, Object.values(book)).catch(console.error);
    });
  }

  async function getOneByIdFromServer(idToGet) {
    const getOneById = `
      SELECT *
      FROM books
      WHERE id = $1;
      `;

    const result = await db.query(getOneById, [idToGet]);
    return result.rows;
  }

  async function updateOneByIdToServer(id, updatedBook) {
    const { title, type, author, topic, publicationdate } = updatedBook;

    const updateOneSql = `
    UPDATE books
    SET id = $1,
        title = $2,
        type = $3,
        author = $4,
        topic = $5,
        publicationdate = $6
    WHERE id = $1
    RETURNING *;
    `;

    const result = await db.query(updateOneSql, [
      id,
      title,
      type,
      author,
      topic,
      publicationdate,
    ]);

    return result.rows[0];
  }

  async function deleteOneByIdToServer(id) {
    const deleteOne = `
    DELETE FROM books
    WHERE id = $1;`;

    const result = await db.query(deleteOne, [id]);
    return result;
  }

  createTable();
  mockData();

  return {
    getOneByIdFromServer,
    updateOneByIdToServer,
    deleteOneByIdToServer,
  };
}

module.exports = Book;
