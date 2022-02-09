function setOffsetPath(){
    let source = document.getElementById('deutsch');
    let target = document.getElementById('auswertungContainer');
    let distanceLeft = target.offsetLeft + target.offsetWidth/2 - source.offsetLeft;
    let distanceTop = target.offsetTop + target.offsetHeight/2 - source.offsetTop;

    let style = `<style id="dynamicStyle">
        .motionBallOffsetPath {
            offset-path: path('M57,9 C42,9 ${distanceLeft*0.75},8 ${distanceLeft*0.75},9 C${distanceLeft-10},11 ${distanceLeft-10},29 ${distanceLeft},${distanceTop}');
        }
    </style>`;
    $('head').append(style);
}

function confettiNow(){
    let end = Date.now() + (3 * 1000);
    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
}

function aLastSalutOfConfetti(){
    var duration = 6 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      var particleCount = 150 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

function correctAnswerAnimation(callback){
    $("#deutsch")
        .css({overflow: "hidden"})
        .animate({width: "1em", height: "1em"}, 200, function() {
            // animate rolling to the box - animation duration 600ms
            setOffsetPath();

            $('#deutsch').addClass('motionBall motionBallOffsetPath');
            window.setTimeout(function(){
                playSound_richtig();

                // start shaking the box - animation duration 600 ms
                $("#auswertungContainer").addClass("bounce-7");
                window.setTimeout(function(){
                    // hide the ball in the box
                    $('#deutsch').fadeOut();

                    let givenAnswersPercentage = (getCountGivenAnswersThisRun() + 1) / getCountAllAnswersThisRun();
                    let heightDifInPercent = 100 - (givenAnswersPercentage * 100);
                    $('#progressContainer').css({height: heightDifInPercent + '%'}).removeClass("progress_start");

                    callback();
                }, 200);
            }, 500);
            // Animation complete.
        }
    );
}

