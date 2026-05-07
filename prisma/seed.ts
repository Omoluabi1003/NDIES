import { PrismaClient } from "@prisma/client";
import { profiles, programs } from "../src/lib/sample-data";

const prisma = new PrismaClient();

function withoutId<T extends { id: string }>(record: T) {
  const data: Omit<T, "id"> & { id?: string } = { ...record };
  delete data.id;
  return data;
}

async function main() {
  await prisma.aIClassificationLog.deleteMany();
  await prisma.consentRecord.deleteMany();
  await prisma.engagementProgram.deleteMany();
  await prisma.diasporaOrganization.deleteMany();
  await prisma.diasporaProfile.deleteMany();
  await prisma.diasporaProfile.createMany({ data: profiles.map(withoutId) });
  await prisma.engagementProgram.createMany({ data: programs.map(withoutId) });
  await prisma.diasporaOrganization.createMany({
    data: [
      { name: "Nigerian Physicians Forum Houston", country: "United States", city: "Houston", sectorFocus: "Healthcare", contactEmail: "programs@example.org", website: "https://example.org", latitude: 29.7604, longitude: -95.3698 },
      { name: "UK Nigeria Tech & Policy Network", country: "United Kingdom", city: "London", sectorFocus: "Technology/Public Policy", contactEmail: "secretariat@example.org", website: "https://example.org", latitude: 51.5072, longitude: -0.1276 },
      { name: "Canada-Nigeria Innovation Council", country: "Canada", city: "Toronto", sectorFocus: "Technology/Finance", contactEmail: "partnerships@example.org", website: "https://example.org", latitude: 43.6532, longitude: -79.3832 },
      { name: "Nigerian Professionals Germany", country: "Germany", city: "Berlin", sectorFocus: "Academia/Engineering", contactEmail: "info@example.org", website: "https://example.org", latitude: 52.52, longitude: 13.405 },
      { name: "Nigerian Business Forum UAE", country: "UAE", city: "Dubai", sectorFocus: "Finance/Entrepreneurship", contactEmail: "connect@example.org", website: "https://example.org", latitude: 25.2048, longitude: 55.2708 },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seeded NDIES baseline data");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
