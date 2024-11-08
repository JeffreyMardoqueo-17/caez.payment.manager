
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    const WithAuthComponent = (props: P) => {
        const router = useRouter();

        useEffect(() => {
            const token = localStorage.getItem("token");

            if (!token) {
                router.replace("/login"); // Redirige al login si no hay token
            }
        }, [router]);

        return <WrappedComponent {...props} />;
    };

    WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

    return WithAuthComponent;
};

export default withAuth;
