document.addEventListener('DOMContentLoaded', () => {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    document.body.appendChild(svg);

    const width = window.innerWidth;
    const height = window.innerHeight/2;

    const myLine = new Line(svg, svgNS, width, height);
    const myCup = new Cup(svg, svgNS, height);

    const morseButton = document.querySelector(".hitorideUtu button");

    const inputManager = new InputManager(morseButton, {
        onPress: () => {
            myLine.startWave();
        },
        onRelease: () => {
            myLine.stopWave();
        }
    })

    function animate() {
        myLine.updatePoints();
        myLine.draw();
        requestAnimationFrame(animate);
    }
    
    function fixedanimete() {
        // myLine.updateRoughness();
        myLine.propagateWave();
        myCup.draw();
    }
    
    setInterval(fixedanimete, 400);
    animate();
});