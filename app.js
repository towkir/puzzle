
var puzzleSize = 25; // this is the slide number in the puzzle
var board = document.getElementById('board');

// variables for the style position property of each slides;
var posTop = 0;
var posLeft = 0;
// and these for the background position of each slides;
var bgPosX = 0;
var bgPosY = 0;

// now creating the slides and pushing them inside the container #board;
for (var s = 1; s < puzzleSize + 1; s++ ) {
    var slide = document.createElement('div');
    var border = document.createElement('div');
    if (s === 5){
        border.style.border = 'none';
    }
    border.classList.add('border');
    slide.classList.add('slide');
    slide.dataset.originPosition = s;
    slide.dataset.tempPosition = s;
    slide.style.left = posLeft + '%';
    slide.style.top = posTop + '%';
    slide.style.backgroundPosition = bgPosX + '%' + bgPosY + '%';
    slide.appendChild(border);
    board.appendChild(slide);
    posLeft += 20;
    bgPosX -= 100;
    if (s % 5 === 0){
        posTop += 20;
        posLeft = 0;
        bgPosX = 0;
        bgPosY -= 100;
    }
}

//creating an array of the slides
var slideEl = document.getElementsByClassName("slide");
var blank = slideEl[Math.sqrt(slideEl.length) - 1];  // to identify the blank slide
blank.style.background = 'none';
blank.style.boxShadow = 'none';
blank.style.border = 'none';
var root = Math.sqrt(slideEl.length);
for (var i=0; i<slideEl.length; i++){
  slideEl[i].frameNumber = i+1;
  slideEl[i].coOrdinate = i+1;  // this changes with the slide position . it is never constant !!!
}

var slideTraced = function(number){
  for (var a=0; a<slideEl.length; a++){
    if (slideEl[a].coOrdinate == number){
      return slideEl[a];
    }
  }
};

//this function scatters the slides randomly when window loads.....
var randomization = function(){
   var movementOrder = [1, root, -1, -root];
 for (var i=0; i<=100; i++){
   var guestPosition = blank.coOrdinate + (movementOrder[Math.floor(Math.random() * movementOrder.length)]);
     if (guestPosition > 0 && guestPosition <= slideEl.length){
       var guest = slideTraced(guestPosition);
   var left = blank.coOrdinate;
   var right = guest.coOrdinate;
      if (left % root === 0 && right % root === 1){
      i--;
      } else if (left % root === 1 && right % root === 0){
      i--;
      } else {
      var swPos = guest.getAttribute("style");
      var swPosBl = blank.getAttribute("style");
      guest.coOrdinate = left;
      blank.coOrdinate = right;
      guest.setAttribute("style",swPosBl);
      blank.setAttribute("style",swPos);
          }
     } else {
     i--;
     }
   }
};
//calls randomization function on loading window and scatters the slides...
//window.addEventListener("load", randomization);


//this is a function for changing slide positions on user click....
var changePosition = function(){
  var left = this.coOrdinate;
  var right = blank.coOrdinate;
  var possibility = left - right;
  if (possibility == 1 || possibility == -1 || possibility == root || possibility == -root){ 
    if (left % root === 1 && right % root === 0){
      return false;
    } else if (left % root === 0 && right % root === 1) {
      return false;
    } else {
      var swapped = this.coOrdinate;
      var swPos = this.getAttribute("style");
      var swPosBl = blank.getAttribute("style");
      this.coOrdinate = blank.coOrdinate;
      blank.coOrdinate = swapped;
      this.setAttribute("style",swPosBl);
      blank.setAttribute("style",swPos);
    }
  }
};

//applies changePosition function on all of the slides...
for (var i=0; i<slideEl.length; i++){
  slideEl[i].addEventListener("click", changePosition);
}


var currently;
function shuffleAndReset() {
  if (currently === undefined) {
    randomization();
    currently = "shuffled";
  } else {
    location.reload(true);
  }
}

document.body.addEventListener("dblclick", shuffleAndReset);
