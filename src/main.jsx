import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity,
  BadgeDollarSign,
  Brain,
  Calculator,
  Clock3,
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

const initialForm = {
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
];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function numberValue(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
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
    S: '闭眼冲，钱包和灵魂都还算体面。',
    A: '很值得，属于成年人少见的清醒消费。',
    B: '可以玩，但别把它包装成人生战略。',
    C: '快乐是有的，价格也是真的不客气。',
    D: '它不像爱好，更像一个会定期扣费的情绪陷阱。',
  };
  return copy[grade];
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
    return `${name}的 ROI 是 ${grade} 级，${costTone}。${feedbackTone}，盈利可能为${profitLabel}，再加上综合价值撑得住场面。总体看，这不是冲动消费，是你给生活买的一张精神健身卡。`;
  }

  if (score >= 58) {
    return `${name}拿到 ${grade} 级，属于“可以认真玩，但别上头”的区间。${costTone}，${timeTone}。如果你能稳定获得情绪或社交回报，它就值得；如果只是买装备时最开心，那就要警惕了。`;
  }

  return `${name}目前只有 ${grade} 级，性价比有点倔强。${costTone}，而且${feedbackTone}。建议先低配试水，别一上来就把银行卡献祭给热爱，热爱也会尴尬。`;
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

function calculate(form) {
  const entryCost = numberValue(form.entryCost);
  const monthlyCost = numberValue(form.monthlyCost);
  const weeklyHours = numberValue(form.weeklyHours);
  const hourlyWage = numberValue(form.monthlySalary) / 176;
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

function App() {
  const [form, setForm] = useState(initialForm);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [calculationVersion, setCalculationVersion] = useState(0);
  const result = useMemo(() => calculate(form), [form]);

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setHasCalculated(false);
  };

  const meterStyle = {
    background: `conic-gradient(var(--good) ${result.score * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
  };

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">
            <Sparkles size={16} />
            本地前端 MVP
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
              <h2>你的爱好账本</h2>
            </div>
            <Calculator size={26} />
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
                      monthlySalary: current.monthlySalary,
                    }));
                    setHasCalculated(false);
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-grid">
            <Field label="爱好名称">
              <input value={form.hobbyName} onChange={(event) => update('hobbyName', event.target.value)} />
            </Field>
            <Field label="入门一次性投入金额">
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
            <Field label="每周投入小时数">
              <input
                min="0"
                type="number"
                value={form.weeklyHours}
                onChange={(event) => update('weeklyHours', event.target.value)}
              />
            </Field>
            <Field label="月薪">
              <input
                min="0"
                type="number"
                value={form.monthlySalary}
                onChange={(event) => update('monthlySalary', event.target.value)}
              />
              <small>按每月 176 小时自动折算时薪</small>
            </Field>
            <Field label="预计多久能获得正反馈">
              <input
                min="1"
                type="number"
                value={form.feedbackHours}
                onChange={(event) => update('feedbackHours', event.target.value)}
              />
              <small>单位：小时</small>
            </Field>
          </div>

          <div className="segmented">
            <span>是否有盈利可能</span>
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

          <button className="primary-action" type="submit">
            <Calculator size={20} />
            计算 ROI
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
                <span>AI 风格点评</span>
                <p>{result.comment}</p>
              </article>

              <article className="illusion-card reveal-step step-illusion">
                <span>成年人幻觉点评</span>
                <p>{result.adultIllusion}</p>
              </article>

              <article className="share-card reveal-step step-share" aria-label="可分享结果卡片">
                <div className="share-card-top">
                  <span>入坑 ROI 分享卡</span>
                  <strong>{result.grade}</strong>
                </div>
                <h3>{form.hobbyName || '未命名爱好'}</h3>
                <div className="share-score-row">
                  <div>
                    <span>ROI 分数</span>
                    <strong>{result.score}</strong>
                  </div>
                  <div>
                    <span>年度总成本</span>
                    <strong>{yuan(result.annualTotalCost)}</strong>
                  </div>
                </div>
              </article>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
