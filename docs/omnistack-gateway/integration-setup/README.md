# OmniStack Gateway Integration Guide for SnapFood

## Overview

This guide explains how to integrate the OmniStack Gateway with SnapFood. The gateway provides essential services for user management, family accounts, and staff app access features across the entire SnapFood platform.

## System Architecture

Unlike traditional multi-client systems, SnapFood uses a single system-wide client configuration for OmniStack Gateway integration. This client is marked as `isSuperClient: true` and is associated with the system admin.

## Gateway Credentials

The system requires one set of OmniStack Gateway credentials:

- `omniGatewayId`: '67b4e04b8a46d2a246b3ace8'
- `omniGatewayApiKey`: 'sk_f37b183bf20e3bdf9c5ed0a7cc96428d57915bf132caaf96296a0be008cc2994'

## Configuration Steps

### 1. Initialize System Client

Create a seed script to set up the system client:

```typescript
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedClient() {
  try {
    // Find or create super client
    let superClient = await prisma.client.findFirst({
      where: {
        isSuperClient: true,
      },
    });

    if (!superClient) {
      superClient = await prisma.client.create({
        data: {
          name: "SnapFood System Client",
          isSuperClient: true,
          omniGatewayId: "67b4e04b8a46d2a246b3ace8",
          omniGatewayApiKey:
            "sk_f37b183bf20e3bdf9c5ed0a7cc96428d57915bf132caaf96296a0be008cc2994",
        },
      });
    }

    // Link system admin to super client
    await prisma.user.update({
      where: {
        email: "admin@snapfood.com",
      },
      data: {
        clientId: superClient.id,
      },
    });

    console.log("Gateway configuration completed:", { superClient });
  } catch (error) {
    console.error("Error configuring gateway:", error);
    throw error;
  }
}

seedClient()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 2. Verify Configuration

Check if the system configuration is correct:

```typescript
async function verifyGatewayConfig() {
  const superClient = await prisma.client.findFirst({
    where: {
      isSuperClient: true,
    },
    select: {
      id: true,
      omniGatewayId: true,
      omniGatewayApiKey: true,
      users: {
        where: {
          email: "admin@snapfood.com",
        },
      },
    },
  });

  if (!superClient?.omniGatewayId || !superClient?.omniGatewayApiKey) {
    console.error("⚠️ Gateway configuration missing");
    return false;
  }

  if (superClient.users.length === 0) {
    console.error("⚠️ Admin user not linked to super client");
    return false;
  }

  console.log("✅ Gateway configuration verified");
  return true;
}
```

## Feature Integration

### User Management

```typescript
import { createOmniGateway } from "./api/external/omnigateway";

export const getGatewayCredentials = async () => {
  const superClient = await prisma.client.findFirst({
    where: { isSuperClient: true },
  });
  if (!superClient) throw new Error("Gateway configuration not found");
  return superClient;
};

export const createOmniStackUser = async (userData: any) => {
  const { omniGatewayApiKey } = await getGatewayCredentials();
  const api = createOmniGateway(omniGatewayApiKey);

  try {
    const response = await api.post("/users", userData);
    return response.data;
  } catch (error) {
    console.error("Failed to create OmniStack user:", error);
    throw error;
  }
};
```

## Security Considerations

### Environment Setup

Your `.env` file should include:

```plaintext
OMNISTACK_GATEWAY_URL=https://api.gateway.example.com
OMNISTACK_GATEWAY_ID=67b4e04b8a46d2a246b3ace8
OMNISTACK_GATEWAY_KEY=sk_f37b183bf20e3bdf9c5ed0a7cc96428d57915bf132caaf96296a0be008cc2994
```

### Access Control

- Only system admin has access to gateway credentials
- All restaurant-level operations use the system client's credentials
- Implement proper role-based access control for gateway operations

## Error Handling

```typescript
export const handleGatewayError = async (error: any) => {
  if (error.response?.status === 401) {
    // Invalid credentials
    await notifyAdminOfCredentialIssue();
  }
  // Log error for monitoring
  console.error("Gateway Error:", {
    status: error.response?.status,
    message: error.message,
    timestamp: new Date().toISOString(),
  });
};
```

## Maintenance

Regular maintenance tasks:

- Monitor gateway usage across all restaurants
- Maintain single source of truth for gateway credentials
- Regular verification of admin access and permissions
- Keep documentation updated with any gateway API changes

Remember to test all gateway integrations in a staging environment before deploying to production.

## Troubleshooting

Common issues and solutions:

1. **Gateway Credentials Not Found**

   - Verify super client exists in database
   - Check admin user is properly linked
   - Ensure environment variables are loaded

2. **Authentication Failures**

   - Verify API key hasn't expired
   - Check gateway service status
   - Confirm proper credential formatting

3. **Integration Issues**
   - Validate request payloads
   - Check API version compatibility
   - Monitor rate limits

## Support

If you encounter issues:

1. Check the system configuration using `verifyGatewayConfig()`
2. Review error logs for specific error messages
3. Verify admin permissions and client linkage
4. Contact gateway support with your client ID if needed
