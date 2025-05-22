import RegisterModel from "../models/user_models.js";

const register = (req, res) => {
    const { username, email, password } = req.body;
    console.log(username, email, password)
    RegisterModel.findOne({ email: email })
        .then(user => {
            if (user) {
                res.json("Email already exists");
            } else {
                RegisterModel.create({ name: username, email: email, password: password })
                    .then(result => res.json("Account created"))
                    .catch(err => {
                        console.error("Error creating account:", err);
                        res.status(500).json("Error creating account");
                    });
            }
        })
        .catch(err => {
            console.error("Error finding user:", err);
            res.status(500).json("Error finding user");
        });
}

const login = (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)
    RegisterModel.findOne({ email: email })
        .then((user) => {
            console.log(user)
            if (user) {
                if (user.password === password) {

                    req.session.userData = user;

                    console.log(req.session.userData);

                    res.json("Success");
                } else {
                    res.json("Password Incorrect");
                }
            } else {
                res.json("User not found");
            }

        })
}
export { register, login };