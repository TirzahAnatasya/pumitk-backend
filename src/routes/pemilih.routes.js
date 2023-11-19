const express = require("express");
const router = express.Router();

const {
    getAllPemilih,
    createPemilih,
    deletePemilih
} = require("../controller/pemilih");


router.get("/", getAllPemilih);
router.post("/", createPemilih);
router.delete("/:id_pemilih", deletePemilih);

module.exports = router;