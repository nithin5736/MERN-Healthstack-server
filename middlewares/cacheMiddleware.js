const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = require("../utils/RedisServer");

module.exports.cacheUserLogin = async (req, res, next) => {
  const { username, email, password, usertype } = req.body;
  const data = await client.get(username);
  if (data !== null) {
    // console.log("cache")
    if (email !== JSON.parse(data).email) {
      return res.json({ msg: "Invalid email", status: false });
    }

    if (password !== JSON.parse(data).password) {
      return res.json({ msg: "Invalid password", status: false });
    }
    if (usertype !== JSON.parse(data).usertype) {
      return res.json({ msg: "Invalid usertype", status: false });
    }

    const accessToken = jwt.sign(
      {
        username: username,
        email: email,
        usertype: usertype,
      },
      process.env.JWT_SECRET_KEY
    );
    delete data.password;
    return res.json({ status: true, user: JSON.parse(data), accessToken });
  } else {
    // console.log("no cache")
    next();
  }
};
