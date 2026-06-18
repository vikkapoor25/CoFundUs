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


    test('getFeasability fetches all ai for a household', async () => {
        const data = await getFeasibility(1)
        expect(fetch).toHaveBeenCalledTimes(1)
        const [url, options] = fetch.mock.calls[0]
        expect(url).toContain('/goal-insights/feasibility/household/1')
        expect(options).toBeUndefined()
        expect(data.success).toBe(true)
    })


    test('getOptimisation fetches all ai for a household', async () => {
        const data = await getOptimisation(1)
        expect(fetch).toHaveBeenCalledTimes(1)
        const [url, options] = fetch.mock.calls[0]
        expect(url).toContain('/goal-insights/optimisation/household/1')
        expect(options).toBeUndefined()
        expect(data.success).toBe(true)
    })



    test('getOptimisation fetches all ai for a household', async () => {
        const data = await getOptimisation(1)
        expect(fetch).toHaveBeenCalledTimes(1)
        const [url, options] = fetch.mock.calls[0]
        expect(url).toContain('/goal-insights/priority/household/1')
        expect(options).toBeUndefined()
        expect(data.success).toBe(true)
    })



    


    
})