import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity,
  BadgeDollarSign,
  Brain,
  Calculator,
  Clock3,
  Copy,
  Flame,
  HeartPulse,
  PiggyBank,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import './styles.css';

const profitOptions = [
  { label: '无', value: 'none', score: 0 },
  { label: '低', value: 'low', score: 3 },
  { label: '中', value: 'medium', score: 6 },
  { label: '高', value: 'high', score: 10 },
];

const purposeOptions = [
  {
    label: '快乐',
    value: 'happy',
    values: { socialValue: 5, emotionalValue: 10, healthValue: 4, profitPotential: 'none', feedbackHours: 6 },
  },
  {
    label: '社交',
    value: 'social',
    values: { socialValue: 10, emotionalValue: 8, healthValue: 4, profitPotential: 'none', feedbackHours: 4 },
  },
  {
    label: '健康',
    value: 'health',
    values: { socialValue: 5, emotionalValue: 8, healthValue: 10, profitPotential: 'none', feedbackHours: 12 },
  },
  {
    label: '变现',
    value: 'money',
    values: { socialValue: 5, emotionalValue: 7, healthValue: 3, profitPotential: 'medium', feedbackHours: 40 },
  },
  {
    label: '装逼',
    value: 'flex',
    values: { socialValue: 8, emotionalValue: 9, healthValue: 2, profitPotential: 'low', feedbackHours: 2 },
  },
];

const initialForm = {
  hobbyName: '摄影',
  entryCost: 6800,
  monthlyCost: 300,
  weeklyHours: 6,
  monthlySalary: 14000,
  hourlyRate: 80,
  feedbackHours: 20,
  profitPotential: 'low',
  primaryPurpose: 'happy',
  socialValue: 7,
  emotionalValue: 9,
  healthValue: 3,
};

const hobbyPresets = [
  {
    label: '羽毛球',
    values: {
      hobbyName: '羽毛球',
      entryCost: 900,
      monthlyCost: 450,
      weeklyHours: 4,
      monthlySalary: 14000,
      feedbackHours: 8,
      profitPotential: 'none',
      socialValue: 8,
      emotionalValue: 8,
      healthValue: 9,
    },
  },
  {
    label: '摄影',
    values: {
      hobbyName: '摄影',
      entryCost: 6800,
      monthlyCost: 300,
      weeklyHours: 6,
      monthlySalary: 14000,
      feedbackHours: 20,
      profitPotential: 'low',
      socialValue: 7,
      emotionalValue: 9,
      healthValue: 3,
    },
  },
  {
    label: '健身',
    values: {
      hobbyName: '健身',
      entryCost: 600,
      monthlyCost: 280,
      weeklyHours: 5,
      monthlySalary: 14000,
      feedbackHours: 16,
      profitPotential: 'none',
      socialValue: 5,
      emotionalValue: 8,
      healthValue: 10,
    },
  },
  {
    label: '骑行',
    values: {
      hobbyName: '骑行',
      entryCost: 4200,
      monthlyCost: 260,
      weeklyHours: 7,
      monthlySalary: 14000,
      feedbackHours: 12,
      profitPotential: 'low',
      socialValue: 7,
      emotionalValue: 8,
      healthValue: 9,
    },
  },
  {
    label: '写小说',
    values: {
      hobbyName: '写小说',
      entryCost: 500,
      monthlyCost: 80,
      weeklyHours: 10,
      monthlySalary: 14000,
      feedbackHours: 60,
      profitPotential: 'medium',
      socialValue: 4,
      emotionalValue: 9,
      healthValue: 2,
    },
  },
  {
    label: '露营',
    values: {
      hobbyName: '露营',
      entryCost: 5200,
      monthlyCost: 450,
      weeklyHours: 3,
      monthlySalary: 14000,
      feedbackHours: 6,
      profitPotential: 'none',
      socialValue: 8,
      emotionalValue: 9,
      healthValue: 6,
    },
  },
  {
    label: '咖啡',
    values: {
      hobbyName: '咖啡',
      entryCost: 2600,
      monthlyCost: 500,
      weeklyHours: 4,
      monthlySalary: 14000,
      feedbackHours: 3,
      profitPotential: 'low',
      socialValue: 5,
      emotionalValue: 8,
      healthValue: 2,
    },
  },
  {
    label: '手账',
    values: {
      hobbyName: '手账',
      entryCost: 800,
      monthlyCost: 260,
      weeklyHours: 5,
      monthlySalary: 14000,
      feedbackHours: 2,
      profitPotential: 'low',
      socialValue: 4,
      emotionalValue: 9,
      healthValue: 2,
    },
  },
  {
    label: '滑雪',
    values: {
      hobbyName: '滑雪',
      entryCost: 7800,
      monthlyCost: 900,
      weeklyHours: 5,
      monthlySalary: 14000,
      feedbackHours: 12,
      profitPotential: 'none',
      socialValue: 7,
      emotionalValue: 9,
      healthValue: 8,
    },
  },
  {
    label: '剧本杀',
    values: {
      hobbyName: '剧本杀',
      entryCost: 200,
      monthlyCost: 600,
      weeklyHours: 6,
      monthlySalary: 14000,
      feedbackHours: 4,
      profitPotential: 'low',
      socialValue: 9,
      emotionalValue: 8,
      healthValue: 1,
    },
  },
];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function numberValue(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function getPurposeValues(value) {
  return purposeOptions.find((option) => option.value === value)?.values ?? purposeOptions[0].values;
}

function inferPurpose(hobbyName) {
  if (['羽毛球', '剧本杀', '露营'].includes(hobbyName)) return 'social';
  if (['健身', '骑行', '滑雪'].includes(hobbyName)) return 'health';
  if (['写小说'].includes(hobbyName)) return 'money';
  if (['咖啡', '手账', '摄影'].includes(hobbyName)) return 'flex';
  return 'happy';
}

function getCalculationForm(form, inputMode) {
  if (inputMode !== 'simple') return form;
  return {
    ...form,
    ...getPurposeValues(form.primaryPurpose),
    entryCost: 0,
    hourlyRate: 60,
    monthlySalary: 10560,
  };
}

function yuan(value) {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0,
  }).format(value);
}

