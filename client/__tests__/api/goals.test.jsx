import {getGoals,createGoal,updateGoal,deleteGoal} from '../../api/goals'

describe('api/goals', () => {
    beforeEach(() => {
        global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({ success: true }),
        })
        )
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    
    test('getGoals fetches all goals for a household', async () => {
        const data = await getGoals(1)
        expect(fetch).toHaveBeenCalledTimes(1)
        const [url, options] = fetch.mock.calls[0]
        expect(url).toContain('/goals/1')
        expect(options).toBeUndefined()
        expect(data.success).toBe(true)
    })
    

    test('createGoals create goal for a household', async () => {
        const body = {
            household_id: 1,
            goal_name: "phone",
            goal_amount: 1000,
            current_value: 200,
            target_date: "2026-09-12",
        }
        const data = await createGoal(body)
        expect(fetch).toHaveBeenCalledTimes(1)
        const [url, options] = fetch.mock.calls[0]
        expect(url).toContain('/goals/new')
        expect(options).toBeUndefined()
        expect(data.success).toBe(true)
    })

    test('updategoal update an exisiting goal for a household', async () => {
        const body = {
            goal_id: 1,
            goal_name: "phone",
            goal_amount: 1000,
            current_value: 100,
            target_date: "2026-09-12",
        }
        const data = await updateGoal(body)
        expect(fetch).toHaveBeenCalledTimes(1)
        const [url, options] = fetch.mock.calls[0]
        expect(url).toContain('/goals/update')
        expect(options).toBeUndefined()
        expect(data.success).toBe(true)
    })


    test('deleteGoal deletes goal by id', async () => {
        const data = await deleteGoal(1)
        expect(fetch).toHaveBeenCalledTimes(1)
        const [url, options] = fetch.mock.calls[0]
        expect(url).toContain('/goals/delete')
        expect(options.method).toBe('DELETE')
        expect(options.headers['Content-Type']).toBe('application/json')
        expect(JSON.parse(options.body)).toEqual({
          account_id: 5,
        })
        expect(data.success).toBe(true)
    })

    
})