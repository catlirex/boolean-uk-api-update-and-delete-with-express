const db = require("../../utils/database");
const Book = require("./model");
const { updateOneByIdToServer, getOneByIdFromServer, deleteOneByIdToServer } =
  Book();

function createOne(req, res) {
  const createOne = `
    INSERT INTO books
      (name, type, author, topic, publicationDate)
    VALUES
      ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  db.query(createOne, Object.values(req.body))
    .then((result) => res.json({ data: result.rows[0] }))
    .catch(console.error);
}

function getAll(req, res) {
  const getAll = `
    SELECT *
    FROM books;
  `;

  db.query(getAll)
    .then((result) => res.json({ data: result.rows }))
    .catch(console.error);
}

function getOneById(req, res) {
  const idToGet = req.params.id;

  getOneByIdFromServer(idToGet)
    .then((result) => res.json({ data: result[0] }))
    .catch(console.error);
}

function updateOneById(req, res) {
  const { id } = req.params;
  const updatedBook = req.body;
  const hasAllKeys = checkBookObject(updatedBook);

  getOneByIdFromServer(id).then((book) => {
    if (book.length && hasAllKeys)
      updateOneByIdToServer(id, updatedBook).then((updatedBook) =>
        res.json(updatedBook)
      );
    else if (book.length === 0)
      res.json({
        ERROR: "BOOK NOT EXISTS",
      });
    else
      res.json({
        ERROR: "To updated book info incorrect",
      });
  });
}

function patchOneById(req, res) {
  const { id } = req.params;
  const toUpdateContent = req.body;
  getOneByIdFromServer(id).then((book) => {
    if (book.length === 0)
      return res.json({
        ERROR: "BOOK NOT EXISTS",
      });
    const updatedBook = { ...book[0], ...toUpdateContent };
    const updatedBookChecked = checkBookObject(updatedBook);
    if (updatedBookChecked)
      updateOneByIdToServer(id, updatedBook).then((updatedBook) =>
        res.json(updatedBook)
      );
    else
      res.json({
        ERROR: "To updated book info incorrect",
      });
  });
}

function deleteOneById(req, res) {
  const { id } = req.params;
  getOneByIdFromServer(id).then((book) => {
    if (book.length === 0)
      return res.json({
        ERROR: "BOOK NOT EXISTS",
      });
    else deleteOneByIdToServer(id).then(res.json({ MSG: "DONE" })).catch.error;
  });
}

module.exports = {
  createOne,
  getAll,
  getOneById,
  updateOneById,
  patchOneById,
  deleteOneById,
};

function checkBookObject(bookObject) {
  const bookRequirement = [
    "id",
    "title",
    "type",
    "author",
    "topic",
    "publicationdate",
  ];
  const hasAllKeys = bookRequirement.every((item) =>
    bookObject.hasOwnProperty(item)
  );

  if (hasAllKeys && Object.keys(bookObject).length === bookRequirement.length)
    return true;
  else return false;
}
