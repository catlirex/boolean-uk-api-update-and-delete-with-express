const express = require("express");

const {
  createOne,
  getAll,
  getOneById,
  patchOneById,
  deleteOneById,
} = require("./controller");

const router = express.Router();

router.post("/", createOne);

router.get("/", getAll);

router.get("/:id", getOneById);

router.patch("/:id", patchOneById);

router.delete("/:id", deleteOneById);

module.exports = router;
