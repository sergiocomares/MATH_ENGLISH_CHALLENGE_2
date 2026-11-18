"use strict";

// ==================== CONFIGURACIÓN MULTI-PROFESOR ====================
// These are the SA1 deployments; keep them unchanged until separate SA2 endpoints are provided.
const scriptsProfesores = {
  "sergiojodral": "https://script.google.com/macros/s/AKfycbwyWWo53MOmjRSNhNoH2hh0FJB3Ge_T7NN43VAsLXdf53JXsYw9QnyXfIQa7be7vTlG/exec",
  "israeladamuz": "https://script.google.com/macros/s/AKfycbytQUFcs9p5ScIBastaFxd6cmgcdfiWmiDV8kMIGO1CgUisfUKVSbe7LsV_FgnR7Zfy/exec"
};

const parametrosURL = new URLSearchParams(window.location.search);
const profeAsignado = parametrosURL.get('profe') || "sergiojodral";

// La URL general usa el registro de Sergio; ?profe=israeladamuz selecciona el de Israel.
const REGISTRATION_ENDPOINT = scriptsProfesores[profeAsignado];

// ==================== SA2 RECYCLING QUESTION BANK ====================
const vocabulary = {
  proportionality: [
    ["direct proportionality","proporcionalidad directa"],["inverse proportionality","proporcionalidad inversa"],["ratio","razón"],["proportion","proporción"],
    ["directly proportional distributions","repartos directamente proporcionales"],["inversely proportional distributions","repartos inversamente proporcionales"],
    ["percentage","porcentaje"],["percent","por ciento"],["percentage increases","aumentos porcentuales"],["percentage decreases","disminuciones porcentuales"],
    ["discount","descuento"],["tax","impuesto"],["surcharge","recargo"]
  ],
  decimals: [
    ["decimal number","número decimal"],["tenths","décimas"],["hundredths","centésimas"],["thousandths","milésimas"],
    ["ten thousandths","diezmilésimas"],["hundred thousandths","cienmilésimas"],["millionths","millonésimas"],
    ["terminating decimal","decimal exacto"],["recurring decimal","decimal periódico"],["pure recurring decimal","decimal periódico puro"],
    ["mixed recurring decimal","decimal periódico mixto"],["period / repetend","periodo"],["non-recurring decimal part","anteperiodo"],
    ["irrational number","número irracional"],["rounding","redondeo"],["approximate by rounding to the nearest tenth","aproxima por redondeo a las décimas"],
    ["truncation","truncamiento"],["approximate by truncation to the nearest hundredth","aproxima por truncamiento a las centésimas"]
  ],
  solids: [
    ["geometric solid","cuerpo geométrico"],["polyhedron","poliedro"],["prism","prisma"],["orthohedron","ortoedro"],
    ["lateral faces","caras laterales"],["bases","bases"],["height","altura"],["triangular prism","prisma triangular"],
    ["quadrangular prism","prisma cuadrangular"],["pentagonal prism","prisma pentagonal"],["hexagonal prism","prisma hexagonal"],["cube","cubo"],
    ["pyramid","pirámide"],["vertex","vértice"],["apothem of the pyramid","apotema de la pirámide"],
    ["apothem of the base","apotema de la base"],["solid of revolution","cuerpo de revolución"],["cylinder","cilindro"],["cone","cono"],
    ["axis of revolution","eje de revolución"],["generatrix","generatriz"],["radius","radio"],["area","área"],["volume","volumen"],
    ["lateral surface area","área lateral"],["area of the base","área de la base"]
  ]
};
const categoryLabels = {
  proportionality:"Proportionality and Percentages",
  decimals:"Decimal Numbers",
  solids:"Geometric Solids"
};
const levels = [
  ["Recycling Warm-up","Start sorting the language of proportions, decimals and solids.","green"],
  ["Vocabulary Sorting","Match each mathematical term with its Spanish meaning.","blue"],
  ["Decimal Detective","Interpret decimal notation and spot mathematical errors.","purple"],
  ["Solid Shapes","Recognise, describe and measure geometric solids.","orange"],
  ["Final Green Challenge","Bring all three SA2 blocks together.","red"]
];
const sessionSlots = [
  [["proportionality",["mc"]],["decimals",["mc"]],["solids",["visual"]],["proportionality",["fill"]],["decimals",["scramble"]],["solids",["matching"]]],
  [["decimals",["matching"]],["solids",["visual"]],["proportionality",["expression"]],["decimals",["fill"]],["solids",["mc"]],["proportionality",["boolean"]]],
  [["proportionality",["scramble"]],["decimals",["expression"]],["solids",["mistake"]],["proportionality",["matching"]],["decimals",["boolean"]],["solids",["fill"]]],
  [["proportionality",["mistake"]],["decimals",["mc"]],["solids",["matching"]],["proportionality",["fill"]],["decimals",["scramble"]],["solids",["expression"]]],
  [["proportionality",["matching"]],["decimals",["mistake"]],["solids",["visual"]],["proportionality",["expression"]],["decimals",["fill"]],["solids",["mc"]]]
];
function choice(id, category, type, question, options, answer, difficulty = 2) { return { id, category, type, difficulty, question, data:{ options }, answer }; }
function makeBank() {
  const bank = [];
  Object.entries(vocabulary).forEach(([category, pairs]) => {
    pairs.forEach(([english, spanish], index) => {
      const distractors = pairs.filter(([, value]) => value !== spanish).map(([, value]) => value).slice(0, 3);
      bank.push(choice(`${category}_mc_${index}`, category, "mc", `What does “${english}” mean?`, [spanish, ...distractors], 0, index < 7 ? 1 : 2));
      if (/^[a-z]{3,14}$/i.test(english)) {
        const word = english.toLowerCase();
        bank.push({ id:`${category}_scramble_${index}`, category, type:"scramble", difficulty:2, question:"Unscramble this mathematical word.", data:{ word, hint:spanish }, answer:word });
      }
    });
    for (let index = 0; index + 3 < pairs.length; index += 4) {
      bank.push({ id:`${category}_match_${index}`, category, type:"matching", difficulty:2, question:"Match every English word with its Spanish meaning.", data:{ pairs:pairs.slice(index, index + 4).map(([english, spanish]) => ({ english, spanish })) }, answer:"all pairs" });
    }
  });

  const fillIns = [
    ["proportionality","A comparison between two quantities is a ______.",["ratio"]],
    ["proportionality","An equality between two ratios is a ______.",["proportion"]],
    ["proportionality","A price reduction is a ______.",["discount"]],
    ["proportionality","An extra charge added to a price is a ______.",["surcharge"]],
    ["decimals","A decimal with a finite number of decimal places is a ______.",["terminating decimal"]],
    ["decimals","The repeating digits in a recurring decimal form its ______.",["period","repetend","period / repetend"]],
    ["decimals","The non-repeating decimal part before a repetend is the ______.",["non-recurring decimal part"]],
    ["decimals","Dropping later digits without rounding is called ______.",["truncation"]],
    ["solids","The faces that are not the bases of a prism are its ______.",["lateral faces"]],
    ["solids","The perpendicular distance between the bases is the ______.",["height"]],
    ["solids","The area of the side faces together is the ______.",["lateral surface area"]],
    ["solids","The measure of one base is the ______.",["area of the base"]]
  ];
  fillIns.forEach(([category, question, answers], index) => bank.push({
    id:`${category}_fill_${index}`, category, type:"fill", difficulty:2, question,
    data:{ answers }, answer:answers[0]
  }));

  const interpretations = [
    ["proportionality","A 3 kg bag costs €6. At the same rate, how much do 5 kg cost?",["€8","€9","€10","€12"],"€10"],
    ["proportionality","Share 24 items in the ratio 1:3. How many items are in the smaller share?",["4","6","8","18"],"6"],
    ["proportionality","A 20% discount is applied to €50. What is the new price?",["€10","€30","€40","€60"],"€40"],
    ["proportionality","A €40 item has 10% tax added. What is the final price?",["€4","€36","€44","€50"],"€44"],
    ["decimals","In 7.036, what is the place value of the digit 3?",["tenths","hundredths","thousandths","millionths"],"hundredths"],
    ["decimals","Approximate 4.267 by rounding to the nearest tenth.",["4.2","4.26","4.3","4.27"],"4.3"],
    ["decimals","Approximate 5.786 by truncation to the nearest hundredth.",["5.7","5.78","5.79","5.80"],"5.78"],
    ["decimals","In 0.363636..., which description fits the decimal?",["terminating decimal","pure recurring decimal","mixed recurring decimal","irrational number"],"pure recurring decimal"],
    ["solids","A prism has a triangular base. What is its name?",["triangular prism","quadrangular prism","pentagonal prism","hexagonal prism"],"triangular prism"],
    ["solids","Which measurement describes the distance from the centre of a circular base to its edge?",["height","generatrix","radius","vertex"],"radius"]
  ];
  interpretations.forEach(([category, question, options, answer], index) => bank.push(choice(`${category}_interpretation_${index}`, category, "expression", question, options, options.indexOf(answer), 2)));

  const trueFalse = [
    ["proportionality","In direct proportionality, multiplying one quantity by 2 multiplies the other by 2.",true],
    ["proportionality","A 15% surcharge reduces the price.",false],
    ["decimals","0.25 is a terminating decimal.",true],
    ["decimals","An irrational number has a terminating decimal expansion.",false],
    ["solids","A cube is a polyhedron.",true],
    ["solids","A cone has two parallel bases.",false]
  ];
  trueFalse.forEach(([category, statement, correct], index) => bank.push(choice(
    `${category}_boolean_${index}`, category, "boolean", statement, ["TRUE","FALSE"], correct ? 0 : 1, 2
  )));

  const errors = [
    ["proportionality","With inverse proportionality, doubling one quantity also doubles the other.",false,"With inverse proportionality, doubling one quantity halves the other."],
    ["proportionality","A 10% discount lowers the original price.",true,"A 10% discount lowers the original price."],
    ["decimals","In 0.444..., the digit 4 is a non-recurring decimal part.",false,"The digit 4 is the period / repetend."],
    ["decimals","Rounding 3.46 to the nearest tenth gives 3.5.",true,"Rounding 3.46 to the nearest tenth gives 3.5."],
    ["solids","A cube has six square faces.",true,"A cube has six square faces."],
    ["solids","A cylinder is a polyhedron because it has curved surfaces.",false,"A polyhedron has only flat polygonal faces; a cylinder has a curved surface."]
  ];
  errors.forEach(([category, statement, correct, correction], index) => bank.push({
    id:`${category}_mistake_${index}`, category, type:"mistake", difficulty:3,
    question:"Find the error. Is this statement correct?", data:{ statement, correction }, answer:correct
  }));

  const visuals = [
    ["cube","cube"],["triangular-prism","triangular prism"],["pyramid","pyramid"],["cylinder","cylinder"],["cone","cone"]
  ];
  const solidOptions = ["cube","triangular prism","pyramid","cylinder","cone"];
  visuals.forEach(([shape, answer], index) => bank.push(choice(
    `solids_visual_${index}`, "solids", "visual", "Which geometric solid is shown?",
    solidOptions, solidOptions.indexOf(answer), 2
  )));
  bank.forEach(challenge => {
    if (challenge.type === "visual") challenge.data.shape = visuals.find(([shape, answer]) => answer === challenge.data.options[challenge.answer])[0];
  });
  return bank;
}
const challengeBank = makeBank();

