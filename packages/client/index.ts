import { Client } from "./src/client";

async function main() {
  const roobscoob = await Client.login("MINECRAFTER200", process.env.PASS!);

  const loaded = await roobscoob.findProject(678512904)

  const Example = loaded?.createCloudSession().getVariable("Example");

  Example?.addUpdateListener((val) => {
    if (val == 3) {
      Example.set(4);
    }
  })
}

main();
