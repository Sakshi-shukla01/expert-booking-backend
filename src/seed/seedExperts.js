import "dotenv/config";
import { connectDB } from "../config/db.js";
import { Expert } from "../models/Expert.js";

async function seed() {
  await connectDB(process.env.MONGO_URI);

  await Expert.deleteMany();

  await Expert.insertMany([
    { name: "Ankit Sharma", category: "Career", experienceYears: 6, rating: 4.7, bio: "Career guidance & interview prep." },
    { name: "Neha Verma", category: "Fitness", experienceYears: 4, rating: 4.5, bio: "Workout plans & nutrition basics." },
    { name: "Rohit Jain", category: "Finance", experienceYears: 8, rating: 4.8, bio: "Personal finance & investing." },
    { name: "Pooja Singh", category: "Mental Health", experienceYears: 5, rating: 4.6, bio: "Stress management sessions." }
  ]);

  console.log("✅ Experts seeded");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});