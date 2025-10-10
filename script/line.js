document.addEventListener('DOMContentLoaded', () => {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    document.body.appendChild(svg);
    
    function redraw() {
        svg.innerHTML = ''; // 既存の内容をクリア

        const cupPath = document.createElementNS(svgNS, "path");
        cupPath.setAttribute('class', 'handwritten-cup');

    const width = window.innerWidth;
    const height = window.innerHeight / 2; // 画面の中央あたりに描画

    const roughness = 5; // 揺れの大きさ
    const segmentsRate = 50; // 1セグメントあたりの長さ
    
    //きれいな紙コップ
    const defaultDots = [
        [0.3*height, 0.4*height], //左上
        [0.3*height, height], //左下
        [1.1*height, 0.9*height], //右下
        [1.1*height, 0.5*height] //右上
    ];

    // 1. ポイントを生成
    const cupPoints = [defaultDots[0]];
    for (let i = 0; i < defaultDots.length; i++) {
        const dx = (i !== 3) ? defaultDots[i + 1][0] - defaultDots[i][0] : defaultDots[0][0] - defaultDots[3][0];
        const dy = (i !== 3) ? defaultDots[i + 1][1] - defaultDots[i][1] : defaultDots[0][1] - defaultDots[3][1];
        const cupSegments = Math.sqrt(dx ** 2 + dy ** 2) / segmentsRate | 0;

        const blur = pointBlur(defaultDots[i], (i !== 3) ? defaultDots[i+1] : defaultDots[0]);

        // 始点を飛ばして終点まで
        for (let j = 0; j <= cupSegments ; j++) {
            const x = defaultDots[i][0] + (dx / cupSegments) * j;
            const y = defaultDots[i][1] + (dy / cupSegments) * j;
            // 終点が大きく揺れないように調整
            const shakeX = (j === cupSegments) ? 0 : (Math.random() - 0.5) * roughness * blur[0];
            const shakeY = (j === cupSegments) ? 0 : (Math.random() - 0.5) * roughness * blur[1];
            cupPoints.push([x + shakeX, y + shakeY]);
        }
    }

    // ポイントのブレを考える関数
    function pointBlur (pointA, pointB) {
        const dx = Math.abs(pointA[0] - pointB[0]);
        const dy = Math.abs(pointA[1] - pointB[1]);
        const sum = dx + dy
        return [dy/sum, dx/sum]
    }

    //  2. ポイントを元に滑らかなパスを作成
    let pathDataCup = `M ${cupPoints[0][0]} ${cupPoints[0][1]}`; //最初の点
    for (let i = 0; i < cupPoints.length - 1; i++) {
        const P0 = cupPoints[i];
        const P1 = cupPoints[i + 1];
        const midPointX = (P0[0] + P1[0]) / 2; //各点の中点を作成
        const midPointY = (P0[1] + P1[1]) / 2;
        pathDataCup += ` Q ${P0[0]} ${P0[1]}, ${midPointX} ${midPointY}`;
    }

    // 最後の点を結ぶ
    pathDataCup += ` L ${cupPoints[cupPoints.length - 1][0]} ${cupPoints[cupPoints.length - 1][1]}`;
        
    drawLine(svg, svgNS);

    cupPath.setAttribute("d", pathDataCup);
    svg.appendChild(cupPath);
    }

    redraw();

    setInterval(redraw, 200); // 3秒ごとに再描画

});

function drawLine(svg, svgNS) {
    const linePath = document.createElementNS(svgNS, 'path');
    linePath.setAttribute('class', 'handwritten-line');

    const width = window.innerWidth;
    const height = window.innerHeight / 2; // 画面の中央あたりに描画

        //きれいな線
    const defaultLines = [
        [height, 0.7*height],
        [width, 0.7*height]
    ];

    const roughness = 5; // 揺れの大きさ
    const segmentsRate = 50; // 1セグメントあたりの長さ

    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        // 位置を右に動かす
        move(){
            this.x += 1;
            this.y += 1; 
        }
    }


    // 1. ポイントを生成
    const linePoints = [];
    const lineSegments = (defaultLines[1][0] - defaultLines[0][0]) / segmentsRate | 0;
    for (let i = 0; i <= lineSegments; i++) {
        const x = defaultLines[0][0] + ( (defaultLines[1][0] - defaultLines[0][0]) / lineSegments) * i;
        const y = defaultLines[0][1] + ( (defaultLines[1][1] - defaultLines[0][1]) / lineSegments) * i;
        const shake = (i === 0 || i === lineSegments) ? 0 : (Math.random() - 0.5) * roughness;
        linePoints.push([x, y + shake]);
    }    

    //  2. ポイントを元に滑らかなパスを作成
    let pathDataLine = `M ${linePoints[0][0]} ${linePoints[0][1]}`; //最初の点
    for (let i = 0; i < linePoints.length - 1; i++) {
        const P0 = linePoints[i];
        const P1 = linePoints[i + 1];
        const midPointX = (P0[0] + P1[0]) / 2; //各点の中点を作成
        const midPointY = (P0[1] + P1[1]) / 2;
        pathDataLine += ` Q ${P0[0]} ${P0[1]}, ${midPointX} ${midPointY}`;
    }

    linePath.setAttribute('d', pathDataLine); // パスの座標 (始点 M x y L 終点 x y)
    svg.appendChild(linePath);
}