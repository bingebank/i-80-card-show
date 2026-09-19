/* ==========================================================================
   I-80 Card Show — help bubble

   A scripted FAQ assistant. No AI, no account, no network calls: it matches
   what someone types against the keyword lists below and replies with a
   canned answer. Everything it can say is in ANSWERS — edit that and you
   have edited the bot.

   Adding a question: copy an entry, give it an id, some keywords people
   would actually type, and the reply. Put it above the more general
   entries if it should win ties.
   ========================================================================== */
(function () {
  'use strict';

  var IG = 'https://www.instagram.com/i80card_show/';

  /* ------------------------------------------------------------ Answers ---- */

  var ANSWERS = [
    {
      id: 'admission',
      keywords: ['admission', 'how much to get in', 'entry', 'ticket', 'cost to get in',
                 'price to get in', 'door', 'cover charge', 'how much is it', 'entrance'],
      reply: '<strong>$10 at the door.</strong> Kids 10 and under get in free with a paying adult. ' +
             'No advance tickets — just turn up.'
    },
    {
      id: 'kids',
      keywords: ['kid', 'kids', 'child', 'children', 'family', 'son', 'daughter', 'age limit', 'under'],
      reply: 'Kids are very welcome — <strong>10 and under get in free</strong> with a paying adult. ' +
             'Plenty of tables run dollar bins, and dealers are good with young collectors.'
    },
    {
      id: 'dates',
      keywords: ['when', 'date', 'dates', 'what day', 'next show', 'schedule', 'upcoming', 'time of year'],
      reply: 'The date isn’t announced yet — we’re locking in the venue first, and the date goes ' +
             'out the day it’s signed. <a href="/#dates">Leave your email here</a> and you’ll ' +
             'hear it first, or follow <a href="' + IG + '" target="_blank" rel="noopener">@i80card_show</a>.'
    },
    {
      id: 'venue',
      keywords: ['where', 'venue', 'location', 'address', 'directions', 'held', 'place', 'hall',
                 'parking', 'map', 'sacramento'],
      reply: 'Sacramento area, right off I-80 — the exact hall is being finalised right now. ' +
             'We’ll post the address here and on <a href="' + IG + '" target="_blank" rel="noopener">@i80card_show</a> ' +
             'the moment it’s signed.'
    },
    {
      id: 'hours',
      keywords: ['hours', 'what time', 'open', 'opening', 'close', 'closing', 'doors', 'start', 'end'],
      reply: 'Doors open at <strong>9:00 AM</strong> and the show closes at <strong>3:00 PM</strong>. ' +
             'Vendors set up beforehand. Exact times get confirmed with the venue.'
    },
    {
      id: 'table',
      keywords: ['table', 'tables', 'vendor', 'dealer', 'sell', 'selling', 'booth', 'set up', 'setup',
                 'how much for a table', 'rent'],
      reply: 'Tables are <strong>$200 each</strong> (8’ table, two chairs, two dealer admissions, ' +
             'early setup). We cap the room at 50+ tables. ' +
             '<a href="/vendors#reserve">Sign up here</a> and we’ll confirm your spot.'
    },
    {
      id: 'permit',
      keywords: ['permit', 'seller permit', 'tax', 'cdtfa', 'license', 'resale', 'legal'],
      reply: 'California requires every seller at the show to hold a CDTFA seller’s permit, and ' +
             'requires us to keep it on file. You enter it on the ' +
             '<a href="/vendors#reserve">vendor sign-up form</a> — put “applying” if yours ' +
             'is still in progress.'
    },
    {
      id: 'what-sold',
      keywords: ['what do you sell', 'what is there', 'what kind', 'pokemon', 'pokémon', 'tcg',
                 'magic', 'yugioh', 'yu-gi-oh', 'one piece', 'lorcana', 'sealed', 'slab', 'graded',
                 'packs', 'singles', 'supplies', 'accessories', 'what will be there', 'vintage'],
      reply: 'Pokémon is the biggest section by far — vintage WOTC through the newest sets. ' +
             'You’ll also find One Piece, Magic, Yu-Gi-Oh!, Lorcana and other TCGs, plus sealed ' +
             'product, graded slabs, packs, singles, dollar bins and supplies.'
    },
    {
      id: 'sports',
      keywords: ['sport', 'sports', 'baseball', 'football', 'basketball', 'hockey', 'jersey',
                 'memorabilia'],
      reply: 'This is a trading card show — <strong>no sports cards</strong> and no general ' +
             'collectibles. Pokémon and other TCGs only.'
    },
    {
      id: 'payment',
      keywords: ['cash', 'card', 'venmo', 'zelle', 'paypal', 'payment', 'pay', 'atm', 'credit'],
      reply: 'Bring cash — it moves fastest and gets you the best price. Most dealers also take ' +
             'Venmo, Zelle, PayPal or cards.'
    },
    {
      id: 'selling-mine',
      keywords: ['sell my', 'buy my', 'buying', 'collection', 'appraise', 'value', 'offer', 'cash out'],
      reply: 'Yes — plenty of dealers buy on the spot, singles through full collections. Bring what ' +
             'you’ve got and work the room for the best offer. If you want to sell in volume, ' +
             'a <a href="/vendors#reserve">table</a> usually pays for itself.'
    },
    {
      id: 'trade',
      keywords: ['trade', 'trading', 'swap', 'binder'],
      reply: 'Trading is welcome — it happens across every table, and there’s open space up front ' +
             'for collectors who just want to swap. Bring your binder.'
    },
    {
      id: 'fakes',
      keywords: ['fake', 'proxy', 'counterfeit', 'reprint', 'altered', 'authentic', 'real'],
      reply: 'Counterfeit, proxy and altered cards are banned at every table, no exceptions. If you’re ' +
             'ever unsure about something you bought at the show, bring it to the front table.'
    },
    {
      id: 'contact',
      keywords: ['contact', 'email', 'phone', 'call', 'reach', 'message', 'talk to', 'question',
                 'instagram', 'dm', 'social'],
      reply: 'DM us on <a href="' + IG + '" target="_blank" rel="noopener">@i80card_show</a> — ' +
             'that’s the quickest. You can also email ' +
             '<a href="mailto:info@i80cardshow.com">info@i80cardshow.com</a>.'
    }
  ];

  var GREETING = 'Hi! I can answer the common questions about the show. Tap one below, or type your own.';

  var FALLBACK = 'I don’t have an answer for that one. DM us on ' +
    '<a href="' + IG + '" target="_blank" rel="noopener">@i80card_show</a> and a human will get back ' +
    'to you — or try one of these:';

  var CHIPS = [
    { label: 'How much to get in?', id: 'admission' },
    { label: 'When is it?', id: 'dates' },
    { label: 'Where is it?', id: 'venue' },
    { label: 'How much is a table?', id: 'table' },
    { label: 'What’s being sold?', id: 'what-sold' }
  ];

  /* ------------------------------------------------------------ Matching ---- */

  function normalise(text) {
    return (' ' + text.toLowerCase() + ' ')
      .replace(/[^a-z0-9é ]+/g, ' ')
      .replace(/\s+/g, ' ');
  }

  // Score each answer by how much of its keyword list appears in the question.
  // Longer keywords count for more, so "how much is a table" beats "much".
  function findAnswer(question) {
    var text = normalise(question);
    var best = null;
    var bestScore = 0;

    ANSWERS.forEach(function (entry) {
      var score = 0;
      entry.keywords.forEach(function (keyword) {
        var needle = normalise(keyword).trim();
        if (!needle) return;
        if (text.indexOf(' ' + needle + ' ') !== -1 || text.indexOf(' ' + needle) !== -1) {
          score += needle.length;
        }
      });
      if (score > bestScore) { bestScore = score; best = entry; }
    });

    return bestScore >= 3 ? best : null;
  }

  function answerById(id) {
    for (var i = 0; i < ANSWERS.length; i++) {
      if (ANSWERS[i].id === id) return ANSWERS[i];
    }
    return null;
  }

  /* ---------------------------------------------------------------- UI ---- */

  function build() {
    var root = document.createElement('div');
    root.className = 'chat';
    root.innerHTML =
      '<button class="chat__toggle" type="button" aria-expanded="false" aria-controls="chat-panel">' +
        '<svg class="chat__icon-open" viewBox="0 0 24 24" aria-hidden="true">' +
          '<path d="M12 3c5 0 9 3.3 9 7.4 0 4.1-4 7.4-9 7.4a11 11 0 0 1-2.3-.2l-4.3 2.3a.6.6 0 0 1-.9-.6l.5-3.3C3 14.7 3 12.8 3 10.4 3 6.3 7 3 12 3Z"/>' +
        '</svg>' +
        '<svg class="chat__icon-close" viewBox="0 0 24 24" aria-hidden="true">' +
          '<path d="M6.4 5 19 17.6 17.6 19 5 6.4 6.4 5Z"/><path d="M17.6 5 19 6.4 6.4 19 5 17.6 17.6 5Z"/>' +
        '</svg>' +
        '<span class="chat__toggle-label">Questions?</span>' +
      '</button>' +

      '<div class="chat__panel" id="chat-panel" role="dialog" aria-label="Show questions" hidden>' +
        '<div class="chat__head">' +
          '<span class="chat__title">Ask about the show</span>' +
          '<button class="chat__close" type="button" aria-label="Close">&times;</button>' +
        '</div>' +
        '<div class="chat__log" id="chat-log" role="log" aria-live="polite"></div>' +
        '<form class="chat__form" autocomplete="off">' +
          '<label class="visually-hidden" for="chat-input">Type your question</label>' +
          '<input class="chat__input" id="chat-input" type="text" placeholder="Type a question…">' +
          '<button class="chat__send" type="submit" aria-label="Send">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12.6 2-12.6 2v6.4Z"/></svg>' +
          '</button>' +
        '</form>' +
      '</div>';

    document.body.appendChild(root);
    return root;
  }

  function init() {
    if (document.querySelector('.chat')) return;

    var root = build();
    var toggle = root.querySelector('.chat__toggle');
    var panel = root.querySelector('.chat__panel');
    var closeBtn = root.querySelector('.chat__close');
    var log = root.querySelector('.chat__log');
    var form = root.querySelector('.chat__form');
    var input = root.querySelector('.chat__input');

    // Lift the bubble above the sticky action bar on phones.
    if (document.querySelector('.cta-bar')) root.classList.add('chat--above-bar');

    function scrollDown() { log.scrollTop = log.scrollHeight; }

    function addMessage(html, who) {
      var msg = document.createElement('div');
      msg.className = 'chat__msg chat__msg--' + who;
      msg.innerHTML = html;
      log.appendChild(msg);
      scrollDown();
      return msg;
    }

    function addChips(list) {
      var wrap = document.createElement('div');
      wrap.className = 'chat__chips';
      list.forEach(function (chip) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'chat__chip';
        b.textContent = chip.label;
        b.addEventListener('click', function () {
          ask(chip.label, answerById(chip.id));
        });
        wrap.appendChild(b);
      });
      log.appendChild(wrap);
      scrollDown();
    }

    // Reply after a short beat so it reads as a conversation, not a page jump.
    function reply(html, chips) {
      var typing = addMessage('<span class="chat__dots"><i></i><i></i><i></i></span>', 'bot');
      window.setTimeout(function () {
        typing.innerHTML = html;
        scrollDown();
        if (chips) addChips(chips);
      }, 350);
    }

    function ask(question, known) {
      addMessage(document.createTextNode(question).textContent, 'user');
      var entry = known || findAnswer(question);
      if (entry) {
        reply(entry.reply);
      } else {
        reply(FALLBACK, CHIPS);
      }
    }

    var started = false;
    function start() {
      if (started) return;
      started = true;
      reply(GREETING, CHIPS);
    }

    function open() {
      panel.hidden = false;
      root.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      start();
      window.setTimeout(function () { input.focus(); }, 60);
    }

    function close() {
      panel.hidden = true;
      root.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }

    toggle.addEventListener('click', function () {
      if (root.classList.contains('is-open')) close(); else open();
    });
    closeBtn.addEventListener('click', close);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('is-open')) close();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var question = input.value.trim();
      if (!question) return;
      input.value = '';
      ask(question);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