// ==================== SESSION GENERATION ====================
function createRandom() { const entropy = new Uint32Array(1); crypto.getRandomValues(entropy); let seed = entropy[0] || Date.now(); return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }
function shuffleArray(items, random) { const result = [...items]; for (let index = result.length - 1; index > 0; index -= 1) { const target = Math.floor(random() * (index + 1)); [result[index], result[target]] = [result[target], result[index]]; } return result; }
function shuffleOptions(challenge, random) { if (!challenge.data.options) return challenge; const packed = shuffleArray(challenge.data.options.map((text, index) => ({ text, correct:index === challenge.answer })), random); return { ...challenge, data:{ ...challenge.data, options:packed.map(item => item.text) }, answer:packed.findIndex(item => item.correct) }; }
function selectRandomQuestions(category, types, used, random) { const candidates = challengeBank.filter(item => item.category === category && types.includes(item.type) && !used.has(item.id)); if (!candidates.length) throw new Error(`Missing challenge for ${category}`); return shuffleArray(candidates, random)[0]; }
function generateGameSession() {
  const random = createRandom(), used = new Set(), challenges = [];
  sessionSlots.forEach((level, levelIndex) => shuffleArray(level, random).forEach(([category, types]) => { let challenge = selectRandomQuestions(category, types, used, random); used.add(challenge.id); challenge = shuffleOptions({ ...challenge, level:levelIndex }, random); if (challenge.type === "scramble") challenge.data = { ...challenge.data, letters:shuffleArray(challenge.data.word.toUpperCase().split(""), random) }; if (challenge.type === "matching") challenge.data = { ...challenge.data, spanishCards:shuffleArray(challenge.data.pairs.map(pair => pair.spanish), random) }; challenges.push(challenge); }));
  return { id:`${Date.now()}-${Math.floor(random() * 100000)}`, challenges, total:challenges.length };
}

