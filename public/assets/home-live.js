(function () {
  'use strict';

  var SUPPORTED = new Set(['SPY', 'QQQ', 'DIA', 'IWM', 'OXY', 'RKLB', 'GRPN', 'UMC', 'ONDS', 'NVDA', 'TSLA', 'SOFI', 'PLTR', 'RGTI', 'IONQ', 'ACHR', 'AMD', 'COIN', 'HOOD', 'LQDA', 'SMCI', 'SOUN', 'OPEN', 'FOSL', 'SLS']);
  var OPTIONS_SUPPORTED = new Set(['SPY', 'QQQ', 'DIA', 'IWM', 'OXY', 'RKLB', 'GRPN', 'UMC', 'ONDS', 'NVDA', 'TSLA', 'SOFI', 'PLTR', 'FOSL', 'SLS']);
  var INDEXES = ['SPY', 'QQQ', 'DIA', 'IWM'];
  var PACKETS = [
    '/data/market_packet.json',
    '/data/market_trust.json',
    '/data/market_internals.json',
    '/data/catalyst_tape.json',
    '/data/leap_summary.json'
  ];

  function byId(id) { return document.getElementById(id); }
  function isObject(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
  function finite(value) { return Number.isFinite(Number(value)) ? Number(value) : null; }
  function decimal(value, digits) {
    var number = finite(value);
    return number === null ? '—' : number.toFixed(digits);
  }
  function array(value) {
    if (Array.isArray(value)) return value;
    if (value && typeof value.length === 'number') return Array.prototype.slice.call(value);
    return [];
  }
  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }
  function safeHttpsUrl(value) {
    try {
      var url = new URL(String(value));
      return url.protocol === 'https:' ? url.href : null;
    } catch (error) { return null; }
  }
  function supportedRoute(symbol, optionsIntent) {
    if (!SUPPORTED.has(symbol)) return '/screener/?ticker=' + encodeURIComponent(symbol);
    if (optionsIntent && OPTIONS_SUPPORTED.has(symbol)) return '/options/' + symbol.toLowerCase() + '/';
    if (optionsIntent) return '/screener/?ticker=' + encodeURIComponent(symbol);
    return '/ticker/' + symbol.toLowerCase() + '/';
  }
  function setMove(node, value) {
    var number = finite(value);
    node.textContent = number === null ? '—' : (number >= 0 ? '+' : '') + number.toFixed(2) + '%';
    node.classList.remove('pos', 'neg');
    if (number !== null) node.classList.add(number >= 0 ? 'pos' : 'neg');
  }
  function price(value) {
    var number = finite(value);
    return number === null ? '—' : number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function compact(value) {
    var number = finite(value);
    if (number === null) return '—';
    return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(number);
  }
  function marketTime(value) {
    var date = new Date(value);
    if (!Number.isFinite(date.getTime())) return null;
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York', month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit', timeZoneName: 'short'
      }).format(date);
    } catch (error) { return date.toISOString(); }
  }
  function fetchJson(url) {
    return window.fetch(url, { cache: 'no-cache', credentials: 'same-origin' }).then(function (response) {
      if (!response.ok) throw new Error('packet unavailable');
      return response.json();
    });
  }
  function setTrust(state, text) {
    var status = byId('market-trust-status');
    var label = byId('market-trust-label');
    if (!status || !label) return;
    status.classList.remove('is-fresh', 'is-delayed', 'is-stale', 'is-unknown', 'is-unavailable');
    status.classList.add('is-' + state);
    label.textContent = text;
  }
  function renderTrust(trust) {
    if (!isObject(trust)) { setTrust('unavailable', 'Data unavailable · stale'); return; }
    var state = String(trust.packet_state || '').toLowerCase();
    if (state === 'fresh') setTrust('fresh', 'Fresh snapshot');
    else if (state === 'delayed' || state === 'mixed_freshness') setTrust('delayed', 'Delayed snapshot');
    else setTrust('stale', 'Stale snapshot');
    var source = byId('market-trust-source');
    if (source) source.textContent = (trust.source || 'Polygon') + ' · tracked US equities';
    var packet = array(trust.source_packets).find(function (row) { return row && row.packet === 'market_packet.json'; });
    var stamp = packet && marketTime(packet.source_timestamp || trust.generated_at);
    if (stamp && byId('market-as-of')) byId('market-as-of').textContent = 'As of ' + stamp;
  }
  function deskLabel(session) {
    var state = String(session && session.state || '').toLowerCase();
    if (state === 'pre_market' || state === 'premarket') return 'Premarket Desk';
    if (state === 'regular' || state === 'open' || state === 'market_open') return 'Live Desk';
    if (state === 'after_hours' || state === 'post_market') return 'After-Hours Desk';
    return 'Closing Edition';
  }
  function renderRail(tickers) {
    var rail = byId('ticker-rail');
    if (!rail || !isObject(tickers)) return;
    array(rail.querySelectorAll('.pill:not(.morepill)')).forEach(function (pill) {
      var symbolNode = pill.querySelector('.sym');
      var quote = symbolNode && tickers[symbolNode.textContent.trim()];
      var spans = pill.querySelectorAll('span');
      if (!quote) {
        if (spans[1]) spans[1].textContent = '—';
        if (spans[2]) setMove(spans[2], null);
        return;
      }
      if (spans[1]) spans[1].textContent = price(quote.last);
      if (spans[2]) setMove(spans[2], quote.change_pct);
    });
  }
  function sparkPoints(values) {
    var clean = array(values).map(finite).filter(function (value) { return value !== null; });
    if (clean.length < 2) return null;
    var low = Math.min.apply(null, clean), high = Math.max.apply(null, clean), span = high - low || 1;
    return clean.map(function (value, index) {
      return (index * 240 / (clean.length - 1)).toFixed(1) + ',' + (57 - ((value - low) / span * 50)).toFixed(1);
    }).join(' ');
  }
  function renderIndexes(tickers) {
    INDEXES.forEach(function (symbol) {
      var card = document.querySelector('[data-index="' + symbol + '"]');
      var quote = tickers && tickers[symbol];
      if (!card) return;
      var change = card.querySelector('.index-top span');
      var last = card.querySelector('.index-price');
      var meta = card.querySelectorAll('.index-meta span');
      var polyline = card.querySelector('polyline');
      if (!quote) {
        if (change) setMove(change, null);
        if (last) last.textContent = '—';
        if (meta[0]) meta[0].textContent = 'Vol —';
        if (meta[1]) meta[1].textContent = 'Range —';
        if (polyline) polyline.removeAttribute('points');
        return;
      }
      if (change) setMove(change, quote.change_pct);
      if (last) last.textContent = price(quote.last);
      if (meta[0]) meta[0].textContent = 'Vol ' + compact(array(quote.bars).slice(-1)[0] && array(quote.bars).slice(-1)[0].v);
      if (meta[1]) meta[1].textContent = 'Range ' + (finite(quote.range_pos) === null ? '—' : Math.round(Math.max(0, Math.min(1, quote.range_pos)) * 100) + '%');
      var points = sparkPoints(quote.sparkline_45d);
      if (polyline && points) polyline.setAttribute('points', points);
    });
  }
  function renderBriefing(packet, internals) {
    var cards = byId('briefing-grid');
    var ranked = array(packet.screeners && packet.screeners.watchlist_ranked);
    var gainers = array(packet.screeners && packet.screeners.top_movers);
    var breadth = internals && internals.breadth;
    var average = finite(breadth && breadth.index_basket_average_change_pct);
    var lead = ranked[0] || {};
    var leadQuote = packet.tickers && packet.tickers[lead.ticker] || {};
    var hot = gainers[0] || {};
    var copy = [
      ['Market tone', (average !== null && average >= 0 ? 'Risk-on' : 'Risk-off') + ' index basket at ' + (average === null ? '—' : (average >= 0 ? '+' : '') + average.toFixed(2) + '%') + '.'],
      ['Heat source', (hot.T || '—') + ' leads packet gainers at ' + (finite(hot.chg) === null ? '—' : (hot.chg >= 0 ? '+' : '') + Number(hot.chg).toFixed(2) + '%') + '.'],
      ['Shadowfax lead', (lead.ticker || '—') + ' leads the tracked screen; latest move ' + (finite(leadQuote.change_pct) === null ? '—' : (leadQuote.change_pct >= 0 ? '+' : '') + leadQuote.change_pct.toFixed(2) + '%') + ', screen score ' + decimal(lead.score, 1) + '.'],
      ['Structure watch', Object.keys(packet.options || {}).length + ' supported option chains are represented in this packet.']
    ];
    array(cards && cards.querySelectorAll('.brief-item')).forEach(function (card, index) {
      if (!copy[index]) return;
      card.querySelector('span').textContent = copy[index][0];
      card.querySelector('p').textContent = copy[index][1];
    });
  }
  function quoteLink(symbol, className) {
    var link = element('a', className);
    link.href = supportedRoute(symbol, false);
    return link;
  }
  function renderHot(rows, tickers) {
    var container = byId('hot-tickers-list');
    if (!container) return;
    if (!array(rows).length) { container.replaceChildren(element('p', 'data-state', 'Watch tape unavailable in this packet.')); return; }
    var fragment = document.createDocumentFragment();
    array(rows).slice(0, 6).forEach(function (row) {
      var symbol = String(row.ticker || '').toUpperCase();
      if (!symbol) return;
      var quote = tickers && tickers[symbol] || {};
      var link = quoteLink(symbol, 'hot-card');
      var info = element('div');
      info.append(element('b', '', symbol), element('span', '', 'Score ' + decimal(row.score, 1) + ' · RVOL ' + decimal(row.rvol, 1) + 'x'));
      var move = element('strong'); setMove(move, quote.change_pct);
      link.append(info, move, element('em', '', price(quote.last)));
      fragment.append(link);
    });
    container.replaceChildren(fragment);
  }
  function moverTable(title, rows) {
    var wrap = element('div'), table = element('table', 'home-table');
    wrap.append(element('h3', '', title));
    var thead = element('thead'), head = element('tr');
    ['Ticker', 'Last', 'Move', 'Vol'].forEach(function (label) { head.append(element('th', '', label)); });
    thead.append(head); table.append(thead);
    var tbody = element('tbody');
    array(rows).slice(0, 6).forEach(function (row) {
      var symbol = String(row.T || '').toUpperCase(), tr = element('tr'), tickerCell = element('td');
      var link = quoteLink(symbol, 'ticker'); link.href = supportedRoute(symbol, false); link.textContent = symbol;
      tickerCell.append(link); tr.append(tickerCell, element('td', '', price(row.c)));
      var moveCell = element('td'); setMove(moveCell, row.chg); tr.append(moveCell, element('td', '', compact(row.v))); tbody.append(tr);
    });
    table.append(tbody); wrap.append(table); return wrap;
  }
  function renderMovers(screeners) {
    var container = byId('mover-grid');
    if (!container) return;
    if (!screeners) { container.replaceChildren(element('p', 'data-state', 'Mover data unavailable in this packet.')); return; }
    container.replaceChildren(moverTable('Gainers', screeners.top_movers), moverTable('Losers', screeners.bottom_movers));
  }
  function renderShadow(rows, tickers) {
    var container = byId('shadowfax-list');
    if (!container) return;
    if (!array(rows).length) { container.replaceChildren(element('p', 'data-state', 'Tracked watchlist unavailable in this packet.')); return; }
    var fragment = document.createDocumentFragment();
    array(rows).slice(0, 6).forEach(function (row) {
      var symbol = String(row.ticker || '').toUpperCase(), link = quoteLink(symbol, 'lead-card');
      var quote = tickers && tickers[symbol] || {};
      var head = element('div', 'lead-head'); head.append(element('b', '', symbol), element('span', 'score hot', decimal(row.score, 1)));
      var line = element('div', 'lead-line'), move = element('span'); setMove(move, quote.change_pct);
      line.append(element('span', '', price(quote.last)), move, element('span', '', 'RVOL ' + decimal(row.rvol, 1) + 'x'));
      link.append(head, element('p', '', 'Tracked watchlist momentum'), line, element('div', 'lead-note', 'Mechanical packet score'));
      fragment.append(link);
    });
    container.replaceChildren(fragment);
  }
  function renderRisk(packet, internals) {
    var avg = finite(internals && internals.breadth && internals.breadth.index_basket_average_change_pct);
    var risk = avg !== null && avg >= 0 ? 'Risk-on' : 'Risk-off';
    byId('risk-tone').textContent = risk;
    byId('risk-detail').textContent = 'Index basket avg ' + (avg === null ? '—' : (avg >= 0 ? '+' : '') + avg.toFixed(2) + '%');
    var lead = array(packet.screeners && packet.screeners.watchlist_ranked)[0] || {};
    byId('front-lead').textContent = lead.ticker || '—';
    byId('front-lead-detail').textContent = 'Tracked score ' + (finite(lead.score) === null ? '—' : lead.score.toFixed(1)) + ' · ' + (finite(lead.chg) === null ? '—' : (lead.chg >= 0 ? '+' : '') + lead.chg.toFixed(2) + '%');
  }
  function renderOptions(options) {
    var container = byId('options-activity-body');
    if (!container) return;
    if (!isObject(options)) { container.replaceChildren(element('p', 'data-state', 'Options activity unavailable in this packet.')); return; }
    var rows = Object.keys(options).map(function (symbol) {
      var contracts = array(options[symbol]);
      return { symbol: symbol, volume: contracts.reduce(function (sum, row) { return sum + (finite(row.vol) || 0); }, 0), oi: contracts.reduce(function (sum, row) { return sum + (finite(row.oi) || 0); }, 0) };
    }).sort(function (a, b) { return b.volume - a.volume; }).slice(0, 4);
    var note = element('p', 'source-note', 'Polygon chain snapshot; volume and open interest are descriptive.');
    var list = element('div', 'mini-list');
    rows.forEach(function (row) {
      var link = element('a', 'mini-row'); link.href = supportedRoute(row.symbol, true);
      link.append(element('b', '', row.symbol), element('span', '', compact(row.volume) + ' vol · ' + compact(row.oi) + ' OI')); list.append(link);
    });
    container.replaceChildren(note, list);
  }
  function renderBreadth(internals) {
    var container = byId('breadth-body'), breadth = internals && internals.breadth;
    if (!container || !breadth) return;
    var note = element('p', 'source-note', 'Tracked universe: ' + (breadth.successful_symbol_count || '—') + ' symbols; not whole-market breadth.');
    var stats = element('div', 'breadth-stats');
    [['Adv', breadth.advancers], ['Dec', breadth.decliners], ['>20D', finite(breadth.percent_above_20d_sma) === null ? '—' : breadth.percent_above_20d_sma.toFixed(0) + '%']].forEach(function (item) {
      var block = element('span'); block.append(element('b', '', item[1]), element('small', '', item[0])); stats.append(block);
    });
    container.replaceChildren(note, stats);
  }
  function renderSectors(internals) {
    var container = byId('sector-board'), groups = array(internals && internals.sector_theme_board && internals.sector_theme_board.groups);
    if (!container || !groups.length) return;
    var fragment = document.createDocumentFragment();
    fragment.append(element('p', 'source-note', 'Explicit mapped watchlist, not whole-market or full-sector breadth.'));
    groups.slice(0, 8).forEach(function (group) {
      var row = element('div', 'sector-row'), info = element('div'), symbols = array(group.symbols), symbol = symbols[0] || '';
      info.append(element('b', '', group.name || 'Mapped theme'), element('span', '', symbols.join(' · ') + ' mapped watchlist'));
      var link = quoteLink(symbol, 'mono'); link.textContent = symbol;
      var move = element('strong'); setMove(move, group.equal_weight_change_pct); row.append(info, link, move); fragment.append(row);
    });
    container.replaceChildren(fragment);
  }
  function renderCatalysts(packet) {
    var container = byId('catalyst-body');
    if (!container || !packet) return;
    var items = array(packet.items).filter(function (item) { return item && item.relevance === 'direct'; }).slice(0, 5);
    var note = element('p', 'source-note', 'Direct relevant only. Polygon vendor sentiment, not STC analysis.');
    var list = element('div', 'catalyst-list');
    items.forEach(function (item) {
      var url = safeHttpsUrl(item.url), link = element(url ? 'a' : 'div', 'catalyst-row');
      if (url) { link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; }
      var symbols = array(item.tickers).slice(0, 2).join(' · ') || 'Market';
      var sentiment = isObject(item.vendor_sentiment) ? String(item.vendor_sentiment.sentiment || 'unrated') : 'unrated';
      link.append(element('b', '', symbols), element('span', '', item.title || 'Untitled catalyst'), element('small', '', 'Polygon vendor sentiment: ' + sentiment)); list.append(link);
    });
    container.replaceChildren(note, list);
  }
  function renderModuleUnavailable(id, message) {
    var container = byId(id);
    if (container) container.replaceChildren(element('p', 'data-state', message));
  }
  function renderLeaps(summary) {
    var container = byId('leap-finder-body');
    if (!container) return;
    var candidates = isObject(summary) ? array(summary.candidates || summary.rankings || summary.items) : [];
    if (!candidates.length) {
      container.replaceChildren(
        element('p', 'source-note', 'Complete-chain eligibility and clean two-sided quote method. Descriptive, not a recommendation.'),
        element('p', 'data-state', 'LEAP summary unavailable.')
      );
      return;
    }
    var fragment = document.createDocumentFragment();
    fragment.append(element('p', 'source-note', 'Complete-chain eligibility, positive bid, clean two-sided quote and spread ≤15%. Descriptive, not a recommendation.'));
    candidates.slice(0, 5).forEach(function (row) {
      var symbol = String(row.ticker || row.symbol || '').toUpperCase();
      if (!OPTIONS_SUPPORTED.has(symbol)) return;
      var link = element('a', 'leap-row');
      link.href = '/options/' + symbol.toLowerCase() + '/';
      var detail = element('div');
      var kind = String(row.type || row.contract_type || '').toLowerCase();
      detail.append(element('b', '', symbol), element('span', '', (row.expiration || row.exp || '—') + ' · ' + decimal(row.strike, 2) + (kind ? ' ' + kind : '')));
      link.append(detail, element('span', '', 'OI ' + compact(row.open_interest !== undefined ? row.open_interest : row.oi)), element('span', '', (finite(row.spread_ratio) === null ? '—' : (finite(row.spread_ratio) * 100).toFixed(1) + '%') + ' spr'));
      fragment.append(link);
    });
    if (fragment.childNodes.length === 1) fragment.append(element('p', 'data-state', 'No summary candidates map to supported options pages.'));
    container.replaceChildren(fragment);
  }
  function renderMarket(packet, internals) {
    if (!isObject(packet) || packet.contract !== 'market-packet/v2') throw new Error('invalid packet');
    if (byId('desk-label')) byId('desk-label').textContent = deskLabel(packet.market_session);
    var generated = marketTime(packet.generated_at);
    if (generated && byId('market-as-of')) byId('market-as-of').textContent = 'As of ' + generated;
    renderRail(packet.tickers); renderIndexes(packet.tickers); renderHot(packet.screeners && packet.screeners.watchlist_ranked, packet.tickers);
    renderMovers(packet.screeners); renderShadow(packet.screeners && packet.screeners.watchlist_ranked, packet.tickers);
    renderOptions(packet.options); renderBriefing(packet, internals); renderRisk(packet, internals);
  }
  function setupSearch() {
    var input = byId('home-search');
    if (!input) return;
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        var raw = input.value.trim(), optionsIntent = /\b(options?|calls?|puts?|chain)\b/i.test(raw) || /^O:/i.test(raw);
        var match = raw.toUpperCase().match(/\b[A-Z]{1,5}\b/g) || [];
        var symbol = match.find(function (part) { return !/^(OPTION|OPTIONS|CALL|CALLS|PUT|PUTS|CHAIN)$/.test(part); });
        if (symbol) window.location.assign(supportedRoute(symbol, optionsIntent));
      }
    });
  }
  function unavailable() { setTrust('unavailable', 'Data unavailable · stale'); }
  function start() {
    setupSearch();
    if (typeof window.fetch !== 'function') { unavailable(); return; }
    Promise.allSettled(PACKETS.map(fetchJson)).then(function (results) {
      var market = results[0].status === 'fulfilled' ? results[0].value : null;
      var trust = results[1].status === 'fulfilled' ? results[1].value : null;
      var internals = results[2].status === 'fulfilled' ? results[2].value : null;
      var catalysts = results[3].status === 'fulfilled' ? results[3].value : null;
      var leaps = results[4].status === 'fulfilled' ? results[4].value : null;
      if (internals) { renderBreadth(internals); renderSectors(internals); }
      else { renderModuleUnavailable('breadth-body', 'Tracked breadth unavailable.'); renderModuleUnavailable('sector-board', 'Sector and theme mapping unavailable.'); }
      if (catalysts) renderCatalysts(catalysts); else renderModuleUnavailable('catalyst-body', 'Catalyst tape unavailable.');
      renderLeaps(leaps);
      if (market) {
        try { renderMarket(market, internals); } catch (error) { unavailable(); return; }
      }
      if (trust) renderTrust(trust); else unavailable();
      if (!market) unavailable();
    }).catch(unavailable);
  }

  start();
}());
