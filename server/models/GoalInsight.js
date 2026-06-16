// Imports Groq SDK for Node.js
// Allows devs to build apps powered by Groq AI
const Groq = require("groq-sdk")

// Import models to use getAllHouseholdxxx() functions
const Goal = require("./Goal")
const Income = require("./Income")
const Bill = require("./Bill")

// Groq API key allows you to authenticate your requests
// Without an API key, request to Groq wouldn't go through
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

class GoalInsight {

    // Provides response breaking down how feasible the goals are
    static async getFeasibility(household_id) {
        
        // Retrieves all goal, income and bill information for a given household
        const goals = await Goal.getAllHouseholdGoals(household_id)
        const income = await Income.getAllHouseholdIncome(household_id)
        const bills = await Bill.getAllHouseholdBills(household_id)

        // Prompt that will be inputting into Groq
        // JSON.stringify converts JSON object into string
        const prompt = `
        You are a financial planning assistant for a couple's personal finance app.

        A couple is using the app to track shared financial goals.

        The breakdown of their goals, household income, and household bills is below:

        Household Goals:
        ${JSON.stringify(goals, null, 2)}

        Household Income:
        ${JSON.stringify(income, null, 2)}

        Household Bills:
        ${JSON.stringify(bills, null, 2)}

        Analyse the feasibility of each goal using only the information provided.

        Before assigning ratings:
        1. Calculate total household income.
        2. Calculate total household bills.
        3. Calculate estimated monthly disposable income:
        Disposable Income = Total Income - Total Bills
        4. For each goal:
        - Calculate amount remaining to save.
        - Calculate months until the target date.
        - Calculate estimated monthly savings required.
        - Compare the required monthly savings against the estimated disposable income.

        Feasibility Rating Rules:
        - Realistic: Monthly savings required is less than 20% of disposable income.
        - Challenging: Monthly savings required is between 20% and 50% of disposable income.
        - Unrealistic: Monthly savings required exceeds 50% of disposable income, disposable income is zero or negative, or the target date cannot realistically be achieved.

        Important Rules:
        - Currency is GBP (£)
        - Use only the information provided.
        - Do not make assumptions beyond the supplied data.
        - Do not speculate about inflation, future economic conditions, job loss, emergencies, or unexpected expenses.
        - Do not contradict your calculations.
        - Verify calculations before assigning ratings.
        - Keep explanations concise and practical.
        - Write in plain English for non-technical users. 
        - Keep the response compact.
        - DO NOT show any of the calculations

        ----------------------------------------------

        Response Format:

        Estimated Household Disposable Income: $X

        Goal: [Goal Name]
        Estimated Monthly Savings Required: £X
        Feasibility Rating: Realistic | Challenging | Unrealistic
        Explanation: [One concise sentence explaining the rating.]

        Goal: [Goal Name]
        Estimated Monthly Savings Required: £X
        Feasibility Rating: Realistic | Challenging | Unrealistic
        Explanation: [One concise sentence explaining the rating.]

        <NOTHING MORE>

        ------------------------------------------------

        Add a single blank line between goals.
        Do not include any information in addition to what is specificed and permitted in the response format.
        `

        // Sends the prompt to Groq's AI model and waits for a response
        const response = await groq.chat.completions.create({
            // AI model used to generate the response
            model: "llama-3.1-8b-instant",
            // Conversation sent to the AI model
            messages: [
                {
                    // Indicates this message is from the user
                    role: "user",
                    // The prompt containing household goals, income and bills
                    content: prompt
                }
            ]
        })
        // Returns the AI generated response text
        return response.choices[0].message.content
    }