function getGrade(score) {
  if (score >= 90) return 'S';
  if (score >= 75) return 'A';
  if (score >= 60) return 'B';
  if (score >= 45) return 'C';
  return 'D';
}

function getGradeText(grade) {
  const copy = {
    S: '几乎不像智商税，建议低调炫耀。',
    A: '可以入坑，属于成年人少见的体面缴税。',
    B: '能玩，但别把它包装成人生战略。',
    C: '快乐是有的，价格也是真的不客气。',
    D: '它不像爱好，更像一个会定期扣费的情绪陷阱。',
  };
  return copy[grade];
}

function riskLevel(score) {
  if (score >= 8) return '高';
  if (score >= 5) return '中';
  return '低';
}

function makeTaxpayerTitle({ annualMoneyCost, annualTimeCost, socialValue, emotionalValue, healthValue, profitLabel }) {
  const social = numberValue(socialValue);
  const emotional = numberValue(emotionalValue);
  const health = numberValue(healthValue);

  if (annualMoneyCost >= 14000 && annualTimeCost < annualMoneyCost) return '器材党预备役';
  if (emotional >= 9 && health <= 3) return '多巴胺缴税大户';
  if (social >= 8) return '社交回血型选手';
  if (health >= 8 && annualMoneyCost <= 9000) return '理性入坑型玩家';
  if (profitLabel === '中' || profitLabel === '高') return '变现幻觉观察员';
  if (annualTimeCost >= 35000) return '时间献祭型玩家';
  return '快乐试用型玩家';
}

function makeRiskProfile({ entryCost, monthlyCost, weeklyHours, profitLabel, socialValue, emotionalValue }) {
  const equipmentScore = entryCost / 1800 + monthlyCost / 700 + numberValue(emotionalValue) / 5;
  const socialScore = numberValue(socialValue) + weeklyHours / 2;
  const walletScore = entryCost / 3000 + monthlyCost / 500 + weeklyHours / 5;
  const profitScore = { 无: 2, 低: 4, 中: 7, 高: 9 }[profitLabel] ?? 2;

  return [
    {
      label: '装备升级风险',
      level: riskLevel(equipmentScore),
      detail: equipmentScore >= 8 ? '很可能从“够用”一路滑到“来都来了”。' : '暂时还能靠理智刹车。',
    },
    {
      label: '社交沉迷风险',
      level: riskLevel(socialScore),
      detail: socialScore >= 8 ? '你以为在玩爱好，其实在续费朋友圈。' : '社交收益有，但还没到失控。',
    },
    {
      label: '钱包失血速度',
      level: riskLevel(walletScore),
      detail: walletScore >= 8 ? '不是不能玩，是银行卡需要心理建设。' : '出血可控，主要看你会不会突然上头。',
    },
    {
      label: '变现幻觉指数',
      level: riskLevel(profitScore),
      detail: profitScore >= 7 ? '已经开始出现“说不定能赚钱”的危险念头。' : '目前还比较诚实，快乐为主。',
    },
  ];
}

