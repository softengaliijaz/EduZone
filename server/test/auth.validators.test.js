import test from "node:test";
import assert from "node:assert/strict";
import {
  validateLoginBody,
  validateRegisterBody,
} from "../src/validators/auth.validators.js";

test("registration accepts valid input and normalizes email for validation", () => {
  assert.deepEqual(
    validateRegisterBody({
      name: "  Ada Lovelace ",
      email: " ADA@example.com ",
      password: "secure-pass-1",
    }),
    [],
  );
});

test("registration rejects short names, malformed emails, and weak passwords", () => {
  assert.equal(
    validateRegisterBody({ name: "A", email: "bad", password: "short" }).length,
    3,
  );
});

test("login requires a valid email and a password", () => {
  assert.equal(
    validateLoginBody({ email: "person@example.com", password: "x" }).length,
    0,
  );
  assert.equal(validateLoginBody({ email: "bad", password: "" }).length, 2);
});
