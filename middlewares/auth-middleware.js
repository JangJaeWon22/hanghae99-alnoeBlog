const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const [authType, authToken] = (authorization || "").split(" ");
  console.log("들어왔어")
  if (!authToken || authType !== "Bearer") {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.!!",
    });
    return;
  }
    try {
      const { userId } = jwt.verify(authToken, "secret-key");
      User.findById(userId).then((user) => {
        res.locals.user = user;
        console.log("이제 나갈꺼야")
        next();
        
      });
    } catch (err) {
      res.status(401).send({
        errorMessage: "로그인 후 이용 가능한 기능입니다.",
      });
    }
};