    // Provides response prioritising a households' goals
    static async getPriority(household_id) {
        
        // Retrieves all goal, income and bill information for a given household
        const goals = await Goal.getAllHouseholdGoals(household_id)
        const income = await Income.getAllHouseholdIncome(household_id)
        const bills = await Bill.getAllHouseholdBills(household_id)

        // Prompt that will be inputting into Groq
        // JSON.stringify converts JSON object into string
        const prompt = `
        You are a financial planning assistant for a couple's personal finance app.

        A couple is using the app to track shared financial goals.

        The breakdown of their goals, household income, and household bills is below:

        Household Goals:
        ${JSON.stringify(goals, null, 2)}

        Household Income:
        ${JSON.stringify(income, null, 2)}

        Household Bills:
        ${JSON.stringify(bills, null, 2)}

        Analyse the priority of each goal using only the information provided.

        Before assigning priority ratings:
        1. Calculate total household income.
        2. Calculate total household bills.
        3. Calculate estimated monthly disposable income:
        Disposable Income = Total Income - Total Bills
        4. For each goal:
        - Calculate amount remaining to save.
        - Calculate months until the target date.
        - Consider how urgent the target date is.
        - Consider how much money is still needed.
        - Consider whether the goal competes heavily with other goals for available disposable income.

        Priority Rating Rules:
        - High Priority: The target date is soon, the goal needs regular attention now, and or delaying would make the goal difficult to achieve.
        - Medium Priority: The goal is important but has more time available, and or the required savings are manageable alongside other goals.
        - Low Priority: The goal has a distant target date, requires little immediate action, and or should wait until higher-priority goals are funded.

        Important Rules:
        - Currency is GBP (£).
        - Use only the information provided.
        - Do not make assumptions beyond the supplied data.
        - Do not speculate about personal importance, emotional value, future economic conditions, job loss, emergencies, or unexpected expenses.
        - Do not invent reasons such as "high potential for use" unless this is directly stated in the data.
        - Do not contradict your calculations.
        - Verify calculations before assigning priority ratings.
        - Keep explanations concise and practical.
        - Write in plain English for non-technical users.
        - Keep the response compact.
        - DO NOT show any calculations.
        - DO NOT include notes, summaries, disclaimers, or extra comments.

        Response Format:

        Priority Ranking: X
        Goal: [Goal Name]
        Priority Rating: High Priority | Medium Priority | Low Priority
        Explanation: [One concise sentence explaining the rating.]

        Priority Ranking: X
        Goal: [Goal Name]
        Priority Rating: High Priority | Medium Priority | Low Priority
        Explanation: [One concise sentence explaining the rating.]

        <NOTHING MORE>

        List goals from highest priority to lowest priority.
        Add a single blank line between goals.
        Do not include any information in addition to what is specified and permitted in the response format.
        `

        // Sends the prompt to Groq's AI model and waits for a response
        const response = await groq.chat.completions.create({
            // AI model used to generate the response
            model: "llama-3.1-8b-instant",
            // Conversation sent to the AI model
            messages: [
                {
                    // Indicates this message is from the user
                    role: "user",
                    // The prompt containing household goals, income and bills
                    content: prompt
                }
            ]
        })
        // Returns the AI generated response text
        return response.choices[0].message.content
    }


    // Provides response breaking down ways to optimise resolving the goal
    static async getOptimisation(household_id) {
        
        // Retrieves all goal, income and bill information for a given household
        const goals = await Goal.getAllHouseholdGoals(household_id)
        const income = await Income.getAllHouseholdIncome(household_id)
        const bills = await Bill.getAllHouseholdBills(household_id)

        // Prompt that will be inputting into Groq
        // JSON.stringify converts JSON object into string
        const prompt = `
        You are a financial planning assistant for a couple's personal finance app.

        A couple is using the app to track shared financial goals.

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
        - Which actions are likely to have the biggest financial 

        Priority Rating Rules:
        - High Priority: An action that can be taken immediately and save a large amount of money
        - Medium Priority: An action that can be taken immediately or save a large amount of money
        - Low Priority: An action that is not immediate and savings are long-term
        
        Important Rules:
        - Currency is GBP (£).
        - Use only the information provided.
        - Do not make assumptions beyond the supplied data.
        - Do not speculate about personal importance, emotional value, future economic conditions, job loss, emergencies, or unexpected expenses.
        - Do not invent reasons such as "high potential for use" unless this is directly stated in the data.
        - Do not contradict your calculations.
        - Verify calculations before assigning priority ratings.
        - Keep explanations concise and practical.
        - Write in plain English for non-technical users.
        - Keep the response compact.
        - DO NOT show any calculations.
        - DO NOT include notes, summaries, disclaimers, or extra comments.

        For each action, provide:
        1. Priority
        2. Spending Reduction Opportunity
        3. Alternative Products and Services
        4. Estimated Annual Savings

        Response Format:

        NOTE: 

        Priority Ranking: High Priority | Medium Priority | Low Priority
        Spending Reduction Opporutnity: [One concise sentence explaining the opportunity.]
        Alternative Products & Services: [One concise sentence explaining alternative products and service e.g. Libre Office instead of Microsoft.]
        Estimated Annual Savings: £X

        Priority Ranking: High Priority | Medium Priority | Low Priority
        Spending Reduction Opporutnity: [One concise sentence explaining the opportunity.]
        Alternative Products & Services: [One concise sentence explaining alternative products and service e.g. Libre Office instead of Microsoft.]
        Estimated Annual Savings: £X

        <NOTHING MORE>

        List opportunities from highest priority to lowest priority.

        Add the following disclaimer before providing the response:

        Disclaimer: Suggested alternatives and savings estimates are suggestions only. They may not be practical for your situation. Please check the prices provided and the product details before taking action.

        Use a compact format. Do not add blank lines within each action section. Add one blank line between different actions.

        Please keep advice concise, practical, and written in plain English for non-technical users.
        `

        // Sends the prompt to Groq's AI model and waits for a response
        const response = await groq.chat.completions.create({
            // AI model used to generate the response
            model: "llama-3.1-8b-instant",
            // Conversation sent to the AI model
            messages: [
                {
                    // Indicates this message is from the user
                    role: "user",
                    // The prompt containing household goals, income and bills
                    content: prompt
                }
            ]
        })
        // Returns the AI generated response text
        return response.choices[0].message.content
    }

}

module.exports = GoalInsight;