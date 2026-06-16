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
        for (const billItem of bills) {
            totalBills += Number(billItem.bill_amount)
        }

        // Calculates Disposable Income
        const disposableIncome = totalIncome - totalBills

        // Calculates amountRemaining (£) until financial goal is achieved
        const goals = await Goal.getAllHouseholdGoals(household_id)
        const amountRemaining = goals.map((goal) => {
            return {
                goal_name: goal.goal_name,
                amount_remaining: goal.goal_amount - goal.current_value
            }
        })

        // Calculates number of months until target date from today's date
        const monthsUntilTarget = goals.map((goal) => {
            const today = new Date()
            const targetDate = new Date(goal.target_date)
            const months = ((targetDate.getFullYear() - today.getFullYear()) * 12) + (targetDate.getMonth() - today.getMonth())
            return {
                goal_name: goal.goal_name,
                months_until_target: months
            }
        })

        // The amount you would need to contribute to a goal each month to meet the target date
        const monthlySavings = goals.map((goal) => {
            const today = new Date()
            const targetDate = new Date(goal.target_date)
            const months = ((targetDate.getFullYear() - today.getFullYear()) * 12) + (targetDate.getMonth() - today.getMonth())
            const amountRemaining = goal.goal_amount - goal.current_value
            return {
                goal_name: goal.goal_name,
                monthly_savings: months > 0 ? amountRemaining / months : amountRemaining
            }
        })

        // Calculates feasibility rating according to criteria
        const feasibilityRating = goals.map((goal) => {
            const today = new Date()
            const targetDate = new Date(goal.target_date)
            const months = ((targetDate.getFullYear() - today.getFullYear()) * 12) + (targetDate.getMonth() - today.getMonth())
            const amountRemaining = goal.goal_amount - goal.current_value
            const monthlySavings = months > 0 ? amountRemaining / months : amountRemaining
            const feasibilityPercentage = monthlySavings / disposableIncome
            let feasibilityRating
            if (feasibilityPercentage <= 0.2) {
                feasibilityRating = "Realistic" 
            }
            else if (feasibilityPercentage > 0.2 && feasibilityPercentage <= 0.5)
                feasibilityRating = "Challenging"
            else if (feasibilityPercentage > 0.5) {
                feasibilityRating = "Unrealistic"
            }
            return {
                goal_name: goal.goal_name,
                feasibility_rating: feasibilityRating,
                feasibility_percentage: feasibilityPercentage
            }
        })

        return { disposableIncome, amountRemaining, monthsUntilTarget, monthlySavings, feasibilityRating }
    }
    

    // Provides response breaking down how feasible the goals are
    static async getFeasibility(household_id) {
        
        // Retrieves all goal, income and bill information for a given household
        const FeasibilityCalculations = await this.getFeasibilityCalculations(household_id)

        // Prompt that will be inputting into Groq
        // JSON.stringify converts JSON object into string
        const prompt = `
        You are a financial planning assistant for a household finance application.

        Your role is to explain how achievable each household savings goal appears based on the financial calculations provided.

        You must produce one financial assessment for each household goal.

        Household Disposable Income:
        £${FeasibilityCalculations.disposableIncome}

        Monthly Savings Data:
        ${JSON.stringify(FeasibilityCalculations.monthlySavings, null, 2)}

        Feasibility Rating Data:
        ${JSON.stringify(FeasibilityCalculations.feasibilityRating, null, 2)}

        Output Rules:

        - Output exactly one block per goal in Monthly Savings Data.
        - Use each goal_name exactly as provided.
        - Use each monthly_savings value as the Estimated Monthly Savings Required.
        - Use each feasibility_rating exactly as provided.
        - Do not create new goals.
        - Do not repeat goals.
        - Do not mention missing goals.
        - Do not perform calculations.
        - Do not add any introduction, summary, recommendation, note, disclaimer, heading, or conclusion.
        - Stop immediately after the final Explanation line.

        Response Format:

        Estimated Household Disposable Income: £${FeasibilityCalculations.disposableIncome}

        Goal: [goal_name]
        Estimated Monthly Savings Required: £[monthly_savings]
        Feasibility Rating: [feasibility_rating]
        Explanation: [One concise sentence explaining why this feasibility rating was assigned using the financial calculations provided.]

        Explanation Rules:
        - Base the explanation on the financial calculations provided.
        - Interpret the financial impact rather than repeating calculation values.
        - Explain what the rating means for the household in practical terms.
        - Avoid quoting percentages, formulas, or raw calculation values unless necessary.
        - Keep explanations concise, professional, and easy to understand.
        - Do not make assumptions about personal motivations, emotions, or lifestyle choices.

        Formatting Rules:

        - Add exactly one blank line between goal blocks.
        - Do not include anything outside the response format.
        `

        // Sends the prompt to Groq's AI model and waits for a response
        const response = await groq.chat.completions.create({
            // AI model used to generate the response
            model: "llama-3.1-8b-instant",
            // Makes AI as predictable/deterministic as possible
            temperature: 0,
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


    // AI Helper Function for Priority (Do Calculations before generating AI Responses)
    static async getPriorityCalculations(household_id) {
        // Calculates Total Income
        const income = await Income.getAllHouseholdIncome(household_id)
        let totalIncome = 0
        for (const incomeItem of income) {
            totalIncome += Number(incomeItem.income_amount)
        }

        // Calculates Total Bills
        const bills = await Bill.getAllHouseholdBills(household_id)
        let totalBills = 0
        for (const billItem of bills) {
            totalBills += Number(billItem.bill_amount)
        }

        // Calculates Disposable Income
        const disposableIncome = totalIncome - totalBills

        // Calculates amountRemaining (£) until financial goal is achieved
        const goals = await Goal.getAllHouseholdGoals(household_id)
        const amountRemaining = goals.map((goal) => {
            return {
                goal_name: goal.goal_name,
                amount_remaining: goal.goal_amount - goal.current_value
            }
        })

        // Calculates number of months until target date from today's date
        const monthsUntilTarget = goals.map((goal) => {
            const today = new Date()
            const targetDate = new Date(goal.target_date)
            const months = ((targetDate.getFullYear() - today.getFullYear()) * 12) + (targetDate.getMonth() - today.getMonth())
            return {
                goal_name: goal.goal_name,
                months_until_target: months
            }
        })

        // The amount you would need to contribute to a goal each month to meet the target date
        const monthlySavings = goals.map((goal) => {
            const today = new Date()
            const targetDate = new Date(goal.target_date)
            const months = ((targetDate.getFullYear() - today.getFullYear()) * 12) + (targetDate.getMonth() - today.getMonth())
            const amountRemaining = goal.goal_amount - goal.current_value
            return {
                goal_name: goal.goal_name,
                monthly_savings: months > 0 ? amountRemaining / months : amountRemaining
            }
        })

        // Calculates priority rating according to criteria
        const priorityRating = goals.map((goal) => {
            const today = new Date()
            const targetDate = new Date(goal.target_date)
            const months = ((targetDate.getFullYear() - today.getFullYear()) * 12) + (targetDate.getMonth() - today.getMonth())
            const amountRemaining = goal.goal_amount - goal.current_value
            const monthlySavings = months > 0 ? amountRemaining / months : amountRemaining
            const savingsPressure = monthlySavings / disposableIncome
            let priorityRating
            // months, feasibility percentage 
            if (disposableIncome <= 0 || months <= 0) {
                priorityRating = "High Priority" 
            }
            else if (months <= 6 || savingsPressure > 0.5) {
                priorityRating = "High Priority" 
            }
            else if (months < 12 || savingsPressure > 0.2)
                priorityRating = "Medium Priority"
            else {
                priorityRating = "Low Priority"
            }
            return {
                goal_name: goal.goal_name,
                priority_rating: priorityRating,
                months_until_target: months,
                monthly_savings_required: monthlySavings,
                savings_pressure: savingsPressure
            }
        })

        return { disposableIncome, amountRemaining, monthsUntilTarget, monthlySavings, priorityRating }
    }


    // Provides response prioritising a households' goals
    static async getPriority(household_id) {
        
        // Retrieves all goal, income and bill information for a given household
        const priorityCalculations = await this.getPriorityCalculations(household_id)

        // Prompt that will be inputting into Groq
        // JSON.stringify converts JSON object into string
        const prompt = `
        You are a financial adviser inside a household finance app.

        Your role is to help the household understand which savings goals should be prioritised first.

        The priority ratings have already been calculated using the financial data provided. Do not recalculate or change the ratings.

        Priority Data:
        ${JSON.stringify(priorityCalculations.priorityRating, null, 2)}

        Output Rules:

        - Output exactly one block per item in Priority Data.
        - Sort the goals by priority before outputting them.
        - Show High Priority goals first, then Medium Priority goals, then Low Priority goals.
        - Within the same priority rating, place goals with fewer months_until_target first.
        - Assign Priority Rank after sorting.
        - Priority Rank must start at 1 for the first goal shown and increase by 1 for each following goal.
        - Use each goal_name exactly as provided.
        - Use each priority_rating exactly as provided.
        - Do not create new goals.
        - Do not repeat goals.
        - Do not perform calculations.
        - Do not add an introduction, summary, recommendation section, note, disclaimer, heading, or conclusion.
        - Stop immediately after the final Explanation line.

        Response Format:

        Priority Rank: [priority_rank]
        Goal: [goal_name]
        Priority Rating: [priority_rating]
        Explanation: [One concise sentence explaining the financial planning reason this goal has this priority position.]

        Explanation Rules:

        - Sound like a calm, professional financial adviser.
        - Explain the practical planning reason for the goal's priority position.
        - Focus on prioritisation, not affordability.
        - Use the priority rating, time remaining, savings pressure, and required saving commitment as context.
        - Interpret the data in plain English rather than listing calculations.
        - Use exact figures only if they make the advice clearer.
        - Do not simply define High Priority, Medium Priority, or Low Priority.
        - Do not repeat the same explanation for multiple goals.
        - Do not describe the goal itself.
        - Do not explain the personal purpose or emotional value of the goal.
        - Do not comment on whether the goal is important, worthwhile, enjoyable, expensive, significant, or beneficial.
        - Do not invent personal motivations, lifestyle details, family intentions, or future outcomes.
        - Do not speak from the household's perspective.
        - Do not use "we", "our", "us", "I", or "you".
        - Keep the explanation practical, natural, and easy to understand.

        Formatting Rules:

        - Add exactly one blank line between goal blocks.
        - Do not include anything outside the response format.
        `
        // Sends the prompt to Groq's AI model and waits for a response
        const response = await groq.chat.completions.create({
            // AI model used to generate the response
            model: "llama-3.1-8b-instant",
            // Makes AI as predictable/deterministic as possible
            temperature: 0,
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


    // AI Helper Function for Optimisation (Do Calculations before generating AI Responses)
    static async getOptimisationCalculations(household_id) {
        const bills = await Bill.getAllHouseholdBills(household_id)
        // Calculates total bills each month
        let totalBills = 0
        for (const billItem of bills) {
            totalBills += billItem.bill_amount
        }

        // Calculates total bills each year
        const annualBillCost = bills.map((bill) => {
            return {
                bill_name: bill.bill_name,
                annual_bill_cost: bill.bill_amount * 12
            }
        })

        // Calculates of the total bill amount each month, the proportion that each bill takes up
        const percentageOfBills = bills.map((bill) => {
            return {
                bill_name: bill.bill_name,
                percentage_of_bills: bill.bill_amount / totalBills
            }
        })

        // How much the change would save 
        const estimatedAnnualSavings = bills.map((bill) => {
            const annualCost = bill.bill_amount * 12

            return {
                bill_name: bill.bill_name,
                estimated_annual_savings: annualCost * 0.25
            }
        })

        // Priority based on proportion bill takes of total bill amount
        const optimisationPriority = bills.map((bill) => {
            const percentageOfBills = bill.bill_amount / totalBills
            let priority
            if (percentageOfBills >= 0.1) {
                priority = "High Priority"
            }
            else if (percentageOfBills >= 0.05) {
                priority = "Medium Priority"
            }
            else {
                priority = "Low Priority"
            }
            return {
                bill_name: bill.bill_name,
                optimisation_priority: priority,
                monthly_bill_amount: bill.bill_amount,
                percentage_of_bills: percentageOfBills,
                estimated_annual_savings: bill.bill_amount * 12 * 0.25
            }
        })

        return { totalBills, annualBillCost, percentageOfBills, estimatedAnnualSavings, optimisationPriority }
    }


    // Provides response breaking down ways to optimise resolving the goal
    static async getOptimisation(household_id) {
        
        // Retrieves all goal, income and bill information for a given household
        const optimisationCalculations = await this.getOptimisationCalculations(household_id)

        // Prompt that will be inputting into Groq
        // JSON.stringify converts JSON object into string
const prompt = `
You are a financial adviser inside a household finance application.

Your role is to identify the spending categories that may offer the greatest opportunities for savings.

Optimisation priorities and estimated annual savings have already been calculated using household financial data. Do not recalculate them.

Optimisation Data:
${JSON.stringify(optimisationCalculations.optimisationPriority, null, 2)}

Output Rules:

* Output exactly one block per item in Optimisation Data.
* Use each bill_name exactly as provided.
* Use each optimisation_priority exactly as provided.
* Use each estimated_annual_savings exactly as provided.
* Assign Priority Rank based on the order of output.
* Priority Rank must start at 1 and increase by 1 for each following bill.
* Do not create new bills.
* Do not repeat bills.
* Do not perform calculations.
* Do not invent specific products, brands, providers, tariffs, or prices.
* Do not add an introduction, summary, disclaimer, heading, or conclusion.

Response Format:

Priority Rank: [priority_rank]
Bill: [bill_name]
Priority Rating: [optimisation_priority]
Recommendation: [One concise sentence explaining the savings opportunity and a practical next step.]
Estimated Annual Savings: £[estimated_annual_savings]

Advice Style:

* Sound like a professional financial adviser.
* Focus on identifying practical savings opportunities.
* Explain why the bill may be worth reviewing.
* Suggest a realistic next step.
* Interpret the financial impact in plain English rather than repeating calculations.
* Do not judge spending choices.
* Do not use words such as "unnecessary", "wasteful", "bad", or "excessive".
* Do not comment on personal lifestyle choices.
* Do not speak from the household's perspective.
* Do not use "we", "our", "us", "I", or "you".
* Keep recommendations concise, practical, and easy to understand.

Formatting Rules:

* Show High Priority bills first.
* Then show Medium Priority bills.
* Then show Low Priority bills.
* Within each priority group, show larger estimated annual savings first.
* Add exactly one blank line between bill blocks.
* Do not include anything outside the response format.
  `
        // Sends the prompt to Groq's AI model and waits for a response
        const response = await groq.chat.completions.create({
            // AI model used to generate the response
            model: "llama-3.1-8b-instant",
            temperature: 0,
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