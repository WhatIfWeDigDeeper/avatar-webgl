// tab to see options on shape, scene, other objects.
// This is where stuff in our game will happen:
const scene = new THREE.Scene();

// This is what sees the stuff:
const createCamera = function() {
    const aspect_ratio = window.innerWidth / window.innerHeight;
    const camera = new THREE.PerspectiveCamera(75, aspect_ratio, 1, 10000);
    camera.position.z = 500;
    return camera;
};

const camera = createCamera();
scene.add(camera);

const renderer = window.WebGLRenderingContext ?  new THREE.WebGLRenderer() :  new THREE.CanvasRenderer();

const drawToScreen = function(scene, camera) {
    // This will draw what the camera sees onto the screen:
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Now, show what the camera sees on the screen:
    renderer.render(scene, camera);
};

const move = function(shape, left, up, back) {
    if (!shape)
        return;
    return shape.move(left, up, back);
};

const hide = function(shape) {
    if (!shape)
        return;
    return shape.hide();
};

const show = function(shape) {
    if (!shape)
        return;
    return shape.show();
};

const rotate = function(shape, down, right, around) {
    if (!shape)
        return;
    return shape.rotate(down, right, around);
};

const createMaterial = function(color) {
    if (!color && color !== 0) {
        return new THREE.MeshNormalMaterial();
    } else {
        return new THREE.MeshBasicMaterial({
            color: color,
            vertexColors: THREE.FaceColors
        });
    }
};

function convertDegreesToRadians (degrees) {
    return degrees * (Math.PI/180);
}


//***********************
// shape creators
//***********************


function makeBall(size, smoothAround, smoothUpDown, color, parent) {
    parent = parent || scene;
    const shape = new THREE.SphereGeometry(size, smoothAround, smoothUpDown);
    const material = createMaterial(color);
    const sphere = new THREE.Mesh(shape, material);
    parent.add(sphere);
    return new Shape(sphere);
}


function makeBox(width, height, depth, color, parent) {
    parent = parent || scene;
    const shape = new THREE.CubeGeometry(width, height, depth);
    const material = createMaterial(color);
    const box = new THREE.Mesh(shape, material);
    parent.add(box);
    return new Shape(box);
}


function makeTube(top, bottom, height, chunks, color, parent) {
    parent = parent || scene;
    const shape = new THREE.CylinderGeometry(top, bottom, height, chunks);
    const material = createMaterial(color);
    const tube = new THREE.Mesh(shape, material);
    parent.add(tube);
    return new Shape(tube);
}



function makeSurface(length, width, color, parent) {
    parent = parent || scene;
    const shape = new THREE.PlaneGeometry( 100, 100);
    const material = createMaterial(color);
    const surface = new THREE.Mesh( shape, material);
    parent.add(surface);
    return new Shape(surface);
}



function makeDonut(size, thinkness, color, smoothInside, smoothOutside, parent) {
    smoothInside = smoothInside || 8;
    smoothOutside = smoothOutside || 25;
    parent = parent || scene;

    const shape = new THREE.TorusGeometry(size, thinkness, smoothInside, smoothOutside, 6.3);

    const material = createMaterial(color);
    const donut = new THREE.Mesh( shape, material);
    parent.add(donut);
    return new Shape(donut);
}


function Shape(shape) {
    this._shape = shape;
    this._rotateX = false;
    this._rotateY = false;
    this._rotateZ = false;
    return this;
}

Shape.prototype.move = function(right, up, forward) {
    if (right) {
        this._shape.position.x += right;
    }
    if (up) {
        this._shape.position.y += up;
    }
    if (forward) {
        this._shape.position.z += forward;
    }
    return this;
};

Shape.prototype.left = function(left) {
    return this.move((-1*left));
};

Shape.prototype.right = function(right) {
    return this.move(right);
};

Shape.prototype.up = function(up) {
    return this.move(0,up);
};

Shape.prototype.down = function(down) {
    return this.move(0,(-1*down));
};

Shape.prototype.forward = function(forwards) {
    return this.move(0, 0, (forwards));
};

Shape.prototype.backward = function(backwards) {
    return this.move(0, 0, (-1*backwards));
};

Shape.prototype.rotate = function(down, right, around) {
    down = down || 0;
    right = right || 0;
    around = around || 0;
    this._shape.rotation.set(down, right, around);
    return this;
};

Shape.prototype.hide = function() {
    return this.move(-5000,-5500);
};

Shape.prototype.show = function() {
    this._shape.position.set(0,0,0);
    return this;
};

Shape.prototype.setRotateX = function(onOrOff) {
    this._rotateX = onOrOff;
};

Shape.prototype.getRotateX = function() {
    return this._rotateX;
};

Shape.prototype.setRotateY = function(onOrOff) {
    this._rotateY = onOrOff;
};

Shape.prototype.getRotateY = function() {
    return this._rotateY;
};

Shape.prototype.setRotateZ = function(onOrOff) {
    this._rotateZ = onOrOff;
};

Shape.prototype.getRotateZ = function() {
    return this._rotateZ;
};

