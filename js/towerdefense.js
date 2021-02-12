var canvas = document.querySelector("canvas");
var BuyDiv = document.querySelector("#Buy");
var BuyTitle = document.querySelector("#Buy > h1");
var BuyButtons = document.querySelectorAll("#Buy > input");
var UpDiv = document.querySelector("#Upgrades");
var UpButtons = document.querySelectorAll("#Upgrades > input");
var UpTitle = document.querySelector("#Upgrades > h1");
var ResDiv = document.querySelector("#Resultats");
var resTitle = document.querySelector("#Resultats>h1")
var ctx = canvas.getContext("2d");
var background;
var Path;
var map;
var Canon1 = document.querySelector("#Canon1");
var Canon2 = document.querySelector("#Canon2");
var Canon3 = document.querySelector("#Canon3");

var Sniper1 = document.querySelector("#Sniper1");
var Sniper2 = document.querySelector("#Sniper2");
var Sniper3 = document.querySelector("#Sniper3");

var Four1 = document.querySelector("#Four1");
var Four2 = document.querySelector("#Four2");
var Four3 = document.querySelector("#Four3");

var mousePosX;
var mousePosY;
var Buying;
var TargetTimeout = 0;
var canPlace = true;

var selected;
var TowerList;
var PossiblesTargets;
var animation;
var vie;
var Wave;
var Delay;
var tower;
var Ennemis;
var Argent;
var Interval;
function DrawBackground() {
  ctx.drawImage(background, 0, 0);
}

function CreateWave() {
  Wave++;
  if(Ennemis.length > 0 && Ennemis.length*2 > 50){
    Argent += 50
  }else if(Ennemis.length > 0){
    Argent += Ennemis.length*2
  }
  for (let i = 0; i < Wave * 3; i++) {
    let GenEnnemis = {
      x: -i * Delay,
      y: 150,
      lvl: RandomInt(Wave) + 1,
      pathLevel: 0,
      direction: "Droite",
    };
    Ennemis.push(GenEnnemis);
  }
  if(Wave%10==0 && Delay > 20){
    Delay -= 20;
  }
}

function EnnemisMove() {
  for (let i = 0; i < Ennemis.length; i++) {
    if (
      Ennemis[i].x == Path[Ennemis[i].pathLevel + 1][0] &&
      Ennemis[i].y == Path[Ennemis[i].pathLevel + 1][1]
    ) {
      Ennemis[i].pathLevel += 1;
      Ennemis[i].direction = Path[Ennemis[i].pathLevel][2];
    } else if (Ennemis[i].direction == "Haut") {
      Ennemis[i].y -= 5;
    } else if (Ennemis[i].direction == "Bas") {
      Ennemis[i].y += 5;
    } else if (Ennemis[i].direction == "Gauche") {
      Ennemis[i].x -= 5;
    } else if (Ennemis[i].direction == "Droite") {
      Ennemis[i].x += 5;
    }
  }
}
function EnnemisDraw() {
  for (let i = 0; i < Ennemis.length; i++) {
    ctx.beginPath();
    ctx.arc(Ennemis[i].x, Ennemis[i].y, 30, 0, Math.PI * 2);
    if (Ennemis[i].lvl == 1) {
      ctx.fillStyle = "red";
    } else if (Ennemis[i].lvl == 2) {
      ctx.fillStyle = "green";
    } else if (Ennemis[i].lvl == 3) {
      ctx.fillStyle = "grey";
    } else if (Ennemis[i].lvl == 4) {
      ctx.fillStyle = "black";
    } else {
      ctx.fillStyle = "grey";
    }
    ctx.fill();
    ctx.closePath();
  }
}
function Buy(what) {
  if (what == "Canon") {
    tower = Canon1;
  } else if (what == "Sniper") {
    tower = Sniper1;
  } else if (what == "Four") {
    tower = Four1;
  } else if (what == "Annuler") {
    tower = null;
  }
}
function VerifEnnemies() {
  for (let i = 0; i < Ennemis.length; i++) {
    if (Ennemis[i].lvl <= 0) {
      DelEnnemies(i);
      Argent += 20;
    } else if (Ennemis[i].y < -30) {
      vie -= Ennemis[i].lvl;
      DelEnnemies(i);
    }
  }
}

function DelEnnemies(i) {
  Ennemis.splice(i, 1);
}

