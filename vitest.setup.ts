import '@testing-library/jest-dom/vitest';
import { server } from "./src/mocks/server";
import { afterAll, afterEach, beforeAll } from 'vitest';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());