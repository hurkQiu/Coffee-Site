<script setup lang="ts">
interface ProcessingMethod {
  id: string
  name: string
  colorKey: 'washed' | 'natural' | 'honey' | 'anaerobic'
  difference: string
  flavorSummary: string
  steps: string
  detail: string
  effects: string[]
  flavorNotes: string[]
}

const methods: ProcessingMethod[] = [
  {
    id: 'washed',
    name: '水洗法',
    colorKey: 'washed',
    difference: '去除果皮果肉後，於發酵槽中分解殘餘果膠層，再以清水沖洗乾淨後乾燥',
    flavorSummary: '風味乾淨明亮，酸質清晰，能清楚呈現產區與品種特色',
    steps: '採收 → 去皮 → 發酵 12–48 小時 → 水洗去除黏質層 → 日曬或機械乾燥',
    detail:
      '水洗法是目前最普及、也最能穩定呈現產區風土特色的處理方式。咖啡果實採收後先以去皮機去除果皮果肉，留下帶有黏質層（果膠）的種子，再放入發酵槽中，利用微生物分解黏質層，之後以大量清水沖洗乾淨，最後進行乾燥。整個流程對水資源與設備要求較高，但也因為發酵與乾燥條件容易控制，瑕疵率較低、風味穩定度高。',
    effects: ['豆表乾淨、瑕疵較易掌控', '風味純淨，較能忠實呈現產地與品種特色', '對水資源與設備要求較高'],
    flavorNotes: ['明亮酸質', '花香調性', '莓果風味', '乾淨的甜感'],
  },
  {
    id: 'natural',
    name: '日曬法',
    colorKey: 'natural',
    difference: '採收後不去皮，整顆咖啡果實直接曝曬乾燥，果肉糖分持續滲入豆體',
    flavorSummary: '風味濃郁厚重，甜感突出，帶有明顯果乾、酒香調性',
    steps: '採收 → 整果曝曬 2–4 週（需定時翻動防止發黴）→ 去殼取出生豆',
    detail:
      '日曬法是最古老、也最仰賴氣候條件的處理方式。採收後的咖啡果實不經去皮，直接鋪在曬棚或水泥地上曝曬，過程中果肉的糖分與風味物質會持續滲透進入豆體，因此日曬豆的甜感與醇厚度通常較高。但由於乾燥時間長、果肉包覆豆體，發酵與發黴的風險也相對較高，需要密集翻動與嚴格的品質控管。',
    effects: ['醇厚度與甜感提高', '豆體顏色較不均勻', '發酵風險較高，需嚴格控管乾燥過程'],
    flavorNotes: ['熱帶水果調', '紅酒／酒香', '可可', '濃郁甜感'],
  },
  {
    id: 'honey',
    name: '蜜處理',
    colorKey: 'honey',
    difference: '去皮後保留部分或全部果膠層直接乾燥，依保留比例分為白蜜、黃蜜、紅蜜、黑蜜',
    flavorSummary: '風味介於水洗與日曬之間，兼具乾淨度與甜感',
    steps: '採收 → 去皮 → 保留果膠層 → 棚架日曬乾燥（需勤加翻動）',
    detail:
      '蜜處理法源自中美洲，去皮後不像水洗法將黏質層完全洗淨，而是保留部分或全部果膠直接進行日曬乾燥。依果膠保留比例與翻動頻率不同，可再細分為白蜜（保留最少、風味接近水洗）、黃蜜、紅蜜到黑蜜（保留最多、風味接近日曬）。乾燥時間比水洗法長，過程中需要更細心地翻動與監控，以避免發酵過度。',
    effects: ['甜感與發酵風味程度可依果膠保留量調控', '乾燥時間較水洗法長，管理難度較高', '風味介於水洗與日曬之間，變化多元'],
    flavorNotes: ['蜂蜜甜感', '焦糖調性', '柔和果酸', '圓潤口感'],
  },
  {
    id: 'anaerobic',
    name: '厭氧發酵',
    colorKey: 'anaerobic',
    difference: '將咖啡果實或去皮後的種子置於密閉容器中，在無氧環境下以特定溫度、時間進行發酵',
    flavorSummary: '風味變化強烈多元，常帶有特殊的發酵系風味',
    steps: '採收 →（去皮或保留果肉）→ 置入密閉容器 → 充入惰性氣體或自然厭氧發酵 24–100+ 小時 → 乾燥',
    detail:
      '厭氧發酵是近年來精品咖啡界的新興實驗性處理法，靈感來自釀酒與發酵食品工藝。咖啡果實或去皮後的種子會被放入密閉容器中，隔絕氧氣，並精準控制發酵溫度與時間，有些莊園還會充入惰性氣體或添加特定菌種來創造獨特風味。由於變因可高度人為控制，能創造出前所未有的風味組合，也常被用於製作競賽用豆，但發酵程度若拿捏不當，也容易產生雜味或過度發酵的問題。',
    effects: ['可創造出獨特且強烈的風味組合', '發酵程度需精準控制，否則易產生雜味', '常用於精品咖啡競賽豆與限量批次'],
    flavorNotes: ['酒香', '熱帶水果', '香料感', '強烈的發酵系風味'],
  },
]
</script>

