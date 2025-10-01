document.addEventListener('DOMContentLoaded', () => {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute('class', 'handwritten-line');

    const width = window.innerWidth;
    const height = window.innerHeight / 2; // 画面の中央あたりに描画
    const segments = 15; // 線のアンカーポイント数
    const roughness = 8; // 揺れの大きさ

    console.log(`横幅${width}、縦幅${height}`) //1280,322.5

    // 1. ポイントを生成
    const points = [];
    for (let i = 0; i <= segments; i++) {
        const x = (width / segments) * i;
        // 端が大きく揺れないように調整
        const shake = (i === 0 || i === segments) ? 0 : (Math.random() - 0.5) * roughness;
        points.push([x, height + shake]);
    }
    console.log(points);

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
    console.log(pathData);

    path.setAttribute('d', pathData);
    svg.appendChild(path);
    document.body.appendChild(svg);
});