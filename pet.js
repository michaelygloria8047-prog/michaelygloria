/* ==========================================================
   INFOT 2 - pet.js
   1) Pop-up messages (log out, account created, no account)
   2) "Dino", a little pet dinosaur that pops up on every page
   Keep this file in the SAME folder as the HTML pages.
   Every page loads it with:  <script src="pet.js"></script>
   ========================================================== */
(function () {
    'use strict';
    if (window.petPopup) { return; } // already loaded

    /* ---------- Styles (kept here so the pop-ups work on every page) ---------- */
    var css = '' +
    '.dino-pet,.pet-overlay,.pet-toast,.dino-line{--p-bg:rgba(18, 18, 24,.94);--p-text:#F6F4F0;--p-muted:#C8C6CC;--p-edge:rgba(246, 244, 240,.22);--p-shadow:rgba(0, 0, 0,.65)}' +
    ':root[data-theme="light"] .dino-pet,:root[data-theme="light"] .pet-overlay,:root[data-theme="light"] .pet-toast,:root[data-theme="light"] .dino-line{--p-bg:rgba(255, 255, 255,.96);--p-text:#16161D;--p-muted:#4A4A55;--p-edge:rgba(142, 10, 26,.24);--p-shadow:rgba(142, 10, 26,.32)}' +

    /* pop-up */
    '.pet-overlay{position:fixed;top:0;left:0;right:0;bottom:0;z-index:1100;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(10, 10, 13,.6);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);opacity:0;transition:opacity .2s ease}' +
    '.pet-overlay.show{opacity:1}' +
    '.pet-pop{box-sizing:border-box;width:min(400px,100%);padding:28px 26px 24px;border-radius:26px;text-align:center;background:var(--p-bg);color:var(--p-text);border:1px solid var(--p-edge);box-shadow:0 40px 80px -24px var(--p-shadow),inset 0 1px 0 rgba(255, 255, 255,.2);transform:perspective(900px) rotateX(14deg) translateY(24px) scale(.94);transition:transform .35s cubic-bezier(.2,.9,.3,1.2)}' +
    '.pet-overlay.show .pet-pop{transform:none}' +
    '.pet-icon{margin:0 0 10px;font-size:2.6rem;line-height:1}' +
    '.pet-title{margin:0 0 8px;font:700 1.4rem/1.2 "Sora","Trebuchet MS",sans-serif;color:var(--p-text);-webkit-text-fill-color:currentColor;background:none}' +
    '.pet-text{margin:0 auto 22px;max-width:34ch;font:400 1rem/1.5 "Inter","Trebuchet MS",sans-serif;color:var(--p-muted)}' +
    '.pet-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:12px}' +
    '.pet-btn{all:unset;box-sizing:border-box;display:inline-block;min-width:130px;padding:12px 24px;border:1px solid rgba(246, 244, 240,.28);border-radius:14px;background:linear-gradient(180deg,#D4142B,#8E0A1A);color:#F6F4F0;font:700 .95rem "Inter","Trebuchet MS",sans-serif;letter-spacing:.03em;text-align:center;cursor:pointer;box-shadow:0 5px 0 #5E0712,0 14px 24px -8px rgba(212, 20, 43,.55),inset 0 1px 0 rgba(246, 244, 240,.4);transition:transform .12s,box-shadow .12s,filter .2s}' +
    '.pet-btn:hover{transform:translateY(-2px);filter:brightness(1.12)}' +
    '.pet-btn:active{transform:translateY(4px);box-shadow:0 1px 0 #5E0712,0 6px 12px -4px rgba(212, 20, 43,.5)}' +
    '.pet-btn:focus-visible{outline:2px solid #E8283D;outline-offset:3px}' +
    '.pet-btn.ghost{background:transparent;color:var(--p-text);border-color:var(--p-edge);box-shadow:0 5px 0 rgba(0, 0, 0,.18)}' +

    /* toast message */
    '.pet-toast{position:fixed;left:50%;bottom:calc(104px + env(safe-area-inset-bottom,0px));z-index:1200;max-width:min(92vw,420px);padding:12px 20px;border-radius:14px;background:var(--p-bg);color:var(--p-text);border:1px solid var(--p-edge);box-shadow:0 18px 36px -14px var(--p-shadow);font:600 .92rem/1.4 "Inter","Trebuchet MS",sans-serif;text-align:center;opacity:0;transform:translateX(-50%) translateY(14px);transition:opacity .3s,transform .3s;pointer-events:none}' +
    '.pet-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}' +

    /* button animations for the pop-ups + click ripple used on every button of the site */
    '.pet-btn{position:relative;overflow:hidden;isolation:isolate;transition:transform .2s cubic-bezier(.3,1.6,.4,1),box-shadow .12s,filter .2s}' +
    '.pet-btn::after{content:"";position:absolute;top:0;left:-75%;width:50%;height:100%;background:linear-gradient(105deg,transparent,rgba(255,255,255,.5),transparent);transform:skewX(-20deg);pointer-events:none}' +
    '.pet-btn:hover::after,.pet-btn:focus-visible::after{animation:pet-shine .75s ease}' +
    '@keyframes pet-shine{from{left:-75%}to{left:130%}}' +
    '.pet-btn:hover{transform:translateY(-3px) scale(1.04)}' +
    '.pet-btn:active{transform:translateY(4px) scale(.97)}' +
    '.btn-ripple{position:absolute;border-radius:50%;background:currentColor;pointer-events:none;transform:scale(0);opacity:.35;animation:btn-ripple .6s ease-out forwards}' +
    '@keyframes btn-ripple{from{transform:scale(0);opacity:.35}to{transform:scale(1);opacity:0}}' +

    /* dino */
    '.dino-pet{position:fixed;left:0;top:0;width:92px;height:80px;z-index:1000;pointer-events:none;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation;will-change:transform}' +
    '.dino-pet:focus-visible{outline:2px solid #E8283D;outline-offset:4px;border-radius:16px}' +
    '.dino-pet::after{content:"";position:absolute;left:14%;right:14%;bottom:-3px;height:8px;border-radius:50%;background:rgba(0, 0, 0,.28);filter:blur(3px);z-index:-1}' +
    '.dino-pet svg{display:block;width:100%;height:100%;overflow:visible}' +
    '.dino-flip,.dino-hop{width:100%;height:100%}' +
    '.dino-pet.hop .dino-hop{animation:dino-hop .6s cubic-bezier(.3,.7,.4,1)}' +
    '.dino-pet.pop-in .dino-hop{animation:dino-in .6s cubic-bezier(.2,1.4,.4,1) both}' +
    '.dino-pet.pop-out .dino-hop{animation:dino-out .35s ease-in both}' +
    '@keyframes dino-hop{0%{transform:none}20%{transform:scale(1.08,.88)}55%{transform:translateY(-34px) scale(.95,1.08)}85%{transform:scale(1.08,.9)}100%{transform:none}}' +
    '@keyframes dino-in{from{transform:translateY(30px) scale(0);opacity:0}to{transform:none;opacity:1}}' +
    '@keyframes dino-out{to{transform:translateY(30px) scale(0);opacity:0}}' +
    '.dino-tail{transform-origin:34px 60px;animation:dino-wag 1.4s ease-in-out infinite}' +
    '@keyframes dino-wag{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(9deg)}}' +
    '.dino-eyes{transform-box:fill-box;transform-origin:center;animation:dino-blink 4.2s infinite}' +
    '@keyframes dino-blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}' +
    '.dino-pet.walking .dino-body{transform-box:fill-box;transform-origin:center bottom;animation:dino-bob .4s ease-in-out infinite}' +
    '@keyframes dino-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}' +
    '.dino-pet .leg{transform-box:fill-box;transform-origin:50% 0}' +
    '.dino-pet.walking .leg-a{animation:dino-step .4s ease-in-out infinite}' +
    '.dino-pet.walking .leg-b{animation:dino-step .4s ease-in-out infinite;animation-delay:-.2s}' +
    '@keyframes dino-step{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-5px) rotate(-14deg)}}' +
    '.dino-bubble{position:absolute;bottom:calc(100% + 8px);left:50%;width:max-content;max-width:180px;padding:9px 14px;border-radius:16px;background:var(--p-bg);color:var(--p-text);border:1px solid var(--p-edge);box-shadow:0 14px 28px -12px var(--p-shadow);font:600 .85rem/1.35 "Inter","Trebuchet MS",sans-serif;text-align:center;opacity:0;transform:translateX(-50%) translateY(6px) scale(.9);transform-origin:50% 100%;transition:opacity .25s,transform .25s;pointer-events:none}' +
    '.dino-bubble.show{opacity:1;transform:translateX(calc(-50% + var(--bx,0px))) translateY(0) scale(1)}' +
    '.dino-bubble::after{content:"";position:absolute;left:calc(50% - var(--bx,0px));bottom:-7px;width:12px;height:12px;background:var(--p-bg);border-right:1px solid var(--p-edge);border-bottom:1px solid var(--p-edge);transform:translateX(-50%) rotate(45deg)}' +
    '.dino-bubble.below{bottom:auto;top:calc(100% + 8px);transform-origin:50% 0}' +
    '.dino-bubble.below::after{bottom:auto;top:-7px;transform:translateX(-50%) rotate(225deg)}' +
    '.dino-line{position:fixed;left:0;top:0;width:100%;height:100%;z-index:1000;pointer-events:none;overflow:visible;color:var(--p-text);opacity:0;transition:opacity .3s;filter:drop-shadow(0 0 2px rgba(0,0,0,.35))}' +
    '.dino-line line{stroke:currentColor;stroke-width:2;stroke-linecap:round}' +
    '.dino-line circle{fill:currentColor}' +
    '.dino-pet .arm-up{display:none}' +
    '.dino-pet.swinging .arm-up{display:inline}' +
    '.dino-pet.swinging .arm-down{display:none}' +
    '.dino-pet .leg{transition:transform .2s}' +
    '.dino-pet.swinging .leg-a{transform:rotate(-30deg)}' +
    '.dino-pet.swinging .leg-b{transform:rotate(22deg)}' +
    '.scarf-flap{transform-origin:66px 62px}' +
    '.dino-pet.walking .scarf-flap{animation:dino-flutter .5s ease-in-out infinite alternate}' +
    '.dino-pet.swinging .scarf-flap{animation:dino-flutter .22s ease-in-out infinite alternate}' +
    '@keyframes dino-flutter{from{transform:rotate(-7deg)}to{transform:rotate(9deg)}}' +
    '@media (prefers-reduced-motion:reduce){.btn-ripple{display:none}.dino-line{display:none}.dino-pet *,.pet-overlay,.pet-pop,.pet-toast,.dino-bubble{animation:none!important;transition-duration:.01ms!important}}';

    var style = document.createElement('style');
    style.id = 'petStyles';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    /* ---------- 1) Pop-up messages ---------- */
    var overlay = null;
    var lastFocus = null;

    function closePopup() {
        if (!overlay) { return; }
        var old = overlay;
        overlay = null;
        old.classList.remove('show');
        setTimeout(function () { if (old.parentNode) { old.parentNode.removeChild(old); } }, 220);
        document.removeEventListener('keydown', onPopupKey, true);
        if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
    }

    function onPopupKey(e) {
        if (!overlay) { return; }
        if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            closePopup();
        } else if (e.key === 'Tab') {
            var btns = overlay.querySelectorAll('.pet-btn');
            if (!btns.length) { return; }
            var first = btns[0], last = btns[btns.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
            else if (!overlay.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
        }
    }

    // options: { icon, title, text, focus: index of the button to focus,
    //            buttons: [ { label, primary, onClick } ] }
    window.petPopup = function (o) {
        closePopup();
        lastFocus = document.activeElement;

        overlay = document.createElement('div');
        overlay.className = 'pet-overlay';
        overlay.innerHTML =
            '<div class="pet-pop" role="alertdialog" aria-modal="true" aria-labelledby="petTitle" aria-describedby="petText">' +
            '<div class="pet-icon" aria-hidden="true"></div>' +
            '<h2 class="pet-title" id="petTitle"></h2>' +
            '<p class="pet-text" id="petText"></p>' +
            '<div class="pet-actions"></div></div>';
        overlay.querySelector('.pet-icon').textContent = o.icon || '';
        overlay.querySelector('.pet-title').textContent = o.title || '';
        overlay.querySelector('.pet-text').textContent = o.text || '';

        var actions = overlay.querySelector('.pet-actions');
        var buttons = o.buttons && o.buttons.length ? o.buttons : [{ label: 'OK', primary: true }];
        buttons.forEach(function (b) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'pet-btn' + (b.primary ? '' : ' ghost');
            btn.textContent = b.label;
            btn.addEventListener('click', function () {
                closePopup();
                if (b.onClick) { b.onClick(); }
            });
            actions.appendChild(btn);
        });

        var shown = overlay;
        overlay.addEventListener('click', function (e) { if (e.target === shown) { closePopup(); } });
        document.body.appendChild(overlay);
        document.addEventListener('keydown', onPopupKey, true);
        requestAnimationFrame(function () { shown.classList.add('show'); });

        var all = overlay.querySelectorAll('.pet-btn');
        var idx = typeof o.focus === 'number' ? o.focus : all.length - 1;
        if (all[idx]) { all[idx].focus(); }
    };

    // "Are you sure you want to log out?"
    window.showLogoutPopup = function () {
        window.petPopup({
            icon: '\uD83D\uDC4B',
            title: 'Log out?',
            text: 'Are you sure you want to log out? You will need to log in again to view the site.',
            focus: 0,
            buttons: [
                { label: 'Stay logged in' },
                {
                    label: 'Log out',
                    primary: true,
                    onClick: function () {
                        try { localStorage.removeItem('isLoggedIn'); localStorage.removeItem('infot2_current'); } catch (e) {}
                        window.petFlash('You are logged out.'); // shown on the login page
                        window.location.href = 'login.html'; // Redirect to the login page
                    }
                }
            ]
        });
    };

    /* ---------- Toast messages (small notes such as "You are logged out.") ---------- */
    var toastEl = null;
    var toastTimer;

    window.petToast = function (msg) {
        if (!toastEl) {
            toastEl = document.createElement('div');
            toastEl.className = 'pet-toast';
            toastEl.setAttribute('role', 'status');
            toastEl.setAttribute('aria-live', 'polite');
            document.body.appendChild(toastEl);
        }
        toastEl.textContent = msg;
        void toastEl.offsetWidth; // restart the transition
        toastEl.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 3400);
    };

    // Save a message to show on the NEXT page (used right before a redirect)
    window.petFlash = function (msg) {
        try { sessionStorage.setItem('petFlash', msg); } catch (e) {}
    };

    function showPendingFlash() {
        var m = null;
        try { m = sessionStorage.getItem('petFlash'); sessionStorage.removeItem('petFlash'); } catch (e) {}
        if (m) { window.petToast(m); }
    }

    /* ---------- 2) Dino, the pet dinosaur ---------- */
    var W = 92;                       // dino width in pixels
    var H = 80;                       // dino height in pixels
    var SPEED = 60;                   // walking speed (pixels per second)
    var SAYINGS = [
        "Hi! I'm Dino! \uD83E\uDD96", 'Hero Dino, at your service!', 'Whoosh! Whoosh!', 'Wanna see me swing?',
        'Catch me if you can!', "You're doing great! \uD83C\uDF1F", 'Remember to take a little break!',
        'Keep coding, I believe in you!', 'Need a snack? \uD83C\uDF6A', 'Debugging is just a puzzle \uD83E\uDDE9', 'Stay hydrated! \uD83D\uDCA7'
    ];

    // Dino is a little swinging hero with his own mask, scarf and paw-print badge.
    // Change these colors to give him a different suit:
    var C = { suit: '#17171C', edge: '#3A3A46', belly: '#262630', accent: '#E8283D', light: '#F6F4F0', dark: '#0A0A0D' };

    // paw-print badge on his chest
    var badge =
        '<g transform="translate(60 77)" fill="' + C.accent + '">' +
        '<ellipse cx="0" cy="2" rx="4.4" ry="3.4"/>' +
        '<circle cx="-5" cy="-3.2" r="1.9"/><circle cx="0" cy="-5" r="2.1"/><circle cx="5" cy="-3.2" r="1.9"/></g>';

    function leg(cls, x) {
        return '<g class="leg ' + cls + '"><rect x="' + x + '" y="84" width="14" height="16" rx="7" fill="' + C.suit + '" stroke="' + C.edge + '" stroke-width="2.2"/>' +
               '<rect x="' + (x + 1.2) + '" y="91" width="11.6" height="8.4" rx="4" fill="' + C.accent + '" stroke="' + C.edge + '" stroke-width="1.6"/></g>';
    }

    var svg =
        '<svg viewBox="0 0 120 104" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
        '<defs><clipPath id="dinoClipHead"><ellipse cx="88" cy="46" rx="26" ry="22"/></clipPath></defs>' +
        '<g class="dino-tail"><path d="M36 62 Q10 66 4 44 Q22 46 42 54 Z" fill="' + C.suit + '" stroke="' + C.edge + '" stroke-width="2.2" stroke-linejoin="round"/>' +
        '<path d="M15 51 L21 44" stroke="' + C.accent + '" stroke-width="3" stroke-linecap="round" fill="none"/></g>' +
        leg('leg-a', 40) + leg('leg-b', 66) +
        '<g class="dino-body">' +
        '<path d="M38 52 L44 36 L52 48 L60 32 L68 46 L76 36 L80 52 Z" fill="' + C.accent + '" stroke="' + C.edge + '" stroke-width="2.2" stroke-linejoin="round"/>' +
        '<ellipse cx="58" cy="68" rx="32" ry="24" fill="' + C.suit + '" stroke="' + C.edge + '" stroke-width="2.2"/>' +
        '<ellipse cx="66" cy="75" rx="17" ry="14" fill="' + C.belly + '"/>' +
        badge +
        '<g class="scarf-flap"><path d="M66 62 Q52 54 36 60 Q44 66 52 64 Q58 68 64 68 Z" fill="' + C.accent + '"/></g>' +
        '<ellipse class="arm-down" cx="72" cy="72" rx="6" ry="4" transform="rotate(-20 72 72)" fill="' + C.accent + '" stroke="' + C.edge + '" stroke-width="2"/>' +
        '<g class="arm-up"><path d="M62 66 L51 36" stroke="' + C.edge + '" stroke-width="10" stroke-linecap="round" fill="none"/>' +
        '<path d="M62 66 L51 36" stroke="' + C.suit + '" stroke-width="6" stroke-linecap="round" fill="none"/>' +
        '<circle cx="51" cy="34" r="5.2" fill="' + C.accent + '" stroke="' + C.edge + '" stroke-width="2"/></g>' +
        '<path d="M76 30 L80 18 L86 27 L91 15 L96 27 L102 18 L103 31 Z" fill="' + C.accent + '" stroke="' + C.edge + '" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<ellipse cx="88" cy="46" rx="26" ry="22" fill="' + C.suit + '" stroke="' + C.edge + '" stroke-width="2.2"/>' +
        '<path d="M63 58 Q74 72 90 68" stroke="' + C.accent + '" stroke-width="7" stroke-linecap="round" fill="none"/>' +
        '<g clip-path="url(#dinoClipHead)"><path d="M62 42 Q70 34 80 38 Q88 41 96 38 Q106 34 114 42 L114 50 Q108 56 100 54 Q94 53 91 49 Q88 46 85 49 Q82 53 76 54 Q68 56 62 50 Z" fill="' + C.accent + '"/></g>' +
        '<ellipse cx="72" cy="60" rx="4" ry="2.6" fill="' + C.accent + '" opacity=".45"/><ellipse cx="104" cy="60" rx="4" ry="2.6" fill="' + C.accent + '" opacity=".45"/>' +
        '<g class="dino-eyes">' +
        '<ellipse cx="77" cy="45" rx="6.4" ry="5.4" transform="rotate(10 77 45)" fill="' + C.light + '" stroke="' + C.dark + '" stroke-width="1.6"/>' +
        '<ellipse cx="99" cy="45" rx="6.4" ry="5.4" transform="rotate(-10 99 45)" fill="' + C.light + '" stroke="' + C.dark + '" stroke-width="1.6"/>' +
        '<circle cx="78.4" cy="46" r="3" fill="' + C.dark + '"/><circle cx="100.4" cy="46" r="3" fill="' + C.dark + '"/>' +
        '<circle cx="79.6" cy="44.6" r="1" fill="#fff"/><circle cx="101.6" cy="44.6" r="1" fill="#fff"/></g>' +
        '<path d="M83 60 Q88 64.5 93 60" fill="none" stroke="' + C.light + '" stroke-width="2" stroke-linecap="round"/>' +
        '</g></svg>';

    var dino = document.createElement('div');
    dino.className = 'dino-pet';
    dino.id = 'dinoPet';
    dino.setAttribute('role', 'button');
    dino.tabIndex = 0;
    dino.setAttribute('aria-label', 'Pet dinosaur. Press to say hi.');
    dino.innerHTML = '<div class="dino-bubble" role="status" aria-live="polite"></div>' +
                     '<div class="dino-flip"><div class="dino-hop">' + svg + '</div></div>';
    var bubble = dino.querySelector('.dino-bubble');
    var flip = dino.querySelector('.dino-flip');

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var x = 0, y = 0, tx = 0, ty = 0, dir = 1, mode = 'idle', busyUntil = 0, last = 0, sw = null;
    var bubbleTimer, idleTimer, chatTimer, moveTimer;
    var zoneQueue = [];
    var HX = 39, HY = 22; // where the swing line leaves his raised hand (pixels from the dino's top-left corner)

    // The swing line is a thin line drawn over the whole screen
    var SVGNS = 'http://www.w3.org/2000/svg';
    var lineSvg = document.createElementNS(SVGNS, 'svg');
    lineSvg.setAttribute('class', 'dino-line');
    lineSvg.setAttribute('aria-hidden', 'true');
    var lineEl = document.createElementNS(SVGNS, 'line');
    var hookDot = document.createElementNS(SVGNS, 'circle');
    hookDot.setAttribute('r', '3.5');
    lineSvg.appendChild(lineEl);
    lineSvg.appendChild(hookDot);

    function vw() { return document.documentElement.clientWidth || window.innerWidth || 800; }
    function vh() { return document.documentElement.clientHeight || window.innerHeight || 600; }
    function rand(a, b) { return a + Math.random() * (b - a); }
    function maxX() { return Math.max(8, vw() - W - 8); }
    function maxY() { return Math.max(8, vh() - H - 8); }
    function handX(d) { return d > 0 ? HX : W - HX; }
    function place(rot) {
        dino.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)' + (rot ? ' rotate(' + rot.toFixed(1) + 'deg)' : '');
    }
    function face(d) {
        if (d === dir && flip.style.transform) { return; }
        dir = d;
        flip.style.transform = d < 0 ? 'scaleX(-1)' : 'none';
    }
    function setWalking(on) { dino.classList.toggle('walking', on); }
    function setLine(x1, y1, x2, y2) {
        lineEl.setAttribute('x1', x1); lineEl.setAttribute('y1', y1);
        lineEl.setAttribute('x2', x2); lineEl.setAttribute('y2', y2);
        hookDot.setAttribute('cx', x2); hookDot.setAttribute('cy', y2);
    }

    function say(text, ms) {
        bubble.textContent = text;
        var bw = Math.min(180, bubble.offsetWidth || 150);
        var c = x + W / 2, l = c - bw / 2, r = c + bw / 2, shift = 0;
        if (l < 8) { shift = 8 - l; } else if (r > vw() - 8) { shift = vw() - 8 - r; }
        bubble.style.setProperty('--bx', shift + 'px');
        bubble.classList.toggle('below', y < 80); // near the top of the screen the bubble opens downward
        bubble.classList.add('show');
        busyUntil = Date.now() + (ms || 3200);
        clearTimeout(bubbleTimer);
        bubbleTimer = setTimeout(function () { bubble.classList.remove('show'); }, ms || 3200);
    }

    function sayRandom() { say(SAYINGS[Math.floor(Math.random() * SAYINGS.length)]); }

    function hop() {
        dino.classList.remove('hop');
        void dino.offsetWidth; // restart the animation
        dino.classList.add('hop');
        setTimeout(function () { dino.classList.remove('hop'); }, 650);
    }

    // Dino visits every part of the page: top, bottom, left side, right side and the middle
    function pickZone() {
        if (!zoneQueue.length) {
            zoneQueue = ['top', 'bottom', 'left', 'right', 'middle'];
            for (var i = zoneQueue.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var t = zoneQueue[i]; zoneQueue[i] = zoneQueue[j]; zoneQueue[j] = t;
            }
        }
        return zoneQueue.pop();
    }

    function pickTarget() {
        var mx = maxX(), my = maxY(), px, py, tries = 0, p;
        do {
            var z = pickZone();
            if (z === 'top') { py = rand(8, Math.min(my, 70)); px = rand(8, mx); }
            else if (z === 'bottom') { py = rand(Math.max(8, my - 60), my); px = rand(8, mx); }
            else if (z === 'left') { px = rand(8, Math.min(mx, 70)); py = rand(8, my); }
            else if (z === 'right') { px = rand(Math.max(8, mx - 70), mx); py = rand(8, my); }
            else { px = rand(mx * 0.3, mx * 0.7); py = rand(my * 0.3, my * 0.7); }
            p = { x: px, y: py };
            tries++;
        } while (tries < 6 && Math.abs(p.x - x) + Math.abs(p.y - y) < 120);
        return p;
    }

    // Plan a swing from where he is to the target. The line holds on to a point above
    // both spots and he swings on it like a pendulum. Returns null if there is no room.
    function planSwing(T) {
        var d = dir;
        var hsx = x + handX(d), hsy = y + HY, htx = T.x + handX(d), hty = T.y + HY;
        var dist = Math.sqrt((htx - hsx) * (htx - hsx) + (hty - hsy) * (hty - hsy));
        var limitY = vh() - 8 - (H - HY);       // the lowest his hand may go (so he never leaves the screen)
        var mx = (hsx + htx) / 2, top = Math.min(hsy, hty);
        var h0 = Math.max(190, Math.min(420, dist * 0.45 + 140));
        for (var k = 0; k < 8; k++) {
            var h = h0 * (1 + k * 0.45);
            if (h > 1500) { break; }
            var A = { x: mx, y: top - h };
            var rs = Math.sqrt((hsx - A.x) * (hsx - A.x) + (hsy - A.y) * (hsy - A.y));
            var rt = Math.sqrt((htx - A.x) * (htx - A.x) + (hty - A.y) * (hty - A.y));
            var ts = Math.atan2(hsx - A.x, hsy - A.y), te = Math.atan2(htx - A.x, hty - A.y);
            var low = 0;
            for (var i = 0; i <= 24; i++) {
                var u = i / 24, th = ts + (te - ts) * u, r = rs + (rt - rs) * u;
                low = Math.max(low, A.y + r * Math.cos(th));
            }
            if (low <= limitY) {
                var arc = (rs + rt) / 2 * Math.abs(te - ts) + Math.abs(rt - rs);
                return { A: A, rs: rs, rt: rt, ts: ts, te: te, dur: Math.max(0.8, Math.min(2.0, arc / 520)), target: T, dir: d, shootT: 0, t: 0 };
            }
        }
        return null;
    }

    function startSwing(plan) {
        sw = plan;
        mode = 'shoot';
        setWalking(false);
        dino.classList.add('swinging');
        dino.style.transformOrigin = handX(plan.dir) + 'px ' + HY + 'px';
        lineSvg.style.opacity = '1';
        say('Whoosh! \u2728', 900);
    }

    function endSwing() {
        x = sw.target.x; y = sw.target.y;
        dino.classList.remove('swinging');
        dino.style.transformOrigin = '';
        place(0);
        lineSvg.style.opacity = '0'; // he lets go of the line
        sw = null;
        hop();
        goIdle();
    }

    function goIdle() {
        mode = 'idle';
        setWalking(false);
        clearTimeout(idleTimer);
        idleTimer = setTimeout(nextMove, rand(1500, 4200));
    }

    function nextMove() {
        if (Date.now() < busyUntil) { idleTimer = setTimeout(nextMove, 600); return; }
        var p = pickTarget();
        tx = p.x; ty = p.y;
        face(tx > x ? 1 : -1);
        var dist = Math.abs(tx - x) + Math.abs(ty - y);
        if (dist > 260) {                       // long way: swing on a line
            var plan = planSwing(p);
            if (plan) { startSwing(plan); return; }
        }
        if (Math.random() < 0.25) { hop(); }
        mode = 'walk';
        setWalking(true);
    }

    function frame(t) {
        var dt = Math.min(0.05, ((t || 0) - last) / 1000);
        last = t || 0;
        if (mode === 'shoot') {
            sw.shootT += dt;
            var k = Math.min(1, sw.shootT / 0.18);   // the line shoots up to the anchor
            var hx = x + handX(sw.dir), hy = y + HY;
            setLine(hx, hy, hx + (sw.A.x - hx) * k, hy + (sw.A.y - hy) * k);
            if (k >= 1) { mode = 'swing'; }
        } else if (mode === 'swing') {
            sw.t += dt / sw.dur;
            var tt = Math.min(1, sw.t), u = 0.5 - 0.5 * Math.cos(Math.PI * tt);
            var th = sw.ts + (sw.te - sw.ts) * u, r = sw.rs + (sw.rt - sw.rs) * u;
            var px = sw.A.x + r * Math.sin(th), py = sw.A.y + r * Math.cos(th);
            x = px - handX(sw.dir); y = py - HY;
            setLine(px, py, sw.A.x, sw.A.y);
            place(Math.max(-30, Math.min(30, -th * 180 / Math.PI * 0.8))); // his body leans along the line
            if (tt >= 1) { endSwing(); }
        } else if (mode === 'walk' && Date.now() >= busyUntil) {
            var dx = tx - x, dy = ty - y, dist = Math.sqrt(dx * dx + dy * dy), step = SPEED * dt;
            if (dist <= step) {
                x = tx; y = ty;
                goIdle();
            } else {
                x += dx / dist * step;
                y += dy / dist * step;
                if (Math.abs(dx) > 6) { face(dx > 0 ? 1 : -1); }
            }
            place(0);
        }
        requestAnimationFrame(frame);
    }

    // The dino pops up at a random place; every so often it pops out and back in somewhere else
    function popUp() {
        x = rand(8, maxX());
        y = rand(8, maxY());
        tx = x; ty = y;
        place(0);
        dino.style.visibility = '';
        face(Math.random() < 0.5 ? 1 : -1);
        dino.classList.remove('pop-out');
        dino.classList.add('pop-in');
        setTimeout(function () { dino.classList.remove('pop-in'); }, 700);
    }

    function relocate() {
        if (document.hidden || Date.now() < busyUntil || mode === 'shoot' || mode === 'swing') { moveTimer = setTimeout(relocate, 4000); return; }
        clearTimeout(idleTimer);
        mode = 'idle';
        setWalking(false);
        dino.classList.add('pop-out');
        setTimeout(function () {
            popUp();
            goIdle();
            moveTimer = setTimeout(relocate, rand(40000, 70000));
        }, 380);
    }

    function chat() {
        if (!document.hidden && Date.now() >= busyUntil && mode !== 'shoot' && mode !== 'swing') { sayRandom(); }
        chatTimer = setTimeout(chat, rand(20000, 35000));
    }

    function poke() {
        if (!reduce) { hop(); }
        sayRandom();
    }

    // The dino never blocks the page: clicks go straight through him to buttons and links.
    // A click on empty page area right where he stands (or Enter when he is focused) pokes him.
    var INTERACTIVE = 'a,button,input,textarea,select,label,summary,[role="button"],[onclick],.funfact-card,.thumbnail,.lightbox,.pet-overlay';
    document.addEventListener('click', function (e) {
        if (dino.style.visibility === 'hidden' || document.querySelector('.pet-overlay')) { return; }
        var r = dino.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) { return; }
        if (e.target && e.target.closest && e.target.closest(INTERACTIVE)) { return; }
        poke();
    });
    dino.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); poke(); }
    });

    window.addEventListener('resize', function () {
        if (mode === 'shoot' || mode === 'swing') { return; }
        x = Math.min(x, maxX()); y = Math.min(y, maxY());
        tx = Math.min(tx, maxX()); ty = Math.min(ty, maxY());
        place(0);
    });

    function start() {
        document.body.appendChild(lineSvg);
        document.body.appendChild(dino);
        if (!reduce) { dino.style.visibility = 'hidden'; } // hidden until it pops up
        if (reduce) {            // no walking or swinging for people who prefer less motion
            x = maxX(); y = maxY();
            place(0);
            return;
        }
        setTimeout(function () {
            popUp();
            say("Hi! I'm Dino! \uD83E\uDD96", 3500);
            setTimeout(goIdle, 1200);
            requestAnimationFrame(frame);
            moveTimer = setTimeout(relocate, rand(40000, 70000));
            chatTimer = setTimeout(chat, rand(20000, 35000));
        }, 900);
    }

    /* ---------- 3) Click ripple on every button ---------- */
    var RIPPLE = '.see-more-button,.contact-form button,.logout-button,.tab button,.theme-toggle,nav ul li a,.slide-arrow,.close,.prev,.next,#authForm button,.pet-btn';
    document.addEventListener('pointerdown', function (e) {
        if (e.button > 0 || !e.target || !e.target.closest) { return; }
        var el = e.target.closest(RIPPLE);
        if (!el || el.disabled) { return; }
        var r = el.getBoundingClientRect();
        var size = Math.max(r.width, r.height) * 2;
        var dot = document.createElement('span');
        dot.className = 'btn-ripple';
        dot.style.width = size + 'px';
        dot.style.height = size + 'px';
        dot.style.left = (e.clientX - r.left - size / 2) + 'px';
        dot.style.top = (e.clientY - r.top - size / 2) + 'px';
        el.appendChild(dot);
        setTimeout(function () { if (dot.parentNode) { dot.parentNode.removeChild(dot); } }, 650);
    });

    function init() { showPendingFlash(); start(); }
    if (document.body) { init(); } else { document.addEventListener('DOMContentLoaded', init); }
})();