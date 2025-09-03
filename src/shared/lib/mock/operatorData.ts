import type { Operator, OperatorGroup } from 'shared/types';

// Mock operator data with extended properties using all actual operator images
const mockOperators: Operator[] = [
  {
    id: '1',
    name: 'Shaxnoza Rixsiyeva',
    avatar: '/operatorImg/Rixsiyeva Shaxnoza Ravshan qizi (248).jpg',
    rank: 1,
    points: 1204,
    count: 104,
    kpi: 89.5,
    average: '01:45', // 1 minute 45 seconds average response time
    monthlyRankings: [1, 2, 1, 1, 3, 1, 1, 2, 1, 1, 1, 2], // 12 months
    topMedalCount: 10, // Top 3 appearances in 12 months
    rankChange: 1,
  },
  {
    id: '2',
    name: 'Xusnora Ruziyeva',
    avatar: '/operatorImg/Ruziyeva Xusnora Sodiqjon qizi (247).png',
    rank: 2,
    points: 1104,
    count: 102,
    kpi: 89.5,
    average: '02:12', // 2 minutes 12 seconds average response time
    monthlyRankings: [3, 1, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1],
    topMedalCount: 12, // Perfect top 3 record
    rankChange: 0, // No change indicator test
  },
  {
    id: '3',
    name: 'Izzatbek Sattarov',
    avatar: '/operatorImg/Sattarov Izzatbek Fikrat o\'g\'li (312).jpg',
    rank: 3,
    points: 1004,
    count: 103,
    kpi: 88.5,
    average: '02:34', // 2 minutes 34 seconds average response time
    monthlyRankings: [2, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3],
    topMedalCount: 8,
    rankChange: -1,
  },
  {
    id: '4',
    name: 'Farxod Shermatov',
    avatar: '/operatorImg/Shermatov Farxod Raxmatilla o\'g\'li (0370).jpg',
    rank: 4,
    points: 703,
    count: 105,
    kpi: 88.5,
    average: '03:15', // 3 minutes 15 seconds average response time
    monthlyRankings: [4, 4, 4, 5, 4, 4, 5, 4, 4, 4, 5, 4],
    topMedalCount: 0,
    rankChange: -1,
  },
  {
    id: '5',
    name: 'Dilshod Shoraximov',
    avatar: '/operatorImg/Shoraximov Dilshod Atxam o\'g\'li (322).png',
    rank: 5,
    points: 922,
    count: 101,
    kpi: 87.5,
    average: '03:42', // 3 minutes 42 seconds average response time
    monthlyRankings: [5, 5, 5, 4, 5, 5, 4, 5, 5, 5, 4, 5],
    topMedalCount: 0,
    rankChange: 0, // No change test
  },
  {
    id: '6',
    name: 'Abduxakim Sobirov',
    avatar: '/operatorImg/Sobirov Abduxakim Qobil o\'g\'li (0116).png',
    rank: 6,
    points: 540,
    count: 106,
    kpi: 87.5,
    average: '04:18', // 4 minutes 18 seconds average response time
    monthlyRankings: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    topMedalCount: 0,
    rankChange: -1,
  },
  {
    id: '7',
    name: 'Fazliddin Sodiqov',
    avatar: '/operatorImg/Sodiqov Fazliddin Ravshan o\'g\'li (0270).jpg',
    rank: 7,
    points: 154,
    count: 104,
    kpi: 87.5,
    average: '04:56', // 4 minutes 56 seconds average response time
    monthlyRankings: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
    topMedalCount: 0,
    rankChange: 1,
  },
  {
    id: '8',
    name: 'Tohirjon Sodiqov',
    avatar: '/operatorImg/Sodiqov Tohirjon Ilxom o\'g\'li (0529).jpg',
    rank: 8,
    points: 647,
    count: 106,
    kpi: 87.5,
    average: '05:23', // 5 minutes 23 seconds average response time
    monthlyRankings: [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
    topMedalCount: 0,
    rankChange: 1,
  },
  {
    id: '9',
    name: 'Gulnora Mirzayeva',
    avatar: '/operatorImg/Rixsiyeva Shaxnoza Ravshan qizi (248).jpg', // Reusing image
    rank: 9,
    points: 325,
    count: 98,
    kpi: 86.0,
    average: '06:12', // 6 minutes 12 seconds average response time
    monthlyRankings: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    topMedalCount: 0,
    rankChange: 0,
  },
  {
    id: '10',
    name: 'Jasurbek Karimov',
    avatar: '/operatorImg/Sattarov Izzatbek Fikrat o\'g\'li (312).jpg', // Reusing image
    rank: 10,
    points: 298,
    count: 95,
    kpi: 85.5,
    average: '06:45', // 6 minutes 45 seconds average response time
    monthlyRankings: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    topMedalCount: 0,
    rankChange: -1,
  },
];

// Generate mock groups - Back to 6 groups
export const mockOperatorGroups: OperatorGroup[] = Array.from({ length: 6 }, (_, index) => ({
  id: `1009-${index}`,
  title: '1009',
  operators: mockOperators,
}));