function makeComment({ hobbyName, score, grade, annualTotalCost, feedbackHours, profitLabel, weeklyHours }) {
  const name = hobbyName.trim() || '这个爱好';
  const costTone =
    annualTotalCost > 80000
      ? '年度总成本已经有点像在养一台隐形豪车'
      : annualTotalCost > 30000
        ? '花费不算轻，但还没到需要召开家庭会议的程度'
        : '成本控制得不错，钱包暂时不用报警';

  const feedbackTone =
    feedbackHours <= 10
      ? '正反馈来得很快，属于刚上手就给糖吃'
      : feedbackHours <= 50
        ? '反馈周期还算合理，耐心不会被按在地上摩擦太久'
        : '正反馈偏慢，前期很考验你是真爱还是三分钟热度';

  const timeTone =
    weeklyHours >= 15
      ? '每周投入时间很猛，请确认你是在培养爱好，不是在给自己开第二份工'
      : weeklyHours >= 7
        ? '时间投入有存在感，适合认真玩，不太适合随便说说'
        : '时间压力不大，比较适合塞进真实生活的缝隙里';

  if (score >= 85) {
    return `${name}属于少数不太像智商税的成年人爱好。${costTone}。${feedbackTone}，盈利可能为${profitLabel}。它会花钱，但至少真的能给生活回一点血，钱包看了也只是叹气，不至于报警。`;
  }

  if (score >= 58) {
    return `${name}属于“可以入坑，但请保持人类理智”的项目。${costTone}，${timeTone}。如果快乐主要发生在练习、出门、见人或完成作品时，它就还算爱好；如果快乐只发生在付款成功那一秒，那就是购物车在表演才艺。`;
  }

  return `${name}目前更像一张包装精美的人生税单。${costTone}，而且${feedbackTone}。建议先低配试水，别一上来就把银行卡献祭给热爱，热爱收到也会尴尬。`;
}

function makeAdultIllusion({ hobbyName, score, socialValue, profitLabel, annualTimeCost, weeklyHours }) {
  const name = hobbyName.trim() || '这个爱好';
  const social = numberValue(socialValue);
  const highTimeCost = annualTimeCost >= 30000 || weeklyHours >= 8;

  if (name.includes('羽毛球')) {
    return '羽毛球是少数能把健康、社交和膝盖损耗打包出售的爱好。';
  }

  if (profitLabel === '高') {
    return `${name}看起来像爱好，实际上已经在偷偷面试你的商业头脑。`;
  }

  if (profitLabel === '中' && score < 65) {
    return `${name}的盈利想象空间很大，主要大在“想象”两个字上。`;
  }

  if (highTimeCost && social >= 8) {
    return `${name}表面是在交朋友，深层逻辑是用时间成本购买群体归属感。`;
  }

  if (highTimeCost) {
    return `${name}每年吞掉的时间不少，成年人管这叫热爱，日历管这叫失踪人口。`;
  }

  if (social <= 3 && profitLabel === '无') {
    return `${name}很适合独处，只是它对银行卡和朋友圈都没有明显复兴计划。`;
  }

  if (score >= 85) {
    return `${name}难得像个正经爱好，不太像成年人给焦虑买的新皮肤。`;
  }

  if (score < 45) {
    return `${name}的快乐是真的，性价比也是真的在旁边装没听见。`;
  }

  return `${name}目前属于可控范围内的精神消费，听起来比“又买了点东西”体面很多。`;
}

function makeShareText({ form, result }) {
  const name = form.hobbyName.trim() || '这个爱好';
  const risks = result.riskProfile.map((item) => `${item.label}：${item.level}`).join('，');
  return `我的爱好税单：${name}，${result.grade} 级，称号「${result.taxpayerTitle}」，年度总成本约 ${yuan(result.annualTotalCost)}。结论：${result.comment} 风险：${risks}。`;
}

