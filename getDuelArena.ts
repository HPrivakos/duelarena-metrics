async function main() {
  let date = new Date("2024-01-01");
  const duelarena: Peer[] = [];
  while (date <= new Date()) {
    const file = Bun.file(`archives/${date.toISOString().split("T")[0]}.json`);
    if (await file.exists()) {
      console.log(date.toISOString().split("T")[0]);
    } else {
      console.log("File not found", date.toISOString().split("T")[0]);
      date.setTime(date.getTime() + 86400000);
      continue;
    }
    const data = await file.text();
    for (const line of data.split("\n")) {
      if (!line) continue;
      const l = await JSON.parse(line);
      if (!l.islands) continue;
      if (l.islands.length === 0) continue;
      for (const island of l.islands) {
        for (const peer of island.peers) {
          if (
            peer.parcel[0] >= 96 &&
            peer.parcel[0] <= 100 &&
            peer.parcel[1] <= -113 &&
            peer.parcel[1] >= -116
          ) {
            if (peer.parcel[0] === 96 && peer.parcel[1] === -116) continue;
            peer.timestamp = l.timestamp;
            duelarena.push(peer);
          }
        }
      }
    }

    date.setTime(date.getTime() + 86400000);
  }
  await Bun.write(
    "duelarena-jan1-april30.json",
    JSON.stringify(
      duelarena.filter((peer) => peer.timestamp <= +new Date("2024-04-30"))
    )
  );
  await Bun.write(
    "duelarena-jan25-april30.json",
    JSON.stringify(
      duelarena.filter(
        (peer) =>
          peer.timestamp >= +new Date("2024-01-25") &&
          peer.timestamp <= +new Date("2024-04-30")
      )
    )
  );
  await Bun.write(
    "duelarena-jan25-june10.json",
    JSON.stringify(
      duelarena.filter(
        (peer) =>
          peer.timestamp >= +new Date("2024-01-25") &&
          peer.timestamp <= +new Date("2024-06-10")
      )
    )
  );
  await Bun.write("duelarena-jan1-june10.json", JSON.stringify(duelarena));
}
main();

interface Peer {
  id: string;
  address: string;
  lastPing: number;
  parcel: [number, number];
  position: [number, number, number];
  timestamp: number;
}
