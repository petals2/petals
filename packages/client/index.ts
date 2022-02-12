import { Client } from "./src/client";

async function main() {
  const roobscoob = await Client.login("MINECRAFTER200", process.env.PASS!);

  const p = await roobscoob.findProject(625073877);

  
}

main();
