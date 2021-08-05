const db = require("../../utils/database");

const Pet = require("./model");
const { getOneByIdFromServer, updateOneByIdToServer, deleteOneByIdToServer } =
  Pet();

function createOne(req, res) {
  const createOne = `
    INSERT INTO pets
      (name, age, type, microchip)
    VALUES
      ($1, $2, $3, $4)
    RETURNING *;
  `;

  db.query(createOne, Object.values(req.body))
    .then((result) => res.json({ data: result.rows[0] }))
    .catch(console.error);
}

function getAll(req, res) {
  const getAll = `
    SELECT *
    FROM pets;
  `;

  db.query(getAll)
    .then((result) => res.json({ data: result.rows }))
    .catch(console.error);
}

function getOneById(req, res) {
  const idToGet = req.params.id;

  getOneByIdFromServer(idToGet)
    .then((result) => res.json({ data: result.rows[0] }))
    .catch(console.error);
}

function patchOneById(req, res) {
  const { id } = req.params;

  const toUpdateContent = req.body;
  getOneByIdFromServer(id).then((result) => {
    const originalPetArray = result.rows;

    if (originalPetArray.length === 0)
      return res.json({
        ERROR: "PET NOT EXISTS",
      });
    const updatedPet = { ...originalPetArray[0], ...toUpdateContent };
    const updatedPetChecked = checkPetObject(updatedPet);
    if (updatedPetChecked)
      updateOneByIdToServer(id, updatedPet).then((updatedPet) =>
        res.json(updatedPet)
      );
    else
      res.json({
        ERROR: "To updated pet info incorrect",
      });
  });
}

function deleteOneById(req, res) {
  const { id } = req.params;
  getOneByIdFromServer(id).then((result) => {
    if (result.rows.length === 0)
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
  patchOneById,
  deleteOneById,
};

function checkPetObject(updatedPet) {
  const petRequirement = ["id", "name", "age", "type", "breed", "microchip"];
  const hasAllKeys = petRequirement.every((item) =>
    updatedPet.hasOwnProperty(item)
  );

  if (hasAllKeys && Object.keys(updatedPet).length === petRequirement.length)
    return true;
  else return false;
}
