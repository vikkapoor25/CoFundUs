// Import Bill Model for testing
const Bill = require('../../../models/Bill')
// Import bills Controller for testing
const billsController = require('../../../controllers/bills')

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


describe('Bills controller', () => {
  beforeEach(() => jest.clearAllMocks())

  afterAll(() => jest.resetAllMocks())

  describe ('getAllHouseholdBillsController', () => {
    let testBills, mockReq;

    beforeEach(() => {
      testBills = [
        { household_id : 1, account_id : 1, bill_id: 1, bill_name: "Netflix", bill_amount: 7, bill_due_date: "2026-07-13", category: "Subscription", category_type: "Entertainment", repeat_bill: true, payment_frequency: "Monthly", bill_repeat_date: "2026-08-13", paid: false },
        { household_id : 1, account_id : 2, bill_id: 2, bill_name: "Spotify", bill_amount: 12, bill_due_date: "2026-07-13", category: "Subscription", category_type: "Entertainment", repeat_bill: true, payment_frequency: "Monthly", bill_repeat_date: "2026-08-13", paid: false}
      ]
      mockReq = { params: { household_id: 1 } }
    });

    it('should return bills belonging to household_id 1 with a 200 status code', async () => {
      jest.spyOn(Bill, 'getAllHouseholdBills').mockResolvedValue(testBills)

      await billsController.getAllHouseholdBillsController(mockReq, mockRes);
      
      expect(Bill.getAllHouseholdBills).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(testBills);
      expect(Bill.getAllHouseholdBills).toHaveBeenCalledWith(1);
    })

    it('should return an error if household_id 1 has no bills', async () => {
      jest.spyOn(Bill, 'getAllHouseholdBills').mockRejectedValue(new Error("Household currently has no bills."))

      await billsController.getAllHouseholdBillsController(mockReq, mockRes);
      
      expect(Bill.getAllHouseholdBills).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: "Household currently has no bills." });
    })
  })

  
  describe ('getAllBankAccountBillsController', () => {
    let testBills, mockReq;

    beforeEach(() => {
      testBills = [
        { account_id : 1, bill_id: 1, bill_name: "Netflix", bill_amount: 7, bill_due_date: "2026-07-13", category: "Subscription", category_type: "Entertainment", repeat_bill: true, payment_frequency: "Monthly", bill_repeat_date: "2026-08-13", paid: false },
        { account_id : 1, bill_id: 2, bill_name: "Spotify", bill_amount: 12, bill_due_date: "2026-07-13", category: "Subscription", category_type: "Entertainment", repeat_bill: true, payment_frequency: "Monthly", bill_repeat_date: "2026-08-13", paid: false}
      ]
      mockReq = { params: { account_id: 1 } }
    });

    it('should return bills belonging to account_id 1 with a 200 status code', async () => {
      jest.spyOn(Bill, 'getAllBankAccountBills').mockResolvedValue(testBills)

      await billsController.getAllBankAccountBillsController(mockReq, mockRes);
      
      expect(Bill.getAllBankAccountBills).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(testBills);
      expect(Bill.getAllBankAccountBills).toHaveBeenCalledWith(1);
    })

    it('should return an error if account_id 1 has no bills', async () => {
      jest.spyOn(Bill, 'getAllBankAccountBills').mockRejectedValue(new Error("Bank account currently has no bills."))

      await billsController.getAllBankAccountBillsController(mockReq, mockRes);
      
      expect(Bill.getAllBankAccountBills).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: "Bank account currently has no bills." });
    })
  })


  describe ('createBillController', () => {
    it('should return a new bill for an account with a 201 status code', async () => {
      let testBill = { account_id : 1, bill_id: 1, bill_name: "Netflix", bill_amount: 7, bill_due_date: "2026-07-13", category: "Subscription", category_type: "Entertainment", repeat_bill: true, payment_frequency: "Monthly", bill_repeat_date: "2026-08-13", paid: false }
      const mockReq = { body: testBill }

      jest.spyOn(Bill, 'createBill').mockResolvedValue(testBill)

      await billsController.createBillController(mockReq, mockRes)
      
      expect(Bill.createBill).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(201)
      expect(mockJson).toHaveBeenCalledWith(testBill);
      expect(Bill.createBill).toHaveBeenCalledWith(testBill);
    })


    it('should return an error if bill creation fails', async () => {
      let testBill = { name: 'Test Bill' }
      const mockReq = { body: testBill }

      jest.spyOn(Bill, 'createBill').mockRejectedValue(new Error("Unable to create bill for account."))

      await billsController.createBillController(mockReq, mockRes)
      
      expect(Bill.createBill).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(400)
      expect(mockJson).toHaveBeenCalledWith({ error: "Unable to create bill for account." })
    })
  })

  describe('updateBillController', () => {
    it('should update a bill and return it with a 200 status code', async () => {
      const updateRequest = { bill_id: 1, bill_name: "Netflix Premium", bill_amount: 10, bill_due_date: "2026-07-14", bill_repeat_date: "2026-08-14" };
      const mockReq = { body: updateRequest };
      const updatedBill = { account_id: 1, bill_id: 1, bill_name: "Netflix Premium", bill_amount: 10, bill_due_date: "2026-07-14", category: "Subscription", category_type: "Entertainment", repeat_bill: true, payment_frequency: "Monthly", bill_repeat_date: "2026-08-14", paid: false};

      jest.spyOn(Bill, 'updateBill').mockResolvedValue(updatedBill);

      await billsController.updateBillController(mockReq, mockRes);

      expect(Bill.updateBill).toHaveBeenCalledTimes(1);
      expect(Bill.updateBill).toHaveBeenCalledWith(updateRequest);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(updatedBill);
    });

    it('should return an error if the bill is not found', async () => {
      const updateRequest = { bill_id: 1, bill_name: "Netflix Premium", bill_amount: 10, bill_due_date: "2026-07-14", bill_repeat_date: "2026-08-14" };
      const mockReq = { body: updateRequest };

      jest.spyOn(Bill, 'updateBill').mockRejectedValue(new Error("Unable to update bill."));

      await billsController.updateBillController(mockReq, mockRes);

      expect(Bill.updateBill).toHaveBeenCalledTimes(1);
      expect(Bill.updateBill).toHaveBeenCalledWith(updateRequest);
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: "Unable to update bill." });
    });
  });

  describe('billPaidController', () => {
    it('should update a bill as paid and return it with a 200 status code', async () => {
      const mockReq = { body: { bill_id: 1 } };
      const paidResponse = { paid: true }

      jest.spyOn(Bill, 'billPaid').mockResolvedValue(paidResponse);

      await billsController.billPaidController(mockReq, mockRes);

      expect(Bill.billPaid).toHaveBeenCalledTimes(1);
      expect(Bill.billPaid).toHaveBeenCalledWith(mockReq.body);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(paidResponse);
    });

    it('should return an error if the bill is not found', async () => {
      const mockReq = { paid: true }

      jest.spyOn(Bill, 'billPaid').mockRejectedValue(new Error("Unable to mark bill as paid."));

      await billsController.billPaidController(mockReq, mockRes);

      expect(Bill.billPaid).toHaveBeenCalledTimes(1);
      expect(Bill.billPaid).toHaveBeenCalledWith(mockReq.body);
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: "Unable to mark bill as paid." });
    });
  });

  describe('deleteBillController', () => {
    it('should return a 204 status code on successful deletion', async () => {
      const mockReq = { body: { bill_id: 1 } };

      jest.spyOn(Bill, 'deleteBill').mockResolvedValue({});

      await billsController.deleteBillController(mockReq, mockRes);

      expect(Bill.deleteBill).toHaveBeenCalledTimes(1);
      expect(Bill.deleteBill).toHaveBeenCalledWith(mockReq.body);
      expect(mockStatus).toHaveBeenCalledWith(204);
      expect(mockEnd).toHaveBeenCalled();
    });

    it('should return an error if the bill is not found', async () => {
      const mockReq = { body: { bill_id: 1 } };

      jest.spyOn(Bill, 'deleteBill').mockRejectedValue(new Error("Unable to delete bill."));

      await billsController.deleteBillController(mockReq, mockRes);

      expect(Bill.deleteBill).toHaveBeenCalledTimes(1);
      expect(Bill.deleteBill).toHaveBeenCalledWith(mockReq.body);
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({error: "Unable to delete bill."});
    });

  });

})
