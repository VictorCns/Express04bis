const database = require("./database");

const getUsers = (req, res) => {
    let sql2 = "SELECT * FROM users";
    const sql2Values = [];

    if (req.query.language != null) {
        sql2 += " where language = ?";
        sql2Values.push(req.query.language);
    }
    if (req.query.city != null) {
        sql2 += " and city = ?";
        sql2Values.push(req.query.city);
    } else if (req.query.city != null) {
        sql2 += " where city = ?";
        sql2Values.push(req.query.city);
    }

    database.query(sql2, sql2Values).then(([users]) => {
        res.json(users);
        res.status(200).send("List of users");
    }).catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
    });
};

const getUsersById = (req, res) => {
    const id = parseInt(req.params.id);
    database.query("SELECT * FROM users WHERE id = ?", [id]).then(([users]) => {
        if (users[0] != null) {
            res.json(users[0]);
            res.status(200).send("User selected");
        } else { res.status(404).send("Not Found"); }
    }).catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
    });
};

const postUser = (req, res) => {
    const { firstname, lastname, email, city, language } = req.body;

    database
        .query(
            "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
            [firstname, lastname, email, city, language])
        .then(([result]) => {
            res.location(`/api/users/${result.insertId}`).sendStatus(201);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error saving the user");
        });
};


const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { firstname, lastname, email, city, language } = req.body;

    database.query(
        "update users set firstname = ?, lastname = ?, email = ?, city = ?, language = ? where id = ?",
        [firstname, lastname, email, city, language, id])
        .then(([result]) => {
            if (result.affectedRows === 0) {
                res.status(404).send("Not Found");
            } else {
                res.sendStatus(204);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error editing the users");
        });
};
const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);

    database.query(
        "delete from users where id = ?", [id])
        .then(([result]) => {
            if (result.affectedRows === 0) {
                res.status(404).send("Not Found");
            } else {
                res.sendStatus(204);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error editing the users");
        });
};


module.exports = {
    getUsers,
    getUsersById,
    postUser,
    updateUser,
    deleteUser
};
