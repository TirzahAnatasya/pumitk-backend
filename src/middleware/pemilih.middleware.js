const pool = require('./database');

const checkIfVoterHasVoted = async (req, res, next) => {
  try {
    const { id_pemilih } = req.body;
    const [rows] = await pool.query('SELECT * FROM suara WHERE id_pemilih = ?', [id_pemilih]);

    if (rows.length > 0) {
      return res.status(403).json({ error: 'Anda sudah memilih' });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  checkIfVoterHasVoted,
};