<template>
  <div class="processing">
    <section class="processing-overview">
      <h2 class="processing-overview__title">處理法一覽</h2>
      <div class="processing-table-wrapper">
        <table class="processing-table">
          <thead>
            <tr>
              <th>處理法</th>
              <th>差異</th>
              <th>風味</th>
              <th>處理方式</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="method in methods" :key="method.id">
              <td>
                <span class="method-name" :class="`method-name--${method.colorKey}`">{{ method.name }}</span>
              </td>
              <td>{{ method.difference }}</td>
              <td>{{ method.flavorSummary }}</td>
              <td>{{ method.steps }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-for="method in methods" :key="`detail-${method.id}`" class="processing-detail">
      <h3 class="processing-detail__title">
        <span class="method-name" :class="`method-name--${method.colorKey}`">{{ method.name }}</span>
      </h3>
      <p class="processing-detail__text">{{ method.detail }}</p>

      <div class="processing-detail__tags">
        <div class="tag-group">
          <span class="tag-group__label">造成的效果</span>
          <ul class="tag-list">
            <li v-for="effect in method.effects" :key="effect" class="tag tag--effect">{{ effect }}</li>
          </ul>
        </div>
        <div class="tag-group">
          <span class="tag-group__label">產生的風味</span>
          <ul class="tag-list">
            <li v-for="note in method.flavorNotes" :key="note" class="tag tag--flavor">{{ note }}</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.processing {
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
}

.processing-overview__title,
.processing-detail__title {
  margin-bottom: 12px;
  font-size: 1.3rem;
  color: var(--color-heading);
}

.processing-table-wrapper {
  overflow-x: auto;
}

.processing-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 640px;
}

.processing-table th,
.processing-table td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
  vertical-align: top;
}

.processing-table th {
  color: var(--color-heading);
  font-weight: bold;
  border-bottom: 2px solid var(--color-border);
}

.method-name {
  font-weight: bold;
  white-space: nowrap;
}

.method-name--washed {
  color: #2f7dc0;
}

.method-name--natural {
  color: #c07a2f;
}

.method-name--honey {
  color: #b8860b;
}

.method-name--anaerobic {
  color: #8a4fbf;
}

.processing-detail__text {
  margin-bottom: 16px;
  color: var(--color-text);
  line-height: 1.7;
}

.processing-detail__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.tag-group {
  min-width: 220px;
}

.tag-group__label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  font-weight: bold;
  color: var(--color-heading);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.tag {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.85rem;
}

.tag--effect {
  background: var(--color-background-mute);
  color: var(--color-text);
}

.tag--flavor {
  background: hsla(160, 100%, 37%, 0.15);
  color: hsla(160, 100%, 27%, 1);
}
</style>
