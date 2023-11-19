const pool = require("../config/database");

const getUser = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query("CALL get_semua_user");
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

const loginUser = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    const connection = await pool.getConnection();
    const [results] = await connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    const user = results[0]; // Ambil user pertama dari hasil query

    if (user) {
      // Login berhasil
      const apiResponse = {
        status: 'success',
        message: 'Login successful',
        data: {
          id: user.id,
          email: user.email,
        },
      };
      res.json(apiResponse);
    } else {
      // Login gagal
      res.status(401).json({
        error: 'Incorrect email or password'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Internal Server Error',
    });
  }
}

const registerUser = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    const connection = await pool.getConnection();

    // Cek apakah email sudah terdaftar
    const [existingUsers] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUsers.length > 0) {
      return res.status(409).json({
        error: 'Email is already registered'
      });
    }

    // Jika email belum terdaftar, lakukan registrasi
    const [results] = await connection.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, password]);

    const newUser = {
      id: results.insertId,
      email: email,
    };

    const apiResponse = {
      status: 'success',
      message: 'Registration successful',
      data: newUser,
    };

    res.json(apiResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Internal Server Error',
    });
  }
}

const logoutUser = (req, res) => {
  try {
    // Hapus informasi sesi atau token otentikasi
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          error: 'Error during logout'
        });
      }

      // Respons sukses setelah logout berhasil
      res.json({
        status: 'success',
        message: 'Logout successful'
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Internal Server Error'
    });
  }
};

module.exports = {
  getUser,
  loginUser,
  registerUser,
  logoutUser
};