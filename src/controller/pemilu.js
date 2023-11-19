const pool = require("../config/database");

const getAllPemilu = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query("CALL get_semua_pemilu");
    const data = results[0];

    const apiResponse = {
      status: 'success',
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

async function createPemilu(req, res) {
  try {
    const {
      id_himpunan,
      is_himpunan,
      is_done
    } = req.body;

    if (!id_himpunan || !is_himpunan || !is_done) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    const start_date = new Date().toISOString();
    const end_date = new Date();
    end_date.setDate(end_date.getDate() + 8);

    const [results] = await pool.query('CALL post_pemilu(?,?,?,?,?)', [id_himpunan, start_date, end_date, is_himpunan, is_done]);

    res.json({
      status: 'success',
      message: 'Data berhasil ditambahkan',
      data: {
        input: {
          id_himpunan,
          start_date,
          end_date,
          is_himpunan,
          is_done
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

async function editPemilu(req, res) {
  try {
    const {
      id_pemilu
    } = req.params;

    const {
      id_himpunan,
      is_himpunan,
      is_done
    } = req.body;

    const start_date = new Date().toISOString();
    const end_date = new Date();
    end_date.setDate(end_date.getDate() + 8);

    const [results] = await pool.query('CALL edit_pemilu(?, ?, ?, ?, ?, ?)', [id_pemilu, id_himpunan, start_date, end_date, is_himpunan, is_done]);

    res.json({
      status: 'success',
      message: 'Data berhasil diupdate',
      data: {
        input: {
          id_himpunan,
          start_date,
          end_date,
          is_himpunan,
          is_done
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

async function deletePemilu(req, res) {
  try {
    const {
      id_pemilu
    } = req.params;

    const [results] = await pool.query('CALL delete_pemilu(?)', [id_pemilu]);

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
        id_pemilu,
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
  getAllPemilu,
  createPemilu,
  editPemilu,
  deletePemilu,
};