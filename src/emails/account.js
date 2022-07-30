
const Sib = require('sib-api-v3-sdk')
const client = Sib.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.API_KEY
const tranEmailApi = new Sib.TransactionalEmailsApi()


const sendWelcomeEmail=(email,name)=>{
   tranEmailApi
   .sendTransacEmail({
       sender:{email: 'mgupta@argusoft.com'},
       to: [
         {email}
     ],
       subject: 'Thanks for joining in!',
       htmlContent: `
       <h1>Warm Welcome</h1>
       <a">Welcome to the app, ${name}. Let me know how you get along with the app</a>
               `
   })
}


const sendCancelationEmail=(email,name)=>{
   tranEmailApi
   .sendTransacEmail({
       sender:{email: 'mgupta@argusoft.com'},
       to: [
         {email}
     ],
       subject: 'Cancelation Update!',
       htmlContent: `
       <h1>Sorry to see you go!!</h1>
       <a">Goodbye! ${name}. I hope to see you back sometime soon.</a>
               `
   })
   .then(
      console.log('cancel mail sent')
   )
   .catch('cancel mail not sent')
}



module.exports={
   sendWelcomeEmail,
   sendCancelationEmail
}