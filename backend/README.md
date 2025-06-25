# Recipe Planner Backend

A backend server for a Recipe and Meal Planner application built with Bun.js, Elysia.js, and Prisma.

## Features

- User authentication with JWT
- Recipe management (create, read, update, delete)
- External recipe search integration (stub)
- Meal planning with custom recipes
- Shopping list generation

## Tech Stack

- **Runtime**: [Bun.js](https://bun.sh)
- **Framework**: [Elysia.js](https://elysiajs.com/)
- **Database ORM**: [Prisma](https://prisma.io)
- **Validation**: [TypeBox](https://github.com/sinclairzx81/typebox) via Elysia
- **Authentication**: JWT with [@elysiajs/jwt](https://elysiajs.com/plugins/jwt.html)
- **Password Hashing**: Argon2

## Setup & Installation

### Prerequisites

- [Bun.js](https://bun.sh) installed
- PostgreSQL database

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL="postgresql://username:password@localhost:5432/recipe_planner"
JWT_SECRET="your_jwt_secret_key"
```

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the backend directory
cd my-recipe-planner/backend

# Install dependencies
bun install

# Run database migrations
bunx prisma migrate dev

# Start the server
bun run src/main.ts
```

## API Documentation

The API documentation is available via Swagger at http://localhost:3000/swagger when the server is running.

### Authentication Endpoints

| Method | Endpoint        | Description                     | Auth Required |
|--------|----------------|---------------------------------|--------------|
| POST   | /auth/register | Register a new user             | No           |
| POST   | /auth/login    | Log in and receive JWT token    | No           |
| GET    | /auth/me       | Get authenticated user details  | Yes          |

### Recipe Endpoints

| Method | Endpoint        | Description                    | Auth Required |
|--------|----------------|--------------------------------|--------------|
| GET    | /recipes/search | Search recipes in external API | Yes          |
| POST   | /recipes       | Create or save a recipe        | Yes          |
| GET    | /recipes/mine   | Get user's recipes            | Yes          |
| GET    | /recipes/:id    | Get recipe details            | Yes          |
| PUT    | /recipes/:id    | Update a recipe               | Yes          |
| DELETE | /recipes/:id    | Delete a recipe               | Yes          |

### Meal Plan Endpoints

| Method | Endpoint                    | Description                  | Auth Required |
|--------|----------------------------|------------------------------|--------------|
| POST   | /meal-plans                | Create a meal plan           | Yes          |
| GET    | /meal-plans                | List all user meal plans     | Yes          |
| GET    | /meal-plans/:id            | Get meal plan details        | Yes          |
| PUT    | /meal-plans/:id            | Update a meal plan           | Yes          |
| DELETE | /meal-plans/:id            | Delete a meal plan           | Yes          |
| POST   | /meal-plans/:id/entries    | Add recipe to meal plan      | Yes          |
| DELETE | /meal-plans/:id/entries/:entryId | Remove recipe from meal plan | Yes    |
| GET    | /meal-plans/:id/shopping-list | Generate shopping list for a meal plan | Yes |

### Shopping List Endpoints

| Method | Endpoint                    | Description                  | Auth Required |
|--------|----------------------------|------------------------------|--------------|
| GET    | /shopping-list             | Get consolidated shopping list | Yes        |
| GET    | /shopping-list/:mealPlanId | Get shopping list for a meal plan | Yes     |
| POST   | /shopping-list/items       | Add custom item to shopping list | Yes      |

## Data Models

- **User**: Authentication and identity
- **Recipe**: Food recipes with ingredients and instructions
- **Ingredient**: Components of recipes
- **MealPlan**: Weekly or custom period meal plans
- **MealPlanEntry**: Individual recipes scheduled for specific days/meals

## Shopping List Features

### Unit Normalization and Conversion

The shopping list feature automatically normalizes and converts ingredient quantities for consistent measurements:

- Volume units (teaspoons, tablespoons, cups, liters, etc.) are normalized to milliliters
- Weight units (ounces, pounds, grams, kilograms, etc.) are normalized to grams
- When combining ingredients, the system intelligently merges quantities and selects the most appropriate unit
- Supports both English and Spanish unit names (cups/tazas, ounces/onzas, etc.)
- Formats fractional quantities in a readable way (e.g., "1 1/2 cups" instead of "1.5 cups")

### Ingredient Categorization

The shopping list generation provides both a flat list of ingredients and a categorized list. Ingredients are automatically categorized based on their names into the following groups:

- Produce (fruits and vegetables)
- Meat & Seafood
- Dairy & Eggs
- Bakery
- Pantry (canned goods, grains, pastas, etc.)
- Frozen Foods
- Condiments & Spices
- Beverages
- Snacks
- Other

## Development

```bash
# Run in development mode with hot reload
bun --watch run src/main.ts
```

## Error Handling and Validation

### Global Error Handling

The application uses a centralized error handling system with custom error classes:

- **AppError**: Base error class with status code
- **BadRequestError (400)**: For invalid input data
- **UnauthorizedError (401)**: For authentication failures
- **ForbiddenError (403)**: For permission issues
- **NotFoundError (404)**: For resources that don't exist
- **ConflictError (409)**: For data conflicts (e.g., duplicate email)
- **TooManyRequestsError (429)**: For rate limiting
- **InternalServerError (500)**: For server-side issues

Errors are automatically captured and formatted with consistent JSON responses:

```json
{
  "success": false,
  "error": "ErrorTypeName",
  "message": "Human-readable error message",
  "timestamp": "2025-06-25T12:34:56.789Z"
}
```

In development mode, additional context is provided (path, details, stack trace).

### Request Validation

All endpoints have strong validation using TypeBox (similar to Zod):

- **Route-level schemas**: Each endpoint defines schemas for body, params, query
- **Common validators**: Reusable validators for UUIDs, emails, passwords, etc.
- **Detailed error messages**: Validation failures return specific field errors
- **Type safety**: TypeBox ensures runtime validation matches TypeScript types

### Rate Limiting

The API includes rate limiting for public endpoints to prevent abuse:

- **Recipe search**: Limited to 10 requests per minute per IP
- **Authentication endpoints**: Protected against brute force attempts

### Secure Practices

- Passwords are hashed with Argon2
- JWT tokens are properly signed and have expiration times
- Error responses don't leak sensitive information

## Testing

```bash
# Run tests
bun test
```

This project was created using Bun and Elysia.js.
