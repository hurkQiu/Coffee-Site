<script setup lang="ts">
type Tier = 'top' | 'mid' | 'low'

interface GradeLevel {
  grade: string
  standard: string
  flavor: string
  tier: Tier
}

interface GradingSystem {
  id: string
  title: string
  description: string
  levels: GradeLevel[]
}

const gradingSystems: GradingSystem[] = [
  {
    id: 'ethiopia',
    title: '衣索比亞咖啡分級制度',
    description:
      '衣索比亞自 2012 年起採用以「每 300 公克生豆中的瑕疵豆數量」為主要依據的分級系統，水洗與日曬處理法各有不同的瑕疵容許標準，分為 Grade 1 至 Grade 5，其中 Grade 1、2 屬於精品咖啡等級。',
    levels: [
      { grade: 'Grade 1（G1）', standard: '瑕疵數 0–3 顆（水洗）／0–10 顆（日曬）', flavor: '精品等級中最高品質，風味乾淨、酸質明亮、花果香豐富', tier: 'top' },
      { grade: 'Grade 2（G2）', standard: '瑕疵數 4–12 顆（水洗）／11–25 顆（日曬）', flavor: '仍屬精品等級，品質優良，風味表現穩定', tier: 'top' },
      { grade: 'Grade 3（G3）', standard: '瑕疵數較多', flavor: '商業等級，風味平順但層次較少', tier: 'mid' },
      { grade: 'Grade 4（G4）', standard: '瑕疵數更多', flavor: '一般商業豆，風味較粗糙', tier: 'mid' },
      { grade: 'Grade 5（G5）', standard: '瑕疵數最多', flavor: '品質最低，多用於本地消費或即溶咖啡', tier: 'low' },
    ],
  },
  {
    id: 'kenya',
    title: '肯亞咖啡分級制度',
    description:
      '肯亞主要以「篩網目數（豆體大小）」作為分級依據，篩號越大代表豆粒越大，另外圓豆（Peaberry）獨立分級，是肯亞咖啡出口分級的一大特色。',
    levels: [
      { grade: 'AA', standard: '篩網 17–18 目，顆粒最大', flavor: '風味濃郁飽滿，帶明亮酸質與莓果調性', tier: 'top' },
      { grade: 'AB', standard: '篩網 15–16 目', flavor: '肯亞出口主力等級，酸甜均衡、風味扎實', tier: 'top' },
      { grade: 'PB（Peaberry）', standard: '圓豆，單一種子變異果實', flavor: '風味集中濃縮，甜感與香氣較突出', tier: 'top' },
      { grade: 'C', standard: '篩網 14 目以下', flavor: '顆粒較小，風味較平淡', tier: 'mid' },
      { grade: 'TT', standard: '以比重機篩選出的較輕 AA／AB 豆', flavor: '風味較薄，常作為次級品出售', tier: 'mid' },
      { grade: 'T／E', standard: '破碎豆、細小顆粒或過大黏合豆', flavor: '品質較低，多用於混豆或即溶咖啡', tier: 'low' },
    ],
  },
  {
    id: 'guatemala',
    title: '瓜地馬拉咖啡分級制度',
    description:
      '瓜地馬拉以「種植海拔高度」作為分級核心，海拔越高、日夜溫差越大，豆體密度也越高，因此又稱為硬豆分級制度（Hard Bean System）。',
    levels: [
      { grade: 'SHB（Strictly Hard Bean）', standard: '海拔 1,350 公尺以上', flavor: '豆體密度最高，酸質明亮、風味層次豐富', tier: 'top' },
      { grade: 'HB（Hard Bean）', standard: '海拔 1,200–1,350 公尺', flavor: '風味紮實，甜感與酸質表現均衡', tier: 'mid' },
      { grade: 'SH（Semi Hard Bean）', standard: '海拔 1,050–1,200 公尺', flavor: '風味中規中矩，層次略少', tier: 'mid' },
      { grade: 'EPW／PW', standard: '海拔 1,050 公尺以下', flavor: '風味較平淡，多作商業用豆', tier: 'low' },
    ],
  },
  {
    id: 'colombia',
    title: '哥倫比亞咖啡分級制度',
    description:
      '哥倫比亞同樣以「篩網目數」作為主要分級依據，豆體越大通常代表越成熟、密度越高。',
    levels: [
      { grade: 'Supremo', standard: '篩網 17 目以上', flavor: '顆粒飽滿，風味濃郁、酸甜平衡', tier: 'top' },
      { grade: 'Excelso', standard: '篩網 14–16 目', flavor: '哥倫比亞出口主力，風味穩定順口', tier: 'mid' },
      { grade: 'UGQ（Usual Good Quality）', standard: '篩網 14 目以下，等級混合', flavor: '風味較普通，多用於商業配方豆', tier: 'low' },
    ],
  },
]
</script>

<template>
  <div class="grading">
    <section v-for="system in gradingSystems" :key="system.id" class="grading-system">
      <h2 class="grading-system__title">{{ system.title }}</h2>
      <p class="grading-system__description">{{ system.description }}</p>

      <div class="grading-table-wrapper">
        <table class="grading-table">
          <thead>
            <tr>
              <th>等級</th>
              <th>分級標準</th>
              <th>風味特色</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="level in system.levels" :key="level.grade">
              <td>
                <span class="grade-badge" :class="`grade-badge--${level.tier}`">{{ level.grade }}</span>
              </td>
              <td>{{ level.standard }}</td>
              <td>{{ level.flavor }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style scoped>
.grading {
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
}

.grading-system__title {
  margin-bottom: 8px;
  font-size: 1.3rem;
  color: var(--color-heading);
}

.grading-system__description {
  margin-bottom: 16px;
  color: var(--color-text);
  line-height: 1.7;
}

.grading-table-wrapper {
  overflow-x: auto;
}

.grading-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 480px;
}

.grading-table th,
.grading-table td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
  vertical-align: top;
}

.grading-table th {
  color: var(--color-heading);
  font-weight: bold;
  border-bottom: 2px solid var(--color-border);
}

.grade-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  font-weight: bold;
  white-space: nowrap;
}

.grade-badge--top {
  color: hsla(160, 100%, 27%, 1);
  background: hsla(160, 100%, 37%, 0.15);
}

.grade-badge--mid {
  color: #b8860b;
  background: rgba(184, 134, 11, 0.15);
}

.grade-badge--low {
  color: #b04a4a;
  background: rgba(176, 74, 74, 0.15);
}
</style>
