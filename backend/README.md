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

## Ingredient Categorization

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

## Testing

```bash
# Run tests
bun test
```

This project was created using Bun and Elysia.js.