Shape.prototype.add = function(childShape) {
    this._shape.add(childShape);
    return this;
};

// helpers

function getRandomColor() {
    const numberOfColors = getNumberOfColors();
    return getColor(getRandomNumber(numberOfColors));
}

function getColor(index) {
    const keys = Object.keys(Color);
    return Color[keys[index]];
}

function getRandomTrueOrFalse() {
    const number = Math.round(Math.random());
    return number !== 0;
}

function getNumberOfColors() {
    return Object.keys(Color).length;
}

function getRandomNumber(max) {
    return Math.round(Math.random() * max);
}

function isEven(number) {
    return number % 2 === 0;
}

function getPosition(index, size) {
    return index * (size*2) + size;
}

function makeAndPlaceAvatar(index, color, size, up) {
    size = size || 30;
    up = up || 0;
    color = color || getRandomColor();
    const position = getPosition(index, size);
    const avatar = makeAvatar(color, size, up);
    if (isEven(index)) {
        avatar.left(position);
        //avatar.setRotateX(true);
    } else {
        avatar.right(position);
        //avatar.setRotateY(true);
    }
    return avatar;
}

const topPosition = Math.round(window.innerHeight*0.35);
const bottomPosition = Math.round(window.innerHeight*-0.35);

//***********************
// Animation
//***********************
const animatedShapes = [];

const clock = new THREE.Clock();

function animate(shape) {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    for(let i=0; i < animatedShapes.length; i++) {
        //animatedShapes[i].rotation.set( t, 2*t, 0);
        animatedShapes[i].rotate(
            animatedShapes[i].getRotateX() ? t : 0,
            animatedShapes[i].getRotateY() ? t : 0,
            animatedShapes[i].getRotateZ() ? t : 0);
    }
    renderer.render( scene, camera);
}


// Listen for keypress events
document.addEventListener('keydown', function(event) {
    if (!avatar) return;
    switch (event.keyCode) {
        case 37:
            avatar.left(5);
            break;
        case 38:
            avatar.up(5);
            break;
        case 39:
            avatar.right(5);
            break;
        case 40:
            avatar.down(5);
            break;
        case 88:
            avatar.setRotateY(!avatar.getRotateY());
            break;
        case 89:
            avatar.setRotateX(!avatar.getRotateX());
            break;
        case 90:
            avatar.setRotateZ(!avatar.getRotateZ());
            break;
        default:
            console.log(event.keyCode);
    }
});


//***********************
// Colors
//***********************

const defaultColor = "DEFAULT";

