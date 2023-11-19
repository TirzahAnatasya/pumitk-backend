const pool = require("../config/database");

const getAllPemilih = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query("CALL get_semua_pemilih");
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

async function createPemilih(req, res) {
  try {
    const {
      id_calon,
      id_pemilu,
      email
    } = req.body;

    // Input validation - add more validation as needed
    if (!id_pemilu || !id_calon || !email) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    // Check if the candidate has already been selected for this election with the same email
    const checkExistingVoteQuery = 'SELECT id_calon FROM pemilih WHERE id_pemilu = ? AND email = ?';
    const [existingResults] = await pool.query(checkExistingVoteQuery, [id_pemilu, email]);

    if (existingResults.length > 0) {
      const existingCandidateId = existingResults[0].id_calon;

      // Check if the existing candidate is the same as the new one
      if (existingCandidateId !== id_calon) {
        return res.status(400).json({
          error: 'Cannot vote for a different candidate with the same email in this election'
        });
      } else {
        return res.status(400).json({
          error: 'Candidate has been selected '
        });
      }

      // If the same candidate is already selected, return success without doing anything
      return res.json({
        status: 'success',
        message: 'Data sudah tersimpan',
        data: {
          input: {
            id_calon,
            id_pemilu,
            email,
          },
          output: existingResults[0]
        }
      });
    }



    // If not selected before, call the stored procedure to save the vote
    const [results] = await pool.query('CALL post_pemilih(?,?,?)', [id_calon, id_pemilu, email]);

    res.json({
      status: 'success',
      message: 'Data berhasil ditambahkan',
      data: {
        input: {
          id_calon,
          id_pemilu,
          email,
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

async function deletePemilih(req, res) {
  try {
    const {
      id_pemilih
    } = req.params;
    const [results] = await pool.query('CALL delete_pemilih(?)', [id_pemilih]);

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
        id_pemilih,
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
  getAllPemilih,
  createPemilih,
  deletePemilih
};