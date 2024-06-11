async function main() {
  for (const fileName of [
    "duelarena-jan1-april30.json",
    "duelarena-jan25-april30.json",
    "duelarena-jan25-june10.json",
    "duelarena-jan1-june10.json",
  ]) {
    const file = Bun.file(fileName);
    const data: Peer[] = await file.json();
    const uniquePeers = getUniquePeers(data);
    console.log(fileName);
    console.log("Total users during that period: ", uniquePeers.size);
    const returningUsers = getReturningUsers(
      data,
      new Date("2024-01-01"),
      new Date("2024-06-11")
    );
    console.log(
      "Numbers of users that visited the land at least twice in that timeframe: ",
      Object.entries(returningUsers).filter(([_, v]) => v >= 2).length
    );
    console.log("");
    console.log("--------------------");
    console.log("");
    
  }
}
main();

function getUniquePeers(data: Peer[]): Set<string> {
  return new Set(data.map((peer) => peer.id));
}

function getReturningUsers(data: Peer[], startDate: Date, endDate: Date) {
  const users: { [address: string]: number } = {};
  let date = new Date(startDate);
  while (date <= endDate) {
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
      users[peer] = (users[peer] || 0) + 1;
    });
    date.setTime(date.getTime() + 86400000);
  }
  return users;
}

interface Peer {
  id: string;
  address: string;
  lastPing: number;
  parcel: [number, number];
  position: [number, number, number];
  timestamp: number;
}
