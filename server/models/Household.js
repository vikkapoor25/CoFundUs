const db = require('../database/connect');

class Household {

    constructor({ household_id, household_username, household_password, name_1, name_2, email_1, email_2, twofa_code, twofa_expires_at }) {
        this.household_id = household_id;
        this.household_username = household_username;
        this.household_password = household_password;
        this.name_1 = name_1;
        this.name_2 = name_2;
        this.email_1 = email_1;
        this.email_2 = email_2;
        this.twofa_code = twofa_code;
        this.twofa_expires_at = twofa_expires_at;
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

    static async saveTwoFactorCode(household_id, code, expiresAt) {
        const response = await db.query(
            `UPDATE household
            SET twofa_code = $1,
            twofa_expires_at = $2
            WHERE household_id = $3
            RETURNING *;`,
            [code, expiresAt, household_id]
        );
        
        if (response.rows.length !== 1) {
            throw new Error("Unable to save 2FA code.");
        }
        
        return new Household(response.rows[0]);
    }
    
    static async verifyTwoFactorCode(household_id, code) {
        const response = await db.query(
            `SELECT * FROM household
            WHERE household_id = $1
            AND twofa_code = $2;`,
            [household_id, code]
        );
        
        if (response.rows.length !== 1) {
            throw new Error("Invalid 2FA code.");
        }
        
        const household = response.rows[0];
        
        if (!household.twofa_expires_at || new Date(household.twofa_expires_at) < new Date()) {
            throw new Error("2FA code has expired.");
        }
        
        return new Household(household);
    }
    
    static async clearTwoFactorCode(household_id) {
        const response = await db.query(
            `UPDATE household
            SET twofa_code = NULL,
            twofa_expires_at = NULL
            WHERE household_id = $1
            RETURNING *;`,
            [household_id]
        );
        
        if (response.rows.length !== 1) {
            throw new Error("Unable to clear 2FA code.");
        }
        
        return new Household(response.rows[0]);
    }
    
    static async create(data) {
        try {
            const { household_username, household_password, name_1, name_2, email_1, email_2 } = data;
            const response = await db.query(
                `INSERT INTO household (household_username, household_password, name_1, name_2, email_1, email_2)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;`,
                [household_username, household_password, name_1, name_2, email_1, email_2]
            );
            return new Household(response.rows[0]);
        } catch (err) {
            throw new Error("Unable to create household: " + err.message);
        }
        const { household_username, household_password, name_1, name_2, email_1, email_2, twofa_code, twofa_expires_at } = data;
        let response = await db.query("INSERT INTO household (household_username, household_password, name_1, name_2, email_1, email_2, twofa_code, twofa_expires_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING household_id;",
            [household_username, household_password, name_1, name_2, email_1, email_2, twofa_code, twofa_expires_at]);
        const newId = response.rows[0].household_id;
        const newHousehold = await Household.getOneById(newId);
        return newHousehold;
    }
}


module.exports = Household;