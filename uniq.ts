async function main() {
  const file = Bun.file("duelarena.json");
  const data: Peer[] = await file.json();
  const uniquePeers = new Set(data.map((peer) => peer.id));
  console.log(uniquePeers.size);

  let dat: { address: string; positions: number; uniquePositions: number }[] =
    [];

  // for each peer, get the number of unique positions per peer
  for (const peer of uniquePeers) {
    const positions = data.filter((p) => p.id === peer);
    if (positions.length < 10) continue;
    const uniquePositions = new Set(positions.map((p) => p.position.join(",")));
    dat.push({
      address: peer,
      positions: positions.length,
      uniquePositions: uniquePositions.size,
    });
  }
  console.log(dat.length);
  
  // calculate percentage of unique positions per peer
  const percentage = dat
    .filter((a) => a.positions > 10)
    .map((peer) => {
      return {
        address: peer.address,
        percentage: (peer.uniquePositions / peer.positions) * 100,
        positions: peer.positions,
        uniquePositions: peer.uniquePositions,
        totalTimeInMinutes:
          calculateTimeOnParcel(data.filter((p) => p.id === peer.address)) /
          60_000,
      };
    });
  percentage.sort((a, b) => a.uniquePositions - b.uniquePositions);
  //percentage.sort((a, b) => a.percentage - b.percentage);
  //console.log(percentage.slice(0, 10));

  return;

  // calculate time on parcel for each peer
  const uniquePeersArray = Array.from(uniquePeers);
  const timeOnParcel: [string, number][] = uniquePeersArray.map((peerId) => {
    return [
      peerId,
      calculateTimeOnParcel(data.filter((peer) => peer.id === peerId)),
    ];
  });
  console.log(timeOnParcel.length);

  // remove peers that have been on the parcel for less than 2 minutes
  const filteredPeers = timeOnParcel.filter((peer) => peer[1] > 120_000);
  console.log(filteredPeers.length);
  filteredPeers.sort((a, b) => b[1] - a[1]);
  console.log(filteredPeers.slice(0, 10));
  /*   // Calculate how long peers have been active by using the timestamp difference between two appearances
  const counts = data.reduce((acc: any, peer) => {
    acc[peer.id] = (acc[peer.id] || 0) + 1;
    return acc;
  }, {});
  console.log(counts); */
}
main();

interface Island {
  id: string;
  maxPeers: number;
  center: [number, number, number];
  radius: number;
  peers: {}[];
}

interface Peer {
  id: string;
  address: string;
  lastPing: number;
  parcel: [number, number];
  position: [number, number, number];
  timestamp: number;
}

function calculateTimeOnParcel(data: Peer[]) {
  let lastPing = 0;
  let totalTime = 0;
  for (const peer of data) {
    if (lastPing === 0) lastPing = peer.lastPing;
    else {
      if (peer.lastPing - lastPing > 60_000 * 5) {
        lastPing === 0;
        continue;
      }
      totalTime += peer.lastPing - lastPing;
      lastPing = peer.lastPing;
    }
  }
  return totalTime;
}