const Color = {
    AliceBlue : 0xF0F8FF,
    AntiqueWhite : 0xFAEBD7,
    Aqua : 0x00FFFF,
    Aquamarine : 0x7FFFD4,
    Azure : 0xF0FFFF,
    Beige : 0xF5F5DC,
    Bisque : 0xFFE4C4,
    Black : 0x000000,
    BlanchedAlmond : 0xFFEBCD,
    Blue : 0x0000FF,
    BlueViolet : 0x8A2BE2,
    Brown : 0xA52A2A,
    Burlywood : 0xDEB887,
    CadetBlue : 0x5F9EA0,
    Chartreuse : 0x7FFF00,
    Chocolate : 0xD2691E,
    Coral : 0xFF7F50,
    Cornflower : 0x6495ED,
    Cornsilk : 0xFFF8DC,
    Crimson : 0xDC143C,
    Cyan : 0x00FFFF,
    DarkBlue : 0x00008B,
    DarkCyan : 0x008B8B,
    DarkGoldenrod : 0xB8860B,
    DarkGray : 0xA9A9A9,
    DarkGreen : 0x006400,
    DarkKhaki : 0xBDB76B,
    DarkMagenta : 0x8B008B,
    DarkOliveGreen : 0x556B2F,
    DarkOrange : 0xFF8C00,
    DarkOrchid : 0x9932CC,
    DarkRed : 0x8B0000,
    DarkSalmon : 0xE9967A,
    DarkSeaGreen : 0x8FBC8F,
    DarkSlateBlue : 0x483D8B,
    DarkSlateGray : 0x2F4F4F,
    DarkTurquoise : 0x00CED1,
    DarkViolet : 0x9400D3,
    DeepPink : 0xFF1493,
    DeepSkyBlue : 0x00BFFF,
    DimGray : 0x696969,
    DodgerBlue : 0x1E90FF,
    Firebrick : 0xB22222,
    FloralWhite : 0xFFFAF0,
    ForestGreen : 0x228B22,
    Fuchsia : 0xFF00FF,
    Gainsboro : 0xDCDCDC,
    GhostWhite : 0xF8F8FF,
    Gold : 0xFFD700,
    Goldenrod : 0xDAA520,
    Gray : 0xBEBEBE,
    WebGray : 0x808080,
    Green : 0x00FF00,
    WebGreen : 0x008000,
    GreenYellow : 0xADFF2F,
    Honeydew : 0xF0FFF0,
    HotPink : 0xFF69B4,
    IndianRed : 0xCD5C5C,
    Indigo : 0x4B0082,
    Ivory : 0xFFFFF0,
    Khaki : 0xF0E68C,
    Lavender : 0xE6E6FA,
    LavenderBlush : 0xFFF0F5,
    LawnGreen : 0x7CFC00,
    LemonChiffon : 0xFFFACD,
    LightBlue : 0xADD8E6,
    LightCoral : 0xF08080,
    LightCyan : 0xE0FFFF,
    LightGoldenrod : 0xFAFAD2,
    LightGray : 0xD3D3D3,
    LightGreen : 0x90EE90,
    LightPink : 0xFFB6C1,
    LightSalmon : 0xFFA07A,
    LightSeaGreen : 0x20B2AA,
    LightSkyBlue : 0x87CEFA,
    LightSlateGray : 0x778899,
    LightSteelBlue : 0xB0C4DE,
    LightYellow : 0xFFFFE0,
    Lime : 0x00FF00,
    LimeGreen : 0x32CD32,
    Linen : 0xFAF0E6,
    Magenta : 0xFF00FF,
    Maroon : 0xB03060,
    WebMaroon : 0x7F0000,
    MediumAquamarine : 0x66CDAA,
    MediumBlue : 0x0000CD,
    MediumOrchid : 0xBA55D3,
    MediumPurple : 0x9370DB,
    MediumSeaGreen : 0x3CB371,
    MediumSlateBlue : 0x7B68EE,
    MediumSpringGreen : 0x00FA9A,
    MediumTurquoise : 0x48D1CC,
    MediumVioletRed : 0xC71585,
    MidnightBlue : 0x191970,
    MintCream : 0xF5FFFA,
    MistyRose : 0xFFE4E1,
    Moccasin : 0xFFE4B5,
    NavajoWhite : 0xFFDEAD,
    NavyBlue : 0x000080,
    OldLace : 0xFDF5E6,
    Olive : 0x808000,
    OliveDrab : 0x6B8E23,
    Orange : 0xFFA500,
    OrangeRed : 0xFF4500,
    Orchid : 0xDA70D6,
    PaleGoldenrod : 0xEEE8AA,
    PaleGreen : 0x98FB98,
    PaleTurquoise : 0xAFEEEE,
    PaleVioletRed : 0xDB7093,
    PapayaWhip : 0xFFEFD5,
    PeachPuff : 0xFFDAB9,
    Peru : 0xCD853F,
    Pink : 0xFFC0CB,
    Plum : 0xDDA0DD,
    PowderBlue : 0xB0E0E6,
    Purple : 0xA020F0,
    WebPurple : 0x7F007F,
    RebeccaPurple : 0x663399,
    Red : 0xFF0000,
    RosyBrown : 0xBC8F8F,
    RoyalBlue : 0x4169E1,
    SaddleBrown : 0x8B4513,
    Salmon : 0xFA8072,
    SandyBrown : 0xF4A460,
    SeaGreen : 0x2E8B57,
    Seashell : 0xFFF5EE,
    Sienna : 0xA0522D,
    Silver : 0xC0C0C0,
    SkyBlue : 0x87CEEB,
    SlateBlue : 0x6A5ACD,
    SlateGray : 0x708090,
    Snow : 0xFFFAFA,
    SpringGreen : 0x00FF7F,
    SteelBlue : 0x4682B4,
    Tan : 0xD2B48C,
    Teal : 0x008080,
    Thistle : 0xD8BFD8,
    Tomato : 0xFF6347,
    Turquoise : 0x40E0D0,
    Violet : 0xEE82EE,
    Wheat : 0xF5DEB3,
    White : 0xFFFFFF,
    WhiteSmoke : 0xF5F5F5,
    Yellow : 0xFFFF00,
    YellowGreen : 0x9ACD32
};

//console.log(Object.getPrototypeOf(pyramid) === Shape.prototype);
// function makeAvatar() {
//   var avatar = makeBall(100, 20, 15);
//   avatar.up(100);


//   //var rightHand = makeBox(50,100, 100, null, avatar);
//   var rightHand = makeBall(50,null,null,null,avatar);
//   rightHand.right(150);


//   var leftHand = makeBall(50,null,null,null,avatar);
//   leftHand.left(150);


//   var rightFoot = makeBall(50,null,null,null,avatar);
//   rightFoot.down(125).right(75);


//   var leftFoot = makeBall(50,null,null,null,avatar);
//   leftFoot.down(125).left(75);

//   var hulaHoop = makeDonut(110,10,null,null, null,avatar);
//   hulaHoop.rotate(1.6);

//   return avatar;
// }

// var avatar = makeAvatar();
// //var list = [];

// // for(var i=0;i<10;i++) {
// //   var player = makeAvatar();
// //   player.up(i*10);
// //   list.push(av);
// // }



// //next make this a function to make many shapes
// function makeShapes(count, shapeMaker) {

// }
// // function makeShapes(count, shapeMaker) {
// //   var list = [];

// //   for(var i=0;i<count;i++) {
// //     var sh = shapeMaker();
// //     sh.up(i*10);
// //     list.push(sh);
// //   }
// //   return list;
// // }

// //var list = makeShapes(4, makeAvatar);