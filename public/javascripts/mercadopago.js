const mp = new MercadoPago('TEST-28c15411-97fd-4f1a-9678-5e7f5e2facba');



// Step #getPaymentMethods
const cardNumberElement = document.getElementById('form-checkout__cardNumber');

function clearHTMLSelectChildrenFrom(element) {
    const currOptions = [...element.children];
    currOptions.forEach(child => child.remove());
}

cardNumberElement.addEventListener('keyup', async () => {
    try {
        const paymentMethodElement = document.getElementById('paymentMethodId');
        const issuerElement = document.getElementById('form-checkout__issuer');
        const installmentsElement = document.getElementById('form-checkout__installments');
        let cardNumber = cardNumberElement.value;

        if (cardNumber.length < 6 && paymentMethodElement.value) {
            clearHTMLSelectChildrenFrom(issuerElement);
            clearHTMLSelectChildrenFrom(installmentsElement);
            paymentMethodElement.value = "";
            return
        }

        if (cardNumber.length >= 6 && !paymentMethodElement.value) {
            let bin = cardNumber.substring(0, 6);
            const paymentMethods = await mp.getPaymentMethods({ 'bin': bin });

            const { id: paymentMethodId, additional_info_needed, issuer } = paymentMethods.results[0];

            // Assign payment method ID to a hidden input.
            paymentMethodElement.value = paymentMethodId;

            // If 'issuer_id' is needed, we fetch all issuers (getIssuers()) from bin.
            // Otherwise we just create an option with the unique issuer and call getInstallments().
            additional_info_needed.includes('issuer_id') ? getIssuers() : (() => {
                const issuerElement = document.getElementById('form-checkout__issuer');
                createSelectOptions(issuerElement, [issuer]);

                getInstallments();
            })()
        }
    } catch (e) {
        console.error('error getting payment methods: ', e)
    }
});

// Step #getIssuers
const getIssuers = async () => {
    try {
        const cardNumber = document.getElementById('form-checkout__cardNumber').value;
        const paymentMethodId = document.getElementById('paymentMethodId').value;
        const issuerElement = document.getElementById('form-checkout__issuer');

        const issuers = await mp.getIssuers({ paymentMethodId, bin: cardNumber.slice(0, 6) });

        createSelectOptions(issuerElement, issuers);

        getInstallments();
    } catch (e) {
        console.error('error getting issuers: ', e)
    }
};


// Step #getInstallments
const getInstallments = async () => {
    try {
        const installmentsElement = document.getElementById('form-checkout__installments')
        const cardNumber = document.getElementById('form-checkout__cardNumber').value;

        const installments = await mp.getInstallments({
            amount: document.getElementById('transactionAmount').value,
            bin: cardNumber.slice(0, 6),
            paymentTypeId: 'credit_card'
        });

        createSelectOptions(installmentsElement, installments[0].payer_costs, { label: 'recommended_message', value: 'installments' })
    } catch (e) {
        console.error('error getting installments: ', e)
    }
}

// Step #createCardToken
const formElement = document.getElementById('form-checkout');
formElement.addEventListener('submit', e => createCardToken(e));

const createCardToken = async (event) => {
    try {
        const tokenElement = document.getElementById('token');

        if (!tokenElement.value) {
            event.preventDefault();

            const token = await mp.createCardToken({
                cardNumber: document.getElementById('form-checkout__cardNumber').value,
                cardholderName: document.getElementById('form-checkout__cardholderName').value,
                identificationNumber: document.getElementById('form-checkout__identificationNumber').value,
                securityCode: document.getElementById('form-checkout__securityCode').value,
                cardExpirationMonth: document.getElementById('form-checkout__cardExpirationMonth').value,
                cardExpirationYear: document.getElementById('form-checkout__cardExpirationYear').value
            });

            tokenElement.value = token.id;

            formElement.requestSubmit();
        }

    } catch (e) {
        console.error('error creating card token: ', e)
    }
}

// Step #getIdentificationTypes


// Helper function to append option elements to a select input
function createSelectOptions(elem, options, labelsAndKeys = { label: "name", value: "id" }) {
    const { label, value } = labelsAndKeys;

    elem.options.length = 0;

    const tempOptions = document.createDocumentFragment();

    options.forEach(option => {
        const optValue = option[value];
        const optLabel = option[label];

        const opt = document.createElement('option');
        opt.value = optValue;
        opt.textContent = optLabel;

        tempOptions.appendChild(opt);
    });

    elem.appendChild(tempOptions);
}

// Get Identification Types
/* (async function getIdentificationTypes() {
    try {
        const identificationTypes = await mp.getIdentificationTypes();
        const identificationTypeElement = document.getElementById('form-checkout__identificationType');

        createSelectOptions(identificationTypeElement, identificationTypes)
    } catch (e) {
        return console.error('Error getting identificationTypes: ', e);
    }
})() */