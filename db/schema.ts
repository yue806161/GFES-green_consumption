import { sql } from "drizzle-orm";
import { index, integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const profiles = sqliteTable("profiles", {
  id: text("id").primaryKey(),
  role: text("role").notNull(),
  displayName: text("display_name").notNull(),
  city: text("city").notNull(),
  district: text("district").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const consumerSettings = sqliteTable("consumer_settings", {
  consumerId: text("consumer_id").primaryKey(),
  contactEmail: text("contact_email").notNull().default(""),
  phone: text("phone").notNull().default(""),
  deliveryRecipientName: text("delivery_recipient_name").notNull().default(""),
  deliveryPhone: text("delivery_phone").notNull().default(""),
  deliveryPostalCode: text("delivery_postal_code").notNull().default(""),
  deliveryCity: text("delivery_city").notNull().default(""),
  deliveryDistrict: text("delivery_district").notNull().default(""),
  deliveryAddress: text("delivery_address").notNull().default(""),
  deliveryNote: text("delivery_note").notNull().default(""),
  residencePostalCode: text("residence_postal_code").notNull().default(""),
  residenceCity: text("residence_city").notNull().default(""),
  residenceDistrict: text("residence_district").notNull().default(""),
  residenceAddress: text("residence_address").notNull().default(""),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  farmerId: text("farmer_id").notNull(),
  title: text("title").notNull(),
  points: integer("points").notNull(),
  stock: integer("stock").notNull(),
  unit: text("unit").notNull(),
  proof: text("proof").notNull(),
  delivery: text("delivery").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  city: text("city").notNull(),
  district: text("district").notNull(),
  distanceKm: real("distance_km").notNull(),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  farmerId: text("farmer_id").notNull(),
  title: text("title").notNull(),
  note: text("note").notNull(),
  purpose: text("purpose").notNull(),
  points: integer("points").notNull(),
  targetPoints: integer("target_points").notNull(),
  raisedPoints: integer("raised_points").notNull().default(0),
  supporters: integer("supporters").notNull().default(0),
  progress: integer("progress").notNull().default(0),
  impact: text("impact").notNull(),
  city: text("city").notNull(),
  district: text("district").notNull(),
  distanceKm: real("distance_km").notNull(),
  completionDate: text("completion_date").notNull(),
  proof: text("proof").notNull(),
  allocationsJson: text("allocations_json").notNull(),
  storyJson: text("story_json").notNull(),
  status: text("status").notNull().default("funding"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const farmerStories = sqliteTable("farmer_stories", {
  farmerId: text("farmer_id").primaryKey(),
  headline: text("headline").notNull(),
  summary: text("summary").notNull(),
  body: text("body").notNull(),
  quote: text("quote").notNull().default(""),
  imageKey: text("image_key"),
  imageUrl: text("image_url").notNull().default(""),
  status: text("status").notNull().default("draft"),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  publishedAt: text("published_at"),
}, (table) => [index("idx_farmer_stories_status_published").on(table.status, table.publishedAt)]);

export const farmerNews = sqliteTable("farmer_news", {
  id: text("id").primaryKey(),
  farmerId: text("farmer_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull().default("農場近況"),
  imageKey: text("image_key"),
  imageUrl: text("image_url").notNull().default(""),
  status: text("status").notNull().default("draft"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  publishedAt: text("published_at"),
}, (table) => [
  index("idx_farmer_news_farmer_status_created").on(table.farmerId, table.status, table.createdAt),
  index("idx_farmer_news_status_published").on(table.status, table.publishedAt),
]);

export const pointLedger = sqliteTable("point_ledger", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  deltaPoints: integer("delta_points").notNull(),
  sourceType: text("source_type").notNull(),
  sourceId: text("source_id"),
  description: text("description").notNull(),
  metadataJson: text("metadata_json").notNull().default("{}"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  consumerId: text("consumer_id").notNull(),
  productId: text("product_id").notNull(),
  points: integer("points").notNull(),
  quantity: integer("quantity").notNull().default(1),
  stage: integer("stage").notNull().default(0),
  status: text("status").notNull().default("created"),
  recipientName: text("recipient_name").notNull().default(""),
  recipientPhone: text("recipient_phone").notNull().default(""),
  postalCode: text("postal_code").notNull().default(""),
  shippingCity: text("shipping_city").notNull(),
  shippingDistrict: text("shipping_district").notNull(),
  shippingAddress: text("shipping_address").notNull().default(""),
  deliveryNote: text("delivery_note").notNull().default(""),
  carrier: text("carrier").notNull().default(""),
  trackingNumber: text("tracking_number").notNull().default(""),
  fulfillmentNote: text("fulfillment_note").notNull().default(""),
  packedAt: text("packed_at").notNull().default(""),
  shippedAt: text("shipped_at").notNull().default(""),
  completedAt: text("completed_at").notNull().default(""),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const projectSupports = sqliteTable("project_supports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  consumerId: text("consumer_id").notNull(),
  projectId: text("project_id").notNull(),
  points: integer("points").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const incentivePrograms = sqliteTable("incentive_programs", {
  id: text("id").primaryKey(),
  institutionId: text("institution_id").notNull().default("institution-001"),
  name: text("name").notNull(),
  sponsor: text("sponsor").notNull(),
  action: text("action").notNull(),
  reward: text("reward").notNull(),
  budgetPoints: integer("budget_points").notNull(),
  participants: text("participants").notNull(),
  progress: integer("progress").notNull().default(0),
  esg: text("esg").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const resourceOffers = sqliteTable("resource_offers", {
  id: text("id").primaryKey(),
  institutionId: text("institution_id").notNull().default("institution-001"),
  category: text("category").notNull(),
  name: text("name").notNull(),
  requiredPoints: integer("required_points").notNull(),
  term: text("term").notNull(),
  rate: text("rate").notNull(),
  description: text("description").notNull(),
  purpose: text("purpose").notNull(),
  status: text("status").notNull().default("available"),
});

export const resourceRedemptions = sqliteTable("resource_redemptions", {
  id: text("id").primaryKey(),
  institutionId: text("institution_id").notNull().default("institution-001"),
  farmerId: text("farmer_id").notNull(),
  offerId: text("offer_id").notNull(),
  resourceName: text("resource_name").notNull(),
  points: integer("points").notNull(),
  cooperative: text("cooperative").notNull(),
  contactName: text("contact_name").notNull(),
  contactPhone: text("contact_phone").notNull(),
  fulfillmentType: text("fulfillment_type").notNull(),
  deliveryAddress: text("delivery_address").notNull().default(""),
  appointmentDate: text("appointment_date").notNull().default(""),
  appointmentSlot: text("appointment_slot").notNull().default(""),
  note: text("note").notNull().default(""),
  stage: integer("stage").notNull().default(0),
  status: text("status").notNull().default("submitted"),
  trackingNumber: text("tracking_number").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_resource_redemptions_farmer_created").on(table.farmerId, table.createdAt),
  index("idx_resource_redemptions_institution_created").on(table.institutionId, table.createdAt),
]);

export const changeRequests = sqliteTable("change_requests", {
  id: text("id").primaryKey(),
  requestType: text("request_type").notNull(),
  targetId: text("target_id").notNull(),
  requesterId: text("requester_id").notNull(),
  reasonCode: text("reason_code").notNull(),
  reasonDetail: text("reason_detail").notNull().default(""),
  requestedJson: text("requested_json").notNull(),
  status: text("status").notNull().default("pending"),
  reviewerId: text("reviewer_id").notNull().default(""),
  reviewNote: text("review_note").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_change_requests_target_created").on(table.requestType, table.targetId, table.createdAt),
  index("idx_change_requests_status_created").on(table.status, table.createdAt),
  uniqueIndex("idx_change_requests_one_pending").on(table.requestType, table.targetId).where(sql`${table.status} = 'pending'`),
]);

export const localActions = sqliteTable("local_actions", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  organizer: text("organizer").notNull(),
  description: text("description").notNull(),
  rewardPoints: integer("reward_points").notNull(),
  city: text("city").notNull(),
  district: text("district").notNull(),
  address: text("address").notNull().default(""),
  details: text("details").notNull().default(""),
  eventStart: text("event_start").notNull().default(""),
  eventEnd: text("event_end").notNull().default(""),
  distanceKm: real("distance_km").notNull(),
  status: text("status").notNull().default("open"),
});

export const merchantOffers = sqliteTable("merchant_offers", {
  id: text("id").primaryKey(),
  merchant: text("merchant").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requiredPoints: integer("required_points").notNull(),
  city: text("city").notNull(),
  district: text("district").notNull(),
  address: text("address").notNull().default(""),
  details: text("details").notNull().default(""),
  distanceKm: real("distance_km").notNull(),
  status: text("status").notNull().default("active"),
});

export const localActionRegistrations = sqliteTable("local_action_registrations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  consumerId: text("consumer_id").notNull(),
  actionId: text("action_id").notNull(),
  attendeeName: text("attendee_name").notNull().default(""),
  attendeePhone: text("attendee_phone").notNull().default(""),
  attendeeEmail: text("attendee_email").notNull().default(""),
  participantCount: integer("participant_count").notNull().default(1),
  emergencyContactName: text("emergency_contact_name").notNull().default(""),
  emergencyContactPhone: text("emergency_contact_phone").notNull().default(""),
  note: text("note").notNull().default(""),
  status: text("status").notNull().default("registered"),
  registeredAt: text("registered_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("idx_local_action_registration_once").on(table.consumerId, table.actionId)]);

export const evidence = sqliteTable("evidence", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  farmerId: text("farmer_id").notNull(),
  projectId: text("project_id"),
  productId: text("product_id"),
  title: text("title").notNull(),
  evidenceType: text("evidence_type").notNull(),
  fileKey: text("file_key"),
  fileName: text("file_name"),
  contentType: text("content_type"),
  fileSize: integer("file_size"),
  status: text("status").notNull().default("submitted"),
  submittedAt: text("submitted_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  verifiedAt: text("verified_at"),
});

export const outcomeReports = sqliteTable("outcome_reports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  institutionId: text("institution_id").notNull().default("institution-001"),
  projectId: text("project_id").notNull(),
  farmerId: text("farmer_id").notNull(),
  waterLiters: integer("water_liters"),
  carbonKg: integer("carbon_kg"),
  beneficiaries: integer("beneficiaries"),
  note: text("note").notNull(),
  status: text("status").notNull().default("submitted"),
  submittedAt: text("submitted_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  verifiedAt: text("verified_at"),
}, (table) => [index("idx_outcome_reports_institution_submitted").on(table.institutionId, table.submittedAt)]);

export const procurementRequests = sqliteTable("procurement_requests", {
  id: text("id").primaryKey(),
  institutionId: text("institution_id").notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  quantity: integer("quantity").notNull(),
  budgetPoints: integer("budget_points").notNull(),
  deliveryRegion: text("delivery_region").notNull(),
  status: text("status").notNull().default("open"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const integrationSettings = sqliteTable("integration_settings", {
  serviceKey: text("service_key").primaryKey(),
  displayName: text("display_name").notNull(),
  mode: text("mode").notNull().default("simulation"),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  rewardPoints: integer("reward_points").notNull().default(0),
  endpointLabel: text("endpoint_label").notNull(),
  sampleResponseJson: text("sample_response_json").notNull().default("{}"),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const verificationRuns = sqliteTable("verification_runs", {
  id: text("id").primaryKey(),
  serviceKey: text("service_key").notNull(),
  inputJson: text("input_json").notNull().default("{}"),
  responseJson: text("response_json").notNull().default("{}"),
  status: text("status").notNull(),
  rewardPoints: integer("reward_points").notNull().default(0),
  inputFingerprint: text("input_fingerprint"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const accountControls = sqliteTable("account_controls", {
  profileId: text("profile_id").primaryKey(),
  email: text("email").notNull(),
  username: text("username"),
  accountKind: text("account_kind").notNull().default("test"),
  status: text("status").notNull().default("active"),
  passwordHash: text("password_hash"),
  passwordSalt: text("password_salt"),
  authProvider: text("auth_provider").notNull().default("password"),
  providerSubject: text("provider_subject"),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("idx_account_controls_email_unique_schema").on(table.email),
  uniqueIndex("idx_account_controls_username_unique_schema").on(table.username),
  uniqueIndex("idx_account_controls_provider_unique_schema").on(table.authProvider, table.providerSubject),
  index("idx_account_controls_kind_status_schema").on(table.accountKind, table.status),
]);

export const systemParameters = sqliteTable("system_parameters", {
  parameterKey: text("parameter_key").primaryKey(),
  displayName: text("display_name").notNull(),
  value: text("value").notNull(),
  unit: text("unit").notNull().default(""),
  description: text("description").notNull(),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const adminAuditLogs = sqliteTable("admin_audit_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  action: text("action").notNull(),
  targetType: text("target_type").notNull(),
  targetId: text("target_id").notNull(),
  detailJson: text("detail_json").notNull().default("{}"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const dataTemplates = sqliteTable("data_templates", {
  templateKey: text("template_key").primaryKey(),
  displayName: text("display_name").notNull(),
  targetRole: text("target_role").notNull(),
  uploadArea: text("upload_area").notNull(),
  documentType: text("document_type").notNull(),
  fileName: text("file_name").notNull(),
  schemaVersion: text("schema_version").notNull().default("1.0"),
  description: text("description").notNull(),
  sampleDataJson: text("sample_data_json").notNull().default("{}"),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const actionSubmissions = sqliteTable("action_submissions", {
  id: text("id").primaryKey(),
  consumerId: text("consumer_id").notNull(),
  actionType: text("action_type").notNull(),
  title: text("title").notNull(),
  note: text("note").notNull(),
  rewardPoints: integer("reward_points").notNull(),
  fileKey: text("file_key").notNull(),
  fileName: text("file_name").notNull(),
  contentType: text("content_type").notNull(),
  fileSize: integer("file_size").notNull(),
  fileSha256: text("file_sha256"),
  status: text("status").notNull().default("pending"),
  reviewNote: text("review_note"),
  proofViewedAt: text("proof_viewed_at"),
  submittedAt: text("submitted_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  reviewedAt: text("reviewed_at"),
});

export const authSessions = sqliteTable("auth_sessions", {
  token: text("token").primaryKey(),
  csrfToken: text("csrf_token").notNull(),
  profileId: text("profile_id").notNull(),
  role: text("role").notNull(),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const authLoginAttempts = sqliteTable("auth_login_attempts", {
  attemptKey: text("attempt_key").primaryKey(),
  failures: integer("failures").notNull().default(0),
  windowStartedAt: text("window_started_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  blockedUntil: text("blocked_until"),
});

export const oauthStates = sqliteTable("oauth_states", {
  stateHash: text("state_hash").primaryKey(),
  role: text("role").notNull(),
  codeVerifier: text("code_verifier").notNull(),
  redirectUri: text("redirect_uri").notNull(),
  attemptKey: text("attempt_key").notNull().default(""),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_oauth_states_expiry_schema").on(table.expiresAt),
  index("idx_oauth_states_attempt_created_schema").on(table.attemptKey, table.createdAt),
]);
