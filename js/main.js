gsap.registerPlugin(PixiPlugin);

console.clear();

select = e => document.querySelector(e);
selectAll = e => document.querySelectorAll(e);

const stage = select('.stage');
const app = new PIXI.Application({
    width: 716,
    height: 724,
	backgroundColor: 0xDAE0D2,
	antialias: true
});
const gridSize = 11;
const numContainers = gridSize*gridSize;
const circD = 63; // circle diameter
const circOffsetX = 0.11111; // circle2/3 x offset
const circOffsetY = 0.15873; // circle2/3 y offset
const color1 = 0x01AFF6; // blue
const color2 = 0xF20085; // pink
const color3 = 0xFFD036; // yellow
const animDuration = 0.8;
const bandText = new SplitText('.band', {type:"chars", charsClass:"char", position: "relative" });
const detailsText = new SplitText('.details p', {type:"lines", charsClass:"line", position: "relative" });


function init() {
	gsap.set(stage, { autoAlpha: 1 });
	stage.appendChild(app.view);

	app.ticker.stop(); // Stop Pixi ticker using stop() function

	gsap.ticker.add(() => { // Now, use 'tick' from gsap
		app.ticker.update();
	});

	for (let i = 0; i < gridSize; i++) {

		for (let j = 0; j < gridSize; j++) {

			const container = new PIXI.Container();
			const circContainer1 = new PIXI.Container();
			const circContainer2 = new PIXI.Container();
			const circContainer3 = new PIXI.Container();

			const circle1 = new PIXI.Graphics();
			circle1.lineStyle(0); // No outline
			circle1.beginFill(color1, 1);
			circle1.drawCircle(0, 0, circD/2);
			circle1.endFill();
			circle1.blendMode = PIXI.BLEND_MODES.MULTIPLY;
			circContainer1.addChild(circle1);
			circContainer1.x = 0;
			circContainer1.y = 0;
			container.addChild(circContainer1);

			const circle2 = new PIXI.Graphics();
			circle2.lineStyle(0); // No outline
			circle2.beginFill(color2, 1);
			circle2.drawCircle(0, 0, circD/2);
			circle2.endFill();
			circle2.blendMode = PIXI.BLEND_MODES.MULTIPLY;
			circContainer2.addChild(circle2);
			circContainer2.x = -circOffsetX*circD;
			circContainer2.y = circOffsetY*circD;
			container.addChild(circContainer2);

			const circle3 = new PIXI.Graphics();
			circle3.lineStyle(0); // No outline
			circle3.beginFill(color3, 1);
			circle3.drawCircle(0, 0, circD/2);
			circle3.endFill();
			circle3.blendMode = PIXI.BLEND_MODES.MULTIPLY;
			circContainer3.addChild(circle3);
			circContainer3.x = circOffsetX*circD;
			circContainer3.y = circOffsetY*circD;
			container.addChild(circContainer3);

			app.stage.addChild(container);

			// Position the 3 circle container
			container.x = i*circD + circD/2 + i*2;
			container.y = j*circD + circD/2 + j*2;
		}

	}

	app.stage.x = 2;
}

function animate() {
	gsap.timeline({ delay: 0.2 }).from(app.stage.children, {
		pixi: { scale: 0, rotation: 360 },
		duration: 2,
		ease: 'power4',
		stagger: {
			each: 0.1,
            grid: [gridSize, gridSize],
			from: [0, 1]
		}
	})
	.to(app.stage.children, {
		duration: animDuration,
		ease: 'sine.inOut',
		stagger: {
			each: 0.1,
			repeat: -1,
			yoyo: true,
			grid: [gridSize, gridSize],
			from: [0, 1],
			onStart: function() {
				gsap.to(this.targets()[0].children, { 
					pixi: { scale: 0.15 },
					duration: animDuration,
					ease: 'sine.inOut',
					repeat: -1,
					yoyo: true
				})
			}
		}
	}, 0.1)
	.from('.band .char', {
		duration: 2,
		y: 150,
		stagger: 0.05,
		scrambleText:{ text: "x", chars: "lowerCase", speed: 0.3, delimiter:" ", tweenLength: false },
		ease: 'expo'
	}, 0.5)
	.from('.details span',{
		duration: 1.5,
		y: 50,
		opacity: 0,
		ease: 'expo',
		stagger: 0.1
	}, 0.9)
}

function resize() {
	let vh = window.innerHeight;
	let sh = stage.offsetHeight;
	let scaleFactor = vh/sh;
	if(scaleFactor<1) {
		gsap.set(stage, { scale: scaleFactor });
	}
	else {
        gsap.set(stage, { scale: 1 });
    }
}

window.onresize = resize;

window.onload = () => {
	init();
	resize();
	animate();
};