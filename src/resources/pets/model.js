const db = require("../../utils/database");
const { buildAnimalDatabase } = require("../../utils/mockData");

function Pet() {
  function createTable() {
    const sql = `
      DROP TABLE IF EXISTS pets;

      CREATE TABLE IF NOT EXISTS pets (
        id        SERIAL        PRIMARY KEY,
        name      VARCHAR(255)   NOT NULL,
        age       INTEGER       NOT NULL,
        type      VARCHAR(255)   NOT NULL,
        breed     VARCHAR(255)   NOT NULL,
        microchip BOOLEAN       NOT NULL
      );
    `;

    db.query(sql)
      .then((result) => console.log("[DB] Pet table ready."))
      .catch(console.error);
  }

  function mockData() {
    const createPet = `
      INSERT INTO pets
        (name, age, type, breed, microchip)
      VALUES
        ($1, $2, $3, $4, $5)
    `;

    const pets = buildAnimalDatabase();

    pets.forEach((pet) => {
      db.query(createPet, Object.values(pet));
    });
  }

  async function getOneByIdFromServer(id) {
    const getOneById = `
    SELECT *
    FROM pets
    WHERE id = $1;
  `;

    const result = db.query(getOneById, [id]).catch(console.error);
    return result;
  }

  async function updateOneByIdToServer(idToUpdate, updatedBook) {
    const { id, name, age, type, breed, microchip } = updatedBook;

    const updateOneSql = `
    UPDATE pets
    SET name = $2,
        age = $3,
        type = $4,
        breed = $5,
        microchip = $6
    WHERE id = $1
    RETURNING *;
    `;

    const result = await db.query(updateOneSql, [
      idToUpdate,
      name,
      age,
      type,
      breed,
      microchip,
    ]);

    return result.rows[0];
  }

  async function deleteOneByIdToServer(id) {
    const deleteOne = `
    DELETE FROM pets
    WHERE id = $1;`;

    const result = await db.query(deleteOne, [id]);
    return result;
  }

  createTable();
  mockData();

  return { getOneByIdFromServer, updateOneByIdToServer, deleteOneByIdToServer };
}

module.exports = Pet;
