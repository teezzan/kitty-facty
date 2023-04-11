# Kitty Facty

Welcome to Kitty Facty, the web application that provides random cat facts to its users. This application is built using Next.js and the Cat Fact API.

## Getting Started

To get started with Kitty Facty, follow these steps:

- Clone this repository to your local machine.
- Install the dependencies by running npm install in the project root directory.
- Start the development server by running npm run dev.
- Open your browser and navigate to http://localhost:3000.

## Features

Kitty Facty provides the following features to its users:

- Pagination of cat facts.
- Sorting of cat facts by length or alphabetically.
- Error handling in case something goes wrong with the Cat Fact API.

## Project Structure

The project is structured as follows:

- `pages`: Contains the Next.js pages for the application.
- `styles`: Contains global styles for the application.
- `clients`: Contains the client for the Cat Fact API.
- `utils`: Contains utility functions for the application.
- `interfaces`: Contains interfaces and constants used throughout the application.
- `config`: Contains default values and environment-specific configuration.
- `__tests__`: Contains unit tests for the application.

## API Documentation

**`GET /api/facts`**

Returns a list of cat facts based on the provided query parameters.

### **Query Parameters**

The following query parameters are supported:
| Query String Parameter | Description | Example |
| ---------------------- | ----------- | ------- |
| `perPage` | Number of facts to return per page. Default is 10. Maximum is 50. | `perPage=25` |
| `page` | Page number to return. Default is 1. | `page=3` |
| `sortByLength` | Sort facts by length. Enumerated values: `asc` (ascending) or `desc` (descending). | `sortByLength=desc` |
| `sortByAlphabet` | Sort facts alphabetically. Enumerated values: `asc` (ascending) or `desc` (descending). | `sortByAlphabet=asc` |
| `maxLength` | Maximum length of the returned facts. | `maxLength=100` |

Note that the `sortByLength` and `sortByAlphabet` query parameters are mutually exclusive. If both are provided, the `sortByLength` parameter will take precedence.

### **Sample Request**

```bash
GET /api/facts?perPage=3&page=21&sortByLength=desc&sortByAlphabet=asc&maxLength=100
```

### **Sample Response**

```bash
HTTP/1.1 200 OK
Content-Type: application/json

{
    "currentPage": 21,
	"perPage": 3,
	"totalPages": 58,
    "facts": [
        {
			"fact": "A cat's hearing is much more sensitive than humans and dogs.",
			"length": 60,
			"id": 1
		},
		{
			"fact": "In 1987 cats overtook dogs as the number one pet in America.",
			"length": 60,
			"id": 2
		},
		{
			"fact": "Neutering a cat extends its life span by two or three years.",
			"length": 60,
			"id": 3
		}
    ]
}

```

## Testing

To run tests:

```javascript
npm run test
```

## Docker

To build and run the application using Docker:

- Build the Docker image:

```bash
docker build -t kitty-facty .
```

- Run the Docker container:

```bash
docker run -p 3000:3000 kitty-facty
```

## License

This project is licensed under the MIT License. See the LICENSE file for more information.
