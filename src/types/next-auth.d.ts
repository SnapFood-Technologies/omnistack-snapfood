// types/next-auth.d.ts
import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: string;
            clientId?: string;
            client?: {
                id: string;
                name: string;
                isSuperClient: boolean;
                omniGatewayId?: string;
                omniGatewayApiKey?: string;
            };
        } & DefaultSession["user"]
    }

    interface User {
        role?: string;
        clientId?: string;
        client?: {
            id: string;
            name: string;
            isSuperClient: boolean;
            omniGatewayId?: string;
            omniGatewayApiKey?: string;
        };
    }
}