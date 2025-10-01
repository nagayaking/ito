document.addEventListener('DOMContentLoaded', () => {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    const path = document.createElementNS(svgNS, "path");
    const path2 = document.createElementNS(svgNS, "path");
    path.setAttribute('class', 'handwritten-line');
    path2.setAttribute("class", "kamikoppu")

    const width = window.innerWidth;
    const height = window.innerHeight / 2; // 画面の中央あたりに描画

    const segments = 15; // 線のアンカーポイント数
    const roughness = 8; // 揺れの大きさ
    const segmentsRate = 40; // 1セグメントあたりの長さ
    
    //きれいな紙コップ
    const defaultDots = [
        [0.3*height, 0.4*height], //左上
        [0.3*height, height], //左下
        [1.1*height, 0.9*height], //右下
        [1.1*height, 0.5*height] //右上
    ];

const f = `M ${0.3*height} ${0.4*height} v ${0.6*height} l ${0.8*height} ${-0.1*height} v ${-0.4*height} z`

    // 1. ポイントを生成
    const cupPoints = [defaultDots[0]];
    for (let i = 0; i < defaultDots.length; i++) {
        const dx = Math.abs((i !== 3) ? defaultDots[i][0] - defaultDots[i+1][0] : defaultDots[3][0] - defaultDots[0][0]);
        const dy = Math.abs((i !== 3) ? defaultDots[i][1] - defaultDots[i+1][1] : defaultDots[3][1] - defaultDots[0][1]);
        const cupSegments = Math.sqrt(dx ** 2 + dy ** 2) / segmentsRate | 0;

        const blur = pointBlur(defaultDots[i], (i !== 3) ? defaultDots[i+1] : defaultDots[0]);

        // 始点を飛ばして終点まで
        for (let j = 1; j <= cupSegments ; j++) {
            const x = defaultDots[i][0] + (dx / cupSegments) * j;
            const y = defaultDots[i][1] + (dy / cupSegments) * j;
            // 終点が大きく揺れないように調整
            const shakeX = (j === cupSegments) ? 0 : (Math.random() - 0.5) * roughness * blur[0];
            const shakeY = (j === cupSegments) ? 0 : (Math.random() - 0.5) * roughness * blur[1];
            cupPoints.push([x + shakeX, y + shakeY]);
        }
    }
    console.log(cupPoints);

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

    // 1. ポイントを生成
    const points = [];
    for (let i = 0; i <= segments; i++) {
        const x = (width / segments) * i;
        // 端が大きく揺れないように調整
        const shake = (i === 0 || i === segments) ? 0 : (Math.random() - 0.5) * roughness;
        points.push([x, height + shake]);
    }

    // 2. ポイントを元に滑らかなパスを作成
    let pathData = `M ${points[0][0]} ${points[0][1]}`; //最初の点
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const midPointX = (p0[0] + p1[0]) / 2; //各点の中点を作成
        const midPointY = (p0[1] + p1[1]) / 2;
        pathData += ` Q ${p0[0]} ${p0[1]}, ${midPointX} ${midPointY}`;
    }
    // 最後の点を結ぶ
    pathData += ` L ${points[points.length - 1][0]} ${points[points.length - 1][1]}`;

    path.setAttribute("d", pathDataCup);
    path2.setAttribute('d', pathData);
    svg.appendChild(path);
    svg.appendChild(path2);
    document.body.appendChild(svg);

    
});