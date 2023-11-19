const express = require("express");
const router = express.Router();

const {
    getAllPemiluCalon,
    createPemiluCalon,
    updatePemiluCalon,
    deletePemiluCalon
} = require("../controller/pemilu_calon");


router.get("/", getAllPemiluCalon);
router.post("/", createPemiluCalon);
router.put("/:id_pemilu_calon", updatePemiluCalon);
router.delete("/:id_pemilu_calon", deletePemiluCalon);

module.exports = router;