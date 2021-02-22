import {RectangleT} from './models/rectangle';

type Point = [number, number];

export const hasIntersection = (a: RectangleT) => (b: RectangleT) => {
  if (distSqr(a.center, b.center) > (a.outerR + b.outerR) ** 2) {
    return false;
  }

  const aSegments = getRectSegments(a);
  const bSegments = getRectSegments(b);

  return (
    b.crtPoints.some(doesRectIncludePoint(aSegments)) ||
    a.crtPoints.some(doesRectIncludePoint(bSegments)) ||
    aSegments.some(segment =>
      bSegments.some(doSegmentsHaveIntersection(segment))
    )
  );
};

const distSqr = (a: Point, b: Point) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;

// even-odd
const doesRectIncludePoint = (segments: [Point, Point][]) => ([x, y]: Point) =>
  segments.reduce(
    (res, [a, b]) =>
      a[1] > y !== b[1] > y &&
      x < a[0] + ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1])
        ? !res
        : res,
    false
  );

const isOnSegment = (a: Point, b: Point, c: Point) =>
  b[0] <= Math.max(a[0], c[0]) &&
  b[0] >= Math.min(a[0], c[0]) &&
  b[1] <= Math.max(a[1], c[1]) &&
  b[1] >= Math.min(a[1], c[1]);

const orientation = (a: Point, b: Point, c: Point) => {
  const x = (b[1] - a[1]) * (c[0] - b[0]) - (b[0] - a[0]) * (c[1] - b[1]);

  if (x > 0) {
    return 1;
  }

  if (x < 0) {
    return -1;
  }

  return 0;
};

const doSegmentsHaveIntersection = ([a, b]: [Point, Point]) => ([c, d]: [
  Point,
  Point
]) => {
  const orientations = [
    orientation(a, b, c),
    orientation(a, b, d),
    orientation(c, d, a),
    orientation(c, d, b),
  ];

  if (
    orientations[0] !== orientations[1] &&
    orientations[2] !== orientations[3]
  ) {
    return true;
  }

  return (
    (orientations[0] === 0 && isOnSegment(a, c, b)) ||
    (orientations[1] === 0 && isOnSegment(a, d, b)) ||
    (orientations[2] === 0 && isOnSegment(c, a, d)) ||
    (orientations[3] === 0 && isOnSegment(c, b, d))
  );
};

const getRectSegments = (rect: RectangleT) =>
  rect.crtPoints.map(
    (x, i) =>
      [
        x,
        rect.crtPoints[(rect.crtPoints.length + i - 1) % rect.crtPoints.length],
      ] as [Point, Point]
  );
