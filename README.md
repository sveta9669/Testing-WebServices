# Testing WebServices - restful-booker API Automation

Automated API test suite for the **restful-booker** service using JavaScript's native [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) and Node.js built-in test runner (`node:test` and `node:assert/strict`).

## Architecture

The test automation framework is separated into three layers:

| Layer | Location | Responsibility |
|---|---|---|
| Core | `src/core/` | Reusable HTTP functionality independent of the tested application. `ApiClient` builds requests, query strings, and JSON payloads. |
| Business | `src/business/pages/` | Application-specific API Page Objects. `AuthPage` and `BookingPage` encapsulate the restful-booker endpoints and authentication details. |
| Tests | `tests/` | Test scenarios, framework configuration, scenario data, and shared assertions. |

This is an API suite, so Page Objects represent API resources rather than browser screens. Test scenarios interact with `AuthPage` and `BookingPage`, not raw URLs or `fetch`; this keeps endpoint details in the business layer. Shared request handling and assertion helpers reduce duplication without introducing extra abstractions.

---

## 1. restful-booker API Overview

- **Official API Documentation**: [restful-booker API Docs](https://restful-booker.herokuapp.com/apidoc/index.html)
- **Base URL**: `https://restful-booker.herokuapp.com`
- **Default Auth Credentials**:
  - `username`: `admin`
  - `password`: `password123`

### Endpoints Covered

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth` | Creates an authentication token | No |
| `POST` | `/booking` | Creates a new booking record | No |
| `GET` | `/booking/:id` | Retrieves a booking by its ID | No |
| `PUT` | `/booking/:id` | Full update of an existing booking | Yes (`Cookie: token=...`) |
| `DELETE` | `/booking/:id` | Deletes a booking record | Yes (`Cookie: token=...`) |

---

## 2. Test Scenarios Implemented

The test suite implements 5 automated scenarios using **native JS `fetch`**:

1. **Scenario 1: Create auth token and verify response (`POST /auth`)**
   - Authenticates using credentials (`admin` / `password123`).
   - Retrieves and saves the auth token for reuse in subsequent API calls.
2. **Scenario 2: Create a new booking (`POST /booking`)**
   - Sends a complete booking payload.
   - Extracts and saves `bookingid` for subsequent tests.
3. **Scenario 3: Get created booking by id (`GET /booking/:id`)**
   - Fetches the newly created booking by its unique ID.
4. **Scenario 4: Update booking using token (`PUT /booking/:id`)**
   - Updates all fields of the booking using the generated auth token.
5. **Scenario 5: Remove booking (`DELETE /booking/:id` and `GET /booking/:id`)**
   - Deletes the booking using the auth token (expects `201 Created`).
   - Verifies the deleted booking returns `404 Not Found`.

---

## 3. Assertions Covered

Every scenario validates three core aspects:

- **Status Code Assertions**:
  - Validates exact HTTP response status codes (`200 OK`, `201 Created`, `404 Not Found`).
  - Asserts `response.ok` boolean status.
- **Header Assertions**:
  - Asserts existence of `Content-Type` header (`response.headers.has('content-type')`).
  - Asserts format matching `application/json` with regex matching.
- **Response Body Assertions**:
  - Validates body structure and property data types.
  - Verifies exact field values match the payload.
  - Deep-equality assertions on nested objects (`bookingdates: { checkin, checkout }`).
  - Validates expected plain text bodies for non-JSON responses (`"Created"`, `"Not Found"`).

---

## 4. Running API Tests via CLI

The project uses Node.js native test runner (`node:test`) with zero external dependencies. Node.js 18 or later is required for the native Fetch API.

Set `BASE_URL` to run against another restful-booker-compatible environment. If omitted, tests use `https://restful-booker.herokuapp.com`.

### Run all tests:
```bash
npm test
```

### Run tests with verbose spec reporter:
```bash
npm run test:verbose
```

PowerShell:
```powershell
$env:BASE_URL = "https://restful-booker.herokuapp.com"
npm test
```

### Run directly with Node:
```bash
node --test tests/restful-booker.test.js
```

---

## 5. Postman Collection for Debugging

An exported Postman Collection is provided:

- **File Path**: [`postman/Restful-Booker.postman_collection.json`](./postman/Restful-Booker.postman_collection.json)

### How to use with Postman:
1. Open **Postman**.
2. Click **Import** and select `postman/Restful-Booker.postman_collection.json`.
3. The collection is configured to automatically chain `{{token}}` and `{{bookingId}}` across requests.
4. Run individual requests or run the entire collection via **Collection Runner**.

---

## Project Structure

```text
WebServices/
├── package.json
├── README.md
├── src/
│   ├── core/
│   │   └── api-client.js                     # Project-independent HTTP client
│   └── business/
│       └── pages/
│           ├── auth.page.js                  # Authentication API Page Object
│           └── booking.page.js               # Booking API Page Object
├── tests/
│   ├── config/
│   │   └── test-config.js                    # Base URL and Page Object setup
│   ├── fixtures/
│   │   └── booking-data.js                   # Reusable scenario data
│   ├── helpers/
│   │   └── assertions.js                     # Shared response and booking assertions
│   └── restful-booker.test.js                # Automated API scenarios
└── postman/
    └── Restful-Booker.postman_collection.json
```