const express = require("express");
const router = express.Router();

const {
  getAllPemilu,
  createPemilu,
  editPemilu,
  deletePemilu
} = require("../controller/pemilu");


router.get("/", getAllPemilu);
router.post("/", createPemilu);
router.put("/:id_pemilu", editPemilu);
router.delete("/:id_pemilu", deletePemilu);

module.exports = router;