// ==================== GAME STATE ====================
const state = { session:null, index:0, level:0, correct:0, incorrect:0, streak:0, bestStreak:0, lives:3, stats:{}, completed:[], startedAt:0, elapsedSeconds:0, timerId:null, locked:false, interaction:null, student:"", studentClass:"", studentPin:"", resultSent:false };
const elements = Object.fromEntries(["welcome-screen:welcome","level-screen:levelScreen","game-screen:game","result-screen:result","start-form:form","student-name:name","student-class:studentClass","name-error:nameError","begin-level-button:beginLevel","level-kicker:levelKicker","level-orb:levelOrb","level-title:levelTitle","level-description:levelDescription","level-map-list:levelMap","header-student:headerStudent","level-live-label:levelLive","question-number:questionNumber","challenge-total:challengeTotal","category-label:category","question-text:question","options:options","feedback:feedback","progress-bar:progress","live-correct:liveCorrect","live-incorrect:liveIncorrect","live-streak:liveStreak","lives:lives","result-student:resultStudent","result-class:resultClass","result-date:resultDate","final-correct:finalCorrect","final-total:finalTotal","final-percentage:finalPercentage","final-correct-summary:finalCorrectSummary","final-incorrect-summary:finalIncorrectSummary","final-best-streak:finalBestStreak","final-time:finalTime","category-breakdown:breakdown","completed-levels-list:completedLevels","badge-icon:badgeIcon","badge-title:badgeTitle","confetti:confetti","screenshot-button:screenshot","play-again-button:playAgain","registration-status:registrationStatus"].map(item => { const [id, key] = item.split(":"); return [key, document.getElementById(id)]; }));

