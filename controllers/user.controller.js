import User from "../models/user.model.js";
import movie from "../models/movie.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/mailer.js";
import { OAuth2Client } from "google-auth-library";
import mongoose from "mongoose"
import { io } from "../server.js";
import generateVerificationToken from '../controllers/generateVerificationToken.js';
import { validationResult } from 'express-validator';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);




export const resetPassword = async (req, res) => {
  const { email, password, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const sendPasswordResetEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const resetLink = `${process.env.CLIENT_URL}/user/reset-password/${token}`;
    const emailTemplate = `
     <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<!--[if gte mso 9]>
<xml>
  <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
</xml>
<![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
  <title></title>
  
    <style type="text/css">
      @media only screen and (min-width: 620px) {
  .u-row {
    width: 600px !important;
  }
  .u-row .u-col {
    vertical-align: top;
  }

  .u-row .u-col-100 {
    width: 600px !important;
  }

}

@media (max-width: 620px) {
  .u-row-container {
    max-width: 100% !important;
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
  .u-row .u-col {
    min-width: 320px !important;
    max-width: 100% !important;
    display: block !important;
  }
  .u-row {
    width: 100% !important;
  }
  .u-col {
    width: 100% !important;
  }
  .u-col > div {
    margin: 0 auto;
  }
}
body {
  margin: 0;
  padding: 0;
}

table,
tr,
td {
  vertical-align: top;
  border-collapse: collapse;
}

p {
  margin: 0;
}

.ie-container table,
.mso-container table {
  table-layout: fixed;
}

* {
  line-height: inherit;
}

a[x-apple-data-detectors='true'] {
  color: inherit !important;
  text-decoration: none !important;
}

table, td { color: #000000; } #u_body a { color: #161a39; text-decoration: underline; }
    </style>
  
  

<!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap" rel="stylesheet" type="text/css"><!--<![endif]-->

</head>

<body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #f9f9f9;color: #000000">
  <!--[if IE]><div class="ie-container"><![endif]-->
  <!--[if mso]><div class="mso-container"><![endif]-->
  <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f9f9f9;width:100%" cellpadding="0" cellspacing="0">
  <tbody>
  <tr style="vertical-align: top">
    <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #f9f9f9;"><![endif]-->
    
  
  
<div class="u-row-container" style="padding: 0px;background-color: #f9f9f9">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #f9f9f9;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #f9f9f9;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #f9f9f9;"><![endif]-->
      
<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
  <div style="height: 100%;width: 100% !important;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
  
<table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:15px;font-family:'Lato',sans-serif;" align="left">
        
  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #f9f9f9;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
    <tbody>
      <tr style="vertical-align: top">
        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
          <span>&#160;</span>
        </td>
      </tr>
    </tbody>
  </table>

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
  </div>
  


  
  
<div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
      
<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
  <div style="height: 100%;width: 100% !important;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
  
<table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:25px 10px;font-family:'Lato',sans-serif;" align="left">
        
<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
  </tr>
</table>

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
  </div>
  


  
  
<div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #843fa1;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #843fa1;"><![endif]-->
      
<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
  <div style="height: 100%;width: 100% !important;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
  
<table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:35px 10px 10px;font-family:'Lato',sans-serif;" align="left">
        
<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding-right: 0px;padding-left: 0px;" align="center">
      
      <img align="center" border="0" src="../public/images/image-1.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 10%;max-width: 58px;" width="58"/>
      
    </td>
  </tr>
</table>

      </td>
    </tr>
  </tbody>
</table>

<table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 30px;font-family:'Lato',sans-serif;" align="left">
        
  <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
    <p style="font-size: 14px; line-height: 140%; text-align: center;"><span style="font-size: 28px; line-height: 39.2px; color: #ffffff; font-family: Lato, sans-serif;">Please reset your password </span></p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
  </div>
  


  
  
<div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
      
<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
  <div style="height: 100%;width: 100% !important;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
  
<table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:40px 40px 30px;font-family:'Lato',sans-serif;" align="left">
        
  <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
    <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 18px; line-height: 25.2px; color: #666666;">Hello ${user.username},</span></p>
<p style="font-size: 14px; line-height: 140%;"> </p>
<p style="font-size: 14px; line-height: 140%;"><span style="font-size: 18px; line-height: 25.2px; color: #666666;">We have sent you this email in response to your request to reset your password on Movie Flow.</span></p>
<p style="font-size: 14px; line-height: 140%;"> </p>
<p style="font-size: 14px; line-height: 140%;"><span style="font-size: 18px; line-height: 25.2px; color: #666666;">To reset your password, please follow the link below: </span></p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

<table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 40px;font-family:'Lato',sans-serif;" align="left">
        
  <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
<div align="left">
  <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:52px; v-text-anchor:middle; width:205px;" arcsize="2%"  stroke="f" fillcolor="#843fa1"><w:anchorlock/><center style="color:#FFFFFF;"><![endif]-->
    <a href="${resetLink}" target="_blank" class="v-button" style="box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #843fa1; border-radius: 1px;-webkit-border-radius: 1px; -moz-border-radius: 1px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 14px;">
      <span style="display:block;padding:15px 40px;line-height:120%;"><span style="font-size: 18px; line-height: 21.6px;">Reset Password</span></span>
    </a>
    <!--[if mso]></center></v:roundrect><![endif]-->
</div>

      </td>
    </tr>
  </tbody>
</table>

<table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:40px 40px 30px;font-family:'Lato',sans-serif;" align="left">
        
  <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
    <p style="font-size: 14px; line-height: 140%;"><span style="color: #888888; font-size: 14px; line-height: 19.6px;"><em><span style="font-size: 16px; line-height: 22.4px;">Please ignore this email if you did not request a password change.</span></em></span><br /><span style="color: #888888; font-size: 14px; line-height: 19.6px;"><em><span style="font-size: 16px; line-height: 22.4px;">&nbsp;</span></em></span></p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
  </div>
  


  
  
<div class="u-row-container" style="padding: 0px;background-color: #f9f9f9">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #1c103b;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #f9f9f9;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #1c103b;"><![endif]-->
      
<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
  <div style="height: 100%;width: 100% !important;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
  
  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
  </div>
  


  
  
<div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #f9f9f9;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #f9f9f9;"><![endif]-->
      
<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
  <div style="height: 100%;width: 100% !important;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
  
  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
  </div>
  


    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    </td>
  </tr>
  </tbody>
  </table>
  <!--[if mso]></div><![endif]-->
  <!--[if IE]></div><![endif]-->
</body>

</html>

      `;

    user.resetVerificationToken = token;
    await user.save();
    await sendEmail(email, "Password Reset", emailTemplate);

    res.status(200).json({ message: "Password reset link sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export async function acceptInvitation(req, res) {
  try {
    const { sender, recipient } = req.body;

    const senderExists = await User.findById({ _id: sender });
    const recipientExists = await User.findById({ _id: recipient });
    if (!senderExists || !recipientExists) {
      return res
        .status(404)
        .json({ message: "Sender or recipient does not exist" });
    }
    const Usersender = await User.findOne({ _id: sender });
    const Userrecipient = await User.findOne({ _id: recipient });

    const senderverif = Usersender.friendRequestsSent.includes(recipient);
    const recipientverif = Userrecipient.friendRequests.includes(sender);

    if (senderverif || recipientverif) {
      return res.status(404).json({ message: "the invitation is accepted" });
    }

    await User.findByIdAndUpdate(recipient, { $push: { friends: sender } });
    await User.findByIdAndUpdate(sender, { $push: { friends: recipient } });
    await User.findByIdAndUpdate(sender, {
      $pull: { friendRequestsSent: recipient },
    });
    await User.findByIdAndUpdate(recipient, {
      $pull: { friendRequestsSent: sender },
    });
    await User.findByIdAndUpdate(sender, {
      $pull: { friendRequests: recipient },
    });
    await User.findByIdAndUpdate(recipient, {
      $pull: { friendRequests: sender },
    });

    res.status(201).json({ message: "Invitation added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getGendersById = async (req, res) => {
  try {
    const { sender } = req.params ; 

    const user = await User.findOne({ _id: sender }); 

    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    res.status(200).json({ favouriteGenders: user.favouriteGenders });

  } catch (error) {
    res.status(500).json({ message: error.message }); 
  }
};

export async function refuseInvitation(req, res) {
  try {
    const { sender, recipient } = req.body;
    const senderExists = await User.findById({ _id: sender });
    const recipientExists = await User.findById({ _id: recipient });

    if (!senderExists || !recipientExists) {
      return res
        .status(404)
        .json({ message: "Sender or recipient does not exist" });
    }

    await User.findByIdAndUpdate(sender, {
      $pull: { friendRequestsSent: recipient },
    });

    await User.findByIdAndUpdate(recipient, {
      $pull: { friendRequests: sender },
    });

    res.status(201).json({ message: "Invitation refused " });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const verifyUserWithGoogle = async (req, res) => {
  const googleIdToken = req.body.googleIdToken;
  console.log(googleIdToken);
  try {
    const ticket = await client.verifyIdToken({
      idToken: googleIdToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload.email;

    let user = await User.findOne({ email: email });
    if (!user) {
      user = new User({
        email: email,
        username: payload.name,
        profilePicture: payload.picture,
        isVerified: true,
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(
        "googleSignInPlaceholderPassword",
        salt
      );
      await user.save();
      const token = jwt.sign({ user: user }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.status(200).json({ token });
    }
    if (user.isBanned === true) {
      return res.status(400).json({
        message: "Your account is banned ! Please contact the support.",
      });
    }
    const token = jwt.sign({ user: user }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (users.length === 0) {
      return res.status(400).json("No users found");
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No user with id: ${id}`);
  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, firstName, lastName, birthDate, bio } = req.body;
  
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No user with id: ${id}`);
  
  const updatedUser = {
    username,
    firstName,
    lastName,
    birthDate,
    bio
  };

  if (req.file) {
    updatedUser.profilePicture = `${req.protocol}://${req.get("host")}/img/${req.file.filename}`;
  }

  await User.findByIdAndUpdate(id, updatedUser, { new: true });
  res.json(updatedUser);
};


export const updatePassword = async (req, res) => {
  try {
    const id = req.params.id;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Vérifiez si l'ancien mot de passe correspond
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Si l'ancien mot de passe est correct, mettez à jour le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    const updatedUser = { password: hashedPassword, passwordResetToken: null };
    await User.findOneAndUpdate({ _id: id }, updatedUser);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export async function getAll(req, res) {
  User.find({})
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export const getFriendsById = async (req, res) => {
  try {
    const { sender } = req.params ; 

    const user = await User.findOne({ _id: sender });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    res.status(200).json({ friends: user.friends });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export async function addInvitation(req, res) {
  try {
    const { sender, recipient } = req.body;

    const senderExists = await User.findOne({ _id: sender });
    const recipientExists = await User.findOne({ _id: recipient });

        if (!senderExists || !recipientExists) {
            return res.status(404).json({ message: 'Sender or recipient does not exist' });
        }
        const Usersender = await User.findOne({ _id: sender });
        const Userrecipient = await User.findOne({ _id: recipient });
 
        

           const senderverif = Usersender.friendRequestsSent.includes(recipient);
           const recipientverif = Userrecipient.friendRequests.includes(sender);

     
        if ( senderverif || recipientverif || Usersender.friends.includes(recipient) || Userrecipient.friends.includes(sender)){
            return res.status(404).json({ message: 'the invitation is already added' });
        }

        await User.updateOne({ _id: sender }, { $push: { friendRequestsSent: recipient } });

        await User.updateOne({ _id: recipient }, { $push: { friendRequests: sender } });
    
        
        io.to(recipient).emit('newFriendRequest', { sender, recipient });
        res.status(201).json({ message: 'Invitation created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function deleteInvitation(req, res) {
  try {
    const { sender, recipient } = req.body;
    const senderExists = await User.exists({ _id: sender });
    const recipientExists = await User.exists({ _id: recipient });

    if (!senderExists || !recipientExists) {
      return res
        .status(404)
        .json({ message: "Sender or recipient does not exist" });
    }
    const Usersender = await User.findOne({ _id: sender });
    const Userrecipient = await User.findOne({ _id: recipient });

    const senderverif = Usersender.friendRequestsSent.includes(recipient);
    const recipientverif = Userrecipient.friendRequests.includes(sender);

    if (!senderverif || !recipientverif) {
      return res
        .status(404)
        .json({ message: "the invitation is not already added" });
    }
    await User.findByIdAndUpdate(sender, {
      $pull: { friendRequestsSent: recipient },
    });

    await User.findByIdAndUpdate(recipient, {
      $pull: { friendRequests: sender },
    });

    res.status(201).json({ message: "Invitation is removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function addMovieGenders(req, res) {
  try {
    const { gender, userID } = req.body;

    const userExists = await User.exists({ _id: userID });

    if (!userExists) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const user = await User.findOne({ _id: userID });

    for (let i = 0; i < 3; i++) {
      if (!user.favouriteGenders[i] || user.favouriteGenders[i] !== gender) {
        await User.findByIdAndUpdate(userID, {
          $push: { favouriteGenders: gender },
        });
        res.status(201).json({ message: "Gender added successfully" });
        break;
      } else {
        res.status(201).json({ message: "Gender not added successfully" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteMovieGenders(req, res) {
  try {
    const { gender, userID } = req.body;

    const userExists = await User.exists({ _id: userID });

    if (!userExists) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const user = await User.findOne({ _id: userID });
    const genderverif = user.favouriteGenders.includes(gender);

    if (!genderverif) {
      return res
        .status(404)
        .json({ message: "the gender is not already added" });
    }

    await User.findByIdAndUpdate(userID, {
      $pull: { favouriteGenders: gender },
    });

    res.status(201).json({ message: "Gender deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getfriendsRequest = async (req, res) => {
  try {
    const { recipient } = req.params;
    const user = await User.findById(recipient);
    if (!user) {
      return res.status(404).json({ message: "user does not exist" });
    }
    const friendRequests = user.friendRequests;
    const requests = [];
    for (const friend of friendRequests) {
      const user = await User.findById(friend);
      if (!user) {
        return res.status(404).json({ message: "user does not exist" });
      }
      requests.push(user);
    }
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    await User.findOneAndDelete({ username });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(`Error deleting user: ${error.message}`);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

export const getAllUsersAdmin = async (req, res) => {
  try {
    const allUsers = await User.find().select("-createdAt -__v -updatedAt");

    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const banUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Use findByIdAndUpdate to update the 'banned' field directly
    const user = await User.findByIdAndUpdate(
      userId,
      { isBanned: "BANNED" },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error banning user: ${error.message}");
    res.status(500).json({ error: "Failed to ban user" });
  }
};

export const unbanUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Use findByIdAndUpdate to update the 'banned' field directly
    const user = await User.findByIdAndUpdate(
      userId,
      { isBanned: "UNBANNED" },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(`Error unbanning user: ${error.message}`);
    res.status(500).json({ error: "Failed to unban user" });
  }
};

export const selectedroulette = async (req, res) => {
  try {
    const { userId } = req.params;
    const { gift } = req.body;

    // Check if the selected gift is provided in the request body
    if (!gift) {
      return res.status(400).send('Selected gift is required');
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Check if the user has played in the last 24 hours
    if (
      (user.lastGiftSelectionDate && user.lastGiftSelectionDate > twentyFourHoursAgo) ||
      (user.lastGiftReceivedDate && user.lastGiftReceivedDate > twentyFourHoursAgo)
    ) {
      return res.status(400).send('You can only play once every 24 hours');
    }

    // Update the user's selected gift, lastGiftSelectionDate, and lastGiftReceivedDate
    user.set({
      selectedgift: gift,
      lastGiftSelectionDate: new Date(),
      lastGiftReceivedDate: new Date(),
    });
 
    await user.save();

    console.log(`Selected gift: ${gift} for User: ${userId}`);
    res.status(200).send('Gift received successfully');
  } catch (error) {
    console.error('Error selecting gift:', error);
    res.status(500).send('Internal Server Error');
  }
};
export const stastverifiedaccount = async (req, res) => {
try {
  const verifiedUsersCount = await  User.countDocuments({ isVerified: true });
  const inverseUsersCount = await User.countDocuments({ isVerified: false });
  res.json({verifiedUsersCount, inverseUsersCount });

}catch (error) {
  res.status(500).json({ error: error.message });
}
};
export const findusersfriend = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const friendIds = user.friends;
    const friends = [];
    
    for (const friendId of friendIds) {
      const friend = await User.findById(friendId);
      
      if (!friend) {
        console.error(`Friend with ID ${friendId} not found`);
        // Skip this friend and continue with the loop
        continue;
      }
      
      friends.push(friend);
    }
    const nbrfriends = friends.length;
    
    res.status(200).json({friends, nbrfriends});
  } catch (error) {
    console.error("Error finding user's friends:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getuserbyusername = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne ({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  }
  catch (error) {
    console.error("Error finding user by username:", error);
    res.status(500).json({ error: error.message });
  }
};
export const findusersfriendbyusername = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne ({ username });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const friendIds = user.friends;
      const friends = [];
      
      for (const friendId of friendIds) {
        const friend = await User.findById(friendId);
        
        if (!friend) {
          console.error(`Friend with ID ${friendId} not found`);
          // Skip this friend and continue with the loop
          continue;
        }
        
        friends.push(friend);
      }
      const nbrfriends = friends.length;
      
      res.status(200).json({friends, nbrfriends});
    } catch (error) {
      console.error("Error finding user's friends:", error);
      res.status(500).json({ error: error.message });
    }
  };
  export const getGenreFilm = async (req, res) => {
    try {
        const { username } = req.params;

        // Assuming there's a 'User' model
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Assuming there's a 'Film' model and the films are stored in a field like 'favoriteFilms' in the user schema
        const films = await movie.find({ _id: { $in: user.favouriteMovies } });

        return res.status(200).json({ films });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};



export const savelocation = async (req, res) => {
  try {
    const { userId } = req.params;
    const { latitude, longitude } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.location = { type: "Point", coordinates: [longitude, latitude] };
    await user.save();
    res.status(200).json({ message: "Location saved successfully" });
  }
  catch (error) {
    console.error("Error saving location:", error);
    res.status(500).json({ error: error.message });
  }
};
export const getlocation = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("location");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user.location);
  }catch (error) {
    console.error("Error getting location:", error);
    res.status(500).json({ error: error.message });
  }
};
export const getAllLocations = async (req, res) => {
  try {
    // Trouver tous les utilisateurs qui ont un champ 'location' défini
    const usersWithLocation = await User.find(
      { "location.coordinates": { $exists: true } }, // Trouver les utilisateurs avec des coordonnées
      { location: 1,username: 1 } // Seules les locations sont nécessaires dans le résultat
    );

    // Récupérer les locations
    const userLocations = usersWithLocation.map((user) => ({
      username: user.username,
      location: user.location,
    }));
    res.status(200).json({ userLocations });
  } catch (error) {
    console.error("Erreur lors de la récupération des locations:", error);
    res.status(500).json({ error: error.message });
  }
};
export const getAdmins = async (req, res) => {
  try {
      // Rechercher tous les utilisateurs avec le rôle "admin"
      const admins = await User.find({ role: 'admin' });

      // Vérifier s'il y a des utilisateurs avec ce rôle
      if (admins.length === 0) {
          return res.status(404).json({ message: 'No admins found' });
      }

      // Retourner les utilisateurs avec le rôle "admin"
      res.status(200).json(admins);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};
export const addAdmin = async (req, res) => {
  try {
    const { username, password, email } = req.body;

        const existingUser = await User.findOne({ username });
        const existing = await User.findOne({ email });

        if (existingUser && existing) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            role : "admin"
        });

        const user = await newUser.save();

        const authToken = jwt.sign(
            { username: user.username, id: user._id },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
        );

        const verificationToken = generateVerificationToken();
        newUser.verificationToken = verificationToken;
        await newUser.save();

        const verificationLink = `${process.env.BASE_URL}/verify/${verificationToken}`;
        const emailSubject = 'Email Verification';
        const emailHtml = `Click the following link to verify your email: <a href="${verificationLink}">Verify Email</a>`;
        await sendEmail(newUser.email, emailSubject, emailHtml);

        res.status(200).json({ user: newUser, authToken, message: 'User registered successfully. Please check your email for verification.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



