export class PhysicsEngine {
  static Type = {
    RigidBody: "RigidBody",
  };
  constructor(engineType, engineParams) {
    this.Type = engineType;
    this.gravity = 10; // m/s^2
    this.enableFriction = true;
    this.frictionForce = 10; // F = m (kg) * a (m/s^2)
  }

  /**
   * Determine the position for the object based on current position, velocity and acceleration
   * @param {*} obj Character object
   * @param {*} delta time since last tick
   * @param {*} elapsed time since the begining
   */
  nextPosition(obj, delta, elapsed) {
    // Objects are affected by gravity
    // v(t) = v0 - gt
    // y(t) = v0 * t + y0 - 1/2 * g * t^2

    let position = obj.position;
    let x0 = position.x;
    let y0 = position.y;

    let y1 = y0 + (1 / 2) * this.gravity * (delta ^ 2);
    let x1 = position.x + obj.vx;
    return { x: x1, y: y1 };
  }
  detectCollision(objA, objB) {
    objALeftTopVertex = { x: objA.position.x, y: objA.position.y };
    objALeftBottomVertex = {
      x: objA.position.x,
      y: objA.position.y + objA.height,
    };
    objARightTopVertex = {
      x: objA.position.x + objA.width,
      y: objA.position.y,
    };
    objARightBottomVertex = {
      x: objA.position.x + objA.width,
      y: objA.position.y + objA.height,
    };

    objBLeftTopVertex = { x: objB.position.x, y: objB.position.y };
    objBLeftBottomVertex = {
      x: objB.position.x,
      y: objB.position.y + objB.height,
    };
    objBRightTopVertex = {
      x: objB.position.x + objB.width,
      y: objB.position.y,
    };
    ob21RightBottomVertex = {
      x: objB.position.x + objB.width,
      y: objB.position.y + objB.height,
    };

    // Assuming ObjA is impacting ObjB
    // Check collision from the left
    if((objARightTopVertex >= objBLeftTopVertex || objARightTopVertex >= objBLeftBottomVertex ||
      objARightBottomVertex >= objBLeftTopVertex || objARightBottomVertex >= objBLeftBottomVertex) && (true)) {
        // pending check if its not completly to the right
        return true;
      }
    // Check collision from the right
    // Check collision from the top
    // Check collision from the bottom

  }
  resolveCollision() {}
}