function resetState() { clearInterval(state.timerId); state.session = generateGameSession(); Object.assign(state, { index:0, level:0, correct:0, incorrect:0, streak:0, bestStreak:0, lives:3, stats:{}, completed:[], elapsedSeconds:0, locked:false, interaction:null, resultSent:false }); Object.keys(vocabulary).forEach(category => { state.stats[category] = { correct:0, total:0 }; }); state.session.challenges.forEach(challenge => { state.stats[challenge.category].total += 1; }); }
async function startChallenge(event) {
  event.preventDefault();
  const pin = elements.name.value.trim();
  if (!pin) {
    elements.nameError.textContent = "Enter your personal PIN to start.";
    elements.nameError.hidden = false;
    elements.name.focus();
    return;
  }
  const submitButton = elements.form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = "CHECKING PIN…";
  elements.nameError.hidden = true;
  try {
    const student = await verifyStudentPin(pin);
    if (!student || !student.valido) throw new Error("PIN not found. Check it and try again.");
    state.studentPin = pin;
    state.student = student.nombre;
    state.studentClass = student.clase;
    resetState();
    state.startedAt = Date.now();
    state.timerId = setInterval(() => { state.elapsedSeconds = Math.floor((Date.now() - state.startedAt) / 1000); }, 1000);
    elements.headerStudent.textContent = state.student;
    elements.challengeTotal.textContent = state.session.total;
    elements.welcome.hidden = true;
    showLevel(0);
  } catch (error) {
    elements.nameError.textContent = error.message || "Could not verify the PIN. Please try again.";
    elements.nameError.hidden = false;
    elements.name.focus();
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'START CHALLENGE <span aria-hidden="true">🚀</span>';
  }
}

async function verifyStudentPin(pin) {
  const verificationUrl = new URL(REGISTRATION_ENDPOINT);
  verificationUrl.search = new URLSearchParams({ accion:"verificar", pin, callback:"pinVerification" });

  try {
    const response = await fetch(verificationUrl);
    if (!response.ok) throw new Error(`PIN verification failed with status ${response.status}.`);
    const responseText = await response.text();
    const start = responseText.indexOf("(");
    const end = responseText.lastIndexOf(")");
    if (start === -1 || end <= start) throw new Error("The registration service returned an invalid response.");
    return JSON.parse(responseText.slice(start + 1, end));
  } catch (fetchError) {
    return verifyStudentPinWithJsonp(verificationUrl);
  }
}

