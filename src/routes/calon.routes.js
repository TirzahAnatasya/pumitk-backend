const express = require("express");
const router = express.Router();

const {
  getAllCalon,
  getAllCalonByHimpunan,
  createCalon,
  editCalonById,
  deleteCalon
} = require("../controller/calon");

router.get("/", getAllCalon);
router.get("/:p_id_himpunan", getAllCalonByHimpunan);
router.post("/", createCalon);
router.put("/:id_calon", editCalonById);
router.delete("/:id_calon", deleteCalon);

module.exports = router;