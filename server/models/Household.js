const db = require('../database/connect');

class Household {

    constructor({ household_id, household_username, household_password, name_1, name_2, email_1, email_2 }) {
        this.household_id = household_id;
        this.household_username = household_username;
        this.household_password = household_password;
        this.name_1 = name_1;
        this.name_2 = name_2;
        this.email_1 = email_1;
        this.email_2 = email_2;
    }

    static async getOneById(household_id) {
        const response = await db.query("SELECT * FROM household WHERE household_id = $1", [household_id]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate household.");
        }
        return new Household(response.rows[0]);
    }

    static async getOneByUsername(household_username) {
        const response = await db.query("SELECT * FROM household WHERE household_username = $1", [household_username]);
        if (response.rows.length != 1) {
            throw new Error("Unable to locate household.");
        }
        return new Household(response.rows[0]);
    }

    static async create(data) {
        const { household_username, household_password, name_1, name_2, email_1, email_2 } = data;
        let response = await db.query("INSERT INTO household (household_username, household_password, name_1, name_2, email_1, email_2) VALUES ($1, $2, $3, $4, $5, $6) RETURNING household_id;",
            [household_username, household_password, name_1, name_2, email_1, email_2]);
        const newId = response.rows[0].household_id;
        const newHousehold = await Household.getOneById(newId);
        return newHousehold;
    }
}

module.exports = Household;