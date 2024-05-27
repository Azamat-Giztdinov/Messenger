const { jwtVerify, getJwt } = require("../jwt/jwtAuth");
const pool = require("../../db");
require("dotenv").config();

const handleLogin = async (req, res) => {
  const token = getJwt(req);
  // console.log('ok1')
  if (!token) {
    res.json({ loggedIn: false });
    return;
  }
  // console.log('ok2')

  jwtVerify(token, process.env.JWT_SECRET)
    .then(async decoded => {
      const potentialUser = await pool.query(
        "SELECT username FROM users u WHERE u.username = $1",
        [decoded.username]
      );

      if (potentialUser.rowCount === 0) {
        res.json({ loggedIn: false, token: null });
        // console.log('ok4')

        return;
      }
      // console.log('ok3: ', token)
      res.json({ loggedIn: true, token });
    })
    .catch(() => {
      // console.log('ERROR')

      res.json({ loggedIn: false });
    });
};

module.exports = handleLogin;