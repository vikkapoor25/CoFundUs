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


    
})