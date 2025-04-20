export function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  
  export function getOptions(pool, correct) {
    const opts = [correct];
    while (opts.length < 3) {
      const pick = pool[Math.floor(Math.random() * pool.length)];
      if (!opts.includes(pick)) opts.push(pick);
    }
    return shuffle(opts);
  }
  