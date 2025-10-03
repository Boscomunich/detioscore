export const welcomeTemplate = (name: string) => {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ditioscore</title>
</head>
<body style="max-width:100vw; margin: 0; padding: 0; font-family: Poppins, Arial, Helvetica, sans-serif; box-sizing: border-box;">
  <table style="margin: 20px auto;">
    <tr>
      <td>
        <div style="text-align: center; border: solid 1px rgb(228, 228, 228); background-color: #fff9fa; border-radius: 10px;">
          <div style="padding: 20px 7vw; margin: auto; max-width: 400px;">
              <h1 style="margin: 10px 0; text-align: center; color: #ff2056; font-size: 20px; font-weight: 800;">DITIOSCORE</h1>
              <div style="font-size: 25px; margin: 30px 0; border-radius: 4px; color: #1E64AA; font-weight: 500;">
                Hi ${name}, Your Ditioscore account have been created successfully.
              </div>
              <hr style="border: solid 1px rgb(228, 228, 228);">
              <p style="padding-top: 20px;">
                Thank you for opening a Ditioscore account.
                We are excited to have you join us.
              </p>
              <div style="text-align: center; margin: 40px 0;">
                <a href="#" style="width: max-content; border-radius: 4px; border: none; text-decoration: none; box-shadow: rgb(71, 71, 71) 1px 1px 2px;  padding: 10px 20px; color: white; background-color:#1E64AA; font-size: 12px;">
                  <a href="https://ditioscore.com">EXPLORE THE DITIOSCORE APP</a>
                </a>
              </div>
              <p>
                Don't share any personal detail or password with anyone claiming to be part of our staff.
              </p>
            
          </div>
        </div>
      </td>
    </tr>
    <tr>
      <td>
        <div>
          <p style="margin: 20px 0; padding-left: 4%;">Best regards,<br/>The Ditioscore Team.</p>
          <p style="margin: 20px 0; padding-left: 4%;">Need help? Contact us at <a href="mailto:help.ditioscore.com">help.ditioscore.com</a></p>
        </div>
      </td>
    </tr>
  </table>
  <div style="background-color: #f0f0f0;">
    <table style="margin: auto;">
      <tr>
        <td>
          <div style="padding: 20px 4%; box-sizing: border-box;">
            <div style="text-align: center;">
              <p>Never miss updates on our latest product and events.</p>
              <div style="margin: auto; width: max-content;">
                <table style="margin: auto;">
                  <tr>
                    <td style="padding: 10px;">
                      <a href="" title="Facebook">
                        <img style="height: 24px; width: auto;" src="https://www.google.com/s2/favicons?sz&domain=web.facebook.com" alt="Facebook" />
                      </a>
                    </td>
                    <td style="padding: 10px;">
                      <a href="" title="Instagram">
                        <img style="height: 24px; width: auto;" src="https://www.google.com/s2/favicons?sz&domain=www.instagram.com" alt="Instagram" />
                      </a>
                    </td>
                    <td style="padding: 10px;">
                      <a href="" title="X">
                        <img style="height: 24px; width: auto;" src="https://www.google.com/s2/favicons?sz&domain=x.com" alt="X" />
                      </a>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          <p style="text-align: center;">
            Copyright &copy 2025 <span style="color: #ff2056;">Ditioscore</span>. All rights reserved.
          </p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
  `;
};
