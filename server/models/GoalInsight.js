// Imports Groq SDK for Node.js
// Allows devs to build apps powered by Groq AI
const Groq = require("groq-sdk")

// Import models to use getAllHouseholdxxx() functions
const Goal = require("./Goal")
const Income = require("./income")
const Bill = require("./Bill")
const Home = require("./home")

// Groq API key allows you to authenticate your requests
// Without an API key, request to Groq wouldn't go through
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

class GoalInsight {

    // AI Helper Function for Feasibility (Do Calculations before generating AI Responses)
    static async getFeasibilityCalculations(household_id) {
        // Calculates Total Income
        const income = await Income.getAllHouseholdIncome(household_id)
        let totalIncome = 0
        for (const incomeItem of income) {
            totalIncome += Number(incomeItem.income_amount)
        }

        // Calculates Total Bills
        const bills = await Bill.getAllHouseholdBills(household_id)
        let totalBills = 0
        for (const billItem of bill) {
            totalBills += Number(billItem.bill_amount)
        }

        // Calculates Disposable Income
        const disposableIncome = totalIncome - totalBills

        // // Calculates amountRemaining until financial goal is achieved
        // const goals = await Goal.getAllHouseholdGoals(household_id)
        // const amountRemaining = goals.map((goal) => {
        //     return {
        //         goalName: goal.goal_name,
        //         amountRemaining: goal.goal_amount - goal.current_value
        //     }
        // })

        // const monthsUntilTarget = goals.map((goal) => {
        //     return {
        //         goalName: goal.goal_name,
        //         currentDate: date = new Date

        //     }
        // })
    }
    

