'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { products } from '@/lib/stripe-products';
import { redirectToCheckout, goToBillingPortal } from '@/lib/stripe';
import { Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Subscription } from '@stripe/firestore-stripe-payments';

function PlanCard({ product, onSubscribe, isLoading, isCurrent }: { product: typeof products[0], onSubscribe: (priceId: string) => void, isLoading: boolean, isCurrent: boolean }) {
    const priceIdToSubscribe = isCurrent ? '' : product.priceId;

    return (
        <Card className={cn("flex flex-col", isCurrent && "border-primary shadow-glow-primary")}>
            <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-4xl font-bold">${product.price}<span className="text-lg font-normal text-muted-foreground">{product.frequency}</span></p>
                <ul className="mt-6 space-y-2">
                    {product.features.map(feature => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-500"/>
                            {feature}
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    onClick={() => onSubscribe(priceIdToSubscribe)}
                    disabled={isLoading || isCurrent}
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : (isCurrent ? 'Current Plan' : 'Subscribe')}
                </Button>
            </CardFooter>
        </Card>
    );
}


export function BillingForm() {
    const { user, subscription, loading } = useAuth();
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

    const handleSubscribe = async (priceId: string) => {
        if (!user) {
            alert('You must be logged in to subscribe.');
            return;
        }
        setIsCheckoutLoading(true);
        await redirectToCheckout(priceId);
        // The user will be redirected, so we don't need to set loading to false here.
    };

    const manageSubscription = () => {
        goToBillingPortal();
    };

    if (loading) {
        return <p>Loading subscription details...</p>
    }

    if (subscription) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Your Subscription</CardTitle>
                     <CardDescription>
                        You are currently on the <strong>{subscription.items[0]?.price.product.name || 'Unknown'}</strong> plan.
                        Your subscription is {subscription.status}.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Your plan will {subscription.cancel_at_period_end ? 'cancel' : 'renew'} on {new Date(subscription.current_period_end * 1000).toLocaleDateString()}.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button onClick={manageSubscription}>Manage Billing & Invoices</Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.filter(p => p.price > 0).map((product) => (
                <PlanCard 
                    key={product.id}
                    product={product}
                    onSubscribe={handleSubscribe}
                    isLoading={isCheckoutLoading}
                    isCurrent={false} // Can't be current if they have no subscription
                />
            ))}
        </div>
    );
}
