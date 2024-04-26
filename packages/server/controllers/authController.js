const pool = require("../db");
const bcrypt = require("bcrypt");
const {v4: uuidv4} = require("uuid");


module.exports.handeleLogin = (req,res) => {
    if (req.session.user && req.session.user.username) {
        res.json({ loggedIn: true, username: req.session.user.username });
      } else {
        res.json({ loggedIn: false });
      }
}

module.exports.attemptLogin = async (req, res) => {
    const potentialLogin = await pool.query("SELECT id, username, passhash, userid from users WHERE username=$1", 
    [req.body.username]);
    if(potentialLogin.rowCount) {
    const isSamePass = await bcrypt.compare(req.body.password, potentialLogin.rows[0].passhash);
    if(isSamePass) {
        req.session.user = {
          username: req.body.username,
          id: potentialLogin.rows[0].id,
          userid: potentialLogin.rows[0].userid
        }
        res.json({loggedIn:true, username: req.body.username});
    } else {
        res.json({loggedIn: false, status: "Wrong password"});
        console.log('Wrong password');
    }
    } else {
    res.json({loggedIn: false, status: "Wrong username"});
    console.log('Wrong username');
    }
}

module.exports.attemptRegister = async (req, res) => {
    const existingUser = await pool.query("SELECT username from users WHERE username=$1", [req.body.username]);
    if(existingUser.rowCount == 0) {
      const hashPassword = await bcrypt.hash(req.body.password, 10);
      const newUserQuery = await pool.query(
        "INSERT INTO users(username,passhash,userid) values($1,$2, $3) RETURNING id, username, userid", 
      [req.body.username, hashPassword, uuidv4()]);
      req.session.user = {
        username: req.body.username,
        id:newUserQuery.rows[0].id,
        userid: newUserQuery.rows[0].userid
      }
      res.json({loggedIn: true, username: req.body.username});
    } else {
      res.json({loggedIn: false, status: "Username taken"})
    }
  }