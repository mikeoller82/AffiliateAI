'use client';

import { getFirebaseInstances } from './firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  query,
  where,
  type DocumentData,
} from 'firebase/firestore';
import { loadStripe } from '@stripe/stripe-js';

export const redirectToCheckout = async (priceId: string) => {
  if (!priceId) {
    alert('Error: No price ID was provided.');
    return;
  }
  
  try {
    const { auth, db } = getFirebaseInstances();
    const user = auth.currentUser;

    if (!user) {
      throw new Error("You must be logged in to make a purchase.");
    }
    
    const checkoutSessionRef = collection(db, 'customers', user.uid, 'checkout_sessions');

    const docRef = await addDoc(checkoutSessionRef, {
      price: priceId,
      success_url: `${window.location.origin}/dashboard/settings?tab=billing&success=true`,
      cancel_url: `${window.location.origin}/dashboard/settings?tab=billing&cancelled=true`,
    });

    onSnapshot(docRef, async (snap) => {
      const { error, sessionId } = snap.data() as DocumentData;
      if (error) {
        alert(`An error occurred: ${error.message}`);
        console.error(error);
      }
      if (sessionId) {
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
        if (stripe) {
          stripe.redirectToCheckout({ sessionId });
        }
      }
    });
  } catch (error) {
     console.error('Error redirecting to checkout:', error);
     alert(`Error: Could not redirect to checkout. ${error instanceof Error ? error.message : ''}`);
  }
};

export const goToBillingPortal = async () => {
    const portalUrl = process.env.NEXT_PUBLIC_STRIPE_BILLING_PORTAL_URL;
    if (!portalUrl || portalUrl.includes('test_your_portal_link')) {
        alert("Billing portal URL is not configured. Please update it in your Stripe dashboard and .env file.");
        return;
    }
    window.location.assign(portalUrl);
};


export const onCurrentUserSubscriptionUpdate = (
    callback: (snapshot: { subscriptions: DocumentData[] }) => void
) => {
    try {
        const { auth, db } = getFirebaseInstances();
        const user = auth.currentUser;
        if (!user) return () => {};

        const subscriptionsRef = collection(db, 'customers', user.uid, 'subscriptions');
        const q = query(subscriptionsRef, where('status', 'in', ['trialing', 'active']));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const subscriptions = snapshot.docs.map(doc => ({
                ...doc.data(),
                // Simulate the structure the app expects
                items: [{
                    price: { product: { name: 'Pro Plan' } }, // Assuming only one plan for now
                }],
            }));
            callback({ subscriptions });
        });

        return unsubscribe;
    } catch(error) {
        console.error("Error setting up subscription listener:", error);
        return () => {};
    }
}
