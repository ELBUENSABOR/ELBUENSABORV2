import {useEffect, useRef, useState} from "react";

interface GoogleAuthButtonProps {
    onSuccess: (credential: string) => void;
    text?: "signin_with" | "signup_with" | "continue_with";
}

const GoogleAuthButton = ({onSuccess, text = "continue_with"}: GoogleAuthButtonProps) => {
    const buttonRef = useRef<HTMLDivElement | null>(null);
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
    const [isReady, setIsReady] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (!clientId || !window.google || !buttonRef.current || isInitialized) return;

        window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response) => onSuccess(response.credential),
            cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
            theme: "outline",
            size: "large",
            text,
            shape: "pill",
            width: 280,
        });
        setIsReady(true);
        setIsInitialized(true);
    }, [clientId, onSuccess, text, isInitialized]);

    useEffect(() => {
        if (clientId && window.google) {
            setIsReady(true);
        }
    }, [clientId]);

    if (!clientId) {
        return (
            <button className="google-auth-fallback" type="button" disabled>
                Configurá VITE_GOOGLE_CLIENT_ID para usar Google
            </button>
        );
    }

    if (!isReady) {
        return (
            <button className="google-auth-fallback" type="button" disabled>
                Cargando Google…
            </button>
        );
    }

    return <div className="google-auth-button" ref={buttonRef}/>;
};

export default GoogleAuthButton;
