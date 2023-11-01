import { relations, sql } from "drizzle-orm";
import {
  bigint,
  date,
  index,
  int,
  json,
  mysqlTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `kafka-nimbus_${name}`);

export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
  vpcId: varchar("vpcId", { length: 255 }),
  awsAccessKey: varchar("awsAccessKey", { length: 255 }),
  awsSecretAccessKey: varchar("awsSecretAccessKey", { length: 255 }),
  region: varchar("region", { length: 255 }),
  configArn: varchar("configArn", { length: 255 }),
  subnetId: json("subnetId"),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  clusters: many(clusters),
}));

export const accounts = mysqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index("userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = mysqlTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);

export const clusters = mysqlTable("clusters", {
  cluster_id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: date("createdAt"),
  img: varchar("img", { length: 255 }),
  user_id: varchar("user_id", { length: 255 }),
  securityGroup: json("securityGroup"),
  brokerPerZone: int("brokerPerZone"),
  instanceSize: varchar("instanceSize", { length: 255 }),
  zones: int("zones"),
  storagePerBroker: int("storagePerBroker"),
  kafkaArn: varchar("kafkaArn", { length: 255 }),
  bootStrapServer: json("bootStrapServer"),
  currentVersion: varchar("currentVersion", { length: 255 }),
  lifeCycleStage: int("lifeCycleStage"),
});

export const clusterRelations = relations(clusters, ({ one, many }) => ({
  user: one(users, {
    fields: [clusters.user_id],
    references: [users.id],
  }),
  topics: many(topics),
}));

export const topics = mysqlTable("topics", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  cluster_id: varchar("user_id", { length: 255 }),
  name: varchar("name", { length: 255 }),
  configEntries: varchar("configEntries", { length: 255 }),
  replicaAssignment: varchar("replicaAssignment", { length: 255 }),
  numPartitions: int("numPartitions"),
  replicationFactor: int("replicationFactor"),
});

export const topicsRelations = relations(topics, ({ one }) => ({
  cluster: one(clusters, {
    fields: [topics.cluster_id],
    references: [clusters.cluster_id],
  }),
}));
