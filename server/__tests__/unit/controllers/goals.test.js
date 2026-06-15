// Import Goal Model for testing
const Goal = require('../../../models/Goal')
// Import goals Controller for testing
const goalsController = require('../../../controllers/goals')

// Mocking response methods
const mockSend = jest.fn()
const mockJson = jest.fn()
const mockEnd = jest.fn()

// we are mocking .send(), .json() and .end()
const mockStatus = jest.fn(() => ({ 
  send: mockSend, 
  json: mockJson, 
  end: mockEnd 
}));

const mockRes = { status: mockStatus };


describe('Goals controller', () => {
  beforeEach(() => jest.clearAllMocks())

  afterAll(() => jest.resetAllMocks())

  describe ('getAllHouseholdGoalsController', () => {
    let testGoals, mockReq;

    beforeEach(() => {
      testGoals = [
        { goal_id : 1, household_id : 1, goal_name: "Purchase iPhone", goal_amount: 290, current_value: 0, target_date: "2026-07-13" },
        { goal_id : 2, household_id : 1, goal_name: "Purchase PS5", goal_amount: 350, current_value: 100, target_date: "2026-07-13" }
      ]
      mockReq = { params: { household_id: 1 } }
    });

    it('should return goals belonging to household_id 1 with a 200 status code', async () => {
      jest.spyOn(Goal, 'getAllHouseholdGoals').mockResolvedValue(testGoals)

      await goalsController.getAllHouseholdGoalsController(mockReq, mockRes);
      
      expect(Goal.getAllHouseholdGoals).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(testGoals);
      expect(Goal.getAllHouseholdGoals).toHaveBeenCalledWith(1);
    })

    it('should return an error if household_id 1 has no goals', async () => {
      jest.spyOn(Goal, 'getAllHouseholdGoals').mockRejectedValue(new Error("Household currently has no financial goals."))

      await goalsController.getAllHouseholdGoalsController(mockReq, mockRes);
      
      expect(Goal.getAllHouseholdGoals).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: "Household currently has no financial goals." });
    })
  })


  describe ('createGoalController', () => {
    it('should return a new goal for a household with a 201 status code', async () => {
      let testGoal = { household_id : 1, goal_name: "Purchase iPhone", goal_amount: 290, current_value: 0, target_date: "2026-07-13" }
      const mockReq = { body: testGoal }

      jest.spyOn(Goal, 'createGoal').mockResolvedValue(testGoal)

      await goalsController.createGoalController(mockReq, mockRes)
      
      expect(Goal.createGoal).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(201)
      expect(mockJson).toHaveBeenCalledWith(testGoal);
      expect(Goal.createGoal).toHaveBeenCalledWith(testGoal);
    })


    it('should return an error if goal creation fails', async () => {
      let testGoal = { name: 'Test Goal' }
      const mockReq = { body: testGoal }

      jest.spyOn(Goal, 'createGoal').mockRejectedValue(new Error("Unable to create goal for household."))

      await goalsController.createGoalController(mockReq, mockRes)
      
      expect(Goal.createGoal).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(400)
      expect(mockJson).toHaveBeenCalledWith({ error: "Unable to create goal for household." })
    })
  })

  describe('updateGoalController', () => {
    it('should update a goal and return it with a 200 status code', async () => {
      const updateRequest = { goal_id : 1, goal_name: "Purchase iPhone", goal_amount: 290, current_value: 0, target_date: "2026-07-13" };
      const mockReq = { body: updateRequest };
      const updatedGoal = { household_id: 1, goal_id : 1, goal_name: "Purchase iPhone", goal_amount: 290, current_value: 0, target_date: "2026-07-13" };

      jest.spyOn(Goal, 'updateGoal').mockResolvedValue(updatedGoal);

      await goalsController.updateGoalController(mockReq, mockRes);

      expect(Goal.updateGoal).toHaveBeenCalledTimes(1);
      expect(Goal.updateGoal).toHaveBeenCalledWith(updateRequest);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(updatedGoal);
    });

    it('should return an error if the goal is not found', async () => {
      const updateRequest = { goal_id : 999, goal_name: "Purchase iPhone", goal_amount: 290, current_value: 0, target_date: "2026-07-13" };
      const mockReq = { body: updateRequest };

      jest.spyOn(Goal, 'updateGoal').mockRejectedValue(new Error("Unable to update goal."));

      await goalsController.updateGoalController(mockReq, mockRes);

      expect(Goal.updateGoal).toHaveBeenCalledTimes(1);
      expect(Goal.updateGoal).toHaveBeenCalledWith(updateRequest);
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: "Unable to update goal." });
    });
  });

  describe('deleteGoalController', () => {
    it('should return a 204 status code on successful deletion', async () => {
      const mockReq = { body: { goal_id: 1 } };

      jest.spyOn(Goal, 'deleteGoal').mockResolvedValue({});

      await goalsController.deleteGoalController(mockReq, mockRes);

      expect(Goal.deleteGoal).toHaveBeenCalledTimes(1);
      expect(Goal.deleteGoal).toHaveBeenCalledWith(mockReq.body);
      expect(mockStatus).toHaveBeenCalledWith(204);
      expect(mockEnd).toHaveBeenCalled();
    });

    it('should return an error if the goal is not found', async () => {
      const mockReq = { body: { goal_id: 1 } };

      jest.spyOn(Goal, 'deleteGoal').mockRejectedValue(new Error("Unable to delete goal."));

      await goalsController.deleteGoalController(mockReq, mockRes);

      expect(Goal.deleteGoal).toHaveBeenCalledTimes(1);
      expect(Goal.deleteGoal).toHaveBeenCalledWith(mockReq.body);
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({error: "Unable to delete goal."});
    });

  });

})
