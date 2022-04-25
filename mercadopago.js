// Step #3

var mercadopago = require('mercadopago');
mercadopago.configurations.setAccessToken(config.access_token);

var response = await mercadopago.payment_methods.listAll();
var payment_methods = response.body;
mercadopago.configurations.setAccessToken("APP_USR-1386608462969315-040520-be7e90c4357f3dd6164daa1c3b61471a-1101981994");

    const mp = new MercadoPago('APP_USR-88a7ddb8-24e8-4c84-ad91-9896692af376', {
        locale: 'en-US'
    })

     const cardForm = mp.cardForm({
         amount: '100.5',
         autoMount: true,
         processingMode: 'aggregator',
         form: {
             id: 'form-checkout',
             cardholderName: {
                 id: 'form-checkout__cardholderName',
                 placeholder: 'Cardholder name',
             },
             cardholderEmail: {
                 id: 'form-checkout__cardholderEmail',
                 placeholder: 'Email',
             },
             cardNumber: {
                 id: 'form-checkout__cardNumber',
                 placeholder: 'Card number',
             },
              cardExpirationMonth: {
                 id: 'form-checkout__cardExpirationMonth',
                 placeholder: 'MM'
             },
             cardExpirationYear: {
                 id: 'form-checkout__cardExpirationYear',
                 placeholder: 'YYYY'
             },
             securityCode: {
                 id: 'form-checkout__securityCode',
                 placeholder: 'CVV',
             },
             installments: {
                 id: 'form-checkout__installments',
                 placeholder: 'Total installments'
             },
             identificationType: {
                 id: 'form-checkout__identificationType',
                 placeholder: 'Document type'
             },
             identificationNumber: {
                 id: 'form-checkout__identificationNumber',
                 placeholder: 'Document number'
             },
             issuer: {
                 id: 'form-checkout__issuer',
                 placeholder: 'Issuer'
             }
         },
         callbacks: {
            onFormMounted: error => {
                if (error) return console.warn('Form Mounted handling error: ', error)
                console.log('Form mounted')
            },
            onFormUnmounted: error => {
                if (error) return console.warn('Form Unmounted handling error: ', error)
                console.log('Form unmounted')
            },
            onIdentificationTypesReceived: (error, identificationTypes) => {
                if (error) return console.warn('identificationTypes handling error: ', error)
                console.log('Identification types available: ', identificationTypes)
            },
            onPaymentMethodsReceived: (error, paymentMethods) => {
                if (error) return console.warn('paymentMethods handling error: ', error)
                console.log('Payment Methods available: ', paymentMethods)
            },
            onIssuersReceived: (error, issuers) => {
                if (error) return console.warn('issuers handling error: ', error)
                console.log('Issuers available: ', issuers)
            },
            onInstallmentsReceived: (error, installments) => {
                if (error) return console.warn('installments handling error: ', error)
                console.log('Installments available: ', installments)
            },
            onCardTokenReceived: (error, token) => {
                if (error) return console.warn('Token handling error: ', error)
                console.log('Token available: ', token)
            },
            onSubmit: (event) => {
                event.preventDefault();
                const cardData = cardForm.getCardFormData();
                console.log('CardForm data available: ', cardData)
            },
            onFetching:(resource) => {
                console.log('Fetching resource: ', resource)

                // Animate progress bar
                const progressBar = document.querySelector('.progress-bar')
                progressBar.removeAttribute('value')

                return () => {
                    progressBar.setAttribute('value', '0')
                }
            },
        }
     })

mercadopago.payment.save(req.body)
  .then(function(response) {
    const { status, status_detail, id } = response.body;
    res.status(response.status).json({ status, status_detail, id });
  })
  .catch(function(error) {
    console.error(error);
  });    
/*----------otros formas de pago-----------*/


mercadopago.configurations.setAccessToken(config.access_token);


mercadopago.payment.create(payment_data).then(function (data) {

}).catch(function (error) {

});



