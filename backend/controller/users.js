import RegisterModel from "../models/user_models.js";

const register = (req, res) => {
  const { username, email, password } = req.body;

  RegisterModel.findOne({ email: email })
    .then((user) => {
      if (user) {
        res.json("Email already exists");
      } else {
        RegisterModel.create({
          name: username,
          email: email,
          password: password,
        })
          .then((result) => res.json("Account created"))
          .catch((err) => {
            console.error("Error creating account:", err);
            res.status(500).json("Error creating account");
          });
      }
    })
    .catch((err) => {
      console.error("Error finding user:", err);
      res.status(500).json("Error finding user");
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  RegisterModel.findOne({ email: email }).then((user) => {
    if (user) {
      if (user.password === password) {
        req.session.userData = user;

        // Save session explicitly
        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
            return res.status(500).json("Session save failed");
          }

          console.log("Session saved successfully");
          console.log("Session ID:", req.sessionID);
          console.log("User data in session:", req.session.userData);

          res.json("Success");
        });
      } else {
        res.json("Password Incorrect");
      }
    } else {
      res.json("User not found");
    }
  }).catch((err) => {
    console.error("Database error:", err);
    res.status(500).json("Database error");
  });
};
export { register, login };
