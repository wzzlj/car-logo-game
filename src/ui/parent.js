// Direction A (Mini Cockpit) 家长控制中心：动态 88 品牌计数、金钥匙统计、吃饭/护眼/跨机二维码迁移

import { BRANDS, BRAND_MAP } from '../data/brands.js';
import { store } from '../engine/storage.js';
import { audio } from '../engine/audio.js';
import { renderQRToCanvas } from '../engine/qr.js';
import { ICONS } from './icons.js';

export function openParentGate({ overlays, onStateChanged, onTestMealMode }) {
  const a = 3 + Math.floor(Math.random() * 7);
  const b = 3 + Math.floor(Math.random() * 7);
  const expected = a * b;

  const el = overlays.showModal(`
    <div class="modal-header">
      <h2 class="modal-title">${ICONS.lock(18)} 家长验证</h2>
      <button id="gate-close" class="icon-btn" aria-label="关闭">${ICONS.close(16)}</button>
    </div>
    <p style="margin:0 0 12px;font-size:13px;color:#525B6B;font-weight:700;">
      为了防止小朋友误操作，请先回答下面的小算术题：
    </p>
    <div style="text-align:center;font-family:ui-monospace,monospace;font-size:32px;font-weight:900;color:#FF4F17;margin:10px 0 14px;">
      ${a} × ${b} = ?
    </div>
    <input id="gate-input" type="number" inputmode="numeric" placeholder="输入答案" style="width:100%;padding:12px;font-size:20px;font-weight:900;text-align:center;border-radius:14px;border:2px solid #CBD5E1;margin-bottom:12px;" />
    <div id="gate-err" style="color:#E11D48;font-size:13px;font-weight:800;text-align:center;margin-bottom:8px;"></div>
    <button id="gate-submit" class="btn btn-primary btn-block">解锁家长模式</button>
  `);

  const input = el.querySelector('#gate-input');
  setTimeout(() => input.focus(), 80);

  el.querySelector('#gate-close').onclick = () => overlays.closeModal();
  const check = () => {
    if (Number(input.value) === expected) {
      audio.click();
      openParentPanel({ overlays, onStateChanged, onTestMealMode });
    } else {
      el.querySelector('#gate-err').textContent = '答案不对哦，再算一次';
      audio.wrong();
    }
  };
  el.querySelector('#gate-submit').onclick = check;
  input.onkeydown = (e) => { if (e.key === 'Enter') check(); };
}

