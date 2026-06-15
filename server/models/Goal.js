const db = require('../database/connect');

class Goal {

constructor({ goal_id, household_id, goal_name, goal_amount, current_value, target_date }) {
    this.goal_id = goal_id;
    this.household_id = household_id;
    this.goal_name = goal_name;
    this.goal_amount = goal_amount;
    this.current_value = current_value;
    this.target_date = target_date ? new Date(target_date).toLocaleDateString("en-CA") : null; // So it shows as DATE in API and not DATETIME
}

    // Gets all goals for a household
    static async getAllHouseholdGoals(household_id) {
        // Runs SQL query: Gets all goals for a household by household_id
        const response = await db.query("SELECT * FROM goals WHERE household_id = $1;", 
            [household_id]);
        // Throws error household has no goals
        if (response.rows.length === 0) {
            throw new Error("Household currently has no financial goals.");
        }
        // Converts database rows into Goal objects
        return response.rows.map(row => new Goal(row));
    }

    // Creates a new goal using household_id
    static async createGoal(request_body) {
        // Destructures request body 
        const { household_id, goal_name, goal_amount, current_value = 0, target_date = null } = request_body
        // Checks if household exists before adding bill
        const existingHousehold = await db.query("SELECT * FROM household WHERE household_id = $1", 
            [household_id]);
        if (existingHousehold.rows.length === 1) {
            // Creates goal for the household using household_id
            const response = await db.query("INSERT INTO goals (household_id, goal_name, goal_amount, current_value, target_date) VALUES ($1, $2, $3, $4, $5) RETURNING *;", 
                [household_id, goal_name, goal_amount, current_value, target_date]);
            // Returns created goal
            return new Goal(response.rows[0]);
        } else {
            throw new Error("Unable to create goal for household.");
        }
    }

    // Updates a Goal using goal_id
    static async updateGoal(request_body) {
        // Destructures request body
        const { goal_id, goal_name, goal_amount, current_value, target_date = null } = request_body;
        // Updates goal using SQL UPDATE
        const response = await db.query("UPDATE goals SET goal_name = $1, goal_amount = $2, current_value = $3, target_date = $4 WHERE goal_id = $5 RETURNING *;", 
            [goal_name, goal_amount, current_value, target_date, goal_id]);
        if (response.rows.length !== 1) {
            throw new Error("Unable to update goal.");
        }
        return new Goal(response.rows[0]);
    }

    // Deletes a Goal using goal_id
    static async deleteGoal(request_body) {
        const { goal_id } = request_body
        // Deletes goal from database
        const response = await db.query("DELETE FROM goals WHERE goal_id = $1 RETURNING *;", 
            [goal_id]);
        if (response.rows.length !== 1) {
            throw new Error("Unable to delete goal.");
        }
        return new Goal(response.rows[0]);
    }
}

// Exports Goal class
module.exports = Goal;