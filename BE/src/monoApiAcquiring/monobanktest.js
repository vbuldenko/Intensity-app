import MonobankAcquiring from './monobank';
//my test token
const monobankAPI = new MonobankAcquiring(
  'uQcWuN3VMxplicrjeH4vzO29imSupHYJGJDpPupKyNH4',
);

export async function runTest() {
  try {
    // Тестування методу createInvoice
    const invoiceData = {
      amount: 4200,
      ccy: 980,
      merchantPaymInfo: {
        reference: '7771',
        destination: 'Abonement',
        // basketOrder: [{
        //     name: 'Табуретка',
        //     qty: 2,
        //     sum: 2100,
        //     icon: 'string',
        //     unit: 'шт.',
        //     code: 'd21da1c47f3c45fca10a10c32518bdeb',
        //     barcode: 'barcode',
        //     header: 'header',
        //     footer: 'footer',
        //     tax: [],
        //     uktzed: '',
        // }, ],
      },
      redirectUrl: 'https://example.com/your/website/result/page',
      webHookUrl:
        'https://example.com/mono/acquiring/webhook/maybesomegibberishuniquestringbutnotnecessarily',
      // validity: 3600,
      paymentType: 'debit',
      // qrId: 'XJ_DiM4rTd5V',
      saveCardData: {
        saveCard: true,
        walletId: '777',
      },
    };
    const createdInvoice = await monobankAPI.createInvoice(invoiceData);
    console.log('createInvoice result:', createdInvoice);

    // Тестування методу getInvoiceStatus
    const invoiceId = createdInvoice.invoiceId;
    const invoiceStatus = await monobankAPI.getInvoiceStatus(invoiceId);
    console.log('getInvoiceStatus result:', invoiceStatus);

    // Тестування методу getWallet
    const walletId = '777';
    const walletData = await monobankAPI.getWallet(walletId);
    console.log('getWallet result:', walletData);

    // Тестування методу makePaymentFromWallet
    const paymentData = {
      cardToken: walletData.wallet[0].cardToken,
      amount: 4200,
      ccy: 980,
      tds: true,
      redirectUrl: 'https://example.com/your/website/result/page',
      webHookUrl:
        'https://example.com/mono/acquiring/webhook/maybesomegibberishuniquestringbutnotnecessarily',
      initiationKind: 'merchant',
    };
    const paymentResult = await monobankAPI.makePaymentFromWallet(paymentData);
    console.log('makePaymentFromWallet result:', paymentResult);

    // Тестування методу deleteCard
    const cardToken = walletData.wallet[0].cardToken;
    const deletionResult = await monobankAPI.deleteCard(cardToken);
    console.log('deleteCard result:', deletionResult);
  } catch (error) {
    console.error(error);
  }
}
