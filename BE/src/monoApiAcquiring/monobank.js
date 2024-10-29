import axios from 'axios';
import KeyStorage from './keyStorage';
import crypto from 'crypto';

class MonobankAcquiring {
  // token for monobank api access
  constructor(token) {
    this.token = token;
    this.keyStorage = new KeyStorage();

    this.apiClient = axios.create({
      baseURL: 'https://api.monobank.ua/api/merchant/',
      headers: {
        'Content-Type': 'application/json',
        'X-Token': this.token,
      },
    });

    this.apiClient.interceptors.response.use(
      response => response.data,
      error => Promise.reject(error),
    );
  }

  async verifyWebhookSignature(signature, message) {
    let publicKey = await this.keyStorage.getTokenPublicKey(this.token);

    if (!publicKey) {
      publicKey = await this.getPublicKey();
      await this.keyStorage.addTokenPublicKey(this.token, publicKey.publicKey);
    }

    const signatureBuf = Buffer.from(signature, 'base64');
    const publicKeyBuf = Buffer.from(publicKey.publicKey, 'base64');

    const verify = crypto.createVerify('SHA256');
    verify.write(message);
    verify.end();

    if (verify.verify(publicKeyBuf, signatureBuf)) {
      return true;
    }

    // Retry with the new public key
    const updatedPublicKey = await this.getPublicKey();
    await this.keyStorage.updateTokenPublicKey(
      this.token,
      updatedPublicKey.publicKey,
    );

    const updatedPublicKeyBuf = Buffer.from(
      updatedPublicKey.publicKey,
      'base64',
    );
    return verify.verify(updatedPublicKeyBuf, signatureBuf);
  }

  async handleWebhookRequest(req) {
    const xSign = req.headers['x-sign'];
    const body = req.body;

    if (!(await this.verifyWebhookSignature(xSign, JSON.stringify(body)))) {
      throw new Error('Webhook signature verification failed');
    }

    return true;
  }

  // Gets public key from monobank for verifying webhook signatures
  async getPublicKey() {
    try {
      return await this.apiClient.get('pubkey');
    } catch (error) {
      console.error('Failed to get Public Key:', error);
      throw error;
    }
  }

  // upon creation returns {invoiceId, redirectUrl}
  async createInvoice(invoiceData) {
    try {
      return await this.apiClient.post('invoice/create', invoiceData);
    } catch (error) {
      console.error('Failed to create invoice:', error);
      throw error;
    }
  }

  async getInvoiceStatus(invoiceId) {
    try {
      return await this.apiClient.get(`invoice/status?invoiceId=${invoiceId}`);
    } catch (error) {
      console.error('Failed to get invoice status:', error);
      throw error;
    }
  }

  async getWallet(walletId) {
    try {
      return await this.apiClient.get(`wallet?walletId=${walletId}`);
    } catch (error) {
      console.error('Failed to get wallet:', error);
      throw error;
    }
  }

  async deleteCard(cardToken) {
    try {
      return await this.apiClient.delete(`wallet/card?cardToken=${cardToken}`);
    } catch (error) {
      console.error('Failed to DELETE card by token:', error);
      throw error;
    }
  }

  async initiateWalletPayment(paymentData) {
    try {
      return await this.apiClient.post('wallet/payment', paymentData);
    } catch (error) {
      console.error('Failed to initiate wallet payment:', error);
      throw error;
    }
  }
}

export default MonobankAcquiring;
