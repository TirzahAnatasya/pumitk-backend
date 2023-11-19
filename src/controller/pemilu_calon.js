const pool = require("../config/database");

const getAllPemiluCalon = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query("CALL get_semua_pemilu_calon");
    const data = results[0];

    const apiResponse = {
      data,
    };

    res.send(apiResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error"
    });
  }
}

async function createPemiluCalon(req, res) {
  try {
    const {
      id_pemilu,
      id_calon
    } = req.body;
    const [results] = await pool.query('CALL post_calon_pemilu(?,?)', [id_pemilu, id_calon]);

    res.json({
      status: 'success',
      message: 'Data berhasil ditambahkan',
      data: {
        input: {
          id_pemilu,
          id_calon
        },
        output: results[0]
      }
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({
      error: 'Internal Server Error'
    });
  }
}

async function updatePemiluCalon(req, res) {
  try {
    const {
      id_pemilu_calon
    } = req.params;

    const {
      id_pemilu,
      id_calon
    } = req.body;

    const [results] = await pool.query('CALL edit_calon_pemilu(?, ?, ?)', [id_pemilu_calon, id_pemilu, id_calon]);

    res.json({
      status: 'success',
      message: 'Data berhasil diupdate',
      data: {
        input: {
          id_pemilu_calon,
          id_pemilu,
          id_calon
        },
        output: results[0]
      }
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error'
    });
  }
}

async function deletePemiluCalon(req, res) {
  try {
    const {
      id_pemilu_calon
    } = req.params;

    const [results] = await pool.query('CALL delete_calon_pemilu(?)', [id_pemilu_calon]);

    if (results.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Data not found. Unable to delete.',
      });
    }

    res.json({
      status: 'success',
      message: 'Data has been deleted',
      data: {
        id_pemilu_calon,
        deletedRows: results.affectedRows,
      },
    });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
}

module.exports = {
  getAllPemiluCalon,
  createPemiluCalon,
  updatePemiluCalon,
  deletePemiluCalon,
};