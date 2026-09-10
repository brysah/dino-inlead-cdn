(function () {
  if (window.__DINO_INLEAD_LOADED__) {
    if (typeof window.__DINO_INLEAD_MOUNT__ === "function") {
      window.__DINO_INLEAD_MOUNT__();
    }
    return;
  }

  window.__DINO_INLEAD_LOADED__ = true;

  var PLAN_TRIGGER_ID = "hapOsz";

  var CHECKOUT_ANUAL =
    "https://pay.hotmart.com/W107367943X?off=e0043er2&checkoutMode=10";

  var CHECKOUT_TRIMESTRAL =
    "https://pay.hotmart.com/W107367943X?off=q8fsgy7w&checkoutMode=10";

  var CHECKOUT_MENSAL =
    "https://pay.hotmart.com/W107367943X?off=ifnj0iw1&checkoutMode=10";

  var selectedPlan = "anual";
  var fxStarted = false;
  var mountTimer = null;


  /* =========================
     COOKIE
     ========================= */

  function getCookie(name) {
    var match = document.cookie.match(
      new RegExp("(^|; )" + name + "=([^;]+)")
    );

    return match
      ? decodeURIComponent(match[2])
      : "";
  }


  /* =========================
     SRC
     ========================= */

  function getSrc() {
    var query =
      new URLSearchParams(
        window.location.search
      );

    var fromUtmParams =
      window.utmParams instanceof URLSearchParams
        ? window.utmParams.get("src")
        : "";

    return (
      getCookie("lead") ||
      query.get("src") ||
      localStorage.getItem("src") ||
      fromUtmParams ||
      ""
    );
  }


  /* =========================
     MONTA URL CHECKOUT
     ========================= */

  function buildCheckoutUrl(baseUrl) {
    var finalUrl =
      new URL(baseUrl);

    var currentParams =
      new URLSearchParams(
        window.location.search
      );


    /* parâmetros da URL atual */

    currentParams.forEach(
      function (value, key) {

        if (value) {
          finalUrl.searchParams.set(
            key,
            value
          );
        }

      }
    );


    /* window.utmParams */

    if (
      window.utmParams
        instanceof URLSearchParams
    ) {

      window.utmParams.forEach(
        function (value, key) {

          if (value) {
            finalUrl.searchParams.set(
              key,
              value
            );
          }

        }
      );

    }


    /* SRC */

    var src = getSrc();

    if (src) {
      finalUrl.searchParams.set(
        "src",
        src
      );
    }


    /* VTURB SCK */

    if (window.__vturbCk) {
      finalUrl.searchParams.set(
        "sck",
        window.__vturbCk
      );
    }


    return finalUrl.toString();
  }


  /* =========================
     CSS
     ========================= */

  function injectStyles() {

    if (
      document.getElementById(
        "dino-inlead-styles"
      )
    ) {
      return;
    }


    var style =
      document.createElement(
        "style"
      );

    style.id =
      "dino-inlead-styles";


    style.textContent = `

#confetti-canvas{
  position:fixed;
  inset:0;
  pointer-events:none;
  z-index:999999;
}

.balloon{
  position:fixed;
  bottom:-120px;
  width:44px;
  height:58px;
  border-radius:50%;
  opacity:.9;
  animation:dinoFloatUp 6s linear forwards;
  z-index:999998;
  pointer-events:none;
}

@keyframes dinoFloatUp{
  to{
    transform:translateY(-120vh);
    opacity:0;
  }
}


#inline-plan-box{
  width:100%;
  max-width:600px;
  margin:18px auto 0;
  background:#fff;
  border-radius:24px;
  padding:34px 16px 22px;
  box-shadow:0 12px 35px rgba(0,0,0,.16);
  font-family:Arial,sans-serif;
  box-sizing:border-box;
}


.plan-card{
  position:relative;
  width:100%;

  border:2px solid #222;
  border-radius:18px;

  padding:24px 18px 12px;
  margin-bottom:16px;

  cursor:pointer;
  box-sizing:border-box;

  background:#fff;

  min-height:105px;

  transition:.18s ease;
}


.plan-card.selected{
  border:3px solid #c60016;

  box-shadow:
    0 9px 22px
    rgba(0,0,0,.08);
}


.plan-badge{
  position:absolute;

  top:-18px;
  left:50%;

  transform:
    translateX(-50%);

  background:#000;
  color:#fff;

  font-size:13px;
  line-height:1;
  font-weight:800;

  padding:8px 22px;

  border-radius:16px;

  white-space:nowrap;
}


.plan-discount{
  position:absolute;

  top:15px;
  right:58px;

  background:#d00000;
  color:#fff;

  font-size:12px;
  line-height:1;
  font-weight:700;

  padding:9px;

  border-radius:13px;

  white-space:nowrap;
}


.plan-radio{
  position:absolute;

  top:47px;
  right:18px;

  width:25px;
  height:25px;

  border-radius:50%;

  border:
    2px solid #bdbdbd;

  box-sizing:border-box;

  background:#fff;
}


.plan-card.selected
.plan-radio{
  border:
    7px solid #d00000;
}


.plan-title{
  font-size:22px;
  line-height:1.05;
  font-weight:700;

  color:#000;

  margin-bottom:12px;

  padding-right:145px;

  box-sizing:border-box;
}


.plan-price{
  font-size:16px;
  line-height:1.25;

  color:#444;

  box-sizing:border-box;
}


.plan-card[data-plan="trimestral"],
.plan-card[data-plan="mensal"]{
  min-height:102px;
  padding-top:22px;
}


.plan-card[data-plan="trimestral"]
.plan-title,
.plan-card[data-plan="mensal"]
.plan-title,
.plan-card[data-plan="trimestral"]
.plan-price,
.plan-card[data-plan="mensal"]
.plan-price{
  padding-right:45px;
}


.plan-card[data-plan="trimestral"]
.plan-radio,
.plan-card[data-plan="mensal"]
.plan-radio{
  top:41px;
}


#plan-continue{
  width:100%;

  margin-top:6px;

  background:#b60018;
  color:#fff;

  border:0;

  padding:19px 16px;

  border-radius:16px;

  font-size:20px;
  line-height:1;
  font-weight:600;

  cursor:pointer;

  box-shadow:
    0 9px 0
    rgba(182,0,24,.25);

  letter-spacing:.4px;
}


@media(max-width:480px){

  #inline-plan-box{
    max-width:390px;
    border-radius:22px;
    padding:24px 14px 20px;
  }

  .plan-card{
    border-radius:17px;
    padding:24px 16px 21px;
    min-height:118px;
  }

  .plan-title{
    font-size:22px;
    padding-right:132px;
  }

  .plan-price{
    font-size:14px;
    padding-right:140px;
  }

  .plan-discount{
    top:10px;
    right:20px;
    padding:5px;
  }

  .plan-radio{
    top:45px;
    right:17px;
    width:24px;
    height:24px;
  }

  .plan-card[data-plan="trimestral"],
  .plan-card[data-plan="mensal"]{
    min-height:98px;
  }

  .plan-card[data-plan="trimestral"]
  .plan-radio,
  .plan-card[data-plan="mensal"]
  .plan-radio{
    top:39px;
  }

  #plan-continue{
    font-size:21px;
    padding:18px 14px;
  }

}


@media(max-width:380px){

  #inline-plan-box{
    max-width:100%;
    padding:34px 12px 18px;
  }

  .plan-card{
    padding:23px 14px 20px;
    min-height:100px;
  }

  .plan-title{
    font-size:18px;
    padding-right:122px;
  }

  .plan-price{
    padding-right:96px;
  }

  .plan-badge{
    font-size:14px;
    padding:7px 18px;
  }

  .plan-discount{
    right:15px;
    font-size:11px;
  }

  .plan-radio{
    top:43px;
    right:14px;
    width:23px;
    height:23px;
  }

  .plan-card.selected
  .plan-radio{
    border-width:6px;
  }

  #plan-continue{
    font-size:18px;
    padding:17px 12px;
  }

}


#popup-box{
  display:none;
  position:fixed;
  bottom:60px;
  left:15px;
  border-radius:12px;
  padding:14px 18px;
  box-shadow:0 4px 8px rgba(0,0,0,0.15);
  font-family:Arial,sans-serif;
  color:#333;
  z-index:9999;
  max-width:360px;
  align-items:center;
  gap:10px;
  animation:fadeIn .4s ease-out;
  font-size:14px;
  background-color:#fff;
  box-sizing:border-box;
}

#popup-icon{
  font-size:18px;
  min-width:20px;
}

#popup-text{
  flex:1;
}

@keyframes fadeIn{
  from{
    opacity:0;
    transform:scale(.95);
  }
  to{
    opacity:1;
    transform:scale(1);
  }
}

@media(max-width:480px){

  #popup-box{
    font-size:13px !important;
    bottom:70px !important;
    left:10px !important;
    right:10px !important;
    max-width:95% !important;
  }

}

`;


    document.head.appendChild(
      style
    );
  }


  /* =========================
     TRIGGER INLEAD
     ========================= */

  function getTrigger() {

    return document.getElementById(
      PLAN_TRIGGER_ID
    );

  }


  function getMountReference() {

    return (
      document.getElementById(
        "layer_" + PLAN_TRIGGER_ID
      )
      ||
      getTrigger()
    );

  }


  /* =========================
     SELEÇÃO VISUAL
     ========================= */

  function updatePlanUI() {

    document
      .querySelectorAll(
        "#inline-plan-box .plan-card"
      )
      .forEach(
        function (card) {

          card.classList.toggle(
            "selected",

            card.getAttribute(
              "data-plan"
            ) === selectedPlan
          );

        }
      );

  }


  /* =========================
     CRIA PLANOS
     ========================= */

  function mountPlanBox() {

    var trigger =
      getTrigger();

    var reference =
      getMountReference();


    if (
      !trigger ||
      !reference ||
      !reference.parentNode
    ) {
      return false;
    }


    if (
      document.getElementById(
        "inline-plan-box"
      )
    ) {
      return true;
    }


    var box =
      document.createElement(
        "div"
      );


    box.id =
      "inline-plan-box";


    box.innerHTML = `

<div
  class="plan-card selected"
  data-plan="anual"
>

  <div class="plan-badge">
    Most popular
  </div>

  <div class="plan-discount">
    - 70% OFF
  </div>

  <div class="plan-radio"></div>

  <div class="plan-title">
    Annual
  </div>

  <div class="plan-price">
    Only $5.75/month. Billed annually.
  </div>

</div>


<div
  class="plan-card"
  data-plan="trimestral"
>

  <div class="plan-radio"></div>

  <div class="plan-title">
    Quarterly
  </div>

  <div class="plan-price">
    Only $9.67/month. Billed quarterly.
  </div>

</div>


<div
  class="plan-card"
  data-plan="mensal"
>

  <div class="plan-radio"></div>

  <div class="plan-title">
    Monthly
  </div>

  <div class="plan-price">
    $19.90/month
  </div>

</div>


<button
  id="plan-continue"
  type="button"
>
  CONTINUE ›
</button>

`;


    reference.insertAdjacentElement(
      "afterend",
      box
    );


    updatePlanUI();


    if (!fxStarted) {

      fxStarted = true;

      startConfetti();
      startBalloons();

    }


    return true;
  }


  /* =========================
     REMOVE SE TROCAR ETAPA
     ========================= */

  function removeOrphanPlanBox() {

    var box =
      document.getElementById(
        "inline-plan-box"
      );


    if (
      box &&
      !getTrigger()
    ) {

      box.remove();

    }

  }


  /* =========================
     CLIQUES
     ========================= */

  function handleClick(event) {

    var card =
      event.target.closest
        ? event.target.closest(
            "#inline-plan-box .plan-card"
          )
        : null;


    if (card) {

      selectedPlan =
        card.getAttribute(
          "data-plan"
        ) || "anual";


      updatePlanUI();

      return;
    }


    var continueButton =
      event.target.closest
        ? event.target.closest(
            "#plan-continue"
          )
        : null;


    if (!continueButton) {
      return;
    }


    event.preventDefault();
    event.stopPropagation();


    var checkout =
      CHECKOUT_ANUAL;


    if (
      selectedPlan ===
      "trimestral"
    ) {

      checkout =
        CHECKOUT_TRIMESTRAL;

    }


    if (
      selectedPlan ===
      "mensal"
    ) {

      checkout =
        CHECKOUT_MENSAL;

    }


    window.location.assign(
      buildCheckoutUrl(
        checkout
      )
    );

  }


  /* =========================
     VTURB
     ========================= */

  window.__vturbCk =
    window.__vturbCk || "";


  function captureVturbCk(
    attempt
  ) {

    if (window.__vturbCk) {
      return;
    }


    if (attempt > 40) {
      return;
    }


    var player =
      document.querySelector(
        "vturb-smartplayer"
      );


    var config =
      (
        player &&
        player.config
      ) || {};


    var conversionParams =
      config.conversion || [];


    if (
      !player ||
      !player.urlUpdater ||
      !conversionParams.length
    ) {

      setTimeout(
        function () {

          captureVturbCk(
            attempt + 1
          );

        },
        250
      );

      return;
    }


    player
      .urlUpdater(
        "https://placeholder.com"
      )
      .then(
        function (url) {

          var parsedUrl =
            new URL(url);


          var value = "";


          conversionParams.forEach(
            function (param) {

              var current =
                parsedUrl
                  .searchParams
                  .get(param);


              if (current) {
                value = current;
              }

            }
          );


          if (value) {

            window.__vturbCk =
              value;

          } else {

            setTimeout(
              function () {

                captureVturbCk(
                  attempt + 1
                );

              },
              250
            );

          }

        }
      )
      .catch(
        function () {

          setTimeout(
            function () {

              captureVturbCk(
                attempt + 1
              );

            },
            250
          );

        }
      );

  }


  /* =========================
     CONFETTI
     ========================= */

  function startConfetti() {

    if (
      document.getElementById(
        "confetti-canvas"
      )
    ) {
      return;
    }


    var canvas =
      document.createElement(
        "canvas"
      );


    canvas.id =
      "confetti-canvas";


    document.body.appendChild(
      canvas
    );


    var ctx =
      canvas.getContext(
        "2d"
      );


    if (!ctx) {
      return;
    }


    function resize() {

      canvas.width =
        window.innerWidth;

      canvas.height =
        window.innerHeight;

    }


    resize();


    window.addEventListener(
      "resize",
      resize
    );


    var colors = [
      "#ff4d6d",
      "#ffd166",
      "#06d6a0",
      "#4cc9f0",
      "#b5179e",
      "#f77f00"
    ];


    var pieces = [];


    for (
      var i = 0;
      i < 140;
      i++
    ) {

      pieces.push({

        x:
          Math.random() *
          canvas.width,

        y:
          Math.random() *
          -canvas.height,

        r:
          Math.random() * 6 + 4,

        c:
          colors[
            Math.floor(
              Math.random() *
              colors.length
            )
          ],

        s:
          Math.random() * 3 + 2,

        a:
          Math.random() *
          Math.PI

      });

    }


    var frames = 0;


    function draw() {

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );


      pieces.forEach(
        function (p) {

          p.y += p.s;

          p.x += Math.sin(
            p.a += .02
          );


          ctx.fillStyle =
            p.c;


          ctx.fillRect(
            p.x,
            p.y,
            p.r,
            p.r
          );


          if (
            p.y >
            canvas.height
          ) {

            p.y = -10;

            p.x =
              Math.random() *
              canvas.width;

          }

        }
      );

    }


    function loop() {

      draw();

      frames++;


      if (
        frames < 220
      ) {

        requestAnimationFrame(
          loop
        );

      } else {

        canvas.remove();

      }

    }


    setTimeout(
      loop,
      400
    );

  }


  /* =========================
     BALÕES
     ========================= */

  function startBalloons() {

    var colors = [
      "#ff6b6b",
      "#ffd93d",
      "#6bcB77",
      "#4d96ff",
      "#b983ff"
    ];


    function spawn() {

      var balloon =
        document.createElement(
          "div"
        );


      balloon.className =
        "balloon";


      balloon.style.left =
        Math.random() *
        100 +
        "vw";


      balloon.style.background =
        colors[
          Math.floor(
            Math.random() *
            colors.length
          )
        ];


      document.body.appendChild(
        balloon
      );


      setTimeout(
        function () {

          balloon.remove();

        },
        6000
      );

    }


    for (
      var i = 0;
      i < 12;
      i++
    ) {

      setTimeout(
        spawn,
        i * 300
      );

    }

  }



  /* =========================
     SOCIAL PROOF
     ========================= */

  function startSocialProof() {

    var nomesMulheres = [
      "Emily Johnson",
      "Jessica Miller",
      "Ashley Davis",
      "Sarah Wilson",
      "Amanda Taylor",
      "Jennifer Moore",
      "Samantha Anderson",
      "Megan Thomas",
      "Rachel Jackson",
      "Lauren White",
      "Nicole Harris",
      "Stephanie Martin",
      "Brittany Thompson",
      "Kayla Garcia",
      "Heather Martinez",
      "Melissa Robinson",
      "Danielle Clark",
      "Rebecca Lewis",
      "Michelle Walker",
      "Christina Hall"
    ];

    var nomesHomens = [
      "Michael Johnson",
      "James Smith",
      "David Miller",
      "Daniel Brown",
      "Matthew Davis",
      "Christopher Wilson",
      "Andrew Taylor",
      "Robert Anderson",
      "Joshua Thomas",
      "Ryan Jackson",
      "Brandon White",
      "Justin Harris",
      "Kevin Martin",
      "Eric Thompson",
      "Jason Garcia",
      "Brian Martinez"
    ];

    var frasesCompra = [
      "just got access to Dino Teaches\u2122.",
      "just joined Dino Teaches\u2122.",
      "just unlocked Dino Teaches\u2122 for their child.",
      "started Dino Teaches\u2122 today.",
      "activated Dino Teaches\u2122."
    ];

    var exibicoes = [
      { delay: 10000, duracao: 5000 },
      { delay: 13000, duracao: 6000 },
      { delay: 20000, duracao: 8000 },
      { delay: 35000, duracao: 12000 }
    ];

    var contador = 0;

    function escolherNomeAleatorio() {
      var isMulher =
        Math.random() < 0.75;

      var lista = isMulher
        ? nomesMulheres
        : nomesHomens;

      var nome =
        lista[
          Math.floor(
            Math.random() *
              lista.length
          )
        ];

      return {
        nome: nome,
        isMulher: isMulher
      };
    }

    function mostrarPopup(delayIndex) {

      var pessoa =
        escolherNomeAleatorio();

      var box =
        document.getElementById(
          "popup-box"
        );

      var content =
        document.getElementById(
          "popup-text"
        );

      var icon =
        document.getElementById(
          "popup-icon"
        );

      if (
        !box ||
        !content ||
        !icon
      ) {
        return;
      }

      if (
        (contador + 1) % 3 === 0
      ) {
        content.textContent =
          pessoa.nome +
          " recommends Dino Teaches\u2122 \u2b50\u2b50\u2b50\u2b50\u2b50";

        icon.textContent = "";
      } else {

        var frase =
          frasesCompra[
            Math.floor(
              Math.random() *
                frasesCompra.length
            )
          ];

        content.textContent =
          pessoa.nome +
          ", " +
          frase;

        icon.textContent = "\u2714";
      }

      if (pessoa.isMulher) {
        box.style.backgroundColor =
          "#ffe6ec";

        box.style.border =
          "2px solid #ff9eb5";
      } else {
        box.style.backgroundColor =
          "#e0f0ff";

        box.style.border =
          "2px solid #94c9ff";
      }

      box.style.display = "flex";

      setTimeout(
        function () {
          box.style.display =
            "none";
        },
        exibicoes[
          delayIndex %
            exibicoes.length
        ].duracao
      );

      var proximoIndex =
        (delayIndex + 1) %
        exibicoes.length;

      var proximoDelay =
        exibicoes[
          proximoIndex
        ].delay;

      setTimeout(
        function () {
          mostrarPopup(
            proximoIndex
          );
        },
        proximoDelay
      );

      contador++;
    }

    setTimeout(
      function () {
        mostrarPopup(0);
      },
      exibicoes[0].delay
    );
  }


  /* =========================
     INICIALIZA
     ========================= */

  var socialProofStarted = false;

  function ensurePopupElement() {

    if (
      !document.getElementById(
        "popup-box"
      )
    ) {

      var popup =
        document.createElement(
          "div"
        );

      popup.id =
        "popup-box";

      popup.innerHTML =
        '<div id="popup-icon">\u2714</div>' +
        '<span id="popup-text"></span>';

      document.body.appendChild(
        popup
      );

    }

  }

  function mount() {

    injectStyles();

    removeOrphanPlanBox();

    mountPlanBox();

    ensurePopupElement();


    if (!window.__vturbCk) {

      captureVturbCk(0);

    }

  }


  window.__DINO_INLEAD_MOUNT__ =
    mount;


  document.addEventListener(
    "click",
    handleClick,
    true
  );


  function scheduleMount() {

    clearTimeout(
      mountTimer
    );


    mountTimer =
      setTimeout(
        mount,
        50
      );

  }


  /* Inlead troca etapas dinamicamente */

  function startObserver() {

    if (!document.body) {

      setTimeout(
        startObserver,
        100
      );

      return;

    }


    var observer =
      new MutationObserver(
        scheduleMount
      );


    observer.observe(
      document.body,
      {
        childList: true,
        subtree: true
      }
    );


    mount();


    if (!socialProofStarted) {

      socialProofStarted = true;

      startSocialProof();

    }

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      startObserver,
      {
        once: true
      }
    );

  } else {

    startObserver();

  }

})();
