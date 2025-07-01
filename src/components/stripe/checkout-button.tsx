
'use client';
import { Button, type ButtonProps } from '@/components/ui/button';
import { handleStripeOneTimeCheckout } from '@/lib/stripe';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StripeCheckoutButtonProps extends ButtonProps {
    priceId: string;
    buttonText: string;
    buttonStyles: any;
    style: React.CSSProperties;
}

export function StripeCheckoutButton({ priceId, buttonText, buttonStyles, style, ...props }: StripeCheckoutButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    
    const onCheckout = async () => {
        setIsLoading(true);
        await handleStripeOneTimeCheckout(priceId);
        // This will redirect, so no need to setIsLoading(false) if successful.
        // If it fails, an alert is shown in the handler, so we can set loading to false.
        setIsLoading(false);
    }

    return (
        <Button 
            onClick={onCheckout}
            disabled={isLoading}
            style={{
                ...style,
                borderRadius: `${buttonStyles.borderRadius}px`,
                boxShadow: buttonStyles.shadow,
            }}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {buttonText}
        </Button>
    )
}
