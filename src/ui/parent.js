// 家长模式：算术家长锁、吃饭模式、护眼/每日时长、学习报告、跳关/重置、多孩管理、导出码+二维码迁移、版权说明

import { BRANDS, BRAND_MAP } from '../data/brands.js';
import { LEVELS } from '../data/levels.js';
import { store } from '../engine/storage.js';
import { audio } from '../engine/audio.js';
import { renderQRToCanvas } from '../engine/qr.js';

export function openParentGate({ overlays, onStateChanged, onTestMealMode }) {
  const a = 3 + Math.floor(Math.random() * 7);
  const b = 3 + Math.floor(Math.random() * 7);
  const expected = a * b;

  const el = overlays.showModal(`
    <div class="modal-header">
      <h2 class="modal-title">🔒 家长验证</h2>
      <button id="gate-close" class="icon-btn">✖️</button>
    </div>
    <p style="margin:0 0 12px;font-size:14px;color:#5F6C7B;font-weight:700;">
      为了防止小朋友误操作，请先回答下面的小算术题：
    </p>
    <div style="text-align:center;font-size:32px;font-weight:900;color:#FF6B35;margin:10px 0 14px;">
      ${a} × ${b} = ?
    </div>
    <input id="gate-input" type="number" inputmode="numeric" placeholder="输入答案" style="width:100%;padding:12px;font-size:20px;font-weight:900;text-align:center;border-radius:16px;border:2px solid #CBD5E1;margin-bottom:12px;" />
    <div id="gate-err" style="color:#EF476F;font-size:13px;font-weight:800;text-align:center;margin-bottom:8px;"></div>
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
      el.querySelector('#gate-err').textContent = '答案不对哦，再算一次～';
      audio.wrong();
    }
  };
  el.querySelector('#gate-submit').onclick = check;
  input.onkeydown = (e) => { if (e.key === 'Enter') check(); };
}

function openParentPanel({ overlays, onStateChanged, onTestMealMode }) {
  const s = store.state.settings;
  const p = store.getActiveProfile();

  const statsEntries = Object.entries(p.brandStats);
  const mastered = statsEntries.filter(([, st]) => st.r >= 2 && st.r > st.w);
  const weakList = statsEntries
    .filter(([, st]) => st.w > 0)
    .sort((a, b) => b[1].w - a[1].w)
    .slice(0, 6);

  const el = overlays.showModal(`
    <div class="modal-header">
      <h2 class="modal-title">👨‍👩‍👧 家长控制中心</h2>
      <button id="par-close" class="icon-btn">✖️</button>
    </div>

    <!-- 1. 学习报告 -->
    <div class="parent-section">
      <h3>📊 ${p.avatar} ${p.name} 的学习报告</h3>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center;margin-bottom:10px;">
        <div style="background:#FFF;padding:8px;border-radius:12px;border:1px solid #E2E8F0;">
          <div style="font-size:20px;font-weight:900;color:#2EC4B6;">${mastered.length}</div>
          <div style="font-size:11px;color:#64748B;font-weight:700;">已掌握车标</div>
        </div>
        <div style="background:#FFF;padding:8px;border-radius:12px;border:1px solid #E2E8F0;">
          <div style="font-size:20px;font-weight:900;color:#FF6B35;">${store.getTodayMinutes()}分</div>
          <div style="font-size:11px;color:#64748B;font-weight:700;">今日游玩</div>
        </div>
        <div style="background:#FFF;padding:8px;border-radius:12px;border:1px solid #E2E8F0;">
          <div style="font-size:20px;font-weight:900;color:#FFB703;">${p.stars}</div>
          <div style="font-size:11px;color:#64748B;font-weight:700;">累计星星</div>
        </div>
      </div>
      <div style="font-size:13px;color:#475569;font-weight:700;">
        常错车标：${weakList.length ? weakList.map(([id, st]) => `${BRAND_MAP[id]?.name || id}(错${st.w}次)`).join('、') : '暂无，表现超棒！'}
      </div>
    </div>

    <!-- 2. 吃饭模式 -->
    <div class="parent-section">
      <h3>🍚 吃饭模式（边吃边玩不磨蹭）</h3>
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
      <button id="btn-test-meal" class="btn btn-warning btn-sm btn-block" style="margin-top:8px;">🍚 立即体验吃饭休息倒计时</button>
    </div>

    <!-- 3. 声音、题库与护眼 -->
    <div class="parent-section">
      <h3>⚙️ 语音、题库与护眼</h3>
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
          <option value="all" ${s.scope === 'all' ? 'selected' : ''}>全部 50 个品牌</option>
          <option value="cn" ${s.scope === 'cn' ? 'selected' : ''}>仅中国国产 32 个</option>
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

    <!-- 4. 关卡控制 -->
    <div class="parent-section">
      <h3>🗺️ 关卡管理</h3>
      <div class="setting-row">
        <span>跳到指定关卡</span>
        <div style="display:flex;gap:6px;">
          <select id="sel-jump" style="padding:6px 8px;border-radius:10px;border:1px solid #CBD5E1;font-weight:800;">
            ${LEVELS.map((lv) => `<option value="${lv.id}">第${lv.id}关</option>`).join('')}
          </select>
          <button id="btn-jump" class="btn btn-secondary btn-sm">解锁</button>
        </div>
      </div>
      <div style="margin-top:8px;display:flex;gap:8px;">
        <button id="btn-reset" class="btn btn-danger btn-sm btn-block">🗑️ 重置当前孩子关卡进度</button>
      </div>
    </div>

    <!-- 5. 跨手机进度导出与导入（存档码 + 二维码） -->
    <div class="parent-section">
      <h3>📲 跨手机存档导出 / 导入</h3>
      <p style="margin:0 0 8px;font-size:12px;color:#64748B;line-height:1.45;">
        iPhone Safari 超过7天未打开可能清理网页缓存，建议点浏览器底部分享按钮选择「添加到主屏幕」，并定期导出备份。
      </p>
      <div style="display:flex;gap:8px;margin-bottom:8px;">
        <button id="btn-export" class="btn btn-primary btn-sm" style="flex:1;">📤 生成导出码 & 二维码</button>
        <button id="btn-copy-code" class="btn btn-soft btn-sm">📋 复制</button>
      </div>
      <div id="qr-area" class="hidden">
        <div class="qr-canvas-wrap"><canvas id="qr-canvas"></canvas></div>
        <div id="qr-tip" style="font-size:12px;color:#64748B;text-align:center;margin-bottom:6px;"></div>
      </div>
      <textarea id="transfer-code" class="code-box" placeholder="导出后会显示存档码；或把另一台手机的存档码粘贴到这里再点导入..."></textarea>
      <div style="display:flex;gap:8px;margin-top:8px;">
        <button id="btn-import" class="btn btn-success btn-sm" style="flex:1;">📥 从存档码导入恢复</button>
      </div>
      <div id="transfer-msg" style="font-size:12px;font-weight:800;margin-top:6px;"></div>
    </div>

    <!-- 6. 版权与免责声明 -->
    <div class="parent-section" style="margin-bottom:0;">
      <h3>ℹ️ 来源与版权说明</h3>
      <p style="margin:0;font-size:12px;color:#64748B;line-height:1.5;">
        本游戏为个人家庭非商业儿童启蒙用途。内置车标与汽车图形为教学简化矢量绘制，相关品牌名称与商标归各汽车厂商所有；若需补充真实照片，可使用仓库内脚本从 Wikimedia Commons（CC 授权）下载到本地目录。
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

  el.querySelector('#sel-meal-count').onchange = (e) => {
    store.updateSettings({ mealTriggerCount: Number(e.target.value) });
  };
  el.querySelector('#sel-meal-sec').onchange = (e) => {
    store.updateSettings({ mealDurationSec: Number(e.target.value) });
  };
  el.querySelector('#sel-scope').onchange = (e) => {
    store.updateSettings({ scope: e.target.value });
  };
  el.querySelector('#sel-eye').onchange = (e) => {
    store.updateSettings({ eyeRestMinutes: Number(e.target.value) });
  };
  el.querySelector('#sel-limit').onchange = (e) => {
    store.updateSettings({ dailyLimitMinutes: Number(e.target.value) });
  };

  el.querySelector('#btn-test-meal').onclick = () => {
    overlays.closeModal();
    onTestMealMode();
  };

  el.querySelector('#btn-jump').onclick = () => {
    const lv = Number(el.querySelector('#sel-jump').value);
    store.jumpToLevel(lv);
    audio.correct();
    alert(`已解锁到第 ${lv} 关！`);
    onStateChanged();
  };

  el.querySelector('#btn-reset').onclick = () => {
    if (window.confirm(`确定要重置「${p.name}」的关卡与星星进度吗？（车库已买物品不受影响）`)) {
      store.resetActiveProgress();
      audio.click();
      openParentPanel({ overlays, onStateChanged, onTestMealMode });
      onStateChanged();
    }
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
    msgEl.style.color = '#1C968A';
    msgEl.textContent = '✅ 已生成最新存档码！';
  };

  el.querySelector('#btn-copy-code').onclick = async () => {
    if (!codeBox.value) codeBox.value = store.exportCode();
    try {
      await navigator.clipboard.writeText(codeBox.value);
      msgEl.style.color = '#1C968A';
      msgEl.textContent = '✅ 存档码已复制到剪贴板！';
    } catch {
      codeBox.select();
      document.execCommand('copy');
      msgEl.style.color = '#1C968A';
      msgEl.textContent = '✅ 已选中存档码，请粘贴保存！';
    }
  };

  el.querySelector('#btn-import').onclick = () => {
    try {
      store.importCode(codeBox.value);
      audio.win();
      msgEl.style.color = '#1C968A';
      msgEl.textContent = '🎉 存档导入恢复成功！';
      onStateChanged();
      setTimeout(() => openParentPanel({ overlays, onStateChanged, onTestMealMode }), 700);
    } catch (err) {
      audio.wrong();
      msgEl.style.color = '#EF476F';
      msgEl.textContent = `❌ 导入失败：${err.message}`;
    }
  };
}
