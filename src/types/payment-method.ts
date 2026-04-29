export interface PaymentMethodConfig {
  apiKey?: string;
  publicKey?: string;
  webhookSecret?: string;
  [k: string]: unknown;
}

export interface PaymentMethod {
  _id: string;
  name: string;
  type: string;
  active: boolean;
  config: PaymentMethodConfig;
  createdAt: string;
  updatedAt: string;
}