function calculate(form) {
  const entryCost = numberValue(form.entryCost);
  const monthlyCost = numberValue(form.monthlyCost);
  const weeklyHours = numberValue(form.weeklyHours);
  const hourlyWage = numberValue(form.hourlyRate) || numberValue(form.monthlySalary) / 176;
  const feedbackHours = Math.max(numberValue(form.feedbackHours), 1);
  const profit = profitOptions.find((option) => option.value === form.profitPotential) ?? profitOptions[0];

  const annualMoneyCost = entryCost + monthlyCost * 12;
  const annualTimeCost = weeklyHours * 52 * hourlyWage;
  const annualTotalCost = annualMoneyCost + annualTimeCost;

  const socialScore = clamp(numberValue(form.socialValue), 1, 10) * 2.5;
  const emotionalScore = clamp(numberValue(form.emotionalValue), 1, 10) * 3;
  const healthScore = clamp(numberValue(form.healthValue), 1, 10) * 2;
  const profitScore = profit.score * 1.5;
  const costPenalty = clamp(annualTotalCost / 4000, 0, 25);

  const score = Math.round(
    clamp(socialScore + emotionalScore + healthScore + profitScore - costPenalty, 0, 100),
  );
  const grade = getGrade(score);

  return {
    annualMoneyCost,
    annualTimeCost,
    annualTotalCost,
    score,
    grade,
    profitLabel: profit.label,
    taxpayerTitle: makeTaxpayerTitle({
      annualMoneyCost,
      annualTimeCost,
      socialValue: form.socialValue,
      emotionalValue: form.emotionalValue,
      healthValue: form.healthValue,
      profitLabel: profit.label,
    }),
    riskProfile: makeRiskProfile({
      entryCost,
      monthlyCost,
      weeklyHours,
      profitLabel: profit.label,
      socialValue: form.socialValue,
      emotionalValue: form.emotionalValue,
    }),
    adultIllusion: makeAdultIllusion({
      hobbyName: form.hobbyName,
      score,
      socialValue: form.socialValue,
      profitLabel: profit.label,
      annualTimeCost,
      weeklyHours,
    }),
    comment: makeComment({
      hobbyName: form.hobbyName,
      score,
      grade,
      annualTotalCost,
      feedbackHours,
      profitLabel: profit.label,
      weeklyHours,
    }),
  };
}

