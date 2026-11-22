import { MongoClient } from "mongodb";

const DB_NAME = "fix-mate";
const COLLECTION = "services";

// Sample service matching the shape written by POST /services in a9_server.
// Override any value with an env var, e.g. TECHNICIAN_EMAIL=me@example.com npm run seed:service
const service = {
  title: process.env.SERVICE_TITLE || "Smartphone Screen Replacement",
  category: process.env.SERVICE_CATEGORY || "Smartphone",
  description:
    process.env.SERVICE_DESCRIPTION ||
    "Professional smartphone screen replacement using quality parts. Includes a free diagnostic check and a 30-day workmanship warranty.",
  image: process.env.SERVICE_IMAGE || "",
  basePrice: Number(process.env.SERVICE_PRICE || 45),
  estimatedDuration: process.env.SERVICE_DURATION || "1 to 2 hours",
  serviceMode: process.env.SERVICE_MODE || "Home Visit",
  serviceArea: process.env.SERVICE_AREA || "Dhaka",
  technicianName: process.env.TECHNICIAN_NAME || "technician",
  technicianEmail: process.env.TECHNICIAN_EMAIL || "testtechnician@gmail.com",
  approvalStatus: process.env.APPROVAL_STATUS || "approved",
  isAvailable: true,
  createdAt: new Date(),
};

if (!process.env.DB_URL) {
  console.error("DB_URL is missing. Run with: npm run seed:service");
  process.exit(1);
}

const client = new MongoClient(process.env.DB_URL);

try {
  await client.connect();
  const services = client.db(DB_NAME).collection(COLLECTION);

  // Idempotent: don't insert the same service twice for the same technician.
  const existing = await services.findOne({
    title: service.title,
    technicianEmail: service.technicianEmail,
  });

  if (existing) {
    console.log(`Service already exists (${existing._id}); nothing inserted.`);
  } else {
    const result = await services.insertOne(service);
    console.log(`Inserted service "${service.title}" with _id ${result.insertedId}`);
  }
} catch (error) {
  console.error("Seed failed:", error.message);
  process.exitCode = 1;
} finally {
  await client.close();
}
