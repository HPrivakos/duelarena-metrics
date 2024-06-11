async function main() {
  const file = Bun.file("duelarena-jan25-april30.json");
  const data: Peer[] = await file.json();
  const uniquePeers = new Set(data.map((peer) => peer.id));
  const days: {[address:string]: number} = {}
    let date = new Date("2024-01-25");
  while (date <= new Date("2024-05-01")) {
    const set = new Set(
      data
        .filter(
          (peer) =>
            new Date(peer.timestamp).getUTCDate() == date.getUTCDate() &&
            new Date(peer.timestamp).getUTCMonth() == date.getUTCMonth()
        )
        .map((peer) => peer.id)
    );
    set.forEach((peer) => {
      days[peer] = (days[peer] || 0) + 1;
    })
    date.setTime(date.getTime() + 86400000);
  }
  console.log("Total users between 2024-01-25 and 2024-05-01: ", uniquePeers.size);
  console.log(
    "Numbers of users that visited the land at least twice in that timeframe: ",
    Object.entries(days).filter(([_, v]) => v >= 2).length
  );  
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