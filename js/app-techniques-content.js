function getMultiplicationLessonPlan(table = state.technique.selectedTable || TECHNIQUE_TABLE) {
  const safeTable = TABLE_FACTORS.includes(Number(table)) ? Number(table) : TECHNIQUE_TABLE;
  const plans = {
    1: {
      menuNote: "Learn why 1 keeps a number unchanged.",
      title: "Keep the number.",
      ruleCopy: "Multiplying by 1 means one group. The answer stays the same as the other factor.",
      examples: [
        { factor: 7, caption: "One group of 7 is 7." },
        { factor: 12, caption: "One group of 12 is 12." },
      ],
      switchCopy: "The fact can flip, but there is still only one group of the other number.",
      hint(question) {
        return `Multiplying by 1 keeps <strong>${escapeHtml(question.otherFactor)}</strong> unchanged.`;
      },
    },
    2: {
      menuNote: "Use doubles to build the 2x table.",
      title: "Double it.",
      ruleCopy: "Multiplying by 2 means doubling the other factor.",
      examples: [
        { factor: 6, caption: "Double 6 to get 12." },
        { factor: 9, caption: "Double 9 to get 18." },
      ],
      switchCopy: "Whether the 2 comes first or second, double the other factor.",
      hint(question) {
        return `Double <strong>${escapeHtml(question.otherFactor)}</strong>: ${escapeHtml(question.otherFactor)} + ${escapeHtml(question.otherFactor)}.`;
      },
    },
    3: {
      menuNote: "Build triples from doubles plus one more group.",
      title: "Double, then add one group.",
      ruleCopy: "For 3x facts, double the factor, then add one more copy of it.",
      examples: [
        { factor: 4, caption: "4 x 3 is 4 + 4 + 4." },
        { factor: 8, caption: "8 x 3 is double 8, then add 8." },
      ],
      switchCopy: "The order can flip, but 3 groups and groups of 3 still make the same total.",
      hint(question) {
        const doubled = question.otherFactor * 2;
        return `Double ${escapeHtml(question.otherFactor)} to get ${escapeHtml(doubled)}, then add ${escapeHtml(question.otherFactor)}.`;
      },
    },
    4: {
      menuNote: "Double the double for 4x facts.",
      title: "Double twice.",
      ruleCopy: "Multiplying by 4 is the same as doubling, then doubling again.",
      examples: [
        { factor: 5, caption: "Double 5 to 10, then double 10 to 20." },
        { factor: 7, caption: "Double 7 to 14, then double 14 to 28." },
      ],
      switchCopy: "If the fact flips, still double the other factor twice.",
      hint(question) {
        const first = question.otherFactor * 2;
        return `Double ${escapeHtml(question.otherFactor)} to ${escapeHtml(first)}, then double ${escapeHtml(first)}.`;
      },
    },
    5: {
      menuNote: "Use skip-counting and the clock pattern for 5x.",
      title: "Count by fives.",
      ruleCopy: "The 5x table moves in steps of 5. Answers end in 5 or 0.",
      examples: [
        { factor: 6, caption: "5, 10, 15, 20, 25, 30." },
        { factor: 9, caption: "Nine fives lands on 45." },
      ],
      switchCopy: "When the order flips, count groups of 5 or use half of 10x.",
      hint(question) {
        return `Use 10x, then halve it: ${escapeHtml(question.otherFactor)} x 10 = ${escapeHtml(question.otherFactor * 10)}.`;
      },
    },
    6: {
      menuNote: "Build 6x from 5x plus one more group.",
      title: "Use 5x, then add one group.",
      ruleCopy: "For 6x facts, use the nearby 5x fact, then add one more group.",
      examples: [
        { factor: 4, caption: "4 x 6 is 4 x 5 plus 4." },
        { factor: 8, caption: "8 x 6 is 8 x 5 plus 8." },
      ],
      switchCopy: "The fact can flip, but 6x stays close to the 5x anchor.",
      hint(question) {
        const anchor = question.otherFactor * 5;
        return `${escapeHtml(question.otherFactor)} x 5 = ${escapeHtml(anchor)}, then add ${escapeHtml(question.otherFactor)}.`;
      },
    },
    7: {
      menuNote: "Break 7x into 5x plus 2x.",
      title: "Use 5x plus 2x.",
      ruleCopy: "For 7x facts, split 7 into 5 + 2. Add the 5x fact and the double.",
      examples: [
        { factor: 6, caption: "6 x 7 is 6 x 5 plus 6 x 2." },
        { factor: 8, caption: "8 x 7 is 40 plus 16." },
      ],
      switchCopy: "When the order flips, keep the same split: 7 groups are 5 groups plus 2 groups.",
      hint(question) {
        return `${escapeHtml(question.otherFactor)} x 5 plus ${escapeHtml(question.otherFactor)} x 2.`;
      },
    },
    8: {
      menuNote: "Double three times or use 10x minus 2x.",
      title: "Double, double, double.",
      ruleCopy: "Multiplying by 8 means doubling three times because 8 is 2 x 2 x 2.",
      examples: [
        { factor: 3, caption: "3 -> 6 -> 12 -> 24." },
        { factor: 7, caption: "7 -> 14 -> 28 -> 56." },
      ],
      switchCopy: "The order can flip. You can also use 10x minus 2x when that feels easier.",
      hint(question) {
        const first = question.otherFactor * 2;
        const second = first * 2;
        return `Double chain: ${escapeHtml(question.otherFactor)} -> ${escapeHtml(first)} -> ${escapeHtml(second)} -> ${escapeHtml(second * 2)}.`;
      },
    },
    9: {
      menuNote: "Use 10x minus one group for 9x.",
      title: "Almost 10x.",
      ruleCopy: "The 9x table is one group less than 10x.",
      examples: [
        { factor: 6, caption: "6 x 10 = 60, so 6 x 9 = 54." },
        { factor: 12, caption: "12 x 10 = 120, so 12 x 9 = 108." },
      ],
      switchCopy: "If the fact flips, still think 10 groups minus one group.",
      hint(question) {
        return `${escapeHtml(question.otherFactor)} x 10 = ${escapeHtml(question.otherFactor * 10)}, then subtract ${escapeHtml(question.otherFactor)}.`;
      },
    },
    10: {
      menuNote: "Learn the 10x place-value shortcut.",
      title: "Place the zero.",
      ruleCopy: "When multiplying a whole number by 10, place a zero next to the number.",
      examples: [
        { factor: 7, caption: "Keep the 7. Place the zero next to it." },
        { factor: 12, caption: "The 12 stays. The zero goes after it." },
      ],
      switchCopy: "It doesn't matter which way the fact is written. We can still use the same 10x shortcut.",
      hint(question) {
        return `Take <strong class="technique-factor">${escapeHtml(question.otherFactor)}</strong> and place a zero next to it.`;
      },
    },
    11: {
      menuNote: "Use the repeat pattern and nearby facts for 11x.",
      title: "Ten groups plus one group.",
      ruleCopy: "Multiplying by 11 means 10 groups plus one extra group.",
      examples: [
        { factor: 6, caption: "6 x 11 is 60 plus 6." },
        { factor: 12, caption: "12 x 11 is 120 plus 12." },
      ],
      switchCopy: "Small 11x facts often repeat digits, and every 11x fact can use 10x plus one group.",
      hint(question) {
        return `${escapeHtml(question.otherFactor)} x 10 = ${escapeHtml(question.otherFactor * 10)}, then add ${escapeHtml(question.otherFactor)}.`;
      },
    },
    12: {
      menuNote: "Use 10x plus 2x for 12x.",
      title: "Ten groups plus two groups.",
      ruleCopy: "Multiplying by 12 means 10 groups plus 2 more groups.",
      examples: [
        { factor: 6, caption: "6 x 12 is 60 plus 12." },
        { factor: 9, caption: "9 x 12 is 90 plus 18." },
      ],
      switchCopy: "When the fact flips, split 12 into 10 + 2 and combine the parts.",
      hint(question) {
        return `${escapeHtml(question.otherFactor)} x 10 plus double ${escapeHtml(question.otherFactor)}.`;
      },
    },
  };

  return {
    table: safeTable,
    kicker: `${safeTable}x Technique`,
    completeTitle: `Congratulations on learning how to multiply by ${safeTable}!`,
    completeCopy: "Choose where to build from here.",
    ...plans[safeTable],
  };
}

