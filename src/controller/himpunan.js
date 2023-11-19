const pool = require("../config/database");

const getAllhimpunan = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query("CALL get_semua_himpunan");
    const data = results[0];

    const apiResponse = {
      status: 'success',
      data,
    };

    res.send(apiResponse);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}

async function createHimpunan(req, res) {
  try {
    const {
      nama
    } = req.body;

    if (!nama) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    const [results] = await pool.query('CALL post_himpunan(?)', [nama]);

    res.json({
      status: 'success',
      message: 'Data berhasil ditambahkan',
      data: {
        input: {
          nama
        },
        output: results[0]
      }
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}

async function editHimpunanByID(req, res) {
  try {
    const {
      id_himpunan
    } = req.params;

    const {
      nama
    } = req.body;

    const [results] = await pool.query('CALL edit_himpunan (?, ?)', [id_himpunan, nama]);

    res.json({
      status: 'success',
      message: 'Data berhasil diupdate',
      data: {
        input: {
          id_himpunan,
          nama
        },
        output: results[0] // Assuming the result is in the first element of the results array
      }
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}

async function deleteHimpunan(req, res) {
  try {
    const {
      id_himpunan
    } = req.params;

    const [results] = await pool.query('CALL delete_himpunan(?)', [id_himpunan]);

    if (results.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Data not found. Unable to delete',
      });
    }

    res.json({
      status: 'success',
      message: 'Data has Data has deleted deleted',
      data: {
        id_himpunan,
        deletedRows: results.affectedRows,
      },
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}

module.exports = {
  getAllhimpunan,
  createHimpunan,
  editHimpunanByID,
  deleteHimpunan
};