import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.auditLog.deleteMany();
  await prisma.reportHistory.deleteMany();
  await prisma.reportSchedule.deleteMany();
  await prisma.filterPreset.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.integration.deleteMany();
  await prisma.testRun.deleteMany();
  await prisma.bug.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
  await prisma.team.deleteMany();
  await prisma.department.deleteMany();
  await prisma.role.deleteMany();

  // ---- Seed RBAC ----
  const adminRole = await prisma.role.create({ data: { name: "Admin", description: "Full access" } });
  const qaLeadRole = await prisma.role.create({ data: { name: "QA Lead", description: "Manage projects and bugs" } });
  const testerRole = await prisma.role.create({ data: { name: "Tester", description: "Execute tests and log bugs" } });
  const viewerRole = await prisma.role.create({ data: { name: "Viewer", description: "Read-only access" } });

  const engineeringDept = await prisma.department.create({ data: { name: "Engineering", description: "Software Engineering" } });
  const qaDept = await prisma.department.create({ data: { name: "Quality Assurance", description: "QA and Testing" } });

  const mobileTeam = await prisma.team.create({ data: { name: "Mobile Automation", departmentId: qaDept.id } });
  const webTeam = await prisma.team.create({ data: { name: "Web Automation", departmentId: qaDept.id } });
  const backendTeam = await prisma.team.create({ data: { name: "Backend APIs", departmentId: engineeringDept.id } });

  // ---- Seed Users ----
  const hashedPassword = await bcrypt.hash("password123", 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@company.com",
        password: hashedPassword,
        roleId: adminRole.id,
        departmentId: engineeringDept.id,
      },
    }),
    prisma.user.create({
      data: {
        name: "Gautam Kochar",
        email: "gautam.kochar@company.com",
        password: hashedPassword,
        roleId: qaLeadRole.id,
        departmentId: qaDept.id,
        teamId: mobileTeam.id,
      },
    }),
    prisma.user.create({
      data: {
        name: "Mohit Sharma",
        email: "mohit.sharma@company.com",
        password: hashedPassword,
        roleId: testerRole.id,
        departmentId: qaDept.id,
        teamId: webTeam.id,
      },
    }),
    prisma.user.create({
      data: {
        name: "Rahul Singh",
        email: "rahul.singh@company.com",
        password: hashedPassword,
        roleId: viewerRole.id,
        departmentId: engineeringDept.id,
        teamId: backendTeam.id,
      },
    }),
    prisma.user.create({
      data: {
        name: "Priya Desai",
        email: "priya.desai@company.com",
        password: hashedPassword,
        roleId: testerRole.id,
        departmentId: qaDept.id,
        teamId: mobileTeam.id,
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // ---- Seed Projects ----
  const projectNames = [
    "QA Dashboard",
    "Mobile Automation",
    "Web Automation",
    "API Testing",
    "Regression Suite",
  ];

  const suiteNames = [
    "Smoke Tests",
    "Regression Suite",
    "API Integration",
    "E2E Flow",
    "Performance",
    "Security Scan",
  ];

  const environments = ["Production", "Staging", "QA", "Dev"];
  const statuses = ["passed", "failed", "running"];
  const severities = ["Critical", "High", "Medium", "Low"];
  const bugStatuses = ["Open", "In Progress", "Closed"];
  const modules = [
    "Homepage",
    "Search",
    "Compare",
    "Car Details",
    "Dealer",
    "Finance",
    "User Auth",
    "API",
  ];

  for (const name of projectNames) {
    const project = await prisma.project.create({
      data: {
        name,
        description: `${name} Project`,
        status: Math.random() > 0.15 ? "Active" : "Inactive",
      },
    });

    // Create Test Runs (more data for better analytics)
    for (let i = 0; i < 12; i++) {
      const total = Math.floor(Math.random() * 200) + 50;
      const failed = Math.floor(Math.random() * 25);
      const skipped = Math.floor(Math.random() * 10);
      const passed = total - failed - skipped;
      const status =
        failed > 10
          ? "failed"
          : Math.random() > 0.9
            ? "running"
            : "passed";

      await prisma.testRun.create({
        data: {
          projectId: project.id,
          suiteName:
            suiteNames[
              Math.floor(Math.random() * suiteNames.length)
            ],
          environment:
            environments[
              Math.floor(Math.random() * environments.length)
            ],
          status,
          total,
          passed,
          failed,
          skipped,
          duration: Math.floor(Math.random() * 2700) + 60, // 1-45 minutes in seconds
          executionDate: new Date(
            2026,
            Math.floor(i / 2),
            Math.floor(Math.random() * 28) + 1
          ),
        },
      });
    }

    // Create Bugs (more data)
    for (let i = 0; i < 15; i++) {
      const assignee =
        users[Math.floor(Math.random() * users.length)];

      await prisma.bug.create({
        data: {
          title: `[${name}] Bug ${i + 1} - ${modules[Math.floor(Math.random() * modules.length)]} issue`,
          description: `Detailed description of bug ${i + 1} in ${name}`,
          severity:
            severities[
              Math.floor(Math.random() * severities.length)
            ],
          status:
            bugStatuses[
              Math.floor(Math.random() * bugStatuses.length)
            ],
          module:
            modules[
              Math.floor(Math.random() * modules.length)
            ],
          projectId: project.id,
          assigneeId: assignee.id,
        },
      });
    }
  }

  console.log("✅ Database seeded successfully.");
  console.log("📋 Default login: admin@company.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
