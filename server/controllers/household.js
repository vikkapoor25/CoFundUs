const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Household = require('../models/Household');

async function register(req, res) {
  try {
    const data = req.body;

    // Generate a salt with a specific cost
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));

    // Hash the password
    data["household_password"] = await bcrypt.hash(data.household_password, salt);
    const result = await Household.create(data);

    res.status(201).send(result);
  } catch (err) {
    res.status(400).json({ error: 'Unable to create household.' });
  }
}

async function login(req, res) {
  const data = req.body;

  try {
    const household = await Household.getOneByUsername(data.household_username);

    if (!household) {
      throw new Error('No household with this username');
    }

    const match = await bcrypt.compare(
      data.household_password,
      household.household_password
    );

    if (match) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await Household.saveTwoFactorCode(
        household.household_id,
        code,
        expiresAt
      );

      res.status(200).json({
        success: true,
        twofa_required: true,
        household_id: household.household_id,
        demo_code: code,
        message: '2FA code generated for demo/testing.'
      });
    } else {
      throw new Error('Household could not be authenticated');
    }
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

async function verifyTwoFactorLogin(req, res) {
  const { household_id, code } = req.body;

  try {
    const household = await Household.verifyTwoFactorCode(household_id, code);

    await Household.clearTwoFactorCode(household_id);

    const payload = {
      household_username: household.household_username
    };

    const sendToken = (err, token) => {
      if (err) {
        throw new Error('Error in token generation');
      }

      res.status(200).json({
        success: true,
        jwt_token: token,
        household_id: household.household_id,
        name_1: household.name_1,
        name_2: household.name_2
      });
    };

    jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: 3600 }, sendToken);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

module.exports = {
  register,
  login,
  verifyTwoFactorLogin
};                    