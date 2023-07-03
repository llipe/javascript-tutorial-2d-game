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
  detectCollision(objA, objB, callbackFunction = null) {
    let hResult = this.horizontalCollisionDetection(objA, objB);
    let vResult = this.verticalCollisionDetection(objA, objB);
    let result = hResult && vResult;
    if (callbackFunction == null) {
      return result;
    } else {
      return callbackFunction(result);
    }
  }
  /**
   * Detects collisions comparing with other objects only on the x axis
   * @param {*} objA Character or Platform object
   * @param {*} objB Character or Platform object
   * @param {*} callbackFunction optional callback function with boolean result parameter
   * @returns when the callback is not set, returns if true objA and objB are colliding
   */
  horizontalCollisionDetection(objA, objB, callbackFunction = null) {
    let objALeftTopVertex = { x: objA.position.x, y: objA.position.y };
    let objALeftBottomVertex = {
      x: objA.position.x,
      y: objA.position.y + objA.height,
    };
    let objARightTopVertex = {
      x: objA.position.x + objA.width,
      y: objA.position.y,
    };
    let objARightBottomVertex = {
      x: objA.position.x + objA.width,
      y: objA.position.y + objA.height,
    };

    let objBLeftTopVertex = { x: objB.position.x, y: objB.position.y };
    let objBLeftBottomVertex = {
      x: objB.position.x,
      y: objB.position.y + objB.height,
    };
    let objBRightTopVertex = {
      x: objB.position.x + objB.width,
      y: objB.position.y,
    };
    let objBRightBottomVertex = {
      x: objB.position.x + objB.width,
      y: objB.position.y + objB.height,
    };

    // Assuming ObjA is impacting ObjB
    let result = false;
    // Check collision from the left & right. Checking only x axis.
    if (
      (objARightTopVertex.x >= objBLeftTopVertex.x ||
        objARightTopVertex.x >= objBLeftBottomVertex.x ||
        objARightBottomVertex.x >= objBLeftTopVertex.x ||
        objARightBottomVertex.x >= objBLeftBottomVertex.x) &&
      (objALeftTopVertex.x <= objBRightTopVertex.x ||
        objALeftTopVertex.x <= objBRightBottomVertex.x ||
        objALeftBottomVertex.x <= objBRightTopVertex.x ||
        objALeftBottomVertex.x <= objBRightBottomVertex.x)
    ) {
      result = true;
    }

    if (callbackFunction == null) {
      return result;
    } else {
      return callbackFunction(result);
    }
  }
  /**
   * Detects collisions comparing with other objects only on the y axis
   * @param {*} objA Character or Platform object
   * @param {*} objB Character or Platform object
   * @param {*} callbackFunction optional callback function with boolean result parameter
   * @returns when the callback is not set, returns if true objA and objB are colliding
   */
  verticalCollisionDetection(objA, objB, callbackFunction = null) {
    let objALeftTopVertex = { x: objA.position.x, y: objA.position.y };
    let objALeftBottomVertex = {
      x: objA.position.x,
      y: objA.position.y + objA.height,
    };
    let objARightTopVertex = {
      x: objA.position.x + objA.width,
      y: objA.position.y,
    };
    let objARightBottomVertex = {
      x: objA.position.x + objA.width,
      y: objA.position.y + objA.height,
    };

    let objBLeftTopVertex = { x: objB.position.x, y: objB.position.y };
    let objBLeftBottomVertex = {
      x: objB.position.x,
      y: objB.position.y + objB.height,
    };
    let objBRightTopVertex = {
      x: objB.position.x + objB.width,
      y: objB.position.y,
    };
    let objBRightBottomVertex = {
      x: objB.position.x + objB.width,
      y: objB.position.y + objB.height,
    };

    // Assuming ObjA is impacting ObjB
    let result = false;
    // Check collision from the top & bottom. Checking only y axis.
    if (
      (objALeftBottomVertex.y >= objBLeftTopVertex.y ||
        objALeftBottomVertex.y >= objBRightTopVertex.y ||
        objARightBottomVertex.y >= objBLeftTopVertex.y ||
        objARightBottomVertex.y >= objBRightTopVertex.y) &&
      (objALeftTopVertex.y <= objBLeftBottomVertex.y ||
        objALeftTopVertex.y <= objBRightBottomVertex.y ||
        objARightTopVertex.y <= objBRightTopVertex.y ||
        objARightTopVertex.y <= objBRightBottomVertex.y)
    ) {
      result = true;
    }

    if (callbackFunction == null) {
      return result;
    } else {
      return callbackFunction(result);
    }
  }
  /**
   * Suggest a new position for A that resolves the collission
   * @param {*} objA
   * @param {*} objB
   * @returns the position point for A that resolves the collision
   */
  resolveCollision(objA, objB) {
    let output = { x: 0, y: 0 };
    let objAMiddlePoint = {
      x: (objA.position.x + objA.position.x + objA.width) / 2,
      y: (objA.position.y + objA.position.y + objA.height) / 2,
    };
    let objBMiddlePoint = {
      x: (objB.position.x + objB.position.x + objB.width) / 2,
      y: (objB.position.y + objB.position.y + objB.height) / 2,
    };

    // how to
    // Revisar a que lado izq, der, arr, abajo debe irse
    // Luego calcular la posiciomn x, y considerando el alto y el ancho

    // X Axis
    if (objAMiddlePoint.x < objBMiddlePoint.x) {
      output.x = Math.min(0, objA.position.x, objB.position.x);
    } else {
      output.x = Math.max(objA.position.x, objB.position.x);
    }
    // Y Axis
    if (objAMiddlePoint.y < objBMiddlePoint.y) {
      output.y = Math.min(0, objA.position.y, objB.position.y);
    } else {
      output.y = Math.max(objA.position.y, objB.position.y);
    }

    return output;
  }
}
