import test from "node:test";
import assert from "node:assert/strict";
import { getProductionEnvIssues } from "../src/config/env.js";

test("production environment validation reports missing settings", () => {
  assert.deepEqual(getProductionEnvIssues({}), [
    "DB_CONFIGURATION is missing",
    "ACCESS_TOKEN_SECRET is missing",
    "REFRESH_TOKEN_SECRET is missing",
    "CLIENT_URL is missing",
    "BASE_URL is missing",
  ]);
});

test("production environment validation rejects equal token secrets", () => {
  const issues = getProductionEnvIssues({
    DB_CONFIGURATION: "mongodb://localhost/eduzone",
    ACCESS_TOKEN_SECRET: "same-secret",
    REFRESH_TOKEN_SECRET: "same-secret",
    CLIENT_URL: "https://client.example",
    BASE_URL: "https://api.example",
  });

  assert.deepEqual(issues, [
    "ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be different",
  ]);
});

test("production environment validation accepts all required settings", () => {
  assert.deepEqual(
    getProductionEnvIssues({
      DB_CONFIGURATION: "mongodb://localhost/eduzone",
      ACCESS_TOKEN_SECRET: "access-secret",
      REFRESH_TOKEN_SECRET: "refresh-secret",
      CLIENT_URL: "https://client.example",
      BASE_URL: "https://api.example",
    }),
    [],
  );
});
