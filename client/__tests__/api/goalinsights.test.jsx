import {getFeasibility,getPriority,getOptimisation} from '../../api/goalInsights'

describe('api/goal-insights', () => {
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