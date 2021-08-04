const express = require("express");

const {
  createOne,
  getAll,
  getOneById,
  updateOneById,
  deleteOneById,
  patchOneById,
} = require("./controller");

const router = express.Router();

router.post("/", createOne);

router.get("/", getAll);

router.get("/:id", getOneById);

router.put("/:id", updateOneById);

router.patch("/:id", patchOneById);

router.delete("/:id", deleteOneById);

module.exports = router;