function verifyStudentPinWithJsonp(verificationUrl) {
  return new Promise((resolve, reject) => {
    const callbackName = "__mathPinCallback_" + Math.random().toString(36).slice(2);
    const script = document.createElement("script");
    const timeout = setTimeout(() => finish(new Error("PIN check timed out. Please try again.")), 25000);
    function finish(error, data) {
      clearTimeout(timeout);
      delete window[callbackName];
      script.remove();
      if (error) reject(error); else resolve(data);
    }
    window[callbackName] = data => finish(null, data);
    script.onerror = () => finish(new Error("The registration service is unavailable. Please ask your teacher to enable public access to it."));
    verificationUrl.searchParams.set("callback", callbackName);
    script.src = verificationUrl;
    document.head.appendChild(script);
  });
}

async function registerFinalResult(percentage) {
  if (state.resultSent) return;
  state.resultSent = true;
  elements.registrationStatus.textContent = "Sending your result to your teacher…";

  // Convertimos la nota a texto y cambiamos el punto por la coma para arreglar el error en Google Sheets
  const notaConComa = (state.correct / state.session.total * 10).toFixed(2).replace('.', ',');

  const payload = {
    accion: "guardar",
    pin: state.studentPin,
    notaNumerica: notaConComa,
    aciertos: state.correct,
    errores: state.incorrect,
    porcentaje: percentage,
    duracionSegundos: state.elapsedSeconds,
    totalPreguntas: state.session.total
  };
  try {
    // no-cors allows a static GitHub Pages site to submit the form without a CORS preflight.
    // The opaque response cannot confirm whether Apps Script accepted the write.
    await fetch(REGISTRATION_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: new URLSearchParams({ payload: JSON.stringify(payload) })
    });
    elements.registrationStatus.textContent = "Result sent. Your teacher can check the class register. If it does not appear, please show your result screenshot.";
  } catch (error) {
    state.resultSent = false;
    elements.registrationStatus.textContent = "The result could not be sent automatically. Please take a screenshot and submit it on Google Classroom.";
  }
}
function showLevel(index) { state.level = index; state.lives = 3; const [name, description, color] = levels[index]; elements.levelKicker.textContent = index === 4 ? "FINAL LEVEL" : `LEVEL ${index + 1} OF ${levels.length}`; elements.levelOrb.textContent = index + 1; elements.levelOrb.className = `level-orb ${color}`; elements.levelTitle.textContent = name; elements.levelDescription.textContent = description; elements.levelMap.replaceChildren(); levels.forEach(([levelName], levelIndex) => { const row = document.createElement("div"); row.className = `map-item ${levelIndex < index ? "complete" : levelIndex === index ? "current" : ""}`; row.textContent = `${levelIndex < index ? "✓" : levelIndex + 1} ${levelName}`; elements.levelMap.append(row); }); elements.game.hidden = true; elements.levelScreen.hidden = false; }
function beginLevel() { elements.levelScreen.hidden = true; elements.game.hidden = false; renderChallenge(); }

