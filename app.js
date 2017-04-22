// variable color
// multiple avatars
//   for loop
//   is even - remainder
//

//**********************************
//  Code below this line
//  Remove "//" to enable line of code
//**********************************


//size, smoothness around, smoothness up & down
//const ball = makeBall(100, 20, 15);
//ball.up(100);
//ball.hide();

//**********************************
// Challenge 1:  Move the ball around
//**********************************




//**********************************
// Challenge 2:  Change the ball color
//**********************************



//width, height, depth
// const cube = makeBox(100,100,100);
// cube.rotate(0.5,0.5);
// cube.up(100).rotate(0.5,0.5);
// cube.right(100);
// full rotation is 6.3
// 0.5 down & 0.5 to right,
// try changing the numbers.
// cube.rotate(0.5,0.5);
// cube.move(250,250,-250);
// cube.hide();

//**********************************
// Challenge 3:  Make a smaller or
// bigger cube
//**********************************


//**********************************
// Challenge 4:  Make a flat rectangle
//**********************************



// const wall = makeBox(300, 100, 20);
// wall.rotate(0.5,0.5);
// wall.move(-250,250,-250);
// wall.hide();



// makeTube(top, bottom, height, smooth, color)
// const tube = makeTube(20,20,100);
// const pyramid = makeTube(1,100,100, 4);
// pyramid.down(20).left(100);

//pyramid.move(-100,-100);
// pyramid.down(150)
//   .right(100)
//   .forward(0)
//   .backward(0);
// pyramid.move(-100,200,200);
// pyramid.rotate(0.5);
// pyramid.hide();
// pyramid.show();




// ************************
// challenge 5: rotate the tube
// tube.rotate(0.5, 0.5, 0);
// ************************

//**********************************
// Challenge 6:  Make an ice cream cone
//**********************************


//**********************************
// Challenge 7:  Make a pyramid
//**********************************


// const surface = makeSurface(100,100);
// surface.rotate(0.5,0.5,0.5);
//surface.hide();

//**********************************
// Challenge 8:  Make grass surface
//**********************************



// const donut = makeDonut(100,25);
// donut.rotate(0.5,0.75);
// donut.hide();

//**********************************
// Challenge 9:  Make a pink donut
//**********************************


// *****************
// Challenge 9:  make an Avatar
// *****************



// ************************
// Challenge 11: make a function
// for adding your avatar
// ************************
function makeAvatar(color, size, up) {
    //const color = Color.Red;
    //const color = getColor(3);
    const avatar = makeBall(size, 20, 15, color);
    avatar.up(up);


    //const rightHand = makeBox(50,100, 100, null, avatar);
    const rightHand = makeBall(size / 2,null,null,color,avatar);
    rightHand.right(size*1.5);


    const leftHand = makeBall(size / 2,null,null,color,avatar);
    leftHand.left(size*1.5);


    const rightFoot = makeBall(size / 2,null,null,color,avatar);
    rightFoot.down(size * 1.25).right(size * 0.75);


    const leftFoot = makeBall(size / 2,null,null,color,avatar);
    leftFoot.down(size * 1.25).left(size * 0.75);

    const hulaHoop = makeDonut(size*1.1, 10,Color.Black,null, null,avatar);
    hulaHoop.rotate(1.6);
    return avatar;
}

const avatar = makeAvatar(Color.Gold, 70, 50);

// ************************
// Challenge 12: add multiple avatars
// ************************



// ************************
// Challenge 13: turn #12 into function
// that can create any shape
// ************************

// function makeManyAvatars(count, size, up, color) {

// }


function makeManyAvatars(count, size, up, color) {
    const avatars = [];
    let avatar;
    for(let i = 0; i<count; i++) {
        avatar = makeAndPlaceAvatar(i, color, size, up);
        if (isEven(i)) {
            avatar.setRotateX(true);
        } else {
            avatar.setRotateY(true);
        }
        avatars.push(avatar);
    }
    return avatars;
}



const team1 = makeManyAvatars(6,40,topPosition, Color.Blue);
const team2 = makeManyAvatars(6,40,bottomPosition, Color.White);


// ************************
// Challenge 13: animate your
// creations
// ************************



// add teams to animation
animatedShapes = [avatar];
animatedShapes = animatedShapes.concat(team1);
animatedShapes = animatedShapes.concat(team2);



animate();

/*

 **Shape creation functions

 const ball = makeBall(size, smoothAround, smoothUpDown, color)

 const box = makeBox(width, height, depth, color)

 const tube = makeTube(top, bottom, height, chunks, color)

 const surface = makeSurface(length, width, color)

 const donut = makeDonut(size, thinkness, color, smoothInside, smoothOutside)


 ** helpers
 shape.hide();
 shape.show();

 //full rotation around is 6.3
 shape.rotate(around, down, right);

 Color.Red
 Color.Pink

 defaultColor OR don't pass in color

 */



drawToScreen(scene, camera);

