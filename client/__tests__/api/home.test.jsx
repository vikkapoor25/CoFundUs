import {getHome,getBills,getGoal,getNet} from '../../api/home'

describe('api/home', () => {
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


    test('getHome fetches for a household', async () => {
        const data = await getHome(1)
        expect(fetch).toHaveBeenCalledTimes(1)
        const [url, options] = fetch.mock.calls[0]
        expect(url).toContain('/home/1')
        expect(options).toBeUndefined()
        expect(data.success).toBe(true)
    })


    test('getNet fetches net gain for a household', async () => {
        const data = await getNet(1)
        expect(fetch).toHaveBeenCalledTimes(1)
        const [url, options] = fetch.mock.calls[0]
        expect(url).toContain('/home/net/1')
        expect(options).toBeUndefined()
        expect(data.success).toBe(true)
    })


    test('getGoals fetches net gain for a household', async () => {
        const data = await getGoal(1)
        expect(fetch).toHaveBeenCalledTimes(1)
        const [url, options] = fetch.mock.calls[0]
        expect(url).toContain('/home/goal/1')
        expect(options).toBeUndefined()
        expect(data.success).toBe(true)
    })

    test('getBills fetches all bills for a household', async () => {
        const data = await getBills(1)
        expect(fetch).toHaveBeenCalledTimes(1)
        const [url, options] = fetch.mock.calls[0]
        expect(url).toContain('/home/bills/1')
        expect(options).toBeUndefined()
        expect(data.success).toBe(true)
    })


})