    // Provides response breaking down how feasible the goals are
    static async getFeasibility(household_id) {
        
        // Retrieves all goal, income and bill information for a given household
        const goals = await Goal.getAllHouseholdGoals(household_id)
        const income = await Income.getAllHouseholdIncome(household_id)
        const bills = await Bill.getAllHouseholdBills(household_id)
        const disposableIncome = await Home.getNetGainLoss(household_id)

        // Prompt that will be inputting into Groq
        // JSON.stringify converts JSON object into string
        const prompt = `
        You are a financial planning assistant for a couple's personal finance app.

        Analyse the feasibility of each household goal using only the data provided.

        Household Goals:
        ${JSON.stringify(goals, null, 2)}

        Household Income:
        ${JSON.stringify(income, null, 2)}

        Household Bills:
        ${JSON.stringify(bills, null, 2)}

        Household Disposable Income:
        ${JSON.stringify(disposableIncome, null, 2)}

        Instructions:
        1. Calculate total monthly household income.
        2. Calculate total monthly household bills.
        3. Calculate estimated monthly disposable income: Disposable Income = Total Income - Total Bills
        4. For each goal:
        - Calculate the amount remaining to save.
        - Calculate the number of months until the target date.
        - Calculate the estimated monthly savings required to reach the goal by target date.
        - Compare the required monthly savings against disposable income.
        - Assign one feasibility rating.

        Feasibility Rating Rules:
        - Realistic: Monthly savings required is less than 20% of disposable income.
        - Challenging: Monthly savings required is between 20% and 50% of disposable income.
        - Unrealistic: Monthly savings required is more than 50% of disposable income, disposable income is zero or negative, or the target date has already passed.

        Strict Rules:
        - Use GBP (£).
        - Use only the supplied data.
        - Do not invent missing values.
        - Do not speculate about inflation, emergencies, job loss, future prices, or wider economic conditions.
        - Do not show working out or calculations.
        - Only show the final calculated values requested in the response format.
        - Do not contradict the calculated rating.
        - Keep explanations concise and practical.
        - Write in plain English.
        - Do not include notes, summaries, disclaimers, headings, or extra comments.

        Response Format:

        Estimated Household Disposable Income: £X

        Goal: [Goal Name]
        Estimated Monthly Savings Required: £X
        Feasibility Rating: Realistic | Challenging | Unrealistic
        Explanation: [One concise sentence explaining the rating.]

        Goal: [Goal Name]
        Estimated Monthly Savings Required: £X
        Feasibility Rating: Realistic | Challenging | Unrealistic
        Explanation: [One concise sentence explaining the rating.]

        <NOTHING MORE>

        Formatting Rules:
        - Add one blank line between goals.
        - Do not include anything outside the response format.
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

        Analyse the priority of each household goal using only the data provided.

        Household Goals:
        ${JSON.stringify(goals, null, 2)}

        Household Income:
        ${JSON.stringify(income, null, 2)}

        Household Bills:
        ${JSON.stringify(bills, null, 2)}

        Instructions:
        1. Calculate total monthly household income.
        2. Calculate total monthly household bills.
        3. Calculate estimated monthly disposable income: Disposable Income = Total Income - Total Bills
        4. For each goal:
        - Calculate the amount remaining to save.
        - Calculate the number of months until the target date.
        - Calculate the estimated monthly savings required.
        - Compare the monthly savings required against disposable income.
        - Consider whether multiple goals compete for the same disposable income.
        5. Rank every goal from highest priority to lowest priority.

        When determining rankings, prioritise:
        1. Urgency of the target date.
        2. Estimated monthly savings required.
        3. Amount remaining to save.
        4. Competition for available disposable income.

        Priority Rating Rules:

        High Priority:
        - The target date is near.
        - The goal requires a significant monthly savings commitment relative to disposable income.
        - Delaying action increases the likelihood of missing the target date.

        Medium Priority:
        - The goal requires regular savings but remains achievable without immediate action.
        - The goal competes moderately with other goals for available disposable income.

        Low Priority:
        - The target date is distant.
        - The required monthly savings are relatively low.
        - The goal can reasonably be delayed while higher-priority goals are funded.

        Strict Rules:
        - Currency is GBP (£).
        - Use only the supplied data.
        - Do not make assumptions beyond the supplied data.
        - Do not speculate about personal preferences, emotional value, lifestyle choices, future economic conditions, inflation, job loss, emergencies, or unexpected expenses.
        - Do not invent reasons that are not supported by the data.
        - Do not show calculations or working out.
        - Use calculations only to determine rankings.
        - Do not contradict your calculations.
        - Verify calculations before assigning rankings.
        - Rankings must be consistent with the calculated urgency and savings requirements.
        - Keep explanations concise and practical.
        - Write in plain English for non-technical users.
        - Keep the response compact.
        - Do not include notes, summaries, recommendations, disclaimers, introductions, conclusions, or extra comments.

        Response Format:

        Priority Ranking: X
        Goal: [Goal Name]
        Priority Rating: High Priority | Medium Priority | Low Priority
        Explanation: [One concise sentence explaining the ranking.]

        Priority Ranking: X
        Goal: [Goal Name]
        Priority Rating: High Priority | Medium Priority | Low Priority
        Explanation: [One concise sentence explaining the ranking.]

        <NOTHING MORE>

        Formatting Rules:
        - List goals from highest priority to lowest priority.
        - Rankings must be unique.
        - Add exactly one blank line between goals.
        - Do not include any content outside the response format.
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

        Analyse the household's spending and identify opportunities to reduce expenditure and free up money for financial goals.

        Use only the data provided.

        Household Goals:
        ${JSON.stringify(goals, null, 2)}

        Household Income:
        ${JSON.stringify(income, null, 2)}

        Household Bills:
        ${JSON.stringify(bills, null, 2)}

        Instructions:

        1. Calculate total monthly household income.
        2. Calculate total monthly household bills.
        3. Calculate estimated monthly disposable income: Disposable Income = Total Income - Total Bills
        4. Review all household bills and recurring spending.
        5. Identify opportunities to reduce spending.
        6. Prioritise opportunities based on:
        - Potential savings.
        - Ease of implementation.
        - Likelihood of immediate financial impact.
        7. Rank opportunities from highest priority to lowest priority.

        Priority Rating Rules:

        High Priority:
        - The opportunity can be implemented immediately.
        - The opportunity is likely to generate significant savings.
        - The opportunity has a clear and direct financial benefit.

        Medium Priority:
        - The opportunity provides moderate savings.
        - The opportunity may require some effort or changes to existing services.
        - The opportunity has a noticeable but less significant financial impact.

        Low Priority:
        - The opportunity provides relatively small savings.
        - The opportunity requires substantial effort or long-term changes.
        - The financial impact is limited.

        Strict Rules:
        - Currency is GBP (£).
        - Use only the supplied data.
        - Do not make assumptions beyond the supplied data.
        - Do not speculate about personal preferences, emotional value, lifestyle choices, future economic conditions, inflation, job loss, emergencies, or unexpected expenses.
        - Only recommend alternatives when there is a clear and reasonable basis from the bill information provided.
        - Do not invent products, services, subscriptions, or savings figures that are unsupported by the data.
        - If no suitable alternative can be identified, state "No specific alternative identified".
        - Do not show calculations or working out.
        - Use calculations only to determine rankings and estimated savings.
        - Do not contradict your calculations.
        - Verify calculations before assigning rankings.
        - Keep explanations concise and practical.
        - Write in plain English for non-technical users.
        - Keep the response compact.
        - Do not include introductions, conclusions, notes, summaries, or extra commentary.

        For each opportunity provide:
        1. Priority Rating
        2. Spending Reduction Opportunity
        3. Alternative Products & Services
        4. Estimated Annual Savings

        Response Format:

        Disclaimer: Suggested alternatives and savings estimates are suggestions only. They may not be practical for your situation. Please check pricing and product details before taking action.

        Priority Rating: High Priority | Medium Priority | Low Priority
        Spending Reduction Opportunity: [One concise sentence describing the opportunity.]
        Alternative Products & Services: [One concise sentence describing a suitable alternative or "No specific alternative identified".]
        Estimated Annual Savings: £X

        Priority Rating: High Priority | Medium Priority | Low Priority
        Spending Reduction Opportunity: [One concise sentence describing the opportunity.]
        Alternative Products & Services: [One concise sentence describing a suitable alternative or "No specific alternative identified".]
        Estimated Annual Savings: £X

        <NOTHING MORE>

        Formatting Rules:
        - List opportunities from highest priority to lowest priority.
        - Do not add blank lines within an opportunity.
        - Add exactly one blank line between opportunities.
        - Do not include any content outside the response format.
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