function Field({ label, children, hint }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

function StatCard({ icon, label, value, accent }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${accent}`}>{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function RangeField({ label, value, onChange, icon }) {
  return (
    <div className="range-field">
      <div className="range-head">
        <span>
          {icon}
          {label}
        </span>
        <strong>{value}</strong>
      </div>
      <input min="1" max="10" type="range" value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function RiskBill({ risks }) {
  return (
    <section className="risk-bill reveal-step step-risk">
      <div className="bill-heading">
        <span>
          <Flame size={17} />
          入坑风险
        </span>
      </div>
      <div className="risk-bill-grid">
        {risks.map((risk) => (
          <article className={`risk-bill-item level-${risk.level}`} key={risk.label}>
            <div>
              <span>{risk.label}</span>
              <strong>{risk.level}</strong>
            </div>
            <p>{risk.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function App() {
  const [form, setForm] = useState(initialForm);
  const [inputMode, setInputMode] = useState('simple');
  const [hasCalculated, setHasCalculated] = useState(false);
  const [calculationVersion, setCalculationVersion] = useState(0);
  const [copyStatus, setCopyStatus] = useState('idle');
  const calculationForm = useMemo(() => getCalculationForm(form, inputMode), [form, inputMode]);
  const result = useMemo(() => calculate(calculationForm), [calculationForm]);

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setHasCalculated(false);
  };

  const updatePurpose = (value) => {
    setForm((current) => ({
      ...current,
      primaryPurpose: value,
      ...(inputMode === 'advanced' ? getPurposeValues(value) : {}),
    }));
    setHasCalculated(false);
  };

  const meterStyle = {
    background: `conic-gradient(var(--good) ${result.score * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
  };

  const copyShare = async () => {
    const shareText = makeShareText({ form: calculationForm, result });
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareText;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopyStatus('done');
      window.setTimeout(() => setCopyStatus('idle'), 1600);
    } catch {
      setCopyStatus('failed');
      window.setTimeout(() => setCopyStatus('idle'), 1800);
    }
  };

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">
            <Sparkles size={16} />
          </p>
          <h1>入坑计算器</h1>
          <p className="subtitle">
            把金钱、时间、正反馈和情绪收益放到同一张桌上。热爱当然无价，但账单通常很会报价。
          </p>
        </div>
      </section>

      <section className="workspace">
        <form
          className="panel input-panel"
          onSubmit={(event) => {
            event.preventDefault();
            setHasCalculated(true);
            setCalculationVersion((current) => current + 1);
          }}
        >
          <div className="panel-heading">
            <div>
              <p className="section-kicker">输入参数</p>
              <h2>你的爱好税单</h2>
            </div>
            <Calculator size={26} />
          </div>

          <div className="mode-switch" aria-label="输入模式">
            <button
              className={inputMode === 'simple' ? 'active' : ''}
              type="button"
              onClick={() => setInputMode('simple')}
            >
              极简模式
            </button>
            <button
              className={inputMode === 'advanced' ? 'active' : ''}
              type="button"
              onClick={() => {
                setInputMode('advanced');
                setForm((current) => ({ ...current, ...getPurposeValues(current.primaryPurpose) }));
              }}
            >
              精算模式
            </button>
          </div>

          <div className="preset-block">
            <span>快速预设</span>
            <div className="preset-buttons">
              {hobbyPresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className={form.hobbyName === preset.label ? 'selected' : ''}
                  onClick={() => {
                    setForm((current) => ({
                      ...current,
                      ...preset.values,
                      hourlyRate: current.hourlyRate,
                      primaryPurpose: preset.values.primaryPurpose ?? inferPurpose(preset.label),
                    }));
                    setHasCalculated(true);
                    setCalculationVersion((current) => current + 1);
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {inputMode === 'simple' ? (
            <div className="simple-mode">
              <div className="form-grid simple-grid">
                <Field label="爱好名称">
                  <input value={form.hobbyName} onChange={(event) => update('hobbyName', event.target.value)} />
                </Field>
                <Field label="每月花费">
                  <input
                    min="0"
                    type="number"
                    value={form.monthlyCost}
                    onChange={(event) => update('monthlyCost', event.target.value)}
                  />
                </Field>
                <Field label="每周投入时间">
                  <input
                    min="0"
                    type="number"
                    value={form.weeklyHours}
                    onChange={(event) => update('weeklyHours', event.target.value)}
                  />
                  <small>单位：小时</small>
                </Field>
              </div>

              <div className="segmented purpose-block">
                <span>主要目的</span>
                <div className="segments purpose-segments">
                  {purposeOptions.map((option) => (
                    <button
                      className={form.primaryPurpose === option.value ? 'active' : ''}
                      key={option.value}
                      type="button"
                      onClick={() => updatePurpose(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="advanced-mode">
              <div className="form-grid">
                <Field label="爱好名称">
                  <input value={form.hobbyName} onChange={(event) => update('hobbyName', event.target.value)} />
                </Field>
                <Field label="一次性投入">
                  <input
                    min="0"
                    type="number"
                    value={form.entryCost}
                    onChange={(event) => update('entryCost', event.target.value)}
                  />
                </Field>
                <Field label="每月持续花费">
                  <input
                    min="0"
                    type="number"
                    value={form.monthlyCost}
                    onChange={(event) => update('monthlyCost', event.target.value)}
                  />
                </Field>
                <Field label="每周投入时间">
                  <input
                    min="0"
                    type="number"
                    value={form.weeklyHours}
                    onChange={(event) => update('weeklyHours', event.target.value)}
                  />
                </Field>
                <Field label="时薪">
                  <input
                    min="0"
                    type="number"
                    value={form.hourlyRate}
                    onChange={(event) => update('hourlyRate', event.target.value)}
                  />
                  <small>用来折算时间成本</small>
                </Field>
                <Field label="正反馈周期">
                  <input
                    min="1"
                    type="number"
                    value={form.feedbackHours}
                    onChange={(event) => update('feedbackHours', event.target.value)}
                  />
                  <small>单位：小时</small>
                </Field>
              </div>

              <div className="segmented purpose-block">
                <span>主要目的</span>
                <div className="segments purpose-segments">
                  {purposeOptions.map((option) => (
                    <button
                      className={form.primaryPurpose === option.value ? 'active' : ''}
                      key={option.value}
                      type="button"
                      onClick={() => updatePurpose(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="segmented">
                <span>盈利可能</span>
                <div className="segments">
                  {profitOptions.map((option) => (
                    <button
                      className={form.profitPotential === option.value ? 'active' : ''}
                      key={option.value}
                      type="button"
                      onClick={() => update('profitPotential', option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="ranges">
                <RangeField
                  icon={<Users size={17} />}
                  label="社交价值"
                  value={form.socialValue}
                  onChange={(value) => update('socialValue', value)}
                />
                <RangeField
                  icon={<Brain size={17} />}
                  label="情绪价值"
                  value={form.emotionalValue}
                  onChange={(value) => update('emotionalValue', value)}
                />
                <RangeField
                  icon={<HeartPulse size={17} />}
                  label="健康价值"
                  value={form.healthValue}
                  onChange={(value) => update('healthValue', value)}
                />
              </div>
            </div>
          )}

          <button className="primary-action" type="submit">
            <Calculator size={20} />
            生成爱好税单
          </button>
        </form>

        <section className="panel result-panel">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">结果仪表盘</p>
              <h2>{hasCalculated ? `${form.hobbyName || '爱好'} ROI` : '等待填写后计算'}</h2>
            </div>
            <Activity size={26} />
          </div>

          {!hasCalculated ? (
            <div className="empty-result">
              <Calculator size={32} />
              <strong>先把参数填好，再点计算 ROI</strong>
              <p>结果仪表盘、点评和分享卡会按顺序出现，给热爱一个体面的登场仪式。</p>
            </div>
          ) : (
            <div key={calculationVersion}>
              <div className="reveal-step step-dashboard">
                <div className="tax-bill-title">
                  <span>你的爱好税单</span>
                  <strong>{result.grade} 级</strong>
                  <p>你是：{result.taxpayerTitle}</p>
                </div>

                <div className="dashboard-top">
                  <div className="score-meter" style={meterStyle}>
                    <div>
                      <span>综合回报</span>
                      <strong>{result.score}</strong>
                      <small>/ 100</small>
                    </div>
                  </div>
                  <div className="grade-card">
                    <span>性价比等级</span>
                    <strong>{result.grade}</strong>
                    <p>{getGradeText(result.grade)}</p>
                  </div>
                </div>

                <div className="stats-grid">
                  <StatCard
                    accent="money"
                    icon={<PiggyBank size={22} />}
                    label="年度金钱成本"
                    value={yuan(result.annualMoneyCost)}
                  />
                  <StatCard
                    accent="time"
                    icon={<Clock3 size={22} />}
                    label="年度时间成本"
                    value={yuan(result.annualTimeCost)}
                  />
                  <StatCard
                    accent="total"
                    icon={<BadgeDollarSign size={22} />}
                    label="年度总成本"
                    value={yuan(result.annualTotalCost)}
                  />
                  <StatCard
                    accent="profit"
                    icon={<TrendingUp size={22} />}
                    label="盈利可能"
                    value={result.profitLabel}
                  />
                </div>
              </div>

              <article className="comment-card reveal-step step-comment">
                <span>毒舌结果</span>
                <p>{result.comment}</p>
              </article>

              <RiskBill risks={result.riskProfile} />

              <article className="illusion-card reveal-step step-illusion">
                <span>朋友圈标题</span>
                <p>{result.adultIllusion}</p>
              </article>

              <article className="share-card reveal-step step-share" aria-label="可分享结果卡片">
                <div className="share-card-top">
                  <span>入坑 ROI 分享卡</span>
                  <strong>{result.grade}</strong>
                </div>
                <h3>{form.hobbyName || '未命名爱好'}</h3>
                <p className="share-title">你是：{result.taxpayerTitle}</p>
                <div className="share-score-row">
                  <div>
                    <span>爱好税单</span>
                    <strong>{result.grade} 级</strong>
                  </div>
                  <div>
                    <span>年度总成本</span>
                    <strong>{yuan(result.annualTotalCost)}</strong>
                  </div>
                </div>
              </article>

              <button className="copy-action reveal-step step-copy" type="button" onClick={copyShare}>
                <Copy size={18} />
                {copyStatus === 'done'
                  ? '已复制'
                  : copyStatus === 'failed'
                    ? '复制失败，请手动复制分享卡内容'
                    : '复制分享文案'}
              </button>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
