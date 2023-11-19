const pool = require("../config/database");

const getAllCalon = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query("CALL get_semua_calon");
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

async function getAllCalonByHimpunan(req, res) {
  const {
    p_id_himpunan
  } = req.params;

  try {
    const [candidateResults] = await pool.query('CALL get_calon_by_himpunan(?)', [p_id_himpunan]);
    const candidates = candidateResults[0];

    const voterCounts = await Promise.all(
      candidates.map(async (candidate) => {
        const [countResults] = await pool.query('SELECT COUNT(*) as voterCount FROM pemilih WHERE id_calon = ?', [candidate.id]);
        return {
          id_calon: candidate.id,
          nama: candidate.nama,
          voterCount: countResults[0].voterCount
        };
      })
    );

    const apiResponse = {
      status: 'success',
      data: {
        candidates,
        voterCounts,
      },
    };

    res.send(apiResponse);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}

async function createCalon(req, res) {
  try {
    const {
      id_himpunan,
      no_urut,
      nama,
      nim,
      visi,
      misi,
      cv,
      foto
    } = req.body;

    // Input validation - add more validation as needed
    if (!id_himpunan || !no_urut || !nama || !nim || !visi || !misi || !cv || !foto) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    const [results] = await pool.query('CALL post_calon(?,?,?,?,?,?,?,?)', [id_himpunan, no_urut, nama, nim, visi, misi, cv, foto]);

    res.json({
      status: 'success',
      message: 'Data berhasil ditambahkan',
      data: {
        input: {
          id_himpunan,
          no_urut,
          nama,
          nim,
          visi,
          misi,
          cv,
          foto
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

async function editCalonById(req, res) {
  try {
    const {
      id_calon
    } = req.params;
    const {
      id_himpunan,
      no_urut,
      nama,
      nim,
      visi,
      misi,
      cv,
      foto
    } = req.body;

    const [results] = await pool.query('CALL edit_calon(?,?,?,?,?,?,?,?,?)', [id_calon, id_himpunan, no_urut, nama, nim, visi, misi, cv, foto]);

    res.json({
      status: 'success',
      message: 'Data berhasil diupdate',
      data: {
        input: {
          id_calon,
          id_himpunan,
          no_urut,
          nama,
          nim,
          visi,
          misi,
          cv,
          foto
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

async function deleteCalon(req, res) {
  try {
    const {
      id_calon
    } = req.params;

    const [results] = await pool.query('CALL delete_calon(?)', [id_calon]);

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
        id_calon,
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
  getAllCalon,
  getAllCalonByHimpunan,
  createCalon,
  editCalonById,
  deleteCalon,
};