// ==================== SEVEN CHALLENGE RENDERERS ====================
function button(text, className, action) { const node = document.createElement("button"); node.type = "button"; node.className = className; node.textContent = text; node.addEventListener("click", action); return node; }
function renderChallenge() { const challenge = state.session.challenges[state.index]; state.locked = false; state.interaction = {}; elements.levelLive.textContent = state.level === 4 ? "FINAL LEVEL" : `LEVEL ${state.level + 1}`; elements.questionNumber.textContent = state.index + 1; elements.category.textContent = `${challenge.type.toUpperCase()} · ${categoryLabels[challenge.category]}`; elements.question.textContent = challenge.question; elements.options.replaceChildren(); elements.feedback.hidden = true; elements.feedback.className = "feedback"; ({ mc:renderChoices, expression:renderChoices, boolean:renderChoices, scramble:renderScramble, matching:renderMatching, sort:renderSort, mistake:renderMistake, fill:renderFill, visual:renderVisual })[challenge.type](challenge); updateLive(); requestAnimationFrame(() => elements.options.querySelector("input,button")?.focus()); }
function renderChoices(challenge) { challenge.data.options.forEach((option, index) => { const node = button("", "option-button choice-option", () => resolve(index === challenge.answer, challenge.data.options[challenge.answer])); const letter = document.createElement("span"), text = document.createElement("span"); letter.className = "option-letter"; letter.textContent = String.fromCharCode(65 + index); text.textContent = option; node.append(letter, text); elements.options.append(node); }); }
function renderFill(challenge) { const field = document.createElement("input"), controls = document.createElement("div"); field.className = "fill-answer"; field.type = "text"; field.autocomplete = "off"; field.setAttribute("aria-label", "Type your answer in English"); field.placeholder = "Type your answer in English"; controls.className = "challenge-controls"; const check = () => { const answer = field.value.trim().toLowerCase().replace(/\s+/g, " "); if (!answer) { field.focus(); return; } resolve(challenge.data.answers.includes(answer), challenge.answer); }; field.addEventListener("keydown", event => { if (event.key === "Enter") check(); }); controls.append(button("CHECK ANSWER", "primary-button compact", check)); elements.options.append(field, controls); }
function renderVisual(challenge) { const figure = document.createElement("figure"), svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"), strokes = { cube:["M70 60H140V130H70Z M95 35H165V105 M95 35L70 60 M165 35L140 60 M165 105L140 130 M70 60L95 35 M140 60L165 35 M140 130L165 105"], "triangular-prism":["M55 120L90 55L125 120Z M110 120L145 55L180 120Z M55 120L110 120 M90 55L145 55 M125 120L180 120"], pyramid:["M60 120L120 140L180 120L120 100Z M120 35L60 120 M120 35L120 140 M120 35L180 120 M120 35L120 100"], cylinder:["M65 55V125 M175 55V125 M65 55A55 18 0 0 1 175 55 M65 125A55 18 0 0 0 175 125 M65 55A55 18 0 0 0 175 55 M65 125A55 18 0 0 1 175 125"], cone:["M65 120L120 35L175 120 M65 120A55 18 0 0 1 175 120 M65 120A55 18 0 0 0 175 120"] }; figure.className = "solid-figure"; figure.setAttribute("aria-label", "Line drawing of a geometric solid"); svg.setAttribute("viewBox", "0 0 240 170"); svg.setAttribute("role", "img"); svg.setAttribute("aria-hidden", "true"); const path = document.createElementNS(svg.namespaceURI, "path"); path.setAttribute("d", strokes[challenge.data.shape]); path.setAttribute("fill", "none"); path.setAttribute("stroke", "#1768ac"); path.setAttribute("stroke-width", "4"); path.setAttribute("stroke-linecap", "round"); path.setAttribute("stroke-linejoin", "round"); svg.append(path); figure.append(svg); elements.options.append(figure); renderChoices(challenge); }
function renderScramble(challenge) { state.interaction.letters = []; const hint = document.createElement("p"), answer = document.createElement("p"), tiles = document.createElement("div"), controls = document.createElement("div"); hint.className = "game-instruction scramble-hint"; hint.textContent = `Hint / Pista: ${challenge.data.hint}`; answer.className = "scramble-answer"; tiles.className = "letter-tiles"; controls.className = "challenge-controls"; const draw = () => { answer.textContent = state.interaction.letters.join("") || "Select the letters in order"; }; challenge.data.letters.forEach(letter => tiles.append(button(letter, "letter-tile", event => { state.interaction.letters.push(letter); event.currentTarget.disabled = true; draw(); }))); controls.append(button("CLEAR", "secondary-button compact", () => { state.interaction.letters = []; tiles.querySelectorAll("button").forEach(tile => { tile.disabled = false; }); draw(); }), button("CHECK", "primary-button compact", () => resolve(state.interaction.letters.join("").toLowerCase() === challenge.answer, challenge.data.word))); elements.options.append(hint, answer, tiles, controls); draw(); }
function renderMatching(challenge) { state.interaction = { english:null, spanish:null, pairs:new Set(), missed:false }; const instruction = document.createElement("p"), board = document.createElement("div"), left = document.createElement("div"), right = document.createElement("div"); instruction.className = "game-instruction"; instruction.textContent = "Select an English card, then its Spanish partner."; board.className = "matching-board"; left.className = right.className = "match-column"; const tryPair = () => { const pick = state.interaction; if (pick.english === null || pick.spanish === null) return; if (challenge.data.pairs[pick.english].spanish === pick.spanish) pick.pairs.add(pick.english); else { pick.missed = true; flash("Not a pair. Try another match."); } pick.english = pick.spanish = null; draw(); if (pick.pairs.size === challenge.data.pairs.length) setTimeout(() => resolve(!pick.missed, "All English-Spanish pairs"), 250); }; const draw = () => { left.replaceChildren(); right.replaceChildren(); challenge.data.pairs.forEach((pair, index) => { const paired = state.interaction.pairs.has(index); const card = button(pair.english, `match-card ${paired ? "paired" : state.interaction.english === index ? "selected" : ""}`, () => { if (!paired) { state.interaction.english = index; draw(); tryPair(); } }); card.disabled = paired; left.append(card); }); challenge.data.spanishCards.forEach(word => { const index = challenge.data.pairs.findIndex(pair => pair.spanish === word), paired = state.interaction.pairs.has(index); const card = button(word, `match-card ${paired ? "paired" : state.interaction.spanish === word ? "selected" : ""}`, () => { if (!paired) { state.interaction.spanish = word; draw(); tryPair(); } }); card.disabled = paired; right.append(card); }); }; board.append(left, right); elements.options.append(instruction, board); draw(); }
function renderSort(challenge) { state.interaction.order = []; const instruction = document.createElement("p"), source = document.createElement("div"), result = document.createElement("div"), controls = document.createElement("div"); instruction.className = "game-instruction"; instruction.textContent = "Tap each item in the correct order. Tap your answer to remove it."; source.className = "sort-source"; result.className = "sort-result"; controls.className = "challenge-controls"; const draw = () => { source.replaceChildren(); result.replaceChildren(); challenge.data.items.forEach(item => { const used = state.interaction.order.includes(item); const tile = button(item, "sort-tile", () => { if (!used) { state.interaction.order.push(item); draw(); } }); tile.disabled = used; source.append(tile); }); state.interaction.order.forEach((item, index) => result.append(button(`${index + 1}. ${item}`, "sort-choice", () => { state.interaction.order.splice(index, 1); draw(); }))); }; controls.append(button("UNDO", "secondary-button compact", () => { state.interaction.order.pop(); draw(); }), button("RESET", "secondary-button compact", () => { state.interaction.order = []; draw(); }), button("CHECK ORDER", "primary-button compact", () => resolve(state.interaction.order.join("|") === challenge.answer.join("|"), challenge.answer.join(" → ")))); elements.options.append(instruction, source, result, controls); draw(); }
function renderMistake(challenge) { const statement = document.createElement("blockquote"), instruction = document.createElement("p"), choices = document.createElement("div"); statement.className = "math-statement"; statement.textContent = `“${challenge.data.statement}”`; instruction.className = "game-instruction"; instruction.textContent = "Decide first. If it is wrong, correct the statement."; choices.className = "two-choice"; choices.append(button("✓ CORRECT", "option-button", () => judgeMistake(true, challenge)), button("✗ INCORRECT", "option-button", () => judgeMistake(false, challenge))); elements.options.append(statement, instruction, choices); }
function judgeMistake(answer, challenge) { if (answer !== challenge.answer) { resolve(false, challenge.answer ? "The statement is correct." : challenge.data.correction); return; } if (answer) { resolve(true, "Correct"); return; } elements.options.replaceChildren(); const prompt = document.createElement("p"); prompt.className = "game-instruction"; prompt.textContent = "Choose the correct version."; elements.options.append(prompt, button(challenge.data.correction, "option-button", () => resolve(true, challenge.data.correction)), button(challenge.data.statement, "option-button", () => resolve(false, challenge.data.correction))); }
function flash(message) { elements.feedback.textContent = message; elements.feedback.className = "feedback bad"; elements.feedback.hidden = false; setTimeout(() => { if (!state.locked) elements.feedback.hidden = true; }, 800); }

// ==================== SCORING AND RESULTS ====================
function resolve(correct, answer) { if (state.locked) return; state.locked = true; elements.options.querySelectorAll("button").forEach(node => { node.disabled = true; }); const challenge = state.session.challenges[state.index]; state.stats[challenge.category].correct += correct ? 1 : 0; if (correct) { state.correct += 1; state.streak += 1; state.bestStreak = Math.max(state.bestStreak, state.streak); elements.feedback.textContent = state.streak >= 3 ? `✓ EXCELLENT! 🔥 ${state.streak} STREAK` : "✓ EXCELLENT!"; elements.feedback.className = "feedback good"; } else { state.incorrect += 1; state.streak = 0; state.lives = Math.max(0, state.lives - 1); elements.feedback.textContent = `✗ NOT QUITE. The correct answer is: ${answer}`; elements.feedback.className = "feedback bad"; } elements.feedback.hidden = false; updateLive(); setTimeout(advance, 1350); }
function advance() { state.index += 1; const next = state.session.challenges[state.index]; if (!next) { finish(); return; } if (next.level !== state.level) { state.completed.push(state.level); showLevel(next.level); } else renderChallenge(); }
function updateLive() { const answered = state.correct + state.incorrect; elements.liveCorrect.textContent = state.correct; elements.liveIncorrect.textContent = state.incorrect; elements.liveStreak.textContent = state.streak; elements.lives.textContent = `${"❤️".repeat(state.lives)}${"🖤".repeat(3 - state.lives)}`; elements.progress.style.width = `${(answered / state.session.total) * 100}%`; }
function formatTime(seconds) { return `${String(Math.floor(seconds / 60)).padStart(2,"0")}:${String(seconds % 60).padStart(2,"0")}`; }
function badge(percent) { if (percent === 100) return ["♻️","RECYCLING MATH MASTER"]; if (percent >= 90) return ["🥇","SA2 MATH EXPERT"]; if (percent >= 80) return ["🥈","SA2 MATH CHALLENGER"]; if (percent >= 70) return ["🥉","SA2 MATH EXPLORER"]; return ["🌱","KEEP GROWING!"]; }
function finish() { clearInterval(state.timerId); state.elapsedSeconds = Math.floor((Date.now() - state.startedAt) / 1000); const percentage = Math.round((state.correct / state.session.total) * 100), [icon, title] = badge(percentage); elements.game.hidden = true; elements.result.hidden = false; elements.resultStudent.textContent = state.student; elements.resultClass.textContent = state.studentClass; elements.resultDate.textContent = new Intl.DateTimeFormat("en-GB", { day:"2-digit", month:"long", year:"numeric" }).format(new Date()); elements.finalCorrect.textContent = state.correct; elements.finalTotal.textContent = state.session.total; elements.finalPercentage.textContent = `${percentage}%`; elements.finalCorrectSummary.textContent = state.correct; elements.finalIncorrectSummary.textContent = state.incorrect; elements.finalBestStreak.textContent = state.bestStreak; elements.finalTime.textContent = formatTime(state.elapsedSeconds); elements.badgeIcon.textContent = icon; elements.badgeTitle.textContent = title; renderBreakdown(); renderLevels(); elements.registrationStatus.textContent = "Sending your result to your teacher…"; registerFinalResult(percentage); if (percentage === 100) confetti(); window.scrollTo({ top:0, behavior:"smooth" }); }
function renderBreakdown() { elements.breakdown.replaceChildren(); Object.keys(vocabulary).forEach(category => { const stat = state.stats[category], percent = Math.round((stat.correct / stat.total) * 100), row = document.createElement("div"), label = document.createElement("span"), track = document.createElement("div"), fill = document.createElement("div"), score = document.createElement("b"); row.className = "breakdown-row"; label.textContent = categoryLabels[category]; track.className = "breakdown-track"; fill.className = "breakdown-fill"; fill.style.width = `${percent}%`; score.textContent = `${stat.correct} / ${stat.total} (${percent}%)`; track.append(fill); row.append(label, track, score); elements.breakdown.append(row); }); }
function renderLevels() { elements.completedLevels.replaceChildren(); levels.forEach(([name]) => { const row = document.createElement("p"); row.textContent = `✓ ${name}`; elements.completedLevels.append(row); }); }
function confetti() { elements.confetti.replaceChildren(); ["#1768ac","#0f887f","#f0b63d","#be4651"].forEach((color, index) => { for (let count = 0; count < 15; count += 1) { const piece = document.createElement("i"); piece.className = "confetti"; piece.style.left = `${(index * 23 + count * 7) % 100}%`; piece.style.background = color; piece.style.animationDelay = `${count / 14}s`; elements.confetti.append(piece); } }); }
function prepareScreenshot() { document.body.classList.add("screenshot-mode"); window.scrollTo({ top:0, behavior:"smooth" }); }
function playAgain() { document.body.classList.remove("screenshot-mode"); clearInterval(state.timerId); elements.result.hidden = true; elements.welcome.hidden = false; elements.name.value = state.studentPin; elements.name.focus(); }
elements.form.addEventListener("submit", startChallenge); elements.name.addEventListener("input", () => { elements.nameError.hidden = true; }); elements.beginLevel.addEventListener("click", beginLevel); elements.screenshot.addEventListener("click", prepareScreenshot); elements.playAgain.addEventListener("click", playAgain); document.addEventListener("keydown", event => { if (event.key === "Escape") document.body.classList.remove("screenshot-mode"); });
