const twilio = require("twilio");
const GenerateOtp = require("../utils/OtpGenerator");
const User = require("../models/user");

const accountSid = "AC38ec0f1c7a84d5c9fafdd36e753cfeff";
const authToken = "8995a693c153b9ac02f3dbc050540015";

const client = twilio(accountSid, authToken);
let AllOtp = {};

const LoginController = async (req, res) => {
  const { phonenumber } = req.body;

  try {
    console.log(phonenumber);
    let user = await User.findOne({ phonenumber: phonenumber });
    console.log(user);
    if (!user) {
      let user = new User({ phonenumber: phonenumber });
      await user.save();
    }

    let otp = GenerateOtp(4);
    AllOtp[phonenumber] = otp;
    console.log(otp);
    console.log(AllOtp);
    // await client.messages.create({
    //   body: `Your OTP is: ${otp}`,
    //   to: "+917448569123", // User's phone number
    //   from: "+18159814438", // Your Twilio phone number
    // });
    res.send({ sucess: true });
  } catch (err) {
    console.log(err);
  }
};

module.exports = LoginController;