function openParentPanel({ overlays, onStateChanged, onTestMealMode }) {
  const s = store.state.settings;
  const p = store.getActiveProfile();
  const totalCount = BRANDS.length;
  const cnCount = BRANDS.filter((b) => b.origin === 'cn').length;

  const statsEntries = Object.entries(p.brandStats);
  const mastered = statsEntries.filter(([, st]) => st.r >= 2 && st.r > st.w);
  const weakList = statsEntries
    .filter(([, st]) => st.w > 0)
    .sort((a, b) => b[1].w - a[1].w)
    .slice(0, 6);

  const el = overlays.showModal(`
    <div class="modal-header">
      <h2 class="modal-title">${ICONS.lock(17)} 家长控制中心</h2>
      <button id="par-close" class="icon-btn" aria-label="关闭">${ICONS.close(16)}</button>
    </div>

    <div class="parent-section">
      <h3>${p.name} 的学习报告</h3>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center;margin-bottom:10px;">
        <div style="background:#FFF;padding:8px;border-radius:12px;border:1px solid #E2E8F0;">
          <div style="font-size:20px;font-weight:900;color:#16A34A;">${mastered.length}</div>
          <div style="font-size:11px;color:#646D7E;font-weight:700;">已掌握车标</div>
        </div>
        <div style="background:#FFF;padding:8px;border-radius:12px;border:1px solid #E2E8F0;">
          <div style="font-size:20px;font-weight:900;color:#FF4F17;">${store.getTodayMinutes()}分</div>
          <div style="font-size:11px;color:#646D7E;font-weight:700;">今日游玩</div>
        </div>
        <div style="background:#FFF;padding:8px;border-radius:12px;border:1px solid #E2E8F0;">
          <div style="font-size:20px;font-weight:900;color:#F59E0B;">${p.keys || 0}把</div>
          <div style="font-size:11px;color:#646D7E;font-weight:700;">金钥匙</div>
        </div>
      </div>
      <div style="font-size:12px;color:#525B6B;font-weight:700;">
        常错车标：${weakList.length ? weakList.map(([id, st]) => `${BRAND_MAP[id]?.name || id}(错${st.w}次)`).join('、') : '暂无，表现超棒！'}
      </div>
    </div>

    <div class="parent-section">
      <h3>吃饭模式（边吃边玩不磨蹭）</h3>
      <div class="setting-row">
        <span>开启吃饭模式</span>
        <button id="tog-meal" class="toggle-switch ${s.mealModeEnabled ? 'on' : ''}"></button>
      </div>
      <div class="setting-row">
        <span>每答几题休息吃饭</span>
        <select id="sel-meal-count" style="padding:6px 10px;border-radius:10px;border:1px solid #CBD5E1;font-weight:800;">
          ${[2, 3, 4, 5].map((n) => `<option value="${n}" ${s.mealTriggerCount === n ? 'selected' : ''}>每 ${n} 题</option>`).join('')}
        </select>
      </div>
      <div class="setting-row">
        <span>每次吃饭休息时长</span>
        <select id="sel-meal-sec" style="padding:6px 10px;border-radius:10px;border:1px solid #CBD5E1;font-weight:800;">
          ${[30, 60, 90, 120].map((sec) => `<option value="${sec}" ${s.mealDurationSec === sec ? 'selected' : ''}>${sec} 秒</option>`).join('')}
        </select>
      </div>
      <button id="btn-test-meal" class="btn btn-warning btn-sm btn-block" style="margin-top:8px;">立即体验吃饭休息倒计时</button>
    </div>

    <div class="parent-section">
      <h3>语音、题库与护眼</h3>
      <div class="setting-row">
        <span>中文语音播报</span>
        <button id="tog-voice" class="toggle-switch ${s.voiceEnabled ? 'on' : ''}"></button>
      </div>
      <div class="setting-row">
        <span>汽车鸣笛与游戏音效</span>
        <button id="tog-sfx" class="toggle-switch ${s.sfxEnabled ? 'on' : ''}"></button>
      </div>
      <div class="setting-row">
        <span>出题范围</span>
        <select id="sel-scope" style="padding:6px 10px;border-radius:10px;border:1px solid #CBD5E1;font-weight:800;">
          <option value="all" ${s.scope === 'all' ? 'selected' : ''}>全部 ${totalCount} 个品牌</option>
          <option value="cn" ${s.scope === 'cn' ? 'selected' : ''}>仅中国国产 ${cnCount} 个</option>
        </select>
      </div>
      <div class="setting-row">
        <span>护眼休息提醒</span>
        <select id="sel-eye" style="padding:6px 10px;border-radius:10px;border:1px solid #CBD5E1;font-weight:800;">
          ${[0, 10, 15, 20].map((m) => `<option value="${m}" ${s.eyeRestMinutes === m ? 'selected' : ''}>${m === 0 ? '关闭' : `每 ${m} 分钟`}</option>`).join('')}
        </select>
      </div>
      <div class="setting-row">
        <span>每日总时长上限</span>
        <select id="sel-limit" style="padding:6px 10px;border-radius:10px;border:1px solid #CBD5E1;font-weight:800;">
          ${[0, 15, 30, 45, 60].map((m) => `<option value="${m}" ${s.dailyLimitMinutes === m ? 'selected' : ''}>${m === 0 ? '不限制' : `${m} 分钟`}</option>`).join('')}
        </select>
      </div>
    </div>

    <div class="parent-section">
      <h3>学习进度管理</h3>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <button id="btn-learn-all" class="btn btn-secondary btn-sm btn-block">标记全部 ${totalCount} 个车标已学（全图鉴混玩）</button>
        <button id="btn-reset" class="btn btn-danger btn-sm btn-block">重置当前孩子学习进度</button>
      </div>
      <div id="progress-msg" style="font-size:12px;font-weight:800;color:#16A34A;margin-top:6px;"></div>
    </div>

    <div class="parent-section">
      <h3>跨手机存档导出 / 导入</h3>
      <p style="margin:0 0 8px;font-size:12px;color:#646D7E;line-height:1.45;">
        建议在 iPhone Safari 点击分享按钮选择「添加到主屏幕」，并定期导出备份防数据丢失。
      </p>
      <div style="display:flex;gap:8px;margin-bottom:8px;">
        <button id="btn-export" class="btn btn-primary btn-sm" style="flex:1;">生成导出码与二维码</button>
        <button id="btn-copy-code" class="btn btn-soft btn-sm">复制</button>
      </div>
      <div id="qr-area" class="hidden">
        <div class="qr-canvas-wrap"><canvas id="qr-canvas"></canvas></div>
        <div id="qr-tip" style="font-size:12px;color:#646D7E;text-align:center;margin-bottom:6px;"></div>
      </div>
      <textarea id="transfer-code" class="code-box" placeholder="导出后会显示存档码；或粘贴另一台手机的存档码再点导入..."></textarea>
      <div style="display:flex;gap:8px;margin-top:8px;">
        <button id="btn-import" class="btn btn-success btn-sm" style="flex:1;">粘贴码导入</button>
        <label class="btn btn-secondary btn-sm" style="flex:1;cursor:pointer;">
          识别二维码图
          <input id="qr-file-input" type="file" accept="image/*" style="display:none;" />
        </label>
      </div>
      <div id="transfer-msg" style="font-size:12px;font-weight:800;margin-top:6px;"></div>
    </div>

    <div class="parent-section" style="margin-bottom:0;">
      <h3>来源与版权说明</h3>
      <p style="margin:0;font-size:12px;color:#646D7E;line-height:1.5;">
        本游戏为个人家庭非商业儿童启蒙用途。内置车标与真车照片来源于 Wikimedia Commons 公开授权资料，相关商标归各汽车厂商所有。
      </p>
    </div>
  `);

  el.querySelector('#par-close').onclick = () => {
    overlays.closeModal();
    onStateChanged();
  };

  const bindToggle = (id, key) => {
    el.querySelector(id).onclick = () => {
      store.updateSettings({ [key]: !store.state.settings[key] });
      audio.configure(store.state.settings);
      audio.click();
      openParentPanel({ overlays, onStateChanged, onTestMealMode });
    };
  };
  bindToggle('#tog-meal', 'mealModeEnabled');
  bindToggle('#tog-voice', 'voiceEnabled');
  bindToggle('#tog-sfx', 'sfxEnabled');

  el.querySelector('#sel-meal-count').onchange = (e) => store.updateSettings({ mealTriggerCount: Number(e.target.value) });
  el.querySelector('#sel-meal-sec').onchange = (e) => store.updateSettings({ mealDurationSec: Number(e.target.value) });
  el.querySelector('#sel-scope').onchange = (e) => store.updateSettings({ scope: e.target.value });
  el.querySelector('#sel-eye').onchange = (e) => store.updateSettings({ eyeRestMinutes: Number(e.target.value) });
  el.querySelector('#sel-limit').onchange = (e) => store.updateSettings({ dailyLimitMinutes: Number(e.target.value) });

  el.querySelector('#btn-test-meal').onclick = () => {
    overlays.closeModal();
    onTestMealMode();
  };

  const progressMsg = el.querySelector('#progress-msg');
  el.querySelector('#btn-learn-all').onclick = () => {
    store.markLearned(BRANDS.map((b) => b.id));
    audio.correct();
    progressMsg.textContent = `已全部标记为已学，现在所有玩法都会随机混合全部 ${totalCount} 个车标！`;
    onStateChanged();
  };

  el.querySelector('#btn-reset').onclick = () => {
    overlays.showConfirm(
      '确认重置进度',
      `确定要重置「${p.name}」的学习进度、星星和金钥匙吗？（车库已解锁车辆不受影响）`,
      () => {
        store.resetActiveProgress();
        audio.click();
        onStateChanged();
        openParentPanel({ overlays, onStateChanged, onTestMealMode });
      },
      () => openParentPanel({ overlays, onStateChanged, onTestMealMode })
    );
  };

  const codeBox = el.querySelector('#transfer-code');
  const msgEl = el.querySelector('#transfer-msg');
  const qrArea = el.querySelector('#qr-area');
  const qrCanvas = el.querySelector('#qr-canvas');
  const qrTip = el.querySelector('#qr-tip');

  el.querySelector('#btn-export').onclick = () => {
    const code = store.exportCode();
    codeBox.value = code;
    qrArea.classList.remove('hidden');
    const ok = renderQRToCanvas(qrCanvas, code, 220);
    qrTip.textContent = ok
      ? '用另一台手机扫码识别文字，复制粘贴到下方即可恢复！'
      : '当前存档数据较大，请直接点击“复制”发送给另一台手机粘贴导入。';
    msgEl.style.color = '#16A34A';
    msgEl.textContent = '已生成最新存档码！';
  };

  el.querySelector('#btn-copy-code').onclick = async () => {
    if (!codeBox.value) codeBox.value = store.exportCode();
    try {
      await navigator.clipboard.writeText(codeBox.value);
      msgEl.style.color = '#16A34A';
      msgEl.textContent = '存档码已复制到剪贴板！';
    } catch {
      codeBox.select();
      document.execCommand('copy');
      msgEl.style.color = '#16A34A';
      msgEl.textContent = '已选中存档码，请粘贴保存！';
    }
  };

  el.querySelector('#btn-import').onclick = () => {
    try {
      store.importCode(codeBox.value);
      audio.win();
      msgEl.style.color = '#16A34A';
      msgEl.textContent = '存档导入恢复成功！';
      onStateChanged();
      setTimeout(() => openParentPanel({ overlays, onStateChanged, onTestMealMode }), 700);
    } catch (err) {
      audio.wrong();
      msgEl.style.color = '#E11D48';
      msgEl.textContent = `导入失败：${err.message}`;
    }
  };

  const qrInput = el.querySelector('#qr-file-input');
  if (qrInput) {
    qrInput.onchange = async () => {
      const file = qrInput.files && qrInput.files[0];
      if (!file) return;
      if (!('BarcodeDetector' in window)) {
        msgEl.style.color = '#B45309';
        msgEl.textContent = '当前浏览器不支持直接识图，请用 iPhone 相机长按二维码复制文字后粘贴导入。';
        return;
      }
      try {
        const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
        const bitmap = await createImageBitmap(file);
        const results = await detector.detect(bitmap);
        if (!results || results.length === 0) {
          msgEl.style.color = '#E11D48';
          msgEl.textContent = '未在图片中识别到二维码，请换一张清晰截图再试。';
          return;
        }
        codeBox.value = results[0].rawValue;
        store.importCode(results[0].rawValue);
        audio.win();
        msgEl.style.color = '#16A34A';
        msgEl.textContent = '二维码识别并导入成功！';
        onStateChanged();
        setTimeout(() => openParentPanel({ overlays, onStateChanged, onTestMealMode }), 700);
      } catch (err) {
        audio.wrong();
        msgEl.style.color = '#E11D48';
        msgEl.textContent = `识别失败：${err.message}`;
      }
    };
  }
}
