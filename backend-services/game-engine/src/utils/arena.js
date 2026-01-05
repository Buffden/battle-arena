const path = require('path');
const fs = require('fs');

const arenaPath = path.resolve(
  __dirname,
  '../../../../frontend-service/src/assets/arenas/arena-hills-v1.json'
);

function loadArenaDataFresh() {
  try {
    const raw = fs.readFileSync(arenaPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to load arena definition; using defaults', err);
    return {
      worldBounds: { x: 0, y: 0, width: 800, height: 600 },
      walkableZones: []
    };
  }
}

function getPolygons() {
  const arenaData = loadArenaDataFresh();
  const zones = Array.isArray(arenaData.walkableZones) ? arenaData.walkableZones : [];
  const leftWalkableZone = zones.find(z => z.id === 'left-walkable-zone') || zones[0] || null;
  const rightWalkableZone = zones.find(z => z.id === 'right-walkable-zone') || zones[1] || null;
  const mainWalkablePolygon = leftWalkableZone?.polygon || zones[0]?.polygon || [];
  const leftWalkablePolygon = leftWalkableZone?.polygon || [];
  const rightWalkablePolygon = rightWalkableZone?.polygon || [];

  return {
    arenaData,
    mainWalkablePolygon,
    leftWalkablePolygon,
    rightWalkablePolygon
  };
}

function polygonCentroid(points) {
  if (!points.length) return { x: 0, y: 0 };
  let area = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    const cross = p1.x * p2.y - p2.x * p1.y;
    area += cross;
    cx += (p1.x + p2.x) * cross;
    cy += (p1.y + p2.y) * cross;
  }
  area *= 0.5;
  if (area === 0) {
    // Degenerate; fallback to average
    const avgX = points.reduce((s, p) => s + p.x, 0) / points.length;
    const avgY = points.reduce((s, p) => s + p.y, 0) / points.length;
    return { x: avgX, y: avgY };
  }
  cx /= 6 * area;
  cy /= 6 * area;
  return { x: cx, y: cy };
}

function pointInPolygon(points, x, y) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const xi = points[i].x;
    const yi = points[i].y;
    const xj = points[j].x;
    const yj = points[j].y;
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function boundingBox(points) {
  if (!points.length) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  let minX = points[0].x;
  let maxX = points[0].x;
  let minY = points[0].y;
  let maxY = points[0].y;
  for (const p of points) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }
  return { minX, maxX, minY, maxY };
}

function adjustIntoPolygon(target, polygon, centroid) {
  if (pointInPolygon(polygon, target.x, target.y)) return target;
  let x = target.x;
  let y = target.y;
  for (let i = 0; i < 12; i++) {
    x = (x + centroid.x) * 0.5;
    y = (y + centroid.y) * 0.5;
    if (pointInPolygon(polygon, x, y)) return { x, y };
  }
  return { x: centroid.x, y: centroid.y };
}

function findSpawnPositionsForSides({ arenaData, leftPolygon, rightPolygon }) {
  const configuredSpawnPositions = arenaData?.spawnPositions;
  if (configuredSpawnPositions?.player1 && configuredSpawnPositions?.player2) {
    const p1 = configuredSpawnPositions.player1;
    const p2 = configuredSpawnPositions.player2;

    const player1 = leftPolygon?.length
      ? adjustIntoPolygon(p1, leftPolygon, polygonCentroid(leftPolygon))
      : p1;
    const player2 = rightPolygon?.length
      ? adjustIntoPolygon(p2, rightPolygon, polygonCentroid(rightPolygon))
      : p2;

    return { player1, player2 };
  }

  const fallback = { x: 100, y: 500 };

  const spawnForPoly = polygon => {
    if (!polygon || polygon.length === 0) {
      return {
        left: fallback,
        right: { x: 700, y: 500 }
      };
    }
    const centroid = polygonCentroid(polygon);
    const box = boundingBox(polygon);
    const width = box.maxX - box.minX;
    const offset = Math.max(20, width * 0.12);
    const centerY = (box.minY + box.maxY) * 0.5;
    const leftTarget = { x: box.minX + offset, y: centerY };
    const rightTarget = { x: box.maxX - offset, y: centerY };
    return {
      left: adjustIntoPolygon(leftTarget, polygon, centroid),
      right: adjustIntoPolygon(rightTarget, polygon, centroid)
    };
  };

  const leftSpawn = spawnForPoly(leftPolygon).left;
  const rightSpawn = spawnForPoly(rightPolygon).right;

  return {
    player1: leftSpawn,
    player2: rightSpawn
  };
}

function getClosestEdgeDir(polygon, x, y) {
  if (!polygon.length) return null;
  let closestDist = Infinity;
  let edgeDir = null;
  for (let i = 0; i < polygon.length; i++) {
    const p1 = polygon[i];
    const p2 = polygon[(i + 1) % polygon.length];
    const mx = (p1.x + p2.x) * 0.5;
    const my = (p1.y + p2.y) * 0.5;
    const dist = Math.hypot(x - mx, y - my);
    if (dist < closestDist) {
      closestDist = dist;
      edgeDir = { x: p2.x - p1.x, y: p2.y - p1.y };
    }
  }
  return edgeDir;
}

function projectVector(vx, vy, tx, ty) {
  const lenSq = tx * tx + ty * ty;
  if (lenSq === 0) return { x: 0, y: 0 };
  const scale = (vx * tx + vy * ty) / lenSq;
  return { x: tx * scale, y: ty * scale };
}

function slideWithinPolygon(from, moveX, moveY, polygon) {
  const target = { x: from.x + moveX, y: from.y + moveY };
  if (pointInPolygon(polygon, target.x, target.y)) {
    return target;
  }
  const edgeDir = getClosestEdgeDir(polygon, from.x, from.y);
  if (!edgeDir) return null;
  const projected = projectVector(moveX, moveY, edgeDir.x, edgeDir.y);
  const slide = { x: from.x + projected.x, y: from.y + projected.y };
  if (pointInPolygon(polygon, slide.x, slide.y)) {
    return slide;
  }
  return null;
}

module.exports = {
  loadArenaDataFresh,
  getPolygons,
  pointInPolygon,
  projectVector,
  getClosestEdgeDir,
  slideWithinPolygon,
  findSpawnPositionsForSides,
  polygonCentroid
};
