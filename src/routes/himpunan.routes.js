const express = require("express");
const router = express.Router();

const {
    getAllhimpunan,
    createHimpunan,
    editHimpunanByID,
    deleteHimpunan
} = require("../controller/himpunan");

router.get("/", getAllhimpunan);
router.post("/", createHimpunan);
router.put("/:id_himpunan", editHimpunanByID);
router.delete("/:id_himpunan", deleteHimpunan);

module.exports = router;