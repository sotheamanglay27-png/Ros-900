import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const canvas=document.querySelector('#game');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.setClearColor(0x9ec7d6);
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x9ec7d6);
scene.fog=new THREE.Fog(0x9ec7d6,48,125);
const camera=new THREE.PerspectiveCamera(65,innerWidth/innerHeight,.1,220);
const hemi=new THREE.HemisphereLight(0xdcecff,0x4d6040,2.1);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffedc5,3);sun.position.set(-25,40,18);sun.castShadow=true;scene.add(sun);
sun.shadow.mapSize.set(1024,1024);
const mat=(color,roughness=.9)=>new THREE.MeshStandardMaterial({color,roughness});
const groundMat=mat(0x416b3b), houseMat=mat(0xb49a6d), roofMat=mat(0x763f2a), trunkMat=mat(0x5b3921), leafMat=mat(0x245638), rockMat=mat(0x737a73);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(180,180),groundMat);ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
const obstacles=[];
function box(x,y,z,sx,sy,sz,material,obstacle=true){const m=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);if(obstacle)obstacles.push({x,z,hx:sx/2,hz:sz/2,top:sy});return m}
function tree(x,z){const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.22,.32,2,7),trunkMat);trunk.position.set(x,1,z);trunk.castShadow=true;scene.add(trunk);const crown=new THREE.Mesh(new THREE.ConeGeometry(1.5,3.2,7),leafMat);crown.position.set(x,3.25,z);crown.castShadow=true;scene.add(crown);obstacles.push({x,z,hx:.45,hz:.45,top:2})}
for(let i=0;i<15;i++){let x=((i*17)%76)-38,z=((i*23)%76)-38;if(Math.abs(x)<8&&Math.abs(z)<8)continue;tree(x,z)}
for(let i=0;i<11;i++){let x=((i*19)%64)-32,z=((i*13)%64)-32;if(Math.abs(x)<8&&Math.abs(z)<8)continue;box(x,1.25,z,4,2.5,4,houseMat);const roof=new THREE.Mesh(new THREE.ConeGeometry(3.3,1.6,4),roofMat);roof.position.set(x,3.3,z);roof.rotation.y=Math.PI/4;roof.castShadow=true;scene.add(roof)}
// Small Khmer-inspired red-gold welcome arch / landmark.
box(0,1,-10,8,2,1,roofMat,false);box(-3.5,2,-10,.8,4,1,mat(0xd8b34d),false);box(3.5,2,-10,.8,4,1,mat(0xd8b34d),false);
const avatar=new THREE.Group();scene.add(avatar);
const body=new THREE.Mesh(new THREE.CapsuleGeometry(.42,.8,4,8),mat(0x244f8d));body.position.y=1.15;body.castShadow=true;avatar.add(body);
const head=new THREE.Mesh(new THREE.SphereGeometry(.27,12,10),mat(0xc99670));head.position.y=1.9;head.castShadow=true;avatar.add(head);
const pack=new THREE.Mesh(new THREE.BoxGeometry(.45,.55,.22),mat(0x3b493d));pack.position.set(0,1.25,-.38);avatar.add(pack);
const gun=new THREE.Mesh(new THREE.BoxGeometry(.12,.12,1.05),mat(0x202623));gun.position.set(.43,1.2,-.35);avatar.add(gun);
const gun2=new THREE.Mesh(new THREE.BoxGeometry(.15,.22,.18),mat(0x171a18));gun2.position.set(.43,1.05,-.1);avatar.add(gun2);
avatar.position.set(0,0,3);
let yaw=0,pitch=-.13,health=100,started=false,jumpV=0,onGround=true,moveX=0,moveZ=0,fireCooldown=0;
const remotePlayers=new Map();
const $=s=>document.querySelector(s);
function message(s){$('#notice').textContent=s;$('#notice').style.display='block'}
function makeRemote(id,name){if(remotePlayers.has(id))return remotePlayers.get(id);const g=new THREE.Group();const b=new THREE.Mesh(new THREE.CapsuleGeometry(.42,.8,4,8),mat(0xd16b39));b.position.y=1.15;g.add(b);const h=new THREE.Mesh(new THREE.SphereGeometry(.27,12,10),mat(0xc99670));h.position.y=1.9;g.add(h);scene.add(g);g.userData={id,name};remotePlayers.set(id,g);return g}
function updateCamera(){const back=new THREE.Vector3(Math.sin(yaw)*5.5,2.6,Math.cos(yaw)*5.5);camera.position.copy(avatar.position).add(back);camera.position.y+=.5;camera.lookAt(avatar.position.x,1.5+pitch,avatar.position.z)}
function startGame(){started=true;$('#menu').style.display='none';$('#controls').style.display='block';$('#crosshair').style.display='block';$('#status').textContent='Local demo';message('អ្នកចូលសមរភូមិហើយ! Multiplayer ត្រូវការដាក់ Server។');avatar.visible=true;updateCamera()}
$('#play').addEventListener('click',()=>{const n=$('#name').value.trim()||'Player';$('#feed').textContent='អ្នកលេង: '+n+' • Room: '+($('#room').value.trim()||'KHMER123');startGame()});
const stick=$('#stick'),knob=$('#knob');let stickPointer=null,stickOrigin={x:0,y:0};
stick.addEventListener('pointerdown',e=>{stickPointer=e.pointerId;stick.setPointerCapture(e.pointerId);const r=stick.getBoundingClientRect();stickOrigin={x:r.left+r.width/2,y:r.top+r.height/2};moveStick(e)});
stick.addEventListener('pointermove',e=>{if(e.pointerId===stickPointer)moveStick(e)});
function moveStick(e){let dx=e.clientX-stickOrigin.x,dy=e.clientY-stickOrigin.y;const len=Math.hypot(dx,dy),max=42;if(len>max){dx=dx/len*max;dy=dy/len*max}knob.style.transform=`translate(${dx}px,${dy}px)`;moveX=dx/max;moveZ=dy/max}
function resetStick(){stickPointer=null;moveX=0;moveZ=0;knob.style.transform='translate(0,0)'}
stick.addEventListener('pointerup',resetStick);stick.addEventListener('pointercancel',resetStick);
let lookPointer=null,lastLookX=0,lastLookY=0;
$('#look').addEventListener('pointerdown',e=>{lookPointer=e.pointerId;lastLookX=e.clientX;lastLookY=e.clientY;$('#look').setPointerCapture(e.pointerId)});
$('#look').addEventListener('pointermove',e=>{if(lookPointer!==e.pointerId)return;yaw+=(e.clientX-lastLookX)*.012;pitch=Math.max(-.65,Math.min(.25,pitch+(e.clientY-lastLookY)*.006));lastLookX=e.clientX;lastLookY=e.clientY});
$('#look').addEventListener('pointerup',()=>lookPointer=null);
$('#jump').addEventListener('pointerdown',()=>{if(onGround){jumpV=7;onGround=false}});
$('#fire').addEventListener('pointerdown',()=>{if(!started)return;fireCooldown=.18;message('បាញ់! (visual prototype — no damage/network yet)');setTimeout(()=>{if(started)message('សូមស្វែងរកសត្រូវ!')},900)});
addEventListener('keydown',e=>{if(e.key==='w'||e.key==='ArrowUp')moveZ=-1;if(e.key==='s'||e.key==='ArrowDown')moveZ=1;if(e.key==='a'||e.key==='ArrowLeft')moveX=-1;if(e.key==='d'||e.key==='ArrowRight')moveX=1;if(e.key===' ')jumpV=7});
addEventListener('keyup',e=>{if(['w','s','ArrowUp','ArrowDown'].includes(e.key))moveZ=0;if(['a','d','ArrowLeft','ArrowRight'].includes(e.key))moveX=0});
function collide(x,z){for(const o of obstacles){if(Math.abs(x-o.x)<o.hx+.45&&Math.abs(z-o.z)<o.hz+.45)return true}return false}
function animate(){requestAnimationFrame(animate);const dt=Math.min(.035,clock.getDelta());if(started){const forward=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw));const right=new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw));const dir=forward.multiplyScalar(-moveZ).add(right.multiplyScalar(moveX));if(dir.length()>1)dir.normalize();const speed=5.3*dt;const nx=avatar.position.x+dir.x*speed,nz=avatar.position.z+dir.z*speed;if(!collide(nx,avatar.position.z))avatar.position.x=THREE.MathUtils.clamp(nx,-78,78);if(!collide(avatar.position.x,nz))avatar.position.z=THREE.MathUtils.clamp(nz,-78,78);avatar.rotation.y=yaw;avatar.position.y+=jumpV*dt;if(avatar.position.y<=0){avatar.position.y=0;jumpV=0;onGround=true}else jumpV-=19*dt;updateCamera();$('#health').textContent='❤ '+health;$('#players').textContent='👥 '+(1+remotePlayers.size)+' player'+(remotePlayers.size===0?'':'s')}renderer.render(scene,camera)}
const clock=new THREE.Clock();animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight)});
