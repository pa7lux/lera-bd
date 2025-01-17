'use strict';

let scene,
    camera,
    renderer,
    raycaster,
    controls,
    mouse;

let chameleon,
    branch,
    fly;

let width,
    height;

function init() {
  width = parseFloat(getComputedStyle(document.querySelector('.container')).width),
  height = parseFloat(getComputedStyle(document.querySelector('.container')).height);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(30, 0, 10);
  camera.lookAt(scene.position);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.setClearColor(0xF2A9B4);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
  // controls = new THREE.OrbitControls(camera, renderer.domElement);
  
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  
  addLights();
  drawChameleon();
  drawBranch();
  drawFly();
  
  document.querySelector('.world').appendChild(renderer.domElement);
  
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('touchmove', onTouchMove);
  window.addEventListener('resize', onResize, false);
}

function addLights() {
  const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
  scene.add(light);

  const directLight1 = new THREE.DirectionalLight();
  directLight1.castShadow = true;
  directLight1.position.set(20, 13, 12);
  scene.add(directLight1);

  const directLight2 = new THREE.DirectionalLight({
    color: 0xd9fbfc,
    intensity: 0.6,
  });
  directLight2.castShadow = true;
  directLight2.position.set(-27, 18, 6);
  scene.add(directLight2);
}

function drawChameleon() {
  chameleon = new Chameleon();
  scene.add(chameleon.group);
}

function drawBranch() {
  branch = drawCylinder(0x17B26F, 0.76, 1.12, 2.14, 5);
  branch.position.set(-2.76, -5.67, -7.86);
  branch.rotation.set(rad(85.18), rad(4.14), rad(-20.4));
  branch.scale.set(3.78, 11.92, 2.72);
  branch.castShadow = true;
  branch.receiveShadow = true;
  scene.add(branch);
}

function drawFly() {
  fly = new Fly();
  scene.add(fly.group);
}