const ADDITION_COMPONENT_PRACTICE_COUNT = 5;
const ADDITION_FINAL_PRACTICE_COUNT = 10;

const ADDITION_LESSON_PLANS = {
  "make-10": {
    completeTitle: "Make 10 lesson complete.",
    completeCopy: "You can find partners to 10, use subtraction to find the missing partner, and judge sums around 10.",
    workout: { difficulties: ["easy"], regrouping: false },
    components: [
      {
        title: "Find the partner",
        copy: "Every number has a partner that makes 10. The faster you see the partner, the faster bigger addition gets.",
        examples: ["0 + 10 = 10", "1 + 9 = 10", "2 + 8 = 10", "3 + 7 = 10", "4 + 6 = 10", "5 + 5 = 10"],
        questionKind: "make10-partner",
      },
      {
        title: "Use 10 minus",
        copy: "If the partner is hiding, subtract from 10. The difference is the number you need.",
        examples: ["10 - 1 = 9", "10 - 3 = 7", "10 - 6 = 4", "10 - 8 = 2"],
        questionKind: "make10-difference",
      },
      {
        title: "Feel around 10",
        copy: "A pair can land below 10, exactly on 10, or above 10. This sense helps you choose a strategy quickly.",
        examples: ["2 + 6 is below 10", "4 + 6 is exactly 10", "8 + 5 is above 10"],
        questionKind: "make10-compare",
      },
    ],
    final: {
      copy: "Mix the partner, difference, and around-10 moves.",
      questionKinds: ["make10-partner", "make10-difference", "make10-compare", "make10-sum"],
    },
  },
  "adding-by-1s": {
    completeTitle: "Adding by 1s lesson complete.",
    completeCopy: "You can add small ones-place jumps and notice when the ones place rolls into a new ten.",
    workout: { difficulties: ["medium"], regrouping: true },
    components: [
      {
        title: "One more",
        copy: "Adding 1 moves to the next number. Most of the number stays the same.",
        examples: ["34 + 1 = 35", "208 + 1 = 209", "679 + 1 = 680"],
        questionKind: "ones-one-more",
      },
      {
        title: "Add a few ones",
        copy: "For +2 through +9, keep the larger number in your head and move the ones forward.",
        examples: ["42 + 3 = 45", "156 + 4 = 160", "281 + 7 = 288"],
        questionKind: "ones-few",
      },
      {
        title: "Cross the next ten",
        copy: "When the ones pass 9, they reset and the tens place grows by 1.",
        examples: ["38 + 4 = 42", "297 + 6 = 303", "685 + 8 = 693"],
        questionKind: "ones-cross-ten",
      },
    ],
    final: {
      copy: "Mix one-more, small jumps, and cross-ten facts.",
      questionKinds: ["ones-one-more", "ones-few", "ones-cross-ten"],
    },
  },
  "adding-by-10s": {
    completeTitle: "Adding by 10s lesson complete.",
    completeCopy: "You can add one or more tens and handle facts that cross into the next hundred.",
    workout: { difficulties: ["medium"], regrouping: true },
    components: [
      {
        title: "One more ten",
        copy: "Adding 10 usually changes the tens place and leaves the ones place alone.",
        examples: ["24 + 10 = 34", "68 + 10 = 78", "305 + 10 = 315"],
        questionKind: "tens-one",
      },
      {
        title: "Several tens",
        copy: "For +20, +30, and larger tens, count by tens while the ones stay anchored.",
        examples: ["41 + 20 = 61", "76 + 30 = 106", "218 + 50 = 268"],
        questionKind: "tens-many",
      },
      {
        title: "Cross a hundred",
        copy: "If the tens pass 90, the hundreds place grows and the tens wrap around.",
        examples: ["86 + 20 = 106", "275 + 40 = 315", "491 + 30 = 521"],
        questionKind: "tens-cross-hundred",
      },
    ],
    final: {
      copy: "Mix +10, larger tens, and cross-hundred facts.",
      questionKinds: ["tens-one", "tens-many", "tens-cross-hundred"],
    },
  },
  "adding-by-100s": {
    completeTitle: "Adding by 100s lesson complete.",
    completeCopy: "You can add hundreds while keeping tens and ones steady, then cross into new thousands.",
    workout: { difficulties: ["hard"], regrouping: true },
    components: [
      {
        title: "One more hundred",
        copy: "Adding 100 usually changes the hundreds place. The tens and ones stay steady.",
        examples: ["245 + 100 = 345", "708 + 100 = 808", "934 + 100 = 1034"],
        questionKind: "hundreds-one",
      },
      {
        title: "Several hundreds",
        copy: "For +200, +300, and larger hundreds, count the hundreds up by that amount.",
        examples: ["361 + 200 = 561", "428 + 500 = 928", "1275 + 300 = 1575"],
        questionKind: "hundreds-many",
      },
      {
        title: "Cross a thousand",
        copy: "When the hundreds pass 900, the thousands place grows and the hundreds continue from there.",
        examples: ["860 + 300 = 1160", "975 + 200 = 1175", "1840 + 500 = 2340"],
        questionKind: "hundreds-cross-thousand",
      },
    ],
    final: {
      copy: "Mix one-hundred, several-hundred, and cross-thousand facts.",
      questionKinds: ["hundreds-one", "hundreds-many", "hundreds-cross-thousand"],
    },
  },
  "adding-by-1000s": {
    completeTitle: "Adding by 1000s lesson complete.",
    completeCopy: "You can add thousands while keeping the lower places organized.",
    workout: { difficulties: ["hard"], regrouping: true },
    components: [
      {
        title: "One more thousand",
        copy: "Adding 1000 changes the thousands place. The last three digits usually stay the same.",
        examples: ["2345 + 1000 = 3345", "8092 + 1000 = 9092", "9760 + 1000 = 10760"],
        questionKind: "thousands-one",
      },
      {
        title: "Several thousands",
        copy: "For +2000, +3000, and larger thousands, count the thousands up by that amount.",
        examples: ["4125 + 2000 = 6125", "6830 + 4000 = 10830", "12350 + 5000 = 17350"],
        questionKind: "thousands-many",
      },
      {
        title: "Keep lower places steady",
        copy: "The hundreds, tens, and ones still matter. Say the full number after the thousands change.",
        examples: ["7098 + 3000 = 10098", "15875 + 6000 = 21875", "24960 + 8000 = 32960"],
        questionKind: "thousands-large",
      },
    ],
    final: {
      copy: "Mix +1000, larger thousands, and full-number reading.",
      questionKinds: ["thousands-one", "thousands-many", "thousands-large"],
    },
  },
  "counting-on-easy": {
    completeTitle: "Counting On (Easy) lesson complete.",
    completeCopy: "You can start from the larger addend, count on the smaller addend, and switch the fact when it helps.",
    workout: { difficulties: ["easy"], regrouping: true },
    components: [
      {
        title: "Start with the bigger number",
        copy: "Counting on is faster when the larger addend is your starting point.",
        examples: ["7 + 2: start at 7", "8 + 3: start at 8", "6 + 1: start at 6"],
        questionKind: "count-easy-start",
      },
      {
        title: "Count the small addend",
        copy: "Move forward one step for each part of the smaller addend.",
        examples: ["7 + 2: 8, 9", "5 + 3: 6, 7, 8", "8 + 4: 9, 10, 11, 12"],
        questionKind: "count-easy-small",
      },
      {
        title: "Switch if it is easier",
        copy: "Addition can flip around. 2 + 8 is the same total as 8 + 2.",
        examples: ["2 + 8 = 8 + 2", "3 + 7 = 7 + 3", "1 + 9 = 9 + 1"],
        questionKind: "count-easy-switch",
      },
    ],
    final: {
      copy: "Mix single-digit facts where counting on is the fastest move.",
      questionKinds: ["count-easy-start", "count-easy-small", "count-easy-switch"],
    },
  },
  "counting-on-medium": {
    completeTitle: "Counting On (Medium) lesson complete.",
    completeCopy: "You can add a single digit to a two-digit number, bridge to the next ten when needed, and flip facts when useful.",
    workout: { difficulties: ["medium"], regrouping: true },
    components: [
      {
        title: "Add onto the two-digit number",
        copy: "Keep the two-digit number whole, then count on the single digit.",
        examples: ["24 + 3 = 27", "51 + 6 = 57", "82 + 4 = 86"],
        questionKind: "count-medium-direct",
      },
      {
        title: "Count through the next ten",
        copy: "When the jump crosses a ten, land on the ten first, then finish the leftovers.",
        examples: ["48 + 5 = 50 + 3", "67 + 6 = 70 + 3", "89 + 4 = 90 + 3"],
        questionKind: "count-medium-cross",
      },
      {
        title: "Flip to keep the bigger number first",
        copy: "If the single digit comes first, flip the fact so the two-digit number does the heavy lifting.",
        examples: ["6 + 43 = 43 + 6", "8 + 75 = 75 + 8", "4 + 92 = 92 + 4"],
        questionKind: "count-medium-switch",
      },
    ],
    final: {
      copy: "Mix two-digit plus single-digit counting-on facts.",
      questionKinds: ["count-medium-direct", "count-medium-cross", "count-medium-switch"],
    },
  },
  "bridging-10-easy": {
    completeTitle: "Bridging to 10 (Easy) lesson complete.",
    completeCopy: "You can find the gap to 10, split the addend, and finish the single-digit bridge.",
    workout: { difficulties: ["easy"], regrouping: true },
    components: [
      {
        title: "Find the gap to 10",
        copy: "Start with the first number and find how much it needs to reach 10.",
        examples: ["8 needs 2", "7 needs 3", "6 needs 4"],
        questionKind: "bridge-easy-gap",
      },
      {
        title: "Split the second number",
        copy: "Break the second addend into the gap plus what is left.",
        examples: ["8 + 5: split 5 into 2 + 3", "7 + 6: split 6 into 3 + 3", "9 + 4: split 4 into 1 + 3"],
        questionKind: "bridge-easy-split",
      },
      {
        title: "Make 10, then finish",
        copy: "Use the first piece to make 10. Add the leftover piece after that.",
        examples: ["8 + 5 = 10 + 3 = 13", "7 + 6 = 10 + 3 = 13", "9 + 4 = 10 + 3 = 13"],
        questionKind: "bridge-easy-complete",
      },
    ],
    final: {
      copy: "Mix single-digit bridge-to-10 facts.",
      questionKinds: ["bridge-easy-gap", "bridge-easy-split", "bridge-easy-complete"],
    },
  },
  "bridging-10-medium": {
    completeTitle: "Bridging to 10 (Medium) lesson complete.",
    completeCopy: "You can bridge a two-digit number to the next ten, split a single digit, and finish the leftover.",
    workout: { difficulties: ["medium"], regrouping: true },
    components: [
      {
        title: "Find the next ten",
        copy: "Find how far the two-digit number is from the next clean ten.",
        examples: ["47 needs 3 to reach 50", "68 needs 2 to reach 70", "84 needs 6 to reach 90"],
        questionKind: "bridge-medium-gap",
      },
      {
        title: "Split the single digit",
        copy: "Split the addend into the bridge piece and the leftover piece.",
        examples: ["47 + 8: split 8 into 3 + 5", "68 + 7: split 7 into 2 + 5", "84 + 9: split 9 into 6 + 3"],
        questionKind: "bridge-medium-split",
      },
      {
        title: "Bridge, then add leftovers",
        copy: "Land on the next ten first. Then add what remains.",
        examples: ["47 + 8 = 50 + 5 = 55", "68 + 7 = 70 + 5 = 75", "84 + 9 = 90 + 3 = 93"],
        questionKind: "bridge-medium-complete",
      },
    ],
    final: {
      copy: "Mix two-digit plus single-digit bridge facts.",
      questionKinds: ["bridge-medium-gap", "bridge-medium-split", "bridge-medium-complete"],
    },
  },
  "bridging-advanced": {
    completeTitle: "Bridging Advanced lesson complete.",
    completeCopy: "You can bridge double-digit facts to a useful ten or hundred and carry the leftover through.",
    workout: { difficulties: ["hard"], regrouping: true },
    components: [
      {
        title: "Choose the next anchor",
        copy: "The anchor is the next clean ten or hundred that makes the sum easier.",
        examples: ["78 can bridge to 80", "187 can bridge to 200", "346 can bridge to 350"],
        questionKind: "bridge-advanced-anchor",
      },
      {
        title: "Split a double-digit addend",
        copy: "Use the first piece to reach the anchor. Keep the rest as the leftover.",
        examples: ["78 + 45: split 45 into 2 + 43", "187 + 38: split 38 into 13 + 25", "346 + 77: split 77 into 4 + 73"],
        questionKind: "bridge-advanced-split",
      },
      {
        title: "Add the leftover",
        copy: "Once you reach the anchor, the remaining piece is usually easier to add.",
        examples: ["78 + 45 = 80 + 43 = 123", "187 + 38 = 200 + 25 = 225", "346 + 77 = 350 + 73 = 423"],
        questionKind: "bridge-advanced-leftover",
      },
      {
        title: "Pick the smoother route",
        copy: "Sometimes switching addends creates a smaller bridge. Choose the route with the cleaner anchor.",
        examples: ["68 + 29 can bridge 68 to 70", "96 + 37 can bridge 96 to 100", "145 + 58 can bridge 145 to 150"],
        questionKind: "bridge-advanced-choice",
      },
    ],
    final: {
      copy: "Mix double-digit bridging, anchor choices, splits, and full sums.",
      questionKinds: ["bridge-advanced-anchor", "bridge-advanced-split", "bridge-advanced-leftover", "bridge-advanced-choice"],
    },
  },
  "bridging-expert": {
    completeTitle: "Bridging Expert lesson complete.",
    completeCopy: "You can bridge three-digit facts through hundreds and thousands with controlled splits.",
    workout: { difficulties: ["hard"], regrouping: true },
    components: [
      {
        title: "Find the next hundred",
        copy: "For large facts, a clean hundred is often the strongest anchor.",
        examples: ["368 needs 32 to reach 400", "785 needs 15 to reach 800", "946 needs 54 to reach 1000"],
        questionKind: "bridge-expert-anchor",
      },
      {
        title: "Split a large addend",
        copy: "Separate the bridge piece from the rest of the addend.",
        examples: ["368 + 79: split 79 into 32 + 47", "785 + 68: split 68 into 15 + 53", "946 + 87: split 87 into 54 + 33"],
        questionKind: "bridge-expert-split",
      },
      {
        title: "Carry through the anchor",
        copy: "After the bridge, finish from the clean hundred or thousand.",
        examples: ["368 + 79 = 400 + 47 = 447", "785 + 68 = 800 + 53 = 853", "946 + 87 = 1000 + 33 = 1033"],
        questionKind: "bridge-expert-cross",
      },
      {
        title: "Choose when to bridge",
        copy: "A bridge is strongest when the gap is small enough to split cleanly.",
        examples: ["594 + 36 bridges to 600", "728 + 95 bridges to 800", "879 + 48 bridges to 900"],
        questionKind: "bridge-expert-choice",
      },
    ],
    final: {
      copy: "Mix three-digit anchors, large splits, carry-through facts, and route choices.",
      questionKinds: ["bridge-expert-anchor", "bridge-expert-split", "bridge-expert-cross", "bridge-expert-choice"],
    },
  },
};
