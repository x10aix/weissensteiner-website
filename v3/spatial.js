/* Three.js 0.186.1, locally hosted. No scroll hijacking, telemetry or asset CDN. */
const story = document.querySelector('.spatial-story');
const stage = document.querySelector('.spatial-stage');
const view = document.querySelector('.model-view');
const canvas = document.getElementById('house-canvas');
const motionButton = document.getElementById('motion-toggle');
const chapters = document.querySelector('.scene-chapters');
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
  const terrain = new THREE.Group(), ground = new THREE.Group(), upper = new THREE.Group(), roof = new THREE.Group(), wing = new THREE.Group();
  model.add(terrain, ground, upper, roof, wing);
  function box(parent, w, h, d, x, y, z, mat, edges = false) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z); mesh.castShadow = mesh.receiveShadow = true;
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
  box(terrain, 9.2, .18, 6.7, .45, -.42, 0, slab, true);
  box(terrain, 9.1, .025, 6.6, .45, -.315, 0, material(0xe0d9c6));
  for (let x=-4; x<=4.5; x+=.5) line(terrain, [[x,-.297,-3.2],[x,-.297,3.2]], 0xaeb19f, .22);
  for (let z=-3; z<=3; z+=.5) line(terrain, [[-4,-.297,z],[4.9,-.297,z]], 0xaeb19f, .22);
  box(terrain, 7.4, .12, 4.2, .5, -.19, .15, plaster, true);
  box(terrain, 4.3, .04, 1.05, -.1, -.1, 2.65, timber);
  for(let x=-2.2;x<2.1;x+=.16) line(terrain,[[x,-.074,2.13],[x,-.074,3.17]],0x765331,.3);
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
  for(let i=0;i<10;i++) box(ground,.65,.12,.18,1.56,.14+i*.135,-1.45+i*.17,slab);
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
  // A lower garden wing gives the model an asymmetric, open silhouette.
  box(wing,2.1,.14,2.8,3.45,.02,-.35,slab,true);
  box(wing,2.1,1.18,.15,3.45,.67,-1.68,timber,true);
  box(wing,.15,1.18,2.8,4.43,.67,-.35,timber,true);
  for(let z=-1.66;z<1;z+=.13) box(wing,.025,1.18,.035,4.52,.67,z,paleFrame);
  box(wing,2.12,.12,2.88,3.45,1.31,-.35,plaster,true);
  box(wing,2,1.13,.025,3.45,.68,1.02,glass);
  for(const x of [2.47,3.45,4.42])box(wing,.045,1.2,.055,x,.67,1.04,frameMat);
  box(wing,2,.045,.055,3.45,.11,1.04,frameMat);
  // Guide lines connect corresponding corners in the exploded view.
  const guides=new THREE.Group();model.add(guides);
  for(const x of [-2.4,2.4])for(const z of [-1.8,1.8])line(guides,[[x,.15,z],[x,5.9,z]],0x898d78,.38,true);
  const shadow=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.13}));
  shadow.rotation.x=-Math.PI/2;shadow.position.y=-.54;shadow.receiveShadow=true;scene.add(shadow);

  let target=0, current=0, phase=-1, paused=false, visible=true, pointerX=0, pointerY=0, smoothX=0, smoothY=0;
  let size={width:1,height:1}, last=0;
  const states=[['Raum.','Zum<br>Weiterdenken.'],['Form.','Aus vielen<br>guten Ideen.'],['Plan.','Für Ihren<br>nächsten Schritt.']];
  const clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,n));
  const smooth=n=>{const v=clamp(n);return v*v*(3-2*v);};
  const still=()=>paused||reduced.matches;
  function readScroll() {
    const rect=story.getBoundingClientRect();
    const distance=story.offsetHeight-stage.offsetHeight;
    target=still()? .5 : clamp(-rect.top/Math.max(1,distance));
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
    if(still()) {current=.5;pointerX=pointerY=smoothX=smoothY=0;}
    readScroll();
  }
  function render(now) {
    frame=0;
    if(failed||!visible||document.hidden)return;
    const dt=Math.min(64,now-last||16);last=now;
    const ease=1-Math.exp(-dt/95);
    current=still()? .5 : current+(target-current)*ease;
    smoothX+=(pointerX-smoothX)*ease;smoothY+=(pointerY-smoothY)*ease;
    const assemble=smooth(current/.5), open=smooth((current-.62)/.38);
    ground.position.y=.43*(1-assemble);
    upper.position.set(-.22*(1-assemble),1.57+1.1*(1-assemble),0);
    roof.position.set(.15*(1-assemble)+.35*open,2.94+2.24*(1-assemble)+1.65*open,-.9*open);
    roof.rotation.z=.055*(1-assemble)-.035*open;
    wing.position.set(.5*(1-assemble),.34*(1-assemble),.13*(1-assemble));
    guides.visible=assemble<.92;
    model.rotation.y=-.12+current*.56+smoothX*.055;
    const elevation=.58+open*.32+smoothY*.02;
    camera.position.set(11*Math.cos(.93),6.4+elevation*5,11*Math.sin(.93));
    const lookY=2.35+.55*(1-assemble)+.35*open-(size.width>size.height?.25:0);
    camera.lookAt(.35,lookY,0);
    const aspect=size.width/Math.max(1,size.height);
    const height=Math.max(11.3,11.4/aspect);
    camera.left=-height*aspect/2;camera.right=height*aspect/2;camera.top=height/2;camera.bottom=-height/2;
    camera.zoom=1+.04*assemble-.04*open;
    camera.updateProjectionMatrix();
    renderer.render(scene,camera);
    const nextPhase=still()?0:current<.27?0:current<.68?1:2;
    if(nextPhase!==phase) {
      phase=nextPhase;
      document.querySelector('.hero-word').textContent=states[phase][0];
      document.querySelector('.hero-thought').innerHTML=states[phase][1];
      chapterButtons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===phase)));
      story.dataset.scenePhase=String(phase+1);
    }
    document.querySelector('.scene-progress span').style.transform=`scaleX(${still()?0:current})`;
    story.dataset.sceneProgress=current.toFixed(3);
    if(!view.classList.contains('is-ready')) {view.classList.add('is-ready');story.dataset.renderState='webgl';}
    if(Math.abs(target-current)>.0003||Math.abs(pointerX-smoothX)>.001||Math.abs(pointerY-smoothY)>.001)requestRender();
  }
  function requestRender(){if(!frame&&!failed&&visible&&!document.hidden)frame=requestAnimationFrame(render);}
  chapterButtons.forEach(button=>button.addEventListener('click',()=>{
    const distance=story.offsetHeight-stage.offsetHeight;
    window.scrollTo({top:story.offsetTop+distance*Number(button.dataset.scene),behavior:reduced.matches?'instant':'smooth'});
  }));
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