function onResize() {
  width = parseFloat(getComputedStyle(document.querySelector('.container')).width),
  height = parseFloat(getComputedStyle(document.querySelector('.container')).height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function onMouseMove(event) {
  mouse.x = (event.clientX / width) * 2 - 1;
  mouse.y = - (event.clientY / height) * 2 + 1;
}

function onTouchMove(event) {
  event.preventDefault();
  mouse.x = (event.touches[0].pageX / width) * 2 - 1;
  mouse.y = - (event.touches[0].pageY / height) * 2 + 1;
}

function rad(degrees) {
  return degrees * (Math.PI / 180);
}

function drawCylinder(materialColor, rTop, rBottom, height, radialSeg) {
  const geometry = new THREE.CylinderGeometry(rTop, rBottom, height, radialSeg);
  const material = new THREE.MeshStandardMaterial({
    color: materialColor,
    roughness: 1,
    shading: THREE.FlatShading,
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function animate() {
  requestAnimationFrame(animate);

  render();
}

function render() {
  
  chameleon.changeColor();
  chameleon.moveHead(fly.group.position);

  fly.moveWings();
  fly.moveFly();
  
  renderer.render(scene, camera);
}

class Chameleon {
  constructor() {
    this.group = new THREE.Group();
    this.group.position.set(-1, 3, 2.7);
    this.group.rotation.set(rad(18.84), 0, rad(2.2));
    
    this.material = new THREE.MeshStandardMaterial({
      color: 0x1CCCA3,
      roughness: 1,
      shading: THREE.FlatShading,
    });
    
    this.drawHead();
    this.drawBody();
    this.drawTail();
    this.drawLegs();
    
    this.group.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
  }
  drawHead() {
    const headGeometry = new THREE.SphereGeometry(5, 4, 4);
    this.head = new THREE.Mesh(headGeometry, this.material);
    this.head.rotation.set(rad(90), rad(45), 0);
    this.group.add(this.head);

    // draw eyes
    const rightEye = this.drawSkinCylinder(2, 1.3, 1.4, 5);
    rightEye.position.set(3, 1.6, 1.6);
    rightEye.rotation.set(rad(-27.2), rad(-45), rad(90));
    this.head.add(rightEye);

    const rightEyeWhite = drawCylinder(0xffffff, 1.26, 0.78, 1.14, 5);
    rightEyeWhite.position.set(0.02, -0.37, -0.06);
    rightEye.add(rightEyeWhite);

    const rightEyeBlack = drawCylinder(0x3F3F3F, 0.86, 0.36, 1.14, 5);
    rightEyeBlack.position.set(-0.01, -0.27, -0.01);
    rightEyeWhite.add(rightEyeBlack);

    const leftEye = rightEye.clone();
    leftEye.position.set(-1.62, 1.47, -2.92);
    leftEye.rotation.set(rad(25), rad(-225), rad(82.8));
    this.head.add(leftEye);

    const leftEyeWhite = rightEyeWhite.clone();
    leftEyeWhite.position.set(0.02, -0.37, -0.06);
    leftEye.add(leftEyeWhite);

    const leftEyeBlack = rightEyeBlack.clone();
    leftEyeBlack.position.set(-0.01, -0.27, -0.01);
    leftEyeWhite.add(leftEyeBlack);

    // draw nose
    const nose = this.drawSkinCylinder(0.88, 3.52, 1.96, 4);
    nose.position.set(-0.02, 4.53, 0);
    this.head.add(nose);

    // draw cap
    const cap = this.drawSkinCylinder(0.96, 3.5, 4, 4);
    cap.position.set(1.88, -1.54, -1.85);
    this.head.add(cap);
  }
  drawBody() {
    const body = new THREE.Object3D();
    body.position.set(4.19, -4.51, -2.7);
    body.rotation.set(rad(62.4), rad(45), 0);
    this.group.add(body);

    const neck = this.drawSkinCylinder(3.48, 7, 8, 4);
    neck.position.set(0, -1.46, -5.85);
    body.add(neck);

    const torso = this.drawSkinCylinder(7, 3.9, 6, 4);
    torso.position.set(-0.03, -8.4, -5.87);
    body.add(torso);

    const back = this.drawSkinCylinder(3.9, 1.4, 3, 4);
    back.position.set(-0.03, -12.9, -5.87);
    body.add(back);
  }
  drawTail() {
    const tail = this.drawSkinCylinder(2.14, 1.2, 8.7, 4);
    tail.position.set(0.05, -7.85, -17.43);
    tail.rotation.set(rad(48), rad(45), 0);
    this.group.add(tail);

    const tailPart1 = this.drawSkinCylinder(1.2, 1, 13, 4);
    tailPart1.position.set(-3.76, -6.24, 3.92);
    tailPart1.rotation.set(rad(67.4), rad(45), rad(-116.6));
    tail.add(tailPart1);

    const tailPart2 = this.drawSkinCylinder(0.78, 1, 7, 4);
    tailPart2.position.set(-8.46, -5.13, 8.86);
    tailPart2.rotation.set(rad(17.6), rad(3), rad(16.2));
    tail.add(tailPart2);

    const tailPart3 = this.drawSkinCylinder(1.2, 0.76, 5, 4);
    tailPart3.position.set(-7.55, -1.35, 7.96);
    tailPart3.rotation.set(rad(67.4), rad(45), rad(-116.6));
    tail.add(tailPart3);

    const tailPart4 = this.drawSkinCylinder(1.2, 0.74, 4.06, 4);
    tailPart4.position.set(-5.24, -1.2, 5.52);
    tailPart4.rotation.set(rad(15.4), rad(2.8), rad(13));
    tail.add(tailPart4);
  }
  drawLegs() {
    const rightLeg = this.drawSkinCylinder(1.56, 1, 3.96, 4);
    rightLeg.position.set(2.34, -5.86, -4.55);
    rightLeg.rotation.set(rad(-12.6), rad(53), 0);
    this.group.add(rightLeg);

    const finger1 = this.drawSkinCylinder(0.4, 1.04, 2, 4);
    finger1.position.set(0.32, -1.55, 1.21);
    finger1.rotation.set(rad(105.4), rad(41), 0);
    rightLeg.add(finger1);

    const finger2 = finger1.clone();
    finger2.position.set(-0.76, -1.5, 0.61);
    finger2.rotation.set(rad(59.8), rad(39.6), rad(69.6));
    rightLeg.add(finger2);

    const finger3 = finger1.clone();
    finger3.position.set(-1.11, -1.57, -0.58);
    finger3.rotation.set(rad(43.2), rad(-9.8), rad(120.8));
    rightLeg.add(finger3);

    const leftLeg = rightLeg.clone();
    leftLeg.position.set(-2.08, -5.86, -4.55);
    leftLeg.rotation.set(rad(-20.6), rad(45), 0);
    this.group.add(leftLeg);

    const backRightLeg = rightLeg.clone();
    backRightLeg.position.set(2.39, -9.07, -10.93);
    backRightLeg.rotation.set(rad(-19.4), rad(51.2), rad(4.2));
    backRightLeg.scale.set(0.7, 0.7, 0.7);
    this.group.add(backRightLeg);

    const backLeftLeg = backRightLeg.clone();
    backLeftLeg.position.set(-2.08, -8.9, -10.1);
    backLeftLeg.rotation.set(rad(-18), rad(28.6), 0);
    this.group.add(backLeftLeg);
  }
  
  changeColor() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(this.group.children, true);

    if (intersects.length > 0) {
      if (intersects[0].object.material.color.getHexString() === 'ffffff' ||
          intersects[0].object.material.color.getHexString() === '3f3f3f') return;

      const time = Date.now() * 0.00005;
      const h = ((360 * (1.0 + time)) % 360) / 360;
      intersects[0].object.material.color.setHSL(h, 1.0, 0.6);
    }
  }
  moveHead(flyPosition) {
    this.head.lookAt(flyPosition);
    this.head.rotation.x += rad(90);
    this.head.rotation.y += rad(45);
    this.head.position.y = 1;
  }
  
  drawSkinCylinder(rTop, rBottom, height, radialSeg) {
    const geometry = new THREE.CylinderGeometry(rTop, rBottom, height, radialSeg);
    const mesh = new THREE.Mesh(geometry, this.material);
    return mesh;
  }
}

class Fly {
  constructor() {
    this.group = new THREE.Group();
    this.group.position.set(0, 12.71, 19.08);
    
    this.wingAngle = 0;
    
    this.drawBody();
    this.drawWings();
  }
  drawBody() {
    const flyGeometry = new THREE.BoxGeometry(1, 1, 1);
    const flyMaterial = new THREE.MeshStandardMaterial({
      color: 0x3F3F3F,
      roughness: 1,
      shading: THREE.FlatShading,
    });
    const fly = new THREE.Mesh(flyGeometry, flyMaterial);
    this.group.add(fly);
  }
  drawWings() {
    this.rightWing = drawCylinder(0xffffff, 0.42, 0.08, 1.26, 4);
    this.rightWing.position.set(0, 0.2, 0.6);
    this.rightWing.rotation.set(Math.PI / 4, 0, Math.PI / 4);
    this.rightWing.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.21, 0.04));
    this.group.add(this.rightWing);

    this.leftWing = this.rightWing.clone();
    this.leftWing.position.z = -this.rightWing.position.z;
    this.group.add(this.leftWing);
  }
  
  moveFly() {
    const timer = Date.now() * 0.0001;
    this.group.position.x = 4 * Math.cos(timer * 3);
    this.group.position.y = 5 * Math.sin(timer * 6);
  }
  moveWings() {
    this.wingAngle += 0.5;
    const wingAmplitude = Math.PI / 8;
    this.rightWing.rotation.x = (Math.PI / 4) - (Math.cos(this.wingAngle) * wingAmplitude);
    this.leftWing.rotation.x = (-Math.PI / 4) + (Math.cos(this.wingAngle) * wingAmplitude);
  }
}


init();
animate();

