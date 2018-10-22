
var minimumShuffle = 0; // check's if any shuffles had been done or not

var puzzleSize = 25; // this is the slide number in the puzzle
var board = document.getElementById('board');

// variables for the style position property of each slides;
var posTop = 0;
var posLeft = 0;
// and these for the background position of each slides;
var bgPosX = 0;
var bgPosY = 0;

// for controlling the modal actions
var modalParent = document.getElementById('modal-container');
var modal = modalParent.getElementsByClassName('custom-modal')[0];

// now creating the slides and pushing them inside the container #board;
for (var s = 1; s < puzzleSize + 1; s++) {
    var slide = document.createElement('div');
    var border = document.createElement('div');
    if (s === 5) {
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
    if (s % 5 === 0) {
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

var slideTraced = function (number) {
    for (var a = 0; a < slideEl.length; a++) {
        if (parseInt(slideEl[a].dataset.tempPosition) === number) {
            return slideEl[a];
        }
    }
};

//this function scatters the slides randomly when window loads.....
var randomization = function () {
    var movementOrder = [1, root, -1, -root];
    for (var i = 0; i <= 100; i++) {
        var guestPosition = parseInt(blank.dataset.tempPosition) + (movementOrder[Math.floor(Math.random() * movementOrder.length)]);
        console.log(guestPosition);
        if (typeof guestPosition !== 'undefined' && guestPosition > 0 && guestPosition <= slideEl.length) {
            var guest = slideTraced(guestPosition);
            console.log(guest);
            var left = blank.dataset.tempPosition;
            var right = guest.dataset.tempPosition;
            if (left % root === 0 && right % root === 1) {
                i--;
            } else if (left % root === 1 && right % root === 0) {
                i--;
            } else {
                // var swPos = guest.getAttribute("style");
                var swPosL = guest.style.left;
                var swPosT = guest.style.top;
                // var swPosBl = blank.getAttribute("style");
                var swPosBlL = blank.style.left;
                var swPosBlT = blank.style.top;
                guest.dataset.tempPosition = left;
                blank.dataset.tempPosition = right;
                // guest.setAttribute("style", swPosBl);
                guest.style.left = swPosBlL;
                guest.style.top = swPosBlT;
                // blank.setAttribute("style", swPos);
                blank.style.left = swPosL;
                blank.style.top = swPosT;
            }
        } else {
            i--;
        }
    }

    // confirms that minimum one shuffle has happened;
    minimumShuffle = 1;
};

//calls randomization function on loading window and scatters the slides...
//window.addEventListener("load", randomization);

//this is a function for changing slide positions on user click....
var changePosition = function () {
    var left = this.dataset.tempPosition;
    var right = blank.dataset.tempPosition;
    var possibility = left - right;
    if (possibility === 1 || possibility === -1 || possibility === root || possibility === -root) {
        if (left % root === 1 && right % root === 0) {
            return false;
        } else if (left % root === 0 && right % root === 1) {
            return false;
        } else {
            var swapped = this.dataset.tempPosition;
            var swPosL = this.style.left;
            var swPosT = this.style.top;
            var swPosBlL = blank.style.left;
            var swPosBlT = blank.style.top;
            this.dataset.tempPosition = blank.dataset.tempPosition;
            blank.dataset.tempPosition = swapped;
            this.style.left = swPosBlL;
            this.style.top = swPosBlT;
            blank.style.left = swPosL;
            blank.style.top = swPosT;
        }
    }

    var matched = 0;

    for (var j = 0; j < slideEl.length; j++) {
        if (slideEl[j].dataset.originPosition === slideEl[j].dataset.tempPosition){
            matched++;
        }
    }

    if (minimumShuffle === 1 && matched === 25) {
        (function () {
            modalParent.style.opacity = '1';
            modalParent.style.zIndex = '100';
            modal.style.zIndex = '200';
            modal.getElementsByTagName('button')[0].addEventListener('click', function () {
                window.location.reload(true);
            });
        })();
    }
};

//applies changePosition function on all of the slides...
for (var l = 0; l < slideEl.length; l++) {
    slideEl[l].addEventListener("click", changePosition);
}

document.body.addEventListener("dblclick", randomization);
