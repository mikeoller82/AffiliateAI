'use client';

import { getFirebaseInstances } from './firebase';
import {
  createCheckoutSession,
  getStripePayments,
  onCurrentUserSubscriptionUpdate as onSubUpdate,
  type StripePayments,
} from '@stripe/firestore-stripe-payments';

let paymentsInstance: StripePayments | null = null;

function getPaymentsInstance(): StripePayments {
  if (!paymentsInstance) {
    try {
      const { app } = getFirebaseInstances();
      paymentsInstance = getStripePayments(app, {
        productsCollection: 'products',
        customersCollection: 'customers',
      });
    } catch (error) {
      console.error("Failed to initialize Stripe Payments", error);
      throw new Error("Could not initialize Stripe Payments. Is Firebase configured correctly?");
    }
  }
  return paymentsInstance;
}

export const redirectToCheckout = async (priceId: string) => {
  if (!priceId) {
    alert('Error: No price ID was provided.');
    return;
  }

  const payments = getPaymentsInstance();
  try {
    const session = await createCheckoutSession(payments, {
      price: priceId,
      success_url: `${window.location.origin}/dashboard/settings?tab=billing&success=true`,
      cancel_url: `${window.location.origin}/dashboard/settings?tab=billing&cancelled=true`,
    });
    window.location.assign(session.url);
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    alert(`Error: Could not redirect to checkout. ${error instanceof Error ? error.message : ''}`);
  }
};

export const goToBillingPortal = async () => {
    // This link should ideally be retrieved from the user's customer document in Firestore,
    // which is populated by the "Run Payments with Stripe" Firebase Extension.
    // For this prototype, we will link to the generic Stripe customer portal login page.
    alert("This will redirect to the Stripe Billing Portal. Ensure you have configured your portal settings in the Stripe Dashboard.");
    const portalUrl = 'https://billing.stripe.com/p/login/test_7sI5m4bKN9aV0i4144'; // Replace with your actual customer portal link ID
    window.open(portalUrl, '_blank');
};


export const onCurrentUserSubscriptionUpdate = (
    callback: (snapshot: {
        subscriptions: import('@stripe/firestore-stripe-payments').Subscription[];
    }) => void
) => {
    const payments = getPaymentsInstance();
    return onSubUpdate(payments, callback);
}
