import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
async function run() {
  const { TinyFishService } = await import('./src/services/tinyfishService.js');
  const result = await TinyFishService.search("software engineering internship 2026 India");
  console.log("TinyFish Results Count:", result.length);
  if (result.length > 0) {
    console.log("Response received: YES");
    console.log("Usable result: YES");
  } else {
    console.log("Response received: YES (but empty/failed)");
    console.log("Usable result: NO");
  }
}
run();
