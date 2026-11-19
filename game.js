const canvas = document.getElementById("gameCanvas");
const overlay = document.getElementById("overlay");
const statusTextEl = document.getElementById("statusText");
const districtTextEl = document.getElementById("districtText");
const helpTextEl = document.getElementById("helpText");
const nameInput = document.getElementById("avatarName");
const bodyColorInput = document.getElementById("bodyColor");
const hairColorInput = document.getElementById("hairColor");
const accentColorInput = document.getElementById("accentColor");
const eyeColorInput = document.getElementById("eyeColor");
const outfitTypeInput = document.getElementById("outfitType");
const shoesTypeInput = document.getElementById("shoesType");
const hairStyleInput = document.getElementById("hairStyle");
const headAccessoryInput = document.getElementById("headAccessory");
const faceMoodInput = document.getElementById("faceMood");
const skinToneInput = document.getElementById("skinTone");
const pantsTypeInput = document.getElementById("pantsType");
const bodyTypeInput = document.getElementById("bodyType");
const languageSelect = document.getElementById("languageSelect");
const modeButtons = Array.from(document.querySelectorAll("[data-mode]"));
const sidebar = document.getElementById("sidebar");
const panelToggle = document.getElementById("panelToggle");
const phoneButton = document.getElementById("phoneButton");
const phonePanel = document.getElementById("phonePanel");
const phoneClose = document.getElementById("phoneClose");
const phoneJobs = document.getElementById("phoneJobs");
const phoneCoins = document.getElementById("phoneCoins");
const missionHud = document.getElementById("missionHud");
const missionArrow = document.getElementById("missionArrow");
const settingsToggle = document.getElementById("settingsToggle");
const settingsPanel = document.getElementById("settingsPanel");
const platformHub = document.getElementById("platformHub");
const launchCityGameButton = document.getElementById("launchCityGame");
const launchParkourGameButton = document.getElementById("launchParkourGame");
const backToHubButton = document.getElementById("backToHubButton");
const hubAvatarCanvas = document.getElementById("hubAvatarCanvas");
const sidebarAvatarCanvas = document.getElementById("sidebarAvatarCanvas");
const hubAvatarNameEl = document.getElementById("hubAvatarName");
const hubAvatarMoodEl = document.getElementById("hubAvatarMood");
const catalogTabs = Array.from(document.querySelectorAll("[data-catalog]"));
const catalogGrid = document.getElementById("catalogGrid");

const AVATAR_STORAGE_KEY = "blobloxAvatarSettings";

// Тона кожи и цвета штанов для каталога аватара
const SKIN_TONES = {
  porcelain: "#f6dcc6",
  light: "#f0c8a4",
  fair: "#e0aa82",
  tan: "#c68b5e",
  brown: "#97613d",
  deep: "#5c3a25"
};
const PANTS_COLORS = {
  jeans: "#3d5f8f",
  joggers: "#6b7280",
  shorts: "#c2a878",
  trousers: "#262a33",
  cargo: "#5b6b45"
};
let currentCatalogTab = "body";
let currentLanguage = "ru";

const translations = {
  ru: {
    hubTitle: "Выбери игру",
    hubText: "Настрой общего аватара для всей платформы и зайди в Block City с тем же персонажем.",
    hubAvatarLabel: "Аватар платформы",
    hubAvatarNote: "Этот аватар автоматически появится в других играх платформы.",
    cityGameMeta: "Первая мини-игра платформы",
    cityGameDesc: "Гуляй по городу, заходи в магазины, встречай NPC и исследуй улицы.",
    cityGameAction: "Играть",
    parkourGameMeta: "Вторая мини-игра платформы",
    parkourGameDesc: "Прыгай по платформам, доходи до чекпоинтов и проходи трассу как в Roblox obby.",
    parkourGameAction: "Играть",
    phoneButton: "Телефон",
    phoneTitle: "Телефон",
    phoneSubtitle: "Выбери работу и выполняй задания по городу",
    phoneCoinsLabel: "Монеты",
    phoneJobsLabel: "Работы",
    phoneTaskLabel: "Текущее задание",
    phoneNoTaskTitle: "Работа не выбрана",
    phoneNoTaskText: "Открой список работ выше и возьми первое задание.",
    missionHudTitle: "Навигация",
    missionHudIdle: "Выбери работу в телефоне, и стрелка покажет путь",
    rewardLabel: "Награда",
    statusParkour: "Статус: паркур",
    districtParkour: "Район: трасса Bloblox Parkour",
    helpParkour: "Пробел - прыжок. Прыгай по платформам, доходи до чекпоинтов и не падай вниз.",
    helpParkourCheckpoint: "Чекпоинт сохранён. Продолжай вперёд к финишу.",
    helpParkourFinish: "Финиш! Ты прошёл трассу. Можешь пробежать её ещё раз или вернуться на платформу.",
    panelToggle: "Персонаж",
    panelClose: "Закрыть",
    backToHub: "На платформу",
    sidebarTitle: "Каталог аватара",
    sidebarLead: "Собери своего героя в стиле Bloblox Platform. Все изменения сохраняются для платформы и игр.",
    settingsToggle: "Настройки",
    settingsTitle: "Настройки",
    settingsLead: "Здесь собраны язык, имя героя, цвета и режим камеры.",
    labelLanguage: "Язык",
    labelAvatarName: "Имя героя",
    labelBodyColor: "Цвет одежды",
    labelHairColor: "Цвет волос",
    labelAccentColor: "Акцент",
    labelEyeColor: "Цвет глаз",
    modeThird: "3-е лицо",
    modeFirst: "1-е лицо",
    tabs: { body: "Тело", clothing: "Одежда", pants: "Штаны", shoes: "Обувь", hair: "Волосы", accessories: "Аксессуары", mood: "Лицо" },
    tips: {
      move: "WASD - идти туда, куда смотрит камера",
      jump: "Пробел - прыжок",
      camera: "Мышь (зажать) или Q / E - крутить камеру",
      run: "Shift - быстрый бег",
      enter: "R - сесть в машину или выйти из неё",
      view: "1 / 3 - переключение камеры"
    },
    statusHub: "Статус: выбери мини-игру",
    districtHub: "Район: платформа",
    helpHub: "Открой настройки внизу, чтобы сменить язык или изменить общие параметры героя.",
    statusWalk: "Статус: прогулка по городу",
    statusInterior: "Статус: внутри здания",
    statusDriving: "Статус: за рулём",
    helpInterior: "Ты внутри: {name}. Чтобы выйти, просто пройди через дверь.",
    helpDoor: "Рядом вход в {name}. Заходи прямо через дверь!",
    helpCarNearby: "Рядом машина. Нажми R, чтобы сесть и поехать.",
    helpDriving: "Ты в машине. W/S - ехать, A/D - поворачивать, Shift - быстрее, R - выйти.",
    jobAccepted: "Новая работа принята",
    jobFinished: "Задание выполнено",
    jobs: {
      courier: {
        title: "Курьер",
        desc: "Развози посылки по магазинам города.",
        task: "Доставь посылку в {target}. Иди к метке над зданием.",
        reward: 120
      },
      taxi: {
        title: "Таксист",
        desc: "Довези клиента до точки по городу.",
        getCar: "Сначала подойди к машине и сядь в неё.",
        pickup: "Подъедь к клиенту в точку {target} и забери его.",
        dropoff: "Теперь довези клиента до точки {target}.",
        reward: 20
      },
      technician: {
        title: "Техник",
        desc: "Проверь городские объекты и электронику.",
        task: "Сначала зайди к {first}, потом доберись до {second}.",
        reward: 190
      }
    },
    helpFirst: "Вид от 1-го лица. Зажми кнопку мыши и води, чтобы осмотреться. W — идти вперёд.",
    helpThird: "Зажми кнопку мыши и води, чтобы крутить камеру. Герой идёт туда, куда смотрит камера.",
  },
  en: {
    hubTitle: "Choose Your Game",
    hubText: "Customize one shared avatar for the whole platform, then jump into Block City with the same character.",
    hubAvatarLabel: "Platform Avatar",
    hubAvatarNote: "This avatar will automatically appear in other platform games.",
    cityGameMeta: "First platform mini-game",
    cityGameDesc: "Walk through the city, visit shops, meet NPCs and explore the streets.",
    cityGameAction: "Play",
    parkourGameMeta: "Second platform mini-game",
    parkourGameDesc: "Jump across platforms, reach checkpoints and finish a Roblox-style obby course.",
    parkourGameAction: "Play",
    phoneButton: "Phone",
    phoneTitle: "Phone",
    phoneSubtitle: "Pick a job and complete tasks around the city",
    phoneCoinsLabel: "Coins",
    phoneJobsLabel: "Jobs",
    phoneTaskLabel: "Current Task",
    phoneNoTaskTitle: "No active job",
    phoneNoTaskText: "Open the list above and accept your first job.",
    missionHudTitle: "Navigation",
    missionHudIdle: "Pick a job in the phone and the arrow will lead the way",
    rewardLabel: "Reward",
    statusParkour: "Status: parkour",
    districtParkour: "District: Bloblox Parkour course",
    helpParkour: "Space - jump. Leap across platforms, reach checkpoints and avoid falling.",
    helpParkourCheckpoint: "Checkpoint saved. Keep moving toward the finish.",
    helpParkourFinish: "Finish! You cleared the course. Run it again or head back to the platform.",
    panelToggle: "Avatar",
    panelClose: "Close",
    backToHub: "To Platform",
    sidebarTitle: "Avatar Catalog",
    sidebarLead: "Build your Bloblox Platform hero. All changes are shared between the platform and games.",
    settingsToggle: "Settings",
    settingsTitle: "Settings",
    settingsLead: "Language, hero name, colors and camera mode live here.",
    labelLanguage: "Language",
    labelAvatarName: "Hero Name",
    labelBodyColor: "Clothing Color",
    labelHairColor: "Hair Color",
    labelAccentColor: "Accent",
    labelEyeColor: "Eye Color",
    modeThird: "3rd Person",
    modeFirst: "1st Person",
    tabs: { body: "Body", clothing: "Tops", pants: "Pants", shoes: "Shoes", hair: "Hair", accessories: "Accessories", mood: "Face" },
    tips: {
      move: "WASD - move where the camera looks",
      jump: "Space - jump",
      camera: "Hold mouse or Q / E - rotate camera",
      run: "Shift - sprint",
      enter: "R - get in or out of a car",
      view: "1 / 3 - switch camera"
    },
    statusHub: "Status: choose a mini-game",
    districtHub: "District: platform",
    helpHub: "Open Settings at the bottom to switch language or change shared avatar options.",
    statusWalk: "Status: city walk",
    statusInterior: "Status: inside a building",
    statusDriving: "Status: driving",
    helpInterior: "You are inside {name}. Walk out through the door to leave.",
    helpDoor: "{name} is right here. Just walk in through the door!",
    helpCarNearby: "A car is nearby. Press R to hop in and drive.",
    helpDriving: "You are driving. W/S - move, A/D - steer, Shift - boost, R - exit.",
    jobAccepted: "New job accepted",
    jobFinished: "Job complete",
    jobs: {
      courier: {
        title: "Courier",
        desc: "Deliver packages to city shops.",
        task: "Deliver the package to {target}. Follow the marker above the building.",
        reward: 120
      },
      taxi: {
        title: "Taxi Driver",
        desc: "Bring a client to a point in the city.",
        getCar: "First walk to the car and get inside.",
        pickup: "Drive to {target} and pick up the passenger.",
        dropoff: "Now bring the passenger to {target}.",
        reward: 20
      },
      technician: {
        title: "Technician",
        desc: "Inspect city tech and public systems.",
        task: "Visit {first} first, then head to {second}.",
        reward: 190
      }
    },
    helpFirst: "1st person view. Hold the mouse and move it to look around. W walks forward.",
    helpThird: "Hold the mouse and move it to rotate the camera. Your hero walks where the camera looks.",
  }
};

function showOverlay(text, isError = false) {
  overlay.textContent = text;
  overlay.classList.remove("hidden");
  overlay.classList.toggle("error", isError);
}

function hideOverlay() {
  overlay.classList.add("hidden");
}

function closeSidebar() {
  sidebar.classList.add("collapsed");
  panelToggle.textContent = translations[currentLanguage].panelToggle;
}

function loadStoredAvatarSettings() {
  try {
    const raw = window.localStorage.getItem(AVATAR_STORAGE_KEY);
    if (!raw) {
      return;
    }

    const settings = JSON.parse(raw);
    if (settings.language) currentLanguage = settings.language;
    if (settings.name) nameInput.value = settings.name;
    if (settings.bodyColor) bodyColorInput.value = settings.bodyColor;
    if (settings.hairColor) hairColorInput.value = settings.hairColor;
    if (settings.accentColor) accentColorInput.value = settings.accentColor;
    if (settings.eyeColor) eyeColorInput.value = settings.eyeColor;
    if (settings.outfitType) outfitTypeInput.value = settings.outfitType;
    if (settings.shoesType) shoesTypeInput.value = settings.shoesType;
    if (settings.hairStyle) hairStyleInput.value = settings.hairStyle;
    if (settings.headAccessory) headAccessoryInput.value = settings.headAccessory;
    if (settings.faceMood) faceMoodInput.value = settings.faceMood;
    if (settings.skinTone) skinToneInput.value = settings.skinTone;
    if (settings.pantsType) pantsTypeInput.value = settings.pantsType;
    if (settings.bodyType) bodyTypeInput.value = settings.bodyType;
    // если в сохранении было что-то, чего больше нет — берём первый вариант
    [outfitTypeInput, shoesTypeInput, hairStyleInput, headAccessoryInput, faceMoodInput, skinToneInput, pantsTypeInput, bodyTypeInput].forEach((select) => {
      if (!select.value) {
        select.selectedIndex = 0;
      }
    });
    languageSelect.value = currentLanguage;
    if (typeof settings.coins === "number") {
      state.coins = settings.coins;
    }
  } catch (error) {
    console.warn("Could not load avatar settings", error);
  }
}

function saveAvatarSettings() {
  try {
    window.localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify({
      name: nameInput.value,
      bodyColor: bodyColorInput.value,
      hairColor: hairColorInput.value,
      accentColor: accentColorInput.value,
      eyeColor: eyeColorInput.value,
      outfitType: outfitTypeInput.value,
      shoesType: shoesTypeInput.value,
      hairStyle: hairStyleInput.value,
      headAccessory: headAccessoryInput.value,
      language: currentLanguage,
      faceMood: faceMoodInput.value,
      skinTone: skinToneInput.value,
      pantsType: pantsTypeInput.value,
      bodyType: bodyTypeInput.value,
      coins: state.coins
    }));
  } catch (error) {
    console.warn("Could not save avatar settings", error);
  }
}

function updateHubAvatarPreview() {
  if (!hubAvatarNameEl) {
    return;
  }

  const face = AVATAR_CATALOG.mood.find((item) => item.value === faceMoodInput.value) || AVATAR_CATALOG.mood[0];

  hubAvatarNameEl.textContent = nameInput.value.trim() || "Block Hero";
  const hubCoinsEl = document.getElementById("hubCoins");
  if (hubCoinsEl) hubCoinsEl.textContent = `🪙 ${state.coins}`;
  hubAvatarMoodEl.textContent = face[currentLanguage][0];
}

function applyLanguage() {
  const t = translations[currentLanguage];
  document.documentElement.lang = currentLanguage;
  document.title = currentLanguage === "ru" ? "Bloblox Platform" : "Bloblox Platform";

  const hubTitleEl = document.getElementById("hubTitle");
  const hubTextEl = document.getElementById("hubText");
  if (hubTitleEl) hubTitleEl.textContent = t.hubTitle;
  if (hubTextEl) hubTextEl.textContent = t.hubText;
  document.getElementById("hubAvatarLabel").textContent = t.hubAvatarLabel;
  document.getElementById("hubAvatarNote").textContent = t.hubAvatarNote;
  document.getElementById("cityGameMeta").textContent = t.cityGameMeta;
  document.getElementById("cityGameDesc").textContent = t.cityGameDesc;
  document.getElementById("cityGameAction").textContent = t.cityGameAction;
  document.getElementById("parkourGameMeta").textContent = t.parkourGameMeta;
  document.getElementById("parkourGameDesc").textContent = t.parkourGameDesc;
  document.getElementById("parkourGameAction").textContent = t.parkourGameAction;
  backToHubButton.textContent = t.backToHub;
  panelToggle.textContent = sidebar.classList.contains("collapsed") ? t.panelToggle : t.panelClose;
  document.getElementById("sidebarTitle").textContent = t.sidebarTitle;
  document.getElementById("sidebarLead").textContent = t.sidebarLead;
  document.getElementById("settingsToggle").textContent = t.settingsToggle;
  document.getElementById("settingsTitle").textContent = t.settingsTitle;
  document.getElementById("settingsLead").textContent = t.settingsLead;
  document.getElementById("labelLanguage").textContent = t.labelLanguage;
  document.getElementById("labelAvatarName").textContent = t.labelAvatarName;
  document.getElementById("labelBodyColor").textContent = t.labelBodyColor;
  document.getElementById("labelHairColor").textContent = t.labelHairColor;
  document.getElementById("labelAccentColor").textContent = t.labelAccentColor;
  document.getElementById("labelEyeColor").textContent = t.labelEyeColor;
  document.getElementById("modeThirdLabel").textContent = t.modeThird;
  document.getElementById("modeFirstLabel").textContent = t.modeFirst;
  document.getElementById("tipMove").textContent = t.tips.move;
  document.getElementById("tipJump").textContent = t.tips.jump;
  document.getElementById("tipCamera").textContent = t.tips.camera;
  document.getElementById("tipRun").textContent = t.tips.run;
  document.getElementById("tipEnter").textContent = t.tips.enter;
  document.getElementById("tipView").textContent = t.tips.view;

  const tabMap = {
    body: "catalogTabBody",
    clothing: "catalogTabClothing",
    pants: "catalogTabPants",
    shoes: "catalogTabShoes",
    hair: "catalogTabHair",
    accessories: "catalogTabAccessories",
    mood: "catalogTabMood"
  };
  Object.entries(tabMap).forEach(([key, id]) => {
    document.getElementById(id).textContent = t.tabs[key];
  });

  updateHubAvatarPreview();
  renderCatalog();
  updatePhoneUi();
  updateUi();
}

// ---------- Каталог аватара ----------
// Каждый пункт: какое скрытое поле он меняет (input) и на что (value), иконка и названия на двух языках.
const COLOR_THEMES = [
  { id: "sky", body: "#5dd9ff", accent: "#ffd166", ru: ["Небесный", "Голубой с жёлтым"], en: ["Sky", "Cyan and yellow"] },
  { id: "mint", body: "#7ae582", accent: "#f7b267", ru: ["Мятный", "Зелёный с персиком"], en: ["Mint", "Green and peach"] },
  { id: "rose", body: "#ff8fab", accent: "#ffd6a5", ru: ["Розовый", "Мягкая пастель"], en: ["Rose", "Soft pastel"] },
  { id: "shadow", body: "#566070", accent: "#9bf6ff", ru: ["Тёмный", "Графит с неоном"], en: ["Shadow", "Graphite and neon"] },
  { id: "fire", body: "#e63946", accent: "#1d1d1f", ru: ["Огонь", "Красный с чёрным"], en: ["Fire", "Red and black"] },
  { id: "royal", body: "#3a47c4", accent: "#f5c542", ru: ["Королевский", "Синий с золотом"], en: ["Royal", "Blue and gold"] }
];

const AVATAR_CATALOG = {
  body: [
    { input: "bodyType", value: "man", icon: "🧍‍♂️", ru: ["Парень", "Обычное тело"], en: ["Guy", "Regular body"] },
    { input: "bodyType", value: "girl", icon: "🧍‍♀️", ru: ["Девушка", "Стройное тело"], en: ["Girl", "Slim body"] },
    { input: "bodyType", value: "boy", icon: "🧒", ru: ["Мальчик", "Маленький рост"], en: ["Boy", "Small and young"] },
    ...Object.entries({
      porcelain: ["Фарфоровая", "Porcelain"],
      light: ["Светлая", "Light"],
      fair: ["Бежевая", "Fair"],
      tan: ["Загар", "Tan"],
      brown: ["Смуглая", "Brown"],
      deep: ["Тёмная", "Deep"]
    }).map(([value, [ru, en]]) => ({
      input: "skinTone", value, swatch: SKIN_TONES[value], icon: "",
      ru: [`Кожа: ${ru}`, "Тон кожи"], en: [`Skin: ${en}`, "Skin tone"]
    })),
    ...COLOR_THEMES.map((theme) => ({
      theme, icon: "", swatch: `linear-gradient(135deg, ${theme.body} 0 55%, ${theme.accent} 55% 100%)`,
      ru: theme.ru, en: theme.en
    }))
  ],
  clothing: [
    { input: "outfitType", value: "hoodie", icon: "🧥", ru: ["Толстовка", "С капюшоном и карманом"], en: ["Hoodie", "Hood and pocket"] },
    { input: "outfitType", value: "tshirt", icon: "👕", ru: ["Футболка", "Короткий рукав"], en: ["T-Shirt", "Short sleeves"] },
    { input: "outfitType", value: "jacket", icon: "🥼", ru: ["Куртка", "Цвет — «Акцент»"], en: ["Jacket", "Uses accent color"] },
    { input: "outfitType", value: "sweater", icon: "🧶", ru: ["Свитер", "Вязаный с полосками"], en: ["Sweater", "Knit with stripes"] },
    { input: "outfitType", value: "shirt", icon: "👔", ru: ["Рубашка", "С галстуком"], en: ["Shirt", "With a tie"] },
    { input: "outfitType", value: "tank", icon: "🎽", ru: ["Майка", "Спортивный стиль"], en: ["Tank Top", "Sporty"] },
    { input: "outfitType", value: "suit", icon: "🤵", ru: ["Костюм", "Пиджак и галстук"], en: ["Suit", "Blazer and tie"] }
  ],
  pants: [
    { input: "pantsType", value: "jeans", icon: "👖", swatch: PANTS_COLORS.jeans, ru: ["Джинсы", "Классика"], en: ["Jeans", "Classic"] },
    { input: "pantsType", value: "joggers", icon: "🏃", swatch: PANTS_COLORS.joggers, ru: ["Джоггеры", "Спортивные с манжетами"], en: ["Joggers", "Cuffed sweatpants"] },
    { input: "pantsType", value: "shorts", icon: "🩳", swatch: PANTS_COLORS.shorts, ru: ["Шорты", "Летний вариант"], en: ["Shorts", "Summer look"] },
    { input: "pantsType", value: "trousers", icon: "🕴️", swatch: PANTS_COLORS.trousers, ru: ["Брюки", "Строгие чёрные"], en: ["Trousers", "Smart black"] },
    { input: "pantsType", value: "cargo", icon: "🎒", swatch: PANTS_COLORS.cargo, ru: ["Карго", "С боковыми карманами"], en: ["Cargo", "Side pockets"] }
  ],
  shoes: [
    { input: "shoesType", value: "sneakers", icon: "👟", ru: ["Кроссовки", "Белые с полоской"], en: ["Sneakers", "White with stripe"] },
    { input: "shoesType", value: "hightops", icon: "🏀", ru: ["Высокие кеды", "Красные баскетбольные"], en: ["High-Tops", "Red basketball"] },
    { input: "shoesType", value: "boots", icon: "🥾", ru: ["Ботинки", "Коричневые"], en: ["Boots", "Brown leather"] },
    { input: "shoesType", value: "light", icon: "👞", ru: ["Туфли", "Узкие чёрные"], en: ["Dress Shoes", "Slim black"] }
  ],
  hair: [
    { input: "hairStyle", value: "short", icon: "💇", ru: ["Короткие", "С чёлкой"], en: ["Short", "With bangs"] },
    { input: "hairStyle", value: "long", icon: "💁", ru: ["Длинные", "До плеч"], en: ["Long", "Shoulder length"] },
    { input: "hairStyle", value: "bob", icon: "💇‍♀️", ru: ["Каре", "Ровная стрижка"], en: ["Bob", "Neat cut"] },
    { input: "hairStyle", value: "ponytail", icon: "🎀", ru: ["Хвостик", "Собранные волосы"], en: ["Ponytail", "Tied back"] },
    { input: "hairStyle", value: "bun", icon: "🍡", ru: ["Пучок", "На макушке"], en: ["Bun", "Top knot"] },
    { input: "hairStyle", value: "curly", icon: "🌀", ru: ["Кудри", "Объёмные"], en: ["Curly", "Big curls"] },
    { input: "hairStyle", value: "spiky", icon: "⚡", ru: ["Торчком", "Как у аниме-героя"], en: ["Spiky", "Anime hero"] },
    { input: "hairStyle", value: "mohawk", icon: "🦔", ru: ["Ирокез", "Панк-стиль"], en: ["Mohawk", "Punk style"] },
    { input: "hairStyle", value: "buzz", icon: "✂️", ru: ["Ёжик", "Очень коротко"], en: ["Buzz Cut", "Very short"] },
    { input: "hairStyle", value: "bald", icon: "🥚", ru: ["Лысый", "Без волос"], en: ["Bald", "No hair"] }
  ],
  accessories: [
    { input: "headAccessory", value: "none", icon: "✖️", ru: ["Ничего", "Без аксессуара"], en: ["None", "No accessory"] },
    { input: "headAccessory", value: "cap", icon: "🧢", ru: ["Кепка", "Цвет — «Акцент»"], en: ["Cap", "Uses accent color"] },
    { input: "headAccessory", value: "beanie", icon: "❄️", ru: ["Шапка", "С помпоном"], en: ["Beanie", "With a pom-pom"] },
    { input: "headAccessory", value: "headphones", icon: "🎧", ru: ["Наушники", "Для музыки"], en: ["Headphones", "For music"] },
    { input: "headAccessory", value: "glasses", icon: "👓", ru: ["Очки", "Умный вид"], en: ["Glasses", "Smart look"] },
    { input: "headAccessory", value: "sunglasses", icon: "🕶️", ru: ["Тёмные очки", "Крутой вид"], en: ["Sunglasses", "Cool look"] },
    { input: "headAccessory", value: "crown", icon: "👑", ru: ["Корона", "Золотая с рубином"], en: ["Crown", "Gold with ruby"] },
    { input: "headAccessory", value: "backpack", icon: "🎒", ru: ["Рюкзак", "На спину"], en: ["Backpack", "On your back"] }
  ],
  mood: [
    { input: "faceMood", value: "smile", icon: "🙂", ru: ["Улыбка", "Дружелюбный"], en: ["Smile", "Friendly"] },
    { input: "faceMood", value: "happy", icon: "😄", ru: ["Радость", "Широкая улыбка"], en: ["Happy", "Big grin"] },
    { input: "faceMood", value: "wink", icon: "😉", ru: ["Подмигивает", "Хитрый"], en: ["Wink", "Sly"] },
    { input: "faceMood", value: "cool", icon: "😏", ru: ["Уверенный", "С ухмылкой"], en: ["Cool", "Smirk"] },
    { input: "faceMood", value: "freckles", icon: "😊", ru: ["Веснушки", "Милый с румянцем"], en: ["Freckles", "Cute and rosy"] },
    { input: "faceMood", value: "neutral", icon: "😐", ru: ["Спокойный", "Без эмоций"], en: ["Neutral", "Calm"] },
    { input: "faceMood", value: "surprised", icon: "😮", ru: ["Удивлённый", "Ого!"], en: ["Surprised", "Whoa!"] },
    { input: "faceMood", value: "angry", icon: "😠", ru: ["Злой", "Хмурые брови"], en: ["Angry", "Frowning"] },
    { input: "faceMood", value: "sleepy", icon: "😴", ru: ["Сонный", "Полузакрытые глаза"], en: ["Sleepy", "Half-closed eyes"] }
  ]
};

function getCatalogInput(name) {
  return {
    skinTone: skinToneInput,
    outfitType: outfitTypeInput,
    pantsType: pantsTypeInput,
    shoesType: shoesTypeInput,
    hairStyle: hairStyleInput,
    headAccessory: headAccessoryInput,
    faceMood: faceMoodInput,
    bodyType: bodyTypeInput
  }[name];
}

function isCatalogItemActive(item) {
  if (item.theme) {
    return bodyColorInput.value.toLowerCase() === item.theme.body && accentColorInput.value.toLowerCase() === item.theme.accent;
  }
  return getCatalogInput(item.input).value === item.value;
}

function applyCatalogItem(item) {
  if (item.theme) {
    bodyColorInput.value = item.theme.body;
    accentColorInput.value = item.theme.accent;
    return;
  }
  getCatalogInput(item.input).value = item.value;
}

function renderCatalog() {
  if (!catalogGrid) {
    return;
  }

  const items = AVATAR_CATALOG[currentCatalogTab] || [];
  catalogGrid.innerHTML = items.map((item, index) => {
    const [title, meta] = item[currentLanguage] || item.ru;
    const background = item.swatch ? ` style="background:${item.swatch}"` : "";
    return `
    <button class="catalog-card${isCatalogItemActive(item) ? " active" : ""}" type="button" data-catalog-index="${index}">
      <div class="catalog-card__thumb">
        <div class="catalog-card__icon${item.swatch ? " catalog-card__icon--swatch" : ""}"${background}>${item.icon || ""}</div>
      </div>
      <div class="catalog-card__body">
        <div class="catalog-card__title">${title}</div>
        <div class="catalog-card__meta">${meta}</div>
      </div>
    </button>`;
  }).join("");

  Array.from(catalogGrid.querySelectorAll("[data-catalog-index]")).forEach((button) => {
    button.addEventListener("click", () => {
      const item = items[Number(button.dataset.catalogIndex)];
      if (!item) {
        return;
      }
      applyCatalogItem(item);
      saveAvatarSettings();
      syncAvatarSettings();
      renderCatalog();
    });
  });

  catalogTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.catalog === currentCatalogTab);
  });
}

function showToast(message) {
  showOverlay(message);
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(hideOverlay, 1500);
}

function getTaxiStops() {
  return [
    { label: currentLanguage === "ru" ? "Северный перекрёсток" : "North Junction", x: -120, z: -120 },
    { label: currentLanguage === "ru" ? "Центральная площадь" : "Central Square", x: 40, z: -40 },
    { label: currentLanguage === "ru" ? "Южная линия" : "South Line", x: -40, z: 120 },
    { label: currentLanguage === "ru" ? "Восточный квартал" : "East Quarter", x: 120, z: 40 }
  ];
}

function createMissionMarker() {
  if (missionMarker) {
    return;
  }

  missionMarker = new THREE.Group();
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.2, 0.18, 12, 28),
    new THREE.MeshStandardMaterial({ color: 0x7ae582, emissive: 0x7ae582, emissiveIntensity: 0.5, roughness: 0.28 })
  );
  ring.rotation.x = Math.PI / 2;
  missionMarker.add(ring);

  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.38, 7.5, 12),
    new THREE.MeshStandardMaterial({ color: 0x9bf6ff, emissive: 0x9bf6ff, emissiveIntensity: 0.35, transparent: true, opacity: 0.5, roughness: 0.2 })
  );
  beam.position.y = 3.75;
  missionMarker.add(beam);

  const beacon = new THREE.Mesh(
    new THREE.ConeGeometry(0.72, 1.5, 14),
    new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xffd166, emissiveIntensity: 0.65, roughness: 0.3 })
  );
  beacon.position.y = 8.2;
  missionMarker.add(beacon);
  missionMarker.visible = false;
  scene.add(missionMarker);
}

function createTaxiPassenger() {
  if (taxiPassenger) {
    return;
  }

  const passengerData = createNpcAvatar({
    body: "#f7b267", accent: "#3f5a8a", hair: "#2b2f3a", eyes: "#5a3b24", skin: "tan",
    outfit: "shirt", pants: "trousers", shoes: "light", hairStyle: "short", accessory: "glasses", face: "smile"
  });
  taxiPassenger = passengerData.group;
  taxiPassengerParts = passengerData.parts;
  taxiPassenger.scale.setScalar(TAXI_PASSENGER_WORLD_SCALE);
  taxiPassenger.visible = false;
  scene.add(taxiPassenger);
}

function createRoadGuide() {
  if (roadGuideGroup) {
    return;
  }

  roadGuideGroup = new THREE.Group();
  roadGuideGroup.visible = false;
  scene.add(roadGuideGroup);
}

function getJobCatalog() {
  const t = translations[currentLanguage];
  const base = [
    { id: "courier", title: t.jobs.courier.title, desc: t.jobs.courier.desc },
    { id: "taxi", title: t.jobs.taxi.title, desc: t.jobs.taxi.desc },
    { id: "technician", title: t.jobs.technician.title, desc: t.jobs.technician.desc }
  ];
  const extra = Object.entries(EXTRA_JOB_TEXT).map(([id, text]) => {
    const [title, desc] = text[currentLanguage] || text.ru;
    return { id, title, desc };
  });
  return [...base, ...extra].map((job) => ({ ...job, ...JOB_STYLES[job.id] }));
}

function getRandomItem(items, filterFn = null) {
  const filtered = filterFn ? items.filter(filterFn) : items.slice();
  if (filtered.length === 0) {
    return null;
  }
  return filtered[Math.floor(Math.random() * filtered.length)];
}

function getTaskText(job) {
  const t = translations[currentLanguage];
  if (!job) {
    return { title: t.phoneNoTaskTitle, text: t.phoneNoTaskText };
  }
  const stage = job.stages[job.stageIndex];
  if (stage && stage.text) {
    return { title: job.title, text: stage.text };
  }
  if (job.id === "taxi") {
    if (stage.type === "car") return { title: t.jobs.taxi.title, text: t.jobs.taxi.getCar };
    if (stage.type === "pickup") return { title: t.jobs.taxi.title, text: t.jobs.taxi.pickup.replace("{target}", stage.label) };
    return { title: t.jobs.taxi.title, text: t.jobs.taxi.dropoff.replace("{target}", stage.label) };
  }
  if (job.id === "courier") {
    return { title: t.jobs.courier.title, text: t.jobs.courier.task.replace("{target}", stage.label) };
  }
  const ru = currentLanguage === "ru";
  return {
    title: job.title,
    text: ru ? `Доберись до: ${stage.label}` : `Head to: ${stage.label}`
  };
}

function updateMissionMarker() {
  if (!missionMarker) {
    return;
  }

  const activeStage = state.activeJob ? state.activeJob.stages[state.activeJob.stageIndex] : null;
  const visible = Boolean(activeStage) && state.currentGame === "city" && state.currentInterior === null && !state.inHub;
  missionMarker.visible = visible;
  if (!visible) {
    if (taxiPassenger) {
      taxiPassenger.visible = false;
    }
    return;
  }

  const targetX = activeStage.car ? activeStage.car.group.position.x : activeStage.x;
  const targetZ = activeStage.car ? activeStage.car.group.position.z : activeStage.z;
  missionMarker.position.set(targetX, 0.4, targetZ);

  if (taxiPassenger) {
    if (state.activeJob?.id === "taxi" && activeStage.type === "pickup") {
      taxiPassenger.visible = true;
      if (taxiPassenger.parent !== scene) {
        taxiPassenger.parent.remove(taxiPassenger);
        scene.add(taxiPassenger);
      }
      taxiPassenger.scale.setScalar(TAXI_PASSENGER_WORLD_SCALE);
      taxiPassenger.position.set(activeStage.x + 14, getGroundHeight(activeStage.x + 14, activeStage.z + 14), activeStage.z + 14);
      taxiPassenger.rotation.y = 0;
      animateAvatarRig(taxiPassengerParts, 1 / 60, { time: clock.elapsedTime });
    } else if (state.activeJob?.id === "taxi" && state.activeJob.passengerOnboard) {
      // пассажир садится на сиденье в салоне
      const taxiCar = state.activeJob.stages[0]?.car;
      if (taxiCar && taxiPassenger.parent !== taxiCar.passengerSeat) {
        if (taxiPassenger.parent) {
          taxiPassenger.parent.remove(taxiPassenger);
        }
        taxiCar.passengerSeat.add(taxiPassenger);
      }
      taxiPassenger.visible = true;
      taxiPassenger.position.set(0, -AVATAR_HIP_HEIGHT * TAXI_PASSENGER_CAR_SCALE + 0.17, 0);
      taxiPassenger.rotation.set(0, 0, 0);
      taxiPassenger.scale.setScalar(TAXI_PASSENGER_CAR_SCALE);
      animateAvatarRig(taxiPassengerParts, 1 / 60, { seated: true, passenger: true, recline: taxiCar ? taxiCar.spec.recline : 0.15, time: clock.elapsedTime });
    } else {
      if (taxiPassenger.parent !== scene) {
        taxiPassenger.parent.remove(taxiPassenger);
        scene.add(taxiPassenger);
      }
      taxiPassenger.scale.setScalar(TAXI_PASSENGER_WORLD_SCALE);
      taxiPassenger.visible = false;
    }
  }
}

function updateMissionHud() {
  const t = translations[currentLanguage];
  if (!missionHud || !missionArrow) {
    return;
  }

  const activeStage = state.activeJob ? state.activeJob.stages[state.activeJob.stageIndex] : null;
  const visible = Boolean(activeStage) && state.currentGame === "city" && !state.inHub;
  missionHud.classList.toggle("hidden", !visible);
  document.getElementById("missionHudTitle").textContent = t.missionHudTitle;

  if (!visible) {
    document.getElementById("missionHudText").textContent = t.missionHudIdle;
    missionArrow.style.transform = "rotate(0deg)";
    return;
  }

  const targetX = activeStage.car ? activeStage.car.group.position.x : activeStage.x;
  const targetZ = activeStage.car ? activeStage.car.group.position.z : activeStage.z;
  const dx = targetX - player.position.x;
  const dz = targetZ - player.position.z;
  const distance = Math.round(Math.hypot(dx, dz));
  const worldAngle = Math.atan2(dx, dz);
  const relativeAngle = worldAngle - player.angle;
  missionArrow.style.transform = `rotate(${relativeAngle}rad)`;
  document.getElementById("missionHudText").textContent = `${activeStage.label} • ${distance}m`;
}

function updateRoadGuide() {
  if (!roadGuideGroup) {
    return;
  }

  while (roadGuideGroup.children.length > 0) {
    const child = roadGuideGroup.children[roadGuideGroup.children.length - 1];
    roadGuideGroup.remove(child);
    if (child.geometry) {
      child.geometry.dispose();
    }
    if (child.material) {
      child.material.dispose();
    }
  }

  const activeStage = state.activeJob ? state.activeJob.stages[state.activeJob.stageIndex] : null;
  const visible = Boolean(activeStage) && state.currentGame === "city" && state.currentInterior === null && !state.inHub;
  roadGuideGroup.visible = visible;
  if (!visible) {
    return;
  }

  const targetX = activeStage.car ? activeStage.car.group.position.x : activeStage.x;
  const targetZ = activeStage.car ? activeStage.car.group.position.z : activeStage.z;
  const start = new THREE.Vector3(player.position.x, 0.06, player.position.z);
  const end = new THREE.Vector3(targetX, 0.06, targetZ);
  const direction = new THREE.Vector3().subVectors(end, start);
  const distance = direction.length();
  if (distance < 10) {
    return;
  }

  direction.normalize();
  const angle = Math.atan2(direction.x, direction.z);
  const markerCount = Math.min(16, Math.max(4, Math.floor(distance / 14)));

  for (let index = 1; index <= markerCount; index += 1) {
    const progress = index / (markerCount + 1);
    const marker = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.03, 3),
      new THREE.MeshStandardMaterial({
        color: 0xffef9b,
        emissive: 0xffd166,
        emissiveIntensity: 0.48,
        transparent: true,
        opacity: 0.88,
        roughness: 0.32
      })
    );
    marker.position.lerpVectors(start, end, progress);
    marker.rotation.y = angle;
    roadGuideGroup.add(marker);

    const tip = new THREE.Mesh(
      new THREE.ConeGeometry(0.86, 1.35, 3),
      new THREE.MeshStandardMaterial({
        color: 0xffd166,
        emissive: 0xffd166,
        emissiveIntensity: 0.56,
        transparent: true,
        opacity: 0.92,
        roughness: 0.28
      })
    );
    tip.position.copy(marker.position);
    tip.position.addScaledVector(direction, 1.1);
    tip.position.y = 0.08;
    tip.rotation.x = Math.PI / 2;
    tip.rotation.z = -angle;
    roadGuideGroup.add(tip);
  }
}

// Перерисовка телефона: строка статуса + открытое приложение
function updatePhoneUi() {
  if (!phonePanel || !phoneScreen) {
    return;
  }
  const t = translations[currentLanguage];
  const ru = currentLanguage === "ru";
  if (phoneButton) phoneButton.textContent = `📱 ${t.phoneButton}`;
  const clock = document.getElementById("phoneClock");
  if (clock) clock.textContent = formatPhoneTime(Date.now());
  const statusCoins = document.getElementById("phoneStatusCoins");
  if (statusCoins) statusCoins.textContent = `🪙 ${state.coins}`;
  if (phonePanel.classList.contains("hidden")) {
    return;
  }
  const header = (title) => `<div class="app-header"><button class="app-back" data-action="home" type="button">‹</button><span>${title}</span></div>`;
  const appName = (id) => {
    const app = PHONE_APPS.find((a) => a.id === id);
    return app ? app[currentLanguage] || app.ru : id;
  };
  let html = "";

  if (phoneState.app === "home") {
    const job = state.activeJob;
    const task = getTaskText(job);
    html = `<div class="phone-home">
      <div class="phone-widget">
        <div class="phone-widget__time">${formatPhoneTime(Date.now())}</div>
        <div class="phone-widget__date">${state.isNight ? "🌙" : "☀️"} ${state.district || "Bloblox"}</div>
        <div class="phone-widget__task">${job ? `${(JOB_STYLES[job.id] || {}).icon || "💼"} ${task.text}` : (ru ? "Нет активной работы — загляни в «Работа»" : "No active job — open Jobs")}</div>
      </div>
      <div class="phone-apps">${PHONE_APPS.map((app) => `
        <button class="phone-app" data-app="${app.id}" type="button">
          <span class="phone-app__icon" style="background:${app.color}">${app.icon}${app.id === "messages" && phoneMessages.length ? `<i>${phoneMessages.length}</i>` : ""}</span>
          <span class="phone-app__name">${app[currentLanguage] || app.ru}</span>
        </button>`).join("")}
      </div>
    </div>`;
  } else if (phoneState.app === "jobs") {
    const job = state.activeJob;
    const active = job ? (() => {
      const style = JOB_STYLES[job.id] || {};
      const task = getTaskText(job);
      const total = job.stages.length;
      const percent = Math.round((job.stageIndex / total) * 100);
      return `<div class="job-active" style="--job:${style.color}">
        <div class="job-active__top"><span class="job-icon">${style.icon}</span><div><b>${job.title}</b><small>${ru ? "Сейчас выполняешь" : "In progress"}</small></div><span class="job-reward">+${job.reward}</span></div>
        <div class="job-active__task">${task.text}</div>
        <div class="job-progress"><span style="width:${percent}%"></span></div>
        <div class="job-active__meta">${ru ? "Этап" : "Step"} ${Math.min(job.stageIndex + 1, total)} / ${total}</div>
        <button class="job-cancel" data-action="cancel-job" type="button">${ru ? "Отказаться" : "Quit job"}</button>
      </div>`;
    })() : "";
    const modeLabel = { walk: ru ? "🚶 пешком" : "🚶 on foot", car: ru ? "🚗 на машине" : "🚗 by car", any: ru ? "🚶/🚗 как удобно" : "🚶/🚗 any" };
    html = `${header(appName("jobs"))}<div class="app-body">
      ${active}
      <div class="app-section">${ru ? "Доступные работы" : "Available jobs"}</div>
      ${getJobCatalog().map((entry) => `
        <div class="job-card${job && job.id === entry.id ? " job-card--active" : ""}" style="--job:${entry.color}">
          <span class="job-icon">${entry.icon}</span>
          <div class="job-card__text"><b>${entry.title}</b><small>${entry.desc}</small><em>${modeLabel[entry.mode]}</em></div>
          <div class="job-card__side"><span class="job-reward">${entry.reward} 🪙</span>
          <button class="job-take" data-job="${entry.id}" type="button"${job ? " disabled" : ""}>${ru ? "Взять" : "Take"}</button></div>
        </div>`).join("")}
    </div>`;
  } else if (phoneState.app === "bank") {
    html = `${header(appName("bank"))}<div class="app-body">
      <div class="bank-card"><small>Bloblox Bank</small><b>${state.coins} 🪙</b><span>**** ${String(4000 + (state.coins % 1000)).slice(-4)}</span></div>
      <div class="app-section">${ru ? "История" : "History"}</div>
      ${bankHistory.length ? bankHistory.map((item) => `<div class="bank-row"><span>${item.amount > 0 ? "⬆️" : "⬇️"} ${item.label}<small>${formatPhoneTime(item.time)}</small></span><b class="${item.amount > 0 ? "plus" : "minus"}">${item.amount > 0 ? "+" : ""}${item.amount}</b></div>`).join("") : `<div class="app-empty">${ru ? "Пока пусто. Выполни работу — и тут появятся деньги!" : "Nothing yet. Finish a job to earn coins!"}</div>`}
    </div>`;
  } else if (phoneState.app === "garage") {
    const mine = cars.filter((car) => car.owned || (car.flying && !car.remoteDriven));
    html = `${header(appName("garage"))}<div class="app-body">
      ${mine.length ? mine.map((car, index) => {
        const spec = CAR_MODELS[car.modelId];
        const distance = Math.round(Math.hypot(car.group.position.x - player.position.x, car.group.position.z - player.position.z));
        return `<div class="garage-row"><span class="job-icon">${car.flying ? "🛸" : "🚗"}</span><div class="job-card__text"><b>${currentLanguage === "ru" ? spec.ru : spec.en}</b><small>${distance} ${ru ? "м от тебя" : "m away"}</small></div>
          <button class="job-take" data-action="call-car" data-car="${index}" type="button">${ru ? "Вызвать" : "Call"}</button></div>`;
      }).join("") : `<div class="app-empty">${ru ? "Своих машин пока нет. Купи первую в автосалоне у трассы!" : "No cars yet. Buy one at the dealership!"}</div>`}
      <div class="app-hint">${ru ? "Машина приедет и встанет рядом с тобой." : "The car will park right next to you."}</div>
    </div>`;
  } else if (phoneState.app === "camera") {
    html = `${header(appName("camera"))}<div class="app-body camera-app">
      <div class="camera-view">📷<small>${ru ? "Наведи камеру игры и нажми на кнопку" : "Aim the game camera and press the button"}</small></div>
      <button class="camera-shutter" data-action="photo" type="button" aria-label="photo"></button>
      <div class="app-hint">${ru ? `Фото в галерее: ${phoneGallery.length}` : `Photos in gallery: ${phoneGallery.length}`}</div>
    </div>`;
  } else if (phoneState.app === "gallery") {
    if (phoneState.galleryIndex !== null && phoneGallery[phoneState.galleryIndex]) {
      const photo = phoneGallery[phoneState.galleryIndex];
      html = `${header(appName("gallery"))}<div class="app-body"><img class="gallery-big" src="${photo.url}" alt="">
        <a class="job-take gallery-download" href="${photo.url}" download="bloblox-photo-${photo.time}.jpg">${ru ? "Скачать фото" : "Download"}</a>
        <button class="job-cancel" data-action="gallery-back" type="button">${ru ? "Назад к фото" : "Back"}</button></div>`;
    } else {
      html = `${header(appName("gallery"))}<div class="app-body">${phoneGallery.length
        ? `<div class="gallery-grid">${phoneGallery.map((photo, index) => `<img src="${photo.url}" data-photo="${index}" alt="">`).join("")}</div>`
        : `<div class="app-empty">${ru ? "Фото пока нет — сделай первое в «Камере» 📸" : "No photos yet — open Camera 📸"}</div>`}</div>`;
    }
  } else if (phoneState.app === "music") {
    html = `${header(appName("music"))}<div class="app-body">
      <div class="music-now">${radioState.station !== null ? `🎶 ${RADIO_STATIONS[radioState.station][currentLanguage] || RADIO_STATIONS[radioState.station].ru}` : (ru ? "Радио выключено" : "Radio off")}</div>
      ${RADIO_STATIONS.map((station, index) => `<button class="music-station${radioState.station === index ? " active" : ""}" data-action="radio" data-station="${index}" type="button">${radioState.station === index ? "⏸" : "▶️"} ${station[currentLanguage] || station.ru}<small>${station.bpm} BPM</small></button>`).join("")}
      <label class="music-volume">🔈<input type="range" min="0" max="100" value="${Math.round(radioState.volume * 100)}" data-action="volume">🔊</label>
    </div>`;
  } else if (phoneState.app === "weather") {
    const left = Math.max(0, Math.round(dayNightConfig.phaseDuration - state.dayNightTimer));
    html = `${header(appName("weather"))}<div class="app-body weather-app ${state.isNight ? "night" : "day"}">
      <div class="weather-big">${state.isNight ? "🌙" : "☀️"}</div>
      <div class="weather-temp">${state.isNight ? "+14°" : "+23°"}</div>
      <div class="weather-text">${state.isNight ? (ru ? "Ясная ночь" : "Clear night") : (ru ? "Солнечно" : "Sunny")} · ${state.district || ""}</div>
      <div class="app-hint">${ru ? `До смены через ${Math.floor(left / 60)} мин ${left % 60} сек` : `Changes in ${Math.floor(left / 60)}m ${left % 60}s`}</div>
      <button class="job-take" data-action="toggle-night" type="button">${state.isNight ? (ru ? "Сделать день ☀️" : "Make it day ☀️") : (ru ? "Сделать ночь 🌙" : "Make it night 🌙")}</button>
    </div>`;
  } else if (phoneState.app === "messages") {
    html = `${header(appName("messages"))}<div class="app-body">${phoneMessages.map((message) => `
      <div class="message-row"><span class="message-avatar">${message.from.slice(0, 1)}</span><div><b>${message.from}<small>${formatPhoneTime(message.time)}</small></b><p>${message.text}</p></div></div>`).join("") || `<div class="app-empty">${ru ? "Сообщений нет" : "No messages"}</div>`}</div>`;
  } else if (phoneState.app === "settings") {
    html = `${header(appName("settings"))}<div class="app-body">
      <div class="settings-row"><span>🌐 ${ru ? "Язык" : "Language"}</span><button class="job-take" data-action="language" type="button">${ru ? "Русский" : "English"}</button></div>
      <div class="settings-row"><span>🎥 ${ru ? "Камера" : "Camera"}</span><button class="job-take" data-action="camera-mode" type="button">${state.mode === "first" ? (ru ? "1-е лицо" : "1st person") : (ru ? "3-е лицо" : "3rd person")}</button></div>
      <div class="settings-row"><span>🖥️ ${ru ? "Графика" : "Graphics"}</span><button class="job-take" data-action="graphics" type="button">${gfx.smooth ? (ru ? "Плавно" : "Smooth") : (ru ? "Чётко" : "Sharp")}</button></div>
      <div class="settings-row"><span>⚙️ ${ru ? "Коробка передач" : "Gearbox"}</span><button class="job-take" data-action="gearbox" type="button">${driveSettings.gearbox ? (ru ? "Включена" : "On") : (ru ? "Без коробки" : "Off")}</button></div>
      <div class="settings-row"><span>🔊 ${ru ? "Звук" : "Sound"}</span><button class="job-take" data-action="sound" type="button">${audioState.muted ? (ru ? "Выкл" : "Off") : (ru ? "Вкл" : "On")}</button></div>
      <div class="app-hint">${ru ? "Телефон открывается кнопкой «Телефон» или клавишей P" : "Open the phone with the Phone button or the P key"}</div>
    </div>`;
  }
  phoneScreen.innerHTML = html;
}

// Взять работу: строим этапы (куда идти) и показываем стрелку
function acceptJob(jobId) {
  const t = translations[currentLanguage];
  const ru = currentLanguage === "ru";
  const pick = (filter) => getRandomItem(buildings, filter);
  const stageAt = (building, text) => ({ label: building.name, x: building.doorX, z: building.doorZ, text });
  const style = JOB_STYLES[jobId];
  const catalogEntry = getJobCatalog().find((job) => job.id === jobId);
  let stages = null;

  if (jobId === "courier") {
    const target = pick((b) => /market|cafe|bookstore|fashion|toy|pet|flower|tech/.test(b.type));
    if (target) stages = [{ label: target.name, x: target.doorX, z: target.doorZ }];
  } else if (jobId === "taxi") {
    const carTarget = getRandomItem(cars, (car) => !car.flying && !car.owned && Math.hypot(player.position.x - car.group.position.x, player.position.z - car.group.position.z) > 8) || cars[0];
    const pickup = getRandomItem(getTaxiStops(), (stop) => Math.hypot(carTarget.group.position.x - stop.x, carTarget.group.position.z - stop.z) > 30);
    const destination = getRandomItem(getTaxiStops(), (stop) => pickup && stop.label !== pickup.label && Math.hypot(stop.x - pickup.x, stop.z - pickup.z) > 50);
    if (carTarget && pickup && destination) {
      stages = [
        { type: "car", label: ru ? "Твоя машина" : "Your car", car: carTarget },
        { type: "pickup", label: pickup.label, x: pickup.x, z: pickup.z },
        { type: "dropoff", label: destination.label, x: destination.x, z: destination.z }
      ];
    }
  } else if (jobId === "technician") {
    const first = pick((b) => b.type === "tech") || buildings[0];
    const second = pick((b) => b.type === "office" || b.type === "clinic") || buildings[1];
    stages = [stageAt(first, ru ? `Проверь технику в ${first.name}` : `Check the gear at ${first.name}`), stageAt(second, ru ? `Теперь почини сеть в ${second.name}` : `Now fix the network at ${second.name}`)];
  } else if (jobId === "pizza") {
    const cafe = pick((b) => b.type === "cafe");
    const home = pick((b) => b.type === "residence" && b.style === "city");
    if (cafe && home) stages = [stageAt(cafe, ru ? `Забери пиццу в «${cafe.name}» 🍕` : `Grab the pizza at ${cafe.name} 🍕`), stageAt(home, ru ? `Отнеси пиццу в «${home.name}», пока горячая!` : `Deliver it to ${home.name} while it's hot!`)];
  } else if (jobId === "postman") {
    const used = new Set();
    stages = [1, 2, 3].map((n) => {
      const target = pick((b) => b.style === "city" && !used.has(b));
      used.add(target);
      return stageAt(target, ru ? `Письмо ${n} из 3: отнеси в «${target.name}» 📮` : `Letter ${n}/3: deliver to ${target.name} 📮`);
    });
  } else if (jobId === "photographer") {
    const spots = [
      { label: ru ? "Колесо обозрения" : "Ferris wheel", x: 0, z: -1 },
      { label: ru ? "Небоскрёбы Сити" : "City towers", x: 80, z: -60 },
      { label: ru ? "Мельница в посёлке" : "Village windmill", x: -535, z: 110 },
      { label: ru ? "Озеро в лесопарке" : "Forest lake", x: -28, z: -388 },
      { label: ru ? "Часовая башня в Горном" : "Mountain clock tower", x: VALLEY.x - 12, z: VALLEY.z },
      { label: ru ? "Тоннель в горах" : "Mountain tunnel", x: TUNNEL.x0 - 20, z: TUNNEL.z - 8 }
    ];
    const chosen = [];
    while (chosen.length < 3) {
      const spot = spots[Math.floor(Math.random() * spots.length)];
      if (!chosen.includes(spot)) chosen.push(spot);
    }
    stages = chosen.map((spot, i) => ({ ...spot, text: ru ? `Фото ${i + 1} из 3: ${spot.label} 📷` : `Photo ${i + 1}/3: ${spot.label} 📷` }));
  } else if (jobId === "farmer") {
    const farm = buildings.find((b) => b.name === "Сельпо");
    const market = buildings.find((b) => b.name === "Солнечный Маркет");
    if (farm && market) stages = [stageAt(farm, ru ? "Загрузи овощи в Сельпо 🥕" : "Load veggies at the village store 🥕"), stageAt(market, ru ? "Отвези овощи в Солнечный Маркет 🚜" : "Bring them to Sunny Market 🚜")];
  } else if (jobId === "mountain") {
    const gas = buildings.find((b) => b.name === "Магазин 24/7");
    const ski = buildings.find((b) => b.name === "Лыжная лавка");
    if (gas && ski) stages = [stageAt(gas, ru ? "Забери посылку в магазине на заправке 📦" : "Pick up the parcel at the gas station 📦"), stageAt(ski, ru ? "Довези посылку через тоннель в Лыжную лавку 🏔️" : "Drive it through the tunnel to the ski shop 🏔️")];
  }

  if (!stages || stages.some((stage) => !stage)) {
    return;
  }
  state.activeJob = {
    id: jobId,
    title: catalogEntry ? catalogEntry.title : jobId,
    reward: style ? style.reward : 100,
    passengerOnboard: false,
    stageIndex: 0,
    stages
  };
  updateMissionMarker();
  updateMissionHud();
  updatePhoneUi();
  showToast(`${style ? style.icon : "💼"} ${t.jobAccepted}`);
}

function updateJobsProgress() {
  if (!state.activeJob || state.currentGame !== "city" || state.inHub) {
    return;
  }
  const job = state.activeJob;
  const stage = job.stages[job.stageIndex];
  if (!stage) {
    return;
  }
  const ru = currentLanguage === "ru";
  if (job.id === "taxi") {
    if (stage.type === "car") {
      if (state.currentVehicle === stage.car) {
        job.stageIndex += 1;
        updateMissionMarker();
        updateMissionHud();
        updatePhoneUi();
        showToast(ru ? "Отлично. Теперь езжай к клиенту." : "Great. Now drive to the passenger.");
      }
      return;
    }
    if (Math.hypot(player.position.x - stage.x, player.position.z - stage.z) > 16 || state.currentVehicle !== job.stages[0].car) {
      return;
    }
    if (stage.type === "pickup") {
      job.passengerOnboard = true;
      job.stageIndex += 1;
      updateMissionMarker();
      updateMissionHud();
      updatePhoneUi();
      showToast(ru ? "Пассажир сел в машину. Вези его к точке назначения." : "The passenger is in. Drive to the destination.");
      return;
    }
    finishJob();
    return;
  }
  // обычные работы: дошёл до точки — следующий этап
  const reach = state.currentVehicle ? 14 : 9;
  if (Math.hypot(player.position.x - stage.x, player.position.z - stage.z) > reach) {
    return;
  }
  job.stageIndex += 1;
  if (job.stageIndex >= job.stages.length) {
    finishJob();
    return;
  }
  showToast(ru ? `✅ Этап ${job.stageIndex} из ${job.stages.length} готов!` : `✅ Step ${job.stageIndex}/${job.stages.length} done!`);
  updateMissionMarker();
  updatePhoneUi();
}

function setGameVisibility(game) {
  cityGroup.visible = game === "city";
  interiorGroup.visible = game === "city" && state.currentInterior !== null;
  parkourGroup.visible = game === "parkour";
  setNpcVisibility(game === "city" && state.currentInterior === null);
}

function launchCityGame() {
  warmUpWorld();
  state.inHub = false;
  state.currentGame = "city";
  state.currentInterior = null;
  state.currentVehicle = null;
  state.parkourFinished = false;
  parkourMessage = "";
  platformHub.classList.add("hidden");
  closeSidebar();
  panelToggle.classList.add("hidden");
  backToHubButton.classList.remove("hidden");
  respawnPlayer(safeSpawn);
  if (net.room !== null) spawnNearOwnCar(); // в комнате — рядом со своей машиной
  setGameVisibility("city");
  updateUi();
}

function launchParkourGame() {
  state.inHub = false;
  state.currentGame = "parkour";
  state.currentInterior = null;
  state.currentVehicle = null;
  state.parkourFinished = false;
  parkourMessage = translations[currentLanguage].helpParkour;
  activeParkourCheckpoint = null;
  parkourCheckpoints.forEach((checkpoint) => {
    checkpoint.reached = false;
    checkpoint.marker.children.forEach((child, index) => {
      if (index === 1) {
        child.material.emissiveIntensity = 0.24;
      }
    });
  });
  platformHub.classList.add("hidden");
  closeSidebar();
  panelToggle.classList.add("hidden");
  backToHubButton.classList.remove("hidden");
  respawnPlayer(parkourSpawn);
  setGameVisibility("parkour");
  updateUi();
}

function returnToHub() {
  if (state.currentVehicle) {
    state.currentVehicle.speed = 0;
    state.currentVehicle = null;
    detachAvatarFromCar();
  }
  if (state.currentInterior !== null) {
    state.currentInterior = null;
    interiorGroup.visible = false;
    cityGroup.visible = true;
  }

  resetKeys();
  respawnPlayer(safeSpawn);
  state.currentGame = null;
  state.parkourFinished = false;
  parkourMessage = "";
  activeParkourCheckpoint = null;
  setGameVisibility(null);
  closeSidebar();
  panelToggle.classList.remove("hidden");
  backToHubButton.classList.add("hidden");
  platformHub.classList.remove("hidden");
  state.inHub = true;
  closeBigMap();
  updateUi();
}

if (!window.THREE) {
  showOverlay("Three.js не загрузился. Значит, настоящий 3D здесь пока не стартовал.", true);
  throw new Error("Three.js is not available");
}

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
} catch (error) {
  showOverlay("WebGLRenderer не создался. Похоже, браузер не даёт запустить 3D-отрисовку.", true);
  throw error;
}

if (!renderer.getContext()) {
  showOverlay("WebGL-контекст не получен. Если справа пусто, перейдём на псевдо-3D вариант.", true);
  throw new Error("WebGL context not available");
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x88d7ff);
scene.fog = new THREE.Fog(0x88d7ff, 160, 950);

const camera = new THREE.PerspectiveCamera(55, 1, 0.4, 1800); // ближняя граница дальше: дороги и тротуары не мерцают вдали
const clock = new THREE.Clock();

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const hemiLight = new THREE.HemisphereLight(0xf2f7ff, 0x5f6b44, 1.0);
scene.add(hemiLight);

// Солнце ходит за игроком, чтобы тени были по всему городу, а не только в центре
const SUN_OFFSET = new THREE.Vector3(35, 55, 20);
const sun = new THREE.DirectionalLight(0xffffff, 0.95);
sun.position.copy(SUN_OFFSET);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -70;
sun.shadow.camera.right = 70;
sun.shadow.camera.top = 70;
sun.shadow.camera.bottom = -70;
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 160;
sun.shadow.bias = -0.0006;
scene.add(sun);
scene.add(sun.target);

// Одна лампа, которая включается в том здании, где сейчас игрок
const interiorLight = new THREE.PointLight(0xfff0d0, 0, 24, 1.6);
scene.add(interiorLight);

const dayNightConfig = {
  phaseDuration: 300,
  dayBackground: new THREE.Color(0x88d7ff),
  nightBackground: new THREE.Color(0x0d1730),
  dayFog: new THREE.Color(0x88d7ff),
  nightFog: new THREE.Color(0x162446)
};

const worldSize = 1212; // игрок ходит в пределах ±600, дальше — горы
const roads = [];
const blocks = [];
const buildings = [];
const interiorColliders = [];
const parkourPlatforms = [];
const parkourCheckpoints = [];
const cars = [];
const buildingWindowMaterials = [];
const storefrontGlassMaterials = [];
const lampLightMaterials = [];
const trafficBulbMaterials = [];
const carLightMaterials = [];
let missionMarker = null;
let taxiPassenger = null;
let taxiPassengerParts = null;
let roadGuideGroup = null;
let activeParkourCheckpoint = null;
let parkourMessage = "";
const cityGroup = new THREE.Group();
const interiorGroup = new THREE.Group();
const parkourGroup = new THREE.Group();
scene.add(cityGroup);
scene.add(interiorGroup);
scene.add(parkourGroup);
// Районы проверяются по порядку: сначала маленькие и особые места, потом большие
const districtZones = [
  { name: "Центральный парк", en: "Central Park", minX: -28, maxX: 28, minZ: -28, maxZ: 28 },
  { name: "Сити", en: "City Towers", minX: 40, maxX: 212, minZ: -212, maxZ: -40 },
  { name: "Тоннель", en: "Tunnel", minX: 585, maxX: 720, minZ: 312, maxZ: 348 },
  { name: "Горный", en: "Mountain Town", minX: 720, maxX: 1040, minZ: 170, maxZ: 490 },
  { name: "Автосалон", en: "Car Dealership", minX: 60, maxX: 240, minZ: 262, maxZ: 314 },
  { name: "АЗС", en: "Gas Station", minX: 270, maxX: 330, minZ: 285, maxZ: 314 },
  { name: "Трасса М1", en: "M1 Highway", minX: -610, maxX: 610, minZ: 312, maxZ: 348 },
  { name: "Посёлок Берёзовка", en: "Birch Village", minX: -600, maxX: -255, minZ: 40, maxZ: 312 },
  { name: "Городок Солнечный", en: "Sunny Town", minX: 300, maxX: 600, minZ: -60, maxZ: 312 },
  { name: "Лесопарк", en: "Forest Park", minX: -260, maxX: 180, minZ: -610, maxZ: -255 },
  { name: "Западный квартал", en: "West Quarter", minX: -240, maxX: -80, minZ: -240, maxZ: 240 },
  { name: "Восточный квартал", en: "East Quarter", minX: 80, maxX: 240, minZ: -240, maxZ: 240 },
  { name: "Северный квартал", en: "North Quarter", minX: -80, maxX: 80, minZ: -240, maxZ: -40 },
  { name: "Южный квартал", en: "South Quarter", minX: -80, maxX: 80, minZ: 40, maxZ: 240 },
  { name: "Центральный квартал", en: "Central Quarter", minX: -80, maxX: 80, minZ: -40, maxZ: 40 }
];

const state = {
  inHub: true,
  currentGame: null,
  mode: "third",
  keys: {},
  currentInterior: null,
  insideBuilding: null,
  currentVehicle: null,
  coins: 0,
  activeJob: null,
  parkourFinished: false,
  isNight: false,
  dayNightTimer: 0,
  district: "Стартовая улица"
};

const safeSpawn = new THREE.Vector3(-40, 0, -40);
const parkourSpawn = new THREE.Vector3(-28, 2.2, 0);
const TAXI_PASSENGER_WORLD_SCALE = 0.28;
const TAXI_PASSENGER_CAR_SCALE = 0.28;

const player = {
  position: safeSpawn.clone(),
  velocity: new THREE.Vector3(),
  angle: Math.PI * 0.25,
  speed: 10.5,
  radius: 1.5,
  height: 4.2,
  grounded: true,
  jumpQueued: false,
  name: "Block Hero"
};

loadStoredAvatarSettings();

const avatar = new THREE.Group();
const avatarParts = {};
let hubPreviewRenderer = null;
let hubPreviewScene = null;
let hubPreviewCamera = null;
let hubPreviewAvatar = null;
let hubPreviewParts = null;
let sidebarPreviewRenderer = null;
let sidebarPreviewScene = null;
let sidebarPreviewCamera = null;
let sidebarPreviewAvatar = null;
let sidebarPreviewParts = null;
const avatarMaterials = {
  body: new THREE.MeshStandardMaterial({ color: bodyColorInput.value, roughness: 0.78 }),
  accent: new THREE.MeshStandardMaterial({ color: accentColorInput.value, roughness: 0.6 }),
  skin: new THREE.MeshStandardMaterial({ color: SKIN_TONES.fair, roughness: 0.72 }),
  hair: new THREE.MeshStandardMaterial({ color: hairColorInput.value, roughness: 0.8, side: THREE.DoubleSide }),
  pants: new THREE.MeshStandardMaterial({ color: PANTS_COLORS.jeans, roughness: 0.85 }),
  shoes: new THREE.MeshStandardMaterial({ color: "#f3f4f6", roughness: 0.6 }),
  sole: new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.8 }),
  belt: new THREE.MeshStandardMaterial({ color: "#23262d", roughness: 0.6 }),
  gold: new THREE.MeshStandardMaterial({ color: "#f5c542", roughness: 0.3, metalness: 0.6 }),
  ruby: new THREE.MeshStandardMaterial({ color: "#d1233c", roughness: 0.2, metalness: 0.3 }),
  white: new THREE.MeshStandardMaterial({ color: "#fbfbf8", roughness: 0.4 }),
  iris: new THREE.MeshStandardMaterial({ color: eyeColorInput.value, roughness: 0.3 }),
  dark: new THREE.MeshStandardMaterial({ color: "#14161a", roughness: 0.3 }),
  lips: new THREE.MeshStandardMaterial({ color: "#8e3b3b", roughness: 0.6 }),
  mouthInside: new THREE.MeshStandardMaterial({ color: "#4a1c1f", roughness: 0.8 }),
  blush: new THREE.MeshStandardMaterial({ color: "#ff8a95", roughness: 0.9, transparent: true, opacity: 0.45, depthWrite: false }),
  freckle: new THREE.MeshStandardMaterial({ color: "#8a5236", roughness: 0.9 }),
  lens: new THREE.MeshStandardMaterial({ color: "#101318", roughness: 0.05, metalness: 0.7 })
};
avatarMaterials.brow = avatarMaterials.hair;
const cameraOrbit = {
  yaw: Math.PI * 1.25,
  pitch: 0.18,
  distance: 9.5,
  dragging: false,
  pointerId: null,
  lastX: 0,
  lastY: 0
};
let walkCycle = 0;
let moveAmount = 0;
let previousPlayerPosition = player.position.clone();

const audioState = {
  context: null,
  unlocked: false,
  nextStepAt: 0
};

const npcs = [];
const npcRoutes = [
  // маршруты прохожих идут по середине тротуаров и через зебры
  [
    new THREE.Vector3(-134.5, 0, -104),
    new THREE.Vector3(-134.5, 0, -24),
    new THREE.Vector3(-134.5, 0, 56),
    new THREE.Vector3(-134.5, 0, 134.5)
  ],
  [
    new THREE.Vector3(-56, 0, -134.5),
    new THREE.Vector3(24, 0, -134.5),
    new THREE.Vector3(104, 0, -134.5),
    new THREE.Vector3(134.5, 0, -134.5)
  ],
  [
    new THREE.Vector3(56, 0, 134.5),
    new THREE.Vector3(-24, 0, 134.5),
    new THREE.Vector3(-104, 0, 134.5),
    new THREE.Vector3(-134.5, 0, 134.5)
  ],
  [
    new THREE.Vector3(134.5, 0, 104),
    new THREE.Vector3(134.5, 0, 24),
    new THREE.Vector3(134.5, 0, -56),
    new THREE.Vector3(134.5, 0, -134.5)
  ],
  [
    new THREE.Vector3(-25.5, 0, -54.5),
    new THREE.Vector3(25.5, 0, -54.5),
    new THREE.Vector3(25.5, 0, 54.5),
    new THREE.Vector3(-25.5, 0, 54.5)
  ]
];

function resetThirdPersonCamera() {
  state.mode = "third";
  player.angle = Math.PI * 0.25;
  cameraOrbit.yaw = player.angle + Math.PI; // камера за спиной
  cameraOrbit.pitch = 0.28;
  cameraOrbit.distance = 9.5;
  cameraOrbit.dragging = false;
  cameraOrbit.pointerId = null;
}

function ensureAudioContext() {
  if (audioState.context) {
    return audioState.context;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return null;
  }

  audioState.context = new AudioContextClass();
  return audioState.context;
}

function unlockAudio() {
  const context = ensureAudioContext();
  if (!context) {
    return;
  }

  if (context.state === "suspended") {
    context.resume();
  }
  audioState.unlocked = context.state === "running";
}

function playFootstepSound() {
  const context = ensureAudioContext();
  if (!context || !audioState.unlocked || state.inHub) {
    return;
  }

  const now = context.currentTime;
  const tone = context.createOscillator();
  const toneGain = context.createGain();
  tone.type = "triangle";
  tone.frequency.setValueAtTime(170 + Math.random() * 35, now);
  tone.frequency.exponentialRampToValueAtTime(110, now + 0.08);
  toneGain.gain.setValueAtTime(0.0001, now);
  toneGain.gain.exponentialRampToValueAtTime(0.026, now + 0.01);
  toneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
  tone.connect(toneGain);
  toneGain.connect(context.destination);
  tone.start(now);
  tone.stop(now + 0.11);

  const noiseBuffer = context.createBuffer(1, Math.max(1, Math.floor(context.sampleRate * 0.04)), context.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }

  const noiseSource = context.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  const noiseFilter = context.createBiquadFilter();
  noiseFilter.type = "highpass";
  noiseFilter.frequency.value = 650;
  const noiseGain = context.createGain();
  noiseGain.gain.setValueAtTime(0.0001, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.014, now + 0.004);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
  noiseSource.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(context.destination);
  noiseSource.start(now);
  noiseSource.stop(now + 0.05);
}

function updateFootsteps(delta) {
  if (state.inHub || state.currentInterior !== null || state.currentVehicle || moveAmount <= 0.02) {
    audioState.nextStepAt = 0;
    return;
  }

  if (!audioState.unlocked) {
    return;
  }

  audioState.nextStepAt -= delta;
  if (audioState.nextStepAt > 0) {
    return;
  }

  playFootstepSound();
  const sprinting = state.keys.ShiftLeft || state.keys.ShiftRight;
  audioState.nextStepAt = sprinting ? 0.27 : 0.37;
}

function getBuildingType(name) {
  if (/coffee|cafe|bakery/i.test(name)) return "cafe";
  if (/book/i.test(name)) return "bookstore";
  if (/fashion/i.test(name)) return "fashion";
  if (/tech/i.test(name)) return "tech";
  if (/pet/i.test(name)) return "pet";
  if (/flower/i.test(name)) return "flower";
  if (/toy/i.test(name)) return "toy";
  if (/market|mart/i.test(name)) return "market";
  if (/cinema|music/i.test(name)) return "entertainment";
  if (/hotel/i.test(name)) return "hotel";
  if (/clinic/i.test(name)) return "clinic";
  if (/office/i.test(name)) return "office";
  return "residence";
}

// ---------- Прохожие: та же модель, что и у игрока, но со своими образами ----------
const NPC_LOOKS = [
  { body: "#ff9f68", accent: "#2b2d42", hair: "#352f36", eyes: "#3d6b3a", skin: "light", outfit: "hoodie", pants: "jeans", shoes: "sneakers", hairStyle: "short", accessory: "headphones", face: "smile", bodyType: "man" },
  { body: "#72ddf7", accent: "#f5f5f5", hair: "#c9a46a", eyes: "#3a6ea5", skin: "porcelain", outfit: "tshirt", pants: "shorts", shoes: "hightops", hairStyle: "ponytail", accessory: "none", face: "happy", bodyType: "girl" },
  { body: "#ff70a6", accent: "#ffd6a5", hair: "#42312b", eyes: "#5a3b24", skin: "brown", outfit: "sweater", pants: "trousers", shoes: "boots", hairStyle: "curly", accessory: "none", face: "freckles", bodyType: "girl" },
  { body: "#3a4a63", accent: "#d1233c", hair: "#1d1f24", eyes: "#2b2d42", skin: "tan", outfit: "suit", pants: "trousers", shoes: "light", hairStyle: "buzz", accessory: "sunglasses", face: "cool", bodyType: "man" },
  { body: "#7ae582", accent: "#2f6b45", hair: "#8a3b1e", eyes: "#4b7f52", skin: "deep", outfit: "jacket", pants: "cargo", shoes: "sneakers", hairStyle: "bun", accessory: "backpack", face: "neutral", bodyType: "boy" }
];

function createNpcMaterials(look) {
  const materials = {};
  Object.entries(avatarMaterials).forEach(([key, material]) => {
    if (key !== "brow") {
      materials[key] = material.clone();
    }
  });
  materials.brow = materials.hair;
  const shoeStyle = SHOE_STYLES[look.shoes] || SHOE_STYLES.sneakers;
  materials.body.color.set(look.body);
  materials.accent.color.set(look.accent);
  materials.hair.color.set(look.hair);
  materials.iris.color.set(look.eyes);
  materials.skin.color.set(SKIN_TONES[look.skin] || SKIN_TONES.fair);
  materials.faceSkin.color.copy(materials.skin.color);
  materials.pants.color.set(PANTS_COLORS[look.pants] || PANTS_COLORS.jeans);
  materials.shoes.color.set(shoeStyle.color);
  materials.sole.color.set(shoeStyle.sole);
  return materials;
}

function createNpcAvatar(look) {
  const group = new THREE.Group();
  const parts = {};
  buildPlayerAvatar(group, parts, 0.28, createNpcMaterials(look));
  applyAvatarStyle(parts, {
    outfit: look.outfit,
    pants: look.pants,
    shoes: look.shoes,
    hair: look.hairStyle,
    accessory: look.accessory,
    body: look.bodyType
  });
  applyAvatarMood(parts, look.face);
  return { group, parts };
}

function spawnNpcs() {
  if (npcs.length > 0) {
    return;
  }

  npcRoutes.forEach((route, index) => {
    const avatarData = createNpcAvatar(NPC_LOOKS[index % NPC_LOOKS.length]);
    const npc = {
      ...avatarData,
      route,
      routeIndex: index % route.length,
      speed: 4.2 + index * 0.15,
      wait: index * 0.25,
      walkCycle: index * 0.9,
      moving: false,
      timeOffset: index * 1.7
    };

    const startPoint = route[npc.routeIndex];
    npc.group.position.copy(startPoint);
    npc.group.rotation.y = 0;
    scene.add(npc.group);
    npcs.push(npc);
  });
}

// ---------- Аватар: настоящий «скелет» (бёдра, колени, локти), лицо, одежда ----------
// Всё строится в «сантиметрах аватара», потом группа уменьшается через scale.
const AVATAR_HIP_HEIGHT = 5.78;

function makeAvatarPart(geometry, material, parent, x = 0, y = 0, z = 0, castShadow = true) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.castShadow = castShadow;
  parent.add(mesh);
  return mesh;
}

// Оболочка для причёсок: сфера без «лицевой» части, чтобы волосы не закрывали лицо
function makeHairShell(radius, thetaLength, material, parent, y, openFront = Math.PI * 0.62) {
  const phiStart = Math.PI / 2 + openFront / 2;
  const geometry = new THREE.SphereGeometry(radius, 24, 16, phiStart, Math.PI * 2 - openFront, 0, thetaLength);
  return makeAvatarPart(geometry, material, parent, 0, y, 0);
}

function buildPlayerAvatar(targetGroup, targetParts, scale = 0.29, materials = avatarMaterials) {
  const m = materials;
  const P = targetParts;
  P.materials = m;
  P.root = targetGroup;
  P.baseScale = scale;
  P.tops = {};
  P.hairStyles = {};
  P.accessories = {};
  P.hatHiddenHair = [];

  // ---- Бёдра (корень скелета) ----
  const hips = new THREE.Group();
  hips.position.y = AVATAR_HIP_HEIGHT;
  targetGroup.add(hips);
  P.hips = hips;
  P.pelvis = makeAvatarPart(rbBoxGeometry(2.0, 1.05, 1.05, 0.16), m.pants, hips, 0, 0.02, 0);
  const belt = makeAvatarPart(rbBoxGeometry(2.04, 0.18, 1.09, 0.05), m.belt, hips, 0, 0.47, 0, false);
  const buckle = makeAvatarPart(new THREE.BoxGeometry(0.28, 0.16, 0.05), m.gold, hips, 0, 0.47, 0.56, false);
  P.belt = belt;
  P.buckle = buckle;

  // ---- Ноги: бедро -> колено -> голеностоп ----
  function createLeg(side) {
    const thigh = new THREE.Group();
    thigh.position.set(side * 0.5, -0.25, 0);
    hips.add(thigh);
    const upper = makeAvatarPart(rbBoxGeometry(0.96, 1.3, 1.0, 0.14), m.pants, thigh, 0, -0.55, 0);
    const lower = makeAvatarPart(rbBoxGeometry(0.94, 1.3, 0.98, 0.14), m.pants, thigh, 0, -1.78, 0);
    const pocket = makeAvatarPart(new THREE.BoxGeometry(0.08, 0.6, 0.5), m.pants, thigh, side * 0.5, -1.1, 0.02, false);
    const knee = new THREE.Group();
    knee.position.y = -LEG_THIGH;
    thigh.add(knee);
    const kneeCap = makeAvatarPart(new THREE.SphereGeometry(0.46, 14, 10), m.pants, knee, 0, 0, 0);
    const shin = makeAvatarPart(rbBoxGeometry(0.92, LEG_SHIN - 0.15, 0.96, 0.14), m.pants, knee, 0, -(LEG_SHIN - 0.15) / 2, 0);
    const legCuff = makeAvatarPart(rbBoxGeometry(0.98, 0.22, 1.02, 0.06), m.belt, knee, 0, -LEG_SHIN + 0.28, 0, false);
    const ankle = new THREE.Group();
    ankle.position.y = -LEG_SHIN;
    knee.add(ankle);
    const shoe = makeAvatarPart(rbBoxGeometry(1.0, 0.55, 1.42, 0.16), m.shoes, ankle, 0, -0.38, 0.2);
    const toe = new THREE.Object3D();
    const sole = makeAvatarPart(rbBoxGeometry(1.04, 0.14, 1.48, 0.05), m.sole, ankle, 0, -0.66, 0.2);
    const stripe = makeAvatarPart(new THREE.BoxGeometry(0.04, 0.12, 0.7), m.accent, ankle, side * 0.51, -0.4, 0.2, false);
    const bootTop = makeAvatarPart(rbBoxGeometry(1.0, 0.72, 1.04, 0.12), m.shoes, ankle, 0, 0.12, 0);
    return { thigh, knee, ankle, upper, lower, pocket, kneeCap, shin, legCuff, shoe, toe, sole, stripe, bootTop };
  }
  P.legL = createLeg(-1);
  P.legR = createLeg(1);

  // ---- Туловище ----
  const spine = new THREE.Group();
  spine.position.y = 0.55;
  hips.add(spine);
  P.spine = spine;
  const torso = makeAvatarPart(rbBoxGeometry(2.0, 2.95, 1.05, 0.2), m.body, spine, 0, 1.42, 0);
  const chestTop = new THREE.Mesh(new THREE.BufferGeometry(), m.body);
  chestTop.visible = false;
  spine.add(chestTop);
  P.torso = torso;
  P.chestTop = chestTop;

  // ---- Одежда: детали поверх туловища ----
  const tops = {
    tshirt: new THREE.Group(), hoodie: new THREE.Group(), jacket: new THREE.Group(), sweater: new THREE.Group(),
    shirt: new THREE.Group(), tank: new THREE.Group(), suit: new THREE.Group()
  };
  Object.values(tops).forEach((group) => spine.add(group));
  P.tops = tops;
  const front = 0.54;
  const collar = (material, group) => makeAvatarPart(rbBoxGeometry(0.9, 0.16, 0.7, 0.05), material, group, 0, 2.86, 0, false);
  collar(m.accent, tops.tshirt);
  makeAvatarPart(new THREE.CircleGeometry(0.34, 24), m.accent, tops.tshirt, 0, 1.75, front + 0.01, false);
  makeAvatarPart(rbBoxGeometry(1.5, 0.46, 0.6, 0.15), m.body, tops.hoodie, 0, 2.86, -0.25);
  makeAvatarPart(rbBoxGeometry(1.2, 0.55, 0.06, 0.04), m.accent, tops.hoodie, 0, 0.62, front, false);
  [-0.2, 0.2].forEach((x) => makeAvatarPart(new THREE.CylinderGeometry(0.03, 0.03, 0.7, 6), m.white, tops.hoodie, x, 2.35, front + 0.02, false));
  makeAvatarPart(new THREE.BoxGeometry(0.6, 2.6, 0.04), m.white, tops.jacket, 0, 1.45, front + 0.005, false);
  makeAvatarPart(new THREE.BoxGeometry(0.05, 2.7, 0.05), m.gold, tops.jacket, 0.33, 1.42, front + 0.02, false);
  [-1, 1].forEach((side) => {
    const lapel = makeAvatarPart(new THREE.BoxGeometry(0.42, 0.55, 0.06), m.accent, tops.jacket, side * 0.42, 2.6, front + 0.02, false);
    lapel.rotation.z = side * 0.4;
  });
  [0.7, 1.6].forEach((y) => makeAvatarPart(rbBoxGeometry(2.04, 0.26, 1.09, 0.06), m.accent, tops.sweater, 0, y, 0, false));
  collar(m.accent, tops.sweater);
  [-1, 1].forEach((side) => {
    const shirtCollar = makeAvatarPart(new THREE.BoxGeometry(0.42, 0.3, 0.06), m.white, tops.shirt, side * 0.26, 2.78, front + 0.02, false);
    shirtCollar.rotation.z = side * 0.55;
  });
  [0.5, 1.1, 1.7, 2.3].forEach((y) => makeAvatarPart(new THREE.SphereGeometry(0.05, 8, 6), m.white, tops.shirt, 0, y, front + 0.02, false));
  makeAvatarPart(new THREE.BoxGeometry(0.22, 1.5, 0.04), m.accent, tops.shirt, 0, 2.05, front + 0.03, false);
  [-0.62, 0.62].forEach((x) => makeAvatarPart(new THREE.BoxGeometry(0.32, 0.34, 1.07), m.body, tops.tank, x, 2.78, 0, false));
  makeAvatarPart(new THREE.BoxGeometry(0.66, 1.9, 0.04), m.white, tops.suit, 0, 1.95, front + 0.005, false);
  makeAvatarPart(new THREE.BoxGeometry(0.2, 1.6, 0.04), m.accent, tops.suit, 0, 2.0, front + 0.025, false);
  [-1, 1].forEach((side) => {
    const lapel = makeAvatarPart(new THREE.BoxGeometry(0.3, 1.5, 0.05), m.belt, tops.suit, side * 0.42, 2.1, front + 0.02, false);
    lapel.rotation.z = side * -0.22;
  });

  // ---- Руки: плечо -> локоть -> кисть ----
  function createArm(side) {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * 1.48, 2.62, 0);
    spine.add(shoulder);
    const joint = makeAvatarPart(rbBoxGeometry(0.92, 0.5, 0.96, 0.18), m.body, shoulder, 0, -0.05, 0);
    const upper = makeAvatarPart(rbBoxGeometry(0.88, 1.35, 0.92, 0.14), m.body, shoulder, 0, -0.72, 0);
    const elbow = new THREE.Group();
    elbow.position.y = -1.45;
    shoulder.add(elbow);
    const elbowJoint = makeAvatarPart(new THREE.SphereGeometry(0.43, 12, 10), m.body, elbow);
    const fore = makeAvatarPart(rbBoxGeometry(0.86, 1.2, 0.9, 0.14), m.body, elbow, 0, -0.62, 0);
    const cuff = makeAvatarPart(rbBoxGeometry(0.9, 0.18, 0.94, 0.05), m.accent, elbow, 0, -1.16, 0, false);
    const hand = new THREE.Group();
    hand.position.y = -1.3;
    elbow.add(hand);
    makeAvatarPart(rbBoxGeometry(0.82, 0.6, 0.86, 0.2), m.skin, hand, 0, -0.26, 0);
    return { shoulder, elbow, hand, joint, upper, elbowJoint, fore, cuff };
  }
  P.armL = createArm(-1);
  P.armR = createArm(1);
  P.leftArm = P.armL.shoulder;
  P.rightArm = P.armR.shoulder;

  // ---- Шея и голова ----
  P.neck = makeAvatarPart(new THREE.CylinderGeometry(0.42, 0.46, 0.45, 16), m.skin, spine, 0, 3.02, 0);
  const head = new THREE.Group();
  head.position.y = 2.92;
  head.scale.setScalar(0.78);
  spine.add(head);
  P.head = head;
  P.faceMesh = makeAvatarPart(rbHeadGeometry(), m.skin, head, 0, 0, 0);
  P.faceMaterial = new THREE.MeshStandardMaterial({
    map: getFaceTexture("smile", false), transparent: true, depthWrite: false, roughness: 0.8,
    polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2
  });
  const decal = new THREE.Mesh(new THREE.CylinderGeometry(1.226, 1.226, 1.5, 24, 1, true, -0.8, 1.6), P.faceMaterial);
  decal.position.y = 1.45;
  head.add(decal);
  // глаза и брови теперь на картинке; пустые объекты оставлены для старого кода
  P.eyeL = { eye: new THREE.Object3D() };
  P.eyeR = { eye: new THREE.Object3D() };
  P.browL = new THREE.Object3D();
  P.browR = new THREE.Object3D();
  P.blush = [];
  P.freckles = new THREE.Group();
  P.mouths = {};

  // ---- Причёски ----
  const hairStyles = {};
  const addHairStyle = (id) => {
    const group = new THREE.Group();
    head.add(group);
    hairStyles[id] = group;
    return group;
  };
  const hairCap = (group, radius = 1.34, theta = Math.PI * 0.5) => {
    const cap = makeAvatarPart(new THREE.SphereGeometry(radius, 28, 16, 0, Math.PI * 2, 0, theta), m.hair, group, 0, 1.62, -0.06);
    cap.scale.set(1, 0.86, 1.02);
    cap.rotation.x = -0.3;
    return cap;
  };
  const lock = (group, x, y, z, sx, sy, sz, rx = 0, rz = 0) => {
    const piece = makeAvatarPart(new THREE.SphereGeometry(1, 14, 10), m.hair, group, x, y, z);
    piece.scale.set(sx, sy, sz);
    piece.rotation.set(rx, 0, rz);
    return piece;
  };
  const hideUnderHat = (mesh) => {
    P.hatHiddenHair.push(mesh);
    return mesh;
  };
  const short = addHairStyle("short");
  hairCap(short);
  lock(short, 0.3, 2.32, 0.92, 0.85, 0.24, 0.4, 0.5, -0.2);
  const long = addHairStyle("long");
  hairCap(long);
  lock(long, 0, 1.0, -0.8, 1.22, 1.35, 0.5, 0.05);
  [-1, 1].forEach((side) => lock(long, side * 1.08, 1.05, 0.05, 0.3, 1.2, 0.8));
  addHairStyle("buzz");
  hairCap(hairStyles.buzz, 1.28, Math.PI * 0.48);
  const ponytail = addHairStyle("ponytail");
  hairCap(ponytail);
  makeAvatarPart(new THREE.TorusGeometry(0.16, 0.06, 8, 14), m.accent, ponytail, 0, 1.85, -1.3, false);
  const tail = makeAvatarPart(new THREE.CylinderGeometry(0.26, 0.08, 1.8, 12), m.hair, ponytail, 0, 1.0, -1.5);
  tail.rotation.x = -0.25;
  const curly = addHairStyle("curly");
  hairCap(curly);
  [[0, 2.7, 0.1], [-0.7, 2.55, 0.45], [0.7, 2.55, 0.45], [-1.05, 2.1, -0.1], [1.05, 2.1, -0.1], [-0.55, 2.6, -0.6], [0.55, 2.6, -0.6], [0, 2.3, -1.05], [-0.4, 2.5, 0.85], [0.4, 2.5, 0.85]]
    .forEach(([x, y, z]) => hideUnderHat(makeAvatarPart(new THREE.IcosahedronGeometry(0.48, 1), m.hair, curly, x, y, z)));
  const spiky = addHairStyle("spiky");
  hairCap(spiky);
  [[0, 2.8, 0.2, 0], [-0.6, 2.62, 0.3, 0.4], [0.6, 2.62, 0.3, -0.4], [-0.35, 2.7, -0.5, 0.25], [0.35, 2.7, -0.5, -0.25], [0, 2.45, -1.0, 0]].forEach(([x, y, z, rz]) => {
    const spike = hideUnderHat(makeAvatarPart(new THREE.ConeGeometry(0.28, 0.85, 6), m.hair, spiky, x, y, z));
    spike.rotation.set(z * 0.5, 0, rz);
  });
  const bun = addHairStyle("bun");
  hairCap(bun);
  hideUnderHat(makeAvatarPart(new THREE.SphereGeometry(0.52, 16, 12), m.hair, bun, 0, 2.8, -0.5));
  const bob = addHairStyle("bob");
  hairCap(bob, 1.4);
  [-1, 1].forEach((side) => lock(bob, side * 1.12, 1.55, 0.0, 0.3, 0.85, 1.05));
  lock(bob, 0, 1.45, -0.9, 1.25, 0.95, 0.42);
  lock(bob, 0, 2.38, 0.9, 1.05, 0.24, 0.38, 0.45);
  const mohawk = addHairStyle("mohawk");
  hairCap(mohawk, 1.27, Math.PI * 0.4);
  [0.9, 0.35, -0.2, -0.75, -1.2].forEach((z, index) => {
    const fin = hideUnderHat(makeAvatarPart(new THREE.BoxGeometry(0.24, 0.8 - index * 0.06, 0.55), m.hair, mohawk, 0, 2.85 - Math.abs(z) * 0.32, z));
    fin.rotation.x = z * 0.4;
  });
  P.hairStyles = hairStyles;

  // ---- Аксессуары ----
  const accessories = {};
  const addAccessory = (id, parent = head) => {
    const group = new THREE.Group();
    parent.add(group);
    accessories[id] = group;
    return group;
  };
  const cap = addAccessory("cap");
  const capDome = makeAvatarPart(new THREE.SphereGeometry(1.32, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), m.accent, cap, 0, 2.05, -0.02);
  capDome.scale.set(1, 0.72, 1);
  const brim = makeAvatarPart(new THREE.CylinderGeometry(0.8, 0.8, 0.07, 20, 1, false, -Math.PI / 2, Math.PI), m.accent, cap, 0, 2.12, 1.05);
  brim.scale.set(1.05, 1, 1.1);
  brim.rotation.x = 0.1;
  const beanie = addAccessory("beanie");
  const beanieDome = makeAvatarPart(new THREE.SphereGeometry(1.34, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), m.accent, beanie, 0, 2.0, -0.04);
  beanieDome.scale.set(1, 0.85, 1);
  makeAvatarPart(new THREE.CylinderGeometry(1.3, 1.32, 0.4, 24), m.accent, beanie, 0, 2.08, -0.04);
  makeAvatarPart(new THREE.SphereGeometry(0.3, 12, 10), m.white, beanie, 0, 3.15, -0.05);
  const headphones = addAccessory("headphones");
  const band = makeAvatarPart(new THREE.TorusGeometry(1.32, 0.08, 8, 28, Math.PI), m.dark, headphones, 0, 1.6, 0);
  band.scale.set(1, 1.05, 1);
  [-1, 1].forEach((side) => {
    const pad = makeAvatarPart(new THREE.CylinderGeometry(0.42, 0.42, 0.24, 18), m.accent, headphones, side * 1.3, 1.5, 0);
    pad.rotation.z = Math.PI / 2;
  });
  const crown = addAccessory("crown");
  makeAvatarPart(new THREE.CylinderGeometry(1.0, 1.04, 0.36, 12), m.gold, crown, 0, 2.72, 0);
  [0, 1, 2, 3, 4, 5].forEach((index) => {
    const angle = (index / 6) * Math.PI * 2;
    makeAvatarPart(new THREE.ConeGeometry(0.17, 0.5, 6), m.gold, crown, Math.sin(angle) * 0.95, 3.12, Math.cos(angle) * 0.95);
  });
  makeAvatarPart(new THREE.SphereGeometry(0.12, 10, 8), m.ruby, crown, 0, 2.74, 1.04, false);
  const glassZ = faceSurfaceZ(0.46) + 0.12;
  const glasses = addAccessory("glasses");
  [-1, 1].forEach((side) => {
    makeAvatarPart(new THREE.TorusGeometry(0.3, 0.035, 8, 24), m.dark, glasses, side * 0.43, 1.62, glassZ, false);
    const arm = makeAvatarPart(new THREE.BoxGeometry(0.04, 0.05, 1.2), m.dark, glasses, side * 0.82, 1.66, glassZ - 0.62, false);
    arm.rotation.y = side * 0.1;
  });
  makeAvatarPart(new THREE.BoxGeometry(0.24, 0.04, 0.04), m.dark, glasses, 0, 1.66, glassZ + 0.03, false);
  const sunglasses = addAccessory("sunglasses");
  [-1, 1].forEach((side) => {
    const lens = makeAvatarPart(new THREE.SphereGeometry(0.34, 16, 12), m.lens, sunglasses, side * 0.43, 1.62, glassZ, false);
    lens.scale.set(1.08, 0.72, 0.2);
    const arm = makeAvatarPart(new THREE.BoxGeometry(0.04, 0.05, 1.2), m.dark, sunglasses, side * 0.84, 1.68, glassZ - 0.62, false);
    arm.rotation.y = side * 0.1;
  });
  makeAvatarPart(new THREE.BoxGeometry(1.1, 0.06, 0.05), m.dark, sunglasses, 0, 1.82, glassZ + 0.02, false);
  const backpack = addAccessory("backpack", spine);
  makeAvatarPart(rbBoxGeometry(1.7, 2.0, 0.75, 0.22), m.accent, backpack, 0, 1.6, -0.9);
  makeAvatarPart(rbBoxGeometry(1.2, 0.8, 0.3, 0.1), m.dark, backpack, 0, 1.05, -1.3, false);
  [-0.55, 0.55].forEach((x) => makeAvatarPart(new THREE.BoxGeometry(0.18, 2.4, 0.05), m.dark, backpack, x, 1.65, 0.56, false));
  P.accessories = accessories;
  P.pose = {};

  targetGroup.scale.setScalar(scale);
}

// Какие материалы у рукавов/туловища для каждого типа верха
const TOP_STYLES = {
  tshirt: { torso: "body", upper: "body", fore: "skin", cuff: false },
  hoodie: { torso: "body", upper: "body", fore: "body", cuff: true },
  jacket: { torso: "accent", upper: "accent", fore: "accent", cuff: true },
  sweater: { torso: "body", upper: "body", fore: "body", cuff: true },
  shirt: { torso: "body", upper: "body", fore: "body", cuff: false },
  tank: { torso: "body", upper: "skin", fore: "skin", cuff: false, bareShoulders: true },
  suit: { torso: "body", upper: "body", fore: "body", cuff: false }
};

const SHOE_STYLES = {
  sneakers: { color: "#f3f4f6", sole: "#ffffff", stripe: true, boot: false, slim: false },
  hightops: { color: "#e04848", sole: "#ffffff", stripe: true, boot: true, slim: false },
  boots: { color: "#6b4426", sole: "#2a1e16", stripe: false, boot: true, slim: false },
  light: { color: "#1f2228", sole: "#3a3d44", stripe: false, boot: false, slim: true }
};

const HAT_ACCESSORIES = ["cap", "beanie", "crown"];

// Образ игрока берётся из каталога; у прохожих — свой объект с теми же полями
function getPlayerAvatarStyle() {
  return {
    outfit: outfitTypeInput.value,
    pants: pantsTypeInput.value,
    shoes: shoesTypeInput.value,
    hair: hairStyleInput.value,
    accessory: headAccessoryInput.value,
    body: bodyTypeInput.value
  };
}

function applyAvatarStyle(targetParts, style = getPlayerAvatarStyle()) {
  if (!targetParts || !targetParts.torso) {
    return;
  }
  const P = targetParts;
  const m = P.materials || avatarMaterials;
  const outfit = TOP_STYLES[style.outfit] ? style.outfit : "hoodie";
  const topStyle = TOP_STYLES[outfit];
  const shoes = SHOE_STYLES[style.shoes] || SHOE_STYLES.sneakers;
  const pants = style.pants || "jeans";
  const body = AVATAR_BODY_TYPES[style.body] || AVATAR_BODY_TYPES.man;

  // верх
  Object.entries(P.tops).forEach(([id, group]) => {
    group.visible = id === outfit;
    group.scale.set(body.width, body.height, body.depth);
  });
  P.torso.material = m[topStyle.torso];
  [P.armL, P.armR].forEach((arm) => {
    arm.joint.material = topStyle.bareShoulders ? m.skin : m[topStyle.upper];
    arm.upper.material = m[topStyle.upper];
    arm.elbowJoint.material = m[topStyle.fore];
    arm.fore.material = m[topStyle.fore];
    arm.cuff.visible = topStyle.cuff;
  });

  // штаны
  const isShorts = pants === "shorts";
  [P.legL, P.legR].forEach((leg) => {
    leg.lower.material = isShorts ? m.skin : m.pants;
    leg.kneeCap.material = isShorts ? m.skin : m.pants;
    leg.shin.material = isShorts ? m.skin : m.pants;
    leg.pocket.visible = pants === "cargo";
    leg.legCuff.visible = pants === "joggers";
    leg.bootTop.visible = shoes.boot;
    leg.stripe.visible = shoes.stripe;
    leg.shoe.scale.set(shoes.slim ? 0.86 : 1, shoes.slim ? 0.8 : 1, 1);
  });

  // волосы и аксессуары
  Object.entries(P.hairStyles).forEach(([id, group]) => {
    group.visible = id === style.hair;
  });
  Object.entries(P.accessories).forEach(([id, group]) => {
    group.visible = id === style.accessory;
  });
  const wearsHat = HAT_ACCESSORIES.includes(style.accessory);
  P.hatHiddenHair.forEach((mesh) => {
    mesh.visible = !wearsHat;
  });

  // тип тела: ширина плеч, высота туловища, толщина рук и ног, общий рост
  if (P.bodyType !== style.body) {
    P.bodyType = style.body;
    P.torso.scale.set(body.width, body.height, body.depth);
    P.torso.position.y = 1.42 * body.height;
    P.pelvis.scale.set(style.body === "girl" ? 1.02 : body.width, 1, body.depth);
    [[P.armL, -1], [P.armR, 1]].forEach(([arm, side]) => {
      arm.shoulder.position.set(side * body.shoulder, 2.62 * body.height, 0);
      arm.shoulder.scale.set(body.arm, 1, body.arm);
    });
    [[P.legL, -1], [P.legR, 1]].forEach(([leg, side]) => {
      leg.thigh.position.x = side * body.hip;
      leg.thigh.scale.set(body.leg, 1, body.leg);
    });
    P.neck.position.y = 3.02 * body.height;
    P.head.position.y = 2.92 * body.height;
    P.head.scale.setScalar(0.78 * body.head);
    P.root.scale.setScalar(P.baseScale * body.size);
  }
}

// Эмоции: какой рот, брови, глаза, румянец
const FACE_STYLES = {
  smile: { mouth: "smile", brows: [0, 0, 0], eyes: [1, 1], blush: false },
  happy: { mouth: "grin", brows: [0.1, 0.12, 0.12], eyes: [0.75, 0.75], blush: true },
  neutral: { mouth: "flat", brows: [0, 0, 0], eyes: [0.95, 0.95], blush: false },
  surprised: { mouth: "open", brows: [0.22, 0.1, 0.1], eyes: [1.2, 1.2], blush: false },
  wink: { mouth: "smirk", brows: [0.05, 0, 0.1], eyes: [1, 0.12], blush: true },
  angry: { mouth: "frown", brows: [-0.1, -0.38, 0.38], eyes: [0.85, 0.85], blush: false },
  sleepy: { mouth: "flat", brows: [-0.08, 0.1, -0.1], eyes: [0.38, 0.38], blush: false, lids: true },
  freckles: { mouth: "smile", brows: [0.04, 0, 0], eyes: [1, 1], blush: true, freckles: true },
  cool: { mouth: "smirk", brows: [0.02, 0.15, -0.05], eyes: [0.7, 0.7], blush: false }
};

// Эмоция — это другая картинка лица
function applyAvatarMood(targetParts, faceId = faceMoodInput.value) {
  if (!targetParts || !targetParts.faceMaterial) {
    return;
  }
  targetParts.faceId = faceId;
  setAvatarFace(targetParts, false);
}

// ---------- Анимация скелета ----------
function dampTo(current, target, lambda, delta) {
  return current + (target - current) * (1 - Math.exp(-lambda * delta));
}

function animateAvatarRig(P, delta, options) {
  if (!P || !P.hips) {
    return;
  }
  if (P.real) {
    updateRealHuman(P, delta, options);
    return;
  }
  const { moving = false, sprint = false, grounded = true, cycle = 0, time = 0, blinkTime = time } = options;
  const gait = options.gait === undefined ? (sprint ? 1 : 0) : options.gait;
  const target = {
    hipsY: AVATAR_HIP_HEIGHT, hipsX: 0, hipsYaw: 0, hipsRoll: 0, hipsPitch: 0,
    spineX: 0, spineY: 0, spineZ: 0,
    headX: 0, headY: 0,
    thighL: 0, thighR: 0, kneeL: 0.05, kneeR: 0.05, ankleL: 0, ankleR: 0,
    shoulderL: 0, shoulderR: 0, shoulderLz: -0.05, shoulderRz: 0.05,
    elbowL: -0.16, elbowR: -0.16
  };

  // приземление: колени пружинят, тело проседает
  if (P.wasGrounded === false && grounded) {
    P.landing = 1;
  }
  P.wasGrounded = grounded;
  P.landing = Math.max(0, (P.landing || 0) - delta * 3.6);
  const landDip = P.landing * P.landing * 1.15;
  const leg = {};

  if (options.seated) {
    // сидим в машине: ноги вперёд, спина чуть откинута, руки на руле (или на коленях у пассажира)
    const recline = options.recline || 0.15;
    const steer = options.steer || 0;
    Object.assign(target, {
      spineX: -recline, headX: recline * 0.8,
      thighL: -1.35, thighR: -1.35, kneeL: 0.45, kneeR: 0.45, ankleL: -0.55, ankleR: -0.55,
      shoulderLz: -0.1, shoulderRz: 0.1
    });
    if (options.passenger) {
      Object.assign(target, { shoulderL: -0.45, shoulderR: -0.45, elbowL: -0.9, elbowR: -0.9, headY: 0.25 * Math.sin(time * 0.4) });
    } else {
      Object.assign(target, {
        shoulderL: -1.05 - recline + steer * 0.5,
        shoulderR: -1.05 - recline - steer * 0.5,
        elbowL: -0.72, elbowR: -0.72,
        headY: steer * 0.4
      });
    }
  } else if (options.swimming) {
    // плывём кролем; если стоим на месте — держимся на воде, работая руками и ногами
    const pace = time * (moving ? 4.2 : 2.4);
    const lie = moving ? 1.25 : 0.25;
    Object.assign(target, {
      hipsPitch: lie, spineX: moving ? -0.25 : 0, headX: moving ? -0.7 : 0,
      thighL: lie + 0.28 * Math.sin(pace * 2), thighR: lie - 0.28 * Math.sin(pace * 2),
      kneeL: 0.3, kneeR: 0.3, ankleL: 0.55, ankleR: 0.55,
      shoulderL: moving ? -1.6 + 1.7 * Math.sin(pace) : -0.9 + 0.4 * Math.sin(pace),
      shoulderR: moving ? -1.6 - 1.7 * Math.sin(pace) : -0.9 - 0.4 * Math.sin(pace),
      shoulderLz: moving ? -0.2 : -0.85, shoulderRz: moving ? 0.2 : 0.85, elbowL: -0.3, elbowR: -0.3
    });
  } else if (!grounded) {
    // в воздухе: одна нога впереди, руки разведены для равновесия
    Object.assign(target, {
      spineX: 0.14, headX: -0.1,
      thighL: -1.0, kneeL: 1.3, ankleL: 0.3,
      thighR: 0.22, kneeR: 0.95, ankleR: 0.45,
      shoulderL: -0.65, shoulderR: 0.5, shoulderLz: -0.42, shoulderRz: 0.42,
      elbowL: -0.9, elbowR: -0.7
    });
  } else if (moving) {
    const stance = THREE.MathUtils.lerp(0.62, 0.27, Math.pow(gait, 0.55));
    const reach = THREE.MathUtils.lerp(1.95, 3.15, gait);
    const lift = THREE.MathUtils.lerp(0.65, 2.6, gait);
    const hipDrop = THREE.MathUtils.lerp(0.28, 0.52, gait);
    const bobSize = THREE.MathUtils.lerp(0.1, 0.24, gait);
    const lean = THREE.MathUtils.lerp(0.05, 0.27, gait);
    const armSwing = THREE.MathUtils.lerp(0.42, 0.92, gait);
    const elbowBend = THREE.MathUtils.lerp(0.28, 1.62, gait);
    const turn = cycle / (Math.PI * 2);
    const phaseL = THREE.MathUtils.euclideanModulo(turn, 1);
    const phaseR = THREE.MathUtils.euclideanModulo(turn + 0.5, 1);
    // при ходьбе таз выше всего на опорной ноге, при беге — наоборот, в полёте между шагами
    const midStance = stance * Math.PI;
    const wave = Math.cos((cycle - midStance) * 2) * THREE.MathUtils.lerp(1, -1, THREE.MathUtils.smoothstep(gait, 0.2, 0.5));
    const hipHeight = AVATAR_HIP_HEIGHT - hipDrop + wave * bobSize - landDip;
    target.hipsY = hipHeight;
    const hipJoint = hipHeight - 0.25;
    [[phaseL, "L"], [phaseR, "R"]].forEach(([phase, side]) => {
      const foot = avatarStep(phase, stance, reach, lift);
      solveAvatarLeg(foot.z - lean * 1.2, -(hipJoint - AVATAR_ANKLE_HEIGHT - foot.y), leg);
      target[`thigh${side}`] = leg.thigh;
      target[`knee${side}`] = leg.knee;
      target[`ankle${side}`] = foot.pitch - (leg.thigh + leg.knee);
    });
    // руки идут навстречу ногам и чуть запаздывают, локти работают как пружины
    const s = Math.cos(cycle);
    const lag = Math.cos(cycle - 0.32);
    const lagSide = Math.sin(cycle - 0.32);
    const breathing = Math.sin(time * 2.3);
    target.shoulderL = armSwing * lag - gait * 0.16;
    target.shoulderR = -armSwing * lag - gait * 0.16;
    target.elbowL = -(elbowBend + 0.34 * Math.max(0, -lag) - 0.2 * Math.max(0, lag));
    target.elbowR = -(elbowBend + 0.34 * Math.max(0, lag) - 0.2 * Math.max(0, -lag));
    target.shoulderLz = -0.1 - gait * 0.04 + Math.max(0, -lag) * 0.1 * gait;
    target.shoulderRz = 0.1 + gait * 0.04 - Math.max(0, lag) * 0.1 * gait;
    // таз поворачивается за шагающей ногой и уходит на опорную, плечи крутятся ему навстречу
    const sway = Math.sin(cycle);
    target.hipsX = -sway * THREE.MathUtils.lerp(0.15, 0.07, gait);
    target.hipsRoll = -sway * THREE.MathUtils.lerp(0.06, 0.04, gait);
    target.hipsYaw = s * THREE.MathUtils.lerp(0.14, 0.24, gait);
    target.hipsPitch = lean * 0.45;
    target.spineX = lean * 0.8 + wave * 0.018 * gait + breathing * 0.008;
    target.spineY = -lag * THREE.MathUtils.lerp(0.14, 0.3, gait);
    target.spineZ = lagSide * 0.03;
    // голова держится ровно: тело качается, а взгляд нет
    target.headX = -lean * 0.85 - wave * 0.02;
    target.headY = lag * 0.1;
  } else {
    // стоим: дышим, переносим вес с ноги на ногу, оглядываемся
    const breath = Math.sin(time * 1.5);
    const shift = Math.sin(time * 0.33) + 0.35 * Math.sin(time * 0.71);
    const hipHeight = AVATAR_HIP_HEIGHT - 0.1 - 0.012 * breath - Math.abs(shift) * 0.03 - landDip;
    target.hipsY = hipHeight;
    target.hipsX = shift * 0.13;
    target.hipsRoll = shift * 0.028;
    const hipJoint = hipHeight - 0.25;
    solveAvatarLeg(0.14, -(hipJoint - AVATAR_ANKLE_HEIGHT), leg);
    target.thighL = leg.thigh;
    target.kneeL = leg.knee;
    target.ankleL = -(leg.thigh + leg.knee);
    solveAvatarLeg(-0.2, -(hipJoint - AVATAR_ANKLE_HEIGHT), leg);
    target.thighR = leg.thigh;
    target.kneeR = leg.knee;
    target.ankleR = -(leg.thigh + leg.knee);
    target.spineX = 0.012 * breath + landDip * 0.35;
    target.spineZ = -shift * 0.022;
    target.headY = 0.3 * Math.sin(time * 0.27) * Math.sin(time * 0.11);
    target.headX = -0.012 * breath + 0.03 * Math.sin(time * 0.19);
    target.shoulderL = 0.03 * Math.sin(time * 0.4);
    target.shoulderR = -0.03 * Math.sin(time * 0.46);
    target.shoulderLz = -0.06 - 0.012 * breath;
    target.shoulderRz = 0.06 + 0.012 * breath;
  }

  // в поворотах тело заваливается внутрь дуги
  if (options.heading !== undefined) {
    const headingChange = P.lastHeading === undefined ? 0 : THREE.MathUtils.euclideanModulo(options.heading - P.lastHeading + Math.PI, Math.PI * 2) - Math.PI;
    P.lastHeading = options.heading;
    const bank = moving && delta > 0 ? THREE.MathUtils.clamp(-(headingChange / delta) * 0.05, -0.2, 0.2) : 0;
    target.spineZ += bank;
    target.hipsRoll += bank * 0.5;
  }
  const lambda = moving && grounded ? 20 : 10;
  const pose = P.pose;
  Object.keys(target).forEach((key) => {
    pose[key] = pose[key] === undefined ? target[key] : dampTo(pose[key], target[key], lambda, delta);
  });

  P.hips.position.x = pose.hipsX;
  P.hips.position.y = pose.hipsY;
  P.hips.rotation.set(pose.hipsPitch, pose.hipsYaw, pose.hipsRoll);
  P.spine.rotation.set(pose.spineX, pose.spineY - pose.hipsYaw, pose.spineZ - pose.hipsRoll);
  P.head.rotation.set(pose.headX, pose.headY, 0);
  P.legL.thigh.rotation.set(pose.thighL - pose.hipsPitch, 0, -0.025 - pose.hipsRoll);
  P.legR.thigh.rotation.set(pose.thighR - pose.hipsPitch, 0, 0.025 - pose.hipsRoll);
  P.legL.knee.rotation.x = pose.kneeL;
  P.legR.knee.rotation.x = pose.kneeR;
  P.legL.ankle.rotation.x = pose.ankleL;
  P.legR.ankle.rotation.x = pose.ankleR;
  P.armL.shoulder.rotation.set(pose.shoulderL, 0, pose.shoulderLz);
  P.armR.shoulder.rotation.set(pose.shoulderR, 0, pose.shoulderRz);
  P.armL.elbow.rotation.x = pose.elbowL;
  P.armR.elbow.rotation.x = pose.elbowR;

  // моргание: неровно, иногда дважды; выражение лица может держать глаз прикрытым
  const face = FACE_STYLES[P.faceId] || FACE_STYLES.smile;
  const blinkAt = blinkTime % 4.7;
  const blink = blinkAt < 0.13 || (blinkAt > 2.9 && blinkAt < 3.0);
  if (P.faceMaterial) setAvatarFace(P, blink);
}

function createAvatar() {
  buildPlayerAvatar(avatar, avatarParts, 0.29);
  avatar.position.copy(player.position);
  scene.add(avatar);
}

function initHubAvatarPreview() {
  if (!hubAvatarCanvas) {
    return;
  }

  try {
    hubPreviewRenderer = new THREE.WebGLRenderer({ canvas: hubAvatarCanvas, alpha: true, antialias: true });
    hubPreviewRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    hubPreviewRenderer.setSize(hubAvatarCanvas.clientWidth || 130, hubAvatarCanvas.clientHeight || 150, false);
    hubPreviewRenderer.shadowMap.enabled = true;
    hubPreviewRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

    hubPreviewScene = new THREE.Scene();
    hubPreviewCamera = new THREE.PerspectiveCamera(34, (hubAvatarCanvas.clientWidth || 130) / Math.max(hubAvatarCanvas.clientHeight || 150, 1), 0.1, 100);
    hubPreviewCamera.position.set(0, 2.6, 7.6);
    hubPreviewCamera.lookAt(0, 2.2, 0);

    const previewLight = new THREE.HemisphereLight(0xe8fbff, 0x324050, 1.5);
    hubPreviewScene.add(previewLight);

    const previewSun = new THREE.DirectionalLight(0xffffff, 1.2);
    previewSun.position.set(6, 10, 8);
    previewSun.castShadow = true;
    hubPreviewScene.add(previewSun);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(3.4, 32),
      new THREE.MeshStandardMaterial({ color: 0x7ed8ff, transparent: true, opacity: 0.18, roughness: 0.9 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.02;
    hubPreviewScene.add(floor);

    hubPreviewAvatar = new THREE.Group();
    hubPreviewParts = {};
    buildPlayerAvatar(hubPreviewAvatar, hubPreviewParts, 0.34);
    hubPreviewAvatar.position.set(0, 0, 0);
    hubPreviewAvatar.rotation.y = -0.45;
    hubPreviewScene.add(hubPreviewAvatar);
  } catch (error) {
    console.warn("Could not initialize hub avatar preview", error);
    hubPreviewRenderer = null;
    hubPreviewScene = null;
    hubPreviewCamera = null;
    hubPreviewAvatar = null;
    hubPreviewParts = null;
  }
}

function initSidebarAvatarPreview() {
  if (!sidebarAvatarCanvas) {
    return;
  }

  try {
    sidebarPreviewRenderer = new THREE.WebGLRenderer({ canvas: sidebarAvatarCanvas, alpha: true, antialias: true });
    sidebarPreviewRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    sidebarPreviewRenderer.setSize(sidebarAvatarCanvas.clientWidth || 480, sidebarAvatarCanvas.clientHeight || 260, false);
    sidebarPreviewRenderer.shadowMap.enabled = true;
    sidebarPreviewRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

    sidebarPreviewScene = new THREE.Scene();
    sidebarPreviewCamera = new THREE.PerspectiveCamera(30, (sidebarAvatarCanvas.clientWidth || 480) / Math.max(sidebarAvatarCanvas.clientHeight || 260, 1), 0.1, 100);
    sidebarPreviewCamera.position.set(0, 3.4, 12.5);
    sidebarPreviewCamera.lookAt(0, 2.7, 0);

    const previewLight = new THREE.HemisphereLight(0xeefcff, 0x2f4052, 1.6);
    sidebarPreviewScene.add(previewLight);

    const previewSun = new THREE.DirectionalLight(0xffffff, 1.25);
    previewSun.position.set(7, 10, 8);
    previewSun.castShadow = true;
    sidebarPreviewScene.add(previewSun);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(4.4, 40),
      new THREE.MeshStandardMaterial({ color: 0x8fdcff, transparent: true, opacity: 0.18, roughness: 0.94 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.02;
    sidebarPreviewScene.add(floor);

    sidebarPreviewAvatar = new THREE.Group();
    sidebarPreviewParts = {};
    buildPlayerAvatar(sidebarPreviewAvatar, sidebarPreviewParts, 0.44);
    sidebarPreviewAvatar.position.set(0, -0.15, 0);
    sidebarPreviewAvatar.rotation.y = -0.35;
    sidebarPreviewScene.add(sidebarPreviewAvatar);
  } catch (error) {
    console.warn("Could not initialize sidebar avatar preview", error);
    sidebarPreviewRenderer = null;
    sidebarPreviewScene = null;
    sidebarPreviewCamera = null;
    sidebarPreviewAvatar = null;
    sidebarPreviewParts = null;
  }
}

// ---------- Дороги, разметка и тротуары ----------
// Высоты поверхностей: персонаж стоит ровно на них, а не проваливается.
const ROAD_TOP = 0.03;
const SIDEWALK_TOP = 0.2;
const BUILDING_FLOOR_TOP = 0.12;
const sidewalkRects = [];
const markingRects = { white: [], yellow: [] };
let asphaltMaterial = null;
let paverMaterial = null;
let curbMaterial = null;

function makeCanvasTexture(size, draw) {
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = size;
  textureCanvas.height = size;
  draw(textureCanvas.getContext("2d"), size);
  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

function getStreetMaterials() {
  if (asphaltMaterial) {
    return;
  }

  // Асфальт: крошка, потёртости, заплатки и трещинки
  const asphaltTexture = makeCanvasTexture(512, (ctx, size) => {
    ctx.fillStyle = "#34383f";
    ctx.fillRect(0, 0, size, size);
    const wrapped = (draw) => {
      [-size, 0, size].forEach((ox) => [-size, 0, size].forEach((oy) => draw(ox, oy)));
    };
    for (let i = 0; i < 46; i += 1) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = 30 + Math.random() * 90;
      const light = Math.random() < 0.5;
      wrapped((ox, oy) => {
        const grad = ctx.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, r);
        grad.addColorStop(0, light ? "rgba(82,86,92,0.16)" : "rgba(18,20,24,0.18)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(x + ox - r, y + oy - r, r * 2, r * 2);
      });
    }
    for (let i = 0; i < 22000; i += 1) {
      const v = 34 + Math.floor(Math.random() * 46);
      ctx.fillStyle = `rgba(${v},${v + 2},${v + 6},0.55)`;
      ctx.fillRect(Math.random() * size, Math.random() * size, 1 + Math.random() * 2, 1 + Math.random() * 2);
    }
    // тонкие трещины
    ctx.strokeStyle = "rgba(14,15,18,0.4)";
    for (let c = 0; c < 3; c += 1) {
      let x = 40 + Math.random() * (size - 80);
      let y = 40 + Math.random() * (size - 80);
      let angle = Math.random() * Math.PI * 2;
      ctx.lineWidth = 1 + Math.random() * 0.8;
      ctx.beginPath();
      ctx.moveTo(x, y);
      const steps = 6 + Math.floor(Math.random() * 10);
      for (let s = 0; s < steps; s += 1) {
        angle += (Math.random() - 0.5) * 1.2;
        x += Math.cos(angle) * (5 + Math.random() * 9);
        y += Math.sin(angle) * (5 + Math.random() * 9);
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  });
  asphaltMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, map: asphaltTexture, roughness: 0.96 });

  // Тротуарная плитка: швы, фаски и мелкая крошка
  const paverTexture = makeCanvasTexture(256, (ctx, size) => {
    ctx.fillStyle = "#57534c";
    ctx.fillRect(0, 0, size, size);
    const tile = size / 2;
    for (let tx = 0; tx < 2; tx += 1) {
      for (let ty = 0; ty < 2; ty += 1) {
        const shade = 104 + Math.floor(Math.random() * 16);
        const x = tx * tile + 4;
        const y = ty * tile + 4;
        const w = tile - 8;
        ctx.fillStyle = `rgb(${shade},${shade - 3},${shade - 10})`;
        ctx.fillRect(x, y, w, w);
        ctx.fillStyle = "rgba(255,255,255,0.13)";
        ctx.fillRect(x, y, w, 3);
        ctx.fillRect(x, y, 3, w);
        ctx.fillStyle = "rgba(0,0,0,0.16)";
        ctx.fillRect(x, y + w - 3, w, 3);
        ctx.fillRect(x + w - 3, y, 3, w);
      }
    }
    for (let i = 0; i < 2600; i += 1) {
      const v = 70 + Math.floor(Math.random() * 90);
      ctx.fillStyle = `rgba(${v},${v - 2},${v - 6},0.3)`;
      ctx.fillRect(Math.random() * size, Math.random() * size, 1 + Math.random() * 2, 1 + Math.random() * 2);
    }
  });
  paverMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, map: paverTexture, roughness: 0.95 });
  curbMaterial = new THREE.MeshStandardMaterial({ color: 0xd4d1ca, roughness: 0.9 });
}

// Растягиваем UV, чтобы текстура повторялась, а не растягивалась на всю длину дороги
function scaleBoxUv(geometry, repeatU, repeatV) {
  const uv = geometry.attributes.uv;
  for (let i = 0; i < uv.count; i += 1) {
    uv.setXY(i, uv.getX(i) * repeatU, uv.getY(i) * repeatV);
  }
  uv.needsUpdate = true;
}

function addRoadSurface(x, z, width, depth) {
  getStreetMaterials();
  const geometry = new THREE.BoxGeometry(width, ROAD_TOP, depth);
  scaleBoxUv(geometry, width / 10, depth / 10);
  const mesh = new THREE.Mesh(geometry, asphaltMaterial);
  mesh.position.set(x, ROAD_TOP / 2, z);
  mesh.receiveShadow = true;
  cityGroup.add(mesh);
  roads.push({ x, z, width, depth });
}

function addSidewalkRect(minX, maxX, minZ, maxZ) {
  getStreetMaterials();
  const width = maxX - minX;
  const depth = maxZ - minZ;
  const geometry = new THREE.BoxGeometry(width, SIDEWALK_TOP, depth);
  scaleBoxUv(geometry, width / 3, depth / 3);
  const mesh = new THREE.Mesh(geometry, paverMaterial);
  mesh.position.set((minX + maxX) / 2, SIDEWALK_TOP / 2, (minZ + maxZ) / 2);
  mesh.receiveShadow = true;
  cityGroup.add(mesh);
  sidewalkRects.push({ minX, maxX, minZ, maxZ });
}

function addCurb(minX, maxX, minZ, maxZ) {
  getStreetMaterials();
  const height = SIDEWALK_TOP + 0.04;
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(maxX - minX, height, maxZ - minZ), curbMaterial);
  mesh.position.set((minX + maxX) / 2, height / 2, (minZ + maxZ) / 2);
  mesh.receiveShadow = true;
  cityGroup.add(mesh);
}

function addMarkingRect(color, x, z, width, depth) {
  markingRects[color].push({ x, z, width, depth });
}

// Вся разметка рисуется через InstancedMesh: тысяча полосок = 2 вызова отрисовки
function flushMarkings() {
  const geometry = new THREE.PlaneGeometry(1, 1);
  geometry.rotateX(-Math.PI / 2);
  const colors = { white: 0xf4f4ef, yellow: 0xf2c230 };
  const dummy = new THREE.Object3D();

  Object.entries(markingRects).forEach(([colorName, rects]) => {
    if (!rects.length) {
      return;
    }
    const material = new THREE.MeshStandardMaterial({
      color: colors[colorName],
      roughness: 0.7,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2
    });
    const mesh = new THREE.InstancedMesh(geometry, material, rects.length);
    rects.forEach((rect, index) => {
      dummy.position.set(rect.x, ROAD_TOP + 0.004, rect.z);
      dummy.scale.set(rect.width, 1, rect.depth);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    cityGroup.add(mesh);
  });
}

// Разметка на участке дороги между перекрёстками
function addLaneMarkings(alongX, fixed, from, to) {
  const length = to - from;
  if (length <= 1) {
    return;
  }

  const put = (color, offset, start, segmentLength, lineWidth) => {
    const center = start + segmentLength / 2;
    if (alongX) {
      addMarkingRect(color, center, fixed + offset, segmentLength, lineWidth);
    } else {
      addMarkingRect(color, fixed + offset, center, lineWidth, segmentLength);
    }
  };

  // двойная сплошная по центру
  put("yellow", -0.32, from, length, 0.22);
  put("yellow", 0.32, from, length, 0.22);
  // сплошные линии у края дороги
  put("white", -11.1, from, length, 0.24);
  put("white", 11.1, from, length, 0.24);
  // прерывистые линии между полосами
  for (let start = from + 1.5; start + 3 <= to - 1.5; start += 9) {
    put("white", -6, start, 3, 0.22);
    put("white", 6, start, 3, 0.22);
  }
}

// Зебра поперёк дороги, ровно напротив тротуаров
function addCrosswalk(alongX, fixed, center) {
  for (let offset = -10.4; offset <= 10.41; offset += 1.6) {
    if (alongX) {
      addMarkingRect("white", center, fixed + offset, 4, 0.8);
    } else {
      addMarkingRect("white", fixed + offset, center, 0.8, 4);
    }
  }
}

function groundHeightCore(x, z, y = 0) {
  if (state.currentGame !== "city") {
    return 0;
  }
  // деревянные мостки над водой: стоим на досках, а под ними можно проплыть
  for (const deck of walkDecks) {
    const dx = x - deck.x;
    const dz = z - deck.z;
    const lx = dx * deck.cos - dz * deck.sin;
    const lz = dx * deck.sin + dz * deck.cos;
    if (Math.abs(lx) <= deck.hw && Math.abs(lz) <= deck.hl && y >= deck.top - 0.9) return deck.top;
  }
  const index = findBuildingAt(x, z);
  if (index !== null) {
    const building = buildings[index];
    const local = toBuildingLocal(building, x, z);
    const limit = y + 0.9;
    const onStairs = inStairStrip(building, local);
    let best = BUILDING_FLOOR_TOP;
    for (let k = 1; k < building.floors; k += 1) {
      const top = k * FLOOR_HEIGHT + BUILDING_FLOOR_TOP;
      if (!onStairs && top <= limit && top > best) best = top;
    }
    if (onStairs) {
      const s = building.stairs;
      const t = THREE.MathUtils.clamp((s.zLow - local.z) / (s.zLow - s.zHigh), 0, 1);
      for (let k = 0; k < building.floors - 1; k += 1) {
        const h = k * FLOOR_HEIGHT + BUILDING_FLOOR_TOP + t * FLOOR_HEIGHT;
        if (h <= limit && h > best) best = h;
      }
    }
    return best;
  }
  for (const rect of sidewalkRects) {
    if (x >= rect.minX && x <= rect.maxX && z >= rect.minZ && z <= rect.maxZ) {
      return SIDEWALK_TOP;
    }
  }
  return 0;
}

function addTrafficLight(x, z, rotationY = 0) {
  const group = new THREE.Group();

  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 6.8, 8),
    new THREE.MeshStandardMaterial({ color: 0x59616a, roughness: 0.55 })
  );
  pole.position.y = 3.4;
  group.add(pole);

  const arm = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 0.18, 0.18),
    new THREE.MeshStandardMaterial({ color: 0x59616a, roughness: 0.55 })
  );
  arm.position.set(1.2, 6.15, 0);
  group.add(arm);

  const lightBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 1.8, 0.55),
    new THREE.MeshStandardMaterial({ color: 0x20242a, roughness: 0.62 })
  );
  lightBox.position.set(2.4, 5.7, 0);
  group.add(lightBox);

  [0xff5353, 0xffcf43, 0x4be078].forEach((color, index) => {
    const bulbMaterial = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: index === 2 ? 0.6 : 0.24 });
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 10, 10),
      bulbMaterial
    );
    bulb.position.set(2.4, 6.25 - index * 0.5, 0.28);
    group.add(bulb);
    trafficBulbMaterials.push(bulbMaterial);
  });

  group.position.set(x, 0, z);
  group.rotation.y = rotationY;
  cityGroup.add(group);
}

// Парковка: асфальт и белые линии под большие машины
function addParkingLot(x, z, width, depth, slotWidth = 6.5) {
  getStreetMaterials();
  const geometry = new THREE.BoxGeometry(width, ROAD_TOP, depth);
  scaleBoxUv(geometry, width / 10, depth / 10);
  const lot = new THREE.Mesh(geometry, asphaltMaterial);
  lot.position.set(x, ROAD_TOP / 2, z);
  lot.receiveShadow = true;
  cityGroup.add(lot);
  const slots = Math.floor(width / slotWidth);
  for (let i = 0; i <= slots; i += 1) {
    addMarkingRect("white", x - width / 2 + i * (width / slots), z, 0.2, depth * 0.55);
  }
  mapAreas.push({ type: "lot", x, z, w: width, d: depth });
}

function createLabelTexture(text, backgroundColor = "#232b36", textColor = "#ffffff") {
  const labelCanvas = document.createElement("canvas");
  labelCanvas.width = 512;
  labelCanvas.height = 128;
  const ctx = labelCanvas.getContext("2d");

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, labelCanvas.width, labelCanvas.height);

  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(12, 12, labelCanvas.width - 24, labelCanvas.height - 24);

  ctx.fillStyle = textColor;
  ctx.font = "bold 40px Segoe UI";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, labelCanvas.width / 2, labelCanvas.height / 2);

  const texture = new THREE.CanvasTexture(labelCanvas);
  texture.needsUpdate = true;
  return texture;
}

// ---------- Машины: обтекаемые кузова, крутящиеся колёса, водитель внутри ----------
// Машина смотрит вперёд по своей оси +X. Размеры подогнаны под рост персонажа,
// чтобы водитель помещался в салон и его было видно через стёкла.
const CAR_MODELS = {
  hatch: {
    ru: "Bloblox Мини", en: "Bloblox Mini", price: 300,
    L: 8.8, W: 4.3, wheelR: 0.85, wb: 5.6, belt: 2.45, roof: 3.9, seatY: 1.0, recline: 0.15,
    wsBase: 2.7, roofFront: 1.2, roofRear: -3.8, rearBase: -4.2, maxSpeed: 36, accel: 22
  },
  sedan: {
    ru: "Bloblox Седан", en: "Bloblox Sedan", price: 600,
    L: 10.6, W: 4.4, wheelR: 0.9, wb: 6.5, belt: 2.4, roof: 3.75, seatY: 0.95, recline: 0.2,
    wsBase: 2.7, roofFront: 0.9, roofRear: -2.2, rearBase: -3.6, maxSpeed: 42, accel: 24
  },
  pickup: {
    ru: "Bloblox Рейнджер", en: "Bloblox Ranger", price: 900,
    L: 11.8, W: 4.6, wheelR: 1.05, wb: 7.4, belt: 2.8, roof: 4.4, seatY: 1.3, recline: 0.12,
    wsBase: 3.5, roofFront: 2.1, roofRear: -0.7, rearBase: -0.8, maxSpeed: 38, accel: 21, bed: true
  },
  suv: {
    ru: "Bloblox Трейл", en: "Bloblox Trail", price: 1200,
    L: 10.8, W: 4.6, wheelR: 1.05, wb: 6.6, belt: 2.85, roof: 4.5, seatY: 1.35, recline: 0.12,
    wsBase: 3.2, roofFront: 1.9, roofRear: -4.9, rearBase: -5.1, maxSpeed: 40, accel: 23, rails: true
  },
  sport: {
    ru: "Bloblox GT", en: "Bloblox GT", price: 2500,
    L: 10.8, W: 4.6, wheelR: 0.82, wb: 6.6, belt: 2.15, roof: 3.25, seatY: 0.62, recline: 0.45,
    wsBase: 2.1, roofFront: -0.2, roofRear: -2.6, rearBase: -4.4, maxSpeed: 64, accel: 36, spoiler: true
  },
  taxi: {
    ru: "Такси", en: "Taxi", price: 0,
    L: 10.6, W: 4.4, wheelR: 0.9, wb: 6.5, belt: 2.4, roof: 3.75, seatY: 0.95, recline: 0.2,
    wsBase: 2.7, roofFront: 0.9, roofRear: -2.2, rearBase: -3.6, maxSpeed: 42, accel: 24, taxiSign: true
  }
};

const CAR_COLORS = ["#d83a3a", "#2f6fd6", "#f2c230", "#27a36a", "#f4f4f2", "#1d1f24", "#8a4fd8", "#ff8a2a", "#7b8592", "#0f8f99"];

function makeCarMaterials(color) {
  return {
    body: new THREE.MeshStandardMaterial({ color, roughness: 0.32, metalness: 0.35 }),
    glass: new THREE.MeshStandardMaterial({ color: 0x7fa9c9, emissive: 0x1a2a3a, roughness: 0.05, metalness: 0.6, transparent: true, opacity: 0.5, depthWrite: false, side: THREE.DoubleSide }),
    trim: new THREE.MeshStandardMaterial({ color: 0x23262c, roughness: 0.7 }),
    chrome: new THREE.MeshStandardMaterial({ color: 0xd9dee5, roughness: 0.2, metalness: 0.85 }),
    tire: new THREE.MeshStandardMaterial({ color: 0x17191d, roughness: 0.92 }),
    rim: new THREE.MeshStandardMaterial({ color: 0xb9c0c9, roughness: 0.25, metalness: 0.8 }),
    seat: new THREE.MeshStandardMaterial({ color: 0x3a3330, roughness: 0.85 }),
    head: new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff3c4, emissiveIntensity: 0.35, roughness: 0.2 }),
    tail: new THREE.MeshStandardMaterial({ color: 0x8a1010, emissive: 0xff2a2a, emissiveIntensity: 0.3, roughness: 0.3 }),
    plate: new THREE.MeshStandardMaterial({ color: 0xf5f5f0, roughness: 0.5 })
  };
}

// Профиль кузова сбоку: скруглённый нос, корма и арки колёс
// inset — на сколько «ужать» контур, потому что скругление (bevel) потом раздует его обратно
function makeCarBodyShape(spec, inset = 0.3) {
  const hL = spec.L / 2 - inset;
  const gc = spec.wheelR * 0.45 + inset;
  const belt = spec.belt - inset;
  const nose = belt - (spec.spoiler ? 0.45 : 0.28);
  const archR = spec.wheelR + 0.2 + inset;
  const fa = spec.wb / 2;
  const ra = -spec.wb / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-hL, gc + 0.4);
  shape.lineTo(-hL, belt - 0.35);
  shape.quadraticCurveTo(-hL, belt, -hL + 0.45, belt);
  shape.lineTo(hL - 1.1, nose + 0.06);
  shape.quadraticCurveTo(hL, nose, hL, nose - 0.55);
  shape.lineTo(hL, gc + 0.4);
  shape.quadraticCurveTo(hL, gc, hL - 0.4, gc);
  shape.lineTo(fa + archR, gc);
  shape.lineTo(fa + archR, spec.wheelR);
  shape.absarc(fa, spec.wheelR, archR, 0, Math.PI, false);
  shape.lineTo(fa - archR, gc);
  shape.lineTo(ra + archR, gc);
  shape.lineTo(ra + archR, spec.wheelR);
  shape.absarc(ra, spec.wheelR, archR, 0, Math.PI, false);
  shape.lineTo(ra - archR, gc);
  shape.lineTo(-hL + 0.4, gc);
  shape.quadraticCurveTo(-hL, gc, -hL, gc + 0.4);
  return shape;
}

// Стеклянная «кабина» со скруглённой крышей
function makeCarCabinShape(spec, inset = 0.2) {
  const shape = new THREE.Shape();
  const base = spec.belt - 0.05;
  const roof = spec.roof - inset;
  const rear = spec.rearBase + inset;
  const front = spec.wsBase - inset;
  shape.moveTo(rear, base);
  shape.quadraticCurveTo(spec.roofRear + inset, roof, spec.roofRear + 0.7, roof);
  shape.lineTo(spec.roofFront - 0.7, roof);
  shape.quadraticCurveTo(spec.roofFront - inset, roof, front, base);
  shape.lineTo(rear, base);
  return shape;
}

function extrudeCarShape(shape, width, bevel = 0.28) {
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.1, width - bevel * 2),
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 14
  });
  geometry.translate(0, 0, -(width - bevel * 2) / 2);
  return geometry;
}

function addCarPart(geometry, material, parent, x, y, z, castShadow = true) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.castShadow = castShadow;
  parent.add(mesh);
  return mesh;
}

function addCarBeam(parent, material, x1, y1, x2, y2, z, thickness = 0.24) {
  const length = Math.hypot(x2 - x1, y2 - y1);
  const beam = addCarPart(new THREE.BoxGeometry(length, thickness, 0.16), material, parent, (x1 + x2) / 2, (y1 + y2) / 2, z);
  beam.rotation.z = Math.atan2(y2 - y1, x2 - x1);
  return beam;
}

function createCarModel(modelId, color) {
  if (modelId === "flyer") {
    return createFlyerModel(color);
  }
  const spec = CAR_MODELS[modelId] || CAR_MODELS.sedan;
  const mats = makeCarMaterials(spec.taxiSign ? "#f2c230" : color);
  const group = new THREE.Group();
  const body = new THREE.Group(); // кузов чуть качается на поворотах
  group.add(body);
  const hL = spec.L / 2;
  const hW = spec.W / 2;

  // кузов и стёкла
  addCarPart(extrudeCarShape(makeCarBodyShape(spec), spec.W, 0.3), mats.body, body, 0, 0, 0);
  const cabinWidth = spec.W - 0.5;
  const cabin = addCarPart(extrudeCarShape(makeCarCabinShape(spec), cabinWidth, 0.2), mats.glass, body, 0, 0, 0, false);
  cabin.userData.keepSeparate = true;

  // крыша и стойки в цвет кузова
  const roofLength = (spec.roofFront - 0.7) - (spec.roofRear + 0.7) + 0.5;
  const roofSlab = addCarPart(new THREE.BoxGeometry(roofLength, 0.16, cabinWidth + 0.05), mats.body, body, (spec.roofFront + spec.roofRear) / 2, spec.roof + 0.03, 0);
  roofSlab.castShadow = true;
  const pillarZ = cabinWidth / 2 + 0.02;
  [-pillarZ, pillarZ].forEach((z) => {
    addCarBeam(body, mats.body, spec.wsBase - 0.1, spec.belt, spec.roofFront - 0.35, spec.roof - 0.02, z);
    addCarBeam(body, mats.body, spec.rearBase + 0.1, spec.belt, spec.roofRear + 0.35, spec.roof - 0.02, z);
    if (!spec.bed && spec.roofFront - spec.roofRear > 3) {
      const bX = (spec.roofFront + spec.roofRear) / 2;
      addCarBeam(body, mats.body, bX, spec.belt, bX + 0.05, spec.roof - 0.02, z, 0.28);
    }
  });

  // фары, фонари, решётка, бамперы, номера
  const nose = spec.belt - (spec.spoiler ? 0.45 : 0.28);
  [-1, 1].forEach((side) => {
    addCarPart(new THREE.BoxGeometry(0.22, 0.38, 1.0), mats.head, body, hL + 0.05, nose - 0.42, side * (hW - 0.85), false);
    addCarPart(new THREE.BoxGeometry(0.22, 0.34, 1.05), mats.tail, body, -hL - 0.05, spec.belt - 0.5, side * (hW - 0.8), false);
    // зеркала
    addCarPart(new THREE.BoxGeometry(0.35, 0.3, 0.45), mats.body, body, spec.wsBase - 0.25, spec.belt + 0.3, side * (hW + 0.15));
  });
  addCarPart(new THREE.BoxGeometry(0.16, 0.5, spec.W * 0.42), mats.trim, body, hL + 0.04, nose - 0.95, 0, false);
  addCarPart(new THREE.BoxGeometry(0.4, 0.5, spec.W - 0.3), mats.trim, body, hL - 0.05, spec.wheelR * 0.45 + 0.3, 0);
  addCarPart(new THREE.BoxGeometry(0.4, 0.5, spec.W - 0.3), mats.trim, body, -hL + 0.05, spec.wheelR * 0.45 + 0.3, 0);
  addCarPart(new THREE.BoxGeometry(0.06, 0.32, 1.1), mats.plate, body, hL + 0.27, spec.wheelR * 0.45 + 0.35, 0, false);
  addCarPart(new THREE.BoxGeometry(0.06, 0.32, 1.1), mats.plate, body, -hL - 0.27, spec.wheelR * 0.45 + 0.35, 0, false);
  // дверные ручки
  [-1, 1].forEach((side) => {
    addCarPart(new THREE.BoxGeometry(0.5, 0.08, 0.08), mats.chrome, body, spec.wsBase - 1.6, spec.belt - 0.35, side * (hW + 0.02), false);
  });

  // особенности моделей
  if (spec.spoiler) {
    [-1, 1].forEach((side) => addCarPart(new THREE.BoxGeometry(0.2, 0.55, 0.12), mats.trim, body, -hL + 0.6, spec.belt + 0.25, side * (hW - 0.9)));
    addCarPart(new THREE.BoxGeometry(0.8, 0.1, spec.W - 0.4), mats.body, body, -hL + 0.55, spec.belt + 0.55, 0);
  }
  if (spec.rails) {
    [-1, 1].forEach((side) => addCarPart(new THREE.BoxGeometry(roofLength - 0.4, 0.12, 0.14), mats.chrome, body, (spec.roofFront + spec.roofRear) / 2, spec.roof + 0.22, side * (cabinWidth / 2 - 0.3)));
  }
  if (spec.bed) {
    const bedFront = spec.rearBase - 0.3;
    const bedLength = bedFront - (-hL + 0.35);
    addCarPart(new THREE.BoxGeometry(bedLength, 0.06, spec.W - 0.9), mats.trim, body, (bedFront - hL + 0.35) / 2, spec.belt + 0.01, 0, false);
  }
  if (spec.taxiSign) {
    const sign = addCarPart(new THREE.BoxGeometry(1.5, 0.5, 0.9), new THREE.MeshStandardMaterial({ color: 0xffffff, map: createLabelTexture("TAXI", "#1d1f24", "#f2c230"), emissive: 0x332a00, roughness: 0.4 }), body, (spec.roofFront + spec.roofRear) / 2, spec.roof + 0.4, 0);
    sign.rotation.y = Math.PI / 2;
  }

  // салон: панель, сиденья, руль
  const driverZ = -spec.W * 0.22;
  const seatX = spec.wsBase - 2.3;
  addCarPart(new THREE.BoxGeometry(0.9, 0.5, spec.W - 1.1), mats.trim, body, spec.wsBase - 0.45, spec.belt - 0.15, 0, false);
  const seats = [[seatX, driverZ], [seatX, -driverZ]];
  if (!spec.bed && !spec.spoiler) {
    seats.push([seatX - 2.3, driverZ], [seatX - 2.3, -driverZ]);
  }
  seats.forEach(([sx, sz]) => {
    addCarPart(new THREE.BoxGeometry(1.25, 0.35, 1.3), mats.seat, body, sx, spec.seatY - 0.18, sz, false);
    const back = addCarPart(new THREE.BoxGeometry(0.3, 1.6, 1.25), mats.seat, body, sx - 0.7, spec.seatY + 0.65, sz, false);
    back.rotation.z = spec.recline;
  });

  const steering = new THREE.Group();
  steering.position.set(seatX + 1.25, Math.max(spec.seatY + 1.1, spec.belt - 0.1), driverZ);
  steering.rotation.z = 0.4;
  steering.userData.dynamic = true;
  body.add(steering);
  const steeringSpin = new THREE.Group();
  steering.add(steeringSpin);
  const steeringWheel = addCarPart(new THREE.TorusGeometry(0.42, 0.07, 8, 20), mats.trim, steeringSpin, 0, 0, 0, false);
  steeringWheel.rotation.y = Math.PI / 2;

  // места для водителя и пассажира
  const driverSeat = new THREE.Group();
  driverSeat.position.set(seatX - 0.1, spec.seatY, driverZ);
  driverSeat.rotation.y = Math.PI / 2;
  driverSeat.userData.dynamic = true;
  body.add(driverSeat);
  const passengerSeat = new THREE.Group();
  const rearSeat = seats.length > 2;
  passengerSeat.position.set(rearSeat ? seatX - 2.4 : seatX - 0.1, spec.seatY, -driverZ);
  passengerSeat.rotation.y = Math.PI / 2;
  passengerSeat.userData.dynamic = true;
  body.add(passengerSeat);

  // колёса: поворачиваются (передние) и крутятся при езде
  const wheels = [];
  [[spec.wb / 2, true], [-spec.wb / 2, false]].forEach(([wx, front]) => {
    [-1, 1].forEach((side) => {
      const steer = new THREE.Group();
      steer.position.set(wx, spec.wheelR, side * (hW - 0.45));
      group.add(steer);
      const spin = new THREE.Group();
      steer.add(spin);
      const tire = addCarPart(new THREE.CylinderGeometry(spec.wheelR, spec.wheelR, 0.7, 24), mats.tire, spin, 0, 0, 0);
      tire.rotation.x = Math.PI / 2;
      const rim = addCarPart(new THREE.CylinderGeometry(spec.wheelR * 0.62, spec.wheelR * 0.62, 0.74, 16), mats.rim, spin, 0, 0, 0, false);
      rim.rotation.x = Math.PI / 2;
      // спицы, чтобы было видно, как колесо крутится
      for (let i = 0; i < 5; i += 1) {
        const spoke = addCarPart(new THREE.BoxGeometry(spec.wheelR * 1.15, 0.16, 0.08), mats.trim, spin, 0, 0, side * 0.38, false);
        spoke.rotation.z = (i / 5) * Math.PI;
      }
      mergeStaticMeshes(spin, Infinity, true); // шина, диск и спицы крутятся вместе — склеиваем
      wheels.push({ steer, spin, front });
    });
  });

  // склеиваем неподвижные детали кузова в несколько мешей — так много машин не тормозят игру
  mergeStaticMeshes(body, Infinity, true);

  return {
    group, body, wheels, steeringSpin, driverSeat, passengerSeat, spec, mats, cabin
  };
}

function addCar(x, z, modelId = "sedan", color = null, rotationY = 0, options = {}) {
  const spec = CAR_MODELS[modelId] || CAR_MODELS.sedan;
  const model = createCarModel(modelId, color || CAR_COLORS[cars.length % CAR_COLORS.length]);
  const { group } = model;
  group.position.set(x, 0, z);
  group.rotation.y = rotationY;
  group.userData.dynamic = true;
  (options.parent || cityGroup).add(group);

  carLightMaterials.push(model.mats.head, model.mats.tail);

  const vehicle = {
    ...model,
    modelId,
    speed: 0,
    steerAngle: 0,
    maxSpeed: spec.maxSpeed,
    acceleration: spec.accel,
    wheelR: spec.wheelR,
    wheelbase: spec.wb,
    halfLength: spec.L / 2,
    halfWidth: spec.W / 2,
    headingOffset: Math.PI / 2, // модель смотрит по +X
    display: Boolean(options.display)
  };
  if (!vehicle.display) {
    cars.push(vehicle);
  }
  return vehicle;
}

// ---------- Звук мотора ----------
const engineAudio = { nodes: null };

function startEngineSound() {
  const context = ensureAudioContext();
  if (!context || engineAudio.nodes) {
    return;
  }
  if (context.state === "suspended") {
    context.resume();
  }
  const now = context.currentTime;
  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.07, now + 0.4);
  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 500;
  filter.Q.value = 2;
  const low = context.createOscillator();
  low.type = "sawtooth";
  low.frequency.value = 42;
  const high = context.createOscillator();
  high.type = "square";
  high.frequency.value = 84;
  const highGain = context.createGain();
  highGain.gain.value = 0.35;
  low.connect(filter);
  high.connect(highGain);
  highGain.connect(filter);
  filter.connect(master);
  master.connect(context.destination);
  low.start();
  high.start();

  // короткий звук стартера
  const starter = context.createOscillator();
  const starterGain = context.createGain();
  starter.type = "sawtooth";
  starter.frequency.setValueAtTime(30, now);
  starter.frequency.linearRampToValueAtTime(70, now + 0.35);
  starterGain.gain.setValueAtTime(0.05, now);
  starterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
  starter.connect(starterGain);
  starterGain.connect(context.destination);
  starter.start(now);
  starter.stop(now + 0.42);

  engineAudio.nodes = { master, filter, low, high };
}

function updateEngineSound(vehicle, throttle) {
  const nodes = engineAudio.nodes;
  const context = audioState.context;
  if (!nodes || !context) {
    return;
  }
  // имитация передач: обороты растут и «сбрасываются» при переключении
  const ratio = Math.min(1, Math.abs(vehicle.speed) / vehicle.maxSpeed);
  const gear = Math.min(4, Math.floor(ratio * 5));
  const rpm = 0.25 + 0.75 * (ratio * 5 - gear) * (gear === 4 ? 0.6 : 1) + (throttle > 0 ? 0.08 : 0);
  const freq = 38 + rpm * 95 + gear * 6;
  const now = context.currentTime;
  nodes.low.frequency.setTargetAtTime(freq, now, 0.06);
  nodes.high.frequency.setTargetAtTime(freq * 2.01, now, 0.06);
  nodes.filter.frequency.setTargetAtTime(380 + rpm * 900 + (throttle > 0 ? 300 : 0), now, 0.08);
  nodes.master.gain.setTargetAtTime(0.05 + rpm * 0.05 + (throttle > 0 ? 0.02 : 0), now, 0.1);
}

function stopEngineSound() {
  const nodes = engineAudio.nodes;
  const context = audioState.context;
  if (!nodes || !context) {
    return;
  }
  const now = context.currentTime;
  nodes.master.gain.cancelScheduledValues(now);
  nodes.master.gain.setValueAtTime(Math.max(0.0001, nodes.master.gain.value), now);
  nodes.master.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
  nodes.low.stop(now + 0.4);
  nodes.high.stop(now + 0.4);
  engineAudio.nodes = null;
}

function playHorn() {
  const context = ensureAudioContext();
  if (!context) {
    return;
  }
  const now = context.currentTime;
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
  gain.gain.setValueAtTime(0.08, now + 0.32);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
  [415, 523].forEach((frequency) => {
    const osc = context.createOscillator();
    osc.type = "square";
    osc.frequency.value = frequency;
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.42);
  });
  gain.connect(context.destination);
}

const floorMaterialCache = new Map();

// Здание. style: "city" (многоэтажка с квартирами и лестницей), "cottage" (домик),
// "showroom" (автосалон), "tower" (подиум небоскрёба). facing: 1 — дверь на +Z, -1 — на -Z.
function addBuilding(options) {
  const {
    x, z, width, depth, height, bodyColor, roofColor, windowColor, name, signColor = "#232b36",
    style = "city", facing = 1, showSign = true
  } = options;

  const group = new THREE.Group();
  const isCottage = style === "cottage";
  const isShowroom = style === "showroom";
  const isTower = style === "tower";
  const floors = style === "city" ? Math.max(1, options.floors || 1) : 1;
  const groundHeight = isCottage ? 7 : isShowroom ? height : isTower ? 10 : FLOOR_HEIGHT;
  const enterTop = floors * groundHeight;
  const doorWidth = isShowroom || isTower ? 7 : BUILDING_DOOR_WIDTH;
  const doorHeight = isShowroom || isTower ? 7.2 : BUILDING_DOOR_HEIGHT;
  const wall = BUILDING_WALL;
  const halfW = width / 2;
  const halfD = depth / 2;
  const innerHalfW = halfW - wall;
  const innerHalfD = halfD - wall;
  const doorHalf = doorWidth / 2;
  const type = options.type || (isShowroom ? "showroom" : getBuildingType(name));
  const [floorColor, wallColor, accentColor] = INTERIOR_COLORS[type] || INTERIOR_COLORS.residence;

  const bodyMaterial = isCottage ? getSidingMaterial(bodyColor) : new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.82 });
  const roofMaterial = new THREE.MeshStandardMaterial({ color: roofColor, roughness: 0.65 });
  let facadeRows = 0;
  const addBox = (w, h, d, px, py, pz, material, castShadow = true, receiveShadow = true) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(px, py, pz);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = receiveShadow;
    group.add(mesh);
    return mesh;
  };
  const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0xcfefff, emissive: 0x96dfff, emissiveIntensity: 0.12, transparent: true,
    opacity: isShowroom ? 0.22 : 0.32, roughness: 0.05, metalness: 0.1, depthWrite: false
  });
  storefrontGlassMaterials.push(glassMaterial);

  // --- Крыша / верх ---
  if (isCottage) {
    const roofShape = new THREE.Shape();
    roofShape.moveTo(-halfW - 0.8, 0);
    roofShape.lineTo(halfW + 0.8, 0);
    roofShape.lineTo(0, Math.min(5, width * 0.32));
    roofShape.lineTo(-halfW - 0.8, 0);
    const roofGeometry = new THREE.ExtrudeGeometry(roofShape, { depth: depth + 1.4, bevelEnabled: false });
    roofGeometry.translate(0, 0, -(depth + 1.4) / 2);
    const roof = new THREE.Mesh(roofGeometry, getCottageRoofMaterials(roofColor, bodyColor));
    roof.position.y = groundHeight;
    roof.castShadow = true;
    group.add(roof);
    addBox(1.1, 3, 1.1, halfW * 0.45, groundHeight + 2.6, -halfD * 0.3, new THREE.MeshStandardMaterial({ color: 0x8a5a44, roughness: 0.9 }));
  } else if (isShowroom || isTower) {
    addBox(width + 0.8, 0.8, depth + 0.8, 0, groundHeight + 0.4, 0, roofMaterial);
  } else {
    for (let k = 1; k <= floors; k += 1) {
      addBox(width + 0.3, 0.45, depth + 0.3, 0, k * FLOOR_HEIGHT + 0.1, 0, roofMaterial); // пояс между этажами
    }
    if (height > enterTop + 1) {
      const upperHeight = height - enterTop;
      // верхние этажи — квартиры: настоящие окна со шторами, ночью часть горит
      if (upperHeight >= 3 && options.historic) {
        // исторический дом: окна с наличниками на всех этажах, изнутри через них всё равно видно улицу
        facadeRows = Math.max(1, Math.round(upperHeight / 8));
        addApartmentFacade(group, width + 0.12, depth + 0.12, FLOOR_HEIGHT, height - FLOOR_HEIGHT, bodyColor, roofColor, options.historic);
      } else if (upperHeight >= 3) facadeRows = addApartmentFacade(group, width, depth, enterTop, upperHeight, bodyColor, roofColor);
      else addBox(width, upperHeight, depth, 0, enterTop + upperHeight / 2, 0, bodyMaterial);
    }
    const top = Math.max(height, enterTop);
    addBox(width + 0.6, 1.1, depth + 0.6, 0, top + 0.55, 0, roofMaterial);
    addBox(width + 0.4, 0.45, depth + 0.4, 0, top - 0.85, 0, roofMaterial);
  }

  // --- Первый этаж: стены, витрины, дверь ---
  // у жилой многоэтажки сзади настоящая дверь в подъезд
  const hasPlan = style === "city" && floors > 1;
  const backDoorX = halfW - wall - 1.9;
  if (hasPlan) {
    const d0 = backDoorX - 1.7;
    const d1 = backDoorX + 1.7;
    addBox(d0 + halfW, groundHeight, wall, (-halfW + d0) / 2, groundHeight / 2, -halfD + wall / 2, bodyMaterial);
    addBox(halfW - d1, groundHeight, wall, (d1 + halfW) / 2, groundHeight / 2, -halfD + wall / 2, bodyMaterial);
    addBox(3.4, groundHeight - 6, wall, backDoorX, 6 + (groundHeight - 6) / 2, -halfD + wall / 2, bodyMaterial);
  } else {
    addBox(width, groundHeight, wall, 0, groundHeight / 2, -halfD + wall / 2, bodyMaterial);
  }
  addBox(wall, groundHeight, depth, -halfW + wall / 2, groundHeight / 2, 0, bodyMaterial);
  addBox(wall, groundHeight, depth, halfW - wall / 2, groundHeight / 2, 0, bodyMaterial);
  if (isCottage) {
    [-1, 1].forEach((side) => addBox(0.08, 2.4, 3, side * (halfW + 0.02), 3.6, 0, glassMaterial, false, false));
  }
  const frontZ = halfD - wall / 2;
  const segmentWidth = halfW - doorHalf;
  const glassTop = isShowroom || isTower ? groundHeight - 1.2 : 5.4;
  const glassBottom = isShowroom || isTower ? 0.3 : 1;
  const glassHeight = glassTop - glassBottom;
  const glassWidth = segmentWidth - 1.1;
  [-1, 1].forEach((side) => {
    const segmentX = side * (doorHalf + segmentWidth / 2);
    const glassX = side * (doorHalf + 0.5 + glassWidth / 2);
    addBox(segmentWidth, glassBottom, wall, segmentX, glassBottom / 2, frontZ, bodyMaterial);
    addBox(segmentWidth, groundHeight - glassTop, wall, segmentX, glassTop + (groundHeight - glassTop) / 2, frontZ, bodyMaterial);
    addBox(0.6, glassHeight, wall, side * (halfW - 0.3), glassBottom + glassHeight / 2, frontZ, bodyMaterial);
    addBox(0.5, glassHeight, wall + 0.1, side * (doorHalf + 0.25), glassBottom + glassHeight / 2, frontZ, roofMaterial);
    addBox(glassWidth, glassHeight, 0.08, glassX, glassBottom + glassHeight / 2, frontZ, glassMaterial, false, false);
    const mullions = isShowroom || isTower ? 3 : Math.max(1, Math.round(glassWidth / 6));
    for (let m = 0; m < mullions; m += 1) {
      const mx = side * (doorHalf + 0.5 + glassWidth * ((m + 1) / (mullions + 1)));
      addBox(0.12, glassHeight, wall * 0.7, mx, glassBottom + glassHeight / 2, frontZ, roofMaterial, false);
    }
  });
  addBox(doorWidth, groundHeight - doorHeight, wall, 0, doorHeight + (groundHeight - doorHeight) / 2, frontZ, bodyMaterial);

  const plinthMaterial = new THREE.MeshStandardMaterial({ color: 0xcfc8bc, roughness: 0.94 });
  addBox(width + 0.2, 0.6, 0.15, 0, 0.3, -halfD - 0.05, plinthMaterial, false);
  addBox(0.15, 0.6, depth + 0.2, -halfW - 0.05, 0.3, 0, plinthMaterial, false);
  addBox(0.15, 0.6, depth + 0.2, halfW + 0.05, 0.3, 0, plinthMaterial, false);

  // --- Верхние этажи с окнами со всех сторон ---
  const wallMaterials = { body: bodyMaterial, glass: glassMaterial, frame: roofMaterial };
  for (let k = 1; k < floors; k += 1) {
    const yBase = k * FLOOR_HEIGHT;
    addWindowWall(addBox, wallMaterials, true, width, 0, -halfD + wall / 2, yBase, wall);
    addWindowWall(addBox, wallMaterials, true, width, 0, halfD - wall / 2, yBase, wall);
    addWindowWall(addBox, wallMaterials, false, depth - wall * 2, -halfW + wall / 2, 0, yBase, wall);
    addWindowWall(addBox, wallMaterials, false, depth - wall * 2, halfW - wall / 2, 0, yBase, wall);
  }

  // --- Полы, перекрытия, лестница ---
  if (!floorMaterialCacheV3.has(floorColor)) {
    const floorTexture = makeCanvasTexture(128, (ctx, size) => {
      ctx.fillStyle = `#${new THREE.Color(floorColor).getHexString()}`;
      ctx.fillRect(0, 0, size, size);
      ctx.strokeStyle = "rgba(0,0,0,0.12)";
      ctx.lineWidth = 2;
      [[1, 1], [size / 2 + 1, 1], [1, size / 2 + 1], [size / 2 + 1, size / 2 + 1]].forEach(([sx, sy]) => ctx.strokeRect(sx, sy, size / 2 - 2, size / 2 - 2));
    });
    floorMaterialCacheV3.set(floorColor, new THREE.MeshStandardMaterial({ color: 0xffffff, map: floorTexture, roughness: isShowroom ? 0.25 : 0.6 }));
  }
  const floorMaterial = floorMaterialCacheV3.get(floorColor);
  const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0xf7f4ee, roughness: 0.98 });
  const panelMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff2d6, emissiveIntensity: 0.9 });
  const addFloorRect = (minX, maxX, minZ, maxZ, y, withCeiling) => {
    const w = maxX - minX;
    const d = maxZ - minZ;
    if (w < 0.2 || d < 0.2) return;
    const geometry = new THREE.BoxGeometry(w, BUILDING_FLOOR_TOP, d);
    scaleBoxUv(geometry, w / 4, d / 4);
    const floorMesh = new THREE.Mesh(geometry, floorMaterial);
    floorMesh.position.set((minX + maxX) / 2, y + BUILDING_FLOOR_TOP / 2, (minZ + maxZ) / 2);
    floorMesh.receiveShadow = false;
    group.add(floorMesh);
    if (withCeiling) {
      addBox(w, 0.25, d, (minX + maxX) / 2, y - 0.125, (minZ + maxZ) / 2, ceilingMaterial, false, false);
    }
  };

  let stairs = null;
  if (floors > 1) {
    const stairWidth = 3.8;
    stairs = { sx0: innerHalfW - stairWidth, sx1: innerHalfW, zLow: Math.min(6, innerHalfD - 5), zHigh: 0 };
    stairs.zHigh = stairs.zLow - 12;
  }
  addFloorRect(-innerHalfW, innerHalfW, -innerHalfD, innerHalfD, 0, false);
  for (let k = 1; k < floors; k += 1) {
    const y = k * FLOOR_HEIGHT;
    // перекрытие с проёмом над лестницей
    addFloorRect(-innerHalfW, stairs.sx0, -innerHalfD, innerHalfD, y, true);
    addFloorRect(stairs.sx0, innerHalfW, -innerHalfD, stairs.zHigh, y, true);
    addFloorRect(stairs.sx0, innerHalfW, stairs.zLow, innerHalfD, y, true);
  }
  addBox(doorWidth, BUILDING_FLOOR_TOP, wall, 0, BUILDING_FLOOR_TOP / 2, frontZ, plinthMaterial, false, false);
  addBox(innerHalfW * 2, 0.1, innerHalfD * 2, 0, enterTop - 0.05, 0, ceilingMaterial, false, false);
  for (let k = 0; k < floors; k += 1) {
    const ceilingY = (k + 1) * groundHeight - (k + 1 < floors ? 0.3 : 0.13);
    [-innerHalfD / 2, innerHalfD / 2].forEach((panelZ) => {
      addBox(innerHalfW, 0.06, 1.1, stairs ? -stairs.sx1 * 0.15 : 0, ceilingY, panelZ, panelMaterial, false, false);
    });
  }

  if (stairs) {
    const stairMaterial = new THREE.MeshStandardMaterial({ color: 0x9a7b5a, roughness: 0.8 });
    const railMaterial = new THREE.MeshStandardMaterial({ color: 0x3b3f46, roughness: 0.4, metalness: 0.6 });
    const steps = 16;
    const length = stairs.zLow - stairs.zHigh;
    const run = length / steps;
    const rise = FLOOR_HEIGHT / steps;
    const stairCenterX = (stairs.sx0 + stairs.sx1) / 2;
    for (let k = 0; k < floors - 1; k += 1) {
      const base = k * FLOOR_HEIGHT + BUILDING_FLOOR_TOP;
      for (let i = 0; i < steps; i += 1) {
        const top = base + (i + 1) * rise;
        addBox(stairs.sx1 - stairs.sx0, 0.45, run + 0.04, stairCenterX, top - 0.225, stairs.zLow - (i + 0.5) * run, stairMaterial);
      }
      const rail = addBox(0.14, 0.14, Math.hypot(length, FLOOR_HEIGHT), stairs.sx0 + 0.1, base + FLOOR_HEIGHT / 2 + 3.2, (stairs.zLow + stairs.zHigh) / 2, railMaterial, false);
      rail.rotation.x = Math.atan2(FLOOR_HEIGHT, length);
      [stairs.zLow, stairs.zHigh].forEach((pz, index) => {
        addBox(0.14, 3.2, 0.14, stairs.sx0 + 0.1, base + index * FLOOR_HEIGHT + 1.6, pz, railMaterial, false);
      });
    }
    // перила вокруг проёмов на верхних этажах
    for (let k = 1; k < floors; k += 1) {
      addBox(0.14, 0.14, length, stairs.sx0 + 0.1, k * FLOOR_HEIGHT + 3, (stairs.zLow + stairs.zHigh) / 2, railMaterial, false);
    }
  }

  // отделка стен и плинтус на первом этаже
  const liningMaterial = new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.95 });
  addBox(innerHalfW * 2, groundHeight - 0.2, 0.04, 0, groundHeight / 2, -halfD + wall + 0.02, liningMaterial, false, false);
  addBox(0.04, groundHeight - 0.2, innerHalfD * 2, -halfW + wall + 0.02, groundHeight / 2, 0, liningMaterial, false, false);
  addBox(0.04, groundHeight - 0.2, innerHalfD * 2, halfW - wall - 0.02, groundHeight / 2, 0, liningMaterial, false, false);
  const skirtingMaterial = new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.8 });
  addBox(innerHalfW * 2, 0.35, 0.06, 0, BUILDING_FLOOR_TOP + 0.17, -halfD + wall + 0.05, skirtingMaterial, false, false);

  // --- Фасад: козырёк, вывеска, крыльцо ---
  addBox(doorWidth + 1.6, 0.28, 2, 0, doorHeight + 0.35, halfD + 1, roofMaterial);
  if (showSign) {
    const big = isShowroom || isTower;
    const signWidth = big ? Math.min(width - 6, 22) : Math.min(width - 4, 9);
    const signHeight = big ? 3 : isCottage ? 1 : 1.5;
    const sign = new THREE.Mesh(
      new THREE.BoxGeometry(signWidth, signHeight, 0.25),
      new THREE.MeshStandardMaterial({ color: 0xffffff, map: createLabelTexture(name, signColor, "#ffffff"), roughness: 0.58 })
    );
    const signY = isShowroom ? groundHeight + 2.3 : isTower ? groundHeight - 1.6 : isCottage ? groundHeight - 0.55 : 7.1;
    sign.position.set(0, signY, halfD + (isTower ? 0.35 : 0.25));
    group.add(sign);
  }
  addBox(doorWidth + 1.4, 0.06, 3.4, 0, 0.03, halfD + 1.7, plinthMaterial, false);

  // --- Окна в сплошной верхней части многоэтажки ---
  if (style === "city" && height > enterTop + 3 && facadeRows === 0) {
    const windowMaterial = new THREE.MeshStandardMaterial({ color: windowColor, emissive: windowColor, emissiveIntensity: 0.18, roughness: 0.2, metalness: 0.1 });
    buildingWindowMaterials.push(windowMaterial);
    const frameMaterial = new THREE.MeshStandardMaterial({ color: roofColor, roughness: 0.72 });
    const paneGeometry = new THREE.BoxGeometry(1.6, 2, 0.15);
    const frameGeometry = new THREE.BoxGeometry(1.84, 2.24, 0.09);
    const columns = Math.max(2, Math.floor(width / 4.5));
    for (let wy = enterTop + 2.6; wy < height - 1.6; wy += 3.2) {
      for (let col = 0; col < columns; col += 1) {
        const wx = -halfW + 2.4 + col * ((width - 4.8) / Math.max(columns - 1, 1));
        [1, -1].forEach((sideZ) => {
          const pane = new THREE.Mesh(paneGeometry, windowMaterial);
          pane.position.set(wx, wy, sideZ * (halfD + 0.18));
          group.add(pane);
          const frame = new THREE.Mesh(frameGeometry, frameMaterial);
          frame.position.set(wx, wy, sideZ * (halfD + 0.11));
          group.add(frame);
        });
      }
      const sideColumns = Math.max(2, Math.floor(depth / 5));
      for (let col = 0; col < sideColumns; col += 1) {
        const wz = -halfD + 2.4 + col * ((depth - 4.8) / Math.max(sideColumns - 1, 1));
        [-1, 1].forEach((sideX) => {
          const pane = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2, 1.6), windowMaterial);
          pane.position.set(sideX * (halfW + 0.08), wy, wz);
          group.add(pane);
        });
      }
    }
  }

  group.position.set(x, 0, z);
  group.rotation.y = facing === 1 ? 0 : Math.PI;
  group.userData = { name, width, depth };
  cityGroup.add(group);

  const worldRect = (minLX, maxLX, minLZ, maxLZ, extra = {}) => (facing === 1
    ? { minX: x + minLX, maxX: x + maxLX, minZ: z + minLZ, maxZ: z + maxLZ, ...extra }
    : { minX: x - maxLX, maxX: x - minLX, minZ: z - maxLZ, maxZ: z - minLZ, ...extra });
  const wallHeight = options.colliderHeight || (isCottage ? groundHeight + 3 : Math.max(height, enterTop));
  if (hasPlan) {
    addCollider(worldRect(-halfW, backDoorX - 1.7, -halfD, -halfD + wall, { height: wallHeight }));
    addCollider(worldRect(backDoorX + 1.7, halfW, -halfD, -halfD + wall, { height: wallHeight }));
    addCollider(worldRect(backDoorX - 1.7, backDoorX + 1.7, -halfD, -halfD + wall, { minY: 5.4, maxY: wallHeight + 1, height: wallHeight }));
  } else {
    addCollider(worldRect(-halfW, halfW, -halfD, -halfD + wall, { height: wallHeight }));
  }
  addCollider(worldRect(-halfW, -halfW + wall, -halfD, halfD, { height: wallHeight }));
  addCollider(worldRect(halfW - wall, halfW, -halfD, halfD, { height: wallHeight }));
  addCollider(worldRect(-halfW, -doorHalf, halfD - wall, halfD, { height: wallHeight }));
  addCollider(worldRect(doorHalf, halfW, halfD - wall, halfD, { height: wallHeight }));
  addCollider(worldRect(-doorHalf, doorHalf, halfD - wall, halfD, { minY: doorHeight - 0.6, maxY: wallHeight + 1, height: wallHeight }));
  addCollider(worldRect(-doorHalf, doorHalf, halfD - wall, halfD, { carOnly: true }));
  if (stairs) {
    // перила лестницы на каждом этаже: на лестницу можно зайти только с торца
    for (let k = 0; k < floors; k += 1) {
      addCollider(worldRect(stairs.sx0 - 0.15, stairs.sx0 + 0.15, stairs.zHigh, stairs.zLow, { minY: k * FLOOR_HEIGHT - 0.3, maxY: k * FLOOR_HEIGHT + 7.7 }));
    }
    addCollider(worldRect(stairs.sx0, stairs.sx1, stairs.zHigh - 0.3, stairs.zHigh, { minY: -1, maxY: 7 }));
    const topK = floors - 1;
    addCollider(worldRect(stairs.sx0, stairs.sx1, stairs.zLow, stairs.zLow + 0.3, { minY: topK * FLOOR_HEIGHT - 0.3, maxY: topK * FLOOR_HEIGHT + 7.7 }));
  }

  const building = {
    name, type, style, x, z, width, depth, facing, floors, stairs,
    groundHeight, enterTop, wallTop: wallHeight,
    doorX: x,
    doorZ: z + facing * (halfD + 4.8),
    inner: { minX: x - innerHalfW, maxX: x + innerHalfW, minZ: z - innerHalfD, maxZ: z + innerHalfD }
  };
  buildings.push(building);

  // мебель: на первом этаже — по типу здания, выше — квартиры
  // в многоэтажке: внизу магазин или холл подъезда, выше — коридоры и квартиры с дверями
  const area = { minX: -innerHalfW, maxX: hasPlan ? stairs.sx0 - 7.7 : stairs ? stairs.sx0 - 1.1 : innerHalfW, minZ: -innerHalfD, maxZ: innerHalfD };
  if (!hasPlan || type !== "residence") furnishInterior(building, group, accentColor, 0, area, type);
  if (!hasPlan) {
    for (let k = 1; k < floors; k += 1) {
      furnishInterior(building, group, INTERIOR_COLORS.residence[2], k, area, "residence");
    }
  }
  building.group = group;
  if (hasPlan) {
    building.backDoorX = backDoorX;
    buildHouseInterior(building, group, options, facadeRows);
  }
  decorateBuilding(building, group, options, facadeRows);
  return building;
}

function addTree(x, z, scale = 1, withPlanter = true) {
  const s = scale;
  if (!withPlanter) {
    forestTreeRandom.value = (forestTreeRandom.value * 1664525 + 1013904223) % 4294967296;
    const random = makeRandom(forestTreeRandom.value);
    plantForestTree(x, z, random() < 0.7 ? "oak" : "birch", s, random);
    return;
  }
  if (withPlanter) {
    const planter = new THREE.Mesh(
      new THREE.CylinderGeometry(1.26, 1.46, 0.6, 10),
      new THREE.MeshStandardMaterial({ color: 0x9c978d, roughness: 0.96 })
    );
    planter.position.set(x, 0.3, z);
    planter.receiveShadow = true;
    cityGroup.add(planter);
  }

  const barkMaterial = new THREE.MeshStandardMaterial({ color: 0x4b3a2c, roughness: 0.96 });
  const lean = (Math.random() - 0.5) * 0.1;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.26 * s, 0.56 * s, 5.2 * s, 9), barkMaterial);
  trunk.position.set(x, 2.6 * s, z);
  trunk.rotation.z = lean;
  trunk.castShadow = true;
  cityGroup.add(trunk);
  // ветки расходятся от ствола к кроне
  for (let i = 0; i < 4; i += 1) {
    const angle = (i / 4) * Math.PI * 2 + Math.random();
    const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.07 * s, 0.17 * s, 2.5 * s, 6), barkMaterial);
    branch.position.set(x + Math.cos(angle) * 0.8 * s, 5.4 * s, z + Math.sin(angle) * 0.8 * s);
    branch.rotation.set(Math.sin(angle) * 0.75, 0, -Math.cos(angle) * 0.75);
    branch.castShadow = true;
    cityGroup.add(branch);
  }

  // тёмные объёмы внутри кроны дают тень, снаружи их закрывает листва
  const crownMaterial = new THREE.MeshStandardMaterial({ color: 0x2f5a2e, roughness: 1 });
  const lumps = [[0, 7.2, 0, 2.9], [-1.5, 6.5, 0.8, 2.1], [1.4, 6.3, -0.8, 2.1], [0.4, 8.6, 0.5, 1.8], [-0.5, 6.1, -1.5, 1.8], [0.7, 6.2, 1.6, 1.7]];
  lumps.forEach(([cx, cy, cz, radius]) => {
    const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(radius * 0.8 * s, 1), crownMaterial);
    crown.position.set(x + cx * s, cy * s, z + cz * s);
    crown.rotation.set(Math.random() * 3, Math.random() * 3, 0);
    crown.scale.y = 0.86;
    crown.castShadow = true;
    cityGroup.add(crown);
    const cards = Math.round(radius * 9);
    for (let i = 0; i < cards; i += 1) {
      const u = Math.random() * 2 - 1;
      const angle = Math.random() * Math.PI * 2;
      const ring = Math.sqrt(1 - u * u);
      const reach = radius * (0.72 + Math.random() * 0.36) * s;
      treeCards.push({
        x: x + cx * s + Math.cos(angle) * ring * reach,
        y: cy * s + u * reach * 0.88,
        z: z + cz * s + Math.sin(angle) * ring * reach,
        size: (2 + Math.random() * 1.4) * s,
        light: Math.min(1, Math.max(0, 0.5 + u * 0.42 + (Math.cos(angle) * 0.5 + Math.sin(angle) * 0.3) * ring * 0.3))
      });
    }
  });
  addCollider({ minX: x - 0.8 * s, maxX: x + 0.8 * s, minZ: z - 0.8 * s, maxZ: z + 0.8 * s });
}

function addPineTree(x, z, scale = 1) {
  forestTreeRandom.value = (forestTreeRandom.value * 1664525 + 1013904223) % 4294967296;
  const random = makeRandom(forestTreeRandom.value);
  plantForestTree(x, z, random() < 0.6 ? "spruce" : "pine", scale, random);
}

// Фонарь с изогнутой «рукой» над дорогой. dirX/dirZ — куда смотрит плафон (в сторону дороги)
function addLamp(x, z, dirX = 0, dirZ = 1, double = false) {
  const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x4a525c, roughness: 0.4, metalness: 0.5 });
  const lightMaterial = new THREE.MeshStandardMaterial({ color: 0xfff3cf, emissive: 0xffd88a, emissiveIntensity: 0.55 });
  lampLightMaterials.push(lightMaterial);
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.rotation.y = Math.atan2(dirX, dirZ);
  cityGroup.add(group);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.42, 0.5, 10), poleMaterial);
  base.position.y = 0.25;
  group.add(base);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.2, 8.4, 8), poleMaterial);
  pole.position.y = 4.2;
  pole.castShadow = true;
  group.add(pole);
  (double ? [1, -1] : [1]).forEach((side) => {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 2.6), poleMaterial);
    arm.position.set(0, 8.25, side * 1.2);
    arm.rotation.x = side * -0.12;
    group.add(arm);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.22, 1.3), poleMaterial);
    head.position.set(0, 8.35, side * 2.5);
    group.add(head);
    const glow = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.06, 1.1), lightMaterial);
    glow.position.set(0, 8.22, side * 2.5);
    group.add(glow);
  });
  addCollider({ minX: x - 0.35, maxX: x + 0.35, minZ: z - 0.35, maxZ: z + 0.35 });
}

function isNearValue(value, targets, threshold) {
  return targets.some((target) => Math.abs(value - target) < threshold);
}

function applyDayNightLighting() {
  const isNight = state.isNight;
  const full = !gfx.low && !gfx.classic;
  scene.background.copy(isNight ? dayNightConfig.nightBackground : dayNightConfig.dayBackground);
  scene.fog.color.copy(isNight ? dayNightConfig.nightFog : dayNightConfig.dayFog);
  hemiLight.intensity = full ? (isNight ? 0.16 : 0.22) : (isNight ? 0.42 : 1.0);
  hemiLight.color.set(isNight ? 0x7a9fd8 : 0xdfeaff);
  hemiLight.groundColor.set(isNight ? 0x13203b : 0x6b6450);
  sun.intensity = full ? (isNight ? 0.2 : 1.55) : (isNight ? 0.22 : 0.95);
  sun.color.set(isNight ? 0x8fa6d8 : 0xfff0da);
  if (gfx.sky) gfx.sky.material.uniforms.night.value = isNight ? 1 : 0;
  if (gfx.envDay) scene.environment = isNight ? gfx.envNight : gfx.envDay;
  flyingCars.forEach((car) => {
    car.mats.body.envMapIntensity = isNight ? 0.14 : 1.05;
    car.mats.glass.envMapIntensity = isNight ? 0.3 : 2.2;
  });

  buildingWindowMaterials.forEach((material) => {
    material.emissiveIntensity = isNight ? 0.82 : (full ? 0.03 : 0.18);
  });
  (facadeMaterials || []).forEach((material) => {
    material.emissiveIntensity = isNight ? 0.9 : 0;
  });

  storefrontGlassMaterials.forEach((material) => {
    material.emissiveIntensity = isNight ? 0.38 : 0.12;
  });

  lampLightMaterials.forEach((material) => {
    material.emissiveIntensity = isNight ? 2.4 : 0.35;
  });

  trafficBulbMaterials.forEach((material) => {
    material.emissiveIntensity = isNight ? 0.85 : 0.24 + (material.emissive.getHex() === 0x4be078 ? 0.36 : 0);
  });

  carLightMaterials.forEach((material) => {
    material.emissiveIntensity = isNight ? 1.6 : 0.3;
  });
}

function updateDayNightCycle(delta) {
  if (state.inHub) {
    return;
  }

  state.dayNightTimer += delta;
  if (state.dayNightTimer < dayNightConfig.phaseDuration) {
    return;
  }

  state.dayNightTimer = 0;
  state.isNight = !state.isNight;
  applyDayNightLighting();
}

// Старые «ватные» облака больше не нужны: настоящие рисует небо
function addCloud() {
  return null;
}

// ---------- Карта мира ----------
// Город ±240, трасса М1 на юге, посёлок на западе, городок на востоке, лесопарк с озером на севере,
// по краям — горы. Всё, что рисуется на мини-карте, записывается сюда.
const CITY_HALF = 212; // внешний край крайних улиц города
const CITY_ROAD_LINES = [-200, -120, -40, 40, 120, 200];
const HIGHWAY_Z = 330;
const HIGHWAY_WIDTH = 32;
const MOUNTAIN_START = 612;
const mapAreas = [];
const mapLabels = [];
const mapIcons = [];
const worldAnimations = [];
const dealershipDisplays = [];
const ownedCarSpots = [];

// Детерминированный «случайный» генератор: мир каждый раз одинаковый
function makeRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- Ускорение отрисовки ----------
// Сотни одинаковых деталей (стены, окна, деревья) склеиваются в несколько больших мешей.
function materialKey(material) {
  return [
    material.type,
    material.color ? material.color.getHex() : "",
    material.emissive ? material.emissive.getHex() : "",
    material.emissiveIntensity,
    material.map ? material.map.uuid : "",
    material.transparent,
    material.opacity,
    material.side,
    material.roughness,
    material.metalness,
    material.depthWrite,
    material.polygonOffset,
    material.vertexColors
  ].join("|");
}

function mergeGeometryList(items) {
  let total = 0;
  const prepared = items.map(({ geometry, matrix }) => {
    const copy = geometry.index ? geometry.toNonIndexed() : geometry.clone();
    copy.applyMatrix4(matrix);
    total += copy.attributes.position.count;
    return copy;
  });
  const positions = new Float32Array(total * 3);
  const normals = new Float32Array(total * 3);
  const uvs = new Float32Array(total * 2);
  const withColor = items.some((item) => item.color);
  const colors = withColor ? new Float32Array(total * 3) : null;
  let offset = 0;
  prepared.forEach((copy, index) => {
    const count = copy.attributes.position.count;
    positions.set(copy.attributes.position.array, offset * 3);
    if (copy.attributes.normal) normals.set(copy.attributes.normal.array, offset * 3);
    if (copy.attributes.uv) uvs.set(copy.attributes.uv.array, offset * 2);
    if (colors) {
      const c = items[index].color || { r: 1, g: 1, b: 1 };
      for (let k = 0; k < count; k += 1) {
        const p = (offset + k) * 3;
        colors[p] = c.r;
        colors[p + 1] = c.g;
        colors[p + 2] = c.b;
      }
    }
    offset += count;
    copy.dispose();
  });
  const merged = new THREE.BufferGeometry();
  merged.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  merged.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
  merged.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  if (colors) merged.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  merged.computeBoundingSphere();
  merged.computeBoundingBox();
  return merged;
}

// colorMerge: детали одного вида, но разных цветов склеиваются в один меш, цвет хранится в вершинах.
// Так сотни разноцветных стен, мебели и балконов рисуются за несколько вызовов
function mergeStaticMeshes(root, chunkSize = Infinity, colorMerge = false) {
  root.updateMatrixWorld(true);
  const inverseRoot = new THREE.Matrix4().copy(root.matrixWorld).invert();
  const buckets = new Map();
  const position = new THREE.Vector3();
  const live = colorMerge
    ? new Set([...lampLightMaterials, ...buildingWindowMaterials, ...storefrontGlassMaterials, ...carLightMaterials, ...trafficBulbMaterials, ...(facadeMaterials || [])])
    : null;
  const paintable = (m) => colorMerge && m.type === "MeshStandardMaterial" && !m.map && !m.vertexColors && !m.userData.ownShader
    && !live.has(m) && m.emissive && m.emissive.getHex() === 0;

  const collect = (object) => {
    if (object !== root && object.userData.dynamic) {
      return;
    }
    object.children.slice().forEach(collect);
    if (!object.isMesh || object.isInstancedMesh || !object.visible || object.userData.keepSeparate || Array.isArray(object.material)) {
      return;
    }
    const matrix = new THREE.Matrix4().multiplyMatrices(inverseRoot, object.matrixWorld);
    position.setFromMatrixPosition(matrix);
    // то, что отбрасывает тень, режем мельче: в расчёт тени попадают только куски рядом с игроком
    const size = colorMerge && object.castShadow ? Math.min(chunkSize, 110) : chunkSize;
    const chunk = Number.isFinite(size) ? `${Math.floor(position.x / size)},${Math.floor(position.z / size)}` : "all";
    const m = object.material;
    const vc = paintable(m);
    const style = vc ? `vc|${m.roughness}|${m.metalness}|${m.transparent}|${m.opacity}|${m.side}|${m.depthWrite}|${m.polygonOffset}|${m.flatShading}` : materialKey(m);
    const key = `${style}|cs${object.castShadow ? 1 : 0}#${chunk}`;
    let bucket = buckets.get(key);
    if (!bucket) {
      let material = m;
      if (vc) {
        if (!mergeVertexMaterials.has(style)) {
          mergeVertexMaterials.set(style, new THREE.MeshStandardMaterial({
            color: 0xffffff, vertexColors: true, roughness: m.roughness, metalness: m.metalness, transparent: m.transparent,
            opacity: m.opacity, side: m.side, depthWrite: m.depthWrite, flatShading: m.flatShading,
            polygonOffset: m.polygonOffset, polygonOffsetFactor: m.polygonOffsetFactor, polygonOffsetUnits: m.polygonOffsetUnits
          }));
        }
        material = mergeVertexMaterials.get(style);
      }
      bucket = { material, items: [], castShadow: false, receiveShadow: false };
      buckets.set(key, bucket);
    }
    bucket.items.push({ geometry: object.geometry, matrix, color: vc ? m.color : null });
    bucket.castShadow = bucket.castShadow || object.castShadow;
    bucket.receiveShadow = bucket.receiveShadow || object.receiveShadow;
    object.parent.remove(object);
  };
  collect(root);

  // убираем опустевшие группы, чтобы движку было меньше обходить
  const prune = (object) => {
    object.children.slice().forEach(prune);
    if (object !== root && object.type === "Group" && !object.userData.dynamic && object.children.length === 0) {
      object.parent.remove(object);
    }
  };
  prune(root);

  buckets.forEach((bucket) => {
    const mesh = new THREE.Mesh(mergeGeometryList(bucket.items), bucket.material);
    mesh.castShadow = bucket.castShadow;
    mesh.receiveShadow = bucket.receiveShadow;
    root.add(mesh);
  });
}

// ---------- Препятствия: сетка ячеек, чтобы быстро находить ближайшие ----------
const COLLIDER_CELL = 32;
const colliderGrid = new Map();
let colliderQueryStamp = 0;

function addCollider(box) {
  blocks.push(box);
  box.stamp = 0;
  const x0 = Math.floor(box.minX / COLLIDER_CELL);
  const x1 = Math.floor(box.maxX / COLLIDER_CELL);
  const z0 = Math.floor(box.minZ / COLLIDER_CELL);
  const z1 = Math.floor(box.maxZ / COLLIDER_CELL);
  for (let cx = x0; cx <= x1; cx += 1) {
    for (let cz = z0; cz <= z1; cz += 1) {
      const key = `${cx},${cz}`;
      if (!colliderGrid.has(key)) {
        colliderGrid.set(key, []);
      }
      colliderGrid.get(key).push(box);
    }
  }
  return box;
}

function queryColliders(x, z, radius) {
  colliderQueryStamp += 1;
  const result = [];
  const x0 = Math.floor((x - radius) / COLLIDER_CELL);
  const x1 = Math.floor((x + radius) / COLLIDER_CELL);
  const z0 = Math.floor((z - radius) / COLLIDER_CELL);
  const z1 = Math.floor((z + radius) / COLLIDER_CELL);
  for (let cx = x0; cx <= x1; cx += 1) {
    for (let cz = z0; cz <= z1; cz += 1) {
      const cell = colliderGrid.get(`${cx},${cz}`);
      if (!cell) continue;
      for (const box of cell) {
        if (box.stamp !== colliderQueryStamp) {
          box.stamp = colliderQueryStamp;
          result.push(box);
        }
      }
    }
  }
  return result;
}

// ---------- Мелкие помощники для мира ----------
function addStaticBox(w, h, d, x, y, z, material, options = {}) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = options.castShadow !== false;
  mesh.receiveShadow = true;
  if (options.rotationY) mesh.rotation.y = options.rotationY;
  (options.parent || cityGroup).add(mesh);
  if (options.collider) {
    addCollider({ minX: x - w / 2, maxX: x + w / 2, minZ: z - d / 2, maxZ: z + d / 2, height: options.cameraBlock ? y + h / 2 : undefined });
  }
  return mesh;
}

function addRoadSign(text, x, z, rotationY = 0, color = "#1f6f3f", width = 9) {
  const group = new THREE.Group();
  const postMaterial = new THREE.MeshStandardMaterial({ color: 0x8c949e, roughness: 0.4, metalness: 0.6 });
  [-width / 2 + 0.6, width / 2 - 0.6].forEach((px) => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 6, 8), postMaterial);
    post.position.set(px, 3, 0);
    group.add(post);
  });
  const board = new THREE.Mesh(
    new THREE.BoxGeometry(width, 2.2, 0.2),
    new THREE.MeshStandardMaterial({ color: 0xffffff, map: createLabelTexture(text, color, "#ffffff"), roughness: 0.5 })
  );
  board.position.y = 5.4;
  group.add(board);
  group.position.set(x, 0, z);
  group.rotation.y = rotationY;
  cityGroup.add(group);
}

function addWalkwayRect(cx, cz, width, depth) {
  getStreetMaterials();
  const geometry = new THREE.BoxGeometry(width, 0.04, depth);
  scaleBoxUv(geometry, width / 3, depth / 3);
  const mesh = new THREE.Mesh(geometry, paverMaterial);
  mesh.position.set(cx, 0.02, cz);
  mesh.receiveShadow = true;
  cityGroup.add(mesh);
}

function addWalkway(x, fromZ, toZ, width = 4) {
  const length = toZ - fromZ;
  if (length > 0.5) {
    addWalkwayRect(x, fromZ + length / 2, width, length);
  }
}

// Простая дорога с разметкой (для посёлка, городка, съездов)
function addSimpleRoad(alongX, fixed, from, to, width = 16) {
  const length = to - from;
  const center = (from + to) / 2;
  if (alongX) {
    addRoadSurface(center, fixed, length, width);
  } else {
    addRoadSurface(fixed, center, width, length);
  }
  const put = (color, offset, lineWidth) => {
    if (alongX) addMarkingRect(color, center, fixed + offset, length, lineWidth);
    else addMarkingRect(color, fixed + offset, center, lineWidth, length);
  };
  put("yellow", -0.25, 0.18);
  put("yellow", 0.25, 0.18);
  put("white", -(width / 2 - 0.7), 0.2);
  put("white", width / 2 - 0.7, 0.2);
}

// Озеро: впадина с песчаным дном, прозрачная вода с волнами и рыбы
function addWater(x, z, radius) {
  const lake = { x, z, r: radius, depth: Math.min(7, 1.8 + radius * 0.09) };
  lakes.push(lake);
  const shore = new THREE.Mesh(new THREE.RingGeometry(radius - 0.6, radius + 5, 72, 1), new THREE.MeshStandardMaterial({ color: 0xd9c79a, roughness: 1 }));
  shore.rotation.x = -Math.PI / 2;
  shore.position.set(x, 0.03, z);
  shore.receiveShadow = true;
  cityGroup.add(shore);

  // дно: от светлого песка у берега к тёмному илу в глубине, с камушками
  const rings = 18;
  const segments = 72;
  const positions = [];
  const colors = [];
  const indices = [];
  const sand = new THREE.Color(0xd2bf8e);
  const mid = new THREE.Color(0x8f8460);
  const mud = new THREE.Color(0x46432f);
  const color = new THREE.Color();
  for (let ring = 0; ring <= rings; ring += 1) {
    const t = ring / rings;
    for (let s = 0; s <= segments; s += 1) {
      const angle = (s / segments) * Math.PI * 2;
      const r = t * (radius + 0.5);
      const px = Math.cos(angle) * r;
      const pz = Math.sin(angle) * r;
      const depth = t < 1 ? -lake.depth * Math.pow(1 - Math.min(1, t * t), 0.7) : 0;
      positions.push(px, depth + 0.02, pz);
      const shade = 0.85 + Math.random() * 0.25;
      color.copy(t > 0.6 ? mid.clone().lerp(sand, (t - 0.6) / 0.4) : mud.clone().lerp(mid, t / 0.6)).multiplyScalar(shade);
      colors.push(color.r, color.g, color.b);
      if (ring > 0 && s > 0) {
        const a = (ring - 1) * (segments + 1) + s - 1;
        const b = a + 1;
        const c = a + segments + 1;
        const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }
  }
  const bedGeometry = new THREE.BufferGeometry();
  bedGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  bedGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  bedGeometry.setIndex(indices);
  bedGeometry.computeVertexNormals();
  const bed = new THREE.Mesh(bedGeometry, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }));
  bed.position.set(x, 0, z);
  bed.receiveShadow = true;
  bed.userData.keepSeparate = true;
  cityGroup.add(bed);
  // водоросли и камни на дне
  for (let i = 0; i < radius * 0.8; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * radius * 0.85;
    const px = x + Math.cos(angle) * r;
    const pz = z + Math.sin(angle) * r;
    const y = lakeCarve(px, pz);
    if (Math.random() < 0.5) {
      forestPut("rock", px, y + 0.1, pz, 0.4 + Math.random() * 0.6, 0.3, 0.5 + Math.random() * 0.5, 0x6f6a5c, Math.random(), Math.random() * 3, 0);
    } else {
      for (let k = 0; k < 4; k += 1) {
        forestPut("blade", px + (Math.random() - 0.5) * 0.8, y, pz + (Math.random() - 0.5) * 0.8, 2, 1.2 + Math.random() * 1.6, 2, 0x3f7a4a, (Math.random() - 0.5) * 0.4, 0, (Math.random() - 0.5) * 0.4);
      }
    }
  }

  const water = new THREE.Mesh(new THREE.CircleGeometry(radius + 0.6, 96), makeWaterMaterial(lake));
  water.rotation.x = -Math.PI / 2;
  water.position.set(x, WATER_LEVEL, z);
  water.renderOrder = 5;
  water.userData.keepSeparate = true;
  cityGroup.add(water);
  addFish(lake, Math.round(THREE.MathUtils.clamp(radius / 4, 4, 14)));
  mapAreas.push({ type: "water", x, z, r: radius });
}

function addField(x, z, width, depth, color, rowColor) {
  const type = color === 0xd9b44a ? "wheat" : color === 0x6f8f2e ? "sunflower" : "green";
  const image = document.createElement("canvas");
  image.width = 64;
  image.height = 64;
  const g = image.getContext("2d");
  g.fillStyle = type === "wheat" ? "#b8963e" : "#6b4f33";
  g.fillRect(0, 0, 64, 64);
  g.fillStyle = type === "wheat" ? "rgba(120,90,40,0.5)" : "rgba(60,40,25,0.6)";
  g.fillRect(0, 0, 18, 64);
  for (let i = 0; i < 200; i += 1) {
    g.fillStyle = `rgba(${Math.random() < 0.5 ? "40,30,20" : "160,130,90"},0.3)`;
    g.fillRect(Math.random() * 64, Math.random() * 64, 2, 2);
  }
  const texture = new THREE.CanvasTexture(image);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(width / 2.2, depth / 8);
  const field = new THREE.Mesh(new THREE.BoxGeometry(width, 0.08, depth), new THREE.MeshStandardMaterial({ map: texture, roughness: 1 }));
  field.position.set(x, 0.04, z);
  field.receiveShadow = true;
  cityGroup.add(field);
  const random = makeRandom(Math.round(Math.abs(x * 13 + z * 7)));
  const sunYaw = Math.atan2(SUN_OFFSET.x, SUN_OFFSET.z);
  if (type === "wheat") {
    for (let px = -width / 2 + 0.8; px < width / 2 - 0.5; px += 1.15) {
      for (let pz = -depth / 2 + 0.8; pz < depth / 2 - 0.5; pz += 1.05) {
        const tone = new THREE.Color(0xd9b44a).offsetHSL((random() - 0.5) * 0.03, 0, (random() - 0.5) * 0.12);
        getCropKind("wheat").items.push({ x: x + px + (random() - 0.5) * 0.5, y: 0.08, z: z + pz + (random() - 0.5) * 0.5, yaw: random() * 6.28, s: 0.85 + random() * 0.3, color: tone.getHex() });
      }
    }
  } else if (type === "sunflower") {
    for (let px = -width / 2 + 1.2; px < width / 2 - 1; px += 2.1) {
      for (let pz = -depth / 2 + 1.2; pz < depth / 2 - 1; pz += 1.8) {
        const fx = x + px + (random() - 0.5) * 0.4;
        const fz = z + pz + (random() - 0.5) * 0.4;
        const s = 0.85 + random() * 0.35;
        getCropKind("stem").items.push({ x: fx, y: 0.08, z: fz, yaw: random() * 6.28, s, color: 0x5f8f2e });
        const headYaw = sunYaw + (random() - 0.5) * 0.4;
        getCropKind("petals").items.push({ x: fx + Math.sin(headYaw) * 0.12, y: 3.45 * s, z: fz + Math.cos(headYaw) * 0.12, yaw: headYaw, s, color: 0xf2c230, tilt: -0.35 });
        getCropKind("seeds").items.push({ x: fx + Math.sin(headYaw) * 0.16, y: 3.45 * s, z: fz + Math.cos(headYaw) * 0.16, yaw: headYaw, s, color: 0x5a3a1c, tilt: -0.35 });
      }
    }
  } else {
    for (let px = -width / 2 + 1.5; px < width / 2 - 1; px += 3) {
      for (let pz = -depth / 2 + 1; pz < depth / 2 - 0.5; pz += 1.3) {
        const tone = new THREE.Color(rowColor).offsetHSL((random() - 0.5) * 0.04, 0, (random() - 0.5) * 0.12);
        getCropKind("leafy").items.push({ x: x + px + (random() - 0.5) * 0.3, y: 0.35, z: z + pz, yaw: random() * 6.28, s: 0.8 + random() * 0.4, color: tone.getHex() });
      }
    }
  }
  mapAreas.push({ type: "field", x, z, w: width, d: depth });
}

function addBench(x, z, rotationY = 0) {
  const wood = getWoodMaterial();
  if (!woodState.metal) woodState.metal = new THREE.MeshStandardMaterial({ color: 0x3a3f46, roughness: 0.5, metalness: 0.4 });
  const metal = woodState.metal;
  const group = new THREE.Group();
  const add = (w, h, d, px, py, pz, material, rx = 0) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(px, py, pz);
    mesh.rotation.x = rx;
    mesh.castShadow = true;
    group.add(mesh);
  };
  [-0.36, 0, 0.36].forEach((bz) => add(3.4, 0.1, 0.3, 0, 1.0, bz, wood));
  [1.5, 1.92].forEach((by) => add(3.4, 0.26, 0.08, 0, by, -0.56 + (by - 1.5) * -0.1, wood, -0.12));
  [-1.4, 1.4].forEach((lx) => {
    add(0.12, 1.0, 0.12, lx, 0.5, 0.42, metal);
    add(0.12, 2.15, 0.12, lx, 1.07, -0.52, metal, -0.06);
    add(0.12, 0.08, 1.05, lx, 1.36, -0.02, metal);
    add(0.12, 0.08, 1.0, lx, 0.92, -0.05, metal);
  });
  group.position.set(x, 0, z);
  group.rotation.y = rotationY;
  cityGroup.add(group);
}

function addFence(x1, z1, x2, z2, color = 0xf3efe6) {
  const material = new THREE.MeshStandardMaterial({ color, roughness: 0.85 });
  const length = Math.hypot(x2 - x1, z2 - z1);
  const angle = Math.atan2(z2 - z1, x2 - x1);
  const cx = (x1 + x2) / 2;
  const cz = (z1 + z2) / 2;
  [0.6, 1.3].forEach((y) => {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(length, 0.14, 0.1), material);
    rail.position.set(cx, y, cz);
    rail.rotation.y = -angle;
    cityGroup.add(rail);
  });
  const posts = Math.max(2, Math.round(length / 1.6));
  for (let i = 0; i <= posts; i += 1) {
    const t = i / posts;
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.6, 0.22), material);
    post.position.set(x1 + (x2 - x1) * t, 0.8, z1 + (z2 - z1) * t);
    cityGroup.add(post);
  }
  addCollider({ minX: Math.min(x1, x2) - 0.2, maxX: Math.max(x1, x2) + 0.2, minZ: Math.min(z1, z2) - 0.2, maxZ: Math.max(z1, z2) + 0.2 });
}

function mountainHeight(x, z) {
  const outside = distanceOutsideMain(x, z) + 8;
  if (outside <= 0) {
    return 0;
  }
  const t = Math.min(1, outside / 230);
  const ridge = 0.55 + 0.45 * (Math.sin(x * 0.021 + Math.cos(z * 0.017) * 2) * Math.cos(z * 0.019 - x * 0.007) * 0.5 + 0.5);
  const detail = Math.sin(x * 0.07 + z * 0.05) * 0.08 + Math.sin(z * 0.09 - x * 0.03) * 0.06;
  let h = Math.pow(t, 1.2) * 230 * (ridge + detail);
  // долина за тоннелем: внутри ровно, по краям снова горы
  const valleyEdge = Math.hypot(x - VALLEY.x, z - VALLEY.z) - VALLEY.r;
  if (valleyEdge < 80) {
    h *= THREE.MathUtils.smoothstep(valleyEdge, 0, 80);
  }
  // ущелье, по которому идёт тоннель
  if (x > TUNNEL.x0 - 40 && x < TUNNEL.x1 + 40) {
    h *= THREE.MathUtils.smoothstep(Math.abs(z - TUNNEL.z), 20, 46);
  }
  return h;
}

function buildTerrain() {
  const size = 2400;
  const segments = 240;
  const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
  geometry.rotateX(-Math.PI / 2);
  const positions = geometry.attributes.position;
  const colors = new Float32Array(positions.count * 3);
  const grass = new THREE.Color(0x6fae58);
  const dryGrass = new THREE.Color(0x9cbf5e);
  const lushGrass = new THREE.Color(0x579a46);
  const forest = new THREE.Color(0x4f7f45);
  const rock = new THREE.Color(0x857b6e);
  const snow = new THREE.Color(0xf2f5f8);
  const color = new THREE.Color();
  for (let i = 0; i < positions.count; i += 1) {
    const x = positions.getX(i);
    const z = positions.getZ(i);
    const h = mountainHeight(x, z);
    positions.setY(i, h);
    const jitter = Math.sin(x * 0.3) * Math.cos(z * 0.27) * 6;
    // луг неровный: где-то трава суше и светлее, где-то сочнее
    const patch = Math.sin(x * 0.021 + 0.7) * Math.cos(z * 0.018 + 1.9) + 0.6 * Math.sin(x * 0.057 - z * 0.049 + 0.3) + 0.35 * Math.sin(x * 0.13 + z * 0.11);
    color.copy(grass);
    if (patch > 0.3) color.lerp(dryGrass, Math.min(0.55, (patch - 0.3) * 0.6));
    else if (patch < -0.4) color.lerp(lushGrass, Math.min(0.6, (-patch - 0.4) * 0.7));
    if (h < 6) {
      // уже готово
    } else if (h < 50 + jitter) color.lerp(forest, Math.min(1, (h - 6) / 30));
    else if (h < 125 + jitter * 2) color.copy(forest).lerp(rock, Math.min(1, (h - 50) / 35));
    else color.copy(rock).lerp(snow, Math.min(1, (h - 125) / 25));
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  const terrain = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, map: getGrassDetailTexture() }));
  terrain.receiveShadow = true;
  terrain.userData.keepSeparate = true;
  cityGroup.add(terrain);
  reliefState.terrain = terrain;
}

function addTunnelPortal(x, z, facingX) {
  const concrete = new THREE.MeshStandardMaterial({ color: 0x9a968e, roughness: 0.9 });
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.rotation.y = facingX > 0 ? -Math.PI / 2 : Math.PI / 2;
  cityGroup.add(group);
  [-(HIGHWAY_WIDTH / 2 + 2), HIGHWAY_WIDTH / 2 + 2].forEach((px) => {
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(4, 18, 5), concrete);
    pillar.position.set(px, 9, 0);
    group.add(pillar);
  });
  const top = new THREE.Mesh(new THREE.BoxGeometry(HIGHWAY_WIDTH + 8, 5, 5), concrete);
  top.position.set(0, 17.5, 0);
  group.add(top);
  const sign = new THREE.Mesh(new THREE.BoxGeometry(14, 2.4, 0.3), new THREE.MeshStandardMaterial({ color: 0xffffff, map: createLabelTexture(facingX > 0 ? "Тоннель → Горный" : "← Город", "#1f6f3f", "#ffffff") }));
  sign.position.set(0, 17.5, 2.7);
  group.add(sign);
}

// Трасса М1: начинается у посёлка и уходит в тоннель к горному городку
function buildHighway() {
  const z = HIGHWAY_Z;
  const half = HIGHWAY_WIDTH / 2;
  const from = -432;
  const to = TUNNEL.x0;
  const length = to - from;
  addRoadSurface((from + to) / 2, z, length, HIGHWAY_WIDTH);
  [-1, 1].forEach((side) => {
    addMarkingRect("white", (from + to) / 2, z + side * (half - 0.8), length, 0.3);
    addMarkingRect("yellow", (from + to) / 2, z + side * 2.3, length, 0.25);
    for (let x = from + 4; x < to - 4; x += 12) {
      addMarkingRect("white", x + 2.5, z + side * 9, 5, 0.25);
    }
  });

  const gaps = [-420, 40, 150, 300, 430].map((gx) => [gx - 16, gx + 16]);
  const barrierMaterial = new THREE.MeshStandardMaterial({ color: 0xd6d3cc, roughness: 0.8 });
  let cursor = from + 20;
  [...gaps.filter(([a]) => a > from + 20), [to - 10, to - 10]].forEach(([gapStart, gapEnd]) => {
    const segmentLength = gapStart - cursor;
    if (segmentLength > 1) {
      addStaticBox(segmentLength, 1.0, 0.8, cursor + segmentLength / 2, 0.5, z, barrierMaterial, { collider: true });
    }
    cursor = gapEnd;
  });

  const railMaterial = new THREE.MeshStandardMaterial({ color: 0xb8bec6, roughness: 0.35, metalness: 0.7 });
  const addRail = (x1, x2, rz) => {
    if (x2 - x1 < 2) return;
    addStaticBox(x2 - x1, 0.35, 0.2, (x1 + x2) / 2, 0.9, rz, railMaterial, { collider: true, castShadow: false });
    for (let px = x1; px <= x2; px += 6) {
      addStaticBox(0.2, 0.9, 0.2, px, 0.45, rz, railMaterial, { castShadow: false });
    }
  };
  // с запада трасса упирается в дорогу посёлка (Т-образный перекрёсток), там отбойник
  addStaticBox(0.4, 0.9, HIGHWAY_WIDTH, from - 0.2, 0.45, z, railMaterial, { collider: true });
  addRail(from, to, z + half + 0.6);
  const northGaps = [[-432, -408], [24, 56], [56, 244], [272, 328], [418, 442]];
  cursor = from;
  [...northGaps, [to, to]].forEach(([gapStart, gapEnd]) => {
    addRail(cursor, gapStart, z - half - 0.6);
    cursor = gapEnd;
  });

  for (let x = from + 40; x < to - 20; x += 70) {
    if (gaps.some(([a, b]) => x > a - 4 && x < b + 4)) continue;
    addLamp(x, z, 0, 1, true);
  }
  addRoadSign("← Посёлок · Город →", -300, z - half - 6, 0, "#1f6f3f", 14);
  addRoadSign("Горный → тоннель", 480, z - half - 6, 0, "#1f6f3f", 12);
  mapLabels.push({ text: "Трасса М1", x: -150, z: z + 30, size: 13 });
}

// ---------- Центральный парк: фонтан и колесо обозрения ----------
function buildCentralPark() {
  const parkHalf = 23;
  mapAreas.push({ type: "park", x: 0, z: 0, w: parkHalf * 2, d: parkHalf * 2 });
  mapLabels.push({ text: "Центральный парк", x: 0, z: 2, size: 11 });
  mapIcons.push({ icon: "🎡", x: 0, z: -12 });
  addWalkwayRect(0, 0, parkHalf * 2, 4);
  addWalkwayRect(0, 0, 4, parkHalf * 2);

  // фонтан
  const stone = new THREE.MeshStandardMaterial({ color: 0xd8d2c6, roughness: 0.8 });
  const waterMaterial = new THREE.MeshStandardMaterial({ color: 0x55aee0, roughness: 0.1, metalness: 0.2, transparent: true, opacity: 0.85 });
  const basin = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 4.9, 1, 28), stone);
  basin.position.set(0, 0.5, 10);
  cityGroup.add(basin);
  const pool = new THREE.Mesh(new THREE.CylinderGeometry(4.1, 4.1, 0.2, 28), waterMaterial);
  pool.position.set(0, 0.95, 10);
  cityGroup.add(pool);
  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 3, 12), stone);
  column.position.set(0, 2, 10);
  cityGroup.add(column);
  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 0.6, 0.6, 18), stone);
  bowl.position.set(0, 3.6, 10);
  cityGroup.add(bowl);
  const spray = new THREE.Mesh(new THREE.ConeGeometry(1.2, 2.6, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0xbfe6ff, transparent: true, opacity: 0.55, depthWrite: false }));
  spray.position.set(0, 5.1, 10);
  spray.rotation.x = Math.PI;
  spray.userData.dynamic = true;
  cityGroup.add(spray);
  worldAnimations.push((delta, time) => {
    spray.scale.y = 1 + Math.sin(time * 6) * 0.12;
    spray.rotation.y += delta * 0.8;
  });
  addCollider({ minX: -4.8, maxX: 4.8, minZ: 5.2, maxZ: 14.8 });

  // колесо обозрения
  const wheelX = 0;
  const wheelZ = -12;
  const axleY = 11.5;
  const radius = 9;
  const frameMaterial = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.4, metalness: 0.4 });
  [-1.8, 1.8].forEach((dz) => {
    [-1, 1].forEach((side) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.5, axleY + 1.5, 0.5), frameMaterial);
      leg.position.set(wheelX + side * 3.4, axleY / 2, wheelZ + dz);
      leg.rotation.z = side * 0.28;
      cityGroup.add(leg);
    });
  });
  const wheel = new THREE.Group();
  wheel.position.set(wheelX, axleY, wheelZ);
  wheel.userData.dynamic = true;
  cityGroup.add(wheel);
  const rimMaterial = new THREE.MeshStandardMaterial({ color: 0xff5d8f, roughness: 0.4, emissive: 0x401020 });
  [-1.1, 1.1].forEach((dz) => {
    const rim = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.22, 8, 48), rimMaterial);
    rim.position.z = dz;
    wheel.add(rim);
  });
  const cabins = [];
  const cabinColors = [0xff6b6b, 0x4dabf7, 0xffd43b, 0x69db7c, 0xb197fc, 0xffa94d];
  for (let i = 0; i < 12; i += 1) {
    const angle = (i / 12) * Math.PI * 2;
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(radius, 0.14, 0.14), frameMaterial);
    spoke.position.set(Math.cos(angle) * radius / 2, Math.sin(angle) * radius / 2, 0);
    spoke.rotation.z = angle;
    wheel.add(spoke);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.6, 1.6), new THREE.MeshStandardMaterial({ color: cabinColors[i % cabinColors.length], roughness: 0.5 }));
    cabin.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius - 1, 0);
    wheel.add(cabin);
    cabins.push(cabin);
  }
  worldAnimations.push((delta) => {
    wheel.rotation.z += delta * 0.12;
    cabins.forEach((cabin) => {
      cabin.rotation.z = -wheel.rotation.z; // кабинки всегда висят ровно
    });
  });
  addCollider({ minX: -4.5, maxX: 4.5, minZ: wheelZ - 2.4, maxZ: wheelZ + 2.4 });

  // скамейки, клумбы, деревья
  [[-8, 3.5, 0], [8, 3.5, 0], [-8, -3.5, Math.PI], [8, -3.5, Math.PI]].forEach(([bx, bz, r]) => addBench(bx, bz, r));
  const flowerColors = [0xff6b9a, 0xffd43b, 0xb197fc];
  [[-14, 14], [14, 14], [-14, -16], [14, -16]].forEach(([fx, fz], index) => {
    const bed = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.8, 0.5, 18), new THREE.MeshStandardMaterial({ color: 0x6b4a32, roughness: 1 }));
    bed.position.set(fx, 0.25, fz);
    cityGroup.add(bed);
    const flowers = new THREE.Mesh(new THREE.SphereGeometry(2.3, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: flowerColors[index % 3], roughness: 0.9 }));
    flowers.position.set(fx, 0.5, fz);
    flowers.scale.y = 0.4;
    cityGroup.add(flowers);
  });
  [[-19, 19], [19, 19], [-19, -19], [19, -19], [-19, 0], [19, 0]].forEach(([tx, tz]) => addTree(tx, tz, 0.9, false));
}

// ---------- Посёлок Берёзовка ----------
function buildVillage() {
  const streetZ = 200;
  const villageRoadX = -420;
  addSimpleRoad(false, villageRoadX, 100, HIGHWAY_Z - HIGHWAY_WIDTH / 2, 16);
  addSimpleRoad(true, streetZ, -570, villageRoadX - 8, 14);
  addSimpleRoad(true, streetZ, villageRoadX + 8, -270, 14);
  mapLabels.push({ text: "Посёлок Берёзовка", x: -420, z: 255, size: 13 });
  addRoadSign("Посёлок Берёзовка", villageRoadX + 12, HIGHWAY_Z - 32, Math.PI / 2, "#2d5a8c", 12);

  const palette = [
    [0xf3e3c3, 0xb4492f], [0xd9ecf2, 0x5a6f8a], [0xf6d6d6, 0x8a3b3b], [0xe2efd9, 0x4c6b3a], [0xfff1b8, 0x9a5b2a], [0xe8dcf0, 0x6a4c86]
  ];
  const xs = [-545, -505, -465, -375, -335, -295];
  let index = 0;
  [[-1, 178, 1], [1, 222, -1]].forEach(([, zc, facing]) => {
    xs.forEach((x) => {
      const [body, roof] = palette[index % palette.length];
      const isShop = index === 4;
      addBuilding({
        x, z: zc, width: 16, depth: 14, height: 7,
        bodyColor: body, roofColor: roof, windowColor: 0xfff5cc,
        name: isShop ? "Сельпо" : `Дом ${index + 1}`,
        signColor: "#7a3b1e",
        style: "cottage",
        facing,
        showSign: isShop,
        type: isShop ? "market" : "residence"
      });
      // заборчик вокруг участка с калиткой
      const front = zc + facing * 7;
      const yardEdge = front + facing * 7;
      const back = zc - facing * 13;
      addFence(x - 11, yardEdge, x - 3, yardEdge);
      addFence(x + 3, yardEdge, x + 11, yardEdge);
      addFence(x - 11, back, x + 11, back);
      addFence(x - 11, back, x - 11, yardEdge);
      addFence(x + 11, back, x + 11, yardEdge);
      addWalkway(x, Math.min(front + facing * 3.4, yardEdge), Math.max(front + facing * 3.4, yardEdge), 2.6);
      // грядки на заднем дворе
      const bedZ = zc - facing * 10.5;
      const bed = new THREE.Mesh(new THREE.BoxGeometry(8, 0.4, 2.2), new THREE.MeshStandardMaterial({ color: 0x6b4a32, roughness: 1 }));
      bed.position.set(x - 3, 0.2, bedZ);
      cityGroup.add(bed);
      addTree(x + 7, bedZ, 0.75, false);
      addCottageYard(x, zc, facing);
      index += 1;
    });
  });

  // поля, мельница, пруд
  addField(-480, 70, 70, 44, 0xd9b44a, 0xc29a2e);
  addField(-375, 70, 50, 44, 0x6aa84f, 0x4f8a3a);
  const millX = -545;
  const millZ = 95;
  const millMaterial = new THREE.MeshStandardMaterial({ color: 0xf1ead8, roughness: 0.9 });
  const tower = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 3.6, 14, 14), millMaterial);
  tower.position.set(millX, 7, millZ);
  tower.castShadow = true;
  cityGroup.add(tower);
  const cap = new THREE.Mesh(new THREE.ConeGeometry(2.8, 3, 14), new THREE.MeshStandardMaterial({ color: 0x8a3b2e, roughness: 0.8 }));
  cap.position.set(millX, 15.5, millZ);
  cityGroup.add(cap);
  const blades = new THREE.Group();
  blades.position.set(millX, 13, millZ + 3.1);
  blades.userData.dynamic = true;
  cityGroup.add(blades);
  for (let i = 0; i < 4; i += 1) {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(1.4, 9, 0.15), new THREE.MeshStandardMaterial({ color: 0xe9e1cc, roughness: 0.9 }));
    blade.position.set(0, 4.5, 0);
    const holder = new THREE.Group();
    holder.rotation.z = (i / 4) * Math.PI * 2;
    holder.add(blade);
    blades.add(holder);
  }
  worldAnimations.push((delta) => {
    blades.rotation.z += delta * 0.7;
  });
  addCollider({ minX: millX - 3.6, maxX: millX + 3.6, minZ: millZ - 3.6, maxZ: millZ + 3.6 });
  mapIcons.push({ icon: "🌾", x: millX, z: millZ });

  addWater(-300, 115, 14);
  const random = makeRandom(7);
  for (let i = 0; i < 26; i += 1) {
    const tx = -580 + random() * 320;
    const tz = 245 + random() * 45;
    addTree(tx, tz, 0.8 + random() * 0.4, false);
  }
}

// ---------- Городок Солнечный ----------
function buildTown() {
  const roadX = 430;
  addSimpleRoad(false, roadX, -40, HIGHWAY_Z - HIGHWAY_WIDTH / 2, 16);
  addSimpleRoad(true, 160, 330, roadX - 8, 14);
  addSimpleRoad(true, 160, roadX + 8, 560, 14);
  addSimpleRoad(true, 40, roadX + 8, 560, 14);
  mapLabels.push({ text: "Городок Солнечный", x: 455, z: 100, size: 13 });
  addRoadSign("Городок Солнечный", roadX - 12, HIGHWAY_Z - 32, -Math.PI / 2, "#2d5a8c", 12);

  const shops = [
    ["Солнечный Маркет", "market", 0xf6e7c8, 0xb5643a],
    ["Кафе Уют", "cafe", 0xf3dccf, 0x8a4f3b],
    ["Аптека", "clinic", 0xe2f1f2, 0x3e7f86],
    ["Почта", "office", 0xdfe6f2, 0x3f5a8a],
    ["Дом 7", "residence", 0xe8e0d4, 0x6a5a4a],
    ["Дом 9", "residence", 0xdde9da, 0x4c6b3a],
    ["Пекарня", "cafe", 0xfaf0d8, 0x9a6b2a],
    ["Книжная лавка", "bookstore", 0xe9dfef, 0x5e4a7e]
  ];
  let index = 0;
  [[61.5, -1, 40], [138.5, 1, 160]].forEach(([zc, facing, streetZ]) => {
    [355, 395, 470, 510].forEach((x) => {
      const [name, type, body, roof] = shops[index % shops.length];
      addBuilding({
        x, z: zc, width: 18, depth: 17, height: 16 + (index % 3) * 3,
        bodyColor: body, roofColor: roof, windowColor: 0xfff7e8,
        name, type, signColor: "#334f67", facing
      });
      const front = zc + facing * 8.5;
      const roadEdge = streetZ - facing * 7;
      addWalkway(x, Math.min(front + facing * 3.4, roadEdge), Math.max(front + facing * 3.4, roadEdge), 4);
      index += 1;
    });
  });

  // футбольное поле
  const fieldX = 490;
  const fieldZ = -8;
  const pitch = new THREE.Mesh(new THREE.BoxGeometry(70, 0.06, 42), new THREE.MeshStandardMaterial({ color: 0x4caf50, roughness: 1 }));
  pitch.position.set(fieldX, 0.03, fieldZ);
  pitch.receiveShadow = true;
  cityGroup.add(pitch);
  const lineMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
  [[0, -20.5, 68, 0.3], [0, 20.5, 68, 0.3], [-34, 0, 0.3, 41], [34, 0, 0.3, 41], [0, 0, 0.3, 41]].forEach(([lx, lz, w, d]) => {
    const line = new THREE.Mesh(new THREE.BoxGeometry(w, 0.08, d), lineMaterial);
    line.position.set(fieldX + lx, 0.08, fieldZ + lz);
    cityGroup.add(line);
  });
  const circle = new THREE.Mesh(new THREE.TorusGeometry(6, 0.15, 6, 40), lineMaterial);
  circle.rotation.x = Math.PI / 2;
  circle.position.set(fieldX, 0.1, fieldZ);
  cityGroup.add(circle);
  [-1, 1].forEach((side) => {
    const gx = fieldX + side * 34;
    [[0, 2.4, -3.6, 0.25, 4.8, 0.25], [0, 2.4, 3.6, 0.25, 4.8, 0.25], [0, 4.8, 0, 0.25, 0.25, 7.4]].forEach(([px, py, pz, w, h, d]) => {
      addStaticBox(w, h, d, gx + px, py, fieldZ + pz, lineMaterial, { castShadow: true });
    });
    addCollider({ minX: gx - 0.3, maxX: gx + 0.3, minZ: fieldZ - 3.8, maxZ: fieldZ - 3.4 });
    addCollider({ minX: gx - 0.3, maxX: gx + 0.3, minZ: fieldZ + 3.4, maxZ: fieldZ + 3.8 });
  });
  const standMaterial = new THREE.MeshStandardMaterial({ color: 0x3f6ea8, roughness: 0.7 });
  for (let step = 0; step < 3; step += 1) {
    addStaticBox(60, 0.8, 2, fieldX, 0.4 + step * 0.8, fieldZ - 24 - step * 2, standMaterial, { collider: true });
  }
  mapAreas.push({ type: "park", x: fieldX, z: fieldZ, w: 70, d: 42 });
  mapIcons.push({ icon: "⚽", x: fieldX, z: fieldZ });

  // детская площадка
  const playX = 370;
  const playZ = -5;
  const sand = new THREE.Mesh(new THREE.BoxGeometry(30, 0.08, 24), new THREE.MeshStandardMaterial({ color: 0xe6d29b, roughness: 1 }));
  sand.position.set(playX, 0.04, playZ);
  cityGroup.add(sand);
  const red = new THREE.MeshStandardMaterial({ color: 0xe04848, roughness: 0.5 });
  const blue = new THREE.MeshStandardMaterial({ color: 0x3f7fd6, roughness: 0.5 });
  addStaticBox(3, 4, 3, playX - 8, 2, playZ, blue, { collider: true });
  const slide = addStaticBox(2, 0.3, 7, playX - 8, 2.1, playZ + 4.5, red);
  slide.rotation.x = 0.55;
  [-2, 2].forEach((sx) => {
    const post = addStaticBox(0.3, 6, 0.3, playX + 6 + sx * 2, 3, playZ, blue);
    post.rotation.z = sx * 0.06;
  });
  addStaticBox(9, 0.3, 0.3, playX + 6, 6, playZ, blue);
  [4, 8].forEach((sx) => addStaticBox(1.4, 0.2, 0.8, playX + sx, 1.4, playZ, red));
  [[playX - 12, playZ - 9], [playX + 12, playZ - 9], [playX + 12, playZ + 9]].forEach(([tx, tz]) => addTree(tx, tz, 0.9, false));
  addBench(playX, playZ + 10, Math.PI);
  mapAreas.push({ type: "park", x: playX, z: playZ, w: 30, d: 24 });
}

// ---------- Лесопарк с озером ----------
function buildForestPark() {
  addParkingLot(-40, -350, 60, 22);
  const lakeX = -40;
  const lakeZ = -450;
  const lakeR = 55;
  addWater(lakeX, lakeZ, lakeR);
  mapLabels.push({ text: "Лесопарк", x: -40, z: -380, size: 12 });
  mapIcons.push({ icon: "🎣", x: lakeX + 12, z: lakeZ + lakeR - 6 });
  addRoadSign("Лесопарк", -24, -335, 0, "#1f6f3f", 8);

  // деревянные мостки с перилами из верёвки и лодка рядом
  addWoodDeck(lakeX + 12, lakeZ + lakeR - 8, 3.6, 30, 0.5, 0, { rails: true });
  const boat = buildRowBoat();
  boat.position.set(lakeX + 15.6, -0.2, lakeZ + lakeR - 17);
  boat.rotation.y = 0.08;
  boat.userData.dynamic = true;
  cityGroup.add(boat);
  worldAnimations.push((delta, time) => {
    boat.position.y = -0.2 + Math.sin(time * 1.4) * 0.08;
    boat.rotation.z = Math.sin(time * 1.1) * 0.03;
  });

  // костёр со сковородкой и столики для пикника
  const fireX = lakeX - 30;
  const fireZ = lakeZ + lakeR + 14;
  addCampfire(fireX, fireZ);
  [[-8, 4], [8, 4]].forEach(([dx, dz]) => addPicnicTable(fireX + dx, fireZ + dz));

  // настоящий лес вокруг: разные деревья, подлесок, дороги, тропинки и грибы
  buildDeepForest(lakeX, lakeZ, lakeR, fireX, fireZ);
  mapAreas.push({ type: "forest", x: -40, z: -435, w: 420, d: 330 });
}

// ---------- Автосалон и АЗС у трассы ----------
function buildDealership() {
  const x = 150;
  const z = 284;
  addBuilding({
    x, z, width: 48, depth: 28, height: 10,
    bodyColor: 0xe9edf2, roofColor: 0x2b3442, windowColor: 0xffffff,
    name: "АВТОСАЛОН", signColor: "#c81e3a", style: "showroom", type: "showroom"
  });
  addParkingLot(150, 306, 180, 16);
  mapLabels.push({ text: "Автосалон", x, z: z - 22, size: 12 });
  mapIcons.push({ icon: "🚗", x, z });

  const lineup = [
    ["hatch", -15, -2, "#2f6fd6", true],
    ["sedan", 0, -2, "#f4f4f2", true],
    ["suv", 15, -2, "#27a36a", true],
    ["pickup", -70, 22, "#ff8a2a", false],
    ["sport", 70, 22, "#d83a3a", false]
  ];
  lineup.forEach(([modelId, dx, dz, color, inside]) => {
    const px = x + dx;
    const pz = z + dz;
    const platform = new THREE.Group();
    platform.position.set(px, 0, pz);
    platform.userData.dynamic = true;
    cityGroup.add(platform);
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(6.3, 6.5, 0.35, 40), new THREE.MeshStandardMaterial({ color: inside ? 0x2b3442 : 0x9aa3ad, roughness: 0.3, metalness: 0.5 }));
    disc.position.y = 0.3;
    platform.add(disc);
    const car = addCar(0, 0, modelId, color, 0, { display: true, parent: platform });
    car.group.position.y = 0.48;
    if (inside) {
      worldAnimations.push((delta) => {
        platform.rotation.y += delta * 0.35;
      });
    } else {
      platform.rotation.y = Math.PI / 2;
    }
    const spec = CAR_MODELS[modelId];
    const tag = new THREE.Mesh(
      new THREE.PlaneGeometry(7, 1.75),
      new THREE.MeshBasicMaterial({ map: createLabelTexture(`${spec.ru} — ${spec.price}`, "#1d2633", "#ffd166"), transparent: true })
    );
    tag.position.set(px, inside ? 8.4 : 7, pz + (inside ? 6.5 : 7));
    cityGroup.add(tag);
    addCollider({ minX: px - 5.6, maxX: px + 5.6, minZ: pz - 5.6, maxZ: pz + 5.6 });
    dealershipDisplays.push({ modelId, x: px, z: pz, car, color });
  });
  for (let sx = 92; sx <= 208; sx += 8) {
    ownedCarSpots.push({ x: sx, z: 307, rotation: -Math.PI / 2 });
  }

  // АЗС
  const gx = 300;
  const gz = 300;
  addParkingLot(gx, gz + 2, 56, 24, 56);
  const canopyMaterial = new THREE.MeshStandardMaterial({ color: 0xf4f6f8, roughness: 0.5 });
  const redStripe = new THREE.MeshStandardMaterial({ color: 0xd93a3a, roughness: 0.5 });
  addStaticBox(36, 1.2, 16, gx, 9, gz, canopyMaterial);
  addStaticBox(36.4, 0.5, 16.4, gx, 8.3, gz, redStripe, { castShadow: false });
  [[-14, -5], [14, -5], [-14, 5], [14, 5]].forEach(([dx, dz]) => addStaticBox(0.8, 8.4, 0.8, gx + dx, 4.2, gz + dz, canopyMaterial, { collider: true }));
  [-6, 6].forEach((dx) => {
    addStaticBox(1.4, 3, 1, gx + dx, 1.5, gz, redStripe, { collider: true });
    addStaticBox(1.2, 0.8, 1.05, gx + dx, 2.4, gz, new THREE.MeshStandardMaterial({ color: 0x1d1f24, emissive: 0x113322, roughness: 0.3 }), { castShadow: false });
  });
  addRoadSign("АЗС", gx + 22, gz - 8, 0, "#c81e3a", 5);
  mapIcons.push({ icon: "⛽", x: gx, z: gz });
}

// Деревья везде, где пусто, гуще — ближе к горам
function buildForestEdges() {
  const random = makeRandom(99);
  const nearRoad = (x, z) => roads.some((road) => Math.abs(x - road.x) < road.width / 2 + 7 && Math.abs(z - road.z) < road.depth / 2 + 7);
  const inArea = (x, z) => mapAreas.some((area) => (area.r
    ? Math.hypot(x - area.x, z - area.z) < area.r + 8
    : Math.abs(x - area.x) < area.w / 2 + 6 && Math.abs(z - area.z) < area.d / 2 + 6));
  const nearBuilding = (x, z) => buildings.some((b) => Math.abs(x - b.x) < b.width / 2 + 14 && Math.abs(z - b.z) < b.depth / 2 + 14);
  let placed = 0;
  for (let attempt = 0; attempt < 6000 && placed < 560; attempt += 1) {
    const x = -680 + random() * 1360;
    const z = -680 + random() * 1360;
    const edge = -distanceOutsideMain(x, z);
    if (edge < 16) continue;
    if (Math.abs(x) < CITY_HALF + 14 && Math.abs(z) < CITY_HALF + 14) continue;
    const density = edge < 90 ? 1 : edge < 200 ? 0.5 : 0.3;
    if (random() > density) continue;
    if (nearRoad(x, z) || inArea(x, z) || nearBuilding(x, z) || Math.abs(z - HIGHWAY_Z) < 30) continue;
    if (random() < 0.65) addPineTree(x, z, 0.9 + random() * 0.8);
    else addTree(x, z, 0.8 + random() * 0.5, false);
    placed += 1;
  }
  for (let i = 0; i < 20; i += 1) {
    addCloud(-700 + random() * 1700, 130 + random() * 60, -700 + random() * 1400, 2 + random() * 2.5);
  }
}

function buildWorld() {
  buildTerrain();

  const roadWidth = 24;
  const halfRoad = roadWidth / 2;
  const sidewalk = 5;
  const lines = CITY_ROAD_LINES;
  const edge = CITY_HALF; // внешний край крайних улиц — дальше дорог нет, обрывов больше нет
  const crosswalkCenter = halfRoad + sidewalk / 2;
  const markingGap = halfRoad + sidewalk + 0.5;

  lines.forEach((x) => addRoadSurface(x, 0, roadWidth, edge * 2));
  lines.forEach((z) => {
    for (let i = 0; i < lines.length - 1; i += 1) {
      const from = lines[i] + halfRoad;
      const to = lines[i + 1] - halfRoad;
      addRoadSurface((from + to) / 2, z, to - from, roadWidth);
    }
  });
  for (let i = 0; i < lines.length - 1; i += 1) {
    const from = lines[i] + markingGap;
    const to = lines[i + 1] - markingGap;
    lines.forEach((x) => addLaneMarkings(false, x, from, to));
    lines.forEach((z) => addLaneMarkings(true, z, from, to));
  }

  // выезды из города: на трассу, в посёлок, в городок, в лесопарк
  addRoadSurface(40, (edge + HIGHWAY_Z - HIGHWAY_WIDTH / 2) / 2, roadWidth, HIGHWAY_Z - HIGHWAY_WIDTH / 2 - edge);
  addLaneMarkings(false, 40, edge, HIGHWAY_Z - HIGHWAY_WIDTH / 2);
  addRoadSurface((-edge - 412) / 2, 120, 412 - edge, roadWidth);
  addLaneMarkings(true, 120, -412, -edge);
  addRoadSurface((edge + 422) / 2, 40, 422 - edge, roadWidth);
  addLaneMarkings(true, 40, edge, 422);
  addRoadSurface(-40, (-edge - 339) / 2, roadWidth, 339 - edge);
  addLaneMarkings(false, -40, -339, -edge);
  addCityRingSidewalk(edge, sidewalk, [
    { alongX: true, fixed: edge, at: 40 }, { alongX: true, fixed: -edge, at: -40 },
    { alongX: false, fixed: -edge, at: 120 }, { alongX: false, fixed: edge, at: 40 }
  ]);

  // тротуары вокруг кварталов (внутри сетки улиц)
  for (let i = 0; i < lines.length - 1; i += 1) {
    for (let j = 0; j < lines.length - 1; j += 1) {
      const x0 = lines[i] + halfRoad;
      const x1 = lines[i + 1] - halfRoad;
      const z0 = lines[j] + halfRoad;
      const z1 = lines[j + 1] - halfRoad;
      addSidewalkRect(x0, x0 + sidewalk, z0, z1);
      addSidewalkRect(x1 - sidewalk, x1, z0, z1);
      addSidewalkRect(x0 + sidewalk, x1 - sidewalk, z0, z0 + sidewalk);
      addSidewalkRect(x0 + sidewalk, x1 - sidewalk, z1 - sidewalk, z1);
      const curb = 0.35;
      addCurb(x0, x0 + curb, z0, z1);
      addCurb(x1 - curb, x1, z0, z1);
      addCurb(x0, x1, z0, z0 + curb);
      addCurb(x0, x1, z1 - curb, z1);
    }
  }

  lines.forEach((x) => {
    lines.forEach((z) => {
      [[false, x, z - crosswalkCenter], [false, x, z + crosswalkCenter], [true, z, x - crosswalkCenter], [true, z, x + crosswalkCenter]].forEach(([alongX, fixed, center]) => {
        if (Math.abs(center) < edge - 2) addCrosswalk(alongX, fixed, center);
      });
      if (Math.abs(x - 14) < edge && Math.abs(z - 14) < edge) addTrafficLight(x - 14, z - 14, 0);
      if (Math.abs(x + 14) < edge && Math.abs(z + 14) < edge) addTrafficLight(x + 14, z + 14, Math.PI);
    });
  });

  // Дома: по одному большому дому на квартал. Внизу магазин, выше — квартиры, наверх ведёт лестница
  const facades = [
    [0xf1ddd0, 0x8e6f54, 0xfff7e8], [0xd9e6da, 0x64775b, 0xebfbff], [0xd7d7ea, 0x6b6788, 0xf5f0ff], [0xd8e4ef, 0x577286, 0xe9f9ff],
    [0xf1e1b9, 0x9a7d4d, 0xfff5cc], [0xe7d8d0, 0x7f695c, 0xf9fbff], [0xcfd8dc, 0x37474f, 0xe3f2fd], [0xf8e1e7, 0x8e4a5e, 0xfff0f5]
  ];
  const signPalette = ["#223247", "#6d4d31", "#2b5a47", "#684181", "#9a3f2e", "#334f67"];
  const names = [
    "Mini Market", "Sunrise Apartments", "Coffee Shop", "Maple Residence", "Book Store", "River Loft", "Fashion Shop",
    "Park View Homes", "Cinema", "City Apartments", "Bakery", "Blue Tower Flats", "Pet Shop", "Loft House", "Flower Shop",
    "North Residence", "Tech Store", "South Residence", "Music Hall", "Green House", "Grand Hotel", "Toy Store", "Office Center", "Clinic"
  ];
  const cityCells = [[80, -80], [160, -80], [80, -160], [160, -160]];
  const centers = [-160, -80, 0, 80, 160];
  const random = makeRandom(3);
  let buildingIndex = 0;
  centers.forEach((z) => {
    centers.forEach((x) => {
      if (x === 0 && z === 0) return; // центральный парк
      if (cityCells.some(([cx, cz]) => cx === x && cz === z)) return; // Сити
      // кварталы вдоль проспекта: исторический дом у дороги, двор и высотка за ним
      if (z === AVENUE_Z - 40 || z === AVENUE_Z + 40) {
        buildAvenueBlock(x, z, buildingIndex);
        buildingIndex += 1;
        return;
      }
      const ring = Math.max(Math.abs(x), Math.abs(z)) / 80;
      const facade = facades[buildingIndex % facades.length];
      addBuilding({
        x, z: z - 4, width: 34, depth: 26, floors: 3,
        // этажи по 8 м: внизу три настоящих, выше ещё от 3 до 9 этажей с квартирами
        height: 24 + 8 * Math.round(3 + (2 - ring) * 2 + random() * 2.5),
        bodyColor: facade[0], roofColor: facade[1], windowColor: facade[2],
        signColor: signPalette[buildingIndex % signPalette.length],
        name: names[buildingIndex % names.length]
      });
      addWalkway(x, z + 9 + 3.4, z + 23, 5);
      addTree(x - 19, z + 17);
      addTree(x + 19, z + 17);
      buildingIndex += 1;
    });
  });
  buildMoscowCity(cityCells);
  buildAvenueStreet();
  mapLabels.push({ text: "Блоблокс-Сити", x: 0, z: -edge - 16, size: 15 });

  // Фонари через 40 м, попеременно с разных сторон
  const lampOffset = halfRoad + 1.3;
  for (let k = 0; k < 12; k += 1) {
    const along = -220 + k * 40;
    if (Math.abs(along) > edge - 8) continue;
    const side = k % 2 === 0 ? 1 : -1;
    lines.forEach((roadLine) => {
      if (roadLine !== AVENUE_Z) addLamp(along, roadLine + side * lampOffset, 0, -side);
      addLamp(roadLine - side * lampOffset, along, side, 0);
    });
  }

  // аллея деревьев вокруг города
  for (let t = -edge; t <= edge; t += 20) {
    const ring = edge + 12;
    if (!isNearValue(t, [40], 18)) addTree(t, ring, 1, false);
    if (!isNearValue(t, [-40], 18)) addTree(t, -ring, 1, false);
    if (!isNearValue(t, [120], 18)) addTree(-ring, t, 1, false);
    if (!isNearValue(t, [40], 18)) addTree(ring, t, 1, false);
  }

  buildCentralPark();
  buildHighway();
  buildTunnelAndValley();
  buildVillage();
  buildTown();
  buildForestPark();
  buildDealership();
  buildGasShop();
  buildCountryside();
  buildForestEdges();

  // припаркованные машины у тротуаров
  const parkedModels = ["sedan", "hatch", "suv", "pickup", "taxi", "sedan", "hatch", "sport"];
  const parkRandom = makeRandom(11);
  let parked = 0;
  for (let attempt = 0; attempt < 200 && parked < 22; attempt += 1) {
    const roadLine = lines[Math.floor(parkRandom() * lines.length)];
    const along = -200 + parkRandom() * 400;
    if (isNearValue(along, lines, 26)) continue;
    const side = parkRandom() < 0.5 ? -1 : 1;
    const horizontal = parkRandom() < 0.5;
    const offset = roadLine + side * 9.2;
    const px = horizontal ? along : offset;
    const pz = horizontal ? offset : along;
    if (cars.some((car) => Math.hypot(car.group.position.x - px, car.group.position.z - pz) < 16)) continue;
    const rotation = horizontal ? (side > 0 ? 0 : Math.PI) : (side > 0 ? Math.PI / 2 : -Math.PI / 2);
    addCar(px, pz, parkedModels[parked % parkedModels.length], null, rotation);
    parked += 1;
  }
  addCar(-505, 211, "pickup", "#6b7f3a", 0);
  addCar(-335, 189, "hatch", "#e86a8a", Math.PI);
  addCar(395, 49, "sedan", "#3f5a8a", 0);
  addCar(500, 151, "suv", "#7b8592", Math.PI);
  addCar(-55, -350, "suv", "#27a36a", Math.PI / 2);
  addCar(-25, -350, "hatch", "#ff8a2a", Math.PI / 2);
  addCar(VALLEY.x - 60, VALLEY.z + 12, "suv", "#d83a3a", 0);
  // три летающие машины прямо у спавна: по одной на каждого игрока
  NET_SEATS.forEach((seat, index) => addFlyingCar(-24, -14 + index * 10, 0, seat.color));

  flushMarkings();
  mergeStaticMeshes(cityGroup, 300, true);
}

function addParkourPlatform(x, y, z, width, depth, height, color, options = {}) {
  const material = new THREE.MeshStandardMaterial({ color, roughness: 0.78 });
  const platform = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  platform.position.set(x, y, z);
  platform.castShadow = true;
  platform.receiveShadow = true;
  parkourGroup.add(platform);

  const topGlow = new THREE.Mesh(
    new THREE.BoxGeometry(width * 0.92, 0.12, depth * 0.92),
    new THREE.MeshStandardMaterial({ color: options.topColor ?? 0xffffff, emissive: options.topColor ?? 0xffffff, emissiveIntensity: 0.12 })
  );
  topGlow.position.set(x, y + height / 2 + 0.08, z);
  parkourGroup.add(topGlow);

  parkourPlatforms.push({
    mesh: platform,
    minX: x - width / 2,
    maxX: x + width / 2,
    minZ: z - depth / 2,
    maxZ: z + depth / 2,
    topY: y + height / 2
  });

  if (options.checkpoint) {
    const marker = new THREE.Group();
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 4.2, 10),
      new THREE.MeshStandardMaterial({ color: 0xf5f7ff, roughness: 0.46 })
    );
    pole.position.y = 2.1;
    marker.add(pole);

    const flag = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.9, 0.08),
      new THREE.MeshStandardMaterial({ color: options.flagColor ?? 0x7ae582, emissive: options.flagColor ?? 0x7ae582, emissiveIntensity: 0.24 })
    );
    flag.position.set(0.86, 3.05, 0);
    marker.add(flag);

    marker.position.set(x, y + height / 2, z);
    parkourGroup.add(marker);

    parkourCheckpoints.push({
      position: new THREE.Vector3(x, y + height / 2 + player.height * 0.5, z),
      marker,
      reached: false
    });
  }

  if (options.finish) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(Math.min(width, depth) * 0.24, 0.24, 10, 28),
      new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xffd166, emissiveIntensity: 0.35, roughness: 0.35 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.set(x, y + height / 2 + 2.4, z);
    parkourGroup.add(ring);
    platform.userData.isFinish = true;
  }
}

function buildParkourWorld() {
  const skyFloor = new THREE.Mesh(
    new THREE.CircleGeometry(28, 48),
    new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.12, roughness: 1 })
  );
  skyFloor.rotation.x = -Math.PI / 2;
  skyFloor.position.set(-8, -10, 24);
  parkourGroup.add(skyFloor);

  const startPad = new THREE.Mesh(
    new THREE.CylinderGeometry(8, 9, 2.2, 6),
    new THREE.MeshStandardMaterial({ color: 0x65d7ff, roughness: 0.72 })
  );
  startPad.position.set(-28, 0, 0);
  startPad.castShadow = true;
  startPad.receiveShadow = true;
  parkourGroup.add(startPad);
  parkourPlatforms.push({
    mesh: startPad,
    minX: -35.5,
    maxX: -20.5,
    minZ: -7.5,
    maxZ: 7.5,
    topY: 1.1
  });

  const startTextTexture = createLabelTexture("START", "#2d617b", "#ffffff");
  const startText = new THREE.Mesh(
    new THREE.PlaneGeometry(7.5, 2.1),
    new THREE.MeshBasicMaterial({ map: startTextTexture, transparent: true })
  );
  startText.rotation.x = -Math.PI / 2;
  startText.position.set(-28, 1.18, 0);
  parkourGroup.add(startText);

  addParkourPlatform(-14, 2.6, 0, 8, 8, 1.6, 0xff8fab, { topColor: 0xfff2d6 });
  addParkourPlatform(-2, 5.8, 6, 6, 6, 1.4, 0xffd166, { topColor: 0xffffff, checkpoint: true, flagColor: 0x7ae582 });
  addParkourPlatform(10, 8.6, -2, 5.6, 5.6, 1.2, 0x9b8cff, { topColor: 0xf2ebff });
  addParkourPlatform(22, 11.3, 7, 5.2, 5.2, 1.2, 0x7ae582, { topColor: 0xe8fff0 });
  addParkourPlatform(34, 14.6, -1, 5.8, 5.8, 1.2, 0x5dd9ff, { topColor: 0xeefcff, checkpoint: true, flagColor: 0xffd166 });
  addParkourPlatform(46, 18.2, 8, 5.4, 5.4, 1.2, 0xf7b267, { topColor: 0xfff2d6 });
  addParkourPlatform(59, 22.2, -2, 6, 6, 1.2, 0xff70a6, { topColor: 0xffeef5 });
  addParkourPlatform(73, 26.8, 6, 12, 12, 1.6, 0x7ae582, { topColor: 0xeafff0, checkpoint: true, flagColor: 0x9bf6ff, finish: true });

}

// ---------- Интерьеры прямо внутри домов (без телепорта) ----------
const BUILDING_GROUND_HEIGHT = 8;
const BUILDING_WALL = 0.5;
const BUILDING_DOOR_WIDTH = 5;
const BUILDING_DOOR_HEIGHT = 6.4;
const INTERIOR_COLORS = {
  market: [0xd7ccb9, 0xf7f2ea, 0x6a8b57],
  cafe: [0xc8a887, 0xf8f1e7, 0x8d5c3d],
  bookstore: [0xc6b092, 0xf4eee5, 0x405c7a],
  fashion: [0xe0d4dc, 0xfcf7fb, 0x8a5477],
  tech: [0xc8d9e8, 0xf2f8fd, 0x3e607d],
  pet: [0xd7c9b4, 0xfbf5eb, 0x628667],
  flower: [0xd8c0c8, 0xfcf6f8, 0x8f5f70],
  toy: [0xd7d0a9, 0xfefbe8, 0x7d6db3],
  entertainment: [0x343744, 0xede7d5, 0xb66f42],
  hotel: [0xd7d2c8, 0xf8f4ef, 0x6d655b],
  clinic: [0xd7e8ec, 0xf4fbfd, 0x4f7f89],
  office: [0xd5d7dd, 0xf6f8fb, 0x4e5968],
  residence: [0xc9a27a, 0xf3ece2, 0x5d7c99],
  showroom: [0xe9edf2, 0xf7f9fb, 0xc81e3a]
};
const PRODUCT_COLORS = [0xf15b5b, 0x7fd96f, 0xf0c14b, 0x7ec8ff, 0xc084fc, 0xff9f68, 0xffffff];

let furnishContext = null;

// Старые раскладки мебели рассчитаны на комнату 22×18 — растягиваем их на свободную часть этажа
function interiorPoint(x, z) {
  const ctx = furnishContext;
  return [ctx.cx + x * ctx.sx, z <= -8.7 ? ctx.backZ : ctx.cz + z * ctx.sz];
}

function addFurnitureCollider(lx, lz, width, depth) {
  const { building, floorY } = furnishContext;
  const f = building.facing || 1;
  const cx = building.x + lx * f;
  const cz = building.z + lz * f;
  addCollider({
    minX: cx - width / 2,
    maxX: cx + width / 2,
    minZ: cz - depth / 2,
    maxZ: cz + depth / 2,
    minY: floorY - 0.2,
    maxY: floorY + 7.6
  });
}

function addFurnitureBox(lx, y, lz, w, h, d, color, collide = true, roughness = 0.8) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color, roughness }));
  addInteriorMesh(mesh, lx, y, lz);
  if (collide) {
    addFurnitureCollider(lx, lz, w, d);
  }
  return mesh;
}

function addPartition(x1, z1, x2, z2, color) {
  const [ax, az] = interiorPoint(x1, z1);
  const [bx, bz] = interiorPoint(x2, z2);
  const height = FLOOR_HEIGHT - 0.35;
  const w = Math.max(0.3, Math.abs(bx - ax));
  const d = Math.max(0.3, Math.abs(bz - az));
  addFurnitureBox((ax + bx) / 2, BUILDING_FLOOR_TOP + height / 2, (az + bz) / 2, w, height, d, color, true, 0.95);
}

// Квартира: спальня, кухня со столом, гостиная с диваном и телевизором
function furnishApartment(wallColor, accentColor) {
  const { sx } = furnishContext;
  const floor = BUILDING_FLOOR_TOP;
  const wood = 0x8a6440;

  // спальня в дальнем правом углу
  addPartition(2.5, -9, 2.5, -2.6, wallColor);
  addPartition(2.5, -2.6, 4.6, -2.6, wallColor);
  addPartition(7.6, -2.6, 11, -2.6, wallColor);
  const [bedX, bedZ] = interiorPoint(7.2, -6.2);
  addFurnitureBox(bedX, floor + 0.5, bedZ, 4.4, 1.0, 3.2, wood);
  addFurnitureBox(bedX + 0.15, floor + 1.1, bedZ, 4.0, 0.3, 3.0, accentColor, false, 0.95);
  addFurnitureBox(bedX + 1.7, floor + 1.35, bedZ, 0.9, 0.35, 2.6, 0xffffff, false, 0.9);
  addFurnitureBox(bedX + 2.35, floor + 1.4, bedZ, 0.25, 2.2, 3.2, wood, false);
  const [standX, standZ] = interiorPoint(10, -2.95 - 0.4);
  addFurnitureBox(standX - 0.4, floor + 0.6, standZ - 0.3, 1.1, 1.2, 1.1, wood);
  const lampShade = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, 0.55, 12), new THREE.MeshStandardMaterial({ color: 0xfff1c4, emissive: 0xffd88a, emissiveIntensity: 0.6 }));
  addInteriorMesh(lampShade, standX - 0.4, floor + 1.6, standZ - 0.3);

  // кухня в дальнем левом углу
  const [counterX, counterZ] = interiorPoint(-5.8, -8.1);
  const counterLength = 8.2 * sx;
  addFurnitureBox(counterX, floor + 0.75, counterZ, counterLength, 1.5, 1.5, 0xf1ece4);
  addFurnitureBox(counterX, floor + 1.55, counterZ, counterLength + 0.1, 0.12, 1.6, 0x3b3f46, false, 0.4);
  addFurnitureBox(counterX - counterLength * 0.22, floor + 1.63, counterZ, 1.4, 0.04, 1.1, 0x14161a, false, 0.3); // плита
  addFurnitureBox(counterX + counterLength * 0.22, floor + 1.6, counterZ, 1.2, 0.08, 0.9, 0xb9c0c9, false, 0.2); // мойка
  addFurnitureBox(counterX, floor + 4.6, counterZ - 0.2, counterLength, 1.4, 1.0, 0xe6dfd4, false);
  const [fridgeX, fridgeZ] = interiorPoint(-10.2, -6.4);
  addFurnitureBox(fridgeX + 0.2, floor + 2.1, fridgeZ, 1.6, 4.2, 1.7, 0xd9dee5, true, 0.3);
  const [tableX, tableZ] = interiorPoint(-5.5, -3.6);
  addFurnitureBox(tableX, floor + 1.45, tableZ, 3.2, 0.15, 2.0, wood);
  addFurnitureBox(tableX, floor + 0.7, tableZ, 0.3, 1.4, 0.3, 0x3b3f46, false);
  [-1, 1].forEach((side) => {
    addFurnitureBox(tableX + side * 2.1, floor + 0.5, tableZ, 0.9, 1.0, 0.9, accentColor, false);
    addFurnitureBox(tableX + side * 2.5, floor + 1.4, tableZ, 0.15, 1.4, 0.9, accentColor, false);
  });

  // гостиная у входа: телевизор, диван, журнальный столик, кресло, книжный шкаф
  const [tvX, tvZ] = interiorPoint(-10.4, 3.6);
  addFurnitureBox(tvX + 0.3, floor + 0.5, tvZ, 1.2, 1.0, 4.2, 0x2b2f36);
  const tv = addFurnitureBox(tvX + 0.25, floor + 2.3, tvZ, 0.15, 2.0, 3.4, 0x111317, false, 0.2);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.8), new THREE.MeshStandardMaterial({ color: 0x1b2a40, emissive: 0x2f6fb5, emissiveIntensity: 0.5 }));
  screen.rotation.y = Math.PI / 2;
  addInteriorMesh(screen, tv.position.x + 0.09, floor + 2.3, tvZ);
  const [sofaX, sofaZ] = interiorPoint(-3.2, 3.6);
  addFurnitureBox(sofaX, floor + 0.55, sofaZ, 1.8, 1.1, 4.6, 0x5d7c99);
  addFurnitureBox(sofaX + 0.7, floor + 1.4, sofaZ, 0.5, 1.4, 4.6, 0x4e6a85, false);
  [-1, 1].forEach((side) => addFurnitureBox(sofaX, floor + 1.0, sofaZ + side * 2.3, 1.8, 1.0, 0.4, 0x4e6a85, false));
  const [coffeeX, coffeeZ] = interiorPoint(-6.6, 3.6);
  addFurnitureBox(coffeeX, floor + 0.55, coffeeZ, 1.6, 0.15, 2.4, wood);
  addFurnitureBox(coffeeX, floor + 0.25, coffeeZ, 1.3, 0.5, 2.0, 0x6b4a32, false);
  const [chairX, chairZ] = interiorPoint(6.5, 4.4);
  addFurnitureBox(chairX, floor + 0.55, chairZ, 1.8, 1.1, 1.8, accentColor);
  addFurnitureBox(chairX + 0.75, floor + 1.4, chairZ, 0.4, 1.4, 1.8, accentColor, false);
  addInteriorShelf(10.4, 3.4, 1, 4.6, 3.6, wood);
}

function furnishShowroom() {
  const [deskX, deskZ] = interiorPoint(8.5, -7);
  addFurnitureBox(deskX, BUILDING_FLOOR_TOP + 0.75, deskZ, 5, 1.5, 2, 0xf4f6f8);
  addFurnitureBox(deskX, BUILDING_FLOOR_TOP + 1.55, deskZ, 5.2, 0.1, 2.2, 0x2b3442, false, 0.3);
  addFurnitureBox(deskX, BUILDING_FLOOR_TOP + 2.0, deskZ - 0.4, 1.4, 0.9, 0.1, 0x14161a, false, 0.2);
  addInteriorPoster("BLOBLOX MOTORS", 0, 6.8, -9, "#c81e3a");
}

function addInteriorMesh(mesh, lx, y, lz) {
  mesh.position.set(lx, y + furnishContext.floorY, lz);
  mesh.castShadow = true;
  furnishContext.group.add(mesh);
  return mesh;
}

function addProduct(lx, y, lz, w, h, d) {
  furnishContext.products.push({ lx, y: y + furnishContext.floorY, lz, w, h, d, color: PRODUCT_COLORS[furnishContext.products.length % PRODUCT_COLORS.length] });
}

function addInteriorShelf(x, z, width, height, depth, color = 0x8a6f53) {
  const [lx, lz] = interiorPoint(x, z);
  const shelf = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshStandardMaterial({ color, roughness: 0.84 })
  );
  addInteriorMesh(shelf, lx, BUILDING_FLOOR_TOP + height / 2, lz);

  // товары на полках с обеих сторон стеллажа
  const alongZ = depth >= width;
  const length = alongZ ? depth : width;
  for (let level = 0.9; level < height - 0.4; level += 1.2) {
    for (let t = -length / 2 + 0.6; t <= length / 2 - 0.6; t += 0.85) {
      [-1, 1].forEach((side) => {
        if (alongZ) {
          addProduct(lx + side * (width / 2 + 0.16), BUILDING_FLOOR_TOP + level, lz + t, 0.32, 0.55, 0.6);
        } else {
          addProduct(lx + t, BUILDING_FLOOR_TOP + level, lz + side * (depth / 2 + 0.16), 0.6, 0.55, 0.32);
        }
      });
    }
  }

  addFurnitureCollider(lx, lz, width, depth);
  return shelf;
}

function addInteriorCounter(x, z, width, height = 1.5, depth = 1.7, color = 0xd9d0c4) {
  const [lx, lz] = interiorPoint(x, z);
  const counter = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshStandardMaterial({ color, roughness: 0.78 })
  );
  addInteriorMesh(counter, lx, BUILDING_FLOOR_TOP + height / 2, lz);

  const top = new THREE.Mesh(
    new THREE.BoxGeometry(width + 0.3, 0.12, depth + 0.3),
    new THREE.MeshStandardMaterial({ color: 0x3b3f46, roughness: 0.4 })
  );
  addInteriorMesh(top, lx, BUILDING_FLOOR_TOP + height + 0.06, lz);

  // касса
  const register = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.6, 0.7),
    new THREE.MeshStandardMaterial({ color: 0x2b2f36, roughness: 0.5 })
  );
  addInteriorMesh(register, lx + width / 2 - 0.9, BUILDING_FLOOR_TOP + height + 0.42, lz);

  addFurnitureCollider(lx, lz, width + 0.3, depth + 0.3);
  return counter;
}

function addInteriorStand(x, z, color = 0xffffff, scaleY = 1) {
  const [lx, lz] = interiorPoint(x, z);
  const group = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 0.24, 14), new THREE.MeshStandardMaterial({ color: 0xdfd8cd, roughness: 0.9 }));
  base.position.y = 0.12;
  group.add(base);
  const item = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1 * scaleY, 1.1), new THREE.MeshStandardMaterial({ color, roughness: 0.55 }));
  item.position.y = 0.24 + (1.1 * scaleY) / 2;
  item.castShadow = true;
  group.add(item);
  group.position.set(lx, BUILDING_FLOOR_TOP + furnishContext.floorY, lz);
  furnishContext.group.add(group);
  addFurnitureCollider(lx, lz, 1.3, 1.3);
}

function addInteriorPoster(text, x, y, z, color = "#2b4c66") {
  const [lx, lz] = interiorPoint(x, z);
  const poster = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 1.6), new THREE.MeshBasicMaterial({ map: createLabelTexture(text, color, "#ffffff") }));
  poster.position.set(lx, y + furnishContext.floorY, lz);
  furnishContext.group.add(poster);
}

function addInteriorPlant(lx, lz) {
  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.42, 0.9, 12),
    new THREE.MeshStandardMaterial({ color: 0xc7744e, roughness: 0.85 })
  );
  addInteriorMesh(pot, lx, BUILDING_FLOOR_TOP + 0.45, lz);
  const leaves = new THREE.Mesh(
    new THREE.SphereGeometry(0.95, 12, 10),
    new THREE.MeshStandardMaterial({ color: 0x3f9d5c, roughness: 0.9 })
  );
  leaves.scale.set(1, 1.35, 1);
  addInteriorMesh(leaves, lx, BUILDING_FLOOR_TOP + 1.9, lz);
  addFurnitureCollider(lx, lz, 1.2, 1.2);
}

function addCafeTable(lx, lz) {
  const top = new THREE.Mesh(
    new THREE.CylinderGeometry(0.95, 0.95, 0.12, 16),
    new THREE.MeshStandardMaterial({ color: 0xf1e0ca, roughness: 0.6 })
  );
  addInteriorMesh(top, lx, BUILDING_FLOOR_TOP + 1.5, lz);
  const leg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.3, 1.45, 10),
    new THREE.MeshStandardMaterial({ color: 0x3b3f46, roughness: 0.5 })
  );
  addInteriorMesh(leg, lx, BUILDING_FLOOR_TOP + 0.73, lz);
  [-1, 1].forEach((side) => {
    const chair = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.9, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x8d5c3d, roughness: 0.8 })
    );
    addInteriorMesh(chair, lx + side * 1.45, BUILDING_FLOOR_TOP + 0.45, lz);
  });
  addFurnitureCollider(lx, lz, 3.8, 1.9);
}

function flushProducts() {
  const { products, group } = furnishContext;
  if (!products.length) {
    return;
  }
  const mesh = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }),
    products.length
  );
  const dummy = new THREE.Object3D();
  const color = new THREE.Color();
  products.forEach((product, index) => {
    dummy.position.set(product.lx, product.y, product.lz);
    dummy.scale.set(product.w, product.h, product.d);
    dummy.updateMatrix();
    mesh.setMatrixAt(index, dummy.matrix);
    mesh.setColorAt(index, color.set(product.color));
  });
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) {
    mesh.instanceColor.needsUpdate = true;
  }
  mesh.frustumCulled = false;
  group.add(mesh);
}

// Мебель одного этажа. area — свободная часть этажа (без лестницы), floorIndex — номер этажа
function furnishInterior(building, group, accentColor, floorIndex = 0, area = null, type = building.type) {
  const halfW = building.width / 2 - BUILDING_WALL;
  const halfD = building.depth / 2 - BUILDING_WALL;
  const room = area || { minX: -halfW, maxX: halfW, minZ: -halfD, maxZ: halfD };
  furnishContext = {
    building,
    group,
    products: [],
    floorY: floorIndex * FLOOR_HEIGHT,
    cx: (room.minX + room.maxX) / 2,
    cz: (room.minZ + room.maxZ) / 2,
    sx: (room.maxX - room.minX) / 22,
    sz: (room.maxZ - room.minZ) / 18,
    backZ: room.minZ + 0.08
  };
  const isHome = type === "residence";

  const [rugX, rugZ] = isHome ? interiorPoint(-6.2, 3.6) : interiorPoint(0, 2.2);
  const rug = new THREE.Mesh(new THREE.BoxGeometry((isHome ? 7 : 8.6) * furnishContext.sx, 0.03, 4.2), new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.96 }));
  addInteriorMesh(rug, rugX, BUILDING_FLOOR_TOP + 0.015, rugZ);
  if (floorIndex === 0) {
    const entryMat = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.03, 1.6), new THREE.MeshStandardMaterial({ color: 0x454d58, roughness: 0.95 }));
    addInteriorMesh(entryMat, 0, BUILDING_FLOOR_TOP + 0.015, halfD - 1);
  }
  if (!isHome && type !== "showroom" && floorIndex === 0) {
    addInteriorPoster(building.name, 0, Math.min(6.3, building.groundHeight - 1.4), -9, "#263747");
  }
  addInteriorPlant(room.minX + 0.9, room.maxZ - 1.2);
  addInteriorPlant(room.maxX - 0.9, room.maxZ - 1.2);

  if (isHome) {
    furnishApartment(INTERIOR_COLORS.residence[1], accentColor);
  } else if (type === "showroom") {
    furnishShowroom();
  } else if (type === "market") {
    addInteriorShelf(-7.8, -2.2, 1.3, 4.2, 8.2);
    addInteriorShelf(7.8, -2.2, 1.3, 4.2, 8.2);
    addInteriorShelf(-3.2, -2.2, 1.3, 3.6, 7);
    addInteriorShelf(3.2, -2.2, 1.3, 3.6, 7);
    addInteriorCounter(0, 5.2, 5.4, 1.4, 1.8, 0xe4ddd1);
  } else if (type === "cafe") {
    addInteriorCounter(0, -5.2, 6.4, 1.45, 1.9, 0x9d7354);
    addInteriorShelf(8.5, -4.5, 1, 4.2, 4, 0x805d3e);
    [[-5.5, -0.5], [5.5, -0.5], [-5.5, 3.6], [5.5, 3.6]].forEach(([px, pz]) => {
      const [lx, lz] = interiorPoint(px, pz);
      addCafeTable(lx, lz);
    });
  } else if (type === "bookstore") {
    addInteriorShelf(-7.6, -1.8, 1.2, 5.2, 10.2, 0x826548);
    addInteriorShelf(7.6, -1.8, 1.2, 5.2, 10.2, 0x826548);
    addInteriorShelf(0, -7.2, 6.8, 3.2, 1.1, 0x8a6f53);
    [-3, 0, 3].forEach((px, i) => addInteriorStand(px, 2.8, [0x5f86b1, 0xb16d5f, 0x7a9c61][i], 1.2));
  } else if (type === "fashion" || type === "mall") {
    addInteriorCounter(0, -4.5, 5.2, 1.35, 1.8, 0xe7dbe1);
    [-5.8, 0, 5.8].forEach((px, i) => addInteriorStand(px, 2.6, [0xf28fb2, 0x8fd4ff, 0xf2cf63][i], 1.5));
    if (type === "mall") {
      addInteriorShelf(-8.6, -3, 1.1, 4.2, 6, 0x567086);
      addInteriorShelf(8.6, -3, 1.1, 4.2, 6, 0x8a5477);
      [[-5.5, 5.5], [5.5, 5.5]].forEach(([px, pz]) => {
        const [lx, lz] = interiorPoint(px, pz);
        addCafeTable(lx, lz);
      });
    } else {
      addInteriorPoster("NEW STYLE", 0, 4.4, -9, "#8a5477");
    }
  } else if (type === "tech") {
    addInteriorCounter(0, -4.4, 6, 1.3, 1.7, 0xc8d9e8);
    [-5.2, 0, 5.2].forEach((px, i) => addInteriorStand(px, 2.8, [0x3b4960, 0xdde6ee, 0x5fa8ff][i], 0.7));
    addInteriorShelf(8.4, -2.2, 1.1, 4.6, 6.4, 0x567086);
  } else if (type === "pet") {
    addInteriorCounter(0, -4.4, 5.2, 1.3, 1.7, 0xd8d1c7);
    [[-4.4, 0x9c7b5c, 1], [0, 0xffffff, 0.9], [4.4, 0x5a5a5a, 0.9]].forEach(([px, color, s]) => addInteriorStand(px, 2.8, color, s));
    addInteriorShelf(-8.4, -2.2, 1.1, 4, 6, 0x8a6f53);
  } else if (type === "flower") {
    [-6, -2, 2, 6].forEach((px, i) => addInteriorStand(px, 2.8, [0xf07da9, 0xf4d35e, 0xc084fc, 0x72ddf7][i], 1.1));
    addInteriorCounter(0, -4.6, 5.5, 1.35, 1.8, 0xe8d7dc);
  } else if (type === "toy") {
    addInteriorShelf(-7.8, -2.2, 1.2, 4.4, 8, 0x8a6f53);
    addInteriorShelf(7.8, -2.2, 1.2, 4.4, 8, 0x8a6f53);
    [-4, 0, 4].forEach((px, i) => addInteriorStand(px, 3, [0xff6b6b, 0x4dabf7, 0xffd43b][i], 1.3));
  } else if (type === "entertainment") {
    const [, screenZ] = interiorPoint(0, -9);
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(9, 4.4), new THREE.MeshStandardMaterial({ color: 0x1b2230, emissive: 0x3d6fa8, emissiveIntensity: 0.6 }));
    addInteriorMesh(screen, furnishContext.cx, 4.4, screenZ + 0.02);
    [-1.6, 1.4].forEach((rowZ) => {
      [-5, -2.2, 0.6, 3.4, 6.2].forEach((px) => addInteriorStand(px, rowZ, 0xb33a3a, 0.7));
    });
    addInteriorCounter(-6.5, 5, 4, 1.1, 1.6, 0x5f412f);
  } else {
    // отель, офис, клиника: ресепшен, шкаф, диван
    addInteriorCounter(0, -4.4, 6, 1.4, 1.8, 0xded7cd);
    addInteriorShelf(8.6, -3.8, 1.1, 4.8, 5.8, 0x84684e);
    const [sofaX, sofaZ] = interiorPoint(-5.8, 1.8);
    addFurnitureBox(sofaX, BUILDING_FLOOR_TOP + 0.55, sofaZ, 4.4, 1.1, 1.8, 0x7d92a4);
    addFurnitureBox(sofaX, BUILDING_FLOOR_TOP + 1.3, sofaZ - 0.65, 4.4, 1.2, 0.5, 0x6a7f91, false);
  }

  flushProducts();
  furnishContext = null;
}

function findBuildingAt(x, z) {
  for (let index = 0; index < buildings.length; index += 1) {
    const inner = buildings[index].inner;
    if (x > inner.minX && x < inner.maxX && z > inner.minZ && z < inner.maxZ) {
      return index;
    }
  }
  return null;
}

function updateSunAndInteriorLight() {
  // тень шагает ровно по клеткам своей карты, поэтому края не дрожат, пока игрок идёт
  const toSun = flyerTmp.a.copy(SUN_OFFSET).normalize();
  const shadowRight = flyerTmp.b.crossVectors(flyerTmp.up, toSun).normalize();
  const shadowUp = flyerTmp.c.crossVectors(toSun, shadowRight);
  const texel = (sun.shadow.camera.right - sun.shadow.camera.left) / sun.shadow.mapSize.x;
  const alongRight = Math.round(player.position.dot(shadowRight) / texel) * texel;
  const alongUp = Math.round(player.position.dot(shadowUp) / texel) * texel;
  const focus = flyerTmp.d.copy(toSun).multiplyScalar(player.position.dot(toSun))
    .addScaledVector(shadowRight, alongRight).addScaledVector(shadowUp, alongUp);
  sun.position.copy(focus).add(SUN_OFFSET);
  sun.target.position.copy(focus);
  sun.target.updateMatrixWorld();

  const inside = !state.inHub && state.currentGame === "city" ? state.insideBuilding : null;
  if (inside !== null) {
    const building = buildings[inside];
    const k = getBuildingFloorIndex(building, player.position.y);
    interiorLight.position.set(building.x, k * FLOOR_HEIGHT + building.groundHeight - 1.4, building.z);
    interiorLight.intensity = state.isNight ? 0.9 : 0.35;
  } else {
    interiorLight.intensity = 0;
  }
}

function findNearestDoor() {
  if (state.insideBuilding !== null) {
    return null;
  }

  let nearest = null;
  let nearestDistance = Infinity;
  buildings.forEach((building, index) => {
    const distance = Math.hypot(player.position.x - building.doorX, player.position.z - building.doorZ);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = { index, building, distance };
    }
  });

  return nearestDistance <= 8 ? nearest : null;
}

function setNpcVisibility(visible) {
  npcs.forEach((npc) => {
    npc.group.visible = visible;
  });
}

function findNearestCar() {
  if (state.currentGame !== "city" || state.currentInterior !== null || state.currentVehicle) {
    return null;
  }

  let nearest = null;
  let nearestDistance = Infinity;
  cars.forEach((car) => {
    if (car.remoteDriven) return; // машина другого игрока
    const distance = Math.hypot(player.position.x - car.group.position.x, player.position.z - car.group.position.z);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = { car, distance };
    }
  });

  // у больших машин можно подойти к любой двери
  return nearest && nearestDistance <= nearest.car.halfLength + 3 ? nearest : null;
}

// Сажаем персонажа на водительское сиденье: его видно через стёкла
function enterCar(car) {
  state.currentVehicle = car;
  car.speed = 0;
  car.steerAngle = 0;
  player.velocity.set(0, 0, 0);
  player.grounded = true;
  player.position.set(car.group.position.x, 0, car.group.position.z);
  player.angle = car.group.rotation.y + car.headingOffset;
  previousPlayerPosition.copy(player.position);
  car.driverSeat.add(avatar);
  // в машине человечек чуть крупнее, иначе он теряется в салоне
  const seatedScale = avatarParts.baseScale * (AVATAR_BODY_TYPES[bodyTypeInput.value] || AVATAR_BODY_TYPES.man).size * 1.2;
  avatar.scale.setScalar(seatedScale);
  avatar.position.set(0, -AVATAR_HIP_HEIGHT * seatedScale + 0.17, 0);
  avatar.rotation.set(0, 0, 0);
  cameraOrbit.yaw = player.angle + Math.PI;
  car.moveHeading = undefined;
  car.lastSpeed = undefined;
  car.yawActual = 0;
  if (car.flying) {
    car.lastPosition.copy(car.group.position);
    car.cameraDistance = undefined;
    startFlyerSound();
  } else {
    startEngineSound();
  }
}

function detachAvatarFromCar() {
  if (avatar.parent !== scene) {
    if (avatar.parent) {
      avatar.parent.remove(avatar);
    }
    scene.add(avatar);
  }
  avatar.rotation.set(0, player.angle, 0);
  avatarParts.bodyType = null; // вернуть обычный рост
  stopEngineSound();
  stopFlyerSound();
}

function exitCar() {
  if (!state.currentVehicle) {
    return;
  }

  const car = state.currentVehicle;
  if (car.flying && (car.wallPhase || car.group.position.y > getGroundHeight(car.group.position.x, car.group.position.z) + 1.2)) {
    showToast(currentLanguage === "ru" ? "Сначала приземлись: держи C 🛸" : "Land first: hold C 🛸");
    return;
  }
  if (car.flying) {
    car.group.position.y = getGroundHeight(car.group.position.x, car.group.position.z);
    resetFlyerPose(car);
  }
  car.body.rotation.set(0, 0, 0);
  car.body.position.y = 0;
  car.susp = null;
  const rotation = car.group.rotation.y;
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  // из машины в мир: локальная X — вперёд, локальная Z — вбок (водитель слева, на -Z)
  const toWorld = (lx, lz) => ({
    x: car.group.position.x + lx * cos + lz * sin,
    z: car.group.position.z - lx * sin + lz * cos
  });
  const side = car.halfWidth + PLAYER_COLLISION_RADIUS + 0.5;
  const candidates = [
    toWorld(car.spec.wsBase - 2.3, -side),
    toWorld(car.spec.wsBase - 2.3, side),
    toWorld(car.halfLength + 2, 0),
    toWorld(-car.halfLength - 2, 0)
  ];
  const exitPoint = candidates.find((point) => canMoveTo(point.x, point.z)) || candidates[0];
  state.currentVehicle = null;
  car.speed = 0;
  player.position.set(exitPoint.x, getGroundHeight(exitPoint.x, exitPoint.z), exitPoint.z);
  player.angle = car.group.rotation.y + car.headingOffset;
  player.velocity.set(0, 0, 0);
  player.grounded = true;
  detachAvatarFromCar();
  avatar.position.copy(player.position);
  previousPlayerPosition.copy(player.position);
}

function resizeRenderer() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.gfxMaxRatio || 2));
  renderer.setSize(width, height, false);
  if (window.gfxResize) window.gfxResize();
  camera.aspect = width / Math.max(height, 1);
  camera.updateProjectionMatrix();

  if (hubPreviewRenderer && hubAvatarCanvas) {
    const previewWidth = hubAvatarCanvas.clientWidth || 130;
    const previewHeight = hubAvatarCanvas.clientHeight || 150;
    hubPreviewRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    hubPreviewRenderer.setSize(previewWidth, previewHeight, false);
    hubPreviewCamera.aspect = previewWidth / Math.max(previewHeight, 1);
    hubPreviewCamera.updateProjectionMatrix();
  }

  if (sidebarPreviewRenderer && sidebarAvatarCanvas) {
    const previewWidth = sidebarAvatarCanvas.clientWidth || 480;
    const previewHeight = sidebarAvatarCanvas.clientHeight || 260;
    sidebarPreviewRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    sidebarPreviewRenderer.setSize(previewWidth, previewHeight, false);
    sidebarPreviewCamera.aspect = previewWidth / Math.max(previewHeight, 1);
    sidebarPreviewCamera.updateProjectionMatrix();
  }
}

function syncAvatarSettings() {
  player.name = nameInput.value.trim() || "Block Hero";
  avatarMaterials.body.color.set(bodyColorInput.value);
  avatarMaterials.hair.color.set(hairColorInput.value);
  avatarMaterials.accent.color.set(accentColorInput.value);
  avatarMaterials.iris.color.set(eyeColorInput.value);
  avatarMaterials.skin.color.set(SKIN_TONES[skinToneInput.value] || SKIN_TONES.fair);
  avatarMaterials.faceSkin.color.copy(avatarMaterials.skin.color);
  avatarMaterials.pants.color.set(PANTS_COLORS[pantsTypeInput.value] || PANTS_COLORS.jeans);
  const shoeStyle = SHOE_STYLES[shoesTypeInput.value] || SHOE_STYLES.sneakers;
  avatarMaterials.shoes.color.set(shoeStyle.color);
  avatarMaterials.sole.color.set(shoeStyle.sole);
  updateHubAvatarPreview();
  [avatarParts, hubPreviewParts, sidebarPreviewParts].forEach((parts) => {
    applyAvatarStyle(parts);
    applyAvatarMood(parts);
  });
}

function renderHubAvatarPreview(delta) {
  if (!hubPreviewRenderer || !hubPreviewScene || !hubPreviewCamera || !hubPreviewAvatar || !hubPreviewParts) {
    return;
  }

  hubPreviewAvatar.rotation.y += delta * 0.45;
  animateAvatarRig(hubPreviewParts, delta, { time: clock.elapsedTime, blinkTime: clock.elapsedTime + 1.3 });
  hubPreviewRenderer.render(hubPreviewScene, hubPreviewCamera);
}

function renderSidebarAvatarPreview(delta) {
  if (!sidebarPreviewRenderer || !sidebarPreviewScene || !sidebarPreviewCamera || !sidebarPreviewAvatar || !sidebarPreviewParts) {
    return;
  }

  sidebarPreviewAvatar.rotation.y += delta * 0.35;
  animateAvatarRig(sidebarPreviewParts, delta, { time: clock.elapsedTime + 0.7, blinkTime: clock.elapsedTime + 2.1 });
  sidebarPreviewRenderer.render(sidebarPreviewScene, sidebarPreviewCamera);
}

// Столкновения учитывают ширину персонажа (radius), а не одну точку в центре.
// Раньше полтела залезало в стену, а в углах можно было проскочить насквозь.
const PLAYER_COLLISION_RADIUS = 0.8;
const CAR_COLLISION_RADIUS = 1.3;

function hitsCar(x, z, radius, ignoreCar, y = 0) {
  return cars.some((car) => {
    if (car === ignoreCar || car.group.position.y > y + 3.5) {
      return false;
    }
    const dx = x - car.group.position.x;
    const dz = z - car.group.position.z;
    const rotation = car.group.rotation.y;
    const localX = dx * Math.cos(rotation) - dz * Math.sin(rotation);
    const localZ = dx * Math.sin(rotation) + dz * Math.cos(rotation);
    return Math.abs(localX) < car.halfLength + radius && Math.abs(localZ) < car.halfWidth + radius;
  });
}

// Препятствия теперь бывают «этажными»: мебель на 2 этаже не мешает ходить на 1-м
function collidesAt(x, z, radius, options = {}) {
  if (state.currentGame === "parkour") {
    return false;
  }
  const y = options.y || 0;
  for (const block of queryColliders(x, z, radius)) {
    if (block.carOnly && !options.isCar) continue;
    if (block.minY !== undefined && (y > block.maxY - 0.4 || y + 3.4 < block.minY)) continue;
    if (x > block.minX - radius && x < block.maxX + radius && z > block.minZ - radius && z < block.maxZ + radius) {
      return true;
    }
  }
  return hitsCar(x, z, radius, options.ignoreCar, y);
}

function canMoveTo(nextX, nextZ, radius = PLAYER_COLLISION_RADIUS, y = player.position.y) {
  return !collidesAt(nextX, nextZ, radius, { y });
}

function carCollidesAt(car, x, z, rotation) {
  if (findLakeAt(x, z, 1.5)) return true;
  // проверяем точки вдоль машины: перед, середина, зад
  const reach = car.halfLength - car.halfWidth * 0.9;
  for (const along of [-reach, -reach / 2, 0, reach / 2, reach]) {
    const px = x + along * Math.cos(rotation);
    const pz = z - along * Math.sin(rotation);
    if (collidesAt(px, pz, car.halfWidth * 0.92, { isCar: true, ignoreCar: car })) {
      return true;
    }
  }
  return false;
}

function currentDistrict() {
  if (state.currentGame === "parkour") {
    return translations[currentLanguage].districtParkour;
  }

  if (state.insideBuilding !== null) {
    return buildings[state.insideBuilding].name;
  }

  const district = districtZones.find((zone) =>
    player.position.x >= zone.minX &&
    player.position.x <= zone.maxX &&
    player.position.z >= zone.minZ &&
    player.position.z <= zone.maxZ
  );

  if (!district) {
    return currentLanguage === "ru" ? "Окрестности" : "Countryside";
  }
  return currentLanguage === "ru" ? district.name : district.en;
}

function getCurrentRespawnPosition() {
  if (state.currentGame === "parkour") {
    return activeParkourCheckpoint ? activeParkourCheckpoint.position : parkourSpawn;
  }
  return safeSpawn;
}

function respawnPlayer(position) {
  player.position.copy(position);
  player.velocity.set(0, 0, 0);
  player.grounded = true;
  player.jumpQueued = false;
  avatar.position.copy(player.position);
  previousPlayerPosition.copy(player.position);
  resetThirdPersonCamera();
}

function updateParkourProgress() {
  parkourCheckpoints.forEach((checkpoint) => {
    const reached = player.position.distanceTo(checkpoint.position) < 4.6;
    if (!checkpoint.reached && reached) {
      checkpoint.reached = true;
      activeParkourCheckpoint = checkpoint;
      parkourMessage = translations[currentLanguage].helpParkourCheckpoint;
    }

    checkpoint.marker.children.forEach((child, index) => {
      if (index === 1) {
        child.material.emissiveIntensity = checkpoint.reached ? 0.7 : 0.24;
      }
    });
  });

  const finishPlatform = parkourPlatforms.find((platform) => platform.mesh.userData.isFinish);
  if (finishPlatform &&
      player.position.x > finishPlatform.minX &&
      player.position.x < finishPlatform.maxX &&
      player.position.z > finishPlatform.minZ &&
      player.position.z < finishPlatform.maxZ &&
      player.position.y >= finishPlatform.topY - 0.2) {
    state.parkourFinished = true;
    parkourMessage = translations[currentLanguage].helpParkourFinish;
  }
}

function updateUi() {
  const t = translations[currentLanguage];
  if (phoneButton) {
    const showPhone = !state.inHub && state.currentGame === "city";
    phoneButton.classList.toggle("hidden", !showPhone);
    if (!showPhone) {
      phonePanel.classList.add("hidden");
    }
  }
  if (missionHud) {
    missionHud.classList.toggle("hidden", state.inHub || state.currentGame !== "city" || !state.activeJob);
  }

  if (state.inHub) {
    statusTextEl.textContent = t.statusHub;
    districtTextEl.textContent = t.districtHub;
    helpTextEl.textContent = t.helpHub;

    modeButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.mode === state.mode);
    });
    return;
  }

  if (state.currentGame === "parkour") {
    statusTextEl.textContent = t.statusParkour;
    districtTextEl.textContent = t.districtParkour;
    helpTextEl.textContent = parkourMessage || (state.parkourFinished ? t.helpParkourFinish : t.helpParkour);
    modeButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.mode === state.mode);
    });
    return;
  }

  state.district = currentDistrict();
  statusTextEl.textContent = state.currentVehicle
    ? t.statusDriving
    : state.insideBuilding === null
      ? t.statusWalk
      : t.statusInterior;
  const districtLabel = state.insideBuilding !== null
    ? (currentLanguage === "ru" ? "Здание" : "Building")
    : (currentLanguage === "ru" ? "Район" : "District");
  districtTextEl.textContent = `${districtLabel}: ${state.district}`;
  const nearDoor = findNearestDoor();
  const nearCar = findNearestCar();
  if (state.insideBuilding !== null && !state.currentVehicle) {
    helpTextEl.textContent = t.helpInterior.replace("{name}", buildings[state.insideBuilding].name);
  } else if (state.currentVehicle) {
    helpTextEl.textContent = t.helpDriving;
  } else if (nearCar) {
    helpTextEl.textContent = t.helpCarNearby;
  } else if (nearDoor) {
    helpTextEl.textContent = t.helpDoor.replace("{name}", nearDoor.building.name);
  } else {
    helpTextEl.textContent = state.mode === "first" ? t.helpFirst : t.helpThird;
  }

  modeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === state.mode);
  });
}

function updateMovement(delta) {
  const keys = state.keys;
  if (state.currentVehicle && state.currentVehicle.flying) {
    updateFlyer(state.currentVehicle, delta);
    return;
  }
  if (state.currentVehicle) {
    const vehicle = state.currentVehicle;
    const throttle = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0);
    const steerInput = (keys.KeyA || keys.ArrowLeft ? 1 : 0) - (keys.KeyD || keys.ArrowRight ? 1 : 0);
    const boost = keys.ShiftLeft || keys.ShiftRight ? 1.3 : 1;
    const handbrake = Boolean(keys.Space);
    let braking = false;

    // газ, тормоз, задний ход, накат
    if (throttle > 0) {
      const pull = updateGearbox(vehicle, vehicle.speed, vehicle.maxSpeed * boost, delta);
      vehicle.speed += (vehicle.speed < 0 ? vehicle.acceleration * 2.4 : vehicle.acceleration * 0.7 * pull * Math.max(0.05, 1 - Math.pow(Math.max(0, vehicle.speed) / (vehicle.maxSpeed * boost), 2))) * delta;
    } else if (throttle < 0) {
      if (vehicle.speed > 0.5) {
        vehicle.speed -= vehicle.acceleration * 2.4 * delta;
        braking = true;
      } else {
        vehicle.speed -= vehicle.acceleration * 0.5 * Math.max(0, 1 - Math.pow(-vehicle.speed / (vehicle.maxSpeed * 0.45), 2)) * delta;
      }
    } else {
      vehicle.speed *= Math.max(0, 1 - delta * 0.9);
    }
    if (handbrake) {
      vehicle.speed *= Math.max(0, 1 - delta * 3.5);
      braking = true;
    }
    vehicle.speed = THREE.MathUtils.clamp(vehicle.speed, -vehicle.maxSpeed * 0.45, vehicle.maxSpeed * boost);

    // руль: на скорости поворачивается меньше, как у настоящей машины
    const speedRatio = Math.min(1, Math.abs(vehicle.speed) / vehicle.maxSpeed);
    const maxSteer = THREE.MathUtils.lerp(0.6, 0.16, speedRatio);
    vehicle.lastDelta = delta;
    vehicle.steerAngle = dampTo(vehicle.steerAngle, steerInput * maxSteer, steerInput ? 6 : 10, delta);
    // поворот зависит от скорости, а тяжёлый кузов разворачивается не мгновенно.
    // На большой скорости шины держат хуже, с ручником задняя ось срывается в занос
    const understeer = 1 / (1 + Math.pow(Math.abs(vehicle.speed) / 52, 2));
    const drifting = handbrake && Math.abs(vehicle.speed) > 10;
    const yawTarget = ((vehicle.speed * Math.tan(vehicle.steerAngle)) / vehicle.wheelbase) * understeer * (drifting ? 1.7 : 1);
    vehicle.yawActual = dampTo(vehicle.yawActual || 0, yawTarget, drifting ? 11 : 7.5, delta);
    const yawRate = vehicle.yawActual;
    const previousRotation = vehicle.group.rotation.y;
    const nextRotation = previousRotation + yawRate * delta;
    const position = vehicle.group.position;
    if (!carCollidesAt(vehicle, position.x, position.z, nextRotation) || carCollidesAt(vehicle, position.x, position.z, previousRotation)) {
      vehicle.group.rotation.y = nextRotation;
    }

    const driveHeading = vehicle.group.rotation.y + vehicle.headingOffset;
    // машина едет не строго куда смотрит нос: в резком повороте её немного сносит наружу
    if (vehicle.moveHeading === undefined) vehicle.moveHeading = driveHeading;
    const gripRate = drifting ? 1.7 : THREE.MathUtils.lerp(16, 7, speedRatio);
    vehicle.moveHeading = turnTowardsAngle(vehicle.moveHeading, driveHeading, delta, gripRate);
    const slip = THREE.MathUtils.euclideanModulo(driveHeading - vehicle.moveHeading + Math.PI, Math.PI * 2) - Math.PI;
    vehicle.speed *= Math.max(0, 1 - Math.abs(slip) * 0.55 * delta);
    const moveX = Math.sin(vehicle.moveHeading) * vehicle.speed * delta;
    const moveZ = Math.cos(vehicle.moveHeading) * vehicle.speed * delta;
    const nextX = position.x + moveX;
    const nextZ = position.z + moveZ;
    if (isInsideWorld(nextX, nextZ) && !carCollidesAt(vehicle, nextX, nextZ, vehicle.group.rotation.y)) {
      position.x = nextX;
      position.z = nextZ;
    } else {
      vehicle.speed *= -0.2; // отскок от препятствия
    }
    position.y = getGroundHeight(position.x, position.z);

    // колёса: передние поворачиваются, все крутятся со скоростью машины
    vehicle.wheels.forEach((wheel) => {
      wheel.spin.rotation.z -= (vehicle.speed * delta) / vehicle.wheelR;
      if (wheel.front) {
        wheel.steer.rotation.y = vehicle.steerAngle;
      }
    });
    vehicle.steeringSpin.rotation.x = -vehicle.steerAngle * 2.4;

    // кузов на пружинах и дым из-под задних колёс, когда их срывает
    const longAccel = delta > 0 ? (vehicle.speed - (vehicle.lastSpeed === undefined ? vehicle.speed : vehicle.lastSpeed)) / delta : 0;
    vehicle.lastSpeed = vehicle.speed;
    updateCarBody(vehicle, delta, longAccel, vehicle.speed * yawRate);
    if (Math.abs(slip) > 0.14 && Math.abs(vehicle.speed) > 8) {
      vehicle.tireSmoke = (vehicle.tireSmoke || 0) + delta * 46;
      while (vehicle.tireSmoke >= 1) {
        vehicle.tireSmoke -= 1;
        const rear = vehicle.wheels[Math.random() < 0.5 ? 2 : 3];
        rear.steer.getWorldPosition(flyerTmp.b);
        spawnSmoke(flyerTmp.b.x, position.y + 0.25, flyerTmp.b.z, (Math.random() - 0.5) * 2, 0.8 + Math.random(), (Math.random() - 0.5) * 2, 0.8, 2.6 + Math.random() * 1.6, 0.7 + Math.random() * 0.6, 0.34, 0.92, 1.6, 0.8, position.y + 0.15);
      }
    }
    if ((braking && vehicle.speed > 12) || (Math.abs(slip) > 0.14 && Math.abs(vehicle.speed) > 8)) {
      vehicle.skidTimer = (vehicle.skidTimer || 0) - delta;
      if (vehicle.skidTimer <= 0) {
        vehicle.skidTimer = 0.05;
        [vehicle.wheels[2], vehicle.wheels[3]].forEach((wheel) => {
          wheel.steer.getWorldPosition(flyerTmp.b);
          addSkidMark(flyerTmp.b.x, position.y, flyerTmp.b.z, vehicle.moveHeading, Math.abs(vehicle.speed) * 0.055);
        });
      }
    }
    // скорость на экране
    vehicle.hudTimer = (vehicle.hudTimer || 0) - delta;
    if (vehicle.hudTimer <= 0 && flyerHudEl) {
      vehicle.hudTimer = 0.14;
      flyerHudEl.classList.remove("hidden");
      flyerHudEl.innerHTML = `<b>${Math.round(Math.abs(vehicle.speed) * SPEED_TO_KMH)}</b><small>${currentLanguage === "ru" ? "км/ч" : "km/h"}</small><i></i><b>${getGearText(vehicle)}</b>`;
    }
    vehicle.mats.tail.emissiveIntensity = braking ? 1.6 : state.isNight ? 1.1 : 0.3;

    updateEngineSound(vehicle, throttle);

    player.position.set(vehicle.group.position.x, 0, vehicle.group.position.z);
    player.angle = driveHeading;
    player.velocity.set(0, 0, 0);
    player.grounded = true;
    previousPlayerPosition.copy(player.position);
    moveAmount = 0;
    vehicle.lastSteerInput = steerInput;
    return;
  }

  // Управление как в Roblox: W — туда, куда смотрит камера, A/D — вбок, S — к камере.
  // Персонаж сам плавно поворачивается лицом по направлению движения.
  const speed = (keys.ShiftLeft || keys.ShiftRight ? 1.7 : 1) * player.speed * getSpeedBoost() * (state.swimming ? 0.5 : 1);
  let inputForward = 0;
  let inputRight = 0;
  if (keys.KeyW || keys.ArrowUp) inputForward += 1;
  if (keys.KeyS || keys.ArrowDown) inputForward -= 1;
  if (keys.KeyD) inputRight += 1;
  if (keys.KeyA) inputRight -= 1;
  if (keys.KeyQ || keys.ArrowLeft) cameraOrbit.yaw += delta * 2.2;
  if (keys.KeyE || keys.ArrowRight) cameraOrbit.yaw -= delta * 2.2;

  const cameraForward = getCameraForwardAngle();
  let moveX = 0;
  let moveZ = 0;
  if (inputForward !== 0 || inputRight !== 0) {
    const forwardX = Math.sin(cameraForward);
    const forwardZ = Math.cos(cameraForward);
    const rightX = -Math.cos(cameraForward);
    const rightZ = Math.sin(cameraForward);
    let dirX = forwardX * inputForward + rightX * inputRight;
    let dirZ = forwardZ * inputForward + rightZ * inputRight;
    const length = Math.hypot(dirX, dirZ);
    dirX /= length;
    dirZ /= length;
    moveX = dirX * speed * delta;
    moveZ = dirZ * speed * delta;
    if (state.mode !== "first") {
      player.angle = turnTowardsAngle(player.angle, Math.atan2(dirX, dirZ), delta, 14);
    }
  }
  if (state.mode === "first") {
    player.angle = cameraForward;
  }

  const limit = state.currentGame === "parkour" ? 88 : 2000; // в городе границу задают горы (isInsideWorld)
  let nextX = THREE.MathUtils.clamp(player.position.x + moveX, -limit, limit);
  let nextZ = THREE.MathUtils.clamp(player.position.z + moveZ, -limit, limit);
  // за край мира (в горы) не уйти
  if (state.currentGame === "city" && !isInsideWorld(nextX, nextZ)) {
    nextX = player.position.x;
    nextZ = player.position.z;
  }
  const currentX = player.position.x;
  const currentZ = player.position.z;
  // Если упёрся в стену — скользим вдоль неё, а не залипаем на месте.
  // Если вдруг уже застрял внутри препятствия — разрешаем выйти.
  const stuck = !canMoveTo(currentX, currentZ);
  if (stuck || canMoveTo(nextX, nextZ)) {
    player.position.x = nextX;
    player.position.z = nextZ;
  } else if (canMoveTo(nextX, currentZ)) {
    player.position.x = nextX;
  } else if (canMoveTo(currentX, nextZ)) {
    player.position.z = nextZ;
  }

  if (state.currentGame === "city") {
    state.insideBuilding = findBuildingAt(player.position.x, player.position.z);
  }

  const jumpPressed = player.jumpQueued || keys.Space;
  if (jumpPressed && player.grounded) {
    player.velocity.y = 10.6 * getJumpBoost() * (state.swimming ? 0.55 : 1);
    player.grounded = false;
    player.jumpQueued = false;
  }

  player.velocity.y -= 24 * delta;
  player.position.y += player.velocity.y * delta;

  if (state.currentGame === "parkour") {
    let landed = false;
    for (const platform of parkourPlatforms) {
      const withinX = player.position.x > platform.minX + 0.2 && player.position.x < platform.maxX - 0.2;
      const withinZ = player.position.z > platform.minZ + 0.2 && player.position.z < platform.maxZ - 0.2;
      const feetY = player.position.y;
      const previousFeetY = avatar.position.y;
      const platformTop = platform.topY;

      if (withinX && withinZ && player.velocity.y <= 0 && previousFeetY >= platformTop - 0.15 && feetY <= platformTop + 0.8) {
        player.position.y = platformTop;
        player.velocity.y = 0;
        player.grounded = true;
        landed = true;
        break;
      }
    }

    if (!landed) {
      player.grounded = false;
    }

    if (player.position.y < -16) {
      respawnPlayer(getCurrentRespawnPosition());
      parkourMessage = translations[currentLanguage].helpParkour;
    }
  } else {
    // Персонаж стоит на реальной высоте: тротуар, пол в доме или асфальт
    const groundY = getGroundHeight(player.position.x, player.position.z, player.position.y);
    const closeToGround = player.velocity.y <= 0 && player.position.y - groundY < 0.3;
    if (player.position.y <= groundY || closeToGround) {
      player.position.y = groundY;
      player.velocity.y = 0;
      player.grounded = true;
    } else {
      player.grounded = false;
    }
  }

  // вода: если глубоко — плывём, а не идём по дну
  state.swimming = false;
  if (state.currentGame === "city" && findLakeAt(player.position.x, player.position.z, 0.5)) {
    const bottom = getGroundHeight(player.position.x, player.position.z);
    const stroking = Math.hypot(moveX, moveZ) > 0.0001;
    const floatY = WATER_LEVEL - (stroking ? 1.55 : 2.5);
    if (bottom < floatY - 0.1 && player.position.y <= floatY + 0.3) {
      state.swimming = true;
      player.position.y = dampTo(player.position.y, floatY + Math.sin(clock.elapsedTime * 2) * 0.06, 5, delta);
      player.velocity.y = Math.max(0, player.velocity.y);
      player.grounded = true;
    }
  }

  const movedDistance = player.position.distanceTo(previousPlayerPosition);
  moveAmount = THREE.MathUtils.clamp(movedDistance / Math.max(delta, 0.0001), 0, 1);
  previousPlayerPosition.copy(player.position);
  avatar.position.copy(player.position);
  avatar.rotation.y = player.angle;

  // Шаги зависят от пройденного расстояния — ноги не «скользят» по земле
  if (moveAmount > 0) {
    const horizontalStep = Math.min(Math.hypot(moveX, moveZ), movedDistance);
    walkCycle += horizontalStep * (keys.ShiftLeft || keys.ShiftRight ? 0.64 : 0.92);
  }
}

function getCameraForwardAngle() {
  return cameraOrbit.yaw + Math.PI;
}

// Насколько далеко камера может отъехать от героя, пока не упрётся в стену или потолок
function findCameraClearDistance(pivot, direction, wanted, ceiling) {
  const step = 0.4;
  const point = new THREE.Vector3();
  for (let distance = 0.6; distance <= wanted; distance += step) {
    point.copy(pivot).addScaledVector(direction, distance);
    if (point.y > ceiling) {
      return Math.max(0.6, distance - step);
    }
    for (const box of queryColliders(point.x, point.z, 0.35)) {
      if (!box.height || point.y > box.height + 0.3) continue;
      if (point.x > box.minX - 0.35 && point.x < box.maxX + 0.35 && point.z > box.minZ - 0.35 && point.z < box.maxZ + 0.35) {
        return Math.max(0.6, distance - step);
      }
    }
  }
  return wanted;
}

function turnTowardsAngle(current, target, delta, speed) {
  const diff = THREE.MathUtils.euclideanModulo(target - current + Math.PI, Math.PI * 2) - Math.PI;
  return current + diff * (1 - Math.exp(-speed * delta));
}

function updateCamera() {
  const cockpitTarget = state.currentVehicle && state.mode === "first" ? state.currentVehicle : null;
  if (cockpitCar !== cockpitTarget) {
    if (cockpitCar) setCockpitView(cockpitCar, false);
    if (cockpitTarget) {
      ensureCarCockpit(cockpitTarget);
      setCockpitView(cockpitTarget, true);
    }
    cockpitCar = cockpitTarget;
  }
  if (state.currentVehicle && state.currentVehicle.flying) {
    updateFlyerCamera(state.currentVehicle);
    return;
  }
  if (state.currentVehicle) {
    const vehicle = state.currentVehicle;
    const driveHeading = vehicle.group.rotation.y + vehicle.headingOffset;
    if (state.mode === "first") {
      // вид с водительского места: руки на руле, кузов наклоняется вместе с камерой
      placeCockpitCamera(vehicle, vehicle.lastDelta || 1 / 60);
    } else {
      // за рулём камера плавно возвращается за машину, но её можно покрутить мышью
      if (!cameraOrbit.dragging) {
        // в повороте камера чуть отстаёт, поэтому машину видно немного сбоку
        cameraOrbit.yaw = turnTowardsAngle(cameraOrbit.yaw, driveHeading + Math.PI, vehicle.lastDelta || 1 / 60, 2.6);
      }
      const orbitYaw = cameraOrbit.yaw;
      const speedShare = Math.min(1.3, Math.abs(vehicle.speed) / vehicle.maxSpeed);
      const distance = cameraOrbit.distance + vehicle.halfLength + 4 + speedShare * 3;
      const horizontalDistance = Math.cos(cameraOrbit.pitch) * distance;
      camera.position.set(
        vehicle.group.position.x + Math.sin(orbitYaw) * horizontalDistance,
        vehicle.group.position.y + 3.5 + Math.sin(cameraOrbit.pitch) * distance,
        vehicle.group.position.z + Math.cos(orbitYaw) * horizontalDistance
      );
      camera.lookAt(vehicle.group.position.x, vehicle.group.position.y + 2.6, vehicle.group.position.z);
      avatar.visible = true; // водитель виден через стёкла
    }
    return;
  }

  if (state.mode === "first") {
    const lookAngle = getCameraForwardAngle();
    const eyeY = player.position.y + 3.2;
    camera.position.set(
      player.position.x + Math.sin(lookAngle) * 0.3,
      eyeY,
      player.position.z + Math.cos(lookAngle) * 0.3
    );
    camera.lookAt(
      player.position.x + Math.sin(lookAngle) * 16,
      eyeY - Math.tan(cameraOrbit.pitch - 0.18) * 16,
      player.position.z + Math.cos(lookAngle) * 16
    );
    avatar.visible = false;
  } else {
    // Камера как в Roblox: если между героем и камерой стена, камера плавно
    // подъезжает ближе, а когда стена пропадает — так же плавно отъезжает обратно.
    const pitch = cameraOrbit.pitch;
    const orbitYaw = cameraOrbit.yaw;
    const pivot = new THREE.Vector3(player.position.x, player.position.y + 3.1, player.position.z);
    const direction = new THREE.Vector3(
      Math.sin(orbitYaw) * Math.cos(pitch),
      Math.sin(pitch),
      Math.cos(orbitYaw) * Math.cos(pitch)
    );
    let ceiling = Infinity;
    if (state.currentGame === "city" && state.insideBuilding !== null) {
      ceiling = getBuildingCeiling(buildings[state.insideBuilding], player.position.y);
    }
    const wanted = cameraOrbit.distance + 1.2;
    const free = state.currentGame === "city" ? findCameraClearDistance(pivot, direction, wanted, ceiling) : wanted;
    if (cameraOrbit.currentDistance === undefined || free < cameraOrbit.currentDistance) {
      cameraOrbit.currentDistance = free; // приближаемся сразу, чтобы не видеть сквозь стену
    } else {
      cameraOrbit.currentDistance = dampTo(cameraOrbit.currentDistance, free, 4, 1 / 60);
    }
    camera.position.copy(pivot).addScaledVector(direction, cameraOrbit.currentDistance);
    camera.position.y = Math.max(camera.position.y, player.position.y + 0.6);
    camera.lookAt(
      player.position.x,
      player.position.y + 2.8,
      player.position.z
    );
    avatar.visible = true;
  }
}

function updateAvatarAnimation(delta) {
  if (state.currentVehicle) {
    // сидим за рулём и крутим руль
    animateAvatarRig(avatarParts, delta, {
      seated: true,
      steer: state.currentVehicle.steerAngle,
      recline: state.currentVehicle.spec.recline,
      time: clock.elapsedTime
    });
    return;
  }

  if (!avatar.visible) {
    return;
  }

  const moving = moveAmount > 0.04;
  animateAvatarRig(avatarParts, delta, {
    moving,
    sprint: moving && (state.keys.ShiftLeft || state.keys.ShiftRight),
    gait: state.keys.ShiftLeft || state.keys.ShiftRight ? 1 : 0.6,
    heading: player.angle,
    swimming: state.swimming,
    grounded: player.grounded,
    cycle: walkCycle,
    time: clock.elapsedTime
  });
}

function updateNpcs(delta) {
  if (state.inHub || state.currentInterior !== null || state.currentGame !== "city") {
    return;
  }

  npcs.forEach((npc) => {
    const animate = () => animateAvatarRig(npc.parts, delta, {
      moving: npc.moving,
      cycle: npc.walkCycle,
      time: clock.elapsedTime + npc.timeOffset
    });

    if (npc.wait > 0) {
      npc.wait -= delta;
      npc.moving = false;
      npc.group.position.y = getGroundHeight(npc.group.position.x, npc.group.position.z);
      animate();
      return;
    }

    const target = npc.route[npc.routeIndex];
    const toTarget = new THREE.Vector3(target.x - npc.group.position.x, 0, target.z - npc.group.position.z);
    const distance = toTarget.length();

    if (distance < 1.2) {
      npc.routeIndex = (npc.routeIndex + 1) % npc.route.length;
      npc.wait = 0.45 + Math.random() * 0.45;
      npc.moving = false;
      animate();
      return;
    }

    toTarget.normalize();
    const step = Math.min(distance, npc.speed * delta);
    npc.group.position.addScaledVector(toTarget, step);
    npc.group.position.y = getGroundHeight(npc.group.position.x, npc.group.position.z);
    // плавный поворот на углах маршрута вместо резкого щелчка
    npc.group.rotation.y = turnTowardsAngle(npc.group.rotation.y, Math.atan2(toTarget.x, toTarget.z), delta, 8);

    // шаг прохожих спокойнее, чем у игрока: шагов больше на тот же путь
    npc.walkCycle += step * 3.0;
    npc.moving = true;
    animate();
  });
}

function setThirdPersonMode() {
  // камера просто встаёт за спину, персонаж никуда не разворачивается
  state.mode = "third";
  cameraOrbit.yaw = player.angle + Math.PI;
  cameraOrbit.pitch = 0.28;
  updateUi();
}

function resetKeys() {
  state.keys = {};
  moveAmount = 0;
  audioState.nextStepAt = 0;
}

// Камера крутится зажатой левой или правой кнопкой мыши (как в Roblox)
canvas.addEventListener("pointerdown", (event) => {
  cameraOrbit.dragging = true;
  cameraOrbit.pointerId = event.pointerId;
  cameraOrbit.lastX = event.clientX;
  cameraOrbit.lastY = event.clientY;
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

canvas.addEventListener("pointermove", (event) => {
  if (!cameraOrbit.dragging || cameraOrbit.pointerId !== event.pointerId) {
    return;
  }

  const deltaX = event.clientX - cameraOrbit.lastX;
  const deltaY = event.clientY - cameraOrbit.lastY;
  cameraOrbit.lastX = event.clientX;
  cameraOrbit.lastY = event.clientY;

  cameraOrbit.yaw -= deltaX * 0.01;
  cameraOrbit.pitch = THREE.MathUtils.clamp(
    cameraOrbit.pitch + deltaY * 0.008,
    state.mode === "first" ? -0.9 : -0.35,
    state.mode === "first" ? 1.2 : 1.15
  );
  cameraOrbit.yaw = THREE.MathUtils.euclideanModulo(cameraOrbit.yaw, Math.PI * 2);
});

function stopCameraDrag(event) {
  if (cameraOrbit.pointerId === event.pointerId) {
    cameraOrbit.dragging = false;
    cameraOrbit.pointerId = null;
  }
}

canvas.addEventListener("pointerup", stopCameraDrag);
canvas.addEventListener("pointercancel", stopCameraDrag);

canvas.addEventListener("wheel", (event) => {
  if (state.mode !== "third") {
    return;
  }

  event.preventDefault();
  cameraOrbit.distance = THREE.MathUtils.clamp(cameraOrbit.distance + event.deltaY * 0.01, 7.5, 13);
}, { passive: false });

window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
  }

  if (state.inHub) {
    if (event.code === "Enter") {
      launchCityGame();
    }
    return;
  }

  state.keys[event.code] = true;
  if (event.code === "Digit1") state.mode = "first";
  if (event.code === "Digit3") setThirdPersonMode();
  if (event.code === "Space" && state.currentGame === "parkour") {
    player.jumpQueued = true;
  }
  if (event.code === "Escape" && !document.getElementById("shopMenu").classList.contains("hidden")) {
    closeShopMenu();
    return;
  }
  if (event.code === "Escape" && bigMapEl && !bigMapEl.classList.contains("hidden")) {
    closeBigMap();
    return;
  }
  if (event.code === "Escape" && state.currentVehicle) {
    exitCar();
    return;
  }
  if (event.repeat) {
    return;
  }
  if (event.code === "KeyM" && state.currentGame === "city") {
    toggleBigMap();
  }
  if (event.code === "KeyP" && state.currentGame === "city") {
    phonePanel.classList.toggle("hidden");
    updatePhoneUi();
  }
  if (event.code === "KeyH" && state.currentVehicle) {
    playHorn();
  }
  if (event.code === "KeyG" && state.currentVehicle && state.currentVehicle.flying) {
    toggleFlyerWall(state.currentVehicle);
  }
  if (event.code === "KeyF" && state.currentGame === "city" && !state.currentVehicle && (findNearestMushroom() || findNearestCampfire())) {
    const mushroom = findNearestMushroom();
    if (mushroom) pickMushroom(mushroom);
    else startFrying(findNearestCampfire());
  } else if (event.code === "KeyF" && state.currentGame === "city" && !state.currentVehicle) {
    if (findNearestSkyLift()) {
      useSkyLift(findNearestSkyLift());
    } else if (findNearestDisplay()) {
      tryBuyNearestCar();
    } else {
      toggleShopMenu();
    }
  }
  // В дома заходят ногами через дверь, R нужна только для машин
  if (event.code === "KeyR" && state.currentGame === "city") {
    if (state.currentVehicle) {
      exitCar();
    } else {
      const nearCar = findNearestCar();
      if (nearCar) {
        enterCar(nearCar.car);
      }
    }
  }
});

window.addEventListener("keyup", (event) => {
  state.keys[event.code] = false;
  if (event.code === "Space") {
    player.jumpQueued = false;
  }
});

window.addEventListener("blur", resetKeys);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    resetKeys();
  }
});

window.addEventListener("pointerdown", unlockAudio, { passive: true });
window.addEventListener("keydown", unlockAudio);

window.addEventListener("resize", resizeRenderer);

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.mode === "third") {
      setThirdPersonMode();
      return;
    }
    state.mode = button.dataset.mode;
    updateUi();
  });
});

catalogTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    currentCatalogTab = tab.dataset.catalog;
    renderCatalog();
  });
});

languageSelect.addEventListener("change", () => {
  currentLanguage = languageSelect.value;
  saveAvatarSettings();
  applyLanguage();
});

[nameInput, bodyColorInput, hairColorInput, accentColorInput, eyeColorInput, outfitTypeInput, shoesTypeInput, hairStyleInput, headAccessoryInput, faceMoodInput].forEach((input) => {
  input.addEventListener("input", () => {
    saveAvatarSettings();
    syncAvatarSettings();
    renderCatalog();
  });
  input.addEventListener("change", () => {
    saveAvatarSettings();
    syncAvatarSettings();
    renderCatalog();
  });
});

panelToggle.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
  panelToggle.textContent = sidebar.classList.contains("collapsed")
    ? translations[currentLanguage].panelToggle
    : translations[currentLanguage].panelClose;
});

document.addEventListener("pointerdown", (event) => {
  if (sidebar.classList.contains("collapsed")) {
    return;
  }

  const target = event.target;
  if (sidebar.contains(target) || panelToggle.contains(target)) {
    return;
  }

  closeSidebar();
});

document.addEventListener("pointerdown", (event) => {
  if (!phonePanel || phonePanel.classList.contains("hidden")) {
    return;
  }

  const target = event.target;
  if (phonePanel.contains(target) || phoneButton.contains(target)) {
    return;
  }

  phonePanel.classList.add("hidden");
});

settingsToggle.addEventListener("click", () => {
  settingsPanel.classList.toggle("collapsed");
});

phoneButton.addEventListener("click", () => {
  phonePanel.classList.toggle("hidden");
  updatePhoneUi();
});

phoneClose.addEventListener("click", () => {
  phonePanel.classList.add("hidden");
});

launchCityGameButton.addEventListener("click", launchCityGame);
setupHubMenu();
launchParkourGameButton.addEventListener("click", launchParkourGame);
backToHubButton.addEventListener("click", returnToHub);

// ---------- v3: этажи, круглая граница мира, долина за тоннелем, магазины, летающая машина ----------
const FLOOR_HEIGHT = 8;
const VALLEY = { x: 880, z: HIGHWAY_Z, r: 150 };
const TUNNEL = { x0: 585, x1: 720, z: HIGHWAY_Z, half: 15 };
const MAP_MIN_X = -720;
const MAP_MIN_Z = -720;
const MAP_W = 1800;
const MAP_H = 1440;
CAR_MODELS.flyer = {
  ...CAR_MODELS.sport, ru: "Летающая машина", en: "Flying Car", price: 0, maxSpeed: 78, accel: 36,
  L: 11.4, W: 4.9, wheelR: 0.92, wb: 6.9, belt: 2.2, roof: 3.8, seatY: 1.0, recline: 0.3, wsBase: 2.1
};

const SHOP_ITEMS = [
  { id: "hotdog", icon: "🌭", price: 15, ru: ["Хот-дог", "Горячий и вкусный"], en: ["Hot dog", "Hot and tasty"] },
  { id: "coffee", icon: "☕", price: 10, effect: "speed", ru: ["Кофе", "+35% к скорости на 60 сек"], en: ["Coffee", "+35% speed for 60 s"] },
  { id: "energy", icon: "⚡", price: 20, effect: "jump", ru: ["Энергетик", "Прыжок выше на 60 сек"], en: ["Energy drink", "Higher jumps for 60 s"] },
  { id: "icecream", icon: "🍦", price: 8, ru: ["Мороженое", "Пломбир в стаканчике"], en: ["Ice cream", "Vanilla cone"] },
  { id: "water", icon: "💧", price: 5, ru: ["Вода", "Освежает"], en: ["Water", "Refreshing"] }
];
const playerEffects = { speedUntil: 0, jumpUntil: 0 };
const floorMaterialCacheV3 = new Map();
let glassTowerMaterial = null;
INTERIOR_COLORS.mall = [0xe9e4dc, 0xf7f5f2, 0x2f6fd6];

// ---------- Смартфон: приложения ----------
const PHONE_APPS = [
  { id: "jobs", icon: "💼", color: "linear-gradient(135deg,#ffb347,#ff7a45)", ru: "Работа", en: "Jobs" },
  { id: "map", icon: "🗺️", color: "linear-gradient(135deg,#7ee081,#2fa86b)", ru: "Карта", en: "Map" },
  { id: "bank", icon: "💳", color: "linear-gradient(135deg,#6a8dff,#3a4fd6)", ru: "Банк", en: "Bank" },
  { id: "garage", icon: "🚗", color: "linear-gradient(135deg,#ff6b81,#c81e3a)", ru: "Гараж", en: "Garage" },
  { id: "camera", icon: "📸", color: "linear-gradient(135deg,#5b6472,#2b3038)", ru: "Камера", en: "Camera" },
  { id: "gallery", icon: "🖼️", color: "linear-gradient(135deg,#ffd166,#f4a259)", ru: "Галерея", en: "Gallery" },
  { id: "music", icon: "🎵", color: "linear-gradient(135deg,#ff5fa2,#9b5de5)", ru: "Музыка", en: "Music" },
  { id: "weather", icon: "🌤️", color: "linear-gradient(135deg,#7fd3ff,#3a8ee6)", ru: "Погода", en: "Weather" },
  { id: "messages", icon: "💬", color: "linear-gradient(135deg,#6ee7a8,#22b573)", ru: "Сообщения", en: "Messages" },
  { id: "settings", icon: "⚙️", color: "linear-gradient(135deg,#c3cad4,#7b8592)", ru: "Настройки", en: "Settings" }
];

// Оформление и награды всех работ
const JOB_STYLES = {
  courier: { icon: "📦", color: "#ff9f43", reward: 120, mode: "walk" },
  taxi: { icon: "🚕", color: "#f2c230", reward: 160, mode: "car" },
  technician: { icon: "🔧", color: "#4dabf7", reward: 190, mode: "walk" },
  pizza: { icon: "🍕", color: "#ff6b6b", reward: 150, mode: "walk" },
  postman: { icon: "📮", color: "#5c7cfa", reward: 230, mode: "walk" },
  photographer: { icon: "📷", color: "#845ef7", reward: 260, mode: "any" },
  farmer: { icon: "🚜", color: "#51cf66", reward: 280, mode: "car" },
  mountain: { icon: "🏔️", color: "#20c997", reward: 340, mode: "car" }
};

const EXTRA_JOB_TEXT = {
  pizza: { ru: ["Доставщик пиццы", "Забери горячую пиццу в кафе и отнеси клиенту домой"], en: ["Pizza Delivery", "Grab a hot pizza at a café and bring it to a customer"] },
  postman: { ru: ["Почтальон", "Разнеси письма по трём адресам в городе"], en: ["Postman", "Deliver letters to three addresses in the city"] },
  photographer: { ru: ["Фотограф", "Сфотографируй три известных места"], en: ["Photographer", "Take photos of three famous places"] },
  farmer: { ru: ["Фермер", "Отвези овощи из Сельпо в Солнечный Маркет"], en: ["Farmer", "Bring veggies from the village store to Sunny Market"] },
  mountain: { ru: ["Курьер в Горный", "Забери посылку на заправке и довези в Лыжную лавку"], en: ["Mountain Courier", "Pick up a parcel at the gas station and drive it to the ski shop"] }
};

const phoneState = { app: "home", galleryIndex: null };
const phoneScreen = document.getElementById("phoneScreen");
const phoneMessages = [];
const phoneGallery = [];
const BANK_KEY = "blobloxBank";
const bankHistory = [];
try {
  const savedBank = JSON.parse(window.localStorage.getItem(BANK_KEY) || "[]");
  if (Array.isArray(savedBank)) bankHistory.push(...savedBank.slice(0, 40));
} catch (error) {
  console.warn("Could not load bank history", error);
}

const RADIO_STATIONS = [
  { ru: "Lo-fi Чилл", en: "Lo-fi Chill", bpm: 78, wave: "triangle", notes: [60, 64, 67, 71, 69, 67, 64, 62], bass: [36, 36, 41, 43] },
  { ru: "Город Поп", en: "City Pop", bpm: 112, wave: "sawtooth", notes: [64, 67, 71, 74, 72, 71, 67, 69], bass: [40, 45, 43, 38] },
  { ru: "Ретро 8-бит", en: "Retro 8-bit", bpm: 140, wave: "square", notes: [72, 76, 79, 76, 74, 77, 81, 77], bass: [48, 53, 55, 50] }
];
const radioState = { station: null, timer: null, step: 0, gain: null, volume: 0.5 };

if (phoneScreen) {
  phoneScreen.addEventListener("click", handlePhoneClick);
  phoneScreen.addEventListener("input", (event) => {
    if (event.target.dataset.action === "volume") {
      radioState.volume = Number(event.target.value) / 100;
      if (radioState.gain) radioState.gain.gain.value = radioState.volume * 0.12;
    }
  });
}
document.getElementById("phoneHome").addEventListener("click", () => {
  phoneState.app = "home";
  updatePhoneUi();
});
window.setInterval(() => {
  if (!phonePanel.classList.contains("hidden") && phoneState.app !== "music") updatePhoneUi();
}, 5000);
pushPhoneMessage("Bloblox", currentLanguage === "ru" ? "Добро пожаловать! Открой «Работу», чтобы заработать первые монеты 💼" : "Welcome! Open Jobs to earn your first coins 💼");
pushPhoneMessage(currentLanguage === "ru" ? "Мама" : "Mom", currentLanguage === "ru" ? "Не забудь покататься на летающей машине в парке 🛸" : "Don't forget to try the flying car in the park 🛸");

// ---------- Летающая машина: форма кузова (x вдоль машины → значение) ----------
const FLYER_TOP = [[-5.7, 1.95], [-4.6, 2.16], [-2.6, 2.26], [0, 2.22], [2.6, 2.02], [3.45, 1.78], [4.6, 1.42], [5.7, 1.0]];
const FLYER_BOTTOM = [[-5.7, 1.1], [-4.6, 0.74], [-2, 0.6], [3, 0.6], [4.8, 0.64], [5.7, 0.74]];
const FLYER_HALF = [[-5.7, 2.02], [-3.45, 2.46], [-0.6, 2.24], [3.45, 2.42], [4.9, 2.12], [5.7, 1.6]];
const FLYER_ROOF = [[-3.2, 2.0], [-2.4, 2.75], [-1.2, 3.5], [0.1, 3.8], [1.0, 3.62], [2.0, 3.02], [2.9, 2.3], [3.5, 1.6]];
const FLYER_COCKPIT = [[-3.2, 0.7], [-2.4, 1.5], [-0.8, 1.86], [0.8, 1.9], [2.2, 1.7], [3, 1.2], [3.5, 0.5]];
const FLYER_ARCH_R = 1.08;
const FLYER_WHEEL_Z = 1.93;
const flyerShared = { env: undefined, plumeTexture: null };
const flyingCars = [];
const towerFaces = [];
const flyerWalls = { list: null };
const FLYER_VIEW_TURN = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2);
const flyerTmp = {
  a: new THREE.Vector3(), b: new THREE.Vector3(), c: new THREE.Vector3(), d: new THREE.Vector3(),
  q: new THREE.Quaternion(), q2: new THREE.Quaternion(), m: new THREE.Matrix4(), up: new THREE.Vector3(0, 1, 0),
  x: new THREE.Vector3(1, 0, 0)
};
const flyerHudEl = document.getElementById("flyerHud");
const flyerAudio = { nodes: null };

// ---------- Дым: один меш на все клубы, каждый клуб всегда смотрит на камеру ----------
const SMOKE_MAX = 900;
const smokeColor = new Float32Array(SMOKE_MAX * 3); // цвет клуба; целая часть красного — номер картинки
const SMOKE_VAPOR = [0.97, 0.98, 1];
const SMOKE_SPRAY = [0.9, 0.95, 0.99];
const smokeOffset = new Float32Array(SMOKE_MAX * 3);
const smokeData = new Float32Array(SMOKE_MAX * 4); // размер, прозрачность, поворот, яркость
const smokeVelocity = new Float32Array(SMOKE_MAX * 3);
const smokeState = new Float32Array(SMOKE_MAX * 8); // возраст, жизнь, размер, рост, прозрачность, торможение, всплытие, пол
const smokeInfo = { cursor: 0, alive: 0 };

const smokeMesh = (() => {
  // четыре разных клуба в одной картинке: пар не выглядит одинаковыми кружками
  const puff = document.createElement("canvas");
  puff.width = 256;
  puff.height = 256;
  const context = puff.getContext("2d");
  for (let q = 0; q < 4; q += 1) {
    const cx = (q % 2) * 128 + 64;
    const cy = Math.floor(q / 2) * 128 + 64;
    context.save();
    context.beginPath();
    context.rect(cx - 64, cy - 64, 128, 128);
    context.clip();
    for (let i = 0; i < 46; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.pow(Math.random(), 0.7) * 34;
      const x = cx + Math.cos(angle) * distance;
      const y = cy + Math.sin(angle) * distance * 0.85;
      const radius = (distance > 22 ? 9 : 14) + Math.random() * 14;
      const gradient = context.createRadialGradient(x, y - radius * 0.25, 0, x, y, radius);
      const light = 225 + Math.floor(Math.random() * 30);
      gradient.addColorStop(0, `rgba(${light},${light},${light},0.5)`);
      gradient.addColorStop(0.6, `rgba(${light - 25},${light - 22},${light - 18},0.22)`);
      gradient.addColorStop(1, "rgba(200,204,210,0)");
      context.fillStyle = gradient;
      context.fillRect(cx - 64, cy - 64, 128, 128);
    }
    context.restore();
  }
  const quad = new THREE.PlaneGeometry(1, 1);
  const geometry = new THREE.InstancedBufferGeometry();
  geometry.index = quad.index;
  geometry.setAttribute("position", quad.attributes.position);
  geometry.setAttribute("uv", quad.attributes.uv);
  geometry.setAttribute("offset", new THREE.InstancedBufferAttribute(smokeOffset, 3).setUsage(THREE.DynamicDrawUsage));
  geometry.setAttribute("pdata", new THREE.InstancedBufferAttribute(smokeData, 4).setUsage(THREE.DynamicDrawUsage));
  geometry.setAttribute("pcolor", new THREE.InstancedBufferAttribute(smokeColor, 3).setUsage(THREE.DynamicDrawUsage));
  geometry.instanceCount = SMOKE_MAX;
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      map: { value: new THREE.CanvasTexture(puff) },
      tint: { value: new THREE.Color(1, 1, 1) },
      fogColor: { value: new THREE.Color(0x88d7ff) },
      fogRange: { value: new THREE.Vector2(160, 950) }
    },
    vertexShader: `
      attribute vec3 offset;
      attribute vec4 pdata;
      attribute vec3 pcolor;
      varying vec2 vUv;
      varying float vAlpha;
      varying float vShade;
      varying float vDepth;
      varying float vLit;
      varying vec3 vColor;
      void main() {
        vec4 view = modelViewMatrix * vec4(offset, 1.0);
        float c = cos(pdata.z);
        float s = sin(pdata.z);
        vec2 corner = vec2(c * position.x - s * position.y, s * position.x + c * position.y);
        view.xy += corner * pdata.x;
        float variant = floor(pcolor.r / 2.0);
        vColor = vec3(pcolor.r - variant * 2.0, pcolor.g, pcolor.b);
        vUv = uv * 0.5 + vec2(mod(variant, 2.0), floor(variant / 2.0)) * 0.5;
        vLit = corner.y + 0.5;
        vAlpha = pdata.y;
        vShade = pdata.w;
        vDepth = -view.z;
        gl_Position = projectionMatrix * view;
      }`,
    fragmentShader: `
      uniform sampler2D map;
      uniform vec3 tint;
      uniform vec3 fogColor;
      uniform vec2 fogRange;
      varying vec2 vUv;
      varying float vAlpha;
      varying float vShade;
      varying float vDepth;
      varying float vLit;
      varying vec3 vColor;
      void main() {
        vec4 puff = texture2D(map, vUv);
        // сверху клуб освещён солнцем, снизу в тени — так он объёмный
        vec3 color = tint * vShade * vColor * puff.rgb * mix(0.74, 1.08, vLit);
        color = mix(color, fogColor, smoothstep(fogRange.x, fogRange.y, vDepth));
        gl_FragColor = vec4(color, puff.a * vAlpha);
        if (gl_FragColor.a < 0.004) discard;
      }`
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  mesh.renderOrder = 6;
  mesh.visible = false;
  scene.add(mesh);
  return mesh;
})();

// Пятно под машиной: тень и кольцо посадки, чтобы было видно, куда садишься
const flyerPad = (() => {
  const image = document.createElement("canvas");
  image.width = 256;
  image.height = 256;
  const context = image.getContext("2d");
  const shade = context.createRadialGradient(128, 128, 10, 128, 128, 118);
  shade.addColorStop(0, "rgba(6,14,24,0.62)");
  shade.addColorStop(0.6, "rgba(6,14,24,0.34)");
  shade.addColorStop(1, "rgba(6,14,24,0)");
  context.fillStyle = shade;
  context.fillRect(0, 0, 256, 256);
  context.strokeStyle = "rgba(120,235,255,0.95)";
  context.lineWidth = 5;
  context.beginPath();
  context.arc(128, 128, 104, 0, Math.PI * 2);
  context.stroke();
  context.lineWidth = 3;
  [0, 1, 2, 3].forEach((i) => {
    context.beginPath();
    context.arc(128, 128, 88, i * Math.PI / 2 + 0.28, i * Math.PI / 2 + 1.28);
    context.stroke();
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({
    map: new THREE.CanvasTexture(image), transparent: true, depthWrite: false, opacity: 0, fog: false,
    polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2
  }));
  mesh.rotation.x = -Math.PI / 2;
  mesh.visible = false;
  mesh.renderOrder = 2;
  scene.add(mesh);
  return mesh;
})();

// ---------- Игра вместе: комната по коду, до трёх игроков ----------
const NET_SEATS = [
  { color: "#c2122c", ru: "красная", en: "red" },
  { color: "#1557d6", ru: "синяя", en: "blue" },
  { color: "#f2b705", ru: "жёлтая", en: "yellow" }
];
const net = { socket: null, room: null, id: null, seat: null, peers: new Map(), sendTimer: 0, wanted: null, retry: null };
const netEls = {
  name: document.getElementById("netName"),
  code: document.getElementById("netCode"),
  status: document.getElementById("netStatus"),
  badge: document.getElementById("netBadge")
};
netEls.name.value = nameInput.value;
document.getElementById("netCreate").addEventListener("click", () => netConnect({ create: true }));
document.getElementById("netJoin").addEventListener("click", () => {
  const code = netEls.code.value.trim();
  if (code.length === 4) {
    netConnect({ room: code });
  } else {
    netEls.status.textContent = currentLanguage === "ru" ? "Введи код из 4 цифр" : "Enter the 4-digit code";
  }
});
netEls.badge.addEventListener("click", () => {
  const link = `${location.origin}/?room=${net.room}`;
  if (navigator.clipboard) navigator.clipboard.writeText(link).catch(() => {});
  showToast(currentLanguage === "ru" ? `Ссылка скопирована: ${link}` : `Link copied: ${link}`);
});
const netInviteCode = (new URLSearchParams(location.search).get("room") || "").replace(/\D/g, "").slice(0, 4);
if (netInviteCode) {
  netEls.code.value = netInviteCode;
  if (netEls.name.value.trim() && location.protocol !== "file:") {
    // пришли по ссылке или вернулись из другой игры платформы — сразу в ту же комнату
    window.setTimeout(() => netConnect({ room: netInviteCode, auto: true }), 300);
  } else {
    netEls.status.textContent = currentLanguage === "ru" ? "Код уже вписан — впиши имя и жми «Войти»" : "Code is filled in — enter your name and press Join";
  }
}

// ---------- Планшет: джойстик и кнопки вместо клавиатуры ----------
const isTouchDevice = new URLSearchParams(location.search).has("touch") || window.matchMedia("(hover: none) and (pointer: coarse)").matches;
if (isTouchDevice) {
  document.body.classList.add("touch-mode");
  sun.castShadow = false; // на планшете без теней игра идёт заметно плавнее
  setupTouchControls();
  resizeRenderer();
}

const LEG_THIGH = 2.5;
const LEG_SHIN = 2.35;
const AVATAR_ANKLE_HEIGHT = 0.68;
// ---------- Реалистичная картинка ----------
// На планшете всё это выключено: там важнее плавность
const gfx = { low: isTouchDevice, classic: true, tier: "high", post: false, envDay: null, envNight: null, sky: null, detail: null, frame: null, tick: 0, foliage: [], clock: 0, frames: 0 };
// Встроенная видеокарта не тянет полную обработку кадра: там тот же вид, но без свечения
(() => {
  const gl = renderer.getContext();
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const name = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
  const asked = new URLSearchParams(location.search).get("gfx");
  gfx.tier = asked || (/Radeon\(TM\) Graphics|Radeon Graphics|Vega|Intel|UHD|Iris|SwiftShader|llvmpipe|Microsoft Basic/i.test(name) ? "medium" : "high");
  let smooth = false;
  try { smooth = window.localStorage.getItem("blobloxSmoothMode") === "1"; } catch (error) { smooth = false; }
  gfx.sharpRatio = isTouchDevice ? 1.25 : gfx.tier === "high" ? 2 : 1.5;
  gfx.smooth = smooth;
  window.gfxMaxRatio = smooth ? 1 : gfx.sharpRatio;

})();
const avatarGeo = {};
const treeCards = [];

// Солнце ниже к горизонту: длинные тени и тёплый свет
SUN_OFFSET.set(150, 175, 105);
if (!gfx.low) {
  const shadowReach = gfx.tier === "high" ? 110 : 85;
  sun.shadow.mapSize.setScalar(gfx.tier === "high" ? 4096 : 2048);
  sun.shadow.camera.left = -shadowReach;
  sun.shadow.camera.right = shadowReach;
  sun.shadow.camera.top = shadowReach;
  sun.shadow.camera.bottom = -shadowReach;
  if (gfx.tier !== "high") renderer.shadowMap.type = THREE.PCFShadowMap; // вдвое меньше выборок на пиксель
  renderer.shadowMap.autoUpdate = false; // солнце стоит на месте, тени не нужно считать каждый кадр
  renderer.shadowMap.needsUpdate = true;
  sun.shadow.camera.far = 620;
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.06;
  sun.shadow.camera.updateProjectionMatrix();
}
dayNightConfig.dayFog.set(0xa8dcff);
dayNightConfig.nightFog.set(0x0c1424);
scene.fog.near = 340;
scene.fog.far = 1750;

// Ткань, волосы и кожа: мелкий рельеф вместо гладкого пластика
(() => {
  const makeBump = (draw) => {
    const image = document.createElement("canvas");
    image.width = 256;
    image.height = 256;
    const context = image.getContext("2d");
    context.fillStyle = "#808080";
    context.fillRect(0, 0, 256, 256);
    draw(context);
    const texture = new THREE.CanvasTexture(image);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  };
  const cloth = makeBump((context) => {
    for (let i = 0; i < 2600; i += 1) {
      const value = 96 + Math.floor(Math.random() * 64);
      context.fillStyle = `rgb(${value},${value},${value})`;
      context.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
    }
    context.lineCap = "round";
    for (let i = 0; i < 26; i += 1) {
      const dark = Math.random() < 0.5;
      context.strokeStyle = dark ? "rgba(40,40,40,0.2)" : "rgba(210,210,210,0.2)";
      context.lineWidth = 5 + Math.random() * 12;
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      context.beginPath();
      context.moveTo(x, y);
      context.quadraticCurveTo(x + 40 - Math.random() * 80, y + 40, x + 60 - Math.random() * 120, y + 90);
      context.stroke();
    }
  });
  const strands = makeBump((context) => {
    for (let i = 0; i < 900; i += 1) {
      const value = 50 + Math.floor(Math.random() * 150);
      context.strokeStyle = `rgba(${value},${value},${value},0.5)`;
      context.lineWidth = 1 + Math.random() * 1.5;
      const x = Math.random() * 256;
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x + 18 - Math.random() * 36, 256);
      context.stroke();
    }
  });
  [avatarMaterials.body, avatarMaterials.accent, avatarMaterials.pants].forEach((material) => {
    material.bumpMap = cloth;
    material.bumpScale = 0.012;
    material.roughness = 0.88;
  });
  avatarMaterials.hair.bumpMap = strands;
  avatarMaterials.hair.bumpScale = 0.08;
  avatarMaterials.hair.roughness = 0.42;
  avatarMaterials.skin.roughness = 0.5;
  avatarMaterials.faceSkin = avatarMaterials.skin.clone();
  avatarMaterials.faceSkin.vertexColors = true;
  avatarMaterials.white.roughness = 0.18;
  avatarMaterials.iris.roughness = 0.12;
})();

setupGraphics();

let cockpitCar = null;

const realHuman = { ready: false, clips: null, scene: null, scale: 1 }; // готовая модель отключена: человечки как в Roblox

// Три типа тела, как в Roblox: парень, девушка и мальчик
const AVATAR_BODY_TYPES = {
  man: { width: 1, height: 1, depth: 1, shoulder: 1.48, hip: 0.5, arm: 1, leg: 1, size: 1, head: 1 },
  girl: { width: 0.86, height: 0.97, depth: 0.92, shoulder: 1.31, hip: 0.47, arm: 0.84, leg: 0.92, size: 0.95, head: 1.03 },
  boy: { width: 0.94, height: 0.84, depth: 0.94, shoulder: 1.4, hip: 0.48, arm: 0.92, leg: 0.95, size: 0.8, head: 1.16 }
};

// ---------- Езда: перевод скорости, коробка передач, следы шин ----------
const SPEED_TO_KMH = 2.4;
const FLYER_ROAD_TOP = 54;
const driveSettings = { gearbox: false };
try { driveSettings.gearbox = window.localStorage.getItem("blobloxGearbox") === "1"; } catch (error) { driveSettings.gearbox = false; }
const SKID_MAX = 700;
const skidTmp = new THREE.Object3D();
const skidMarks = (() => {
  const geometry = new THREE.PlaneGeometry(1, 1);
  geometry.rotateX(-Math.PI / 2);
  const mesh = new THREE.InstancedMesh(geometry, new THREE.MeshBasicMaterial({
    color: 0x101112, transparent: true, opacity: 0.5, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3
  }), SKID_MAX);
  const hidden = new THREE.Matrix4().makeScale(0, 0, 0);
  for (let i = 0; i < SKID_MAX; i += 1) mesh.setMatrixAt(i, hidden);
  mesh.frustumCulled = false;
  mesh.visible = false;
  mesh.renderOrder = 1;
  scene.add(mesh);
  return { mesh, next: 0 };
})();

// ---------- Лес: деревья пачками, тропинки, грибы и костры ----------
const forestBatch = new Map();
const forestLanes = { dirt: [], foot: [] };
const forestMushrooms = [];
const forestFires = [];
const FOREST_AREA = { minX: -262, maxX: 182, minZ: -612, maxZ: -262 };
const mushroomState = { count: 0, frying: null, scan: 0 };
try { mushroomState.count = Number(window.localStorage.getItem("blobloxMushrooms")) || 0; } catch (error) { mushroomState.count = 0; }
const forestAmbience = { nodes: null, nextChirp: 0, mix: 0 };
const mushroomChipEl = document.getElementById("mushroomChip");
const forestTmp = { object: new THREE.Object3D(), color: new THREE.Color() };
const FOREST_GREENS = [0x3f7a32, 0x4b8a38, 0x557f2e, 0x3a6e2c, 0x5c8f3a, 0x486f2a];
const forestTreeRandom = { value: 777 };

// ---------- Природа: вода, холмы, поля ----------
const WATER_LEVEL = 0.05;
const lakes = [];
const waterMaterials = [];
const fieldCrops = new Map();
const cropWind = { shaders: [], time: { value: 0 } };
const reliefState = { grid: null, cell: 4, min: -760, count: 380, terrain: null, lanes: [], ready: false, underwater: false, splash: 0 };
const underwaterEl = document.getElementById("underwater");

// ---------- Детали: доски, листья, травинки ----------
const walkDecks = [];
const woodState = { texture: null, vertical: null, materials: new Map(), metal: null };
const fallingLeaves = { mesh: null, items: [] };

const localGrass = { mesh: null, x: 1e9, z: 1e9, cell: 1.25, radius: 34, max: 3200, cache: new Map() };

// ---------- Дома: фасады, балконы, подъезды, дачи и пентхаусы ----------
var facadeMaterials = [];
var skyLifts = [];
const houseCache = new Map();
const houseChimneys = [];
const houseState = { street: 0, chimneyTimer: 0 };

// ---------- Подъезды, этажи с квартирами и лифты ----------
const liftBuildings = [];
const virtualFloor = { key: "", group: null, colliders: [], y: 0, height: 8, building: null, deck: { x: 0, z: 0, cos: 1, sin: 0, hw: -1, hl: -1, top: 0 } };
walkDecks.push(virtualFloor.deck);
const TOWER_SCALE = 1.5;

// ---------- Проспект в центре: исторические дома, переходы, фонари ----------
const AVENUE_Z = 40;
const avenueUnderpasses = [];
const avenueState = { cooldown: 0 };

const houseInteriors = [];
const houseInteriorState = { timer: 0 };

const mergeVertexMaterials = new Map();

createAvatar();
createMissionMarker();
createRoadGuide();
createTaxiPassenger();
initHubAvatarPreview();
initSidebarAvatarPreview();
buildWorld();
buildParkourWorld();
spawnNpcs();
player.position.copy(safeSpawn);
avatar.position.copy(player.position);
previousPlayerPosition.copy(player.position);
resetThirdPersonCamera();
resizeRenderer();
hideOverlay();
setGameVisibility(null);
applyDayNightLighting();
backToHubButton.classList.add("hidden");
settingsPanel.classList.add("collapsed");
updateHubAvatarPreview();
renderCatalog();
updatePhoneUi();
applyLanguage();
updateUi();

// Далёкие машины и прохожие не рисуем — их всё равно почти не видно
let cullFrame = 0;
function updateDistanceCulling() {
  cullFrame += 1;
  if (cullFrame % 15 !== 0) {
    return;
  }
  const px = player.position.x;
  const pz = player.position.z;
  cars.forEach((car) => {
    car.group.visible = car.flying || car === state.currentVehicle || Math.hypot(car.group.position.x - px, car.group.position.z - pz) < 160;
  });
  dealershipDisplays.forEach((display) => {
    display.car.group.parent.visible = Math.hypot(display.x - px, display.z - pz) < 320;
  });
  npcs.forEach((npc) => {
    npc.group.visible = Math.hypot(npc.group.position.x - px, npc.group.position.z - pz) < 170;
  });
}

// ---------- Анимации мира (колесо обозрения, мельница, витрины автосалона) ----------
function updateWorldAnimations(delta) {
  if (state.currentGame !== "city" || state.inHub) {
    return;
  }
  const time = clock.elapsedTime;
  worldAnimations.forEach((animateItem) => animateItem(delta, time));
}

// ---------- Автосалон: покупка машин за монеты ----------
const OWNED_CARS_KEY = "blobloxOwnedCars";
const ownedCars = [];

function loadOwnedCars() {
  try {
    const raw = window.localStorage.getItem(OWNED_CARS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    if (Array.isArray(list)) {
      list.forEach((entry) => {
        if (entry && CAR_MODELS[entry.modelId]) {
          ownedCars.push({ modelId: entry.modelId, color: entry.color || "#d83a3a" });
        }
      });
    }
  } catch (error) {
    console.warn("Could not load owned cars", error);
  }
}

function saveOwnedCars() {
  try {
    window.localStorage.setItem(OWNED_CARS_KEY, JSON.stringify(ownedCars));
  } catch (error) {
    console.warn("Could not save owned cars", error);
  }
}

// Купленные машины стоят на парковке перед автосалоном
function spawnOwnedCar(entry, index) {
  const spot = ownedCarSpots[index % ownedCarSpots.length];
  if (!spot) {
    return null;
  }
  const car = addCar(spot.x, spot.z, entry.modelId, entry.color, spot.rotation);
  car.owned = true;
  return car;
}

function findNearestDisplay() {
  if (state.currentGame !== "city" || state.currentVehicle || state.inHub) {
    return null;
  }
  let nearest = null;
  let best = Infinity;
  dealershipDisplays.forEach((display) => {
    const distance = Math.hypot(player.position.x - display.x, player.position.z - display.z);
    if (distance < best) {
      best = distance;
      nearest = display;
    }
  });
  return best <= 9.5 ? nearest : null;
}

function tryBuyNearestCar() {
  const display = findNearestDisplay();
  if (!display) {
    return;
  }
  const spec = CAR_MODELS[display.modelId];
  const name = currentLanguage === "ru" ? spec.ru : spec.en;
  if (state.coins < spec.price) {
    const missing = spec.price - state.coins;
    showToast(currentLanguage === "ru"
      ? `Не хватает ${missing} монет на ${name}. Заработай их на работе в телефоне!`
      : `You need ${missing} more coins for the ${name}. Earn them with jobs in your phone!`);
    return;
  }
  state.coins -= spec.price;
  recordTransaction(-spec.price, currentLanguage === "ru" ? `Покупка: ${spec.ru}` : `Bought: ${spec.en}`);
  pushPhoneMessage(currentLanguage === "ru" ? "Автосалон" : "Dealership", currentLanguage === "ru" ? `Спасибо за покупку ${spec.ru}! Машину можно вызвать в приложении «Гараж» 🚗` : `Thanks for buying the ${spec.en}! Call it any time in the Garage app 🚗`);
  const entry = { modelId: display.modelId, color: display.color };
  ownedCars.push(entry);
  saveOwnedCars();
  saveAvatarSettings();
  updatePhoneUi();
  spawnOwnedCar(entry, ownedCars.length - 1);
  showToast(currentLanguage === "ru"
    ? `Поздравляем! ${name} теперь твоя. Она ждёт на парковке перед салоном 🚗`
    : `Congrats! The ${name} is yours. It is waiting in the lot out front 🚗`);
}

// ---------- Подсказка действия внизу экрана ----------
const interactPrompt = document.getElementById("interactPrompt");

// ---------- Подсказка внизу экрана ----------
function updateInteractPrompt() {
  if (!interactPrompt) {
    return;
  }
  let html = "";
  if (!state.inHub && state.currentGame === "city") {
    const ru = currentLanguage === "ru";
    const vehicle = state.currentVehicle;
    if (vehicle && vehicle.flying) {
      if (vehicle.wallPhase) {
        html = ru
          ? "<kbd>W</kbd><kbd>S</kbd> ехать по стене · <kbd>A</kbd><kbd>D</kbd> поворот · <kbd>G</kbd> отлипнуть · <kbd>1</kbd><kbd>3</kbd> вид"
          : "<kbd>W</kbd><kbd>S</kbd> drive the wall · <kbd>A</kbd><kbd>D</kbd> turn · <kbd>G</kbd> let go · <kbd>1</kbd><kbd>3</kbd> view";
      } else if (vehicle.nearWall) {
        html = ru ? "<kbd>G</kbd> развернуться на стену 🧲" : "<kbd>G</kbd> flip onto the wall 🧲";
      } else {
        html = ru
          ? "<kbd>Пробел</kbd> вверх · <kbd>C</kbd> вниз · <kbd>W</kbd><kbd>S</kbd> вперёд/назад · <kbd>A</kbd><kbd>D</kbd> поворот · <kbd>Shift</kbd> турбо · <kbd>1</kbd><kbd>3</kbd> вид · <kbd>R</kbd> выйти"
          : "<kbd>Space</kbd> up · <kbd>C</kbd> down · <kbd>W</kbd><kbd>S</kbd> fly · <kbd>A</kbd><kbd>D</kbd> turn · <kbd>Shift</kbd> boost · <kbd>1</kbd><kbd>3</kbd> view · <kbd>R</kbd> exit";
      }
    } else if (vehicle) {
      html = ru
        ? "<kbd>W</kbd><kbd>S</kbd> газ/тормоз · <kbd>A</kbd><kbd>D</kbd> руль · <kbd>Пробел</kbd> ручник · <kbd>H</kbd> гудок · <kbd>R</kbd> выйти"
        : "<kbd>W</kbd><kbd>S</kbd> drive/brake · <kbd>A</kbd><kbd>D</kbd> steer · <kbd>Space</kbd> handbrake · <kbd>H</kbd> horn · <kbd>R</kbd> exit";
    } else {
      const display = findNearestDisplay();
      const nearCar = findNearestCar();
      const shop = getNearbyShop();
      const mushroom = findNearestMushroom();
      const fire = findNearestCampfire();
      const lift = findNearestSkyLift();
      if (lift) {
        const here = lift.lb.stops[lift.index].label;
        html = ru ? `<kbd>F</kbd> вызвать лифт 🛗 · ${lift.lb.name}, этаж ${here}` : `<kbd>F</kbd> call the lift 🛗 · floor ${here}`;
      } else if (display) {
        const spec = CAR_MODELS[display.modelId];
        html = ru
          ? `${spec.ru} — ${spec.price} монет (у тебя ${state.coins}) · <kbd>F</kbd> купить`
          : `${spec.en} — ${spec.price} coins (you have ${state.coins}) · <kbd>F</kbd> buy`;
      } else if (shop) {
        html = ru ? `${shop.name} · <kbd>F</kbd> открыть меню` : `${shop.name} · <kbd>F</kbd> open menu`;
      } else if (mushroom) {
        html = mushroom.type === "amanita"
          ? (ru ? "Мухомор — его не собирают 🍄" : "Fly agaric — don't pick it 🍄")
          : (ru ? `<kbd>F</kbd> собрать гриб 🍄 (в корзинке ${mushroomState.count})` : `<kbd>F</kbd> pick mushroom 🍄 (${mushroomState.count})`);
      } else if (fire) {
        html = mushroomState.frying
          ? (ru ? "🍳 Грибы жарятся…" : "🍳 Frying…")
          : (ru ? `<kbd>F</kbd> пожарить грибы 🔥 (${mushroomState.count} шт)` : `<kbd>F</kbd> fry mushrooms 🔥 (${mushroomState.count})`);
      } else if (nearCar) {
        html = nearCar.car.flying
          ? (ru ? "<kbd>R</kbd> сесть в летающую машину 🛸" : "<kbd>R</kbd> get in the flying car 🛸")
          : (ru ? "<kbd>R</kbd> сесть в машину" : "<kbd>R</kbd> get in the car");
      }
    }
  }
  if (html !== interactPrompt.dataset.html) {
    interactPrompt.innerHTML = html;
    interactPrompt.dataset.html = html;
  }
  interactPrompt.classList.toggle("hidden", !html);
}

// ---------- Карта ----------
const MAP_HALF = 640;
const minimapEl = document.getElementById("minimap");
const minimapCanvas = document.getElementById("minimapCanvas");
const minimapPlaceEl = document.getElementById("minimapPlace");
const bigMapEl = document.getElementById("bigMap");
const bigMapCanvas = document.getElementById("bigMapCanvas");
let worldMapCanvas = null;

// ---------- Карта: мир больше не квадратный ----------
function buildWorldMapImage() {
  worldMapCanvas = document.createElement("canvas");
  worldMapCanvas.width = MAP_W;
  worldMapCanvas.height = MAP_H;
  const ctx = worldMapCanvas.getContext("2d");
  const mx = (x) => x - MAP_MIN_X;
  const mz = (z) => z - MAP_MIN_Z;

  ctx.fillStyle = "#8d8478";
  ctx.fillRect(0, 0, MAP_W, MAP_H);
  ctx.fillStyle = "#a9d68f";
  ctx.beginPath();
  for (let i = 0; i <= 180; i += 1) {
    const angle = (i / 180) * Math.PI * 2;
    const r = worldBoundaryRadius(angle) - 6;
    const px = mx(Math.cos(angle) * r);
    const pz = mz(Math.sin(angle) * r);
    if (i === 0) ctx.moveTo(px, pz);
    else ctx.lineTo(px, pz);
  }
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.arc(mx(VALLEY.x), mz(VALLEY.z), VALLEY.r + 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(mx(500), mz(TUNNEL.z - TUNNEL.half - 2), TUNNEL.x1 - 500 + 20, TUNNEL.half * 2 + 4);

  const areaColors = { forest: "rgba(63, 125, 70, 0.45)", park: "#7cc96b", water: "#4a9be0", field: "#d9c25a", lot: "#7a8089", plaza: "#cfcac0" };
  ["forest", "field", "park", "lot", "plaza", "water"].forEach((type) => {
    mapAreas.filter((area) => area.type === type).forEach((area) => {
      ctx.fillStyle = areaColors[type];
      if (area.r) {
        ctx.beginPath();
        ctx.arc(mx(area.x), mz(area.z), area.r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(mx(area.x - area.w / 2), mz(area.z - area.d / 2), area.w, area.d);
      }
    });
  });
  ctx.fillStyle = "#cfcac0";
  sidewalkRects.forEach((rect) => ctx.fillRect(mx(rect.minX), mz(rect.minZ), rect.maxX - rect.minX, rect.maxZ - rect.minZ));
  ctx.fillStyle = "#4f545c";
  roads.forEach((road) => ctx.fillRect(mx(road.x - road.width / 2), mz(road.z - road.depth / 2), road.width, road.depth));
  ctx.fillStyle = "#2b2f36";
  ctx.fillRect(mx(TUNNEL.x0), mz(TUNNEL.z - TUNNEL.half - 2), TUNNEL.x1 - TUNNEL.x0, TUNNEL.half * 2 + 4);
  ctx.fillStyle = "#f2c230";
  ctx.fillRect(mx(-432), mz(HIGHWAY_Z) - 1, TUNNEL.x0 + 432, 2);
  buildings.forEach((building) => {
    ctx.fillStyle = building.style === "tower" ? "#7fb0dc" : building.style === "showroom" ? "#ff7a8a" : building.style === "cottage" ? "#e9b48a" : "#ece3d6";
    ctx.strokeStyle = "#7d7266";
    ctx.lineWidth = 1.5;
    ctx.fillRect(mx(building.x - building.width / 2), mz(building.z - building.depth / 2), building.width, building.depth);
    ctx.strokeRect(mx(building.x - building.width / 2), mz(building.z - building.depth / 2), building.width, building.depth);
  });
}

function drawMapIcons(ctx, project, iconSize) {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${iconSize}px "Segoe UI Emoji", sans-serif`;
  mapIcons.forEach((icon) => {
    const [x, y] = project(icon.x, icon.z);
    ctx.fillText(icon.icon, x, y);
  });
}

function drawPlayerArrow(ctx, x, y, angle, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(size, 0);
  ctx.lineTo(-size * 0.7, size * 0.65);
  ctx.lineTo(-size * 0.35, 0);
  ctx.lineTo(-size * 0.7, -size * 0.65);
  ctx.closePath();
  ctx.fillStyle = "#ff3b5c";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2.5;
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function getMissionTarget() {
  const stage = state.activeJob ? state.activeJob.stages[state.activeJob.stageIndex] : null;
  if (!stage) return null;
  return stage.car ? { x: stage.car.group.position.x, z: stage.car.group.position.z } : { x: stage.x, z: stage.z };
}

function updateMinimap() {
  const show = !state.inHub && state.currentGame === "city";
  if (minimapEl) minimapEl.classList.toggle("hidden", !show);
  if (!show || !minimapCanvas || !worldMapCanvas) {
    return;
  }
  const ctx = minimapCanvas.getContext("2d");
  const size = minimapCanvas.width;
  const half = size / 2;
  const zoom = state.currentVehicle ? (state.currentVehicle.flying ? 0.4 : 0.55) : 0.85;
  const forward = getCameraForwardAngle();
  const rotation = -Math.PI / 2 - Math.atan2(Math.cos(forward), Math.sin(forward));
  const px = player.position.x;
  const pz = player.position.z;

  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.beginPath();
  ctx.arc(half, half, half, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = "#8d8478";
  ctx.fillRect(0, 0, size, size);
  ctx.translate(half, half);
  ctx.rotate(rotation);
  ctx.scale(zoom, zoom);
  ctx.drawImage(worldMapCanvas, -(px - MAP_MIN_X), -(pz - MAP_MIN_Z));
  ctx.restore();

  const project = (x, z) => {
    const dx = (x - px) * zoom;
    const dz = (z - pz) * zoom;
    return [half + dx * Math.cos(rotation) - dz * Math.sin(rotation), half + dx * Math.sin(rotation) + dz * Math.cos(rotation)];
  };
  ctx.save();
  ctx.beginPath();
  ctx.arc(half, half, half, 0, Math.PI * 2);
  ctx.clip();
  drawMapIcons(ctx, project, 16);
  const target = getMissionTarget();
  if (target) {
    let [tx, ty] = project(target.x, target.z);
    const dx = tx - half;
    const dy = ty - half;
    const distance = Math.hypot(dx, dy);
    if (distance > half - 12) {
      tx = half + (dx / distance) * (half - 12);
      ty = half + (dy / distance) * (half - 12);
    }
    ctx.beginPath();
    ctx.arc(tx, ty, 7, 0, Math.PI * 2);
    ctx.fillStyle = "#ffd166";
    ctx.strokeStyle = "#1d1f24";
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();

  drawPlayerArrow(ctx, half, half, Math.atan2(Math.cos(player.angle), Math.sin(player.angle)) + rotation, 10);
  const northAngle = -Math.PI / 2 + rotation;
  ctx.font = "bold 15px Segoe UI";
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "rgba(0,0,0,0.6)";
  ctx.lineWidth = 3;
  const nx = half + Math.cos(northAngle) * (half - 14);
  const ny = half + Math.sin(northAngle) * (half - 14);
  const letter = currentLanguage === "ru" ? "С" : "N";
  ctx.strokeText(letter, nx, ny);
  ctx.fillText(letter, nx, ny);

  if (minimapPlaceEl) {
    let text = state.district || "";
    if (state.insideBuilding !== null && state.insideBuilding !== undefined) {
      const building = buildings[state.insideBuilding];
      if (building && building.floors > 1) {
        const floor = getBuildingFloorIndex(building, player.position.y) + 1;
        text += currentLanguage === "ru" ? ` · ${floor} этаж` : ` · floor ${floor}`;
      }
    }
    if (minimapPlaceEl.textContent !== text) minimapPlaceEl.textContent = text;
  }
}

function renderBigMap() {
  if (!bigMapCanvas || !worldMapCanvas) {
    return;
  }
  const ctx = bigMapCanvas.getContext("2d");
  const scale = bigMapCanvas.width / MAP_W;
  ctx.clearRect(0, 0, bigMapCanvas.width, bigMapCanvas.height);
  ctx.drawImage(worldMapCanvas, 0, 0, bigMapCanvas.width, bigMapCanvas.height);
  const project = (x, z) => [(x - MAP_MIN_X) * scale, (z - MAP_MIN_Z) * scale];
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  mapLabels.forEach((label) => {
    const [x, y] = project(label.x, label.z);
    ctx.font = `bold ${label.size + 2}px Segoe UI`;
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.fillStyle = "#1d2633";
    ctx.strokeText(label.text, x, y);
    ctx.fillText(label.text, x, y);
  });
  ctx.font = "bold 16px Segoe UI";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(currentLanguage === "ru" ? "Горы" : "Mountains", bigMapCanvas.width * 0.4, 16);
  drawMapIcons(ctx, project, 18);
  cars.filter((car) => car.owned).forEach((car) => {
    const [x, y] = project(car.group.position.x, car.group.position.z);
    ctx.fillStyle = "#3f7fd6";
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
  const target = getMissionTarget();
  if (target) {
    const [tx, ty] = project(target.x, target.z);
    ctx.beginPath();
    ctx.arc(tx, ty, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#ffd166";
    ctx.strokeStyle = "#1d1f24";
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
  }
  const [px, py] = project(player.position.x, player.position.z);
  drawPlayerArrow(ctx, px, py, Math.atan2(Math.cos(player.angle), Math.sin(player.angle)), 11);
}

function openBigMap() {
  if (!bigMapEl || state.inHub || state.currentGame !== "city") return;
  document.getElementById("bigMapTitle").textContent = currentLanguage === "ru" ? "Карта мира" : "World Map";
  bigMapEl.classList.remove("hidden");
  renderBigMap();
}

function closeBigMap() {
  if (bigMapEl) bigMapEl.classList.add("hidden");
}

function toggleBigMap() {
  if (!bigMapEl) return;
  if (bigMapEl.classList.contains("hidden")) openBigMap();
  else closeBigMap();
}

if (bigMapEl) {
  document.getElementById("bigMapClose").addEventListener("click", closeBigMap);
  bigMapEl.addEventListener("pointerdown", (event) => {
    if (event.target === bigMapEl) closeBigMap();
  });
}

// Граница мира не квадратная: радиус «гуляет» по кругу, поэтому горы идут волнистым кольцом
function worldBoundaryRadius(angle) {
  return 655 + 30 * Math.sin(3 * angle + 0.5) + 18 * Math.cos(5 * angle);
}

function distanceOutsideMain(x, z) {
  return Math.hypot(x, z) - worldBoundaryRadius(Math.atan2(z, x));
}

function inValley(x, z, margin = 0) {
  return Math.hypot(x - VALLEY.x, z - VALLEY.z) < VALLEY.r + margin;
}

function inTunnelCorridor(x, z) {
  return x > 500 && x < TUNNEL.x1 + 12 && Math.abs(z - TUNNEL.z) < TUNNEL.half;
}

function isInsideWorld(x, z) {
  return distanceOutsideMain(x, z) < -14 || inValley(x, z, 6) || inTunnelCorridor(x, z);
}

// Стена этажа с полосой окон (для верхних этажей домов)
function addWindowWall(addBox, materials, alongX, length, cx, cz, yBase, wall) {
  const { body, glass, frame } = materials;
  const w = (size) => (alongX ? size : wall);
  const d = (size) => (alongX ? wall : size);
  addBox(w(length), 1.6, d(length), cx, yBase + 0.8, cz, body);
  addBox(w(length), 2.4, d(length), cx, yBase + 6.8, cz, body);
  addBox(alongX ? length - 1.2 : 0.08, 4, alongX ? 0.08 : length - 1.2, cx, yBase + 3.6, cz, glass, false, false);
  const posts = Math.max(2, Math.round(length / 4.5));
  for (let i = 0; i <= posts; i += 1) {
    const offset = -length / 2 + (length * i) / posts;
    const px = alongX ? cx + offset : cx;
    const pz = alongX ? cz : cz + offset;
    addBox(alongX ? 0.4 : wall, 4, alongX ? wall : 0.4, px, yBase + 3.6, pz, frame, false);
  }
}

function toBuildingLocal(building, x, z) {
  const f = building.facing || 1;
  return { x: (x - building.x) * f, z: (z - building.z) * f };
}

function inStairStrip(building, local) {
  const s = building.stairs;
  return Boolean(s) && local.x > s.sx0 && local.x < s.sx1 && local.z > s.zHigh && local.z < s.zLow;
}

function getBuildingFloorIndex(building, y) {
  return THREE.MathUtils.clamp(Math.floor((y + 1) / FLOOR_HEIGHT), 0, building.floors - 1);
}

function getBuildingCeiling(building, y) {
  if (virtualFloor.key && y >= virtualFloor.y - 1) return virtualFloor.y + virtualFloor.height - 0.45;
  const k = getBuildingFloorIndex(building, y);
  return k * FLOOR_HEIGHT + building.groundHeight - 0.45;
}

// Тоннель сквозь горы и долина с городком «Горный»
function buildTunnelAndValley() {
  const z = TUNNEL.z;
  const x0 = TUNNEL.x0;
  const x1 = TUNNEL.x1;
  const length = x1 - x0;
  addRoadSurface((x0 + x1) / 2, z, length, HIGHWAY_WIDTH);
  [-1, 1].forEach((side) => {
    addMarkingRect("white", (x0 + x1) / 2, z + side * (HIGHWAY_WIDTH / 2 - 0.8), length, 0.3);
    for (let x = x0 + 4; x < x1 - 4; x += 12) addMarkingRect("white", x + 2.5, z + side * 0.4, 5, 0.25);
  });
  const concrete = new THREE.MeshStandardMaterial({ color: 0x6e6b66, roughness: 0.9 });
  const lightMaterial = new THREE.MeshStandardMaterial({ color: 0xfff3cf, emissive: 0xffd88a, emissiveIntensity: 1.2 });
  [-1, 1].forEach((side) => {
    addStaticBox(length, 18, 2, (x0 + x1) / 2, 9, z + side * (HIGHWAY_WIDTH / 2 + 1), concrete, { collider: true, cameraBlock: true });
  });
  addStaticBox(length, 2, HIGHWAY_WIDTH + 4, (x0 + x1) / 2, 19, z, concrete);
  for (let x = x0 + 8; x < x1; x += 14) {
    [-1, 1].forEach((side) => addStaticBox(4, 0.3, 0.6, x, 16.5, z + side * 10, lightMaterial, { castShadow: false }));
  }
  addTunnelPortal(x0, z, 1);
  addTunnelPortal(x1, z, -1);

  // дорога из тоннеля к площади городка
  const plazaR = 32;
  addSimpleRoad(true, z, x1, VALLEY.x - plazaR + 2, 16);
  const plaza = new THREE.Mesh(new THREE.CylinderGeometry(plazaR, plazaR, 0.06, 48), paverMaterial);
  plaza.position.set(VALLEY.x, 0.03, z);
  plaza.receiveShadow = true;
  cityGroup.add(plaza);
  mapAreas.push({ type: "plaza", x: VALLEY.x, z, r: plazaR });
  // часовая башня в центре площади
  const stone = new THREE.MeshStandardMaterial({ color: 0xd8cfbf, roughness: 0.85 });
  addStaticBox(6, 16, 6, VALLEY.x, 8, z, stone, { collider: true, cameraBlock: true });
  const roof = new THREE.Mesh(new THREE.ConeGeometry(5, 6, 4), new THREE.MeshStandardMaterial({ color: 0x8a3b2e, roughness: 0.7 }));
  roof.position.set(VALLEY.x, 19, z);
  roof.rotation.y = Math.PI / 4;
  cityGroup.add(roof);
  [-1, 1].forEach((side) => {
    const clock = new THREE.Mesh(new THREE.CircleGeometry(1.8, 24), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x332200, roughness: 0.4 }));
    clock.position.set(VALLEY.x, 13, z + side * 3.02);
    if (side < 0) clock.rotation.y = Math.PI;
    cityGroup.add(clock);
  });

  // домики вокруг площади
  const homes = [
    ["Горный отель", "hotel", 0xf3e3c3, 0x7a3b2e], ["Лыжная лавка", "market", 0xd9ecf2, 0x2d5a8c], ["Кафе Вершина", "cafe", 0xf6d6d6, 0x8a3b3b],
    ["Шале 1", "residence", 0xe2efd9, 0x4c6b3a], ["Шале 2", "residence", 0xfff1b8, 0x9a5b2a], ["Шале 3", "residence", 0xe8dcf0, 0x6a4c86]
  ];
  let index = 0;
  [[z - plazaR - 7.5, 1], [z + plazaR + 7.5, -1]].forEach(([zc, facing]) => {
    [VALLEY.x - 30, VALLEY.x, VALLEY.x + 30].forEach((hx) => {
      const [name, type, body, roofColor] = homes[index];
      addBuilding({
        x: hx, z: zc, width: 18, depth: 14, height: 7, bodyColor: body, roofColor, windowColor: 0xfff5cc,
        name, type, style: "cottage", facing, signColor: "#5a3b24", showSign: type !== "residence"
      });
      index += 1;
    });
  });
  mapLabels.push({ text: "Горный", x: VALLEY.x, z: z - 60, size: 13 });
  mapIcons.push({ icon: "🏔️", x: VALLEY.x + 70, z: z + 60 });

  const random = makeRandom(55);
  for (let i = 0; i < 70; i += 1) {
    const angle = random() * Math.PI * 2;
    const r = 55 + random() * 90;
    const tx = VALLEY.x + Math.cos(angle) * r;
    const tz = z + Math.sin(angle) * r;
    if (Math.abs(tz - z) < 14 && tx < VALLEY.x) continue; // дорога
    if (Math.abs(tz - z) < 60 && Math.abs(tx - VALLEY.x) < 60) continue; // домики
    addPineTree(tx, tz, 0.9 + random() * 0.7);
  }
}

// Глянцевое стекло небоскрёбов: сетка окон, ночью светится
function getGlassTowerMaterial() {
  if (glassTowerMaterial) return glassTowerMaterial;
  const texture = makeCanvasTexture(128, (ctx, size) => {
    ctx.fillStyle = "#5a7d9c";
    ctx.fillRect(0, 0, size, size);
    const cell = size / 4;
    for (let cx = 0; cx < 4; cx += 1) {
      for (let cy = 0; cy < 4; cy += 1) {
        const lit = (cx * 7 + cy * 3) % 5 === 0;
        ctx.fillStyle = lit ? "#ffe9a8" : (cx + cy) % 2 ? "#8fc1e8" : "#79aed8";
        ctx.fillRect(cx * cell + 2, cy * cell + 2, cell - 4, cell - 4);
      }
    }
  });
  glassTowerMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, map: texture, emissive: 0xffffff, emissiveMap: texture, emissiveIntensity: 0.18, roughness: 0.15, metalness: 0.55 });
  buildingWindowMaterials.push(glassTowerMaterial);
  return glassTowerMaterial;
}

function addGlassBlock(w, h, d, x, y, z, rotationY = 0) {
  const geometry = new THREE.BoxGeometry(w, h, d);
  scaleBoxUv(geometry, w / 7, h / 7);
  const mesh = new THREE.Mesh(geometry, getGlassTowerMaterial());
  mesh.position.set(x, y, z);
  mesh.rotation.y = rotationY;
  mesh.castShadow = true;
  cityGroup.add(mesh);
  return mesh;
}

// Глянцевые башни Сити — в полтора раза шире прежних, чтобы внутри помещались квартиры
function addGlassTower(x, z, height, variant) {
  const S = TOWER_SCALE;
  const base = 10.8;
  const steel = new THREE.MeshStandardMaterial({ color: 0xc9d2dc, roughness: 0.3, metalness: 0.7 });
  const glow = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x9bf6ff, emissiveIntensity: 0.9 });
  if (variant === "twist") {
    const slabs = 32;
    const slabH = (height - base) / slabs;
    for (let i = 0; i < slabs; i += 1) {
      const plate = i % 2 === 1;
      const h = plate ? slabH - 0.25 : slabH;
      addGlassBlock(24 * S, h, 19 * S, x, base + i * slabH + h / 2, z, i * 0.05);
      if (plate) addStaticBox(24.4 * S, 0.25, 19.4 * S, x, base + (i + 1) * slabH - 0.12, z, steel, { castShadow: false, rotationY: i * 0.05 });
    }
  } else if (variant === "stepped") {
    [[28, 22, 0.45], [23, 18, 0.72], [17, 13, 0.92], [11, 9, 1]].reduce((bottom, [w0, d0, frac]) => {
      const w = w0 * S;
      const d = d0 * S;
      const top = base + (height - base) * frac;
      addGlassBlock(w, top - bottom, d, x, (top + bottom) / 2, z);
      towerFaces.push({ minX: x - w / 2, maxX: x + w / 2, minZ: z - d / 2, maxZ: z + d / 2, bottom, top });
      addStaticBox(w + 0.6, 0.6, d + 0.6, x, top, z, steel);
      return top;
    }, base);
  } else if (variant === "twin") {
    [[-7 * S, height], [7 * S, height * 0.8]].forEach(([dx, h]) => {
      addGlassBlock(12 * S, h - base, 16 * S, x + dx, (h + base) / 2, z);
      towerFaces.push({ minX: x + dx - 6 * S, maxX: x + dx + 6 * S, minZ: z - 8 * S, maxZ: z + 8 * S, bottom: base, top: h });
      addStaticBox(12 * S + 0.6, 1, 16 * S + 0.6, x + dx, h + 0.5, z, steel);
    });
    addGlassBlock(4 * S, 6 * S, 10 * S, x, height * 0.55, z);
  } else {
    const bodyTop = height - 18;
    addGlassBlock(24 * S, bodyTop - base, 20 * S, x, (bodyTop + base) / 2, z);
    towerFaces.push({ minX: x - 12 * S, maxX: x + 12 * S, minZ: z - 10 * S, maxZ: z + 10 * S, bottom: base, top: bodyTop });
    addGlassBlock(16 * S, 10, 14 * S, x, bodyTop + 5, z);
    addStaticBox(17 * S, 0.8, 15 * S, x, bodyTop + 10.4, z, steel);
    const spire = new THREE.Mesh(new THREE.ConeGeometry(2.2 * S, 16, 10), steel);
    spire.position.set(x, bodyTop + 18.8, z);
    cityGroup.add(spire);
    addStaticBox(0.6, 0.6, 0.6, x, bodyTop + 27, z, glow, { castShadow: false });
  }
  const crown = new THREE.Mesh(new THREE.TorusGeometry((variant === "stepped" ? 7 : 9) * S, 0.3, 6, 32), glow);
  crown.rotation.x = Math.PI / 2;
  crown.position.set(x, variant === "spire" ? height - 7.4 : height + 0.2, z);
  cityGroup.add(crown);
}

// Деловой квартал «Сити»: небоскрёбы с квартирами на каждом этаже и пентхаусом на крыше
function buildMoscowCity(cells) {
  const towers = [
    ["Башня Эволюция", "twist", 150], ["Башня Восток", "twin", 175],
    ["Башня Меркурий", "stepped", 130], ["Башня Шпиль", "spire", 140]
  ];
  cells.forEach(([cx, cz], index) => {
    const [name, variant, height] = towers[index % towers.length];
    const bz = cz - 4;
    addBuilding({
      x: cx, z: bz, width: 44, depth: 34, height: 10,
      bodyColor: 0xd9dee5, roofColor: 0x2b3442, windowColor: 0xffffff,
      name, type: "mall", style: "tower", signColor: "#1d2633", colliderHeight: height
    });
    addGlassTower(cx, bz, height, variant);
    addSkyPenthouse(cx, bz, variant, height, name, index);
    addWalkway(cx, bz + 17 + 3.4, cz + 23);
  });
  mapLabels.push({ text: "Сити", x: 120, z: -120, size: 15 });
  mapIcons.push({ icon: "🏙️", x: 120, z: -100 });
}

// Магазин на заправке: можно купить еду и напитки (F внутри)
function buildGasShop() {
  addBuilding({
    x: 300, z: 278, width: 22, depth: 14, height: 7,
    bodyColor: 0xf4f6f8, roofColor: 0xd93a3a, windowColor: 0xffffff,
    name: "Магазин 24/7", type: "market", style: "cottage", signColor: "#c81e3a"
  });
  addWalkway(300, 285 + 3.4, 290, 5);
}

// Поля с пшеницей и подсолнухами, сады, тюки сена — чтобы между районами не было пусто
function buildCountryside() {
  const wheat = [0xd9b44a, 0xc29a2e];
  const sunflower = [0x6f8f2e, 0xf2c230];
  const green = [0x6aa84f, 0x4f8a3a];
  [
    [-250, 420, 110, 70, wheat], [-90, 440, 90, 80, sunflower], [90, 430, 110, 70, wheat], [280, 430, 100, 70, green],
    [400, 400, 70, 50, wheat], [300, -300, 110, 70, wheat], [-330, -290, 100, 70, sunflower], [-380, -60, 80, 60, green],
    [330, -180, 70, 50, sunflower], [-250, 200, 60, 50, wheat]
  ].forEach(([x, z, w, d, [color, rowColor]]) => {
    if (!isInsideWorld(x - w / 2, z - d / 2) || !isInsideWorld(x + w / 2, z + d / 2)) return;
    addField(x, z, w, d, color, rowColor);
    if (color === wheat[0]) {
      const hay = new THREE.MeshStandardMaterial({ color: 0xe3c46a, roughness: 1 });
      for (let i = 0; i < 4; i += 1) {
        const bale = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 2.2, 14), hay);
        bale.rotation.z = Math.PI / 2;
        bale.position.set(x - w / 2 + 6 + i * 7, 1.4, z + d / 2 + 4);
        cityGroup.add(bale);
        addCollider({ minX: bale.position.x - 1.2, maxX: bale.position.x + 1.2, minZ: bale.position.z - 1.5, maxZ: bale.position.z + 1.5 });
      }
    }
  });

  // яблоневые сады
  const apple = new THREE.MeshStandardMaterial({ color: 0xd93a3a, roughness: 0.6 });
  [[-520, 280], [-190, 270], [520, 240]].forEach(([ox, oz]) => {
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 5; col += 1) {
        const tx = ox + col * 9;
        const tz = oz + row * 9;
        if (!isInsideWorld(tx, tz)) continue;
        addTree(tx, tz, 0.6, false);
        for (let a = 0; a < 3; a += 1) {
          const fruit = new THREE.Mesh(new THREE.SphereGeometry(0.28, 6, 5), apple);
          fruit.position.set(tx + Math.cos(a * 2.1) * 1.6, 3.2 + a * 0.3, tz + Math.sin(a * 2.1) * 1.6);
          cityGroup.add(fruit);
        }
      }
    }
    mapAreas.push({ type: "park", x: ox + 18, z: oz + 9, w: 44, d: 26 });
  });
}

// Тротуар вокруг всего города с разрывами там, где выезды
function addCityRingSidewalk(edge, width, exits) {
  const strip = (alongX, fixed, from, to) => {
    const cuts = exits.filter((e) => e.alongX === alongX && e.fixed === fixed).map((e) => e.at).sort((a, b) => a - b);
    let cursor = from;
    [...cuts.map((c) => [c - 13, c + 13]), [to, to]].forEach(([a, b]) => {
      if (a - cursor > 1) {
        if (alongX) {
          addSidewalkRect(cursor, a, fixed < 0 ? fixed - width : fixed, fixed < 0 ? fixed : fixed + width);
        } else {
          addSidewalkRect(fixed < 0 ? fixed - width : fixed, fixed < 0 ? fixed : fixed + width, cursor, a);
        }
      }
      cursor = b;
    });
  };
  strip(true, -edge, -edge - width, edge + width);
  strip(true, edge, -edge - width, edge + width);
  strip(false, -edge, -edge, edge);
  strip(false, edge, -edge, edge);
}

// ---------- Летающая машина ----------
// На земле едет как обычная. Пробел: сопла набирают тягу, из-под днища валит дым, колёса ложатся плашмя.
// G у стены дома: машина разворачивается на 90° и едет прямо по стене.
function addFlyingCar(x, z, rotationY, color = "#c2122c") {
  const car = addCar(x, z, "flyer", color, rotationY);
  car.flying = true;
  car.seat = flyingCars.length;
  car.maxSpeed = CAR_MODELS.flyer.maxSpeed;
  car.canopyOpen = 0;
  car.steerVisual = 0;
  car.wingDeploy = 0;
  car.smokeGround = 0;
  car.smokeJet = 0;
  car.smokeRear = 0;
  car.smokeWall = 0;
  car.floorY = 0;
  car.height = 0;
  car.lookYaw = 0;
  car.lookPitch = 0;
  car.screenTimer = 0;
  car.velocity = new THREE.Vector3();
  car.lastPosition = car.group.position.clone();
  car.chaseYaw = rotationY + car.headingOffset;
  resetFlyerPose(car);
  flyingCars.push(car);
  if (car.seat === 0) mapIcons.push({ icon: "🛸", x, z: z - 6 });
  return car;
}

function flyerBlocked(car, x, z, y) {
  const reach = car.halfLength - car.halfWidth * 0.9;
  const rotation = car.group.rotation.y;
  for (const along of [-reach, 0, reach]) {
    const px = x + along * Math.cos(rotation);
    const pz = z - along * Math.sin(rotation);
    for (const box of queryColliders(px, pz, car.halfWidth)) {
      // проём двери закрыт для машины целиком, иначе можно было бы влететь в дом
      const top = box.carOnly ? 12 : box.maxY !== undefined ? box.maxY : box.height || 2.5;
      if (box.minY !== undefined && y + 3 < box.minY) continue;
      if (y > top) continue;
      if (px > box.minX - car.halfWidth && px < box.maxX + car.halfWidth && pz > box.minZ - car.halfWidth && pz < box.maxZ + car.halfWidth) {
        return true;
      }
    }
  }
  return false;
}

function updateFlyer(car, delta) {
  const keys = state.keys;
  const input = {
    forward: (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0),
    turn: (keys.KeyA || keys.ArrowLeft ? 1 : 0) - (keys.KeyD || keys.ArrowRight ? 1 : 0),
    lift: (keys.Space ? 1 : 0) - (keys.KeyC || keys.ControlLeft ? 1 : 0),
    boost: 1
  };
  // баллоны со сжатым воздухом (~600 л): ускоритель их тратит, компрессор потихоньку накачивает обратно
  if (car.air === undefined) car.air = 1;
  const wantBoost = keys.ShiftLeft || keys.ShiftRight;
  if (wantBoost && car.air > 0.01) input.boost = 1.5;
  if (input.boost > 1 && input.forward > 0) car.air = Math.max(0, car.air - delta / 8);
  else car.air = Math.min(1, car.air + delta / (car.airborne ? 40 : 22));
  if (wantBoost && car.air <= 0.01 && !car.airWarned) {
    car.airWarned = true;
    showToast(currentLanguage === "ru" ? "💨 Воздух в баллонах кончился — компрессор накачивает" : "💨 Air tanks empty — compressor refilling");
  }
  if (car.air > 0.3) car.airWarned = false;
  car.lastDelta = delta;
  if (car.wallPhase) {
    updateFlyerOnWall(car, delta, input);
  } else {
    updateFlyerInAir(car, delta, input);
  }
  const position = car.group.position;
  if (delta > 0) {
    car.velocity.copy(position).sub(car.lastPosition).divideScalar(delta);
  }
  car.lastPosition.copy(position);
  updateFlyerVisuals(car, delta, input);
  updateCarSignals(car, delta, input.turn, !car.airborne && !car.wallPhase && Math.abs(car.forwardSpeed) > 1);
  emitFlyerSmoke(car, delta, input);
  updateFlyerSound(car, input);
  updateFlyerScreens(car, delta);

  car.speed = car.forwardSpeed;
  const forward = flyerTmp.a.set(1, 0, 0).applyQuaternion(car.group.quaternion);
  player.position.set(position.x, position.y, position.z);
  if (Math.hypot(forward.x, forward.z) > 0.2) {
    player.angle = Math.atan2(forward.x, forward.z);
  }
  player.velocity.set(0, 0, 0);
  player.grounded = true;
  previousPlayerPosition.copy(player.position);
  moveAmount = 0;
}

// ---------- Магазины: меню покупок ----------
function getNearbyShop() {
  if (state.currentGame !== "city" || state.currentVehicle || state.insideBuilding === null) {
    return null;
  }
  const building = buildings[state.insideBuilding];
  if (!/market|cafe|mall/.test(building.type) || player.position.y > FLOOR_HEIGHT - 1) {
    return null;
  }
  return building;
}

function renderShopMenu(building) {
  const menu = document.getElementById("shopMenu");
  const ru = currentLanguage === "ru";
  document.getElementById("shopMenuTitle").textContent = building.name;
  document.getElementById("shopMenuCoins").textContent = `${ru ? "Монеты" : "Coins"}: ${state.coins}`;
  const list = document.getElementById("shopMenuItems");
  list.innerHTML = SHOP_ITEMS.map((item, index) => {
    const [title, desc] = item[currentLanguage] || item.ru;
    return `<button class="shop-item" type="button" data-shop-index="${index}"${state.coins < item.price ? " disabled" : ""}>
      <span class="shop-item__icon">${item.icon}</span>
      <span class="shop-item__text"><b>${title}</b><small>${desc}</small></span>
      <span class="shop-item__price">${item.price}</span>
    </button>`;
  }).join("");
  list.querySelectorAll("[data-shop-index]").forEach((button) => {
    button.addEventListener("click", () => buyShopItem(SHOP_ITEMS[Number(button.dataset.shopIndex)], building));
  });
  menu.classList.remove("hidden");
}

function toggleShopMenu() {
  const menu = document.getElementById("shopMenu");
  if (!menu.classList.contains("hidden")) {
    menu.classList.add("hidden");
    return;
  }
  const building = getNearbyShop();
  if (building) {
    renderShopMenu(building);
  }
}

function closeShopMenu() {
  document.getElementById("shopMenu").classList.add("hidden");
}

function buyShopItem(item, building) {
  if (state.coins < item.price) {
    return;
  }
  state.coins -= item.price;
  recordTransaction(-item.price, `${item.icon} ${(item[currentLanguage] || item.ru)[0]}`);
  saveAvatarSettings();
  updatePhoneUi();
  const ru = currentLanguage === "ru";
  const name = (item[currentLanguage] || item.ru)[0];
  const now = clock.elapsedTime;
  if (item.effect === "speed") {
    playerEffects.speedUntil = now + 60;
    showToast(ru ? `${item.icon} ${name}! Ты бегаешь быстрее целую минуту` : `${item.icon} ${name}! You run faster for a minute`);
  } else if (item.effect === "jump") {
    playerEffects.jumpUntil = now + 60;
    showToast(ru ? `${item.icon} ${name}! Прыжки выше целую минуту` : `${item.icon} ${name}! Higher jumps for a minute`);
  } else {
    showToast(ru ? `${item.icon} Ням! ${name} — вкусно` : `${item.icon} Yum! ${name}`);
  }
  renderShopMenu(building);
}

function getSpeedBoost() {
  return clock.elapsedTime < playerEffects.speedUntil ? 1.35 : 1;
}

function getJumpBoost() {
  return clock.elapsedTime < playerEffects.jumpUntil ? 1.45 : 1;
}

function finishJob() {
  const job = state.activeJob;
  if (!job) return;
  const ru = currentLanguage === "ru";
  state.coins += job.reward;
  recordTransaction(job.reward, job.title);
  pushPhoneMessage(ru ? "Босс" : "Boss", ru ? `Отличная работа «${job.title}»! Перевёл тебе ${job.reward} монет 💰` : `Great job on "${job.title}"! Sent you ${job.reward} coins 💰`);
  saveAvatarSettings();
  state.activeJob = null;
  if (taxiPassenger) {
    if (taxiPassenger.parent && taxiPassenger.parent !== scene) {
      taxiPassenger.parent.remove(taxiPassenger);
      scene.add(taxiPassenger);
    }
    taxiPassenger.scale.setScalar(TAXI_PASSENGER_WORLD_SCALE);
    taxiPassenger.visible = false;
  }
  updateMissionMarker();
  updateMissionHud();
  updatePhoneUi();
  showToast(`${translations[currentLanguage].jobFinished} +${job.reward} 🪙`);
}

function cancelJob() {
  if (state.activeJob) {
    finishJobSilently();
  }
}

function finishJobSilently() {
  state.activeJob = null;
  if (taxiPassenger) {
    if (taxiPassenger.parent && taxiPassenger.parent !== scene) {
      taxiPassenger.parent.remove(taxiPassenger);
      scene.add(taxiPassenger);
    }
    taxiPassenger.visible = false;
  }
  updateMissionMarker();
  updateMissionHud();
  updatePhoneUi();
}

function recordTransaction(amount, label) {
  bankHistory.unshift({ amount, label, time: Date.now() });
  bankHistory.length = Math.min(bankHistory.length, 40);
  try {
    window.localStorage.setItem(BANK_KEY, JSON.stringify(bankHistory));
  } catch (error) {
    console.warn("Could not save bank history", error);
  }
}

function pushPhoneMessage(from, text) {
  phoneMessages.unshift({ from, text, time: Date.now() });
  phoneMessages.length = Math.min(phoneMessages.length, 30);
  if (phoneButton) phoneButton.classList.add("phone-button--badge");
}

function formatPhoneTime(time) {
  const date = new Date(time);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function openPhoneApp(appId) {
  if (appId === "map") {
    phonePanel.classList.add("hidden");
    openBigMap();
    return;
  }
  if (appId === "messages" && phoneButton) phoneButton.classList.remove("phone-button--badge");
  phoneState.app = appId;
  phoneState.galleryIndex = null;
  updatePhoneUi();
}

// Нажатия внутри телефона (одна общая обработка)
function handlePhoneClick(event) {
  const target = event.target.closest("[data-app], [data-action], [data-job], [data-photo]");
  if (!target) return;
  const ru = currentLanguage === "ru";
  if (target.dataset.app) {
    openPhoneApp(target.dataset.app);
    return;
  }
  if (target.dataset.job) {
    acceptJob(target.dataset.job);
    phoneState.app = "jobs";
    updatePhoneUi();
    return;
  }
  if (target.dataset.photo !== undefined) {
    phoneState.galleryIndex = Number(target.dataset.photo);
    updatePhoneUi();
    return;
  }
  const action = target.dataset.action;
  if (action === "home") {
    phoneState.app = "home";
  } else if (action === "cancel-job") {
    cancelJob();
  } else if (action === "call-car") {
    callCarToPlayer(cars.filter((car) => car.owned || (car.flying && !car.remoteDriven))[Number(target.dataset.car)]);
  } else if (action === "photo") {
    takeGamePhoto();
    return;
  } else if (action === "gallery-back") {
    phoneState.galleryIndex = null;
  } else if (action === "radio") {
    const index = Number(target.dataset.station);
    if (radioState.station === index) stopRadio();
    else startRadio(index);
  } else if (action === "toggle-night") {
    state.isNight = !state.isNight;
    state.dayNightTimer = 0;
    applyDayNightLighting();
  } else if (action === "language") {
    currentLanguage = currentLanguage === "ru" ? "en" : "ru";
    languageSelect.value = currentLanguage;
    saveAvatarSettings();
    applyLanguage();
  } else if (action === "camera-mode") {
    if (state.mode === "first") setThirdPersonMode();
    else state.mode = "first";
  } else if (action === "gearbox") {
    driveSettings.gearbox = !driveSettings.gearbox;
    try { window.localStorage.setItem("blobloxGearbox", driveSettings.gearbox ? "1" : "0"); } catch (error) { console.warn(error); }
    showToast(driveSettings.gearbox ? (ru ? "⚙️ Коробка передач включена" : "⚙️ Gearbox on") : (ru ? "Едем без коробки передач" : "Gearbox off"));
  } else if (action === "graphics") {
    gfx.smooth = !gfx.smooth;
    window.gfxMaxRatio = gfx.smooth ? 1 : gfx.sharpRatio;
    try { window.localStorage.setItem("blobloxSmoothMode", gfx.smooth ? "1" : "0"); } catch (error) { console.warn(error); }
    resizeRenderer();
  } else if (action === "sound") {
    audioState.muted = !audioState.muted;
    const context = ensureAudioContext();
    if (context) {
      if (audioState.muted) context.suspend();
      else context.resume();
    }
    showToast(audioState.muted ? (ru ? "🔇 Звук выключен" : "🔇 Sound off") : (ru ? "🔊 Звук включён" : "🔊 Sound on"));
  }
  updatePhoneUi();
}

// Вызвать свою машину: она встаёт на свободное место рядом
function callCarToPlayer(car) {
  if (!car || state.currentVehicle === car) return;
  const ru = currentLanguage === "ru";
  const angle = player.angle;
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const side = attempt % 2 === 0 ? 1 : -1;
    const distance = 7 + Math.floor(attempt / 2) * 3;
    const x = player.position.x + Math.cos(angle) * distance * side;
    const z = player.position.z - Math.sin(angle) * distance * side;
    if (!isInsideWorld(x, z) || findBuildingAt(x, z) !== null || carCollidesAt(car, x, z, angle - car.headingOffset)) continue;
    car.group.position.set(x, 0, z);
    car.group.rotation.y = angle - car.headingOffset;
    car.speed = 0;
    if (car.flying) {
      resetFlyerPose(car);
    }
    car.group.visible = true;
    showToast(ru ? "🚗 Машина подъехала! Жми R, чтобы сесть" : "🚗 Your car is here! Press R to get in");
    return;
  }
  showToast(ru ? "Тут тесно — выйди на дорогу или площадь" : "Too tight here — step onto a road");
}

// Камера: снимок того, что сейчас видно в игре
function takeGamePhoto() {
  const ru = currentLanguage === "ru";
  phonePanel.classList.add("hidden");
  renderFrame();
  const url = canvas.toDataURL("image/jpeg", 0.85);
  phoneGallery.unshift({ url, time: Date.now() });
  phoneGallery.length = Math.min(phoneGallery.length, 12);
  phonePanel.classList.remove("hidden");
  showToast(ru ? "📸 Щёлк! Фото сохранено в «Галерею»" : "📸 Snap! Saved to Gallery");
  updatePhoneUi();
}

// Радио: маленькая мелодия, которую браузер играет сам
function startRadio(index) {
  const context = ensureAudioContext();
  if (!context) return;
  if (context.state === "suspended" && !audioState.muted) context.resume();
  stopRadio();
  const station = RADIO_STATIONS[index];
  radioState.station = index;
  radioState.step = 0;
  radioState.gain = context.createGain();
  radioState.gain.gain.value = radioState.volume * 0.12;
  radioState.gain.connect(context.destination);
  const stepMs = (60 / station.bpm / 2) * 1000;
  const toFreq = (note) => 440 * Math.pow(2, (note - 69) / 12);
  const play = (note, length, type, volume) => {
    const now = context.currentTime;
    const osc = context.createOscillator();
    const env = context.createGain();
    osc.type = type;
    osc.frequency.value = toFreq(note);
    env.gain.setValueAtTime(0.0001, now);
    env.gain.exponentialRampToValueAtTime(volume, now + 0.02);
    env.gain.exponentialRampToValueAtTime(0.0001, now + length);
    osc.connect(env);
    env.connect(radioState.gain);
    osc.start(now);
    osc.stop(now + length + 0.05);
  };
  radioState.timer = window.setInterval(() => {
    const step = radioState.step;
    const note = station.notes[step % station.notes.length];
    if (step % 2 === 0 || station.bpm > 100) play(note, stepMs / 1000 * 0.9, station.wave, 0.5);
    if (step % 4 === 0) play(station.bass[Math.floor(step / 4) % station.bass.length], stepMs / 1000 * 3, "sine", 0.9);
    if (step % 8 === 0) play(note + 12, stepMs / 1000 * 1.5, "sine", 0.25);
    radioState.step += 1;
  }, stepMs);
}

function stopRadio() {
  if (radioState.timer) window.clearInterval(radioState.timer);
  radioState.timer = null;
  if (radioState.gain) radioState.gain.disconnect();
  radioState.gain = null;
  radioState.station = null;
}

// Плавная кривая через точки таблицы [x, значение]
function sampleSpline(table, x) {
  const last = table.length - 1;
  if (x <= table[0][0]) return table[0][1];
  if (x >= table[last][0]) return table[last][1];
  let i = 0;
  while (x > table[i + 1][0]) i += 1;
  const [x0, y0] = table[i];
  const [x1, y1] = table[i + 1];
  const h = x1 - x0;
  const m0 = i > 0 ? (y1 - table[i - 1][1]) / (x1 - table[i - 1][0]) : (y1 - y0) / h;
  const m1 = i < last - 1 ? (table[i + 2][1] - y0) / (table[i + 2][0] - x0) : (y1 - y0) / h;
  const t = (x - x0) / h;
  const t2 = t * t;
  const t3 = t2 * t;
  return (2 * t3 - 3 * t2 + 1) * y0 + (t3 - 2 * t2 + t) * h * m0 + (-2 * t3 + 3 * t2) * y1 + (t3 - t2) * h * m1;
}

// Точка на кузове: x — вдоль машины, phi — угол по сечению (0 — бок, π/2 — верх, -π/2 — низ)
function flyerHullPoint(x, phi, out) {
  const hL = CAR_MODELS.flyer.L / 2;
  const top = sampleSpline(FLYER_TOP, x);
  const bottom = sampleSpline(FLYER_BOTTOM, x);
  const half = sampleSpline(FLYER_HALF, x);
  // нос и корма плавно сходятся, а не обрываются
  let scale = 1;
  const noseEdge = hL - 0.9;
  const tailEdge = -hL + 0.45;
  if (x > noseEdge) {
    const k = (x - noseEdge) / (hL - noseEdge);
    scale = Math.sqrt(Math.max(0, 1 - k * k));
  } else if (x < tailEdge) {
    const k = (tailEdge - x) / (tailEdge + hL);
    scale = Math.sqrt(Math.max(0, 1 - k * k));
  }
  const c = Math.cos(phi);
  const s = Math.sin(phi);
  const n = s >= 0 ? 2.9 : 6;
  const sz = Math.sign(c) * Math.pow(Math.abs(c), 2 / n);
  const sy = Math.sign(s) * Math.pow(Math.abs(s), 2 / n);
  const mid = (top + bottom) / 2;
  const hy = (top - bottom) / 2;
  let y = mid + hy * sy * scale;
  let z = half * sz * scale;
  // крылья над колёсами поднимаются горбом, капот между ними остаётся ниже
  if (s > 0) {
    const side = THREE.MathUtils.smoothstep(Math.abs(sz), 0.34, 0.8) * THREE.MathUtils.smoothstep(sy, 0, 0.35);
    y += Math.exp(-Math.pow((x - 3.45) / 1.75, 2)) * side * 0.7 * scale;
    y += Math.exp(-Math.pow((x + 3.45) / 1.9, 2)) * side * 0.36 * scale;
  }
  // линия вдоль двери, на которой красиво ломается отражение
  z -= Math.sign(z) * 0.06 * Math.exp(-Math.pow((y - 1.42) / 0.14, 2)) * scale;
  return out.set(x, y, z);
}

function flyerCanopyPoint(x, phi, out) {
  const half = sampleSpline(FLYER_COCKPIT, x);
  const roof = sampleSpline(FLYER_ROOF, x);
  const base = 1.85;
  const c = Math.cos(phi);
  const s = Math.max(0, Math.sin(phi));
  const n = 2.5;
  return out.set(x, base + (roof - base) * Math.pow(s, 2 / n), half * Math.sign(c) * Math.pow(Math.abs(c), 2 / n));
}

// Поверхность по сетке: pointAt(u, v, out) заполняет точку
function buildLoftGeometry(cols, rows, pointAt) {
  const positions = [];
  const uvs = [];
  const indices = [];
  const point = new THREE.Vector3();
  for (let i = 0; i <= cols; i += 1) {
    for (let j = 0; j <= rows; j += 1) {
      pointAt(i / cols, j / rows, point);
      positions.push(point.x, point.y, point.z);
      uvs.push(i / cols, j / rows);
    }
  }
  for (let i = 0; i < cols; i += 1) {
    for (let j = 0; j < rows; j += 1) {
      const a = i * (rows + 1) + j;
      const b = a + rows + 1;
      indices.push(a, b, b + 1, a, b + 1, a + 1);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

// Кузов: гладкая обшивка с вырезами под колёса и под кабину
function buildFlyerHullGeometry() {
  const spec = CAR_MODELS.flyer;
  const hL = spec.L / 2;
  const cols = 176;
  const rows = 112;
  const R = FLYER_ARCH_R;
  const wheelY = spec.wheelR;
  const positions = [];
  const uvs = [];
  const indices = [];
  const removed = [];
  const point = new THREE.Vector3();
  for (let i = 0; i <= cols; i += 1) {
    // у носа и кормы сетка гуще, чтобы скругления были ровными
    const t = i / cols;
    const u = THREE.MathUtils.lerp(t, 0.5 - 0.5 * Math.cos(Math.PI * t), 0.6);
    const x0 = THREE.MathUtils.lerp(-hL, hL, u);
    for (let j = 0; j <= rows; j += 1) {
      const v = j / rows;
      const phi = -Math.PI / 2 + v * Math.PI * 2;
      flyerHullPoint(x0, phi, point);
      let cut = false;
      for (const axle of [spec.wb / 2, -spec.wb / 2]) {
        const dx = point.x - axle;
        const dy = point.y - wheelY;
        const distance = Math.hypot(dx, dy);
        if (Math.abs(point.z) > 1.42 && distance < R) {
          cut = true;
          if (dy > -0.1) {
            point.x = axle + (dx / (distance || 1)) * R;
            point.y = wheelY + (dy / (distance || 1)) * R;
          } else {
            point.x = axle + (dx >= 0 ? 1 : -1) * Math.sqrt(Math.max(0, R * R - dy * dy));
          }
        }
      }
      if (Math.sin(phi) > 0 && x0 > -2.5 && x0 < 2.6 && Math.abs(point.z) < sampleSpline(FLYER_COCKPIT, x0) - 0.08) {
        cut = true;
      }
      positions.push(point.x, point.y, point.z);
      uvs.push(u, v);
      removed.push(cut);
    }
  }
  for (let i = 0; i < cols; i += 1) {
    for (let j = 0; j < rows; j += 1) {
      const a = i * (rows + 1) + j;
      const b = a + rows + 1;
      if (removed[a] && removed[b] && removed[a + 1] && removed[b + 1]) continue;
      indices.push(a, b, b + 1, a, b + 1, a + 1);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

// Рисунок на кузове: стыки дверей и капота, чёрный низ
function makeFlyerPaintTexture() {
  const hL = CAR_MODELS.flyer.L / 2;
  const image = document.createElement("canvas");
  image.width = 2048;
  image.height = 1024;
  const context = image.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 2048, 1024);
  const X = (x) => ((x + hL) / (hL * 2)) * 2048;
  const Y = (phi) => (1 - (phi + Math.PI / 2) / (Math.PI * 2)) * 1024;
  // чёрные пороги снизу
  context.fillStyle = "#15181d";
  context.fillRect(0, Y(-0.82), 2048, 1024 - Y(-0.82));
  context.fillRect(0, 0, 2048, Y(Math.PI + 0.82));
  context.strokeStyle = "rgba(8,10,14,0.9)";
  context.lineWidth = 3;
  const line = (x1, p1, x2, p2) => {
    [[p1, p2], [Math.PI - p1, Math.PI - p2]].forEach(([a, b]) => {
      context.beginPath();
      context.moveTo(X(x1), Y(a));
      context.lineTo(X(x2), Y(b));
      context.stroke();
    });
  };
  // дверь
  line(2.0, -0.62, 2.25, 0.72);
  line(-1.5, -0.62, -1.75, 0.72);
  line(2.0, -0.62, -1.5, -0.62);
  // капот и крышка сзади
  line(3.0, 0.62, 5.1, 0.72);
  line(-4.75, 0.62, -3.05, 0.62);
  [[3.0, 0.62], [5.1, 0.72], [-4.75, 0.62]].forEach(([x, phi]) => {
    context.beginPath();
    context.moveTo(X(x), Y(phi));
    context.lineTo(X(x), Y(Math.PI - phi));
    context.stroke();
  });
  const texture = new THREE.CanvasTexture(image);
  texture.anisotropy = 4;
  return texture;
}

// Отражения неба и города: без них металл выглядит как пластик
function getFlyerEnvMap() {
  if (flyerShared.env !== undefined) {
    return flyerShared.env;
  }
  flyerShared.env = null;
  try {
    const image = document.createElement("canvas");
    image.width = 512;
    image.height = 256;
    const context = image.getContext("2d");
    const sky = context.createLinearGradient(0, 0, 0, 256);
    sky.addColorStop(0, "#3f86d6");
    sky.addColorStop(0.42, "#bfe3ff");
    sky.addColorStop(0.5, "#fff4dc");
    sky.addColorStop(0.52, "#59636b");
    sky.addColorStop(1, "#2b3036");
    context.fillStyle = sky;
    context.fillRect(0, 0, 512, 256);
    const glow = context.createRadialGradient(150, 56, 2, 150, 56, 70);
    glow.addColorStop(0, "rgba(255,255,255,1)");
    glow.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, 512, 256);
    context.fillStyle = "rgba(38,48,60,0.85)";
    for (let x = 0; x < 512; x += 14) {
      const height = 8 + ((x * 37) % 41);
      context.fillRect(x, 128 - height, 10, height);
    }
    const texture = new THREE.CanvasTexture(image);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    const generator = new THREE.PMREMGenerator(renderer);
    flyerShared.env = generator.fromEquirectangular(texture).texture;
    generator.dispose();
    texture.dispose();
  } catch (error) {
    console.warn("Flyer reflections are off", error);
  }
  return flyerShared.env;
}

// Струя из сопла: основание в начале координат, кончик — по +Y.
// Холодный газ не светится: это прозрачная белёсая струя с «ромбами» у сопла и завихрениями
function makeFlyerPlume(radius, length) {
  if (!flyerShared.plumeMaterial) {
    flyerShared.plumeTime = { value: 0 };
    flyerShared.plumeLight = { value: 1 };
    const vertexShader = `
      varying vec2 vUv;
      varying float vFacing;
      void main() {
        vUv = uv;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vec3 n = normalize(normalMatrix * normal);
        vFacing = abs(dot(n, normalize(-mv.xyz)));
        gl_Position = projectionMatrix * mv;
      }`;
    const noise = `
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
      }`;
    const make = (fragment) => new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, side: THREE.DoubleSide,
      uniforms: { time: flyerShared.plumeTime, light: flyerShared.plumeLight },
      vertexShader, fragmentShader: fragment
    });
    // внешняя оболочка: расширяется от сопла, клубится и тает к концу
    flyerShared.plumeMaterial = make(`
      uniform float time;
      uniform float light;
      varying vec2 vUv;
      varying float vFacing;
      ${noise}
      void main() {
        float d = 1.0 - vUv.y;
        float swirl = noise(vec2(vUv.x * 10.0, d * 6.0 - time * 9.0)) * 0.6 + noise(vec2(vUv.x * 23.0, d * 13.0 - time * 15.0)) * 0.4;
        float edge = smoothstep(0.0, 0.7, vFacing);
        float alpha = (0.2 + swirl * 0.55) * smoothstep(0.0, 0.08, d) * (1.0 - smoothstep(0.3, 1.0, d)) * edge * 0.62;
        vec3 color = mix(vec3(0.8, 0.84, 0.88), vec3(1.0), swirl) * light;
        gl_FragColor = vec4(color, alpha);
      }`);
    // плотное ядро у сопла со светлыми «ромбами» сверхзвуковой струи
    flyerShared.plumeCore = make(`
      uniform float time;
      uniform float light;
      varying vec2 vUv;
      varying float vFacing;
      ${noise}
      void main() {
        float d = 1.0 - vUv.y;
        float diamonds = pow(0.5 + 0.5 * cos(d * 34.0), 3.0);
        float shimmer = 0.85 + 0.15 * noise(vec2(vUv.x * 8.0, time * 20.0));
        float edge = smoothstep(0.0, 0.8, vFacing);
        float alpha = (0.35 + 0.55 * diamonds * (1.0 - d)) * (1.0 - smoothstep(0.45, 1.0, d)) * edge * shimmer * 0.7;
        gl_FragColor = vec4(vec3(0.94, 0.97, 1.0) * light, alpha);
      }`);
  }
  const plume = new THREE.Group();
  const flip = (geometry) => {
    const uv = geometry.attributes.uv;
    for (let i = 0; i < uv.count; i += 1) uv.setY(i, 1 - uv.getY(i));
    uv.needsUpdate = true;
    return geometry;
  };
  // оболочка шире к концу: газ расширяется, как настоящая струя
  const sheath = new THREE.CylinderGeometry(radius * 2.1, radius * 0.85, length, 18, 1, true);
  sheath.translate(0, length / 2, 0);
  plume.add(new THREE.Mesh(flip(sheath), flyerShared.plumeMaterial));
  const core = new THREE.ConeGeometry(radius * 0.6, length * 0.55, 14, 1, true);
  core.translate(0, length * 0.275, 0);
  plume.add(new THREE.Mesh(flip(core), flyerShared.plumeCore));
  plume.children.forEach((mesh) => { mesh.renderOrder = 7; });
  plume.visible = false;
  plume.userData.dynamic = true;
  return plume;
}

function buildFlyerWheel(mats, side) {
  const R = CAR_MODELS.flyer.wheelR;
  const spin = new THREE.Group();
  const profile = [[0.62, -0.46], [0.93, -0.47], [0.99, -0.4], [1, -0.2], [1, 0.2], [0.99, 0.4], [0.93, 0.47], [0.62, 0.46]]
    .map(([r, y]) => new THREE.Vector2(r * R, y));
  const tyre = addCarPart(new THREE.LatheGeometry(profile, 40), mats.tire, spin, 0, 0, 0);
  tyre.rotation.x = Math.PI / 2;
  const barrel = addCarPart(new THREE.CylinderGeometry(R * 0.64, R * 0.64, 0.9, 32, 1, true), mats.rimDark, spin, 0, 0, 0, false);
  barrel.rotation.x = Math.PI / 2;
  const brake = addCarPart(new THREE.CylinderGeometry(R * 0.5, R * 0.5, 0.07, 28), mats.chrome, spin, 0, 0, side * 0.08, false);
  brake.rotation.x = Math.PI / 2;
  const lip = addCarPart(new THREE.TorusGeometry(R * 0.63, 0.035, 8, 40), mats.rim, spin, 0, 0, side * 0.44, false);
  lip.rotation.z = 0;
  for (let i = 0; i < 5; i += 1) {
    [-0.11, 0.11].forEach((skew) => {
      const angle = (i / 5) * Math.PI * 2 + skew;
      const spoke = addCarPart(new THREE.BoxGeometry(R * 0.5, 0.07, 0.09), mats.rim, spin, Math.cos(angle) * R * 0.34, Math.sin(angle) * R * 0.34, side * 0.41, false);
      spoke.rotation.z = angle - skew * 1.6;
    });
  }
  const hub = addCarPart(new THREE.CylinderGeometry(R * 0.15, R * 0.17, 0.14, 16), mats.rim, spin, 0, 0, side * 0.42, false);
  hub.rotation.x = Math.PI / 2;
  mergeStaticMeshes(spin);
  return spin;
}

function addFlyerTube(parent, material, points, radius, castShadow = false, segments = 8) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => p.clone()));
  return addCarPart(new THREE.TubeGeometry(curve, Math.max(12, points.length * 3), radius, segments, false), material, parent, 0, 0, 0, castShadow);
}

function addFlyerSeat(parent, mats, x, y, z) {
  const shape = new THREE.Shape();
  shape.moveTo(1.05, -0.1);
  shape.quadraticCurveTo(1.12, -0.26, 0.95, -0.32);
  shape.lineTo(-0.5, -0.36);
  shape.lineTo(-1.3, 1.75);
  shape.quadraticCurveTo(-1.38, 2.1, -1.05, 2.12);
  shape.lineTo(-0.85, 2.08);
  shape.quadraticCurveTo(-0.66, 2.0, -0.72, 1.72);
  shape.lineTo(-0.32, 0.1);
  shape.quadraticCurveTo(-0.25, -0.02, -0.05, 0);
  shape.lineTo(0.95, 0.04);
  shape.quadraticCurveTo(1.05, 0.04, 1.05, -0.1);
  const seat = new THREE.Group();
  seat.position.set(x, y, z);
  seat.scale.set(1, 0.88, 0.8);
  parent.add(seat);
  addCarPart(extrudeCarShape(shape, 1.0, 0.1), mats.leather, seat, 0, 0, 0, false);
  [-1, 1].forEach((side) => {
    const bolster = addCarPart(extrudeCarShape(shape, 0.24, 0.08), mats.alcantara, seat, -0.02, 0.09, side * 0.56, false);
    bolster.scale.set(0.96, 0.72, 1);
  });
}

// Своя модель летающей машины: ничего общего с простыми коробками обычных машин
function createFlyerModel(color) {
  const spec = CAR_MODELS.flyer;
  const env = getFlyerEnvMap();
  const hL = spec.L / 2;
  const point = new THREE.Vector3();
  flyerShared.paintMap = flyerShared.paintMap || makeFlyerPaintTexture();
  const mats = makeCarMaterials(color);
  const paint = new THREE.MeshPhysicalMaterial({
    color, map: flyerShared.paintMap, metalness: 0.5, roughness: 0.36,
    clearcoat: 1, clearcoatRoughness: 0.07, envMap: env, envMapIntensity: 1.05
  });
  mats.body = paint;
  mats.glass = new THREE.MeshPhysicalMaterial({
    color: 0x1c2a36, metalness: 0.2, roughness: 0.04, transparent: true, opacity: 0.42,
    envMap: env, envMapIntensity: 2.2, clearcoat: 1, clearcoatRoughness: 0.03, depthWrite: false
  });
  mats.carbon = new THREE.MeshStandardMaterial({ color: 0x14171c, roughness: 0.42, metalness: 0.45, envMap: env, envMapIntensity: 0.6 });
  mats.interior = new THREE.MeshStandardMaterial({ color: 0x1e2127, roughness: 0.8, side: THREE.DoubleSide });
  mats.leather = new THREE.MeshStandardMaterial({ color: 0xc79a6b, roughness: 0.62 });
  mats.alcantara = new THREE.MeshStandardMaterial({ color: 0x23262c, roughness: 0.92 });
  mats.rim = new THREE.MeshStandardMaterial({ color: 0xc9d0d8, roughness: 0.24, metalness: 0.9, envMap: env, envMapIntensity: 1.2 });
  mats.rimDark = new THREE.MeshStandardMaterial({ color: 0x2a2e35, roughness: 0.5, metalness: 0.6, side: THREE.DoubleSide });
  mats.chrome.envMap = env;
  mats.chrome.envMapIntensity = 1.3;
  mats.caliper = new THREE.MeshStandardMaterial({ color: 0x38d9ff, roughness: 0.35, emissive: 0x0a5a70, emissiveIntensity: 0.5 });
  mats.led = new THREE.MeshBasicMaterial({ color: 0x7ff0ff });
  mats.drl = new THREE.MeshBasicMaterial({ color: 0xffffff });
  mats.tailBar = new THREE.MeshBasicMaterial({ color: 0xc8141e });
  mats.jet = new THREE.MeshBasicMaterial({ color: 0xe6f6ff, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, fog: false });
  mats.indL = new THREE.MeshBasicMaterial({ color: 0x3a2405 });
  mats.indR = new THREE.MeshBasicMaterial({ color: 0x3a2406 });
  mats.reverse = new THREE.MeshBasicMaterial({ color: 0x2a2a2a });

  const group = new THREE.Group();
  const body = new THREE.Group();
  group.add(body);

  // обшивка
  flyerShared.hull = flyerShared.hull || buildFlyerHullGeometry();
  const hull = addCarPart(flyerShared.hull, paint, body, 0, 0, 0);
  hull.userData.keepSeparate = true;

  // ниши колёс изнутри, иначе сквозь вырез было бы видно насквозь
  [spec.wb / 2, -spec.wb / 2].forEach((axle) => {
    [-1, 1].forEach((side) => {
      const well = addCarPart(new THREE.CylinderGeometry(FLYER_ARCH_R + 0.02, FLYER_ARCH_R + 0.02, 1.0, 28, 1, true, Math.PI / 2 - 0.34, Math.PI + 0.68), mats.interior, body, axle, spec.wheelR, side * 1.92, false);
      well.rotation.x = Math.PI / 2;
      addCarPart(new THREE.CircleGeometry(FLYER_ARCH_R + 0.02, 28, -0.34, Math.PI + 0.68), mats.interior, body, axle, spec.wheelR, side * 1.43, false);
      // тонкая окантовка арки
      const lip = addCarPart(new THREE.TorusGeometry(FLYER_ARCH_R + 0.02, 0.035, 6, 36, Math.PI + 0.3), mats.carbon, body, axle, spec.wheelR, side * 2.26, false);
      lip.rotation.z = -0.15;
    });
  });

  const seatX = spec.wsBase - 2.3;
  const driverZ = -spec.W * 0.22;
  const cockpit = buildFlyerCockpit(body, mats, spec, env);
  const { steeringSpin, fpHands, fpArms, arms, hud, fpEye } = cockpit;

  // сиденья для водителя и пассажира
  const driverSeat = new THREE.Group();
  driverSeat.position.set(seatX - 0.1, spec.seatY, driverZ);
  driverSeat.rotation.y = Math.PI / 2;
  driverSeat.userData.dynamic = true;
  body.add(driverSeat);
  const passengerSeat = new THREE.Group();
  passengerSeat.position.set(seatX - 0.1, spec.seatY, -driverZ);
  passengerSeat.rotation.y = Math.PI / 2;
  passengerSeat.userData.dynamic = true;
  body.add(passengerSeat);

  // стеклянный фонарь кабины: откидывается вверх как у истребителя
  const canopy = new THREE.Group();
  canopy.position.set(2.9, 2.0, 0);
  canopy.userData.dynamic = true;
  body.add(canopy);
  const canopyInner = new THREE.Group();
  canopyInner.position.set(-2.9, -2.0, 0);
  canopy.add(canopyInner);
  const glass = addCarPart(buildLoftGeometry(56, 30, (u, v, out) => flyerCanopyPoint(THREE.MathUtils.lerp(-3.2, 3.5, u), v * Math.PI, out)), mats.glass, canopyInner, 0, 0, 0, false);
  glass.userData.keepSeparate = true;
  glass.renderOrder = 3;
  const innerGlass = addCarPart(glass.geometry, getInnerGlassMaterial(env), canopyInner, 0, 0, 0, false);
  innerGlass.userData.keepSeparate = true;
  innerGlass.renderOrder = 4;
  // рама только за спиной водителя: спереди цельное стекло, как у истребителя
  [0, 1].forEach((mirror) => {
    const rail = [];
    for (let x = -1.35; x >= -2.9; x -= 0.2) {
      const phi = THREE.MathUtils.lerp(0.25, 0.95, THREE.MathUtils.smoothstep(x, -2.9, -1.6));
      rail.push(flyerCanopyPoint(x, mirror ? Math.PI - phi : phi, new THREE.Vector3()));
    }
    addFlyerTube(canopyInner, paint, rail, 0.075, true);
    // тёмный край фонаря вдоль кузова
    const seal = [];
    for (let x = 3.3; x >= -3.0; x -= 0.35) {
      flyerCanopyPoint(x, mirror ? Math.PI - 0.2 : 0.2, point);
      seal.push(point.clone().setY(Math.max(point.y, flyerHullPoint(x, mirror ? Math.PI - 1.05 : 1.05, new THREE.Vector3()).y + 0.02)));
    }
    addFlyerTube(canopyInner, mats.carbon, seal, 0.05, false);
  });
  const hoop = [];
  for (let i = 0; i <= 14; i += 1) {
    hoop.push(flyerCanopyPoint(-1.35, THREE.MathUtils.lerp(0.14, Math.PI - 0.14, i / 14), new THREE.Vector3()));
  }
  addFlyerTube(canopyInner, paint, hoop, 0.09, true);
  mergeStaticMeshes(canopyInner);

  // сзади: подвижное антикрыло
  const wing = new THREE.Group();
  wing.position.set(-4.75, 2.22, 0);
  wing.userData.dynamic = true;
  body.add(wing);
  const blade = new THREE.Shape();
  blade.moveTo(-0.72, 0.02);
  blade.quadraticCurveTo(0.1, 0.12, 0.62, 0.02);
  blade.quadraticCurveTo(0, -0.08, -0.72, 0.02);
  addCarPart(extrudeCarShape(blade, 4.1, 0.03), paint, wing, 0, 0.1, 0);
  [-1, 1].forEach((side) => {
    addCarPart(new THREE.BoxGeometry(0.5, 0.82, 0.07), mats.carbon, wing, -0.05, -0.28, side * 1.25);
    addCarPart(new THREE.BoxGeometry(1.1, 0.26, 0.05), mats.carbon, wing, -0.04, 0.12, side * 2.08);
  });
  mergeStaticMeshes(wing);

  // зад: панель, сопла и световое кольцо
  const tailPanel = addCarPart(new THREE.SphereGeometry(1, 24, 14), mats.carbon, body, -5.42, 1.32, 0);
  tailPanel.scale.set(0.3, 0.44, 1.75);
  const halo = [];
  for (let i = 0; i <= 26; i += 1) {
    halo.push(flyerHullPoint(-5.58, THREE.MathUtils.lerp(0.02, Math.PI - 0.02, i / 26), new THREE.Vector3()).setX(-5.6));
  }
  addFlyerTube(body, mats.tailBar, halo, 0.05);
  addCarPart(new THREE.BoxGeometry(0.1, 0.1, 0.6), mats.tail, body, -5.58, 1.86, 0, false);
  const rearJets = [];
  [-1, 1].forEach((side) => {
    const ring = addCarPart(new THREE.TorusGeometry(0.33, 0.05, 10, 28), mats.rimDark, body, -5.62, 1.3, side * 0.92, false);
    ring.rotation.y = Math.PI / 2;
    const throat = addCarPart(new THREE.CylinderGeometry(0.34, 0.26, 0.7, 20, 1, true), mats.rimDark, body, -5.36, 1.3, side * 0.92, false);
    throat.rotation.z = -Math.PI / 2;
    const glow = new THREE.Mesh(new THREE.CircleGeometry(0.3, 20), mats.jet);
    glow.position.set(-5.5, 1.3, side * 0.92);
    glow.rotation.y = -Math.PI / 2;
    glow.userData.keepSeparate = true;
    body.add(glow);
    const nozzle = new THREE.Group();
    nozzle.position.set(-5.68, 1.3, side * 0.92);
    nozzle.rotation.z = Math.PI / 2;
    nozzle.userData.dynamic = true;
    body.add(nozzle);
    const plume = makeFlyerPlume(0.3, 1);
    nozzle.add(plume);
    rearJets.push({ nozzle, plume });
  });

  // перед: воздухозаборник, сплиттер, тонкие ходовые огни
  const intake = addCarPart(new THREE.SphereGeometry(1, 24, 14), mats.carbon, body, 5.02, 0.82, 0);
  intake.scale.set(0.62, 0.2, 1.55);
  const splitter = addCarPart(new THREE.CylinderGeometry(1.95, 1.95, 0.06, 40, 1, false, 0, Math.PI), mats.carbon, body, 4.05, 0.56, 0);
  splitter.scale.set(0.82, 1, 1);
  [0, 1].forEach((mirror) => {
    const blade2 = [];
    for (let i = 0; i <= 12; i += 1) {
      const x = THREE.MathUtils.lerp(5.5, 4.05, i / 12);
      const phi = THREE.MathUtils.lerp(0.62, 0.34, i / 12);
      blade2.push(flyerHullPoint(x, mirror ? Math.PI - phi : phi, new THREE.Vector3()).multiplyScalar(1.004));
    }
    addFlyerTube(body, mats.drl, blade2, 0.035);
    const lamp = addCarPart(new THREE.SphereGeometry(0.17, 14, 10), mats.head, body, 5.02, 1.34, (mirror ? -1 : 1) * 1.28, false);
    lamp.scale.set(1.5, 0.5, 1.2);
    const sideSign = mirror ? -1 : 1;
    const indicator = sideSign > 0 ? mats.indR : mats.indL;
    addCarPart(new THREE.BoxGeometry(0.1, 0.08, 0.32), indicator, body, 5.08, 1.14, sideSign * 1.6, false);
    addCarPart(new THREE.BoxGeometry(0.08, 0.1, 0.3), indicator, body, -5.5, 1.62, sideSign * 1.45, false);
    addCarPart(new THREE.BoxGeometry(0.06, 0.1, 0.28), mats.reverse, body, -5.62, 1.02, sideSign * 0.5, false);
    // зеркала-камеры
    const mirrorZ = (mirror ? -1 : 1) * 2.36;
    const pod = addCarPart(new THREE.SphereGeometry(0.2, 14, 10), paint, body, 1.82, 2.42, mirrorZ);
    pod.scale.set(1.5, 0.75, 1.15);
    addCarPart(new THREE.BoxGeometry(0.16, 0.05, 0.5), mats.carbon, body, 1.86, 2.36, (mirror ? -1 : 1) * 2.1, false);
    // светящаяся полоса вдоль порога и вырез за дверью
    const sill = [];
    for (let x = -2.25; x <= 2.25; x += 0.5) {
      sill.push(flyerHullPoint(x, mirror ? Math.PI + 0.72 : -0.72, new THREE.Vector3()).multiplyScalar(1).setY(0.82));
    }
    addFlyerTube(body, mats.led, sill, 0.03);
    flyerHullPoint(-2.35, mirror ? Math.PI - 0.12 : 0.12, point);
    const vent = addCarPart(new THREE.SphereGeometry(1, 16, 10), mats.carbon, body, point.x, point.y, point.z);
    vent.scale.set(0.62, 0.24, 0.12);
    vent.rotation.z = 0.28;
  });

  // колёса: на земле стоят как обычно, в полёте ложатся плашмя и становятся двигателями
  const wheels = [];
  [[spec.wb / 2, true], [-spec.wb / 2, false]].forEach(([wx, front]) => {
    [-1, 1].forEach((side) => {
      const fold = new THREE.Group();
      fold.userData.dynamic = true;
      body.add(fold);
      const steer = new THREE.Group();
      fold.add(steer);
      const spin = buildFlyerWheel(mats, side);
      steer.add(spin);
      addCarPart(new THREE.BoxGeometry(0.3, 0.46, 0.2), mats.caliper, steer, spec.wheelR * 0.36, spec.wheelR * 0.24, side * 0.18, false);
      const disc = new THREE.Mesh(new THREE.CircleGeometry(spec.wheelR * 0.58, 26), mats.jet);
      disc.position.z = side * 0.3;
      if (side < 0) disc.rotation.y = Math.PI;
      fold.add(disc);
      const plume = makeFlyerPlume(spec.wheelR * 0.56, 1);
      plume.position.z = side * 0.46;
      plume.rotation.x = side * Math.PI / 2;
      fold.add(plume);
      wheels.push({ fold, steer, spin, front, side, wx, plume });
      // снизу видно только светящееся сопло, колесо прячется в кузов
      const nozzle = addCarPart(new THREE.RingGeometry(0.28, 0.56, 28), mats.jet, body, wx, 0.575, side * 1.45, false);
      nozzle.rotation.x = Math.PI / 2;
      nozzle.userData.keepSeparate = true;
      const grille = addCarPart(new THREE.RingGeometry(0.56, 0.66, 28), mats.carbon, body, wx, 0.578, side * 1.45, false);
      grille.rotation.x = Math.PI / 2;
    });
  });

  mergeStaticMeshes(body);

  return {
    group, body, wheels, steeringSpin, driverSeat, passengerSeat, spec, mats,
    canopy, wing, rearJets, hud, fpEye, fpArms, fpHands, arms,
    screen: cockpit.screen, centerScreen: cockpit.centerScreen, hudScreen: cockpit.hudScreen
  };
}

// Положение колёс: 1 — стоят на земле, 0 — сложены внутрь кузова
function poseFlyerGear(car, gear) {
  const R = car.spec.wheelR;
  car.wheels.forEach((wheel) => {
    wheel.fold.rotation.x = wheel.side * (1 - gear) * Math.PI / 2;
    wheel.fold.position.set(
      wheel.wx,
      THREE.MathUtils.lerp(1.05, R, gear) - car.bounce * gear,
      wheel.side * THREE.MathUtils.lerp(1.45, FLYER_WHEEL_Z, gear)
    );
  });
}

function resetFlyerPose(car) {
  car.forwardSpeed = 0;
  car.verticalSpeed = 0;
  car.yawRate = 0;
  car.airborne = false;
  car.spool = 0;
  car.gear = 1;
  car.gearTarget = 1;
  car.bounce = 0;
  car.bounceSpeed = 0;
  car.wall = null;
  car.wallPhase = null;
  car.wallBlend = 0;
  car.body.rotation.set(0, 0, 0);
  car.body.position.y = 0;
  poseFlyerGear(car, 1);
}

// На что можно опуститься: земля или крыша дома
function flyerFloorAt(x, z, y) {
  let floor = getGroundHeight(x, z);
  if (findLakeAt(x, z)) floor = Math.max(floor, WATER_LEVEL + 0.1);
  const index = findBuildingAt(x, z);
  if (index !== null && buildings[index].wallTop && y > buildings[index].wallTop - 2) {
    floor = Math.max(floor, buildings[index].wallTop + 0.15);
  }
  return floor;
}

function updateFlyerInAir(car, delta, input) {
  const position = car.group.position;
  const floor = flyerFloorAt(position.x, position.z, position.y);
  const height = position.y - floor;
  car.floorY = floor;

  // сначала сопла набирают тягу, и только потом машина отрывается от земли
  const wasReady = car.spool > 0.55;
  const wantsThrust = input.lift > 0 || height > 0.5;
  car.spool = dampTo(car.spool, wantsThrust ? 1 : 0, input.lift > 0 ? 2.6 : 3.2, delta);
  if (!wasReady && car.spool > 0.55 && height < 1) {
    smokeBurst(position.x, floor, position.z, 70, 1);
    playFlyerThump(0.5);
  }
  let targetSpeed = input.lift > 0 && car.spool > 0.55 ? input.lift * 18 : Math.min(0, input.lift) * 18;
  // у самой земли спуск сам замедляется, чтобы посадка была мягкой
  if (targetSpeed < 0) {
    targetSpeed = Math.max(targetSpeed, -(2.4 + height * 1.5));
  } else if (height < 0.8 && input.lift <= 0) {
    targetSpeed = -2.5;
  }
  car.verticalSpeed = dampTo(car.verticalSpeed, targetSpeed, 3.2, delta);
  position.y = Math.min(230, position.y + car.verticalSpeed * delta);
  if (position.y - floor > 1.4) {
    car.wasFlying = true;
  }
  if (position.y <= floor) {
    if (car.wasFlying) {
      car.wasFlying = false;
      const impact = Math.min(1, Math.abs(car.verticalSpeed) / 5 + 0.35);
      smokeBurst(position.x, floor, position.z, Math.round(50 + impact * 50), impact);
      car.bounceSpeed = -3.2 * impact;
      playFlyerThump(impact);
    }
    position.y = floor;
    car.verticalSpeed = Math.max(0, car.verticalSpeed);
  }
  car.height = position.y - floor;
  car.airborne = car.height > 0.8;

  // разгон плавный: чем ближе к максимуму, тем слабее тянет. Назад — до 40 км/ч
  const boost = car.airborne ? input.boost : Math.min(input.boost, 1.25);
  const top = (car.airborne ? car.maxSpeed : FLYER_ROAD_TOP) * boost;
  const speedNow = car.forwardSpeed;
  const gearPull = updateGearbox(car, speedNow, top, delta);
  let accel = 0;
  if (input.forward > 0) {
    accel = speedNow < -0.5 ? 38 : (car.airborne ? 24 : 15) * boost * gearPull * Math.max(0, 1 - Math.pow(Math.max(0, speedNow) / top, 2));
    // задние холодные двигатели толкают сами по себе: 0–100 км/ч примерно за секунду, как на показе Tesla
    if (input.boost > 1 && speedNow > -0.5) accel += 34 * Math.max(0, 1 - Math.max(0, speedNow) / top);
  } else if (input.forward < 0) {
    accel = speedNow > 0.5 ? -38 : -11 * Math.max(0, 1 - Math.pow(-speedNow / 18, 2));
  } else {
    const resist = car.airborne ? 1.2 + Math.abs(speedNow) * 0.02 : 2.4 + Math.abs(speedNow) * 0.035;
    accel = -Math.sign(speedNow) * Math.min(Math.abs(speedNow) / Math.max(delta, 0.0001), resist);
  }
  car.forwardSpeed += accel * delta;
  if (car.forwardSpeed > top) car.forwardSpeed = dampTo(car.forwardSpeed, top, 1.5, delta);
  car.forwardSpeed = Math.max(car.forwardSpeed, -18);
  car.braking = input.forward < 0 && speedNow > 0.5;

  // в воздухе крутится на месте, на земле поворачивает только на ходу, как настоящая машина
  const grip = car.airborne ? 1 : Math.min(1, Math.abs(car.forwardSpeed) / 9) * Math.sign(car.forwardSpeed || 1);
  car.yawRate = dampTo(car.yawRate, input.turn * (car.airborne ? 1.4 : 1.05) * grip, 3.5, delta);
  car.group.rotation.y += car.yawRate * delta;

  const heading = car.group.rotation.y + car.headingOffset;
  car.chaseYaw = heading;
  const nextX = position.x + Math.sin(heading) * car.forwardSpeed * delta;
  const nextZ = position.z + Math.cos(heading) * car.forwardSpeed * delta;
  if (isInsideWorld(nextX, nextZ) && !flyerBlocked(car, nextX, nextZ, position.y)) {
    position.x = nextX;
    position.z = nextZ;
  } else {
    car.forwardSpeed *= -0.3;
  }
  // следы шин при резком торможении и в крутом повороте
  if (!car.airborne && car.gear > 0.9 && Math.abs(car.forwardSpeed) > 12 && (car.braking || Math.abs(car.yawRate * car.forwardSpeed) > 26)) {
    car.skidTimer = (car.skidTimer || 0) - delta;
    if (car.skidTimer <= 0) {
      car.skidTimer = 0.05;
      [car.wheels[2], car.wheels[3]].forEach((wheel) => {
        wheel.fold.getWorldPosition(flyerTmp.b);
        addSkidMark(flyerTmp.b.x, floor, flyerTmp.b.z, heading, Math.abs(car.forwardSpeed) * 0.055);
      });
    }
  }

  // подсказка «G — на стену»: ищем стену не каждый кадр
  car.wallScan = (car.wallScan || 0) - delta;
  if (car.wallScan <= 0) {
    car.wallScan = 0.15;
    car.nearWall = car.airborne ? findFlyerWall(car) : null;
  }
}

// Все стены, по которым можно ехать: дома и прямые башни
function getFlyerWallRects() {
  if (!flyerWalls.list) {
    flyerWalls.list = towerFaces.slice();
    buildings.forEach((building) => {
      if (building.style === "tower" || !building.wallTop) return;
      const halfW = building.width / 2;
      const halfD = building.depth / 2;
      flyerWalls.list.push({
        minX: building.x - halfW, maxX: building.x + halfW, minZ: building.z - halfD, maxZ: building.z + halfD,
        bottom: 0, top: building.style === "cottage" ? building.groundHeight : building.wallTop
      });
    });
  }
  return flyerWalls.list;
}

function findFlyerWall(car) {
  const position = car.group.position;
  let best = null;
  let bestDistance = 12;
  getFlyerWallRects().forEach((rect) => {
    if (rect.top < 7 || position.y > rect.top - 1 || position.y < rect.bottom - 2) return;
    const dx = position.x < rect.minX ? rect.minX - position.x : position.x > rect.maxX ? position.x - rect.maxX : 0;
    const dz = position.z < rect.minZ ? rect.minZ - position.z : position.z > rect.maxZ ? position.z - rect.maxZ : 0;
    if ((dx > 0) === (dz > 0)) return; // за углом дома или внутри него
    const distance = dx + dz;
    if (distance >= bestDistance) return;
    bestDistance = distance;
    const normal = dx > 0
      ? new THREE.Vector3(position.x < rect.minX ? -1 : 1, 0, 0)
      : new THREE.Vector3(0, 0, position.z < rect.minZ ? -1 : 1);
    best = { rect, normal };
  });
  return best;
}

function toggleFlyerWall(car) {
  const ru = currentLanguage === "ru";
  if (car.wallPhase === "attach" || car.wallPhase === "on") {
    startFlyerDetach(car, "away");
    return;
  }
  if (car.wallPhase) return;
  const hit = car.airborne ? findFlyerWall(car) : null;
  if (!hit) {
    showToast(ru ? "Подлети ближе к стене дома 🏢" : "Fly closer to a building wall 🏢");
    return;
  }
  const { rect, normal } = hit;
  const position = car.group.position;
  // ось вдоль стены выбрана так, что поворот налево на стене остаётся поворотом налево
  const along = new THREE.Vector3(normal.z, 0, -normal.x);
  const origin = new THREE.Vector3(
    normal.x !== 0 ? (normal.x > 0 ? rect.maxX : rect.minX) : position.x,
    0,
    normal.z !== 0 ? (normal.z > 0 ? rect.maxZ : rect.minZ) : position.z
  );
  const ends = normal.x !== 0
    ? [(rect.minZ - origin.z) * along.z, (rect.maxZ - origin.z) * along.z]
    : [(rect.minX - origin.x) * along.x, (rect.maxX - origin.x) * along.x];
  // летишь вдоль стены — едешь вдоль, летишь в стену — носом вверх
  const heading = car.group.rotation.y + car.headingOffset;
  const alongness = Math.sin(heading) * along.x + Math.cos(heading) * along.z;
  const phi = Math.abs(alongness) < 0.4 ? Math.PI / 2 : (alongness > 0 ? 0 : Math.PI);
  car.wall = {
    rect, normal, along, origin, phi,
    u: Math.min(Math.max((position.x - origin.x) * along.x + (position.z - origin.z) * along.z, Math.min(...ends) + 3), Math.max(...ends) - 3),
    v: Math.max(position.y, rect.bottom + 4.5),
    uMin: Math.min(...ends), uMax: Math.max(...ends),
    startPosition: position.clone(), startQuaternion: car.group.quaternion.clone(),
    endPosition: new THREE.Vector3(), endYaw: 0
  };
  car.wallPhase = "attach";
  car.wallBlend = 0;
  car.verticalSpeed = 0;
  car.nearWall = null;
  car.forwardSpeed = Math.max(car.forwardSpeed, 6);
  playFlyerThump(0.45);
}

function getFlyerWallQuaternion(wall, out) {
  const x = flyerTmp.b.copy(wall.along).multiplyScalar(Math.cos(wall.phi));
  x.y = Math.sin(wall.phi);
  const z = flyerTmp.c.crossVectors(x, wall.normal);
  flyerTmp.m.makeBasis(x, wall.normal, z);
  return out.setFromRotationMatrix(flyerTmp.m);
}

function startFlyerDetach(car, reason) {
  const wall = car.wall;
  const position = car.group.position;
  const forward = flyerTmp.a.set(1, 0, 0).applyQuaternion(car.group.quaternion);
  wall.startPosition.copy(position);
  wall.startQuaternion.copy(car.group.quaternion);
  wall.endPosition.copy(position).addScaledVector(wall.normal, reason === "top" ? -2 : 7);
  wall.endPosition.y = reason === "top" ? wall.rect.top + 4.5 : Math.max(position.y + 1, car.floorY + 4);
  let heading = Math.atan2(forward.x, forward.z);
  if (Math.hypot(forward.x, forward.z) < 0.35) {
    const sign = reason === "top" ? -1 : 1;
    heading = Math.atan2(wall.normal.x * sign, wall.normal.z * sign);
  }
  wall.endYaw = heading - car.headingOffset;
  car.wallPhase = "detach";
  car.forwardSpeed *= reason === "top" ? 0.5 : 0.25;
}

function updateFlyerOnWall(car, delta, input) {
  const wall = car.wall;
  const position = car.group.position;
  car.airborne = true;
  car.spool = dampTo(car.spool, 1, 3, delta);
  car.floorY = getGroundHeight(position.x, position.z);
  car.height = position.y - car.floorY;

  if (car.wallPhase === "detach") {
    car.wallBlend = Math.max(0, car.wallBlend - delta / 0.75);
    const ease = THREE.MathUtils.smoothstep(1 - car.wallBlend, 0, 1);
    const level = flyerTmp.q2.setFromAxisAngle(flyerTmp.up, wall.endYaw);
    position.lerpVectors(wall.startPosition, wall.endPosition, ease);
    car.group.quaternion.copy(wall.startQuaternion).slerp(level, ease);
    car.chaseYaw = wall.endYaw + car.headingOffset;
    if (car.wallBlend <= 0) {
      car.group.rotation.set(0, wall.endYaw, 0);
      car.wall = null;
      car.wallPhase = null;
    }
    return;
  }

  // по стене: газ — вдоль носа, A/D поворачивают машину прямо на стене
  const maxSpeed = car.maxSpeed * 0.62 * input.boost;
  car.forwardSpeed += input.forward * CAR_MODELS.flyer.accel * 0.8 * input.boost * delta;
  car.forwardSpeed *= Math.max(0, 1 - delta * 1.1);
  car.forwardSpeed = THREE.MathUtils.clamp(car.forwardSpeed, -maxSpeed * 0.6, maxSpeed);
  const grip = Math.min(1, Math.abs(car.forwardSpeed) / 6 + 0.25) * (car.forwardSpeed < -0.5 ? -1 : 1);
  car.yawRate = dampTo(car.yawRate, input.turn * 1.5 * grip, 5, delta);
  wall.phi += car.yawRate * delta;
  wall.u += Math.cos(wall.phi) * car.forwardSpeed * delta;
  wall.v += Math.sin(wall.phi) * car.forwardSpeed * delta;

  const target = flyerTmp.d.copy(wall.origin).addScaledVector(wall.along, wall.u).addScaledVector(wall.normal, 0.03);
  target.y = wall.v;
  const quaternion = getFlyerWallQuaternion(wall, flyerTmp.q);
  if (car.wallPhase === "attach") {
    car.wallBlend = Math.min(1, car.wallBlend + delta / 0.75);
    const ease = THREE.MathUtils.smoothstep(car.wallBlend, 0, 1);
    position.lerpVectors(wall.startPosition, target, ease);
    car.group.quaternion.copy(wall.startQuaternion).slerp(quaternion, ease);
    if (car.wallBlend >= 1) {
      car.wallPhase = "on";
      smokeBurst(position.x + wall.normal.x, position.y, position.z + wall.normal.z, 26, 0.45);
    }
    return;
  }
  position.copy(target);
  car.group.quaternion.copy(quaternion);

  // доехал до края стены — машина сама отрывается и выравнивается
  if (wall.v > wall.rect.top - 1) startFlyerDetach(car, "top");
  else if (wall.u < wall.uMin + 1.5 || wall.u > wall.uMax - 1.5) startFlyerDetach(car, "edge");
  else if (wall.v < wall.rect.bottom + 3.5) startFlyerDetach(car, "bottom");
}

function updateFlyerVisuals(car, delta, input) {
  const onWall = car.wallPhase === "on" || car.wallPhase === "attach";
  const time = clock.elapsedTime;
  const flying = car.airborne && !onWall;

  // колёса: складываются на высоте и заранее выходят перед посадкой
  if (onWall) car.gearTarget = 1;
  else if (car.height > 3.2) car.gearTarget = 0;
  else if (car.height < 2.4) car.gearTarget = 1;
  car.gear = dampTo(car.gear, car.gearTarget, 5, delta);

  // пружина подвески после посадки
  car.bounceSpeed += (-car.bounce * 110 - car.bounceSpeed * 10) * delta;
  car.bounce += car.bounceSpeed * delta;
  poseFlyerGear(car, car.gear);

  // наклоны: вперёд — нос вниз, назад — нос вверх, в повороте — крен внутрь
  const air = flying ? 1 : 0.12;
  const speedRatio = car.forwardSpeed / car.maxSpeed;
  const pitchTarget = onWall ? 0 : -(input.forward * 0.16 + speedRatio * 0.06) * air + (flying ? Math.max(-0.1, Math.min(0.12, car.verticalSpeed * 0.008)) : 0);
  const rollTarget = onWall ? 0 : -car.yawRate * (0.18 + Math.abs(speedRatio) * 0.28) * air;
  const longAccel = delta > 0 ? (car.forwardSpeed - (car.lastForward === undefined ? car.forwardSpeed : car.lastForward)) / delta : 0;
  car.lastForward = car.forwardSpeed;
  if (flying || onWall) {
    // в воздухе машина плавно наклоняется внутрь поворота, как самолёт
    car.body.rotation.z = dampTo(car.body.rotation.z, pitchTarget, 3, delta);
    car.body.rotation.x = dampTo(car.body.rotation.x, rollTarget, 3, delta);
    const bob = flying ? Math.sin(time * 2.2) * 0.1 + Math.sin(time * 5.3) * 0.025 : 0;
    car.body.position.y = dampTo(car.body.position.y, bob, 8, delta) + car.bounce;
    if (car.susp) {
      car.susp.pitch = car.body.rotation.z;
      car.susp.roll = car.body.rotation.x;
      car.susp.pitchV = 0;
      car.susp.rollV = 0;
    }
  } else {
    // на земле работает подвеска, как у обычной машины
    updateCarBody(car, delta, longAccel, car.forwardSpeed * car.yawRate);
    car.body.position.y += car.bounce;
  }
  // колёса не наклоняются вместе с кузовом: они всегда стоят на дороге
  const pitch = car.body.rotation.z;
  const roll = car.body.rotation.x;
  car.wheels.forEach((wheel) => {
    const base = THREE.MathUtils.lerp(1.05, car.spec.wheelR, car.gear);
    wheel.fold.position.y = base + car.gear * (-wheel.wx * Math.sin(pitch) + wheel.fold.position.z * Math.sin(roll) - car.body.position.y);
    wheel.fold.rotation.z = -pitch * car.gear;
  });

  // колёса: крутятся от езды, в полёте работают как турбины
  const folded = 1 - car.gear;
  car.wheels.forEach((wheel) => {
    if (folded > 0.5) wheel.spin.rotation.z += wheel.side * delta * (10 + car.spool * 26);
    else wheel.spin.rotation.z -= (car.forwardSpeed * delta) / car.wheelR;
    wheel.steer.rotation.y = dampTo(wheel.steer.rotation.y, wheel.front && folded < 0.5 ? input.turn * THREE.MathUtils.lerp(0.5, 0.16, Math.min(1, Math.abs(car.forwardSpeed) / car.maxSpeed)) : 0, 7, delta);
    const thrust = folded > 0.55 ? car.spool * (0.75 + Math.max(0, input.lift) * 0.5 + Math.abs(input.forward) * 0.12) : 0;
    wheel.plume.visible = thrust > 0.05;
    if (wheel.plume.visible) {
      const flicker = 0.97 + Math.random() * 0.06;
      wheel.plume.scale.set(0.82 + thrust * 0.2, (2 + thrust * 3.4) * flicker, 0.82 + thrust * 0.2);
    }
  });
  const rearPower = onWall ? Math.max(0, input.forward) * 0.6 : Math.max(0, input.forward) * car.spool;
  car.rearJets.forEach((jet) => {
    jet.plume.visible = rearPower > 0.05;
    if (jet.plume.visible) {
      const length = (1.6 + rearPower * 2.4 + (input.boost > 1 ? 2.6 : 0)) * (0.9 + Math.random() * 0.2);
      jet.plume.scale.set(1, length, 1);
    }
  });
  // холодный газ не светится: сопла только чуть белеют от инея
  car.mats.jet.opacity = Math.min(0.4, car.spool * (0.15 + folded * 0.25));

  // свет: порог разгорается с тягой, сзади стоп-сигнал при торможении
  const power = 0.35 + car.spool * 0.65;
  car.mats.led.color.setRGB(0.5 * power, 0.94 * power, 1 * power);
  const brake = input.forward < 0 ? 1 : 0.55;
  car.mats.tailBar.color.setRGB(brake, 0.06 * brake, 0.09 * brake);
  if (car.mats.reverse) car.mats.reverse.color.set(car.forwardSpeed < -0.3 && !car.airborne ? 0xffffff : 0x2a2a2a);

  // антикрыло выдвигается в полёте и на скорости
  car.wingDeploy = dampTo(car.wingDeploy, flying || Math.abs(car.forwardSpeed) > 28 ? 1 : 0, 3, delta);
  car.wing.position.y = 2.22 + car.wingDeploy * 0.74;
  car.wing.rotation.z = car.wingDeploy * (input.forward < 0 ? 0.32 : -0.06);

  // руль крутится вслед за кнопками
  car.steerVisual = dampTo(car.steerVisual, input.turn * 1.05, 7, delta);
  car.steeringSpin.rotation.x = -car.steerVisual;
  car.steerAngle = car.steerVisual * 0.42;

  // пятно под машиной
  const padVisible = car === state.currentVehicle && !car.wallPhase && (car.height > 0.7 || car.spool > 0.05) && car.height < 120;
  if (car === state.currentVehicle) flyerPad.visible = padVisible;
  if (padVisible) {
    const position = car.group.position;
    const fade = 1 - Math.min(1, car.height / 120);
    flyerPad.material.opacity = Math.min(1, car.spool * 1.4) * (0.35 + fade * 0.6);
    flyerPad.position.set(position.x, car.floorY + 0.14, position.z);
    const size = 12 + Math.min(10, car.height * 0.1);
    flyerPad.scale.set(size, size, 1);
    flyerPad.rotation.z = time * 0.5;
  }
}

// Клуб дыма. floor — ниже него клуб не опускается, color — [r, g, b] (по умолчанию белый)
function spawnSmoke(x, y, z, vx, vy, vz, size, growth, life, alpha, shade = 1, drag = 1.6, rise = 1.2, floor = -1e4, color = null) {
  const i = smokeInfo.cursor;
  smokeInfo.cursor = (i + 1) % SMOKE_MAX;
  smokeOffset[i * 3] = x;
  smokeOffset[i * 3 + 1] = y;
  smokeOffset[i * 3 + 2] = z;
  smokeVelocity[i * 3] = vx;
  smokeVelocity[i * 3 + 1] = vy;
  smokeVelocity[i * 3 + 2] = vz;
  smokeData[i * 4 + 2] = Math.random() * Math.PI * 2;
  smokeData[i * 4 + 3] = shade;
  const variant = Math.floor(Math.random() * 4) * 2;
  smokeColor[i * 3] = (color ? color[0] : 1) + variant;
  smokeColor[i * 3 + 1] = color ? color[1] : 1;
  smokeColor[i * 3 + 2] = color ? color[2] : 1;
  smokeInfo.colorDirty = true;
  const s = i * 8;
  smokeState[s] = 0;
  smokeState[s + 1] = life;
  smokeState[s + 2] = size;
  smokeState[s + 3] = growth;
  smokeState[s + 4] = alpha;
  smokeState[s + 5] = drag;
  smokeState[s + 6] = rise;
  smokeState[s + 7] = floor;
}

// При взлёте и посадке: пар от сопел и пыль (или брызги), которые разбегаются по земле
function smokeBurst(x, y, z, count, strength) {
  const dust = groundDustColor(x, z);
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = (12 + Math.random() * 20) * (0.55 + strength * 0.6);
    const near = 1.5 + Math.random() * 3.5;
    const vapor = !dust || Math.random() < 0.45;
    spawnSmoke(
      x + Math.cos(angle) * near, y + 0.4 + Math.random() * 1.0, z + Math.sin(angle) * near,
      Math.cos(angle) * speed * (vapor ? 1.15 : 0.8), 0.8 + Math.random() * (vapor ? 3 : 4.5), Math.sin(angle) * speed * (vapor ? 1.15 : 0.8),
      vapor ? 2 + Math.random() * 1.6 : 2.6 + Math.random() * 2.2, vapor ? 3.4 + Math.random() * 2.4 : 2.4 + Math.random() * 2,
      vapor ? 0.8 + Math.random() * 0.8 : 2 + Math.random() * 2,
      vapor ? 0.5 : 0.36 + strength * 0.14, 1, vapor ? 3 : 1.3, vapor ? -0.2 : 0.5, y + 0.4,
      vapor ? (dust ? SMOKE_VAPOR : SMOKE_SPRAY) : dust
    );
  }
}

// Холодные газовые двигатели (как у летающей Tesla Roadster от SpaceX): сжатый воздух
// вылетает быстрее звука, остывает, и влага в нём сразу становится белым паром.
// Пар быстро тает и чуть опускается (он холодный), а у земли струя поднимает пыль.
function emitFlyerSmoke(car, delta, input) {
  const position = car.group.position;
  const onWall = car.wallPhase === "on" || car.wallPhase === "attach";
  const down = flyerTmp.c.set(0, -1, 0).applyQuaternion(car.body.getWorldQuaternion(flyerTmp.q2));
  const point = flyerTmp.b;
  car.surfaceTimer = (car.surfaceTimer || 0) - delta;
  if (car.surfaceTimer <= 0) {
    car.surfaceTimer = 0.25;
    car.dust = groundDustColor(position.x, position.z);
  }

  if (!onWall && car.spool > 0.03) {
    const lift = Math.max(0, input.lift);
    // струи прямо из-под машины: тонкие, быстрые, тают за полсекунды
    if (car.gear < 0.6) {
      car.smokeJet += delta * 150 * car.spool * (0.6 + lift * 0.8);
      while (car.smokeJet >= 1) {
        car.smokeJet -= 1;
        const wheel = car.wheels[Math.floor(Math.random() * 4)];
        wheel.fold.getWorldPosition(point);
        const along = 1.2 + Math.random() * 2.2;
        const speed = 26 + Math.random() * 16;
        spawnSmoke(
          point.x + down.x * along, point.y + down.y * along, point.z + down.z * along,
          down.x * speed + car.velocity.x * 0.4 + (Math.random() - 0.5) * 4,
          down.y * speed + car.velocity.y * 0.4,
          down.z * speed + car.velocity.z * 0.4 + (Math.random() - 0.5) * 4,
          0.45 + Math.random() * 0.35, 5 + Math.random() * 3, 0.35 + Math.random() * 0.35,
          0.5, 1, 5.5, -0.8, car.floorY + 0.3, SMOKE_VAPOR
        );
      }
    }
    // у земли струя растекается кольцом: пар, а следом медленная пыль или брызги
    const reach = 22;
    if (car.height < reach) {
      const near = 1 - car.height / reach;
      car.smokeGround += delta * 220 * car.spool * near * (0.6 + lift * 0.5);
      const water = !car.dust;
      const base = water ? WATER_LEVEL : car.floorY;
      while (car.smokeGround >= 1) {
        car.smokeGround -= 1;
        const wheel = car.wheels[Math.floor(Math.random() * 4)];
        wheel.fold.getWorldPosition(point);
        const angle = Math.random() * Math.PI * 2;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const speed = (14 + Math.random() * 16) * (0.45 + near * 0.8);
        const x = point.x + cos * 1.5;
        const z = point.z + sin * 1.5;
        if (water) {
          spawnSmoke(x, base + 0.3 + Math.random() * 0.5, z, cos * speed, 1.5 + Math.random() * 4, sin * speed,
            1 + Math.random() * 0.9, 3.4 + Math.random() * 2.6, 0.9 + Math.random() * 0.9, 0.58, 1, 2.6, -0.4, base + 0.2, SMOKE_SPRAY);
        } else if (Math.random() < 0.55) {
          spawnSmoke(x, base + 0.3 + Math.random() * 0.4, z, cos * speed * 1.2, 0.4 + Math.random() * 1.5, sin * speed * 1.2,
            1.2 + Math.random() * 0.9, 3.8 + Math.random() * 2.6, 0.7 + Math.random() * 0.7, 0.5 + near * 0.22, 1, 3.2, -0.2, base + 0.3, SMOKE_VAPOR);
        } else {
          spawnSmoke(x, base + 0.3 + Math.random() * 0.5, z, cos * speed * 0.75, 0.8 + Math.random() * 2.2, sin * speed * 0.75,
            1.8 + Math.random() * 1.4, 2.6 + Math.random() * 1.8, 2.4 + Math.random() * 2, 0.36 + near * 0.26, 1, 1.25, 0.45, base + 0.4, car.dust);
        }
      }
    }
  }

  // задние сопла: при разгоне пар бьёт назад, с ускорителем — длинная мощная струя
  if (input.forward > 0 && car.spool > 0.3) {
    const strong = input.boost > 1;
    car.smokeRear += delta * (strong ? 120 : 40);
    const back = flyerTmp.a.set(-1, 0, 0).applyQuaternion(car.group.quaternion);
    while (car.smokeRear >= 1) {
      car.smokeRear -= 1;
      const jet = car.rearJets[Math.random() < 0.5 ? 0 : 1];
      jet.nozzle.getWorldPosition(point);
      const along = 0.8 + Math.random() * (strong ? 3 : 1.5);
      const speed = strong ? 34 : 20;
      spawnSmoke(
        point.x + back.x * along, point.y + back.y * along, point.z + back.z * along,
        back.x * speed + car.velocity.x * 0.6 + (Math.random() - 0.5) * 3, back.y * speed + car.velocity.y * 0.6, back.z * speed + car.velocity.z * 0.6 + (Math.random() - 0.5) * 3,
        0.4 + Math.random() * 0.3, 4 + Math.random() * 2.5, 0.4 + Math.random() * 0.4, strong ? 0.55 : 0.38, 1, 4.2, -0.3, -1e4, SMOKE_VAPOR
      );
    }
  }

  // носовые сопла поворачивают машину в воздухе: короткие резкие «пшики» вбок
  if (car.airborne && !onWall && car.spool > 0.3) {
    const turn = input.turn;
    if (turn !== 0 && turn !== car.lastTurn) car.rcs = (car.rcs || 0) + 10;
    car.rcs = (car.rcs || 0) + delta * Math.abs(turn) * 22;
    const side = turn > 0 ? -1 : 1;
    while (car.rcs >= 1) {
      car.rcs -= 1;
      point.set(4.4, 1.25, side * 0.95);
      car.body.localToWorld(point);
      const dir = flyerTmp.a.set(0, 0, side).applyQuaternion(car.group.quaternion);
      const speed = 18 + Math.random() * 8;
      spawnSmoke(point.x, point.y, point.z,
        dir.x * speed + car.velocity.x * 0.9, car.velocity.y * 0.9 + (Math.random() - 0.5) * 2, dir.z * speed + car.velocity.z * 0.9,
        0.3, 3.2, 0.28 + Math.random() * 0.2, 0.55, 1, 6, 0, -1e4, SMOKE_VAPOR);
    }
    if (turn === 0) car.rcs = Math.min(car.rcs, 0.5);
  }
  car.lastTurn = input.turn;

  // на стене сопла на крыше прижимают машину, поэтому пар идёт от стены наружу
  if (onWall && car.wall) {
    const normal = car.wall.normal;
    car.smokeWall += delta * (10 + Math.abs(car.forwardSpeed) * 1.1);
    while (car.smokeWall >= 1) {
      car.smokeWall -= 1;
      // пар идёт от сопел по бокам, чтобы не закрывать кабину
      const along = -3.6 + Math.random() * 1.6;
      const side = (Math.random() < 0.5 ? -1 : 1) * (1.2 + Math.random() * 1.1);
      const forward = flyerTmp.a.set(along, 0, side).applyQuaternion(car.group.quaternion);
      const speed = 9 + Math.random() * 8;
      spawnSmoke(
        position.x + forward.x + normal.x * 3.4, position.y + forward.y + normal.y * 3.4, position.z + forward.z + normal.z * 3.4,
        normal.x * speed + car.velocity.x * 0.3, car.velocity.y * 0.3 + 0.6, normal.z * speed + car.velocity.z * 0.3,
        0.7 + Math.random() * 0.6, 3.4 + Math.random() * 2, 0.5 + Math.random() * 0.5, 0.42, 1, 3.4, -0.3, -1e4, SMOKE_VAPOR
      );
    }
  }
}

// Дым живёт сам: разлетается, растёт и тает, даже когда из машины уже вышли
function updateSmoke(delta) {
  if (flyerShared.plumeTime) {
    flyerShared.plumeTime.value += delta;
    flyerShared.plumeLight.value = Math.min(1, 0.4 + hemiLight.intensity * 0.66);
  }
  let alive = 0;
  for (let i = 0; i < SMOKE_MAX; i += 1) {
    const s = i * 8;
    const life = smokeState[s + 1];
    if (life <= 0) continue;
    const age = smokeState[s] + delta;
    if (age >= life) {
      smokeState[s + 1] = 0;
      smokeData[i * 4] = 0;
      smokeData[i * 4 + 1] = 0;
      continue;
    }
    alive += 1;
    smokeState[s] = age;
    const k = age / life;
    const damping = Math.exp(-smokeState[s + 5] * delta);
    const p = i * 3;
    smokeVelocity[p] *= damping;
    smokeVelocity[p + 1] = smokeVelocity[p + 1] * damping + smokeState[s + 6] * delta;
    smokeVelocity[p + 2] *= damping;
    smokeOffset[p] += smokeVelocity[p] * delta;
    smokeOffset[p + 1] = Math.max(smokeState[s + 7], smokeOffset[p + 1] + smokeVelocity[p + 1] * delta);
    smokeOffset[p + 2] += smokeVelocity[p + 2] * delta;
    // клуб быстро растёт, пока летит, потом почти замирает и тает
    smokeData[i * 4] = smokeState[s + 2] + smokeState[s + 3] * life * (1 - Math.pow(1 - k, 2)) * 0.75;
    smokeData[i * 4 + 1] = smokeState[s + 4] * Math.min(1, k * 10) * Math.pow(1 - k, 1.6);
    smokeData[i * 4 + 2] += delta * 0.25;
  }
  smokeInfo.alive = alive;
  smokeMesh.visible = alive > 0;
  if (alive > 0) {
    const geometry = smokeMesh.geometry;
    geometry.attributes.offset.needsUpdate = true;
    geometry.attributes.pdata.needsUpdate = true;
    if (smokeInfo.colorDirty) {
      geometry.attributes.pcolor.needsUpdate = true;
      smokeInfo.colorDirty = false;
    }
    const uniforms = smokeMesh.material.uniforms;
    const light = Math.min(1, 0.32 + hemiLight.intensity * 0.72);
    uniforms.tint.value.setRGB(light, light, Math.min(1, light * 1.04));
    uniforms.fogColor.value.copy(scene.fog.color);
    uniforms.fogRange.value.set(scene.fog.near, scene.fog.far);
  }
}

// Каждый кадр, даже если никто не сидит в машине: дым и откидной фонарь кабины
function updateFlyerFx(delta) {
  updateSmoke(delta);
  if (state.currentGame !== "city" || state.inHub) {
    return;
  }
  flyingCars.forEach((car) => {
    const driving = state.currentVehicle === car || car.netDriving;
    const near = !state.currentVehicle && !car.remoteDriven && Math.hypot(player.position.x - car.group.position.x, player.position.z - car.group.position.z) < 14;
    car.canopyOpen = dampTo(car.canopyOpen, near ? 1 : 0, driving ? 3.5 : 4, delta);
    car.canopy.rotation.z = -car.canopyOpen * 0.62;
    if (!driving && !car.remoteDriven) {
      // игрока могли вернуть на платформу прямо из полёта: ставим машину на землю
      if (car.wallPhase || car.airborne) {
        const position = car.group.position;
        car.group.rotation.set(0, car.chaseYaw - car.headingOffset, 0);
        position.y = getGroundHeight(position.x, position.z);
        resetFlyerPose(car);
      }
      car.spool = dampTo(car.spool, 0, 3, delta);
      car.mats.jet.opacity = 0;
      const glow = 0.35 + car.spool * 0.65;
      car.mats.led.color.setRGB(0.5 * glow, 0.94 * glow, glow);
      car.hud.visible = false;
      car.fpArms.visible = false;
      car.fpHands.forEach((hand) => { hand.visible = false; });
      car.rearJets.forEach((jet) => { jet.plume.visible = false; });
      car.wheels.forEach((wheel) => { wheel.plume.visible = false; });
    }
  });
  if (!state.currentVehicle || !state.currentVehicle.flying) {
    flyerPad.visible = false;
    if (flyerHudEl && !state.currentVehicle) flyerHudEl.classList.add("hidden");
    if (camera.fov !== 55) {
      camera.fov = 55;
      camera.updateProjectionMatrix();
    }
  }
}

// Приборы: скорость, передача, обороты, поворотники; в центре — время, музыка и режим
function updateFlyerScreens(car, delta) {
  car.screenTimer -= delta;
  if (car.screenTimer > 0) {
    return;
  }
  car.screenTimer = 0.12;
  const ru = currentLanguage === "ru";
  const speed = Math.round(Math.hypot(car.velocity.x, car.velocity.y, car.velocity.z) * SPEED_TO_KMH);
  const altitude = Math.max(0, Math.round(car.height));
  const modeText = car.wallPhase ? (ru ? "СТЕНА" : "WALL") : car.airborne ? (ru ? "ПОЛЁТ" : "FLIGHT") : (ru ? "ЗЕМЛЯ" : "ROAD");
  const gearText = getGearText(car);
  if (flyerHudEl) {
    flyerHudEl.classList.remove("hidden");
    flyerHudEl.innerHTML = `<b>${speed}</b><small>${ru ? "км/ч" : "km/h"}</small><i></i><b>${gearText}</b><i></i><b>${altitude}</b><small>${ru ? "м" : "m"}</small><i></i><b>${Math.round((car.air === undefined ? 1 : car.air) * 100)}%</b><small>${ru ? "воздух" : "air"}</small><i></i><em>${modeText}</em>`;
  }
  if (state.mode !== "first") {
    return;
  }

  // приборы за рулём
  const { context: g, texture } = car.screen;
  g.fillStyle = "#04070d";
  g.fillRect(0, 0, 512, 200);
  const rpm = THREE.MathUtils.clamp(car.rpm || 0, 0, 1);
  g.lineWidth = 10;
  g.lineCap = "round";
  g.strokeStyle = "#1a2433";
  g.beginPath();
  g.arc(256, 150, 120, Math.PI * 1.05, Math.PI * 1.95);
  g.stroke();
  g.strokeStyle = rpm > 0.85 ? "#ff5a5a" : "#7ff0ff";
  g.beginPath();
  g.arc(256, 150, 120, Math.PI * 1.05, Math.PI * (1.05 + 0.9 * rpm));
  g.stroke();
  g.fillStyle = "#ffffff";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 72px Arial";
  g.fillText(String(speed), 256, 112);
  g.font = "700 20px Arial";
  g.fillStyle = "#9db4c7";
  g.fillText(ru ? "км/ч" : "km/h", 256, 160);
  g.font = "800 44px Arial";
  g.fillStyle = driveSettings.gearbox ? "#ffd166" : "#6ee7a8";
  g.fillText(gearText, 440, 110);
  g.font = "700 22px Arial";
  g.fillStyle = "#9db4c7";
  g.fillText(`${altitude} ${ru ? "м" : "m"}`, 72, 110);
  g.fillText(modeText, 72, 150);
  // стрелки поворотников
  const arrow = (x, dir, on) => {
    g.fillStyle = on ? "#4be078" : "#14301e";
    g.beginPath();
    g.moveTo(x + dir * 22, 30);
    g.lineTo(x - dir * 4, 14);
    g.lineTo(x - dir * 4, 46);
    g.fill();
  };
  arrow(70, -1, car.signal < 0 && car.signalOn);
  arrow(442, 1, car.signal > 0 && car.signalOn);
  texture.needsUpdate = true;

  // центральный экран: время, музыка, климат
  const c = car.centerScreen;
  if (c) {
    const h = c.context;
    const gradient = h.createLinearGradient(0, 0, 0, 360);
    gradient.addColorStop(0, "#0b1424");
    gradient.addColorStop(1, "#05080f");
    h.fillStyle = gradient;
    h.fillRect(0, 0, 300, 360);
    h.textAlign = "left";
    h.textBaseline = "alphabetic";
    h.fillStyle = "#ffffff";
    h.font = "800 46px Arial";
    const now = new Date();
    h.fillText(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`, 22, 62);
    h.font = "600 18px Arial";
    h.fillStyle = "#9db4c7";
    h.fillText(ru ? "Bloblox Aero · автопилот готов" : "Bloblox Aero · autopilot ready", 22, 92);
    const card = (y, title, value, color) => {
      h.fillStyle = "rgba(255,255,255,0.07)";
      h.fillRect(18, y, 264, 64);
      h.fillStyle = color;
      h.fillRect(18, y, 6, 64);
      h.fillStyle = "#9db4c7";
      h.font = "600 16px Arial";
      h.fillText(title, 36, y + 24);
      h.fillStyle = "#ffffff";
      h.font = "800 22px Arial";
      h.fillText(value, 36, y + 50);
    };
    const station = radioState.station !== null ? RADIO_STATIONS[radioState.station][currentLanguage] : (ru ? "Радио выключено" : "Radio off");
    card(116, ru ? "Музыка" : "Music", station, "#ff5fa2");
    card(192, ru ? "Климат" : "Climate", "21°  ·  Auto", "#7ff0ff");
    card(268, ru ? "Коробка" : "Gearbox", driveSettings.gearbox ? (ru ? "Ручная, 6 передач" : "Manual, 6 gears") : (ru ? "Автомат" : "Automatic"), "#ffd166");
    c.texture.needsUpdate = true;
  }

  const hud = car.hudScreen;
  const k = hud.context;
  k.clearRect(0, 0, 512, 256);
  k.strokeStyle = "#7ff0ff";
  k.fillStyle = "#7ff0ff";
  k.lineWidth = 3;
  k.save();
  k.translate(256, 128 + car.body.rotation.z * 260);
  k.rotate(car.body.rotation.x);
  k.beginPath();
  k.moveTo(-170, 0);
  k.lineTo(-52, 0);
  k.moveTo(52, 0);
  k.lineTo(170, 0);
  k.stroke();
  k.restore();
  k.font = "800 40px Arial";
  k.textAlign = "left";
  k.fillText(String(speed), 16, 44);
  k.textAlign = "right";
  k.fillText(`${altitude}`, 496, 44);
  k.font = "700 20px Arial";
  k.textAlign = "center";
  k.fillText(`${modeText} · ${gearText}`, 256, 232);
  hud.texture.needsUpdate = true;
}

// Камера: снаружи плавно идёт за машиной, изнутри сидит в кресле и наклоняется вместе с кузовом
function updateFlyerCamera(car) {
  const delta = car.lastDelta || 1 / 60;
  const speedRatio = Math.min(1.5, Math.abs(car.forwardSpeed) / car.maxSpeed);
  camera.fov = dampTo(camera.fov, 55 + speedRatio * speedRatio * 9, 3, delta);
  camera.updateProjectionMatrix();
  const firstPerson = state.mode === "first";
  car.hud.visible = firstPerson;
  car.fpArms.visible = firstPerson;
  car.fpHands.forEach((hand) => { hand.visible = firstPerson; });

  if (firstPerson) {
    placeCockpitCamera(car, delta);
    return;
  }

  avatar.visible = true;
  if (!car.wallPhase && !cameraOrbit.dragging) {
    cameraOrbit.yaw = turnTowardsAngle(cameraOrbit.yaw, car.chaseYaw + Math.PI, delta, 3);
  }
  const position = car.group.position;
  const pitch = cameraOrbit.pitch;
  const pivot = flyerTmp.a.set(position.x, position.y + 3, position.z);
  const direction = flyerTmp.b.set(Math.sin(cameraOrbit.yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(cameraOrbit.yaw) * Math.cos(pitch));
  const wanted = cameraOrbit.distance + car.halfLength + 4 + speedRatio * 5;
  const free = findCameraClearDistance(pivot, direction, wanted, Infinity);
  if (car.cameraDistance === undefined || free < car.cameraDistance) {
    car.cameraDistance = free;
  } else {
    car.cameraDistance = dampTo(car.cameraDistance, free, 3, delta);
  }
  camera.position.copy(pivot).addScaledVector(direction, car.cameraDistance);
  const lookY = position.y + 2.6;
  camera.position.y = Math.max(camera.position.y, getGroundHeight(camera.position.x, camera.position.z) + 1);

  // на стене камера отъезжает наружу, чтобы машину было видно сбоку
  if (car.wall && car.wallBlend > 0) {
    const wall = car.wall;
    const ease = THREE.MathUtils.smoothstep(car.wallBlend, 0, 1);
    const forward = flyerTmp.c.set(1, 0, 0).applyQuaternion(car.group.quaternion);
    const outside = flyerTmp.d.copy(position)
      .addScaledVector(wall.normal, 19)
      .addScaledVector(forward, -10);
    outside.y += 3;
    outside.y = Math.max(outside.y, getGroundHeight(outside.x, outside.z) + 1.5);
    camera.position.lerp(outside, ease);
  }
  camera.lookAt(position.x, lookY, position.z);
}

// Звук: шипение холодного газа и тонкий вой турбин вместо обычного мотора
function startFlyerSound() {
  const context = ensureAudioContext();
  if (!context || flyerAudio.nodes) {
    return;
  }
  if (context.state === "suspended") {
    context.resume();
  }
  const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  const noise = context.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;
  const filter = context.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 900;
  filter.Q.value = 0.6;
  const hiss = context.createGain();
  hiss.gain.value = 0.0001;
  const whine = context.createOscillator();
  whine.type = "triangle";
  whine.frequency.value = 160;
  const whineGain = context.createGain();
  whineGain.gain.value = 0.0001;
  noise.connect(filter);
  filter.connect(hiss);
  hiss.connect(context.destination);
  whine.connect(whineGain);
  whineGain.connect(context.destination);
  noise.start();
  whine.start();
  flyerAudio.nodes = { noise, filter, hiss, whine, whineGain };
}

function updateFlyerSound(car, input) {
  const nodes = flyerAudio.nodes;
  const context = audioState.context;
  if (!nodes || !context) {
    return;
  }
  const now = context.currentTime;
  const ratio = Math.min(1.4, Math.abs(car.forwardSpeed) / car.maxSpeed);
  const push = car.spool * (0.55 + Math.max(0, input.lift) * 0.45) + ratio * 0.25;
  nodes.hiss.gain.setTargetAtTime(0.0001 + push * 0.06, now, 0.08);
  nodes.filter.frequency.setTargetAtTime(600 + push * 1500, now, 0.1);
  nodes.whine.frequency.setTargetAtTime(150 + car.spool * 240 + (car.rpm === undefined ? ratio : car.rpm) * 420, now, 0.12);
  nodes.whineGain.gain.setTargetAtTime(0.0001 + car.spool * 0.012 + ratio * 0.01, now, 0.1);
}

function stopFlyerSound() {
  const nodes = flyerAudio.nodes;
  const context = audioState.context;
  if (!nodes || !context) {
    return;
  }
  const now = context.currentTime;
  nodes.hiss.gain.setTargetAtTime(0.0001, now, 0.1);
  nodes.whineGain.gain.setTargetAtTime(0.0001, now, 0.1);
  nodes.noise.stop(now + 0.5);
  nodes.whine.stop(now + 0.5);
  flyerAudio.nodes = null;
}

// Глухой удар при посадке и хлопок сопел при взлёте
function playFlyerThump(strength) {
  const context = audioState.context;
  if (!context) {
    return;
  }
  const now = context.currentTime;
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(120, now);
  osc.frequency.exponentialRampToValueAtTime(38, now + 0.28);
  gain.gain.setValueAtTime(0.16 * strength, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);
  osc.connect(gain);
  gain.connect(context.destination);
  osc.start(now);
  osc.stop(now + 0.36);
}

// Внешность игрока для других: те же поля, что у прохожих
function getNetLook() {
  return {
    body: bodyColorInput.value, accent: accentColorInput.value, hair: hairColorInput.value, eyes: eyeColorInput.value,
    skin: skinToneInput.value, pants: pantsTypeInput.value, shoes: shoesTypeInput.value, outfit: outfitTypeInput.value,
    hairStyle: hairStyleInput.value, accessory: headAccessoryInput.value, face: faceMoodInput.value, bodyType: bodyTypeInput.value
  };
}

function netConnect(request) {
  const ru = currentLanguage === "ru";
  if (location.protocol === "file:") {
    netEls.status.textContent = ru ? "Открой игру через файл «Играть вместе.bat»" : "Open the game through the server";
    return;
  }
  netDisconnectSocket();
  net.wanted = request;
  const name = netEls.name.value.trim();
  if (name) nameInput.value = name;
  netEls.status.textContent = ru ? "Подключаюсь…" : "Connecting…";
  const socket = new WebSocket(`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws`);
  net.socket = socket;
  socket.onopen = () => {
    socket.send(JSON.stringify({ t: "join", game: "city", ...request, name: nameInput.value.trim() || "Игрок", look: getNetLook() }));
  };
  socket.onmessage = (event) => handleNetMessage(JSON.parse(event.data));
  socket.onclose = () => {
    if (net.socket !== socket) return;
    net.socket = null;
    netClearPeers();
    if (net.room) {
      // планшет мог уснуть или пропал интернет: заходим обратно на то же место
      net.wanted = { room: net.room, seat: net.seat, auto: true };
      updateNetBadge(ru ? "Нет связи, подключаюсь снова…" : "Reconnecting…");
      net.retry = window.setTimeout(() => netConnect(net.wanted), 2000);
    } else {
      netEls.status.textContent = ru ? "Не получилось подключиться" : "Could not connect";
    }
  };
}

function netDisconnectSocket() {
  window.clearTimeout(net.retry);
  const socket = net.socket;
  net.socket = null;
  if (socket) socket.close();
}

function handleNetMessage(message) {
  const ru = currentLanguage === "ru";
  if (message.t === "s") {
    const peer = net.peers.get(message.id);
    if (peer) peer.data = message.d;
  } else if (message.t === "joined") {
    const firstTime = net.room === null;
    net.room = message.room;
    net.id = message.id;
    net.seat = message.seat;
    message.peers.forEach(addNetPeer);
    updateNetBadge();
    if (firstTime) {
      // комната общая для всей платформы: выбирай любую игру, друзья увидят тебя в той же игре
      const seat = NET_SEATS[net.seat];
      if (state.currentGame === "city" && !state.inHub) spawnNearOwnCar();
      showToast(ru
        ? `Комната ${net.room}! ${seat ? `Твоя машина — ${seat.ru} 🛸 ` : ""}Выбирай игру — друзья будут там же`
        : `Room ${net.room}! ${seat ? `Your car is ${seat.en} 🛸 ` : ""}Pick a game — friends will be there too`);
    }
  } else if (message.t === "peer") {
    addNetPeer(message);
    updateNetBadge();
    showToast(ru ? `${message.name} в игре!` : `${message.name} joined!`);
  } else if (message.t === "left") {
    const peer = net.peers.get(message.id);
    if (peer) showToast(ru ? `${peer.name} вышел` : `${peer.name} left`);
    removeNetPeer(message.id);
    updateNetBadge();
  } else if (message.t === "error") {
    const wasInRoom = net.room !== null;
    netEls.status.textContent = {
      noroom: ru ? "Такой комнаты нет, проверь код" : "No such room",
      full: ru ? "В комнате уже 10 игроков" : "Room is full",
      busy: ru ? "Сервер занят, попробуй ещё раз" : "Server is busy"
    }[message.code] || "";
    if (!wasInRoom) netDisconnectSocket();
  }
}

function addNetPeer(info) {
  if (net.peers.has(info.id)) return;
  const look = { ...NPC_LOOKS[0], ...(info.look || {}) };
  const { group, parts } = createNpcAvatar(look);
  scene.add(group);
  attachRealHuman(group, parts, look);
  // своя летающая машина есть у первых трёх мест, остальные ходят пешком
  const car = flyingCars[info.seat] || null;
  if (car) car.remoteDriven = true;
  const seatColor = NET_SEATS[info.seat] ? NET_SEATS[info.seat].color : "#3fd08a";
  // имя над игроком видно издалека и сквозь дома, так легко найти друг друга
  const image = document.createElement("canvas");
  image.width = 256;
  image.height = 64;
  const context = image.getContext("2d");
  context.fillStyle = "rgba(8,19,33,0.78)";
  context.fillRect(0, 8, 256, 48);
  context.fillStyle = seatColor;
  context.fillRect(0, 8, 10, 48);
  context.fillStyle = "#ffffff";
  context.font = "800 30px Arial";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(info.name, 133, 33, 230);
  const tag = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(image), depthTest: false, sizeAttenuation: false, transparent: true, fog: false }));
  tag.scale.set(0.2, 0.05, 1);
  tag.renderOrder = 10;
  scene.add(tag);
  net.peers.set(info.id, {
    ...info, group, parts, tag, car, data: null, cycle: 0,
    target: new THREE.Vector3(), carTarget: new THREE.Vector3(), carQuaternion: new THREE.Quaternion(), wallNormal: new THREE.Vector3()
  });
}

function removeNetPeer(id) {
  const peer = net.peers.get(id);
  if (!peer) return;
  if (peer.group.parent) peer.group.parent.remove(peer.group);
  scene.remove(peer.tag);
  if (peer.car) {
    peer.car.remoteDriven = false;
    peer.car.netDriving = false;
  }
  net.peers.delete(id);
}

function netClearPeers() {
  Array.from(net.peers.keys()).forEach(removeNetPeer);
}

function updateNetBadge(text) {
  const ru = currentLanguage === "ru";
  netEls.badge.classList.toggle("hidden", net.room === null);
  // «Кто из них?» — отдельная страница: туда идём с тем же кодом комнаты
  const hideTile = document.getElementById("launchHideGame");
  if (hideTile) hideTile.href = net.room === null ? "./hidegame.html" : `./hidegame.html?room=${net.room}`;
  if (net.room === null) return;
  const seat = NET_SEATS[net.seat];
  const count = net.peers.size + 1;
  netEls.badge.textContent = text || (ru
    ? `👥 Комната ${net.room} · ${count}/10${seat ? ` · твоя машина: ${seat.ru}` : ""}`
    : `👥 Room ${net.room} · ${count}/10${seat ? ` · your car: ${seat.en}` : ""}`);
  netEls.status.textContent = text || (ru
    ? `✅ Ты в комнате ${net.room} (👥 ${count}). Выбирай любую игру — друзья увидят тебя там же`
    : `✅ You are in room ${net.room} (👥 ${count}). Pick any game — friends will see you there`);
}

// в городе встаём рядом со своей машиной (если она есть)
function spawnNearOwnCar() {
  const car = net.room !== null ? flyingCars[net.seat] : null;
  if (!car) return;
  const position = car.group.position;
  respawnPlayer(new THREE.Vector3(position.x - 4, 0, position.z + 4.5));
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

// 12 раз в секунду рассказываем другим, где мы и что делаем
function sendNetState() {
  const keys = state.keys;
  const car = flyingCars[net.seat] || null;
  const position = car ? car.group.position : null;
  const quaternion = car ? car.group.quaternion : null;
  const vehicle = state.currentVehicle;
  const onWall = car && (car.wallPhase === "on" || car.wallPhase === "attach");
  net.socket.send(JSON.stringify({
    t: "s",
    d: {
      h: state.currentGame === "city" && !state.inHub ? 0 : 1,
      gm: state.inHub ? "" : state.currentGame || "",
      p: [round2(player.position.x), round2(player.position.y), round2(player.position.z)],
      a: round2(player.angle),
      m: moveAmount > 0.04 ? 1 : 0,
      r: keys.ShiftLeft || keys.ShiftRight ? 1 : 0,
      g: player.grounded ? 1 : 0,
      v: car && vehicle === car ? 1 : vehicle ? 2 : 0,
      c: car ? [round2(position.x), round2(position.y), round2(position.z), round2(quaternion.x), round2(quaternion.y), round2(quaternion.z), round2(quaternion.w)] : 0,
      f: car ? [round2(car.forwardSpeed), round2(car.verticalSpeed), round2(car.yawRate), round2(car.spool)] : 0,
      i: car && vehicle === car ? [
        (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0),
        (keys.KeyA || keys.ArrowLeft ? 1 : 0) - (keys.KeyD || keys.ArrowRight ? 1 : 0),
        (keys.Space ? 1 : 0) - (keys.KeyC || keys.ControlLeft ? 1 : 0),
        keys.ShiftLeft || keys.ShiftRight ? 1.5 : 1
      ] : [0, 0, 0, 1],
      w: onWall && car.wall ? [car.wall.normal.x, car.wall.normal.z] : 0
    }
  }));
}

function updateNetPeer(peer, delta) {
  const data = peer.data;
  if (!data) return;
  const { car, group, parts } = peer;
  const smooth = 1 - Math.exp(-11 * delta);
  // видим друга, только если он в той же игре (город или паркур), а не в меню
  const peerGame = data.gm !== undefined ? data.gm : data.h ? "" : "city";
  const visible = !state.inHub && Boolean(peerGame) && peerGame === state.currentGame;
  peer.tag.visible = visible;

  // машина этого игрока (есть только у первых трёх мест)
  if (car && Array.isArray(data.c) && Array.isArray(data.f)) updateNetPeerCar(peer, data, delta, smooth, visible);
  else if (car) car.netDriving = false;
  updateNetPeerBody(peer, data, delta, smooth, visible);
}

function updateNetPeerCar(peer, data, delta, smooth, visible) {
  const { car } = peer;
  peer.carTarget.set(data.c[0], data.c[1], data.c[2]);
  peer.carQuaternion.set(data.c[3], data.c[4], data.c[5], data.c[6]).normalize();
  const position = car.group.position;
  if (position.distanceTo(peer.carTarget) > 80) position.copy(peer.carTarget);
  else position.lerp(peer.carTarget, smooth);
  car.group.quaternion.slerp(peer.carQuaternion, smooth);
  [car.forwardSpeed, car.verticalSpeed, car.yawRate, car.spool] = data.f;
  car.netDriving = data.v === 1;
  car.floorY = flyerFloorAt(position.x, position.z, position.y);
  car.height = position.y - car.floorY;
  car.airborne = car.height > 0.8;
  if (data.w) {
    car.wallPhase = "on";
    car.wall = { normal: peer.wallNormal.set(data.w[0], 0, data.w[1]) };
    car.floorY = getGroundHeight(position.x, position.z);
  } else {
    car.wallPhase = null;
    car.wall = null;
  }
  if (delta > 0) car.velocity.copy(position).sub(car.lastPosition).divideScalar(delta);
  car.lastPosition.copy(position);
  const input = { forward: data.i[0], turn: data.i[1], lift: data.i[2], boost: data.i[3] };
  updateFlyerVisuals(car, delta, input);
  if (visible) emitFlyerSmoke(car, delta, input);
}

function updateNetPeerBody(peer, data, delta, smooth, visible) {
  const { car, group, parts } = peer;
  // сам игрок: за рулём своей машины или пешком
  if (data.v === 1 && car) {
    if (group.parent !== car.driverSeat) {
      car.driverSeat.add(group);
      group.rotation.set(0, 0, 0);
      group.position.set(0, -AVATAR_HIP_HEIGHT * 0.28 + 0.17, 0);
    }
    animateAvatarRig(parts, delta, { seated: true, steer: car.steerAngle, recline: car.spec.recline, time: clock.elapsedTime });
  } else {
    if (group.parent !== scene) {
      scene.add(group);
      group.position.set(data.p[0], data.p[1], data.p[2]);
    }
    peer.target.set(data.p[0], data.p[1], data.p[2]);
    const before = group.position.clone();
    if (before.distanceTo(peer.target) > 40) group.position.copy(peer.target);
    else group.position.lerp(peer.target, smooth);
    group.rotation.y = turnTowardsAngle(group.rotation.y, data.a, delta, 10);
    peer.cycle += Math.hypot(group.position.x - before.x, group.position.z - before.z) * (data.r ? 0.64 : 0.92);
    animateAvatarRig(parts, delta, data.v === 2
      ? { seated: true, recline: 0.15, time: clock.elapsedTime }
      : { moving: Boolean(data.m), sprint: Boolean(data.r), gait: data.r ? 1 : 0.6, grounded: Boolean(data.g), cycle: peer.cycle, time: clock.elapsedTime });
  }
  group.visible = visible;
  group.getWorldPosition(peer.tag.position);
  peer.tag.position.y += data.v === 1 ? 3 : 5.6;
}

function updateNet(delta) {
  if (net.room === null) {
    return;
  }
  net.peers.forEach((peer) => updateNetPeer(peer, delta));
  net.sendTimer -= delta;
  if (net.sendTimer <= 0 && net.socket && net.socket.readyState === 1) {
    net.sendTimer = 1 / 12;
    sendNetState();
  }
}

// Джойстик и кнопки: нажатия превращаются в те же клавиши, что и на компьютере
function setupTouchControls() {
  const panel = document.getElementById("touchControls");
  const stick = document.getElementById("touchStick");
  const knob = document.getElementById("touchKnob");
  let stickPointer = null;
  const setStick = (x, y) => {
    state.keys.KeyW = y < -0.32;
    state.keys.KeyS = y > 0.32;
    state.keys.KeyA = x < -0.32;
    state.keys.KeyD = x > 0.32;
    knob.style.transform = `translate(${x * 42}px, ${y * 42}px)`;
  };
  const moveStick = (event) => {
    const box = stick.getBoundingClientRect();
    let x = (event.clientX - box.left - box.width / 2) / (box.width / 2);
    let y = (event.clientY - box.top - box.height / 2) / (box.height / 2);
    const length = Math.hypot(x, y);
    if (length > 1) {
      x /= length;
      y /= length;
    }
    setStick(x, y);
  };
  stick.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    stickPointer = event.pointerId;
    stick.setPointerCapture(event.pointerId);
    moveStick(event);
  });
  stick.addEventListener("pointermove", (event) => {
    if (event.pointerId === stickPointer) moveStick(event);
  });
  const releaseStick = (event) => {
    if (event.pointerId !== stickPointer) return;
    stickPointer = null;
    setStick(0, 0);
  };
  stick.addEventListener("pointerup", releaseStick);
  stick.addEventListener("pointercancel", releaseStick);

  panel.querySelectorAll("[data-hold]").forEach((button) => {
    const code = button.dataset.hold;
    const press = (down) => (event) => {
      event.preventDefault();
      state.keys[code] = down;
      if (code === "Space" && state.currentGame === "parkour") player.jumpQueued = down;
      button.classList.toggle("is-down", down);
    };
    button.addEventListener("pointerdown", press(true));
    ["pointerup", "pointercancel", "pointerleave"].forEach((type) => button.addEventListener(type, press(false)));
  });
  panel.querySelectorAll("[data-tap]").forEach((button) => {
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      const code = button.dataset.tap;
      if (code === "view") {
        if (state.mode === "first") setThirdPersonMode();
        else state.mode = "first";
        return;
      }
      window.dispatchEvent(new KeyboardEvent("keydown", { code }));
      window.dispatchEvent(new KeyboardEvent("keyup", { code }));
    });
  });
}

function avatarFingerGeometry(radius, length) {
  const points = [];
  for (let i = 0; i <= 6; i += 1) {
    const a = -Math.PI / 2 + (i / 6) * Math.PI / 2;
    points.push(new THREE.Vector2(Math.cos(a) * radius + 0.0001, Math.sin(a) * radius - length / 2));
  }
  for (let i = 0; i <= 6; i += 1) {
    const a = (i / 6) * Math.PI / 2;
    points.push(new THREE.Vector2(Math.cos(a) * radius * 0.92 + 0.0001, Math.sin(a) * radius + length / 2));
  }
  return new THREE.LatheGeometry(points, 8);
}

// Гладкая часть тела из колец. profile: [y, полуширина, полуглубина, сдвиг вперёд]
function avatarLimb(key, profile, power = 2.2, cols = 22, rows = 16) {
  if (avatarGeo[key]) {
    return avatarGeo[key];
  }
  const tableX = profile.map((row) => [row[0], row[1]]);
  const tableZ = profile.map((row) => [row[0], row[2]]);
  const tableOffset = profile.map((row) => [row[0], row[3] || 0]);
  const yMin = profile[0][0];
  const yMax = profile[profile.length - 1][0];
  avatarGeo[key] = buildLoftGeometry(cols, rows, (u, v, out) => {
    const y = THREE.MathUtils.lerp(yMin, yMax, u);
    const angle = v * Math.PI * 2;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const rx = Math.max(0.01, sampleSpline(tableX, y));
    const rz = Math.max(0.01, sampleSpline(tableZ, y));
    return out.set(
      rx * Math.sign(c) * Math.pow(Math.abs(c), 2 / power),
      y,
      rz * Math.sign(s) * Math.pow(Math.abs(s), 2 / power) + sampleSpline(tableOffset, y)
    );
  });
  return avatarGeo[key];
}

// Голова простая и гладкая: круглая форма, щёчки и маленький нос. Без мелких деталей лицо не выглядит жутко
function sculptHeadPoint(d, e, out) {
  const G = (a, s) => Math.exp(-(a / s) * (a / s));
  const smooth = THREE.MathUtils.smoothstep;
  let x = d.x * 1.1;
  let y = d.y * 1.36;
  let z = d.z * 1.16;
  const low = smooth(-y, -0.1, 1.36);
  x *= 1 - 0.17 * low * low;
  if (y < 0) y *= 0.92;
  if (z < 0) z *= 1.08 - 0.4 * low;
  const ax = Math.abs(x);
  const front = smooth(z, 0.15, 0.75);
  let dz = 0.09 * G(x, 0.12) * G(y + 0.27, 0.11);
  dz += 0.05 * G(ax - 0.6, 0.32) * G(y + 0.42, 0.28);
  z += dz * front;
  return out.set(x, y + 1.42, z);
}

function getAvatarHeadGeometry() {
  if (avatarGeo.head) {
    return avatarGeo.head;
  }
  const widthSegments = 48;
  const heightSegments = 36;
  const geometry = new THREE.SphereGeometry(1, widthSegments, heightSegments);
  const count = geometry.attributes.position.count;
  const turn = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, -1));
  const source = geometry.attributes.position;
  const base = new Float32Array(count * 3);
  const point = new THREE.Vector3();
  const direction = new THREE.Vector3();
  for (let i = 0; i < count; i += 1) {
    // полюс и шов сферы уходят на затылок, на лице их не видно
    direction.fromBufferAttribute(source, i).applyQuaternion(turn);
    sculptHeadPoint(direction, null, point);
    base[i * 3] = point.x;
    base[i * 3 + 1] = point.y;
    base[i * 3 + 2] = point.z;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(base, 3));
  geometry.computeVertexNormals();
  const normals = geometry.attributes.normal.array;
  const stride = widthSegments + 1;
  for (let row = 0; row <= heightSegments; row += 1) {
    const a = row * stride * 3;
    const b = (row * stride + widthSegments) * 3;
    for (let k = 0; k < 3; k += 1) {
      const value = normals[a + k] + normals[b + k];
      normals[a + k] = value;
      normals[b + k] = value;
    }
  }
  geometry.attributes.normal.needsUpdate = true;
  geometry.normalizeNormals();

  // лёгкий румянец на щеках
  const colors = new Float32Array(count * 3);
  const G = (a, s) => Math.exp(-(a / s) * (a / s));
  for (let i = 0; i < count; i += 1) {
    const ax = Math.abs(base[i * 3]);
    const y = base[i * 3 + 1] - 1.42;
    const cheek = base[i * 3 + 2] > 0.2 ? G(ax - 0.62, 0.24) * G(y + 0.34, 0.2) : 0;
    colors[i * 3] = 1 + cheek * 0.03;
    colors[i * 3 + 1] = 1 - cheek * 0.13;
    colors[i * 3 + 2] = 1 - cheek * 0.1;
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  avatarGeo.head = geometry;
  avatarGeo.headBase = base;
  return geometry;
}

// Высота лица на цилиндре головы: на неё садятся очки
function faceSurfaceZ(x) {
  return Math.sqrt(Math.max(0, 1.22 * 1.22 - x * x));
}

// Нога на двух шарнирах: по точке стопы считаем углы бедра и колена
function solveAvatarLeg(footZ, footY, out) {
  const distance = Math.min(Math.hypot(footZ, footY), LEG_THIGH + LEG_SHIN - 0.02);
  const aim = Math.atan2(footZ, -footY);
  const hipBend = Math.acos(THREE.MathUtils.clamp((LEG_THIGH * LEG_THIGH + distance * distance - LEG_SHIN * LEG_SHIN) / (2 * LEG_THIGH * distance), -1, 1));
  const kneeInner = Math.acos(THREE.MathUtils.clamp((LEG_THIGH * LEG_THIGH + LEG_SHIN * LEG_SHIN - distance * distance) / (2 * LEG_THIGH * LEG_SHIN), -1, 1));
  out.thigh = -(aim + hipBend);
  out.knee = Math.PI - kneeInner;
  return out;
}

// Где сейчас стопа одной ноги. Путь плавный, без резких углов на смене опоры и переноса
function avatarStep(phase, stance, reach, lift) {
  const onGround = phase < stance;
  const t = onGround ? phase / stance : (phase - stance) / (1 - stance);
  const angle = onGround ? Math.PI * t : Math.PI * (1 + t);
  const rise = onGround ? Math.pow(Math.max(0, (t - 0.6) / 0.4), 2) * 0.5 : 0.5 * Math.pow(1 - t, 2);
  return {
    z: reach * Math.cos(angle),
    y: rise + (onGround ? 0 : lift * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.72)), 1.5)),
    pitch: onGround
      ? -0.3 * Math.pow(1 - Math.min(1, t / 0.2), 2) + 0.95 * Math.pow(Math.max(0, (t - 0.5) / 0.5), 2)
      : 0.95 * Math.pow(1 - t, 2) - 0.3 * t * t
  };
}

// Отражения неба: одна картинка для дня, одна для ночи
function makeEnvironment(night) {
  const image = document.createElement("canvas");
  image.width = 512;
  image.height = 256;
  const context = image.getContext("2d");
  const sky = context.createLinearGradient(0, 0, 0, 256);
  if (night) {
    sky.addColorStop(0, "#060b18");
    sky.addColorStop(0.48, "#16233e");
    sky.addColorStop(0.52, "#0b0f18");
    sky.addColorStop(1, "#05070c");
  } else {
    sky.addColorStop(0, "#3f7fd0");
    sky.addColorStop(0.42, "#b9dcf4");
    sky.addColorStop(0.5, "#f6ecd8");
    sky.addColorStop(0.53, "#6a6f70");
    sky.addColorStop(1, "#3a3d3c");
  }
  context.fillStyle = sky;
  context.fillRect(0, 0, 512, 256);
  if (!night) {
    const glow = context.createRadialGradient(120, 66, 2, 120, 66, 80);
    glow.addColorStop(0, "rgba(255,250,235,1)");
    glow.addColorStop(1, "rgba(255,250,235,0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, 512, 256);
  }
  context.fillStyle = night ? "rgba(10,14,24,0.9)" : "rgba(52,60,70,0.85)";
  for (let x = 0; x < 512; x += 14) {
    const height = 8 + ((x * 37) % 41);
    context.fillRect(x, 128 - height, 10, height);
  }
  const texture = new THREE.CanvasTexture(image);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  const generator = new THREE.PMREMGenerator(renderer);
  const result = generator.fromEquirectangular(texture).texture;
  generator.dispose();
  texture.dispose();
  return result;
}

// Шум, который бесшовно повторяется: основа для асфальта, грязи и облаков
function makeTilingNoise(size, cells, seed) {
  const lattice = new Float32Array(cells * cells);
  let state2 = seed;
  for (let i = 0; i < lattice.length; i += 1) {
    state2 = (state2 * 1664525 + 1013904223) % 4294967296;
    lattice[i] = state2 / 4294967296;
  }
  const out = new Float32Array(size * size);
  for (let y = 0; y < size; y += 1) {
    const fy = (y / size) * cells;
    const y0 = Math.floor(fy);
    const ty = fy - y0;
    const sy = ty * ty * (3 - 2 * ty);
    for (let x = 0; x < size; x += 1) {
      const fx = (x / size) * cells;
      const x0 = Math.floor(fx);
      const tx = fx - x0;
      const sx = tx * tx * (3 - 2 * tx);
      const a = lattice[(y0 % cells) * cells + (x0 % cells)];
      const b = lattice[(y0 % cells) * cells + ((x0 + 1) % cells)];
      const c = lattice[((y0 + 1) % cells) * cells + (x0 % cells)];
      const d = lattice[((y0 + 1) % cells) * cells + ((x0 + 1) % cells)];
      out[y * size + x] = (a + (b - a) * sx) * (1 - sy) + (c + (d - c) * sx) * sy;
    }
  }
  return out;
}

// В одной текстуре три слоя: мелкое зерно, крупные пятна и вертикальные подтёки
function makeDetailTexture() {
  const size = 512;
  const octaves = [[8, 0.5], [16, 0.25], [32, 0.13], [64, 0.07], [128, 0.05]].map(([cells, weight], index) => [makeTilingNoise(size, cells, 11 + index * 17), weight]);
  const fine = makeTilingNoise(size, 256, 91);
  const streak = makeTilingNoise(size, 64, 53);
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i += 1) {
    let blotch = 0;
    octaves.forEach(([noise, weight]) => { blotch += noise[i] * weight; });
    const y = Math.floor(i / size);
    const x = i % size;
    data[i * 4] = fine[i] * 255;
    data[i * 4 + 1] = Math.min(255, blotch * 255);
    data[i * 4 + 2] = streak[((y >> 3) * size) + x] * 255;
    data[i * 4 + 3] = 255;
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function setupGraphics() {
  gfx.detail = makeDetailTexture();
  gfx.frustum = new THREE.Frustum();
  gfx.frustumMatrix = new THREE.Matrix4();
  gfx.foliageSphere = new THREE.Sphere(new THREE.Vector3(), 100);

  // небо: цвет, солнце, облака и звёзды считаются прямо в шейдере
  const material = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    depthTest: false,
    fog: false,
    uniforms: {
      detail: { value: gfx.detail },
      sunDir: { value: SUN_OFFSET.clone().normalize() },
      night: { value: 0 },
      time: { value: 0 },
      fogColor: { value: new THREE.Color() }
    },
    vertexShader: `
      varying vec3 vDir;
      void main() {
        vDir = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      uniform sampler2D detail;
      uniform vec3 sunDir;
      uniform vec3 fogColor;
      uniform float night;
      uniform float time;
      varying vec3 vDir;
      float clouds(vec2 p) {
        float n = texture2D(detail, p).g * 0.62 + texture2D(detail, p * 2.3 + 0.17).g * 0.28 + texture2D(detail, p * 5.1 + 0.4).g * 0.1;
        return n;
      }
      void main() {
        vec3 dir = normalize(vDir);
        float h = clamp(dir.y, 0.0, 1.0);
        vec3 dayColor = mix(vec3(0.7, 0.87, 1.0), vec3(0.3, 0.6, 0.95), pow(h, 0.6));
        vec3 nightColor = mix(vec3(0.05, 0.08, 0.15), vec3(0.008, 0.014, 0.04), pow(h, 0.4));
        vec3 color = mix(dayColor, nightColor, night);
        float sunDot = max(dot(dir, sunDir), 0.0);
        vec3 glowColor = mix(vec3(1.0, 0.86, 0.66), vec3(0.6, 0.7, 0.9), night);
        color += glowColor * (pow(sunDot, 7.0) * 0.16 + pow(sunDot, 90.0) * 0.32) * (1.0 - night * 0.8);
        color += mix(vec3(9.0, 8.0, 6.5), vec3(1.6), night) * smoothstep(0.99955, 0.9998, sunDot);
        // звёзды
        vec2 starUv = dir.xz / (abs(dir.y) + 0.35) * 2.4;
        float star = smoothstep(0.82, 0.95, texture2D(detail, starUv).r) * smoothstep(0.05, 0.3, dir.y);
        color += vec3(star) * night * 0.7;
        // облака лежат на плоскости высоко над городом
        vec2 uv = dir.xz / (dir.y + 0.09) * 0.16 + vec2(time * 0.0016, time * 0.0007);
        float density = clouds(uv);
        float cover = smoothstep(0.44, 0.62, density) * smoothstep(0.015, 0.16, dir.y);
        float lit = clamp((density - clouds(uv + sunDir.xz * 0.018)) * 6.0 + 0.92, 0.72, 1.12);
        vec3 cloudColor = mix(vec3(1.04, 1.0, 0.95) * lit, vec3(0.1, 0.12, 0.18) * lit, night);
        color = mix(color, cloudColor, cover * 0.94);
        // у горизонта небо уходит в дымку
        color = mix(color, fogColor, (1.0 - smoothstep(0.0, 0.1, dir.y)) * 0.86);
        gl_FragColor = vec4(color, 1.0);
        #include <tonemapping_fragment>
      }`
  });
  gfx.sky = new THREE.Mesh(new THREE.SphereGeometry(1500, 32, 18), material);
  gfx.sky.frustumCulled = false;
  gfx.sky.renderOrder = -20;
  scene.add(gfx.sky);

  if (!gfx.low && !gfx.classic) {
    gfx.envDay = makeEnvironment(false);
    gfx.envNight = makeEnvironment(true);
    scene.environment = gfx.envDay;
    if (gfx.tier === "high" && renderer.capabilities.isWebGL2) {
      setupPostProcessing();
    } else {
      // та же цветокоррекция, но прямо в материалах: почти бесплатно
      THREE.ShaderChunk.tonemapping_pars_fragment = THREE.ShaderChunk.tonemapping_pars_fragment.replace(
        "vec3 CustomToneMapping( vec3 color ) { return color; }",
        `vec3 CustomToneMapping( vec3 color ) {
          vec3 x = color * 0.92;
          vec3 result = clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
          result = mix(result, result * result * (3.0 - 2.0 * result), 0.45);
          float light = dot(result, vec3(0.2126, 0.7152, 0.0722));
          result = mix(vec3(light), result, 1.08);
          return result * mix(vec3(0.97, 0.99, 1.05), vec3(1.03, 1.0, 0.95), smoothstep(0.1, 0.8, light));
        }`
      );
      renderer.toneMapping = THREE.CustomToneMapping;
    }
  }
  window.gfxResize = resizePostProcessing;
  resizePostProcessing();
  applyDayNightLighting();
}

// Постобработка: кадр рисуется в отдельную картинку, потом свечение и киношная цветокоррекция
function setupPostProcessing() {
  const fullscreen = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }`;
  const options = { type: THREE.HalfFloatType, format: THREE.RGBAFormat, depthBuffer: false, stencilBuffer: false };
  gfx.frame = new THREE.WebGLMultisampleRenderTarget(4, 4, { type: THREE.HalfFloatType, format: THREE.RGBAFormat });
  gfx.frame.samples = 4;
  gfx.bloomA = new THREE.WebGLRenderTarget(4, 4, options);
  gfx.bloomB = new THREE.WebGLRenderTarget(4, 4, options);
  gfx.quadScene = new THREE.Scene();
  gfx.quadCamera = new THREE.Camera();
  gfx.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
  gfx.quad.frustumCulled = false;
  gfx.quadScene.add(gfx.quad);
  const pass = (fragmentShader, uniforms) => new THREE.ShaderMaterial({ vertexShader: fullscreen, fragmentShader, uniforms, depthTest: false, depthWrite: false });
  gfx.brightPass = pass(`
    uniform sampler2D source;
    varying vec2 vUv;
    void main() {
      vec3 color = min(texture2D(source, vUv).rgb, vec3(4.0)); // одиночные блики не вспыхивают
      float light = max(color.r, max(color.g, color.b));
      gl_FragColor = vec4(color * smoothstep(1.35, 2.4, light), 1.0);
    }`, { source: { value: null } });
  gfx.blurPass = pass(`
    uniform sampler2D source;
    uniform vec2 stepSize;
    varying vec2 vUv;
    void main() {
      vec3 sum = texture2D(source, vUv).rgb * 0.227;
      sum += (texture2D(source, vUv + stepSize * 1.38).rgb + texture2D(source, vUv - stepSize * 1.38).rgb) * 0.316;
      sum += (texture2D(source, vUv + stepSize * 3.23).rgb + texture2D(source, vUv - stepSize * 3.23).rgb) * 0.07;
      gl_FragColor = vec4(sum, 1.0);
    }`, { source: { value: null }, stepSize: { value: new THREE.Vector2() } });
  gfx.finalPass = pass(`
    uniform sampler2D source;
    uniform sampler2D bloom;
    uniform float night;
    varying vec2 vUv;
    vec3 filmic(vec3 x) {
      return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
    }
    void main() {
      vec3 color = texture2D(source, vUv).rgb + texture2D(bloom, vUv).rgb * 0.5;
      color = filmic(color * 0.92);
      color = mix(color, color * color * (3.0 - 2.0 * color), 0.45);
      float light = dot(color, vec3(0.2126, 0.7152, 0.0722));
      color = mix(vec3(light), color, 1.08);
      // тени чуть холоднее, света чуть теплее
      color *= mix(vec3(0.97, 0.99, 1.05), vec3(1.03, 1.0, 0.95), smoothstep(0.1, 0.8, light));
      vec2 centered = vUv - 0.5;
      color *= 1.0 - dot(centered, centered) * 0.62;
      gl_FragColor = vec4(color, 1.0);
    }`, { source: { value: null }, bloom: { value: null }, night: { value: 0 } });
  gfx.post = true;
}

function resizePostProcessing() {
  if (!gfx.post) {
    return;
  }
  const size = renderer.getDrawingBufferSize(new THREE.Vector2());
  gfx.frame.setSize(size.x, size.y);
  gfx.bloomA.setSize(Math.ceil(size.x / 4), Math.ceil(size.y / 4));
  gfx.bloomB.setSize(Math.ceil(size.x / 4), Math.ceil(size.y / 4));
}

function drawPass(material, target) {
  gfx.quad.material = material;
  renderer.setRenderTarget(target);
  renderer.render(gfx.quadScene, gfx.quadCamera);
}

function renderFrame() {
  const skyUniforms = gfx.sky.material.uniforms;
  gfx.sky.position.copy(camera.position);
  skyUniforms.time.value = clock.elapsedTime;
  skyUniforms.fogColor.value.copy(scene.fog.color);
  gfx.tick += 1;
  // тени считаются каждый кадр: иначе тень от игрока и машин двигается рывками и мерцает
  if (!gfx.low) renderer.shadowMap.needsUpdate = true;
  // листва считается каждый кадр и только там, куда смотрит камера: без появления рывками
  camera.updateMatrixWorld();
  gfx.frustumMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
  gfx.frustum.setFromProjectionMatrix(gfx.frustumMatrix);
  // расстояние считаем по земле, без высоты: с высоты лес не пропадает, а вдали его сменяют простые деревья
  const camX = camera.position.x;
  const camZ = camera.position.z;
  gfx.foliage.forEach(({ mesh, center, far, near, radius }) => {
    const d = Math.hypot(center.x - camX, center.z - camZ);
    gfx.foliageSphere.center.copy(center);
    gfx.foliageSphere.radius = radius || 100;
    mesh.visible = d < (far || 440) && d >= (near || 0) && gfx.frustum.intersectsSphere(gfx.foliageSphere);
  });
  if (!gfx.post) {
    renderer.render(scene, camera);
    return;
  }
  renderer.setRenderTarget(gfx.frame);
  renderer.render(scene, camera);
  gfx.brightPass.uniforms.source.value = gfx.frame.texture;
  drawPass(gfx.brightPass, gfx.bloomA);
  const blur = gfx.blurPass.uniforms;
  const width = gfx.bloomA.width;
  const height = gfx.bloomA.height;
  [1, 2].forEach((spread) => {
    blur.source.value = gfx.bloomA.texture;
    blur.stepSize.value.set(spread / width, 0);
    drawPass(gfx.blurPass, gfx.bloomB);
    blur.source.value = gfx.bloomB.texture;
    blur.stepSize.value.set(0, spread / height);
    drawPass(gfx.blurPass, gfx.bloomA);
  });
  gfx.finalPass.uniforms.source.value = gfx.frame.texture;
  gfx.finalPass.uniforms.bloom.value = gfx.bloomA.texture;
  drawPass(gfx.finalPass, null);
}

// Всем стенам, дорогам и траве добавляем зерно, пятна, грязь у земли и подтёки.
// Рисунок берётся из мировых координат, поэтому текстуры не нужно натягивать на каждый дом.
function addWorldDetail(material) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.worldDetail = { value: gfx.detail };
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vDetailPos;\nvarying vec3 vDetailNormal;")
      .replace("#include <begin_vertex>", `#include <begin_vertex>
        vDetailPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
        vDetailNormal = normalize(mat3(modelMatrix) * objectNormal);`);
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform sampler2D worldDetail;\nvarying vec3 vDetailPos;\nvarying vec3 vDetailNormal;")
      .replace("#include <color_fragment>", `#include <color_fragment>
        float upness = abs(normalize(vDetailNormal).y);
        vec2 detailUv = vDetailPos.xz + vDetailPos.y * vec2(0.7, -0.6);
        vec3 fineTex = texture2D(worldDetail, detailUv * 0.21).rgb;
        vec3 wideTex = texture2D(worldDetail, detailUv * 0.017).rgb;
        // вдали мелкое зерно плавно исчезает, иначе оно рябит при движении камеры
        float nearDetail = 1.0 - smoothstep(25.0, 110.0, distance(vDetailPos, cameraPosition));
        float fineGrain = mix(0.5, fineTex.r, nearDetail);
        float wideBlotch = wideTex.g;
        float greenness = smoothstep(0.02, 0.13, diffuseColor.g - max(diffuseColor.r, diffuseColor.b));
        diffuseColor.rgb *= (0.8 + 0.4 * fineGrain) * (0.74 + 0.52 * wideBlotch);
        // трава: неровный цвет, сухие проплешины, меньше кислотного зелёного
        vec3 grassColor = diffuseColor.rgb * vec3(0.66 + 0.5 * wideBlotch, 0.74, 0.46) * (0.45 + 1.1 * mix(0.5, fineTex.g, nearDetail));
        diffuseColor.rgb = mix(diffuseColor.rgb, grassColor, greenness * smoothstep(0.5, 0.9, upness));
        // стены: темнее у земли и подтёки сверху вниз
        float wallness = 1.0 - smoothstep(0.35, 0.75, upness);
        float grime = 1.0 - smoothstep(0.0, 4.5, vDetailPos.y);
        float streaks = texture2D(worldDetail, vec2(dot(vDetailPos.xz, vec2(0.09)), vDetailPos.y * 0.01)).b;
        diffuseColor.rgb *= 1.0 - wallness * (0.34 * grime + 0.2 * smoothstep(0.5, 0.82, streaks));`)
      .replace("#include <roughnessmap_fragment>", `#include <roughnessmap_fragment>
        roughnessFactor = clamp(roughnessFactor + (wideBlotch - 0.5) * 0.24, 0.12, 1.0);`);
  };
  material.customProgramCacheKey = () => "world-detail";
  material.needsUpdate = true;
}

// Листва: тысячи маленьких веток-картинок вокруг крон, одним вызовом отрисовки
function buildTreeFoliage() {
  if (!treeCards.length) {
    return;
  }
  const image = document.createElement("canvas");
  image.width = 256;
  image.height = 256;
  const context = image.getContext("2d");
  for (let i = 0; i < 230; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.pow(Math.random(), 0.65) * 108;
    const shade = 120 + Math.floor(Math.random() * 110);
    context.fillStyle = `rgb(${Math.floor(shade * 0.72)},${shade},${Math.floor(shade * 0.48)})`;
    context.save();
    context.translate(128 + Math.cos(angle) * distance, 128 + Math.sin(angle) * distance);
    context.rotate(Math.random() * Math.PI);
    context.beginPath();
    context.ellipse(0, 0, 13, 6, 0, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
  const texture = new THREE.CanvasTexture(image);
  texture.anisotropy = 4;
  const material = new THREE.MeshStandardMaterial({ map: texture, alphaTest: 0.12, alphaToCoverage: true, side: THREE.DoubleSide, roughness: 0.72 });
  const cells = new Map();
  treeCards.forEach((card) => {
    const key = `${Math.floor(card.x / 90)},${Math.floor(card.z / 90)}`;
    if (!cells.has(key)) cells.set(key, []);
    cells.get(key).push(card);
  });
  const plane = new THREE.PlaneGeometry(1, 1);
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const euler = new THREE.Euler();
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3();
  const color = new THREE.Color();
  cells.forEach((cards) => {
    const mesh = new THREE.InstancedMesh(plane, material, cards.length);
    const center = new THREE.Vector3();
    cards.forEach((card, index) => {
      euler.set(Math.random() * 6.28, Math.random() * 6.28, Math.random() * 6.28);
      quaternion.setFromEuler(euler);
      position.set(card.x, card.y, card.z);
      center.add(position);
      scale.setScalar(card.size);
      matrix.compose(position, quaternion, scale);
      mesh.setMatrixAt(index, matrix);
      // снизу и внутри кроны темнее, сверху на солнце светлее
      const light = 0.34 + card.light * 0.72;
      color.setRGB(light * (0.62 + Math.random() * 0.16), light * (0.72 + Math.random() * 0.1), light * 0.36);
      mesh.setColorAt(index, color);
    });
    center.divideScalar(cards.length);
    mesh.frustumCulled = false;
    cityGroup.add(mesh);
    gfx.foliage.push({ mesh, center });
  });
}

// Вызывается один раз, когда весь город уже построен
function finishWorldGraphics() {
  buildTreeFoliage();
  buildReliefMap();
  buildForestFringe();
  scatterFallenLeaves();
  buildMeadowDetail();
  addManholes();
  applyReliefToWorld();
  buildFieldCrops();
  buildForestBatches();
  saveMushrooms();
  if (gfx.low || gfx.classic) {
    return;
  }
  const carGroups = new Set(cars.map((car) => car.group));
  const seen = new Set();
  const visit = (object) => {
    if (carGroups.has(object)) return;
    if (object.isMesh && !object.isInstancedMesh) {
      [].concat(object.material).forEach((material) => {
        if (seen.has(material) || !material.isMeshStandardMaterial || material.isMeshPhysicalMaterial || material.transparent || material.userData.ownShader) return;
        seen.add(material);
        material.envMapIntensity = 0.5;
        addWorldDetail(material);
      });
    }
    object.children.forEach(visit);
  };
  visit(cityGroup);
  // окна отражают небо, а ночью горят своим цветом
  buildingWindowMaterials.forEach((material) => {
    material.metalness = 0.82;
    material.roughness = 0.1;
    material.envMapIntensity = 1.3;
    if (material !== glassTowerMaterial) material.color.lerp(new THREE.Color(0x22303e), 0.7);
  });
  applyDayNightLighting();
}

// Подвеска: кузов живёт на пружинах. При разгоне приседает, при торможении клюёт, в повороте кренится наружу
function updateCarBody(car, delta, longAccel, latAccel) {
  const s = car.susp || (car.susp = { pitch: 0, pitchV: 0, roll: 0, rollV: 0, heave: 0, heaveV: 0 });
  const pitchTarget = THREE.MathUtils.clamp(longAccel * 0.0042, -0.075, 0.05);
  const rollTarget = THREE.MathUtils.clamp(latAccel * 0.0021, -0.085, 0.085);
  const speedRatio = Math.min(1, Math.abs(car.speed || car.forwardSpeed || 0) / 40);
  const time = clock.elapsedTime;
  const road = speedRatio * (Math.sin(time * 17) * 0.006 + Math.sin(time * 29.3) * 0.004);
  const heaveTarget = road - Math.abs(s.roll) * 0.6;
  s.pitchV += (70 * (pitchTarget - s.pitch) - 9.5 * s.pitchV) * delta;
  s.pitch += s.pitchV * delta;
  s.rollV += (58 * (rollTarget - s.roll) - 8 * s.rollV) * delta;
  s.roll += s.rollV * delta;
  s.heaveV += (160 * (heaveTarget - s.heave) - 15 * s.heaveV) * delta;
  s.heave += s.heaveV * delta;
  car.body.rotation.z = s.pitch;
  car.body.rotation.x = s.roll;
  car.body.position.y = s.heave;
}

// Камера из кабины и руки на руле: для всех машин
function ensureCarCockpit(car) {
  if (car.fpEye) {
    return;
  }
  const spec = car.spec;
  const seatX = spec.wsBase - 2.3;
  const driverZ = -spec.W * 0.22;
  car.fpEye = new THREE.Object3D();
  car.fpEye.position.set(seatX - 0.3, spec.belt + 0.78, driverZ);
  car.fpEye.userData.dynamic = true;
  car.body.add(car.fpEye);
  // изнутри кузов закрыт тёмной обшивкой, а руль поднят к водителю
  car.fpCover = new THREE.Mesh(
    new THREE.BoxGeometry(spec.wsBase - seatX + 2.2, 0.06, spec.W - 0.62),
    new THREE.MeshStandardMaterial({ color: 0x24272d, roughness: 0.82 })
  );
  car.fpCover.position.set((spec.wsBase + seatX - 2.2) / 2, spec.belt + 0.05, 0);
  car.fpCover.visible = false;
  car.body.add(car.fpCover);
  car.steerHome = car.steeringSpin.parent.position.y;
  car.steerCockpit = spec.belt + 0.34;
  car.fpArms = new THREE.Group();
  car.fpArms.visible = false;
  car.body.add(car.fpArms);
  const armGeometry = new THREE.BoxGeometry(0.15, 1, 0.16);
  armGeometry.translate(0, 0.5, 0);
  car.fpHands = [];
  car.arms = [-1, 1].map((side) => {
    const hand = new THREE.Mesh(rbBoxGeometry(0.13, 0.17, 0.15, 0.05), avatarMaterials.skin);
    hand.position.set(-0.03, 0.05, side * 0.38);
    hand.visible = false;
    car.steeringSpin.add(hand);
    car.fpHands.push(hand);
    const mesh = new THREE.Mesh(armGeometry, avatarMaterials.body);
    car.fpArms.add(mesh);
    return { hand, mesh, elbow: new THREE.Vector3(seatX + 0.98, spec.belt - 0.08, driverZ + side * 0.44) };
  });
  addCockpitBody(car.fpArms, car.arms, seatX, spec.seatY, driverZ);
}

function setCockpitView(car, enabled) {
  car.fpArms.visible = enabled;
  car.fpHands.forEach((hand) => { hand.visible = enabled; });
  // изнутри стекло почти прозрачное, но его видно: блики и лёгкий оттенок
  if (car.cabin) {
    car.cabinMaterial = car.cabinMaterial || car.cabin.material;
    car.cabin.material = enabled ? getInnerCarGlassMaterial() : car.cabinMaterial;
  }
  if (car.fpCover) {
    car.fpCover.visible = enabled;
    car.steeringSpin.parent.position.y = enabled ? car.steerCockpit : car.steerHome;
  }
  if (car.hud) car.hud.visible = enabled;
}

// Мышью можно посмотреть по сторонам, потом взгляд сам вернётся вперёд
function placeCockpitCamera(car, delta) {
  const orbitChange = THREE.MathUtils.euclideanModulo(cameraOrbit.yaw - (car.lastOrbitYaw === undefined ? cameraOrbit.yaw : car.lastOrbitYaw) + Math.PI, Math.PI * 2) - Math.PI;
  car.lastOrbitYaw = cameraOrbit.yaw;
  car.lookYaw = car.lookYaw || 0;
  car.lookPitch = car.lookPitch || 0;
  if (cameraOrbit.dragging) {
    car.lookYaw = THREE.MathUtils.clamp(car.lookYaw + orbitChange, -2.2, 2.2);
    car.lookPitch = THREE.MathUtils.clamp(0.28 - cameraOrbit.pitch, -0.6, 0.5);
  } else {
    car.lookYaw = dampTo(car.lookYaw, 0, 3, delta);
    car.lookPitch = dampTo(car.lookPitch, 0, 3, delta);
    cameraOrbit.pitch = dampTo(cameraOrbit.pitch, 0.28, 3, delta);
  }
  // голова чуть смотрит в поворот, как у настоящего водителя
  const steerLook = (car.steerAngle || 0) * 0.5;
  car.fpEye.updateWorldMatrix(true, false);
  camera.position.setFromMatrixPosition(car.fpEye.matrixWorld);
  const shake = (car.spool || 0) * (car.height < 8 ? 0.02 : 0.006);
  camera.position.x += (Math.random() - 0.5) * shake;
  camera.position.y += (Math.random() - 0.5) * shake;
  car.body.getWorldQuaternion(camera.quaternion);
  camera.quaternion
    .multiply(flyerTmp.q.setFromAxisAngle(flyerTmp.up, car.lookYaw + steerLook))
    .multiply(FLYER_VIEW_TURN)
    .multiply(flyerTmp.q.setFromAxisAngle(flyerTmp.x, car.lookPitch - 0.09));
  avatar.visible = false;
  // предплечья тянутся от локтей к рукам на руле
  car.arms.forEach((arm) => {
    arm.hand.getWorldPosition(flyerTmp.a);
    car.body.worldToLocal(flyerTmp.a);
    const direction = flyerTmp.b.copy(flyerTmp.a).sub(arm.elbow);
    const length = direction.length();
    arm.mesh.position.copy(arm.elbow);
    arm.mesh.scale.set(1, length, 1);
    arm.mesh.quaternion.setFromUnitVectors(flyerTmp.up, direction.normalize());
    if (arm.upper) {
      const upper = flyerTmp.b.copy(arm.elbow).sub(arm.shoulder);
      arm.upper.position.copy(arm.shoulder);
      arm.upper.scale.set(1, upper.length(), 1);
      arm.upper.quaternion.setFromUnitVectors(flyerTmp.up, upper.normalize());
    }
  });
}

// Пока открыто меню, заранее готовим всю графику: шейдеры и весь город целиком.
// Тогда вход в игру быстрый, а при повороте камеры ничего не догружается рывками
function warmUpWorld() {
  if (gfx.warm) {
    return;
  }
  gfx.warm = true;
  renderGameThumbnails();
  const cityWasVisible = cityGroup.visible;
  cityGroup.visible = true;
  gfx.foliage.forEach(({ mesh }) => { mesh.visible = true; });
  const eye = new THREE.OrthographicCamera(-1000, 1000, 1000, -1000, 1, 2600);
  eye.position.set(150, 1300, 0);
  eye.lookAt(150, 0, 0);
  eye.updateMatrixWorld();
  if (!gfx.low) renderer.shadowMap.needsUpdate = true;
  renderer.setRenderTarget(gfx.post ? gfx.frame : null);
  renderer.render(scene, eye);
  renderer.setRenderTarget(null);
  cityGroup.visible = cityWasVisible;
  renderFrame();
}

function collectHumanBones(root) {
  const map = {};
  const list = [];
  root.traverse((object) => {
    if (object.isBone) {
      list.push(object);
      map[object.name.replace("mixamorig", "")] = object;
    }
  });
  return { map, list };
}

// Перенос записанных движений с одного скелета на другой.
// Сравниваем поворот каждой кости с её позой в «букве Т» и повторяем тот же поворот на другом человеке
function bakeRealHumanClips(target, source, sourceClips) {
  const scene = target.scene;
  const sourceScene = source.scene;
  sourceScene.rotation.y = Math.PI; // в записи человек смотрит в обратную сторону
  scene.updateMatrixWorld(true);
  const tBones = collectHumanBones(scene);
  const sBones = collectHumanBones(sourceScene);
  const mixer = new THREE.AnimationMixer(sourceScene);
  const setSourcePose = (clip, time) => {
    mixer.stopAllAction();
    mixer.clipAction(clip).play();
    mixer.setTime(time);
    sourceScene.updateMatrixWorld(true);
  };
  setSourcePose(sourceClips.find((clip) => clip.name === "TPose"), 0);

  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const d = new THREE.Vector3();
  const q = new THREE.Quaternion();
  const parentWorld = new THREE.Quaternion();
  const restSource = {};
  Object.keys(sBones.map).forEach((name) => {
    restSource[name] = sBones.map[name].getWorldQuaternion(new THREE.Quaternion());
  });

  // модель стоит с опущенными руками, поэтому сначала ставим её кости в ту же позу, что и у записи
  const limbChild = {
    LeftShoulder: "LeftArm", RightShoulder: "RightArm", LeftArm: "LeftForeArm", RightArm: "RightForeArm",
    LeftForeArm: "LeftHand", RightForeArm: "RightHand", LeftHand: "LeftHandMiddle1", RightHand: "RightHandMiddle1",
    LeftUpLeg: "LeftLeg", RightUpLeg: "RightLeg", LeftLeg: "LeftFoot", RightLeg: "RightFoot", LeftFoot: "LeftToeBase", RightFoot: "RightToeBase"
  };
  tBones.list.forEach((bone) => {
    const child = limbChild[bone.name];
    if (!child || !tBones.map[child] || !sBones.map[bone.name] || !sBones.map[child]) return;
    bone.getWorldPosition(a);
    tBones.map[child].getWorldPosition(b);
    sBones.map[bone.name].getWorldPosition(c);
    sBones.map[child].getWorldPosition(d);
    q.setFromUnitVectors(b.sub(a).normalize(), d.sub(c).normalize());
    const world = bone.getWorldQuaternion(new THREE.Quaternion()).premultiply(q);
    bone.parent.getWorldQuaternion(parentWorld);
    bone.quaternion.copy(parentWorld.invert().multiply(world));
    bone.updateMatrixWorld(true);
  });
  scene.updateMatrixWorld(true);
  const restTarget = {};
  tBones.list.forEach((bone) => {
    restTarget[bone.name] = bone.getWorldQuaternion(new THREE.Quaternion());
  });
  const hips = tBones.map.Hips;
  const rootWorld = hips.parent.getWorldQuaternion(new THREE.Quaternion());
  const hipsRest = hips.getWorldPosition(new THREE.Vector3());
  const sourceHips = sBones.map.Hips;
  const sourceRest = sourceHips.getWorldPosition(new THREE.Vector3());
  const hipRatio = hipsRest.y / sourceRest.y;

  // поза кадра: для каждой кости считаем локальный поворот из мирового
  const solvePose = (deltaFor, write) => {
    const worlds = {};
    tBones.list.forEach((bone) => {
      const delta = deltaFor(bone);
      if (!delta) return;
      const world = delta.clone().multiply(restTarget[bone.name]);
      worlds[bone.name] = world;
      const parent = worlds[bone.parent.name] || rootWorld;
      write(bone, parent.clone().invert().multiply(world));
    });
  };

  const clips = {};
  sourceClips.filter((clip) => clip.name !== "TPose").forEach((clip) => {
    const frames = Math.max(2, Math.round(clip.duration * 30));
    const times = [];
    const values = {};
    const positions = [];
    for (let frame = 0; frame <= frames; frame += 1) {
      const time = (frame / frames) * clip.duration;
      times.push(time);
      setSourcePose(clip, Math.min(time, clip.duration - 0.0001));
      solvePose((bone) => {
        const from = sBones.map[bone.name];
        if (!from) return null;
        return from.getWorldQuaternion(new THREE.Quaternion()).multiply(restSource[bone.name].clone().invert());
      }, (bone, local) => {
        (values[bone.name] = values[bone.name] || []).push(local.x, local.y, local.z, local.w);
      });
      sourceHips.getWorldPosition(a).sub(sourceRest).multiplyScalar(hipRatio);
      b.copy(hipsRest);
      b.x += a.x;
      b.y += a.y;
      hips.parent.worldToLocal(b);
      positions.push(b.x, b.y, b.z);
    }
    const tracks = Object.keys(values).map((name) => new THREE.QuaternionKeyframeTrack(`${name}.quaternion`, times, values[name]));
    tracks.push(new THREE.VectorKeyframeTrack("Hips.position", times, positions));
    clips[clip.name] = new THREE.AnimationClip(clip.name, clip.duration, tracks);
  });

  // позы, которых нет в записи: сидя в машине и в прыжке
  const rotX = (angle) => new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), angle);
  const aim = (from, to) => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(...from).normalize(), new THREE.Vector3(...to).normalize());
  const makePose = (name, table) => {
    const inherited = {};
    const tracks = [];
    solvePose((bone) => {
      const delta = table[bone.name] || inherited[bone.parent.name] || new THREE.Quaternion();
      inherited[bone.name] = delta;
      return sBones.map[bone.name] ? delta : null;
    }, (bone, local) => {
      tracks.push(new THREE.QuaternionKeyframeTrack(`${bone.name}.quaternion`, [0], [local.x, local.y, local.z, local.w]));
    });
    clips[name] = new THREE.AnimationClip(name, 1, tracks);
  };
  makePose("Sit", {
    Spine: rotX(-0.14), LeftUpLeg: rotX(-1.42), RightUpLeg: rotX(-1.42), LeftLeg: rotX(-0.1), RightLeg: rotX(-0.1), LeftFoot: rotX(-0.1), RightFoot: rotX(-0.1),
    LeftArm: aim([1, 0, 0], [0.26, -0.45, 0.85]), RightArm: aim([-1, 0, 0], [-0.26, -0.45, 0.85]),
    LeftForeArm: aim([1, 0, 0], [-0.22, 0.1, 0.97]), RightForeArm: aim([-1, 0, 0], [0.22, 0.1, 0.97])
  });
  makePose("Jump", {
    Spine: rotX(0.12), LeftUpLeg: rotX(-1.05), LeftLeg: rotX(0.25), LeftFoot: rotX(0.3), RightUpLeg: rotX(0.25), RightLeg: rotX(1.05), RightFoot: rotX(1.2),
    LeftArm: aim([1, 0, 0], [0.7, -0.6, 0.35]), RightArm: aim([-1, 0, 0], [-0.7, -0.6, -0.35]),
    LeftForeArm: aim([1, 0, 0], [0.45, -0.1, 0.9]), RightForeArm: aim([-1, 0, 0], [-0.5, -0.65, 0.55])
  });
  mixer.stopAllAction();
  return clips;
}

function loadRealHuman() {
  if (location.protocol === "file:") {
    return;
  }
  const loader = new THREE.GLTFLoader();
  const load = (url) => new Promise((resolve, reject) => loader.load(url, resolve, undefined, reject));
  Promise.all([load("./models/readyplayer.glb"), load("./models/Soldier.glb")]).then(([human, moves]) => {
    realHuman.clips = bakeRealHumanClips(human, moves, moves.animations);
    // для копий нужна модель в исходной позе
    realHuman.scene = human.scene;
    const box = new THREE.Box3().setFromObject(human.scene);
    realHuman.scale = 3.55 / (box.max.y - box.min.y);
    realHuman.ready = true;
    attachRealHuman(avatar, avatarParts);
    if (hubPreviewAvatar) attachRealHuman(hubPreviewAvatar, hubPreviewParts);
    if (sidebarPreviewAvatar) attachRealHuman(sidebarPreviewAvatar, sidebarPreviewParts);
    npcs.forEach((npc, index) => attachRealHuman(npc.group, npc.parts, NPC_LOOKS[index % NPC_LOOKS.length]));
    net.peers.forEach((peer) => attachRealHuman(peer.group, peer.parts, peer.look));
  }).catch((error) => {
    console.warn("Real human model is not available", error);
  });
}

// Вместо нарисованного тела внутрь группы ставится настоящая модель. look меняет цвет верхней одежды
function attachRealHuman(group, parts, look) {
  if (!realHuman.ready || !parts || parts.real) {
    return;
  }
  const model = THREE.SkeletonUtils.clone(realHuman.scene);
  const holder = new THREE.Group();
  holder.scale.setScalar(realHuman.scale / group.scale.x);
  holder.add(model);
  model.traverse((object) => {
    if (!object.isMesh) return;
    object.frustumCulled = false;
    object.castShadow = true;
    if (look && look.body && /Outfit_Top/.test(object.name)) {
      object.material = object.material.clone();
      object.material.color.set(look.body).lerp(new THREE.Color(0xffffff), 0.3);
    }
  });
  group.add(holder);
  parts.hips.visible = false;
  const mixer = new THREE.AnimationMixer(model);
  const actions = {};
  Object.keys(realHuman.clips).forEach((name) => {
    actions[name] = mixer.clipAction(realHuman.clips[name]);
  });
  actions.Idle.play();
  parts.real = { mixer, actions, current: "Idle", holder, offset: Math.random() * 3 };
  actions.Idle.time = parts.real.offset % realHuman.clips.Idle.duration;
}

function updateRealHuman(P, delta, options) {
  const real = P.real;
  const { moving = false, grounded = true, sprint = false } = options;
  const gait = options.gait === undefined ? (sprint ? 1 : 0) : options.gait;
  let next = "Idle";
  let speed = 1;
  if (options.seated) {
    next = "Sit";
  } else if (!grounded) {
    next = "Jump";
  } else if (moving) {
    next = gait >= 0.4 ? "Run" : "Walk";
    speed = gait >= 0.9 ? 1.42 : gait >= 0.4 ? 0.98 : 1.25;
  }
  if (next !== real.current) {
    const from = real.actions[real.current];
    const to = real.actions[next];
    to.reset();
    to.play();
    from.crossFadeTo(to, next === "Sit" ? 0.3 : 0.2, false);
    real.current = next;
  }
  real.actions[next].timeScale = speed;
  real.mixer.update(delta);
  // в поворотах тело наклоняется внутрь дуги
  let bank = 0;
  if (options.heading !== undefined) {
    const change = real.heading === undefined ? 0 : THREE.MathUtils.euclideanModulo(options.heading - real.heading + Math.PI, Math.PI * 2) - Math.PI;
    real.heading = options.heading;
    if (moving && delta > 0) bank = THREE.MathUtils.clamp(-(change / delta) * 0.05, -0.18, 0.18);
  }
  real.holder.rotation.z = dampTo(real.holder.rotation.z, bank, 8, delta);
}

// Картинки для плиток игр снимаются прямо в игре, как превью в Roblox
function renderGameThumbnails() {
  const width = 640;
  const height = 360;
  const target = new THREE.WebGLRenderTarget(width, height);
  const shot = new THREE.PerspectiveCamera(52, width / height, 0.4, 1800);
  const pixels = new Uint8Array(width * height * 4);
  const canvas2d = document.createElement("canvas");
  canvas2d.width = width;
  canvas2d.height = height;
  const context = canvas2d.getContext("2d");
  const take = (element, from, to, group) => {
    if (!element) return;
    const visible = [cityGroup.visible, parkourGroup.visible];
    cityGroup.visible = group === cityGroup;
    parkourGroup.visible = group === parkourGroup;
    gfx.foliage.forEach(({ mesh }) => { mesh.visible = group === cityGroup; });
    shot.position.copy(from);
    shot.lookAt(to);
    shot.updateMatrixWorld();
    gfx.sky.position.copy(shot.position);
    renderer.setRenderTarget(target);
    renderer.render(scene, shot);
    renderer.readRenderTargetPixels(target, 0, 0, width, height, pixels);
    renderer.setRenderTarget(null);
    [cityGroup.visible, parkourGroup.visible] = visible;
    const image = context.createImageData(width, height);
    for (let y = 0; y < height; y += 1) {
      image.data.set(pixels.subarray((height - 1 - y) * width * 4, (height - y) * width * 4), y * width * 4);
    }
    context.putImageData(image, 0, 0);
    element.style.backgroundImage = `url(${canvas2d.toDataURL("image/jpeg", 0.86)})`;
  };
  try {
    take(document.getElementById("cityThumb"), new THREE.Vector3(-58, 30, 62), new THREE.Vector3(10, 6, -8), cityGroup);
    take(document.getElementById("parkourThumb"), new THREE.Vector3(parkourSpawn.x - 20, parkourSpawn.y + 14, parkourSpawn.z + 22), new THREE.Vector3(parkourSpawn.x + 30, parkourSpawn.y + 4, parkourSpawn.z - 6), parkourGroup);
  } catch (error) {
    console.warn("Could not render thumbnails", error);
  }
  target.dispose();
}

// Боковое меню и верхняя панель: кнопки ведут в разделы, как в Roblox
function setupHubMenu() {
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  document.querySelectorAll("[data-hub]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".rb-nav").forEach((item) => item.classList.toggle("active", item.dataset.hub === button.dataset.hub));
      const section = button.dataset.hub;
      if (section === "home") scrollTo("hubHome");
      if (section === "games") scrollTo("hubGames");
      if (section === "friends") scrollTo("hubFriends");
      if (section === "avatar" && sidebar.classList.contains("collapsed")) panelToggle.click();
      if (section === "settings") {
        if (sidebar.classList.contains("collapsed")) panelToggle.click();
        const settings = document.getElementById("settingsPanel");
        if (settings && settings.classList.contains("collapsed")) document.getElementById("settingsToggle").click();
      }
    });
  });
  const search = document.getElementById("hubSearch");
  if (search) {
    search.addEventListener("input", () => {
      const query = search.value.trim().toLowerCase();
      document.querySelectorAll(".rb-tile").forEach((tile) => {
        tile.classList.toggle("hidden", Boolean(query) && !tile.textContent.toLowerCase().includes(query));
      });
    });
  }
}

// Кубик со скруглёнными краями: из таких деталей собраны человечки, как в Roblox
function rbBoxGeometry(width, height, depth, radius = 0.12) {
  const key = `box:${width}:${height}:${depth}:${radius}`;
  if (avatarGeo[key]) {
    return avatarGeo[key];
  }
  const r = Math.min(radius, width / 2 - 0.01, height / 2 - 0.01, depth / 2 - 0.01);
  const shape = new THREE.Shape();
  const w = width / 2 - r;
  const h = height / 2 - r;
  shape.moveTo(-w, -height / 2 + r * 0.2);
  shape.lineTo(w, -height / 2 + r * 0.2);
  shape.lineTo(w, height / 2 - r * 0.2);
  shape.lineTo(-w, height / 2 - r * 0.2);
  shape.lineTo(-w, -height / 2 + r * 0.2);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.01, depth - r * 2), bevelEnabled: true, bevelThickness: r, bevelSize: r * 0.8, bevelSegments: 3, curveSegments: 4
  });
  geometry.translate(0, 0, -(depth - r * 2) / 2);
  geometry.computeVertexNormals();
  avatarGeo[key] = geometry;
  return geometry;
}

// Голова — скруглённый цилиндр, как у человечков Roblox
function rbHeadGeometry() {
  if (avatarGeo.rbHead) {
    return avatarGeo.rbHead;
  }
  const points = [new THREE.Vector2(0.001, 0.33)];
  for (let i = 0; i <= 6; i += 1) {
    const angle = -Math.PI / 2 + (i / 6) * (Math.PI / 2);
    points.push(new THREE.Vector2(0.9 + Math.cos(angle) * 0.32, 0.65 + Math.sin(angle) * 0.32));
  }
  for (let i = 0; i <= 6; i += 1) {
    const angle = (i / 6) * (Math.PI / 2);
    points.push(new THREE.Vector2(0.9 + Math.cos(angle) * 0.32, 2.25 + Math.sin(angle) * 0.32));
  }
  points.push(new THREE.Vector2(0.001, 2.57));
  avatarGeo.rbHead = new THREE.LatheGeometry(points, 36);
  return avatarGeo.rbHead;
}

// Лицо-наклейка, как в Roblox: глаза-точки и рот рисуются на картинке
function getFaceTexture(faceId, blink) {
  const key = `${faceId}:${blink ? 1 : 0}`;
  avatarGeo.faces = avatarGeo.faces || {};
  if (avatarGeo.faces[key]) {
    return avatarGeo.faces[key];
  }
  const image = document.createElement("canvas");
  image.width = 256;
  image.height = 184;
  const g = image.getContext("2d");
  g.lineCap = "round";
  g.lineJoin = "round";
  g.fillStyle = "#16161a";
  g.strokeStyle = "#16161a";
  const eye = (x, y, scale = 1) => {
    if (blink) {
      g.lineWidth = 6;
      g.beginPath();
      g.moveTo(x - 11, y + 2);
      g.lineTo(x + 11, y + 2);
      g.stroke();
      return;
    }
    g.fillStyle = "#16161a";
    g.beginPath();
    g.ellipse(x, y, 10 * scale, 16 * scale, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#ffffff";
    g.beginPath();
    g.arc(x + 3 * scale, y - 6 * scale, 3.6 * scale, 0, Math.PI * 2);
    g.fill();
  };
  const closedEye = (x, y) => {
    g.lineWidth = 6;
    g.beginPath();
    g.arc(x, y - 4, 11, 0.15 * Math.PI, 0.85 * Math.PI);
    g.stroke();
  };
  const mouthArc = (y, radius, from, to, width = 7) => {
    g.lineWidth = width;
    g.beginPath();
    g.arc(128, y, radius, from, to);
    g.stroke();
  };
  const blush = () => {
    g.fillStyle = "rgba(255,120,140,0.35)";
    [72, 184].forEach((x) => {
      g.beginPath();
      g.ellipse(x, 104, 17, 9, 0, 0, Math.PI * 2);
      g.fill();
    });
  };
  const left = 98;
  const right = 158;
  const eyeY = 70;
  if (faceId === "happy") {
    eye(left, eyeY);
    eye(right, eyeY);
    blush();
    g.fillStyle = "#16161a";
    g.beginPath();
    g.moveTo(98, 108);
    g.quadraticCurveTo(128, 104, 158, 108);
    g.quadraticCurveTo(156, 150, 128, 150);
    g.quadraticCurveTo(100, 150, 98, 108);
    g.fill();
    g.fillStyle = "#ffffff";
    g.fillRect(106, 109, 44, 8);
  } else if (faceId === "wink") {
    eye(left, eyeY);
    closedEye(right, eyeY + 4);
    mouthArc(96, 30, 0.2 * Math.PI, 0.75 * Math.PI);
  } else if (faceId === "cool") {
    [left, right].forEach((x) => {
      eye(x, eyeY + 3, 0.9);
      g.fillStyle = "#f6d7b8";
      g.fillRect(x - 13, eyeY - 18, 26, 13);
      g.lineWidth = 5;
      g.beginPath();
      g.moveTo(x - 13, eyeY - 5);
      g.lineTo(x + 13, eyeY - 5);
      g.stroke();
    });
    g.lineWidth = 7;
    g.beginPath();
    g.moveTo(108, 126);
    g.quadraticCurveTo(136, 132, 154, 114);
    g.stroke();
  } else if (faceId === "freckles") {
    eye(left, eyeY);
    eye(right, eyeY);
    blush();
    g.fillStyle = "#9a5a3a";
    [[66, 96], [76, 104], [86, 96], [170, 96], [180, 104], [190, 96]].forEach(([x, y]) => {
      g.beginPath();
      g.arc(x, y, 2.6, 0, Math.PI * 2);
      g.fill();
    });
    g.strokeStyle = "#16161a";
    mouthArc(98, 30, 0.18 * Math.PI, 0.82 * Math.PI);
  } else if (faceId === "neutral") {
    eye(left, eyeY);
    eye(right, eyeY);
    g.lineWidth = 7;
    g.beginPath();
    g.moveTo(110, 124);
    g.lineTo(146, 124);
    g.stroke();
  } else if (faceId === "surprised") {
    eye(left, eyeY - 2, 1.18);
    eye(right, eyeY - 2, 1.18);
    g.fillStyle = "#16161a";
    g.beginPath();
    g.ellipse(128, 128, 13, 17, 0, 0, Math.PI * 2);
    g.fill();
  } else if (faceId === "angry") {
    eye(left, eyeY + 4);
    eye(right, eyeY + 4);
    g.lineWidth = 7;
    g.beginPath();
    g.moveTo(80, 42);
    g.lineTo(112, 56);
    g.moveTo(176, 42);
    g.lineTo(144, 56);
    g.stroke();
    mouthArc(150, 26, 1.2 * Math.PI, 1.8 * Math.PI);
  } else if (faceId === "sleepy") {
    closedEye(left, eyeY + 4);
    closedEye(right, eyeY + 4);
    g.beginPath();
    g.ellipse(128, 128, 9, 7, 0, 0, Math.PI * 2);
    g.fill();
  } else {
    eye(left, eyeY);
    eye(right, eyeY);
    mouthArc(96, 32, 0.18 * Math.PI, 0.82 * Math.PI);
  }
  const texture = new THREE.CanvasTexture(image);
  texture.anisotropy = 4;
  avatarGeo.faces[key] = texture;
  return texture;
}

function setAvatarFace(P, blink) {
  const texture = getFaceTexture(P.faceId || "smile", blink && P.faceId !== "sleepy");
  if (P.faceMaterial.map !== texture) {
    P.faceMaterial.map = texture;
    P.faceMaterial.needsUpdate = true;
  }
}

// Текстуры салона рисуются один раз: стёганая кожа, карбон и шлифованный алюминий
function getCabinTextures() {
  if (flyerShared.cabin) {
    return flyerShared.cabin;
  }
  const make = (size, draw, repeat = 1) => {
    const image = document.createElement("canvas");
    image.width = size;
    image.height = size;
    draw(image.getContext("2d"), size);
    const texture = new THREE.CanvasTexture(image);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeat, repeat);
    texture.anisotropy = 4;
    return texture;
  };
  const leather = make(256, (g, s) => {
    g.fillStyle = "#ffffff";
    g.fillRect(0, 0, s, s);
    for (let i = 0; i < 3000; i += 1) {
      const v = 225 + Math.floor(Math.random() * 30);
      g.fillStyle = `rgb(${v},${v},${v})`;
      g.fillRect(Math.random() * s, Math.random() * s, 2, 2);
    }
    // ромбы строчки и мелкая перфорация
    g.strokeStyle = "rgba(90,80,70,0.55)";
    g.lineWidth = 2;
    g.setLineDash([5, 4]);
    for (let k = -s; k < s * 2; k += 64) {
      g.beginPath();
      g.moveTo(k, 0);
      g.lineTo(k + s, s);
      g.moveTo(k, s);
      g.lineTo(k + s, 0);
      g.stroke();
    }
    g.setLineDash([]);
    g.fillStyle = "rgba(60,50,45,0.35)";
    for (let y = 16; y < s; y += 32) {
      for (let x = 16; x < s; x += 32) {
        g.beginPath();
        g.arc(x, y, 2, 0, Math.PI * 2);
        g.fill();
      }
    }
  }, 3);
  const carbon = make(128, (g, s) => {
    for (let y = 0; y < s; y += 8) {
      for (let x = 0; x < s; x += 8) {
        const twill = ((x + y) / 8) % 2 === 0;
        const gradient = g.createLinearGradient(x, y, twill ? x + 8 : x, twill ? y : y + 8);
        gradient.addColorStop(0, "#2b2e33");
        gradient.addColorStop(0.5, "#5a5f68");
        gradient.addColorStop(1, "#24272b");
        g.fillStyle = gradient;
        g.fillRect(x, y, 8, 8);
      }
    }
  }, 6);
  const brushed = make(256, (g, s) => {
    g.fillStyle = "#c8ccd2";
    g.fillRect(0, 0, s, s);
    for (let i = 0; i < 400; i += 1) {
      const v = 170 + Math.floor(Math.random() * 80);
      g.strokeStyle = `rgba(${v},${v},${v + 6},0.5)`;
      g.beginPath();
      const y = Math.random() * s;
      g.moveTo(0, y);
      g.lineTo(s, y + Math.random() * 2);
      g.stroke();
    }
  }, 2);
  flyerShared.cabin = { leather, carbon, brushed };
  return flyerShared.cabin;
}

// Салон летающей машины: панель с двумя экранами, руль, консоль, двери, кресла
function buildFlyerCockpit(body, mats, spec, env) {
  const textures = getCabinTextures();
  mats.leather = new THREE.MeshStandardMaterial({ color: 0xead9bf, map: textures.leather, bumpMap: textures.leather, bumpScale: 0.015, roughness: 0.58 });
  mats.alcantara = new THREE.MeshStandardMaterial({ color: 0x2b2522, map: textures.leather, bumpMap: textures.leather, bumpScale: 0.012, roughness: 0.66 });
  mats.cabinCarbon = new THREE.MeshPhysicalMaterial({ color: 0x9aa0a8, map: textures.carbon, metalness: 0.35, roughness: 0.4, clearcoat: 1, clearcoatRoughness: 0.05, envMap: env, envMapIntensity: 0.9 });
  mats.alu = new THREE.MeshStandardMaterial({ color: 0xe1e5ea, map: textures.brushed, metalness: 1, roughness: 0.32, envMap: env, envMapIntensity: 1.2 });
  mats.piano = new THREE.MeshPhysicalMaterial({ color: 0x07080a, metalness: 0.1, roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.03, envMap: env, envMapIntensity: 1.4 });
  mats.carpet = new THREE.MeshStandardMaterial({ color: 0x24262b, roughness: 1 });
  const seatX = spec.wsBase - 2.3;
  const driverZ = -spec.W * 0.22;

  // ванна салона, ковёр и задняя стенка
  const tub = addCarPart(buildLoftGeometry(30, 18, (u, v, out) => {
    const x = THREE.MathUtils.lerp(-2.7, 2.8, u);
    const half = sampleSpline(FLYER_COCKPIT, x) - 0.02;
    if (v < 0.22) return out.set(x, THREE.MathUtils.lerp(2.15, 0.76, v / 0.22), half);
    if (v > 0.78) return out.set(x, THREE.MathUtils.lerp(0.76, 2.15, (v - 0.78) / 0.22), -half);
    return out.set(x, 0.76, THREE.MathUtils.lerp(half, -half, (v - 0.22) / 0.56));
  }), mats.interior, body, 0, 0, 0, false);
  tub.userData.keepSeparate = true;
  addCarPart(new THREE.BoxGeometry(4.6, 0.03, 3.1), mats.carpet, body, 0.2, 0.79, 0, false);
  addCarPart(rbBoxGeometry(0.16, 1.3, 3.2, 0.05), mats.leather, body, -2.2, 1.5, 0, false);
  addCarPart(new THREE.BoxGeometry(0.2, 1.5, 3.2), mats.interior, body, 2.75, 1.45, 0, false);

  // панель: кожаный верх, алюминиевая полоса, карбон снизу, дефлекторы
  const dash = new THREE.Shape();
  dash.moveTo(2.9, 1.72);
  dash.quadraticCurveTo(2.3, 2.5, 1.62, 2.46);
  dash.quadraticCurveTo(1.36, 2.44, 1.3, 2.24);
  dash.lineTo(1.42, 1.9);
  dash.lineTo(2.9, 1.72);
  addCarPart(extrudeCarShape(dash, 3.45, 0.07), mats.alcantara, body, 0, 0, 0, false);
  const lower = new THREE.Shape();
  lower.moveTo(1.42, 1.92);
  lower.quadraticCurveTo(1.5, 1.6, 1.85, 1.42);
  lower.lineTo(2.9, 1.3);
  lower.lineTo(2.9, 1.74);
  lower.lineTo(1.42, 1.92);
  addCarPart(extrudeCarShape(lower, 3.35, 0.05), mats.cabinCarbon, body, 0, 0, 0, false);
  addCarPart(new THREE.BoxGeometry(0.05, 0.05, 3.3), mats.alu, body, 1.36, 2.2, 0, false);
  addCarPart(new THREE.BoxGeometry(0.025, 0.025, 3.3), mats.led, body, 1.4, 2.12, 0, false);
  [-1.35, -0.5, 0.5, 1.35].forEach((z) => {
    addCarPart(rbBoxGeometry(0.1, 0.12, 0.42, 0.03), mats.alu, body, 1.36, 2.02, z, false);
    addCarPart(new THREE.BoxGeometry(0.06, 0.07, 0.36), mats.piano, body, 1.33, 2.02, z, false);
  });

  // центральная консоль: селектор, беспроводная зарядка, подстаканники, подлокотник
  addCarPart(rbBoxGeometry(2.5, 0.52, 0.62, 0.08), mats.alcantara, body, 0.5, 1.12, 0, false);
  addCarPart(rbBoxGeometry(1.6, 0.04, 0.42, 0.02), mats.piano, body, 0.62, 1.39, 0, false);
  addCarPart(new THREE.CylinderGeometry(0.07, 0.09, 0.05, 20), mats.alu, body, 0.98, 1.43, 0, false);
  addCarPart(new THREE.SphereGeometry(0.075, 16, 12), mats.glass, body, 0.98, 1.5, 0, false);
  addCarPart(new THREE.BoxGeometry(0.3, 0.012, 0.2), mats.led, body, 0.3, 1.415, 0, false);
  [-0.12, 0.12].forEach((z) => addCarPart(new THREE.CylinderGeometry(0.07, 0.07, 0.02, 18), mats.carpet, body, -0.18, 1.415, z, false));
  addCarPart(rbBoxGeometry(0.72, 0.14, 0.5, 0.06), mats.leather, body, -0.6, 1.46, 0, false);

  // двери: кожа, карбоновая планка, подлокотник, ручка, динамик, подсветка
  [-1, 1].forEach((side) => {
    const z = side * 1.74;
    addCarPart(rbBoxGeometry(3.3, 0.7, 0.07, 0.03), mats.leather, body, 0.05, 1.55, z, false);
    addCarPart(rbBoxGeometry(3.3, 0.1, 0.13, 0.03), mats.cabinCarbon, body, 0.05, 1.96, z - side * 0.02, false);
    addCarPart(rbBoxGeometry(1.1, 0.1, 0.22, 0.04), mats.alcantara, body, -0.25, 1.44, z - side * 0.08, false);
    addCarPart(new THREE.BoxGeometry(0.42, 0.05, 0.05), mats.alu, body, 0.6, 1.78, z - side * 0.05, false);
    const speaker = addCarPart(new THREE.CylinderGeometry(0.19, 0.19, 0.03, 24), mats.alu, body, 1.2, 1.32, z - side * 0.04, false);
    speaker.rotation.x = Math.PI / 2;
    addCarPart(new THREE.BoxGeometry(3.1, 0.02, 0.02), mats.led, body, 0.05, 1.89, z - side * 0.06, false);
  });

  // педали
  [-0.16, 0.14].forEach((dz, index) => {
    const pedal = addCarPart(new THREE.BoxGeometry(0.04, 0.24, index ? 0.12 : 0.2), mats.alu, body, 2.25, 1.0, driverZ + dz, false);
    pedal.rotation.z = 0.5;
  });

  addFlyerSeat(body, mats, seatX - 0.1, spec.seatY, driverZ);
  addFlyerSeat(body, mats, seatX - 0.1, spec.seatY, -driverZ);

  // руль: толстый кожаный обод, метка сверху, три алюминиевые спицы, лепестки переключения
  const steering = new THREE.Group();
  steering.position.set(seatX + 1.25, spec.seatY + 1.28, driverZ);
  steering.rotation.z = -0.35;
  steering.userData.dynamic = true;
  body.add(steering);
  const steeringSpin = new THREE.Group();
  steering.add(steeringSpin);
  const rim = addCarPart(new THREE.TorusGeometry(0.38, 0.058, 12, 40), mats.alcantara, steeringSpin, 0, 0, 0, false);
  rim.rotation.y = Math.PI / 2;
  const markHolder = new THREE.Group();
  markHolder.rotation.y = Math.PI / 2;
  steeringSpin.add(markHolder);
  const mark = addCarPart(new THREE.TorusGeometry(0.38, 0.061, 12, 6, 0.3), mats.leather, markHolder, 0, 0, 0, false);
  mark.rotation.z = Math.PI / 2 - 0.15;
  [-1, 1].forEach((side) => {
    addCarPart(new THREE.BoxGeometry(0.05, 0.07, 0.3), mats.alu, steeringSpin, 0.01, 0, side * 0.21, false);
    addCarPart(new THREE.BoxGeometry(0.02, 0.04, 0.05), mats.led, steeringSpin, -0.02, 0.03, side * 0.24, false);
    addCarPart(new THREE.BoxGeometry(0.03, 0.22, 0.07), mats.alu, steeringSpin, 0.1, 0.06, side * 0.33, false);
  });
  addCarPart(new THREE.BoxGeometry(0.05, 0.24, 0.07), mats.alu, steeringSpin, 0.01, -0.2, 0, false);
  const hub = addCarPart(new THREE.CylinderGeometry(0.14, 0.16, 0.1, 24), mats.alcantara, steeringSpin, 0.03, 0, 0, false);
  hub.rotation.z = Math.PI / 2;
  const logo = addCarPart(new THREE.TorusGeometry(0.05, 0.012, 8, 20), mats.led, steeringSpin, -0.025, 0, 0, false);
  logo.rotation.y = Math.PI / 2;
  const column = addCarPart(new THREE.CylinderGeometry(0.075, 0.1, 0.9, 12), mats.cabinCarbon, body, seatX + 1.66, spec.seatY + 1.15, driverZ, false);
  column.rotation.z = Math.PI / 2 + 0.35;

  // руки водителя: короткие, как у человечков, видны только из кабины
  const fpHands = [];
  [-1, 1].forEach((side) => {
    const hand = new THREE.Mesh(rbBoxGeometry(0.13, 0.17, 0.15, 0.05), avatarMaterials.skin);
    hand.position.set(-0.03, 0.06, side * 0.38);
    hand.userData.keepSeparate = true;
    hand.visible = false;
    steeringSpin.add(hand);
    fpHands.push(hand);
  });
  mergeStaticMeshes(steeringSpin);
  const armGeometry = new THREE.BoxGeometry(0.15, 1, 0.16);
  armGeometry.translate(0, 0.5, 0);
  const fpArms = new THREE.Group();
  fpArms.userData.dynamic = true;
  fpArms.visible = false;
  body.add(fpArms);
  const arms = fpHands.map((hand, index) => {
    const mesh = new THREE.Mesh(armGeometry, avatarMaterials.body);
    fpArms.add(mesh);
    return { hand, mesh, elbow: new THREE.Vector3(seatX + 0.98, spec.seatY + 0.85, driverZ + (index ? 0.44 : -0.44)) };
  });
  addCockpitBody(fpArms, arms, seatX, spec.seatY, driverZ);

  // экраны: приборы за рулём и вертикальный экран в центре
  const makeScreen = (width, height, w, h, x, y, z, tilt) => {
    const image = document.createElement("canvas");
    image.width = width;
    image.height = height;
    const texture = new THREE.CanvasTexture(image);
    const mesh = addCarPart(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: texture, fog: false }), body, x, y, z, false);
    mesh.rotation.y = -Math.PI / 2;
    mesh.rotateX(tilt);
    mesh.userData.keepSeparate = true;
    return { image, context: image.getContext("2d"), texture };
  };
  addCarPart(rbBoxGeometry(0.06, 0.32, 0.84, 0.03), mats.piano, body, 1.6, 2.6, driverZ, false);
  const cluster = makeScreen(512, 200, 0.78, 0.28, 1.565, 2.6, driverZ, -0.15);
  addCarPart(rbBoxGeometry(0.05, 0.66, 0.54, 0.03), mats.piano, body, 1.36, 2.16, 0, false);
  const center = makeScreen(300, 360, 0.48, 0.58, 1.33, 2.16, 0, -0.32);
  const hudImage = document.createElement("canvas");
  hudImage.width = 512;
  hudImage.height = 256;
  const hudTexture = new THREE.CanvasTexture(hudImage);
  const hud = addCarPart(new THREE.PlaneGeometry(1.5, 0.75), new THREE.MeshBasicMaterial({ map: hudTexture, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }), body, 1.7, 2.98, driverZ, false);
  hud.rotation.y = -Math.PI / 2;
  hud.userData.keepSeparate = true;
  hud.userData.dynamic = true;
  hud.visible = false;
  const fpEye = new THREE.Object3D();
  fpEye.position.set(seatX - 0.5, spec.seatY + 1.85, driverZ);
  fpEye.userData.dynamic = true;
  body.add(fpEye);
  return {
    steeringSpin, fpHands, fpArms, arms, hud, fpEye,
    screen: cluster, centerScreen: center,
    hudScreen: { image: hudImage, context: hudImage.getContext("2d"), texture: hudTexture }
  };
}

function getGearText(car) {
  if (car.forwardSpeed < -0.5 || car.speed < -0.5) return "R";
  if (!driveSettings.gearbox) return Math.abs(car.forwardSpeed || car.speed || 0) < 0.5 ? "P" : "D";
  return car.gearIndex > 0 ? String(car.gearIndex) : "N";
}

// Коробка передач (включается в телефоне): на переключении тяга на миг пропадает
function updateGearbox(car, speed, top, delta) {
  const ratio = Math.min(1, Math.abs(speed) / top);
  if (!driveSettings.gearbox) {
    car.gearIndex = 0;
    car.shiftTimer = 0;
    car.rpm = dampTo(car.rpm || 0, 0.2 + ratio * 0.75, 6, delta);
    return 1;
  }
  const gear = speed < -0.5 ? -1 : Math.min(6, 1 + Math.floor(ratio * 6.1));
  if (car.gearIndex > 0 && gear > car.gearIndex) {
    car.shiftTimer = 0.28;
    playGearShift();
  }
  car.gearIndex = gear;
  car.shiftTimer = Math.max(0, (car.shiftTimer || 0) - delta);
  const inGear = gear > 0 ? ratio * 6.1 - (gear - 1) : 0.3;
  car.rpm = dampTo(car.rpm || 0, car.shiftTimer > 0 ? 0.35 : 0.25 + Math.min(1, inGear) * 0.72, 10, delta);
  return car.shiftTimer > 0 ? 0.15 : 1.12 - gear * 0.04;
}

function playGearShift() {
  const context = audioState.context;
  if (!context || audioState.muted) return;
  const now = context.currentTime;
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);
  gain.gain.setValueAtTime(0.05, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
  osc.connect(gain);
  gain.connect(context.destination);
  osc.start(now);
  osc.stop(now + 0.12);
}

// Поворотники мигают, пока машина поворачивает по земле, и щёлкают как настоящие
function updateCarSignals(car, delta, turn, onGround) {
  if (onGround && turn !== 0) {
    car.turnHold = (car.turnDirection === turn ? car.turnHold || 0 : 0) + delta;
    car.turnDirection = turn;
    if (car.turnHold >= 1.2) {
      car.signal = turn > 0 ? -1 : 1;
      car.signalHold = 0.9;
    }
  } else {
    car.turnHold = 0;
    car.turnDirection = 0;
    car.signalHold = Math.max(0, (car.signalHold || 0) - delta);
    if (car.signalHold <= 0) car.signal = 0;
  }
  car.signalClock = (car.signalClock || 0) + delta;
  const on = car.signal !== 0 && car.signalClock % 0.7 < 0.38;
  if (on !== car.signalOn && car.signal !== 0 && audioState.context && !audioState.muted && car === state.currentVehicle) {
    const context = audioState.context;
    const now = context.currentTime;
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = "triangle";
    osc.frequency.value = on ? 1800 : 1300;
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
    osc.connect(gain);
    gain.connect(context.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }
  car.signalOn = on;
  if (car.mats.indL) {
    car.mats.indL.color.set(on && car.signal < 0 ? 0xffa21a : 0x3a2405);
    car.mats.indR.color.set(on && car.signal > 0 ? 0xffa21a : 0x3a2405);
  }
}

// Следы шин: тёмные полосы остаются на асфальте при резком торможении и заносе
function addSkidMark(x, y, z, yaw, length) {
  const index = skidMarks.next;
  skidMarks.next = (index + 1) % SKID_MAX;
  skidTmp.position.set(x, y + 0.04, z);
  skidTmp.quaternion.setFromAxisAngle(flyerTmp.up, yaw);
  skidTmp.scale.set(0.42, 1, Math.max(0.3, length));
  skidTmp.updateMatrix();
  skidMarks.mesh.setMatrixAt(index, skidTmp.matrix);
  skidMarks.mesh.instanceMatrix.needsUpdate = true;
  skidMarks.mesh.visible = true;
}

// Тело водителя для вида из кабины: туловище, ноги и плечи, чтобы руки не висели в воздухе
function addCockpitBody(group, arms, seatX, seatY, driverZ) {
  const box = (w, h, d, material, x, y, z, tilt = 0) => {
    const mesh = new THREE.Mesh(rbBoxGeometry(w, h, d, 0.06), material);
    mesh.position.set(x, y, z);
    mesh.rotation.z = tilt;
    group.add(mesh);
    return mesh;
  };
  box(0.34, 0.95, 0.64, avatarMaterials.body, seatX - 0.5, seatY + 0.82, driverZ, 0.28);
  [-1, 1].forEach((side) => {
    const z = driverZ + side * 0.18;
    box(1.1, 0.3, 0.3, avatarMaterials.pants, seatX + 0.4, seatY + 0.17, z);
    box(0.9, 0.28, 0.28, avatarMaterials.pants, seatX + 1.35, seatY + 0.02, z, -0.25);
    box(0.34, 0.32, 0.3, avatarMaterials.shoes, seatX + 1.85, seatY - 0.02, z);
  });
  const geometry = new THREE.BoxGeometry(0.17, 1, 0.18);
  geometry.translate(0, 0.5, 0);
  arms.forEach((arm, index) => {
    arm.shoulder = new THREE.Vector3(seatX - 0.42, seatY + 1.5, driverZ + (index ? 0.36 : -0.36));
    arm.upper = new THREE.Mesh(geometry, avatarMaterials.body);
    group.add(arm.upper);
  });
}

// Стекло, которое видно изнутри: лёгкий оттенок, тонировка сверху и блики
function getInnerGlassMaterial(env) {
  if (flyerShared.innerGlass) {
    return flyerShared.innerGlass;
  }
  const image = document.createElement("canvas");
  image.width = 64;
  image.height = 256;
  const g = image.getContext("2d");
  const tint = g.createLinearGradient(0, 0, 0, 256);
  tint.addColorStop(0, "rgba(120,170,215,0.07)");
  tint.addColorStop(0.38, "rgba(60,90,130,0.3)");
  tint.addColorStop(0.5, "rgba(50,80,120,0.36)");
  tint.addColorStop(0.62, "rgba(60,90,130,0.3)");
  tint.addColorStop(1, "rgba(120,170,215,0.07)");
  g.fillStyle = tint;
  g.fillRect(0, 0, 64, 256);
  g.strokeStyle = "rgba(255,255,255,0.12)";
  g.lineWidth = 3;
  [40, 70, 190, 214].forEach((y) => {
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(64, y + 18);
    g.stroke();
  });
  const texture = new THREE.CanvasTexture(image);
  flyerShared.innerGlass = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, map: texture, transparent: true, side: THREE.BackSide, depthWrite: false,
    metalness: 0.3, roughness: 0.05, envMap: env, envMapIntensity: 0.6
  });
  return flyerShared.innerGlass;
}

function getInnerCarGlassMaterial() {
  if (!flyerShared.innerCarGlass) {
    flyerShared.innerCarGlass = new THREE.MeshPhysicalMaterial({
      color: 0x9fc6e6, transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false,
      metalness: 0.4, roughness: 0.06, envMap: getFlyerEnvMap(), envMapIntensity: 0.8
    });
  }
  return flyerShared.innerCarGlass;
}

// Заготовки для леса: одна геометрия и один материал на вид, цвет у каждого экземпляра свой
function organicBlob() {
  if (flyerShared.blob) return flyerShared.blob;
  const source = new THREE.IcosahedronGeometry(1, 1);
  const pos = source.attributes.position;
  const keys = new Map();
  const positions = [];
  const indices = [];
  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const key = `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;
    if (!keys.has(key)) {
      const bump = 1 + 0.13 * Math.sin(x * 5.1 + 1.3) * Math.cos(y * 4.3) + 0.08 * Math.sin(z * 7.7 + y * 3.1);
      keys.set(key, positions.length / 3);
      positions.push(x * bump, y * bump, z * bump);
    }
    indices.push(keys.get(key));
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  flyerShared.blob = geometry;
  return geometry;
}

function getForestKind(kind) {
  if (forestBatch.has(kind)) {
    return forestBatch.get(kind);
  }
  // «near-…» — та же травинка или цветок, но видна только вблизи (луга вокруг)
  if (kind.startsWith("near-")) {
    const base = getForestKind(kind.slice(5));
    const near = { geometry: base.geometry, material: base.material, items: [], shadow: false, far: 150 };
    forestBatch.set(kind, near);
    return near;
  }
  const unitUp = (geometry) => {
    geometry.translate(0, 0.5, 0);
    return geometry;
  };
  const flat = (color = 0xffffff, roughness = 0.9) => new THREE.MeshStandardMaterial({ color, roughness, flatShading: true });
  let geometry;
  let material;
  if (kind === "trunk") {
    geometry = unitUp(new THREE.CylinderGeometry(0.62, 1, 1, 7));
    material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 });
  } else if (kind === "branch") {
    geometry = unitUp(new THREE.CylinderGeometry(0.45, 1, 1, 5));
    material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 });
  } else if (kind === "birch") {
    const image = document.createElement("canvas");
    image.width = 64;
    image.height = 256;
    const g = image.getContext("2d");
    g.fillStyle = "#eeeae2";
    g.fillRect(0, 0, 64, 256);
    for (let i = 0; i < 26; i += 1) {
      g.fillStyle = `rgba(30,30,30,${0.55 + Math.random() * 0.4})`;
      g.fillRect(Math.random() * 64, Math.random() * 256, 6 + Math.random() * 22, 2 + Math.random() * 4);
    }
    const texture = new THREE.CanvasTexture(image);
    geometry = unitUp(new THREE.CylinderGeometry(0.85, 1, 1, 8));
    material = new THREE.MeshStandardMaterial({ color: 0xffffff, map: texture, roughness: 0.8 });
  } else if (kind === "lump") {
    geometry = organicBlob();
    material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });
  } else if (kind === "cone") {
    geometry = unitUp(new THREE.ConeGeometry(1, 1, 11, 2));
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i += 1) {
      if (pos.getY(i) < 0.6) {
        const wave = 1 + 0.12 * Math.sin(Math.atan2(pos.getZ(i), pos.getX(i)) * 5);
        pos.setX(i, pos.getX(i) * wave);
        pos.setZ(i, pos.getZ(i) * wave);
      }
    }
    geometry.computeVertexNormals();
    material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });
  } else if (kind === "rock") {
    geometry = new THREE.DodecahedronGeometry(1, 0);
    material = flat(0xffffff, 0.95);
  } else if (kind === "frond") {
    geometry = new THREE.BoxGeometry(0.16, 0.03, 1);
    geometry.translate(0, 0, 0.5);
    material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, side: THREE.DoubleSide });
  } else if (kind === "blade") {
    geometry = unitUp(new THREE.ConeGeometry(0.06, 1, 3, 1));
    material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 });
  } else if (kind === "leaf") {
    // опавший лист: ромбик с острыми концами, края чуть загнуты вверх
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.5);
    shape.lineTo(0.3, -0.12);
    shape.lineTo(0.24, 0.22);
    shape.lineTo(0, 0.5);
    shape.lineTo(-0.24, 0.22);
    shape.lineTo(-0.3, -0.12);
    shape.lineTo(0, -0.5);
    geometry = new THREE.ShapeGeometry(shape);
    geometry.rotateX(-Math.PI / 2);
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i += 1) pos.setY(i, Math.abs(pos.getX(i)) * 0.22);
    geometry.computeVertexNormals();
    material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, side: THREE.DoubleSide });
  } else if (kind === "lod-blob") {
    // простые дальние деревья: крона из 20 треугольников вместо сотен
    geometry = new THREE.IcosahedronGeometry(1, 0);
    material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, flatShading: true });
  } else if (kind === "lod-cone") {
    geometry = unitUp(new THREE.ConeGeometry(1, 1, 6, 1));
    material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, flatShading: true });
  } else if (kind === "lod-trunk") {
    geometry = unitUp(new THREE.CylinderGeometry(0.7, 1, 1, 4, 1, true));
    material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 });
  } else {
    geometry = new THREE.SphereGeometry(1, 6, 5);
    material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
  }
  const entry = {
    geometry, material, items: [],
    shadow: !["frond", "blade", "dot", "leaf"].includes(kind) && !kind.startsWith("lod-"),
    receive: kind === "leaf",
    far: kind === "leaf" ? 170 : kind.startsWith("lod-") ? 2400 : ["frond", "blade", "dot", "rock"].includes(kind) ? 300 : 400,
    near: kind.startsWith("lod-") ? 380 : 0
  };
  forestBatch.set(kind, entry);
  return entry;
}

function forestPut(kind, x, y, z, sx, sy, sz, color, rx = 0, ry = 0, rz = 0) {
  getForestKind(kind).items.push({ x, y, z, sx, sy, sz, rx, ry, rz, color });
}

// Ветка от ствола: цилиндр, наклонённый наружу
function forestBranch(x, z, baseY, length, radius, angle, tilt) {
  forestPut("branch", x, baseY, z, radius, length, radius, 0x5b4330, 0, angle, tilt);
}

// Дерево одного из видов. scale — общий размер, random — генератор мира
function plantForestTree(x, z, kind, scale, random) {
  const s = scale;
  const yaw = random() * Math.PI * 2;
  const shade = () => FOREST_GREENS[Math.floor(random() * FOREST_GREENS.length)];
  if (kind === "oak") {
    const height = (4.5 + random() * 2.5) * s;
    forestPut("trunk", x, 0, z, 0.55 * s, height, 0.55 * s, 0x5a4230, 0, yaw);
    for (let i = 0; i < 3; i += 1) {
      const angle = yaw + i * 2.1 + random() * 0.6;
      forestBranch(x, z, height * (0.55 + random() * 0.25), (2.4 + random()) * s, 0.16 * s, angle, 0.8 + random() * 0.3);
    }
    const autumn = random() < 0.08 ? [0xc8902a, 0xd36b2a, 0xb9a23a][Math.floor(random() * 3)] : null;
    [[0, 1.6, 0, 3.0], [1.9, 0.8, 0.6, 2.3], [-1.8, 0.9, -0.5, 2.3], [0.4, 0.7, 1.9, 2.1], [-0.5, 0.7, -1.9, 2.1], [0.2, 2.9, 0.1, 1.9]].forEach(([dx, dy, dz, r]) => {
      const radius = r * s * (0.85 + random() * 0.3);
      const c = Math.cos(yaw);
      const n = Math.sin(yaw);
      forestPut("lump", x + (dx * c - dz * n) * s, height + dy * s, z + (dx * n + dz * c) * s, radius, radius * 0.82, radius, autumn || shade(), random(), random() * 3, random());
    });
    // простая копия для взгляда издалека и с высоты
    forestPut("lod-trunk", x, 0, z, 0.6 * s, height, 0.6 * s, 0x5a4230);
    forestPut("lod-blob", x, height + 1.3 * s, z, 4.2 * s, 3.4 * s, 4.2 * s, autumn || 0x4b8a38, 0, yaw, 0);
    addCollider({ minX: x - 0.6 * s, maxX: x + 0.6 * s, minZ: z - 0.6 * s, maxZ: z + 0.6 * s });
  } else if (kind === "birch") {
    const height = (7 + random() * 3.5) * s;
    forestPut("birch", x, 0, z, 0.24 * s, height, 0.24 * s, 0xffffff, 0, yaw);
    // крона берёзы — одно лёгкое облако листвы у верхушки, а не шарики на палке
    const birchGreen = random() < 0.1 ? 0xc9b24a : [0x6c9c3e, 0x75a446, 0x638f38][Math.floor(random() * 3)];
    for (let i = 0; i < 6; i += 1) {
      const angle = yaw + i * 1.1;
      const t = 0.62 + (i / 6) * 0.42;
      const spread = (1.0 - i * 0.1) * s;
      const radius = (1.9 - i * 0.12) * s * (0.85 + random() * 0.3);
      forestPut("lump", x + Math.cos(angle) * spread, height * t + 0.6 * s, z + Math.sin(angle) * spread, radius, radius * 1.15, radius, birchGreen, random(), random() * 3, random());
    }
    forestPut("lod-trunk", x, 0, z, 0.3 * s, height * 0.7, 0.3 * s, 0xe8e4dc);
    forestPut("lod-blob", x, height * 0.82 + 0.6 * s, z, 2.6 * s, 3.6 * s, 2.6 * s, birchGreen, 0, yaw, 0);
    addCollider({ minX: x - 0.35 * s, maxX: x + 0.35 * s, minZ: z - 0.35 * s, maxZ: z + 0.35 * s });
  } else if (kind === "pine") {
    const height = (10 + random() * 5) * s;
    forestPut("trunk", x, 0, z, 0.42 * s, height, 0.42 * s, 0x8a5634, 0, yaw);
    [[0, 0.9, 0, 2.6], [1.5, 0.4, 0.4, 2], [-1.3, 0.5, -0.6, 2], [0.2, 1.7, 0.2, 1.7]].forEach(([dx, dy, dz, r]) => {
      const radius = r * s * (0.85 + random() * 0.3);
      forestPut("lump", x + dx * s, height + dy * s, z + dz * s, radius, radius * 0.55, radius, 0x3b6b38, 0, random() * 3, 0);
    });
    forestBranch(x, z, height * 0.75, 2.2 * s, 0.12 * s, yaw, 1.1);
    forestPut("lod-trunk", x, 0, z, 0.45 * s, height, 0.45 * s, 0x8a5634);
    forestPut("lod-blob", x, height + 0.9 * s, z, 3.2 * s, 1.8 * s, 3.2 * s, 0x3b6b38, 0, yaw, 0);
    addCollider({ minX: x - 0.5 * s, maxX: x + 0.5 * s, minZ: z - 0.5 * s, maxZ: z + 0.5 * s });
  } else {
    // ель: ступенчатая, густая, тёмная
    const color = [0x2d5e34, 0x2a5530, 0x356a3a][Math.floor(random() * 3)];
    forestPut("trunk", x, 0, z, 0.32 * s, 2.2 * s, 0.32 * s, 0x4e3726, 0, yaw);
    const tiers = 6;
    for (let i = 0; i < tiers; i += 1) {
      const radius = (3.5 - i * 0.5) * s;
      forestPut("cone", x, (1.2 + i * 1.75) * s, z, radius, 3.2 * s, radius, color, 0, yaw + i, 0);
    }
    forestPut("lod-cone", x, 1.2 * s, z, 3.6 * s, 12 * s, 3.6 * s, color, 0, yaw, 0);
    addCollider({ minX: x - 0.5 * s, maxX: x + 0.5 * s, minZ: z - 0.5 * s, maxZ: z + 0.5 * s });
  }
}

function plantBush(x, z, random) {
  const size = 0.8 + random() * 0.7;
  for (let i = 0; i < 3; i += 1) {
    const r = size * (0.7 + random() * 0.5);
    forestPut("lump", x + (random() - 0.5) * size * 1.4, r * 0.6, z + (random() - 0.5) * size * 1.4, r, r * 0.75, r, FOREST_GREENS[Math.floor(random() * FOREST_GREENS.length)], random(), random() * 3, 0);
  }
  if (random() < 0.3) {
    const berry = random() < 0.5 ? 0xd1233c : 0x3b3f9e;
    for (let i = 0; i < 6; i += 1) {
      forestPut("dot", x + (random() - 0.5) * size * 2, 0.5 + random() * size, z + (random() - 0.5) * size * 2, 0.12, 0.12, 0.12, berry);
    }
  }
}

function plantFern(x, z, random) {
  const color = random() < 0.5 ? 0x4f8a34 : 0x5f9a3c;
  const fronds = 6;
  for (let i = 0; i < fronds; i += 1) {
    const length = 0.9 + random() * 0.5;
    forestPut("frond", x, 0.08, z, 1.6, 1, length, color, -0.6 - random() * 0.3, (i / fronds) * Math.PI * 2 + random() * 0.4, 0);
  }
}

function plantGrass(x, z, random, flowers) {
  for (let i = 0; i < 5; i += 1) {
    forestPut("blade", x + (random() - 0.5) * 0.6, 0, z + (random() - 0.5) * 0.6, 1, 0.5 + random() * 0.6, 1, random() < 0.5 ? 0x5e9a3a : 0x77a843, (random() - 0.5) * 0.5, 0, (random() - 0.5) * 0.5);
  }
  if (flowers) {
    forestPut("dot", x + (random() - 0.5) * 0.8, 0.45, z + (random() - 0.5) * 0.8, 0.13, 0.08, 0.13, [0xffffff, 0xffd23f, 0xb784f0, 0xff7ab8][Math.floor(random() * 4)]);
  }
}

function plantRock(x, z, random, size) {
  forestPut("rock", x, size * 0.35, z, size, size * 0.62, size * (0.8 + random() * 0.4), random() < 0.5 ? 0x8c8c84 : 0x7f8a74, random(), random() * 3, random());
  if (size > 1.3) addCollider({ minX: x - size * 0.7, maxX: x + size * 0.7, minZ: z - size * 0.7, maxZ: z + size * 0.7 });
}

function plantLog(x, z, random) {
  const length = 5 + random() * 4;
  const radius = 0.38 + random() * 0.15;
  const yaw = random() * Math.PI;
  forestPut("trunk", x - Math.sin(yaw) * length / 2, radius, z - Math.cos(yaw) * length / 2, radius, length, radius, 0x5d4532, Math.PI / 2, yaw, 0);
  // бревно лежит: ось вдоль направления yaw, препятствие — несколько кубиков вдоль него
  for (let k = -1; k <= 1; k += 1) {
    const px = x + Math.sin(yaw) * k * length * 0.33;
    const pz = z + Math.cos(yaw) * k * length * 0.33;
    addCollider({ minX: px - 0.6, maxX: px + 0.6, minZ: pz - 0.6, maxZ: pz + 0.6, height: 1 });
  }
  return { x, z, yaw, length };
}

function plantStump(x, z, random) {
  const radius = 0.5 + random() * 0.25;
  forestPut("trunk", x, 0, z, radius, 0.6 + random() * 0.4, radius, 0x6a4c34, 0, random() * 3, 0);
  forestPut("dot", x, 0.75, z, radius * 0.9, 0.04, radius * 0.9, 0xc9a77a);
  addCollider({ minX: x - radius, maxX: x + radius, minZ: z - radius, maxZ: z + radius, height: 1 });
}

// Лента дороги по точкам: грязевая для машин или узкая тропинка
function addForestLane(points, width, kind) {
  const curve = new THREE.CatmullRomCurve3(points.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, "catmullrom", 0.5);
  const samples = curve.getSpacedPoints(Math.max(8, Math.round(curve.getLength() / 2.5)));
  forestLanes[kind].push(samples);
  if (!flyerShared.laneTextures) {
    const make = (base, stripes) => {
      const image = document.createElement("canvas");
      image.width = 128;
      image.height = 256;
      const g = image.getContext("2d");
      g.fillStyle = base;
      g.fillRect(0, 0, 128, 256);
      for (let i = 0; i < 900; i += 1) {
        g.fillStyle = `rgba(${Math.random() < 0.5 ? "40,28,16" : "150,120,80"},${0.15 + Math.random() * 0.25})`;
        g.fillRect(Math.random() * 128, Math.random() * 256, 2 + Math.random() * 4, 2 + Math.random() * 4);
      }
      stripes.forEach((x) => {
        g.fillStyle = "rgba(45,32,20,0.35)";
        g.fillRect(x - 7, 0, 14, 256);
      });
      // края мягко растворяются в траве
      const fade = g.createLinearGradient(0, 0, 128, 0);
      fade.addColorStop(0, "rgba(0,0,0,1)");
      fade.addColorStop(0.16, "rgba(0,0,0,0)");
      fade.addColorStop(0.84, "rgba(0,0,0,0)");
      fade.addColorStop(1, "rgba(0,0,0,1)");
      g.globalCompositeOperation = "destination-out";
      g.fillStyle = fade;
      g.fillRect(0, 0, 128, 256);
      const texture = new THREE.CanvasTexture(image);
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    };
    flyerShared.laneTextures = { dirt: make("#7a5a3c", [38, 90]), foot: make("#a3865e", []) };
  }
  const positions = [];
  const uvs = [];
  const indices = [];
  let along = 0;
  samples.forEach((point, i) => {
    const next = samples[Math.min(i + 1, samples.length - 1)];
    const prev = samples[Math.max(i - 1, 0)];
    const dx = next.x - prev.x;
    const dz = next.z - prev.z;
    const len = Math.hypot(dx, dz) || 1;
    const nx = -dz / len;
    const nz = dx / len;
    if (i > 0) along += point.distanceTo(samples[i - 1]);
    const y = kind === "dirt" ? 0.05 : 0.045;
    positions.push(point.x + nx * width / 2, y, point.z + nz * width / 2, point.x - nx * width / 2, y, point.z - nz * width / 2);
    uvs.push(0, along / width, 1, along / width);
    if (i > 0) {
      const a = (i - 1) * 2;
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
    map: flyerShared.laneTextures[kind], transparent: true, depthWrite: false, roughness: 1,
    polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2
  }));
  mesh.receiveShadow = true;
  mesh.userData.keepSeparate = true;
  mesh.renderOrder = 1;
  cityGroup.add(mesh);
  reliefState.lanes.push(mesh);
  return samples;
}

function distanceToLanes(x, z, kind) {
  let best = Infinity;
  forestLanes[kind].forEach((samples) => {
    for (let i = 0; i < samples.length; i += 1) {
      const d = (samples[i].x - x) * (samples[i].x - x) + (samples[i].z - z) * (samples[i].z - z);
      if (d < best) best = d;
    }
  });
  return Math.sqrt(best);
}

// Костёр со сковородкой: здесь жарят грибы
function addCampfire(x, z) {
  const logMaterial = new THREE.MeshStandardMaterial({ color: 0x5b3a22, roughness: 1 });
  const stoneMaterial = new THREE.MeshStandardMaterial({ color: 0x8a8a84, roughness: 1, flatShading: true });
  for (let i = 0; i < 9; i += 1) {
    const angle = (i / 9) * Math.PI * 2;
    const stone = new THREE.Mesh(new THREE.DodecahedronGeometry(0.42, 0), stoneMaterial);
    stone.position.set(x + Math.cos(angle) * 1.5, 0.22, z + Math.sin(angle) * 1.5);
    cityGroup.add(stone);
  }
  [0, 1, 2].forEach((i) => {
    const log = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 2.2, 7), logMaterial);
    log.position.set(x, 0.3, z);
    log.rotation.set(Math.PI / 2, (i / 3) * Math.PI, 0.25);
    cityGroup.add(log);
  });
  const flameMaterial = new THREE.MeshStandardMaterial({ color: 0xffa13a, emissive: 0xff6a00, emissiveIntensity: 1.3, transparent: true, opacity: 0.9 });
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.8, 8), flameMaterial);
  flame.position.set(x, 1.1, z);
  flame.userData.dynamic = true;
  cityGroup.add(flame);
  // тренога и сковородка
  const metal = new THREE.MeshStandardMaterial({ color: 0x2b2d31, roughness: 0.5, metalness: 0.6 });
  [0, 1, 2].forEach((i) => {
    const angle = (i / 3) * Math.PI * 2;
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3, 6), metal);
    leg.position.set(x + Math.cos(angle) * 0.9, 1.4, z + Math.sin(angle) * 0.9);
    leg.rotation.set(Math.sin(angle) * 0.32, 0, -Math.cos(angle) * 0.32);
    cityGroup.add(leg);
  });
  const pan = new THREE.Group();
  pan.position.set(x, 2.0, z);
  pan.userData.dynamic = true;
  cityGroup.add(pan);
  const panBody = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.6, 0.18, 20), metal);
  pan.add(panBody);
  const handle = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 0.12), metal);
  handle.position.set(1.25, 0.05, 0);
  pan.add(handle);
  const fried = new THREE.Group();
  fried.visible = false;
  pan.add(fried);
  for (let i = 0; i < 7; i += 1) {
    const piece = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), new THREE.MeshStandardMaterial({ color: 0x8a5a2a, roughness: 0.5 }));
    piece.scale.y = 0.5;
    piece.position.set((Math.random() - 0.5) * 0.8, 0.12, (Math.random() - 0.5) * 0.8);
    fried.add(piece);
  }
  worldAnimations.push((delta, time) => {
    flame.scale.set(1 + Math.sin(time * 9 + x) * 0.1, 1 + Math.sin(time * 13 + z) * 0.18, 1 + Math.cos(time * 11) * 0.1);
  });
  addCollider({ minX: x - 1.6, maxX: x + 1.6, minZ: z - 1.6, maxZ: z + 1.6, height: 2 });
  forestFires.push({ x, z, pan, fried });
  mapIcons.push({ icon: "🔥", x, z });
}

// Гриб: белый, лисичка или мухомор (его есть нельзя)
function plantMushroom(x, z, type) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.rotation.y = Math.random() * Math.PI;
  group.userData.dynamic = true;
  const colors = { porcini: [0xf1e7cf, 0x7a4a24], chanterelle: [0xf2b13a, 0xf0a020], amanita: [0xf6f2ea, 0xd12a1f] };
  const [stemColor, capColor] = colors[type];
  const size = 0.8 + Math.random() * 0.5;
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.13 * size, 0.17 * size, 0.5 * size, 10), new THREE.MeshStandardMaterial({ color: stemColor, roughness: 0.8 }));
  stem.position.y = 0.25 * size;
  group.add(stem);
  const cap = new THREE.Mesh(
    type === "chanterelle" ? new THREE.ConeGeometry(0.34 * size, 0.28 * size, 12, 1, true) : new THREE.SphereGeometry(0.36 * size, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: capColor, roughness: 0.55, side: THREE.DoubleSide })
  );
  cap.position.y = 0.48 * size;
  if (type === "chanterelle") cap.rotation.x = Math.PI;
  group.add(cap);
  if (type === "amanita") {
    for (let i = 0; i < 7; i += 1) {
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.045 * size, 6, 4), new THREE.MeshStandardMaterial({ color: 0xffffff }));
      const angle = (i / 7) * Math.PI * 2;
      dot.position.set(Math.cos(angle) * 0.22 * size, 0.62 * size, Math.sin(angle) * 0.22 * size);
      group.add(dot);
    }
  }
  cityGroup.add(group);
  forestMushrooms.push({ group, x, z, type, taken: false, respawnAt: 0 });
}

// Настоящий лес вокруг озера: грязевая дорога, тропинки, поляна с грибами
function buildDeepForest(lakeX, lakeZ, lakeR, fireX, fireZ) {
  const random = makeRandom(4242);
  const dirtLoop = [[-40, -361], [5, -376], [45, -425], [40, -490], [-10, -530], [-75, -528], [-118, -480], [-122, -420], [-100, -372], [-70, -362], [-40, -361]];
  addForestLane(dirtLoop, 9, "dirt");
  addForestLane([[45, -425], [95, -442], [128, -482], [148, -528]], 8, "dirt");
  addForestLane([[fireX, fireZ], [-52, -392], [-30, -398]], 3.4, "foot");
  addForestLane([[-100, -372], [-160, -398], [-205, -462], [-190, -548], [-125, -578], [-75, -528]], 3.4, "foot");
  addForestLane([[5, -376], [70, -362], [128, -398], [158, -462], [150, -528]], 3.4, "foot");
  addForestLane([[-10, -530], [10, -572], [70, -590], [130, -560]], 3.4, "foot");

  // земля в лесу: мох, хвоя и опавшие листья
  const floorImage = document.createElement("canvas");
  floorImage.width = 256;
  floorImage.height = 256;
  const g = floorImage.getContext("2d");
  g.fillStyle = "#4d6e33";
  g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2200; i += 1) {
    const tone = ["rgba(90,70,40,0.35)", "rgba(40,70,30,0.4)", "rgba(110,130,60,0.3)", "rgba(140,100,50,0.3)"][i % 4];
    g.fillStyle = tone;
    g.beginPath();
    g.ellipse(Math.random() * 256, Math.random() * 256, 2 + Math.random() * 6, 1 + Math.random() * 3, Math.random() * 3, 0, Math.PI * 2);
    g.fill();
  }
  const floorTexture = new THREE.CanvasTexture(floorImage);
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(60, 50);
  const area = FOREST_AREA;
  const shape = new THREE.Shape();
  shape.moveTo(area.minX, -area.maxZ);
  shape.lineTo(area.maxX, -area.maxZ);
  shape.lineTo(area.maxX, -area.minZ);
  shape.lineTo(area.minX, -area.minZ);
  shape.lineTo(area.minX, -area.maxZ);
  const lakeHole = new THREE.Path();
  lakeHole.absarc(lakeX, -lakeZ, lakeR + 5.5, 0, Math.PI * 2, true);
  shape.holes.push(lakeHole);
  const lot = new THREE.Path();
  lot.moveTo(-71, -(-339));
  lot.lineTo(-71, -(-362));
  lot.lineTo(-9, -(-362));
  lot.lineTo(-9, -(-339));
  lot.lineTo(-71, -(-339));
  shape.holes.push(lot);
  const floorGeometry = new THREE.ShapeGeometry(shape, 24);
  floorGeometry.rotateX(-Math.PI / 2);
  const uv = floorGeometry.attributes.uv;
  const pos = floorGeometry.attributes.position;
  for (let i = 0; i < uv.count; i += 1) uv.setXY(i, (pos.getX(i) - area.minX) / (area.maxX - area.minX), (pos.getZ(i) - area.minZ) / (area.maxZ - area.minZ));
  const floor = new THREE.Mesh(floorGeometry, new THREE.MeshStandardMaterial({ map: floorTexture, roughness: 1, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }));
  floor.position.y = 0.02;
  floor.receiveShadow = true;
  floor.userData.keepSeparate = true;
  // вместо плоского ковра с ровными краями лес красит саму землю (см. applyReliefToWorld)

  // поляна с грибами и вторым костром
  const glade = { x: 150, z: 540 * -1, r: 17 };
  addCampfire(glade.x - 6, glade.z + 4);
  mapIcons.push({ icon: "🍄", x: glade.x, z: glade.z - 10 });
  mapLabels.push({ text: "Грибная поляна", x: glade.x, z: glade.z + 22, size: 10 });
  addRoadSign("Грибная поляна", 45, -415, 0, "#5a3b24", 6);

  const blocked = (x, z, pad) => {
    if (x < area.minX + 4 || x > area.maxX - 4 || z < area.minZ + 4 || z > area.maxZ - 4) return true;
    if (!isInsideWorld(x, z) || mountainHeight(x, z) > 0.3) return true;
    if (Math.hypot(x - lakeX, z - lakeZ) < lakeR + 9 + pad) return true;
    if (x > -74 && x < -6 && z > -366 && z < -335) return true;
    if (Math.abs(x + 40) < 16 && z > -366) return true;
    if (Math.hypot(x - fireX, z - fireZ) < 14 + pad) return true;
    if (Math.hypot(x - glade.x, z - glade.z) < glade.r + pad) return true;
    return distanceToLanes(x, z, "dirt") < 7 + pad || distanceToLanes(x, z, "foot") < 3 + pad;
  };

  // деревья: на сетке со случайным сдвигом, чтобы лес был плотным, но не рядами
  const step = 7.2;
  for (let gx = area.minX; gx < area.maxX; gx += step) {
    for (let gz = area.minZ; gz < area.maxZ; gz += step) {
      if (random() < 0.12) continue; // просветы и полянки
      const x = gx + random() * step * 0.9;
      const z = gz + random() * step * 0.9;
      if (blocked(x, z, 0)) continue;
      const pick = random();
      const kind = pick < 0.34 ? "spruce" : pick < 0.54 ? "pine" : pick < 0.78 ? "oak" : "birch";
      const young = random() < 0.12;
      plantForestTree(x, z, kind, young ? 0.4 + random() * 0.25 : 0.8 + random() * 0.55, random);
    }
  }
  // подлесок: кусты, папоротники, трава с цветами, камни, пни, брёвна
  for (let i = 0; i < 2600; i += 1) {
    const x = area.minX + random() * (area.maxX - area.minX);
    const z = area.minZ + random() * (area.maxZ - area.minZ);
    if (blocked(x, z, -2.5)) continue;
    const pick = random();
    if (pick < 0.22) plantBush(x, z, random);
    else if (pick < 0.5) plantFern(x, z, random);
    else if (pick < 0.9) plantGrass(x, z, random, random() < 0.25);
    else if (pick < 0.95) plantRock(x, z, random, 0.6 + random() * 1.4);
    else if (pick < 0.98) plantStump(x, z, random);
    else plantLog(x, z, random);
  }
  // на поляне цветы, пни и бревно-лавка
  for (let i = 0; i < 70; i += 1) {
    const angle = random() * Math.PI * 2;
    const r = random() * glade.r;
    plantGrass(glade.x + Math.cos(angle) * r, glade.z + Math.sin(angle) * r, random, true);
  }
  plantStump(glade.x + 4, glade.z - 3, random);
  plantStump(glade.x - 2, glade.z - 7, random);

  // грибы: вдоль тропинок, под деревьями и много на поляне
  const types = ["porcini", "porcini", "chanterelle", "chanterelle", "amanita"];
  let planted = 0;
  for (let i = 0; i < 900 && planted < 46; i += 1) {
    const x = area.minX + random() * (area.maxX - area.minX);
    const z = area.minZ + random() * (area.maxZ - area.minZ);
    const foot = distanceToLanes(x, z, "foot");
    if (foot < 2.2 || foot > 9 || blocked(x, z, -2.5)) continue;
    plantMushroom(x, z, types[Math.floor(random() * types.length)]);
    planted += 1;
  }
  for (let i = 0; i < 16; i += 1) {
    const angle = random() * Math.PI * 2;
    const r = 4 + random() * (glade.r - 5);
    plantMushroom(glade.x + Math.cos(angle) * r, glade.z + Math.sin(angle) * r, types[Math.floor(random() * types.length)]);
  }
}

// После постройки мира все экземпляры собираются в пачки по кускам карты
function buildForestBatches() {
  forestBatch.forEach((entry) => {
    if (!entry.items.length) return;
    // крупные куски — меньше вызовов отрисовки; мелкая трава и листья режутся мельче, их видно только вблизи
    const cell = entry.far >= 400 ? 160 : 120;
    const chunks = new Map();
    entry.items.forEach((item) => {
      const key = `${Math.floor(item.x / cell)},${Math.floor(item.z / cell)}`;
      if (!chunks.has(key)) chunks.set(key, []);
      chunks.get(key).push(item);
    });
    chunks.forEach((items) => {
      const mesh = new THREE.InstancedMesh(entry.geometry, entry.material, items.length);
      const center = new THREE.Vector3();
      items.forEach((item, index) => {
        const o = forestTmp.object;
        o.position.set(item.x, item.y + reliefAt(item.x, item.z), item.z);
        o.rotation.set(item.rx, item.ry, item.rz, "YXZ");
        o.scale.set(item.sx, item.sy, item.sz);
        o.updateMatrix();
        mesh.setMatrixAt(index, o.matrix);
        mesh.setColorAt(index, forestTmp.color.set(item.color));
        center.x += item.x;
        center.z += item.z;
      });
      center.divideScalar(items.length);
      let radius = 0;
      items.forEach((item) => { radius = Math.max(radius, Math.hypot(item.x - center.x, item.z - center.z)); });
      center.y = 8;
      mesh.castShadow = entry.shadow;
      mesh.receiveShadow = !!entry.receive;
      mesh.frustumCulled = false;
      cityGroup.add(mesh);
      gfx.foliage.push({ mesh, center, far: entry.far, near: entry.near, radius: radius + 16 });
    });
    entry.items = [];
  });
}

function findNearestMushroom() {
  if (state.currentVehicle || state.currentGame !== "city") return null;
  let best = null;
  let bestDistance = 2.8;
  forestMushrooms.forEach((mushroom) => {
    if (mushroom.taken) return;
    const distance = Math.hypot(player.position.x - mushroom.x, player.position.z - mushroom.z);
    if (distance < bestDistance) {
      best = mushroom;
      bestDistance = distance;
    }
  });
  return best;
}

function findNearestCampfire() {
  if (state.currentVehicle || state.currentGame !== "city") return null;
  return forestFires.find((fire) => Math.hypot(player.position.x - fire.x, player.position.z - fire.z) < 6) || null;
}

function saveMushrooms() {
  try { window.localStorage.setItem("blobloxMushrooms", String(mushroomState.count)); } catch (error) { console.warn(error); }
  if (mushroomChipEl) {
    mushroomChipEl.textContent = `🍄 ${mushroomState.count}`;
    mushroomChipEl.classList.toggle("hidden", mushroomState.count === 0);
  }
}

function pickMushroom(mushroom) {
  const ru = currentLanguage === "ru";
  if (mushroom.type === "amanita") {
    showToast(ru ? "🍄 Это мухомор! Его нельзя есть, оставь в лесу" : "🍄 That's a fly agaric — poisonous, leave it");
    return;
  }
  mushroom.taken = true;
  mushroom.respawnAt = clock.elapsedTime + 180;
  mushroom.group.visible = false;
  mushroomState.count += 1;
  saveMushrooms();
  playPickSound();
  const name = mushroom.type === "porcini" ? (ru ? "Белый гриб" : "Porcini") : (ru ? "Лисичка" : "Chanterelle");
  showToast(ru ? `🧺 ${name}! Грибов в корзинке: ${mushroomState.count}` : `🧺 ${name}! Mushrooms: ${mushroomState.count}`);
}

function startFrying(fire) {
  const ru = currentLanguage === "ru";
  if (mushroomState.frying) return;
  if (mushroomState.count === 0) {
    showToast(ru ? "Сначала собери грибы в лесу 🍄" : "Pick some mushrooms first 🍄");
    return;
  }
  mushroomState.frying = { fire, time: 0, count: mushroomState.count };
  mushroomState.count = 0;
  saveMushrooms();
  fire.fried.visible = true;
  showToast(ru ? "🍳 Жарим грибы… шкворчит!" : "🍳 Frying mushrooms… sizzle!");
}

function playPickSound() {
  const context = audioState.context;
  if (!context || audioState.muted) return;
  const now = context.currentTime;
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(520, now);
  osc.frequency.exponentialRampToValueAtTime(980, now + 0.12);
  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
  osc.connect(gain);
  gain.connect(context.destination);
  osc.start(now);
  osc.stop(now + 0.2);
}

// Звуки леса: ветер в кронах и птицы, только когда игрок в лесу
function updateForestAmbience(delta, inForest) {
  forestAmbience.mix = dampTo(forestAmbience.mix, inForest ? 1 : 0, 1.2, delta);
  const context = audioState.context;
  if (!context || context.state !== "running") return;
  if (!forestAmbience.nodes && forestAmbience.mix > 0.02) {
    const buffer = context.createBuffer(1, context.sampleRate * 3, context.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i += 1) {
      last = last * 0.985 + (Math.random() * 2 - 1) * 0.015;
      data[i] = last * 6;
    }
    const noise = context.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const gain = context.createGain();
    gain.gain.value = 0;
    noise.connect(gain);
    gain.connect(context.destination);
    noise.start();
    forestAmbience.nodes = { noise, gain };
  }
  if (forestAmbience.nodes) {
    const sway = 0.5 + 0.5 * Math.sin(clock.elapsedTime * 0.3);
    forestAmbience.nodes.gain.gain.setTargetAtTime(audioState.muted ? 0 : forestAmbience.mix * (0.025 + sway * 0.03), context.currentTime, 0.4);
  }
  forestAmbience.nextChirp -= delta;
  if (forestAmbience.mix > 0.5 && forestAmbience.nextChirp <= 0 && !audioState.muted) {
    forestAmbience.nextChirp = 1.2 + Math.random() * 3.5;
    const now = context.currentTime;
    const notes = 2 + Math.floor(Math.random() * 4);
    const base = 2200 + Math.random() * 1600;
    for (let i = 0; i < notes; i += 1) {
      const osc = context.createOscillator();
      const gain = context.createGain();
      const start = now + i * 0.13;
      osc.type = "sine";
      osc.frequency.setValueAtTime(base * (1 + Math.random() * 0.2), start);
      osc.frequency.exponentialRampToValueAtTime(base * (0.7 + Math.random() * 0.6), start + 0.09);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.025 * forestAmbience.mix, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.1);
      osc.connect(gain);
      gain.connect(context.destination);
      osc.start(start);
      osc.stop(start + 0.12);
    }
  }
}

// Каждый кадр: грибы вырастают снова, сковородка шкворчит, в лесу тише ветер и мягче дымка
function updateForest(delta) {
  if (state.inHub || state.currentGame !== "city") {
    updateForestAmbience(delta, false);
    return;
  }
  const now = clock.elapsedTime;
  mushroomState.scan -= delta;
  if (mushroomState.scan <= 0) {
    mushroomState.scan = 0.5;
    forestMushrooms.forEach((mushroom) => {
      if (mushroom.taken && now > mushroom.respawnAt) {
        mushroom.taken = false;
        mushroom.group.visible = true;
      }
    });
  }
  const frying = mushroomState.frying;
  if (frying) {
    frying.time += delta;
    const { fire } = frying;
    fire.pan.rotation.y += delta * 0.8;
    if (Math.random() < delta * 14) {
      spawnSmoke(fire.x + (Math.random() - 0.5), 2.3, fire.z + (Math.random() - 0.5), 0, 1.6 + Math.random(), 0, 0.5, 1.6, 1.2, 0.35, 1, 0.6, 1.2);
    }
    if (frying.time > 3.5) {
      const ru = currentLanguage === "ru";
      playerEffects.speedUntil = now + 90 + frying.count * 10;
      playerEffects.jumpUntil = now + 90 + frying.count * 10;
      fire.fried.visible = false;
      playPickSound();
      showToast(ru
        ? `😋 Жареные грибы готовы! Съел ${frying.count} шт — бегаешь быстрее и прыгаешь выше`
        : `😋 Fried mushrooms! Ate ${frying.count} — faster and higher jumps`);
      mushroomState.frying = null;
    }
  }
  const p = player.position;
  const inForest = p.x > FOREST_AREA.minX && p.x < FOREST_AREA.maxX && p.z > FOREST_AREA.minZ && p.z < FOREST_AREA.maxZ && p.y < 30;
  updateForestAmbience(delta, inForest);
  // пыль из-под колёс на грязевой дороге
  const vehicle = state.currentVehicle;
  if (vehicle && inForest) {
    const speed = Math.abs(vehicle.flying ? vehicle.forwardSpeed : vehicle.speed);
    if (speed > 10 && (!vehicle.flying || !vehicle.airborne) && distanceToLanes(vehicle.group.position.x, vehicle.group.position.z, "dirt") < 5.5 && Math.random() < delta * 30) {
      const back = vehicle.group.position;
      spawnSmoke(back.x + (Math.random() - 0.5) * 3, 0.5, back.z + (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 2, 0.6 + Math.random(), (Math.random() - 0.5) * 2, 1.2, 3.2, 1.2 + Math.random(), 0.32, 0.86, 1.4, 0.4, 0.2);
    }
  }
}

// Высота земли с учётом холмов и впадин озёр
function getGroundHeight(x, z, y = 0) {
  const core = groundHeightCore(x, z, y);
  if (state.currentGame !== "city" || core > 0.25) {
    return core;
  }
  return core + reliefAt(x, z) + lakeCarve(x, z);
}

function lakeCarve(x, z) {
  let carve = 0;
  for (const lake of lakes) {
    const t = Math.hypot(x - lake.x, z - lake.z) / lake.r;
    if (t < 1) carve = Math.min(carve, -lake.depth * Math.pow(1 - t * t, 0.7));
  }
  return carve;
}

function findLakeAt(x, z, margin = 0) {
  for (const lake of lakes) {
    if (Math.hypot(x - lake.x, z - lake.z) < lake.r - margin) return lake;
  }
  return null;
}

function reliefAt(x, z) {
  if (!reliefState.ready) return 0;
  const { cell, min, count, grid } = reliefState;
  const fx = (x - min) / cell;
  const fz = (z - min) / cell;
  const ix = Math.floor(fx);
  const iz = Math.floor(fz);
  if (ix < 0 || iz < 0 || ix >= count - 1 || iz >= count - 1) return 0;
  const tx = fx - ix;
  const tz = fz - iz;
  const a = grid[iz * count + ix];
  const b = grid[iz * count + ix + 1];
  const c = grid[(iz + 1) * count + ix];
  const d = grid[(iz + 1) * count + ix + 1];
  return (a + (b - a) * tx) * (1 - tz) + (c + (d - c) * tx) * tz;
}

function makeWaterMaterial(lake) {
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: {
      time: { value: 0 },
      sunDir: { value: SUN_OFFSET.clone().normalize() },
      sky: { value: new THREE.Color(0x9fd2f5) },
      deep: { value: new THREE.Color(0x0d4f6b) },
      shallow: { value: new THREE.Color(0x4fb3b6) },
      center: { value: new THREE.Vector2(lake.x, lake.z) },
      radius: { value: lake.r },
      night: { value: 0 },
      fogColor: { value: new THREE.Color() },
      fogRange: { value: new THREE.Vector2(340, 1750) }
    },
    vertexShader: `
      varying vec3 vWorld;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorld = world.xyz;
        gl_Position = projectionMatrix * viewMatrix * world;
      }`,
    fragmentShader: `
      uniform float time;
      uniform vec3 sunDir;
      uniform vec3 sky;
      uniform vec3 deep;
      uniform vec3 shallow;
      uniform vec2 center;
      uniform float radius;
      uniform float night;
      uniform vec3 fogColor;
      uniform vec2 fogRange;
      varying vec3 vWorld;
      vec3 waveNormal(vec2 p) {
        float t = time;
        float dx = cos(p.x * 0.31 + t * 1.2) * 0.031 + cos((p.x + p.y) * 0.72 + t * 1.9) * 0.036
          + cos(p.x * 1.7 - p.y * 0.9 + t * 2.8) * 0.034 + cos(p.x * 3.1 + p.y * 2.3 + t * 3.6) * 0.022;
        float dz = cos(p.y * 0.27 + t * 1.05) * 0.027 + cos((p.x + p.y) * 0.72 + t * 1.9) * 0.036
          - cos(p.x * 1.7 - p.y * 0.9 + t * 2.8) * 0.018 + cos(p.x * 3.1 + p.y * 2.3 + t * 3.6) * 0.016;
        return normalize(vec3(-dx * 3.0, 1.0, -dz * 3.0));
      }
      void main() {
        vec3 n = waveNormal(vWorld.xz);
        vec3 toCamera = cameraPosition - vWorld;
        float distanceToCamera = length(toCamera);
        vec3 v = toCamera / distanceToCamera;
        if (!gl_FrontFacing) {
          // снизу, из-под воды: светлая колышущаяся граница
          float glow = 0.55 + 0.25 * sin(vWorld.x * 0.8 + time * 2.0) * sin(vWorld.z * 0.7 + time * 1.6);
          gl_FragColor = vec4(mix(deep, sky, 0.35) * glow * (1.0 - night * 0.7), 0.85);
          return;
        }
        float fresnel = 0.03 + 0.97 * pow(1.0 - max(dot(n, v), 0.0), 5.0);
        float edge = distance(vWorld.xz, center) / radius;
        float shoreMix = smoothstep(0.6, 1.0, edge);
        vec3 body = mix(deep, shallow, shoreMix) * (1.0 - night * 0.75);
        vec3 color = mix(body, sky, fresnel * 0.85);
        float sparkle = pow(max(dot(reflect(-sunDir, n), v), 0.0), 220.0);
        color += vec3(1.0, 0.96, 0.88) * sparkle * 2.2 * (1.0 - night);
        float alpha = clamp(mix(0.62, 0.2, shoreMix) + fresnel * 0.45 + sparkle, 0.0, 0.96);
        color = mix(color, fogColor, smoothstep(fogRange.x, fogRange.y, distanceToCamera));
        gl_FragColor = vec4(color, alpha);
      }`
  });
  waterMaterials.push(material);
  return material;
}

// Рыбы плавают кругами на разной глубине и виляют хвостом
function addFish(lake, count) {
  const colors = [0xff8a2a, 0xc9d3dc, 0x7f9a5a, 0xf2c230, 0xd85a5a];
  for (let i = 0; i < count; i += 1) {
    const group = new THREE.Group();
    group.userData.dynamic = true;
    const material = new THREE.MeshStandardMaterial({ color: colors[i % colors.length], roughness: 0.4, metalness: 0.2 });
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 8), material);
    body.scale.set(0.55, 0.75, 1.5);
    group.add(body);
    const tail = new THREE.Group();
    tail.position.z = -0.5;
    group.add(tail);
    const fin = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.5, 6), material);
    fin.rotation.x = -Math.PI / 2;
    fin.scale.set(0.3, 1, 1);
    fin.position.z = -0.2;
    tail.add(fin);
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 4), new THREE.MeshBasicMaterial({ color: 0x111111 }));
    eye.position.set(0.16, 0.08, 0.32);
    group.add(eye);
    const size = 0.8 + Math.random() * 0.9;
    group.scale.setScalar(size);
    cityGroup.add(group);
    const path = {
      r: (0.2 + Math.random() * 0.6) * lake.r,
      angle: Math.random() * Math.PI * 2,
      speed: (0.15 + Math.random() * 0.25) * (Math.random() < 0.5 ? -1 : 1),
      depth: 0.6 + Math.random() * 0.5,
      wobble: Math.random() * 10
    };
    worldAnimations.push((delta, time) => {
      path.angle += path.speed * delta * (12 / Math.max(6, path.r));
      const r = path.r + Math.sin(time * 0.3 + path.wobble) * 2;
      const fx = lake.x + Math.cos(path.angle) * r;
      const fz = lake.z + Math.sin(path.angle) * r;
      const floor = lakeCarve(fx, fz);
      group.position.set(fx, Math.max(floor + 0.5, floor * path.depth) + Math.sin(time * 1.3 + path.wobble) * 0.15, fz);
      group.rotation.y = Math.atan2(-Math.sin(path.angle) * Math.sign(path.speed), Math.cos(path.angle) * Math.sign(path.speed));
      tail.rotation.y = Math.sin(time * 9 + path.wobble) * 0.5;
    });
  }
}

// Холмы за городом: карта высот, ровная у дорог, домов, полей и озёр
function buildReliefMap() {
  const { cell, min, count } = reliefState;
  const total = count * count;
  const far = 1e6;
  const dist = new Float32Array(total).fill(far);
  const block = (x0, z0, x1, z1) => {
    const ix0 = Math.max(0, Math.floor((x0 - min) / cell));
    const ix1 = Math.min(count - 1, Math.ceil((x1 - min) / cell));
    const iz0 = Math.max(0, Math.floor((z0 - min) / cell));
    const iz1 = Math.min(count - 1, Math.ceil((z1 - min) / cell));
    for (let iz = iz0; iz <= iz1; iz += 1) {
      for (let ix = ix0; ix <= ix1; ix += 1) dist[iz * count + ix] = 0;
    }
  };
  block(-CITY_HALF - 30, -CITY_HALF - 30, CITY_HALF + 30, CITY_HALF + 30);
  block(-760, HIGHWAY_Z - HIGHWAY_WIDTH / 2 - 14, 760, HIGHWAY_Z + HIGHWAY_WIDTH / 2 + 14);
  roads.forEach((road) => block(road.x - road.width / 2 - 8, road.z - road.depth / 2 - 8, road.x + road.width / 2 + 8, road.z + road.depth / 2 + 8));
  buildings.forEach((b) => block(b.x - b.width / 2 - 12, b.z - b.depth / 2 - 12, b.x + b.width / 2 + 12, b.z + b.depth / 2 + 12));
  mapAreas.forEach((area) => {
    if (area.type === "forest") return;
    const half = area.r ? area.r + 10 : 0;
    if (area.r) block(area.x - half, area.z - half, area.x + half, area.z + half);
    else block(area.x - area.w / 2 - 8, area.z - area.d / 2 - 8, area.x + area.w / 2 + 8, area.z + area.d / 2 + 8);
  });
  forestFires.forEach((fire) => block(fire.x - 22, fire.z - 22, fire.x + 22, fire.z + 22));
  block(VALLEY.x - VALLEY.r - 20, VALLEY.z - VALLEY.r - 20, VALLEY.x + VALLEY.r + 20, VALLEY.z + VALLEY.r + 20);
  // расстояние до ровных мест в клетках: два прохода
  for (let iz = 0; iz < count; iz += 1) {
    for (let ix = 0; ix < count; ix += 1) {
      const i = iz * count + ix;
      if (ix > 0) dist[i] = Math.min(dist[i], dist[i - 1] + 1);
      if (iz > 0) dist[i] = Math.min(dist[i], dist[i - count] + 1);
      if (ix > 0 && iz > 0) dist[i] = Math.min(dist[i], dist[i - count - 1] + 1.41);
      if (ix < count - 1 && iz > 0) dist[i] = Math.min(dist[i], dist[i - count + 1] + 1.41);
    }
  }
  for (let iz = count - 1; iz >= 0; iz -= 1) {
    for (let ix = count - 1; ix >= 0; ix -= 1) {
      const i = iz * count + ix;
      if (ix < count - 1) dist[i] = Math.min(dist[i], dist[i + 1] + 1);
      if (iz < count - 1) dist[i] = Math.min(dist[i], dist[i + count] + 1);
      if (ix < count - 1 && iz < count - 1) dist[i] = Math.min(dist[i], dist[i + count + 1] + 1.41);
      if (ix > 0 && iz < count - 1) dist[i] = Math.min(dist[i], dist[i + count - 1] + 1.41);
    }
  }
  const grid = new Float32Array(total);
  for (let iz = 0; iz < count; iz += 1) {
    for (let ix = 0; ix < count; ix += 1) {
      const x = min + ix * cell;
      const z = min + iz * cell;
      let h = 3.4 * Math.sin(x * 0.019 + 1.3) * Math.cos(z * 0.016 + 0.4)
        + 2.1 * Math.sin(x * 0.043 + z * 0.029 + 2.1)
        + 1.2 * Math.sin(z * 0.061 - x * 0.013 + 0.7)
        + 0.5 * Math.sin(x * 0.13 + z * 0.11);
      h = Math.max(-1.2, h) + 1.2;
      const away = dist[iz * count + ix] * cell;
      grid[iz * count + ix] = h * THREE.MathUtils.smoothstep(away, 8, 48);
    }
  }
  reliefState.grid = grid;
  reliefState.ready = true;
}

// Лес не обрывается: за краем деревья редеют постепенно и неровно
function buildForestFringe() {
  const random = makeRandom(9191);
  const area = FOREST_AREA;
  const margin = 150;
  const blocked = (x, z) => {
    if (!isInsideWorld(x, z) || mountainHeight(x, z) > 0.3) return true;
    if (Math.abs(x) < CITY_HALF + 22 && Math.abs(z) < CITY_HALF + 22) return true;
    if (Math.abs(z - HIGHWAY_Z) < HIGHWAY_WIDTH / 2 + 10) return true;
    if (findLakeAt(x, z, -10)) return true;
    if (roads.some((road) => Math.abs(x - road.x) < road.width / 2 + 6 && Math.abs(z - road.z) < road.depth / 2 + 6)) return true;
    if (buildings.some((b) => Math.abs(x - b.x) < b.width / 2 + 10 && Math.abs(z - b.z) < b.depth / 2 + 10)) return true;
    return mapAreas.some((a) => a.type !== "forest" && (a.r ? Math.hypot(x - a.x, z - a.z) < a.r + 8 : Math.abs(x - a.x) < a.w / 2 + 6 && Math.abs(z - a.z) < a.d / 2 + 6));
  };
  const step = 7.6;
  for (let gx = area.minX - margin; gx < area.maxX + margin; gx += step) {
    for (let gz = area.minZ - margin; gz < area.maxZ + margin; gz += step) {
      const x = gx + random() * step * 0.9;
      const z = gz + random() * step * 0.9;
      const dx = Math.max(area.minX - x, 0, x - area.maxX);
      const dz = Math.max(area.minZ - z, 0, z - area.maxZ);
      const outside = Math.hypot(dx, dz);
      if (outside <= 0) continue;
      const wobble = Math.sin(x * 0.045 + 1.7) * Math.cos(z * 0.038 + 0.6) * 40 + Math.sin(x * 0.11 + z * 0.07) * 14;
      const keep = 1 - THREE.MathUtils.smoothstep(outside + wobble, 0, 135);
      if (random() > keep * 0.95 || blocked(x, z)) continue;
      const pick = random();
      const kind = pick < 0.28 ? "spruce" : pick < 0.42 ? "pine" : pick < 0.72 ? "oak" : "birch";
      const young = random() < 0.25 + (1 - keep) * 0.4;
      plantForestTree(x, z, kind, young ? 0.4 + random() * 0.3 : 0.75 + random() * 0.5, random);
      if (random() < keep) {
        const ox = x + (random() - 0.5) * 6;
        const oz = z + (random() - 0.5) * 6;
        const under = random();
        if (under < 0.35) plantBush(ox, oz, random);
        else if (under < 0.6) plantFern(ox, oz, random);
        else plantGrass(ox, oz, random, random() < 0.3);
      }
    }
  }
}

// Холмы применяются ко всему, что уже стоит: земле, дорогам в лесу, грибам
function applyReliefToWorld() {
  const terrain = reliefState.terrain;
  if (terrain) {
    const positions = terrain.geometry.attributes.position;
    const colors = terrain.geometry.attributes.color;
    const forestTone = new THREE.Color(0x4d6e33);
    const tone = new THREE.Color();
    for (let i = 0; i < positions.count; i += 1) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      const carve = lakeCarve(x, z);
      const inLake = findLakeAt(x, z, -1.5);
      positions.setY(i, mountainHeight(x, z) + reliefAt(x, z) + carve - (inLake ? 1.1 : 0));
      // в лесу земля темнее: мох и хвоя, к краю цвет плавно переходит в луг
      const dx = Math.max(FOREST_AREA.minX - x, 0, x - FOREST_AREA.maxX);
      const dz = Math.max(FOREST_AREA.minZ - z, 0, z - FOREST_AREA.maxZ);
      const wobble = Math.sin(x * 0.045 + 1.7) * Math.cos(z * 0.038 + 0.6) * 40;
      const forestness = 1 - THREE.MathUtils.smoothstep(Math.hypot(dx, dz) + wobble, 0, 120);
      if (forestness > 0 && mountainHeight(x, z) < 1) {
        tone.setRGB(colors.getX(i), colors.getY(i), colors.getZ(i)).lerp(forestTone, forestness * 0.8);
        colors.setXYZ(i, tone.r, tone.g, tone.b);
      }
    }
    positions.needsUpdate = true;
    colors.needsUpdate = true;
    terrain.geometry.computeVertexNormals();
  }
  reliefState.lanes.forEach((mesh) => {
    const positions = mesh.geometry.attributes.position;
    for (let i = 0; i < positions.count; i += 1) {
      positions.setY(i, positions.getY(i) + reliefAt(positions.getX(i), positions.getZ(i)));
    }
    positions.needsUpdate = true;
    mesh.geometry.computeVertexNormals();
    mesh.geometry.computeBoundingSphere();
  });
  forestMushrooms.forEach((mushroom) => {
    mushroom.group.position.y = reliefAt(mushroom.x, mushroom.z);
  });
}

// Поля: настоящие колосья, подсолнухи и грядки, которые качает ветер
function getCropKind(kind) {
  if (fieldCrops.has(kind)) return fieldCrops.get(kind);
  let geometry;
  let color = 0xffffff;
  if (kind === "wheat") {
    const parts = [];
    for (let i = 0; i < 7; i += 1) {
      const angle = (i / 7) * Math.PI * 2;
      const lean = 0.1 + Math.random() * 0.12;
      const stalk = new THREE.BoxGeometry(0.035, 1.9, 0.035);
      stalk.translate(0, 0.95, 0);
      const ear = new THREE.BoxGeometry(0.09, 0.42, 0.07);
      ear.translate(0, 2.05, 0);
      [stalk, ear].forEach((geometryPart) => {
        const matrix = new THREE.Matrix4().makeRotationZ(lean).premultiply(new THREE.Matrix4().makeRotationY(angle)).setPosition(Math.cos(angle) * 0.18, 0, Math.sin(angle) * 0.18);
        parts.push({ geometry: geometryPart, matrix });
      });
    }
    geometry = mergeGeometryList(parts);
    color = 0xd9b44a;
  } else if (kind === "stem") {
    const stem = new THREE.CylinderGeometry(0.06, 0.09, 3.4, 5);
    stem.translate(0, 1.7, 0);
    const leafA = new THREE.BoxGeometry(0.7, 0.03, 0.35);
    leafA.translate(0.35, 1.3, 0);
    const leafB = new THREE.BoxGeometry(0.6, 0.03, 0.3);
    leafB.translate(-0.3, 2.1, 0);
    geometry = mergeGeometryList([{ geometry: stem, matrix: new THREE.Matrix4() }, { geometry: leafA, matrix: new THREE.Matrix4() }, { geometry: leafB, matrix: new THREE.Matrix4() }]);
  } else if (kind === "petals") {
    geometry = new THREE.CylinderGeometry(0.62, 0.62, 0.06, 14);
    geometry.rotateX(Math.PI / 2);
  } else if (kind === "seeds") {
    geometry = new THREE.CylinderGeometry(0.34, 0.34, 0.12, 12);
    geometry.rotateX(Math.PI / 2);
  } else {
    geometry = new THREE.IcosahedronGeometry(0.55, 0);
  }
  const material = new THREE.MeshStandardMaterial({ color, roughness: 0.9, side: kind === "wheat" ? THREE.DoubleSide : THREE.FrontSide, flatShading: kind === "leafy" });
  if (kind === "wheat" || kind === "stem") {
    material.onBeforeCompile = (shader) => {
      shader.uniforms.windTime = cropWind.time;
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nuniform float windTime;")
        .replace("#include <begin_vertex>", `#include <begin_vertex>
          #ifdef USE_INSTANCING
            vec2 windAt = instanceMatrix[3].xz;
          #else
            vec2 windAt = vec2(0.0);
          #endif
          float gust = sin(windTime * 1.7 + windAt.x * 0.09 + windAt.y * 0.06) * 0.6 + sin(windTime * 3.1 + windAt.x * 0.31) * 0.25;
          transformed.x += gust * 0.12 * transformed.y * transformed.y * 0.3;
          transformed.z += gust * 0.05 * transformed.y;`);
    };
  }
  const entry = { geometry, material, items: [] };
  fieldCrops.set(kind, entry);
  return entry;
}

function buildFieldCrops() {
  const cell = 60;
  const object = new THREE.Object3D();
  const color = new THREE.Color();
  fieldCrops.forEach((entry) => {
    const chunks = new Map();
    entry.items.forEach((item) => {
      const key = `${Math.floor(item.x / cell)},${Math.floor(item.z / cell)}`;
      if (!chunks.has(key)) chunks.set(key, []);
      chunks.get(key).push(item);
    });
    chunks.forEach((items) => {
      const mesh = new THREE.InstancedMesh(entry.geometry, entry.material, items.length);
      const center = new THREE.Vector3();
      items.forEach((item, index) => {
        object.position.set(item.x, item.y, item.z);
        object.rotation.set(item.tilt || 0, item.yaw, 0, "YXZ");
        object.scale.setScalar(item.s);
        object.updateMatrix();
        mesh.setMatrixAt(index, object.matrix);
        mesh.setColorAt(index, color.set(item.color));
        center.x += item.x;
        center.z += item.z;
      });
      center.divideScalar(items.length);
      mesh.frustumCulled = false;
      mesh.castShadow = false;
      cityGroup.add(mesh);
      gfx.foliage.push({ mesh, center, far: 260 });
    });
    entry.items = [];
  });
}

// Каждый кадр: волны, ветер в полях, плавание и вид из-под воды
function updateNature(delta) {
  cropWind.time.value = clock.elapsedTime;
  const night = state.isNight ? 1 : 0;
  waterMaterials.forEach((material) => {
    material.uniforms.time.value = clock.elapsedTime;
    material.uniforms.sky.value.copy(scene.fog.color).lerp(new THREE.Color(0xffffff), state.isNight ? 0 : 0.15);
    material.uniforms.night.value = night;
    material.uniforms.fogColor.value.copy(scene.fog.color);
  });
  if (state.currentGame !== "city" || state.inHub) {
    if (reliefState.underwater) setUnderwater(false);
    return;
  }
  // брызги, когда плывёшь
  if (state.swimming && moveAmount > 0.04) {
    reliefState.splash -= delta;
    if (reliefState.splash <= 0) {
      reliefState.splash = 0.08;
      const p = player.position;
      spawnSmoke(p.x + (Math.random() - 0.5) * 1.2, WATER_LEVEL + 0.2, p.z + (Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 2, 1.2 + Math.random(), (Math.random() - 0.5) * 2, 0.4, 1.4, 0.6, 0.55, 1, 2.4, -1.5, WATER_LEVEL);
    }
  }
  const under = camera.position.y < WATER_LEVEL - 0.05 && Boolean(findLakeAt(camera.position.x, camera.position.z, -0.5));
  if (under !== reliefState.underwater) setUnderwater(under);
}

function setUnderwater(under) {
  reliefState.underwater = under;
  if (underwaterEl) underwaterEl.classList.toggle("hidden", !under);
  if (under) {
    scene.fog.color.set(state.isNight ? 0x0a2530 : 0x1f6f7c);
    scene.fog.near = 0.5;
    scene.fog.far = 32;
  } else {
    scene.fog.near = 340;
    scene.fog.far = 1750;
    applyDayNightLighting();
  }
}

// Мелкая текстура травы поверх цвета земли: видно травинки вблизи
function getGrassDetailTexture() {
  const texture = makeCanvasTexture(128, (ctx, size) => {
    ctx.fillStyle = "rgb(238,238,238)";
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 1300; i += 1) {
      const v = 196 + Math.floor(Math.random() * 59);
      ctx.fillStyle = `rgb(${v},${Math.min(255, v + 6)},${v - 6})`;
      ctx.fillRect(Math.random() * size, Math.random() * size, 1, 2 + Math.random() * 4);
    }
    for (let i = 0; i < 160; i += 1) {
      const v = 165 + Math.floor(Math.random() * 30);
      ctx.fillStyle = `rgb(${v},${v + 4},${v - 10})`;
      ctx.fillRect(Math.random() * size, Math.random() * size, 1 + Math.random(), 2 + Math.random() * 3);
    }
  });
  texture.repeat.set(400, 400);
  return texture;
}

// Текстура дерева: волокна вдоль доски и пара сучков
function getWoodTexture() {
  if (woodState.texture) return woodState.texture;
  woodState.texture = makeCanvasTexture(256, (ctx, size) => {
    ctx.fillStyle = "#b8875a";
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 80; i += 1) {
      const y = Math.random() * size;
      const dark = Math.random() < 0.62;
      ctx.strokeStyle = dark ? `rgba(92,56,26,${0.12 + Math.random() * 0.26})` : `rgba(232,194,146,${0.1 + Math.random() * 0.2})`;
      ctx.lineWidth = 0.6 + Math.random() * 1.8;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 16; x <= size; x += 16) ctx.lineTo(x, y + Math.sin(x * 0.0245 + i) * 2.5);
      ctx.stroke();
    }
    for (let k = 0; k < 3; k += 1) {
      const x = 30 + Math.random() * (size - 60);
      const y = 20 + Math.random() * (size - 40);
      for (let r = 7; r > 1; r -= 2) {
        ctx.strokeStyle = `rgba(80,46,20,${0.25 + (7 - r) * 0.08})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(x, y, r * 1.9, r * 0.7, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  });
  return woodState.texture;
}

function getWoodMaterial(color = 0xffffff, vertical = false) {
  const key = `${color}-${vertical}`;
  if (woodState.materials.has(key)) return woodState.materials.get(key);
  let map = getWoodTexture();
  if (vertical) {
    if (!woodState.vertical) {
      woodState.vertical = map.clone();
      woodState.vertical.center.set(0.5, 0.5);
      woodState.vertical.rotation = Math.PI / 2;
      woodState.vertical.needsUpdate = true;
    }
    map = woodState.vertical;
  }
  const material = new THREE.MeshStandardMaterial({ color, map, roughness: 0.82 });
  woodState.materials.set(key, material);
  return material;
}

// Деревянные мостки: доски с щелями, балки, сваи в воду и верёвочные перила
function addWoodDeck(cx, cz, width, length, topY, rotY = 0, options = {}) {
  const random = makeRandom(options.seed || 4711);
  const group = new THREE.Group();
  group.position.set(cx, 0, cz);
  group.rotation.y = rotY;
  const cos = Math.cos(rotY);
  const sin = Math.sin(rotY);
  const thick = 0.12;
  const step = 0.42;
  const count = Math.floor(length / step);
  const planks = new THREE.InstancedMesh(new THREE.BoxGeometry(width, thick, 0.35), getWoodMaterial(), count);
  const o = forestTmp.object;
  const tint = forestTmp.color;
  for (let i = 0; i < count; i += 1) {
    o.position.set((random() - 0.5) * 0.1, topY - thick / 2 - random() * 0.02, -length / 2 + step * (i + 0.5));
    o.rotation.set(0, (random() - 0.5) * 0.02, (random() - 0.5) * 0.012);
    o.scale.set(1 - random() * 0.04, 1, 1);
    o.updateMatrix();
    planks.setMatrixAt(i, o.matrix);
    if (random() < 0.12) tint.setRGB(0.78, 0.77, 0.74);
    else {
      const tone = 0.8 + random() * 0.28;
      tint.setRGB(tone, tone * 0.96, tone * 0.9);
    }
    planks.setColorAt(i, tint);
  }
  planks.castShadow = true;
  planks.receiveShadow = true;
  group.add(planks);
  const beamMaterial = getWoodMaterial(0x8f7a64);
  const pileMaterial = getWoodMaterial(0x7d6a58, true);
  const box = (w, h, d, x, y, z, material) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };
  [-1, 1].forEach((side) => box(0.22, 0.26, length, side * (width / 2 - 0.45), topY - thick - 0.13, 0, beamMaterial));
  const rows = [];
  for (let lz = -length / 2 + 0.4; lz <= length / 2; lz += 3.2) rows.push(lz);
  const postTop = topY + (options.rails ? 0.95 : 0.25);
  rows.forEach((lz) => {
    box(width + 0.3, 0.2, 0.24, 0, topY - thick - 0.36, lz, beamMaterial);
    [-1, 1].forEach((side) => {
      const lx = side * (width / 2 + 0.06);
      const wx = cx + lx * cos + lz * sin;
      const wz = cz - lx * sin + lz * cos;
      const bottom = findLakeAt(wx, wz, -1) ? Math.min(-0.6, lakeCarve(wx, wz) - 1.1) - 0.4 : -0.4;
      const height = postTop - bottom;
      const pile = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.18, height, 8), pileMaterial);
      pile.position.set(lx, bottom + height / 2, lz);
      pile.castShadow = true;
      group.add(pile);
    });
  });
  if (options.rails) {
    const ropeMaterial = new THREE.MeshStandardMaterial({ color: 0xcdb48a, roughness: 1 });
    for (let r = 1; r < rows.length; r += 1) {
      [-1, 1].forEach((side) => {
        const lx = side * (width / 2 + 0.06);
        const y = postTop - 0.12;
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(lx, y, rows[r - 1]),
          new THREE.Vector3(lx, y - 0.2, (rows[r - 1] + rows[r]) / 2),
          new THREE.Vector3(lx, y, rows[r])
        ]);
        group.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 8, 0.035, 5), ropeMaterial));
      });
    }
  }
  cityGroup.add(group);
  walkDecks.push({ x: cx, z: cz, cos, sin, hw: width / 2 + 0.1, hl: length / 2, top: topY });
  return group;
}

// Деревянная лодка: красное днище, белые борта, скамейки и вёсла
function buildRowBoat() {
  const boat = new THREE.Group();
  const half = [[1.1, -3], [1.3, -1.6], [1.32, 0.4], [1.12, 1.7], [0.66, 2.62], [0, 3.05]];
  const outline = (sx, sy) => {
    const right = half.map(([x, y]) => new THREE.Vector2(x * sx, y * sy));
    const left = half.slice(0, -1).reverse().map(([x, y]) => new THREE.Vector2(-x * sx, y * sy));
    return right.concat(left);
  };
  const part = (geometry, material, y) => {
    geometry.rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = y;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    boat.add(mesh);
    return mesh;
  };
  part(new THREE.ExtrudeGeometry(new THREE.Shape(outline(0.97, 0.97)), { depth: 0.45, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelSegments: 2 }), getWoodMaterial(0xd8553f), 0);
  const wallShape = new THREE.Shape(outline(1, 1));
  wallShape.holes.push(new THREE.Path(outline(0.86, 0.9).reverse()));
  part(new THREE.ExtrudeGeometry(wallShape, { depth: 0.62, bevelEnabled: false }), getWoodMaterial(0xf4f1ea), 0.42);
  part(new THREE.ExtrudeGeometry(new THREE.Shape(outline(0.86, 0.9)), { depth: 0.04, bevelEnabled: false }), getWoodMaterial(0x9c7650), 0.54);
  const seatMaterial = getWoodMaterial(0xe0c7a0);
  [0.4, -1.5].forEach((z) => {
    const seat = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.09, 0.42), seatMaterial);
    seat.position.set(0, 0.92, z);
    seat.castShadow = true;
    boat.add(seat);
  });
  [-0.3, -0.75].forEach((z, index) => {
    const oar = new THREE.Group();
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 3.3, 6), seatMaterial);
    shaft.rotation.z = Math.PI / 2;
    oar.add(shaft);
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.035, 0.24), seatMaterial);
    blade.position.x = 1.65 + 0.2;
    oar.add(blade);
    oar.position.set(index ? 0.2 : -0.2, 1.08, z);
    oar.rotation.set(0, index ? 0.12 : -0.1, 0.05);
    boat.add(oar);
  });
  return boat;
}

function addPicnicTable(x, z, rotationY = 0) {
  const wood = getWoodMaterial();
  const dark = getWoodMaterial(0xb09070);
  const group = new THREE.Group();
  const add = (w, h, d, px, py, pz, material, rx = 0) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(px, py, pz);
    mesh.rotation.x = rx;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  };
  for (let i = -2; i <= 2; i += 1) add(4.4, 0.1, 0.36, 0, 1.45, i * 0.4, wood);
  [-1, 1].forEach((side) => {
    add(4.4, 0.09, 0.32, 0, 0.85, side * 1.55, wood);
    add(4.4, 0.09, 0.32, 0, 0.85, side * 1.9, wood);
  });
  [-1.6, 1.6].forEach((lx) => {
    [-1, 1].forEach((s) => add(0.14, 1.75, 0.16, lx, 0.72, s * 0.62, dark, -s * 0.6));
    add(0.14, 0.12, 4.2, lx, 0.78, 0, dark);
  });
  group.position.set(x, 0, z);
  group.rotation.y = rotationY;
  cityGroup.add(group);
  addCollider({ minX: x - 2.2, maxX: x + 2.2, minZ: z - 1.2, maxZ: z + 1.2 });
}

// Опавшие листья: кучками в лесу и чуть-чуть за его краем
function scatterFallenLeaves() {
  const random = makeRandom(5151);
  const area = FOREST_AREA;
  const margin = 70;
  const palette = [0xc0782e, 0xd49a34, 0xa4552a, 0x8c5a2e, 0xc9a640, 0x9a8a3a, 0x7a6a34, 0xb8402a, 0x6f8a32];
  for (let i = 0; i < 4200; i += 1) {
    const x = area.minX - margin + random() * (area.maxX - area.minX + margin * 2);
    const z = area.minZ - margin + random() * (area.maxZ - area.minZ + margin * 2);
    const dx = Math.max(area.minX - x, 0, x - area.maxX);
    const dz = Math.max(area.minZ - z, 0, z - area.maxZ);
    const outside = Math.hypot(dx, dz);
    if (outside > 0 && random() < outside / margin) continue;
    if (findLakeAt(x, z, -3) || mountainHeight(x, z) > 0.3 || !isInsideWorld(x, z)) continue;
    if (x > -74 && x < -6 && z > -366 && z < -335) continue;
    if (Math.abs(x) < CITY_HALF + 10 && Math.abs(z) < CITY_HALF + 10) continue;
    if (Math.abs(z - HIGHWAY_Z) < HIGHWAY_WIDTH / 2 + 4) continue;
    const onRoad = distanceToLanes(x, z, "dirt") < 4.5;
    const count = onRoad ? 2 : 4 + Math.floor(random() * 6);
    const spread = 1.2 + random() * 2.2;
    const base = palette[Math.floor(random() * palette.length)];
    for (let k = 0; k < count; k += 1) {
      const size = 0.32 + random() * 0.24;
      const color = random() < 0.6 ? base : palette[Math.floor(random() * palette.length)];
      forestPut("leaf", x + (random() - 0.5) * spread * 2, 0.09 + random() * 0.03, z + (random() - 0.5) * spread * 2, size, 1, size * (0.9 + random() * 0.3), color, (random() - 0.5) * 0.25, random() * Math.PI * 2, (random() - 0.5) * 0.25);
    }
  }
}

// Луга вокруг: полевые цветы кучками (трава вблизи — в updateLocalGrass)
function buildMeadowDetail() {
  const random = makeRandom(6262);
  const flowers = [0xffffff, 0xffd23f, 0xb784f0, 0xff7ab8, 0x5aa0ff, 0xff5a4a];
  for (let i = 0; i < 14000; i += 1) {
    const x = -720 + random() * 1440;
    const z = -720 + random() * 1440;
    if (!isOpenGround(x, z) || (x > FOREST_AREA.minX && x < FOREST_AREA.maxX && z > FOREST_AREA.minZ && z < FOREST_AREA.maxZ)) continue;
    const color = flowers[Math.floor(random() * flowers.length)];
    const n = 3 + Math.floor(random() * 5);
    for (let f = 0; f < n; f += 1) {
      const fx = x + (random() - 0.5) * 2;
      const fz = z + (random() - 0.5) * 2;
      forestPut("near-blade", fx, 0, fz, 0.8, 0.35 + random() * 0.15, 0.8, 0x5e9a3a);
      forestPut("near-dot", fx, 0.42 + random() * 0.12, fz, 0.15, 0.09, 0.15, color);
    }
  }
}

// Люки на дорогах
function addManholes() {
  getStreetMaterials();
  const random = makeRandom(8383);
  const texture = makeCanvasTexture(64, (ctx, size) => {
    ctx.fillStyle = "#2c2e32";
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = "#4c5056";
    ctx.lineWidth = 2;
    for (let i = 10; i < size; i += 7) {
      ctx.beginPath();
      ctx.moveTo(6, i);
      ctx.lineTo(size - 6, i);
      ctx.stroke();
    }
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 3, 0, Math.PI * 2);
    ctx.stroke();
  });
  const spots = [];
  roads.forEach((road) => {
    const alongX = road.width > road.depth;
    const length = alongX ? road.width : road.depth;
    const cross = alongX ? road.depth : road.width;
    if (cross < 6) return;
    for (let t = -length / 2 + 14; t < length / 2 - 10; t += 34) {
      if (random() < 0.4) continue;
      const offset = cross * 0.24 * (random() < 0.5 ? -1 : 1);
      spots.push(alongX ? [road.x + t, road.z + offset] : [road.x + offset, road.z + t]);
    }
  });
  if (!spots.length) return;
  const mesh = new THREE.InstancedMesh(
    new THREE.CylinderGeometry(0.55, 0.55, 0.03, 18),
    new THREE.MeshStandardMaterial({ color: 0xffffff, map: texture, roughness: 0.55, metalness: 0.35 }),
    spots.length
  );
  spots.forEach(([x, z], index) => {
    const o = forestTmp.object;
    o.position.set(x, ROAD_TOP + 0.012, z);
    o.rotation.set(0, random() * Math.PI, 0);
    o.scale.set(1, 1, 1);
    o.updateMatrix();
    mesh.setMatrixAt(index, o.matrix);
  });
  mesh.receiveShadow = true;
  cityGroup.add(mesh);
}

// Листья, которые медленно падают вокруг, когда гуляешь по лесу
function updateFallingLeaves(delta) {
  const area = FOREST_AREA;
  const cx = camera.position.x;
  const cz = camera.position.z;
  const dx = Math.max(area.minX - cx, 0, cx - area.maxX);
  const dz = Math.max(area.minZ - cz, 0, cz - area.maxZ);
  const inForest = state.currentGame === "city" && Math.hypot(dx, dz) < 30 && !reliefState.underwater;
  if (!fallingLeaves.mesh) {
    if (!inForest) return;
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, side: THREE.DoubleSide });
    const mesh = new THREE.InstancedMesh(getForestKind("leaf").geometry, material, 36);
    mesh.frustumCulled = false;
    const palette = [0xd49a34, 0xc0782e, 0xc9a640, 0xa4552a, 0x8faa3a];
    for (let i = 0; i < 36; i += 1) {
      fallingLeaves.items.push({ x: 0, y: -999, z: 0, phase: Math.random() * 6, speed: 0.4 + Math.random() * 0.5, spin: 1 + Math.random() * 1.5 });
      mesh.setColorAt(i, forestTmp.color.set(palette[i % palette.length]));
    }
    cityGroup.add(mesh);
    fallingLeaves.mesh = mesh;
  }
  const mesh = fallingLeaves.mesh;
  mesh.visible = inForest;
  if (!inForest) return;
  const o = forestTmp.object;
  fallingLeaves.items.forEach((item, index) => {
    item.y -= item.speed * delta;
    item.phase += item.spin * delta;
    const ground = reliefAt(item.x, item.z) + 0.1;
    if (item.y < ground || Math.hypot(item.x - cx, item.z - cz) > 28) {
      const angle = Math.random() * Math.PI * 2;
      const r = 3 + Math.random() * 20;
      item.x = cx + Math.cos(angle) * r;
      item.z = cz + Math.sin(angle) * r;
      item.y = reliefAt(item.x, item.z) + 3 + Math.random() * 9;
    }
    o.position.set(item.x + Math.sin(item.phase) * 0.8, item.y, item.z + Math.cos(item.phase * 0.7) * 0.6);
    o.rotation.set(Math.sin(item.phase) * 1.1, item.phase, Math.cos(item.phase * 1.3) * 0.9);
    o.scale.set(0.38, 1, 0.38);
    o.updateMatrix();
    mesh.setMatrixAt(index, o.matrix);
  });
  mesh.instanceMatrix.needsUpdate = true;
}

// Можно ли тут расти траве: не дорога, не дом, не город, не вода и не горы
function isOpenGround(x, z) {
  const key = Math.floor(x / 4) * 8192 + Math.floor(z / 4);
  const cache = localGrass.cache;
  if (cache.has(key)) return cache.get(key);
  if (cache.size > 40000) cache.clear();
  const cx = Math.floor(x / 4) * 4 + 2;
  const cz = Math.floor(z / 4) * 4 + 2;
  let open = true;
  if (!isInsideWorld(cx, cz) || mountainHeight(cx, cz) > 0.3) open = false;
  else if (Math.abs(cx) < CITY_HALF + 16 && Math.abs(cz) < CITY_HALF + 16) open = false;
  else if (Math.abs(cz - HIGHWAY_Z) < HIGHWAY_WIDTH / 2 + 5) open = false;
  else if (findLakeAt(cx, cz, -4)) open = false;
  else if (roads.some((road) => Math.abs(cx - road.x) < road.width / 2 + 4 && Math.abs(cz - road.z) < road.depth / 2 + 4)) open = false;
  else if (buildings.some((b) => Math.abs(cx - b.x) < b.width / 2 + 5 && Math.abs(cz - b.z) < b.depth / 2 + 5)) open = false;
  else if (mapAreas.some((a) => a.type !== "forest" && (a.r ? Math.hypot(cx - a.x, cz - a.z) < a.r + 4 : Math.abs(cx - a.x) < a.w / 2 + 4 && Math.abs(cz - a.z) < a.d / 2 + 4))) open = false;
  else if (forestFires.some((fire) => Math.hypot(cx - fire.x, cz - fire.z) < 7)) open = false;
  else if (distanceToLanes(cx, cz, "dirt") < 6.5 || distanceToLanes(cx, cz, "foot") < 3) open = false;
  cache.set(key, open);
  return open;
}

// Пучок из пяти травинок одной геометрией — дёшево для слабой видеокарты
function getTuftGeometry() {
  const positions = [];
  const normals = [];
  const blades = [[0, 0, 1, 0, 0], [0.16, 0.05, 0.8, 0.35, 1.2], [-0.14, 0.1, 0.85, -0.3, 2.6], [0.05, -0.16, 0.7, 0.3, 4], [-0.08, -0.1, 0.65, -0.35, 5.3]];
  blades.forEach(([ox, oz, height, tilt, yaw]) => {
    const blade = new THREE.ConeGeometry(0.075, 1, 3, 1, true);
    blade.translate(0, 0.5, 0);
    blade.scale(1, height, 1);
    blade.rotateZ(tilt);
    blade.rotateY(yaw);
    blade.translate(ox, 0, oz);
    const flat = blade.toNonIndexed();
    positions.push(...flat.attributes.position.array);
    normals.push(...flat.attributes.normal.array);
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  return geometry;
}

// Трава растёт островком вокруг камеры и переставляется, когда уходишь
function updateLocalGrass() {
  const lg = localGrass;
  const show = state.currentGame === "city" && camera.position.y - reliefAt(camera.position.x, camera.position.z) < 45;
  if (lg.mesh) lg.mesh.visible = show;
  if (!show) return;
  if (!lg.mesh) {
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, side: THREE.DoubleSide });
    lg.mesh = new THREE.InstancedMesh(getTuftGeometry(), material, lg.max);
    lg.mesh.frustumCulled = false;
    lg.mesh.setColorAt(0, forestTmp.color.set(0xffffff));
    lg.mesh.count = 0;
    cityGroup.add(lg.mesh);
  }
  const camX = camera.position.x;
  const camZ = camera.position.z;
  if (Math.hypot(camX - lg.x, camZ - lg.z) < 4) return;
  lg.x = camX;
  lg.z = camZ;
  const hash = (a, b, s) => {
    const v = Math.sin(a * 127.1 + b * 311.7 + s * 74.7) * 43758.5453;
    return v - Math.floor(v);
  };
  const greens = [0x5e9a3a, 0x6aa33e, 0x77a843, 0x4f8a34, 0x86ad48];
  const o = forestTmp.object;
  const cell = lg.cell;
  const reach = Math.ceil(lg.radius / cell);
  const ix0 = Math.round(camX / cell);
  const iz0 = Math.round(camZ / cell);
  const area = FOREST_AREA;
  let n = 0;
  for (let ix = ix0 - reach; ix <= ix0 + reach && n < lg.max; ix += 1) {
    for (let iz = iz0 - reach; iz <= iz0 + reach && n < lg.max; iz += 1) {
      const x = (ix + hash(ix, iz, 1)) * cell;
      const z = (iz + hash(ix, iz, 2)) * cell;
      const d = Math.hypot(x - camX, z - camZ);
      if (d > lg.radius) continue;
      const inForest = x > area.minX && x < area.maxX && z > area.minZ && z < area.maxZ;
      if (hash(ix, iz, 3) > (inForest ? 0.3 : 0.62)) continue;
      if (!isOpenGround(x, z)) continue;
      const fade = THREE.MathUtils.smoothstep(lg.radius - d, 0, 6);
      const size = (0.5 + hash(ix, iz, 4) * 0.45) * fade;
      o.position.set(x, reliefAt(x, z) + lakeCarve(x, z), z);
      o.rotation.set(0, hash(ix, iz, 5) * 6.28, 0);
      o.scale.set(size * 1.3, size * (0.75 + hash(ix, iz, 6) * 0.45), size * 1.3);
      o.updateMatrix();
      lg.mesh.setMatrixAt(n, o.matrix);
      lg.mesh.setColorAt(n, forestTmp.color.set(greens[Math.floor(hash(ix, iz, 7) * greens.length)]));
      n += 1;
    }
  }
  lg.mesh.count = n;
  lg.mesh.instanceMatrix.needsUpdate = true;
  if (lg.mesh.instanceColor) lg.mesh.instanceColor.needsUpdate = true;
}

// Что поднимает струя под машиной: вода — брызги, грунт — пыль, асфальт — серая пыль
function groundDustColor(x, z) {
  if (state.currentGame === "city" && findLakeAt(x, z, 0)) return null;
  if (Math.abs(x) < CITY_HALF + 6 && Math.abs(z) < CITY_HALF + 6) return [0.72, 0.71, 0.68];
  if (Math.abs(z - HIGHWAY_Z) < HIGHWAY_WIDTH / 2 + 2) return [0.72, 0.71, 0.68];
  if (roads.some((road) => Math.abs(x - road.x) < road.width / 2 + 1 && Math.abs(z - road.z) < road.depth / 2 + 1)) return [0.72, 0.71, 0.68];
  if (distanceToLanes(x, z, "dirt") < 6) return [0.66, 0.5, 0.34];
  if (x > FOREST_AREA.minX && x < FOREST_AREA.maxX && z > FOREST_AREA.minZ && z < FOREST_AREA.maxZ) return [0.58, 0.52, 0.38];
  return [0.74, 0.7, 0.54];
}

// Простой материал из кэша: одинаковые детали домов потом склеиваются в один меш
function houseMat(color, options = {}) {
  const key = `${color}|${JSON.stringify(options)}`;
  if (houseCache.has(key)) return houseCache.get(key);
  const material = new THREE.MeshStandardMaterial({ color, roughness: 0.8, ...options });
  houseCache.set(key, material);
  if (options.emissive && options.lamp) {
    delete material.lamp;
    lampLightMaterials.push(material);
  }
  return material;
}

function houseLampMat() {
  if (houseCache.has("lamp")) return houseCache.get("lamp");
  const material = new THREE.MeshStandardMaterial({ color: 0xfff3cf, emissive: 0xffd88a, emissiveIntensity: 0.55 });
  lampLightMaterials.push(material);
  houseCache.set("lamp", material);
  return material;
}

function houseBox(group, w, h, d, x, y, z, material, rx = 0, ry = 0, rz = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function houseCyl(group, r, h, x, y, z, material, rx = 0, rz = 0, segments = 8) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, segments), material);
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, 0, rz);
  mesh.castShadow = true;
  group.add(mesh);
  return mesh;
}

function houseLabel(text, background, color = "#ffffff") {
  const key = `label|${text}|${background}`;
  if (!houseCache.has(key)) houseCache.set(key, new THREE.MeshStandardMaterial({ color: 0xffffff, map: createLabelTexture(text, background, color), roughness: 0.5 }));
  return houseCache.get(key);
}

// Фасад жилого дома одной картинкой: окна с рамами, подоконники, шторы, жалюзи, цветы.
// style: обычный, "brick" — красный кирпич с белыми наличниками, "stalin"/"classic"/"mansion" — штукатурка с лепниной.
// Вторая картинка — какие окна горят ночью
function getFacadeMaterial(bodyColor, frameColor, style = null) {
  const key = `facade|${bodyColor}|${frameColor}|${style}`;
  if (houseCache.has(key)) return houseCache.get(key);
  const random = makeRandom(bodyColor % 100000 + 17);
  const curtains = ["#e8d9c0", "#c9b3d6", "#b8d4c4", "#e6c3b3", "#d9d9d9", "#f2e2a8", "#a9c1d9", "#e7b7c4"];
  const glow = ["#ffd28a", "#ffe6b0", "#ffc978", "#d6e6ff", "#fff1cc"];
  const layout = [];
  for (let f = 0; f < 2; f += 1) {
    for (let b = 0; b < 4; b += 1) {
      layout.push({
        f, b,
        style: Math.floor(random() * 5),
        curtain: curtains[Math.floor(random() * curtains.length)],
        open: 0.18 + random() * 0.22,
        lit: random() < 0.42,
        light: glow[Math.floor(random() * glow.length)],
        twoPane: random() < 0.6
      });
    }
  }
  const body = `#${new THREE.Color(bodyColor).getHexString()}`;
  const trim = `#${new THREE.Color(frameColor).getHexString()}`;
  const geometry = (w) => ({ x0: w.b * 128 + 25, y0: w.f * 256 + 40, w: 78, h: 140 });
  const map = makeCanvasTexture(512, (ctx, size) => {
    ctx.fillStyle = body;
    ctx.fillRect(0, 0, size, size);
    if (style === "brick") {
      for (let y = 0; y < size; y += 8) {
        for (let x = (y / 8) % 2 ? -8 : 0; x < size; x += 16) {
          ctx.fillStyle = `rgba(${random() < 0.5 ? "0,0,0" : "255,220,200"},${0.04 + random() * 0.08})`;
          ctx.fillRect(x + 1, y + 1, 14, 6);
        }
        ctx.fillStyle = "rgba(255,240,230,0.22)";
        ctx.fillRect(0, y, size, 1);
      }
    } else if (style) {
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      for (let y = 0; y < size; y += 32) ctx.fillRect(0, y, size, 2);
    }
    for (let i = 0; i < 5000; i += 1) {
      ctx.fillStyle = random() < 0.5 ? "rgba(0,0,0,0.035)" : "rgba(255,255,255,0.05)";
      ctx.fillRect(random() * size, random() * size, 1 + random() * 2, 1 + random() * 2);
    }
    for (let f = 0; f < 2; f += 1) {
      const top = f * 256;
      ctx.fillStyle = trim;
      ctx.globalAlpha = style ? 0.9 : 0.55;
      ctx.fillRect(0, top + 244, size, 12);
      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.fillRect(0, top + 243, size, 2);
      if (!style) {
        ctx.fillStyle = "rgba(0,0,0,0.05)";
        for (let b = 1; b < 4; b += 1) ctx.fillRect(b * 128 - 1, top, 2, 244);
      }
    }
    layout.forEach((win) => {
      const { x0, y0, w, h } = geometry(win);
      // наличники: у кирпичного дома белые с кокошником, у остальных — рамка с замковым камнем
      if (style) {
        ctx.fillStyle = trim;
        ctx.fillRect(x0 - 11, y0 - 12, w + 22, h + 22);
        if (style === "brick" || style === "mansion") {
          ctx.beginPath();
          ctx.moveTo(x0 - 11, y0 - 12);
          ctx.quadraticCurveTo(x0 + w / 2, y0 - 48, x0 + w + 11, y0 - 12);
          ctx.fill();
        } else {
          ctx.fillRect(x0 + w / 2 - 9, y0 - 22, 18, 14);
        }
      }
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.fillRect(x0 - 5, y0 - 5, w + 10, h + 10);
      ctx.fillStyle = "#f4f3ee";
      ctx.fillRect(x0, y0, w, h);
      const gx = x0 + 5;
      const gy = y0 + 5;
      const gw = w - 10;
      const gh = h - 10;
      const sky = ctx.createLinearGradient(0, gy, 0, gy + gh);
      sky.addColorStop(0, "#9cc0da");
      sky.addColorStop(0.55, "#4d6a80");
      sky.addColorStop(1, "#2c3d4b");
      ctx.fillStyle = sky;
      ctx.fillRect(gx, gy, gw, gh);
      if (win.style === 0 || win.style === 4) {
        const cw = gw * win.open;
        ctx.fillStyle = win.curtain;
        ctx.fillRect(gx, gy, cw, gh);
        ctx.fillRect(gx + gw - cw, gy, cw, gh);
        ctx.fillStyle = "rgba(0,0,0,0.12)";
        for (let k = 4; k < cw; k += 6) {
          ctx.fillRect(gx + k, gy, 1.5, gh);
          ctx.fillRect(gx + gw - k, gy, 1.5, gh);
        }
      } else if (win.style === 1) {
        ctx.fillStyle = "rgba(255,255,255,0.45)";
        ctx.fillRect(gx, gy, gw, gh);
      } else if (win.style === 2) {
        ctx.fillStyle = "#e9e6dc";
        const down = gh * (0.3 + win.open);
        ctx.fillRect(gx, gy, gw, down);
        ctx.fillStyle = "rgba(0,0,0,0.12)";
        for (let k = 3; k < down; k += 4) ctx.fillRect(gx, gy + k, gw, 1);
      }
      if (win.style === 4) {
        ctx.fillStyle = "#3f7a32";
        ctx.beginPath();
        ctx.arc(gx + gw / 2, gy + gh - 12, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#b5643a";
        ctx.fillRect(gx + gw / 2 - 7, gy + gh - 8, 14, 8);
      }
      ctx.fillStyle = "rgba(255,255,255,0.16)";
      ctx.beginPath();
      ctx.moveTo(gx, gy + gh * 0.55);
      ctx.lineTo(gx + gw * 0.55, gy);
      ctx.lineTo(gx + gw * 0.8, gy);
      ctx.lineTo(gx, gy + gh * 0.85);
      ctx.fill();
      ctx.fillStyle = "#f4f3ee";
      if (win.twoPane) ctx.fillRect(x0 + w / 2 - 2, y0, 4, h);
      ctx.fillRect(x0, y0 + h * 0.27, w, 4);
      ctx.fillStyle = "#e3e0d8";
      ctx.fillRect(x0 - 7, y0 + h, w + 14, 7);
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(x0 - 7, y0 + h + 7, w + 14, 4);
    });
  });
  const emissiveMap = makeCanvasTexture(512, (ctx, size) => {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, size, size);
    layout.forEach((win) => {
      if (!win.lit) return;
      const { x0, y0, w, h } = geometry(win);
      ctx.fillStyle = win.light;
      ctx.fillRect(x0 + 5, y0 + 5, w - 10, h - 10);
      if (win.style === 0 || win.style === 4) {
        ctx.fillStyle = "rgba(90,60,25,0.55)";
        const cw = (w - 10) * win.open;
        ctx.fillRect(x0 + 5, y0 + 5, cw, h - 10);
        ctx.fillRect(x0 + w - 5 - cw, y0 + 5, cw, h - 10);
      }
      ctx.fillStyle = "#000000";
      if (win.twoPane) ctx.fillRect(x0 + w / 2 - 2, y0, 4, h);
      ctx.fillRect(x0, y0 + h * 0.27, w, 4);
    });
  });
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff, map, emissive: 0xffffff, emissiveMap, emissiveIntensity: state.isNight ? 1 : 0, roughness: 0.8 });
  facadeMaterials.push(material);
  houseCache.set(key, material);
  return material;
}

// Верхние этажи жилого дома: четыре стены с окнами, этаж = 8 м, как и внизу
function addApartmentFacade(group, width, depth, bottom, upper, bodyColor, frameColor, style = null) {
  const material = getFacadeMaterial(bodyColor, frameColor, style);
  const rows = Math.max(1, Math.round(upper / 8));
  const face = (length, x, z, rotationY) => {
    const cols = Math.max(2, Math.round(length / 4.25));
    const geometry = new THREE.PlaneGeometry(length, upper);
    const uv = geometry.attributes.uv;
    for (let i = 0; i < uv.count; i += 1) uv.setXY(i, uv.getX(i) * cols / 4, uv.getY(i) * rows / 2);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, bottom + upper / 2, z);
    mesh.rotation.y = rotationY;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  };
  face(width, 0, depth / 2, 0);
  face(width, 0, -depth / 2, Math.PI);
  face(depth, width / 2, 0, Math.PI / 2);
  face(depth, -width / 2, 0, -Math.PI / 2);
  return rows;
}

// Полосатая ткань для маркиз над витринами
function getAwningMaterial(color) {
  const key = `awning|${color}`;
  if (houseCache.has(key)) return houseCache.get(key);
  const css = `#${new THREE.Color(color).getHexString()}`;
  const texture = makeCanvasTexture(64, (ctx, size) => {
    ctx.fillStyle = "#f7f3ea";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = css;
    for (let x = 0; x < size; x += 16) ctx.fillRect(x, 0, 8, size);
  });
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff, map: texture, roughness: 0.9 });
  houseCache.set(key, material);
  return material;
}

function getAcMaterial() {
  if (houseCache.has("ac")) return houseCache.get("ac");
  const texture = makeCanvasTexture(64, (ctx, size) => {
    ctx.fillStyle = "#eceeee";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#4a4f55";
    ctx.beginPath();
    ctx.arc(size * 0.62, size / 2, size * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#9aa0a6";
    ctx.lineWidth = 2;
    for (let i = 0; i < 6; i += 1) {
      ctx.beginPath();
      ctx.moveTo(size * 0.62, size / 2);
      ctx.lineTo(size * 0.62 + Math.cos(i) * size * 0.28, size / 2 + Math.sin(i) * size * 0.28);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    for (let y = 8; y < size - 6; y += 6) ctx.fillRect(5, y, size * 0.22, 2);
  });
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff, map: texture, roughness: 0.6 });
  houseCache.set("ac", material);
  return material;
}

// Местная → мировая точка для дома (дом смотрит на +z или на −z)
function houseWorld(b, lx, lz) {
  return b.facing === 1 ? [b.x + lx, b.z + lz] : [b.x - lx, b.z - lz];
}

// Всё, что делает многоэтажку жилой: балконы, подъезды, кондиционеры, водостоки, крыша
function decorateApartmentHouse(b, group, o, rows) {
  const { width, depth } = b;
  const halfW = width / 2;
  const halfD = depth / 2;
  const top = Math.max(o.height, b.enterTop);
  const upper = top - b.enterTop;
  const rowH = upper / rows;
  const random = makeRandom(Math.abs(Math.round(b.x * 31 + b.z * 17)) + 7);
  const frame = houseMat(o.roofColor, { roughness: 0.7 });
  const white = houseMat(0xf2f0ea);
  const metal = houseMat(0x50565e, { roughness: 0.45, metalness: 0.5 });
  const glass = houseMat(0xcfe8f5, { transparent: true, opacity: 0.35, roughness: 0.1, depthWrite: false });
  const levels = [];
  for (let k = 1; k < b.floors; k += 1) levels.push(k * FLOOR_HEIGHT);
  for (let r = 0; r < rows; r += 1) levels.push(b.enterTop + r * rowH);
  const balconyType = Math.floor(random() * 3);
  const pattern = Math.floor(random() * 3);
  const cols = Math.max(2, Math.round(width / 4.25));
  const bay = width / cols;
  const hasBalcony = (c) => (pattern === 0 ? c % 2 === 1 : pattern === 1 ? c % 4 === 1 || c % 4 === 2 : c === 0 || c === cols - 1 || c === Math.floor(cols / 2));
  const panel = houseMat(new THREE.Color(o.bodyColor).multiplyScalar(0.86).getHex());

  // балконы и лоджии спереди и сзади (у исторических домов — только во двор)
  (o.historic ? [-1] : [1, -1]).forEach((side) => {
    const faceZ = side * halfD;
    levels.forEach((y, levelIndex) => {
      for (let c = 0; c < cols; c += 1) {
        if (!hasBalcony(c)) continue;
        const x = -halfW + (c + 0.5) * bay;
        const w = bay * 0.86;
        const out = 2;
        const z = faceZ + side * out / 2;
        houseBox(group, w, 0.35, out, x, y + 0.18, z, white);
        if (balconyType === 0) {
          houseBox(group, w, 2.4, 0.14, x, y + 1.55, faceZ + side * (out - 0.07), panel);
          [-1, 1].forEach((s) => houseBox(group, 0.14, 2.4, out, x + s * (w / 2 - 0.07), y + 1.55, z, panel));
       } else if (balconyType === 1) {
          houseBox(group, w, 2.2, 0.14, x, y + 1.45, faceZ + side * (out - 0.07), panel);
          [-1, 1].forEach((s) => houseBox(group, 0.14, 2.2, out, x + s * (w / 2 - 0.07), y + 1.45, z, panel));
          // застеклённая лоджия
          const gh = Math.max(1, Math.min(rowH, 8) - 3.1);
          houseBox(group, w, gh, 0.08, x, y + 2.55 + gh / 2, faceZ + side * (out - 0.07), glass);
          houseBox(group, w, 0.3, out, x, y + Math.min(rowH, 8) - 0.25, z, white);
       } else {
          houseBox(group, w, 2.3, 0.08, x, y + 1.5, faceZ + side * (out - 0.07), glass);
          houseBox(group, w + 0.1, 0.16, 0.22, x, y + 2.7, faceZ + side * (out - 0.07), metal);
          [-1, 1].forEach((s) => houseBox(group, 0.08, 2.3, out, x + s * (w / 2 - 0.05), y + 1.5, z, glass));
        }
        // что-нибудь на балконе: цветы, сушилка или тарелка
        const extra = random();
        if (extra < 0.25) {
          houseBox(group, 0.8, 0.7, 0.8, x - w * 0.3, y + 0.7, faceZ + side * 1.1, houseMat(0xb5643a));
          const leaves = new THREE.Mesh(new THREE.SphereGeometry(0.7, 7, 6), houseMat(0x4b8a38));
          leaves.position.set(x - w * 0.3, y + 1.5, faceZ + side * 1.1);
          group.add(leaves);
        } else if (extra < 0.38 && levelIndex > 0) {
          const dish = new THREE.Mesh(new THREE.SphereGeometry(0.75, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2.4), white);
          dish.position.set(x + w * 0.32, y + 3.4, faceZ + side * (out + 0.1));
          dish.rotation.x = side * 1.2;
          group.add(dish);
        } else if (extra < 0.5) {
          [0xd94f4f, 0x4f7fd9, 0xf2f2f2].forEach((color, i) => houseBox(group, 0.7, 1.1, 0.05, x - 0.9 + i * 0.9, y + 2.2, faceZ + side * 1.0, houseMat(color)));
        }
      }
    });
  });

  // кондиционеры на стенах без балконов
  const ac = getAcMaterial();
  levels.forEach((y) => {
    [1, -1].forEach((s) => {
      const sideCols = Math.max(2, Math.round(depth / 4.25));
      const sideBay = depth / sideCols;
      for (let c = 0; c < sideCols; c += 1) {
        if (random() > 0.2) continue;
        houseBox(group, 0.9, 1.2, 1.7, s * (halfW + 0.45), y + 2.4, -halfD + (c + 0.5) * sideBay + 1.7, ac, 0, s > 0 ? 0 : Math.PI, 0);
      }
    });
    (o.historic ? [-1] : [1, -1]).forEach((side) => {
      for (let c = 0; c < cols; c += 1) {
        if (hasBalcony(c) || random() > 0.14) continue;
        houseBox(group, 1.7, 1.2, 0.9, -halfW + (c + 0.5) * bay + 1.75, y + 2.4, side * (halfD + 0.45), ac, 0, side > 0 ? -Math.PI / 2 : Math.PI / 2);
      }
    });
  });

  // водосточные трубы по углам
  [-1, 1].forEach((sx) => [-1, 1].forEach((sz) => {
    const px = sx * (halfW - 0.7);
    const pz = sz * (halfD + 0.24);
    houseCyl(group, 0.17, top, px, top / 2 + 0.3, pz, metal);
    houseBox(group, 0.6, 0.5, 0.6, px, top + 0.1, pz, metal);
  }));

  // крыша: лифтовая, вентиляция, антенны, тарелки, выход на крышу
  const roofY = top + 1.1;
  const machine = houseMat(new THREE.Color(o.bodyColor).multiplyScalar(0.78).getHex());
  const real = b.backDoorX !== undefined;
  const entrances = real ? [b.backDoorX] : width >= 30 ? [-width * 0.27, width * 0.27] : [0];
  entrances.forEach((door) => {
    const ex = Math.min(door, halfW - 3.6);
    houseBox(group, 6, 4.4, 5, ex, roofY + 2.2, -halfD * 0.25, machine);
    houseBox(group, 6.4, 0.3, 5.4, ex, roofY + 4.55, -halfD * 0.25, frame);
    houseBox(group, 1.6, 3, 0.15, ex + 1.5, roofY + 1.5, -halfD * 0.25 + 2.55, metal);
  });
  for (let i = 0; i < 4; i += 1) {
    const vx = (random() - 0.5) * (width - 6);
    const vz = halfD * 0.35 + random() * halfD * 0.4;
    houseBox(group, 1.4, 2.2, 1.4, vx, roofY + 1.1, vz, machine);
    houseBox(group, 1.8, 0.2, 1.8, vx, roofY + 2.3, vz, metal);
  }
  for (let i = 0; i < 3; i += 1) {
    const ax = (random() - 0.5) * (width - 4);
    const az = (random() - 0.5) * (depth - 4);
    houseCyl(group, 0.08, 5, ax, roofY + 2.5, az, metal);
    for (let k = 0; k < 3; k += 1) houseBox(group, 2.2 - k * 0.5, 0.06, 0.06, ax, roofY + 3.6 + k * 0.6, az, metal);
  }
  for (let i = 0; i < 2; i += 1) {
    const dish = new THREE.Mesh(new THREE.SphereGeometry(1.1, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2.4), white);
    dish.position.set((random() - 0.5) * (width - 6), roofY + 1.4, halfD - 2);
    dish.rotation.x = 1.1;
    group.add(dish);
  }

  // подъезды со двора: дверь с домофоном, козырёк, фонарь, табличка, ступени
  const door = houseMat([0x5a2e2a, 0x3b4a5a, 0x2f4a3a][Math.floor(random() * 3)], { roughness: 0.4, metalness: 0.4 });
  const flatsPerFloor = 4;
  const floorsUp = b.floors - 1 + rows;
  entrances.forEach((ex, index) => {
    const z = -halfD;
    if (real) {
      // настоящая дверь: рама вокруг проёма, створка распахнута наружу, в неё можно войти
      [-1, 1].forEach((s) => houseBox(group, 0.4, 6, 0.4, ex + s * 1.9, 3, z - 0.1, white));
      houseBox(group, 4.2, 0.6, 0.4, ex, 6.0, z - 0.1, white);
      houseBox(group, 0.2, 5.2, 2.8, ex - 1.6, 2.75, z - 1.55, door);
      houseBox(group, 0.7, 1.0, 0.16, ex - 2.6, 3.2, z - 0.1, houseMat(0x2a2d31, { roughness: 0.3 }));
      houseBox(group, 0.45, 0.25, 0.05, ex - 2.6, 3.45, z - 0.2, houseMat(0x7fd4ff, { emissive: 0x3a9fd8, emissiveIntensity: 0.8 }));
    } else {
      houseBox(group, 3.6, 6, 0.3, ex, 3, z - 0.1, white);
      houseBox(group, 2.8, 5.2, 0.32, ex, 2.75, z - 0.18, door);
      houseBox(group, 0.12, 0.9, 0.12, ex + 1.0, 2.9, z - 0.4, houseMat(0xd8b45a, { metalness: 0.7, roughness: 0.3 }));
      houseBox(group, 0.7, 1.0, 0.16, ex + 2.3, 3.2, z - 0.1, houseMat(0x2a2d31, { roughness: 0.3 }));
      houseBox(group, 0.45, 0.25, 0.05, ex + 2.3, 3.45, z - 0.2, houseMat(0x7fd4ff, { emissive: 0x3a9fd8, emissiveIntensity: 0.8 }));
    }
    const first = real ? 1 : index * floorsUp * flatsPerFloor + 1;
    const last = real ? b.apartments : (index + 1) * floorsUp * flatsPerFloor;
    const plate = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 0.8), houseLabel(`Подъезд ${index + 1} · кв. ${first}–${last}`, "#2d5a8c"));
    plate.position.set(ex, real ? 7.3 : 6.0, z - 0.27);
    plate.rotation.y = Math.PI;
    group.add(plate);
    houseBox(group, real ? 4.8 : 5.6, 0.4, 3.4, real ? ex - 0.4 : ex, 6.6, z - 1.7, white);
    [-1, 1].forEach((s) => houseCyl(group, 0.16, 6.4, (real ? ex - 0.4 : ex) + s * (real ? 2.1 : 2.5), 3.2, z - 3.2, metal));
    houseBox(group, 0.5, 0.2, 0.5, ex, 6.3, z - 1.4, houseLampMat());
    houseBox(group, 4.6, 0.3, 2.6, ex, 0.15, z - 1.3, houseMat(0xbdb8ae, { roughness: 0.95 }));
    houseBox(group, 4.6, 0.15, 0.9, ex, 0.08, z - 3.0, houseMat(0xbdb8ae, { roughness: 0.95 }));
    // лавочка и урна у подъезда, дорожка
    const [bx, bz] = houseWorld(b, ex + 4.6, z - 3.6);
    addBench(bx, bz, b.facing === 1 ? Math.PI : 0);
    const bin = houseWorld(b, ex - 3.4, z - 2.4);
    houseCylWorld(bin[0], bin[1], 0.45, 1.3, houseMat(0x3d5a3d));
    const [wx, wz] = houseWorld(b, ex, z - 3.4);
    const [, wz2] = houseWorld(b, ex, z - 9);
    addWalkway(wx, Math.min(wz, wz2), Math.max(wz, wz2), 3);
  });

  // окна подвала по низу стен и табличка с адресом
  for (let x = -halfW + 3; x < halfW - 2; x += 6) {
    if (entrances.some((ex) => Math.abs(ex - x) < 4)) continue;
    houseBox(group, 1.6, 0.45, 0.1, x, 0.3, -halfD - 0.12, houseMat(0x23282e, { roughness: 0.3 }));
  }
  houseState.street += 1;
  const address = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.1), houseLabel(`ул. Блоблокс, ${houseState.street}`, "#1f4f7a"));
  address.position.set(-halfW + 2.4, 6.4, halfD + 0.32);
  group.add(address);

  // маркизы над витринами магазинов
  if (b.type !== "residence") {
    const color = [0xc0392b, 0x2e7d4f, 0x2d5a8c, 0xb5643a, 0x6a4c86][Math.floor(random() * 5)];
    const doorHalf = BUILDING_DOOR_WIDTH / 2;
    const segment = halfW - doorHalf;
    const glassWidth = segment - 1.1;
    [-1, 1].forEach((s) => {
      const gx = s * (doorHalf + 0.5 + glassWidth / 2);
      houseBox(group, glassWidth + 0.6, 0.12, 2.3, gx, 5.85, halfD + 1.05, getAwningMaterial(color), 0.38);
      houseBox(group, glassWidth + 0.6, 0.55, 0.06, gx, 5.25, halfD + 2.12, getAwningMaterial(color));
    });
  }
}

function houseCylWorld(x, z, r, h, material) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.9, h, 10), material);
  mesh.position.set(x, h / 2, z);
  mesh.castShadow = true;
  cityGroup.add(mesh);
}

// Обшивка из досок: полоски по высоте мира, работают на любой стене без развёрток
function getSidingMaterial(color) {
  const key = `siding|${color}`;
  if (houseCache.has(key)) return houseCache.get(key);
  const material = new THREE.MeshStandardMaterial({ color, roughness: 0.83 });
  material.userData.ownShader = true;
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying float vBoardY;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvBoardY = (modelMatrix * vec4(transformed, 1.0)).y;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying float vBoardY;")
      .replace("#include <color_fragment>", `#include <color_fragment>
        float board = fract(vBoardY / 0.62);
        diffuseColor.rgb *= 0.87 + 0.13 * smoothstep(0.0, 0.14, board) - 0.06 * smoothstep(0.86, 1.0, board);`);
  };
  material.customProgramCacheKey = () => "siding-v1";
  houseCache.set(key, material);
  return material;
}

// Черепица: ряды идут вдоль ската крыши
function getShingleMaterial(color) {
  const key = `shingle|${color}`;
  if (houseCache.has(key)) return houseCache.get(key);
  const base = new THREE.Color(color);
  const random = makeRandom(color % 9973);
  const texture = makeCanvasTexture(256, (ctx, size) => {
    ctx.fillStyle = `#${base.getHexString()}`;
    ctx.fillRect(0, 0, size, size);
    for (let band = 0; band < 4; band += 1) {
      const x0 = band * 64;
      const shift = band % 2 ? 32 : 0;
      for (let y = -64; y < size; y += 64) {
        const tone = base.clone().multiplyScalar(0.85 + random() * 0.3);
        ctx.fillStyle = `#${tone.getHexString()}`;
        ctx.fillRect(x0 + 2, y + shift + 2, 60, 60);
      }
      ctx.fillStyle = "rgba(0,0,0,0.28)";
      ctx.fillRect(x0, 0, 4, size);
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.fillRect(x0 + 4, 0, 2, size);
    }
  });
  texture.repeat.set(1 / 3.4, 1 / 3.4);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff, map: texture, roughness: 0.7 });
  houseCache.set(key, material);
  return material;
}

function getCottageRoofMaterials(roofColor, bodyColor) {
  return [getSidingMaterial(bodyColor), getShingleMaterial(roofColor)];
}

// Загородный дом: наличники, ставни, цветы, крыльцо с фонарём, водосток, труба с дымком
function decorateCottage(b, group, o) {
  const { width, depth } = b;
  const halfW = width / 2;
  const halfD = depth / 2;
  const gh = b.groundHeight;
  const peak = Math.min(5, width * 0.32);
  const eave = halfW + 0.8;
  const roofDepth = depth + 1.4;
  const trim = houseMat(0xf7f5ef);
  const shutter = houseMat(o.roofColor, { roughness: 0.75 });
  const soil = houseMat(0x5b3d28, { roughness: 1 });
  const metal = houseMat(0x8a9097, { roughness: 0.4, metalness: 0.5 });
  const flowers = [0xff5a6e, 0xffd23f, 0xb784f0, 0xffffff, 0xff9a3c].map((c) => houseMat(c));
  const random = makeRandom(Math.abs(Math.round(b.x * 13 + b.z * 7)) + 3);
  const angle = Math.atan2(peak, eave);
  const slope = Math.hypot(eave, peak);
  [-1, 1].forEach((endZ) => {
    [-1, 1].forEach((s) => houseBox(group, slope + 0.3, 0.5, 0.18, s * eave / 2, gh + peak / 2 + 0.1, endZ * (roofDepth / 2 + 0.06), trim, 0, 0, -s * angle));
  });
  houseBox(group, 0.5, 0.35, roofDepth + 0.3, 0, gh + peak + 0.08, 0, houseMat(new THREE.Color(o.roofColor).multiplyScalar(0.7).getHex()));
  [-1, 1].forEach((s) => {
    houseBox(group, 0.18, 0.45, roofDepth, s * (eave + 0.05), gh - 0.1, 0, trim);
    houseCyl(group, 0.18, roofDepth, s * (eave + 0.2), gh - 0.3, 0, metal, Math.PI / 2);
    houseCyl(group, 0.12, gh - 0.2, s * (eave + 0.2), (gh - 0.2) / 2, halfD + 0.4, metal);
  });

  const flowerBox = (x, y, z, w, alongX) => {
    houseBox(group, alongX ? w : 0.5, 0.45, alongX ? 0.5 : w, x, y, z, houseMat(0x8a5a3a));
    for (let i = 0; i < 5; i += 1) {
      const t = (i + 0.5) / 5 - 0.5;
      const bloom = new THREE.Mesh(new THREE.SphereGeometry(0.2, 6, 5), flowers[Math.floor(random() * flowers.length)]);
      bloom.position.set(alongX ? x + t * w : x, y + 0.4, alongX ? z : z + t * w);
      group.add(bloom);
    }
  };
  // боковые окна
  [-1, 1].forEach((s) => {
    const x = s * (halfW + 0.1);
    houseBox(group, 0.16, 0.2, 3.4, x, 4.9, 0, trim);
    houseBox(group, 0.16, 0.2, 3.4, x, 2.3, 0, trim);
    [-1, 1].forEach((e) => houseBox(group, 0.16, 2.8, 0.2, x, 3.6, e * 1.6, trim));
    houseBox(group, 0.12, 2.4, 0.12, x, 3.6, 0, trim);
    houseBox(group, 0.12, 0.12, 3, x, 3.9, 0, trim);
    houseBox(group, 0.5, 0.14, 3.6, x + s * 0.2, 2.15, 0, trim);
    [-1, 1].forEach((e) => houseBox(group, 0.12, 2.8, 1.3, x + s * 0.02, 3.6, e * 2.35, shutter));
    flowerBox(x + s * 0.45, 1.85, 0, 3, false);
  });
  // окна на фасаде: переплёт, подоконник, ставни, цветы
  const doorHalf = BUILDING_DOOR_WIDTH / 2;
  const segment = halfW - doorHalf;
  const glassWidth = segment - 1.1;
  if (b.type === "residence") {
    [-1, 1].forEach((s) => {
      const gx = s * (doorHalf + 0.5 + glassWidth / 2);
      const z = halfD + 0.06;
      houseBox(group, 0.16, 4.4, 0.12, gx, 3.2, z, trim);
      houseBox(group, glassWidth, 0.16, 0.12, gx, 3.9, z, trim);
      houseBox(group, glassWidth + 0.6, 0.16, 0.45, gx, 0.95, halfD + 0.2, trim);
      flowerBox(gx, 0.62, halfD + 0.55, glassWidth, true);
      [-1, 1].forEach((e) => houseBox(group, 0.7, 4.5, 0.1, gx + e * (glassWidth / 2 + 0.38), 3.2, halfD + 0.1, shutter));
    });
  }
  // крыльцо: доски, столбики под козырьком, фонарь, номер дома, клумбы
  const wood = getWoodMaterial(0xd8b58a);
  houseBox(group, BUILDING_DOOR_WIDTH + 3, 0.16, 2.6, 0, 0.08, halfD + 1.3, wood);
  [-1, 1].forEach((s) => houseCyl(group, 0.17, BUILDING_DOOR_HEIGHT + 0.25, s * (doorHalf + 1.1), (BUILDING_DOOR_HEIGHT + 0.25) / 2, halfD + 1.85, trim));
  houseBox(group, 0.35, 0.6, 0.35, doorHalf + 0.6, 5.3, halfD + 0.25, houseLampMat());
  houseBox(group, 0.45, 0.12, 0.45, doorHalf + 0.6, 5.65, halfD + 0.25, metal);
  if (b.type === "residence") {
    const plate = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.8), houseLabel(o.name, "#2d5a8c"));
    plate.position.set(-(doorHalf + 1.3), 5.4, halfD + 0.07);
    group.add(plate);
  }
  [-1, 1].forEach((s) => {
    const x0 = s * (doorHalf + 1.7);
    const x1 = s * (halfW - 0.3);
    const w = Math.abs(x1 - x0);
    if (w < 1) return;
    houseBox(group, w, 0.3, 1.2, (x0 + x1) / 2, 0.15, halfD + 0.9, soil);
    for (let i = 0; i < Math.round(w * 1.6); i += 1) {
      const bloom = new THREE.Mesh(new THREE.SphereGeometry(0.22, 6, 5), flowers[Math.floor(random() * flowers.length)]);
      bloom.position.set(Math.min(x0, x1) + random() * w, 0.55, halfD + 0.5 + random() * 0.8);
      group.add(bloom);
      if (i % 2 === 0) houseBox(group, 0.06, 0.4, 0.06, bloom.position.x, 0.4, bloom.position.z, houseMat(0x4b8a38));
    }
  });
  // труба с колпаком, из неё идёт дымок
  const cx = halfW * 0.45;
  const cz = -halfD * 0.3;
  houseBox(group, 1.5, 0.25, 1.5, cx, gh + 4.2, cz, houseMat(0x5a3d30));
  const [wx, wz] = houseWorld(b, cx, cz);
  houseChimneys.push({ x: wx, y: gh + 4.5, z: wz, next: random() });
}

// Двор загородного дома: почтовый ящик, поленница, бельевая верёвка, лавочка, фонарь у калитки
function addCottageYard(x, zc, facing) {
  const front = zc + facing * 7;
  const gate = front + facing * 7;
  const group = new THREE.Group();
  cityGroup.add(group);
  const wood = getWoodMaterial(0xc89b6a);
  const log = getWoodMaterial(0x9a6a44, true);
  const post = houseMat(0x4a525c, { roughness: 0.4, metalness: 0.5 });
  houseCyl(group, 0.1, 2.4, x + 3.9, 1.2, gate - facing * 0.6, post);
  houseBox(group, 1.0, 0.8, 1.4, x + 3.9, 2.6, gate - facing * 0.6, houseMat(0x2d5a8c, { roughness: 0.5 }));
  houseCyl(group, 0.1, 5.5, x - 3.7, 2.75, gate - facing * 0.5, post);
  houseBox(group, 0.6, 0.8, 0.6, x - 3.7, 5.7, gate - facing * 0.5, houseLampMat());
  for (let row = 0; row < 4; row += 1) {
    for (let i = 0; i < 6 - row; i += 1) {
      houseCyl(group, 0.3, 2.4, x - 9.5, 0.32 + row * 0.55, zc - facing * 1 + (i - (5 - row) / 2) * 0.62, log, 0, Math.PI / 2, 7);
    }
  }
  houseBox(group, 2.8, 0.12, 4.4, x - 9.5, 2.6, zc - facing * 1, wood);
  const lineZ = zc - facing * 8.6;
  [x + 1.5, x + 9.5].forEach((px) => houseCyl(group, 0.1, 4, px, 2, lineZ, post));
  houseBox(group, 8, 0.05, 0.05, x + 5.5, 3.9, lineZ, houseMat(0xeeeeee));
  [[0xd94f4f, 3], [0x4f7fd9, 4.6], [0xffffff, 6.2], [0xf2c94c, 7.6]].forEach(([color, dx]) => {
    houseBox(group, 1.2, 1.5, 0.05, x + dx, 3.15, lineZ, houseMat(color));
  });
  addBench(x - 6.5, front + facing * 4.2, facing === 1 ? 0 : Math.PI);
}

// Дымок из печных труб, только рядом с камерой
function updateHouseChimneys(delta) {
  if (state.currentGame !== "city" || !houseChimneys.length) return;
  houseState.chimneyTimer -= delta;
  if (houseState.chimneyTimer > 0) return;
  houseState.chimneyTimer = 0.12;
  houseChimneys.forEach((c) => {
    if (Math.hypot(c.x - camera.position.x, c.z - camera.position.z) > 220) return;
    c.next -= 0.12;
    if (c.next > 0) return;
    c.next = 0.45 + Math.random() * 0.4;
    spawnSmoke(c.x + (Math.random() - 0.5) * 0.4, c.y, c.z + (Math.random() - 0.5) * 0.4, 0.5 + Math.random() * 0.3, 1.1 + Math.random() * 0.5, 0.2,
      0.7, 1.3, 4 + Math.random() * 2, 0.22, 1, 0.3, 0.2, -1e4, [0.84, 0.84, 0.86]);
  });
}

// Всё, что добавляется к дому после постройки коробки
function decorateBuilding(b, group, o, rows) {
  const before = group.children.length;
  if (b.style === "cottage") decorateCottage(b, group, o);
  else if (b.style === "city" && rows > 0) decorateApartmentHouse(b, group, o, rows);
  if (o.historic) decorateHistoric(b, group, o);
  // мелкие украшения тень не отбрасывают — так быстрее, а на вид почти не меняется
  group.children.slice(before).forEach((child) => { if (child.isMesh) child.castShadow = false; });
}

// ---------- Сити: пентхаусы на крышах башен, лифт из лобби ----------
function getMarbleMaterial() {
  if (houseCache.has("marble")) return houseCache.get("marble");
  const texture = makeCanvasTexture(256, (ctx, size) => {
    ctx.fillStyle = "#f3f1ec";
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 14; i += 1) {
      ctx.strokeStyle = `rgba(150,140,130,${0.15 + Math.random() * 0.25})`;
      ctx.lineWidth = 0.6 + Math.random() * 1.6;
      ctx.beginPath();
      let x = Math.random() * size;
      let y = 0;
      ctx.moveTo(x, y);
      while (y < size) {
        x += (Math.random() - 0.5) * 30;
        y += 10 + Math.random() * 20;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(0,0,0,0.06)";
    ctx.strokeRect(0, 0, size, size);
  });
  texture.repeat.set(1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff, map: texture, roughness: 0.25, metalness: 0.05 });
  houseCache.set("marble", material);
  return material;
}

function getArtMaterial(seed) {
  const key = `art|${seed}`;
  if (houseCache.has(key)) return houseCache.get(key);
  const random = makeRandom(seed);
  const texture = makeCanvasTexture(128, (ctx, size) => {
    ctx.fillStyle = ["#f4efe6", "#1d2633", "#e9d8c4"][seed % 3];
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 7; i += 1) {
      ctx.fillStyle = ["#d94f4f", "#f2c94c", "#2d5a8c", "#4b8a38", "#b784f0", "#ffffff"][Math.floor(random() * 6)];
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      if (random() < 0.5) ctx.arc(random() * size, random() * size, 10 + random() * 30, 0, Math.PI * 2);
      else ctx.rect(random() * size, random() * size, 20 + random() * 50, 10 + random() * 40);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  });
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff, map: texture, roughness: 0.6 });
  houseCache.set(key, material);
  return material;
}

function addSkyPenthouse(cx, cz, variant, height, name, index) {
  const inside = variant === "spire";
  const spec = variant === "twist" ? { x: cx, z: cz, y: height + 0.05 }
    : variant === "twin" ? { x: cx - 7 * TOWER_SCALE, z: cz, y: height + 1 }
    : variant === "stepped" ? { x: cx, z: cz, y: height + 0.3 }
    : { x: cx, z: cz, y: height - 18 };
  const w = inside ? 23 : 18;
  const d = inside ? 20 : 16;
  const floor = spec.y + (inside ? 0.6 : 1.0);
  const group = new THREE.Group();
  group.position.set(spec.x, floor, spec.z);
  cityGroup.add(group);
  const marble = getMarbleMaterial();
  const gold = houseMat(0xd8b45a, { metalness: 0.8, roughness: 0.25 });
  const black = houseMat(0x1d2126, { roughness: 0.35, metalness: 0.3 });
  const white = houseMat(0xf7f5f0, { roughness: 0.5 });
  const glass = houseMat(0xbfe6ff, { transparent: true, opacity: 0.16, roughness: 0.05, depthWrite: false });
  const wood = getWoodMaterial(0x6a4a34);
  const box = (bw, bh, bd, x, y, z, material, ry = 0) => houseBox(group, bw, bh, bd, x, y, z, material, 0, ry, 0);

  // пол, стеклянные стены во всю высоту, крыша с подсветкой
  scaleBoxUv(box(w + (inside ? 0 : 1), inside ? 0.6 : 1.0, d + (inside ? 0 : 1), 0, inside ? -0.3 : -0.5, 0, marble).geometry, w / 5, d / 5);
  const wallH = inside ? 9.2 : 8.4;
  [[w, 0.1, 0, d / 2], [w, 0.1, 0, -d / 2], [0.1, d, w / 2, 0], [0.1, d, -w / 2, 0]].forEach(([gw, gd, gx, gz]) => {
    box(gw, wallH, gd, gx, wallH / 2, gz, glass).castShadow = false;
    const along = gw > gd;
    const length = along ? gw : gd;
    for (let t = -length / 2; t <= length / 2 + 0.01; t += length / Math.round(length / 3.2)) {
      box(0.18, wallH, 0.18, along ? t : gx, wallH / 2, along ? gz : t, black);
    }
  });
  if (!inside) {
    box(w + 2.4, 0.6, d + 2.4, 0, wallH + 0.3, 0, white);
    box(w + 2.5, 0.12, 0.12, 0, wallH - 0.05, d / 2 + 1.2, houseMat(0xffffff, { emissive: 0x9bf6ff, emissiveIntensity: 0.9 }));
    box(w + 2.5, 0.12, 0.12, 0, wallH - 0.05, -d / 2 - 1.2, houseMat(0xffffff, { emissive: 0x9bf6ff, emissiveIntensity: 0.9 }));
  }
  [-w / 4, w / 4].forEach((lx) => box(4, 0.08, 0.8, lx, wallH - 0.1, 0, houseLampMat()));

  // лифт и картины на стене шахты
  const liftX = -w / 2 + 2.2;
  const liftZ = -d / 2 + 1.6;
  box(3.8, wallH, 3, liftX, wallH / 2, liftZ, houseMat(0x2c2f35, { roughness: 0.4 }));
  box(3.0, 6.2, 0.1, liftX, 3.1, liftZ + 1.52, houseMat(0xb8c0c8, { metalness: 0.8, roughness: 0.2 }));
  box(0.06, 6.2, 0.12, liftX, 3.1, liftZ + 1.56, black);
  box(3.4, 0.2, 0.14, liftX, 6.3, liftZ + 1.55, gold);
  [-1, 1].forEach((s) => box(0.2, 6.4, 0.14, liftX + s * 1.6, 3.2, liftZ + 1.55, gold));
  box(0.3, 0.5, 0.08, liftX + 2.1, 3.2, liftZ + 1.55, houseMat(0xffffff, { emissive: 0xffd88a, emissiveIntensity: 0.8 }));
  const art = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 2.4), getArtMaterial(index * 7 + 3));
  art.position.set(liftX + 1.92, 4.4, liftZ - 0.2);
  art.rotation.y = Math.PI / 2;
  group.add(art);

  // гостиная: телевизор на стене, диван, кресла, столик, ковёр
  const lx = -w / 2;
  box(0.15, 3.0, 5.4, lx + 0.4, 3.6, d / 4, houseMat(0x0b0f14, { emissive: 0x1a2b44, emissiveIntensity: 0.5, roughness: 0.2 }));
  box(1.0, 0.9, 6.2, lx + 0.7, 0.45, d / 4, wood);
  box(6.6, 0.05, 6, lx + 4.4, 0.03, d / 4, houseMat(0xcfc3b0, { roughness: 1 }));
  box(2.4, 0.5, 3.2, lx + 3.6, 0.7, d / 4, marble);
  [-1, 1].forEach((s) => box(0.3, 0.45, 0.3, lx + 3.6 + s * 0.9, 0.22, d / 4 + s * 1.2, gold));
  const sofa = houseMat(0xf1ece2, { roughness: 0.9 });
  box(2.2, 1.0, 6, lx + 6.4, 0.5, d / 4, sofa);
  box(0.7, 1.7, 6, lx + 7.3, 1.2, d / 4, sofa);
  [-1, 1].forEach((s) => box(2.2, 1.4, 0.6, lx + 6.4, 0.7, d / 4 + s * 3.2, sofa));
  [0xd94f4f, 0x2d5a8c, 0xd8b45a].forEach((color, i) => box(0.3, 0.9, 0.9, lx + 6.9, 1.4, d / 4 - 1.6 + i * 1.6, houseMat(color, { roughness: 0.9 })));

  // кухня с островом и барными стульями
  const kx = w / 4 + 0.6;
  box(w / 2 - 1.6, 1.7, 1.5, kx, 0.85, -d / 2 + 0.9, white);
  box(w / 2 - 1.5, 0.12, 1.6, kx, 1.76, -d / 2 + 0.9, marble);
  box(w / 2 - 1.6, 1.6, 0.9, kx, 5.0, -d / 2 + 0.6, white);
  box(1.2, 0.1, 0.9, kx - 1, 1.83, -d / 2 + 0.9, black);
  box(5, 1.7, 2.2, kx, 0.85, -d / 2 + 5.4, black);
  box(5.4, 0.14, 2.6, kx, 1.77, -d / 2 + 5.4, marble);
  for (let i = -1; i <= 1; i += 1) {
    houseCyl(group, 0.45, 0.16, kx + i * 1.6, 2.1, -d / 2 + 7.3, black);
    houseCyl(group, 0.08, 2.0, kx + i * 1.6, 1.0, -d / 2 + 7.3, gold);
  }
  [0x7a2a3a, 0x2f6a3a, 0xd8b45a, 0x3a5a8a].forEach((color, i) => houseCyl(group, 0.14, 0.8, kx - 2 + i * 0.6, 2.25, -d / 2 + 0.7, houseMat(color, { roughness: 0.2 })));

  // спальня: большая кровать, тумбочки с лампами
  const bx = w / 2 - 3.1;
  const bz = d / 2 - 3.1;
  box(5, 1.0, 4.4, bx, 0.5, bz, houseMat(0x3a3f47, { roughness: 0.8 }));
  box(4.6, 0.4, 4.2, bx - 0.1, 1.2, bz, white);
  box(2.6, 0.12, 4.3, bx - 1.0, 1.45, bz, houseMat(0x2d5a8c, { roughness: 0.9 }));
  [-1, 1].forEach((s) => box(0.9, 0.5, 1.6, bx + 1.8, 1.6, bz + s * 1.05, white));
  box(0.4, 3.2, 4.8, w / 2 - 0.35, 1.6, bz, houseMat(0x6a4a34, { roughness: 0.6 }));
  [-1, 1].forEach((s) => {
    box(1.2, 1.1, 1.2, w / 2 - 1.0, 0.55, bz + s * 3.0, wood);
    box(0.6, 0.8, 0.6, w / 2 - 1.0, 1.5, bz + s * 3.0, houseMat(0xfff3cf, { emissive: 0xffd88a, emissiveIntensity: 0.7 }));
  });

  // бассейн прямо в квартире (если хватает места) или рояль
  if (w >= 17) {
    const px = 0.6;
    const pz = d / 2 - 2.3;
    box(5.6, 1.1, 3.4, px, 0.55, pz, marble);
    box(5.0, 0.06, 2.8, px, 1.12, pz, houseMat(0x35c6e8, { emissive: 0x1b8fb5, emissiveIntensity: 0.45, roughness: 0.05, metalness: 0.2 }));
    box(1.2, 0.5, 3.0, px - 4, 0.25, pz, white);
  } else {
    box(3.2, 1.0, 2.2, 0.4, 2.0, d / 2 - 2.2, black);
    [-1, 1].forEach((s) => houseCyl(group, 0.12, 1.5, 0.4 + s * 1.3, 0.75, d / 2 - 2.6, black));
    box(3.0, 0.1, 0.6, 0.4, 2.55, d / 2 - 1.4, white);
  }
  // растения по углам
  [[-w / 2 + 1, d / 2 - 1], [w / 2 - 1, -d / 2 + 2.5], [-w / 2 + 4.6, -d / 2 + 1.2]].forEach(([px, pz]) => {
    houseCyl(group, 0.6, 1.2, px, 0.6, pz, black);
    const leaves = new THREE.Mesh(new THREE.SphereGeometry(1.1, 8, 6), houseMat(0x3f7a32));
    leaves.position.set(px, 2.2, pz);
    leaves.scale.set(1, 1.4, 1);
    group.add(leaves);
  });

  // стены не дают выпасть, пол держит игрока
  walkDecks.push({ x: spec.x, z: spec.z, cos: 1, sin: 0, hw: w / 2, hl: d / 2, top: floor });
  const thick = 0.6;
  [[-w / 2 - thick, -w / 2, -d / 2, d / 2], [w / 2, w / 2 + thick, -d / 2, d / 2], [-w / 2, w / 2, -d / 2 - thick, -d / 2], [-w / 2, w / 2, d / 2, d / 2 + thick]].forEach(([x0, x1, z0, z1]) => {
    addCollider({ minX: spec.x + x0, maxX: spec.x + x1, minZ: spec.z + z0, maxZ: spec.z + z1, minY: floor - 2, maxY: floor + wallH });
  });

  // лифт в лобби башни: у задней стены, напротив входа
  const lobbyX = cx - 14;
  const lobbyZ = cz - 16.6;
  const lobby = new THREE.Group();
  lobby.position.set(lobbyX, 0, lobbyZ);
  cityGroup.add(lobby);
  houseBox(lobby, 4.6, 9.4, 0.5, 0, 4.7, 0, houseMat(0x2c2f35, { roughness: 0.4 }));
  houseBox(lobby, 3.0, 6.2, 0.1, 0, 3.2, 0.3, houseMat(0xb8c0c8, { metalness: 0.8, roughness: 0.2 }));
  houseBox(lobby, 0.06, 6.2, 0.12, 0, 3.2, 0.34, black);
  houseBox(lobby, 3.4, 0.2, 0.14, 0, 6.4, 0.32, gold);
  [-1, 1].forEach((s) => houseBox(lobby, 0.2, 6.5, 0.14, s * 1.6, 3.2, 0.32, gold));
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 0.9), houseLabel("Лифт · Пентхаус", "#1d2633", "#f2d27a"));
  sign.position.set(0, 7.6, 0.27);
  lobby.add(sign);
  houseBox(lobby, 0.3, 0.5, 0.08, 2.0, 3.3, 0.3, houseMat(0xffffff, { emissive: 0xffd88a, emissiveIntensity: 0.8 }));

  const lobbySpot = { x: lobbyX, y: BUILDING_FLOOR_TOP, z: lobbyZ + 3.2, angle: 0 };
  const topSpot = { x: spec.x + liftX, y: floor, z: spec.z + liftZ + 3.4, angle: 0 };
  registerTowerLift(cx, cz, variant, height, name, lobbySpot, topSpot);
}

// Ближайшая кнопка лифта: на этаже, где стоит игрок
function findNearestSkyLift() {
  if (state.currentVehicle || state.currentGame !== "city") return null;
  const px = player.position.x;
  const pz = player.position.z;
  for (const lb of liftBuildings) {
    if (Math.hypot(px - lb.x, pz - lb.z) > lb.reach) continue;
    for (let i = 0; i < lb.stops.length; i += 1) {
      const stop = lb.stops[i];
      if (stop.virtual && virtualFloor.key !== `${lb.id}:${i}`) continue;
      if (Math.abs(player.position.y - stop.y) < 3 && Math.hypot(px - stop.x, pz - stop.z) < 3.4) return { lb, index: i };
    }
  }
  return null;
}

function useSkyLift(hit) {
  const panel = document.getElementById("liftPanel");
  if (panel && !panel.classList.contains("hidden")) {
    closeLiftPanel();
    return;
  }
  openLiftPanel(hit);
}

// Помощник для планировки этажа: детали в местных координатах дома, стены сразу становятся препятствиями
function planApi(group, frame, yOff, wallH, colliders) {
  const cos = Math.cos(frame.rot);
  const sin = Math.sin(frame.rot);
  const toWorld = (lx, lz) => [frame.ox + lx * cos + lz * sin, frame.oz - lx * sin + lz * cos];
  return {
    toWorld,
    box(w, h, d, x, y, z, material, ry = 0) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
      mesh.position.set(x, y + yOff, z);
      mesh.rotation.y = ry;
      mesh.receiveShadow = false;
      mesh.castShadow = false;
      group.add(mesh);
      return mesh;
    },
    plate(number, w, h, x, y, z, ry) {
      // номер квартиры: кусочек общей картинки с номерами, все таблички рисуются одним махом
      const geometry = new THREE.PlaneGeometry(w, h);
      const uv = geometry.attributes.uv;
      const cell = number % 256;
      const u0 = (cell % 16) / 16;
      const v0 = 1 - (Math.floor(cell / 16) + 1) / 16;
      for (let i = 0; i < uv.count; i += 1) uv.setXY(i, u0 + uv.getX(i) / 16, v0 + uv.getY(i) / 16);
      const mesh = new THREE.Mesh(geometry, getNumberPlateMaterial());
      mesh.position.set(x, y + yOff, z);
      mesh.rotation.y = ry;
      group.add(mesh);
    },
    label(text, w, h, x, y, z, ry, background = "#2d5a8c") {
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), houseLabel(text, background));
      mesh.position.set(x, y + yOff, z);
      mesh.rotation.y = ry;
      group.add(mesh);
    },
    collide(x0, x1, z0, z1) {
      const a = toWorld(x0, z0);
      const b = toWorld(x1, z1);
      const box = { minX: Math.min(a[0], b[0]), maxX: Math.max(a[0], b[0]), minZ: Math.min(a[1], b[1]), maxZ: Math.max(a[1], b[1]), minY: frame.baseY - 0.3, maxY: frame.baseY + wallH };
      addCollider(box);
      if (colliders) colliders.push(box);
    }
  };
}

function getMailboxMaterial() {
  if (houseCache.has("mailbox")) return houseCache.get("mailbox");
  const texture = makeCanvasTexture(128, (ctx, size) => {
    ctx.fillStyle = "#6f7a86";
    ctx.fillRect(0, 0, size, size);
    for (let r = 0; r < 4; r += 1) {
      for (let c = 0; c < 6; c += 1) {
        const x = 3 + c * 20.8;
        const y = 4 + r * 30;
        ctx.fillStyle = "#9aa6b2";
        ctx.fillRect(x, y, 18, 26);
        ctx.fillStyle = "#2a2f35";
        ctx.fillRect(x + 3, y + 5, 12, 3);
        ctx.fillStyle = "#e9e6dc";
        ctx.fillRect(x + 4, y + 16, 10, 5);
      }
    }
  });
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff, map: texture, roughness: 0.5, metalness: 0.3 });
  houseCache.set("mailbox", material);
  return material;
}

// Маленькая квартира-студия: шкаф у входа, кровать у окна, кухня, холодильник, ковёр, цветок
function furnishFlat(api, x0, x1, zc, ze, s, random, aw) {
  const dep = Math.abs(ze - zc);
  const at = (v) => zc + s * v;
  const pick = (list) => list[Math.floor(random() * list.length)];
  const accent = houseMat(pick([0x2d5a8c, 0xc0392b, 0x2e7d4f, 0x8e44ad, 0xd35400, 0x16a085]), { roughness: 0.9 });
  const furniture = getWoodMaterial(pick([0xd8b58a, 0xb08a64, 0x8a6a4a]));
  const white = houseMat(0xf2f0ea);
  const dark = houseMat(0x2a2d31, { roughness: 0.4 });
  const mid = (x0 + x1) / 2;
  api.box(aw - 0.4, 0.04, dep - 0.2, mid, 0.02, at(dep / 2), houseMat(pick([0xc9a77c, 0xb89a74, 0xd9c3a0, 0xa58a6a]), { roughness: 0.85 }));
  api.box(1.8, 5.6, 1.3, x0 + 1.05, 2.8, at(0.8), furniture);
  const bedLen = Math.min(5, dep - 1.8);
  api.box(4.2, 1.0, bedLen, x0 + 2.5, 0.5, at(dep - 0.35 - bedLen / 2), furniture);
  api.box(3.9, 0.45, bedLen - 0.3, x0 + 2.5, 1.2, at(dep - 0.5 - bedLen / 2), white);
  api.box(3.95, 0.14, bedLen * 0.6, x0 + 2.5, 1.48, at(dep - 0.35 - bedLen * 0.7), accent);
  api.box(3.2, 0.45, 0.9, x0 + 2.5, 1.62, at(dep - 1.0), white);
  api.box(4.4, 2.4, 0.3, x0 + 2.5, 1.2, at(dep - 0.2), furniture);
  const kLen = Math.min(4.6, dep - 2.6);
  if (kLen > 1.5) {
    api.box(1.6, 1.7, kLen, x1 - 0.95, 0.85, at(0.4 + kLen / 2), white);
    api.box(1.7, 0.1, kLen + 0.1, x1 - 0.95, 1.75, at(0.4 + kLen / 2), houseMat(0x3a3f47));
    api.box(1.0, 0.06, 1.0, x1 - 0.95, 1.83, at(0.4 + kLen * 0.7), dark);
    api.box(1.2, 1.4, kLen, x1 - 0.8, 5.2, at(0.4 + kLen / 2), accent);
    if (dep >= 8) api.box(1.7, 5, 1.7, x1 - 0.95, 2.5, at(0.4 + kLen + 1.0), white);
  }
  if (aw >= 9 && dep >= 8) {
    const tx = x1 - 3.4;
    const tv = dep - 2.4;
    api.box(2.4, 0.15, 2.4, tx, 2.0, at(tv), furniture);
    api.box(0.3, 1.95, 0.3, tx, 1.0, at(tv), dark);
    [-1, 1].forEach((k) => {
      api.box(1.0, 0.2, 1.0, tx, 1.2, at(tv + k * 1.7), furniture);
      api.box(1.0, 1.4, 0.15, tx, 1.9, at(tv + k * 2.15), furniture);
    });
  }
  api.box(3.0, 0.03, 2.4, mid + 0.6, 0.06, at(dep * 0.45), accent);
  api.box(0.8, 0.9, 0.8, x1 - 0.9, 0.45, at(dep - 0.9), houseMat(0xb5643a));
  api.box(1.1, 1.5, 1.1, x1 - 0.9, 1.65, at(dep - 0.9), houseMat(0x3f7a32), Math.PI / 4);
}

// Холл подъезда на первом этаже: диван, консьерж, коляска, цветы
function furnishLobby(api, halfW, xa1, cw, halfD) {
  const wood = getWoodMaterial(0x8a6a4a);
  const sofa = houseMat(0x5a7a9a, { roughness: 0.9 });
  api.box(6, 1.1, 2.2, -halfW + 4.5, 0.55, halfD - 2.2, sofa);
  api.box(6, 1.6, 0.6, -halfW + 4.5, 1.3, halfD - 1.1, sofa);
  api.box(2.6, 0.6, 1.6, -halfW + 4.5, 0.4, halfD - 4.6, wood);
  api.box(6.5, 0.03, 4.5, -halfW + 4.5, 0.04, halfD - 3.4, houseMat(0x8a3b3b, { roughness: 1 }));
  api.box(4.5, 2.2, 1.6, xa1 - 3, 1.1, cw / 2 + 2.4, wood);
  api.label("Консьерж", 2.6, 0.7, xa1 - 3, 2.9, cw / 2 + 3.25, 0, "#3a3f47");
  api.box(1.4, 1.2, 2.2, -halfW + 1.4, 1.0, cw / 2 + 2.2, houseMat(0x2d5a8c, { roughness: 0.8 }));
  [[-halfW + 1, halfD - 1], [xa1 - 1, halfD - 1]].forEach(([px, pz]) => {
    api.box(0.9, 1.0, 0.9, px, 0.5, pz, houseMat(0xb5643a));
    api.box(1.3, 1.8, 1.3, px, 1.9, pz, houseMat(0x3f7a32), Math.PI / 4);
  });
}

// Этаж жилого дома: подъездный холл с лифтом и лестницей, коридор и двери в квартиры с номерами
function buildFloorPlan(api, p) {
  const halfW = p.W / 2;
  const halfD = p.D / 2;
  const cw = p.cw || 4;
  const H = p.fh - 0.35;
  const xa1 = halfW - p.coreLen;
  const random = makeRandom(p.seed);
  const wallMat = houseMat(p.wallColor || 0xf1ece4, { roughness: 0.95 });
  const doorMat = houseMat(0x7a4a2e, { roughness: 0.6 });
  const doorW = 3.2;
  const doorH = Math.min(6.2, H - 0.6);
  const T = 0.3;
  const gaps = (a0, a1, doors) => {
    const out = [];
    let s = a0;
    doors.map((c) => [c - doorW / 2, c + doorW / 2]).sort((u, v) => u[0] - v[0]).forEach(([c0, c1]) => {
      if (c0 > s + 0.05) out.push([s, c0]);
      s = Math.max(s, c1);
    });
    if (a1 > s + 0.05) out.push([s, a1]);
    return out;
  };
  const wallX = (x, z0, z1, doors = []) => {
    gaps(z0, z1, doors).forEach(([a, b]) => {
      api.box(T, H, b - a, x, H / 2, (a + b) / 2, wallMat);
      api.collide(x - T / 2, x + T / 2, a, b);
    });
    doors.forEach((c) => api.box(T, H - doorH, doorW, x, doorH + (H - doorH) / 2, c, wallMat));
  };
  const wallZ = (z, x0, x1, doors = []) => {
    gaps(x0, x1, doors).forEach(([a, b]) => {
      api.box(b - a, H, T, (a + b) / 2, H / 2, z, wallMat);
      api.collide(a, b, z - T / 2, z + T / 2);
    });
    doors.forEach((c) => api.box(doorW, H - doorH, T, c, doorH + (H - doorH) / 2, z, wallMat));
  };

  if (p.slabs) {
    api.box(p.W + 1, 0.3, p.D + 1, 0, -0.15, 0, houseMat(0xd8cfc0, { roughness: 0.9 }));
    api.box(p.W + 1, 0.3, p.D + 1, 0, p.fh - 0.15, 0, houseMat(0xf7f4ee, { roughness: 0.98 }));
  }
  if (p.exterior) {
    const ow = p.outerW || p.W + 1;
    const od = p.outerD || p.D + 1;
    const wt = 0.5;
    const mats = {
      body: houseMat(p.outerColor || 0xe8e2d6, { roughness: 0.9 }),
      glass: houseMat(0xcfe8f5, { transparent: true, opacity: 0.25, roughness: 0.1, depthWrite: false }),
      frame: houseMat(0x6a6f76, { roughness: 0.6 })
    };
    const addBox = (w, h, d, x, y, z, m) => api.box(w, h, d, x, y, z, m);
    addWindowWall(addBox, mats, true, ow, 0, od / 2 - wt / 2, 0, wt);
    addWindowWall(addBox, mats, true, ow, 0, -od / 2 + wt / 2, 0, wt);
    addWindowWall(addBox, mats, false, od - wt * 2, ow / 2 - wt / 2, 0, 0, wt);
    addWindowWall(addBox, mats, false, od - wt * 2, -ow / 2 + wt / 2, 0, 0, wt);
    if (p.fh > 8.05) {
      const extra = p.fh - 8;
      api.box(ow, extra, wt, 0, 8 + extra / 2, od / 2 - wt / 2, mats.body);
      api.box(ow, extra, wt, 0, 8 + extra / 2, -od / 2 + wt / 2, mats.body);
      api.box(wt, extra, od, ow / 2 - wt / 2, 8 + extra / 2, 0, mats.body);
      api.box(wt, extra, od, -ow / 2 + wt / 2, 8 + extra / 2, 0, mats.body);
    }
    api.collide(-ow / 2, ow / 2, od / 2 - wt, od / 2);
    api.collide(-ow / 2, ow / 2, -od / 2, -od / 2 + wt);
    api.collide(ow / 2 - wt, ow / 2, -od / 2, od / 2);
    api.collide(-ow / 2, -ow / 2 + wt, -od / 2, od / 2);
  }

  // квартиры по обе стороны коридора
  const aptLen = xa1 + halfW;
  const n = Math.max(1, Math.floor(aptLen / 7.5));
  const aw = aptLen / n;
  const sides = p.ground === "shop" ? [] : p.ground === "lobby" ? [-1] : [1, -1];
  let number = p.aptBase;
  [1, -1].forEach((s) => {
    if (!sides.includes(s)) return;
    const zc = s * cw / 2;
    const ze = s * halfD;
    const doors = [];
    for (let i = 0; i < n; i += 1) doors.push(-halfW + (i + 0.5) * aw);
    wallZ(zc, -halfW, xa1, doors);
    for (let i = 1; i < n; i += 1) wallX(-halfW + i * aw, Math.min(zc, ze), Math.max(zc, ze));
    wallX(xa1, Math.min(zc, ze), Math.max(zc, ze));
    doors.forEach((dc, i) => {
      const x0 = -halfW + i * aw;
      api.box(0.14, doorH - 0.2, doorW - 0.3, dc - doorW / 2 + 0.12, (doorH - 0.2) / 2, zc + s * (doorW / 2), doorMat);
      api.plate(number, 1.0, 0.7, dc + doorW / 2 + 0.75, Math.min(5.4, H - 1), zc - s * (T / 2 + 0.03), s > 0 ? Math.PI : 0);
      api.box(0.25, 0.35, 0.08, dc + doorW / 2 + 0.75, 3.6, zc - s * (T / 2 + 0.05), houseMat(0xd8b45a, { metalness: 0.7, roughness: 0.3 }));
      api.box(2.6, 0.04, 1.1, dc, 0.03, zc - s * 0.75, houseMat(0x5a4a3a, { roughness: 1 }));
      furnishFlat(api, x0, x0 + aw, zc + s * T / 2, ze, s, random, aw);
      number += 1;
    });
  });
  if (p.ground === "shop") wallX(xa1, -halfD, halfD);
  if (p.ground === "lobby") furnishLobby(api, halfW, xa1, cw, halfD);
  // свет в коридоре
  for (let x = -halfW + 3; x < xa1; x += 6) api.box(1.6, 0.06, 1.0, x, H - 0.05, 0, houseLampMat());

  // лифт
  const steel = houseMat(0xb8c0c8, { metalness: 0.7, roughness: 0.25 });
  const frameMat = houseMat(0x5a6068, { metalness: 0.5, roughness: 0.4 });
  const display = houseMat(0x2a2d31, { emissive: 0xff8a3a, emissiveIntensity: 0.7 });
  let spot;
  if (p.liftWall === "side") {
    const zL = -halfD + 4.5;
    const x = xa1 + T / 2;
    api.box(0.2, Math.min(6.9, H - 0.2), 3.8, x + 0.1, Math.min(6.9, H - 0.2) / 2, zL, frameMat);
    api.box(0.12, 6.2, 3.0, x + 0.22, 3.1, zL, steel);
    api.box(0.13, 6.2, 0.05, x + 0.24, 3.1, zL, frameMat);
    api.box(0.1, 0.6, 0.35, x + 0.26, 3.4, zL + 2.3, display);
    api.label(p.floorLabel, 1.4, 0.6, x + 0.27, Math.min(7.2, H - 0.4), zL, Math.PI / 2, "#1d2633");
    spot = [xa1 + 2.6, zL];
  } else {
    const x = halfW - 0.4;
    api.box(0.8, H, 4.8, x, H / 2, 0, houseMat(0x3a3f47, { roughness: 0.4 }));
    api.box(0.12, 6.2, 3.0, x - 0.46, 3.1, 0, steel);
    api.box(0.13, 6.2, 0.05, x - 0.48, 3.1, 0, frameMat);
    api.box(0.1, 0.6, 0.35, x - 0.48, 3.4, 2.1, display);
    api.label(p.floorLabel, 1.4, 0.6, x - 0.47, Math.min(7.2, H - 0.4), 0, -Math.PI / 2, "#1d2633");
    api.collide(x - 0.4, x + 0.4, -2.4, 2.4);
    spot = [halfW - 3.0, 0];
    // дверь на лестницу рядом
    api.box(0.12, 6.0, 2.6, halfW - 0.1, 3.0, halfD - 2.4, doorMat);
    api.label("Лестница", 2.0, 0.6, halfW - 0.18, 6.5, halfD - 2.4, -Math.PI / 2, "#2e7d4f");
  }
  if (p.stairs === "closed") {
    wallX(p.stairX0 - 0.15, -6.3, 6.3);
    wallZ(6.3, p.stairX0, halfW);
    wallZ(-6.3, p.stairX0, halfW);
    api.box(0.12, 6.0, 2.6, p.stairX0 - 0.32, 3.0, 2.0, doorMat);
    api.label("Лестница", 2.0, 0.6, p.stairX0 - 0.33, 6.5, 2.0, -Math.PI / 2, "#2e7d4f");
  }
  if (p.ground) {
    api.box(4.4, 2.6, 0.12, xa1 + 3.4, 3.4, -halfD + 0.1, getMailboxMaterial());
    api.label("Почтовые ящики", 3.4, 0.6, xa1 + 3.4, 5.1, -halfD + 0.18, 0, "#3a3f47");
  }
  return { spot, count: number - p.aptBase };
}

// Внутренности жилого дома: настоящие этажи внизу и этажи наверху, куда возит лифт
function buildHouseInterior(b, group, o, rows) {
  const innerHalfW = b.width / 2 - BUILDING_WALL;
  const innerHalfD = b.depth / 2 - BUILDING_WALL;
  const xa1 = b.stairs.sx0 - 6.7;
  const frame = { ox: b.x, oz: b.z, rot: b.facing === 1 ? 0 : Math.PI, baseY: 0 };
  const base = {
    W: innerHalfW * 2, D: innerHalfD * 2, coreLen: innerHalfW - xa1, cw: 4, fh: FLOOR_HEIGHT,
    liftWall: "side", stairX0: b.stairs.sx0, wallColor: 0xf1ece4
  };
  const lb = { id: liftBuildings.length, name: o.name, x: b.x, z: b.z, reach: Math.hypot(b.width, b.depth) / 2 + 4, stops: [] };
  // квартиры, стены и мебель — отдельной группой: её видно только вблизи дома
  const interior = new THREE.Group();
  interior.userData.dynamic = true;
  group.add(interior);
  let aptBase = 1;
  for (let k = 0; k < b.floors; k += 1) {
    const baseY = k * FLOOR_HEIGHT + BUILDING_FLOOR_TOP;
    const plan = { ...base, ground: k === 0 ? (b.type === "residence" ? "lobby" : "shop") : null, stairs: "hole", aptBase, seed: Math.round(b.x * 7 + b.z * 3 + k * 101) >>> 0, floorLabel: `Этаж ${k + 1}` };
    const result = buildFloorPlan(planApi(interior, { ...frame, baseY }, baseY, FLOOR_HEIGHT - 0.4, null), plan);
    aptBase += result.count;
    const [wx, wz] = planApi(group, frame, 0, 0, null).toWorld(result.spot[0], result.spot[1]);
    lb.stops.push({ label: String(k + 1), y: baseY, x: wx, z: wz });
  }
  const perFloor = 2 * Math.max(1, Math.floor((xa1 + innerHalfW) / 7.5));
  const rowH = rows > 0 ? (Math.max(o.height, b.enterTop) - b.enterTop) / rows : 8;
  const spotLocal = [xa1 + 2.6, -innerHalfD + 4.5];
  for (let r = 0; r < rows; r += 1) {
    const baseY = b.enterTop + r * rowH + 0.15;
    const floorNo = b.floors + r + 1;
    const plan = {
      ...base, fh: rowH, ground: null, stairs: "closed", slabs: true, exterior: true, outerW: b.width, outerD: b.depth,
      outerColor: o.bodyColor, aptBase, seed: Math.round(b.x * 7 + b.z * 3 + floorNo * 101) >>> 0, floorLabel: `Этаж ${floorNo}`
    };
    aptBase += perFloor;
    const [wx, wz] = planApi(group, frame, 0, 0, null).toWorld(spotLocal[0], spotLocal[1]);
    lb.stops.push({ label: String(floorNo), y: baseY, x: wx, z: wz, virtual: { plan, frame: { ...frame, baseY }, hw: innerHalfW + 0.5, hl: innerHalfD + 0.5 } });
  }
  mergeStaticMeshes(interior, Infinity, true);
  houseInteriors.push({ group: interior, x: b.x, z: b.z });
  b.apartments = aptBase - 1;
  lb.apartments = b.apartments;
  liftBuildings.push(lb);
}

// Этажи башни Сити: какой формы этаж на какой высоте
function towerFloorSpecs(variant, cx, cz, height) {
  const S = TOWER_SCALE;
  const base = 10.8;
  const floors = [];
  if (variant === "twist") {
    const slabH = (height - base) / 32;
    for (let k = 0; k < 16; k += 1) floors.push({ y: base + 2 * k * slabH + 0.13, W: 21, D: 19, ox: cx, oz: cz, rot: 0, fh: 2 * slabH });
  } else if (variant === "twin") {
    for (let y = base + 0.15; y + 9 <= height; y += 8) floors.push({ y, W: 22, D: 16, ox: cx - 7 * S, oz: cz, rot: Math.PI / 2, fh: 8 });
  } else if (variant === "stepped") {
    const tiers = [[28 * S, 22 * S, 0.45], [23 * S, 18 * S, 0.72], [17 * S, 13 * S, 0.92]].map(([w, d, f]) => ({ w, d, top: base + (height - base) * f }));
    for (let y = base + 0.15; y + 8 <= tiers[2].top; y += 8) {
      // этаж на стыке двух ярусов берёт размер верхнего, меньшего — так он целиком внутри стекла
      const fit = tiers.find((t) => y + 8 <= t.top + 0.01) || tiers[2];
      floors.push({ y, W: fit.w - 2, D: fit.d - 2, ox: cx, oz: cz, rot: 0, fh: 8 });
    }
  } else {
    for (let y = base + 0.15; y + 8 <= height - 18; y += 8) floors.push({ y, W: 24 * S - 2, D: 20 * S - 2, ox: cx, oz: cz, rot: 0, fh: 8 });
  }
  return floors;
}

// Лифт башни: лобби, все этажи с квартирами и пентхаус наверху
function registerTowerLift(cx, cz, variant, height, name, lobbySpot, topSpot) {
  const lb = { id: liftBuildings.length, name, x: cx, z: cz, reach: 40, stops: [{ label: "1", y: lobbySpot.y, x: lobbySpot.x, z: lobbySpot.z }] };
  let aptBase = 1;
  towerFloorSpecs(variant, cx, cz, height).forEach((spec, index) => {
    const floorNo = index + 2;
    const frame = { ox: spec.ox, oz: spec.oz, rot: spec.rot, baseY: spec.y };
    const plan = {
      W: spec.W, D: spec.D, coreLen: 6, cw: 4, fh: spec.fh, liftWall: "end", stairs: "none", slabs: true, exterior: true,
      outerColor: 0xe9edf2, wallColor: 0xf4f1ea, aptBase, seed: Math.round(cx * 13 + floorNo * 71) >>> 0, floorLabel: `Этаж ${floorNo}`
    };
    aptBase += 2 * Math.max(1, Math.floor((spec.W - 6) / 7.5));
    const [wx, wz] = planApi(cityGroup, frame, 0, 0, null).toWorld(spec.W / 2 - 3.0, 0);
    const swap = Math.abs(Math.sin(spec.rot)) > 0.5;
    lb.stops.push({ label: String(floorNo), y: spec.y, x: wx, z: wz, virtual: { plan, frame, hw: (swap ? spec.D : spec.W) / 2 + 0.5, hl: (swap ? spec.W : spec.D) / 2 + 0.5 } });
  });
  lb.stops.push({ label: "ПХ", y: topSpot.y, x: topSpot.x, z: topSpot.z });
  lb.apartments = aptBase - 1;
  liftBuildings.push(lb);
}

// Верхний этаж строится, когда на него приезжает лифт (одновременно жив только один такой этаж)
function activateVirtualFloor(lb, index) {
  const key = `${lb.id}:${index}`;
  if (virtualFloor.key === key) return;
  deactivateVirtualFloor();
  const stop = lb.stops[index];
  const { plan, frame, hw, hl } = stop.virtual;
  const group = new THREE.Group();
  group.position.set(frame.ox, frame.baseY, frame.oz);
  group.rotation.y = frame.rot;
  group.userData.dynamic = true;
  const colliders = [];
  buildFloorPlan(planApi(group, frame, 0, plan.fh - 0.2, colliders), plan);
  mergeStaticMeshes(group, Infinity, true);
  cityGroup.add(group);
  Object.assign(virtualFloor, { key, group, colliders, y: frame.baseY, height: plan.fh, building: lb });
  Object.assign(virtualFloor.deck, { x: frame.ox, z: frame.oz, cos: 1, sin: 0, hw, hl, top: frame.baseY });
}

function deactivateVirtualFloor() {
  if (virtualFloor.group) {
    cityGroup.remove(virtualFloor.group);
    virtualFloor.group.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
    });
  }
  virtualFloor.colliders.forEach((box) => {
    box.minY = 1e7;
    box.maxY = 1e7;
  });
  Object.assign(virtualFloor, { key: "", group: null, colliders: [], building: null });
  virtualFloor.deck.hw = -1;
  virtualFloor.deck.hl = -1;
}

function openLiftPanel(hit) {
  let panel = document.getElementById("liftPanel");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "liftPanel";
    panel.className = "lift-panel hidden";
    document.body.appendChild(panel);
  }
  const ru = currentLanguage === "ru";
  const { lb, index } = hit;
  panel.innerHTML = `<div class="lift-panel__head"><span>🛗 ${lb.name}</span><small>${ru ? "квартир" : "flats"}: ${lb.apartments || 0}</small><button type="button" class="lift-panel__close">×</button></div>
    <div class="lift-panel__grid">${lb.stops.map((stop, i) => `<button type="button" data-stop="${i}" class="${i === index ? "is-here" : ""}">${stop.label}</button>`).join("")}</div>
    <div class="lift-panel__hint">${ru ? "Выбери этаж · F — закрыть" : "Pick a floor · F — close"}</div>`;
  panel.querySelector(".lift-panel__close").addEventListener("click", closeLiftPanel);
  panel.querySelectorAll("[data-stop]").forEach((button) => {
    button.addEventListener("click", () => rideLift(lb, Number(button.dataset.stop)));
  });
  panel.classList.remove("hidden");
}

function closeLiftPanel() {
  const panel = document.getElementById("liftPanel");
  if (panel) panel.classList.add("hidden");
}

function rideLift(lb, index) {
  const stop = lb.stops[index];
  if (stop.virtual) activateVirtualFloor(lb, index);
  else deactivateVirtualFloor();
  player.position.set(stop.x, stop.y + 0.05, stop.z);
  if (player.velocity) player.velocity.set(0, 0, 0);
  closeLiftPanel();
  const ru = currentLanguage === "ru";
  showToast(stop.label === "ПХ" ? (ru ? `🛗 Пентхаус «${lb.name}» — добро пожаловать домой!` : "🛗 Penthouse — welcome home!") : (ru ? `🛗 Этаж ${stop.label}` : `🛗 Floor ${stop.label}`));
}

// Панель лифта закрывается сама, если отойти от дверей
function updateLiftPanel() {
  const panel = document.getElementById("liftPanel");
  if (panel && !panel.classList.contains("hidden") && !findNearestSkyLift()) closeLiftPanel();
}

// Четырёхскатная крыша или шатёр: усечённая пирамида по размеру дома
function addHipRoof(group, w, d, h, k, y, x, z, material) {
  const geometry = new THREE.CylinderGeometry(k / Math.SQRT2, 1 / Math.SQRT2, 1, 4, 1);
  geometry.rotateY(Math.PI / 4);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.set(w, h, d);
  mesh.position.set(x, y + h / 2, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function addGable(group, w, h, thickness, x, y, z, material) {
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2, 0);
  shape.lineTo(w / 2, 0);
  shape.lineTo(0, h);
  shape.lineTo(-w / 2, 0);
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false });
  geometry.translate(0, 0, -thickness / 2);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  group.add(mesh);
  return mesh;
}

// Исторический дом на проспекте: карниз, пилястры, наличники и своя крыша —
// сталинка со шпилем, кирпичный терем с шатрами, особняк с куполом или розовый классицизм
function decorateHistoric(b, group, o) {
  const style = o.historic;
  const { width, depth } = b;
  const halfW = width / 2;
  const halfD = depth / 2;
  const top = Math.max(o.height, b.enterTop);
  const trim = houseMat(o.roofColor, { roughness: 0.7 });
  const bodyMat = houseMat(o.bodyColor, { roughness: 0.85 });
  const roofMetal = houseMat(style === "mansion" ? 0x2f7a55 : style === "brick" ? 0x59636e : 0x6b7680, { roughness: 0.45, metalness: 0.35, flatShading: true });
  const gold = houseMat(0xd8b45a, { metalness: 0.8, roughness: 0.25 });
  const cols = Math.max(2, Math.round(width / 4.25));
  const bay = width / cols;
  houseBox(group, width + 1.8, 0.8, depth + 1.8, 0, top - 0.3, 0, trim);
  for (let x = -halfW; x <= halfW + 0.01; x += 1.3) houseBox(group, 0.45, 0.4, 0.45, x, top - 0.95, halfD + 0.75, trim);
  for (let c = 0; c <= cols; c += 1) houseBox(group, 0.7, top - 8.6, 0.3, -halfW + c * bay, 8.2 + (top - 8.6) / 2, halfD + 0.2, trim);
  for (let y = 8; y + 7 <= top; y += 8) {
    for (let c = 0; c < cols; c += 1) {
      const x = -halfW + (c + 0.5) * bay;
      houseBox(group, bay * 0.72, 0.2, 0.5, x, y + 2.2, halfD + 0.3, trim);
      if (style === "classic" && (y / 8) % 2 === 1) {
        [-1, 1].forEach((s) => houseBox(group, bay * 0.44, 0.25, 0.35, x + s * bay * 0.19, y + 7.15, halfD + 0.25, trim, 0, 0, -s * 0.32));
      } else {
        houseBox(group, bay * 0.8, 0.35, 0.4, x, y + 6.95, halfD + 0.25, trim);
      }
    }
  }
  const roofY = top + 1.1;
  if (style === "brick") {
    addHipRoof(group, width + 1.2, depth + 1.2, 6, 0.4, roofY - 0.6, 0, 0, roofMetal);
    [[-halfW + 3.2, halfD - 3.2, 5, 7, 9], [halfW - 3.2, halfD - 3.2, 5, 7, 9], [0, halfD - 4, 7, 9, 13]].forEach(([tx, tz, size, h, tent]) => {
      houseBox(group, size, h, size, tx, roofY + h / 2, tz, bodyMat);
      houseBox(group, size + 0.6, 0.5, size + 0.6, tx, roofY + h, tz, trim);
      addHipRoof(group, size + 0.6, size + 0.6, tent, 0.04, roofY + h + 0.2, tx, tz, roofMetal);
      houseCyl(group, 0.14, 4, tx, roofY + h + tent + 2, tz, gold);
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.45, 10, 8), gold);
      ball.position.set(tx, roofY + h + tent + 0.4, tz);
      group.add(ball);
    });
  } else if (style === "stalin") {
    [1, -1].forEach((s) => {
      for (let x = -halfW; x <= halfW + 0.01; x += 1.4) houseBox(group, 0.35, 1.3, 0.35, x, roofY + 0.65, s * (halfD + 0.6), trim);
      houseBox(group, width + 1.6, 0.3, 0.5, 0, roofY + 1.4, s * (halfD + 0.6), trim);
    });
    houseBox(group, 12, 8, 10, 0, roofY + 4, 0, bodyMat);
    houseBox(group, 12.8, 0.6, 10.8, 0, roofY + 8.2, 0, trim);
    houseBox(group, 8, 6, 7, 0, roofY + 11.4, 0, bodyMat);
    houseBox(group, 8.8, 0.6, 7.8, 0, roofY + 14.6, 0, trim);
    const spire = new THREE.Mesh(new THREE.ConeGeometry(1.4, 16, 8), trim);
    spire.position.set(0, roofY + 22.9, 0);
    spire.castShadow = true;
    group.add(spire);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.7, 12, 8), gold);
    ball.position.set(0, roofY + 31, 0);
    group.add(ball);
  } else if (style === "mansion") {
    addHipRoof(group, width + 1.4, depth + 1.4, 7, 0.3, roofY - 0.6, 0, 0, roofMetal);
    houseCyl(group, 3.2, 3, 0, roofY + 7.9, 0, trim, 0, 0, 16);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(3.6, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), roofMetal);
    dome.position.set(0, roofY + 9.4, 0);
    dome.castShadow = true;
    group.add(dome);
    houseCyl(group, 0.16, 4, 0, roofY + 14.6, 0, gold);
    // портик с колоннами над входом
    [-6.6, -3.6, 3.6, 6.6].forEach((x) => houseCyl(group, 0.55, 8.1, x, 4.05, halfD + 3.2, trim, 0, 0, 12));
    houseBox(group, 15.4, 0.6, 4.2, 0, 8.4, halfD + 1.9, trim);
    addGable(group, 15.4, 2.6, 0.6, 0, 8.7, halfD + 3.7, trim);
  } else {
    addGable(group, Math.min(20, width * 0.5), 4.6, 0.8, 0, top + 0.2, halfD + 0.3, trim);
    addGable(group, Math.min(18, width * 0.45), 3.6, 0.6, 0, top + 0.6, halfD + 0.75, bodyMat);
    [1, -1].forEach((s) => {
      for (let x = -halfW; x <= halfW + 0.01; x += 1.4) {
        if (s === 1 && Math.abs(x) < Math.min(10, width * 0.25)) continue;
        houseBox(group, 0.35, 1.3, 0.35, x, roofY + 0.65, s * (halfD + 0.6), trim);
      }
    });
  }
}

// Квартал на проспекте: вдоль дороги исторический дом, за ним двор, а в глубине — высотка
function buildAvenueBlock(x, zc, index) {
  const north = zc > AVENUE_Z;
  const styles = ["stalin", "brick", "mansion", "classic"];
  const style = styles[index % styles.length];
  const palettes = { stalin: [0xf1d79a, 0xf7f3ea], brick: [0xb5523b, 0xf2efe6], mansion: [0xdfeedd, 0xf7f3ea], classic: [0xf3c9c4, 0xfaf7f2] };
  const [bodyColor, trim] = palettes[style];
  const shops = [
    ["Гастроном №1", "market"], ["Кофейня «Бульвар»", "cafe"], ["Книжный дом", "bookstore"], ["Цветы", "flower"],
    ["Булочная", "cafe"], ["Дом игрушки", "toy"], ["Оптика", "clinic"], ["Пластинки", "entertainment"], ["Модный дом", "fashion"]
  ];
  const [shopName, shopType] = shops[index % shops.length];
  const frontZ = north ? 68 : 12;
  addBuilding({
    x, z: frontZ, width: 44, depth: 20, floors: 3, height: 24 + 8 * (2 + (index % 3)),
    bodyColor, roofColor: trim, windowColor: 0xfff7e8, signColor: "#3a2a1e",
    name: shopName, type: shopType, facing: north ? -1 : 1, historic: style
  });
  const towers = [[0xe9d3b5, 0x9a6b4a], [0xd98c5f, 0xf2efe6], [0xdfe6ee, 0x56708a], [0xf0e0c0, 0x8a6a4a]];
  const [towerBody, towerTrim] = towers[index % towers.length];
  const names = ["ЖК «Небо»", "ЖК «Сокол»", "ЖК «Центральный»", "ЖК «Арбат»", "ЖК «Парк»", "ЖК «Тверской»", "ЖК «Бульвар»", "ЖК «Столица»", "ЖК «Высота»"];
  addBuilding({
    x, z: north ? 93 : -13, width: 44, depth: 20, floors: 3, height: 24 + 8 * (8 + (index % 3)),
    bodyColor: towerBody, roofColor: towerTrim, windowColor: 0xfff7e8, signColor: "#2d5a8c",
    name: names[index % names.length], type: "residence", facing: north ? 1 : -1
  });
  // широкий тротуар до самых домов
  addSidewalkRect(x - 23, x + 23, north ? 57 : 22, north ? 58 : 23);
  addCourtyard(x, north ? 80.5 : -0.5, index);
}

// Двор между домами: детская площадка, лавочки, деревья, мусорные баки
function addCourtyard(x, zMid, index) {
  const group = new THREE.Group();
  group.position.set(x, 0, zMid);
  cityGroup.add(group);
  const red = houseMat(0xd94f4f);
  const blue = houseMat(0x2d7fd9);
  const yellow = houseMat(0xf2c94c);
  const metal = houseMat(0x5a6068, { roughness: 0.4, metalness: 0.5 });
  const px = -8;
  houseBox(group, 9, 0.06, 4.6, px, 0.03, 0, houseMat(0xc9a77c, { roughness: 1 }));
  houseBox(group, 3.4, 0.5, 3.4, px - 2.4, 0.25, 0, getWoodMaterial(0xc89b6a));
  houseBox(group, 3, 0.1, 3, px - 2.4, 0.5, 0, houseMat(0xf2dc9a, { roughness: 1 }));
  [-1, 1].forEach((s) => houseCyl(group, 0.1, 3.4, px + 2.6, 1.7, s * 1.4, metal));
  houseBox(group, 0.15, 0.15, 3, px + 2.6, 3.4, 0, metal);
  houseBox(group, 1.0, 0.12, 0.6, px + 2.6, 1.0, 0, red);
  houseBox(group, 1.6, 2.4, 1.6, px + 0.4, 1.2, -1.5, yellow);
  houseBox(group, 1.0, 0.15, 3.0, px + 0.4, 1.3, 0.3, blue, 0.7);
  addTree(x + 3, zMid + 0.8, 0.8, false);
  addTree(x + 14, zMid - 1, 0.9, false);
  [0x2f6a3a, 0x2f6a3a, 0x3d5a8c].forEach((color, i) => houseBox(group, 1.8, 1.8, 1.4, 8 + i * 2.1, 0.9, 0.6, houseMat(color, { roughness: 0.6 })));
  addBench(x - 2, zMid + (index % 2 ? 1.2 : -1.2), index % 2 ? Math.PI : 0);
}

// Фонарь как на московских проспектах: высокая опора с одним плечом над дорогой
function addAvenueLamp(x, z, dirZ) {
  const group = new THREE.Group();
  group.position.set(x, 0.2, z);
  cityGroup.add(group);
  const pole = houseMat(0x8e959c, { roughness: 0.4, metalness: 0.6 });
  houseCyl(group, 0.6, 1.8, 0, 0.9, 0, pole, 0, 0, 10);
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.4, 20, 10), pole);
  shaft.position.y = 11.8;
  shaft.castShadow = true;
  group.add(shaft);
  [2.2, 6].forEach((y) => houseCyl(group, 0.5, 0.25, 0, y, 0, pole, 0, 0, 10));
  houseBox(group, 0.25, 0.25, 4.6, 0, 21.6, dirZ * 2.2, pole, -dirZ * 0.1);
  houseBox(group, 1.0, 0.45, 2.0, 0, 21.3, dirZ * 4.4, pole);
  houseBox(group, 0.8, 0.12, 1.7, 0, 21.04, dirZ * 4.4, houseLampMat());
  addCollider({ minX: x - 0.6, maxX: x + 0.6, minZ: z - 0.6, maxZ: z + 0.6 });
}

// Лавочка между двумя гранитными вазонами с кустами и урна рядом
function addAvenueBench(x, z, rotation) {
  addBench(x, z, rotation);
  const granite = houseMat(0x8e8a84, { roughness: 0.6 });
  const shrub = houseMat(0x3f7a32);
  [-1, 1].forEach((s) => {
    const group = new THREE.Group();
    group.position.set(x + s * 3.1, 0.2, z);
    cityGroup.add(group);
    houseBox(group, 2.2, 1.3, 1.6, 0, 0.65, 0, granite);
    houseBox(group, 2.3, 0.15, 1.7, 0, 1.33, 0, houseMat(0xa8a39b, { roughness: 0.5 }));
    const bush = new THREE.Mesh(new THREE.SphereGeometry(0.95, 8, 6), shrub);
    bush.position.set(0, 1.9, 0);
    bush.scale.set(1.15, 0.85, 0.8);
    group.add(bush);
    addCollider({ minX: x + s * 3.1 - 1.1, maxX: x + s * 3.1 + 1.1, minZ: z - 0.8, maxZ: z + 0.8 });
  });
  houseCylWorld(x + 5, z, 0.4, 1.3, houseMat(0x3a3f47, { roughness: 0.5, metalness: 0.4 }));
}

// Дерево в приствольной решётке посреди тротуара
function addStreetTree(x, z, scale) {
  const group = new THREE.Group();
  group.position.set(x, 0.2, z);
  cityGroup.add(group);
  houseBox(group, 3.2, 0.06, 3.2, 0, 0.03, 0, houseMat(0x3a3f47, { roughness: 0.5, metalness: 0.5 }));
  addTree(x, z, scale, false);
}

// Остановка: стеклянный павильон, скамейка, реклама и табличка с автобусом
function addBusStop(x, z, facing) {
  const group = new THREE.Group();
  group.position.set(x, 0.2, z);
  group.rotation.y = facing === 1 ? 0 : Math.PI;
  cityGroup.add(group);
  const steel = houseMat(0x5a6068, { roughness: 0.4, metalness: 0.5 });
  const glass = houseMat(0xcfe8f5, { transparent: true, opacity: 0.3, roughness: 0.1, depthWrite: false });
  houseBox(group, 8.6, 0.3, 3.2, 0, 4.9, 0, steel);
  houseBox(group, 8, 4.4, 0.1, 0, 2.6, -1.3, glass);
  [-1, 1].forEach((s) => {
    houseBox(group, 0.1, 4.4, 2.4, s * 4, 2.6, -0.1, glass);
    houseCyl(group, 0.12, 4.8, s * 4.1, 2.4, -1.4, steel);
    houseCyl(group, 0.12, 4.8, s * 4.1, 2.4, 1.3, steel);
  });
  houseBox(group, 5, 0.25, 1.1, -0.8, 1.1, -0.7, getWoodMaterial(0xc89b6a));
  const adMap = getArtMaterial(5).map;
  const ad = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 3.6), new THREE.MeshStandardMaterial({ color: 0xffffff, map: adMap, emissive: 0xffffff, emissiveMap: adMap, emissiveIntensity: 0.25 }));
  ad.position.set(3.0, 2.6, -1.24);
  group.add(ad);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 0.8), houseLabel("🚌 Проспект Блоблокс", "#2d5a8c"));
  sign.position.set(0, 4.4, 1.45);
  group.add(sign);
  houseCyl(group, 0.1, 6, 5.4, 3, 1.2, steel);
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.4), houseLabel("🚌", "#1d8a3a"));
  plate.position.set(5.4, 5.4, 1.27);
  group.add(plate);
}

// Розовая ограда парка с белыми столбами и зелёными шапками, как на старых московских улицах
function addParkWall(z) {
  const pink = houseMat(0xeab3a8, { roughness: 0.85 });
  const white = houseMat(0xf7f3ea, { roughness: 0.8 });
  const green = houseMat(0x2f7a55, { roughness: 0.45, metalness: 0.3, flatShading: true });
  const group = new THREE.Group();
  group.position.set(0, 0, z);
  cityGroup.add(group);
  [[-23, -4.5], [4.5, 23]].forEach(([x0, x1]) => {
    const len = x1 - x0;
    const mid = (x0 + x1) / 2;
    houseBox(group, len, 4.2, 0.8, mid, 2.1, 0, pink);
    houseBox(group, len + 0.2, 0.35, 1.2, mid, 4.35, 0, green);
    for (let x = x0; x <= x1 + 0.01; x += 3.7) {
      houseBox(group, 1.0, 4.8, 1.2, x, 2.4, 0, white);
      addHipRoof(group, 1.4, 1.6, 1.0, 0.05, 4.8, x, 0, green);
    }
    addCollider({ minX: x0, maxX: x1, minZ: z - 0.5, maxZ: z + 0.5 });
  });
  [-1, 1].forEach((s) => {
    houseBox(group, 1.8, 6.8, 1.8, s * 4.5, 3.4, 0, white);
    addHipRoof(group, 2.2, 2.2, 1.8, 0.05, 6.8, s * 4.5, 0, green);
    houseBox(group, 0.6, 0.9, 0.6, s * 4.5, 5.6, 1.0, houseLampMat());
  });
}

function getTileMaterial() {
  if (houseCache.has("tiles")) return houseCache.get("tiles");
  const texture = makeCanvasTexture(128, (ctx, size) => {
    ctx.fillStyle = "#b9c1c8";
    ctx.fillRect(0, 0, size, size);
    for (let y = 0; y < size; y += 16) {
      for (let x = 0; x < size; x += 16) {
        const v = 232 + Math.floor(Math.random() * 18);
        ctx.fillStyle = y === 64 || y === 80 ? "#3f6fa8" : `rgb(${v},${v},${v + 2})`;
        ctx.fillRect(x + 1, y + 1, 14, 14);
      }
    }
  });
  texture.repeat.set(1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff, map: texture, roughness: 0.35 });
  houseCache.set("tiles", material);
  return material;
}

// Подземный переход: два павильона со спуском и тоннель под проспектом с киосками
function addUnderpass(cx) {
  const y0 = -40;
  const sides = [{ pz: AVENUE_Z - 15.6, tunnelZ: AVENUE_Z - 10.5 }, { pz: AVENUE_Z + 15.6, tunnelZ: AVENUE_Z + 10.5 }];
  sides.forEach((side) => addUnderpassPavilion(cx, side.pz));
  // тоннель: пол, потолок, стены в плитке, лестницы на концах
  const group = new THREE.Group();
  group.position.set(cx, y0, AVENUE_Z);
  cityGroup.add(group);
  const box = (w, h, d, x, y, z, material, rx = 0) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z);
    mesh.rotation.x = rx;
    group.add(mesh);
    return mesh;
  };
  const tiles = getTileMaterial();
  const granite = houseMat(0x9a9894, { roughness: 0.5 });
  const half = 17.7;
  const floor = box(8.8, 0.4, half * 2, 0, -0.2, 0, granite);
  scaleBoxUv(floor.geometry, 2, 8);
  box(8.8, 0.3, half * 2, 0, 7.15, 0, houseMat(0xf2f0ea, { roughness: 0.9 }));
  [-1, 1].forEach((s) => {
    const wall = box(0.4, 7.4, half * 2, s * 4.4, 3.6, 0, tiles);
    scaleBoxUv(wall.geometry, 8, 2);
    box(8.8, 7.4, 0.4, 0, 3.6, s * (half + 0.2), tiles);
    for (let i = 0; i < 10; i += 1) box(8, (i + 1) * 0.5, 0.48, 0, (i + 1) * 0.25, s * (half - 4.8 + i * 0.48), granite);
    const exit = new THREE.Mesh(new THREE.PlaneGeometry(4, 0.9), houseLabel("Выход ↑", "#2e7d4f"));
    exit.position.set(0, 6.3, s * (half - 5.2));
    exit.rotation.y = s > 0 ? Math.PI : 0;
    group.add(exit);
  });
  for (let z = -half + 6; z <= half - 6; z += 4) box(5, 0.08, 0.6, 0, 6.95, z, houseLampMat());
  // киоски у одной стены, плакаты у другой
  [["Цветы 🌷", 0xe86a92], ["Пресса 📰", 0x3d5a8c], ["Кофе ☕", 0x7a4a2e]].forEach(([title, color], i) => {
    const z = -6 + i * 6;
    box(1.8, 5.2, 5, 3.3, 2.6, z, houseMat(color, { roughness: 0.6 }));
    box(0.08, 2.6, 4.4, 2.37, 2.6, z, houseMat(0xcfe8f5, { transparent: true, opacity: 0.35, roughness: 0.1, depthWrite: false }));
    for (let k = 0; k < 4; k += 1) box(0.6, 0.6, 0.6, 3.0, 1.6 + (k % 2) * 0.8, z - 1.5 + k, houseMat([0xf2c94c, 0xffffff, 0xd94f4f, 0x4b8a38][k]));
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 0.9), houseLabel(title, "#1d2633"));
    sign.position.set(2.35, 5.7, z);
    sign.rotation.y = -Math.PI / 2;
    group.add(sign);
    addCollider({ minX: cx + 2.3, maxX: cx + 4.4, minZ: AVENUE_Z + z - 2.5, maxZ: AVENUE_Z + z + 2.5, minY: y0 - 1, maxY: y0 + 8 });
  });
  [-6, 0, 6].forEach((z, i) => {
    const poster = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 4.4), getArtMaterial(40 + i));
    poster.position.set(-4.18, 3.4, z);
    poster.rotation.y = Math.PI / 2;
    group.add(poster);
  });
  [-1, 1].forEach((s) => addCollider({ minX: cx + s * 4.4 - 0.3, maxX: cx + s * 4.4 + 0.3, minZ: AVENUE_Z - half - 0.5, maxZ: AVENUE_Z + half + 0.5, minY: y0 - 1, maxY: y0 + 8 }));
  walkDecks.push({ x: cx, z: AVENUE_Z, cos: 1, sin: 0, hw: 4.2, hl: half, top: y0 });
  avenueUnderpasses.push({ cx, y0, sides });
}

// Павильон спуска: гранитные бортики, стеклянный навес, синяя табличка «Подземный переход»
function addUnderpassPavilion(cx, pz) {
  const group = new THREE.Group();
  group.position.set(cx, 0.2, pz);
  cityGroup.add(group);
  const granite = houseMat(0x8e8a84, { roughness: 0.6 });
  const steel = houseMat(0x5a6068, { roughness: 0.4, metalness: 0.5 });
  const glass = houseMat(0xcfe8f5, { transparent: true, opacity: 0.3, roughness: 0.1, depthWrite: false });
  [-1, 1].forEach((s) => {
    houseBox(group, 9, 1.4, 0.45, 0, 0.7, s * 2.2, granite);
    houseBox(group, 9, 0.12, 0.12, 0, 2.4, s * 2.1, steel);
    for (let x = -4.4; x <= 4.4; x += 2.2) houseBox(group, 0.1, 1.0, 0.1, x, 1.9, s * 2.1, steel);
  });
  houseBox(group, 0.45, 1.4, 4.85, 4.5, 0.7, 0, granite);
  // ступени уходят вниз: тёмный проём с полосками-ступенями
  const stairs = new THREE.Mesh(new THREE.PlaneGeometry(8.6, 4), new THREE.MeshBasicMaterial({ map: getStairsTexture() }));
  stairs.rotation.x = -Math.PI / 2;
  stairs.position.set(0, 0.03, 0);
  group.add(stairs);
  [[-4.4, -2.3], [4.4, -2.3], [-4.4, 2.3], [4.4, 2.3]].forEach(([x, z]) => houseCyl(group, 0.13, 6, x, 3, z, steel));
  houseBox(group, 9.6, 0.15, 5.4, 0, 6.05, 0, glass);
  houseBox(group, 9.6, 0.3, 0.2, 0, 6.0, 2.6, steel);
  houseBox(group, 9.6, 0.3, 0.2, 0, 6.0, -2.6, steel);
  houseCyl(group, 0.12, 7.5, -5.3, 3.75, 2.4, steel);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.2), houseLabel("🚶 Подземный переход", "#1f5fa8"));
  sign.position.set(-5.3, 7.0, 2.4);
  sign.rotation.y = -Math.PI / 2;
  group.add(sign);
  const back = sign.clone();
  back.rotation.y = Math.PI / 2;
  back.position.x = -5.25;
  group.add(back);
  [-1, 1].forEach((s) => addCollider({ minX: cx - 4.5, maxX: cx + 4.5, minZ: pz + s * 2.2 - 0.25, maxZ: pz + s * 2.2 + 0.25 }));
  addCollider({ minX: cx + 4.3, maxX: cx + 4.75, minZ: pz - 2.4, maxZ: pz + 2.4 });
}

function getStairsTexture() {
  if (houseCache.has("stairsTex")) return houseCache.get("stairsTex");
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  for (let i = 0; i < 16; i += 1) {
    const v = Math.round(150 - i * 8.5);
    ctx.fillStyle = `rgb(${v},${v},${v + 4})`;
    ctx.fillRect(i * 16, 0, 16, 64);
    ctx.fillStyle = `rgba(255,255,255,${0.25 - i * 0.014})`;
    ctx.fillRect(i * 16, 0, 2, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  houseCache.set("stairsTex", texture);
  return texture;
}

// Сам проспект: фонари, лавочки с вазонами, деревья в решётках, остановки, переходы, ограда парка
function buildAvenueStreet() {
  const centers = [-160, -80, 0, 80, 160];
  [[-1, AVENUE_Z - 13.2, AVENUE_Z - 16.6, AVENUE_Z - 14.5], [1, AVENUE_Z + 13.2, AVENUE_Z + 16.6, AVENUE_Z + 14.5]].forEach(([side, lampZ, benchZ, treeZ]) => {
    centers.forEach((c) => {
      const park = side < 0 && c === 0;
      [-16, 16].forEach((dx) => addAvenueLamp(c + dx, lampZ, -side));
      [-19, 19].forEach((dx) => addStreetTree(c + dx, treeZ, 0.85));
      if (park) return;
      const hasUnderpass = Math.abs(c) === 80;
      [-10, 10].forEach((dx) => {
        if (hasUnderpass && Math.sign(dx) === -Math.sign(c)) return;
        addAvenueBench(c + dx, benchZ, side < 0 ? 0 : Math.PI);
      });
    });
  });
  addBusStop(-163, AVENUE_Z - 14.2, 1);
  addBusStop(157, AVENUE_Z + 14.2, -1);
  addParkWall(AVENUE_Z - 18.4);
  addUnderpass(-70);
  addUnderpass(70);
  mapLabels.push({ text: "Проспект Блоблокс", x: 0, z: AVENUE_Z, size: 12 });
  mapIcons.push({ icon: "🚶", x: -70, z: AVENUE_Z });
  mapIcons.push({ icon: "🚶", x: 70, z: AVENUE_Z });
}

// Спуск в переход и выход наверх: просто идёшь в проём — и ты уже внизу
function updateUnderpasses(delta) {
  if (state.currentGame !== "city" || state.currentVehicle || !avenueUnderpasses.length) return;
  avenueState.cooldown -= delta;
  if (avenueState.cooldown > 0) return;
  const p = player.position;
  const ru = currentLanguage === "ru";
  for (const u of avenueUnderpasses) {
    if (Math.abs(p.x - u.cx) > 8) continue;
    if (p.y > -5 && p.y < 3) {
      for (const side of u.sides) {
        if (p.x > u.cx - 3.5 && p.x < u.cx + 4 && Math.abs(p.z - side.pz) < 1.8) {
          p.set(u.cx, u.y0 + 0.05, side.tunnelZ);
          if (player.velocity) player.velocity.set(0, 0, 0);
          avenueState.cooldown = 0.8;
          showToast(ru ? "🚶 Подземный переход" : "🚶 Underpass");
          return;
        }
      }
    } else if (Math.abs(p.y - u.y0) < 3) {
      const z = p.z - AVENUE_Z;
      const exit = z < -12.5 ? u.sides[0] : z > 12.5 ? u.sides[1] : null;
      if (exit) {
        p.set(u.cx - 6.8, 0.25, exit.pz);
        if (player.velocity) player.velocity.set(0, 0, 0);
        avenueState.cooldown = 0.8;
        return;
      }
    }
  }
}

// Одна картинка со всеми номерами квартир 0–255: таблички на дверях делят один материал
function getNumberPlateMaterial() {
  if (houseCache.has("numberPlates")) return houseCache.get("numberPlates");
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 30px Arial, sans-serif";
  for (let n = 0; n < 256; n += 1) {
    const x = (n % 16) * 64;
    const y = Math.floor(n / 16) * 64;
    ctx.fillStyle = "#d8b45a";
    ctx.fillRect(x, y, 64, 64);
    ctx.fillStyle = "#3a3f47";
    ctx.fillRect(x + 3, y + 3, 58, 58);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(String(n), x + 32, y + 34);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff, map: texture, roughness: 0.5 });
  houseCache.set("numberPlates", material);
  return material;
}

// Внутренности домов рисуются только рядом с камерой — снаружи их всё равно почти не видно
function updateHouseInteriors(delta) {
  houseInteriorState.timer -= delta;
  if (houseInteriorState.timer > 0) return;
  houseInteriorState.timer = 0.25;
  const cx = camera.position.x;
  const cz = camera.position.z;
  houseInteriors.forEach((item) => {
    item.group.visible = Math.hypot(item.x - cx, item.z - cz) < 65;
  });
}

function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.033);
  syncAvatarSettings();
  updateDayNightCycle(delta);
  updateMovement(delta);
  updateJobsProgress();
  updateMissionMarker();
  updateRoadGuide();
  updateMissionHud();
  if (state.currentGame === "parkour" && !state.inHub) {
    updateParkourProgress();
  }
  updateNpcs(delta);
  updateDistanceCulling();
  updateWorldAnimations(delta);
  updateNet(delta);
  updateFlyerFx(delta);
  updateForest(delta);
  updateAvatarAnimation(delta);
  updateFootsteps(delta);
  updateCamera();
  updateNature(delta);
  updateFallingLeaves(delta);
  updateLocalGrass();
  updateHouseChimneys(delta);
  updateLiftPanel();
  updateUnderpasses(delta);
  updateHouseInteriors(delta);
  updateSunAndInteriorLight();
  updateUi();
  updateInteractPrompt();
  updateMinimap();
  if (bigMapEl && !bigMapEl.classList.contains("hidden")) {
    renderBigMap();
  }
  renderFrame();
  renderHubAvatarPreview(delta);
  renderSidebarAvatarPreview(delta);
}

// купленные раньше машины снова стоят у автосалона, карта рисуется один раз
loadOwnedCars();
ownedCars.forEach((entry, index) => spawnOwnedCar(entry, index));
buildWorldMapImage();
finishWorldGraphics();

showOverlay("Если справа виден яркий 3D-город, значит настоящий 3D у тебя запустился.");
setTimeout(hideOverlay, 2600);
animate();
window.setTimeout(warmUpWorld, 500);


