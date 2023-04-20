

let cols, rows;

let configList, configItems;
let elementsVisible = true;


let wSlider;
let hSlider;
let sclSlider;
let extrudeSlider;
let velSlider;

let rotateButton;

let rotateEnabled = false;


let flying = 0;

let terrain = [];
let extrudedTerrain = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  configList = select('#config-list');
  configItems = selectAll('#config-list li');

  

  wSlider = createSlider(30,1000,900);
  wSlider.class('wSlider');

  hSlider = createSlider(30,1000,900);
  hSlider.class('hSlider');

  sclSlider = createSlider(7, 100, 17);
  sclSlider.class('sclSlider');

  extrudeSlider = createSlider(0, 600, 200);
  extrudeSlider.class('extrudeSlider');

  velSlider = createSlider(0, 4, 2);
  velSlider.class('velSlider');

  rotateButton = createButton('Activar rotación touch');
  rotateButton.class('rotateButton');
  rotateButton.mousePressed(() => {
    rotateEnabled = !rotateEnabled;
    if (rotateEnabled) {
      rotateButton.html('Desactivar rotación touch');
    } else {
      rotateButton.html('Activar rotación touch');
    }
  });

  toggleButton = createImg('gear.svg');
  toggleButton.class('toggle-config');
  toggleButton.mousePressed(toggleSliders);

  let sliders = [wSlider, hSlider, sclSlider,extrudeSlider, rotateButton,configList, velSlider]
  function toggleSliders() {
    elementsVisible = !elementsVisible;

    for (let i = 0; i < sliders.length; i++) {
      sliders[i].style('display', elementsVisible ? 'block' : 'none');
    }
  }  
  

  updateTerrain();
  extrudeTerrain();
}

function draw() {

  

  if (rotateEnabled) {
    let rotateXVal = map(mouseY, 0, height, -PI/2, PI/2);
    let rotateYVal = map(mouseX, 0, width, -PI/2, PI/2);
    rotateX(rotateXVal);
    rotateY(rotateYVal);
  } else {
    rotateX(-PI / 7);
  }

  updateTerrain();
  extrudeTerrain();

  background(10);
  stroke(255);
  noFill();

  let velSliderValue = velSlider.value();


  flying -= 0.02 * velSliderValue; // velocidad de fluctuación

  translate(0, 0);
  rotateX(PI / 2);
  translate(-wSlider.value() / 2, -hSlider.value() / 2);
  for (let y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < cols; x++) {
      vertex(x * sclSlider.value(), y * sclSlider.value(), extrudedTerrain[y][x]);
      vertex(x * sclSlider.value(), (y + 1) * sclSlider.value(), extrudedTerrain[y + 1][x]);
    }
    endShape();
  }

}

function updateTerrain() {
  let wSliderValue = wSlider.value();
  let hSliderValue = hSlider.value();
  let sclSliderValue = sclSlider.value();


  

  

  cols = Math.floor(wSliderValue / sclSliderValue);
  rows = Math.floor(hSliderValue / sclSliderValue);

  terrain = new Array(rows);
  for (let y = 0; y < rows; y++) {
    terrain[y] = new Array(cols);
    for (let x = 0; x < cols; x++) {
      terrain[y][x] = 0;
    }
  }

  for (let y = 0; y < rows; y++) {
    let fluctuation = sin(y * 0.01 + flying) * 10 // este 10 controla la altura en el eje y;
    for (let x = 0; x < cols; x++) {
      let z = map(noise(x * 0.1, y * 0.1, flying), 0, 1, -50, 10);
      terrain[y][x] = z + fluctuation;
    }
  }
}



function extrudeTerrain() {
  
  extrudedTerrain = new Array(rows);
  for (let y = 0; y < rows; y++) {
    extrudedTerrain[y] = new Array(cols);
    for (let x = 0; x < cols; x++) {
      extrudedTerrain[y][x] = map(extrudeSlider.value(), 0, 150, 0, terrain[y][x]);
    }
  }
}


