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
                feasibility_rating:  feasibilityRating
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
        You are a financial planning assistant for a couple's personal finance app.

        Analyse the feasibility of each household goal using only the data provided.

        Calculated household data for feasibility:
        ${JSON.stringify(FeasibilityCalculations, null, 2)}

        Strict Rules:
        - Do not perform any calculations.
        - Do not change any values.
        - Do not change any feasibility ratings.
        - Use the monthly_savings value as the Estimated Monthly Savings Required.
        - Explain each feasibility rating in one concise sentence.
        - Use GBP (£).
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
                priority_rating:  priorityRating
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
        You are a financial planning assistant for a couple's personal finance app.

        The financial calculations and priority ratings have already been completed by the application.

        Use only the calculated data provided.

        Calculated Household Data:
        ${JSON.stringify(priorityCalculations, null, 2)}

        Task:
        - Present all High Priority goals first.
        - Present all Medium Priority goals second.
        - Present all Low Priority goals last.
        - Use the supplied priority_rating exactly as provided.
        - Identify the single most important reason for each goal's priority.
        - Explain the priority rating in one concise sentence.

        Priority Based On must be one of:
        - Target Date
        - Monthly Savings Requirement
        - Amount Remaining
        - Disposable Income Pressure

        Strict Rules:
        - Do not perform calculations.
        - Do not modify any values.
        - Do not change any priority ratings.
        - Do not create numerical rankings.
        - Do not include a Priority Ranking field.
        - Each goal must appear exactly once.
        - Do not repeat goals.
        - Do not merge goals.
        - Do not omit goals.
        - Use the supplied priority_rating exactly as provided.
        - Priority Based On must contain exactly one reason.
        - Use GBP (£).
        - Write in plain English.
        - Do not provide recommendations.
        - Do not provide summaries.
        - Do not provide conclusions.
        - Do not provide an overall assessment.
        - Do not provide any content before the first Goal line.
        - Do not provide any content after the final Explanation line.
        - End the response immediately after the final Explanation line.

        Response Format:

        Goal: [Goal Name]
        Priority Rating: High Priority | Medium Priority | Low Priority
        Priority Based On: Target Date | Monthly Savings Requirement | Amount Remaining | Disposable Income Pressure
        Explanation: [One concise sentence explaining the priority rating.]

        <NOTHING MORE>

        Formatting Rules:

        - List all High Priority goals first.
        - Then list all Medium Priority goals.
        - Then list all Low Priority goals.
        - Add exactly one blank line between goals.
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
                optimisation_priority: priority
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
        You are a financial planning assistant for a couple's personal finance app.

        The spending calculations have already been completed by the application.

        Use only the calculated bill data provided to explain spending reduction opportunities.

        Calculated Household Spending Data:
        ${JSON.stringify(optimisationCalculations, null, 2)}

        Important Context:
        - estimated_annual_savings is based on a simple 25% reduction estimate.
        - optimisation_priority has already been calculated by the application.
        - Do not change any calculated values.
        - Do not change any optimisation priorities.
        - Do not perform calculations.

        Task:
        For each bill, write one concise spending reduction opportunity.

        Strict Rules:
        - Use GBP (£).
        - Use the supplied estimated_annual_savings exactly as provided.
        - Use the supplied optimisation_priority exactly as provided.
        - Do not invent exact product prices.
        - Do not invent unsupported savings figures.
        - Only suggest alternatives that are generic and reasonable from the bill name.
        - If no clear alternative can be identified, write "No specific alternative identified".
        - Do not include introductions, conclusions, notes, summaries, recommendations, or extra commentary.
        - End the response immediately after the final Estimated Annual Savings line.

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