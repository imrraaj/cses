import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  numeric,
  boolean
} from 'drizzle-orm/pg-core';

export const UsersTable = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    password: text('password').notNull(),
    username: text('username').notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    admin: boolean('admin').default(false).notNull(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex('unique_idx').on(users.email),
    };
  },
);

export const ProblemsTable = pgTable(
  'problems',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    sampleTestCaseInput: text('sampleTestCaseInput').notNull(),
    sampleTestCaseOutput: text('sampleTestCaseOutput').notNull(),
    explaination: text('explaination'),
    timeLimit: numeric('timeLimit').notNull(),
    memoryLimit: numeric('memoryLimit').notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  }
);

export const SubmissionsTable = pgTable(
  'submissions',
  {
    id: serial('id').primaryKey(),
    userId: serial('userId').notNull(),
    problemId: serial('problemId').notNull(),
    language: text('language').notNull(),
    code: text('code').notNull(),
    verdict: text('verdict').notNull(),
    time: numeric('timeTaken'),
    memory: numeric('memoryTaken'),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  },
);
