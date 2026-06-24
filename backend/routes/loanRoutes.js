const express = require('express');
const router = express.Router();
const {
  createLoan,
  getLoans,
  getLoanById,
  updateLoan,
  deleteLoan,
  markLoanPaid,
  uploadLoanDocuments,
  deleteLoanDocument,
} = require('../controllers/loanController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);

router.route('/').post(createLoan).get(getLoans);
router.route('/:id').get(getLoanById).put(updateLoan).delete(deleteLoan);
router.post('/:id/pay', markLoanPaid);
router.post('/:id/documents', upload.array('documents', 5), uploadLoanDocuments);
router.delete('/:id/documents/:docId', deleteLoanDocument);

module.exports = router;
