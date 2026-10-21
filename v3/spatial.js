/* Three.js 0.186.1, locally hosted. No scroll hijacking, telemetry or asset CDN. */
import { buildState, ramp } from './build-timeline.mjs?v=3.2';
const story = document.querySelector('.spatial-story');
const stage = document.querySelector('.spatial-stage');
const view = document.querySelector('.model-view');
const canvas = document.getElementById('house-canvas');
const motionButton = document.getElementById('motion-toggle');
const chapters = document.querySelector('.scene-chapters');
const scrubber = document.getElementById('build-progress');
const chapterButtons = [...chapters.querySelectorAll('button')];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let renderer, frame = 0, failed = false;

function fallback() {
  failed = true;
  cancelAnimationFrame(frame);
  view.classList.remove('is-ready');
  story.classList.remove('is-interactive');
  story.classList.add('is-still');
  story.dataset.renderState = 'illustration';
  chapters.hidden = motionButton.hidden = true;
  renderer?.dispose();
}

try {
  const THREE = await import('./vendor/three.module.js');
  const scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({canvas, alpha: true, antialias: true, powerPreference: 'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.setClearColor(0xeae7df, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  const camera = new THREE.OrthographicCamera(-7, 7, 5, -5, .1, 100);
  const focusCenter = new THREE.Vector3(), focusCorner = new THREE.Vector3();
  const cameraOffset = new THREE.Vector3();
  scene.add(new THREE.HemisphereLight(0xfff6e8, 0x718075, 2.6));
  const sun = new THREE.DirectionalLight(0xffecd2, 4.5);
  sun.position.set(-4, 10, 6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, {left:-10, right:10, top:12, bottom:-8, near:.5, far:35});
  sun.shadow.bias = -.00025;
  sun.shadow.normalBias = .025;
  sun.shadow.radius = 3;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xecf1e9, 1.5);
  fill.position.set(5, 4, -3);
  scene.add(fill);

  const material = (color, options = {}) => new THREE.MeshStandardMaterial({color, roughness:.85, ...options});
  const plaster = material(0xf2edde), slab = material(0xd8cfbb), timber = material(0xb37b50);
  const copper = material(0xa75335, {roughness:.63, metalness:.18});
  const frameMat = material(0x3c4840), paleFrame = material(0xc2bcaa);
  const glass = material(0x708d84, {roughness:.22, metalness:.3, transparent:true, opacity:.57, depthWrite:false});
  const grass = material(0x87916b), leaves = material(0x536a4c), trunkMat = material(0x897051);
  const edgeMat = new THREE.LineBasicMaterial({color:0x5f6757, transparent:true, opacity:.22});
  const model = new THREE.Group(); scene.add(model);
  const terrain = new THREE.Group(), ground = new THREE.Group(), upper = new THREE.Group(), roof = new THREE.Group(), stairs = new THREE.Group();
  const garageBase = new THREE.Group(), garageWalls = new THREE.Group(), garageDoor = new THREE.Group(), garageRoof = new THREE.Group();
  const pergolaBase = new THREE.Group(), pergolaPosts = new THREE.Group(), pergolaBeams = new THREE.Group(), pergolaSlats = new THREE.Group();
  model.add(terrain, ground, upper, roof, stairs, garageBase, garageWalls, garageDoor, garageRoof, pergolaBase, pergolaPosts, pergolaBeams, pergolaSlats);
  function box(parent, w, h, d, x, y, z, mat, edges = false) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z); mesh.castShadow = mesh.receiveShadow = true;
    mesh.userData.homeY = y; mesh.userData.height = h;
    parent.add(mesh);
    if (edges) mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat));
    return mesh;
  }
  function line(parent, points, color = 0x8e917c, opacity = .65, dashed = false) {
    const geometry = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(...p)));
    const mat = dashed ? new THREE.LineDashedMaterial({color, transparent:true, opacity, dashSize:.08, gapSize:.06}) : new THREE.LineBasicMaterial({color, transparent:true, opacity});
    const item = new THREE.Line(geometry, mat);
    if (dashed) item.computeLineDistances();
    parent.add(item); return item;
  }
  // A physical presentation base, with a drawing grid and dimension marks.
  box(terrain, 10, .18, 9, .5, -.42, 1.3, slab, true);
  box(terrain, 9.9, .025, 8.9, .5, -.315, 1.3, material(0xd4d5bd));
  for (let x=-4; x<=5; x+=.5) line(terrain, [[x,-.297,-3],[x,-.297,5.6]], 0xaeb19f, .22);
  for (let z=-3; z<=5.5; z+=.5) line(terrain, [[-4.4,-.297,z],[5.4,-.297,z]], 0xaeb19f, .22);
  box(terrain, 5, .12, 3.8, 0, -.19, 0, plaster, true);
  // Low planting bands keep the scene recognizably architectural rather than a toy world.
  box(terrain, 1.25, .08, 4.8, -3.32, -.23, -.2, grass);
  box(terrain, 1.7, .08, 1.6, 4.08, -.23, -2.35, grass);
  function tree(x,z,scale=1) {
    const g=new THREE.Group(); terrain.add(g); g.position.set(x,-.17,z);g.scale.setScalar(scale);
    const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.025,.045,.85,7),trunkMat);trunk.position.y=.42;trunk.castShadow=true;g.add(trunk);
    const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(.5,2),leaves);crown.scale.set(.82,1.22,.85);crown.position.y=1.18;crown.castShadow=true;g.add(crown);
  }
  tree(-3.4,-1.85,1.05);tree(-3.3,.85,.83);tree(4.15,-2.3,.92);
  const dimension = new THREE.Group(); terrain.add(dimension);
  line(dimension,[[-2.6,-.28,3.37],[2.6,-.28,3.37]],0xa75335,.8);
  for(const x of [-2.6,2.6]) line(dimension,[[x-.1,-.28,3.23],[x+.1,-.28,3.49]],0xa75335,.8);
  line(dimension,[[-4.15,-.28,-2],[-4.15,-.28,2]],0xa75335,.8);
  for(const z of [-2,2]) line(dimension,[[-4.27,-.28,z-.1],[-4.03,-.28,z+.1]],0xa75335,.8);
  // Ground floor: a cutaway of a simple, illustrative dwelling.
  box(ground, 4.8, .15, 3.6, 0, .03, 0, slab, true);
  box(ground, 4.8, 1.4, .17, 0, .8, -1.72, plaster, true);
  box(ground, .18, 1.4, 3.6, -2.31, .8, 0, plaster, true);
  box(ground, .18, 1.4, 1.7, 2.31, .8, -.93, plaster, true);
  box(ground, .13, 1.35, 1.7, .4, .77, -.85, plaster);
  box(ground, 1.8, 1.35, .13, -1.25, .77, -.5, plaster);
  box(ground, 4.65, .15, .17, 0, 1.43, 1.72, plaster);
  for(const x of [-2.25,-1.1,.05,1.2,2.25]) box(ground,.042,1.3,.06,x,.75,1.74,frameMat);
  box(ground,4.5,.045,.06,0,.12,1.74,frameMat);
  box(ground,4.5,1.24,.025,0,.76,1.72,glass);
  box(ground,.025,1.22,1.75,2.31,.77,.85,glass);
  box(ground,.055,1.3,.055,2.31,.75,.02,frameMat);
  // Interior details remain visible while the floors separate.
  box(ground,1.15,.34,.65,-1.35,.3,.86,material(0xd6c4a9));
  box(ground,1.15,.32,.13,-1.35,.55,1.1,material(0xd6c4a9));
  box(ground,.65,.09,.38,-.3,.34,.91,timber);
  box(ground,.06,.3,.06,-.3,.2,.91,frameMat);
  box(ground,1.25,.06,.62,1.13,.66,.8,timber);
  for(const x of [.65,1.6]) for(const z of [.58,1.02]) box(ground,.05,.55,.05,x,.36,z,frameMat);
  for(let i=0;i<10;i++) box(stairs,.65,.12,.18,1.56,.14+i*.135,-1.45+i*.17,slab);
  // Upper floor: plaster, glazing and fine vertical timber battens.
  box(upper,4.95,.17,3.75,0,0,0,slab,true);
  box(upper,4.8,1.25,.16,0,.69,-1.72,plaster,true);
  box(upper,.18,1.25,3.6,-2.31,.69,0,plaster,true);
  box(upper,.18,1.25,1.7,2.31,.69,-.93,plaster,true);
  box(upper,.13,1.25,3.4,-.35,.69,0,plaster);
  box(upper,2.05,1.25,.16,-1.3,.69,1.72,timber);
  for(let x=-2.28;x<-.3;x+=.13) box(upper,.04,1.25,.035,x,.69,1.82,paleFrame);
  box(upper,2.6,1.13,.025,1.02,.7,1.72,glass);
  box(upper,2.75,.1,.17,1,1.27,1.72,plaster);
  for(const x of [-.3,.56,1.42,2.27]) box(upper,.04,1.2,.065,x,.69,1.76,frameMat);
  box(upper,2.7,.045,.065,1,.12,1.76,frameMat);
  box(upper,.025,1.14,1.72,2.31,.69,.85,glass);
  box(upper,.05,1.2,.05,2.31,.69,.02,frameMat);
  box(upper,1.15,.21,1.5,-1.32,.23,-.32,material(0xdfd6c3));
  box(upper,1.2,.42,.07,-1.32,.32,-1.1,timber);
  box(upper,1,.21,1.5,.85,.23,-.32,material(0xdfd6c3));
  // Pitched copper roof, separate from the gable walls, with standing seams.
  const pitch=Math.atan2(1.2,2.52), slope=Math.hypot(2.52,1.2);
  for(const side of [-1,1]) {
    const plane=box(roof,slope,.09,4.05,side*1.26,.6,0,copper,true);
    plane.rotation.z=-side*pitch;
    for(let z=-1.95;z<2;z+=.24) {
      const seam=box(roof,slope,.027,.014,side*1.26,.66,z,copper);
      seam.rotation.z=-side*pitch;
    }
  }
  const gableShape=new THREE.Shape();gableShape.moveTo(-2.4,0);gableShape.lineTo(0,1.14);gableShape.lineTo(2.4,0);gableShape.closePath();
  const gableGeo=new THREE.ExtrudeGeometry(gableShape,{depth:.12,bevelEnabled:false});
  for(const z of [-1.78,1.66]) {const mesh=new THREE.Mesh(gableGeo,plaster);mesh.position.z=z;mesh.castShadow=mesh.receiveShadow=true;roof.add(mesh);}
  // Garage: its own foundations, opaque walls, sectional door and flat roof.
  box(garageBase,2.48,.15,3.45,3.75,-.02,-.1,slab,true);
  box(garageBase,2.3,.035,3.65,3.75,-.27,3.38,material(0xc1c0b2));
  box(garageWalls,2.35,1.34,.16,3.75,.72,-1.67,plaster,true);
  for(const x of [2.655,4.845]) box(garageWalls,.16,1.34,3.3,x,.72,-.1,plaster,true);
  box(garageWalls,2.35,.19,.16,3.75,1.295,1.47,plaster,true);
  box(garageDoor,2.02,1.16,.055,3.75,.66,1.565,frameMat,true);
  for(let y=.14;y<1.2;y+=.16) box(garageDoor,2.01,.012,.015,3.75,y,1.6,paleFrame);
  box(garageDoor,.26,.035,.03,3.75,.48,1.62,paleFrame);
  box(garageRoof,2.58,.15,3.55,3.75,1.465,-.1,slab,true);
  box(garageRoof,2.4,.025,3.38,3.75,1.552,-.1,material(0x859078));
  // Open pergola: a timber deck, separate posts, beams, then individual rafters.
  box(pergolaBase,3.4,.1,2.85,-.9,-.2,3.5,timber,true);
  for(let x=-2.5;x<.8;x+=.14) box(pergolaBase,.009,.006,2.8,x,-.146,3.5,material(0x946344));
  for(const x of [-2.4,.6])for(const z of [2.3,4.65])box(pergolaPosts,.11,1.92,.11,x,.81,z,timber,true);
  for(const x of [-2.4,.6])box(pergolaBeams,.14,.18,2.72,x,1.84,3.475,timber,true);
  for(const z of [2.3,4.65])box(pergolaBeams,3.32,.18,.14,-.9,1.84,z,timber,true);
  for(let i=0;i<12;i++)box(pergolaSlats,3.32,.14,.075,-.9,2,2.18+i*.235,timber,true);
  // Fine construction guides emphasize the gap while the roof is being lifted.
  const guides=new THREE.Group();model.add(guides);
  for(const x of [-2.4,2.4])for(const z of [-1.8,1.8])line(guides,[[x,.15,z],[x,4.87,z]],0x898d78,.38,true);
  const shadow=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.13}));
  shadow.rotation.x=-Math.PI/2;shadow.position.y=-.54;shadow.receiveShadow=true;scene.add(shadow);

  let target=0, current=0, phase=-1, paused=false, visible=true, pointerX=0, pointerY=0, smoothX=0, smoothY=0;
  let size={width:1,height:1}, last=0;
  const states=[
    {word:'Neu.',thought:'Von Grund<br>auf.',label:'01 / Neubau',copy:'Vom Fundament über die Wände<br>bis zum fertigen Haus.',intent:'Neubau',note:'Ein Haus entsteht.'},
    {word:'Mehr.',thought:'Nach oben<br>weiterdenken.',label:'02 / Ausbau',copy:'Dach anheben. Geschoss ergänzen.<br>Mehr Platz am selben Ort.',intent:'Zubau / Ausbau',note:'Ein Stockwerk kommt hinzu.'},
    {word:'Weiter.',thought:'In den Garten<br>weiterdenken.',label:'03 / Zubau',copy:'Garage und offene Pergola.<br>Neue Möglichkeiten im Garten.',intent:'Kleines Bauvorhaben',note:'Garage und Pergola entstehen.'}
  ];
  const clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,n));
  const still=()=>paused||reduced.matches;
  function readScroll() {
    const rect=story.getBoundingClientRect();
    story.classList.toggle('has-started',!still()&&rect.top < -144);
    const distance=story.offsetHeight-stage.offsetHeight;
    target=still()? 1 : clamp(-rect.top/Math.max(1,distance));
    requestRender();
  }
  function resize() {
    size={width:view.clientWidth,height:view.clientHeight};
    renderer.setSize(size.width,size.height,false);
    readScroll();
  }
  function updateMode() {
    const oldTop=story.getBoundingClientRect().top;
    const oldHeight=story.offsetHeight;
    story.classList.toggle('is-still',still());
    story.classList.toggle('is-interactive',!still());
    chapters.hidden=false;
    motionButton.hidden=reduced.matches;
    motionButton.setAttribute('aria-pressed',String(paused));
    motionButton.innerHTML=paused?'Bewegung zulassen <span aria-hidden="true">▶</span>':'Bewegung anhalten <span aria-hidden="true">Ⅱ</span>';
    // Maintain document position when a user collapses the scroll sequence.
    if(still()&&oldTop<0&&oldTop+oldHeight>0) window.scrollTo({top:story.offsetTop,behavior:'instant'});
    if(still()) {current=1;pointerX=pointerY=smoothX=smoothY=0;}
    readScroll();
    current=target;
  }
  function render(now) {
    frame=0;
    if(failed||!visible||document.hidden)return;
    const dt=Math.min(64,now-last||16);last=now;
    const ease=1-Math.exp(-dt/95);
    current=still()? 1 : current+(target-current)*ease;
    smoothX+=(pointerX-smoothX)*ease;smoothY+=(pointerY-smoothY)*ease;
    const build=buildState(current);
    function grow(mesh,amount){
      mesh.visible=amount>.001;
      mesh.scale.y=Math.max(.001,amount);
      mesh.position.y=mesh.userData.homeY-mesh.userData.height/2*(1-amount);
    }
    function growGroup(group,amount){group.children.forEach(mesh=>grow(mesh,amount));}
    function arrive(group,amount,lift=1){group.visible=amount>.001;group.position.y=lift*(1-amount);}
    ground.children.forEach((mesh,index)=>{
      const isWindow=mesh.material===glass||mesh.material===frameMat;
      grow(mesh,index===0?1:isWindow?build.windows:build.walls);
    });
    upper.visible=build.floor>.001;
    upper.position.set(build.upperX,build.upperY,0);
    upper.scale.setScalar(.86+.14*build.floor);
    stairs.visible=build.floor>.15;
    roof.position.set(0,build.roofY,0);
    roof.rotation.z=.025*(1-build.firstRoof);
    guides.visible=build.guides>.02;
    arrive(garageBase,build.garageBase,.3);
    growGroup(garageWalls,build.garageWalls);
    arrive(garageDoor,build.garageDoor,.7);
    arrive(garageRoof,build.garageRoof,1.1);
    arrive(pergolaBase,build.pergolaBase,.25);
    pergolaPosts.children.forEach((mesh,i)=>grow(mesh,ramp(current,.85+i*.008,.89+i*.008)));
    arrive(pergolaBeams,build.pergolaBeams,.7);
    pergolaSlats.children.forEach((mesh,i)=>{
      const p=ramp(current,.922+i*.003,.942+i*.003);
      mesh.visible=p>.001;mesh.position.y=mesh.userData.homeY+.7*(1-p);
    });
    model.rotation.y=-.12+.1*build.firstRoof-.19*build.gardenView+smoothX*.055;
    const roofHigh=build.lift*(1-build.reseat);
    // Frame the architecture, not the outer display plinth. The view opens
    // continuously toward the garden only when the third story begins.
    const bounds={left:-2.7,right:2.7+2.4*build.gardenView,back:-2.1,front:2.1+2.9*build.gardenView,bottom:-.3,top:build.roofY+1.32};
    model.updateMatrixWorld(true);
    focusCenter.set((bounds.left+bounds.right)/2,(bounds.bottom+bounds.top)/2,(bounds.back+bounds.front)/2).applyMatrix4(model.matrixWorld);
    cameraOffset.set(11*Math.cos(.93),8.8+.4*roofHigh-.5*build.gardenView+smoothY*.1,11*Math.sin(.93));
    camera.position.copy(focusCenter).add(cameraOffset);
    camera.lookAt(focusCenter);
    camera.updateMatrixWorld(true);
    let halfWidth=0,halfHeight=0;
    for(const x of [bounds.left,bounds.right])for(const y of [bounds.bottom,bounds.top])for(const z of [bounds.back,bounds.front]){
      focusCorner.set(x,y,z).applyMatrix4(model.matrixWorld).applyMatrix4(camera.matrixWorldInverse);
      halfWidth=Math.max(halfWidth,Math.abs(focusCorner.x));
      halfHeight=Math.max(halfHeight,Math.abs(focusCorner.y));
    }
    const aspect=size.width/Math.max(1,size.height);
    const height=Math.max(halfHeight*2,halfWidth*2/aspect)*1.06;
    camera.left=-height*aspect/2;camera.right=height*aspect/2;camera.top=height/2;camera.bottom=-height/2;
    camera.zoom=1;
    camera.updateProjectionMatrix();
    renderer.render(scene,camera);
    const nextPhase=build.phase;
    if(nextPhase!==phase) {
      phase=nextPhase;
      document.querySelector('.hero-word').textContent=states[phase].word;
      document.querySelector('.hero-thought').innerHTML=states[phase].thought;
      document.getElementById('chapter-label').textContent=states[phase].label;
      document.querySelector('.annotation-top span:first-child').textContent=String(phase+1).padStart(2,'0');
      document.querySelector('.hero-invitation p').innerHTML=states[phase].copy;
      document.querySelector('.spatial-cta').dataset.intent=states[phase].intent;
      document.querySelector('.annotation-bottom span:last-child').textContent=states[phase].note;
      chapterButtons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===phase)));
      story.dataset.scenePhase=String(phase+1);
    }
    document.querySelector('.scene-progress span').style.transform=`scaleX(${still()?0:current})`;
    story.dataset.sceneProgress=current.toFixed(3);
    document.getElementById('construction-step').textContent=still()?'Neubau · Ausbau · Zubau':build.step;
    scrubber.value=Math.round(target*1000);
    scrubber.setAttribute('aria-valuetext',states[build.phase].label.slice(5)+': '+build.step);
    story.dataset.buildState=JSON.stringify({roofY:+build.roofY.toFixed(3),floor:+build.floor.toFixed(3),garage:+build.garageWalls.toFixed(3),pergola:+build.pergolaSlats.toFixed(3)});
    if(!view.classList.contains('is-ready')) {view.classList.add('is-ready');story.dataset.renderState='webgl';}
    if(Math.abs(target-current)>.0003||Math.abs(pointerX-smoothX)>.001||Math.abs(pointerY-smoothY)>.001)requestRender();
  }
  function requestRender(){if(!frame&&!failed&&visible&&!document.hidden)frame=requestAnimationFrame(render);}
  chapterButtons.forEach(button=>button.addEventListener('click',()=>{
    const distance=story.offsetHeight-stage.offsetHeight;
    window.scrollTo({top:story.offsetTop+distance*Number(button.dataset.scene),behavior:reduced.matches?'instant':'smooth'});
  }));
  scrubber.addEventListener('input',()=>{
    const distance=story.offsetHeight-stage.offsetHeight;
    window.scrollTo({top:story.offsetTop+distance*Number(scrubber.value)/1000,behavior:'instant'});
    readScroll();
  });
  motionButton.addEventListener('click',()=>{paused=!paused;updateMode();});
  window.addEventListener('scroll',readScroll,{passive:true});
  window.addEventListener('resize',resize,{passive:true});
  reduced.addEventListener('change',updateMode);
  stage.addEventListener('pointermove',event=>{
    if(still()||event.pointerType!=='mouse')return;
    pointerX=event.clientX/innerWidth-.5;pointerY=event.clientY/innerHeight-.5;requestRender();
  },{passive:true});
  stage.addEventListener('pointerleave',()=>{pointerX=pointerY=0;requestRender();});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){last=0;readScroll();}else{cancelAnimationFrame(frame);frame=0;}},{rootMargin:'120px'}).observe(stage);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){last=0;readScroll();}else{cancelAnimationFrame(frame);frame=0;}});
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();fallback();});
  new ResizeObserver(resize).observe(view);
  updateMode();resize();
} catch(error) {
  console.warn('Räumliche Ansicht nicht verfügbar; Illustration bleibt sichtbar.',error);
  fallback();
}
