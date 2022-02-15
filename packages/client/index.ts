import { Client } from "./src/client";

async function main() {
  const roobscoob = await Client.login("MINECRAFTER200", process.env.PASS!);
  const project = (await roobscoob.findProject(606803064))!;

  for await (const content of project.comments()) {
    console.log(content.getContent());
    console.log(await content.delete());
  }
}

main();
