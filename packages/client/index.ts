import { Client } from "./src/client";
import { SiteProject } from "./src/client/project";
import { CloudSession } from "./src/client/project/cloudSession";

const to = 1000;
let s: number;

async function run(p: SiteProject, c: number, t: number) {
  console.log("Running", { c, t });
  let a: CloudSession[] = [];

  for (let i = 0; i < c; i++) {
    a.push(p.createCloudSession());
    await a[i].connect();
  }

  let j = 0;

  const ints: NodeJS.Timeout[] = [];

  console.time("Count to " + to)
  s = Date.now();
  for (let i = 0; i < c; i++) {
    const v = a[i].getVariable("c");

    if (v == undefined) throw new Error("Missing c var!");

    setTimeout(() => {
      console.log("Spawning", { i });
      ints.push(setInterval(() => {
        v.set(j++);

        if (j > to) {
          ints.forEach(clearInterval);
          a.forEach(e => e.destroy())
          return;
        }
      }, t))
    }, (t / c) * i);
  }
}

async function watch(p: SiteProject, po: SiteProject, c: number, t: number) {
  const self = p.createCloudSession();
  await self.connect();

  let b: (string | number)[] = [];

  const v = self.getVariable("c");

  v!.addUpdateListener(d => {
    b.push(d);

    if (b.length === to + 1) {
      // do compare
      let inOrder: number = 0;
      let outOfOrder: number = 0;

      for (let i = 0; i < b.length; i++) {
        const e = b[i];
        if (e == i) {
          inOrder++
        } else {
          outOfOrder++;
        };
      }

      console.log();
      console.log("c:", c);
      console.log({ inOrder: inOrder, outOfOrder: outOfOrder });
      console.log("Bytes per second (in order): " + (102 * inOrder) / ((Date.now() - s) / 1000))
      console.log("Bytes per second (total): " + (102 * (inOrder + outOfOrder)) / ((Date.now() - s) / 1000))
      console.timeEnd("Count to " + to);

      b = [];

      run(po, c++, t);
    }
  })

  run(po, c++, t);
}

async function main() {
  console.log("Start");
  const roobscoob = await Client.login("MINECRAFTER200", process.env.PASS!);
  console.log("MINECRAFTER200 logged in");
  const edward = await Client.login("suretide", "Ozone321");
  console.log("suretide logged in");

  const mc200rb = (await roobscoob.findProject(642727415))!;
  console.log("MINECRAFTER200 project found");
  const mc200ed = (await edward.findProject(642727415))!;
  console.log("suretide project found");

  watch(mc200ed, mc200rb, 5, 100);
}

main();
