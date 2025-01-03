#!/bin/bash

# Create main app structure
mkdir -p src/app/{auth,onboarding}/{login,register}
mkdir -p src/app/admin/{dashboard,restaurants,users}
mkdir -p src/app/restaurant/{dashboard,menu,orders}

# Create components structure
mkdir -p src/components/{ui,auth,dashboard,restaurant,onboarding,shared}

# Create base files for auth
touch src/app/auth/login/page.tsx
touch src/app/auth/register/page.tsx
touch src/app/layout.tsx

# Create admin pages
touch src/app/admin/dashboard/page.tsx
touch src/app/admin/restaurants/page.tsx
touch src/app/admin/users/page.tsx
touch src/app/admin/layout.tsx

# Create restaurant pages
touch src/app/restaurant/dashboard/page.tsx
touch src/app/restaurant/menu/page.tsx
touch src/app/restaurant/orders/page.tsx
touch src/app/restaurant/layout.tsx

# Create onboarding components
touch src/components/onboarding/business-details-form.tsx
touch src/components/onboarding/location-info-form.tsx
touch src/components/onboarding/menu-creation-form.tsx
touch src/components/onboarding/operating-hours-form.tsx

# Create dashboard components
touch src/components/dashboard/header.tsx
touch src/components/dashboard/sidebar.tsx
touch src/components/dashboard/overview.tsx
touch src/components/dashboard/recent-sales.tsx
touch src/components/dashboard/stats.tsx

# Create shared components
touch src/components/shared/loading.tsx
touch src/components/shared/error.tsx

# Create lib folder for utilities
mkdir -p src/lib
touch src/lib/utils.ts
touch src/lib/auth.ts
touch src/lib/db.ts

# Create types folder
mkdir -p src/types
touch src/types/index.ts

echo "Project structure created successfully!"
