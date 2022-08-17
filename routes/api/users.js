const express = require('express');
const router = express.Router();

const User = require('../../models/User');

router.post(
  '/',
  async (req, res) => {

    const { wallet, signature } = req.body;

    try {
      let user = await User.findOne({ wallet });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Welcome!' }] });
      }


      user = new User({
        wallet,
        signature,
      });

      await user.save();
      res.json(user);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