function BuyingTower() {
  if (map[Math.round(mousePosY / 100)][Math.round(mousePosX / 100)] == 0) {
    canvas.style.cursor = "default";
    canPlace = true;
  } else {
    canvas.style.cursor = "not-allowed";
    canPlace = false;
  }
  ctx.globalAlpha = 0.5;
  if (tower == Canon1) {
    var portee = 300;
  } else if (tower == Sniper1) {
    var portee = 800;
  } else if (tower == Four1) {
    var portee = 200;
  }

  ctx.beginPath();
  ctx.fillStyle = "#7E7E7E";
  ctx.arc(
    Math.round(mousePosX / 100) * 100 + 50,
    Math.round(mousePosY / 100) * 100 + 50,
    portee,
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.closePath();
  ctx.drawImage(
    tower,
    Math.round(mousePosX / 100) * 100,
    Math.round(mousePosY / 100) * 100
  );
}
function PlaceTower() {
  if (canPlace == true) {
    if (tower == Canon1 && Argent >= 300) {
      Argent -= 300;
      let BuildTower = {
        x: Math.round(mousePosX / 100) * 100 + 50,
        y: Math.round(mousePosY / 100) * 100 + 50,
        tour: "Canon",
        lvl: 1,
        degats: 1,
        range: 350,
        vitesse_attaque: 800,
        target: [],
        angle: 0,
        canshot: true,
      };
      TowerList.push(BuildTower);
      map[Math.round(mousePosY / 100)][Math.round(mousePosX / 100)] = 1;
    } else if (tower == Sniper1 && Argent >= 500) {
      Argent -= 500;
      let BuildTower = {
        x: Math.round(mousePosX / 100) * 100 + 50,
        y: Math.round(mousePosY / 100) * 100 + 50,
        tour: "Sniper",
        lvl: 1,
        degats: 4,
        range: 800,
        vitesse_attaque: 2000,
        target: [],
        angle: 0,
        canshot: true,
      };
      TowerList.push(BuildTower);
      map[Math.round(mousePosY / 100)][Math.round(mousePosX / 100)] = 1;
    } else if (tower == Four1 && Argent >= 400) {
      Argent -= 400;
      let BuildTower = {
        x: Math.round(mousePosX / 100) * 100 + 50,
        y: Math.round(mousePosY / 100) * 100 + 50,
        tour: "Four",
        lvl: 1,
        degats: 1,
        range: 200,
        vitesse_attaque: 3000,
        target: [],
        angle: 0,
        canshot: true,
      };
      TowerList.push(BuildTower);
      map[Math.round(mousePosY / 100)][Math.round(mousePosX / 100)] = 1;
    }
    tower = null;
  }
}

function DrawTower() {
  for (let i = 0; i < TowerList.length; i++) {
    calculAngle(i);
    ctx.globalAlpha = 1;
    let x = TowerList[i].x - 50;
    let y = TowerList[i].y - 50;
    ctx.translate(x + 50, y + 50);
    ctx.rotate((TowerList[i].angle * Math.PI) / 180);
    ctx.drawImage(
      eval(TowerList[i].tour + TowerList[i].lvl),
      0,
      0,
      100,
      100,
      0 - 50,
      0 - 50,
      100,
      100
    );
    ctx.rotate((-TowerList[i].angle * Math.PI) / 180);
    ctx.translate(-x - 50, -y - 50);
    if(selected == i){
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.fillStyle = "#7E7E7E";
      ctx.arc(
        TowerList[i].x,
        TowerList[i].y,
        TowerList[i].range,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.closePath();
    }
  }
}
function TowerAttack() {
  TowerFocus();
  for (let i = 0; i < TowerList.length; i++) {
    if (TowerList[i].canshot == true && TowerList[i].target.length > 0) {
      if (TowerList[i].tour == "Four") {
        for (let j = 0; j < TowerList[i].target.length; j++) {
          Ennemis[TowerList[i].target[j]].lvl -= TowerList[i].degats;
          let rayon = 0;
          animation.push({
            name: "AnimationFour",
            x: TowerList[i].x,
            y: TowerList[i].y,
            r: rayon
          });
        }
      } else {
        setTimeout(function () {
          Ennemis[TowerList[i].target[0]].lvl -= TowerList[i].degats;
        }, 250);
        animation.push({
          name: "AnimationTir",
          x: TowerList[i].x,
          y: TowerList[i].y,
          vx: (Ennemis[TowerList[i].target[0]].x - TowerList[i].x) / 10,
          vy: (Ennemis[TowerList[i].target[0]].y - TowerList[i].y) / 10,
          compteur: 0,
        });
      }
      TowerList[i].canshot = false;
      setTimeout(function () {
        TowerList[i].canshot = true;
      }, TowerList[i].vitesse_attaque);
    }
  }
}
function TowerFocus() {
  if (TargetTimeout == 5) {
    TargetTimeout = 0;
    calculDistance();
  } else {
    TargetTimeout++;
  }
}

function calculDistance() {
  for (let i = 0; i < TowerList.length; i++) {
    for (let j = 0; j < Ennemis.length; j++) {
      let D = Math.sqrt(
        Math.pow(Ennemis[j].x - TowerList[i].x, 2) +
          Math.pow(Ennemis[j].y - TowerList[i].y, 2)
      );
      if (D <= TowerList[i].range) {
        PossiblesTargets.push(j);
      } else {
        TowerList[i].target = -1;
      }
    }
    if (PossiblesTargets.length != 0) {
      if (TowerList[i].tour == "Four") {
        TowerList[i].target = PossiblesTargets;
      } else {
        TowerList[i].target = [PossiblesTargets[0]];
      }
    } else {
      TowerList[i].target = [];
    }
    PossiblesTargets = [];
  }
}

function calculAngle(nb) {
  if (TowerList[nb].target.length > 0) {
    TowerList[nb].angle = Math.round(
      (Math.atan2(
        Ennemis[TowerList[nb].target[0]].y - TowerList[nb].y,
        Ennemis[TowerList[nb].target[0]].x - TowerList[nb].x
      ) *
        180) /
        Math.PI
    );
  }
}
function DrawAnimation() {
  for (let i = 0; i < animation.length; i++) {
    if (animation[i].name == "AnimationFour") {
      ctx.beginPath();
      ctx.globalAlpha = 0.5;
      ctx.arc(animation[i].x, animation[i].y, animation[i].r, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.closePath();
      animation[i].r += 15;
      if (animation[i].r > 200) {
        animation.splice(i, 1);
      }
    } else if (animation[i].name == "AnimationTir") {
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.moveTo(animation[i].x, animation[i].y);
      ctx.lineTo(
        animation[i].x + animation[i].vx,
        animation[i].y + animation[i].vy
      );
      ctx.strokeStyle = "black";
      ctx.stroke();
      ctx.closePath();
      animation[i].x += animation[i].vx;
      animation[i].y += animation[i].vy;
      animation[i].compteur += 1;

      if (animation[i].compteur > 10) {
        animation.splice(i, 1);
      }
    }
  }
}
function Upgrades(){
  if(selected == null){
  BuyDiv.style.display ="flex";
  UpDiv.style.display = "none";
  }else{
    BuyDiv.style.display ="none";
    UpDiv.style.display = "flex";
    UpTitle.innerHTML = "Tour : "+ TowerList[selected].tour + " "+TowerList[selected].lvl+ " | Argent: "+Argent
    for(let i = 0; i<UpButtons.length - 2;i++){
      if(TowerList[selected].tour == "Canon"){
        UpButtons[i].style.backgroundColor = "#C44536";
      }else if(TowerList[selected].tour == "Sniper"){
        UpButtons[i].style.backgroundColor = "#90BE6D";
      }else if(TowerList[selected].tour == "Four"){
        UpButtons[i].style.backgroundColor = "#F9C74F";
      }
    }
  }
}
function Up(what){
  if(what =="range" && Argent >= 400){
    Argent -= 400;
    TowerList[selected].range += 50;
    if(TowerList[selected].lvl<3){
      TowerList[selected].lvl++
    }
  }else if(what == "damage" && Argent >= 500){
    Argent -= 500;
    TowerList[selected].degats += 2;
    if(TowerList[selected].lvl<3){
      TowerList[selected].lvl++
    }
  }else if(what == "speed" && Argent >= 250 && TowerList[selected].vitesse_attaque > 500){
    Argent -= 250;
    TowerList[selected].vitesse_attaque -= 100;
    if(TowerList[selected].lvl<3){
      TowerList[selected].lvl++
    }
}}
function Title(){
  BuyTitle.innerHTML = "Vague: "+ Wave+ " | Vie: "+ vie + " | Argent: "+Argent;
  if(Ennemis.length > 0 && Ennemis.length*2>50){
    UpButtons[4].value = "Passer a la vague suivante (Bonus : 50$)";
    BuyButtons[4].value = "Passer a la vague suivante (Bonus : 50$)";
  }else if(Ennemis.length > 0){
    UpButtons[4].value = "Passer a la vague suivante (Bonus : "+Ennemis.length*2+"$)";
    BuyButtons[4].value = "Passer a la vague suivante (Bonus : "+Ennemis.length*2+"$)";
  }else{
    UpButtons[4].value = "Passer a la vague suivante";
    BuyButtons[4].value = "Passer a la vague suivante";
  }
}
function Mort(){
  if(vie <= 0){
    BuyDiv.style.display="none"
    UpDiv.style.display="none"
    ResDiv.style.display="flex"
    resTitle.innerHTML = "Vous avez perdu a la vague "+ Wave;
    clearInterval(Interval);
  }
}
function Draw() {
  Upgrades()
  Title()
  DrawBackground();
  EnnemisMove();
  EnnemisDraw();
  VerifEnnemies();
  TowerAttack();
  DrawAnimation();
  DrawTower();
  Mort()
  if (tower != null) {
    BuyingTower();
  }
}

function RandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
function FindTower() {
  for (let i = 0; i < TowerList.length; i++) {
    if(
      TowerList[i].x == Math.round(mousePosX / 100) * 100 + 50 &&
      TowerList[i].y == Math.round(mousePosY / 100) * 100 + 50
    ){
      selected = i;
      break
    }else{
      selected = null;
    }
  }
}
function RetourMenu(){
  document.querySelector("#menu").style.display="flex";
  document.querySelector("#aide").style.display="none";
  ResDiv.style.display="none";
  document.querySelector("#jeu").style.display="none";
}
function Unselect(){
  selected = null;
}
canvas.addEventListener("mousemove", function () {
  let PositionCanvas = canvas.getBoundingClientRect(event);
  mousePosX = Math.round(event.clientX - PositionCanvas.left) - 50;
  mousePosY = Math.round(event.clientY - PositionCanvas.top) - 50;
});

canvas.addEventListener("click", function () {
  if (tower != null) {
    PlaceTower();
  } else if (tower == null) {
    FindTower();
  }
});
function play(i){
  if(i == 1){
    background = document.querySelector("#carte1");
    Path = [
      [0, 150, "Droite"],
      [450, 150, "Bas"],
      [450, 450, "Gauche"],
      [150, 450, "Bas"],
      [150, 650, "Droite"],
      [950, 650, "Haut"],
      [950, -100, "Haut"],
    ];
    map = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
  }else if(i==2){
    background = document.querySelector("#carte2");
    Path = [
      [0, 150, "Droite"],
      [150, 150, "Bas"],
      [150,650, "Droite"],
      [450,650, "Haut"],
      [450,550, "Droite"],
      [650,550, "Bas"],
      [650,650,"Droite"],
      [950,650, "Haut"],
      [950, -100, "Haut"]
    ];
    map = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
  }else if(i==3){
    background = document.querySelector("#carte3");
    Path = [
      [0, 150, "Droite"],
      [50, 150, "Bas"],
      [50,750, "Droite"],
      [950,750, "Haut"],
      [950,550, "Gauche"],
      [750,550, "Haut"],
      [750,350,"Droite"],
      [850,350, "Haut"],
      [850,250,"Droite"],
      [950,250, "Haut"],
      [950, -100, "Haut"]
    ];
    map = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
      [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    ];
  }else if(i==4){
    background = document.querySelector("#carte4");
    Path = [
      [0, 150, "Droite"],
      [350,150, "Bas"],
      [350,250, "Droite"],
      [550,250, "Bas"],
      [550,350, "Droite"],
      [950,350, "Haut"],
      [950, -100, "Haut"]
    ];
    map = [
      [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
  }
  TowerList = [];
  PossiblesTargets = [];
  animation = [];
  vie = 20;
  Wave = 0;
  Delay = 80;
  Ennemis = [];
  Argent = 500;
  document.querySelector("#menu").style.display="none";
  ResDiv.style.display="none";
  document.querySelector("#jeu").style.display="flex";
  Interval = setInterval(Draw, 25); //25
}
function aide(){
  document.querySelector("#menu").style.display="none";
  document.querySelector("#aide").style.display="flex";
}
