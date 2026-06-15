// Imports Google Gen AI SDK for Node.js
// Allows devs to build apps powered by Gemini
const { GoogleGenAI } = require("@google/genai")

// Import models to use getAllHousholdxxx() functions
const Goal = require("./Goal")
const Income = require("./Income")
const Bill = require("./Bill")

// Gemini API key allows you to authenticate your requests
// Without an API key, request to Gemini wouldn't go through
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

class GoalInsight {

    // Provides response breaking down how feasible the goals are
    static async getFeasibility(household_id) {
        
        // Retrieves all goal, income and bill information for a given household
        const goals = await Goal.getAllHouseholdGoals(household_id)
        const income = await Income.getAllHouseholdIncome(household_id)
        const bills = await Bill.getAllHouseholdBills(household_id)

        // Prompt that will be inputting into Gemini
        // JSON.stringify converts JSON object into string
        const prompt = `
        A couple is using a couple's personal finance app to track shared financial goals.

        The breakdown of their goals, their household income, and their household bills is below:

        Household Goals:
        ${JSON.stringify(goals, null, 2)}

        Household Income:
        ${JSON.stringify(income, null, 2)}

        Household Bills:
        ${JSON.stringify(bills, null, 2)}

        Analyse the feasibility of each household goal, considering:
        - Total household income
        - Total household bills
        - Estimated disposable income remaining each month (total household income - total household bills)
        - Amount already saved toward each goal 
        - Goal target amount
        - Goal target date
        - Potential financial risks or concerns

        In the response, before diving into each goal, provide:
        1. Estimated household disposable income
        
        And for each goal provide:
        1. Goal Name 
        2. Estimated monthly savings required (Amount Remaining to Save / Months Until Target Date)
        3. Feasibility Rating: (Base the rating on how realistic the required monthly savings are compared with the household's estimated disposable income)
            - Realistic
            - Challenging
            - Unrealistic
        4. Rating Explanation

        Use a compact format. Do not add blank lines within each goal section. Add one blank line between different goals.

        Please keep advice concise, practical and written in plain English for non technical users.
        `

        // Sends prompt to Gemini and awaits response stored in variable called response
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt
        })

        // Returns response variable in text format
        return response.text
    }


    // Provides response prioritising a households' goals
    static async getPriority(household_id) {
        
        // Retrieves all goal, income and bill information for a given household
        const goals = await Goal.getAllHouseholdGoals(household_id)
        const income = await Income.getAllHouseholdIncome(household_id)
        const bills = await Bill.getAllHouseholdBills(household_id)

        // Prompt that will be inputting into Gemini
        // JSON.stringify converts JSON object into string
        const prompt = `
        A couple is using a couple's personal finance app to track shared financial goals.

        The breakdown of their goals, their household income, and their household bills is below:

        Household Goals:
        ${JSON.stringify(goals, null, 2)}

        Household Income:
        ${JSON.stringify(income, null, 2)}

        Household Bills:
        ${JSON.stringify(bills, null, 2)}

        Analyse the priority of each household goal, considering:
        - Total household income
        - Total household bills
        - Estimated disposable income remaining each month (total household income - total household bills)
        - Amount already saved toward each goal 
        - Goal target amount
        - Goal target date
        - Potential financial risks or concerns
        
        In the response, for each goal, do them in order of highest priority to lowest priority and provide:
        1. Priority Ranking (e.g. 1 if first, 2 if second etc.)
        2. Goal Name 
        3. Priority Rating: (Base the priority rating on the urgency of the goal, financial importance, target date, progress already made, and competition with other goals for available funds.)
            - High Priority
            - Medium Priority
            - Low Priority
        4. Rating Explanation

        Use a compact format. Do not add blank lines within each goal section. Add one blank line between different goals.

        Please keep advice concise, practical and written in plain English for non technical users.
        `

        // Sends prompt to Gemini and awaits response stored in variable called response
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt
        })

        // Returns response variable in text format
        return response.text
    }


    // Provides response breaking down ways to optimise resolving the goal
    static async getOptimisation(household_id) {
        
        // Retrieves all goal, income and bill information for a given household
        const goals = await Goal.getAllHouseholdGoals(household_id)
        const income = await Income.getAllHouseholdIncome(household_id)
        const bills = await Bill.getAllHouseholdBills(household_id)

        // Prompt that will be inputting into Gemini
        // JSON.stringify converts JSON object into string
        const prompt = `
        A couple is using a couple's personal finance app to track shared financial goals.

        The breakdown of their goals, their household income, and their household bills is below:

        Household Goals:
        ${JSON.stringify(goals, null, 2)}

        Household Income:
        ${JSON.stringify(income, null, 2)}

        Household Bills:
        ${JSON.stringify(bills, null, 2)}

        Analyse the household's spending and identify actions that could help free up money to reach their financial goals faster. Consider:
        - Total household income
        - Total household bills
        - Estimated disposable income remaining each month
        - Recurring subscriptions or bills
        - Areas where spending may be reduced
        - High-confidence cheaper alternatives where appropriate
        - Which actions are likely to have the biggest financial impact

        In the response, list actions in order of priority.

        For each action, provide:
        1. Priority
        2. Spending Reduction Opportunity
        3. Alternative Products and Services
        4. Estimated Annual Savings

        Add the following disclaimer at the bottom:

        Disclaimer: Suggested alternatives and savings estimates are indicative only. Please check current prices and product details before taking action.

        Use a compact format. Do not add blank lines within each action section. Add one blank line between different actions.

        Please keep advice concise, practical, and written in plain English for non-technical users.
        `

        // Sends prompt to Gemini and awaits response stored in variable called response
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt
        })

        // Returns response variable in text format
        return response.text
    }

}

module.exports = GoalInsight;