const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// Merchant account creation email
const sendMerchantCreationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'pabats@gmail.com',
        subject: 'New merchant profile!',
        text: `Happy to see you in our Delivery app family ${name} !`
    })
}

// Merchant account update email
const sendMerchantUpdateEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'pabats@gmail.com',
        subject: "Merchant's profile updated!",
        text: `Your ${name} profile has been updated successfully!`
    })
}

// Merchant account deletion email
const sendMerchantDeletionEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'pabats@gmail.com',
        subject: "Merchant's profile deleted!",
        text: `Your ${name} profile has been deleted successfully. Thank you for your cooperation!`
    })
}

// Order confirmation email
const sendOrderConfirmationEmail = (email, name, shop) => {
    sgMail.send({
        to: email,
        from: 'pabats@gmail.com',
        subject: 'Order placed!',
        text: `Order placed successfully in ${shop}. Thank you for ordering ${name} !`
    })
}

// Order status update email
const sendOrderUpdateEmail = (email, name, shop) => {
    sgMail.send({
        to: email,
        from: 'pabats@gmail.com',
        subject: 'Order updated!',
        text: `Order updated successfully in ${shop}. Enjoy your purchase ${name} !`
    })
}

// Order cancellation email
const sendOrderCancelationEmail = (email, name, shop) => {
    sgMail.send({
        to: email,
        from: 'pabats@gmail.com',
        subject: 'Order cancelled!',
        text: `Order cancelled successfully in ${shop}. We hope to see you soon ${name} !`
    })
}

// Export all functions
module.exports = {
    sendMerchantCreationEmail,
    sendMerchantUpdateEmail,
    sendMerchantDeletionEmail,
    sendOrderConfirmationEmail,
    sendOrderUpdateEmail,
    sendOrderCancelationEmail
}