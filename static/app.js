async function pull() {
  try {
    const r = await fetch('/api', { cache: 'no-store' });
    const d = await r.json();

    // header
    document.getElementById('host').textContent = d.host || 'localhost';

    // cpu total
    const cpu = Number(d.cpu_total || 0).toFixed(1);
    document.getElementById('cpuTotalVal').textContent = cpu + ' %';
    document.getElementById('cpuTotalBar').style.width = cpu + '%';

    // per-core
    const cores = document.getElementById('cores');
    cores.innerHTML = '';
    (d.cpu_per_core || []).forEach((p, i) => {
      const wrap = document.createElement('div');
      wrap.className = 'card'; wrap.style.padding = '10px';
      const pct = Number(p || 0).toFixed(1);
      wrap.innerHTML = `
        <div class="sub">Core ${i}</div>
        <div class="bar"><div class="fill" style="width:${pct}%"></div></div>
        <div class="sub">${pct}%</div>`;
      cores.appendChild(wrap);
    });

    // memory / swap
    const mem = Number(d.mem_percent || 0).toFixed(1);
    document.getElementById('memVal').textContent = mem + ' %';
    document.getElementById('memBar').style.width = mem + '%';
    document.getElementById('swapVal').innerHTML =
      `<div class="kv">Swap: ${d.swap_percent ?? 0}%</div>`;
    document.getElementById('ver').textContent = d.app_version || '-';

    // disks
    const diskEl = document.getElementById('diskList');
    diskEl.innerHTML = '';
    (d.disk || []).forEach(x => {
      const item = document.createElement('div');
      item.className = 'kv';
      item.textContent = `${x.mount}: ${x.percent}%`;
      diskEl.appendChild(item);
    });

    // misc
    document.getElementById('uptime').textContent = d.uptime;
    document.getElementById('os').textContent = d.os;
  } catch (e) {
    console.error(e);
  }
}
pull();
setInterval(pull, 3000);
